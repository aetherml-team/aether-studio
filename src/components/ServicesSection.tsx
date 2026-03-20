import { motion } from "framer-motion";

const services = [
  {
    title: "Strategy",
    description: "We distill complex challenges into clear, actionable roadmaps that align your brand with its highest potential.",
  },
  {
    title: "Design",
    description: "Every detail is deliberate. We craft interfaces that feel intuitive, look stunning, and communicate authority.",
  },
  {
    title: "Development",
    description: "Robust, scalable code built with modern technologies — engineered for performance and longevity.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-32 px-8 md:px-16 lg:px-24 border-t border-border">
      <div className="max-w-6xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-body text-[13px] font-light tracking-wider uppercase text-muted-foreground mb-16"
        >
          Services
        </motion.p>

        <div className="space-y-0">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16 py-12 border-b border-border"
            >
              <h3 className="font-heading text-4xl md:text-5xl font-light text-foreground group-hover:text-primary transition-colors duration-500">
                {service.title}
              </h3>
              <p className="font-body text-base font-light text-muted-foreground leading-relaxed md:max-w-md self-center">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
