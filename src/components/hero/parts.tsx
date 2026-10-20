import { useTranslation } from "react-i18next";
import { m } from "framer-motion";
import { MessageCircle } from "lucide-react";
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

/** The Nexus home cropped under its figures row, with two Pip cards hung below it: the
    answer with its chart and the approval card. All three are the real app rendered on
    test data, one image per theme and language. The crop (1920x830 of 1920x1200) stops
    before the lists so no half-covered rows peek out.
    Motion: the three layers fade up once, one after another, then hold still so the
    screenshots stay sharp. */
export function AppScreen() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "es";
  const themed = (path: (theme: string) => string, alt = "", cls = "") => (
    <>
      <img src={path("light")} alt={alt} loading="eager" className={`block w-full dark:hidden ${cls}`} />
      <img src={path("dark")} alt={alt} loading="eager" className={`hidden w-full dark:block ${cls}`} />
    </>
  );
  const card = "overflow-hidden rounded-xl border border-border shadow-[0_24px_60px_-20px_rgba(20,20,60,0.45)]";
  const land = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });
  return (
    <div>
      <m.div
        {...land(0.1)}
        className="overflow-hidden rounded-xl border border-border shadow-[0_30px_80px_-30px_rgba(20,20,60,0.35)]"
        style={{ aspectRatio: "1920 / 830" }}
      >
        {themed((theme) => `/work/hero/nexus-home-${theme}-${lang}.jpg`, t("hero.screenshotAlt"), "h-full object-cover object-top")}
      </m.div>
      <div className="relative -mt-3 ml-[4%]">
        <m.div {...land(0.35)} className={`${card} relative w-[48%]`}>
          {themed((theme) => `/work/pip/money-${theme}-${lang}.jpg`)}
        </m.div>
        <m.div {...land(0.6)} className={`${card} absolute left-[44%] top-[16%] w-[46%]`}>
          {themed((theme) => `/work/pip/pay-${theme}-${lang}.jpg`)}
        </m.div>
      </div>
    </div>
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
