import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE, viewport } from "@/lib/motion";
import { Section } from "@/components/Sheet";

/* The six operating-pain signals, in the owner's words. Two columns of pull
   quotes, each attributed directly underneath — the attribution used to sit
   out at the far margin with a quarter of the screen between it and the line
   it belonged to. The job is a nod, not an argument. */
const PainSection = () => {
  const { t } = useTranslation();
  const allSignals = t("pain.signals", { returnObjects: true }) as { q: string; who: string }[];
  const signals = allSignals.slice(0, 4);
  return (
    <Section id="pain" title={t("pain.headline")} lead={t("pain.description")}>
      <ul className="grid border-y border-border lg:grid-cols-2">
        {signals.map((s, i) => (
          <m.li
            key={s.q}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.03, ease: EASE }}
            className="min-h-28 border-b border-border px-1 py-7 last:border-b-0 lg:odd:border-r lg:odd:pr-10 lg:even:pl-10 lg:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <p className="max-w-[30ch] font-heading text-[clamp(1.2rem,1.45vw,1.65rem)] font-medium leading-[1.2] tracking-[-0.025em] text-foreground">
              {s.q}
            </p>
          </m.li>
        ))}
      </ul>
      <p className="mt-6 max-w-[58ch] font-body text-[15px] leading-relaxed text-foreground/65">{t("pain.closer")}</p>
    </Section>
  );
};

export default PainSection;
