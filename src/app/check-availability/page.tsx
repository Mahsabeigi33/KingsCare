import type { Metadata } from "next"

import { AvailabilityExplorer } from "@/components/appointments/AvailabilityExplorer"
import { fetchServices, type AdminService } from "@/lib/services"
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";

export const metadata: Metadata = {
  title: "Check Appointment Availability | Kings Care Medical Clinic",
  description:
    "Preview upcoming appointment times at Kings Care Medical Clinic without logging in. Choose a service and browse open slots across the next few weeks.",
}

export default async function CheckAvailabilityPage() {
  let services: AdminService[] = []
  try {
    services = await fetchServices()
  } catch (error) {
    console.error("Unable to load services for availability preview", error)
  }

  const activeServices = services.filter((service) => service.active)
  const simplified = activeServices.map((service) => ({
    id: service.id,
    name: service.name,
    durationMin: service.durationMin,
    description: service.description ?? null,
    priceCents: service.priceCents,
  }))

  return (
    <main className="bg-slate-50 py-16 sm:py-20">
      <Nav/>
      <div className="mx-auto max-w-6xl px-4">
        <AvailabilityExplorer services={simplified} />
      </div>
      <Footer/>
      <Emergency/>
    </main>
  )
}
