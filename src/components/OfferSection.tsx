import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowDown } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";
import { SectionCTA } from "@/components/SectionCTA";
import { Section } from "@/components/Sheet";

interface Item {
  name: string;
  description: string;
}

interface Step {
  title: string;
  description: string;
}

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: 0.5, delay: Math.min(i, 3) * 0.05, ease: EASE },
});

const OfferSection = () => {
  const { t } = useTranslation();
  const items = t("stack.items", { returnObjects: true }) as Item[];
  const bonuses = t("stack.bonuses", { returnObjects: true }) as Item[];
  const steps = t("process.steps", { returnObjects: true }) as Step[];
  const deliverables = t("process.deliverables", { returnObjects: true }) as string[];
  const itemGroups = [items.slice(0, 2), items.slice(2, 4), items.slice(4, 6), items.slice(6, 8)];

  return (
    <Section id="offer" title={t("stack.headline")} lead={t("stack.description")} deep>
      <div className="nexus-board dot-field overflow-hidden border border-border bg-card text-foreground">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-6 md:flex-row md:items-center md:justify-between md:px-9">
          <div className="flex items-center gap-4">
            <span className="font-heading text-[22px] font-semibold tracking-[-0.04em]">Nexus</span>
            <span className="h-4 w-px bg-border" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">{t("stack.boardLabel")}</span>
          </div>
          <p className="font-body text-[14px] text-foreground/60">{t("process.description")}</p>
        </div>

        <ol className="grid md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <m.li
              key={step.title}
              {...reveal(i)}
              className="relative border-b border-border p-6 md:p-8 md:odd:border-r xl:border-b-0 xl:border-r xl:last:border-r-0"
            >
              <div className="mb-9 flex items-center justify-between">
                <span className="tnum font-mono text-[10px] tracking-[0.16em] text-primary">0{i + 1}</span>
                {i < steps.length - 1 && <ArrowDown className="h-4 w-4 text-foreground/25 xl:-rotate-90" strokeWidth={1.5} aria-hidden />}
              </div>
              <h3 className="font-heading text-[clamp(1.5rem,1.8vw,2rem)] font-semibold tracking-[-0.03em] text-foreground">
                {step.title}
              </h3>
              <div className="mt-8 space-y-6 border-t border-border pt-6">
                {itemGroups[i].filter(Boolean).map((item) => (
                  <div key={item.name}>
                    <h4 className="font-heading text-[16px] font-semibold tracking-[-0.015em] text-foreground/90">{item.name}</h4>
                  </div>
                ))}
              </div>

              <p className="mt-8 border-t border-border pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.13em] text-primary">
                {deliverables[i]}
              </p>
            </m.li>
          ))}
        </ol>

      </div>

      <div className="mt-10 grid gap-6 border-y border-border py-8 lg:grid-cols-[0.7fr_repeat(4,1fr)] lg:gap-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-primary">{t("stack.bonusLabel")}</p>
        {bonuses.map((bonus, i) => (
          <m.div key={bonus.name} {...reveal(i)}>
            <h3 className="font-heading text-[17px] font-semibold tracking-[-0.02em] text-foreground">{bonus.name}</h3>
          </m.div>
        ))}
      </div>

      <SectionCTA label={t("common.cta")} />
    </Section>
  );
};

export default OfferSection;
