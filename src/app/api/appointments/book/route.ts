import { NextResponse } from "next/server"
import { z } from "zod"

import { createPublicAppointment } from "@/lib/appointments"

const payloadSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  serviceId: z.string().min(1, "Service is required"),
  datetime: z.string().min(1, "Appointment time is required"),
  fullName: z.string().trim().min(1, "Full name is required"),
  healthNumber: z.string().trim().min(4, "Health Number is required"),
  phone: z.string().trim().min(7, "Phone number is required"),
  birthDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Birth Date must be formatted as YYYY-MM-DD"),
  notes: z.string().trim().max(500).optional(),
})

export async function POST(request: Request) {
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
      doctorId: parsed.data.doctorId,
      patientName: parsed.data.fullName,
      serviceId: parsed.data.serviceId,
      date: appointmentDate.toISOString(),
      healthNumber: parsed.data.healthNumber,
      phone: parsed.data.phone,
      birthDate: parsed.data.birthDate,
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
