import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

/* Writes the "wrong" line, strikes it through (a line drawn across the middle,
   like crossing out a mistake), clears it, then writes the corrected line.
   That self-correction is the whole point — it performs what Æther does.
   Reduced motion shows the corrected line immediately. */

interface Props {
  wrong: string;
  right: string;
  startDelay?: number;
  typeSpeed?: number;
  className?: string;
  onDone?: () => void;
  /** ms to hold the corrected line before replaying the whole self-correction.
   *  0 disables looping (writes once and stays). */
  loopDelay?: number;
}

type Phase = "type0" | "strike" | "type1" | "done";

const Typewriter = ({
  wrong,
  right,
  startDelay = 350,
  typeSpeed = 55,
  className = "",
  onDone,
  loopDelay = 30000,
}: Props) => {
  const reduced = useReducedMotion();
  const [text, setText] = useState(reduced ? right : "");
  const [phase, setPhase] = useState<Phase>(reduced ? "done" : "type0");
  // Bumping this re-runs the effect, replaying the write→strike→rewrite cycle.
  const [cycle, setCycle] = useState(0);
  // Hold until the boot loader has revealed the page. Otherwise the whole
  // self-correction can play behind the overlay and the visitor only catches
  // its tail — the exact "I never got to read it" the animation is meant to
  // avoid. main.tsx sets __appRevealed / fires "app:revealed" on reveal.
  const [ready, setReady] = useState(
    () =>
      typeof window === "undefined" ||
      (window as unknown as { __appRevealed?: boolean }).__appRevealed === true
  );

  useEffect(() => {
    if (ready) return;
    const onReady = () => setReady(true);
    window.addEventListener("app:revealed", onReady, { once: true });
    // Safety net: if the event was missed (or never fires), start anyway.
    const fallback = window.setTimeout(onReady, 1600);
    return () => {
      window.removeEventListener("app:revealed", onReady);
      window.clearTimeout(fallback);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    if (reduced) {
      // Stay in sync with the active language even without animation.
      setText(right);
      setPhase("done");
      onDone?.();
      return;
    }
    // Restart cleanly whenever the language (wrong/right) changes, so the
    // headline can never show one line in EN and the other in ES.
    setText("");
    setPhase("type0");
    const timers: number[] = [];
    let acc = startDelay;

    // 1. write the wrong line
    for (let i = 1; i <= wrong.length; i++) {
      acc += typeSpeed;
      const s = wrong.slice(0, i);
      timers.push(window.setTimeout(() => setText(s), acc));
    }
    // 2. hold, then strike it through
    acc += 480;
    timers.push(window.setTimeout(() => setPhase("strike"), acc));
    // 3. clear the struck line
    acc += 540;
    timers.push(
      window.setTimeout(() => {
        setText("");
        setPhase("type1");
      }, acc)
    );
    // 4. write the corrected line
    for (let i = 1; i <= right.length; i++) {
      acc += typeSpeed;
      const s = right.slice(0, i);
      timers.push(window.setTimeout(() => setText(s), acc));
    }
    timers.push(
      window.setTimeout(() => {
        setPhase("done");
        onDone?.();
      }, acc + 140)
    );

    // 5. hold the corrected line, then replay the whole self-correction.
    if (loopDelay > 0) {
      timers.push(
        window.setTimeout(() => setCycle((c) => c + 1), acc + 140 + loopDelay)
      );
    }

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, wrong, right, cycle, ready]);

  return (
    <span className={className}>
      <span className="relative inline-block">
        {text || "​"}
        {phase === "strike" && (
          <m.span
            aria-hidden
            className="absolute left-0 top-[52%] h-[2.5px] w-full rounded-full bg-current"
            initial={{ scaleX: 0, opacity: 0.9 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: "left" }}
          />
        )}
      </span>
      <span
        aria-hidden
        className={`ml-[1px] inline-block h-[0.86em] w-[2px] translate-y-[0.06em] bg-current ${
          phase === "done" ? "animate-caret-blink" : ""
        }`}
      />
    </span>
  );
};

export default Typewriter;
