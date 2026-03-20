const Footer = () => {
  return (
    <footer className="border-t border-border px-8 md:px-16 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-heading text-lg tracking-widest text-foreground">ÆTHER</p>
        <p className="font-body text-xs text-muted-foreground tracking-wider">
          © {new Date().getFullYear()} ÆTHER. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
