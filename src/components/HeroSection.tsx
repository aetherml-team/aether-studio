import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-24 pt-28 md:px-10"
    >
      <div className="hero-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-bloom pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="noise-overlay" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: EASE }}
          className="mb-8 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
        >
          Intelligent Automation
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22, ease: EASE }}
          className="max-w-4xl font-heading text-balance text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          Automate the Mundane.{" "}
          <motion.span
            className="text-gradient inline-block"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          >
            Amplify Your Growth.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.48, ease: EASE }}
          className="mt-8 max-w-xl font-body text-lg font-light leading-relaxed text-muted-foreground"
        >
          We handle the boring processes so you can focus on building your
          empire. Automations, integrations, and reconciliation — done right.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.62, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <motion.a
            href="#contact"
            className="inline-flex h-12 items-center rounded-lg bg-primary px-7 font-body text-[14px] font-medium text-primary-foreground"
            whileHover={{ scale: 1.02, boxShadow: "0 0 32px hsl(240 30% 73% / 0.35)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            Get Your Free Audit
          </motion.a>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="font-mono text-xs text-muted-foreground"
          >
            Trusted by 20+ businesses
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
