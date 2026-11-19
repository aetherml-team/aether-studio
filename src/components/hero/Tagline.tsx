import { useEffect, useRef, useState } from "react";
import { animate, m, useMotionValue, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Orbit } from "@/components/Orbit";

const RX = 560;
const RY = 210;
const SNAP = [0.2, 0.9, 0.1, 1] as const;

/* Each object's pose out of line before the sweep: x, y, rotation. */
const POSES: [number, number, number][] = [
  [-6, -15, -9],
  [9, 10, 7],
  [-3, -7, 4],
  [13, 13, -6],
];

/* "Todo lo demás" as four grey objects: the owner's spreadsheet, a receipt roll, a
   contract and a phone with unread chats. They drift out of line for 0.9s, the orbit's
   arc sweeps across them by 1.55s, each one snaps straight and turns as the arc passes,
   and the orbit fades by 1.85s. Plays once per load. Reduced motion shows the end. */
export function Tagline({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const targets = useRef<(HTMLElement | null)[]>([]);
  const x = useMotionValue(-2 * RX);
  const opacity = useMotionValue(0);
  // Target centers in stage px, measured when the sweep starts, and the rightmost one passed.
  const centers = useRef<number[]>([]);
  const [reached, setReached] = useState(-Infinity);
  const on = (i: number) => reduced || (centers.current[i] ?? Infinity) <= reached;

  useEffect(() => {
    if (reduced) return;
    const sweep = animate(0, 1, {
      delay: 0.9,
      duration: 0.65,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (u) => {
        if (!centers.current.length) {
          const box = stage.current!.getBoundingClientRect();
          centers.current = targets.current.map((el) => {
            const r = el!.getBoundingClientRect();
            return r.left - box.left + r.width / 2;
          });
        }
        const xs = centers.current;
        // The arc's leading edge runs from just left of the stage to past the last target.
        const edge = -60 + (Math.max(...xs) + 130) * u;
        x.set(edge - 2 * RX);
        setReached((r) => Math.max(r, ...xs.filter((c) => c <= edge)));
      },
    });
    const fade = animate(opacity, [0, 0.9, 0.9, 0], { delay: 0.9, duration: 0.95, times: [0, 0.13, 0.58, 1] });
    return () => {
      sweep.stop();
      fade.stop();
    };
  }, [reduced, x, opacity]);

  return (
    <div ref={stage} className={className}>
      <p className="max-w-[30ch] font-heading text-[clamp(1.2rem,1.9vw,1.5rem)] font-medium leading-[1.3] tracking-[-0.02em] text-foreground">
        {t("hero.taglineLead")}{" "}
        <span ref={(el) => (targets.current[0] = el)} className={`transition-colors duration-200 ${on(0) ? "text-turn" : ""}`}>
          {t("hero.taglineRest")}
        </span>
      </p>
      <div className="relative mt-4">
        {!reduced && (
          <m.div className="pointer-events-none absolute left-0 top-1/2" style={{ x, opacity, marginTop: -RY }} aria-hidden>
            <Orbit rx={RX} ry={RY} nodes={[[-0.32, 3.5], [0.42, 2.5]]} />
          </m.div>
        )}
        <div role="img" aria-label={t("hero.taglineThings")} className="relative flex h-14 items-center gap-3.5">
          {THINGS.map((Thing, i) => {
            const done = on(i + 1);
            const [dx, dy, r] = POSES[i];
            return (
              <m.div
                key={i}
                ref={(el) => (targets.current[i + 1] = el)}
                initial={false}
                animate={done ? { x: 0, y: 0, rotate: 0 } : { x: [dx, dx + 2.5, dx], y: [dy, dy - 3, dy], rotate: r }}
                transition={done ? { duration: 0.28, ease: SNAP } : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                className={`h-[52px] w-11 transition-colors duration-200 ${done ? "text-turn" : "text-foreground-muted"}`}
              >
                <Thing done={done} />
              </m.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Flat schematics in the brand's line style: 1.5 hairline, card fill, no client marks. */
const svg = {
  viewBox: "0 0 44 52",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinejoin: "round" as const,
  className: "h-full w-full overflow-visible",
  "aria-hidden": true,
};
const card = "hsl(var(--card))";

const THINGS: ((p: { done: boolean }) => JSX.Element)[] = [
  () => (
    <svg {...svg}>
      <path d="M4 4h28l8 8v36H4z" fill={card} />
      <path d="M32 4v8h8" />
      <path d="M4 16h36M4 24h36M4 32h36M4 40h36M15 16v32M27 16v32" strokeWidth={1} />
    </svg>
  ),
  () => (
    <svg {...svg}>
      <path d="M8 2h28v42l-3.5 4-3.5-4-3.5 4-3.5-4-3.5 4-3.5-4-3.5 4L8 44z" fill={card} />
      <path d="M13 11h18M13 17h12M13 23h15" strokeWidth={1} />
      <path d="M13 30h18" strokeDasharray="1.5 2.5" strokeWidth={1} />
      <path d="M13 37h8M25 37h6" />
    </svg>
  ),
  () => (
    <svg {...svg}>
      <path d="M5 3h34v46H5z" fill={card} />
      <path d="M11 11h22M11 16h22M11 21h18M11 26h22M11 31h14" strokeWidth={1} />
      <path d="M11 42h16" />
      <path d="M11 37l3 3m0-3l-3 3" strokeWidth={1} />
    </svg>
  ),
  ({ done }) => (
    <svg {...svg}>
      <rect x="9" y="2" width="26" height="48" rx="5" fill={card} />
      <path d="M19 6h6" strokeWidth={1} />
      <path d="M14 14h11v6H14zM19 24h11v6H19zM14 34h9v6h-9z" strokeWidth={1} />
      {/* The unread badge clears once the phone is handled. */}
      <g className={`transition-opacity delay-100 duration-200 ${done ? "opacity-0" : ""}`}>
        <circle cx="35" cy="5" r="6" fill="currentColor" stroke="none" />
        <text x="35" y="8.2" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8.5" fontWeight="500" fill="hsl(var(--background))" stroke="none">
          9
        </text>
      </g>
    </svg>
  ),
];
