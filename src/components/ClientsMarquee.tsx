const clients = [
  "Rivian", "Notion", "Arc", "Linear", "Vercel",
  "Stripe", "Figma", "Framer", "Raycast", "Pitch",
];

const ClientsMarquee = () => {
  return (
    <section className="py-16 border-t border-border overflow-hidden">
      <p className="font-body text-[11px] font-medium tracking-widest uppercase text-muted-foreground text-center mb-10">
        Trusted by forward-thinking teams
      </p>
      <div className="relative">
        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap w-max">
          {[...clients, ...clients].map((client, i) => (
            <span
              key={i}
              className="font-heading text-2xl md:text-3xl text-muted-foreground/40 select-none"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsMarquee;
