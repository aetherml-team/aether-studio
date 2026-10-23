import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

/* One Pip shot as a short muted loop: public/work/pip/<shot>-<theme>-<lang>.mp4, real
   chat on test data. The poster (.jpg) is the final state, so reduced motion and the
   moment before the video loads both show the answer. Plays only while on screen. */
export function PipClip({ shot, lang, alt = "", eager = false }: { shot: string; lang: string; alt?: string; eager?: boolean }) {
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const base = `/work/pip/${shot}-${resolvedTheme === "dark" ? "dark" : "light"}-${lang}`;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, base]);

  if (!resolvedTheme) return null;
  const poster = <img src={`${base}.jpg`} alt={alt} loading={eager ? "eager" : "lazy"} className="block w-full" />;
  if (reduced) return poster;
  // The poster sits in flow and sizes the box; the video plays over it.
  return (
    <div className="relative">
      {poster}
      <video
        ref={ref}
        key={base}
        src={`${base}.mp4`}
        muted
        loop
        playsInline
        preload={eager ? "auto" : "none"}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
