import type { ReactNode } from "react";
import { m } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";

type Props = {
  id: string;
  /** Standfirst, in the margin beside the lead. Never above the heading. */
  note?: string;
  title: string;
  lead?: string;
  /** Recessed ground, so consecutive sections read as separate spreads. */
  deep?: boolean;
  /** Section owns its own full-width layout; skip the shell. */
  bare?: boolean;
  children: ReactNode;
};

export function Section({ id, note, title, lead, deep, bare, children }: Props) {
  return (
    <section
      id={id}
      className={`relative py-20 md:py-24 lg:py-28 ${deep ? "section-wash" : ""}`}
    >
      <div className="shell">
        <m.header
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.45, ease: EASE }}
          className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-12"
        >
          <div className="lg:col-span-8">
            <h2 className="display-2 max-w-[18ch] font-heading font-semibold text-foreground">{title}</h2>
          </div>

          {(lead || note) && (
            <div className="self-end lg:col-span-4 lg:col-start-9">
              {lead && <p className="lead max-w-[46ch] font-body text-foreground/65">{lead}</p>}
              {note && (
                <p className="mt-5 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-foreground-dim">
                  {note}
                </p>
              )}
            </div>
          )}
        </m.header>

        <div className="mt-8 h-px w-full bg-border md:mt-10" aria-hidden />
      </div>

      {bare ? children : <div className="shell mt-10 md:mt-12">{children}</div>}
    </section>
  );
}
