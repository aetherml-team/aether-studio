/** Shared easing + viewport presets — keep motion consistent across the landing */
export const EASE = [0.25, 0.1, 0, 1] as const;

export const viewport = { once: true, margin: "-80px" as const };
export const viewportTight = { once: true, margin: "-60px" as const };
export const viewportLoose = { once: true, margin: "-40px" as const };

export function fadeUp(delay = 0, duration = 0.65) {
  return {
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { duration, delay, ease: EASE },
  };
}

export function fadeIn(delay = 0, duration = 0.6) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport,
    transition: { duration, delay, ease: EASE },
  };
}

export function slideX(
  from: "left" | "right",
  delay = 0,
  duration = 0.65,
) {
  const x = from === "left" ? -28 : 28;
  return {
    initial: { opacity: 0, x },
    whileInView: { opacity: 1, x: 0 },
    viewport,
    transition: { duration, delay, ease: EASE },
  };
}
