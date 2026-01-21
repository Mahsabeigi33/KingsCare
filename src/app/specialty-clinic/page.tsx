import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";
import { fetchSpecialtyClinics } from "@/lib/specialty-clinics";
import { resolveMediaUrl } from "@/lib/media";
import { parseMarkdown } from "@/lib/markdown";
import type { MarkdownBlock } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Specialty Clinic | Kings Care Medical Clinic",
  description:
    "Explore Kings Care Medical Clinic specialty services including ENT care and psychotherapy support.",
};

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
const renderEditorBlocks = (
  blocks: Array<{ type: string; data?: { text?: string; level?: number; items?: string[]; style?: string } }>,
) =>
  blocks.map((block, index) => {
    if (block.type === "paragraph") {
      return (
        <p key={`para-${index}`} dangerouslySetInnerHTML={{ __html: block.data?.text ?? "" }} />
      );
    }
    if (block.type === "header") {
      const level = Math.min(Math.max(block.data?.level ?? 3, 2), 4);
      const Tag = (`h${level}` as "h2" | "h3" | "h4");
      return (
        <Tag
          key={`header-${index}`}
          className="font-semibold text-[#0E2A47]"
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
              <li key={`item-${index}-${itemIndex}`} dangerouslySetInnerHTML={{ __html: content }} />
            );
          })}
        </Tag>
      );
    }
    return null;
  });

type SpecialtyDisplay = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: { label: string; href: string };
  isEditorDescription?: boolean;
  isHtmlDescription?: boolean;
  descriptionBlocks?: MarkdownBlock[];
  editorData?: { blocks?: Array<{ type: string; data?: { text?: string; level?: number; items?: string[]; style?: string } }> } | null;
};

const FALLBACK_SPECIALTIES: SpecialtyDisplay[] = [
  {
    id: "ent",
    title: "ENT Clinic",
    subtitle: "Nasal and Sinus Care",
    description:
      "KingsCare Medical Clinic is pleased to welcome Dr. Kristina Zakhary - ENT Surgeon - to our team, offering specialized care for nasal and sinus conditions. The surgeon will provide expert assessment and treatment for septal deviation through septoplasty, management of acute and chronic sinus infections, and functional and cosmetic rhinoplasty. Patients can expect thorough evaluation, individualized treatment planning, and advanced surgical techniques in a modern clinical setting. These services aim to improve breathing, relieve sinus-related symptoms, and enhance nasal form and function, supporting both medical and quality-of-life outcomes.",
   
    image: "/website/ENT.png",
     cta: { label: "Contact Us", href: "/contact" },
  },
  // {
  //   id: "psychotherapy",
  //   title: "Psychotherapy",
  //   subtitle: "Mental Health & Wellness",
  //   description:
  //     "Confidential support for stress, anxiety, mood changes, and life transitions. Sessions focus on practical tools, coping strategies, and long-term wellbeing.",
  //   highlights: [
  //     "Stress, burnout, and anxiety support",
  //     "Depression and mood management",
  //     "Grief, life transitions, and relationships",
  //     "Goal-setting and coping strategies",
  //   ],
  //   image: "/website/psychotherapist.png",
  //   cta: { label: "Contact Us", href: "/contact" },
  // },
];

export default async function SpecialtyClinicPage() {
  let specialties: SpecialtyDisplay[] = FALLBACK_SPECIALTIES;
  try {
    const clinics = await fetchSpecialtyClinics();
    if (clinics.length > 0) {
      specialties = clinics.map((clinic) => ({
        id: clinic.id,
        title: clinic.title,
        subtitle: clinic.name,
        description: clinic.description,
        isEditorDescription: isEditorJs(clinic.description),
        isHtmlDescription: !isEditorJs(clinic.description) && containsHtml(clinic.description),
        descriptionBlocks: !isEditorJs(clinic.description) && !containsHtml(clinic.description)
          ? parseMarkdown(clinic.description)
          : [],
        editorData: isEditorJs(clinic.description) ? safeParse(clinic.description) : null,
        image: resolveMediaUrl(clinic.image, {
          cacheKey: clinic.updatedAt ?? clinic.createdAt ?? null,
        }),
        cta: { label: "Contact Us", href: "/contact" },
      }));
    }
  } catch (error) {
    console.error("Unable to load specialty clinics", error);
  }

  return (
    <div className="bg-slate-50">
      <Nav />

      <section className="relative  w-full overflow-hidden hidden">
        <div className="absolute inset-0">
          <Image
            src="/website/setethoscope.png"
            alt="Clinic reception background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E2A47]/95 via-[#0E2A47]/75 to-transparent" />
        </div>

        <div className="max-w-6xl relative mx-auto flex min-h-[40vh]  flex-col justify-center px-4  text-white mt-12">
         
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Specialty Clinic</h1>
          <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
            Focused care for ENT and mental wellness, delivered with the same Kings Care compassion and attention to detail.
          </p>
         
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10">
          {specialties.map((specialty, index) => (
            <div
              key={specialty.id}
              className={`grid gap-8 rounded-3xl border border-white/10 bg-white p-6 shadow-xl sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${
                index % 2 === 1 ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <Image
                  src={specialty.image}
                  alt={`${specialty.title} care`}
                  width={600}
                  height={540}
                  className="h-96 w-full rounded-3xl object-cover md:h-100 lg:h-110"
                />
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0E2A47]/70">
                  {specialty.subtitle}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-[#0E2A47]">{specialty.title}</h2>
                {specialty.isEditorDescription && specialty.editorData?.blocks ? (
                  <div className="menu-scrollbar mt-4 max-h-93 overflow-y-auto pr-2 text-base text-slate-600 space-y-3">
                    {renderEditorBlocks(specialty.editorData.blocks)}
                  </div>
                ) : specialty.isHtmlDescription ? (
                  <div
                    className="menu-scrollbar mt-4 max-h-64 overflow-y-auto pr-2 text-base text-slate-600 space-y-3"
                    dangerouslySetInnerHTML={{ __html: specialty.description }}
                  />
                ) : specialty.descriptionBlocks?.length ? (
                  <div className="menu-scrollbar mt-4 max-h-64 overflow-y-auto pr-2 text-base text-slate-600 space-y-3">
                    {specialty.descriptionBlocks.map((block, index) =>
                      block.type === "list" ? (
                        <ul key={`list-${index}`} className="list-disc pl-6 space-y-1">
                          {block.items.map((item: string, itemIndex: number) => (
                            <li key={`item-${index}-${itemIndex}`}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p key={`para-${index}`}>{block.text}</p>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="menu-scrollbar mt-4 max-h-64 overflow-y-auto pr-2 text-base text-slate-600">
                    {stripHtml(specialty.description)}
                  </p>
                )}
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={specialty.cta.href}
                    className="inline-flex items-center justify-center rounded-full bg-[#0E2A47] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1B3E5C]"
                  >
                    {specialty.cta.label}
                  </Link>
                 
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <Emergency />
    </div>
  );
}
