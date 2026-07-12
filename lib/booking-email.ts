/**
 * Branded booking-confirmation email + calendar invite for Æther Studio.
 * Used by api/book.ts after a TidyCal booking is created.
 */

const SITE_URL = "https://www.aetherml.com";
const LOGO_URL = `${SITE_URL}/web-app-manifest-192x192.png`;

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

const COPY = {
  en: {
    subject: "Your call is booked — Æther Studio",
    tagline: "You run the business. We run the rest.",
    preheader: "Your call is booked — join on Zoom at the time below.",
    eyebrow: "Call booked",
    heading: "Your call is confirmed.",
    lead: "We've locked in your time with Æther. Use the Zoom link below when it's time — we'll come ready to talk through where your hours are going.",
    whenLabel: "When",
    joinLabel: "Video call",
    joinButton: "Join on Zoom",
    joinHint: "This link is unique to your booking. A calendar file is attached so you can add it with the Zoom link included.",
    beforeLabel: "Before the call",
    before: "No prep needed. If you want to share context ahead of time, reply to this email.",
    calendarNote: "Add to calendar",
    calendarHint: "Open the attached invite (.ics) to add this call — Zoom link included.",
    signoff: "Talk soon,",
    team: "— The Æther team",
    footerLine: "You're receiving this because you booked a call at aetherml.com.",
    eventTitle: "Call with Æther Studio",
    eventDescription: "Free audit call with Æther Studio.",
  },
  es: {
    subject: "Tu llamada está confirmada — Æther Studio",
    tagline: "Tú llevas el negocio. Nosotros, lo demás.",
    preheader: "Tu llamada está confirmada — únete en Zoom a la hora indicada.",
    eyebrow: "Llamada confirmada",
    heading: "Tu llamada está confirmada.",
    lead: "Tu hora con Æther ya está reservada. Usa el enlace de Zoom abajo a la hora programada — llegaremos listos para revisar a dónde se van tus horas.",
    whenLabel: "Cuándo",
    joinLabel: "Videollamada",
    joinButton: "Entrar a Zoom",
    joinHint: "Este enlace es único para tu reserva. Adjuntamos un archivo de calendario (.ics) con el enlace de Zoom.",
    beforeLabel: "Antes de la llamada",
    before: "No necesitas preparar nada. Si quieres compartir contexto antes, responde a este correo.",
    calendarNote: "Agregar al calendario",
    calendarHint: "Abre la invitación adjunta (.ics) para agregar la llamada con el enlace de Zoom.",
    signoff: "Hablamos pronto,",
    team: "— El equipo de Æther",
    footerLine: "Recibes este correo porque agendaste una llamada en aetherml.com.",
    eventTitle: "Llamada con Æther Studio",
    eventDescription: "Llamada de auditoría gratuita con Æther Studio.",
  },
} as const;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function label(text: string): string {
  return `<span style="font-family:${MONO};font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted}">${escapeHtml(
    text
  )}</span>`;
}

function ctaButton(href: string, text: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px">
  <tr>
    <td style="border-radius:10px;background-color:${C.accent}">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:14px;font-weight:600;color:${C.onAccent};text-decoration:none">
        ${escapeHtml(text)} &rarr;
      </a>
    </td>
  </tr>
</table>`;
}

function wordmarkHeader(tagline: string): string {
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
      <div style="margin-top:9px;font-family:${SANS};font-size:13px;line-height:1.5;color:${C.dim}">${escapeHtml(tagline)}</div>
    </td>
  </tr>
</table>`;
}

export type BookingEmailInput = {
  language: string;
  scheduledFor: string;
  meetingUrl?: string;
  message?: string;
  receivedAt: string;
  bookingId?: number;
};

export function bookingEmailCopy(language: string) {
  return language.toLowerCase().startsWith("es") ? COPY.es : COPY.en;
}

export function bookingEmailSubject(language: string): string {
  return bookingEmailCopy(language).subject;
}

export function bookingEmailText(d: BookingEmailInput): string {
  const t = bookingEmailCopy(d.language);
  return [
    t.heading,
    "",
    t.lead,
    d.scheduledFor ? `\n${t.whenLabel}: ${d.scheduledFor}` : "",
    d.meetingUrl ? `\n${t.joinLabel}: ${d.meetingUrl}` : "",
    "",
    `${t.beforeLabel}: ${t.before}`,
    d.message ? `\n\n${d.message}` : "",
    "",
    `${t.signoff}\n${t.team}`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

/** Branded HTML for the booking-confirmed email sent to the visitor. */
export function renderBookingConfirmationEmail(d: BookingEmailInput): string {
  const t = bookingEmailCopy(d.language);
  const lang = d.language.toLowerCase().startsWith("es") ? "es" : "en";

  const detailsPanel = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0">
  <tr>
    <td style="background-color:${C.panel};border:1px solid ${C.borderSoft};border-radius:14px;padding:24px">
      ${
        d.scheduledFor
          ? `<div style="margin-bottom:${d.meetingUrl ? "20px" : "0"}">
        <div style="margin-bottom:6px">${label(t.whenLabel)}</div>
        <div style="font-family:${SANS};font-size:17px;line-height:1.45;font-weight:600;color:${C.text}">${escapeHtml(
            d.scheduledFor
          )}</div>
      </div>`
          : ""
      }
      ${
        d.meetingUrl
          ? `<div>
        <div style="margin-bottom:6px">${label(t.joinLabel)}</div>
        ${ctaButton(d.meetingUrl, t.joinButton)}
        <p style="margin:12px 0 0;font-family:${SANS};font-size:13px;line-height:1.55;color:${C.muted}">${escapeHtml(
            t.joinHint
          )}</p>
      </div>`
          : ""
      }
    </td>
  </tr>
</table>`;

  const calendarPanel = d.meetingUrl
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 0">
  <tr>
    <td style="border:1px dashed ${C.border};border-radius:12px;padding:16px 18px">
      <div style="margin-bottom:4px">${label(t.calendarNote)}</div>
      <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.55;color:${C.dim}">${escapeHtml(
        t.calendarHint
      )}</p>
    </td>
  </tr>
</table>`
    : "";

  const messageBlock = d.message
    ? `<div style="margin:24px 0 0">
  <div style="margin-bottom:8px">${label(lang === "es" ? "Lo que nos contaste" : "What you told us")}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="background-color:${C.panel};border:1px solid ${C.borderSoft};border-left:2px solid ${C.accent};border-radius:10px;padding:18px 20px">
        <div style="font-family:${SANS};font-size:15px;line-height:1.65;color:${C.text};white-space:pre-wrap">${escapeHtml(
          d.message
        )}</div>
      </td>
    </tr>
  </table>
</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="${lang}" style="margin:0;padding:0">
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
        <tr>
          <td style="padding:4px 4px 22px">${wordmarkHeader(t.tagline)}</td>
        </tr>
        <tr>
          <td style="background-color:${C.card};border:1px solid ${C.border};border-radius:16px;padding:36px">
            <div style="margin-bottom:14px">${label(t.eyebrow)}</div>
            <h1 style="margin:0 0 10px;font-family:${HEADING};font-size:26px;line-height:1.2;font-weight:700;color:${C.text}">
              ${escapeHtml(t.heading)}
            </h1>
            <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.dim}">
              ${escapeHtml(t.lead)}
            </p>
            ${detailsPanel}
            ${calendarPanel}
            <div style="height:1px;margin:28px 0 6px;background:linear-gradient(90deg,${C.accent},rgba(166,166,207,0));"></div>
            <div style="margin:20px 0 6px">${label(t.beforeLabel)}</div>
            <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.text}">
              ${escapeHtml(t.before)}
            </p>
            ${messageBlock}
            <p style="margin:28px 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.dim}">
              ${escapeHtml(t.signoff)}<br>
              <span style="color:${C.text}">${escapeHtml(t.team)}</span>
            </p>
          </td>
        </tr>
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

function foldIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function formatIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

/** Calendar invite (.ics) with Zoom URL — formatted for Google Calendar video join. */
export function buildBookingCalendarInvite(d: {
  uid: string;
  startMs: number;
  endMs: number;
  meetingUrl?: string;
  language: string;
  organizerEmail?: string;
  attendeeEmail?: string;
}): string {
  const t = bookingEmailCopy(d.language);
  const description = d.meetingUrl
    ? `${t.eventDescription}\n\nJoin Zoom: ${d.meetingUrl}`
    : t.eventDescription;
  const organizer = d.organizerEmail || "help@aetherml.com";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aether Studio//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${d.uid}`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART:${formatIcsUtc(new Date(d.startMs))}`,
    `DTEND:${formatIcsUtc(new Date(d.endMs))}`,
    `SUMMARY:${foldIcsText(t.eventTitle)}`,
    `DESCRIPTION:${foldIcsText(description)}`,
    `ORGANIZER;CN=Aether Studio:mailto:${organizer}`,
    d.attendeeEmail ? `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${d.attendeeEmail}` : "",
    d.meetingUrl ? `LOCATION:${foldIcsText(d.meetingUrl)}` : "",
    d.meetingUrl ? `URL:${foldIcsText(d.meetingUrl)}` : "",
    d.meetingUrl ? `X-GOOGLE-CONFERENCE:${foldIcsText(d.meetingUrl)}` : "",
    d.meetingUrl ? `CONFERENCE;VALUE=URI;FEATURE=VIDEO,PHONE:${foldIcsText(d.meetingUrl)}` : "",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return `${lines.join("\r\n")}\r\n`;
}
