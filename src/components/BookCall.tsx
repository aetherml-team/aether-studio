import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { m, useReducedMotion } from "framer-motion";
import { getCalApi } from "@calcom/embed-react";
import { CalendarClock, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { CAL_LINK } from "@/lib/scheduling";

/**
 * "Book a call" panel for the contact section. Rather than an inline calendar
 * (Cal's inline embed auto-grows to fit a full day of slots, making the page
 * very tall), this is a compact branded panel whose button opens Cal in a modal
 * overlay — the booking UI then lives above the page with its own scroll, so the
 * page height stays fixed.
 *
 * Lazy-loaded by ContactSection so the embed bundle only ships when this tab is
 * opened. Booking link lives in @/lib/scheduling; theme matches the dark site.
 */

const CAL_NAMESPACE = "audit";

/**
 * Cal embed design tokens mapped to Æther's dark theme (see src/index.css / the
 * email palette in api/lead.ts) so the modal booker matches the site. Keys are
 * Cal's cal-* CSS vars.
 */
const CAL_THEME = {
  "cal-brand": "#4949a2",
  "cal-brand-emphasis": "#5a5ac0",
  "cal-brand-text": "#ffffff",
  // All solid/opaque — the modal iframe is transparent by default, so any
  // translucent bg lets the page bleed through behind the booker.
  "cal-bg": "#0f0f16",
  "cal-bg-emphasis": "#22222e",
  "cal-bg-subtle": "#16161d",
  "cal-bg-muted": "#131319",
  "cal-bg-inverted": "#e3e1de",
  "cal-text": "#c9c8d0",
  "cal-text-emphasis": "#f3f1ee",
  "cal-text-subtle": "#9f9fa8",
  "cal-text-muted": "#6f6f79",
  "cal-text-inverted": "#0a0a0f",
  "cal-border": "#20202a",
  "cal-border-emphasis": "#2c2c39",
  "cal-border-subtle": "#1a1a22",
  "cal-border-muted": "#16161d",
  "cal-border-booker": "#20202a",
} as const;

const CAL_CONFIG = JSON.stringify({ layout: "month_view", theme: "dark" });

const BookCall = () => {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const trackedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      if (cancelled) return;
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: { dark: { ...CAL_THEME }, light: { ...CAL_THEME } },
        // Hide Cal's event-meta panel (host name, avatar, title, description) —
        // it's placeholder content and reads as off-brand. The page already
        // explains the call; the modal just needs the calendar + times.
        hideEventTypeDetails: true,
        layout: "month_view",
      });
      // Warm the iframe so the modal opens instantly on click.
      cal("preload", { calLink: CAL_LINK });
      // Fire once per mount when a booking goes through, mirroring the form's
      // "Lead Submitted" event so both paths show up in analytics.
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          if (trackedRef.current) return;
          trackedRef.current = true;
          track("Audit Booked", { language: i18n.language });
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [i18n.language]);

  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-background/40 px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
        <CalendarClock className="h-5 w-5 text-primary" strokeWidth={1.6} aria-hidden />
      </span>
      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-primary/80">
        {t("contact.bookEyebrow")}
      </p>
      <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
        {t("contact.bookTitle")}
      </h3>
      <p className="mt-3 max-w-sm font-body text-[14.5px] font-light leading-relaxed text-muted-foreground">
        {t("contact.bookBody")}
      </p>
      <m.button
        type="button"
        data-cal-namespace={CAL_NAMESPACE}
        data-cal-link={CAL_LINK}
        data-cal-config={CAL_CONFIG}
        className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 font-body text-[14px] font-medium text-primary-foreground shadow-[0_14px_36px_-18px_hsl(var(--primary)/0.7)]"
        whileHover={reduced ? undefined : { scale: 1.02, filter: "brightness(1.06)" }}
        whileTap={reduced ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {t("contact.bookCta")}
        <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
      </m.button>
    </div>
  );
};

export default BookCall;
