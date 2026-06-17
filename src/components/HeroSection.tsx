import { useRef } from "react";
import {
  m,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowDown, MessageCircle } from "lucide-react";
import { EASE } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { whatsappEnabled, whatsappUrl } from "@/lib/contact";
import AutomationPanel from "@/components/AutomationPanel";
import Typewriter from "@/components/Typewriter";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Cursor parallax — the panel drifts a few pixels toward the pointer.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 50, damping: 18 });
  const sy = useSpring(py, { stiffness: 50, damping: 18 });
  const tx = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const ty = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  function onMove(e: React.MouseEvent) {
    if (reduced) return;
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  // Supporting content fades in after the headline finishes writing/correcting.
  const fade = (delay: number, y = 14) =>
    reduced
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pb-16 pt-28 md:px-10"
    >
      <div className="hero-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="texture-grid texture-grid-fade pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="hero-orbs" aria-hidden />

      <div className="hero-grid relative z-10 mx-auto w-full max-w-7xl">
        {/* the statement, written then corrected */}
        <div className="hero-area-intro min-w-0">
          <m.h1
            {...fade(0.05, 10)}
            aria-label={`${t("hero.headline")} ${t("hero.headlineEmphasis")}`}
            className="font-heading text-[clamp(2.3rem,4.6vw,3.9rem)] font-bold leading-[1.06] tracking-[-0.025em] text-foreground"
          >
            <span aria-hidden className="block">
              {t("hero.headline")}
            </span>
            <span aria-hidden className="block text-primary">
              <Typewriter
                wrong={t("hero.headlineWrong")}
                right={t("hero.headlineEmphasis")}
                startDelay={420}
              />
            </span>
          </m.h1>

          <m.p
            {...fade(0.28, 12)}
            className="mt-6 max-w-md font-body text-lg font-light leading-relaxed text-muted-foreground"
          >
            {t("hero.description")}
          </m.p>
        </div>

        {/* the work, running itself — on mobile this follows the CTAs as
            supporting proof so the ask stays above the fold */}
        <m.div
          style={reduced ? undefined : { x: tx, y: ty }}
          className="hero-area-panel flex min-w-0 justify-center lg:min-h-[min(60vh,540px)] lg:items-center"
        >
          <m.div
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="w-full max-w-[480px]"
          >
            <AutomationPanel className="mx-auto" />
          </m.div>
        </m.div>

        {/* the ask */}
        <div className="hero-area-actions min-w-0">
          <m.div {...fade(0.4, 12)} className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <m.a
                href="#contact-form"
                className="inline-flex h-12 items-center rounded-lg bg-primary px-7 font-body text-[14px] font-medium text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_14px_36px_-18px_hsl(var(--primary)/0.7)]"
                whileHover={reduced ? undefined : { scale: 1.02, filter: "brightness(1.06)" }}
                whileTap={reduced ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                {t("common.cta")}
              </m.a>

              {whatsappEnabled && (
                <m.a
                  href={whatsappUrl(t("whatsapp.prefill"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("WhatsApp Click", { location: "hero", language: i18n.language })}
                  className="inline-flex h-12 items-center gap-2 rounded-lg border border-border bg-background/40 px-6 font-body text-[14px] font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
                  whileHover={reduced ? undefined : { scale: 1.02 }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  {t("whatsapp.cta")}
                </m.a>
              )}
            </div>

            <a
              href="#problem-solution"
              className="group inline-flex items-center gap-2 font-body text-[14px] font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/80 transition-colors group-hover:border-primary/50">
                <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={1.75} />
              </span>
              {t("hero.secondary")}
            </a>
          </m.div>

          <m.p
            {...fade(0.5, 0)}
            className="mt-6 font-body text-[13px] text-foreground-muted"
          >
            {t("hero.offerNote")}
          </m.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
