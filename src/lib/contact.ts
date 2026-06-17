/**
 * Shared contact channels for the landing page.
 *
 * WhatsApp is the channel most cold traffic already arrives on, so we surface a
 * wa.me deep link as a co-primary CTA (hero) and as the "continue the
 * conversation" path in the contact section — rather than dropping everyone into
 * a form.
 *
 * The number lives in VITE_WHATSAPP_NUMBER (digits only, full international
 * format, e.g. "5213312345678" for a Guadalajara mobile). It's a public link, so
 * the VITE_ prefix is intentional. When it's unset (or too short to be real) the
 * WhatsApp CTAs simply don't render — no broken link ever ships. Vite reads env
 * vars at startup; restart `npm run dev` after changing it.
 */
export const CONTACT_EMAIL = "help@aetherml.com";

const RAW_WHATSAPP = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "";
/** Digits only — wa.me wants a bare international number, no +, spaces or dashes. */
export const whatsappNumber = RAW_WHATSAPP.replace(/\D/g, "");
/** Guard against a half-filled env value rendering a dead button. */
export const whatsappEnabled = whatsappNumber.length >= 10;

/** Build a wa.me deep link, optionally pre-filling the first message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
