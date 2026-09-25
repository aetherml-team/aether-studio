import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, ArrowRight, Instagram } from "lucide-react";
import { SYSTEMS } from "@/content/offer";
import { track } from "@/lib/analytics";
import { Logo } from "@/components/Logo";
import { Section } from "@/components/Sheet";
import { SectionCTA } from "@/components/SectionCTA";

interface SystemCopy {
  name: string;
  vertical: string;
  spotlight: string;
  summary: string;
  modules: string[];
  frames: string[];
  cta: string;
}

interface Fact {
  value: string;
  label: string;
}

/* Real customer applications. The source images already blur private data. */
function Shots({ srcs, labels, alt }: { srcs: string[]; labels: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);
  const key = srcs[0];

  useEffect(() => setCurrent(0), [key]);

  return (
    <div className="bg-[#09090C]">
      <div className="relative" style={{ aspectRatio: "1512 / 787" }}>
        {srcs.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === current ? `${alt}. ${labels[i] ?? ""}` : ""}
            loading={i === 0 ? "eager" : "lazy"}
            width={1512}
            height={787}
            className="absolute inset-0 block h-full w-full object-cover object-top"
            style={{
              opacity: i === current ? 1 : 0,
              filter: i === current ? "blur(0px)" : "blur(6px)",
              transition: "opacity 420ms var(--ease-out), filter 420ms var(--ease-out)",
            }}
          />
        ))}
      </div>

      <div className="flex min-h-16 items-center justify-between gap-5 border-t border-white/10 px-4 py-3 text-white sm:px-5">
        <p className="flex min-w-0 items-baseline gap-3 font-body text-[13px] leading-snug text-white/85 sm:text-[14px]" aria-live="polite">
          <span className="shrink-0 font-mono text-[10px] tracking-[0.16em] text-white/45">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span>{labels[current]}</span>
        </p>

        {srcs.length > 1 && (
          <div className="flex shrink-0 gap-1.5" aria-label={alt} role="group">
          {srcs.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`${alt}, ${i + 1} / ${srcs.length}`}
              aria-current={i === current}
              onClick={() => setCurrent(i)}
              className={`press grid h-8 w-8 place-items-center rounded-full border font-mono text-[10px] transition-colors ${
                i === current
                  ? "border-white/55 bg-white text-black"
                  : "border-white/15 text-white/55 hover:border-white/35 hover:text-white"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

const STORY_ORDER: Record<string, number[]> = {
  tavros: [2, 1, 3],
  eternus: [3, 1, 2],
  sismocafe: [3, 2, 1],
};

const LiveSystemsSection = () => {
  const { t, i18n } = useTranslation();
  const copy = t("systems.items", { returnObjects: true }) as SystemCopy[];
  const facts = t("systems.facts", { returnObjects: true }) as Fact[];
  const visibleSystems = SYSTEMS.filter((system) => !system.upcoming);
  // Eternus opens first because its owner dashboard shows the whole operation.
  const [active, setActive] = useState(1);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const sys = SYSTEMS[active];
  const c = copy[active];
  const order = STORY_ORDER[sys.slug] ?? Array.from({ length: sys.shots }, (_, i) => i + 1);
  const shots = order.map((shot) => `/work/${sys.slug}-${shot}.png`);
  const onKey = (e: React.KeyboardEvent) => {
    const last = visibleSystems.length - 1;
    let next = active;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  if (!c) return null;

  return (
    <Section id="systems" title={t("systems.headline")} lead={t("systems.description")}>
      <div>
        <div
          role="tablist"
          aria-label={t("systems.headline")}
          onKeyDown={onKey}
          className="grid auto-cols-[minmax(210px,1fr)] grid-flow-col overflow-x-auto border-y border-border"
        >
          {visibleSystems.map((s, i) => {
            const item = copy[i];
            const proof = facts[i];
            if (!item) return null;
            const on = i === active;
            return (
              <button
                key={s.slug}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`sys-tab-${s.slug}`}
                aria-selected={on}
                aria-controls="sys-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`press flex min-h-24 items-start gap-3 border-b-2 px-4 py-4 text-left transition-colors duration-200 ${
                  on ? "border-primary bg-primary/[0.035]" : "border-transparent hover:bg-foreground/[0.025]"
                }`}
              >
                <Logo slug={s.slug} name={item.name} dark={s.logoDark} />
                <span className="min-w-0">
                  <span
                    className={`block font-heading text-[14.5px] font-semibold leading-tight tracking-[-0.015em] ${
                      on ? "text-foreground" : "text-foreground/60"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="mt-1 block max-w-[22ch] font-body text-[12px] leading-snug text-foreground/55">
                    {s.upcoming ? t("systems.upcomingBadge") : proof?.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div id="sys-panel" role="tabpanel" aria-labelledby={`sys-tab-${sys.slug}`} className="mt-8 min-w-0">
          <div className="glow-border overflow-hidden rounded-lg border border-border bg-[#09090C]">
            <Shots srcs={shots} labels={c.frames} alt={`${c.name} — ${c.vertical}`} />
          </div>

          <div className="mt-6 border-b border-border pb-7">
            <div>
              <div className="flex flex-col gap-2 border-b border-border pb-4 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.12em] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <p className="text-primary">{c.vertical}</p>
                <p className="text-foreground-dim">{c.modules.join("  ·  ")}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {sys.store && (
                  <a
                    href={sys.store}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11.5px] text-primary underline-offset-4 hover:underline"
                  >
                    {t(sys.slug === "weddingmethod" ? "systems.visitCourse" : "systems.visitStore")}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  </a>
                )}
                {sys.site && (
                  <a
                    href={sys.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11.5px] text-foreground-dim underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {t("systems.visitSite")}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  </a>
                )}
                {sys.instagram && (
                  <a
                    href={sys.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram de ${c.name}`}
                    className="inline-flex items-center gap-1 font-mono text-[11.5px] text-foreground-dim underline-offset-4 hover:text-foreground hover:underline"
                  >
                    <Instagram className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                    Instagram
                  </a>
                )}
              </div>

              <a
                href="#contact-form"
                onClick={() => track("Vertical CTA", { vertical: sys.slug, language: i18n.language })}
                className="press btn-ghost mt-5 inline-flex h-12 items-center gap-2 rounded-md px-5 font-body text-[14px] font-medium text-foreground"
              >
                {c.cta}
                <ArrowRight className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>

      <SectionCTA label={t("common.cta")} className="mt-8" />

    </Section>
  );
};

export default LiveSystemsSection;
