import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import { renderConfirmationEmail, renderLeadEmail } from "./lead";

/**
 * Cal.com webhook receiver. When a visitor books a call through the embed
 * (see src/components/BookCall.tsx), Cal.com POSTs the booking here and we send
 * the same branded Resend emails as the contact form (api/lead.ts): a lead
 * notification to us, and a confirmation to the booker.
 *
 * This fires server-side from Cal.com — independent of the visitor's browser —
 * so the lead lands even if they close the tab the instant they book.
 *
 * Setup (Cal.com → Settings → Developer → Webhooks):
 *   • Subscriber URL : https://aetherml.com/api/cal-webhook
 *   • Event triggers : Booking Created  (BOOKING_CREATED)
 *   • Secret         : a random string, also set as CAL_WEBHOOK_SECRET below
 *
 * Required env:
 *   RESEND_API_KEY     — shared with api/lead.ts
 *   CAL_WEBHOOK_SECRET — the webhook secret from the Cal.com dashboard; the
 *                        request signature is verified against it, so an unset
 *                        secret disables the endpoint (it won't email on unsigned
 *                        requests — that would be an open spam relay).
 * Optional env (shared with api/lead.ts):
 *   LEAD_TO, LEAD_FROM
 */

const TO = process.env.LEAD_TO || "help@aetherml.com";
const FROM = process.env.LEAD_FROM || "Æther Studio <leads@aetherml.com>";

// Cal.com signs the raw request body with HMAC-SHA256 and sends it in this
// header — so we must read the body unparsed to recompute the signature.
const SIGNATURE_HEADER = "x-cal-signature-256";
export const config = { api: { bodyParser: false } };

async function readRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : (chunk as Buffer));
  }
  return Buffer.concat(chunks).toString("utf8");
}

/** Constant-time compare of the recomputed HMAC against Cal's header. */
function signatureValid(raw: string, header: string | undefined, secret: string): boolean {
  if (!header) return false;
  const expected = createHmac("sha256", secret).update(raw, "utf8").digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Pull a `{ value }` off Cal's responses map, tolerating string or object. */
function responseValue(responses: unknown, key: string): string {
  if (!responses || typeof responses !== "object") return "";
  const entry = (responses as Record<string, unknown>)[key];
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object" && "value" in entry) {
    const v = (entry as { value: unknown }).value;
    if (typeof v === "string") return v;
  }
  return "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CAL_WEBHOOK_SECRET is not set — refusing to process the webhook");
    return res.status(500).json({ error: "Webhook is not configured" });
  }
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service is not configured" });
  }

  const raw = await readRawBody(req);
  if (!signatureValid(raw, req.headers[SIGNATURE_HEADER] as string | undefined, secret)) {
    console.error("Cal webhook signature mismatch");
    return res.status(401).json({ error: "Invalid signature" });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  // Only act on new bookings. Ack everything else so Cal stops retrying.
  if (event.triggerEvent !== "BOOKING_CREATED") {
    return res.status(200).json({ ok: true, ignored: event.triggerEvent });
  }

  const payload = (event.payload ?? {}) as Record<string, unknown>;
  const attendees = Array.isArray(payload.attendees) ? payload.attendees : [];
  const attendee = (attendees[0] ?? {}) as Record<string, unknown>;
  const responses = payload.responses;

  const name =
    (typeof attendee.name === "string" && attendee.name) ||
    responseValue(responses, "name") ||
    "There";
  const email =
    (typeof attendee.email === "string" && attendee.email) || responseValue(responses, "email");
  if (!email) {
    console.error("Cal webhook: no attendee email in payload");
    // Nothing to email, but the booking itself is valid — don't make Cal retry.
    return res.status(200).json({ ok: true, skipped: "no email" });
  }

  // Cal nests the attendee locale as { language: { locale: "es" } }.
  const locale =
    (attendee.language as { locale?: string } | undefined)?.locale ||
    (typeof attendee.locale === "string" ? attendee.locale : "") ||
    "en";
  const language = locale.toLowerCase().startsWith("es") ? "es" : "en";

  // Booking notes the visitor typed, if any — mirrors the form's message field.
  const message =
    responseValue(responses, "notes") ||
    (typeof payload.additionalNotes === "string" ? payload.additionalNotes : "");

  // Format the slot in the attendee's own timezone when Cal provides it.
  const tz =
    (typeof attendee.timeZone === "string" && attendee.timeZone) ||
    ((payload.organizer as { timeZone?: string } | undefined)?.timeZone ?? "America/Mexico_City");
  let scheduledFor = "";
  if (typeof payload.startTime === "string") {
    try {
      scheduledFor = `${new Intl.DateTimeFormat(language === "es" ? "es-MX" : "en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: tz,
      }).format(new Date(payload.startTime))} (${tz})`;
    } catch {
      scheduledFor = "";
    }
  }

  const receivedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date());

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New call booked — ${name}`,
      text: `New call booked\n\nName: ${name}\nEmail: ${email}\nLanguage: ${language}${
        scheduledFor ? `\nScheduled for: ${scheduledFor}` : ""
      }\n\n${message ? `Notes:\n${message}` : "No notes — booked straight from the calendar."}\n\n— Sent from the booking calendar at aetherml.com · ${receivedAt}`,
      html: renderLeadEmail({
        name,
        email,
        message,
        language,
        receivedAt,
        source: "booking",
        scheduledFor,
      }),
    });

    if (error) {
      console.error("Resend error (booking notification):", error);
      // 502 → Cal will retry, which is what we want for a transient send failure.
      return res.status(502).json({ error: "Failed to send notification" });
    }

    // Confirm to the booker. Best-effort: the notification already reached us, so
    // a failure here is logged but never fails the webhook (Cal already emails an
    // invite, so the booker isn't left empty-handed either way).
    const confirmSubject =
      language === "es"
        ? "Tu llamada está confirmada — Æther Studio"
        : "Your call is booked — Æther Studio";
    try {
      const { error: confirmError } = await resend.emails.send({
        from: FROM,
        to: email,
        replyTo: TO,
        subject: confirmSubject,
        text: `${
          language === "es"
            ? `Estás agendado, ${name.split(/\s+/)[0] || name}.`
            : `You're booked, ${name.split(/\s+/)[0] || name}.`
        }${scheduledFor ? `\n\n${language === "es" ? "Tu horario" : "Your slot"}: ${scheduledFor}` : ""}`,
        html: renderConfirmationEmail({
          name,
          message,
          language,
          receivedAt,
          source: "booking",
          scheduledFor,
        }),
      });
      if (confirmError) console.error("Confirmation email error (booking):", confirmError);
    } catch (confirmErr) {
      console.error("Confirmation email threw (booking):", confirmErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Cal webhook handler error:", err);
    return res.status(500).json({ error: "Failed to process booking" });
  }
}
