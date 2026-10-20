import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { m, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { EASE } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { whatsappEnabled, whatsappUrl } from "@/lib/contact";

/* Shared pieces for the hero variants. Composition is what differs between
   them; the copy, the actions and the material are the same everywhere. */

export function Actions({ className = "" }: { className?: string }) {
  const { t, i18n } = useTranslation();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href="#contact-form"
        className="press btn-peri inline-flex h-[50px] items-center rounded-md px-7 font-body text-[14.5px] font-medium text-primary-foreground"
      >
        {t("common.cta")}
      </a>

      {whatsappEnabled && (
        <a
          href={whatsappUrl(t("whatsapp.prefill"))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("WhatsApp Click", { location: "hero", language: i18n.language })}
          className="press btn-ghost inline-flex h-[50px] items-center gap-2 rounded-md px-6 font-body text-[14.5px] font-medium text-foreground"
        >
          <MessageCircle className="h-[17px] w-[17px]" strokeWidth={1.75} aria-hidden />
          {t("whatsapp.cta")}
        </a>
      )}
    </div>
  );
}

/* The Aprobar button's box in each pay image, in % of the image. */
const APPROVE_AT = {
  es: { left: 28.5, top: 69.3, width: 15.3, height: 6.8 },
  en: { left: 73.9, top: 67.3, width: 15.5, height: 7.2 },
};
type Box = (typeof APPROVE_AT)["es"];

/** The Nexus home cropped under its figures row, with two Pip cards hung below it: the
    answer with its chart and the approval card. All three are the real app rendered on
    test data, one image per theme and language. The crop (1920x830 of 1920x1200) stops
    before the lists so no half-covered rows peek out.
    Motion: the layers land one after another, drift with the pointer by depth, and a
    cursor presses Aprobar once the card is in view, which shows the payment as recorded. */
export function AppScreen() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "es";
  const reduced = useReducedMotion();
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const py = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const back = { x: useTransform(px, (v) => v * 8), y: useTransform(py, (v) => v * 8) };
  const mid = { x: useTransform(px, (v) => v * 16), y: useTransform(py, (v) => v * 16) };
  const front = { x: useTransform(px, (v) => v * 26), y: useTransform(py, (v) => v * 26) };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const themed = (path: (theme: string) => string, alt = "", cls = "") => (
    <>
      <img src={path("light")} alt={alt} loading="eager" className={`block w-full dark:hidden ${cls}`} />
      <img src={path("dark")} alt={alt} loading="eager" className={`hidden w-full dark:block ${cls}`} />
    </>
  );
  const card = "overflow-hidden rounded-xl border border-border shadow-[0_24px_60px_-20px_rgba(20,20,60,0.45)]";
  const land = (delay: number, from: { x?: number; y?: number }) => ({
    initial: { opacity: 0, ...from },
    animate: { opacity: 1, x: 0, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });
  const drift = (delay: number) => ({
    animate: { y: [0, -6, 0] },
    transition: { duration: 6, delay, repeat: Infinity, ease: "easeInOut" as const },
  });

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave}>
      <m.div style={back}>
        <m.div
          {...land(0.1, { y: 16 })}
          className="overflow-hidden rounded-xl border border-border shadow-[0_30px_80px_-30px_rgba(20,20,60,0.35)]"
          style={{ aspectRatio: "1920 / 830" }}
        >
          {themed((theme) => `/work/hero/nexus-home-${theme}-${lang}.jpg`, t("hero.screenshotAlt"), "h-full object-cover object-top")}
        </m.div>
      </m.div>
      <div className="relative -mt-3 ml-[4%]">
        <m.div style={mid} className="relative w-[48%]">
          <m.div {...land(0.45, { y: 28 })}>
            <m.div {...drift(1.4)} className={card}>
              {themed((theme) => `/work/pip/money-${theme}-${lang}.jpg`)}
            </m.div>
          </m.div>
        </m.div>
        <m.div style={front} className="absolute left-[44%] top-[16%] w-[46%]">
          <m.div {...land(0.8, { x: 28 })}>
            <m.div {...drift(2.2)} className="relative">
              <div className={card}>{themed((theme) => `/work/pip/pay-${theme}-${lang}.jpg`)}</div>
              <Approve at={APPROVE_AT[lang]} label={t("hero.approved")} reduced={!!reduced} />
            </m.div>
          </m.div>
        </m.div>
      </div>
    </div>
  );
}

/* A cursor glides onto Aprobar and presses it; a ring flashes on the button and a
   "recorded" chip lands on the card. Plays once. Reduced motion skips the cursor and
   shows the chip. */
function Approve({ at, label, reduced }: { at: Box; label: string; reduced: boolean }) {
  const box = { left: `${at.left}%`, top: `${at.top}%`, width: `${at.width}%`, height: `${at.height}%` };
  const tip = { left: `${at.left + at.width * 0.6}%`, top: `${at.top + at.height * 0.55}%` };
  const ref = useRef<HTMLSpanElement>(null);
  const go = useInView(ref, { once: true, amount: 0.6 });
  return (
    <>
      <span ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />
      {!reduced && (
        <>
          <m.span
            aria-hidden
            className="pointer-events-none absolute rounded-md ring-2 ring-primary"
            style={box}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={go ? { opacity: [0, 1, 0], scale: [0.9, 1.15, 1.3] } : undefined}
            transition={{ duration: 0.7, delay: 2.15, ease: EASE }}
          />
          <m.svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute h-6 w-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            style={{ ...tip, marginLeft: -4, marginTop: -2 }}
            initial={{ opacity: 0, x: 90, y: 70 }}
            animate={go ? { opacity: [0, 1, 1, 1, 0], x: [90, 90, 0, 0, 0], y: [70, 70, 0, 0, 0], scale: [1, 1, 1, 0.85, 1] } : undefined}
            transition={{ duration: 2.4, delay: 1, times: [0, 0.1, 0.5, 0.58, 1], ease: EASE }}
          >
            <path d="M4 2l16 9.5-7 1.6L9.5 20z" fill="white" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
          </m.svg>
        </>
      )}
      <m.span
        className="absolute -top-3 right-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 font-body text-[10.5px] md:-top-4 md:right-4 md:gap-1.5 md:px-3 md:py-1.5 md:text-[12px] font-medium text-primary-foreground shadow-[0_10px_30px_-8px_rgba(20,20,60,0.5)]"
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={go ? { opacity: 1, y: 0, scale: 1 } : undefined}
        transition={{ duration: 0.5, delay: reduced ? 0 : 2.35, ease: EASE }}
      >
        <Check className="h-3 w-3 md:h-3.5 md:w-3.5" strokeWidth={2.25} aria-hidden />
        {label}
      </m.span>
    </>
  );
}

export function Headline({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <h1 className={`font-heading tracking-[-0.035em] text-foreground ${className}`}>
      <span className="block font-normal text-foreground">{t("hero.headline")}</span>
      <span className="block font-semibold">{t("hero.headlineEmphasis")}</span>
    </h1>
  );
}
