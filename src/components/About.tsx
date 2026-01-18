"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { LucideCheck, ChevronLeft, ChevronRight, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"] as const;

 

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
    <section ref={ref}  className="bg-[#d9b356] w-full overflow-hidden  shadow-2xl  rounded-3xl">
      <div className="mx-auto w-full px-4 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 items-center">
          <div
            className="order-2 md:order-1 relative w-full aspect-[4/4] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl shadow-lg shadow-gray-800 overflow-hidden   transition-transform"
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
            className="order-1 md:order-2 "
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1.4s ease 0.15s, transform 1.4s ease 0.15s",
            }}
          >
            <h2 className="text-3xl sm:text-3xl lg:text-3xl font-bold text-[#0E2A47] mb-4">
              About Kings Care Medical Clinic
            </h2>
            <p className="xl:lg:text-xl sm:text-lg leading-relaxed ">
            KingsCare Medical Clinic is a locally operated family medical practice dedicated to delivering comprehensive, high-quality, and patient-centered healthcare to individuals and families in our community. We are committed to creating a welcoming, respectful, and professional environment where patients feel heard, supported, and confident in their care.
            </p>
            <p className="xl:lg:text-xl sm:text-lg leading-relaxed ">
            Our team of experienced physicians and healthcare professionals work collaboratively to provide a broad range of medical services, including preventive care, routine check-ups, chronic disease management, minor surgeries and some specialized medical support. We take a holistic approach to health, recognizing that every patient&apos;s medical needs are unique and require personalized attention.
            </p>
             <p className="mt-4 max-w-3xl xl:lg:text-xl sm:text-base"> 
              At KingsCare Medical Clinic, accessibility and convenience are central to our model of care. We offer same-day appointments and walk-in services whenever possible, ensuring timely access to medical attention when our patients need it most. Our coordinated care approach enables seamless communication among healthcare providers, improving continuity of care and overall patient outcomes.
              </p>
                <p className="mt-4 max-w-3xl xl:lg:text-xl sm:text-base">
                We are proud to serve patients of all ages - from children to seniors - supporting them through every stage of life with compassion, professionalism, and clinical excellence. Our mission is to build long-term relationships with our patients based on trust, integrity, and a shared commitment to health and well-being.
                </p>
             
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
