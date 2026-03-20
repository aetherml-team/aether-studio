import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section id="contact" className="py-40 px-8 md:px-16 lg:px-24 border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-4xl"
      >
        <p className="font-body text-[13px] font-light tracking-wider uppercase text-muted-foreground mb-10">
          Start a project
        </p>
        <h2 className="font-heading text-5xl md:text-7xl font-light text-foreground leading-[1.05]">
          Have an idea?
          <br />
          <span className="italic text-primary">Let's make it real.</span>
        </h2>
        <a
          href="mailto:hello@aether.studio"
          className="inline-block mt-14 font-body text-[13px] font-light tracking-wider uppercase text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors duration-500"
        >
          hello@aether.studio →
        </a>
      </motion.div>
    </section>
  );
};

export default CTASection;
