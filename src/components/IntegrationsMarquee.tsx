import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";

const TOOLS = [
  "Stripe", "Mercado Pago", "Google Workspace", "QuickBooks", "Slack",
  "HubSpot", "Notion", "Airtable", "Calendly", "Shopify",
  "Salesforce", "Xero", "Zapier", "Make", "Twilio", "n8n",
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
        <h2 id="integrations-heading" className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {t("integrations.headline")}
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
              className="select-none whitespace-nowrap rounded-lg border border-border/60 bg-background/40 px-5 py-2.5 font-body text-[13px] font-medium text-foreground/60"
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
