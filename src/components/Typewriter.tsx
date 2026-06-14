import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
}

type Phase = "type0" | "strike" | "type1" | "done";

const Typewriter = ({
  wrong,
  right,
  startDelay = 350,
  typeSpeed = 55,
  className = "",
  onDone,
}: Props) => {
  const reduced = useReducedMotion();
  const [text, setText] = useState(reduced ? right : "");
  const [phase, setPhase] = useState<Phase>(reduced ? "done" : "type0");

  useEffect(() => {
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

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, wrong, right]);

  return (
    <span className={className}>
      <span className="relative inline-block">
        {text || "​"}
        {phase === "strike" && (
          <motion.span
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
