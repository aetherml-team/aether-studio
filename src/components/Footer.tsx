import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Linkedin, Twitter } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

const Footer = () => {
  const { t } = useTranslation();

  const navSections = [
    {
      titleKey: "footer.company",
      links: [
        { textKey: "footer.about", href: "/about" },
        { textKey: "footer.services", href: "#offer" },
        { textKey: "footer.clients", href: "#systems" },
        { textKey: "footer.contact", href: "/contact" },
      ],
    },
    {
      titleKey: "footer.connect",
      links: [
        { textKey: "footer.linkedin", href: "https://www.linkedin.com/company/aetherml/" },
        { textKey: "footer.twitter", href: "https://x.com/AEtherML" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border px-6 py-16 md:px-10 md:py-20">
      <div className="mb-12 h-px w-full bg-border" aria-hidden />
      <m.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.45, ease: EASE }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <img src="/logo.png" alt="Æther Studio" width={688} height={342} className="h-24 w-auto dark:hidden" />
            <img src="/aether-logo-email.png" alt="" width={688} height={342} className="hidden h-24 w-auto dark:block" />
            <p className="mt-3 max-w-sm font-body text-sm font-light leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-4">
              <m.a
                href="https://www.linkedin.com/company/aetherml/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <Linkedin className="h-4 w-4" />
              </m.a>
              <m.a
                href="https://x.com/AEtherML"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <Twitter className="h-4 w-4" />
              </m.a>
            </div>
          </div>

          {navSections.map((section, si) => (
            <m.div
              key={section.titleKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.05 + si * 0.06, ease: EASE }}
            >
              <p className="font-body text-sm font-medium text-foreground-dim">
                {t(section.titleKey)}
              </p>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => {
                  const className =
                    "nav-link font-body text-sm text-foreground/60 transition-colors hover:text-foreground";
                  return (
                    <li key={link.textKey}>
                      {link.href.includes("#") ? (
                        <a href={link.href} className={className}>
                          {t(link.textKey)}
                        </a>
                      ) : link.href.startsWith("/") ? (
                        <Link to={link.href} className={className}>
                          {t(link.textKey)}
                        </Link>
                      ) : (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
                          {t(link.textKey)}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-8 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-body text-xs text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <nav className="flex gap-5" aria-label={t("footer.legal")}>
            <Link
              to="/privacy"
              className="nav-link font-body text-xs text-foreground/60 transition-colors hover:text-foreground"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/terms"
              className="nav-link font-body text-xs text-foreground/60 transition-colors hover:text-foreground"
            >
              {t("footer.terms")}
            </Link>
          </nav>
        </m.div>
      </m.div>
    </footer>
  );
};

export default Footer;
