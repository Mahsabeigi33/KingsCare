import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { AppointmentHistory } from "@/components/appointments/AppointmentHistory"
import { EditPatientDetails } from "@/components/patient/EditPatientDetails"
import { authOptions } from "@/lib/auth/options"
import { fetchAppointments, type AdminAppointment } from "@/lib/appointments"
import { getPatientById } from "@/lib/patients/register"
import Emergency from "@/components/Emergency"
const nextVisitDateFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "short",
  month: "long",
  day: "numeric",
})

const nextVisitTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  hour: "numeric",
  minute: "2-digit",
})

const dobFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export const metadata: Metadata = {
  title: "Patient Profile | Kings Care Medical Clinic",
  description:
    "Review your personal details, upcoming visits, and appointment history with Kings Care Medical Clinic.",
}

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/login?next=${encodeURIComponent("/user/profile")}`)
  }

  const user = session.user as {
    name?: string | null
    email?: string | null
    firstName?: string | null
    lastName?: string | null
    patientId?: string | null
  }

  const patientId = user.patientId ?? null
  const patientRecord = patientId ? await getPatientById(patientId) : null

  const displayFirstName =
    patientRecord?.firstName?.trim() ||
    user.firstName?.trim() ||
    user.name?.split(" ")?.[0] ||
    "there"

  const displayFullName =
    [
      patientRecord?.firstName?.trim() || user.firstName?.trim(),
      patientRecord?.lastName?.trim() || user.lastName?.trim(),
    ]
      .filter(Boolean)
      .join(" ")
      .trim() || user.name || "Patient"

  const patientEmail = patientRecord?.email?.trim() || user.email?.trim() || ""
  const contactEmail = patientEmail || "Not added yet"
  const patientPhone = patientRecord?.phone?.trim() || ""
  const contactPhone = patientPhone || "Not added yet"
  const dateOfBirthLabel = patientRecord?.dob
    ? formatDob(patientRecord.dob)
    : "Not provided"

  const notesCopy = patientRecord?.notes?.trim()

  let appointmentHistory: AdminAppointment[] = []
  if (patientId) {
    try {
      appointmentHistory = await fetchAppointments({ patientId })
    } catch (error) {
      console.error("Unable to load patient appointments", error)
    }
  }

  const upcomingAppointments = deriveUpcomingAppointments(appointmentHistory)
  const previousAppointments = derivePreviousAppointments(appointmentHistory)

  const nextAppointment = upcomingAppointments[0] ?? null
  const lastVisitAppointment =
    previousAppointments.find((appointment) => appointment.status === "COMPLETED") ??
    previousAppointments[0] ??
    null

  const completedVisits = appointmentHistory.filter(
    (appointment) => appointment.status === "COMPLETED",
  ).length
  const cancellations = appointmentHistory.filter((appointment) =>
    ["CANCELLED", "NO_SHOW"].includes(appointment.status),
  ).length
  const totalVisits = appointmentHistory.length

  const lastVisitLabel = lastVisitAppointment
    ? formatNextVisitLabel(lastVisitAppointment.date)
    : null

  const editableValues = {
    firstName: patientRecord?.firstName?.trim() || user.firstName?.trim() || "",
    lastName: patientRecord?.lastName?.trim() || user.lastName?.trim() || "",
    email: patientEmail,
    phone: patientPhone,
    dob: toDateInputValue(patientRecord?.dob ?? null),
    notes: patientRecord?.notes?.trim() || "",
  }

  return (
    <div className="space-y-12">
      <section className="space-y-8 rounded-3xl border border-white/10 bg-slate-600/60 p-6 text-slate-200 backdrop-blur lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">
              Patient profile
            </p>
            <h1 className="text-3xl font-semibold text-white lg:text-4xl">
              Welcome back, {displayFirstName}.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
              Keep an eye on your care plan, confirm your details, and review every
              appointment you have booked with Kings Care Medical Clinic. We keep everything in one
              place so you can focus on feeling your best.
            </p>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
            <ProfileStat
              label="Next visit"
              value={
                nextAppointment
                  ? formatNextVisitLabel(nextAppointment.date)
                  : "Not scheduled"
              }
              hint={
                nextAppointment?.service?.name
                  ? nextAppointment.service.name
                  : nextAppointment
                  ? "We'll remind you 24 hours ahead."
                    : "Book your next check-in to stay on track."
              }
            />
            <ProfileStat
              label="Completed visits"
              value={completedVisits.toString()}
              hint={
                totalVisits > 0
                  ? lastVisitLabel
                    ? `Last visit ${lastVisitLabel}`
                    : `${totalVisits} appointments recorded`
                  : "Your visit history will appear here once you book."
              }
            />
            <ProfileStat
              label="Upcoming bookings"
              value={upcomingAppointments.length.toString()}
              hint={
                upcomingAppointments.length > 0 && nextAppointment
                  ? `Next with ${nextAppointment.service?.name ?? "our care team"}`
                  : "No future appointments yet."
              }
            />
            <ProfileStat
              label="Reschedules & cancellations"
              value={cancellations.toString()}
              hint="Need to make a change? We're here to help."
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Need to book a follow-up?
            </h2>
            <p className="text-sm text-slate-300">
              Reserve a time with a clinician in minutes. You can always adjust your
              booking if plans change.
            </p>
          </div>
          <Link
            href="/appointments"
            className="inline-flex h-11 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/20 px-6 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:border-cyan-300/60 hover:bg-cyan-500/30"
          >
            Book an appointment
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-800/60 p-6 text-sm text-slate-200 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-white">
              Personal details
            </h2>
            {patientId ? (
              <EditPatientDetails  initialValues={editableValues} />
            ) : null}
          </div>
          <dl className="space-y-3">
            <DetailRow term="Full name" detail={displayFullName} />
            <DetailRow term="Email" detail={contactEmail} />
            <DetailRow term="Phone" detail={contactPhone} />
            <DetailRow term="Date of birth" detail={dateOfBirthLabel} />
          </dl>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-600/60 p-6 text-sm text-slate-200 backdrop-blur">
          <h2 className="text-base font-semibold text-white">Care notes</h2>
          <p className="leading-relaxed text-slate-300">
            {notesCopy ??
              "You have no care notes recorded. Any important information from your visits will appear here for your reference."}
          </p>
        </div>

        

      </section>

      {patientId ? (
        <AppointmentHistory appointments={appointmentHistory} />
      ) : (
        <section className="rounded-3xl border border-white/10 bg-slate-700/60 p-6 text-sm text-slate-300 backdrop-blur lg:p-8">
          <h2 className="text-lg font-semibold text-white">Appointment history</h2>
          <p className="mt-2">
            We we are not able to locate your patient record. Reach out to our team so
            we can connect your account and surface your visit history.
          </p>
        </section>
      )}

     <Emergency />
    </div>
  )
}

function deriveUpcomingAppointments(appointments: AdminAppointment[]) {
  const now = Date.now()
  return appointments
    .filter((appointment) => {
      if (appointment.status !== "BOOKED") return false
      const time = new Date(appointment.date).getTime()
      return !Number.isNaN(time) && time >= now
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function derivePreviousAppointments(appointments: AdminAppointment[]) {
  const now = Date.now()
  return appointments
    .filter((appointment) => {
      const time = new Date(appointment.date).getTime()
      if (Number.isNaN(time)) {
        return false
      }
      const isPast = time < now
      return isPast || appointment.status !== "BOOKED"
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function formatNextVisitLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "TBC"
  }
  const dateLabel = nextVisitDateFormatter.format(date)
  const timeLabel = nextVisitTimeFormatter.format(date)
  return `${dateLabel} at ${timeLabel}`
}

function formatDob(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Unable to determine"
  }
  return dobFormatter.format(date)
}

function toDateInputValue(value: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }
  return date.toISOString().slice(0, 10)
}

function ProfileStat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-300">{hint}</p> : null}
    </div>
  )
}

function DetailRow({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs uppercase tracking-[0.25em] text-slate-400">{term}</dt>
      <dd className="text-base text-white">{detail}</dd>
    </div>
  )
}
