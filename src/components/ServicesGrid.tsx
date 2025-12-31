import type { ReactNode } from "react"

import { Footprints, Plane, Stethoscope, Syringe } from "lucide-react"

import ServiceCard from "./ServiceCard"

export type ServicesListItem = {
  title: string
  text: string
  href: string
  icon?: ReactNode
  image?: string | null
}

const fallbackServices: ServicesListItem[] = [
  {
    title: "Prescribing ",
    text: "Assessments, renewals, and tailored care.",
    href: "/services/prescribing",
    icon: <Stethoscope className="h-6 w-6" />,
    image: "/website/Pharmacists.jpg",
  },
  {
    title: "Travel Clinic",
    text: "Vaccines & itinerary-specific advice.",
    href: "/services/travel-clinic",
    icon: <Plane className="h-6 w-6" />,
    image: "/website/travel-icon.jpg",
  },
  {
    title: "Injections",
    text: "Flu shots, B12, immunizations, and more.",
    href: "/services/injections",
    icon: <Syringe className="h-6 w-6" />,
    image: "/website/injection.png",
  },
  {
    title: "Compression Stocking",
    text: "Expert fitting for comfort & circulation support.",
    href: "/services/compression",
    icon: <Footprints className="h-6 w-6" />,
    image: "/website/botox.png",
  },
]

export default function ServicesGrid({ services }: { services: ServicesListItem[] }) {
  const items = services.length > 0 ? services : fallbackServices

  return (
    <section className="bg-white/50 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 rounded-2xl shadow-sm my-12">
      <div className="mx-auto max-w-6xl">
      <h2 className="text-3xl font-bold text-center text-[#0E2A47]">
        Our Services
      </h2>
      <p className="mt-2 text-center text-gray-600">
        Comprehensive care tailored to your needs.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {items.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
      </div>
    </section>
  )
}
