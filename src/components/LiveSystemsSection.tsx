import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Instagram } from "lucide-react";
import { SYSTEMS } from "@/content/offer";
import { EASE, viewport } from "@/lib/motion";
import { Logo } from "@/components/Logo";
import { Section } from "@/components/Sheet";
import { SectionCTA } from "@/components/SectionCTA";

interface CaseCopy {
  name: string;
  type: string;
  problem: string;
  built: string;
  /** TODO(metric): one measured number per client. Empty hides the slot. */
  metric: string;
  /** TODO(quote): one approved owner quote plus who said it. Empty hides the slot. */
  quote: string;
  quoteBy: string;
}

/* Client cases: who, the problem, what we built, and the result once a
   client gives us a measured number or a quote. Nothing here is invented. */
const LiveSystemsSection = () => {
  const { t } = useTranslation();
  const copy = t("systems.items", { returnObjects: true }) as CaseCopy[];
  const label = "font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-dim";
  const link = "inline-flex items-center gap-1 font-mono text-[11.5px] text-foreground-dim underline-offset-4 hover:text-foreground hover:underline";

  return (
    <Section id="systems" title={t("systems.headline")} lead={t("systems.description")}>
      <ul className="border-t border-border">
        {SYSTEMS.map((sys, i) => {
          const c = copy[i];
          if (sys.upcoming || !c) return null;
          return (
            <m.li
              key={sys.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.45, ease: EASE }}
              className="grid gap-6 border-b border-border py-8 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3">
                  <Logo slug={sys.slug} name={c.name} dark={sys.logoDark} />
                  <div className="min-w-0">
                    <h3 className="font-heading text-[16px] font-semibold leading-tight tracking-[-0.015em] text-foreground">{c.name}</h3>
                    <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-primary">{c.type}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {sys.store && (
                    <a href={sys.store} target="_blank" rel="noopener noreferrer" className={link}>
                      {t(sys.slug === "weddingmethod" ? "systems.visitCourse" : "systems.visitStore")}
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                    </a>
                  )}
                  {sys.site && (
                    <a href={sys.site} target="_blank" rel="noopener noreferrer" className={link}>
                      {t("systems.visitSite")}
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                    </a>
                  )}
                  {sys.instagram && (
                    <a href={sys.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram, ${c.name}`} className={link}>
                      <Instagram className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                      Instagram
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-3">
                <p className={label}>{t("systems.problemLabel")}</p>
                <p className="mt-2 font-body text-[16px] leading-[1.55] text-foreground/75">{c.problem}</p>
              </div>

              <div className="lg:col-span-3">
                <p className={label}>{t("systems.builtLabel")}</p>
                <p className="mt-2 font-body text-[16px] leading-[1.55] text-foreground/75">{c.built}</p>
              </div>

              {(c.metric || c.quote) && (
                <div className="lg:col-span-3">
                  <p className={label}>{t("systems.resultLabel")}</p>
                  {c.metric && (
                    <p className="mt-2 font-heading text-[clamp(1.2rem,1.5vw,1.6rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-foreground">
                      {c.metric}
                    </p>
                  )}
                  {c.quote && (
                    <blockquote className="mt-3 font-body text-[15.5px] leading-[1.55] text-foreground/75">
                      “{c.quote}”
                      {c.quoteBy && <footer className="mt-1 text-[13px] text-foreground-dim">{c.quoteBy}</footer>}
                    </blockquote>
                  )}
                </div>
              )}
            </m.li>
          );
        })}
      </ul>

      <SectionCTA label={t("common.cta")} className="mt-8" />
    </Section>
  );
};

export default LiveSystemsSection;
