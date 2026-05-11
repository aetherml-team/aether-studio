import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Linkedin, Twitter } from "lucide-react";
import { EASE, viewport } from "@/lib/motion";

const Footer = () => {
  const { t } = useTranslation();

  const navSections = [
    {
      titleKey: "footer.company",
      links: [
        { textKey: "footer.services", href: "#services" },
        { textKey: "footer.clients", href: "#clients" },
        { textKey: "footer.contact", href: "#contact" },
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
      <div className="gradient-strip mb-12 opacity-60" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.65, ease: EASE }}
        className="mx-auto max-w-7xl"
      >
        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <p className="font-mono text-sm font-medium tracking-tight text-foreground">
              Æther
            </p>
            <p className="mt-3 max-w-sm font-body text-sm font-light leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-4">
              <motion.a
                href="https://www.linkedin.com/company/aetherml/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <Linkedin className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://x.com/AEtherML"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <Twitter className="h-4 w-4" />
              </motion.a>
            </div>
          </div>

          {navSections.map((section, si) => (
            <motion.div
              key={section.titleKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.05 + si * 0.06, ease: EASE }}
            >
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t(section.titleKey)}
              </p>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.textKey}>
                    <a
                      href={link.href}
                      className="nav-link font-body text-sm text-foreground/60 transition-colors hover:text-foreground"
                    >
                      {t(link.textKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-16 border-t border-border pt-8"
        >
          <p className="font-body text-xs text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
