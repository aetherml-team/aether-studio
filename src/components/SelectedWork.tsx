import { motion } from "framer-motion";

const projects = [
  {
    title: "Meridian",
    category: "Brand Identity & Web",
    description: "A complete brand overhaul for a sustainable fashion house, from visual identity to an immersive e-commerce experience.",
    color: "bg-card",
    accent: "text-secondary",
  },
  {
    title: "Solstice",
    category: "Product Design",
    description: "Designing the future of personal finance — a banking app that feels as refined as the wealth it manages.",
    color: "bg-accent/50",
    accent: "text-primary",
  },
  {
    title: "Prism",
    category: "Development & Strategy",
    description: "An AI-powered analytics dashboard built for speed, clarity, and insight — from strategy to pixel-perfect engineering.",
    color: "bg-card",
    accent: "text-secondary",
  },
];

const SelectedWork = () => {
  return (
    <section id="work" className="py-32 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <p className="font-body text-[13px] font-medium tracking-wide text-muted-foreground mb-4">
              Selected work
            </p>
            <h2 className="font-heading text-5xl md:text-7xl text-foreground">
              Recent <span className="italic text-primary">projects</span>
            </h2>
          </div>
          <a href="#contact" className="hidden md:block font-body text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 border-b border-muted-foreground pb-0.5">
            View all work →
          </a>
        </motion.div>

        <div className="space-y-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`group ${project.color} rounded-2xl p-8 md:p-12 cursor-pointer hover:scale-[1.01] transition-transform duration-500`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <p className={`font-body text-[12px] font-medium tracking-wider uppercase ${project.accent} mb-3`}>
                    {project.category}
                  </p>
                  <h3 className="font-heading text-4xl md:text-6xl text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
                    {project.title}
                  </h3>
                  <p className="font-body text-sm font-light text-muted-foreground leading-relaxed max-w-lg">
                    {project.description}
                  </p>
                </div>
                <div className="font-heading text-7xl md:text-8xl text-muted-foreground/20 group-hover:text-primary/20 transition-colors duration-500 select-none">
                  0{i + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
