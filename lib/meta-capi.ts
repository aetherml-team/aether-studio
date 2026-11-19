/**
 * Meta Conversions API: the server half of the pixel's Lead and Schedule events.
 *
 * Env (Vercel): META_PIXEL_ID, META_CAPI_TOKEN (Events Manager → the dataset → Settings →
 * Conversions API → access token). Optional META_CAPI_TEST_CODE routes `?test=1` submits to the
 * Test Events tab. Without the id and token nothing is sent. Never throws.
 */
import { createHash } from "node:crypto";

const GRAPH = "https://graph.facebook.com/v21.0";
const TIMEOUT_MS = 4000;

const sha = (value: string) => createHash("sha256").update(value).digest("hex");

export interface CapiEvent {
  name: "Lead" | "Schedule";
  eventId: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fbc?: string;
  fbp?: string;
  ip?: string;
  userAgent?: string;
  url: string;
  test: boolean;
}

/** The request body Meta expects, with every personal value hashed. */
export function capiBody(e: CapiEvent, testCode?: string, now = Date.now()): Record<string, unknown> {
  const user: Record<string, unknown> = { em: [sha(e.email.trim().toLowerCase())] };
  if (e.phone) user.ph = [sha(e.phone.replace(/\D/g, ""))];
  if (e.firstName) user.fn = [sha(e.firstName.trim().toLowerCase())];
  if (e.lastName) user.ln = [sha(e.lastName.trim().toLowerCase())];
  if (e.fbc) user.fbc = e.fbc;
  if (e.fbp) user.fbp = e.fbp;
  if (e.ip) user.client_ip_address = e.ip;
  if (e.userAgent) user.client_user_agent = e.userAgent;
  const body: Record<string, unknown> = {
    data: [
      {
        event_name: e.name,
        event_time: Math.floor(now / 1000),
        event_id: e.eventId,
        action_source: "website",
        event_source_url: e.url,
        user_data: user,
      },
    ],
  };
  if (e.test && testCode) body.test_event_code = testCode;
  return body;
}

/** A browser event id: what newEventId() makes, nothing longer. */
export function parseEventId(raw: unknown): string {
  return typeof raw === "string" && /^[A-Za-z0-9-]{8,64}$/.test(raw) ? raw : "";
}

/** Meta's fbp cookie shape: fb.1.<ms>.<random>. */
export function parseFbp(raw: unknown): string {
  return typeof raw === "string" && /^fb\.\d\.\d{10,16}\.\d{1,24}$/.test(raw) ? raw : "";
}

/** The visitor's IP, browser and page, from the request headers Vercel passes on. */
export function requestFacts(headers: Record<string, string | string[] | undefined>): {
  ip?: string;
  userAgent?: string;
  url: string;
} {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const ip = one(headers["x-forwarded-for"]).split(",")[0].trim();
  const userAgent = one(headers["user-agent"]).slice(0, 400);
  const referer = one(headers["referer"]);
  const url = /^https:\/\/(www\.)?aetherml\.com\//.test(referer) ? referer.slice(0, 500) : "https://www.aetherml.com/";
  return { ip: ip || undefined, userAgent: userAgent || undefined, url };
}

export async function sendCapiEvent(e: CapiEvent): Promise<boolean> {
  const pixel = process.env.META_PIXEL_ID?.trim();
  const token = process.env.META_CAPI_TOKEN?.trim();
  if (!pixel || !token || !e.eventId) return false;
  if (!e.test && process.env.VERCEL_ENV !== "production") return false;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${GRAPH}/${encodeURIComponent(pixel)}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(capiBody(e, process.env.META_CAPI_TEST_CODE?.trim())),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`meta_capi_failed: ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("meta_capi_failed:", err instanceof Error ? err.name : err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
