"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CustomCursor({ enabled = true }: { enabled?: boolean }) {
  // Start disabled during SSR; decide after mount
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!enabled) { setOn(false); return; }

    // Guard for SSR + older browsers
    const reduce =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setOn(!reduce);

    return () => setOn(false);
  }, [enabled]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 300, damping: 30 });
  const sy = useSpring(y, { stiffness: 300, damping: 30 });
  const sScale = useSpring(scale, { stiffness: 300, damping: 30 });
  const sRotate = useSpring(rotate, { stiffness: 250, damping: 20 });

  useEffect(() => {
    if (!on) return;

    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const down = () => scale.set(0.9);
    const up = () => scale.set(1);
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const clickable = t?.closest?.("a,button,[role='button'],input,label,select,textarea");
      rotate.set(clickable ? -12 : 0);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("mouseover", over);

    // Hide native cursor only while custom cursor is enabled
    document.documentElement.classList.add("capsule-cursor-hide");

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("capsule-cursor-hide");
    };
  }, [on, x, y, scale, rotate]);

  if (!on) return null;

  return (
    <motion.div
      aria-hidden
      style={{ translateX: sx, translateY: sy, scale: sScale, rotate: sRotate }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2"
    >
      <Image
        src="/website/capsule-closed.png"
        alt=""
        width={36}
        height={36}
        className="drop-shadow"
        priority
      />
    </motion.div>
  );
}
