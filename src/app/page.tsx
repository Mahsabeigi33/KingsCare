import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AboutTeaser from "@/components/About";
import ServicesGrid from "@/components/ServicesGrid";
import BlogList from "@/components/BlogList";
import ContactStrip from "@/components/ContactStrip";
import Footer from "@/components/Footer";
import type { ServicesListItem } from "@/components/ServicesGrid";
import { fetchPublishedBlogs } from "@/lib/blogs";
import { buildServiceSlug, fetchServices } from "@/lib/services";
import { fetchSiteSettings } from "@/lib/site-settings";
import WhyChoose from "@/components/WhyChoose";
import TeamMember from "@/components/TeamMember";
export const revalidate = 1800;
import Link from "next/link";
import ContactInfo from "@/components/ContactInfo";
export const metadata: Metadata = {
  title: "Kings Care Medical Clinic - Telemedicine & Travel Health",
  description:
    ".",
  openGraph: {
    title: "Kings Care Medical Clinic - Telemedicine & Travel Health",
    description: "Trusted care for every journey. Book online in minutes.",
    images: ["/website/og-hero.jpg"],
  },
};

function buildServiceCard(service: Awaited<ReturnType<typeof fetchServices>>[number]): ServicesListItem {
  return {
    title: service.name,
    text: service.shortDescription ?? service.shortDescription ?? "Personalized care from Kings Care Medical Clinic.",
    href: `/services/${buildServiceSlug(service)}`,
    image: service.images?.[0] ?? null,
    imageCacheKey: service.updatedAt ?? service.createdAt ?? null,
  };
}

function buildBlogPreview(post: Awaited<ReturnType<typeof fetchPublishedBlogs>>[number]) {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "Read the latest guidance from the Kings Care Medical Clinic team.",
    date: post.createdAt ?? post.updatedAt ?? new Date().toISOString(),
    image: post.imageUrl ?? null,
  };
}

export default async function HomePage() {
  let services: Awaited<ReturnType<typeof fetchServices>> = [];
  let blogPosts: Awaited<ReturnType<typeof fetchPublishedBlogs>> = [];
  let siteSettings: Awaited<ReturnType<typeof fetchSiteSettings>> = null;

  try {
    [services, blogPosts, siteSettings] = await Promise.all([
      fetchServices(),
      fetchPublishedBlogs(3),
      fetchSiteSettings(),
    ]);
  } catch (error) {
    console.error("Failed to load marketing content", error);
  }

  const activeServices = services.filter((service) => service.active && !service.parent);
  const serviceCards: ServicesListItem[] = activeServices.map(buildServiceCard);
  const scrollerCards = activeServices.slice(0, 12).map((service) => ({
    title: service.name,
    text: service.shortDescription ?? "Personalized care from Kings Care Medical Clinic.",
    href: `/services/${buildServiceSlug(service)}`,
    image: service.images?.[0] ?? null,
    imageCacheKey: service.updatedAt ?? service.createdAt ?? null,
  }));
  const blogEntries = blogPosts.map(buildBlogPreview);

  return (
    <>
      <Nav />
      <Hero cards={scrollerCards} announcement={siteSettings?.homeHeroAnnouncement ?? null} />
      
      <main className="mx-auto px-4 py-12">
        <div className="w-full mx-auto scroll-mt-16" id="about">
           <AboutTeaser  />
        </div>
       
        {/* Team Section */}
      
        <div className="mt-12">
          <ServicesGrid services={serviceCards} />
        </div>
        <div className="w-7xl-max mx-auto mt-16">
        <h3 className="mb-4 text-3xl font-bold text-[#0E2A47] md:text-4xl text-center">Meet Our Team</h3>
        <p className="mb-12 text-gray-900 text-center">
          Our experienced healthcare professionals are dedicated to providing you with expert
          guidance and compassionate care.
        </p>
        <TeamMember />
        </div>
       
        <div className="mt-12">
          {/* <BlogList posts={blogEntries} /> */}
        </div>

        <section aria-labelledby="contact-heading" className="mt-12 mx-auto max-w-7xl px-4 ">
          <h2 id="contact-heading" className="sr-only">
            Contact & Hours
          </h2>
          <div className="bg-[#d9b356] rounded-full py-8 px-4  text-center mb-8 backdrop-blur-lg "  style={{
              transition: "opacity 1s ease 0.05s, transform 1s ease 0.05s",
              boxShadow: "0 0 18px rgba(173, 38, 38, 0.77), 0 0 36px rgba(240, 8, 20, 0.35)",
              animation: "glowPulse 2.2s ease-in-out infinite",
              fontFamily: "CalistoMT ,serif",
            }}>
             <p className=" text-[#0E2A47] text-xl md:text-3xl lg:text-4xl  font-semibold
            hover:border-[#D9C89E] "
           
            >
              Please note that our email and phone lines are not currently operational.
              </p>
            </div>
          
          <div className="grid lg:grid-cols-2 gap-8  items-start">            
            <ContactInfo/>
            <div>
           
          <ContactStrip />
            </div>
           
          
          </div>
          <div className="w-full mt-8">
            <Link
              href="/contact"
              className="flex max-w-5xl items-center mx-auto justify-center rounded-full bg-[#0E2A47] px-5 py-4 text-sm font-semibold text-white text-center shadow-xl shadow-[#0E2A47]/30 transition hover:bg-[#C7B57A] hover:text-[#0E2A47] hover:shadow-[#C7B57A]/30"
            >
              Contact Us
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
