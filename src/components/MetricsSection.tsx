import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";

interface Metric {
  value: number;
  suffix: string;
  label: string;
}

const metrics: Metric[] = [
  { value: 500, suffix: "+", label: "Hours saved monthly" },
  { value: 20, suffix: "+", label: "Businesses automated" },
  { value: 99.8, suffix: "%", label: "Reconciliation accuracy" },
  { value: 24, suffix: "/7", label: "Automation uptime" },
];

function useCounter(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number((target * eased).toFixed(target % 1 === 0 ? 0 : 1)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return count;
}

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCounter(metric.value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: EASE,
      }}
      className="text-center"
    >
      <p className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
        {count}
        <span className="text-primary">{metric.suffix}</span>
      </p>
      <p className="mt-2 font-body text-sm font-light text-muted-foreground">
        {metric.label}
      </p>
    </motion.div>
  );
}

const MetricsSection = () => {
  return (
    <section className="border-y border-border px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-12 md:grid-cols-4 md:gap-8">
        {metrics.map((m, i) => (
          <MetricCard key={m.label} metric={m} index={i} />
        ))}
      </div>
    </section>
  );
};

export default MetricsSection;
