import { notFound } from "next/navigation"
import Image from "next/image"
import { fetchDoctorById } from "@/lib/doctors"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
const placeholder =
  "https://images.unsplash.com/photo-1502989642968-94fbdc9eace4?auto=format&fit=crop&w=800&q=80"
const baseApiUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || process.env.ADMIN_API_BASE_URL || ""

// Force dynamic rendering to avoid static-generation conflicts coming from session handling in the root layout.
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

const resolveImage = (url?: string | null) => {
  if (!url) return placeholder
  if (url.startsWith("http")) return url
  if (!baseApiUrl) return url
  try {
    return new URL(url, baseApiUrl).toString()
  } catch {
    return url
  }
}

type PageProps = { params: Promise<{ id: string }> }

export default async function DoctorPage({ params }: PageProps) {
  const { id } = await params
  const doctor = await fetchDoctorById(id)
  if (!doctor) return notFound()

  const imageUrl = resolveImage(doctor.photoUrl)
  const gallery = (doctor.gallery ?? []).map((url) => resolveImage(url))

  return (

    <div className="min-h-screen ">
      <Nav/>
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-[260px,1fr]">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md md:h-72">
            <Image src={imageUrl} alt={doctor.fullName} fill className="w-200 h-200 object-cover" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">Our Physicians</p>
              <h1 className="text-3xl font-semibold text-[#0E2A47] md:text-4xl">{doctor.fullName}</h1>
              <p className="text-lg text-gray-700">
                {[doctor.title, doctor.specialty].filter(Boolean).join(" • ") || "Physician"}
              </p>
            </div>
            {doctor.shortBio ? (
              <p className="text-base text-gray-700">{doctor.shortBio}</p>
            ) : null}
            <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
              {doctor.email ? <p><strong className="text-gray-800">Email:</strong> {doctor.email}</p> : null}
              {doctor.phone ? <p><strong className="text-gray-800">Phone:</strong> {doctor.phone}</p> : null}
              {typeof doctor.yearsExperience === "number" ? (
                <p><strong className="text-gray-800">Experience:</strong> {doctor.yearsExperience} years</p>
              ) : null}
              {doctor.languages?.length ? (
                <p><strong className="text-gray-800">Languages:</strong> {doctor.languages.join(", ")}</p>
              ) : null}
            </div>
            {doctor.bio ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-gray-700 leading-relaxed">
                {doctor.bio}
              </div>
            ) : null}
          </div>
        </div>

        {gallery.length ? (
          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-semibold text-[#0E2A47]">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.map((url, idx) => (
                <div key={`${url}-${idx}`} className="relative h-56 overflow-hidden rounded-2xl bg-gray-100 shadow">
                  <Image src={url} alt={`${doctor.fullName} photo ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <Footer/>
    </div>
  )
}
