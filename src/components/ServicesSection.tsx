import { motion } from "framer-motion";
import { SectionCTA } from "@/components/SectionCTA";
import { CreditCard, Cog, Link2, Workflow, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

interface Service {
  name: string;
  description: string;
  proof: string;
  Icon: LucideIcon;
}

const services: Service[] = [
  {
    name: "Custom Automations",
    description:
      "Workflows that run while you sleep. We eliminate every repetitive task in your ops — scheduling, follow-ups, billing, you name it.",
    proof: "KrakenBay saves 30+ hours/week on scheduling and billing alone.",
    Icon: Cog,
  },
  {
    name: "System Integrations",
    description:
      "Your tools should talk to each other. CRM to calendar, payments to accounting, sales to fulfillment — we connect them so data stops falling through the cracks.",
    proof: "Inmovilia's sales-to-construction handoff went from days to instant.",
    Icon: Link2,
  },
  {
    name: "Payment Reconciliation",
    description:
      "Stop reconciling transactions by hand. We automate the matching and verification of every payment across terminals, banks, and platforms.",
    proof: "Tavros cut billing cycles by 3x — no more chasing late renewals.",
    Icon: CreditCard,
  },
  {
    name: "Digital Presence",
    description:
      "Landing pages, client portals, and portfolio sites built to convert. If your online presence doesn't match the quality of your work, we fix that too.",
    proof: "Eternus went from a mismatched page to a portfolio that actually closes clients.",
    Icon: Globe,
  },
  {
    name: "Process Optimization",
    description:
      "We audit, redesign, and implement workflows that cut bottlenecks and operational costs — measurably, not theoretically.",
    proof: "Most clients recover the engagement cost in the first 60 days.",
    Icon: Workflow,
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
            You didn&apos;t start a business{" "}
            <span className="text-gradient italic">to babysit spreadsheets.</span>
          </h2>
          <p className="mt-4 max-w-xl font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            Every service below comes with receipts — real results from real
            clients, not numbers from a pitch deck.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              className="shadow-lift group flex flex-col rounded-2xl border border-border bg-card p-8"
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
              <p className="mt-auto pt-5 font-mono text-[11px] font-medium leading-snug text-primary/80">
                {service.proof}
              </p>
            </motion.article>
          ))}
        </div>

        <SectionCTA label="See what we can do for you" />
      </div>
    </section>
  );
};

export default ServicesSection;
