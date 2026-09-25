import { useState } from "react";

/* Client brand mark from public/work/logos/<slug>.png. When a client has no
   usable mark the chip stays, holding the row's alignment, and shows their
   initial instead of collapsing and shifting everything left. */
export function Logo({ slug, name, dark = false }: { slug: string; name: string; dark?: boolean }) {
  const [missing, setMissing] = useState(false);

  const chip =
    "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border";

  if (missing) {
    return (
      <span className={`${chip} bg-muted font-heading text-[15px] font-semibold text-foreground-dim`} aria-hidden>
        {name.trim().charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <span className={`${chip} ${dark ? "bg-[#0b0a09] p-1.5" : "bg-white"}`}>
      <img
        src={`/work/logos/${slug}.png`}
        alt={`Logo de ${name}`}
        loading="lazy"
        onError={() => setMissing(true)}
        onLoad={(e) => {
          // A dev server answers a deleted asset with the SPA shell, so the
          // load succeeds with nothing in it. Zero width is the real signal.
          if (e.currentTarget.naturalWidth === 0) setMissing(true);
        }}
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
