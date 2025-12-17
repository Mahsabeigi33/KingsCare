"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Props = {
  /** open when true (e.g., first scroll or CTA click) */
  triggerOpen?: boolean;
  /** open the capsule on hover as well (default true on desktop) */
  hoverOpens?: boolean;
  /** optional: called first time it opens */
  onOpened?: () => void;
  /** size in pixels for base (scales with responsive classes outside) */
  size?: number;
};

export default function CapsuleAnimation({
  triggerOpen,
  hoverOpens = true,
  onOpened,
  size = 280,
}: Props) {
  const [opened, setOpened] = useState(false);

  // particles (random once)
  const particles = useMemo(
    () =>
      Array.from({ length: 48 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 140, // spread
        delay: 0.12 + Math.random() * 0.45,
        duration: 0.85 + Math.random() * 1.1,
        size: 2 + Math.random() * 3.5,
      })),
    []
  );

  useEffect(() => {
    if (triggerOpen && !opened) handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerOpen]);

  function handleOpen() {
    if (!opened) {
      setOpened(true);
      onOpened?.();
    }
  }

  function replay() {
    setOpened(false);
    // small delay so closed image mounts before opening again (for hover)
    setTimeout(() => setOpened(true), 30);
  }

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      onMouseEnter={hoverOpens ? handleOpen : undefined}
      onTouchStart={handleOpen}
      aria-label="Capsule animation"
      role="img"
    >
      {/* Closed capsule */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="closed"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 cursor-pointer"
            onClick={handleOpen}
            title="Click or hover to open"
          >
            <Image
              src="/website/capsule-closed.png"
              alt="Closed capsule"
              fill
              className="object-contain"
              priority
              sizes={`${size}px`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open state (uses your open image + particle fall) */}
      {opened && (
        <div className="absolute inset-0">
          <motion.div
            initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
            animate={{ opacity: 1, rotate: -8, x: -8, y: -6 }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="absolute inset-0"
          >
            <Image
              src="/website/capsule-open.png"
              alt="Open capsule"
              fill
              className="object-contain"
              priority
              sizes={`${size}px`}
            />
          </motion.div>

          {/* powder */}
          <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2">
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 110 + Math.random() * 30, opacity: [0, 1, 1, 0] }}
                transition={{ delay: p.delay, duration: p.duration, ease: "easeIn" }}
                style={{
                  display: "block",
                  position: "absolute",
                  left: p.x,
                  width: p.size,
                  height: p.size,
                  borderRadius: 9999,
                  background: "#fff",
                  boxShadow: "0 0 2px rgba(0,0,0,.15)",
                }}
              />
            ))}
          </div>

          {/* replay (desktop only) */}
          <button
            type="button"
            className="absolute -bottom-7 left-1/2 hidden -translate-x-1/2 text-xs text-white/80 hover:text-white md:block"
            onClick={replay}
          >
            Replay
          </button>
        </div>
      )}
    </div>
  );
}
