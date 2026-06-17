import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

// Email renderers + Calendly helpers are inlined (not imported from a sibling
// `api/*` file) on purpose. Vercel compiles each function to ESM but does NOT
// bundle cross-file `api/` imports: the deployed `book.js` kept a bare
// `import "./lead"`, which Node's ESM loader can't resolve ("Cannot find module
// /var/task/api/lead") — the function exits at load and every request 500s.
// Keeping the shared code duplicated here (as with `availability.ts`) is the
// reliable pattern in this repo. renderLeadEmail / renderConfirmationEmail below
// are kept identical to api/lead.ts.
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
 *   CALENDLY_TOKEN, CALENDLY_EVENT_TYPE  — Calendly personal access token + event type URI
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

/** Renders the lead-notification email as bulletproof, dark-themed HTML. */
function renderLeadEmail(d: {
  name: string;
  email: string;
  message: string;
  language: string;
  receivedAt: string;
  source?: "form" | "booking";
  scheduledFor?: string;
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
          <td style="padding:4px 4px 22px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${HEADING};font-size:20px;font-weight:700;letter-spacing:0.02em;color:${C.text}">&AElig;ther</td>
                <td style="padding-left:12px"><div style="width:34px;height:1px;background-color:${C.accent};opacity:0.55"></div></td>
                <td style="padding-left:12px;font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted}">Studio</td>
              </tr>
            </table>
          </td>
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

/** Copy for the customer-facing confirmation, keyed by language. */
const CONFIRM_COPY = {
  en: {
    subject: "We've got your request — Æther Studio",
    tagline: "You run the business. We run the rest.",
    preheader: "We've got your request — expect a reply within one business day.",
    eyebrow: "Request received",
    heading: (first: string) => `Thanks, ${first}. We're on it.`,
    lead: "Your audit request just landed with us. We read every one personally — expect a reply within one business day.",
    nextLabel: "What happens next",
    next: "We'll look at where your hours are going and come back with what we'd build to win them back.",
    echoLabel: "What you told us",
    signoff: "Talk soon,",
    team: "— The Æther team",
    footerLine: "You're receiving this because you contacted us at aetherml.com.",
  },
  es: {
    subject: "Recibimos tu solicitud — Æther Studio",
    tagline: "Tú llevas el negocio. Nosotros, lo demás.",
    preheader: "Recibimos tu solicitud — te respondemos en un día hábil.",
    eyebrow: "Solicitud recibida",
    heading: (first: string) => `Gracias, ${first}. Estamos en ello.`,
    lead: "Tu solicitud de auditoría ya llegó con nosotros. Leemos cada una en persona — espera respuesta en un día hábil.",
    nextLabel: "Qué sigue",
    next: "Revisaremos a dónde se van tus horas y volveremos con qué construiríamos para recuperarlas.",
    echoLabel: "Lo que nos contaste",
    signoff: "Hablamos pronto,",
    team: "— El equipo de Æther",
    footerLine: "Recibes este correo porque nos contactaste en aetherml.com.",
  },
} as const;

/**
 * Booking confirmations reuse CONFIRM_COPY but override the strings that would
 * otherwise read like a form reply ("expect a reply") — a booked call needs
 * "see you then" copy. Only the differing keys are listed; the rest fall through.
 */
const BOOKING_CONFIRM_OVERRIDE = {
  en: {
    subject: "Your call is booked — Æther Studio",
    preheader: "Your call is booked — the time and invite are in your calendar.",
    eyebrow: "Call booked",
    heading: (first: string) => `You're booked, ${first}.`,
    lead: "Your call with Æther is locked in. The time and a calendar invite are on their way in a separate email — this note is just us saying we're looking forward to it.",
    nextLabel: "What happens next",
    next: "We'll come to the call having looked at where your hours are going, ready to walk through what we'd build to win them back.",
    whenLabel: "Your slot",
  },
  es: {
    subject: "Tu llamada está confirmada — Æther Studio",
    preheader: "Tu llamada está confirmada — la hora y la invitación están en tu calendario.",
    eyebrow: "Llamada confirmada",
    heading: (first: string) => `Estás agendado, ${first}.`,
    lead: "Tu llamada con Æther está confirmada. La hora y una invitación de calendario van en un correo aparte — este mensaje es solo para decirte que lo esperamos con ganas.",
    nextLabel: "Qué sigue",
    next: "Llegaremos a la llamada habiendo revisado a dónde se van tus horas, listos para repasar qué construiríamos para recuperarlas.",
    whenLabel: "Tu horario",
  },
} as const;

/** Renders the customer confirmation as bulletproof, dark-themed HTML. */
function renderConfirmationEmail(d: {
  name: string;
  message: string;
  language: string;
  receivedAt: string;
  source?: "form" | "booking";
  scheduledFor?: string;
}): string {
  const firstName = d.name.split(/\s+/)[0] || d.name;
  const isEs = d.language.toLowerCase().startsWith("es");
  const isBooking = d.source === "booking";
  const base = isEs ? CONFIRM_COPY.es : CONFIRM_COPY.en;
  const override = isEs ? BOOKING_CONFIRM_OVERRIDE.es : BOOKING_CONFIRM_OVERRIDE.en;
  const t = isBooking ? { ...base, ...override } : base;

  return `<!DOCTYPE html>
<html lang="${d.language.toLowerCase().startsWith("es") ? "es" : "en"}" style="margin:0;padding:0">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(t.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${C.page};color-scheme:dark">
<span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all">${escapeHtml(
    t.preheader
  )}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.page}">
  <tr>
    <td align="center" style="padding:40px 16px">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">

        <!-- wordmark -->
        <tr>
          <td style="padding:4px 4px 22px">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${HEADING};font-size:20px;font-weight:700;letter-spacing:0.02em;color:${C.text}">&AElig;ther</td>
                <td style="padding-left:12px"><div style="width:34px;height:1px;background-color:${C.accent};opacity:0.55"></div></td>
                <td style="padding-left:12px;font-family:${MONO};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted}">Studio</td>
              </tr>
            </table>
            <div style="margin-top:11px;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.dim}">${escapeHtml(
    t.tagline
  )}</div>
          </td>
        </tr>

        <!-- card -->
        <tr>
          <td style="background-color:${C.card};border:1px solid ${C.border};border-radius:16px;padding:36px">

            <div style="margin-bottom:14px">${label(t.eyebrow)}</div>
            <h1 style="margin:0 0 10px;font-family:${HEADING};font-size:25px;line-height:1.25;font-weight:700;color:${C.text}">
              ${escapeHtml(t.heading(firstName))}
            </h1>
            <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.dim}">
              ${escapeHtml(t.lead)}
            </p>

            <!-- accent hairline -->
            <div style="height:1px;margin:26px 0 4px;background:linear-gradient(90deg,${C.accent},rgba(166,166,207,0));"></div>

            <!-- what happens next -->
            <div style="margin:22px 0 6px">${label(t.nextLabel)}</div>
            <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.text}">
              ${escapeHtml(t.next)}
            </p>

            <!-- scheduled slot (bookings only) -->
            ${
              isBooking && d.scheduledFor
                ? `<div style="margin:22px 0 6px">${label(override.whenLabel)}</div>
            <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.text}">${escapeHtml(
              d.scheduledFor
            )}</p>`
                : ""
            }

            <!-- echo of their message (only when they left one) -->
            ${
              d.message
                ? `<div style="margin:24px 0 6px">${label(t.echoLabel)}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:${C.panel};border:1px solid ${C.borderSoft};border-left:2px solid ${C.accent};border-radius:10px;padding:18px 20px">
                  <div style="font-family:${SANS};font-size:15px;line-height:1.65;color:${C.text};white-space:pre-wrap">${escapeHtml(
                    d.message
                  )}</div>
                </td>
              </tr>
            </table>`
                : ""
            }

            <!-- sign-off -->
            <p style="margin:28px 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.dim}">
              ${escapeHtml(t.signoff)}<br>
              <span style="color:${C.text}">${escapeHtml(t.team)}</span>
            </p>

          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td style="padding:22px 6px 4px">
            <p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:0.04em;line-height:1.6;color:${C.muted}">
              ${escapeHtml(t.footerLine)}<br>
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
