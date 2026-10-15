import { useTranslation } from "react-i18next";
import { Section } from "@/components/Sheet";
import { SectionCTA } from "@/components/SectionCTA";

/* The cost of not knowing, right after the client cases, carrying the CTA. */
const CostSection = () => {
  const { t } = useTranslation();
  return (
    <Section id="cost" title={t("cost.headline")} lead={t("cost.description")} deep>
      <SectionCTA label={t("common.cta")} className="mt-0 md:mt-0" />
    </Section>
  );
};

export default CostSection;
