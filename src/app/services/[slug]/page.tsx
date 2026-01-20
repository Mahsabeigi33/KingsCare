import type { Metadata } from "next";
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

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 600;

const containsHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);
const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const safeParse = (value: string) => {
  if (!value) return null;
  const trimmed = value.trim();
  const tryParse = (input: string) => {
    try {
      return JSON.parse(input);
    } catch {
      return null;
    }
  };
  const cleaned = trimmed.replace(/\\+$/, "");
  const parsed = tryParse(trimmed) ?? tryParse(cleaned);
  if (typeof parsed === "string") {
    const nested = tryParse(parsed) ?? tryParse(parsed.replace(/\\+$/, ""));
    return nested ?? parsed;
  }
  return parsed;
};
const isEditorJs = (value: string) => {
  const parsed = safeParse(value);
  return Boolean(parsed && Array.isArray(parsed.blocks));
};
const plainTextFromEditor = (value: string) => {
  const parsed = safeParse(value);
  if (!parsed || !Array.isArray(parsed.blocks)) return stripHtml(value);
  const text = parsed.blocks
    .map((block: { data?: { text?: string; items?: string[] } }) => {
      if (block?.data?.text) return stripHtml(String(block.data.text));
      if (Array.isArray(block?.data?.items)) {
        return block.data.items
          .map((item) => {
            if (typeof item === "string") return stripHtml(item);
            if (item && typeof item === "object" && "content" in item) {
              return stripHtml(String((item as { content?: string }).content ?? ""));
            }
            return stripHtml(String(item));
          })
          .join(" ");
      }
      return "";
    })
    .join(" ");
  return stripHtml(text);
};
const renderEditorBlocks = (blocks: Array<{ type: string; data?: { text?: string; level?: number; items?: string[]; style?: string } }>) =>
  blocks.map((block, index) => {
    if (block.type === "paragraph") {
      return (
        <p
          key={`para-${index}`}
          dangerouslySetInnerHTML={{ __html: block.data?.text ?? "" }}
        />
      );
    }
    if (block.type === "header") {
      const level = Math.min(Math.max(block.data?.level ?? 3, 2), 4);
      const Tag = (`h${level}` as "h2" | "h3" | "h4");
      return (
        <Tag
          key={`header-${index}`}
          className="font-semibold text-white/95"
          dangerouslySetInnerHTML={{ __html: block.data?.text ?? "" }}
        />
      );
    }
    if (block.type === "list") {
      const isOrdered = block.data?.style === "ordered";
      const Tag = (isOrdered ? "ol" : "ul") as "ol" | "ul";
      const items = block.data?.items ?? [];
      const listClass = isOrdered ? "list-decimal" : "list-disc";
      return (
        <Tag key={`list-${index}`} className={`${listClass} pl-6 space-y-1`}>
          {items.map((item, itemIndex) => {
            const content =
              typeof item === "string"
                ? item
                : item && typeof item === "object" && "content" in item
                  ? String((item as { content?: string }).content ?? "")
                  : String(item);
            return (
              <li
                key={`item-${index}-${itemIndex}`}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            );
          })}
        </Tag>
      );
    }
    return null;
  });

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
    description: plainTextFromEditor(
      service.description ?? `Learn more about ${service.name} at Kings Care Medical Clinic.`,
    ),
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
  const description = service.description ?? "";
  const isEditorDescription = isEditorJs(description);
  const isHtmlDescription = !isEditorDescription && containsHtml(description);
  const descriptionBlocks = isEditorDescription || isHtmlDescription ? [] : parseMarkdown(description);
  const editorData = isEditorDescription ? safeParse(description) : null;

  return (
    <div>
      <Nav/>
    
      <div className="relative isolate min-h-screen overflow-hidden bg-slate-900 text-white">
        <Image
          src={resolvedHeroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover opacity-35 hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E2A47]/95 via-[#0E2A47]/75 to-transparent" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pt-20">
          <div className="grid w-full items-stretch gap-4 lg:gap-12 md:gap-10 lg:grid-cols-2 pb-8">
            <div
              className="space-y-5 h-[280px] sm:h-[360px] md:h-[360px] lg:h-[520px] overflow-y-auto pl-4 [&::-webkit-scrollbar]:hidden "
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <span className="text-xs uppercase tracking-[0.35em] text-white/70">Service overview</span>
              <h1 className="text-2xl font-semibold leading-tight  md:lg:text-4xl">{service.name}</h1>
              {isEditorDescription && editorData?.blocks ? (
                <div className="max-w-3xl text-base text-white/85 sm:text-lg space-y-3">
                  {renderEditorBlocks(editorData.blocks)}
                </div>
              ) : isHtmlDescription ? (
                <div
                  className="max-w-3xl text-base text-white/85 sm:text-lg space-y-3"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : descriptionBlocks.length ? (
                <div className="max-w-3xl text-base text-white/85 sm:text-lg space-y-3">
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
                <p className="max-w-3xl text-base text-white/80 sm:text-lg">
                  Personalized medical clinic care tailored to your goals.
                </p>
              )}
            </div>
               <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl h-[280px] sm:h-[360px] md:h-[470px] lg:h-[520px] bg-slate-900/30">
              <Image
                src={resolvedHeroImage}
                alt={`${service.name} hero`}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
              />
             
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
