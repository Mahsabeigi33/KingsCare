import Link from "next/link";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media";
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const items = posts ?? [];

  return (
    <section
      className="relative overflow-hidden rounded-lg"
      style={{ background: "linear-gradient(135deg, #0E2A47 0%, #4B5563 65%)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Insights</p>
            <h2 className="text-3xl font-bold text-white md:text-3xl">Latest Articles</h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-[#D9C89E] hover:underline">
            View all
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 rounded-xl border border-white/20 bg-white/10 p-6 text-sm text-white/80">
            Our team is writing up new guidance. Check back soon for fresh care tips and midical clinic updates.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-white/10 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[16/9] bg-gray-100">
                  {post.image ? (
                    <Image
                      src={resolveMediaUrl(post.image)}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                      width={1200}
                      height={630}
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    {dateFormatter.format(new Date(post.date))}
                  </div>
                  <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900">{post.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#0E2A47]">
                    Read more
                    <span aria-hidden className="ml-1 text-base">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
