import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUp, Check, CornerDownRight } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";
import { Section } from "@/components/Sheet";

/* Pip, the assistant inside the app: it answers from the business's own
   records and prepares changes that wait on an approval card. The chat is a
   drawing of the real screen, on test data, labelled as such. Labels match
   the app's own ("Registrar pago en efectivo", "Necesita tu aprobación"). */

const OWES = [
  ["Mariana Torres", "$2,850"],
  ["Tomás Ibarra", "$1,450"],
  ["Paola Méndez", "$980"],
] as const;

const step = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: 0.4, delay: 0.15 + i * 0.35, ease: EASE },
});

const PipSection = () => {
  const { t } = useTranslation();
  const ask = t("pip.ask", { returnObjects: true }) as string[];
  const act = t("pip.do", { returnObjects: true }) as string[];
  const c = (k: string) => t(`pip.chat.${k}`);
  const label = "font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-dim";

  return (
    <Section id="pip" note={t("pip.note")} title={t("pip.headline")} lead={t("pip.description")}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="grid content-start gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {[
            [t("pip.askLabel"), ask],
            [t("pip.doLabel"), act],
          ].map(([heading, lines], g) => (
            <div key={heading as string}>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">{heading as string}</p>
              <ul className="mt-4 border-t border-border">
                {(lines as string[]).map((line) => (
                  <li key={line} className="flex items-start gap-3 border-b border-border py-3.5">
                    {g === 0 ? (
                      <span className="mt-[3px] font-mono text-[13px] leading-none text-primary" aria-hidden>?</span>
                    ) : (
                      <CornerDownRight className="mt-[3px] h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                    )}
                    <span className="font-heading text-[17px] font-medium leading-[1.3] tracking-[-0.015em] text-foreground">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <figure className="min-w-0 lg:col-span-7">
          <div
            className="dark glow-border overflow-hidden rounded-xl border border-border bg-card text-foreground"
            role="img"
            aria-label={`${c("q1")} ${c("a1")} ${c("q2")} ${c("title")}. ${c("demo")}.`}
          >
            <div className="flex items-center gap-2.5 border-b border-border px-5 py-3.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 font-heading text-[13px] font-semibold text-primary">P</span>
              <span className="font-heading text-[15px] font-semibold">Pip</span>
            </div>

            <div aria-hidden className="flex flex-col gap-4 px-4 py-6 sm:px-6">
              <m.p {...step(0)} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 font-body text-[15px] text-primary-foreground">
                {c("q1")}
              </m.p>

              <m.div {...step(1)} className="max-w-[92%] rounded-2xl rounded-bl-sm border border-border bg-background/60 px-4 py-3.5">
                <p className="font-body text-[15px]">{c("a1")}</p>
                <ul className="mt-3 divide-y divide-border">
                  {OWES.map(([name, amount]) => (
                    <li key={name} className="flex items-baseline justify-between gap-6 py-2 font-body text-[14.5px]">
                      <span className="text-foreground/85">{name}</span>
                      <span className="tabular-nums text-foreground">{amount}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 flex items-center gap-2 font-mono text-[10.5px] tracking-[0.04em] text-foreground-dim">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {c("source")}
                </p>
              </m.div>

              <m.p {...step(2)} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 font-body text-[15px] text-primary-foreground">
                {c("q2")}
              </m.p>

              <m.div {...step(3)} className="max-w-[92%] rounded-xl border border-primary/50 bg-card-raised p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-heading text-[16px] font-semibold">{c("title")}</p>
                  <span className="rounded-full bg-warning/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-warning">
                    {c("needed")}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    [c("customer"), "Tomás Ibarra"],
                    [c("amount"), "$1,450.00"],
                    [c("method"), c("cash")],
                    [c("balance"), "$0.00"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className={label}>{k}</dt>
                      <dd className="mt-1 font-body text-[15px] tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 font-body text-[13.5px] text-foreground-dim">{c("note")}</p>
                <div className="mt-4 flex gap-2.5">
                  <span className="btn-peri inline-flex h-9 items-center gap-1.5 rounded-md px-4 font-body text-[14px] font-medium text-primary-foreground">
                    <Check className="h-4 w-4" strokeWidth={2} />
                    {c("approve")}
                  </span>
                  <span className="btn-ghost inline-flex h-9 items-center rounded-md px-4 font-body text-[14px] font-medium">{c("reject")}</span>
                </div>
              </m.div>
            </div>

            <div aria-hidden className="flex items-center justify-between gap-3 border-t border-border px-5 py-3.5">
              <span className="font-body text-[14.5px] text-foreground-dim">{c("placeholder")}</span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                <ArrowUp className="h-4 w-4" strokeWidth={2} />
              </span>
            </div>
          </div>
          <figcaption className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-foreground-dim">{c("demo")}</figcaption>
        </figure>
      </div>
    </Section>
  );
};

export default PipSection;
