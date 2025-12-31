import "server-only"

const baseUrl = process.env.ADMIN_API_BASE_URL
const appointmentsPath = process.env.ADMIN_API_APPOINTMENTS_PATH ?? "/api/appointments"
const publicAppointmentsPath = process.env.ADMIN_API_PUBLIC_APPOINTMENTS_PATH ?? "/api/public/appointments"
const authHeaderValue = process.env.ADMIN_API_KEY
export const revalidate = 900;
export type AdminAppointment = {
  id: string
  date: string
  status: "BOOKED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  patientId?: string | null
  serviceId: string
  staffId?: string | null
  notes?: string | null
  customPatientName?: string | null
  patient?: {
    id: string
    firstName: string
    lastName: string
  } | null
  service?: {
    name: string | null
  } | null
  staff?: {
    name: string | null
  } | null
}

export type CreatePublicAppointmentInput = {
  patientId?: string
  patientName?: string
  serviceId?: string
  doctorId?: string
  date: string
  notes?: string
  healthNumber?: string
  phone?: string
  birthDate?: string
}

const buildUrl = (path: string) => {
  if (!baseUrl) {
    return null
  }

  try {
    return new URL(path, baseUrl).toString()
  } catch (error) {
    console.error("Invalid admin appointments URL", error)
    return null
  }
}

const buildHeaders = () => ({
  "Content-Type": "application/json",
  ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
})

export async function fetchAppointments(input: {
  from?: Date
  to?: Date
  status?: AdminAppointment["status"]
  patientId?: string
}): Promise<AdminAppointment[]> {
  const urlValue = buildUrl(appointmentsPath)
  if (!urlValue) {
    throw new Error("Admin API base URL is not configured")
  }

  const url = new URL(urlValue)
  if (input.from) url.searchParams.set("from", input.from.toISOString())
  if (input.to) url.searchParams.set("to", input.to.toISOString())
  if (input.status) url.searchParams.set("status", input.status)
  if (input.patientId) url.searchParams.set("patientId", input.patientId)

  const response = await fetch(url.toString(), {
    headers: buildHeaders(),
    next: { revalidate },         // 👈 important
    cache: "force-cache", 
  })

  if (!response.ok) {
    console.error("Failed to fetch appointments", response.status)
    throw new Error("Unable to retrieve appointments from admin API")
  }

  const body = await response.json()
  if (!Array.isArray(body)) {
    return []
  }

  return body as AdminAppointment[]
}

export async function createPublicAppointment(payload: CreatePublicAppointmentInput) {
  const url = buildUrl(publicAppointmentsPath)
  if (!url) {
    throw new Error("Admin API base URL is not configured")
  }

  const response = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const message = await safeReadError(response)
    const error = new Error(message ?? "Unable to create appointment")
    ;(error as { status?: number }).status = response.status
    throw error
  }

  return response.json()
}

async function safeReadError(response: Response) {
  const type = response.headers.get("content-type")
  if (!type || !type.includes("application/json")) {
    return null
  }

  try {
    const body = (await response.json()) as { error?: string } | null
    return body?.error ?? null
  } catch (error) {
    console.error("Unable to parse appointment error response", error)
    return null
  }
}
