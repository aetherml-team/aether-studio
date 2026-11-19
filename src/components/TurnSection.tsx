import { useLayoutEffect, useRef, useState } from "react";
import { m, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Orbit } from "@/components/Orbit";

interface Line {
  before: string;
  after: string;
}

const RY = 380;
/* How far each before line sits out of line, in px. */
const OFFSETS = [0, 22, 8, 30];
const SNAP = "ease-[cubic-bezier(0.2,0.9,0.1,1)]";

/* The turn between Pain and Nexus. Before is what the owner does, in grey verbs; after
   is what they have, in the turn color. Scroll drives the orbit's lower arc down the
   panel and each line turns as the arc passes it, and turns back on the way up.
   Reduced motion shows the after state with no orbit and no pinned scroll. */
const TurnSection = () => {
  const reduced = useReducedMotion();
  return reduced ? <TurnStill /> : <TurnScroll />;
};

function TurnStill() {
  const { t } = useTranslation();
  return (
    <section aria-label={t("turn.after")} className="relative overflow-hidden py-20 md:py-24">
      <Glow on={1} />
      <div className="shell relative">
        <Body passed={Infinity} />
      </div>
    </section>
  );
}

function TurnScroll() {
  const { t } = useTranslation();
  const wrap = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const targets = useRef<(HTMLElement | null)[]>([]);
  // Target centers in panel px. The panel is pinned, so these hold while it scrolls.
  const centers = useRef<number[]>([]);
  const [rx, setRx] = useState(900);
  const [left, setLeft] = useState(0);
  const [passed, setPassed] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const y = useMotionValue(-2 * RY);
  const opacity = useTransform(scrollYProgress, [0.04, 0.1, 0.8, 0.92], [0, 0.9, 0.9, 0]);

  const update = (p: number) => {
    const ys = centers.current;
    if (!ys.length) return;
    const start = ys[0] - 50;
    const end = ys[ys.length - 1] + 70;
    const edge = start + (end - start) * Math.min(1, Math.max(0, (p - 0.1) / 0.65));
    y.set(edge - 2 * RY);
    setPassed(ys.filter((c) => c <= edge).length);
  };
  useMotionValueEvent(scrollYProgress, "change", update);

  useLayoutEffect(() => {
    const measure = () => {
      const box = panel.current!.getBoundingClientRect();
      centers.current = targets.current.map((el) => {
        const r = el!.getBoundingClientRect();
        return r.top - box.top + r.height / 2;
      });
      const r = Math.max(box.width * 0.9, 700);
      setRx(r);
      setLeft(box.width * 0.42 - r);
      update(scrollYProgress.get());
    };
    measure();
    document.fonts?.ready.then(measure);
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
    // update reads refs and stable motion values only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollYProgress]);

  return (
    <section ref={wrap} aria-label={t("turn.after")} className="relative h-[240vh]">
      <div ref={panel} className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="dot-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_50%,#000_30%,transparent_75%)]" aria-hidden />
        <Glow on={passed / (targets.current.length || 1)} />
        <m.div className="pointer-events-none absolute top-0" style={{ left, y, opacity }} aria-hidden>
          <Orbit rx={rx} ry={RY} nodes={[[1.2, 3.5], [2.15, 2.5]]} />
        </m.div>
        <div className="shell relative w-full">
          <Body passed={passed} targets={targets} progress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}

/* One soft, wide orb that comes up as the lines turn. */
function Glow({ on }: { on: number }) {
  return (
    <div
      className="pointer-events-none absolute left-[10%] top-1/2 aspect-square w-[70vw] max-w-[900px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--turn)/0.11),transparent_65%)] transition-opacity duration-300"
      style={{ opacity: on }}
      aria-hidden
    />
  );
}

/* Kicker plus lines. `passed` counts targets the orbit has crossed: the kicker is 0. */
function Body({
  passed,
  targets,
  progress,
}: {
  passed: number;
  targets?: React.MutableRefObject<(HTMLElement | null)[]>;
  progress?: MotionValue<number>;
}) {
  const { t } = useTranslation();
  const lines = t("turn.lines", { returnObjects: true }) as Line[];
  const turned = passed > 0;
  const swap = `absolute left-0 top-0 transition-[opacity,transform] duration-300 ${SNAP}`;
  return (
    <>
      <p ref={(el) => targets && (targets.current[0] = el)} className="relative h-[1.6em] font-mono text-[11px] uppercase tracking-[0.14em]">
        <span className={`${swap} text-foreground-muted ${turned ? "-translate-y-1.5 opacity-0" : ""}`}>{t("turn.before")}</span>
        <span className={`${swap} text-turn ${turned ? "" : "translate-y-1.5 opacity-0"}`}>{t("turn.after")}</span>
      </p>
      <ol className="mt-7 grid gap-[clamp(14px,2.4vh,26px)]">
        {lines.map((line, i) => (
          <TurnLine
            key={line.after}
            i={i}
            line={line}
            on={passed > i + 1}
            progress={progress}
            lineRef={(el) => targets && (targets.current[i + 1] = el)}
          />
        ))}
      </ol>
    </>
  );
}

function TurnLine({
  i,
  line,
  on,
  progress,
  lineRef,
}: {
  i: number;
  line: Line;
  on: boolean;
  progress?: MotionValue<number>;
  lineRef: (el: HTMLLIElement | null) => void;
}) {
  const still = useMotionValue(0);
  // Before the turn the line drifts a few px with the scroll; after it, it holds.
  const x = useTransform(progress ?? still, (p) => (progress ? OFFSETS[i] + Math.sin(p * 9 + i * 1.9) * 5 : 0));
  return (
    <li
      ref={lineRef}
      className="grid font-heading text-[clamp(1.35rem,3.6vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.028em]"
    >
      <m.span style={{ x }} className={`col-start-1 row-start-1 text-foreground-muted transition-opacity duration-200 ${on ? "opacity-0" : ""}`}>
        {line.before}
      </m.span>
      <span className={`col-start-1 row-start-1 text-turn transition-[opacity,transform] duration-300 ${SNAP} ${on ? "" : "translate-y-2 opacity-0"}`}>
        {line.after}
      </span>
    </li>
  );
}

export default TurnSection;
