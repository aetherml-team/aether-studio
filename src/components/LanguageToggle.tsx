import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="flex h-10 items-center rounded-lg border border-border/80 bg-background/40 p-0.5 backdrop-blur-sm opacity-0"
        aria-hidden
      />
    );
  }

  const isEs = i18n.language.startsWith("es");

  return (
    <div
      className="flex h-10 items-center rounded-lg border border-border/80 bg-background/40 p-0.5 backdrop-blur-sm"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => i18n.changeLanguage("en")}
        className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] font-medium tracking-wide transition-all duration-200 ${
          !isEs
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={!isEs}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => i18n.changeLanguage("es")}
        className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] font-medium tracking-wide transition-all duration-200 ${
          isEs
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={isEs}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  );
}
