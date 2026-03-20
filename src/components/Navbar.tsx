import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 lg:px-24 py-7 bg-background"
    >
      <a href="/" className="font-heading text-2xl font-semibold tracking-wide text-foreground">
        ÆTHER
      </a>
      <div className="hidden md:flex items-center gap-10 font-body text-[13px] font-light tracking-wider text-muted-foreground uppercase">
        <a href="#services" className="hover:text-foreground transition-colors duration-500">Services</a>
        <a href="#about" className="hover:text-foreground transition-colors duration-500">About</a>
        <a href="#contact" className="hover:text-foreground transition-colors duration-500">Contact</a>
      </div>
      <a
        href="#contact"
        className="hidden md:inline-block font-body text-[13px] font-light tracking-wider uppercase text-foreground hover:text-primary transition-colors duration-500"
      >
        Let's Talk →
      </a>
    </motion.nav>
  );
};

export default Navbar;
