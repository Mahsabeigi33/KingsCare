import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { buildServiceSlug, fetchServiceBySlug, fetchServices, fetchServiceById } from "@/lib/services";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";
import Image from "next/image";
import ServiceCard from "@/components/ServiceCard";
import { resolveMediaUrl } from "@/lib/media";
import { parseMarkdown } from "@/lib/markdown";

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
  const resolvedHeroImage = resolveMediaUrl(heroImage, {
    cacheKey: service.updatedAt ?? service.createdAt ?? null,
  });
  const descriptionBlocks = parseMarkdown(service.description ?? "");

  return (
    <div>
      <Nav/>
    
      <div className="relative isolate overflow-hidden bg-slate-900 text-white p-20  ">
        <Image
          src={resolvedHeroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover opacity-40 aspect-[4/4] "
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A47]/90 via-[#0E2A47]/69 to-transparent " />
        <div className="relative mx-auto max-w-6xl  ">
          <div className="grid items-center gap-5 lg:grid-cols-2">
            <div>
              <span className="text-xs uppercase tracking-[0.35em] text-white/70">Service overview</span>
              <h1 className="mt-4 text-2xl font-semibold sm:text-2xl">{service.name}</h1>
              {descriptionBlocks.length ? (
                <div className="mt-4 max-w-3xl text-lg text-white/85 space-y-3">
                  {descriptionBlocks.map((block, index) =>
                    block.type === "list" ? (
                      <ul key={`list-${index}`} className="list-disc pl-6 space-y-1">
                        {block.items.map((item, itemIndex) => (
                          <li key={`item-${index}-${itemIndex}`}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={`para-${index}`}>{block.text}</p>
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-4 max-w-3xl text-lg text-white/80 ">
                  Personalized medical clinic care tailored to your goals.
                </p>
              )}
              
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/90">
              
               
               
              </div>
             
            </div>
            <div className="relative w-full overflow-hidden rounded-3xl  shadow-2xl aspect-[4/4] sm:aspect-[3/4] lg:aspect-[4/4]">
              <Image
                src={resolvedHeroImage}
                alt={`${service.name} hero`}
                fill
                className="object-cover sm:aspect-[4/4] lg:aspect-[4/4] "
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A47]/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>

         
        {service.subServices && service.subServices.length > 0 ? (
           <div className="mx-auto max-w-5xl px-4 py-16 text-slate-700"> 
          <section className="mt-12">
            <h3 className="text-xl font-semibold text-slate-900">Included services</h3>
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
            </div>
        ) : null}

    
    
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
