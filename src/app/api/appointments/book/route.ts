import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { createPublicAppointment } from "@/lib/appointments"
import { authOptions } from "@/lib/auth/options"

const payloadSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  datetime: z.string().min(1, "Appointment time is required"),
  notes: z.string().trim().max(500).optional(),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch (error) {
    console.error("Invalid JSON body for appointment booking", error)
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = payloadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const appointmentDate = new Date(parsed.data.datetime)
  if (Number.isNaN(appointmentDate.getTime())) {
    return NextResponse.json({ error: "Invalid appointment date." }, { status: 400 })
  }

  try {
    const result = await createPublicAppointment({
      patientId: session.user.patientId,
      patientName: session.user.name ?? undefined,
      serviceId: parsed.data.serviceId,
      date: appointmentDate.toISOString(),
      notes: parsed.data.notes?.trim() || undefined,
    })

    return NextResponse.json({ ok: true, appointment: result }, { status: 201 })
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500
    const message =
      status === 409
        ? "That time slot was just booked. Please pick another time."
        : "Unable to book appointment right now."

    console.error("POST /api/appointments/book", error)
    return NextResponse.json({ error: message }, { status })
  }
}
