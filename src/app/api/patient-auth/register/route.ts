import { NextResponse } from "next/server"
import { z } from "zod"

import { patientRegistrationSchema } from "@/lib/patients/register"
import { createUser, DuplicateUserError } from "@/lib/user"

const payloadSchema = patientRegistrationSchema
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(8, "Password confirmation must be at least 8 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export async function POST(request: Request) {
  let json: unknown

  try {
    json = await request.json()
  } catch (error) {
    console.error("Invalid JSON body for patient auth register", error)
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = payloadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    )
  }

  const data = parsed.data

  try {
    const fullName = `${data.firstName} ${data.lastName}`.trim()
    const account = await createUser({
      name: fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
    })

    return NextResponse.json({ ok: true, account }, { status: 201 })
  } catch (error) {
    if (error instanceof DuplicateUserError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    console.error("Unable to create patient account", error)
    return NextResponse.json({ error: "Unable to create patient account." }, { status: 500 })
  }
}
