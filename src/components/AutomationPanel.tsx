import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  CreditCard,
  CalendarCheck,
  Receipt,
  MessageSquareText,
  RefreshCw,
  BellRing,
  Check,
  Loader2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { EASE } from "@/lib/motion";

/* ─────────────────────────────────────────────────────────────
   The work, running itself.

   A live operations console: the real manual tasks Æther takes off
   a team's plate get handled one by one — matched, scheduled,
   billed, answered — while hours saved climbs. It runs ONCE, then
   settles into a finished "all clear" state with the hours-saved
   payoff front and center. Reduced motion shows that final state.
   ───────────────────────────────────────────────────────────── */

interface Task {
  label: string;
  tag: string;
}

const ICONS: LucideIcon[] = [
  CreditCard,
  CalendarCheck,
  Receipt,
  MessageSquareText,
  RefreshCw,
  BellRing,
];

const TICK = 1400;
const TOTAL_HOURS = 32; // the payoff the count climbs toward
const BASE_TASKS = 124; // the day's running tally before this batch

const AutomationPanel = ({ className = "" }: { className?: string }) => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const tasks = t("hero.panel.tasks", { returnObjects: true }) as Task[];
  const len = tasks.length;

  // Cursor walks the list once: rows above are done, the row at it is
  // running, rows below are queued. It stops when every row is handled.
  const [step, setStep] = useState(reduced ? len : 0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setStep((s) => {
        const n = s + 1;
        if (n >= len) window.clearInterval(id);
        return Math.min(n, len);
      });
    }, TICK);
    return () => window.clearInterval(id);
  }, [reduced, len]);

  const done = Math.min(step, len);
  const finished = step >= len;
  const hours = Math.round((TOTAL_HOURS * done) / len);
  const tasksDone = BASE_TASKS + done;
  const progress = (done / len) * 100;

  return (
    <div
      className={`relative w-full max-w-[460px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_120px_-50px_hsl(var(--primary)/0.55),0_24px_60px_-40px_hsl(0_0%_0%/0.6)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden
      />

      {/* header */}
      <div className="flex items-center gap-3 border-b border-border/70 bg-background-deep/40 px-4 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-bright font-heading text-[15px] font-semibold text-primary-foreground shadow-[0_6px_16px_-8px_hsl(var(--primary)/0.9)]">
          Æ
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-body text-[13px] font-semibold leading-tight text-foreground">
            {t("hero.panel.title")}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground-muted">
            aether.run
          </p>
        </div>

        {/* status — equalizer while running, a check once everything clears */}
        <AnimatePresence mode="wait" initial={false}>
          {finished ? (
            <motion.span
              key="done"
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-primary"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
              {t("hero.panel.done")}
            </motion.span>
          ) : (
            <motion.span
              key="live"
              exit={reduced ? undefined : { opacity: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-2.5 py-1"
            >
              <span className="flex h-3 items-end gap-[2px]" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-[2px] rounded-full bg-primary"
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
                  />
                ))}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70">
                {t("hero.panel.live")}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* progress — fills as rows clear, glows full when finished */}
      <div className="h-[3px] w-full bg-border/40">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-bright transition-[width] duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* task feed */}
      <ul className="divide-y divide-border/45 px-1.5 py-1">
        {tasks.map((task, i) => {
          const Icon = ICONS[i % ICONS.length];
          const isDone = i < step;
          const isRunning = i === step;
          return (
            <li
              key={i}
              className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors duration-300"
              style={{ background: isRunning ? "hsl(var(--primary) / 0.07)" : "transparent" }}
            >
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors duration-300"
                style={{
                  borderColor: isDone || isRunning ? "hsl(var(--primary) / 0.35)" : "hsl(var(--border))",
                  background: isDone || isRunning ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted) / 0.5)",
                }}
              >
                <Icon
                  className="h-[15px] w-[15px] transition-colors duration-300"
                  strokeWidth={1.75}
                  style={{ color: isDone || isRunning ? "hsl(var(--primary))" : "hsl(var(--foreground-muted))" }}
                />
              </span>

              <span
                className="min-w-0 flex-1 truncate font-body text-[12.5px] transition-colors duration-300"
                style={{ color: isDone ? "hsl(var(--foreground) / 0.9)" : isRunning ? "hsl(var(--foreground))" : "hsl(var(--foreground) / 0.4)" }}
              >
                {task.label}
              </span>

              <span className="flex shrink-0 items-center">
                <AnimatePresence mode="wait" initial={false}>
                  {isDone ? (
                    <motion.span
                      key="done"
                      initial={reduced ? false : { opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/12 py-0.5 pl-1 pr-2 font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-primary"
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                      {task.tag}
                    </motion.span>
                  ) : isRunning ? (
                    <motion.span
                      key="running"
                      initial={reduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-foreground-muted"
                    >
                      <Loader2 className="h-3 w-3 animate-spin text-primary" strokeWidth={2.5} />
                      {t("hero.panel.running")}
                    </motion.span>
                  ) : (
                    <span key="queued" className="h-3.5 w-3.5 rounded-full border border-border" aria-hidden />
                  )}
                </AnimatePresence>
              </span>
            </li>
          );
        })}
      </ul>

      {/* footer — hours saved is the payoff; it climbs as work clears */}
      <div
        className="flex items-center gap-3 border-t border-border/70 px-4 py-3.5 transition-colors duration-500"
        style={{ background: finished ? "hsl(var(--primary) / 0.07)" : "hsl(var(--background-deep) / 0.4)" }}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition-colors duration-500"
          style={{
            borderColor: "hsl(var(--primary) / 0.35)",
            background: "hsl(var(--primary) / 0.12)",
          }}
        >
          {finished ? (
            <Check className="h-4 w-4 text-primary" strokeWidth={3} />
          ) : (
            <TrendingUp className="h-4 w-4 text-primary" strokeWidth={2} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={hours}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="font-heading text-[26px] font-bold leading-none text-primary"
            >
              {hours}
            </motion.span>
            <span className="font-heading text-[15px] font-semibold text-primary">
              {t("hero.panel.hoursUnit")}
            </span>
            <span className="font-body text-[12px] text-foreground/70">
              {t("hero.panel.savedLabel")}
            </span>
          </div>
          <p className="mt-0.5 truncate font-body text-[11px] text-foreground-muted">
            {tasksDone} {t("hero.panel.metricLabel")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutomationPanel;
