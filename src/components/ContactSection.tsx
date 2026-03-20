import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EASE, viewport } from "@/lib/motion";

const ContactSection = () => {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

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
            Get your free automation audit
          </h2>
          <p className="mx-auto mt-5 max-w-md font-body text-[15px] font-light leading-relaxed text-muted-foreground">
            Tell us about your operations and we&apos;ll show you exactly where automation can save you time and money.
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ delay: 0.18, duration: 0.45, ease: EASE }}
          >
            <Textarea
              name="message"
              placeholder="Tell us about your current workflows..."
              required
              rows={4}
              className="resize-none rounded-xl border-border bg-card font-body transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-primary/30 placeholder:text-muted-foreground/50"
            />
          </motion.div>
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
                Get Your Free Audit
              </motion.button>
              <span className="font-mono text-[11px] text-muted-foreground">
                Response within 24 hours
              </span>
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default ContactSection;
