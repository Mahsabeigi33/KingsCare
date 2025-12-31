"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { LucideCheck, ChevronLeft, ChevronRight, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"] as const;

const ABOUT_FEATURES = [
  "Same-day and walk-in appointments available",
  "Comprehensive family and preventative care",
  "Women’s health and prenatal services",
  "Travel medicine and WCB injury assessments",
  "Compassionate, diverse, and multilingual medical team",
] as const;

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
}

interface CalendarButtonProps {
  dateObj: CalendarDay;
  isSelected: boolean;
  onSelect: () => void;
}

const generateCalendarDays = (): CalendarDay[] => [
  { day: 30, isCurrentMonth: false },
  ...Array.from({ length: 31 }, (_, i) => ({ day: i + 1, isCurrentMonth: true })),
  { day: 1, isCurrentMonth: false },
  { day: 2, isCurrentMonth: false },
  { day: 3, isCurrentMonth: false },
];

const CalendarButton = ({ dateObj, isSelected, onSelect }: CalendarButtonProps) => {
  const baseClasses = "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200";

  const variantClasses = !dateObj.isCurrentMonth
    ? "text-gray-300 cursor-not-allowed"
    : isSelected
    ? "bg-[#0E2A47] text-white shadow-md scale-105"
    : "text-gray-700 hover:bg-[#E6E8EB] hover:text-[#0E2A47] cursor-pointer";

  return (
    <button
      type="button"
      onClick={() => onSelect()}
      disabled={!dateObj.isCurrentMonth}
      className={`${baseClasses} ${variantClasses}`}
      aria-label={`Select day ${dateObj.day}`}
    >
      {dateObj.day}
    </button>
  );
};

const AboutSection = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#d9b356] w-full overflow-hidden  shadow-2xl  rounded-3xl">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 items-center">
          <div
            className="order-2 md:order-1 relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 1.4s ease, transform 1.4s ease",
            }}
          >
            <Image
              src="/website/about.png"
              alt="Kings Care Medical Clinic team providing personalized care"
              fill
              className="rounded-xl shadow-lg object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              priority={true}
            />
          </div>

          <div
            className="order-1 md:order-2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1.4s ease 0.15s, transform 1.4s ease 0.15s",
            }}
          >
            <h2 className="text-3xl sm:text-3xl lg:text-3xl font-bold text-[#0E2A47] mb-4">
              About Kings Care Medical Clinic
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
            Kings Care Medical Clinic provides trusted family medicine and specialized medical services in a welcoming, professional environment. Our team is committed to accessible, high-quality care for patients of all ages, with same-day appointments and comprehensive health services under one roof.  
            </p>
            <ul className="space-y-3 text-gray-700 mb-8" role="list">
              {ABOUT_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-[#0E2A47] mr-2 font-bold">
                    <LucideCheck />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="inline-block rounded-full border-2 border-[#0E2A47] px-6 py-3 font-semibold text-white hover:bg-[#D9C89E] hover:text-[#0E2A47] transition-all duration-200 bg-[#0E2A47] shadow-lg hover:shadow-xl shadow-[#0E2A47]/50 hover:shadow-[#0E2A47]/70"
            >
              More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};



const About = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [activeReason, setActiveReason] = useState(0);

 

  return (
    <>
      <AboutSection />
    </>
  );
};

export default About;
