import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus } from "lucide-react";
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
      className="seam-top relative px-6 py-12 md:px-10 md:py-16"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-16">
        {/* heading rail (left) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: EASE }}
          className="lg:col-span-4"
        >
          <h2
            id="faq-heading"
            className="font-heading text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            {t("faq.headline")}
          </h2>
          <p className="mt-5 max-w-xs font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("faq.subhead")}
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 font-body text-[14px] font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("faq.askLink")}
          </a>
        </motion.div>

        {/* disclosure list (right) — full-width rows, hairline rules, no card boxes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="lg:col-span-8"
        >
          <Accordion type="single" collapsible className="border-t border-border">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="group border-b border-border"
              >
                <AccordionTrigger className="gap-6 py-6 text-left font-heading text-lg font-semibold tracking-tight text-foreground/90 transition-colors hover:text-foreground hover:no-underline data-[state=open]:text-foreground [&>svg]:hidden md:text-xl">
                  {item.q}
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-primary/50 group-hover:text-primary group-data-[state=open]:rotate-45 group-data-[state=open]:border-primary group-data-[state=open]:bg-primary/10 group-data-[state=open]:text-primary"
                    aria-hidden
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-7 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
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
