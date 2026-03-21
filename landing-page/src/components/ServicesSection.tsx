import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionCTA } from "@/components/SectionCTA";
import { CreditCard, Cog, Link2, Workflow, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

interface ServiceTranslation {
  name: string;
  description: string;
  proof: string;
}

const SERVICE_ICONS: LucideIcon[] = [Cog, Link2, CreditCard, Globe, Workflow];

const ServicesSection = () => {
  const { t } = useTranslation();
  const items = t("services.items", { returnObjects: true }) as ServiceTranslation[];

  const services = items.map((item, i) => ({
    ...item,
    Icon: SERVICE_ICONS[i],
  }));

  return (
    <section id="services" className="px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("services.label")}
          </p>
          <h2 className="max-w-3xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("services.headline")}{" "}
            <span className="text-gradient italic">{t("services.headlineGradient")}</span>
          </h2>
          <p className="mt-4 max-w-xl font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("services.description")}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.article
              key={service.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.58,
                delay: i * 0.07,
                ease: EASE,
              }}
              whileHover={{ y: -5 }}
              className="shadow-lift group flex flex-col rounded-2xl border border-border bg-card p-8"
            >
              <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                <service.Icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary-bright">
                {service.name}
              </h3>
              <p className="mt-3 font-body text-sm font-light leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <p className="mt-auto pt-5 font-mono text-[11px] font-medium leading-snug text-primary/80">
                {service.proof}
              </p>
            </motion.article>
          ))}
        </div>

        <SectionCTA label={t("services.cta")} />
      </div>
    </section>
  );
};

export default ServicesSection;
