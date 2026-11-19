import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { NEEDS } from "@/lib/needs";
import "@/locales/funnel";

/**
 * The two optional answers both forms ask: a phone (WhatsApp) and what the visitor wants solved.
 * Uncontrolled: the forms read `phone` and `need` from their FormData.
 */
export function LeadExtras({
  idPrefix,
  labelClass,
  fieldClass,
}: {
  idPrefix: string;
  labelClass: string;
  fieldClass: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <label htmlFor={`${idPrefix}-phone`} className={labelClass}>
          {t("funnel.phoneLabel")}{" "}
          <span className="font-normal text-muted-foreground/70">{t("contact.messageOptional")}</span>
        </label>
        <Input
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t("funnel.phonePlaceholder")}
          className={fieldClass}
        />
      </div>
      <fieldset>
        <legend className={labelClass}>{t("funnel.needLabel")}</legend>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((need) => (
            <label
              key={need}
              className="cursor-pointer rounded-full border border-border px-3 py-1.5 font-body text-sm text-foreground/80 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background"
            >
              <input type="radio" name="need" value={need} className="sr-only" />
              {t(`funnel.needs.${need}`)}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
