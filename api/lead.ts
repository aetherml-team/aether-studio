import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

/**
 * Lead capture endpoint. Receives { name, email, message, language } from the
 * landing-page contact form and emails it via Resend. The API key never leaves
 * the server — it must only ever be set as a Vercel environment variable.
 *
 * Required env:
 *   RESEND_API_KEY  — from https://resend.com/api-keys
 * Optional env:
 *   LEAD_TO    — recipient inbox (default: help@aetherml.com)
 *   LEAD_FROM  — verified Resend sender (default: Æther <leads@aetherml.com>)
 */

// Use || (not ??) so a blank env var ("") falls back to the default instead of
// sending Resend an empty address, which fails the send with a 502.
const TO = process.env.LEAD_TO || "help@aetherml.com";
const FROM = process.env.LEAD_FROM || "Æther Studio <leads@aetherml.com>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

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
export function renderLeadEmail(d: {
  name: string;
  email: string;
  message: string;
  language: string;
  receivedAt: string;
}): string {
  const firstName = d.name.split(/\s+/)[0] || d.name;
  const lang = d.language.toLowerCase().startsWith("es") ? "Español" : "English";
  const preheader = `New audit request from ${d.name}`;

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

            <div style="margin-bottom:14px">${label("New audit request")}</div>
            <h1 style="margin:0 0 4px;font-family:${HEADING};font-size:25px;line-height:1.25;font-weight:700;color:${C.text}">
              ${escapeHtml(firstName)} wants the hours back.
            </h1>
            <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.5;color:${C.dim}">
              A new lead came in through the contact form.
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
            </table>

            <!-- message -->
            <div style="margin:24px 0 6px">${label("In their words")}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:${C.panel};border:1px solid ${C.borderSoft};border-left:2px solid ${C.accent};border-radius:10px;padding:18px 20px">
                  <div style="font-family:${SANS};font-size:15px;line-height:1.65;color:${C.text};white-space:pre-wrap">${escapeHtml(
    d.message
  )}</div>
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
              Sent from the contact form at aetherml.com<br>
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

/** Renders the customer confirmation as bulletproof, dark-themed HTML. */
export function renderConfirmationEmail(d: {
  name: string;
  message: string;
  language: string;
  receivedAt: string;
}): string {
  const firstName = d.name.split(/\s+/)[0] || d.name;
  const t = d.language.toLowerCase().startsWith("es") ? CONFIRM_COPY.es : CONFIRM_COPY.en;

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

            <!-- echo of their message -->
            <div style="margin:24px 0 6px">${label(t.echoLabel)}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:${C.panel};border:1px solid ${C.borderSoft};border-left:2px solid ${C.accent};border-radius:10px;padding:18px 20px">
                  <div style="font-family:${SANS};font-size:15px;line-height:1.65;color:${C.text};white-space:pre-wrap">${escapeHtml(
    d.message
  )}</div>
                </td>
              </tr>
            </table>

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ error: "Email service is not configured" });
  }

  const body =
    typeof req.body === "string"
      ? (() => {
          try {
            return JSON.parse(req.body) as Record<string, unknown>;
          } catch {
            return {};
          }
        })()
      : (req.body ?? {});

  // Honeypot: bots fill hidden fields. Accept silently so they don't retry.
  if (field(body.company, 100)) {
    return res.status(200).json({ ok: true });
  }

  const name = field(body.name, 120);
  const email = field(body.email, 200);
  const message = field(body.message, 5000);
  const language = field(body.language, 12) || "en";

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
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
      subject: `New audit request — ${name}`,
      text: `New audit request\n\nName: ${name}\nEmail: ${email}\nLanguage: ${language}\n\nIn their words:\n${message}\n\n— Sent from the contact form at aetherml.com · ${receivedAt}`,
      html: renderLeadEmail({ name, email, message, language, receivedAt }),
    });

    if (error) {
      console.error("Resend error:", error);
      return res
        .status(502)
        .json({ error: "Failed to send message", detail: error.name ?? error.message });
    }

    // Confirm to the customer. Best-effort: the lead is already captured, so a
    // failure here is logged but never fails the request.
    const t = language.toLowerCase().startsWith("es") ? CONFIRM_COPY.es : CONFIRM_COPY.en;
    try {
      const { error: confirmError } = await resend.emails.send({
        from: FROM,
        to: email,
        replyTo: TO,
        subject: t.subject,
        text: `${t.heading(name.split(/\s+/)[0] || name)}\n\n${t.lead}\n\n${t.nextLabel}: ${t.next}\n\n${t.echoLabel}:\n${message}\n\n${t.signoff}\n${t.team}`,
        html: renderConfirmationEmail({ name, message, language, receivedAt }),
      });
      if (confirmError) console.error("Confirmation email error:", confirmError);
    } catch (confirmErr) {
      console.error("Confirmation email threw:", confirmErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Lead handler error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
