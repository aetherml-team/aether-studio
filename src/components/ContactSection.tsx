import { useState, FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Zap, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EASE, viewport } from "@/lib/motion";
import { track } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";
type FieldName = "name" | "email" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

/** Serverless endpoint that forwards the lead to Resend (see api/lead.ts). */
const LEAD_ENDPOINT = "/api/lead";
const CONTACT_EMAIL = "help@aetherml.com";
/** Pragmatic email check — one @, a dot in the domain, no spaces. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 2;
const MESSAGE_MIN = 10;

const ASSURANCE_ICONS = [ShieldCheck, Zap, Users];

const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  const steps = t("contact.steps", { returnObjects: true }) as string[];
  const assurances = t("contact.assurances", { returnObjects: true }) as string[];

  function validate(values: { name: string; email: string; message: string }): FieldErrors {
    const next: FieldErrors = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();

    if (!name) next.name = t("contact.validation.nameRequired");
    else if (name.length < NAME_MIN) next.name = t("contact.validation.nameShort");

    if (!email) next.email = t("contact.validation.emailRequired");
    else if (!EMAIL_RE.test(email)) next.email = t("contact.validation.emailInvalid");

    if (!message) next.message = t("contact.validation.messageRequired");
    else if (message.length < MESSAGE_MIN) next.message = t("contact.validation.messageShort");

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
      const firstInvalid = (["name", "email", "message"] as const).find((k) => fieldErrors[k]);
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
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, ease: EASE }}
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
                <motion.li
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
                </motion.li>
              ))}
            </ol>
          </div>

          {/* assurances */}
          <div className="mt-8 flex flex-col gap-3">
            {assurances.map((a, i) => {
              const Icon = ASSURANCE_ICONS[i] ?? ShieldCheck;
              return (
                <div key={i} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-primary/80" strokeWidth={1.6} aria-hidden />
                  <span className="font-body text-[13.5px] text-muted-foreground">{a}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* right — form */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="glow-border rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm md:p-8"
        >
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
                {t("contact.messageLabel")}
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                minLength={MESSAGE_MIN}
                rows={5}
                placeholder={t("contact.messagePlaceholder")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                onChange={() => clearError("message")}
                className={`${textareaClass} ${errors.message ? errorRing : ""}`}
              />
              {errors.message && (
                <p id="contact-message-error" role="alert" className={errorTextClass}>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Honeypot — hidden from users, catches naive bots. */}
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {status === "sent" ? (
              <motion.p
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-2 text-center font-body text-sm text-success"
                role="status"
              >
                {t("contact.success")}
              </motion.p>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                {status === "error" && (
                  <p className="text-center font-body text-sm text-destructive" role="alert">
                    {t("contact.error")}
                  </p>
                )}
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 font-body text-[14px] font-medium text-primary-foreground shadow-[0_14px_36px_-18px_hsl(var(--primary)/0.7)] disabled:opacity-70"
                  whileHover={reduced ? undefined : { scale: 1.01, filter: "brightness(1.06)" }}
                  whileTap={reduced ? undefined : { scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  {status === "sending" ? t("contact.sending") : t("contact.submit")}
                </motion.button>
                <div className="flex items-center justify-between">
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
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
