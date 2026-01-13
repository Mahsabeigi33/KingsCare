import Link from "next/link"
import Image from "next/image"
import { fetchDoctors } from "@/lib/doctors"
import { resolveMediaUrl } from "@/lib/media"

const placeholder =
  "https://images.unsplash.com/photo-1502989642968-94fbdc9eace4?auto=format&fit=crop&w=400&q=80"

export default async function TeamMember() {
  let doctors: Awaited<ReturnType<typeof fetchDoctors>> = []
  try {
    doctors = await fetchDoctors({ active: true })
  } catch (error) {
    console.error("Unable to load doctors for team section", error)
  }

  const visible = doctors.length
    ? [...doctors].sort((a, b) => {
        const aPriority = a.priority ?? Number.POSITIVE_INFINITY
        const bPriority = b.priority ?? Number.POSITIVE_INFINITY
        if (aPriority !== bPriority) return aPriority - bPriority
        if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured)
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    : []

  return (
    <section className="bg-white/50 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200 rounded-2xl shadow-sm my-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-bold text-[#0E2A47] md:text-4xl">Meet Our Team</h2>
        <p className="mb-12 text-gray-900">
          Our experienced healthcare professionals are dedicated to providing you with expert
          guidance and compassionate care.
        </p>
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-600">
            Our physician profiles are coming soon.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((member) => (
              <Link
                key={member.id}
                href={`/doctors/${member.id}`}
                className="rounded-2xl border border-gray-100 bg-gray-50/60 p-2 text-center shadow-sm transition hover:-translate-y-2 hover:-translate-x-2  hover:border-[#d9b356] hover:shadow-xl hover:shadow-[#0E2A47]/50 group"
              >
                <div className="mx-auto mb-4 h-100 w-full overflow-hidden rounded-xl bg-[#E6E8EB] relative ">
                  <Image
                    src={resolveMediaUrl(member.photoUrl, { placeholder })}
                    alt={member.fullName}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105  aspect-[4/5] sm:aspect-[3/4] lg:aspect-[3/4]" 
                    sizes="(max-width: 640px) 150vw, (max-width: 1024px) 50vw, 360px"
                    priority={false}
                    loading="lazy"
                  />
                </div>
                <h3 className="mb-1 text-medium sm:text-sm font-bold text-gray-900">
                  <strong>{member.fullName} {member.title || " "}</strong>  
                </h3>
                <p className="text-[#0E2A47] font-medium">
                 {member.specialty || ""}
                </p>
               
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
