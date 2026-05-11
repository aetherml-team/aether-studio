import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EASE, viewport } from "@/lib/motion";

interface FAQItem {
  q: string;
  a: string;
}

const FAQSection = () => {
  const { t } = useTranslation();
  const items = t("faq.items", { returnObjects: true }) as FAQItem[];

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t("faq.label")}
          </p>
          <h2 id="faq-heading" className="font-heading text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("faq.headline")}{" "}
            <span className="text-gradient">{t("faq.headlineGradient")}</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-12"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="overflow-hidden rounded-xl border border-border/60 bg-card/40 px-5 backdrop-blur-sm data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="py-5 text-left font-body text-base font-medium text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
