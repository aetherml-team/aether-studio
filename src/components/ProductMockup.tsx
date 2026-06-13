import type { CSSProperties } from "react";

/* ─────────────────────────────────────────────────────────────
   Representative product screens, framed like a real browser shot.
   These stand in for the actual work until real screenshots land:
   pass `screenshot` and the component renders the real image instead,
   so swapping is a one-line change per client. Each variant is a
   believable UI for that client's industry, tinted with their accent.
   ───────────────────────────────────────────────────────────── */

export type MockVariant = "booking" | "billing" | "realestate" | "film";

interface Props {
  variant: MockVariant;
  /** brand accent (any CSS color) used as the screen's primary */
  accent: string;
  /** faux address-bar label, e.g. "app.tavros.mx" */
  label: string;
  /** when a real screenshot exists, pass its src to replace the mockup */
  screenshot?: string;
  alt?: string;
  className?: string;
}

const Bar = ({ w, c = "foreground", o = 0.22 }: { w: string; c?: string; o?: number }) => (
  <span
    className="block h-1.5 rounded-full"
    style={{ width: w, background: c === "ac" ? "var(--ac)" : `hsl(var(--${c}) / ${o})` }}
  />
);

function BookingScreen() {
  const days = ["M", "T", "W", "T", "F"];
  return (
    <div className="flex h-full text-[8px]">
      <aside className="hidden w-[22%] flex-col gap-2 border-r border-border/60 bg-background-deep/50 p-3 sm:flex">
        <div className="mb-1 h-2.5 w-2/3 rounded" style={{ background: "var(--ac)" }} />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-sm" style={{ background: i === 1 ? "var(--ac)" : "hsl(var(--foreground)/0.25)" }} />
            <Bar w={`${64 - i * 6}%`} />
          </div>
        ))}
      </aside>
      <main className="flex-1 p-3">
        <div className="mb-3 flex items-center justify-between">
          <Bar w="42%" o={0.34} />
          <span className="h-4 w-12 rounded-md" style={{ background: "var(--ac)" }} />
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {days.map((d, col) => (
            <div key={col} className="space-y-1.5">
              <span className="block text-center text-[7px] font-semibold text-foreground/45">{d}</span>
              {Array.from({ length: 4 }).map((_, row) => {
                const filled = (col + row) % 3 !== 0;
                return (
                  <span
                    key={row}
                    className="block rounded"
                    style={{
                      height: 14,
                      background: filled ? "color-mix(in srgb, var(--ac) 26%, transparent)" : "hsl(var(--muted)/0.6)",
                      borderLeft: filled ? "2px solid var(--ac)" : "none",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function BillingScreen() {
  return (
    <div className="h-full p-3 text-[8px]">
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          { k: "MRR", v: "78%" },
          { k: "Collected", v: "60%" },
          { k: "Overdue", v: "30%" },
        ].map((s, i) => (
          <div key={i} className="rounded-lg border border-border/60 bg-background-deep/40 p-2">
            <Bar w="50%" o={0.3} />
            <div className="mt-1.5 h-2.5 rounded" style={{ width: s.v, background: i === 0 ? "var(--ac)" : "hsl(var(--foreground)/0.3)" }} />
          </div>
        ))}
      </div>
      <div className="mb-3 flex h-12 items-end gap-1.5 rounded-lg border border-border/60 bg-background-deep/30 p-2">
        {[40, 62, 48, 75, 58, 88, 70, 95].map((h, i) => (
          <span key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i >= 6 ? "var(--ac)" : "hsl(var(--foreground)/0.18)" }} />
        ))}
      </div>
      <div className="space-y-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2 rounded border border-border/50 bg-card/60 px-2 py-1.5">
            <span className="h-2 w-2 rounded-full bg-success" />
            <Bar w="34%" />
            <span className="ml-auto rounded-full bg-success/15 px-1.5 py-0.5 text-[6.5px] font-semibold text-success">Paid</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RealEstateScreen({ accent }: { accent: string }) {
  return (
    <div className="flex h-full text-[8px]">
      <main className="flex-1 p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <Bar w="38%" o={0.34} />
          <Bar w="16%" c="ac" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border/60 bg-card/60">
              <div
                className="h-9"
                style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 55%, #20242e), #14161c)` }}
              />
              <div className="space-y-1 p-1.5">
                <Bar w="70%" o={0.3} />
                <div className="flex items-center justify-between">
                  <Bar w="30%" />
                  <span className="text-[7px] font-bold" style={{ color: "var(--ac)" }}>$</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <aside className="hidden w-[26%] flex-col gap-1.5 border-l border-border/60 bg-background-deep/50 p-2 sm:flex">
        <Bar w="60%" o={0.3} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5 rounded border border-border/50 bg-card/50 p-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: "color-mix(in srgb, var(--ac) 40%, transparent)" }} />
            <Bar w={`${60 - i * 8}%`} />
          </div>
        ))}
      </aside>
    </div>
  );
}

function FilmScreen({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col text-[8px]">
      <div
        className="relative flex-1"
        style={{ background: `radial-gradient(ellipse at 30% 20%, color-mix(in srgb, ${accent} 35%, transparent), transparent 60%), linear-gradient(160deg, #1a1d24, #0e1014)` }}
      >
        <div className="absolute left-3 top-3 flex items-center gap-3">
          <span className="font-heading text-[10px] font-semibold tracking-wide text-white/85">ETERNUS</span>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 w-5 rounded-full bg-white/20" />
          ))}
        </div>
        <div className="absolute bottom-4 left-3 space-y-1.5">
          <div className="h-2.5 w-28 rounded bg-white/70" />
          <div className="h-1.5 w-20 rounded bg-white/35" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 bg-background-deep/60 p-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-7 rounded"
            style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${accent} ${30 + i * 8}%, #20242e), #121419)` }}
          />
        ))}
      </div>
    </div>
  );
}

const ProductMockup = ({ variant, accent, label, screenshot, alt, className = "" }: Props) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] ${className}`}
      style={{ "--ac": accent } as CSSProperties}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-border/70 bg-background-deep/70 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="h-2 w-2 rounded-full" style={{ background: c, opacity: 0.55 }} />
          ))}
        </span>
        <div className="ml-1 flex h-4 flex-1 items-center rounded-md border border-border/60 bg-card/50 px-2">
          <span className="font-mono text-[8px] text-foreground-muted">{label}</span>
        </div>
      </div>

      {/* screen */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-background">
        {screenshot ? (
          <img src={screenshot} alt={alt ?? label} className="h-full w-full object-cover object-top" loading="lazy" />
        ) : variant === "booking" ? (
          <BookingScreen />
        ) : variant === "billing" ? (
          <BillingScreen />
        ) : variant === "realestate" ? (
          <RealEstateScreen accent={accent} />
        ) : (
          <FilmScreen accent={accent} />
        )}
      </div>
    </div>
  );
};

export default ProductMockup;
