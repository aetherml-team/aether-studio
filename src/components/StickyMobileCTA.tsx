import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { EASE } from "@/lib/motion";

const StickyMobileCTA = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    // Show after the hero, hide near the contact form to avoid covering inputs
    setShow(y > window.innerHeight * 0.7 && y < max - window.innerHeight * 0.6);
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#contact"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-x-4 bottom-4 z-50 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-body text-[14px] font-medium text-primary-foreground shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.6)] md:hidden"
        >
          <span>{t("stickyCta.label")}</span>
          <ArrowRight className="h-4 w-4" />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default StickyMobileCTA;
