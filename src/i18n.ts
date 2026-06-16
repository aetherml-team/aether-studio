import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import es from "./locales/es.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    // Silence i18next's "powered by Locize" console.info banner in prod.
    showSupportNotice: false,
    // Normalize regional codes so a browser set to e.g. "es-MX" or "es-419"
    // resolves cleanly to "es" everywhere — rendering, <html lang>, the language
    // sent to /api/lead, and analytics — instead of leaking the raw region code.
    load: "languageOnly",
    detection: {
      // localStorage first so a visitor's explicit toggle wins over their
      // browser default; navigator is the auto-detect for first-time visitors.
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Keep <html lang> in sync so search engines and screen readers
// see the language actually rendered.
function syncDocumentLang(lng: string) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
}

syncDocumentLang(i18n.resolvedLanguage ?? i18n.language);
i18n.on("languageChanged", syncDocumentLang);

export default i18n;
