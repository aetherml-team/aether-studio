import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { EASE } from "@/lib/motion";

const Navbar = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");
  const { scrollY } = useScroll();

  // Nav leads with what Æther does (the capabilities), then proof, process,
  // fit, and the questions people ask before booking.
  const links = [
    { href: "#services", label: t("navbar.services") },
    { href: "#clients", label: t("navbar.results") },
    { href: "#process", label: t("navbar.howWeWork") },
    { href: "#check-fit", label: t("navbar.theFit") },
    { href: "#faq", label: t("navbar.faq") },
  ];

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  // Scroll-spy — highlight the link for whichever section sits across the
  // viewport's midline, so the nav always shows where you are.
  useEffect(() => {
    const ids = ["services", "clients", "process", "check-fit", "faq"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <motion.nav
      role="navigation"
      aria-label="Primary"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="fixed left-0 right-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500"
      style={{
        backgroundColor: scrolled ? "hsl(var(--background) / 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid hsl(var(--border) / 0.85)" : "1px solid transparent",
        boxShadow: scrolled ? "0 12px 40px -28px hsl(0 0% 0% / 0.45)" : "none",
      }}
    >
      <a
        href="#main"
        className="pointer-events-none fixed left-4 top-0 z-[60] -translate-y-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-0 shadow-lg transition focus:pointer-events-auto focus:top-[4.5rem] focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-bright"
      >
        {t("navbar.skipToContent")}
      </a>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <a
          href="#hero"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={`Æther — ${t("navbar.tagline")}, home`}
        >
          <span className="font-heading text-base font-semibold tracking-tight text-foreground transition-opacity duration-200 group-hover:opacity-80">
            Æther
          </span>
          <span aria-hidden className="hidden h-3.5 w-px bg-border sm:block" />
          <span
            aria-hidden
            className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-foreground-muted sm:block"
          >
            {t("navbar.tagline")}
          </span>
        </a>

        <div className="hidden flex-wrap items-center justify-end gap-x-5 gap-y-2 font-body text-[12px] font-normal text-muted-foreground md:flex md:text-[13px]">
          {links.map((l) => {
            const active = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={active ? "true" : undefined}
                data-active={active ? "true" : undefined}
                className="nav-link shrink-0 text-foreground/75 transition-colors duration-200 hover:text-foreground aria-[current]:text-foreground"
              >
                {l.label}
              </a>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          <motion.a
            href="#contact"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2 font-body text-[13px] font-medium text-primary-foreground"
            whileHover={{ scale: 1.03, filter: "brightness(1.08)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
          >
            {t("navbar.bookACall")}
          </motion.a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-background/40 text-foreground backdrop-blur-sm md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          id="mobile-nav"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.28, ease: EASE }}
          className="flex max-h-[min(70vh,calc(100dvh-5rem))] flex-col gap-1 overflow-y-auto border-t border-border bg-background/95 px-6 py-4 font-body text-sm backdrop-blur-xl md:hidden"
        >
          {links.map((l) => {
            const active = activeId === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={active ? "true" : undefined}
                className="rounded-lg px-3 py-3 text-foreground/85 transition-colors hover:bg-card hover:text-foreground aria-[current]:bg-card aria-[current]:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            );
          })}
          <div className="flex items-center justify-center gap-2 border-t border-border/60 py-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <a
            href="#contact"
            className="mt-0 inline-flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-[13px] font-medium text-primary-foreground"
            onClick={() => setMenuOpen(false)}
          >
            {t("navbar.bookACall")}
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
