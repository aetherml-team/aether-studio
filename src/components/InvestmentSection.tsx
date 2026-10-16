import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";
import { Section } from "@/components/Sheet";
import { PRICING, mxn } from "@/content/offer";

interface Pkg {
  name: string;
  scope: string;
  bullets: string[];
  /** Planned, not built yet: shown with a "Próximamente" tag. */
  soon?: string[];
}

const InvestmentSection = () => {
  const { t } = useTranslation();
  const pkgs = t("investment.packages", { returnObjects: true }) as Pkg[];

  return (
    <Section id="investment" title={t("investment.headline")} lead={t("investment.description")}>
      <div className="grid gap-5 lg:grid-cols-3">
        {pkgs.map((p, i) => {
          const featured = i === 1;
          return (
            <m.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.03, ease: EASE }}
              className={`group flex flex-col overflow-hidden border p-7 md:p-8 ${
                featured
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_20px_60px_-30px_hsl(var(--primary)/0.65)]"
                  : "border-border bg-card text-foreground"
              }`}
            >
              <h3 className="font-heading text-[clamp(1.5rem,1.9vw,2.1rem)] font-semibold tracking-[-0.024em]">
                {p.name}
              </h3>
              <p className={`mt-2 font-body text-[16px] leading-[1.6] ${featured ? "text-primary-foreground/80" : "text-foreground/70"}`}>
                {p.scope}
              </p>

              <ul className={`mt-6 divide-y border-y ${featured ? "divide-primary-foreground/20 border-primary-foreground/20" : "divide-border border-border"}`}>
                {p.bullets.map((bullet) => (
                  <li key={bullet} className={`py-3 font-body text-[15.5px] leading-snug ${featured ? "text-primary-foreground/90" : "text-foreground/70"}`}>
                    {bullet}
                  </li>
                ))}
                {p.soon?.map((line) => (
                  <li key={line} className={`flex items-baseline justify-between gap-3 py-3 font-body text-[15.5px] leading-snug ${featured ? "text-primary-foreground/90" : "text-foreground/70"}`}>
                    {line}
                    <span className="shrink-0 rounded-full border border-current px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] opacity-70">
                      {t("investment.soon")}
                    </span>
                  </li>
                ))}
              </ul>

            </m.div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        {PRICING.fase1.implementation !== null && (
          <p className="font-heading text-[clamp(1.35rem,2vw,2rem)] font-semibold tracking-[-0.022em] text-foreground">
            {t("investment.priceFrom", { price: mxn(PRICING.fase1.implementation) })}
          </p>
        )}
        <p className="font-body text-[16px] text-foreground/70">{t("investment.priceFixed")}</p>
      </div>

      <m.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.45, ease: EASE }}
        className="dot-field mt-8 grid gap-6 border border-border bg-card p-8 text-foreground md:p-10 lg:grid-cols-12 lg:gap-12"
      >
        <p className="flex items-baseline gap-2.5 self-start font-mono text-[11px] uppercase tracking-[0.12em] text-primary lg:col-span-3">
          <ShieldCheck className="h-4 w-4 shrink-0 translate-y-[3px] text-primary" strokeWidth={1.75} aria-hidden />
          {t("investment.guaranteeLabel")}
        </p>
        <div className="lg:col-span-9">
          <p className="font-heading text-[clamp(1.35rem,2vw,2rem)] font-semibold leading-snug tracking-[-0.022em] text-foreground">
            {t("investment.guaranteeTitle")}
          </p>
          <p className="mt-3 max-w-[68ch] font-body text-[16px] leading-[1.65] text-foreground/65">
            {t("investment.guaranteeBody")}
          </p>
          <p className="mt-3 max-w-[68ch] font-body text-[15px] leading-relaxed text-foreground/55">
            {t("investment.feasibility")}
          </p>
        </div>
      </m.div>
    </Section>
  );
};

export default InvestmentSection;
