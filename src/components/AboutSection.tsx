import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-8 md:px-16 border-t border-border">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-xs tracking-[0.35em] uppercase text-primary mb-4">
            About Us
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground leading-tight">
            Built on precision,{" "}
            <span className="italic text-gradient-gold">driven by taste</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-body text-base text-muted-foreground leading-relaxed mb-6">
            ÆTHER was founded on a simple belief: that digital experiences should feel as considered as the brands they represent. We partner with ambitious companies to create work that stands apart.
          </p>
          <p className="font-body text-base text-muted-foreground leading-relaxed">
            Our approach is meticulous, our standards uncompromising. Every project is an opportunity to redefine what's possible at the intersection of design and technology.
          </p>
          <div className="mt-10 flex items-center gap-12">
            <div>
              <p className="font-heading text-3xl font-medium text-foreground">50+</p>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mt-1">Projects</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="font-heading text-3xl font-medium text-foreground">8+</p>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mt-1">Years</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="font-heading text-3xl font-medium text-foreground">100%</p>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mt-1">Dedication</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
