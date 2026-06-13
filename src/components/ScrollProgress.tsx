import { motion, useScroll, useSpring } from "framer-motion";

/** Thin reading-progress rail pinned above the nav. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress fixed inset-x-0 top-0 z-[60] h-[2px]"
      style={{ scaleX }}
      aria-hidden
    />
  );
};

export default ScrollProgress;
