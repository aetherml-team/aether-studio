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

type CalendarAttendee = {
  email?: string;
  organizer?: boolean;
  responseStatus?: string;
};

type CalendarEvent = {
  id?: string;
  description?: string;
  summary?: string;
  location?: string;
  attendees?: CalendarAttendee[];
};

/** Comma-separated team inboxes invited to each booked call on Google Calendar. */
export function bookingTeamAttendees(): string[] {
  const raw =
    process.env.BOOKING_TEAM_ATTENDEES?.trim() ||
    process.env.BOOKING_CONFIRM_BCC?.trim() ||
    "marco@aetherml.com,jorge@aetherml.com,luis@aetherml.com";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes("@"));
}

function mergeAttendees(
  existing: CalendarAttendee[] | undefined,
  teamEmails: string[]
): { email: string }[] {
  const seen = new Set<string>();
  const merged: { email: string }[] = [];

  for (const a of existing ?? []) {
    const email = a.email?.trim();
    if (!email || a.organizer) continue;
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({ email });
  }

  for (const email of teamEmails) {
    if (seen.has(email)) continue;
    seen.add(email);
    merged.push({ email });
  }

  return merged;
}

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
  event: CalendarEvent,
  meetingUrl: string,
  teamEmails: string[]
): Promise<boolean> {
  if (!event.id) return false;

  const zoomLine = `Join Zoom: ${meetingUrl}`;
  const description = (event.description ?? "").includes(meetingUrl)
    ? event.description
    : [event.description?.trim(), zoomLine].filter(Boolean).join("\n\n");

  const attendees = mergeAttendees(event.attendees, teamEmails);
  const body: Record<string, unknown> = {
    location: meetingUrl,
    description,
    conferenceData: buildConferenceData(meetingUrl),
  };
  if (attendees.length > 0) body.attendees = attendees;

  const params = new URLSearchParams({
    conferenceDataVersion: "1",
    sendUpdates: "all",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(event.id)}?${params}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    console.error("Google Calendar patch error:", (await res.text()).slice(0, 500));
    return false;
  }
  return true;
}

/**
 * Find the TidyCal event in the booking window, add the Zoom URL, and invite
 * team attendees on Google Calendar. Retries briefly — TidyCal may sync async.
 */
export async function attachZoomToTidyCalCalendarEvent(d: {
  startMs: number;
  endMs: number;
  meetingUrl: string;
  teamEmails?: string[];
}): Promise<boolean> {
  if (!googleCalendarConfigured()) return false;

  const token = await getGoogleAccessToken();
  if (!token) return false;

  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  const teamEmails = d.teamEmails ?? bookingTeamAttendees();

  for (let attempt = 0; attempt < 8; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 3000));

    const events = await listEventsInWindow(token, calendarId, d.startMs, d.endMs);
    const tidycal = events.find(isTidyCalEvent);
    if (!tidycal?.id) continue;

    const ok = await patchEventLocation(token, calendarId, tidycal, d.meetingUrl, teamEmails);
    if (ok) {
      console.info(
        `Patched TidyCal Google Calendar event with Zoom link${teamEmails.length ? ` and ${teamEmails.length} team invite(s)` : ""}`
      );
      return true;
    }
  }

  console.warn("Could not find TidyCal calendar event to patch with Zoom link");
  return false;
}
