const Footer = () => {
  return (
    <footer className="border-t border-border px-6 md:px-16 lg:px-24 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-6xl">
        <div className="flex items-center gap-8">
          <p className="font-heading text-2xl text-foreground">ÆTHER</p>
          <div className="hidden md:flex items-center gap-6 font-body text-[12px] text-muted-foreground">
            <a href="#work" className="hover:text-foreground transition-colors">Work</a>
            <a href="#services" className="hover:text-foreground transition-colors">Services</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
        <p className="font-body text-[11px] text-muted-foreground tracking-wide">
          © {new Date().getFullYear()} Æther Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
