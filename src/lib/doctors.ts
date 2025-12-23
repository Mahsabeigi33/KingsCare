import "server-only"

const baseUrl = process.env.ADMIN_API_BASE_URL
const doctorsPath = process.env.ADMIN_API_DOCTORS_PATH ?? "/api/doctors"
const authHeaderValue = process.env.ADMIN_API_KEY
export const revalidate = 600

export type AdminDoctor = {
  id: string
  fullName: string
  title?: string | null
  specialty?: string | null
  shortBio?: string | null
  bio?: string | null
  email?: string | null
  phone?: string | null
  yearsExperience?: number | null
  languages?: string[]
  photoUrl?: string | null
  gallery?: string[]
  active: boolean
  featured: boolean
  createdAt?: string
  updatedAt?: string
}

const buildUrl = (path: string = doctorsPath, params?: URLSearchParams) => {
  if (!baseUrl) return null
  try {
    const url = new URL(path, baseUrl)
    if (params) {
      params.forEach((value, key) => url.searchParams.set(key, value))
    }
    return url.toString()
  } catch (error) {
    console.error("Invalid admin doctors URL", error)
    return null
  }
}

const buildHeaders = () => ({
  ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
})

export async function fetchDoctors(options?: { featured?: boolean; active?: boolean }) {
  const params = new URLSearchParams()
  if (options?.featured !== undefined) params.set("featured", String(options.featured))
  if (options?.active !== undefined) params.set("active", String(options.active))

  const url = buildUrl(doctorsPath, params)
  if (!url) throw new Error("Admin API base URL is not configured")

  const response = await fetch(url, {
    headers: buildHeaders(),
    next: { revalidate },
    cache: "force-cache",
  })

  if (!response.ok) {
    console.error("Failed to fetch doctors", response.status)
    throw new Error("Unable to retrieve doctors from admin API")
  }

  const body = await response.json()
  if (!Array.isArray(body)) return []
  const items = body as AdminDoctor[]
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return bTime - aTime
  })
}

export async function fetchDoctorById(id: string) {
  if (!id) return null
  const url = buildUrl(`${doctorsPath}/${id}`)
  if (!url) throw new Error("Admin API base URL is not configured")

  const response = await fetch(url, { headers: buildHeaders() })
  if (response.status === 404) return null
  if (!response.ok) {
    console.error("Failed to fetch doctor by id", response.status)
    throw new Error("Unable to retrieve doctor details from admin API")
  }
  return (await response.json()) as AdminDoctor
}
