import { motion } from "framer-motion";
import { SectionCTA } from "@/components/SectionCTA";
import { Brain, Puzzle, Rocket } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

const features = [
  {
    headline: "Growth Over Grunt Work",
    description:
      "We handle the operational complexity so you can pour every resource into innovation, customers, and revenue.",
    Icon: Rocket,
  },
  {
    headline: "Tailored, Not Templated",
    description:
      "Every solution is custom-built for your stack, your workflows, and your goals. No cookie-cutter automations.",
    Icon: Puzzle,
  },
  {
    headline: "Deep Expertise",
    description:
      "Years of experience in AI and process engineering means we ship solutions that actually work — and keep working.",
    Icon: Brain,
  },
] as const;

const WhyAetherSection = () => {
  return (
    <section id="why-aether" className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.68, ease: EASE }}
          className="mb-16"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Why Æther
          </p>
          <h2 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            The Æther edge
          </h2>
        </motion.div>

        <div className="grid gap-0 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {features.map(({ headline, description, Icon }, i) => (
            <motion.div
              key={headline}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.58,
                delay: i * 0.1,
                ease: EASE,
              }}
              className="group py-8 transition-colors duration-300 md:px-10 md:py-0 md:first:pl-0 md:last:pr-0 md:hover:bg-card/40"
            >
              <motion.span
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </motion.span>
              <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary-bright">
                {headline}
              </h3>
              <p className="mt-3 font-body text-sm font-light leading-relaxed text-muted-foreground">
                {description}
              </p>
            </motion.div>
          ))}
        </div>

        <SectionCTA label="Partner with Æther" />
      </div>
    </section>
  );
};

export default WhyAetherSection;
