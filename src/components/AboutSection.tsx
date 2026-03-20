import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Projects shipped" },
  { value: "8yr", label: "In business" },
  { value: "97%", label: "Client retention" },
  { value: "12", label: "Team members" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-16 md:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-body text-[13px] font-medium tracking-wide text-muted-foreground mb-4">
              About us
            </p>
            <h2 className="font-heading text-5xl md:text-7xl text-foreground leading-[1.05] mb-8">
              Built on precision,
              <br />
              <span className="italic text-secondary">driven by taste</span>
            </h2>
            <p className="font-body text-base font-light text-muted-foreground leading-relaxed mb-5">
              ÆTHER was founded on a belief that digital experiences should feel as considered
              as the brands they represent. We partner with ambitious companies to create work
              that stands apart — work that people remember.
            </p>
            <p className="font-body text-base font-light text-muted-foreground leading-relaxed">
              Our approach is meticulous, our standards uncompromising. We're a small team
              that punches well above its weight, because we care about the craft more than
              the scale.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-end"
          >
            <div className="grid grid-cols-2 gap-8 w-full">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-card rounded-xl p-6"
                >
                  <p className="font-heading text-4xl text-foreground mb-1">{stat.value}</p>
                  <p className="font-body text-[12px] font-medium tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
