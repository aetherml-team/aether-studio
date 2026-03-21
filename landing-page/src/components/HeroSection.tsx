import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { EASE } from "@/lib/motion";

const HERO_STAT_VALUES = ["500+", "99.8%", "20+"] as const;
const logos = ["KrakenBay", "Tavros", "Eternus", "Inmovilia"];

/** Position on a circle: angle in degrees clockwise from top */
function radial(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
}

/**
 * Orbital mark — colors use theme CSS variables so light/dark mode stays coherent.
 */
function HeroOrbitalMark() {
  const reduced = useReducedMotion();

  const draw = (delay: number) =>
    reduced
      ? { initial: { pathLength: 1 }, animate: { pathLength: 1 }, transition: { duration: 0 } }
      : { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 1.8, delay: delay * 1.4, ease: EASE } };

  const cx = 256, cy = 242;
  const R1 = 46, R2 = 92, R3 = 144;

  const hubDots = Array.from({ length: 8 }, (_, i) => radial(cx, cy, 27, i * 45));
  const r1Nodes = Array.from({ length: 6 }, (_, i) => radial(cx, cy, R1, i * 60));
  const r2Nodes = Array.from({ length: 6 }, (_, i) => radial(cx, cy, R2, i * 60 + 30));
  const r3Nodes = [0, 55, 95, 145, 200, 260, 310].map((d) => radial(cx, cy, R3, d));

  const ulNode = radial(cx, cy, R3, 310);
  const lrNode = radial(cx, cy, R3, 145);
  const urNode = radial(cx, cy, R3, 55);

  return (
    <svg
      className="hero-flow-svg pointer-events-none relative z-[1] mx-auto h-[min(40vh,300px)] w-full max-w-[480px] sm:h-[min(44vh,360px)] sm:max-w-[520px] lg:h-[min(58vh,560px)] lg:max-w-[min(100%,620px)]"
      viewBox="0 0 540 490"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-orbit-g" x1="15%" y1="0%" x2="85%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary-bright))" stopOpacity={0.55} />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
        </linearGradient>
      </defs>

      <circle cx={cx} cy={cy} r={R1 + 24} fill="hsl(var(--primary) / 0.06)" />

      <circle cx={cx} cy={cy} r={8} fill="hsl(var(--primary-bright) / 0.75)" />
      <motion.circle cx={cx} cy={cy} r={17} stroke="hsl(var(--primary-bright) / 0.55)" strokeWidth="1.3" fill="none" {...draw(0)} />
      <motion.circle cx={cx} cy={cy} r={27} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" fill="none" {...draw(0.06)} />
      {hubDots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.8} fill="hsl(var(--primary-bright) / 0.65)" className="hero-flow-node" />
      ))}

      <motion.circle cx={cx} cy={cy} r={R1} stroke="url(#hero-orbit-g)" strokeWidth="1.1" fill="none" {...draw(0.12)} />
      {r1Nodes.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="hsl(var(--primary-bright) / 0.58)" className="hero-flow-node" />
      ))}

      <motion.circle cx={cx} cy={cy} r={R2} stroke="url(#hero-orbit-g)" strokeWidth="1.05" fill="none" {...draw(0.22)} />
      {r2Nodes.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5.5} fill="hsl(var(--primary) / 0.5)" className="hero-flow-node" />
      ))}

      <motion.circle cx={cx} cy={cy} r={R3} stroke="url(#hero-orbit-g)" strokeWidth="1.1" fill="none" {...draw(0.34)} />
      {r3Nodes.map((p, i) =>
        i === 2 ? (
          <g key={`r3-${i}`}>
            <circle cx={p.x} cy={p.y} r={9} stroke="hsl(var(--primary) / 0.45)" strokeWidth="1" fill="none" className="hero-flow-node" />
            <circle cx={p.x} cy={p.y} r={4.5} stroke="hsl(var(--primary-bright) / 0.52)" strokeWidth="1" fill="none" className="hero-flow-node" />
            <circle cx={p.x} cy={p.y} r={2} fill="hsl(var(--primary-bright) / 0.7)" />
          </g>
        ) : (
          <circle key={`r3-${i}`} cx={p.x} cy={p.y} r={5.5} fill="hsl(var(--primary) / 0.45)" className="hero-flow-node" />
        )
      )}

      <motion.path
        d={`M ${ulNode.x.toFixed(1)} ${ulNode.y.toFixed(1)} Q 112 121 42 66`}
        stroke="url(#hero-orbit-g)" strokeWidth="1.1" strokeLinecap="round"
        {...draw(0.5)}
      />
      <circle cx={42} cy={66} r={15} stroke="hsl(var(--primary) / 0.42)" strokeWidth="1" fill="none" className="hero-flow-node" />
      <circle cx={42} cy={66} r={8} stroke="hsl(var(--primary-bright) / 0.52)" strokeWidth="1" fill="none" className="hero-flow-node" />
      <circle cx={42} cy={66} r={3.5} fill="hsl(var(--primary-bright) / 0.75)" />

      <motion.path
        d={`M ${lrNode.x.toFixed(1)} ${lrNode.y.toFixed(1)} Q 363 393 406 432`}
        stroke="url(#hero-orbit-g)" strokeWidth="1.1" strokeLinecap="round"
        {...draw(0.5)}
      />
      <circle cx={406} cy={432} r={9.5} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" fill="none" className="hero-flow-node" />
      <circle cx={406} cy={432} r={5} stroke="hsl(var(--primary-bright) / 0.5)" strokeWidth="1" fill="none" className="hero-flow-node" />
      <circle cx={406} cy={432} r={2} fill="hsl(var(--primary-bright) / 0.65)" />

      <motion.path
        d={`M ${urNode.x.toFixed(1)} ${urNode.y.toFixed(1)} Q 452 98 520 46`}
        stroke="hsl(var(--primary) / 0.35)" strokeWidth="1"
        strokeDasharray="3 10" strokeLinecap="round"
        {...draw(0.58)}
      />
      <circle cx={520} cy={46} r={8} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" fill="none" />
      <circle cx={520} cy={46} r={3.5} stroke="hsl(var(--primary-bright) / 0.48)" strokeWidth="1" fill="none" />

      <motion.path
        d="M 258 387 Q 256 428 254 470"
        stroke="hsl(var(--primary) / 0.28)" strokeWidth="1"
        strokeDasharray="3 10" strokeLinecap="round"
        {...draw(0.64)}
      />

      <circle cx={254} cy={472} r={7.5} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" fill="none" className="hero-flow-node" />
      <circle cx={254} cy={472} r={3.5} stroke="hsl(var(--primary-bright) / 0.48)" strokeWidth="1" fill="none" className="hero-flow-node" />
      <circle cx={254} cy={472} r={1.5} fill="hsl(var(--primary-bright) / 0.65)" />
    </svg>
  );
}

const HeroSection = () => {
  const { t } = useTranslation();

  const chips = t("hero.chips", { returnObjects: true }) as string[];
  const statLabels = t("hero.statLabels", { returnObjects: true }) as string[];
  const stats = HERO_STAT_VALUES.map((value, i) => ({ value, label: statLabels[i] }));

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-24 pt-28 md:px-10"
    >
      <div className="hero-atmosphere pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-orbs" aria-hidden />
      <div className="hero-bloom pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.5]" aria-hidden />
      <div className="noise-overlay" aria-hidden />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-12 xl:gap-16">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: EASE }}
            className="mb-8 flex flex-wrap gap-2"
            aria-label="Focus areas"
          >
            {chips.map((label) => (
              <span
                key={label}
                className="rounded-full border border-border/70 bg-background/35 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm"
              >
                {label}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22, ease: EASE }}
            className="font-heading text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t("hero.headlinePre")} <em>{t("hero.headlineEm")}</em> {t("hero.headlineMid")}{" "}
            <motion.span
              className="text-gradient inline"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            >
              {t("hero.headlineGradient")}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.48, ease: EASE }}
            className="mt-8 max-w-xl font-body text-lg font-light leading-relaxed text-muted-foreground"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <motion.a
              href="#contact"
              className="inline-flex h-12 items-center rounded-lg bg-primary px-7 font-body text-[14px] font-medium text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 32px hsl(var(--primary) / 0.35)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              {t("hero.cta")}
            </motion.a>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.72, ease: EASE }}
            className="mt-12 grid grid-cols-3 gap-3 border-t border-border/50 pt-8 sm:gap-6"
          >
            {stats.map(({ value, label }) => (
              <div key={value} className="min-w-0">
                <dt className="font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {value}
                </dt>
                <dd className="mt-1 font-mono text-[10px] font-medium uppercase leading-snug tracking-wide text-muted-foreground sm:text-[11px]">
                  {label}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8"
          >
            <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t("hero.trustedBy")}
            </p>
            <div className="flex flex-wrap items-center gap-6 md:gap-10">
              {logos.map((name) => (
                <span
                  key={name}
                  className="select-none font-heading text-base font-semibold text-foreground/45 transition-colors duration-300 hover:text-foreground/65 dark:text-foreground/20 dark:hover:text-foreground/32 md:text-lg"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20 lg:relative lg:min-h-[min(62vh,600px)] lg:opacity-100 lg:py-8">
          <HeroOrbitalMark />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
