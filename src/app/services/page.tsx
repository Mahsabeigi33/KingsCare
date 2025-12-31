import type { Metadata } from "next";
import Link from "next/link";

import ServiceCard from "@/components/ServiceCard";
import { buildServiceSlug, fetchServices } from "@/lib/services";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";



export const metadata: Metadata = {
  title: "Services | Kings Care Medical Clinic",
  description:
    "Explore Kings Care Medical Clinic services including telemedicine consults, travel vaccinations, personalized prescribing, and more.",
};

export default async function ServicesPage() {
  let services = [] as Awaited<ReturnType<typeof fetchServices>>;

  try {
    services = await fetchServices();
  } catch (error) {
    console.error("Unable to load services list", error);
  }

  const activeServices = services.filter((service) => service.active && !service.parent);

  return (
    <div>
      <Nav/>
        <div  className="bg-gradient-to-br from-[#0E2A47] to-[#4B5563] text-white lg:px-20 sm:px-4 py-20 ">
          <div className="max-w-6xl mx-auto px-4 text-center lg:text-left">
          <h1 className="text-xl font-semibold uppercase tracking-[0.35em] text-white/70">
            Clinical services
          </h1>
          <p className="mt-3 text-3xl font-semibold sm:text-4xl">
            Care built for your routine
          </p>
          <p className="mt-4 max-w-3xl text-xl text-white/80 sm:text-base">
           Personalized medical clinic care tailored to your needs.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/appointments"
              className="inline-flex items-center justify-center rounded-full bg-[#D9C89E] px-5 py-4 text-sm font-semibold text-[#0E2A47] shadow hover:bg-[#C7B57A]"
            >
              Book an appointment
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Talk with Us
            </Link>
          </div>
        
          </div>
        </div>
      
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {activeServices.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow">
            We are preparing our service list. Please check back soon or contact the clinic for the latest offerings.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.name}
                text={service.shortDescription ?? service.shortDescription ?? "Personalized medical clinic care."}
                href={`/services/${buildServiceSlug(service)}`}
                image={service.images?.[0] ? `${service.images[0]}` : null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    <Emergency />
    </div>
  );
}
