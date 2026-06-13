import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Seo } from "@/components/Seo";
import Footer from "@/components/Footer";
import { EASE } from "@/lib/motion";
import type { LegalDoc } from "@/content/legal";

type Props = {
  /** The document copy for both languages. */
  doc: Record<"en" | "es", LegalDoc>;
  /** Route path beginning with "/", for the canonical URL. */
  path: string;
};

const LegalPage = ({ doc, path }: Props) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language.startsWith("es") ? "es" : "en";
  const content = doc[lang];

  // New route should start at the top, regardless of prior scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${content.title} · Æther`}
        description={content.metaDescription}
        path={path}
        lang={lang}
      />
      {/* Lightweight header — the home page's anchor nav doesn't apply here. */}
      <header className="border-b border-border/85 bg-background/88 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4 md:px-8">
          <Link
            to="/"
            className="nav-link inline-flex items-center gap-2 font-heading text-base font-semibold tracking-tight text-foreground"
            aria-label={t("legal.backHome")}
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

      <main id="main" className="mx-auto max-w-3xl px-6 pb-16 pt-8 md:px-8 md:pb-24 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {content.title}
          </h1>
          <p className="mt-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {content.updated}
          </p>

          <div className="mt-8 space-y-4">
            {content.intro.map((p, i) => (
              <p
                key={i}
                className="font-body text-[15px] font-light leading-relaxed text-foreground/80"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="gradient-strip my-12 opacity-60" aria-hidden />

          <div className="space-y-10">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="mt-3 font-body text-[15px] font-light leading-relaxed text-foreground/75"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex gap-3 font-body text-[15px] font-light leading-relaxed text-foreground/75"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                          aria-hidden
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {content.closing && (
            <p className="mt-12 border-t border-border pt-8 font-body text-sm font-light leading-relaxed text-muted-foreground">
              {content.closing}
            </p>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
