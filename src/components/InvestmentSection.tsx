import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Clock, Plus, ShieldCheck } from "lucide-react";
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
          const line = "flex gap-2.5 font-body text-[15px] leading-[1.45]";
          return (
            <m.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.05, ease: EASE }}
              className={`glow-border relative flex flex-col rounded-xl border bg-card p-7 text-foreground md:p-8 ${
                featured ? "border-primary/70 shadow-[0_24px_70px_-30px_hsl(var(--primary)/0.6)]" : "border-border"
              }`}
            >
              <div className="flex h-6 items-center justify-between gap-3">
                <span className="tnum font-mono text-[11px] tracking-[0.14em] text-foreground-dim">0{i + 1}</span>
                {featured && (
                  <span className="rounded-full bg-primary px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary-foreground">
                    {t("investment.recommended")}
                  </span>
                )}
              </div>
              <h3 className="mt-5 font-heading text-[clamp(1.5rem,1.9vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.024em]">
                {p.name}
              </h3>
              <p className="mt-3 font-body text-[16px] leading-[1.55] text-foreground/70">{p.scope}</p>

              <ul className="mt-7 space-y-3 border-t border-border pt-6">
                {p.bullets.map((bullet, j) => {
                  const Icon = i > 0 && j === 0 ? Plus : Check;
                  return (
                    <li key={bullet} className={`${line} ${i > 0 && j === 0 ? "text-foreground-dim" : "text-foreground/80"}`}>
                      <Icon className="mt-[3px] h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                      {bullet}
                    </li>
                  );
                })}
              </ul>
              {p.soon && (
                <>
                  <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-dim">{t("investment.soon")}</p>
                  <ul className="mt-3 space-y-3">
                    {p.soon.map((s) => (
                      <li key={s} className={`${line} text-foreground-dim`}>
                        <Clock className="mt-[3px] h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                        {s}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-auto pt-8">
              <a
                href="#contact-form"
                className={`press flex h-[48px] items-center justify-center rounded-md px-6 font-body text-[14.5px] font-medium ${
                  featured ? "btn-peri text-primary-foreground" : "btn-ghost text-foreground"
                }`}
              >
                {t("common.cta")}
              </a>
              </div>
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
        </div>
      </m.div>
    </Section>
  );
};

export default InvestmentSection;
