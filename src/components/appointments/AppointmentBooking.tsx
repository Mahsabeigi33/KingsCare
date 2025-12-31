"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/cn"

type DoctorSummary = {
  id: string
  name: string
  specialty?: string | null
  durationMin?: number | null
}

type DayAvailability = {
  totalSlots: number
  availableSlots: number
}

type AvailabilityRecord = Record<string, DayAvailability>

type AppointmentBookingProps = {
  doctors: DoctorSummary[]
  refreshKey?: number
  initialDoctorId?: string
}

type SlotsCache = Record<string, string[]>

type BookingSuccess = {
  id: string
  date: string
  doctorName: string
}

const DISPLAY_RANGE_DAYS = 28
const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  hour: "numeric",
  minute: "2-digit",
})

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "short",
})

const fullDateFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "long",
  month: "long",
  day: "numeric",
})

export function AppointmentBooking({ doctors, initialDoctorId }: AppointmentBookingProps) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(() => initialDoctorId ?? doctors[0]?.id ?? "")
  const [doctorSearch, setDoctorSearch] = useState("")
  const [availability, setAvailability] = useState<AvailabilityRecord>({})
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [slotsCache, setSlotsCache] = useState<SlotsCache>({})
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [fullName, setFullName] = useState("")
  const [healthNumber, setHealthNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshCounter, setRefreshCounter] = useState(0)

  // dayRange is pure; it only recomputes when refreshCounter changes
  const dayRange = useMemo(() => {
    void refreshCounter
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Array.from({ length: DISPLAY_RANGE_DAYS }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      return date
    })
  }, [refreshCounter])

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0] ?? null

  const filteredDoctors = useMemo(() => {
    const query = doctorSearch.trim().toLowerCase()
    if (!query) return doctors

    return doctors.filter((doctor) => {
      const name = doctor.name.toLowerCase()
      const specialty = (doctor.specialty ?? "").toLowerCase()
      return name.includes(query) || specialty.includes(query)
    })
  }, [doctors, doctorSearch])

  useEffect(() => {
    if (!selectedDoctorId || dayRange.length === 0) {
      return
    }

    const controller = new AbortController()
    const from = formatDateKey(dayRange[0])
    const to = formatDateKey(dayRange[dayRange.length - 1])
    const duration = (selectedDoctor?.durationMin ?? 30).toString()

    setAvailabilityLoading(true)
    setAvailabilityError(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setSlotsCache({})

    async function loadAvailability() {
      try {
        const params = new URLSearchParams({
          doctorId: selectedDoctorId,
          from,
          to,
          durationMin: duration,
        })

        const response = await fetch(`/api/appointments/availability?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Unable to load availability.")
        }

        const data = (await response.json()) as {
          availability?: AvailabilityRecord
          slots?: string[]
        }

        if (controller.signal.aborted) {
          return
        }

        setAvailability(data.availability ?? {})
        const initialDate = findFirstAvailableDate(data.availability ?? {}, dayRange)

        if (initialDate) {
          setSelectedDate(initialDate)
          if (Array.isArray(data.slots) && data.slots.length) {
            setSlotsCache((prev) => ({ ...prev, [initialDate]: data.slots ?? [] }))
          } else {
            void loadSlots(initialDate, { suppressSelection: true })
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load availability", error)
          setAvailabilityError("We couldn't load availability right now. Please try again shortly.")
        }
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityLoading(false)
        }
      }
    }

    void loadAvailability()

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctorId, selectedDoctor?.durationMin, dayRange])

  const currentSlots = selectedDate ? slotsCache[selectedDate] ?? [] : []

  async function loadSlots(dateKey: string | null, options?: { suppressSelection?: boolean }) {
    if (!selectedDoctorId || !dateKey) return
    if (slotsCache[dateKey]) {
      return
    }

    setSlotsLoading(true)
    try {
      const duration = (selectedDoctor?.durationMin ?? 30).toString()
      const params = new URLSearchParams({
        doctorId: selectedDoctorId,
        durationMin: duration,
        date: dateKey, // `dateKey` is now guaranteed to be a string here
      })

      const response = await fetch(`/api/appointments/availability?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Unable to load time slots.")
      }

      const data = (await response.json()) as {
        slots?: string[]
        availability?: AvailabilityRecord
      }

      setAvailability((prev) => ({ ...prev, ...(data.availability ?? {}) }))

      if (Array.isArray(data.slots)) {
        setSlotsCache((prev) => ({ ...prev, [dateKey]: data.slots ?? [] }))
        if (!options?.suppressSelection && data.slots.length > 0) {
          setSelectedSlot(data.slots[0] ?? null)
        }
      } else {
        setSlotsCache((prev) => ({ ...prev, [dateKey]: [] }))
      }
    } catch (error) {
      console.error("Failed to load slots", error)
      setAvailabilityError("Unable to load available times. Please pick another date or try again.")
    } finally {
      setSlotsLoading(false)
    }
  }

  const handleDateSelect = async (date: Date) => {
    const dateKey = formatDateKey(date)
    const summary = availability[dateKey]
    if (!summary || summary.availableSlots === 0) {
      return
    }

    setSelectedDate(dateKey)
    setSelectedSlot(null)
    setBookingError(null)
    await loadSlots(dateKey)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selectedDoctorId) {
      setBookingError("Please select a doctor.")
      return
    }
    if (!fullName.trim()) {
      setBookingError("Please enter your full name.")
      return
    }
    if (!healthNumber.trim()) {
      setBookingError("Health Number is required.")
      return
    }
    if (!phone.trim()) {
      setBookingError("Please enter a phone number.")
      return
    }
    if (!birthDate.trim()) {
      setBookingError("Please add your birth date (YYYY-MM-DD).")
      return
    }
    if (!selectedDate) {
      setBookingError("Choose a day for your appointment.")
      return
    }
    if (!selectedSlot) {
      setBookingError("Please select an available time.")
      return
    }

    setIsSubmitting(true)
    setBookingError(null)
    try {
      const response = await fetch("/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          datetime: selectedSlot,
          fullName: fullName.trim(),
          healthNumber: healthNumber.trim(),
          phone: phone.trim(),
          birthDate: birthDate.trim(),
          notes: notes.trim() ? notes.trim() : undefined,
        }),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        const errorMessage =
          typeof payload?.error === "string"
            ? payload.error
            : "Unable to book this appointment. Please try a different time."
        setBookingError(errorMessage)
        return
      }

      const doctorName = selectedDoctor?.name ?? "Selected doctor"
      setBookingSuccess({
        id: payload?.appointment?.id ?? "",
        date: selectedSlot,
        doctorName,
      })

      setNotes("")
      setFullName("")
      setHealthNumber("")
      setPhone("")
      setBirthDate("")
      setSelectedSlot(null)
      setSelectedDate(null)
      setSlotsCache({})
      setRefreshCounter((counter) => counter + 1)
    } catch (error) {
      console.error("Failed to book appointment", error)
      setBookingError("Unexpected error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!doctors.length) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur">
        <h2 className="text-2xl font-semibold">Booking temporarily unavailable</h2>
        <p className="mt-4 text-base text-slate-200">
          We&rsquo;re getting our physicians ready for online booking. Please check back soon or contact our team for
          assistance.
        </p>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-white shadow-2xl shadow-slate-900/50 backdrop-blur border-cyan-400/70 lg:p-10">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-90 w-90 rounded-full bg-cyan-500/30 blur-3xl" />

      <div className="relative flex flex-col gap-3 pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Step inside better care</p>
          <h1 className="mt-2 text-3xl font-semibold lg:text-4xl">Book with a doctor in minutes</h1>
          <p className="mt-2 max-w-2xl text-base text-slate-300">
            Choose a doctor, pick a day with available times, and confirm your visit without creating an account. Our
            team will follow up with any preparation details.
          </p>
        </div>
        {selectedDoctor ? (
          <div className="relative min-w-[220px] rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-slate-200 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Selected doctor</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{selectedDoctor.name}</h2>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-200/90">
              {selectedDoctor.specialty ? (
                <span className="rounded-full border border-white/20 px-3 py-1">{selectedDoctor.specialty}</span>
              ) : null}
             
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">1. Pick a doctor</h3>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-300">
                Start typing to quickly find your doctor.
              </p>
              <input
                type="text"
                value={doctorSearch}
                onChange={(event) => setDoctorSearch(event.target.value)}
                placeholder="Search doctors by name or specialty..."
                className="w-full max-w-xs rounded-full border border-white/15 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
              />
            </div>

            <div className="mt-4 max-h-[20rem] space-y-4 overflow-y-auto pr-1">
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredDoctors.length ? (
                  filteredDoctors.map((doctor) => {
                    const isActive = doctor.id === selectedDoctorId
                    return (
                      <button
                        key={doctor.id}
                        type="button"
                        onClick={() => {
                          if (doctor.id !== selectedDoctorId) {
                            setSelectedDoctorId(doctor.id)
                            setBookingSuccess(null)
                            setBookingError(null)
                          }
                        }}
                        className={cn(
                          "group relative overflow-hidden rounded-2xl border px-5 py-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                          isActive
                            ? "border-cyan-400/70 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/20"
                            : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-200/40 hover:bg-white/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-lg font-semibold">{doctor.name}</h4>
                         
                        </div>
                        {doctor.specialty ? (
                          <p className="mt-2 line-clamp-2 text-sm text-slate-300/90">{doctor.specialty}</p>
                        ) : null}
                      </button>
                    )
                  })
                ) : (
                  <p className="text-sm text-slate-300">No doctors match your search.</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">2. Choose a day</h3>
            <p className="mt-2 text-sm text-slate-300">
              Available days glow softly. Tap a date to reveal appointment times.
            </p>

            <div className="mt-4 overflow-x-auto pb-2">
              <div className="flex min-w-[640px] gap-3">
                {dayRange.map((date) => {
                  const dateKey = formatDateKey(date)
                  const summary = availability[dateKey]
                  const isSelected = selectedDate === dateKey
                  const isDisabled = !summary || summary.availableSlots === 0
                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => void handleDateSelect(date)}
                      disabled={isDisabled || availabilityLoading}
                      className={cn(
                        "flex w-[140px] flex-col items-center gap-2 rounded-2xl border px-4 py-3 text-center transition",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                        isDisabled
                          ? "border-white/5 bg-white/5 text-slate-500/70"
                          : "border-white/10 bg-white/10 text-slate-100 hover:border-cyan-200/40 hover:bg-white/20",
                        isSelected && !isDisabled
                          ? "border-cyan-400/70 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/20"
                          : null,
                      )}
                    >
                      <span className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">
                        {dayFormatter.format(date)}
                      </span>
                      <span className="text-2xl font-semibold">{date.getDate()}</span>
                      <span className="text-xs text-slate-300">
                        {summary && !isDisabled
                          ? `${summary.availableSlots} slot${summary.availableSlots === 1 ? "" : "s"}`
                          : "Fully booked"}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {availabilityLoading ? (
              <p className="mt-4 text-sm text-slate-300">Checking availability...</p>
            ) : null}
          </section>

          <section>
            <h3 className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">3. Pick a time</h3>
            <p className="mt-2 text-sm text-slate-300">
              Times are displayed in your local timezone.
            </p>
            <div className="mt-4">
              {selectedDate ? (
                <Fragment>
                  {slotsLoading ? (
                    <div className="flex flex-wrap gap-3">
                      {Array.from({ length: 6 }, (_, index) => (
                        <span
                          key={index}
                          className="h-10 w-28 animate-pulse rounded-full bg-white/10"
                        />
                      ))}
                    </div>
                  ) : currentSlots.length ? (
                    <div className="flex flex-wrap gap-3">
                      {currentSlots.map((slot) => {
                        const isActive = selectedSlot === slot
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedSlot(slot)
                              setBookingError(null)
                            }}
                            className={cn(
                              "rounded-full border px-5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
                              isActive
                                ? "border-cyan-400/70 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/30"
                                : "border-white/10 bg-white/10 text-slate-100 hover:border-cyan-200/50 hover:bg-white/20",
                            )}
                          >
                            {timeFormatter.format(new Date(slot))}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                      We can&rsquo;t find any remaining slots for this day. Please pick another date.
                    </p>
                  )}
                </Fragment>
              ) : (
                <p className="text-sm text-slate-300">Select a day to see available times.</p>
              )}
            </div>
          </section>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <div>
            <h3 className="text-lg font-semibold text-white">Appointment summary</h3>
            <p className="mt-2 text-sm text-slate-300">
              Review your details and share any prep questions or notes for our clinical team.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span>Full name</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                className="rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                placeholder="Enter your full legal name"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span>Health Number</span>
              <input
                value={healthNumber}
                onChange={(event) => setHealthNumber(event.target.value)}
                required
                className="rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                placeholder="Provincial health number"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span>Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
                className="rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
                placeholder="(587) 327-6106"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span>Birth date</span>
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                required
                placeholder="YYYY-MM-DD"
                className="rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
              />
            </label>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <SummaryRow label="Patient">{fullName.trim() || "Enter your full name"}</SummaryRow>
            <SummaryRow label="Health #">{healthNumber.trim() || "Add your health number"}</SummaryRow>
            <SummaryRow label="Phone">{phone.trim() || "Add your phone number"}</SummaryRow>
            <SummaryRow label="Birth date">{birthDate.trim() || "Add birth date (YYYY-MM-DD)"}</SummaryRow>
            <SummaryRow label="Doctor">{selectedDoctor?.name ?? "Select a doctor"}</SummaryRow>
            <SummaryRow label="Visit length">
              {selectedDoctor ? `${selectedDoctor}` : "-"}
            </SummaryRow>
            <SummaryRow label="Date">
              {selectedDate ? fullDateFormatter.format(new Date(selectedDate)) : "Choose a day"}
            </SummaryRow>
            <SummaryRow label="Time">
              {selectedSlot ? timeFormatter.format(new Date(selectedSlot)) : "Select a time"}
            </SummaryRow>
          </div>

          <label className="flex flex-col gap-2 text-sm text-slate-200">
            <span>Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={500}
              placeholder="Share questions or access needs—our clinical team will review before your visit."
              className="min-h-[120px] rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
            />
            <span className="self-end text-xs text-slate-400">{notes.length}/500</span>
          </label>

          {bookingError ? (
            <p className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {bookingError}
            </p>
          ) : null}

          {bookingSuccess ? (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
              <p className="font-semibold">Appointment confirmed!</p>
              <p className="mt-1">
                We&rsquo;ve held your visit with {bookingSuccess.doctorName.toLowerCase()} for{" "}
                {timeFormatter.format(new Date(bookingSuccess.date))} on{" "}
                {fullDateFormatter.format(new Date(bookingSuccess.date))}.
              </p>
              <button
                type="button"
                onClick={() => setBookingSuccess(null)}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/60 px-4 py-2 text-xs uppercase tracking-[0.25em] text-emerald-100 transition hover:border-emerald-200"
              >
                Book another time
              </button>
            </div>
          ) : null}

          {availabilityError ? (
            <p className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {availabilityError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || availabilityLoading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Booking..." : "Confirm appointment"}
          </button>

          <p className="text-xs text-slate-400">
            You&rsquo;ll receive a confirmation email with visit instructions after booking. Need immediate support?
            Call our team at <span className="font-medium text-white">(587) 327-6106</span>.
          </p>
        </form>
      </div>
    </section>
  )
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-b-0">
      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</span>
      <span className="max-w-[60%] text-right text-sm text-white">{children}</span>
    </div>
  )
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

function findFirstAvailableDate(
  availability: AvailabilityRecord,
  dayRange: Date[],
): string | null {
  for (const date of dayRange) {
    const key = formatDateKey(date)
    const summary = availability[key]
    if (summary && summary.availableSlots > 0) {
      return key
    }
  }
  return null
}
