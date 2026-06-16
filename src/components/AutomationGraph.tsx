import { useRef, useState, useEffect, type RefObject } from "react";
import {
  m,
  AnimatePresence,
  useReducedMotion,
  useAnimationFrame,
} from "framer-motion";
import { EASE } from "@/lib/motion";

/* Output cycles through everything the core does, so the hero reads as the
   full studio, not just reconciliation. Overridable per locale via the prop. */
const OUTCOMES_DEFAULT = ["Reconciled", "Automated", "Integrated", "Answered", "Scheduled", "Shipped"];

/* ─────────────────────────────────────────────────────────────
   The Æther system, drawn live.

   Real tools on the left feed data into the Æther core; one clean
   output leaves on the right. Packets travel the actual SVG paths
   (sampled with getPointAtLength, so they never drift off the wire),
   the core breathes, and hovering a tool traces its single flow.

   This is the literal picture of what the studio sells, so it earns
   its place as the hero instead of a decorative orbital mark.
   ───────────────────────────────────────────────────────────── */

const VB = { w: 640, h: 560 };
const CORE = { x: 360, y: 280 };
const OUTPUT = { x: 500, y: 280 };

const INPUTS = [
  "Stripe",
  "Mercado Pago",
  "WhatsApp",
  "Calendar",
  "Sheets",
  "QuickBooks",
] as const;

/** Chip geometry: left-anchored rounded rects, edges leave the right edge. */
const CHIP = { x: 24, w: 132, h: 34, r: 10 };
const CHIP_OUT_X = CHIP.x + CHIP.w; // where an input edge begins

const inputY = (i: number) =>
  96 + (i * (464 - 96)) / (INPUTS.length - 1);

/** Smooth bezier from a node to the core, tangents horizontal at both ends. */
function edgePath(nx: number, ny: number, tx: number, ty: number) {
  const dx = tx - nx;
  return `M ${nx} ${ny} C ${nx + dx * 0.45} ${ny}, ${tx - dx * 0.45} ${ty}, ${tx} ${ty}`;
}

const OUTPUT_PATH = edgePath(CORE.x, CORE.y, OUTPUT.x, OUTPUT.y);

/** A teardrop centered on the core: pointed top, round bottom. */
const TEARDROP = `M ${CORE.x} ${CORE.y - 13} C ${CORE.x + 5} ${CORE.y - 6}, ${CORE.x + 7} ${CORE.y - 2}, ${CORE.x + 7} ${CORE.y + 2} A 7 7 0 1 1 ${CORE.x - 7} ${CORE.y + 2} C ${CORE.x - 7} ${CORE.y - 2}, ${CORE.x - 5} ${CORE.y - 6}, ${CORE.x} ${CORE.y - 13} Z`;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Droplets + a flat ground ring thrown out where the drop hits. */
function Splash({ x, y, delay }: { x: number; y: number; delay: number }) {
  const drops = [
    { dx: -23, h: 24 },
    { dx: -13, h: 33 },
    { dx: -5, h: 19 },
    { dx: 7, h: 31 },
    { dx: 15, h: 37 },
    { dx: 24, h: 22 },
  ];
  return (
    <g aria-hidden>
      {drops.map((d, i) => (
        <m.circle
          key={i}
          cx={x}
          cy={y}
          r={i % 2 ? 2.4 : 1.8}
          fill="hsl(var(--primary-bright))"
          initial={{ opacity: 0 }}
          animate={{ x: [0, d.dx * 0.55, d.dx], y: [0, -d.h, 8], opacity: [0, 1, 0] }}
          transition={{ duration: 0.65, delay, times: [0, 0.4, 1], ease: "easeOut" }}
        />
      ))}
      <m.ellipse
        cx={x}
        cy={y}
        rx={7}
        ry={2.2}
        fill="none"
        stroke="hsl(var(--primary-bright) / 0.7)"
        strokeWidth={1.4}
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: [0, 0.75, 0], scaleX: [0.4, 4] }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </g>
  );
}

/** A glowing dot riding an SVG path, sampled per frame so it stays on the wire. */
function FlowPacket({
  pathRef,
  duration,
  delay,
  color,
  reverse = false,
  radius = 3.4,
}: {
  pathRef: RefObject<SVGPathElement>;
  duration: number;
  delay: number;
  color: string;
  reverse?: boolean;
  radius?: number;
}) {
  const dot = useRef<SVGCircleElement>(null);
  const t0 = useRef<number | null>(null);

  useAnimationFrame((t) => {
    const path = pathRef.current;
    const node = dot.current;
    if (!path || !node) return;
    const len = path.getTotalLength();
    if (!len) return;

    // Elapsed from first frame so each packet begins at the node and travels
    // from the start; `delay` is a head start to wait, not a phase offset.
    if (t0.current === null) t0.current = t;
    const e = t - t0.current - delay;
    if (e < 0) {
      node.setAttribute("opacity", "0");
      return;
    }

    const period = duration * 1000;
    const raw = (e % period) / period; // 0 → 1 toward the core
    const frac = smoothstep(raw); // accelerate as it arrives
    const dist = (reverse ? 1 - frac : frac) * len;
    const pt = path.getPointAtLength(dist);

    node.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    node.setAttribute("opacity", String(Math.sin(raw * Math.PI) * 0.95));
  });

  return (
    <circle ref={dot} r={radius} fill={color} opacity={0} />
  );
}

const AutomationGraph = ({
  className = "",
  outcomes = OUTCOMES_DEFAULT,
}: {
  className?: string;
  outcomes?: string[];
}) => {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const [oi, setOi] = useState(0);

  // One stable path ref per input edge, reused by the visible stroke and packets.
  const edgeRefs = useRef<RefObject<SVGPathElement>[]>(
    INPUTS.map(() => ({ current: null }))
  );
  const outRef = useRef<SVGPathElement>(null);

  /* Intro sequence: a drop falls (0.15→1.05s), the core forms on impact
     (~1.0s), then the branches grow and connect (from ~1.5s). Packets only
     start once the wiring exists. Reduced motion skips straight to built. */
  const INTRO = reduced ? 0 : 2.05;
  const [ready, setReady] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setReady(true), 3800);
    return () => window.clearTimeout(id);
  }, [reduced]);

  // Cycle the output label once the node exists, to show the studio's breadth.
  useEffect(() => {
    if (reduced || !ready) return;
    const id = window.setInterval(() => setOi((v) => (v + 1) % outcomes.length), 1750);
    return () => window.clearInterval(id);
  }, [reduced, ready, outcomes.length]);

  const draw = (delay: number) =>
    reduced
      ? { initial: { pathLength: 1 }, animate: { pathLength: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { duration: 1.4, delay: INTRO + delay, ease: EASE },
            opacity: { duration: 0.4, delay: INTRO + delay },
          },
        };

  return (
    <svg
      className={className}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      fill="none"
      role="img"
      aria-label="The tools you use feeding into a single Æther core that automates, integrates, reconciles, answers, schedules and ships."
    >
      <defs>
        <linearGradient id="ag-edge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.12} />
          <stop offset="100%" stopColor="hsl(var(--primary-bright))" stopOpacity={0.6} />
        </linearGradient>
        <linearGradient id="ag-edge-out" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary-bright))" stopOpacity={0.65} />
          <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.55} />
        </linearGradient>
        <radialGradient id="ag-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary-bright))" stopOpacity={0.95} />
          <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
          <stop offset="100%" stopColor="hsl(var(--primary-deep))" stopOpacity={0.85} />
        </radialGradient>
        <filter id="ag-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* ── edges ── */}
      {INPUTS.map((_, i) => {
        const ny = inputY(i);
        const d = edgePath(CHIP_OUT_X, ny, CORE.x, CORE.y);
        const active = hover === i;
        const dim = hover !== null && !active;
        return (
          <m.path
            key={`edge-${i}`}
            ref={edgeRefs.current[i]}
            d={d}
            stroke="url(#ag-edge)"
            strokeWidth={active ? 2 : 1.1}
            strokeLinecap="round"
            style={{ opacity: dim ? 0.18 : 1 }}
            {...draw(0.2 + i * 0.08)}
            className="transition-[stroke-width,opacity] duration-300"
          />
        );
      })}

      {/* output edge — the single clean line out, glowing so it reads as connected */}
      <g style={{ opacity: hover !== null ? 0.45 : 1 }} className="transition-opacity duration-300">
        <path
          d={OUTPUT_PATH}
          stroke="hsl(var(--success) / 0.3)"
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
          filter="url(#ag-soft)"
        />
        <m.path
          ref={outRef}
          d={OUTPUT_PATH}
          stroke="url(#ag-edge-out)"
          strokeWidth={2.2}
          strokeLinecap="round"
          {...draw(0.7)}
        />
        {/* junction plug into the result card */}
        <circle cx={OUTPUT.x - 6} cy={OUTPUT.y} r={3.2} fill="hsl(var(--success))" />
      </g>

      {/* ── flowing packets (only once the wiring exists) ── */}
      {!reduced && ready && (
        <g>
          {INPUTS.map((_, i) => (
            <FlowPacket
              key={`pk-${i}`}
              pathRef={edgeRefs.current[i]}
              duration={3 + (i % 3) * 0.55}
              delay={i * 520}
              color="hsl(var(--primary-bright))"
            />
          ))}
          <FlowPacket pathRef={outRef} duration={2.4} delay={0} reverse color="hsl(var(--success))" radius={3.8} />
          <FlowPacket pathRef={outRef} duration={2.4} delay={1200} reverse color="hsl(var(--success))" radius={3.8} />
        </g>
      )}

      {/* ── the drop falls, bounces twice, splashes, then becomes the core ── */}
      {!reduced && (
        <>
          {/* OUTER: the fall + three decaying bounces (translate only — no
              transformBox here, or the translate silently breaks) */}
          <m.g
            initial={{ opacity: 0, y: -(CORE.y - 20) }}
            animate={{
              y: [-(CORE.y - 20), 0, -72, 0, -33, 0, -12, 0],
              opacity: [0, 1, 1, 1, 1, 1, 1, 0],
            }}
            transition={{
              duration: 1.75,
              delay: 0.25,
              times: [0, 0.3, 0.46, 0.61, 0.73, 0.85, 0.93, 1],
              ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn"],
            }}
            aria-hidden
          >
            {/* INNER: squash on each ground contact (scale needs its own origin) */}
            <m.g
              animate={{
                scaleX: [0.9, 1.2, 0.97, 1.13, 0.99, 1.07, 1.0, 1.03],
                scaleY: [1.16, 0.74, 1.05, 0.84, 1.02, 0.92, 1.0, 0.94],
              }}
              transition={{
                duration: 1.75,
                delay: 0.25,
                times: [0, 0.3, 0.46, 0.61, 0.73, 0.85, 0.93, 1],
                ease: ["easeIn", "easeOut", "easeIn", "easeOut", "easeIn", "easeOut", "easeIn"],
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
            >
              <ellipse cx={CORE.x} cy={CORE.y} rx={11} ry={15} fill="hsl(var(--primary) / 0.3)" filter="url(#ag-soft)" />
              <path d={TEARDROP} fill="hsl(var(--primary-bright))" />
              <ellipse cx={CORE.x - 2.4} cy={CORE.y - 2} rx={1.5} ry={2.3} fill="hsl(0 0% 100% / 0.55)" />
            </m.g>
          </m.g>
          <Splash x={CORE.x} y={CORE.y + 6} delay={0.78} />
          <Splash x={CORE.x} y={CORE.y + 6} delay={1.32} />
        </>
      )}

      {/* ── core (the second bounce becomes Æ) ── */}
      <m.g
        initial={reduced ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, delay: reduced ? 0 : 1.7, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <circle cx={CORE.x} cy={CORE.y} r={30} fill="hsl(var(--primary) / 0.35)" filter="url(#ag-soft)" className="aether-core-halo" />
        <circle cx={CORE.x} cy={CORE.y} r={26} stroke="hsl(var(--primary) / 0.4)" strokeWidth={1} fill="none" className="aether-core-ring" />
        <circle cx={CORE.x} cy={CORE.y} r={17} fill="url(#ag-core)" />
        <circle cx={CORE.x} cy={CORE.y} r={17} stroke="hsl(var(--primary-bright) / 0.7)" strokeWidth={1} fill="none" />
        <text
          x={CORE.x}
          y={CORE.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-heading"
          fontSize={17}
          fontWeight={600}
          fill="hsl(var(--primary-foreground))"
        >
          Æ
        </text>
      </m.g>

      {/* ── input nodes ── */}
      {INPUTS.map((label, i) => {
        const ny = inputY(i);
        const active = hover === i;
        const dim = hover !== null && !active;
        return (
          <g
            key={`node-${i}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: "default", opacity: dim ? 0.45 : 1 }}
            className="transition-opacity duration-300"
          >
            <m.g
              initial={reduced ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: INTRO + 0.1 + i * 0.09, ease: EASE }}
            >
              <rect
                x={CHIP.x}
                y={ny - CHIP.h / 2}
                width={CHIP.w}
                height={CHIP.h}
                rx={CHIP.r}
                fill="hsl(var(--card))"
                stroke={active ? "hsl(var(--primary) / 0.55)" : "hsl(var(--border))"}
                strokeWidth={1}
                className="transition-[stroke] duration-300"
              />
              <circle
                cx={CHIP.x + 16}
                cy={ny}
                r={3}
                fill="hsl(var(--success))"
              />
              <text
                x={CHIP.x + 28}
                y={ny}
                dominantBaseline="central"
                className="font-body select-none"
                fontSize={12.5}
                fontWeight={500}
                fill="hsl(var(--foreground) / 0.82)"
              >
                {label}
              </text>
            </m.g>
          </g>
        );
      })}

      {/* ── output node ── */}
      <m.g
        initial={reduced ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : INTRO + 1.1, ease: EASE }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      >
        <rect
          x={OUTPUT.x - 6}
          y={OUTPUT.y - 26}
          width={104}
          height={52}
          rx={12}
          fill="hsl(var(--card))"
          stroke="hsl(var(--success) / 0.5)"
          strokeWidth={1}
        />
        <circle cx={OUTPUT.x + 14} cy={OUTPUT.y} r={9} fill="hsl(var(--success) / 0.16)" />
        <path
          d={`M ${OUTPUT.x + 10} ${OUTPUT.y} l 2.6 2.8 l 5 -5.6`}
          stroke="hsl(var(--success))"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <AnimatePresence mode="wait">
          <m.text
            key={outcomes[oi]}
            x={OUTPUT.x + 30}
            y={OUTPUT.y}
            dominantBaseline="central"
            className="font-body"
            fontSize={12.5}
            fontWeight={600}
            fill="hsl(var(--foreground) / 0.9)"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {outcomes[oi]}
          </m.text>
        </AnimatePresence>
      </m.g>
    </svg>
  );
};

export default AutomationGraph;
