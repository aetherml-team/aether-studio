import { m } from "framer-motion";
import { EASE, viewport } from "@/lib/motion";

type SectionCTAProps = {
  label: string;
  href?: string;
  align?: "center" | "start";
  variant?: "primary" | "outline";
  className?: string;
};

export function SectionCTA({
  label,
  href = "#contact",
  align = "start",
  variant = "primary",
  className = "",
}: SectionCTAProps) {
  const alignClass = align === "center" ? "flex justify-center" : "flex justify-start";

  const styleClass =
    variant === "outline"
      ? "press btn-ghost inline-flex h-[50px] items-center rounded-md px-7 font-body text-[14.5px] font-medium text-foreground"
      : "press btn-peri inline-flex h-[50px] items-center rounded-md px-7 font-body text-[14.5px] font-medium text-primary-foreground";

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.45, ease: EASE }}
      className={`mt-12 md:mt-14 ${alignClass} ${className}`}
    >
      <a href={href} className={styleClass}>
        {label}
      </a>
    </m.div>
  );
}
