import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { whatsappEnabled, whatsappUrl } from "@/lib/contact";
import { HERO_SHOT } from "@/content/offer";

/* Shared pieces for the hero variants. Composition is what differs between
   them; the copy, the actions and the material are the same everywhere. */

export function Actions({ className = "" }: { className?: string }) {
  const { t, i18n } = useTranslation();
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a
        href="#contact-form"
        className="press btn-peri inline-flex h-[50px] items-center rounded-md px-7 font-body text-[14.5px] font-medium text-primary-foreground"
      >
        {t("common.cta")}
      </a>

      {whatsappEnabled && (
        <a
          href={whatsappUrl(t("whatsapp.prefill"))}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("WhatsApp Click", { location: "hero", language: i18n.language })}
          className="press btn-ghost inline-flex h-[50px] items-center gap-2 rounded-md px-6 font-body text-[14.5px] font-medium text-foreground"
        >
          <MessageCircle className="h-[17px] w-[17px]" strokeWidth={1.75} aria-hidden />
          {t("whatsapp.cta")}
        </a>
      )}
    </div>
  );
}

/** A real Nexus screen. Private customer data is blurred in the source asset. */
export function AppScreen({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const { t } = useTranslation();
  return (
    <div className={`overflow-hidden rounded-lg ${className}`} style={style}>
      <img
        src={HERO_SHOT}
        alt={t("hero.screenshotAlt")}
        loading="eager"
        className="block w-full"
        width={1512}
        height={787}
      />
    </div>
  );
}

export function Headline({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <h1 className={`font-heading tracking-[-0.035em] text-foreground ${className}`}>
      <span className="block font-normal text-foreground">{t("hero.headline")}</span>
      <span className="block font-semibold">{t("hero.headlineEmphasis")}</span>
    </h1>
  );
}
