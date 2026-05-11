import { motion } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";
import { SectionCTA } from "@/components/SectionCTA";

const logos = ["KrakenBay", "Tavros", "Eternus", "Inmovilia"];

const testimonials = [
  {
    quote:
      "Æther transformed our back-office operations. We've reclaimed over 30 hours a week that we now spend on clients.",
    author: "Operations Director",
    company: "Healthcare Startup",
  },
  {
    quote:
      "The automation solutions were a game-changer. Our reconciliation went from days to minutes with near-perfect accuracy.",
    author: "Head of Finance",
    company: "E-commerce Platform",
  },
] as const;

const audiences = [
  "Startups looking to scale efficiently",
  "Small businesses seeking operational freedom",
  "Business owners tired of administrative burden",
  "Companies aiming to reduce toil and boost productivity",
] as const;

const WhoWeHelpSection = () => {
  return (
    <section id="who-we-help" className="overflow-hidden">
      <div className="border-y border-border py-10 md:py-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          className="mb-6 text-center font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Trusted by teams at
        </motion.p>
        <div className="relative mx-auto max-w-7xl px-6 md:px-10">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent md:w-32"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent md:w-32"
            aria-hidden
          />
          <div className="animate-marquee flex w-max whitespace-nowrap">
            {[0, 1].map((setIndex) => (
              <div
                key={setIndex}
                className="flex shrink-0 items-center gap-16 pr-16 md:gap-24 md:pr-24"
              >
                {logos.map((name) => (
                  <span
                    key={name}
                    className="select-none font-heading text-xl font-semibold text-foreground/15 transition-colors duration-500 hover:text-foreground/25 md:text-2xl"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.68, ease: EASE }}
            className="mb-14 md:mb-16"
          >
            <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Who we help
            </p>
            <h2 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Built for teams that refuse to waste time
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.company}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.58,
                  delay: i * 0.1,
                  ease: EASE,
                }}
                whileHover={{
                  y: -3,
                  transition: { duration: 0.25 },
                }}
                className="rounded-2xl border border-border bg-card p-8 shadow-lift md:p-10"
              >
                <p className="font-body text-base font-light leading-relaxed text-foreground/90 md:text-lg">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/70">
                    {t.author}
                  </span>
                  <span className="text-border">/</span>
                  <span>{t.company}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            className="mt-12 rounded-2xl border border-border bg-card/50 p-8 md:p-10"
          >
            <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              We work with
            </p>
            <ul className="grid gap-3 font-body text-[15px] leading-relaxed text-foreground/80 md:grid-cols-2 md:gap-x-12 md:gap-y-2.5">
              {audiences.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                  className="flex items-center gap-3"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <SectionCTA label="See if we're a fit" />
        </div>
      </div>
    </section>
  );
};

export default WhoWeHelpSection;
