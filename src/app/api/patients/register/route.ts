import { NextResponse } from "next/server"

import {
  patientRegistrationSchema,
  registerPatientWithAdmin,
} from "@/lib/patients/register"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    console.error("Invalid JSON payload for patient registration", error)
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = patientRegistrationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  const result = await registerPatientWithAdmin(parsed.data)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  return NextResponse.json(
    {
      ok: true,
      duplicated: result.duplicated ?? false,
      data: result.data,
    },
    { status: result.duplicated ? 200 : result.status },
  )
}
