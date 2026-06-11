import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE, viewport } from "@/lib/motion";
import { SectionCTA } from "@/components/SectionCTA";

const CheckFitSection = () => {
  const { t } = useTranslation();
  const audiences = t("checkFit.audiences", { returnObjects: true }) as string[];

  return (
    <section id="check-fit" className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.68, ease: EASE }}
          className="mb-14"
        >
          <h2 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("checkFit.headline")}
          </h2>
          <p className="mt-5 max-w-xl font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("checkFit.description")}
          </p>
        </motion.div>

        <div className="rounded-2xl border border-border bg-card/50 p-8 md:p-10">
          <ul className="grid gap-4 font-body text-[15px] leading-relaxed text-foreground/80 md:grid-cols-2 md:gap-x-12 md:gap-y-4">
            {audiences.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewport}
                transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-8 text-center font-body text-sm text-muted-foreground"
        >
          {t("checkFit.soundLikeYou")}
        </motion.p>

        <SectionCTA label={t("common.cta")} />
      </div>
    </section>
  );
};

export default CheckFitSection;
