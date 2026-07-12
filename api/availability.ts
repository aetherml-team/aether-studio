import type { VercelRequest, VercelResponse } from "@vercel/node";

// TidyCal helpers are inlined (not imported from a shared module) on purpose:
// Vercel drops underscore-prefixed files like `api/_tidycal.ts` from the
// deployed function bundle, so importing them crashes at load with
// FUNCTION_INVOCATION_FAILED. Kept identical in api/book.ts.
const TIDYCAL_API_BASE = "https://tidycal.com/api";

function tidycalConfig(): { token: string; bookingTypeId: string } | null {
  const token = process.env.TIDYCAL_TOKEN?.trim();
  const bookingTypeId = process.env.TIDYCAL_BOOKING_TYPE_ID?.trim();
  if (!token || !bookingTypeId) return null;
  return { token, bookingTypeId };
}

type TidyCalResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

async function tidycalFetch<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<TidyCalResult<T>> {
  const url = path.startsWith("http") ? path : `${TIDYCAL_API_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (err) {
    console.error("TidyCal request failed:", err);
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
    const message = tidycalMessage(json) || `Scheduling service error (${res.status})`;
    console.error(`TidyCal ${res.status} for ${url}:`, text.slice(0, 500));
    return { ok: false, status: res.status, message };
  }

  return { ok: true, data: (json as T) ?? ({} as T) };
}

/** Best human-readable message out of TidyCal's JSON error bodies. */
function tidycalMessage(json: unknown): string {
  if (!json || typeof json !== "object") return "";
  const o = json as Record<string, unknown>;
  if (typeof o.message === "string") return o.message;
  const errors = o.errors;
  if (errors && typeof errors === "object") {
    for (const value of Object.values(errors as Record<string, unknown>)) {
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
      if (typeof value === "string") return value;
    }
  }
  return "";
}

/**
 * Availability proxy for the native booking flow (src/components/BookCall.tsx).
 * Proxies TidyCal's GET /booking-types/{id}/timeslots for TIDYCAL_BOOKING_TYPE_ID,
 * keeping TIDYCAL_TOKEN server-side.
 *
 * We default to "now → +7 days" and clamp any caller-supplied ?start / ?end to
 * that window so the picker stays a manageable size.
 *
 * Response: { slots: string[] } — ISO start times, ascending, available only.
 */

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
// Pad a minute so a request landing on a slot boundary still validates.
const START_PAD_MS = 60 * 1000;

type Timeslot = { starts_at?: string; available_bookings?: number };

/** ISO 8601 UTC without milliseconds — format TidyCal query params expect. */
function isoUtc(ms: number): string {
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = tidycalConfig();
  if (!config) {
    console.error("TidyCal is not configured (TIDYCAL_TOKEN / TIDYCAL_BOOKING_TYPE_ID)");
    return res.status(500).json({ error: "Scheduling is not configured" });
  }

  const now = Date.now();
  const startParam = typeof req.query.start === "string" ? Date.parse(req.query.start) : NaN;
  const endParam = typeof req.query.end === "string" ? Date.parse(req.query.end) : NaN;

  const startMs =
    Number.isFinite(startParam) && startParam > now + START_PAD_MS
      ? startParam
      : now + START_PAD_MS;
  const maxEnd = startMs + SEVEN_DAYS_MS;
  const requestedEnd = Number.isFinite(endParam) ? Math.min(endParam, maxEnd) : maxEnd;
  const endMs = requestedEnd > startMs ? requestedEnd : maxEnd;

  const params = new URLSearchParams({
    starts_at: isoUtc(startMs),
    ends_at: isoUtc(endMs),
  });

  const result = await tidycalFetch<{ data?: Timeslot[] }>(
    `/booking-types/${encodeURIComponent(config.bookingTypeId)}/timeslots?${params.toString()}`,
    config.token
  );

  if (!result.ok) {
    const status = result.status >= 500 ? 502 : result.status;
    return res.status(status).json({ error: result.message });
  }

  const slots = (result.data.data ?? [])
    .filter(
      (s): s is Required<Pick<Timeslot, "starts_at">> & Timeslot =>
        typeof s.starts_at === "string" && (s.available_bookings ?? 1) > 0
    )
    .map((s) => s.starts_at);

  res.setHeader("Cache-Control", "private, max-age=15");
  return res.status(200).json({ slots });
}
