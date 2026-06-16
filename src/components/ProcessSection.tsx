import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Radar, Workflow, Activity } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

interface Step {
  title: string;
  description: string;
}

const GLYPHS = [Radar, Workflow, Activity];

const ProcessSection = () => {
  const { t } = useTranslation();
  const steps = t("process.steps", { returnObjects: true }) as Step[];
  const deliverables = t("process.deliverables", { returnObjects: true }) as string[];

  return (
    <section id="process" className="seam-top bg-background-deep/40 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <m.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-14 max-w-2xl md:mb-20"
        >
          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("process.headline")}
          </h2>
          <p className="mt-5 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("process.description")}
          </p>
        </m.div>

        <div className="relative grid gap-12 md:grid-cols-3 md:gap-7">
          {/* connecting rail that fills as the row enters */}
          <div className="absolute left-1 right-1 top-[15px] hidden h-px bg-border md:block" aria-hidden>
            <m.div
              className="h-full origin-left bg-gradient-to-r from-primary via-primary/70 to-primary/25"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={viewport}
              transition={{ duration: 1.4, ease: EASE }}
            />
          </div>

          {steps.map((step, i) => {
            const Glyph = GLYPHS[i] ?? Radar;
            return (
              <m.div
                key={step.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.14, ease: EASE }}
                className="group relative pl-9 md:pl-0"
              >
                {/* node dot — sits on the rail (desktop) / on a left spine (mobile) */}
                <span
                  className="absolute left-0 top-1 z-10 block h-[11px] w-[11px] rounded-full bg-primary ring-4 ring-background-deep md:left-1 md:top-[10px]"
                  aria-hidden
                />
                <span
                  className="absolute left-[5px] top-1 block h-full w-px bg-border md:hidden"
                  aria-hidden
                />

                <div className="md:pt-10">
                  <div className="flex items-start justify-between">
                    <span className="font-heading text-5xl font-bold leading-none tracking-tight text-primary/25 transition-colors duration-300 group-hover:text-primary/45">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Glyph
                      className="mt-1 h-6 w-6 text-foreground-muted transition-colors duration-300 group-hover:text-primary"
                      strokeWidth={1.4}
                      aria-hidden
                    />
                  </div>

                  <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xs font-body text-[15px] font-light leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground-dim">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
                    {deliverables[i]}
                  </span>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
