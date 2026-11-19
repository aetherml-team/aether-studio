import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const KEY = "aether-cookie-notice";

function seen(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

const CookieNotice = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(() => !seen());

  if (!open) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* private mode: the notice shows again next visit */
    }
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label={t("cookieNotice.text")}
      className="fixed inset-x-4 bottom-4 z-[60] flex items-center gap-3 rounded-xl border border-border/80 bg-background/95 px-4 py-3 font-body text-[13px] text-muted-foreground shadow-lg backdrop-blur-sm md:inset-x-auto md:left-4 md:max-w-sm"
    >
      <p className="flex-1">
        {t("cookieNotice.text")}{" "}
        <Link to="/privacy" className="text-foreground underline underline-offset-2">
          {t("cookieNotice.link")}
        </Link>
      </p>
      <button
        type="button"
        onClick={close}
        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground"
      >
        {t("cookieNotice.ok")}
      </button>
    </div>
  );
};

export default CookieNotice;
