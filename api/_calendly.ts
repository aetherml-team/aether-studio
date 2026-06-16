/**
 * Shared Calendly Scheduling API helpers for the native booking flow
 * (api/availability.ts + api/book.ts). The personal access token lives only in
 * CALENDLY_TOKEN (a server-side env var) and never reaches the browser — both
 * endpoints proxy Calendly so the token stays here.
 *
 * The leading underscore keeps Vercel from treating this file as a routable
 * function (it's a helper module, imported by the real endpoints).
 *
 * Required env:
 *   CALENDLY_TOKEN       — Calendly personal access token. The Scheduling API
 *                          needs a paid plan and the scopes event_types:read +
 *                          scheduled_events:write.
 *   CALENDLY_EVENT_TYPE  — the event type URI, e.g.
 *                          https://api.calendly.com/event_types/<uuid>
 */

const API_BASE = "https://api.calendly.com";

export function calendlyConfig(): { token: string; eventType: string } | null {
  const token = process.env.CALENDLY_TOKEN?.trim();
  const eventType = process.env.CALENDLY_EVENT_TYPE?.trim();
  if (!token || !eventType) return null;
  return { token, eventType };
}

export type CalendlyResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

/**
 * Thin fetch wrapper that attaches the bearer token and normalises errors into a
 * tagged result, so callers branch on `ok` instead of try/catching. `path` may be
 * a relative path ("/invitees") or an absolute Calendly URL (the event type URI).
 */
export async function calendlyFetch<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<CalendlyResult<T>> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (err) {
    console.error("Calendly request failed:", err);
    return { ok: false, status: 502, message: "Could not reach the scheduling service" };
  }

  const text = await res.text();
  const json = text ? safeParse(text) : null;

  if (!res.ok) {
    // Calendly errors look like { title, message, details: [{ parameter, message }] }.
    const message = pickMessage(json) || `Scheduling service error (${res.status})`;
    console.error(`Calendly ${res.status} for ${url}:`, text.slice(0, 500));
    return { ok: false, status: res.status, message };
  }

  return { ok: true, data: (json as T) ?? ({} as T) };
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Best human-readable message out of Calendly's error envelope. */
function pickMessage(json: unknown): string {
  if (!json || typeof json !== "object") return "";
  const o = json as Record<string, unknown>;
  if (Array.isArray(o.details) && o.details.length) {
    const first = o.details[0] as Record<string, unknown>;
    if (typeof first?.message === "string") return first.message;
  }
  if (typeof o.message === "string") return o.message;
  if (typeof o.title === "string") return o.title;
  return "";
}
