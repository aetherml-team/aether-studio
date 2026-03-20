import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section id="contact" className="py-40 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      <div className="absolute top-16 left-16 w-40 h-40 rounded-full bg-accent/50 hidden lg:block" />
      <div className="absolute bottom-16 right-32 w-24 h-24 rounded-full bg-secondary/10 hidden lg:block" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-4xl relative z-10"
      >
        <p className="font-body text-[13px] font-medium tracking-wide text-muted-foreground mb-6">
          Start a project
        </p>
        <h2 className="font-heading text-5xl md:text-8xl text-foreground leading-[1.02]">
          Have an idea?
          <br />
          <span className="italic text-primary">Let's make it real.</span>
        </h2>

        <div className="mt-14 flex flex-col sm:flex-row items-start gap-5">
          <a
            href="mailto:hello@aether.studio"
            className="font-body text-[14px] font-medium text-primary-foreground bg-primary px-8 py-4 rounded-full hover:opacity-90 transition-opacity duration-300"
          >
            hello@aether.studio
          </a>
          <a
            href="#"
            className="font-body text-[14px] font-medium text-foreground border border-border px-8 py-4 rounded-full hover:bg-card transition-colors duration-300"
          >
            Book a call →
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
