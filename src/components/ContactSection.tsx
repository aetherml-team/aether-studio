import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EASE, viewport } from "@/lib/motion";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

/** Stable, locale-independent values submitted to the backend */
const COMPANY_SIZE_VALUES = ["solo", "2-10", "11-50", "50plus"] as const;
const BOTTLENECK_VALUES = [
  "manual-data-entry",
  "payment-reconciliation",
  "disconnected-tools",
  "scheduling",
  "other",
] as const;

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const CONTACT_EMAIL = "hello@aether.studio";

const ContactSection = () => {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState<Status>("idle");

  const companySizes = t("contact.companySizes", { returnObjects: true }) as string[];
  const bottlenecks = t("contact.bottlenecks", { returnObjects: true }) as string[];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company_size: String(data.get("company_size") ?? ""),
      bottleneck: String(data.get("bottleneck") ?? ""),
      language: i18n.language,
    };

    if (!CONTACT_ENDPOINT) {
      // No backend configured: open a prefilled email instead of faking success.
      const subject = encodeURIComponent("Free automation audit request");
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\nCompany size: ${payload.company_size}\nBiggest bottleneck: ${payload.bottleneck}\nLanguage: ${payload.language}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Contact endpoint responded ${res.status}`);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const fieldClass =
    "h-12 rounded-xl border-border bg-card font-body transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground/60";
  const selectClass =
    "h-12 w-full rounded-xl border border-border bg-card px-4 pr-10 font-body text-sm text-foreground transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none";
  const labelClass = "mb-1.5 block font-body text-[13px] font-medium text-foreground-dim";

  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 py-20 md:px-10 md:py-32"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 1 }}
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, hsl(var(--primary) / 0.06), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.68, ease: EASE }}
        >
          <h2 className="font-heading text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("contact.headline")}
          </h2>
          <p className="mx-auto mt-5 max-w-md font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            {t("contact.description")}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          onSubmit={onSubmit}
          className="mt-10 space-y-4 text-left"
        >
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
                autoComplete="name"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>
                {t("contact.emailLabel")}
              </label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder={t("contact.emailPlaceholder")}
                required
                autoComplete="email"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-company-size" className={labelClass}>
                {t("contact.companySizeLabel")}
              </label>
              <div className="relative">
                <select
                  id="contact-company-size"
                  name="company_size"
                  required
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="" disabled>
                    {t("contact.selectPlaceholder")}
                  </option>
                  {companySizes.map((label, i) => (
                    <option key={COMPANY_SIZE_VALUES[i]} value={COMPANY_SIZE_VALUES[i]}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-bottleneck" className={labelClass}>
                {t("contact.bottleneckLabel")}
              </label>
              <div className="relative">
                <select
                  id="contact-bottleneck"
                  name="bottleneck"
                  required
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="" disabled>
                    {t("contact.selectPlaceholder")}
                  </option>
                  {bottlenecks.map((label, i) => (
                    <option key={BOTTLENECK_VALUES[i]} value={BOTTLENECK_VALUES[i]}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>
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
            <div className="flex flex-col items-center gap-3 pt-2">
              {status === "error" && (
                <p className="text-center font-body text-sm text-destructive" role="alert">
                  {t("contact.error")}
                </p>
              )}
              {status === "mailto" && (
                <p className="text-center font-body text-sm text-muted-foreground" role="status">
                  {t("contact.mailtoNote")}
                </p>
              )}
              <motion.button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 font-body text-[14px] font-medium text-primary-foreground disabled:opacity-70 sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                {status === "sending" ? t("contact.sending") : t("contact.submit")}
              </motion.button>
              <p className="font-body text-[13px] text-muted-foreground">
                {t("contact.responseNote")}
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-body text-[13px] font-medium text-primary underline-offset-4 hover:underline"
              >
                {t("contact.emailLink")}
              </a>
            </div>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
