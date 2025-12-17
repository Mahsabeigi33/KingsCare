import "server-only"

const baseUrl = process.env.ADMIN_API_BASE_URL
const accountsPath = process.env.ADMIN_API_PATIENT_ACCOUNTS_PATH ?? "/api/patient-accounts"
const authHeaderValue = process.env.ADMIN_API_KEY

type PatientSummary = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
}

export type PatientAccountRecord = {
  id: string
  patientId: string
  email: string
  passwordHash: string
  patient?: PatientSummary | null
}

const buildAdminUrl = (path: string = accountsPath) => {
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

export async function createPatientAccount(input: {
  patientId: string
  email: string
  passwordHash: string
}) {
  const url = buildAdminUrl()
  if (!url) {
    throw new Error("Admin API base URL is not configured")
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
    },
    body: JSON.stringify(input),
  })

  const body = await safeReadJson(response)
  if (!response.ok) {
    const message =
      typeof body?.error === "string" ? body.error : `Admin API returned ${response.status}`
    const error = new Error(message)
    ;(error as { status?: number }).status = response.status
    throw error
  }

  return body as PatientAccountRecord
}

export async function getPatientAccountByEmail(email: string) {
  const url = buildAdminUrl(`${accountsPath}?email=${encodeURIComponent(email)}`)
  if (!url) {
    return null
  }

  const response = await fetch(url, {
    headers: {
      ...(authHeaderValue ? { Authorization: `Bearer ${authHeaderValue}` } : {}),
    },
  })

  if (!response.ok) {
    console.error("Unable to fetch patient account", response.status)
    return null
  }

  return (await safeReadJson(response)) as PatientAccountRecord | null
}

async function safeReadJson(response: Response) {
  const contentType = response.headers.get("content-type")
  if (!contentType || !contentType.includes("application/json")) {
    return null
  }

  try {
    return await response.json()
  } catch (error) {
    console.error("Unable to parse admin API account response JSON", error)
    return null
  }
}
