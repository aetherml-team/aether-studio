import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionCTA } from "@/components/SectionCTA";
import ProductMockup, { type MockVariant } from "@/components/ProductMockup";
import { EASE, viewport } from "@/lib/motion";

interface ClientTranslation {
  tagline: string;
  industry: string;
  quote: string;
  quotePerson: string;
  servicesDelivered: string[];
  metricLabel: string;
}

interface WorkVisual {
  name: string;
  url: string;
  variant: MockVariant;
  accentLight: string;
  accentDark: string;
  /** real screenshot path, dropped in later (public/work/<file>) */
  screenshot?: string;
}

const WORK: WorkVisual[] = [
  { name: "KrakenBay", url: "app.krakenbay.mx", variant: "booking", accentLight: "#7D621A", accentDark: "#E8C84A" },
  { name: "Tavros", url: "app.tavros.fit", variant: "billing", accentLight: "#5E6B2E", accentDark: "#C7E15A" },
  { name: "Inmovilia", url: "portal.inmovilia.mx", variant: "realestate", accentLight: "#3F5C7A", accentDark: "#7FB2E8" },
  { name: "Eternus", url: "eternusfilms.com", variant: "film", accentLight: "#6E4A6E", accentDark: "#D192D1" },
];

const METRICS = ["30+", "3x", "2x", "50+"] as const;

const accentVars = (v: WorkVisual) =>
  ({ "--ca-light": v.accentLight, "--ca-dark": v.accentDark } as CSSProperties);

/** One client's story — mockup + narrative. Presentational; the carousel
 *  drives enter/exit animation through the parent AnimatePresence. */
function Slide({
  visual,
  data,
  metric,
  whatDelivered,
}: {
  visual: WorkVisual;
  data: ClientTranslation;
  metric: string;
  whatDelivered: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      className="client-scope grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
      style={accentVars(visual)}
    >
      {/* mockup */}
      <div className="group/mock [perspective:1400px]">
        <motion.div
          whileHover={reduced ? undefined : { rotateX: 3, rotateY: -4, scale: 1.015 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="[transform-style:preserve-3d]"
        >
          <ProductMockup
            variant={visual.variant}
            accent="var(--client-accent)"
            label={visual.url}
            screenshot={visual.screenshot}
            alt={`${visual.name} — ${data.industry}`}
          />
        </motion.div>
      </div>

      {/* narrative */}
      <div>
        <div className="flex items-center gap-3">
          <span
            className="font-heading text-2xl font-bold tracking-tight md:text-3xl"
            style={{ color: "var(--client-accent)" }}
          >
            {visual.name}
          </span>
          <span className="font-mono text-[11px] text-foreground-muted">{data.tagline}</span>
        </div>

        <blockquote className="mt-5 font-heading text-xl font-normal leading-[1.45] tracking-tight text-foreground md:text-2xl">
          &ldquo;{data.quote}&rdquo;
        </blockquote>
        <p className="mt-3 font-body text-sm text-muted-foreground">— {data.quotePerson}</p>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
          <div>
            <span
              className="font-heading text-4xl font-bold tracking-tight md:text-5xl"
              style={{ color: "var(--client-accent)" }}
            >
              {metric}
            </span>
            <span className="ml-2 font-body text-xs text-muted-foreground">{data.metricLabel}</span>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-foreground-dim">
            {whatDelivered}
          </p>
          <div className="flex flex-wrap gap-2">
            {data.servicesDelivered.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 font-body text-[12.5px] text-foreground/85"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--client-accent)" }} aria-hidden />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const SWIPE_THRESHOLD = 70;
const AUTOPLAY_MS = 12000;

const WorkShowcase = () => {
  const { t } = useTranslation();
  const items = t("clients.items", { returnObjects: true }) as ClientTranslation[];
  const reduced = useReducedMotion();

  // [activeIndex, direction] — direction drives the slide animation.
  const [[active, dir], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const total = WORK.length;

  const go = (delta: number) => setState([(active + delta + total) % total, delta]);
  const select = (i: number) => setState([i, i > active ? 1 : -1]);

  // Autoplay: advance every 12s. Re-arms when `active` changes (so manual nav
  // resets the clock), pauses on hover/focus, and stays off for reduced motion.
  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setTimeout(() => setState(([a]) => [(a + 1) % total, 1]), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, reduced, total]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
  };

  const visual = WORK[active];
  const data = items[active];

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d >= 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d >= 0 ? -48 : 48 }),
  };

  return (
    <section
      id="clients"
      className="seam-top relative overflow-hidden px-6 py-16 md:px-10 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-2xl"
        >
          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("clients.sectionHeadline")}
          </h2>
          <p className="mt-5 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("clients.sectionSub")}
          </p>
        </motion.div>

        {/* tabs + counter/arrows */}
        <div className="mt-10 flex flex-col gap-5 border-b border-border pb-5 md:mt-12 md:flex-row md:items-center md:justify-between">
          <div className="-mx-1 flex gap-1 overflow-x-auto md:mx-0" role="tablist" aria-label={t("clients.sectionHeadline")}>
            {WORK.map((w, i) => {
              const on = i === active;
              return (
                <button
                  key={w.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => select(i)}
                  style={accentVars(w)}
                  className={`client-scope shrink-0 rounded-full px-4 py-2 font-heading text-[14px] font-semibold tracking-tight transition-colors duration-200 ${
                    on ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full transition-opacity duration-200"
                      style={{ background: "var(--client-accent)", opacity: on ? 1 : 0.3 }}
                      aria-hidden
                    />
                    {w.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[12px] tabular-nums text-foreground-muted">
              {String(active + 1).padStart(2, "0")} <span className="text-foreground-dim">/ {String(total).padStart(2, "0")}</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t("clients.prev")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors duration-200 hover:border-primary/50 hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t("clients.next")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors duration-200 hover:border-primary/50 hover:text-foreground"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {/* slide */}
        <div
          className="relative mt-10 md:mt-12"
          role="group"
          aria-roledescription="carousel"
          aria-label={t("clients.sectionHeadline")}
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: EASE }}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={reduced ? undefined : onDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              <Slide
                visual={visual}
                data={data}
                metric={METRICS[active]}
                whatDelivered={t("clients.whatDelivered")}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <SectionCTA label={t("common.cta")} />
      </div>
    </section>
  );
};

export default WorkShowcase;
