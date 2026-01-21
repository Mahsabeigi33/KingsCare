import "server-only"

const baseUrl = process.env.ADMIN_API_BASE_URL
const clinicsPath = process.env.ADMIN_API_SPECIALTY_CLINICS_PATH ?? "/api/specialty-clinics"
const authHeaderValue = process.env.ADMIN_API_KEY

export type SpecialtyClinic = {
  id: string
  title: string
  name: string
  description: string
  image: string
  createdAt?: string
  updatedAt?: string
}

const buildUrl = (path: string = clinicsPath) => {
  if (!baseUrl) {
    return null
  }
  try {
    return new URL(path, baseUrl).toString()
  } catch (error) {
    console.error("Invalid admin specialty clinic URL", error)
    return null
  }
}

const buildHeaders = () => ({
  ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
})

export async function fetchSpecialtyClinics(): Promise<SpecialtyClinic[]> {
  const url = buildUrl()
  if (!url) {
    throw new Error("Admin API base URL is not configured")
  }

  const response = await fetch(url, {
    headers: buildHeaders(),
    cache: "no-store",
  })

  if (!response.ok) {
    console.error("Failed to fetch specialty clinics", response.status)
    throw new Error("Unable to retrieve specialty clinics from admin API")
  }

  const body = await response.json()
  if (!Array.isArray(body)) {
    return []
  }

  return body as SpecialtyClinic[]
}
