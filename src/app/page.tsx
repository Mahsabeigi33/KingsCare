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
import WhyChoose from "@/components/WhyChoose";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Kings Care Medical Clinic - Telemedicine & Travel Health",
  description:
    "Book telemedicine consults, travel vaccinations, injections, refills, and more. Trusted pharmacists and convenient online care.",
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

  try {
    [services, blogPosts] = await Promise.all([
      fetchServices(),
      fetchPublishedBlogs(3),
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
  }));
  const blogEntries = blogPosts.map(buildBlogPreview);

  return (
    <>
      <Nav />
      <Hero cards={scrollerCards} />
      <WhyChoose />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <AboutTeaser />

        <div className="mt-12">
          <ServicesGrid services={serviceCards} />
        </div>

        <div className="mt-12">
          <BlogList posts={blogEntries} />
        </div>

        <section aria-labelledby="contact-heading" className="mt-12">
          <h2 id="contact-heading" className="sr-only">
            Contact & Hours
          </h2>
          <ContactStrip />
          
       
        </section>

      </main>

      <Footer />
    </>
  );
}
