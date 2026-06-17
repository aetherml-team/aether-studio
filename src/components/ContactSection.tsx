import { useState, FormEvent, lazy, Suspense } from "react";
import { m, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Zap, Users, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EASE, viewport } from "@/lib/motion";
import { track } from "@/lib/analytics";
import { schedulingEnabled } from "@/lib/scheduling";
import { whatsappEnabled, whatsappUrl } from "@/lib/contact";

// Native booking panel — lazy-loaded only when a visitor opens the "Book a call" tab.
const BookCall = lazy(() => import("@/components/BookCall"));

type Status = "idle" | "sending" | "sent" | "error";
type FieldName = "name" | "email";
type FieldErrors = Partial<Record<FieldName, string>>;
type Tab = "book" | "message";

/** Serverless endpoint that forwards the lead to Resend (see api/lead.ts). */
const LEAD_ENDPOINT = "/api/lead";
const CONTACT_EMAIL = "help@aetherml.com";
/** Pragmatic email check — one @, a dot in the domain, no spaces. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 2;

const ASSURANCE_ICONS = [ShieldCheck, Zap, Users];

const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  // Book a call is the primary path when scheduling is configured; the message
  // form is the low-pressure fallback for leads not ready to commit to a slot.
  const [tab, setTab] = useState<Tab>(schedulingEnabled ? "book" : "message");

  const steps = t("contact.steps", { returnObjects: true }) as string[];
  const assurances = t("contact.assurances", { returnObjects: true }) as string[];

  function validate(values: { name: string; email: string }): FieldErrors {
    const next: FieldErrors = {};
    const name = values.name.trim();
    const email = values.email.trim();

    if (!name) next.name = t("contact.validation.nameRequired");
    else if (name.length < NAME_MIN) next.name = t("contact.validation.nameShort");

    if (!email) next.email = t("contact.validation.emailRequired");
    else if (!EMAIL_RE.test(email)) next.email = t("contact.validation.emailInvalid");

    // Message is intentionally optional — leaving it blank is fine.
    return next;
  }

  // Clear a field's error as soon as the user starts correcting it.
  const clearError = (field: FieldName) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      // Honeypot: real users never fill this hidden field.
      company: String(data.get("company") ?? ""),
      language: i18n.language,
    };

    const fieldErrors = validate(payload);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const firstInvalid = (["name", "email"] as const).find((k) => fieldErrors[k]);
      if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    setErrors({});

    setStatus("sending");
    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Lead endpoint responded ${res.status}`);
      setStatus("sent");
      track("Lead Submitted", { language: i18n.language });
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const fieldClass =
    "h-12 rounded-xl border-border bg-background/60 font-body transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground/60";
  const textareaClass =
    "min-h-[140px] w-full resize-y rounded-xl border border-border bg-background/60 px-4 py-3 font-body text-sm text-foreground transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60";
  const labelClass = "mb-1.5 block font-body text-[13px] font-medium text-foreground-dim";
  // Applied on top of the base field classes when a field is invalid.
  const errorRing = "border-destructive/70 focus-visible:ring-destructive/30 focus:ring-destructive/30";
  const errorTextClass = "mt-1.5 font-body text-[12.5px] text-destructive";

  return (
    <section id="contact" className="seam-top relative overflow-hidden px-6 py-12 md:px-10 md:py-16">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, hsl(var(--primary) / 0.07), transparent 65%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16">
        {/* left — value & credibility */}
        <m.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
          className="min-w-0"
        >
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary/80">
            {t("hero.availability")}
          </p>

          <h2 className="font-heading text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("contact.headline")}
          </h2>
          <p className="mt-5 max-w-md font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("contact.description")}
          </p>

          {/* what happens next */}
          <div className="mt-10">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground-dim">
              {t("contact.nextLabel")}
            </p>
            <ol className="space-y-0">
              {steps.map((step, i) => (
                <m.li
                  key={i}
                  initial={reduced ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
                  className="flex items-start gap-4 border-t border-border/70 py-4"
                >
                  <span className="mt-0.5 font-mono text-sm font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-[15px] leading-relaxed text-foreground/85">{step}</span>
                </m.li>
              ))}
            </ol>
          </div>

          {/* assurances — single wrapping row */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            {assurances.map((a, i) => {
              const Icon = ASSURANCE_ICONS[i] ?? ShieldCheck;
              return (
                <div key={i} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-primary/80" strokeWidth={1.6} aria-hidden />
                  <span className="font-body text-[13px] text-muted-foreground">{a}</span>
                </div>
              );
            })}
          </div>
        </m.div>

        {/* right — form */}
        <m.div
          id="contact-form"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="glow-border min-w-0 scroll-mt-24 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm md:p-8"
        >
          {schedulingEnabled && (
            <div
              role="tablist"
              aria-label={t("contact.tabAria")}
              className="relative mb-6 grid grid-cols-2 gap-1 rounded-xl border border-border bg-background/50 p-1"
            >
              {/* Active-tab pill — a single CSS-transform element. Was a framer
                  `layoutId` shared-layout animation; moved to CSS so the app
                  needs only the lighter `domAnimation` LazyMotion feature set. */}
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc((100%-0.75rem)/2)] rounded-lg bg-primary shadow-[0_10px_28px_-16px_hsl(var(--primary)/0.8)] transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: tab === "message" ? "translateX(calc(100% + 0.25rem))" : "translateX(0)" }}
              />
              {(["book", "message"] as const).map((key) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(key)}
                    className={`relative h-10 rounded-lg font-body text-[13.5px] font-medium transition-colors ${
                      active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="relative z-10">
                      {t(key === "book" ? "contact.tabBook" : "contact.tabMessage")}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {tab === "book" && schedulingEnabled ? (
            <div>
              <Suspense fallback={<div className="min-h-[280px]" aria-hidden />}>
                <BookCall />
              </Suspense>
              <button
                type="button"
                onClick={() => setTab("message")}
                className="mt-5 block w-full text-center font-body text-[13px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {t("contact.preferWrite")}
              </button>
            </div>
          ) : (
          <>
          {whatsappEnabled && (
            <div className="mb-5">
              <a
                href={whatsappUrl(t("whatsapp.prefill"))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("WhatsApp Click", { location: "contact", language: i18n.language })}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-6 font-body text-[14px] font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10"
              >
                <MessageCircle className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden />
                {t("whatsapp.cta")}
              </a>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" aria-hidden />
                <span className="font-body text-[11.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {t("whatsapp.or")}
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden />
              </div>
            </div>
          )}
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={labelClass}>
                  {t("contact.nameLabel")}
                </label>
                <Input
                  id="contact-name"
                  name="name"
                  placeholder={t("contact.namePlaceholder")}
                  required
                  minLength={NAME_MIN}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  onChange={() => clearError("name")}
                  className={`${fieldClass} ${errors.name ? errorRing : ""}`}
                />
                {errors.name && (
                  <p id="contact-name-error" role="alert" className={errorTextClass}>
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-email" className={labelClass}>
                  {t("contact.emailLabel")}
                </label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  placeholder={t("contact.emailPlaceholder")}
                  required
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  onChange={() => clearError("email")}
                  className={`${fieldClass} ${errors.email ? errorRing : ""}`}
                />
                {errors.email && (
                  <p id="contact-email-error" role="alert" className={errorTextClass}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className={labelClass}>
                {t("contact.messageLabel")}{" "}
                <span className="font-normal text-muted-foreground/70">{t("contact.messageOptional")}</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder={t("contact.messagePlaceholder")}
                className={textareaClass}
              />
            </div>

            {/* Honeypot — hidden from users, catches naive bots. */}
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {status === "sent" ? (
              <m.p
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-2 text-center font-body text-sm text-success"
                role="status"
              >
                {t("contact.success")}
              </m.p>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                {status === "error" && (
                  <p className="text-center font-body text-sm text-destructive" role="alert">
                    {t("contact.error")}
                  </p>
                )}
                <m.button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 font-body text-[14px] font-medium text-primary-foreground shadow-[0_14px_36px_-18px_hsl(var(--primary)/0.7)] disabled:opacity-70"
                  whileHover={reduced ? undefined : { scale: 1.01, filter: "brightness(1.06)" }}
                  whileTap={reduced ? undefined : { scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  {status === "sending" ? t("contact.sending") : t("contact.submit")}
                </m.button>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-body text-[13px] text-muted-foreground">{t("contact.responseNote")}</span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-body text-[13px] font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {t("contact.emailLink")}
                  </a>
                </div>
              </div>
            )}
          </form>
          </>
          )}
        </m.div>
      </div>
    </section>
  );
};

export default ContactSection;
