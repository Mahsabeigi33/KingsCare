"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/cn"

type ServiceSummary = {
  id: string
  name: string
  durationMin: number
  description?: string | null
  priceCents?: number
}

type DayAvailability = {
  totalSlots: number
  availableSlots: number
}

type AvailabilityRecord = Record<string, DayAvailability>

type SlotsCache = Record<string, string[]>

type AvailabilityExplorerProps = {
  services: ServiceSummary[]
}

const DISPLAY_RANGE_DAYS = 21

const weekdayFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "short",
})

const monthFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
})

const fullDateFormatter = new Intl.DateTimeFormat("en-CA", {
  weekday: "long",
  month: "long",
  day: "numeric",
})

const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  hour: "numeric",
  minute: "2-digit",
})

export function AvailabilityExplorer({ services }: AvailabilityExplorerProps) {
  const [selectedServiceId, setSelectedServiceId] = useState(() => services[0]?.id ?? "")
  const [availability, setAvailability] = useState<AvailabilityRecord>({})
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [slotsCache, setSlotsCache] = useState<SlotsCache>({})
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const dayRange = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Array.from({ length: DISPLAY_RANGE_DAYS }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      return date
    })
  }, [])

  const selectedService =
    services.find((service) => service.id === selectedServiceId) ?? services[0] ?? null

  useEffect(() => {
    if (!selectedServiceId || dayRange.length === 0) {
      return
    }

    const controller = new AbortController()
    const from = formatDateKey(dayRange[0])
    const to = formatDateKey(dayRange[dayRange.length - 1])

    setAvailabilityLoading(true)
    setAvailabilityError(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setSlotsCache({})

    async function loadAvailability() {
      try {
        const params = new URLSearchParams({
          serviceId: selectedServiceId,
          from,
          to,
        })

        const response = await fetch(`/api/appointments/availability?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Unable to load availability.")
        }

        const data = (await response.json()) as {
          availability?: AvailabilityRecord
        }

        if (controller.signal.aborted) {
          return
        }

        const record = data.availability ?? {}
        setAvailability(record)

        const initialDate = findFirstAvailableDate(record, dayRange)
        if (initialDate) {
          setSelectedDate(initialDate)
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }
        console.error("Failed to load availability preview", error)
        setAvailabilityError("We couldn't load availability right now. Please try again shortly.")
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
  }, [selectedServiceId, dayRange])

  useEffect(() => {
    if (!selectedServiceId || !selectedDate || slotsCache[selectedDate]) {
      return
    }

    const controller = new AbortController()
    setSlotsLoading(true)

    async function loadSlots() {
      try {
        const params = new URLSearchParams()
        params.set('serviceId', selectedServiceId)
        if (selectedDate) {
          params.set('date', selectedDate)
        }

        const response = await fetch(`/api/appointments/availability?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error("Unable to load time slots.")
        }

        const data = (await response.json()) as { slots?: string[] }

        if (controller.signal.aborted) {
          return
        }

        const cacheKey = selectedDate ?? 'all'
        setSlotsCache((previous) => ({
          ...previous,
          [cacheKey]: data.slots ?? [],
        }))
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }
        console.error("Failed to load slots preview", error)
        const cacheKey = selectedDate ?? 'all'
        setSlotsCache((previous) => ({
          ...previous,
          [cacheKey]: [],
        }))
      } finally {
        if (!controller.signal.aborted) {
          setSlotsLoading(false)
        }
      }
    }

    void loadSlots()

    return () => {
      controller.abort()
    }
  }, [selectedDate, selectedServiceId, slotsCache])

  const slotsForSelectedDate = selectedDate ? slotsCache[selectedDate] ?? [] : []

  if (services.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200/30 bg-white p-10 text-center shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-900">Availability coming soon</h2>
        <p className="mt-4 text-slate-600">
          We@apos;re setting up online scheduling. Reach out by {""}
          <Link href="/contact" className="text-[#0E2A47] underline">
            contacting our pharmacy team
          </Link>{" "}
          and we@apos;ll hold a time for you.
        </p>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border border-slate-200/20 bg-white/70 p-6 shadow-2xl backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0E2A47]/15 via-transparent to-transparent" />
      <div className="relative z-10 mx-auto max-w-6xl space-y-10 lg:space-y-12">
        <header className="space-y-4 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0E2A47]">
            Real-time availability
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Find a visit that works for you
          </h1>
          <p className="mx-auto max-w-3xl text-base text-slate-600 lg:mx-0">
            Browse open appointment times without logging in. Pick a service, choose a day, and see
            the exact slots held for walk-in and telemedicine visits.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200/60 bg-white/80 p-4 shadow-inner">
              {services.map((service) => {
                const isActive = service.id === selectedServiceId
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    className={cn(
                      "rounded-full border px-5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E2A47]",
                      isActive
                        ? "border-[#0E2A47] bg-[#0E2A47] text-white shadow-lg"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#0E2A47] hover:text-[#0E2A47]",
                    )}
                  >
                    {service.name}
                  </button>
                )
              })}
            </div>

            {selectedService?.description ? (
              <div className="rounded-3xl border border-slate-200/60 bg-white/70 p-5 shadow-sm">
                <p className="text-sm text-slate-600">{selectedService.description}</p>
              </div>
            ) : null}

            <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-lg">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Pick a day</span>
                {availabilityLoading ? (
                  <span className="text-[#0E2A47]">Updating...</span>
                ) : selectedDate ? (
                  <span>{fullDateFormatter.format(new Date(selectedDate))}</span>
                ) : (
                  <span>Next {DISPLAY_RANGE_DAYS} days</span>
                )}
              </div>

              {availabilityError ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {availabilityError}
                </p>
              ) : null}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {dayRange.map((date) => {
                  const key = formatDateKey(date)
                  const summary = availability[key]
                  const availableSlots = summary?.availableSlots ?? 0
                  const isSelected = selectedDate === key
                  const isSoldOut = summary && availableSlots === 0
                  const label = availableSlots === 1 ? "slot" : "slots"

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => {
                        setSelectedDate(key)
                        setSelectedSlot(null)
                      }}
                      className={cn(
                        "flex flex-col gap-1 rounded-2xl border bg-white px-4 py-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E2A47]",
                        isSelected
                          ? "border-[#0E2A47] bg-[#E6E8EB] shadow-lg"
                          : "border-slate-200 hover:border-[#0E2A47]/60 hover:bg-[#E6E8EB]",
                        isSoldOut ? "cursor-not-allowed opacity-40" : "",
                      )}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        {weekdayFormatter.format(date)}
                      </span>
                      <span className="text-base font-semibold text-slate-900">
                        {monthFormatter.format(date)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {availableSlots > 0 ? `${availableSlots} ${label} open` : "Fully booked"}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-6 rounded-3xl border border-slate-200/70 bg-gradient-to-br from-[#E6E8EB] via-white to-slate-50 p-6 shadow-xl">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Available times</h2>
              <p className="mt-1 text-sm text-slate-600">
                Times shown adjust instantly as patients reserve visits. Slots refresh every few
                seconds.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E6E8EB] bg-white/80 p-5 shadow-inner">
              {selectedDate ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{fullDateFormatter.format(new Date(selectedDate))}</span>
                    {slotsLoading ? <span className="text-[#0E2A47]">Loading...</span> : null}
                  </div>

                  {slotsForSelectedDate.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {slotsForSelectedDate.map((slot) => {
                        const isSelected = selectedSlot === slot
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              "rounded-full border px-3 py-2 text-sm font-medium transition",
                              isSelected
                                ? "border-[#0E2A47] bg-[#0E2A47] text-white shadow"
                                : "border-[#E6E8EB] bg-white text-[#0E2A47] hover:border-[#0E2A47] hover:text-[#0E2A47]",
                            )}
                          >
                            {timeFormatter.format(new Date(slot))}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      {slotsLoading
                        ? "Checking for new times..."
                        : "No open times for this day. Choose another date to see options."}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Select a day to preview open times. We hold a mix of in-pharmacy and virtual visits
                  every day.
                </p>
              )}
            </div>

            <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
              <div className="rounded-2xl border border-[#E6E8EB] bg-[#E6E8EB] p-4 text-[#0E2A47]">
                <p className="font-semibold">Ready to reserve a visit?</p>
                <p className="mt-1 text-sm">
                  Create a quick account to confirm your preferred time in under two minutes.
                </p>
                <Link
                  href="/login?next=%2Fuser%2Fappointments"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-[#D9C89E] px-4 py-2 text-sm font-semibold text-[#0E2A47] shadow hover:bg-[#C7B57A]"
                >
                  Log in &amp; book
                </Link>
              </div>
              <p>
                Need help picking the right service? {""}
                <Link href="/contact" className="font-medium text-[#0E2A47] hover:underline">
                  Talk with our care team
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
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

