import "server-only"

import { z } from "zod"

const baseUrl = process.env.ADMIN_API_BASE_URL
const patientsPath = process.env.ADMIN_API_PATIENTS_PATH ?? "/api/patients"
const authHeaderValue = process.env.ADMIN_API_KEY

export const patientRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(5, "Phone number too short").optional(),
  dob: z.string().optional(),
  notes: z.string().optional(),
})

export type PatientRegistrationInput = z.infer<typeof patientRegistrationSchema>

export type AdminPatient = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  dob: string | null
  notes: string | null
}

export type PatientRegistrationResult =
  | { ok: true; status: number; data?: AdminPatient | null; duplicated?: boolean }
  | { ok: false; status: number; error: string }

export const patientUpdateSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    email: z.union([z.string().email("Valid email required"), z.literal(null)]).optional(),
    phone: z.union([z.string().min(5, "Phone number too short"), z.literal(null)]).optional(),
    dob: z.union([z.string(), z.literal(null)]).optional(),
    notes: z.union([z.string(), z.literal(null)]).optional(),
  })
  .refine(
    (values) => Object.keys(values).length > 0,
    "At least one field must be provided",
  )

const buildAdminUrl = (path: string = patientsPath) => {
  if (!baseUrl) {
    return null
  }

  try {
    return new URL(path, baseUrl).toString()
  } catch (error) {
    console.error("Invalid admin API configuration", error)
    return null
  }
}

export async function registerPatientWithAdmin(
  input: PatientRegistrationInput,
): Promise<PatientRegistrationResult> {
  const parsed = patientRegistrationSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: parsed.error.issues.map((issue) => issue.message).join(", "),
    }
  }

  const url = buildAdminUrl()
  if (!url) {
    return {
      ok: false,
      status: 500,
      error: "Admin API base URL is not configured",
    }
  }

  let dobIso: string | null = null
  if (parsed.data.dob) {
    const parsedDate = new Date(parsed.data.dob)
    if (!Number.isNaN(parsedDate.getTime())) {
      dobIso = parsedDate.toISOString()
    }
  }

  const payload = {
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    dob: dobIso,
    notes: parsed.data.notes ?? null,
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
      },
      body: JSON.stringify(payload),
    })

    const responseBody = (await safeReadJson(response)) as AdminPatient | null

    if (response.status === 409) {
      return {
        ok: true,
        duplicated: true,
        status: response.status,
        data: responseBody,
      }
    }

    if (!response.ok) {
      const message =
        typeof (responseBody as { error?: string } | null)?.error === "string"
          ? (responseBody as { error?: string }).error!
          : `Admin API returned ${response.status}`

      return { ok: false, status: response.status, error: message }
    }

    return {
      ok: true,
      status: response.status,
      data: responseBody,
    }
  } catch (error) {
    console.error("Failed to register patient with admin API", error)
    return { ok: false, status: 502, error: "Failed to reach admin API" }
  }
}

export async function getPatientByEmail(email: string): Promise<AdminPatient | null> {
  const url = buildAdminUrl(`${patientsPath}?email=${encodeURIComponent(email)}`)
  if (!url) {
    return null
  }

  try {
    const response = await fetch(url, {
      headers: {
        ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
      },
    })

    if (!response.ok) {
      console.error("Failed to look up patient by email", response.status)
      return null
    }

    const body = (await safeReadJson(response)) as AdminPatient | null
    return body
  } catch (error) {
    console.error("Error retrieving patient by email", error)
    return null
  }
}

export async function getPatientById(id: string): Promise<AdminPatient | null> {
  if (!id) return null

  const url = buildAdminUrl(`${patientsPath}/${encodeURIComponent(id)}`)
  if (!url) {
    return null
  }

  try {
    const response = await fetch(url, {
      headers: {
        ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
      },
    })

    if (!response.ok) {
      console.error("Failed to look up patient by id", response.status)
      return null
    }

    const body = (await safeReadJson(response)) as AdminPatient | null
    return body
  } catch (error) {
    console.error("Error retrieving patient by id", error)
    return null
  }
}

export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>

export async function updatePatientById(
  id: string,
  input: PatientUpdateInput,
): Promise<AdminPatient | null> {
  if (!id) {
    throw new Error("Patient id is required for updates")
  }

  const url = buildAdminUrl(`${patientsPath}/${encodeURIComponent(id)}`)
  if (!url) {
    throw new Error("Admin API base URL is not configured")
  }

  const payload: Record<string, unknown> = {}

  if (typeof input.firstName === "string") {
    payload.firstName = input.firstName
  }
  if (typeof input.lastName === "string") {
    payload.lastName = input.lastName
  }
  if (typeof input.email === "string" || input.email === null) {
    payload.email = input.email
  }
  if (typeof input.phone === "string" || input.phone === null) {
    payload.phone = input.phone
  }
  if (typeof input.notes === "string" || input.notes === null) {
    payload.notes = input.notes
  }

  if (typeof input.dob === "string" || input.dob === null) {
    if (typeof input.dob === "string") {
      const parsedDate = new Date(input.dob)
      payload.dob = Number.isNaN(parsedDate.getTime())
        ? null
        : parsedDate.toISOString()
    } else {
      payload.dob = null
    }
  }

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const body = (await safeReadJson(response)) as AdminPatient | null

  if (!response.ok) {
    const message =
      typeof (body as { error?: string } | null)?.error === "string"
        ? (body as { error?: string }).error!
        : `Admin API returned ${response.status}`

    const error = new Error(message)
    ;(error as { status?: number }).status = response.status
    throw error
  }

  return body
}

async function safeReadJson(response: Response) {
  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    return null
  }

  try {
    return await response.json()
  } catch (error) {
    console.error("Unable to parse admin API response JSON", error)
    return null
  }
}
