import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Workflow,
  Sparkles,
  Network,
  ReceiptText,
  MonitorSmartphone,
  Gauge,
  BadgeCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

interface ServiceTranslation {
  name: string;
  description: string;
  proof: string;
}

/* Friendlier than the old table: an explorer. Pick a service on the left, its
   detail and — the persuasive part — its real client "receipt" reveal on the
   right. Icons key by index, with a safe fallback if the copy grows. */
const ICONS: LucideIcon[] = [Workflow, Sparkles, Network, ReceiptText, MonitorSmartphone, Gauge];

const ServicesSection = () => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const items = t("services.items", { returnObjects: true }) as ServiceTranslation[];
  const [sel, setSel] = useState(0);

  const active = items[sel] ?? items[0];
  const ActiveIcon = ICONS[sel] ?? Workflow;
  const receiptLabel = t("services.receiptLabel", { defaultValue: "The receipt" });

  return (
    <section id="services" className="seam-top px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 max-w-2xl md:mb-16"
        >
          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("services.headline")}
          </h2>
          <p className="mt-4 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("services.description")}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          {/* selector */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col border-t border-border"
          >
            {items.map((service, i) => {
              const Icon = ICONS[i] ?? Workflow;
              const on = i === sel;
              return (
                <button
                  key={service.name}
                  type="button"
                  onClick={() => setSel(i)}
                  onMouseEnter={() => setSel(i)}
                  aria-pressed={on}
                  className={`group flex items-center gap-3.5 border-b border-border py-4 text-left transition-colors duration-300 ${
                    on ? "" : "hover:bg-muted/20"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                      on ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-foreground-muted"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
                  </span>
                  <span
                    className={`flex-1 font-heading text-lg font-semibold tracking-tight transition-colors duration-300 ${
                      on ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {service.name}
                  </span>
                  <ArrowRight
                    className={`h-4 w-4 shrink-0 text-primary transition-all duration-300 ${
                      on ? "translate-x-0 opacity-100" : "-translate-x-1.5 opacity-0"
                    }`}
                    aria-hidden
                  />
                </button>
              );
            })}
          </motion.div>

          {/* detail */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={sel}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="glow-border rounded-2xl border border-border bg-card/60 p-7 md:p-9"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ActiveIcon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-[1.7rem]">
                  {active.name}
                </h3>
                <p className="mt-3 max-w-xl font-body text-[15.5px] font-light leading-relaxed text-muted-foreground">
                  {active.description}
                </p>

                <div className="mt-7 flex items-start gap-3.5 rounded-xl border border-success/25 bg-success/[0.06] p-4">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" strokeWidth={2} aria-hidden />
                  <div>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-dim">
                      {receiptLabel}
                    </p>
                    <p className="mt-1 font-body text-[14.5px] font-medium leading-relaxed text-foreground/90">
                      {active.proof}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
