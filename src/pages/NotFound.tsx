import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Seo } from "@/components/Seo";
import Footer from "@/components/Footer";
import { EASE } from "@/lib/motion";

const NotFound = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language.startsWith("es") ? "es" : "en";

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Seo title="404 · Æther" path={location.pathname} lang={lang} noindex />

      <header className="border-b border-border/85 bg-background/88 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4 md:px-8">
          <Link
            to="/"
            className="nav-link inline-flex items-center gap-2 font-heading text-base font-semibold tracking-tight text-foreground"
            aria-label={t("notFound.homeCta")}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Æther
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        id="main"
        className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24 text-center"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--primary) / 0.07), transparent 70%)",
          }}
          aria-hidden
        />
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 mx-auto max-w-lg"
        >
          <p className="font-mono text-sm uppercase tracking-[0.22em] text-primary">
            {t("notFound.code")}
          </p>
          <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("notFound.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-md font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("notFound.description")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-7 font-body text-[14px] font-medium text-primary-foreground transition-transform hover:scale-[1.02] sm:w-auto"
            >
              {t("notFound.homeCta")}
            </Link>
            <Link
              to="/#contact"
              className="inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-lg border border-border px-7 font-body text-[14px] font-medium text-foreground transition-colors hover:bg-card sm:w-auto"
            >
              {t("notFound.contactCta")}
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </m.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
