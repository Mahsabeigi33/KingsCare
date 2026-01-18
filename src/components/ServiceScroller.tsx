"use client";
import { motion, PanInfo } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Card = { 
  title: string; 
  text: string; 
  href: string; 
  emoji?: string; 
  image?: string | null;
};

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const safeParse = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};
const plainTextFromEditor = (value: string) => {
  const parsed = safeParse(value);
  if (!parsed || !Array.isArray(parsed.blocks)) {
    return stripHtml(value);
  }
  const text = parsed.blocks
    .map((block: { data?: { text?: string; items?: Array<string | { content?: string }> } }) => {
      if (block?.data?.text) return stripHtml(String(block.data.text));
      if (Array.isArray(block?.data?.items)) {
        return block.data.items
          .map((item) => {
            if (typeof item === "string") return stripHtml(item);
            if (item && typeof item === "object" && "content" in item) {
              return stripHtml(String(item.content ?? ""));
            }
            return stripHtml(String(item));
          })
          .join(" ");
      }
      return "";
    })
    .join(" ");
  return stripHtml(text);
};

// Responsive Slider with background image per service
export default function ServiceScroller({ cards }: { cards: Card[] }) {
  const count = cards?.length ?? 0;
  const [index, setIndex] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const isInteractive = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(pointer: fine)").matches : false),
    []
  );
  // Enable drag only after mount to avoid SSR/client mismatch
  const [dragAxis, setDragAxis] = useState<false | "x">(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setDragAxis(mq.matches ? "x" : false);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const clamp = useCallback((i: number) => (count ? (i + count) % count : 0), [count]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);

  // Auto advance
  useEffect(() => {
    if (count <= 1 || reducedMotion) return;
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setIndex((i) => clamp(i + 1)), 6500);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [count, clamp, reducedMotion]);

  const pause = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = null;
  };
  
  const resume = () => {
    if (reducedMotion) return;
    if (count > 1) autoRef.current = setInterval(() => setIndex((i) => clamp(i + 1)), 6500);
  };

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dx = info.offset.x;
    const threshold = 60;
    if (dx < -threshold) next();
    else if (dx > threshold) prev();
  };

  if (!cards || count === 0) return null;

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "Home") {
      e.preventDefault();
      setIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setIndex(clamp(count - 1));
    }
  };

  return (
    <div
      className="mt-6 sm:mt-8 md:mt-10 relative w-full"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onKeyDown={onKeyDown}
      role="region"
      aria-label="Services carousel"
      tabIndex={0}
    >
      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={
            reducedMotion 
              ? { duration: 0 } 
              : { type: "spring", stiffness: 180, damping: 24 }
          }
          drag={dragAxis}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ width: `${count * 100}%` }}
          role="list"
          aria-live="polite"
        >
          {cards.map((c, i) => (
            <div
              key={c.title}
              className="relative w-full shrink-0 
                h-64 
                xs:h-72
                sm:h-80
                md:h-96 
                lg:aspect-[16/9] lg:h-auto 
                max-h-[28rem]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
          
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0" 
                style={{ 
                  background: "linear-gradient(135deg, rgba(54, 124, 134, 0.95) 0%, rgba(49, 86, 100, 0.95) 65%)" 
                }} 
              />

              {/* Content */}
              <div className="relative h-full w-full 
                px-6 py-8
                sm:px-6 sm:py-8
                md:px-8 md:py-10
                lg:px-12 lg:py-12
                flex items-center">
                
                <Link
                  href={c.href}
                  className="relative w-full 
                    max-w-xs
                    sm:max-w-sm
                    md:max-w-md
                    lg:max-w-lg
                    rounded-lg sm:rounded-xl 
                    backdrop-blur-sm
                    border border-white/50 
                    shadow-xl
                    p-10 sm:p-6 md:p-8
                    hover:-translate-y-1                     
                    transition-all duration-300
                    shadow-[#D9C89E]/25
                    hover:shadow-2xl 
                   hover:shadow-white/50
                    hover:bg-white/5
                  "
                >
                  {/* Emoji */}
                  {c.emoji && (
                    <div 
                      className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 text-center" 
                      aria-hidden="true"
                    >
                      {c.emoji}
                    </div>
                  )}
                  
                  {/* Title - BOLD */}
                  <div className="
                    font-black 
                    text-white 
                    text-center 
                    text-lg
                    sm:text-xl 
                    md:text-2xl 
                    lg:text-3xl
                    mb-2 sm:mb-3 md:mb-4
                    leading-tight
                  ">
                    {c.title}
                  </div>
                  
                  {/* Description */}
                  <p className="
                    text-gray-100 
                    text-center 
                    text-sm
                    sm:text-base 
                    md:text-lg
                    leading-relaxed
                    mb-2 sm:mb-3
                  ">
                    {plainTextFromEditor(c.text)}
                  </p>
                  
                  {/* CTA */}
                  <div className="
                    text-[#D9C89E] 
                    font-bold 
                    text-center 
                    text-sm
                    sm:text-base
                    md:text-lg
                    hover:text-[#C7B57A]
                    transition-colors
                  ">
                    Learn more →
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={prev}
              className="
                absolute left-2 sm:left-3 md:left-4 
                top-1/2 -translate-y-1/2 
                rounded-full 
                bg-black/50 
                text-white 
                w-8 h-8
                sm:w-9 sm:h-9 
                md:w-10 md:h-10
                lg:w-12 lg:h-12
                text-lg sm:text-xl md:text-2xl
                grid place-items-center 
                hover:bg-black/70
                transition-all
                hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-white/50
              "
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={next}
              className="
                absolute right-2 sm:right-3 md:right-4 
                top-1/2 -translate-y-1/2 
                rounded-full 
                bg-black/50 
                text-white 
                w-8 h-8
                sm:w-9 sm:h-9 
                md:w-10 md:h-10
                lg:w-12 lg:h-12
                text-lg sm:text-xl md:text-2xl
                grid place-items-center 
                hover:bg-black/70
                transition-all
                hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-white/50
              "
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {count > 1 && (
        <div className="mt-3 sm:mt-4 md:mt-5 flex items-center justify-center gap-1.5 sm:gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              aria-current={i === index ? "true" : undefined}
              className={`
                h-2 w-2
                sm:h-2.5 sm:w-2.5 
                md:h-3 md:w-3
                rounded-full 
                transition-all duration-300
                ${i === index 
                  ? "bg-[#D9C89E] scale-125" 
                  : "bg-white/50 hover:bg-white/70 hover:scale-110"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}
