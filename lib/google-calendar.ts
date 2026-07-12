/**
 * Patches the TidyCal-synced Google Calendar event with the Zoom join URL so
 * Google Calendar shows the video link on the event card (not just in email).
 *
 * Optional env (one-time OAuth — see README in api/book.ts comment block):
 *   GOOGLE_CALENDAR_CLIENT_ID
 *   GOOGLE_CALENDAR_CLIENT_SECRET
 *   GOOGLE_CALENDAR_REFRESH_TOKEN
 *   GOOGLE_CALENDAR_ID — calendar to search (default: primary)
 */

type CalendarEvent = {
  id?: string;
  description?: string;
  summary?: string;
  location?: string;
};

let accessTokenCache: { token: string; expiresAt: number } | null = null;

export function googleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim() &&
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim()
  );
}

async function getGoogleAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) return null;

  if (accessTokenCache && accessTokenCache.expiresAt > Date.now() + 60_000) {
    return accessTokenCache.token;
  }

  let res: Response;
  try {
    res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
  } catch (err) {
    console.error("Google token request failed:", err);
    return null;
  }

  const text = await res.text();
  if (!res.ok) {
    console.error("Google token error:", text.slice(0, 500));
    return null;
  }

  try {
    const json = JSON.parse(text) as { access_token?: string; expires_in?: number };
    if (!json.access_token) return null;
    accessTokenCache = {
      token: json.access_token,
      expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
    };
    return accessTokenCache.token;
  } catch {
    console.error("Google token response was not JSON");
    return null;
  }
}

function isTidyCalEvent(event: CalendarEvent): boolean {
  const blob = `${event.description ?? ""} ${event.summary ?? ""}`.toLowerCase();
  return blob.includes("tidycal.com") || blob.includes("created by tidycal");
}

async function listEventsInWindow(
  token: string,
  calendarId: string,
  startMs: number,
  endMs: number
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: new Date(startMs - 10 * 60_000).toISOString(),
    timeMax: new Date(endMs + 10 * 60_000).toISOString(),
    singleEvents: "true",
    maxResults: "20",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const text = await res.text();
  if (!res.ok) {
    console.error("Google Calendar list error:", text.slice(0, 500));
    return [];
  }

  try {
    const json = JSON.parse(text) as { items?: CalendarEvent[] };
    return Array.isArray(json.items) ? json.items : [];
  } catch {
    return [];
  }
}

function zoomMeetingCode(meetingUrl: string): string | undefined {
  try {
    const match = meetingUrl.match(/\/j\/(\d+)/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

function buildConferenceData(meetingUrl: string) {
  const meetingCode = zoomMeetingCode(meetingUrl);
  return {
    conferenceSolution: {
      key: { type: "addOn" },
      name: "Zoom Meeting",
    },
    entryPoints: [
      {
        entryPointType: "video",
        uri: meetingUrl,
        label: meetingCode ? `zoom.us/j/${meetingCode}` : "Join Zoom Meeting",
        ...(meetingCode ? { meetingCode } : {}),
      },
    ],
  };
}

async function patchEventLocation(
  token: string,
  calendarId: string,
  eventId: string,
  meetingUrl: string,
  existingDescription?: string
): Promise<boolean> {
  const zoomLine = `Join Zoom: ${meetingUrl}`;
  const description = (existingDescription ?? "").includes(meetingUrl)
    ? existingDescription
    : [existingDescription?.trim(), zoomLine].filter(Boolean).join("\n\n");

  const params = new URLSearchParams({
    conferenceDataVersion: "1",
    sendUpdates: "all",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?${params}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: meetingUrl,
        description,
        conferenceData: buildConferenceData(meetingUrl),
      }),
    }
  );

  if (!res.ok) {
    console.error("Google Calendar patch error:", (await res.text()).slice(0, 500));
    return false;
  }
  return true;
}

/**
 * Find the TidyCal event in the booking window and add the Zoom URL to
 * location + description. Retries briefly — TidyCal may sync async.
 */
export async function attachZoomToTidyCalCalendarEvent(d: {
  startMs: number;
  endMs: number;
  meetingUrl: string;
}): Promise<boolean> {
  if (!googleCalendarConfigured()) return false;

  const token = await getGoogleAccessToken();
  if (!token) return false;

  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";

  for (let attempt = 0; attempt < 8; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 3000));

    const events = await listEventsInWindow(token, calendarId, d.startMs, d.endMs);
    const tidycal = events.find(isTidyCalEvent);
    if (!tidycal?.id) continue;

    const ok = await patchEventLocation(token, calendarId, tidycal.id, d.meetingUrl, tidycal.description);
    if (ok) {
      console.info("Patched TidyCal Google Calendar event with Zoom link");
      return true;
    }
  }

  console.warn("Could not find TidyCal calendar event to patch with Zoom link");
  return false;
}
