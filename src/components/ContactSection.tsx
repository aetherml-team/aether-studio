import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { EASE, viewport } from "@/lib/motion";

const companySizes = ["Just me", "2–10", "11–50", "50+"] as const;

const bottlenecks = [
  "Manual data entry",
  "Payment reconciliation",
  "Disconnected tools",
  "Scheduling chaos",
  "Other",
] as const;

const ContactSection = () => {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  const selectClass =
    "h-12 w-full rounded-xl border border-border bg-card px-4 font-body text-sm text-foreground transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none";

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
            "radial-gradient(ellipse 80% 60% at 50% 100%, hsl(240 30% 73% / 0.06), transparent 70%)",
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
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Let&apos;s talk
          </p>
          <h2 className="font-heading text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Still doing this{" "}
            <span className="text-gradient">manually?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            Tell us what&apos;s eating your time and we&apos;ll show you exactly
            where automation saves you hours and money.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.55,
            delay: 0.1,
            ease: EASE,
          }}
          onSubmit={onSubmit}
          className="mt-10 space-y-4 text-left"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ delay: 0.05, duration: 0.45, ease: EASE }}
            >
              <Input
                name="name"
                placeholder="Name"
                required
                autoComplete="name"
                className="h-12 rounded-xl border-border bg-card font-body transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground/50"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ delay: 0.12, duration: 0.45, ease: EASE }}
            >
              <Input
                name="email"
                type="email"
                placeholder="Email"
                required
                autoComplete="email"
                className="h-12 rounded-xl border-border bg-card font-body transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground/50"
              />
            </motion.div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ delay: 0.16, duration: 0.45, ease: EASE }}
            >
              <select name="company_size" required defaultValue="" className={selectClass}>
                <option value="" disabled>
                  Company size
                </option>
                {companySizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ delay: 0.2, duration: 0.45, ease: EASE }}
            >
              <select name="bottleneck" required defaultValue="" className={selectClass}>
                <option value="" disabled>
                  Biggest bottleneck
                </option>
                {bottlenecks.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {sent ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-2 text-center font-body text-sm text-success"
              role="status"
            >
              Thanks — we&apos;ll be in touch within 24 hours.
            </motion.p>
          ) : (
            <motion.div
              className="flex flex-col items-center gap-3 pt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewport}
              transition={{ delay: 0.22, duration: 0.4 }}
            >
              <motion.button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-8 font-body text-[14px] font-medium text-primary-foreground sm:w-auto"
                whileHover={{ scale: 1.02, boxShadow: "0 0 28px hsl(240 30% 73% / 0.35)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                Send it. We reply in 24 hours.
              </motion.button>
              <a
                href="mailto:hello@aether.studio"
                className="font-body text-[13px] font-medium text-primary underline-offset-4 hover:underline"
              >
                Or email hello@aether.studio
              </a>
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
