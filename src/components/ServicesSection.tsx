import { motion } from "framer-motion";
import { CreditCard, Cog, Link2, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

interface Service {
  name: string;
  description: string;
  Icon: LucideIcon;
  span: string;
}

const services: Service[] = [
  {
    name: "Intelligent Automations",
    description:
      "Custom automation pipelines that eliminate repetitive tasks, reduce errors, and free your team for work that actually matters.",
    Icon: Cog,
    span: "sm:col-span-2 sm:row-span-1",
  },
  {
    name: "Seamless Integrations",
    description:
      "Connect your tools into one unified ecosystem. Data flows automatically between systems — no copy-pasting, no delays.",
    Icon: Link2,
    span: "sm:col-span-1 sm:row-span-1",
  },
  {
    name: "Payment Reconciliation",
    description:
      "Automated matching and verification of every transaction. Discrepancies caught in seconds, not days.",
    Icon: CreditCard,
    span: "sm:col-span-1 sm:row-span-1",
  },
  {
    name: "Process Optimization",
    description:
      "We audit, redesign, and implement workflows that cut bottlenecks and operational costs — measurably.",
    Icon: Workflow,
    span: "sm:col-span-2 sm:row-span-1",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            What we do
          </p>
          <h2 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Operations,{" "}
            <span className="text-gradient italic">on autopilot.</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.article
              key={service.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.58,
                delay: i * 0.07,
                ease: EASE,
              }}
              whileHover={{ y: -5 }}
              className={`shadow-lift group flex flex-col rounded-2xl border border-border bg-card p-8 lg:p-10 ${service.span}`}
            >
              <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                <service.Icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary-bright">
                {service.name}
              </h3>
              <p className="mt-3 font-body text-sm font-light leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
