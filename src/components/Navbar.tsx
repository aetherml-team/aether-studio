import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";

const links = [
  { href: "#services", label: "Services" },
  { href: "#clients", label: "Clients" },
  { href: "#why-aether", label: "Why æther" },
  { href: "#contact", label: "Contact" },
] as const;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.nav
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <motion.a
          href="#hero"
          className="font-mono text-sm font-medium tracking-tight text-foreground"
          aria-label="æther home"
          whileHover={{ opacity: 0.85 }}
        >
          Æther
        </motion.a>

        <div className="hidden items-center gap-8 font-body text-[13px] font-normal text-muted-foreground md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link text-foreground/75 transition-colors duration-200 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <motion.a
          href="#contact"
          className="hidden items-center rounded-lg bg-primary px-5 py-2 font-body text-[13px] font-medium text-primary-foreground md:inline-flex"
          whileHover={{ scale: 1.03, filter: "brightness(1.08)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
        >
          Get Started
        </motion.a>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="font-mono text-xs font-medium uppercase tracking-wider text-foreground md:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.28, ease: EASE }}
          className="flex flex-col gap-4 border-t border-border bg-background/95 px-6 py-6 font-body text-sm backdrop-blur-xl md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-foreground/80 transition-colors hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-2 inline-flex w-fit rounded-lg bg-primary px-5 py-2 text-[13px] font-medium text-primary-foreground"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
