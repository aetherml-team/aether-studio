import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ContactSection from "@/components/ContactSection";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Seo } from "@/components/Seo";
import "@/locales/funnel";

/**
 * Where a Meta ad lands: the booking panel and the message form, with no menu to wander off to.
 * A sent message or a booked call goes to /thanks, keeping the ad's query string.
 */
const Start = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language.startsWith("es") ? "es" : "en";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function thanks(kind: "message" | "booked") {
    const params = new URLSearchParams(window.location.search);
    params.set("type", kind);
    navigate(`/thanks?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo title={t("funnel.startTitle")} description={t("funnel.startDescription")} path="/start" lang={lang} noindex />
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 md:px-8">
        <span className="font-heading text-base font-semibold tracking-tight text-foreground">Æther</span>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>
      <main id="main">
        <ContactSection onSent={thanks} formFirst />
      </main>
    </div>
  );
};

export default Start;
