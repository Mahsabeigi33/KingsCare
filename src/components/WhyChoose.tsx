"use client";   
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LucideCheck, ChevronLeft, ChevronRight, CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
const WhyChoose = () => {
  const [activeReason, setActiveReason] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);

  const reasons = [
   {
      title: "Patient-Centered Care",
      blurb: "At KingsCare, every patient is treated with respect, empathy, and personal attention. Our healthcare professionals take the time to listen, understand your concerns, and provide care that is tailored to your individual needs - not rushed, not one-size-fits-all.",
      bullets: ["Personalized treatment plans", "Compassionate communication", "Holistic health approach"],
      image: "/website/why.png",
      tag: "Your health, our priority",
    },
    {
      title: "Experienced & Multidisciplinary Medical Team",
      blurb: "KingsCare brings together a diverse team of experienced physicians and healthcare providers working collaboratively to deliver comprehensive medical services , all under one roof. This team-based approach ensures accurate diagnosis, continuity of care, and better health outcomes.",
      bullets: ["Board-certified physicians", "Integrated care teams", "Continuous professional development"],
      image: "/website/team.png",
      tag: "Expert care you can trust",
    },
     
    {
      title: "Convenient Access & Modern Services",
      blurb: "We offer flexible appointment options, same-day visits, and an easy-to-use online booking system to make healthcare more accessible. With modern technology and efficient clinic workflows, KingsCare makes managing your health simple and stress-free.",
      bullets: ["Online appointment scheduling", "Telemedicine consultations", "Extended hours and weekend availability"],
      image: "/website/Modern.png",
      tag: "Healthcare made easy",
    },
  ];

  const next = () => setActiveReason((prev) => (prev + 1) % reasons.length);
  const prev = () => setActiveReason((prev) => (prev - 1 + reasons.length) % reasons.length);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => next(), 4500);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
      <section ref={sectionRef} className="bg-white/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:grid lg:grid-cols-[80px_1.15fr_1fr] lg:items-start lg:gap-10">
          <div className="mb-8 flex flex-row items-start gap-3 lg:mb-0 lg:flex-col lg:items-center lg:gap-4">
            
            {reasons.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveReason(idx)}
                className={`h-10 w-10 rounded-full border text-sm font-bold transition ${
                  idx === activeReason
                    ? "border-[#0E2A47] bg-[#0E2A47] text-white"
                    : "border-[#0E2A47]/25 bg-white text-[#0E2A47]"
                }`}
                aria-label={`Go to reason ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
            <div className="hidden h-24 w-px bg-gradient-to-b from-[#0E2A47]/30 via-[#0E2A47]/10 to-transparent lg:block" />
          </div>

          <div
            className="relative w-full overflow-hidden rounded-[28px] bg-white shadow-xl ring-1 ring-slate-200/60"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 1.8s ease, transform 1.8s ease",
            }}
          >
            <div className={`relative aspect-[4/5] w-full transition-opacity duration-500 ${inView ? "opacity-100" : "opacity-80"}`}>
              <Image
                src={reasons[activeReason].image}
                alt={reasons[activeReason].title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 55vw, 120vw"
                priority={activeReason === 0}
              />
            </div>
            <div className="absolute top-4 left-4 rounded-full border border-white/60 bg-white/85 px-3 py-1 text-xs font-semibold text-[#0E2A47] shadow-sm backdrop-blur">
              {String(activeReason + 1).padStart(2, "0")}
            </div>
            <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#0E2A47] shadow-md backdrop-blur">
              {reasons[activeReason].tag}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 lg:mt-0">
            <div
              className="inline-flex w-max items-center gap-2 rounded-full border border-[#0E2A47]/10 bg-[#E6E8EB] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0E2A47]"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(15px)",
                transition: "opacity 1.2s ease, transform 1.2s ease",
              }}
            >
             <h4>Why choose us</h4> 
            </div>
            <h3
              className="text-3xl font-bold text-[#0E2A47] sm:text-4xl"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 1.5s ease 0.2s, transform 1.5s ease 0.2s",
              }}
            >
              {reasons[activeReason].title}
            </h3>
            <p
              className="text-base text-[#4B5563] sm:text-lg"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 1.8s ease 0.4s, transform 1.8s ease 0.4s",
              }}
            >
              {reasons[activeReason].blurb}
            </p>
            <ul className="space-y-3">
              {reasons[activeReason].bullets.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#0E2A47]">
                  <span className="rounded-full bg-[#E6E8EB] p-1.5">
                    <CheckCircle className="h-4 w-4 text-[#0E2A47]" />
                  </span>
                  <span className="text-base font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-[#0E2A47]/40 px-5 py-2.5 text-sm font-semibold text-[#0E2A47] transition hover:-translate-y-0.5 hover:border-[#0E2A47]"
              >
                See services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0E2A47]">
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0E2A47]/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#0E2A47]"
                  aria-label="Previous reason"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#0E2A47]/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#0E2A47]"
                  aria-label="Next reason"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};


export default WhyChoose ;
