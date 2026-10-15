import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE, viewport } from "@/lib/motion";
import { DEMO_SHOTS } from "@/content/offer";
import { Section } from "@/components/Sheet";

interface Item {
  label: string;
  line: string;
}

/* What Nexus does, one vertical per screen. Screens come from the live
   apps with customer data covered; until a capture exists the slot says so.
   An odd last screen spans the row with its caption beside it. */
const NexusSection = () => {
  const { t } = useTranslation();
  const items = t("nexus.items", { returnObjects: true }) as Item[];

  return (
    <Section id="nexus" title={t("nexus.headline")} lead={t("nexus.description")} deep>
      <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2">
        {items.map((item, i) => {
          const src = DEMO_SHOTS[i];
          const wide = items.length % 2 === 1 && i === items.length - 1;
          return (
            <m.li
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.45, delay: Math.min(i % 2, 1) * 0.05, ease: EASE }}
              className={`min-w-0 ${wide ? "md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-x-8" : ""}`}
            >
              <div
                className="glow-border overflow-hidden rounded-lg border border-border bg-card"
                style={{ aspectRatio: "1512 / 787" }}
              >
                {src ? (
                  <img src={src} alt={`${item.label}. ${item.line}`} loading="lazy" className="block h-full w-full object-cover object-top" />
                ) : (
                  <div className="dot-field grid h-full place-items-center border-2 border-dashed border-primary/40">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-primary">{t("nexus.shotPending")}</p>
                  </div>
                )}
              </div>
              <div className={wide ? "md:pl-2" : ""}>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary md:mt-5">{item.label}</p>
                <p className="mt-2 max-w-[42ch] font-heading text-[clamp(1.15rem,1.35vw,1.45rem)] font-medium leading-[1.25] tracking-[-0.02em] text-foreground">
                  {item.line}
                </p>
              </div>
            </m.li>
          );
        })}
      </ul>
    </Section>
  );
};

export default NexusSection;
