import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { buildServiceSlug, fetchServiceBySlug, fetchServices, fetchServiceById } from "@/lib/services";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";
import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";

// Force this route to run dynamically to avoid static-generation conflicts with auth/session usage in the root layout.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 600;

async function resolveService(slug: string) {
  try {
    return await fetchServiceBySlug(slug);
  } catch (error) {
    console.error("Unable to load service detail", error);
    return null;
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await resolveService(slug);
  if (!service || !service.active) {
    return {
      title: "Service not found | Kings Care Medical Clinic",
    };
  }

  return {
    title: `${service.name} | Kings Care Medical Clinic`,
    description: service.description ?? `Learn more about ${service.name} at Kings Care Medical Clinic.`,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await resolveService(slug);

  if (!service || !service.active) {
    notFound();
  }

  let otherServices: Array<Pick<Awaited<ReturnType<typeof fetchServices>>[number], "id" | "name"> & { description?: string | null; shortDescription?: string | null }> = [];
  try {
    if (service.parent?.id) {
      const parent = await fetchServiceById(service.parent.id);
      const siblings = parent?.subServices?.filter((s) => s.active && s.id !== service.id) ?? [];
      otherServices = siblings.map((s) => ({ id: s.id, name: s.name }));
    } else {
      otherServices = (await fetchServices())
        .filter((item) => item.active && !item.parent && item.id !== service.id)
        .slice(0, 3);
    }
  } catch (error) {
    console.error("Unable to load related services", error);
  }

  const heroImage = service.images?.[0] ?? "/website/Pharmacists.jpg";
  const base = (process.env.ADMIN_API_BASE_URL || "").replace(/\/$/, "");
  const resolveImage = (val: string) => {
    if (val.startsWith("http://") || val.startsWith("https://")) return val;
    if (val.startsWith("/uploads/")) return `${base}${val}`;
    return val.startsWith("/") ? val : `/${val}`;
  };
  return (
    <div>
      <Nav/>
    
      <div className="relative isolate overflow-hidden bg-slate-900 text-white max-h-500 h-200">
        <Image
          src={resolveImage(heroImage)}
          alt=""
          fill
          priority
          className="absolute inset-0 object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A47]/90 via-[#0E2A47]/60 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr,0.9fr]">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-white/70">Service overview</span>
              <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">{service.name}</h1>
              <p className="mt-4 max-w-3xl text-base text-white/80 sm:text-lg">
                {service.description ?? "Personalized medical clinic care tailored to your goals."}
              </p>
              <p className="mt-4 max-w-3xl text-base text-white/80 sm:text-lg">
                {service.shortDescription ?? "Personalized medical clinic care tailored to your goals."}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/90">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2">
                  <strong className="text-white">Duration:</strong> {service.durationMin} minutes
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2">
                  <strong className="text-white">Investment:</strong> {currencyFormatter.format((service.priceCents ?? 0) / 100)}
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/user/appointments"
                  className="inline-flex items-center justify-center rounded-full bg-[#D9C89E]  px-6 py-4 text-sm font-semibold text-[#0E2A47] transition hover:bg-[#C7B57A]"
                >
                  Book this service
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/20 bg-white/10"
                >
                  Ask a question
                </Link>
              </div>
            </div>
            <div className="relative h-[260px] w-full overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-sm sm:h-[320px]">
              <Image
                src={resolveImage(heroImage)}
                alt={`${service.name} hero`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A47]/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 text-slate-700">     
        {service.subServices && service.subServices.length > 0 ? (
          <section className="mt-12">
            <h3 className="text-xl font-semibold text-slate-900">Included support</h3>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
                {service.subServices
                  .filter((item) => item.active)
                  .map((item) => (
                    <ServiceCard
                      key={item.id}
                      title={item.name}
                      text={item.shortDescription ?? "Personalized medical clinic care."}
                      href={`/services/${buildServiceSlug(item)}`}
                      image={item.images?.[0] ? item.images[0] : null}
                    />
                  ))}
            </div>
          </section>
        ) : null}

        {otherServices.length > 0 ? (
          <section className="mt-12">
            <h3 className="text-xl font-semibold text-slate-900">You might also be interested in</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {otherServices.map((item) => (
                <Link
                  key={item.id}
                  href={`/services/${buildServiceSlug(item)}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 transition hover:-translate-y-1 hover:border-[#0E2A47]/60 hover:shadow-lg"
                >
                  <p className="text-base font-semibold text-slate-900 group-hover:text-[#0E2A47]">{item.name}</p>
                  <p className="mt-2 line-clamp-3">{item.shortDescription ?? item.description ?? "Comprehensive medical clinic-led care."}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    
    <Emergency />
    <Footer/>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const services = await fetchServices();
    return services.filter((service) => service.active).map((service) => ({ slug: buildServiceSlug(service) }));
  } catch (error) {
    console.error("Unable to pre-build services", error);
    return [];
  }
}
