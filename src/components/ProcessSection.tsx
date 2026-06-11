import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE, viewport } from "@/lib/motion";

interface Step {
  title: string;
  description: string;
}

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
          className="mb-14 md:mb-20"
        >
          <h2 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("process.headline")}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connecting path — same drawn-line vocabulary as the hero orbital mark */}
          <motion.div
            className="pointer-events-none absolute left-[5px] top-2 bottom-2 w-px origin-top md:bottom-auto md:left-0 md:right-0 md:top-[5px] md:h-px md:w-auto md:origin-left"
            initial={{ scaleY: 0, scaleX: 1, opacity: 0 }}
            whileInView={{ scaleY: 1, scaleX: 1, opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 1.1, ease: EASE }}
            style={{
              background:
                "linear-gradient(to bottom, hsl(var(--primary) / 0.45), hsl(var(--border)))",
            }}
            aria-hidden
          />

          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: EASE }}
                className="relative pl-8 md:pl-0"
              >
                <span
                  className="absolute left-0 top-1.5 z-10 block h-[11px] w-[11px] rounded-full bg-primary ring-4 ring-background md:relative md:left-auto md:top-auto md:mb-6"
                  aria-hidden
                />
                <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs font-body text-[15px] font-light leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
