import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { m, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, Loader2, RotateCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

/**
 * Native "Book a call" panel for the contact section. Replaces the old Cal.com
 * embed with a custom slot picker + details form that talk to our own serverless
 * proxies (api/availability.ts → Calendly available times, api/book.ts → Calendly
 * create-invitee). The Calendly token stays server-side; this component only ever
 * sees a list of ISO slot times and posts the chosen one with the booker's name,
 * email and an optional note.
 *
 * Lazy-loaded by ContactSection. On a successful booking, api/book.ts fires the
 * same branded Resend confirmation the contact form sends; here we mirror the
 * "Audit Booked" analytics event the old embed reported.
 */

type LoadState = "loading" | "ready" | "error";
type BookState = "idle" | "booking" | "booked" | "error";
type Step = "pick" | "details";
type FieldErrors = Partial<Record<"name" | "email", string>>;

const AVAILABILITY_ENDPOINT = "/api/availability";
const BOOK_ENDPOINT = "/api/book";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 2;

// The visitor's own timezone — used to label slots and sent to Calendly so the
// invite lands in their local time. Falls back to the studio's zone if unknown.
const BROWSER_TZ =
  (typeof Intl !== "undefined" && Intl.DateTimeFormat().resolvedOptions().timeZone) ||
  "America/Mexico_City";

/** Local-day bucket key — slots are grouped and tabbed by the visitor's day. */
const dayKeyOf = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const firstNameOf = (s: string) => s.trim().split(/\s+/)[0] || s.trim();

const BookCall = () => {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const lang = i18n.language;

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [slots, setSlots] = useState<string[]>([]);

  const [step, setStep] = useState<Step>("pick");
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null); // ISO start time

  const [bookState, setBookState] = useState<BookState>("idle");
  const [pickerNote, setPickerNote] = useState(""); // e.g. "that slot was taken"
  const [errors, setErrors] = useState<FieldErrors>({});
  const trackedRef = useRef(false);
  const bookedRef = useRef<{ name: string; email: string; start: string }>({
    name: "",
    email: "",
    start: "",
  });

  const loadSlots = useCallback(async () => {
    setLoadState("loading");
    try {
      const res = await fetch(AVAILABILITY_ENDPOINT, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Availability responded ${res.status}`);
      const data = (await res.json()) as { slots?: string[] };
      setSlots(Array.isArray(data.slots) ? data.slots : []);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // Group the flat slot list into local days, preserving the ascending order the
  // API returns (so days and the times within them stay chronological).
  const days = useMemo(() => {
    const map = new Map<string, { key: string; date: Date; times: string[] }>();
    for (const iso of slots) {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) continue;
      const key = dayKeyOf(d);
      const bucket = map.get(key);
      if (bucket) bucket.times.push(iso);
      else map.set(key, { key, date: d, times: [iso] });
    }
    return [...map.values()];
  }, [slots]);

  // Default to the first available day once slots load (and recover if the active
  // day disappears after a reload).
  useEffect(() => {
    if (loadState === "ready" && days.length && !days.some((d) => d.key === activeDay)) {
      setActiveDay(days[0].key);
    }
  }, [loadState, days, activeDay]);

  const fmtDayShort = (d: Date) =>
    new Intl.DateTimeFormat(lang, { weekday: "short", month: "short", day: "numeric" }).format(d);
  const fmtDayLong = (d: Date) =>
    new Intl.DateTimeFormat(lang, { weekday: "long", month: "long", day: "numeric" }).format(d);
  const fmtTime = (iso: string) =>
    new Intl.DateTimeFormat(lang, { hour: "numeric", minute: "2-digit" }).format(new Date(iso));

  const pickTime = (iso: string) => {
    setSelected(iso);
    setStep("details");
    setBookState("idle");
    setErrors({});
  };

  const backToPick = () => {
    setStep("pick");
    setBookState("idle");
  };

  const clearError = (field: "name" | "email") =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  function validate(name: string, email: string): FieldErrors {
    const next: FieldErrors = {};
    const n = name.trim();
    const e = email.trim();
    if (!n) next.name = t("contact.validation.nameRequired");
    else if (n.length < NAME_MIN) next.name = t("contact.validation.nameShort");
    if (!e) next.email = t("contact.validation.emailRequired");
    else if (!EMAIL_RE.test(e)) next.email = t("contact.validation.emailInvalid");
    return next;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (bookState === "booking" || !selected) return;

    const form = ev.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const company = String(data.get("company") ?? ""); // honeypot

    const fieldErrors = validate(name, email);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      const firstInvalid = (["name", "email"] as const).find((k) => fieldErrors[k]);
      if (firstInvalid) document.getElementById(`book-${firstInvalid}`)?.focus();
      return;
    }
    setErrors({});
    setBookState("booking");

    try {
      const res = await fetch(BOOK_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          company,
          start: selected,
          timezone: BROWSER_TZ,
          language: lang,
        }),
      });

      if (!res.ok) {
        // 409 → the slot was taken or expired between load and submit. Send them
        // back to a fresh slot list rather than showing a dead end.
        if (res.status === 409) {
          setPickerNote(t("contact.book.slotTaken"));
          setBookState("idle");
          setStep("pick");
          setSelected(null);
          loadSlots();
          return;
        }
        throw new Error(`Book responded ${res.status}`);
      }

      bookedRef.current = { name: name.trim(), email: email.trim(), start: selected };
      setBookState("booked");
      if (!trackedRef.current) {
        trackedRef.current = true;
        track("Audit Booked", { language: lang });
      }
    } catch {
      setBookState("error");
    }
  }

  // Shared field styling, matching the contact form (ContactSection.tsx).
  const fieldClass =
    "h-12 rounded-xl border-border bg-background/60 font-body transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground/60";
  const textareaClass =
    "min-h-[96px] w-full resize-y rounded-xl border border-border bg-background/60 px-4 py-3 font-body text-sm text-foreground transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60";
  const labelClass = "mb-1.5 block font-body text-[13px] font-medium text-foreground-dim";
  const errorRing = "border-destructive/70 focus-visible:ring-destructive/30 focus:ring-destructive/30";
  const errorTextClass = "mt-1.5 font-body text-[12.5px] text-destructive";

  // --- Success: replaces the whole panel ---------------------------------------
  if (bookState === "booked") {
    const { name, email, start } = bookedRef.current;
    return (
      <div className="flex flex-col items-center rounded-xl border border-border bg-background/40 px-6 py-10 text-center">
        <m.span
          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-success/30 bg-success/10"
        >
          <Check className="h-5 w-5 text-success" strokeWidth={2} aria-hidden />
        </m.span>
        <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">
          {t("contact.book.bookedTitle", { name: firstNameOf(name) })}
        </h3>
        {start && (
          <p className="mt-3 font-body text-[15px] font-medium text-foreground">
            {fmtDayLong(new Date(start))} · {fmtTime(start)}
          </p>
        )}
        <p className="mt-2 max-w-sm font-body text-[14px] font-light leading-relaxed text-muted-foreground">
          {t("contact.book.bookedBody", { email })}
        </p>
      </div>
    );
  }

  const activeBucket = days.find((d) => d.key === activeDay) ?? days[0];

  return (
    <div>
      {/* header — kept compact so the card stays within the left column's height
          (the page already explains the audit; no need to repeat it here). */}
      <div className="flex flex-col items-center text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary/80">
          {t("contact.bookEyebrow")}
        </p>
        <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
          {t("contact.bookTitle")}
        </h3>
      </div>

      <div className="mt-6">
        {loadState === "loading" && (
          <div className="flex flex-col items-center py-8 text-center" role="status">
            <Loader2 className="h-5 w-5 animate-spin text-primary/70" aria-hidden />
            <p className="mt-3 font-body text-[13px] text-muted-foreground">
              {t("contact.book.loading")}
            </p>
          </div>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center py-6 text-center">
            <p className="max-w-xs font-body text-[14px] text-muted-foreground">
              {t("contact.book.loadError")}
            </p>
            <button
              type="button"
              onClick={loadSlots}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 font-body text-[13px] font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10"
            >
              <RotateCw className="h-3.5 w-3.5" aria-hidden />
              {t("contact.book.retry")}
            </button>
          </div>
        )}

        {loadState === "ready" && days.length === 0 && (
          <div className="flex flex-col items-center py-6 text-center">
            <p className="font-body text-[14px] text-muted-foreground">{t("contact.book.empty")}</p>
            <p className="mt-1.5 max-w-xs font-body text-[13px] text-muted-foreground/80">
              {t("contact.book.emptyCta")}
            </p>
          </div>
        )}

        {loadState === "ready" && days.length > 0 && step === "pick" && activeBucket && (
          <div>
            {pickerNote && (
              <p
                role="alert"
                className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-center font-body text-[13px] text-destructive"
              >
                {pickerNote}
              </p>
            )}
            <p className="text-center font-body text-[12px] text-muted-foreground/80">
              {t("contact.book.tzNote", { tz: BROWSER_TZ })}
            </p>

            {/* day selector */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {days.map((d) => {
                const active = d.key === activeBucket.key;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setActiveDay(d.key)}
                    aria-pressed={active}
                    className={cn(
                      "shrink-0 rounded-lg border px-3.5 py-2 font-body text-[13px] transition-colors",
                      active
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border bg-background/40 text-muted-foreground hover:border-border hover:text-foreground"
                    )}
                  >
                    {fmtDayShort(d.date)}
                  </button>
                );
              })}
            </div>

            {/* times for the active day */}
            <m.div
              key={activeBucket.key}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] }}
              // Capped + scrollable so a full day of slots can't make the card
              // tower over the left column; extra times scroll within.
              className="mt-4 grid max-h-[11.5rem] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-1.5"
            >
              {activeBucket.times.map((iso) => (
                <m.button
                  key={iso}
                  type="button"
                  onClick={() => pickTime(iso)}
                  whileHover={reduced ? undefined : { scale: 1.02 }}
                  whileTap={reduced ? undefined : { scale: 0.98 }}
                  className="rounded-lg border border-border bg-background/50 py-2.5 font-body text-[13.5px] font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10"
                >
                  {fmtTime(iso)}
                </m.button>
              ))}
            </m.div>
          </div>
        )}

        {loadState === "ready" && days.length > 0 && step === "details" && selected && (
          <div>
            {/* chosen slot + change */}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3">
              <div className="text-left">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary/80">
                  {t("contact.book.chosenLabel")}
                </p>
                <p className="mt-0.5 font-body text-[14px] font-medium text-foreground">
                  {fmtDayLong(new Date(selected))} · {fmtTime(selected)}
                </p>
              </div>
              <button
                type="button"
                onClick={backToPick}
                className="inline-flex shrink-0 items-center gap-1 font-body text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                {t("contact.book.changeTime")}
              </button>
            </div>

            <form onSubmit={onSubmit} noValidate className="mt-4 space-y-4 text-left">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="book-name" className={labelClass}>
                    {t("contact.nameLabel")}
                  </label>
                  <Input
                    id="book-name"
                    name="name"
                    placeholder={t("contact.namePlaceholder")}
                    required
                    minLength={NAME_MIN}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "book-name-error" : undefined}
                    onChange={() => clearError("name")}
                    className={cn(fieldClass, errors.name && errorRing)}
                  />
                  {errors.name && (
                    <p id="book-name-error" role="alert" className={errorTextClass}>
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="book-email" className={labelClass}>
                    {t("contact.emailLabel")}
                  </label>
                  <Input
                    id="book-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    placeholder={t("contact.emailPlaceholder")}
                    required
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "book-email-error" : undefined}
                    onChange={() => clearError("email")}
                    className={cn(fieldClass, errors.email && errorRing)}
                  />
                  {errors.email && (
                    <p id="book-email-error" role="alert" className={errorTextClass}>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="book-message" className={labelClass}>
                  {t("contact.messageLabel")}{" "}
                  <span className="font-normal text-muted-foreground/70">
                    {t("contact.messageOptional")}
                  </span>
                </label>
                <textarea
                  id="book-message"
                  name="message"
                  rows={3}
                  placeholder={t("contact.messagePlaceholder")}
                  className={textareaClass}
                />
              </div>

              {/* Honeypot — hidden from users, catches naive bots. */}
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
                <label htmlFor="book-company">Company</label>
                <input id="book-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {bookState === "error" && (
                <p role="alert" className="text-center font-body text-sm text-destructive">
                  {t("contact.book.failed")}
                </p>
              )}

              <m.button
                type="submit"
                disabled={bookState === "booking"}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 font-body text-[14px] font-medium text-primary-foreground shadow-[0_14px_36px_-18px_hsl(var(--primary)/0.7)] disabled:opacity-70"
                whileHover={reduced || bookState === "booking" ? undefined : { scale: 1.01, filter: "brightness(1.06)" }}
                whileTap={reduced || bookState === "booking" ? undefined : { scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                {bookState === "booking" ? t("contact.book.booking") : t("contact.book.confirm")}
              </m.button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCall;
