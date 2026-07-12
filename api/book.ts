import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import {
  bookingEmailSubject,
  bookingEmailText,
  buildBookingCalendarInvite,
  renderBookingConfirmationEmail,
} from "../lib/booking-email";
import { createZoomMeeting, zoomConfigured } from "../lib/zoom";

// Email renderers + TidyCal helpers are inlined (not imported from a sibling
// `api/*` file) on purpose. Vercel compiles each function to ESM but does NOT
// bundle cross-file `api/` imports: the deployed `book.js` kept a bare
// `import "./lead"`, which Node's ESM loader can't resolve ("Cannot find module
// /var/task/api/lead") — the function exits at load and every request 500s.
// Keeping the shared code duplicated here (as with `availability.ts`) is the
// reliable pattern in this repo. renderLeadEmail / renderConfirmationEmail below
// are kept identical to api/lead.ts.
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

/** Pull booking id, Zoom link, and end time out of TidyCal JSON (create or get shapes). */
function bookingFromJson(json: unknown): { id?: number; meetingUrl?: string; endsAtMs?: number } {
  if (!json || typeof json !== "object") return {};
  const root = json as Record<string, unknown>;
  const raw =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root;
  const id = typeof raw.id === "number" ? raw.id : undefined;
  const meetingUrl =
    typeof raw.meeting_url === "string" && raw.meeting_url.trim() ? raw.meeting_url.trim() : undefined;
  const endsAtMs = typeof raw.ends_at === "string" ? Date.parse(raw.ends_at) : NaN;
  return {
    id,
    meetingUrl,
    endsAtMs: Number.isFinite(endsAtMs) ? endsAtMs : undefined,
  };
}

/**
 * TidyCal may generate the Zoom link a moment after the booking is created.
 * Retry GET /bookings/{id} briefly when the create response has no meeting_url.
 */
async function resolveMeetingUrl(
  token: string,
  bookingId: number | undefined,
  initialUrl: string | undefined
): Promise<string | undefined> {
  if (initialUrl) return initialUrl;
  if (!bookingId) return undefined;

  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 1200));
    const result = await tidycalFetch<unknown>(`/bookings/${bookingId}`, token);
    if (!result.ok) continue;
    const { meetingUrl } = bookingFromJson(result.data);
    if (meetingUrl) return meetingUrl;
  }
  return undefined;
}

const DEFAULT_DURATION_MINUTES = Number(process.env.BOOKING_DURATION_MINUTES) || 15;

/** TidyCal meeting_url first; Zoom Server-to-Server OAuth as fallback. */
async function resolveVideoCallUrl(d: {
  token: string;
  bookingId?: number;
  initialUrl?: string;
  startMs: number;
  endsAtMs: number;
  timezone: string;
}): Promise<string | undefined> {
  const fromTidyCal = await resolveMeetingUrl(d.token, d.bookingId, d.initialUrl);
  if (fromTidyCal) return fromTidyCal;

  if (!zoomConfigured()) return undefined;

  const durationMinutes = Math.max(1, Math.round((d.endsAtMs - d.startMs) / 60_000) || DEFAULT_DURATION_MINUTES);
  const fromZoom = await createZoomMeeting({
    startMs: d.startMs,
    timezone: d.timezone,
    durationMinutes,
  });
  if (fromZoom) {
    console.info("Created Zoom meeting via API fallback");
  }
  return fromZoom;
}

/**
 * Booking proxy for the native booking flow (src/components/BookCall.tsx).
 * Creates a TidyCal booking (POST /booking-types/{id}/bookings) for the chosen
 * slot — keeping TIDYCAL_TOKEN server-side — then fires the same branded Resend
 * emails the contact form sends (api/lead.ts): a lead notification to us and a
 * confirmation to the booker with a branded template (lib/booking-email.ts) and
 * a calendar invite (.ics) that includes the Zoom link.
 *
 * Video call URL: TidyCal meeting_url when Zoom is enabled on the booking type.
 * If TidyCal does not return a link, falls back to Zoom Server-to-Server OAuth
 * when ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_HOST_EMAIL are set.
 *
 * Request body: { name, email, message?, start (ISO), timezone, language, company }
 *   company is a honeypot (see api/lead.ts).
 *
 * Required env:
 *   TIDYCAL_TOKEN, TIDYCAL_BOOKING_TYPE_ID  — TidyCal personal access token + booking type ID
 *   RESEND_API_KEY                          — shared with api/lead.ts
 * Optional env (shared with api/lead.ts): LEAD_TO, LEAD_FROM
 * Optional env: TIDYCAL_BOOKING_QUESTION_ID — forwards message to a TidyCal form question
 * Optional env: BOOKING_DURATION_MINUTES      — default 15, used for ICS + Zoom fallback
 * Optional env: ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_HOST_EMAIL
 */

const TO = process.env.LEAD_TO || "help@aetherml.com";
const FROM = process.env.LEAD_FROM || "Æther Studio <leads@aetherml.com>";
const SITE_URL = "https://www.aetherml.com";
const LOGO_URL = `${SITE_URL}/web-app-manifest-192x192.png`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function safeParse(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

// ── Branded email rendering — kept identical to api/lead.ts (inlined; see top) ──

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Æther brand palette — pulled from the dark theme in src/index.css. */
const C = {
  page: "#09090c",
  card: "#0f0f16",
  panel: "#0b0b11",
  border: "#20202a",
  borderSoft: "#1a1a22",
  text: "#e3e1de",
  dim: "#9f9fa8",
  muted: "#75757f",
  accent: "#a6a6cf",
  accentBright: "#d3d3e8",
  onAccent: "#0a0a0f",
};

const SANS =
  "'Hanken Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const HEADING =
  "'Bricolage Grotesque','Hanken Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono',ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";

/** A monospace micro-label echoing the site's section eyebrows. */
function label(text: string): string {
  return `<span style="font-family:${MONO};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted}">${escapeHtml(
    text
  )}</span>`;
}

/** Primary CTA button — bulletproof table layout for email clients. */
function ctaButton(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px">
  <tr>
    <td style="border-radius:10px;background-color:${C.accent}">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:14px;font-weight:600;color:${C.onAccent};text-decoration:none">
        ${escapeHtml(text)} &rarr;
      </a>
    </td>
  </tr>
</table>`;
}

/** Header row with logo + wordmark. */
function wordmarkHeader(tagline?: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right:14px;vertical-align:middle">
      <img src="${LOGO_URL}" width="44" height="44" alt="Æther Studio" style="display:block;border:0;border-radius:10px">
    </td>
    <td style="vertical-align:middle">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family:${HEADING};font-size:20px;font-weight:700;letter-spacing:0.02em;color:${C.text}">&AElig;ther</td>
          <td style="padding-left:12px"><div style="width:34px;height:1px;background-color:${C.accent};opacity:0.55"></div></td>
          <td style="padding-left:12px;font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted}">Studio</td>
        </tr>
      </table>
      ${
        tagline
          ? `<div style="margin-top:9px;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.dim}">${escapeHtml(
              tagline
            )}</div>`
          : ""
      }
    </td>
  </tr>
</table>`;
}

/** Renders the lead-notification email as bulletproof, dark-themed HTML. */
function renderLeadEmail(d: {
  name: string;
  email: string;
  message: string;
  language: string;
  receivedAt: string;
  source?: "form" | "booking";
  scheduledFor?: string;
  meetingUrl?: string;
}): string {
  const firstName = d.name.split(/\s+/)[0] || d.name;
  const lang = d.language.toLowerCase().startsWith("es") ? "Español" : "English";
  const isBooking = d.source === "booking";
  const eyebrow = isBooking ? "New call booked" : "New audit request";
  const subline = isBooking
    ? "Someone just booked a call straight from the site."
    : "A new lead came in through the contact form.";
  const footerNote = isBooking
    ? "Sent from the booking calendar at aetherml.com"
    : "Sent from the contact form at aetherml.com";
  const preheader = isBooking ? `New call booked with ${d.name}` : `New audit request from ${d.name}`;

  const row = (k: string, valueHtml: string) => `
        <tr>
          <td style="padding:14px 0;border-top:1px solid ${C.borderSoft}">
            <div style="margin-bottom:5px">${label(k)}</div>
            <div style="font-family:${SANS};font-size:15px;line-height:1.5;color:${C.text}">${valueHtml}</div>
          </td>
        </tr>`;

  return `<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>New audit request</title>
</head>
<body style="margin:0;padding:0;background-color:${C.page};color-scheme:dark">
<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all">${escapeHtml(
    preheader
  )}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.page}">
  <tr>
    <td align="center" style="padding:40px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">

        <!-- wordmark -->
        <tr>
          <td style="padding:4px 4px 22px">${wordmarkHeader()}</td>
        </tr>

        <!-- card -->
        <tr>
          <td style="background-color:${C.card};border:1px solid ${C.border};border-radius:16px;padding:36px">

            <div style="margin-bottom:14px">${label(eyebrow)}</div>
            <h1 style="margin:0 0 4px;font-family:${HEADING};font-size:25px;line-height:1.25;font-weight:700;color:${C.text}">
              ${escapeHtml(firstName)} wants the hours back.
            </h1>
            <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.5;color:${C.dim}">
              ${subline}
            </p>

            <!-- accent hairline -->
            <div style="height:1px;margin:26px 0 4px;background:linear-gradient(90deg,${C.accent},rgba(166,166,207,0));"></div>

            <!-- fields -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${row("Name", escapeHtml(d.name))}
              ${row(
                "Email",
                `<a href="mailto:${escapeHtml(d.email)}" style="color:${C.accentBright};text-decoration:none">${escapeHtml(
                  d.email
                )}</a>`
              )}
              ${row("Language", escapeHtml(lang))}
              ${isBooking && d.scheduledFor ? row("Scheduled for", escapeHtml(d.scheduledFor)) : ""}
              ${
                isBooking && d.meetingUrl
                  ? row(
                      "Video call",
                      `<a href="${escapeHtml(d.meetingUrl)}" style="color:${C.accentBright};text-decoration:none;word-break:break-all">${escapeHtml(
                        d.meetingUrl
                      )}</a>`
                    )
                  : ""
              }
            </table>

            <!-- message -->
            <div style="margin:24px 0 6px">${label(d.message ? "In their words" : "No message")}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:${C.panel};border:1px solid ${C.borderSoft};border-left:2px solid ${C.accent};border-radius:10px;padding:18px 20px">
                  <div style="font-family:${SANS};font-size:15px;line-height:1.65;color:${d.message ? C.text : C.dim};white-space:pre-wrap">${
    d.message
      ? escapeHtml(d.message)
      : isBooking
        ? "They booked straight from the calendar — no notes. The time's locked in above."
        : "They left just their name and email — no details yet. Reply to open the conversation."
  }</div>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px">
              <tr>
                <td style="border-radius:10px;background-color:${C.accent}">
                  <a href="mailto:${escapeHtml(d.email)}?subject=${encodeURIComponent(
    "Re: your audit"
  )}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:14px;font-weight:600;color:${C.onAccent};text-decoration:none">
                    Reply to ${escapeHtml(firstName)} &rarr;
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td style="padding:22px 6px 4px">
            <p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:0.04em;line-height:1.6;color:${C.muted}">
              ${footerNote}<br>
              ${escapeHtml(d.receivedAt)}
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = tidycalConfig();
  if (!config) {
    console.error("TidyCal is not configured (TIDYCAL_TOKEN / TIDYCAL_BOOKING_TYPE_ID)");
    return res.status(500).json({ error: "Scheduling is not configured" });
  }

  const body =
    typeof req.body === "string" ? safeParse(req.body) : ((req.body ?? {}) as Record<string, unknown>);

  // Honeypot: bots fill hidden fields. Accept silently so they don't retry.
  if (field(body.company, 100)) {
    return res.status(200).json({ ok: true });
  }

  const name = field(body.name, 120);
  const email = field(body.email, 200);
  const message = field(body.message, 5000);
  const start = field(body.start, 40);
  const language = field(body.language, 12) || "en";
  const timezone = field(body.timezone, 60) || "America/Mexico_City";

  if (!name || !email || !start) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }
  const startMs = Date.parse(start);
  if (!Number.isFinite(startMs) || startMs <= Date.now()) {
    return res.status(409).json({ error: "That time is no longer available" });
  }

  const questionId = process.env.TIDYCAL_BOOKING_QUESTION_ID?.trim();
  const bookingBody: Record<string, unknown> = {
    starts_at: start,
    name,
    email,
    timezone,
  };
  if (message && questionId) {
    const id = Number(questionId);
    if (Number.isFinite(id) && id > 0) {
      bookingBody.booking_questions = [{ booking_type_question_id: id, answer: message }];
    }
  }

  const booking = await tidycalFetch<unknown>(
    `/booking-types/${encodeURIComponent(config.bookingTypeId)}/bookings`,
    config.token,
    {
      method: "POST",
      body: JSON.stringify(bookingBody),
    }
  );

  if (!booking.ok) {
    // A taken slot / validation failure (4xx) is the visitor's to recover from —
    // surface it so the UI can ask them to pick another time. 5xx → generic 502.
    const status = booking.status >= 400 && booking.status < 500 ? 409 : 502;
    return res.status(status).json({ error: booking.message });
  }

  // Booking confirmed — send the branded emails. Best-effort: the slot is already
  // reserved in TidyCal, so an email failure must never fail the request.
  const scheduledFor = formatSlot(startMs, timezone, language);
  const created = bookingFromJson(booking.data);
  const endsAtMs = created.endsAtMs ?? startMs + DEFAULT_DURATION_MINUTES * 60_000;
  const meetingUrl = await resolveVideoCallUrl({
    token: config.token,
    bookingId: created.id,
    initialUrl: created.meetingUrl,
    startMs,
    endsAtMs,
    timezone,
  });
  if (!meetingUrl) {
    console.warn("No video call URL from TidyCal or Zoom — email and calendar invite will omit the link");
  }
  if (process.env.RESEND_API_KEY) {
    await sendEmails({
      name,
      email,
      message,
      language,
      timezone,
      scheduledFor,
      meetingUrl,
      startMs,
      endsAtMs,
      bookingId: created.id,
    });
  } else {
    console.error("RESEND_API_KEY is not set — booking succeeded but no email sent");
  }

  return res.status(200).json({ ok: true, scheduledFor });
}

/** Human-readable slot in the booker's timezone, for the confirmation email. */
function formatSlot(startMs: number, timezone: string, language: string): string {
  try {
    return `${new Intl.DateTimeFormat(language.toLowerCase().startsWith("es") ? "es-MX" : "en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: timezone,
    }).format(new Date(startMs))} (${timezone})`;
  } catch {
    return "";
  }
}

async function sendEmails(d: {
  name: string;
  email: string;
  message: string;
  language: string;
  timezone: string;
  scheduledFor: string;
  meetingUrl?: string;
  startMs: number;
  endsAtMs: number;
  bookingId?: number;
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const receivedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date());

  // Notify us.
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: d.email,
      subject: `New call booked — ${d.name}`,
      text: `New call booked\n\nName: ${d.name}\nEmail: ${d.email}\nLanguage: ${d.language}${
        d.scheduledFor ? `\nScheduled for: ${d.scheduledFor}` : ""
      }${d.meetingUrl ? `\nVideo call: ${d.meetingUrl}` : ""}\n\n${
        d.message ? `Notes:\n${d.message}` : "No notes — booked straight from the calendar."
      }\n\n— Sent from the booking calendar at aetherml.com · ${receivedAt}`,
      html: renderLeadEmail({
        name: d.name,
        email: d.email,
        message: d.message,
        language: d.language,
        receivedAt,
        source: "booking",
        scheduledFor: d.scheduledFor,
        meetingUrl: d.meetingUrl,
      }),
    });
    if (error) console.error("Booking notification email error:", error);
  } catch (err) {
    console.error("Booking notification email threw:", err);
  }

  // Branded booking confirmation + calendar invite with Zoom link.
  const emailInput = {
    language: d.language,
    scheduledFor: d.scheduledFor,
    meetingUrl: d.meetingUrl,
    message: d.message || undefined,
    receivedAt,
    bookingId: d.bookingId,
  };
  const calendarInvite = buildBookingCalendarInvite({
    uid: `booking-${d.bookingId ?? Date.now()}@aetherml.com`,
    startMs: d.startMs,
    endMs: d.endsAtMs,
    meetingUrl: d.meetingUrl,
    language: d.language,
  });

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: d.email,
      replyTo: TO,
      subject: bookingEmailSubject(d.language),
      text: bookingEmailText(emailInput),
      html: renderBookingConfirmationEmail(emailInput),
      attachments: [
        {
          filename: "call-with-aether.ics",
          content: Buffer.from(calendarInvite, "utf-8"),
        },
      ],
    });
    if (error) console.error("Booking confirmation email error:", error);
  } catch (err) {
    console.error("Booking confirmation email threw:", err);
  }
}
