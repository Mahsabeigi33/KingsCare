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
            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 1.2s ease 0.15s, transform 1.2s ease 0.15s",
            }}
          >
            Your AI-powered
            <br />
            prescription companion
          </h1>

          <p
            className="text-lg text-white/85 sm:text-xl"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s",
            }}
          >
            Kings Care Medical Clinic keeps you on track with the right dose, at the right time, in the right way-personalized to your health needs.
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
              className="inline-flex items-center gap-2 rounded-full bg-[#D9C89E] px-6 py-3 text-base font-semibold text-[#0E2A47] shadow-lg shadow-[#0E2A47]/15 transition hover:-translate-y-0.5 hover:bg-[#C7B57A] hover:shadow-xl"
            >
              <CalendarSearchIcon className="h-5 w-5" />
              Book appointment
            </Link>
            <Link
              href="tel:+15873276106"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-white"
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
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-white/40 backdrop-blur" />
              ))}
            </div>
            <div>
              <div className="text-lg font-semibold">Trusted care, proven outcomes</div>
              <p className="text-white/70">Smart scheduling, telehealth support, and 24/7 answers.</p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end lg:w-auto">
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
                <div className="text-sm font-semibold text-[#4B5563]">Adherence lift</div>
                <div className="text-4xl font-bold text-[#0E2A47]">46%</div>
                <p className="text-sm text-[#4B5563]">of patients improved adherence</p>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-[#E6E8EB]" />
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold">
              <div className="rounded-full border border-[#0E2A47]/20 bg-white px-4 py-2 text-center shadow-sm">
                Telehealth
              </div>
              <div className="rounded-full border border-[#0E2A47]/20 bg-white px-4 py-2 text-center shadow-sm">
                Smart scheduling
              </div>
              <div className="rounded-full border border-[#0E2A47]/20 bg-white px-4 py-2 text-center shadow-sm">
                24/7 support
              </div>
              <div className="rounded-full border border-[#0E2A47]/20 bg-white px-4 py-2 text-center shadow-sm">
                Refill alerts
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
