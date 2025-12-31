/* eslint-disable react/no-unescaped-entities */
"use client"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight } from "lucide-react"

const reason = {
  title: "Commitment to Patient Care",
  blurb:
    "Our approach emphasizes respectful communication, careful assessment, and thoughtful clinical decision-making. We focus on understanding individual needs and providing care with clarity, consistency, and professionalism.",
  bullets: ["Individualized care planning", "Clear and respectful communication", "Comprehensive, evidence-informed approach"],
  image: "/website/hero.png",
  tag: "Your health, our priority",
  sideImage: "/website/header.png",
}

export default function WhyChoose() {
  return (
    <section className="bg-gradient-to-b from-white to-[#f6f8fb] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white shadow-2xl">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#0E2A47]/5 blur-3xl" aria-hidden />
          <div className="absolute -right-16 bottom-10 h-48 w-48 rounded-full bg-[#D9C89E]/30 blur-3xl" aria-hidden />

          <div className="grid gap-0 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="relative min-h-[280px] sm:min-h-[180px] md:min-h-[480px] lg:min-h-[580px] py-4 overflow-hidden">
               <div className="absolute inset-0 scale-105 animate-[float_14s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-700">
                <Image
                  src={reason.image}
                  alt={reason.title}
                  fill
                  className="rounded-xl shadow-lg object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                   loading="lazy"
                />
              </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-xl" />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 rounded-full bg-white/95 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#0E2A47] shadow-lg backdrop-blur-sm">
                {reason.tag}
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-4 p-8 sm:p-10">
              <div className="inline-flex w-max items-center gap-2 rounded-full bg-[#E6E8EB] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0E2A47] transition duration-700 ease-out animate-[fadeInUp_0.8s_ease]">
                Why choose us
              </div>
              <h2 className="text-3xl font-bold text-[#0E2A47] sm:text-4xl animate-[fadeInUp_1s_ease]">
                {reason.title}
              </h2>
              <p className="text-base text-[#4B5563] sm:text-lg animate-[fadeInUp_1.1s_ease]">
                {reason.blurb}
              </p>

             

              <ul className="space-y-3 pt-2">
                {reason.bullets.map((bullet, idx) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-[#0E2A47] animate-[fadeInUp_1s_ease]"
                    style={{ animationDelay: `${0.15 * idx + 1.2}s` }}
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0E2A47]" />
                    <span className="text-base font-semibold">{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-2 animate-[fadeInUp_1.6s_ease]">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0E2A47] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Explore services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0E2A47]/30 px-5 py-3 text-sm font-semibold text-[#0E2A47] transition hover:-translate-y-0.5 hover:border-[#0E2A47]"
                >
                  Talk with us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: scale(1.04) translateY(0);
          }
          50% {
            transform: scale(1.06) translateY(-6px);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
