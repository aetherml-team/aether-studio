import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Æther didn't just build our website — they redefined how our brand shows up in the world. The attention to detail was extraordinary.",
    name: "Sarah Chen",
    role: "CEO, Meridian",
  },
  {
    quote: "Working with Æther felt like having an extension of our own team, but with a design sensibility that constantly pushed us forward.",
    name: "Marcus Rivera",
    role: "Head of Product, Solstice",
  },
  {
    quote: "They took our vague brief and turned it into something we couldn't have imagined. The kind of studio you come back to again and again.",
    name: "Anja Petrov",
    role: "Founder, Prism Labs",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-32 px-6 md:px-16 lg:px-24 bg-card">
      <div className="max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <p className="font-body text-[13px] font-medium tracking-wide text-muted-foreground mb-4">
            Testimonials
          </p>
          <h2 className="font-heading text-5xl md:text-7xl text-foreground">
            Client <span className="italic text-primary">voices</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-background rounded-2xl p-8 flex flex-col justify-between"
            >
              <p className="font-body text-[15px] font-light text-foreground leading-relaxed mb-8">
                "{t.quote}"
              </p>
              <div>
                <p className="font-body text-sm font-medium text-foreground">{t.name}</p>
                <p className="font-body text-[12px] text-muted-foreground mt-0.5">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
