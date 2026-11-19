import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Seo } from "@/components/Seo";
import { track } from "@/lib/analytics";
import "@/locales/funnel";

/** After a message or a booked call. `?type=booked` or `?type=message` picks the line. */
const Thanks = () => {
  const { t, i18n } = useTranslation();
  const [params] = useSearchParams();
  const booked = params.get("type") === "booked";
  const lang = i18n.language.startsWith("es") ? "es" : "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    track("Thank You Viewed", { type: booked ? "booked" : "message", language: lang });
  }, [booked, lang]);

  return (
    <div className="min-h-screen bg-background">
      <Seo title={t("funnel.thanksTitle")} path="/thanks" lang={lang} noindex />
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4 md:px-8">
        <span className="font-heading text-base font-semibold tracking-tight text-foreground">Æther</span>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-6 pb-24 pt-16 md:px-8 md:pt-24">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t(booked ? "funnel.thanksBooked" : "funnel.thanksMessage")}
        </h1>
        <p className="mt-4 font-body text-base leading-relaxed text-foreground/80">
          {t(booked ? "funnel.thanksBookedBody" : "funnel.thanksMessageBody")}
        </p>
        <h2 className="mt-10 font-heading text-lg font-semibold text-foreground">{t("funnel.thanksNext")}</h2>
        <p className="mt-2 font-body text-base leading-relaxed text-foreground/80">{t("funnel.thanksNextBody")}</p>
        <Link to="/" className="nav-link mt-10 inline-flex font-body text-sm text-foreground underline underline-offset-4">
          {t("funnel.thanksHome")}
        </Link>
      </main>
    </div>
  );
};

export default Thanks;
