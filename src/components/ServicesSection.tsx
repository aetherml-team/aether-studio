import { motion } from "framer-motion";

const services = [
  {
    number: "01",
    title: "Strategy",
    tags: ["Market Research", "Brand Positioning", "Digital Roadmap"],
    description: "We distill complex challenges into clear, actionable roadmaps that align your brand with its highest potential.",
  },
  {
    number: "02",
    title: "Design",
    tags: ["UI/UX", "Brand Identity", "Motion Design"],
    description: "Every detail is deliberate. We craft interfaces that feel intuitive, look stunning, and communicate authority.",
  },
  {
    number: "03",
    title: "Development",
    tags: ["Frontend", "Backend", "Infrastructure"],
    description: "Robust, scalable code built with modern technologies — engineered for performance and longevity.",
  },
  {
    number: "04",
    title: "Growth",
    tags: ["Analytics", "SEO", "Conversion"],
    description: "Data-informed strategies that turn beautiful experiences into measurable business outcomes.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-32 px-6 md:px-16 lg:px-24 bg-card">
      <div className="max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <p className="font-body text-[13px] font-medium tracking-wide text-muted-foreground mb-4">
            What we do
          </p>
          <h2 className="font-heading text-5xl md:text-7xl text-foreground">
            Services & <span className="italic text-secondary">expertise</span>
          </h2>
        </motion.div>

        <div className="space-y-0">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="group grid md:grid-cols-[80px_1fr_2fr] gap-4 md:gap-10 py-10 border-b border-border items-start"
            >
              <span className="font-body text-[13px] font-medium text-muted-foreground/50 pt-2">
                {service.number}
              </span>

              <h3 className="font-heading text-3xl md:text-4xl text-foreground group-hover:text-primary transition-colors duration-500">
                {service.title}
              </h3>

              <div className="flex flex-col gap-3">
                <p className="font-body text-sm font-light text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-body text-[11px] font-medium tracking-wide text-muted-foreground bg-background px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
