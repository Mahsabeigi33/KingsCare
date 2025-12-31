"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarSearchIcon, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";

type ScrollCard = { title: string; text: string; href: string; emoji?: string; image?: string | null };

const HERO_IMAGE_DESKTOP = "/website/header.png";
const HERO_IMAGE_MOBILE = "/website/hero.png";

export default function Hero({ cards = [] }: { cards?: ScrollCard[] }) {
  // cards prop preserved for compatibility with the home page, even though the new hero is static
  void cards;
  const [entered, setEntered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(typeof window !== "undefined" ? window.innerWidth < 768 : false);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={isMobile ? HERO_IMAGE_MOBILE : HERO_IMAGE_DESKTOP}
          alt="Patient and clinician reviewing prescriptions together"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2A47] via-[#0E2A47]/80 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] max-w-10xl flex-col  gap-12 px-2 sm:px-6 pt-24 pl-4  pb-16 md:pt-4 md:px-0 md:pb-12 lg:pt-4 lg:pb-12 lg:flex-row lg:items-center md:px-6 lg:pl-20 xl:pl-60 lg:md:justify-start">
        <div className="max-w-3xl text-white space-y-6 sm:space-y-6 md:max-w-2xl lg:max-w-xl lg:space-y-8  sm:px-4 md:px-6">

          <h1
            className="text-shadow-xl  text-shadow-[#D9C89E] text-4xl font-bold leading-tight  sm:text-5xl lg:text-6xl sm:pt-16 sm:mt-8 md:p-4 lg:pt-16 md:pt-12 "
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 1.2s ease 0.15s, transform 1.2s ease 0.15s",
              fontFamily: "Playfair Display,serif",
            }}
          >
            Family Medical Care,
            <br />
           Focused on Your <span className="tracking-widest text-[#D9C89E]">Health</span>
          </h1>

          <p
            className="text-lg text-white/85 sm:text-xl p-2"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s",
            }}
          >
            KingsCare Medical Clinic provides family medicine, walk-in medical care, women’s health services, prenatal visits, travel medicine, and specialized clinics in a professional healthcare setting.
          </p>

          <div
            className="flex flex-wrap items-center gap-3 p-2"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 1s ease 0.45s, transform 1s ease 0.45s",
            }}
          >
            <Link
              href="/user/appointments"
              className="inline-flex items-center gap-2 rounded-full bg-[#D9C89E] px-6 py-3 text-base font-semibold text-[#0E2A47] shadow-lg shadow-[#0E2A47] transition hover:-translate-y-0.5 hover:bg-[#C7B57A] hover:shadow-xl"
            >
              <CalendarSearchIcon className="h-5 w-5" />

              Book appointment
            </Link>
            <Link
              href="tel:+15873"
              className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-[#D9C89E] hover:bg-white/10 shadow-lg shadow-[#d9b356] hover:border-[#D9C89E]"
            >
              <PhoneCall className="h-5 w-5" />
              Call the clinic
            </Link>
          </div>

          <div
            className="flex items-center gap-4 text-sm text-white/80"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 1s ease 0.6s, transform 1s ease 0.6s",
            }}
          >
          
            <div className="p-4">
              <div className="text-lg font-semibold">Serving individuals and families with compassionate,</div>
              <p className="text-white/70">Providing medical services with a patient-centred and professional approach</p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end md:justify-center lg:w-auto shadow-2xl ring-1 ring-white/20 rounded-3xl overflow-hidden shadow-[#D9C89E] mt-6 lg:mt-120 md:mt-16  ">
          <div
            className="w-full max-w-sm rounded-2xl border border-white/15 bg-white/70 p-6 text-[#0E2A47] shadow-2xl backdrop-blur-lg"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 1.4s ease 0.35s, transform 1.4s ease 0.35s",
              boxShadow: entered
                ? "0 20px 60px rgba(14,42,71,0.28), 0 0 0 1px rgba(230,232,235,0.6)"
                : undefined,
            }}
          >
            <div className="flex items-center justify-between md:justify-center gap-4">
              <div>
              
                <div className="text-4xl font-bold  text-sky-950 text-shadow-2xs text-shadow-sky-300 ">Clinic Visit Options</div>
                <p className="text-m ">Medical appointments and clinical services provided by our family practice team</p>
              </div>
              {/* <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-[#E6E8EB]" />
                ))}
              </div> */}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold">
              <div className="rounded-3xl border border-[#0E2A47]/20 bg-white/80 px-4 py-2 text-center shadow-xl">
                Walk-In Medical Care
              </div>
              <div className="rounded-3xl border border-[#0E2A47]/20 bg-white/80 px-4 py-2 text-center shadow-xl">
               Third-party Medicals
              </div>
              <div className="rounded-3xl border border-[#0E2A47]/20 bg-white/80 px-4 py-2 text-center shadow-xl">
                Family Medicine & General Practice
              </div>
              <div className="rounded-3xl border border-[#0E2A47]/20 bg-white px-4 py-2 text-center shadow-xl">
                Women’s & Prenatal Health Services
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
