import "server-only"

import { toSlug } from "./slug"

const baseUrl = process.env.ADMIN_API_BASE_URL
const servicesPath = process.env.ADMIN_API_SERVICES_PATH ?? "/api/services"
const authHeaderValue = process.env.ADMIN_API_KEY
export const revalidate = 600;
export type AdminService = {
  id: string
  name: string
  durationMin: number
  priceCents: number
  description?: string | null
  shortDescription?: string | null
  images?: string[]
  active: boolean
  parent?: { id: string; name: string } | null
  subServices?: { id: string; name: string; active: boolean; images?: string[]; shortDescription?: string | null }[]
  createdAt?: string
  updatedAt?: string
}

const buildUrl = (path: string = servicesPath) => {
  if (!baseUrl) {
    return null
  }

  try {
    return new URL(path, baseUrl).toString()
  } catch (error) {
    console.error("Invalid admin services URL", error)
    return null
  }
}

const buildHeaders = () => ({
  ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
})

export function buildServiceSlug(service: Pick<AdminService, "id" | "name">) {
  const base = toSlug(service.name)
  return `${base}-${service.id}`
}

export function serviceIdFromSlug(slug: string) {
  if (!slug) return null
  const parts = slug.split("-")
  if (parts.length === 0) return null
  const candidate = parts[parts.length - 1]?.trim()
  return candidate || null
}

export async function fetchServices(): Promise<AdminService[]> {
  const url = buildUrl()
  if (!url) {
    throw new Error("Admin API base URL is not configured")
  }

  const response = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate },      
    cache: "force-cache", 
  })

  if (!response.ok) {
    console.error("Failed to fetch services", response.status)
    throw new Error("Unable to retrieve services from admin API")
  }

  const body = await response.json()
  if (!Array.isArray(body)) {
    return []
  }

  const list = body as AdminService[]

  // Sort by createdAt (desc), fallback to updatedAt, then name
  const stamp = (s?: string) => (s ? Date.parse(s) || 0 : 0)
  const sorted = [...list].sort((b, a) => {
    const aTime = stamp(a.createdAt) || stamp(a.updatedAt)
    const bTime = stamp(b.createdAt) || stamp(b.updatedAt)
    if (aTime !== bTime) return bTime - aTime
    // Stable fallback by name to avoid jitter when timestamps equal/missing
    return (b.name || "").localeCompare(a.name || "")
  })

  return sorted
}

export async function fetchServiceById(id: string): Promise<AdminService | null> {
  if (!id) return null
  const url = buildUrl(`${servicesPath}/${id}`)
  if (!url) {
    throw new Error("Admin API base URL is not configured")
  }

  const response = await fetch(url, {
    headers: buildHeaders(),
    
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    console.error("Failed to fetch service by id", response.status)
    throw new Error("Unable to retrieve service details from admin API")
  }

  return (await response.json()) as AdminService
}

export async function fetchServiceBySlug(slug: string) {
  const id = serviceIdFromSlug(slug)
  if (!id) {
    return null
  }
  return fetchServiceById(id)
}
