/**
 * Zoom Server-to-Server OAuth fallback when TidyCal does not return meeting_url.
 *
 * Optional env (create a Server-to-Server OAuth app at https://marketplace.zoom.us):
 *   ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET
 *   ZOOM_HOST_EMAIL — optional; Zoom login email for the meeting host. If wrong or
 *                     omitted, falls back to GET /users/me (the account owner).
 */

type ZoomTokenCache = { token: string; expiresAt: number };

let tokenCache: ZoomTokenCache | null = null;
let resolvedHostCache: string | null = null;

export function zoomConfigured(): boolean {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID?.trim() &&
      process.env.ZOOM_CLIENT_ID?.trim() &&
      process.env.ZOOM_CLIENT_SECRET?.trim()
  );
}

async function getZoomAccessToken(): Promise<string | null> {
  const accountId = process.env.ZOOM_ACCOUNT_ID?.trim();
  const clientId = process.env.ZOOM_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOOM_CLIENT_SECRET?.trim();
  if (!accountId || !clientId || !clientSecret) return null;

  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "account_credentials",
    account_id: accountId,
  });

  let res: Response;
  try {
    res = await fetch("https://zoom.us/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
  } catch (err) {
    console.error("Zoom token request failed:", err);
    return null;
  }

  const text = await res.text();
  if (!res.ok) {
    console.error("Zoom token error:", text.slice(0, 500));
    return null;
  }

  let json: { access_token?: string; expires_in?: number };
  try {
    json = JSON.parse(text) as { access_token?: string; expires_in?: number };
  } catch {
    console.error("Zoom token response was not JSON");
    return null;
  }

  if (!json.access_token) return null;

  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return tokenCache.token;
}

/** Local wall-clock time in the booking timezone — format Zoom expects for scheduled meetings. */
function formatZoomStartTime(startMs: number, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date(startMs));

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

type ZoomUser = { id?: string; email?: string; type?: number };

/** Account owner / app context from GET /users/me (no list-users scope required). */
async function fetchZoomMe(token: string): Promise<ZoomUser | undefined> {
  let res: Response;
  try {
    res = await fetch("https://api.zoom.us/v2/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("Zoom users/me failed:", err);
    return undefined;
  }

  const text = await res.text();
  if (!res.ok) {
    console.error("Zoom users/me error:", text.slice(0, 500));
    return undefined;
  }

  try {
    return JSON.parse(text) as ZoomUser;
  } catch {
    console.error("Zoom users/me response was not JSON");
    return undefined;
  }
}

/** Prefer env host; on failure use the account user from GET /users/me. */
async function resolveZoomHostId(token: string): Promise<string | undefined> {
  if (resolvedHostCache) return resolvedHostCache;

  const me = await fetchZoomMe(token);
  const id = me?.id?.trim();
  if (!id) {
    console.error("Could not resolve Zoom host — add user:read:user:admin scope or set ZOOM_HOST_EMAIL");
    return undefined;
  }

  resolvedHostCache = id;
  console.info(`Using Zoom host ${me?.email ?? id}`);
  return id;
}

async function createMeetingForHost(
  token: string,
  hostId: string,
  startTime: string,
  d: { startMs: number; timezone: string; durationMinutes: number }
): Promise<string | undefined> {
  const res = await fetch(`https://api.zoom.us/v2/users/${encodeURIComponent(hostId)}/meetings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: "Call with Æther Studio",
      type: 2,
      start_time: startTime,
      duration: d.durationMinutes,
      timezone: d.timezone,
      settings: {
        join_before_host: true,
      },
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`Zoom create meeting error (host ${hostId}):`, text.slice(0, 500));
    return undefined;
  }

  try {
    const json = JSON.parse(text) as { join_url?: string };
    return typeof json.join_url === "string" && json.join_url.trim() ? json.join_url.trim() : undefined;
  } catch {
    console.error("Zoom meeting response was not JSON");
    return undefined;
  }
}

export async function createZoomMeeting(d: {
  startMs: number;
  timezone: string;
  durationMinutes: number;
}): Promise<string | undefined> {
  if (!zoomConfigured()) return undefined;

  const token = await getZoomAccessToken();
  if (!token) return undefined;

  const startTime = formatZoomStartTime(d.startMs, d.timezone);
  const envHost = process.env.ZOOM_HOST_EMAIL?.trim() || process.env.ZOOM_USER_ID?.trim();

  if (envHost) {
    const url = await createMeetingForHost(token, envHost, startTime, d);
    if (url) return url;

    // Env email may be wrong (e.g. company email ≠ Zoom login). Fall back to account users.
    console.warn(
      `ZOOM_HOST_EMAIL "${envHost}" is not a Zoom user on this account — trying account users`
    );
  }

  const discoveredHost = await resolveZoomHostId(token);
  if (!discoveredHost || discoveredHost === envHost) return undefined;

  return createMeetingForHost(token, discoveredHost, startTime, d);
}
