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
   apps with customer data covered; until a capture exists the slot says so. */
const NexusSection = () => {
  const { t } = useTranslation();
  const items = t("nexus.items", { returnObjects: true }) as Item[];

  return (
    <Section id="nexus" title={t("nexus.headline")} lead={t("nexus.description")} deep>
      <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2">
        {items.map((item, i) => {
          const src = DEMO_SHOTS[i];
          return (
            <m.li
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.05, ease: EASE }}
              className="min-w-0"
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
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">{item.label}</p>
              <p className="mt-2 max-w-[42ch] font-heading text-[clamp(1.15rem,1.35vw,1.45rem)] font-medium leading-[1.25] tracking-[-0.02em] text-foreground">
                {item.line}
              </p>
            </m.li>
          );
        })}
      </ul>

      <m.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.45, ease: EASE }}
        className="glow-border mt-16 grid gap-8 rounded-lg border border-border bg-card p-6 md:p-10 lg:grid-cols-12 lg:gap-12"
      >
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">{t("nexus.pip.label")}</p>
          <p className="mt-3 font-heading text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
            {t("nexus.pip.headline")}
          </p>
          <p className="mt-4 max-w-[46ch] font-body text-[16px] leading-[1.55] text-foreground/70">{t("nexus.pip.line")}</p>
        </div>
        <ul className="flex flex-col items-end gap-3 self-center lg:col-span-7">
          {(t("nexus.pip.questions", { returnObjects: true }) as string[]).map((q) => (
            <li
              key={q}
              className="max-w-[90%] rounded-2xl rounded-br-sm border border-border bg-background px-5 py-3 font-body text-[16px] text-foreground"
            >
              {q}
            </li>
          ))}
        </ul>
      </m.div>
    </Section>
  );
};

export default NexusSection;
