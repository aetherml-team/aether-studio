import { motion } from "framer-motion";
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
  align = "center",
  variant = "primary",
  className = "",
}: SectionCTAProps) {
  const alignClass = align === "center" ? "flex justify-center" : "flex justify-start";

  const styleClass =
    variant === "outline"
      ? "inline-flex h-12 items-center rounded-lg border border-primary/40 px-7 font-body text-[14px] font-medium text-primary hover:bg-primary/10"
      : "inline-flex h-12 items-center rounded-lg bg-primary px-7 font-body text-[14px] font-medium text-primary-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.55, ease: EASE }}
      className={`mt-12 md:mt-14 ${alignClass} ${className}`}
    >
      <motion.a
        href={href}
        className={styleClass}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {label}
      </motion.a>
    </motion.div>
  );
}
