/* Chrome drops the whole page to about 30fps while two videos play at once (measured on
   the landing, 2026-10-26: one clip 110-120fps, two clips 30-38fps, whatever their size).
   So clips take turns: each asks to play, waits for the one ahead of it, and hands over
   when it ends or leaves the screen. */
let current: HTMLVideoElement | null = null;
const waiting: HTMLVideoElement[] = [];

function start(v: HTMLVideoElement) {
  current = v;
  v.play().catch(() => done(v));
}

/** Plays `v` now if nothing else is playing, else after the clips ahead of it. */
export function requestPlay(v: HTMLVideoElement) {
  if (current === v || waiting.includes(v)) return;
  if (current) waiting.push(v);
  else start(v);
}

/** `v` finished or gave up its turn: start the next clip in line. */
export function done(v: HTMLVideoElement) {
  const i = waiting.indexOf(v);
  if (i >= 0) waiting.splice(i, 1);
  if (current !== v) return;
  current = null;
  const next = waiting.shift();
  if (next) start(next);
}

/** `v` left the screen: pause it and give its turn away. */
export function release(v: HTMLVideoElement) {
  v.pause();
  done(v);
}
