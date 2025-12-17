"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { LucideCheck, ChevronLeft, ChevronRight, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"] as const;

const ABOUT_FEATURES = [
  "Same-day telemedicine availability",
  "Travel vaccines and expert advice",
  "Compassionate, multilingual team",
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
    <section ref={ref} className="bg-[#E6E8EB]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 items-center">
          <div
            className="order-2 md:order-1 relative h-80 w-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 1.4s ease, transform 1.4s ease",
            }}
          >
            <Image
              src="/website/about.png"
              alt="Kings Care Medical Clinic team providing personalized care"
              className="w-full rounded-xl shadow-lg object-cover aspect-[4/3]"
              loading="lazy"
              fill
              style={{ objectFit: "cover" }}
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0E2A47] mb-4">
              About Kings Care Medical Clinic
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
              We are a locally owned pharmacy offering travel health, and personalized care. Our prescribing pharmacists help with renewals, minor ailments, injections, and more.
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
              className="inline-block rounded-full border-2 border-[#0E2A47] px-6 py-3 font-semibold text-[#0E2A47] hover:bg-[#0E2A47] hover:text-white transition-all duration-200"
            >
              More about us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroSection = ({ selectedDate, setSelectedDate }: { selectedDate: number | null; setSelectedDate: (date: number | null) => void }) => {
  const calendarDays = useMemo(() => generateCalendarDays(), []);
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
    <section ref={ref} className="bg-image-about relative w-full overflow-hidden bg-cover bg-center rounded-3xl shadow-2xl p-10 sm:py-12 lg:py-16">
      <div className="w-full px-4 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            <div
              className="space-y-6 lg:space-y-8"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 1.4s ease, transform 1.4s ease",
              }}
            >
              <h3 className="absolute text-white top-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Why Choose Kings Care Medical Clinic?
              </h3>
              <p className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:text-lg md:text-xl font-bold leading-relaxed max-w-2xl mt-10 text-white">
                At Kings Care Medical Clinic we combine modern telemedicine with compassionate, personalized care. We are your trusted care partner.
              </p>
            </div>

            <div
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto max-w-sm"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 1.4s ease 0.15s, transform 1.4s ease 0.15s",
              }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4 sm:mb-6">
                Choose Date & Time
              </h2>
              <div className="mb-4 sm:mb-6">
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
                  {DAYS_OF_WEEK.map((day, index) => (
                    <div key={index} className="text-center text-gray-500 text-xs sm:text-sm font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {calendarDays.map((dateObj, index) => (
                    <CalendarButton
                      key={`${dateObj.day}-${index}`}
                      dateObj={dateObj}
                      isSelected={selectedDate === dateObj.day && dateObj.isCurrentMonth}
                      onSelect={() => dateObj.isCurrentMonth && setSelectedDate(dateObj.day)}
                    />
                  ))}
                </div>
              </div>

              <Link
                href="/check-availability"
                className="block rounded-full w-full bg-[#D9C89E] text-center text-[#0E2A47] font-bold text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 transition-all duration-200 shadow-lg hover:shadow-3xl hover:bg-[#C7B57A] active:scale-95"
              >
                Check Availability Now
              </Link>
            </div>
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
      
      {/* <HeroSection selectedDate={selectedDate} setSelectedDate={setSelectedDate} /> */}
    </>
  );
};

export default About;
