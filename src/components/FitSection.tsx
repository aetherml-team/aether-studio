import { useTranslation } from "react-i18next";
import { Section } from "@/components/Sheet";

/* Who we work with, in positive terms, and who we are. */
const FitSection = () => {
  const { t } = useTranslation();
  const audiences = t("checkFit.audiences", { returnObjects: true }) as string[];

  return (
    <Section id="fit" title={t("checkFit.headline")} lead={t("checkFit.description")} deep>
      <ul className="grid border-y border-border lg:grid-cols-2">
        {audiences.map((a) => (
          <li
            key={a}
            className="border-b border-border px-1 py-6 last:border-b-0 lg:odd:border-r lg:odd:pr-10 lg:even:pl-10 lg:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <p className="max-w-[34ch] font-heading text-[clamp(1.1rem,1.3vw,1.4rem)] font-medium leading-[1.25] tracking-[-0.02em] text-foreground">
              {a}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-[58ch] font-body text-[17px] leading-relaxed text-foreground/65">{t("checkFit.about")}</p>
    </Section>
  );
};

export default FitSection;
