import { m, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, Minus } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";
import { SectionCTA } from "@/components/SectionCTA";

const CheckFitSection = () => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const fit = t("checkFit.audiences", { returnObjects: true }) as string[];
  const notFit = t("checkFit.notAudiences", { returnObjects: true }) as string[];

  const Column = ({
    label,
    items,
    kind,
    delay,
  }: {
    label: string;
    items: string[];
    kind: "fit" | "not";
    delay: number;
  }) => {
    const isFit = kind === "fit";
    return (
      <div className={isFit ? "" : "lg:pl-14"}>
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              isFit ? "bg-success/15 text-success" : "bg-muted text-foreground-muted"
            }`}
          >
            {isFit ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />}
          </span>
          <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-foreground-dim">
            {label}
          </span>
        </div>

        <ul className="mt-6 space-y-0">
          {items.map((item, i) => (
            <m.li
              key={item}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: delay + i * 0.08, ease: EASE }}
              className="flex items-start gap-3.5 border-t border-border/70 py-4"
            >
              <span
                className={`mt-0.5 shrink-0 ${isFit ? "text-success" : "text-foreground-muted/60"}`}
                aria-hidden
              >
                {isFit ? <Check className="h-4 w-4" strokeWidth={2} /> : <Minus className="h-4 w-4" strokeWidth={2} />}
              </span>
              <span
                className={`font-body text-[15px] leading-relaxed ${
                  isFit ? "text-foreground/90" : "text-muted-foreground"
                }`}
              >
                {item}
              </span>
            </m.li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section id="check-fit" className="seam-top px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <m.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.68, ease: EASE }}
          className="mb-8 max-w-2xl md:mb-12"
        >
          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("checkFit.headline")}
          </h2>
          <p className="mt-5 max-w-xl font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("checkFit.description")}
          </p>
        </m.div>

        <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-0">
          {/* center divider (desktop) */}
          <div className="absolute left-1/2 top-2 hidden h-[calc(100%-1rem)] w-px -translate-x-1/2 bg-border/70 lg:block" aria-hidden />
          <Column label={t("checkFit.fitLabel")} items={fit} kind="fit" delay={0.05} />
          <Column label={t("checkFit.notFitLabel")} items={notFit} kind="not" delay={0.12} />
        </div>

        <m.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12 text-center font-body text-sm text-muted-foreground"
        >
          {t("checkFit.soundLikeYou")}
        </m.p>

        <SectionCTA label={t("common.cta")} />
      </div>
    </section>
  );
};

export default CheckFitSection;
