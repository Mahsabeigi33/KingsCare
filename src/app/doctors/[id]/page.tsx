import { notFound } from "next/navigation"
import Image from "next/image"
import { fetchDoctorById } from "@/lib/doctors"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import { resolveMediaUrl } from "@/lib/media"
import { AppointmentBooking } from "@/components/appointments/AppointmentBooking"

const placeholder =
  "https://images.unsplash.com/photo-1502989642968-94fbdc9eace4?auto=format&fit=crop&w=800&q=80"
const containsHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value)
const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()
const safeParse = (value: string) => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
const isEditorJs = (value: string) => {
  const parsed = safeParse(value)
  return Boolean(parsed && Array.isArray(parsed.blocks))
}
const renderEditorBlocks = (
  blocks: Array<{ type: string; data?: { text?: string; level?: number; items?: string[]; style?: string } }>,
) =>
  blocks.map((block, index) => {
    if (block.type === "paragraph") {
      return (
        <p
          key={`para-${index}`}
          dangerouslySetInnerHTML={{ __html: block.data?.text ?? "" }}
        />
      )
    }
    if (block.type === "header") {
      const level = Math.min(Math.max(block.data?.level ?? 3, 2), 4)
      const Tag = (`h${level}` as keyof JSX.IntrinsicElements)
      return (
        <Tag
          key={`header-${index}`}
          className="font-semibold text-[#0E2A47]"
          dangerouslySetInnerHTML={{ __html: block.data?.text ?? "" }}
        />
      )
    }
    if (block.type === "list") {
      const isOrdered = block.data?.style === "ordered"
      const Tag = (isOrdered ? "ol" : "ul") as "ol" | "ul"
      const items = block.data?.items ?? []
      const listClass = isOrdered ? "list-decimal" : "list-disc"
      return (
        <Tag key={`list-${index}`} className={`${listClass} pl-6 space-y-1`}>
          {items.map((item, itemIndex) => {
            const content =
              typeof item === "string"
                ? item
                : item && typeof item === "object" && "content" in item
                  ? String((item as { content?: string }).content ?? "")
                  : String(item)
            return (
              <li
                key={`item-${index}-${itemIndex}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )
          })}
        </Tag>
      )
    }
    return null
  })

// Force dynamic rendering to avoid static-generation conflicts coming from session handling in the root layout.
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

type PageProps = { params: Promise<{ id: string }> }

export default async function DoctorPage({ params }: PageProps) {
  const { id } = await params
  const doctor = await fetchDoctorById(id)
  if (!doctor) return notFound()

  const cacheKey = doctor.updatedAt ?? doctor.createdAt ?? null
  const imageUrl = resolveMediaUrl(doctor.photoUrl, { placeholder, cacheKey })
  const gallery = (doctor.gallery ?? []).map((url) =>
    resolveMediaUrl(url, { placeholder, cacheKey }),
  )
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
              isEditorJs(doctor.bio) ? (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-gray-700 leading-relaxed space-y-3">
                  {renderEditorBlocks(safeParse(doctor.bio)?.blocks ?? [])}
                </div>
              ) : containsHtml(doctor.bio) ? (
                <div
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: doctor.bio }}
                />
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-gray-700 leading-relaxed">
                  {stripHtml(doctor.bio)}
                </div>
              )
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

       
      </div>
      <Footer />
    </div>
  )
}
