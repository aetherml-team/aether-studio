import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section id="contact" className="py-32 px-8 md:px-16 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-xs tracking-[0.35em] uppercase text-primary mb-4">
            Start a Project
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-medium text-foreground leading-tight">
            Let's create something{" "}
            <span className="italic text-gradient-gold">remarkable</span>
          </h2>
          <p className="font-body text-base text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed">
            Ready to elevate your digital presence? We'd love to hear about your vision and explore how we can bring it to life.
          </p>
          <a
            href="mailto:hello@aether.studio"
            className="inline-block mt-10 px-10 py-4 text-xs tracking-widest uppercase font-body font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-300"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
