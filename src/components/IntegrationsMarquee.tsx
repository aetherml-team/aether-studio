import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";

const TOOLS = [
  "Stripe", "HubSpot", "Notion", "Slack", "Airtable", "Google Workspace",
  "QuickBooks", "Zapier", "Make", "Twilio", "Calendly", "Shopify",
  "Salesforce", "Xero", "Mercado Pago", "Clerk", "Supabase", "n8n",
];

const IntegrationsMarquee = () => {
  const { t } = useTranslation();
  const row = [...TOOLS, ...TOOLS];

  return (
    <section
      aria-labelledby="integrations-heading"
      className="relative overflow-hidden border-y border-border/50 bg-card/30 py-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative mx-auto mb-6 max-w-3xl px-6 text-center"
      >
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t("integrations.label")}
        </p>
        <h2 id="integrations-heading" className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {t("integrations.headline")}{" "}
          <span className="text-gradient">{t("integrations.headlineGradient")}</span>
        </h2>
      </motion.div>

      <div
        className="group relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="select-none whitespace-nowrap rounded-lg border border-border/60 bg-background/40 px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-foreground/55 backdrop-blur-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsMarquee;
