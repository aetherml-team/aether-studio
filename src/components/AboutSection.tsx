import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-8 md:px-16 lg:px-24 border-t border-border">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24 max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-[13px] font-light tracking-wider uppercase text-muted-foreground mb-10">
            About
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground leading-[1.05]">
            Built on precision,
            <br />
            <span className="italic text-primary">driven by taste</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col justify-end"
        >
          <p className="font-body text-base font-light text-muted-foreground leading-relaxed mb-6">
            ÆTHER was founded on a simple belief: that digital experiences should feel as considered as the brands they represent. We partner with ambitious companies to create work that stands apart.
          </p>
          <p className="font-body text-base font-light text-muted-foreground leading-relaxed mb-12">
            Our approach is meticulous, our standards uncompromising. Every project is an opportunity to redefine what's possible.
          </p>

          <div className="flex items-center gap-16">
            <div>
              <p className="font-heading text-4xl font-light text-foreground">50+</p>
              <p className="font-body text-[11px] font-light tracking-widest uppercase text-muted-foreground mt-2">Projects</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-light text-foreground">8</p>
              <p className="font-body text-[11px] font-light tracking-widest uppercase text-muted-foreground mt-2">Years</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-light text-foreground">∞</p>
              <p className="font-body text-[11px] font-light tracking-widest uppercase text-muted-foreground mt-2">Ambition</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
