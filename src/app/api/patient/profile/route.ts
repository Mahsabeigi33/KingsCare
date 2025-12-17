import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth/options"
import {
  patientUpdateSchema,
  updatePatientById,
} from "@/lib/patients/register"

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  const patientId = (session?.user as { patientId?: string | null })?.patientId

  if (!patientId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body",errorDetail: (error as Error).message },
      { status: 400 },
    )
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 },
    )
  }

  const raw = body as Record<string, unknown>
  const sanitized: Record<string, unknown> = {}

  if (typeof raw.firstName === "string" && raw.firstName.trim()) {
    sanitized.firstName = raw.firstName.trim()
  }

  if (typeof raw.lastName === "string" && raw.lastName.trim()) {
    sanitized.lastName = raw.lastName.trim()
  }

  if ("email" in raw) {
    if (typeof raw.email === "string") {
      const trimmed = raw.email.trim()
      sanitized.email = trimmed.length > 0 ? trimmed : null
    } else if (raw.email === null) {
      sanitized.email = null
    }
  }

  if ("phone" in raw) {
    if (typeof raw.phone === "string") {
      const trimmed = raw.phone.trim()
      sanitized.phone = trimmed.length > 0 ? trimmed : null
    } else if (raw.phone === null) {
      sanitized.phone = null
    }
  }

  if ("notes" in raw) {
    if (typeof raw.notes === "string") {
      const trimmed = raw.notes.trim()
      sanitized.notes = trimmed.length > 0 ? trimmed : null
    } else if (raw.notes === null) {
      sanitized.notes = null
    }
  }

  if ("dob" in raw) {
    if (typeof raw.dob === "string") {
      const trimmed = raw.dob.trim()
      sanitized.dob = trimmed.length > 0 ? trimmed : null
    } else if (raw.dob === null) {
      sanitized.dob = null
    }
  }

  const parsed = patientUpdateSchema.safeParse(sanitized)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues
          .map((issue) => issue.message)
          .join(", "),
      },
      { status: 400 },
    )
  }

  try {
    const updated = await updatePatientById(patientId, parsed.data)
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    const status =
      typeof (error as { status?: number })?.status === "number"
        ? (error as { status?: number }).status
        : 500

    return NextResponse.json(
      {
        error:
          status === 401
            ? "Unauthorized"
            : "Unable to update patient profile right now.",
      },
      { status },
    )
  }
}
