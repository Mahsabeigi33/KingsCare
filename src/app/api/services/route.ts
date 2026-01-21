import { NextResponse } from "next/server"

import { buildServiceSlug, fetchServices } from "@/lib/services"

export async function GET() {
  try {
    const services = await fetchServices()
    const items = services
      .filter((service) => service.active && !service.parent)
      .map((service) => ({
        label: service.parent ? `${service.parent.name} - ${service.name}` : service.name,
        href: `/services/${buildServiceSlug(service)}`,
      }))
    return NextResponse.json(items)
  } catch (error) {
    console.error("GET /api/services", error)
    return NextResponse.json([])
  }
}
