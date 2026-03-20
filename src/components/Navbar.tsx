import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-6 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <a href="/" className="font-heading text-2xl tracking-widest text-foreground">
        ÆTHER
      </a>
      <div className="hidden md:flex items-center gap-10 font-body text-sm tracking-wider text-muted-foreground">
        <a href="#about" className="hover:text-foreground transition-colors duration-300">About</a>
        <a href="#services" className="hover:text-foreground transition-colors duration-300">Services</a>
        <a href="#contact" className="hover:text-foreground transition-colors duration-300">Contact</a>
      </div>
      <a
        href="#contact"
        className="hidden md:inline-block px-6 py-2.5 text-xs tracking-widest uppercase font-body font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-300"
      >
        Get Started
      </a>
    </motion.nav>
  );
};

export default Navbar;
