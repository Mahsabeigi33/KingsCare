import type { AdminAppointment } from "@/lib/appointments"
import { cn } from "@/lib/cn"

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "short",
})

const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  hour: "numeric",
  minute: "2-digit",
})

const statusCopy: Record<
  AdminAppointment["status"],
  { label: string; badgeClass: string }
> = {
  BOOKED: {
    label: "Booked",
    badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "bg-emerald-500/10 text-emerald-200 border-emerald-400/40",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-amber-500/10 text-amber-200 border-amber-400/40",
  },
  NO_SHOW: {
    label: "No show",
    badgeClass: "bg-rose-500/10 text-rose-200 border-rose-400/40",
  },
}

type AppointmentHistoryProps = {
  appointments: AdminAppointment[]
}

export function AppointmentHistory({
  appointments,
}: AppointmentHistoryProps) {
  const now = Date.now()
  const upcoming = appointments
    .filter((appointment) => {
      const date = new Date(appointment.date).getTime()
      return (
        appointment.status === "BOOKED" &&
        !Number.isNaN(date) &&
        date >= now
      )
    })
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

  const past = appointments
    .filter((appointment) => {
      const date = new Date(appointment.date).getTime()
      if (Number.isNaN(date)) {
        return false
      }
      const inPast = date < now
      return inPast || appointment.status !== "BOOKED"
    })
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    )

  return (
    <section className="space-y-6 rounded-3xl border  bg-slate-800/60 p-6 backdrop-blur border-cyan-400/70 lg:p-8">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-white">
          Appointment history
        </h2>
        <p className="text-sm text-slate-300">
          Track upcoming visits and look back at your previous
          appointments with Kings Care Medical Clinic.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <HistoryColumn
          title="Upcoming"
          emptyCopy="You have no upcoming bookings yet. Schedule your next appointment above."
          appointments={upcoming}
        />
        <HistoryColumn
          title="Previous visits"
          emptyCopy="Your past appointments will appear here once you have completed or cancelled a visit."
          appointments={past}
        />
      </div>
    </section>
  )
}

function HistoryColumn({
  title,
  appointments,
  emptyCopy,
}: {
  title: string
  appointments: AdminAppointment[]
  emptyCopy: string
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {appointments.length === 0 ? (
        <p className="mt-3 text-sm text-slate-300">{emptyCopy}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-white">
                  {appointment.service?.name?.trim() ||
                    "Booked service"}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide",
                    statusCopy[appointment.status].badgeClass,
                  )}
                >
                  {statusCopy[appointment.status].label}
                </span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                {formatDateLabel(appointment.date)}
              </p>
              <p className="mt-1 text-sm text-slate-200">
                {formatTimeLabel(appointment.date)}
              </p>
              {appointment.notes ? (
                <p className="mt-2 text-xs text-slate-400">
                  Notes: {appointment.notes}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function formatDateLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Scheduled date unavailable"
  }
  return dateFormatter.format(date)
}

function formatTimeLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }
  return timeFormatter.format(date)
}
