import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";
import { fetchBlogBySlug, fetchPublishedBlogs } from "@/lib/blogs";
import { resolveMediaUrl } from "@/lib/media";

// Force dynamic rendering to avoid static-generation conflicts coming from session handling in the root layout.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 600;

async function resolvePost(slug: string) {
  try {
    return await fetchBlogBySlug(slug);
  } catch (error) {
    console.error("Unable to load blog post", error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post || !post.published) {
    return {
      title: "Article not found | Kings Care Medical Clinic",
    };
  }

  return {
    title: `${post.title} | Kings Care Medical Clinic`,
    description: post.excerpt ?? "Read clinic insights from the Kings Care team.",
  };
}

function BlogContent({ content }: { content?: string | null }) {
  if (!content) {
    return (
      <p className="text-base leading-relaxed text-slate-600">
        Check back soon – we are updating this article with more detailed guidance.
      </p>
    );
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  if (isHtml) {
    return (
      <div
        className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
      {content.split(/\n{2,}/).map((paragraph, index) => (
        <p key={index}>{paragraph.trim()}</p>
      ))}
    </div>
  );
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await resolvePost(slug);

  if (!post || !post.published) {
    notFound();
  }

  let suggestions = [] as Awaited<ReturnType<typeof fetchPublishedBlogs>>;
  try {
    suggestions = (await fetchPublishedBlogs())
      .filter((item) => item.slug !== post.slug)
      .slice(0, 3);
  } catch (error) {
    console.error("Unable to load related posts", error);
  }
const heroImage = post.imageUrl ?? "/website/Pharmacists.jpg";
  return (
     <div>
          <Nav/>
    <article className="bg-slate-50">
      <div className="relative isolate overflow-hidden bg-slate-900 text-white max-h-500 h-200">
              <Image
                src={resolveMediaUrl(heroImage)}
                alt=""
                fill
                priority
                className="absolute inset-0 object-cover opacity-40"
              />
        {post.imageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={resolveMediaUrl(post.imageUrl)}
              alt={post.title ?? "Featured article background"}
              fill
              className="object-cover opacity-40"
              priority
              sizes="100vw"
              unoptimized
            />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A47]/90 via-[#0E2A47]/70 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Insights</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">{post.title}</h1>
          <p className="mt-4 max-w-3xl text-sm text-white/80 sm:text-base">{post.excerpt}</p>
          <time dateTime={post.createdAt ?? post.updatedAt ?? undefined} className="mt-6 block text-xs uppercase tracking-[0.3em] text-white/60">
            {dateFormatter.format(new Date(post.createdAt ?? post.updatedAt ?? Date.now()))}
          </time>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <BlogContent content={post.content} />

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Back to articles
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#D9C89E] px-4 py-2 text-sm font-semibold text-[#0E2A47] transition hover:bg-[#C7B57A]"
          >
            Speak with Our Team
          </Link>
        </div>

        {suggestions.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-xl font-semibold text-slate-900">Keep reading</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 transition hover:-translate-y-1 hover:border-[#0E2A47]/60 hover:shadow-lg"
                >
                  <p className="text-base font-semibold text-slate-900 group-hover:text-[#0E2A47]">{item.title}</p>
                  <p className="mt-2 line-clamp-3">{item.excerpt ?? "Discover more from our care team."}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
    <Footer/>
    <Emergency />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const posts = await fetchPublishedBlogs();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Unable to pre-build blog posts", error);
    return [];
  }
}
