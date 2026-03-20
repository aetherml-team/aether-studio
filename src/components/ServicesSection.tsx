import { motion } from "framer-motion";

const services = [
  {
    number: "01",
    title: "Strategy",
    description:
      "We distill complex challenges into clear, actionable roadmaps that align your brand with its highest potential.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Every pixel is deliberate. We craft interfaces that feel intuitive, look stunning, and communicate authority.",
  },
  {
    number: "03",
    title: "Development",
    description:
      "Robust, scalable code built with modern technologies — engineered for performance and longevity.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-32 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <p className="font-body text-xs tracking-[0.35em] uppercase text-primary mb-4">
            What We Do
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-medium text-foreground">
            Our Services
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px bg-border">
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="bg-background p-10 md:p-12 group hover:bg-card transition-colors duration-500"
            >
              <span className="font-body text-xs tracking-widest text-primary">
                {service.number}
              </span>
              <h3 className="font-heading text-2xl md:text-3xl font-medium text-foreground mt-6 mb-4">
                {service.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
              <div className="mt-8 h-px bg-border group-hover:bg-primary/30 transition-colors duration-500 w-12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
