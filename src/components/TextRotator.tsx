"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function TextRotator({
  items = [],
  interval = 2500,
  className = "",
}: {
  items: string[];
  interval?: number;
  className?: string;
}) {
  const safeItems = useMemo(() => (items.length ? items : [""]), [items]);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % safeItems.length), interval);
    return () => clearInterval(t);
  }, [interval, safeItems.length, paused]);

  return (
    <div
      className={`relative h-8 overflow-hidden select-none ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-x-0 text-white/90 font-medium"
          style={{ textAlign: "center" }}
        >
          {safeItems[i]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
