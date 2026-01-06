import type { Metadata } from "next"
import Link from "next/link"
import { AppointmentBooking } from "@/components/appointments/AppointmentBooking"
import { fetchDoctors } from "@/lib/doctors"
import type { AdminDoctor } from "@/lib/doctors"
import { fetchServices } from "@/lib/services"
import type { AdminService } from "@/lib/services"
import Nav from "@/components/Nav"


const HOW_IT_WORKS_STEPS = [
  {
    id: "01",
    title: "Reserve your visit",
    description: "Pick your doctor and time. Availability updates instantly as other patients book.",
  },
  {
    id: "02",
    title: "Get confirmation",
    description:
      "We email your visit summary, prep instructions, and next steps so you know exactly what to expect.",
  },
  {
    id: "03",
    title: "Arrive prepared",
    description:
      "Need to adjust plans? Reply to the confirmation or call us and we will help you reschedule.",
  },
] as const

export const metadata: Metadata = {
  title: "Book an Appointment | Kings Care Medical Clinic",
  description:
    "Secure a visit with Kings Care Medical Clinic's physicians. Choose your doctor, pick a time, and confirm your appointment in minutes.",
}

export default async function PatientAppointmentsPage() {
  let doctors: AdminDoctor[] = []
  let services: AdminService[] = []
  try {
    doctors = await fetchDoctors({ active: true })
  } catch (error) {
    console.error("Unable to load doctors for booking", error)
  }
  try {
    services = await fetchServices()
  } catch (error) {
    console.error("Unable to load services for booking", error)
  }

  const simplified = doctors
    .filter((doctor) => doctor.active)
    .map((doctor) => ({
      id: doctor.id,
      name: doctor.fullName,
      specialty: doctor.specialty,
    }))

  const defaultServiceId = services.find((service) => service.active)?.id ?? services[0]?.id ?? ""

  return (
    
    <div className="space-y-8 pb-6 lg:space-y-12 mx-auto max-w-7xl">
      <Nav/>
      <div className="rounded-3xl border border-white/10 bg-slate-600/70 p-6 text-center backdrop-blur lg:p-10 lg:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
          Patient appointments
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
          Manage your visits in one place
        </h1>
        <p className="mt-3 text-sm text-slate-300 sm:text-base">
          Book new appointments without signing in—choose your doctor, day, and time in seconds.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10  text-center backdrop-blur  lg:text-left">
          <AppointmentBooking doctors={simplified} serviceId={defaultServiceId} />
          {/* <HowItWorksSection /> */}
      </div>
    </div>
  )
}

function HowItWorksSection() {
  return (
    <section className="rounded-3xl mt-10 border border-white/10 bg-slate-800/60 p-6 text-sm text-slate-300 backdrop-blur lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">How online booking works</h2>
          <p className="mt-1 text-sm text-slate-300">
            Follow these quick steps to secure time with our clinical team.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border border-cyan-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100 transition hover:border-cyan-200 hover:text-white"
        >
          Need help?
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map((step) => (
          <div
            key={step.id}
            className="h-full  bg-slate-750/40 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">{step.id}</p>
            <h3 className="mt-2 text-base font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
