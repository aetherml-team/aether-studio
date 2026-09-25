/** Shared easing + viewport presets — keep motion consistent across the landing */
export const EASE = [0.25, 0.1, 0, 1] as const;

export const viewport = { once: true, margin: "0px 0px 120px 0px" as const };
export const viewportTight = { once: true, margin: "0px 0px 90px 0px" as const };
export const viewportLoose = { once: true, margin: "0px 0px 160px 0px" as const };

export function fadeUp(delay = 0, duration = 0.45) {
  return {
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: { duration, delay, ease: EASE },
  };
}

export function fadeIn(delay = 0, duration = 0.4) {
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
