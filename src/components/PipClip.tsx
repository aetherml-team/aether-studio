import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { done, release, requestPlay } from "@/lib/oneAtATime";

/* One Pip shot as a short muted clip: public/work/pip/<shot>-<theme>-<lang>.mp4, real
   chat on test data, encoded at 720px wide for the size it shows at. It plays once the
   first time it is on screen and stops on its last frame, the answer. The poster (.jpg)
   is that same final state, so reduced motion and the moment before the video loads
   both show the answer. Clips on screen together play one after another. */
export function PipClip({ shot, lang, alt = "", eager = false }: { shot: string; lang: string; alt?: string; eager?: boolean }) {
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const base = `/work/pip/${shot}-${resolvedTheme === "dark" ? "dark" : "light"}-${lang}`;

  useEffect(() => {
    const v = ref.current;
    if (!v || v.ended) return;
    if (inView) requestPlay(v);
    else release(v);
  }, [inView, base]);

  // A clip swapped out (theme or language) or unmounted gives its turn away.
  useEffect(() => {
    const v = ref.current;
    return () => {
      if (v) release(v);
    };
  }, [base]);

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
        playsInline
        preload={eager ? "auto" : "none"}
        onEnded={(e) => done(e.currentTarget)}
        aria-hidden
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
