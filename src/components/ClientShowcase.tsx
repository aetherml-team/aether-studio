import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";

type ClientTheme = {
  name: string;
  avatarInitials: string;
  tagline: string;
  industry: string;
  /** First-person — what they “said” */
  quote: string;
  /** Work æther delivered */
  servicesDelivered: readonly string[];
  metric: { value: string; label: string };
  void: string;
  surface: string;
  primary: string;
  primaryDim: string;
  primaryBright: string;
  theme: "dark" | "light";
  atmosphere: string;
};

const clients: ClientTheme[] = [
  {
    name: "KrakenBay Studio",
    avatarInitials: "KB",
    tagline: "BJJ · Black & Gold",
    industry: "Best jiujitsu school in Guadalajara",
    quote:
      "Finally, our front desk isn’t chasing payments and our schedule runs itself. The mats stay full and we get to coach — not wrestle spreadsheets.",
    servicesDelivered: [
      "Class & mat scheduling automation",
      "Membership renewals & billing",
      "Payment reminders & follow-ups",
    ],
    metric: { value: "30+", label: "hours saved weekly" },
    void: "#111108",
    surface: "#1A1800",
    primary: "#E8C84A",
    primaryDim: "#C8A820",
    primaryBright: "#F5DF80",
    theme: "dark",
    atmosphere:
      "radial-gradient(ellipse 85% 65% at 72% 45%, rgba(232,200,74,0.14), transparent 58%), linear-gradient(180deg, #111108 0%, #1A1800 100%)",
  },
  {
    name: "Tavros",
    avatarInitials: "TV",
    tagline: "Strength · Pure Black & Electric Yellow",
    industry: "Best premium gym",
    quote:
      "Billing, access, and our coaches’ calendars finally talk to each other. We stopped losing money to late renewals and chaos at the front desk.",
    servicesDelivered: [
      "Membership billing automation",
      "Access control integrations",
      "Trainer scheduling & payroll hooks",
    ],
    metric: { value: "3x", label: "faster billing cycles" },
    void: "#0A0A0A",
    surface: "#1A1A1A",
    primary: "#F5D800",
    primaryDim: "#D4B800",
    primaryBright: "#FFF176",
    theme: "dark",
    atmosphere:
      "radial-gradient(ellipse 85% 65% at 72% 45%, rgba(245,216,0,0.12), transparent 58%), linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)",
  },
  {
    name: "Inmovilia",
    avatarInitials: "IN",
    tagline: "Real Estate · Linen & Warm Olive",
    industry: "Construction & real estate company",
    quote:
      "Every lead and site visit is tracked — nothing slips between sales and the build team anymore. We respond faster and close with confidence.",
    servicesDelivered: [
      "Lead intake & CRM routing",
      "Site visit scheduling & reminders",
      "Sales ↔ construction handoff workflows",
    ],
    metric: { value: "2x", label: "faster lead response" },
    void: "#F2EFE8",
    surface: "#E8E4DA",
    primary: "#7A6A40",
    primaryDim: "#5A4E2C",
    primaryBright: "#9A8A58",
    theme: "light",
    atmosphere:
      "radial-gradient(ellipse 85% 65% at 72% 45%, rgba(122,106,64,0.12), transparent 58%), linear-gradient(180deg, #F2EFE8 0%, #E8E4DA 100%)",
  },
  {
    name: "Eternus",
    avatarInitials: "ET",
    tagline: "Wedding · Navy & Champagne Gold",
    industry: "Best wedding filmmaker",
    quote:
      "From the first inquiry to the final film delivery, every contract, deposit, and client message is in one flow. We create — we don’t chase admin.",
    servicesDelivered: [
      "Inquiry-to-contract pipeline",
      "Deposits & milestone billing",
      "Client comms & delivery workflow",
    ],
    metric: { value: "50+", label: "weddings coordinated" },
    void: "#0A0C14",
    surface: "#12141E",
    primary: "#C8B882",
    primaryDim: "#A89858",
    primaryBright: "#E8D8A8",
    theme: "dark",
    atmosphere:
      "radial-gradient(ellipse 85% 65% at 72% 45%, rgba(200,184,130,0.12), transparent 58%), linear-gradient(180deg, #0A0C14 0%, #12141E 100%)",
  },
];

const AUTO_MS = 5000;

/** Softer than default — feels like a cross-dissolve, not a cut */
const SMOOTH = [0.22, 0.61, 0.36, 1] as const;

/** Only staggers children — outer motion.div already fades the whole block */
const bubbleVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.04,
    },
  },
};

const bubbleItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: SMOOTH },
  },
};

const ClientShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPicked, setUserPicked] = useState(false);
  const active = clients[activeIndex];
  const isLight = active.theme === "light";

  useEffect(() => {
    if (userPicked) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % clients.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [userPicked]);

  const selectClient = useCallback((i: number) => {
    setUserPicked(true);
    setActiveIndex(i);
  }, []);

  const labelClass = isLight ? "text-[#6B6250]" : "text-foreground-dim";
  const headingClass = isLight ? "text-[#2C281C]" : "text-foreground";
  const subMutedClass = isLight ? "text-[#5A5244]" : "text-muted-foreground";
  const nameInactiveOpacity = isLight ? "opacity-45" : "opacity-40";

  const bubbleBg = isLight ? "bg-[#F0EBE2]/95" : "bg-[#0c0c10]/85";
  const bubbleBorder = isLight ? "border-[#7A6A40]/22" : "border-white/[0.09]";
  const quoteClass = isLight
    ? "text-[#2A261C] font-body text-[17px] md:text-lg leading-[1.75] italic font-light"
    : "text-foreground/92 font-body text-[17px] md:text-lg leading-[1.75] italic font-light";

  return (
    <section
      id="clients"
      className="relative overflow-hidden px-6 py-20 md:px-10 md:py-32"
      style={{ color: isLight ? "#2C281C" : undefined }}
    >
      {/* Cross-fade atmosphere — two layers for smooth blend */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {clients.map((c, i) => (
          <motion.div
            key={c.name}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === activeIndex ? 1 : 0,
            }}
            transition={{ duration: 1.15, ease: SMOOTH }}
            style={{ background: c.atmosphere }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <p className={`mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] ${labelClass}`}>
            Our clients
          </p>
          <h2 className={`max-w-2xl font-heading text-4xl font-bold tracking-tight md:text-5xl ${headingClass}`}>
            Results that speak for themselves
          </h2>
          {!userPicked && (
            <p className={`mt-3 font-mono text-[11px] ${subMutedClass}`}>
              Rotating every {AUTO_MS / 1000}s — click a name to hold
            </p>
          )}
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
                  className={`relative flex-shrink-0 rounded-xl px-4 py-4 text-left transition-all duration-500 ease-out lg:rounded-none lg:border-l-2 lg:px-6 lg:py-5 ${
                    isActive
                      ? isLight
                        ? "bg-[#E8E4DA]/80 lg:bg-transparent"
                        : "bg-black/20 lg:bg-transparent"
                      : `${nameInactiveOpacity} hover:opacity-70`
                  }`}
                  style={{
                    borderLeftColor: isActive ? client.primary : "transparent",
                  }}
                >
                  <span
                    className="block font-heading text-lg font-bold tracking-tight transition-colors duration-500 md:text-2xl lg:text-3xl"
                    style={{ color: isActive ? client.primary : undefined }}
                  >
                    {client.name}
                  </span>
                  <span className={`mt-1 block font-mono text-[10px] uppercase tracking-wider ${subMutedClass}`}>
                    {client.tagline}
                  </span>
                  <span className={`mt-0.5 block font-mono text-[11px] ${subMutedClass}`}>{client.industry}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[320px] lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 20, scale: 0.988 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.992 }}
                transition={{
                  opacity: { duration: 0.7, ease: SMOOTH },
                  y: { duration: 0.78, ease: SMOOTH },
                  scale: { duration: 0.9, ease: SMOOTH },
                }}
                className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6"
              >
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.65, delay: 0.05, ease: SMOOTH }}
                  className="flex shrink-0 justify-center md:block md:w-[88px]"
                >
                  <div
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 font-mono text-lg font-medium tracking-tight shadow-lg md:h-[88px] md:w-[88px] md:text-xl"
                    style={{
                      borderColor: active.primary,
                      color: active.primary,
                      backgroundColor: isLight ? `${active.surface}cc` : "rgba(0,0,0,0.35)",
                      boxShadow: `0 12px 40px -16px ${active.primary}44`,
                    }}
                  >
                    {active.avatarInitials}
                  </div>
                </motion.div>

                {/* Speech column */}
                <div className="min-w-0 flex-1">
                  <motion.div
                    variants={bubbleVariants}
                    initial="hidden"
                    animate="show"
                    className={`relative rounded-[1.35rem] border px-6 py-7 shadow-xl backdrop-blur-md md:px-8 md:py-8 ${bubbleBg} ${bubbleBorder}`}
                    style={{
                      boxShadow: `0 24px 60px -28px rgba(0,0,0,0.45), inset 0 1px 0 ${active.primary}18`,
                    }}
                  >
                    {/* Tail — desktop: points left toward avatar */}
                    <span
                      className="absolute hidden md:block"
                      style={{
                        left: -10,
                        top: 28,
                        width: 0,
                        height: 0,
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        borderRight: `10px solid ${isLight ? "#F0EBE2" : "rgba(12,12,16,0.92)"}`,
                        filter: "drop-shadow(-2px 0 1px rgba(0,0,0,0.12))",
                      }}
                      aria-hidden
                    />
                    <motion.p variants={bubbleItem} className={`relative z-10 ${quoteClass}`}>
                      {active.quote}
                    </motion.p>

                    <motion.div
                      variants={bubbleItem}
                      className="relative z-10 mt-6 flex flex-wrap items-baseline gap-2 border-t pt-5"
                      style={{ borderColor: `${active.primary}22` }}
                    >
                      <span
                        className="font-heading text-3xl font-bold tracking-tight md:text-4xl"
                        style={{ color: active.primary }}
                      >
                        {active.metric.value}
                      </span>
                      <span className={`font-body text-sm font-normal ${subMutedClass}`}>{active.metric.label}</span>
                    </motion.div>
                  </motion.div>

                  {/* Services delivered */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.6, ease: SMOOTH }}
                    className="mt-6 md:mt-7"
                  >
                    <p
                      className={`mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] ${subMutedClass}`}
                    >
                      What æther delivered
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {active.servicesDelivered.map((s, idx) => (
                        <motion.li
                          key={s}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + idx * 0.07, duration: 0.5, ease: SMOOTH }}
                          className={`flex items-start gap-3 font-body text-[14px] leading-snug md:text-[15px] ${
                            isLight ? "text-[#3D3828]" : "text-foreground/85"
                          }`}
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: active.primary }}
                            aria-hidden
                          />
                          {s}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {!userPicked && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-black/15" aria-hidden>
          <motion.div
            key={activeIndex}
            className="h-full rounded-full opacity-90"
            style={{ backgroundColor: active.primary }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
          />
        </div>
      )}
    </section>
  );
};

export default ClientShowcase;
