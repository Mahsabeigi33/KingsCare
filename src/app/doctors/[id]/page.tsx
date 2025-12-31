import { notFound } from "next/navigation"
import Image from "next/image"
import { fetchDoctorById } from "@/lib/doctors"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { resolveMediaUrl } from "@/lib/media"
import { AppointmentBooking } from "@/components/appointments/AppointmentBooking"

const placeholder =
  "https://images.unsplash.com/photo-1502989642968-94fbdc9eace4?auto=format&fit=crop&w=800&q=80"

// Force dynamic rendering to avoid static-generation conflicts coming from session handling in the root layout.
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

type PageProps = { params: Promise<{ id: string }> }

export default async function DoctorPage({ params }: PageProps) {
  const { id } = await params
  const doctor = await fetchDoctorById(id)
  if (!doctor) return notFound()

  const imageUrl = resolveMediaUrl(doctor.photoUrl, { placeholder })
  const gallery = (doctor.gallery ?? []).map((url) => resolveMediaUrl(url, { placeholder }))
  const bookingDoctors = [
    {
      id: doctor.id,
      name: doctor.fullName,
      specialty: doctor.specialty ?? null,
      durationMin: 30,
    },
  ]

  return (
    <div className="min-h-screen">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:grid-cols-[1fr,360px] gap-6 sm:gap-8 lg:gap-12 lg:items-start sm:items-center">
          <div className="space-y-4 ">
            <div>
              <p className="text-medium uppercase tracking-[0.3em] text-indigo-800 pt-8 pb-4">Our Physicians</p>
              <h1 className="text-3xl font-semibold text-[#0E2A47] md:text-4xl">{doctor.fullName}</h1>
              <p className="text-lg text-gray-700">
                {[doctor.title, doctor.specialty].filter(Boolean).join(" - ") || "Physician"}
              </p>
            </div>
            {doctor.shortBio ? <p className="text-base text-gray-700">{doctor.shortBio}</p> : null}
            <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
              
              {typeof doctor.yearsExperience === "number" ? (
                <p>
                  <strong className="text-gray-800">Experience:</strong> {doctor.yearsExperience} years
                </p>
              ) : null}
           
            </div>
            {doctor.bio ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-gray-700 leading-relaxed">
                {doctor.bio}
              </div>
            ) : null}
          </div>
          <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
            <Image
              src={imageUrl}
              alt={doctor.fullName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              priority
            />
          </div>
        </div>

        {gallery.length ? (
          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0E2A47]">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative h-56 overflow-hidden rounded-2xl bg-gray-100 shadow"
                >
                  <Image src={url} alt={`${doctor.fullName} photo ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-14">
          <h2 className="text-2xl font-semibold text-[#0E2A47]">Book with {doctor.fullName}</h2>
          <p className="mt-2 text-gray-700">
            Share your details and pick a time that works for you—no sign-in required.
          </p>
          <div className="mt-6">
            <AppointmentBooking doctors={bookingDoctors} initialDoctorId={doctor.id} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
