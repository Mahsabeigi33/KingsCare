import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";

export const metadata: Metadata = {
  title: "Specialty Clinic | Kings Care Medical Clinic",
  description:
    "Explore Kings Care Medical Clinic specialty services including ENT care and psychotherapy support.",
};

const SPECIALTIES = [
  {
    id: "ent",
    title: "ENT Clinic",
    subtitle: "Nose, and Throat Care",
    description:
      "Comprehensive ENT assessments for sinus concerns, allergies, throat irritation, and voice changes. Our team coordinates testing, imaging, and referrals when needed.",
    highlights: [
      "Chronic sinus and nasal congestion",
      "Sore throat and voice evaluation",
      "Allergy and breathing concerns",
    ],
    image: "/website/ENT.png",
     cta: { label: "Contact Us", href: "/contact" },
  },
  // {
  //   id: "psychotherapy",
  //   title: "Psychotherapy",
  //   subtitle: "Mental Health & Wellness",
  //   description:
  //     "Confidential support for stress, anxiety, mood changes, and life transitions. Sessions focus on practical tools, coping strategies, and long-term wellbeing.",
  //   highlights: [
  //     "Stress, burnout, and anxiety support",
  //     "Depression and mood management",
  //     "Grief, life transitions, and relationships",
  //     "Goal-setting and coping strategies",
  //   ],
  //   image: "/website/psychotherapist.png",
  //   cta: { label: "Contact Us", href: "/contact" },
  // },
];

export default function SpecialtyClinicPage() {
  return (
    <div className="bg-slate-50">
      <Nav />

      <section className="relative  w-full overflow-hidden hidden">
        <div className="absolute inset-0">
          <Image
            src="/website/setethoscope.png"
            alt="Clinic reception background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E2A47]/95 via-[#0E2A47]/75 to-transparent" />
        </div>

        <div className="max-w-6xl relative mx-auto flex min-h-[40vh]  flex-col justify-center px-4  text-white mt-12">
         
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Specialty Clinic</h1>
          <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
            Focused care for ENT and mental wellness, delivered with the same Kings Care compassion and attention to detail.
          </p>
         
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10">
          {SPECIALTIES.map((specialty, index) => (
            <div
              key={specialty.id}
              className={`grid gap-8 rounded-3xl border border-white/10 bg-white p-6 shadow-xl sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${
                index % 2 === 1 ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <Image
                  src={specialty.image}
                  alt={`${specialty.title} care`}
                  width={600}
                  height={420}
                  className="h-full w-full rounded-3xl object-cover"
                />
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0E2A47]/70">
                  {specialty.subtitle}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#0E2A47]">{specialty.title}</h2>
                <p className="mt-4 text-base text-slate-600">
                  {specialty.description}
                </p>
                <ul className="mt-5 grid gap-2 text-sm text-slate-600">
                  {specialty.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#D9C89E]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={specialty.cta.href}
                    className="inline-flex items-center justify-center rounded-full bg-[#0E2A47] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1B3E5C]"
                  >
                    {specialty.cta.label}
                  </Link>
                 
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <Emergency />
    </div>
  );
}
