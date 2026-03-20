import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 md:px-16 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-xs tracking-[0.35em] uppercase text-muted-foreground mb-8"
        >
          Crafted for the exceptional
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] tracking-tight text-foreground"
        >
          Where Vision
          <br />
          <span className="text-gradient-gold italic">Meets Mastery</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-body text-base md:text-lg text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed"
        >
          We build digital experiences that transcend the ordinary — refined, purposeful, and unmistakably premium.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-12 flex items-center justify-center gap-6"
        >
          <a
            href="#services"
            className="px-8 py-3.5 text-xs tracking-widest uppercase font-body font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-300"
          >
            Explore
          </a>
          <a
            href="#about"
            className="px-8 py-3.5 text-xs tracking-widest uppercase font-body font-medium border border-border text-foreground hover:border-primary/50 transition-colors duration-300"
          >
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1.3, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </section>
  );
};

export default HeroSection;
