import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE, viewport } from "@/lib/motion";

interface ServiceTranslation {
  name: string;
  description: string;
  proof: string;
}

const ServicesSection = () => {
  const { t } = useTranslation();
  const items = t("services.items", { returnObjects: true }) as ServiceTranslation[];

  return (
    <section id="services" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 md:mb-16"
        >
          <h2 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("services.headline")}
          </h2>
          <p className="mt-4 max-w-xl font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("services.description")}
          </p>
        </motion.div>

        <div className="border-t border-border">
          {items.map((service, i) => (
            <motion.article
              key={service.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
              className="group grid gap-3 border-b border-border py-8 transition-colors duration-300 hover:bg-muted/30 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary md:col-span-3 md:text-2xl">
                {service.name}
              </h3>
              <p className="font-body text-[15px] font-light leading-relaxed text-muted-foreground md:col-span-5">
                {service.description}
              </p>
              <p className="font-body text-[15px] font-medium leading-relaxed text-primary md:col-span-4 md:text-right">
                {service.proof}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
