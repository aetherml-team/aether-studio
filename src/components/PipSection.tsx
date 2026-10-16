import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE, viewport } from "@/lib/motion";
import { Section } from "@/components/Sheet";

/* Pip, the assistant inside the app. Screens are the app's own chat parts
   (answer, chart, table, approval card) rendered on test data, one image per
   language and theme in public/work/pip/<shot>-<theme>-<lang>.jpg. The first
   three read, the last three wait on "Aprobar". */
const SHOTS = ["money", "owes", "plans", "pay", "deposit", "send"] as const;

const PipSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "es";
  const captions = t("pip.shots", { returnObjects: true }) as string[];
  const groups = [
    [t("pip.askLabel"), SHOTS.slice(0, 3)],
    [t("pip.doLabel"), SHOTS.slice(3)],
  ] as const;

  return (
    <Section id="pip" note={t("pip.note")} title={t("pip.headline")} lead={t("pip.description")}>
      <div className="grid gap-14">
        {groups.map(([heading, shots], g) => (
          <div key={heading}>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">{heading}</p>
            <ul className="-mx-4 mt-5 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:items-start md:gap-6 md:overflow-visible md:px-0 md:pb-0">
              {shots.map((shot, i) => {
                const caption = captions[g * 3 + i];
                const src = (theme: string) => `/work/pip/${shot}-${theme}-${lang}.jpg`;
                return (
                  <m.li
                    key={shot}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewport}
                    transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                    className="w-[82%] shrink-0 snap-start md:w-auto"
                  >
                    <figure>
                      <div className="glow-border overflow-hidden rounded-xl border border-border">
                        <img src={src("light")} alt={caption} loading="lazy" className="block w-full dark:hidden" />
                        <img src={src("dark")} alt={caption} loading="lazy" className="hidden w-full dark:block" />
                      </div>
                      <figcaption className="mt-4 font-heading text-[17px] font-medium leading-[1.3] tracking-[-0.015em] text-foreground">
                        {caption}
                      </figcaption>
                    </figure>
                  </m.li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.12em] text-foreground-dim">{t("pip.demo")}</p>
    </Section>
  );
};

export default PipSection;
