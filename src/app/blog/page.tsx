import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";
import { fetchPublishedBlogs } from "@/lib/blogs";
import { LucidePhoneOutgoing } from "lucide-react";
import Image from "next/image";
export const revalidate = 600;
export const metadata: Metadata = {
  title: "Blog | Kings Care Medical Clinic",
  description: "advice from Kings Care Medical Clinic.",
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default async function BlogIndexPage() {
  let posts = [] as Awaited<ReturnType<typeof fetchPublishedBlogs>>;

  try {
    posts = await fetchPublishedBlogs();
  } catch (error) {
    console.error("Unable to load blog posts", error);
  }

  return (
     <div>
        <Nav />
 
        <div  className="bg-gradient-to-br from-[#0E2A47] to-[#4B5563] text-white py-20 px-8 lg:px-20 sm:px-4">
          <div className="max-w-6xl mx-auto ml-20 text-center lg:text-left">

            <p className="text-xl font-semibold uppercase tracking-[0.35em] text-white/70">
            Kings Care Blog
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Kings Care Blog</h1>
            <p className="mt-4 max-w-3xl text-sm text-white/80 sm:text-base">
              Stay informed with the latest health tips, clinic updates, and expert advice from the Kings Care team.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-4 text-m font-semibold text-[#0E2A47] transition hover:bg-white/10 bg-[#D9C89E]"
                >
                <LucidePhoneOutgoing className="mr-2 h-4 w-4" />
                  Talk with Us
                </Link>
            </div>
          </div>
        </div>
      <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {posts.length === 0 ? (
          <p className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 shadow">
            No blog posts found. Please check back later.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
              >
                {post.imageUrl ? (
                  <Image
                    src={((): string => {
                      const val = post.imageUrl as string
                      if (val.startsWith("http://") || val.startsWith("https://")) return val
                      if (val.startsWith("/uploads/")) {
                        const base = (process.env.ADMIN_API_BASE_URL || "").replace(/\/$/, "")
                        return `${base}${val}`
                      }
                      return val.startsWith("/") ? val : `/${val}`
                    })()}
                    alt=""
                    className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                    width={1200}
                    height={630}
                  />
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-[#0E2A47]/15 to-[#4B5563]/15" />
                )}
                <div className="flex flex-1 flex-col gap-3 p-6 text-slate-700">
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {dateFormatter.format(new Date(post.createdAt ?? post.updatedAt ?? Date.now()))}
                  </span>
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-[#0E2A47]">{post.title}</h2>
                  <p className="line-clamp-3 text-sm text-slate-600">{post.excerpt ?? "Learn more inside."}</p>
                  <span className="mt-auto inline-flex items-center text-sm font-semibold text-[#0E2A47] border-t  border-[#0E2A47] pt-4">
                    Read article
                    <span aria-hidden className="ml-1 text-base">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
          </div>
          <Footer/>
          <Emergency />
        
    </div>
    </div>
  );
}
