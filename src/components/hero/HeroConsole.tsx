import { useTranslation } from "react-i18next";
import { ArrowDown } from "lucide-react";
import { Actions, AppScreen, Headline } from "./parts";

/* A — CONSOLE
   The product sits on the right like a screen on a desk: turned toward the
   copy, lit down its leading edge, running off the page because it is bigger
   than the page. Copy holds the left half at full weight. */
export default function HeroConsole() {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative flex min-h-[760px] items-center overflow-hidden pb-20 pt-32 md:pb-24 md:pt-36">
      <div className="key-light pointer-events-none absolute inset-0" aria-hidden />

      <div className="shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-5">
            <Headline className="rise display-1" />

            <p
              className="rise lead mt-8 max-w-[38ch] font-body text-foreground/70"
              style={{ animationDelay: "60ms" }}
            >
              {t("hero.description")}
            </p>

            <div className="rise" style={{ animationDelay: "120ms" }}>
              <Actions className="mt-9" />
            </div>

            <a
              href="#pain"
              className="rise group mt-10 inline-flex items-center gap-2.5 font-body text-[14px] text-foreground/55 transition-colors duration-200 hover:text-foreground"
              style={{ animationDelay: "180ms" }}
            >
              <span className="btn-ghost flex h-8 w-8 items-center justify-center rounded-full">
                <ArrowDown
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
              {t("hero.secondary")}
            </a>
          </div>

          <div className="rise min-w-0 lg:col-span-7" style={{ animationDelay: "140ms", animationDuration: "900ms" }}>
            <AppScreen className="glow-border border border-border" />
            <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-foreground-dim lg:ml-1">
              {t("hero.screenshotLabel")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
