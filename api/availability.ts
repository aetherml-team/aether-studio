import type { VercelRequest, VercelResponse } from "@vercel/node";

// Calendly helpers are inlined (not imported from a shared module) on purpose:
// Vercel drops underscore-prefixed files like `api/_calendly.ts` from the
// deployed function bundle, so importing them crashes at load with
// FUNCTION_INVOCATION_FAILED. Kept identical in api/book.ts.
const CALENDLY_API_BASE = "https://api.calendly.com";

function calendlyConfig(): { token: string; eventType: string } | null {
  const token = process.env.CALENDLY_TOKEN?.trim();
  const eventType = process.env.CALENDLY_EVENT_TYPE?.trim();
  if (!token || !eventType) return null;
  return { token, eventType };
}

type CalendlyResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

async function calendlyFetch<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<CalendlyResult<T>> {
  const url = path.startsWith("http") ? path : `${CALENDLY_API_BASE}${path}`;
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
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const message = calendlyMessage(json) || `Scheduling service error (${res.status})`;
    console.error(`Calendly ${res.status} for ${url}:`, text.slice(0, 500));
    return { ok: false, status: res.status, message };
  }

  return { ok: true, data: (json as T) ?? ({} as T) };
}

/** Best human-readable message out of Calendly's { title, message, details[] }. */
function calendlyMessage(json: unknown): string {
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

/**
 * Availability proxy for the native booking flow (src/components/BookCall.tsx).
 * Proxies Calendly's GET /event_type_available_times for CALENDLY_EVENT_TYPE,
 * keeping CALENDLY_TOKEN server-side.
 *
 * Calendly constrains this endpoint: start_time must be strictly in the future
 * and the window may span at most 7 days. We default to "now → +7 days" and clamp
 * any caller-supplied ?start / ?end to those rules.
 *
 * Response: { slots: string[] } — ISO start times, ascending, available only.
 */

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
// Calendly rejects a start_time that isn't strictly in the future; pad a minute
// so a request landing on a slot boundary still validates.
const START_PAD_MS = 60 * 1000;

type Slot = { start_time?: string; status?: string };

/** ISO 8601 without milliseconds — the format Calendly's query params expect. */
function isoSeconds(ms: number): string {
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = calendlyConfig();
  if (!config) {
    console.error("Calendly is not configured (CALENDLY_TOKEN / CALENDLY_EVENT_TYPE)");
    return res.status(500).json({ error: "Scheduling is not configured" });
  }

  const now = Date.now();
  const startParam = typeof req.query.start === "string" ? Date.parse(req.query.start) : NaN;
  const endParam = typeof req.query.end === "string" ? Date.parse(req.query.end) : NaN;

  // Start at the caller's value if it's still in the future, else now (+pad).
  const startMs =
    Number.isFinite(startParam) && startParam > now + START_PAD_MS
      ? startParam
      : now + START_PAD_MS;
  // End at the caller's value, clamped to the 7-day ceiling Calendly enforces.
  const maxEnd = startMs + SEVEN_DAYS_MS;
  const requestedEnd = Number.isFinite(endParam) ? Math.min(endParam, maxEnd) : maxEnd;
  const endMs = requestedEnd > startMs ? requestedEnd : maxEnd;

  const params = new URLSearchParams({
    event_type: config.eventType,
    start_time: isoSeconds(startMs),
    end_time: isoSeconds(endMs),
  });

  const result = await calendlyFetch<{ collection?: Slot[] }>(
    `/event_type_available_times?${params.toString()}`,
    config.token
  );

  if (!result.ok) {
    // Upstream 5xx → 502 (our fault to the client); upstream 4xx passes through.
    const status = result.status >= 500 ? 502 : result.status;
    return res.status(status).json({ error: result.message });
  }

  const slots = (result.data.collection ?? [])
    .filter((s): s is Required<Slot> => s.status === "available" && typeof s.start_time === "string")
    .map((s) => s.start_time);

  // Short private cache: availability shifts as people book, but a few seconds of
  // reuse smooths repeat opens without surfacing stale slots.
  res.setHeader("Cache-Control", "private, max-age=15");
  return res.status(200).json({ slots });
}
