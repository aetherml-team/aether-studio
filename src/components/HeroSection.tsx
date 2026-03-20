import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-20 pt-32">
      <div className="max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-body text-[13px] font-light tracking-wider uppercase text-muted-foreground mb-10"
        >
          Digital Studio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.1, 0, 1] }}
          className="font-heading text-[clamp(3rem,8vw,8rem)] font-light leading-[0.9] tracking-tight text-foreground"
        >
          We design
          <br />
          digital experiences
          <br />
          <span className="italic text-primary">worth remembering</span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="mt-16 flex items-end justify-between"
      >
        <p className="font-body text-sm font-light text-muted-foreground max-w-sm leading-relaxed hidden md:block">
          Strategy, design, and development for brands that refuse to blend in.
        </p>
        <a
          href="#services"
          className="font-body text-[13px] font-light tracking-wider uppercase text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-500"
        >
          Scroll to explore
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
