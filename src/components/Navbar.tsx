import { motion } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95"
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 py-6">
        <a href="/" className="font-heading text-3xl text-foreground">
          ÆTHER
        </a>

        <div className="hidden md:flex items-center gap-12 font-body text-[13px] font-medium tracking-wide text-muted-foreground">
          <a href="#work" className="hover:text-foreground transition-colors duration-300">Work</a>
          <a href="#services" className="hover:text-foreground transition-colors duration-300">Services</a>
          <a href="#about" className="hover:text-foreground transition-colors duration-300">About</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors duration-300">Testimonials</a>
        </div>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 font-body text-[13px] font-medium text-foreground bg-card px-5 py-2.5 rounded-full hover:bg-accent transition-colors duration-300"
        >
          Start a project
          <span className="text-primary">→</span>
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden font-body text-sm text-foreground"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden px-6 pb-6 flex flex-col gap-4 font-body text-sm"
        >
          <a href="#work" className="text-foreground" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#services" className="text-foreground" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" className="text-foreground" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#testimonials" className="text-foreground" onClick={() => setMenuOpen(false)}>Testimonials</a>
          <a href="#contact" className="text-primary font-medium" onClick={() => setMenuOpen(false)}>Start a project →</a>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
