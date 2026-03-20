import { motion } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";
import { SectionCTA } from "@/components/SectionCTA";

const audiences = [
  "Startups scaling fast with a team too small for the ops workload",
  "Small businesses (gyms, clinics, real estate) buried in admin",
  "Founders who know their time is worth more than data entry",
  "Companies where reconciliation still lives in a spreadsheet",
] as const;

const CheckFitSection = () => {
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
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Is this for you?
          </p>
          <h2 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            We&apos;re not{" "}
            <span className="text-gradient">for everyone.</span>
          </h2>
          <p className="mt-5 max-w-xl font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            We take on 3 new clients per month so we can go deep, not wide.
            Here&apos;s who gets the most out of working with us.
          </p>
        </motion.div>

        <div className="rounded-2xl border border-border bg-card/50 p-8 md:p-10">
          <ul className="grid gap-4 font-body text-[15px] leading-relaxed text-foreground/80 md:grid-cols-2 md:gap-x-12 md:gap-y-4">
            {audiences.map((item, i) => (
              <motion.li
                key={item}
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
          className="mt-8 text-center font-mono text-xs text-muted-foreground"
        >
          Sound like you? We should talk.
        </motion.p>

        <SectionCTA label="Check availability" />
      </div>
    </section>
  );
};

export default CheckFitSection;
