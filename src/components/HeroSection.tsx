import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowDown } from "lucide-react";
import { EASE } from "@/lib/motion";
import AutomationPanel from "@/components/AutomationPanel";
import Typewriter from "@/components/Typewriter";

const HeroSection = () => {
  const { t } = useTranslation();
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

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
        {/* left — the statement, written then corrected */}
        <div className="min-w-0">
          <motion.h1
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
          </motion.h1>

          <motion.p
            {...fade(0.28, 12)}
            className="mt-6 max-w-md font-body text-lg font-light leading-relaxed text-muted-foreground"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            {...fade(0.4, 12)}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <motion.a
              href="#contact"
              className="inline-flex h-12 items-center rounded-lg bg-primary px-7 font-body text-[14px] font-medium text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_14px_36px_-18px_hsl(var(--primary)/0.7)]"
              whileHover={reduced ? undefined : { scale: 1.02, filter: "brightness(1.06)" }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              {t("common.cta")}
            </motion.a>

            <a
              href="#problem-solution"
              className="group inline-flex items-center gap-2 font-body text-[14px] font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border/80 transition-colors group-hover:border-primary/50">
                <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" strokeWidth={1.75} />
              </span>
              {t("hero.secondary")}
            </a>
          </motion.div>

          <motion.p
            {...fade(0.5, 0)}
            className="mt-6 font-body text-[13px] text-foreground-muted"
          >
            {t("hero.offerNote")}
          </motion.p>
        </div>

        {/* right — the work, running itself */}
        <motion.div
          style={reduced ? undefined : { x: tx, y: ty }}
          className="mt-2 flex min-w-0 justify-center lg:mt-0 lg:min-h-[min(60vh,540px)] lg:items-center"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="w-full max-w-[480px]"
          >
            <AutomationPanel className="mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
