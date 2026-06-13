import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";

/* Breadth, not a logo-soup repeat of the hero graph. The point of this
   strip is "100+ — if it has an API, we automate it", so the copy leads
   and the names are evidence of range. */
const TOOLS = [
  "Stripe", "Mercado Pago", "QuickBooks", "Xero", "Slack", "HubSpot", "Notion", "Airtable",
  "Google Workspace", "Calendly", "Shopify", "Salesforce", "Twilio", "Zapier", "Make", "n8n",
];

function Chip({ name }: { name: string }) {
  return (
    <span className="whitespace-nowrap rounded-lg border border-border/60 bg-background/40 px-4 py-2 font-body text-[13px] text-foreground/55 transition-colors duration-300 hover:border-primary/40 hover:text-foreground/80">
      {name}
    </span>
  );
}

function Track({ items, more, reverse = false }: { items: string[]; more: string; reverse?: boolean }) {
  const row = [...items, more, ...items, more];
  return (
    <div
      className={`flex w-max gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center`}
    >
      {row.map((name, i) =>
        name === more ? (
          <span
            key={`${name}-${i}`}
            className="whitespace-nowrap rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-[12px] font-medium text-primary"
          >
            {more}
          </span>
        ) : (
          <Chip key={`${name}-${i}`} name={name} />
        )
      )}
    </div>
  );
}

const IntegrationsMarquee = () => {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="integrations-heading"
      className="seam-top relative overflow-hidden bg-background-deep/40 py-16 md:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative mx-auto mb-10 max-w-2xl px-6 text-center"
      >
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">
          {t("integrations.kicker")}
        </p>
        <h2
          id="integrations-heading"
          className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
        >
          {t("integrations.headline")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-[14.5px] font-light leading-relaxed text-muted-foreground">
          {t("integrations.subcopy")}
        </p>
      </motion.div>

      <div
        className="group relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <Track items={TOOLS} more={t("integrations.more")} />
      </div>
    </section>
  );
};

export default IntegrationsMarquee;
