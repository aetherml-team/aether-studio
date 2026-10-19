import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { whatsappEnabled, whatsappUrl } from "@/lib/contact";
import { HERO_SCENE, HERO_SHOT } from "@/content/offer";

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

/** Real screens set into a generated device scene: Nexus on the laptop, Pip on the
    phone. The scene's screens are blank; the boxes below are measured on its 1536x1024
    pixels, so a new scene needs new numbers. Private customer data is blurred in
    HERO_SHOT; the Pip screen runs on test data. Both screens stay dark in either
    page theme so they read as one product. */
export function AppScreen({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "es";
  const pip = (shot: string) => `/work/pip/${shot}-dark-${lang}.jpg`;
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={style}>
      <img src={HERO_SCENE} alt="" loading="eager" className="block w-full" width={1536} height={1024} />
      <img
        src={HERO_SHOT}
        alt={t("hero.screenshotAlt")}
        loading="eager"
        className="absolute object-cover object-left-top"
        style={{ left: "19.86%", top: "21%", width: "56.12%", height: "46%" }}
      />
      <div
        className="absolute overflow-hidden bg-[#0b0a10]"
        style={{ left: "78.52%", top: "36.43%", width: "12.11%", height: "41.41%", borderRadius: "11.8% / 5.2%" }}
      >
        {["money", "pay"].map((shot) => (
          <img key={shot} src={pip(shot)} alt="" className="block w-full" />
        ))}
      </div>
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
