import { useRef } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { Check, ArrowDown } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

/* ─────────────────────────────────────────────────────────────
   "Days of manual work, down to minutes."
   A pinned, scroll-scrubbed scene: the visitor drives it by
   scrolling, so it can never be "already over". Five scattered
   manual tasks — billing, CRM, AI, sync, ops — are pulled into a
   processing core one by one, a counter ticks 3 days → 12 min, and
   a single resolved result lands. The mix is deliberately broad so
   it reads as "all the busywork", not just reconciliation. Reduced
   motion gets a static before→after composition.
   ───────────────────────────────────────────────────────────── */

/* Rotations for the scattered "before" cards — count drives the layout. */
const ROTS = [-5, 3, -2.5, 4.5, -3.5];
const ROW_GAP = 56;

/** A manual task (any kind — billing, CRM, AI, sync, ops) that gets pulled
 *  into the core within its own scroll window. */
function BeforeRow({
  i,
  p,
  total,
  rot,
  label,
  tag,
}: {
  i: number;
  p: MotionValue<number>;
  total: number;
  rot: number;
  label: string;
  tag: string;
}) {
  const c = (total - 1) / 2;
  const restY = (i - c) * ROW_GAP;
  const start = 0.14 + i * 0.07;
  const end = start + 0.16;

  const x = useTransform(p, [start, end], [0, 300]);
  const y = useTransform(p, [start, end], [restY, restY * 0.2]);
  const opacity = useTransform(p, [start, end - 0.02], [1, 0]);
  const scale = useTransform(p, [start, end], [1, 0.55]);
  const rotate = useTransform(p, [0, start], [rot, 0]);
  const blur = useTransform(p, [start, end], ["blur(0px)", "blur(7px)"]);

  return (
    <m.div
      style={{ x, y, opacity, scale, rotate, filter: blur }}
      className="absolute left-0 top-1/2 flex w-[268px] -translate-y-1/2 items-center gap-3 rounded-xl border border-border bg-card/95 px-4 py-2.5 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)]"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" aria-hidden />
      <span className="flex-1 truncate font-body text-[13px] text-foreground/80">{label}</span>
      <span className="shrink-0 rounded-full border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-foreground-muted">
        {tag}
      </span>
      <span className="font-mono text-[13px] font-bold text-destructive">?</span>
    </m.div>
  );
}

/** The processing core: glows while ingesting, cycles a status word, settles green. */
function Core({ p, words }: { p: MotionValue<number>; words: string[] }) {
  const glow = useTransform(p, [0.1, 0.35, 0.62, 0.8], [0.25, 1, 1, 0.85]);
  const scale = useTransform(p, [0.1, 0.35, 0.62, 0.85], [0.9, 1.12, 1.12, 1]);
  const ringScale = useTransform(p, [0.14, 0.62], [1, 1.9]);
  const ringOpacity = useTransform(p, [0.14, 0.4, 0.62], [0, 0.5, 0]);
  const done = useTransform(p, [0.6, 0.78], [0, 1]); // crossfade primary → success
  const statusText = useTransform(p, (v) =>
    words[v < 0.16 ? 0 : v < 0.4 ? 1 : v < 0.62 ? 2 : 3] ?? ""
  );

  return (
    <div className="relative flex flex-col items-center">
      <m.div
        className="relative flex h-20 w-20 items-center justify-center rounded-full"
        style={{ scale }}
      >
        <m.span
          className="absolute inset-0 rounded-full border border-primary/50"
          style={{ scale: ringScale, opacity: ringOpacity }}
          aria-hidden
        />
        <m.span
          className="absolute inset-2 rounded-full bg-primary/20 blur-[10px]"
          style={{ opacity: glow }}
          aria-hidden
        />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full">
          <m.span
            className="absolute inset-0 rounded-full bg-primary shadow-[0_0_20px_4px_hsl(var(--primary)/0.45)]"
            style={{ opacity: useTransform(done, (d) => 1 - d) }}
            aria-hidden
          />
          <m.span
            className="absolute inset-0 rounded-full bg-success shadow-[0_0_20px_4px_hsl(var(--success)/0.45)]"
            style={{ opacity: done }}
            aria-hidden
          />
          <span className="relative z-10 font-heading text-lg font-semibold text-primary-foreground">Æ</span>
        </span>
      </m.div>
      <m.span className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-dim">
        {statusText}
      </m.span>
    </div>
  );
}

function Counter({ p, label, sub }: { p: MotionValue<number>; label: string; sub: string }) {
  // The payoff isn't "how long one task takes" — it's how much time comes
  // back. The number climbs from 0 (by hand) to the year's hours saved.
  const hours = useTransform(p, [0.12, 0.62], [0, 1500]);
  const text = useTransform(hours, (h) => Math.round(h).toLocaleString("en-US"));
  // crossfade an ink-colored number to a success-colored one as it resolves
  const doneOpacity = useTransform(p, [0.52, 0.7], [0, 1]);
  const inkOpacity = useTransform(doneOpacity, (d) => 1 - d);
  const numClass = "font-heading text-5xl font-bold tracking-tight tabular-nums md:text-6xl";

  return (
    <div className="flex flex-col items-center text-center">
      <span className="relative inline-flex items-start">
        <span className="relative inline-block">
          <m.span className={`${numClass} text-foreground`} style={{ opacity: inkOpacity }}>
            {text}
          </m.span>
          <m.span className={`${numClass} absolute inset-0 text-success`} style={{ opacity: doneOpacity }} aria-hidden>
            {text}
          </m.span>
        </span>
        <span className="ml-1 mt-1.5 font-heading text-2xl font-bold text-primary md:text-3xl" aria-hidden>+</span>
      </span>
      <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 font-body text-[12px] text-foreground-muted">{sub}</span>
    </div>
  );
}

function ResolvedCard({
  p,
  reduced,
  matchedLabel,
  afterMetric,
  resolvedSub,
}: {
  p: MotionValue<number>;
  reduced: boolean;
  matchedLabel: string;
  afterMetric: string;
  resolvedSub: string;
}) {
  const opacity = useTransform(p, [0.58, 0.8], [0, 1]);
  const x = useTransform(p, [0.58, 0.86], [36, 0]);
  const scale = useTransform(p, [0.58, 0.86], [0.94, 1]);

  return (
    <m.div
      style={reduced ? undefined : { opacity, x, scale }}
      className="glow-border w-[272px] rounded-2xl border border-success/30 bg-card p-5 shadow-[0_28px_70px_-32px_hsl(var(--success)/0.55)]"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15">
          <Check className="h-5 w-5 text-success" strokeWidth={2.4} />
        </span>
        <div>
          <p className="font-body text-[14px] font-semibold text-foreground">{matchedLabel}</p>
          <p className="font-mono text-[11px] text-foreground-muted">{resolvedSub}</p>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-border/70 pt-4">
        <span className="font-body text-[12px] text-muted-foreground">{afterMetric}</span>
        <span className="font-heading text-3xl font-bold tracking-tight text-success">
          12<span className="ml-1 text-base font-medium text-foreground-muted">min</span>
        </span>
      </div>
    </m.div>
  );
}

const WorkDisappearsSection = () => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const tags = t("problemSolution.tags", { returnObjects: true }) as string[];
  const processWords = t("problemSolution.sceneProcessing", { returnObjects: true }) as string[];
  const sceneTasks = t("problemSolution.sceneTasks", { returnObjects: true }) as { label: string; tag: string }[];
  const resolvedSub = t("problemSolution.sceneResolvedSub");

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const beforeLabelOpacity = useTransform(scrollYProgress, [0.18, 0.4], [1, 0]);
  const afterLabelOpacity = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [1, 0.5, 0.5, 0]);

  const Heading = (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <m.div
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-2xl"
      >
        <p className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground">
          {t("problemSolution.problemLabel")}
        </p>
        <h2 className="font-heading text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {t("problemSolution.problemHeadline")}
        </h2>
        <p className="mt-5 font-body text-[15px] font-light leading-relaxed text-muted-foreground">
          {t("problemSolution.problemBody")}
        </p>
      </m.div>
    </div>
  );

  const Resolution = (
    <div className="mx-auto max-w-7xl px-6 md:px-10">
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <m.h3
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.65, ease: EASE }}
          className="font-heading text-balance text-2xl font-bold tracking-tight text-foreground md:col-span-7 md:text-3xl"
        >
          {t("problemSolution.solutionHeadline")}
        </m.h3>
        <m.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
          className="md:col-span-5"
        >
          <p className="font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("problemSolution.solutionBody")}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {tags.map((tag) => (
              <span key={tag} className="badge-peri">
                {tag}
              </span>
            ))}
          </div>
        </m.div>
      </div>
    </div>
  );

  /* Reduced motion / no-scroll: a calm static before→after, never pinned. */
  if (reduced) {
    return (
      <section id="problem-solution" className="seam-top py-14 md:py-20">
        {Heading}
        <div className="mx-auto mt-14 max-w-3xl px-6 md:px-10">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-border/70 bg-background-deep/60 p-8">
            <div className="flex w-full max-w-sm flex-col gap-2">
              {sceneTasks.slice(0, 3).map((task, i) => (
                <div
                  key={task.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card/80 px-4 py-2.5"
                  style={{ opacity: 1 - i * 0.18 }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" aria-hidden />
                  <span className="flex-1 font-body text-[13px] text-foreground/80">{task.label}</span>
                  <span className="shrink-0 rounded-full border border-border/70 bg-background/60 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-foreground-muted">
                    {task.tag}
                  </span>
                </div>
              ))}
            </div>
            <ArrowDown className="h-5 w-5 text-primary" strokeWidth={2} aria-hidden />
            <ResolvedCard
              p={scrollYProgress}
              reduced
              matchedLabel={t("problemSolution.sceneMatched")}
              afterMetric={t("problemSolution.sceneAfterMetric")}
              resolvedSub={resolvedSub}
            />
          </div>
        </div>
        <div className="mt-14">{Resolution}</div>
      </section>
    );
  }

  return (
    <section id="problem-solution" className="seam-top">
      <div className="pt-14 md:pt-20">{Heading}</div>

      {/* pinned, scrubbed scene */}
      <div ref={pinRef} className="relative mt-10 h-[125vh] md:mt-14">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
            <div className="relative h-[min(62vh,520px)] overflow-hidden rounded-3xl border border-border/70 bg-background-deep/70">
              <div className="texture-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />

              {/* state labels */}
              <m.span
                style={{ opacity: beforeLabelOpacity }}
                className="absolute left-6 top-5 font-mono text-[11px] uppercase tracking-[0.14em] text-destructive/80 md:left-10"
              >
                {t("problemSolution.sceneBefore")}
              </m.span>
              <m.span
                style={{ opacity: afterLabelOpacity }}
                className="absolute right-6 top-5 font-mono text-[11px] uppercase tracking-[0.14em] text-success/80 md:right-10"
              >
                {t("problemSolution.sceneAfter")}
              </m.span>

              {/* three-zone composition, always populated during the scrub */}
              <div className="absolute inset-0 grid grid-cols-1 items-center gap-6 px-6 md:grid-cols-[1fr_auto_1fr] md:gap-10 md:px-16">
                {/* left: converging manual lines */}
                <div className="relative hidden h-full md:block">
                  {sceneTasks.map((task, i) => (
                    <BeforeRow
                      key={task.label}
                      i={i}
                      p={scrollYProgress}
                      total={sceneTasks.length}
                      rot={ROTS[i] ?? 0}
                      label={task.label}
                      tag={task.tag}
                    />
                  ))}
                </div>

                {/* center: counter + core */}
                <div className="flex flex-col items-center gap-8">
                  <Counter
                    p={scrollYProgress}
                    label={t("problemSolution.sceneTimeLabel")}
                    sub={t("problemSolution.sceneTimeSub")}
                  />
                  <Core p={scrollYProgress} words={processWords} />
                </div>

                {/* right: resolved result */}
                <div className="hidden justify-self-center md:flex md:justify-self-start">
                  <ResolvedCard
                    p={scrollYProgress}
                    reduced={false}
                    matchedLabel={t("problemSolution.sceneMatched")}
                    afterMetric={t("problemSolution.sceneAfterMetric")}
                    resolvedSub={resolvedSub}
                  />
                </div>
              </div>

              {/* scrub hint */}
              <m.div
                style={{ opacity: hintOpacity }}
                className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground-muted"
              >
                <span className="h-3 w-px animate-pulse bg-primary/60" aria-hidden />
                {t("problemSolution.sceneScrub")}
              </m.div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-20 pt-12 md:pb-28 md:pt-16">{Resolution}</div>
    </section>
  );
};

export default WorkDisappearsSection;
