import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE, viewport } from "@/lib/motion";

const ProblemSolutionSection = () => {
  const { t } = useTranslation();
  const tags = t("problemSolution.tags", { returnObjects: true }) as string[];

  return (
    <section id="problem-solution" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-5 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.72, ease: EASE }}
          className="flex flex-col justify-center lg:col-span-2"
        >
          <p className="mb-4 font-body text-sm font-medium text-muted-foreground">
            {t("problemSolution.problemLabel")}
          </p>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("problemSolution.problemHeadline")}
          </h2>
          <p className="mt-5 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("problemSolution.problemBody")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.72, delay: 0.08, ease: EASE }}
          className="glow-border rounded-2xl border border-border bg-card p-8 lg:col-span-3 lg:p-12"
        >
          <p className="mb-4 font-body text-sm font-medium text-primary">
            {t("problemSolution.solutionLabel")}
          </p>
          <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("problemSolution.solutionHeadline")}
          </h2>
          <p className="mt-5 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("problemSolution.solutionBody")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.06, ease: EASE }}
                className="badge-peri"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
