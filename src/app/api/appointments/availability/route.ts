import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0
import { z } from "zod"

import { fetchAppointments, type AdminAppointment } from "@/lib/appointments"
import { fetchServices, type AdminService } from "@/lib/services"

const querySchema = z
  .object({
    serviceId: z.string().min(1, "serviceId is required"),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be formatted as YYYY-MM-DD")
      .optional(),
    from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "from must be formatted as YYYY-MM-DD")
      .optional(),
    to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "to must be formatted as YYYY-MM-DD")
      .optional(),
  })
  .refine(
    (value) => Boolean(value.date) || (Boolean(value.from) && Boolean(value.to)),
    "Provide a single date or a date range using from/to",
  )

const CLINIC_OPEN_MINUTES = 9 * 60
const CLINIC_CLOSE_MINUTES = 18 * 60
const SLOT_INTERVAL_MINUTES = 15
const SAME_DAY_LEAD_MINUTES = 60
const MAX_RANGE_DAYS = 60

type DayAvailability = {
  totalSlots: number
  availableSlots: string[]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()))

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { serviceId, date, from, to } = parsed.data
  const rangeStartRaw = from ?? date
  const rangeEndRaw = to ?? date

  if (!rangeStartRaw || !rangeEndRaw) {
    return NextResponse.json({ error: "Unable to determine date range." }, { status: 400 })
  }

  const rangeStart = parseDateOnly(rangeStartRaw)
  const rangeEnd = parseDateOnly(rangeEndRaw)

  if (!rangeStart || !rangeEnd || rangeStart > rangeEnd) {
    return NextResponse.json({ error: "Invalid date range." }, { status: 400 })
  }

  const totalRangeDays = differenceInDays(rangeStart, rangeEnd)
  if (totalRangeDays > MAX_RANGE_DAYS) {
    return NextResponse.json({ error: `Requested range exceeds ${MAX_RANGE_DAYS} days.` }, { status: 400 })
  }

  try {
    const [services, appointments] = await Promise.all([
      fetchServices(),
      fetchAppointments({
        from: startOfDay(rangeStart),
        to: endOfDay(rangeEnd),
      }),
    ])

    const serviceMap = new Map<string, AdminService>()
    services.forEach((service) => serviceMap.set(service.id, service))

    const selectedService = serviceMap.get(serviceId)
    if (!selectedService) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 })
    }

    const appointmentsByDate = groupAppointmentsByDay(appointments)
    const availabilityByDay: Record<string, { totalSlots: number; availableSlots: number }> = {}
    let slots: string[] | undefined

    const today = new Date()
    for (let day = new Date(rangeStart); day <= rangeEnd; day = addDays(day, 1)) {
      const key = formatDateKey(day)
      const dayAppointments = appointmentsByDate.get(key) ?? []
      const dayAvailability = buildDayAvailability(
        day,
        selectedService,
        dayAppointments,
        serviceMap,
        today,
      )

      availabilityByDay[key] = {
        totalSlots: dayAvailability.totalSlots,
        availableSlots: dayAvailability.availableSlots.length,
      }

      if (date && key === date) {
        slots = dayAvailability.availableSlots
      }
    }

    if (date && !slots) {
      // Ensure a list is present even if the loop didn't set it (e.g. date outside range)
      const targetDay = parseDateOnly(date)
      if (targetDay) {
        const dayAppointments = appointmentsByDate.get(date) ?? []
        slots = buildDayAvailability(targetDay, selectedService, dayAppointments, serviceMap, today).availableSlots
      } else {
        slots = []
      }
    }

    return NextResponse.json({
      availability: availabilityByDay,
      slots: slots ?? [],
      service: {
        id: selectedService.id,
        durationMin: selectedService.durationMin,
        name: selectedService.name,
      },
    })
  } catch (error) {
    console.error("GET /api/appointments/availability", error)
    return NextResponse.json({ error: "Unable to determine availability." }, { status: 500 })
  }
}

function buildDayAvailability(
  day: Date,
  selectedService: AdminService,
  appointments: AdminAppointment[],
  serviceMap: Map<string, AdminService>,
  now: Date,
): DayAvailability {
  const dayStart = startOfDay(day)
  const close = addMinutes(dayStart, CLINIC_CLOSE_MINUTES)

  const available: string[] = []
  let totalSlots = 0

  for (
    let offset = CLINIC_OPEN_MINUTES;
    offset + selectedService.durationMin <= CLINIC_CLOSE_MINUTES;
    offset += SLOT_INTERVAL_MINUTES
  ) {
    const slotStart = addMinutes(dayStart, offset)
    const slotEnd = addMinutes(slotStart, selectedService.durationMin)

    if (slotEnd > close) {
      continue
    }

    totalSlots += 1

    if (!isSlotEligible(slotStart, now)) {
      continue
    }

    const hasConflict = appointments.some((appointment) =>
      overlaps(slotStart, slotEnd, appointment, serviceMap, selectedService.durationMin),
    )

    if (!hasConflict) {
      available.push(slotStart.toISOString())
    }
  }

  return { totalSlots, availableSlots: available }
}

function overlaps(
  slotStart: Date,
  slotEnd: Date,
  appointment: AdminAppointment,
  serviceMap: Map<string, AdminService>,
  fallbackDuration: number,
) {
  if (appointment.status === "CANCELLED" || appointment.status === "NO_SHOW") {
    return false
  }

  const appointmentStart = new Date(appointment.date)
  const serviceDuration = serviceMap.get(appointment.serviceId)?.durationMin ?? fallbackDuration
  const appointmentEnd = addMinutes(appointmentStart, serviceDuration)

  return appointmentStart < slotEnd && appointmentEnd > slotStart
}

function groupAppointmentsByDay(appointments: AdminAppointment[]) {
  const map = new Map<string, AdminAppointment[]>()
  appointments.forEach((appointment) => {
    const key = formatDateKey(new Date(appointment.date))
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push(appointment)
  })
  return map
}

function parseDateOnly(value: string | undefined) {
  if (!value) return null
  const [year, month, day] = value.split("-").map((part) => Number.parseInt(part, 10))
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null
  }

  return new Date(year, month - 1, day)
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60 * 1000)
}

function addDays(date: Date, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

function differenceInDays(start: Date, end: Date) {
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  const diff = Math.abs(endUtc - startUtc)
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}

function isSlotEligible(slotStart: Date, now: Date) {
  const threshold = new Date(now.getTime() + SAME_DAY_LEAD_MINUTES * 60 * 1000)
  return slotStart >= threshold
}
