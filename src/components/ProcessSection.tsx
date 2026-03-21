import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE, viewport } from "@/lib/motion";
import { SectionCTA } from "@/components/SectionCTA";

interface Step {
  title: string;
  description: string;
}

const STEP_NUMBERS = ["01", "02", "03"] as const;

const ProcessSection = () => {
  const { t } = useTranslation();
  const steps = t("process.steps", { returnObjects: true }) as Step[];

  return (
    <section id="process" className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("process.label")}
          </p>
          <h2 className="mx-auto max-w-2xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("process.headline")}{" "}
            <span className="text-gradient">{t("process.headlineGradient")}</span>
          </h2>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3 md:gap-0">
          <motion.div
            className="pointer-events-none absolute left-[8%] right-[8%] top-[44px] hidden h-px origin-center md:block"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 1.1, ease: EASE }}
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(var(--border)), hsl(var(--primary) / 0.35), hsl(var(--border)), transparent)",
            }}
            aria-hidden
          />

          {steps.map((step, i) => (
            <motion.div
              key={STEP_NUMBERS[i]}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.58,
                delay: 0.12 + i * 0.1,
                ease: EASE,
              }}
              className="relative text-center md:px-8"
            >
              <motion.div
                className="relative z-10 mx-auto mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-2xl border border-border bg-card"
                initial={{ scale: 0.92, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 22,
                  delay: 0.2 + i * 0.08,
                }}
                whileHover={{
                  borderColor: "hsl(var(--primary) / 0.45)",
                  boxShadow: "0 0 0 1px hsl(var(--primary) / 0.2)",
                }}
              >
                <span className="font-mono text-2xl font-medium text-primary">
                  {STEP_NUMBERS[i]}
                </span>
              </motion.div>
              <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs font-body text-sm font-light leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <SectionCTA label={t("process.cta")} />
      </div>
    </section>
  );
};

export default ProcessSection;
