import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-24 pb-16 relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-32 right-16 lg:right-32 w-64 h-64 rounded-full bg-accent/60 hidden lg:block" />
      <div className="absolute bottom-24 right-48 w-20 h-20 rounded-full bg-secondary/10 hidden lg:block" />

      <div className="max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-3 mb-12"
        >
          <div className="w-2 h-2 rounded-full bg-secondary" />
          <p className="font-body text-[13px] font-medium tracking-wide text-muted-foreground">
            Digital Design Studio
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.1, 0, 1] }}
          className="font-heading text-[clamp(3.5rem,9vw,9rem)] leading-[0.92] tracking-tight text-foreground"
        >
          We craft digital
          <br />
          experiences that
          <br />
          <span className="italic text-primary">feel different</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-14 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <p className="font-body text-base font-light text-muted-foreground max-w-md leading-relaxed">
            Strategy, design, and engineering for brands that believe
            in the power of exceptional digital presence.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#contact"
              className="font-body text-[14px] font-medium text-primary-foreground bg-primary px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity duration-300"
            >
              Get in touch
            </a>
            <a
              href="#work"
              className="font-body text-[14px] font-medium text-foreground border border-border px-7 py-3.5 rounded-full hover:bg-card transition-colors duration-300"
            >
              View work
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
