const Footer = () => {
  return (
    <footer className="border-t border-border px-8 md:px-16 lg:px-24 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="font-heading text-lg font-semibold tracking-wide text-foreground">ÆTHER</p>
        <p className="font-body text-[11px] font-light text-muted-foreground tracking-wider uppercase">
          © {new Date().getFullYear()} Æther Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
