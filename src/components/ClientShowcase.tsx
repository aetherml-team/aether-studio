import { useState, useEffect, useCallback, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionCTA } from "@/components/SectionCTA";
import { EASE, viewport } from "@/lib/motion";

type Motif = "octagon" | "speedlines" | "grid" | "film";

interface ClientVisual {
  name: string;
  avatarInitials: string;
  /** Accent legible on the light theme background */
  accentLight: string;
  /** Accent legible on the dark theme background */
  accentDark: string;
  motif: Motif;
}

interface ClientTranslation {
  tagline: string;
  industry: string;
  quote: string;
  quotePerson: string;
  servicesDelivered: string[];
  metricLabel: string;
}

interface ClientMetric {
  value: string;
  label: string;
}

interface Client extends ClientVisual, ClientTranslation {
  metric: ClientMetric;
}

/** Per-client SVG watermark — subtle industry identity inside the card */
function ClientMotif({ type, color }: { type: Motif; color: string }) {
  const base =
    "pointer-events-none select-none absolute right-0 top-0 opacity-[0.18] mix-blend-multiply dark:mix-blend-screen";

  if (type === "octagon")
    return (
      <svg
        className={`${base} h-48 w-48`}
        viewBox="0 0 200 200"
        fill="none"
        style={{ color }}
        aria-hidden
      >
        <polygon
          points="70,8 130,8 192,70 192,130 130,192 70,192 8,130 8,70"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <polygon
          points="84,28 116,28 172,84 172,116 116,172 84,172 28,116 28,84"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="18" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    );

  if (type === "speedlines")
    return (
      <svg
        className={`${base} h-48 w-48`}
        viewBox="0 0 200 200"
        fill="none"
        style={{ color }}
        aria-hidden
      >
        {[0, 28, 56, 84, 112, 140, 168].map((o, i) => (
          <line
            key={i}
            x1={o}
            y1="200"
            x2="200"
            y2={o}
            stroke="currentColor"
            strokeWidth={i % 3 === 0 ? 1.5 : 0.5}
          />
        ))}
      </svg>
    );

  if (type === "grid")
    return (
      <svg
        className={`${base} h-48 w-48`}
        viewBox="0 0 200 200"
        fill="none"
        style={{ color }}
        aria-hidden
      >
        {Array.from({ length: 5 }, (_, col) =>
          Array.from({ length: 6 }, (_, row) => (
            <rect
              key={`${col}-${row}`}
              x={20 + col * 34}
              y={10 + row * 30}
              width="20"
              height="20"
              rx="2"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          ))
        )}
      </svg>
    );

  // film
  return (
    <svg
      className={`${base} h-48 w-48`}
      viewBox="0 0 200 200"
      fill="none"
      style={{ color }}
      aria-hidden
    >
      <path
        d="M155 12 L188 12 L188 45"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M188 155 L188 188 L155 188"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45 188 L12 188 L12 155"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 45 L12 12 L45 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[38, 80, 122, 162].map((y) => (
        <g key={y}>
          <rect
            x="4"
            y={y - 10}
            width="14"
            height="20"
            rx="3"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          <rect
            x="182"
            y={y - 10}
            width="14"
            height="20"
            rx="3"
            stroke="currentColor"
            strokeWidth="0.8"
          />
        </g>
      ))}
      <rect x="38" y="38" width="124" height="124" rx="6" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

const CLIENT_VISUALS: ClientVisual[] = [
  {
    name: "KrakenBay Studio",
    avatarInitials: "KB",
    accentLight: "#7D621A",
    accentDark: "#E8C84A",
    motif: "octagon",
  },
  {
    name: "Tavros",
    avatarInitials: "TV",
    accentLight: "#736600",
    accentDark: "#F5D800",
    motif: "speedlines",
  },
  {
    name: "Inmovilia",
    avatarInitials: "IN",
    accentLight: "#6B5C36",
    accentDark: "#B3A26B",
    motif: "grid",
  },
  {
    name: "Eternus",
    avatarInitials: "ET",
    accentLight: "#6E6134",
    accentDark: "#D8C892",
    motif: "film",
  },
];

const CLIENT_METRIC_VALUES = ["30+", "3x", "2x", "50+"] as const;

const AUTO_MS = 15000;
const SMOOTH = [0.22, 0.61, 0.36, 1] as const;

const ClientShowcase = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPicked, setUserPicked] = useState(false);

  const translations = t("clients.items", { returnObjects: true }) as ClientTranslation[];

  const clients: Client[] = CLIENT_VISUALS.map((visual, i) => ({
    ...visual,
    ...translations[i],
    metric: {
      value: CLIENT_METRIC_VALUES[i],
      label: translations[i]?.metricLabel ?? "",
    },
  }));

  const active = clients[activeIndex];

  useEffect(() => {
    if (userPicked) return;
    const id = window.setInterval(
      () => setActiveIndex((i) => (i + 1) % clients.length),
      AUTO_MS
    );
    return () => window.clearInterval(id);
  }, [userPicked, clients.length]);

  const selectClient = useCallback((i: number) => {
    setUserPicked(true);
    setActiveIndex(i);
  }, []);

  return (
    <section
      id="clients"
      className="client-scope relative overflow-hidden border-y border-border bg-background px-6 py-20 md:px-10 md:py-32"
      style={
        {
          "--ca-light": active.accentLight,
          "--ca-dark": active.accentDark,
        } as CSSProperties
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active.name}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 90% 90%, color-mix(in srgb, var(--client-accent) 7%, transparent), transparent 68%)",
          }}
          aria-hidden
        />
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <h2 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("clients.headline")}
          </h2>
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative flex flex-row gap-2 overflow-x-auto lg:col-span-4 lg:flex-col lg:gap-0 lg:overflow-visible">
            {clients.map((client, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={client.name}
                  type="button"
                  onClick={() => selectClient(i)}
                  aria-pressed={isActive}
                  className={`relative flex-shrink-0 rounded-xl px-4 py-4 text-left transition-all duration-500 ease-out lg:px-6 lg:py-5 ${
                    isActive ? "bg-muted/50" : "hover:bg-muted/35"
                  }`}
                >
                  <span
                    className={`block font-heading text-lg font-bold tracking-tight transition-colors duration-500 md:text-2xl lg:text-3xl ${
                      isActive ? "" : "text-muted-foreground"
                    }`}
                    style={{ color: isActive ? "var(--client-accent)" : undefined }}
                  >
                    {client.name}
                  </span>
                  <span className="mt-1 block font-body text-xs text-muted-foreground">
                    {client.tagline}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 22, scale: 0.987 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.992 }}
                transition={{
                  opacity: { duration: 0.65, ease: SMOOTH },
                  y: { duration: 0.75, ease: SMOOTH },
                  scale: { duration: 0.9, ease: SMOOTH },
                }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-10"
                  style={{
                    boxShadow:
                      "0 0 0 1px color-mix(in srgb, var(--client-accent) 8%, transparent), 0 28px 64px -28px color-mix(in srgb, var(--client-accent) 12%, transparent)",
                  }}
                >
                  <ClientMotif type={active.motif} color="var(--client-accent)" />

                  <div
                    className="pointer-events-none absolute -top-4 left-4 select-none font-heading text-[11rem] leading-none opacity-[0.15] mix-blend-multiply dark:mix-blend-screen md:text-[14rem]"
                    style={{ color: "var(--client-accent)" }}
                    aria-hidden
                  >
                    &ldquo;
                  </div>

                  <div className="relative z-10">
                    <p className="font-heading text-2xl font-normal leading-[1.45] tracking-tight text-foreground md:text-[1.9rem]">
                      {active.quote}
                    </p>
                  </div>

                  <div
                    className="relative z-10 mt-8 flex flex-col gap-5 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
                    style={{
                      borderColor: "color-mix(in srgb, var(--client-accent) 13%, transparent)",
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-body text-[13px] font-semibold tracking-tight"
                        style={{
                          borderColor: "var(--client-accent)",
                          color: "var(--client-accent)",
                        }}
                      >
                        {active.avatarInitials}
                      </div>
                      <div>
                        <p
                          className="font-body text-sm font-semibold leading-tight"
                          style={{ color: "var(--client-accent)" }}
                        >
                          {active.quotePerson}
                        </p>
                        <p className="mt-0.5 font-body text-xs text-muted-foreground">
                          {active.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end">
                      <span
                        className="font-heading text-4xl font-bold tracking-tight md:text-5xl"
                        style={{ color: "var(--client-accent)" }}
                      >
                        {active.metric.value}
                      </span>
                      <span className="mt-0.5 font-body text-xs text-muted-foreground">
                        {active.metric.label}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.55, ease: SMOOTH }}
                  className="mt-5 md:mt-6"
                >
                  <p className="mb-3 font-body text-sm font-medium text-foreground-dim">
                    {t("clients.whatDelivered")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {active.servicesDelivered.map((s, idx) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.52 + idx * 0.07, duration: 0.38, ease: SMOOTH }}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-body text-[13px] text-foreground"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--client-accent)" }}
                          aria-hidden
                        />
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <SectionCTA label={t("common.cta")} />
      </div>
    </section>
  );
};

export default ClientShowcase;
