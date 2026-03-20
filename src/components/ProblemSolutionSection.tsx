import { motion } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";
import { SectionCTA } from "@/components/SectionCTA";

const tags = ["Zero manual entry", "Real-time sync", "99.8% accuracy"] as const;

const ProblemSolutionSection = () => {
  return (
    <section id="problem-solution" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-5 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.72, ease: EASE }}
          className="flex flex-col justify-center lg:col-span-2"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-red-400/70">
            The problem
          </p>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Your team is drowning in{" "}
            <span className="text-gradient">manual work</span>
          </h2>
          <p className="mt-5 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            Chasing payments across three apps. Copy-pasting data between
            systems that should talk to each other. Reconciling transactions
            in a spreadsheet at midnight. Every hour spent on operational toil
            is an hour not spent growing your business.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.72, delay: 0.08, ease: EASE }}
          className="glow-border rounded-2xl border border-border bg-card p-8 lg:col-span-3 lg:p-12"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
            The solution
          </p>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            We turned 3-day reconciliation into{" "}
            <span className="text-gradient">12 minutes.</span>
          </h2>
          <p className="mt-5 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            æther transforms operational chaos into workflows that run while
            you sleep. Automations that connect every tool in your stack,
            reconciliation that never misses a cent, and reminders that go out
            before you even think about them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.06, ease: EASE }}
                className="badge-peri"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <SectionCTA label="Stop wasting time — talk to us" className="mx-auto max-w-7xl" />
    </section>
  );
};

export default ProblemSolutionSection;
