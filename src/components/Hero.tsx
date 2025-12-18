"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarSearchIcon, PhoneCall } from "lucide-react";
import { useEffect, useState } from "react";

type ScrollCard = { title: string; text: string; href: string; emoji?: string; image?: string | null };

export default function Hero({ cards = [] }: { cards?: ScrollCard[] }) {
  // cards prop preserved for compatibility with the home page, even though the new hero is static
  void cards;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/website/header.png"
          alt="Patient and clinician reviewing prescriptions together"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E2A47]/90 via-[#0E2A47]/65 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center gap-12 px-4 py-16 lg:flex-row lg:items-center lg:py-24">
        <div className="max-w-xl space-y-6 text-white">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1s ease, transform 1s ease",
            }}
          >
            <span className="h-2 w-2 rounded-full bg-[#D9C89E]" />
            <span className="text-sm font-semibold">18K+ satisfied patients</span>
          </div>

          <h1
            className="text-shadow-2xs text-shadow-[#D9C89E] text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 1.2s ease 0.15s, transform 1.2s ease 0.15s",
            }}
          >
            Your Family’s Health,
            <br />
            Our Priority
          </h1>

          <p
            className="text-lg text-white/85 sm:text-xl"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s",
            }}
          >
            KingsCare Medical Clinic provides trusted family medicine, walk-in care, women’s health, prenatal services, travel medicine, and specialized clinics,  all in one welcoming location.
          </p>

          <div
            className="flex flex-wrap items-center gap-3"
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
              className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-[#D9C89E] hover:bg-white/10 shadow-lg shadow-[#D9C89E] hover:border-[#D9C89E]"
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
            {/* <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-white/40 backdrop-blur" />
              ))}
            </div> */}
            <div>
              <div className="text-lg font-semibold">Serving individuals and families with compassionate,</div>
              <p className="text-white/70">professional medical care in Calgary.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end lg:w-auto shadow-2xl ring-1 ring-white/20 rounded-3xl overflow-hidden shadow-[#D9C89E]">
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
            <div className="flex items-center justify-between">
              <div>
                <div className="text-l font-semibold text-[#4B5563] text-shadow-[#D9C89E]">Accepting new patients</div>
                <div className="text-4xl font-bold  text-sky-950 text-shadow-2xs text-shadow-sky-300 ">Walk-ins welcome</div>
                <p className="text-m ">Most services covered by Alberta Health Care</p>
              </div>
              {/* <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-[#E6E8EB]" />
                ))}
              </div> */}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold">
              <div className="rounded-3xl border border-[#0E2A47]/20 bg-white/80 px-4 py-2 text-center shadow-xl">
               Alberta Health Care Accepted
              </div>
              <div className="rounded-3xl border border-[#0E2A47]/20 bg-white/80 px-4 py-2 text-center shadow-xl">
                Same-Day & Walk-In Appointments
              </div>
              <div className="rounded-3xl border border-[#0E2A47]/20 bg-white/80 px-4 py-2 text-center shadow-xl">
                Experienced Family Physicians
              </div>
              <div className="rounded-3xl border border-[#0E2A47]/20 bg-white px-4 py-2 text-center shadow-xl">
                Women’s & Prenatal Care Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
