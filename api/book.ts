import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { calendlyConfig, calendlyFetch } from "./_calendly";
import { renderConfirmationEmail, renderLeadEmail } from "./lead";

/**
 * Booking proxy for the native booking flow (src/components/BookCall.tsx).
 * Creates a Calendly invitee (POST https://api.calendly.com/invitees) for the
 * chosen slot — keeping CALENDLY_TOKEN server-side — then fires the same branded
 * Resend emails the contact form sends (api/lead.ts): a lead notification to us
 * and a confirmation to the booker. Calendly emails the calendar invite with the
 * meeting link itself, so we don't attach our own ICS.
 *
 * Request body: { name, email, message?, start (ISO), timezone, language, company }
 *   company is a honeypot (see api/lead.ts).
 *
 * Required env:
 *   CALENDLY_TOKEN, CALENDLY_EVENT_TYPE  — see api/_calendly.ts
 *   RESEND_API_KEY                       — shared with api/lead.ts
 * Optional env (shared with api/lead.ts): LEAD_TO, LEAD_FROM
 */

const TO = process.env.LEAD_TO || "help@aetherml.com";
const FROM = process.env.LEAD_FROM || "Æther Studio <leads@aetherml.com>";
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

type EventTypeResource = { resource?: { locations?: Array<Record<string, unknown>> } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = calendlyConfig();
  if (!config) {
    console.error("Calendly is not configured (CALENDLY_TOKEN / CALENDLY_EVENT_TYPE)");
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

  // The invitee POST needs a `location` matching the event type's configuration
  // (Calendly requires it when the event type defines one — e.g. a Zoom call).
  // Read it live so the booking stays correct if the event type changes; if the
  // lookup fails we proceed without it and let Calendly's response be the truth.
  let location: Record<string, unknown> | undefined;
  const et = await calendlyFetch<EventTypeResource>(config.eventType, config.token);
  if (et.ok) {
    const first = et.data.resource?.locations?.[0];
    if (first && typeof first === "object") location = first;
  }

  const booking = await calendlyFetch<unknown>("/invitees", config.token, {
    method: "POST",
    body: JSON.stringify({
      event_type: config.eventType,
      start_time: start,
      invitee: { name, email, timezone },
      ...(location ? { location } : {}),
    }),
  });

  if (!booking.ok) {
    // A taken slot / validation failure (4xx) is the visitor's to recover from —
    // surface it so the UI can ask them to pick another time. 5xx → generic 502.
    const status = booking.status >= 400 && booking.status < 500 ? 409 : 502;
    return res.status(status).json({ error: booking.message });
  }

  // Booking confirmed — send the branded emails. Best-effort: the slot is already
  // reserved in Calendly, so an email failure must never fail the request.
  const scheduledFor = formatSlot(startMs, timezone, language);
  if (process.env.RESEND_API_KEY) {
    await sendEmails({ name, email, message, language, timezone, scheduledFor });
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
}): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const isEs = d.language.toLowerCase().startsWith("es");
  const firstName = d.name.split(/\s+/)[0] || d.name;
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
      }\n\n${
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
      }),
    });
    if (error) console.error("Booking notification email error:", error);
  } catch (err) {
    console.error("Booking notification email threw:", err);
  }

  // Confirm to the booker.
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: d.email,
      replyTo: TO,
      subject: isEs ? "Tu llamada está confirmada — Æther Studio" : "Your call is booked — Æther Studio",
      text: `${isEs ? `Estás agendado, ${firstName}.` : `You're booked, ${firstName}.`}${
        d.scheduledFor ? `\n\n${isEs ? "Tu horario" : "Your slot"}: ${d.scheduledFor}` : ""
      }`,
      html: renderConfirmationEmail({
        name: d.name,
        message: d.message,
        language: d.language,
        receivedAt,
        source: "booking",
        scheduledFor: d.scheduledFor,
      }),
    });
    if (error) console.error("Booking confirmation email error:", error);
  } catch (err) {
    console.error("Booking confirmation email threw:", err);
  }
}
