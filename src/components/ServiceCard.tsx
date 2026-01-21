import type { ReactNode } from "react";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image"
import { resolveMediaUrl } from "@/lib/media"

import { cn } from "@/lib/cn";
export default function ServiceCard({
  title,
  text,
  href,
  icon,
  image,
  imageCacheKey,
}: {
  title: string;
  text: string;
  href: string;
  icon?: ReactNode;
  image?: string | null;
  imageCacheKey?: string | number | null;
}) {
  const toInitials = (val: string) => {
    try {
      const words = val
        .normalize("NFC")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => Array.from(w)[0] ?? "")
      const joined = words.join("").toLocaleUpperCase("en-US")
      return joined || "#"
    } catch {
      return "#"
    }
  }
  const iconDisplay =
    icon ?? (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0E2A47]/10 text-sm font-semibold uppercase text-[#0E2A47]">
        {toInitials(title)}
      </span>
    );
  const plainText = text ? plainTextFromEditor(text) : "";

  function plainTextFromEditor(value: string) {
    const parsed = safeParse(value);
    if (!parsed || !Array.isArray(parsed.blocks)) {
      return stripHtml(value);
    }
    const textBlocks = parsed.blocks
      .map((block: { data?: { text?: string; items?: Array<string | { content?: string }> } }) => {
        if (block?.data?.text) return stripHtml(String(block.data.text));
        if (Array.isArray(block?.data?.items)) {
          return block.data.items
            .map((item) => {
              if (typeof item === "string") return stripHtml(item);
              if (item && typeof item === "object" && "content" in item) {
                return stripHtml(String(item.content ?? ""));
              }
              return stripHtml(String(item));
            })
            .join(" ");
        }
        return "";
      })
      .join(" ");
    return stripHtml(textBlocks);
  }

  function stripHtml(value: string) {
    return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  }

  function safeParse(value: string) {
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
  }

  return (
    ///old version
    // <Link
    //   href={href}
    //   className={cn(
    //     "group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-soft transition hover:-translate-y-2  hover:shadow-xl hover:shadow-[#0E2A47]/50 group",
    //   )}
    // >
    //   <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#D9C89E]/20 to-[#0E2A47]/10 aspect-[4/4] ">
    //     {image ? (
    //       <Image
    //         src={resolveMediaUrl(image, { cacheKey: imageCacheKey })}
    //         alt={`${title} service illustration`}
    //         className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
    //         loading="lazy"
    //         fill
    //         style={{ objectFit: "cover" }}
    //         sizes="(max-width: 640px) 150vw, (max-width: 1024px) 50vw, 360px"
    //       />
    //     ) : (
    //       <div className="flex h-full w-full items-center justify-center text-4xl text-[#0E2A47]/30">
    //         {iconDisplay}
    //       </div>
    //     )}
    //   </div>

    //   <div className="flex flex-1 flex-col gap-4 p-6">
    //     <div className="flex items-start gap-3 text-[#0E2A47]">
          
    //       <div>
    //         <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    //         <p className="mt-2 text-sm text-gray-600">{plainText}</p>
    //       </div>
    //     </div>

    //     <div className="mt-auto inline-flex w-max items-center gap-2 rounded-full border border-[#0E2A47] bg-white px-4 py-1.5 text-sm font-semibold text-[#0E2A47] transition group-hover:bg-[#0E2A47] group-hover:text-white">
    //       Explore
    //       <ArrowRight className="h-4 w-4" />
    //     </div>
    //   </div>
    // </Link>
    <Link
      href={href}
      className={cn(
        "group flex h-full w-max-3xl flex-col overflow-hidden rounded-4xl border border-gray-200 bg-[#d9b356] text-[#0E2A47]  transition hover:-translate-y-2  hover:shadow-xl hover:shadow-[#0E2A47]/80 shadow-soft group ",
      )}
    >

      <div className="flex flex-1 flex-col gap-4 p-6 text-center justify-center mx-auto">
        
          
          <div>
            <h3 className="text-lg font-semibold text-center justify-center ">{title}</h3>
            <p className="mt-2 text-sm text-center justify-center">{plainText}</p>
          </div>

        <div className="mt-auto mx-auto text-center justify-center inline-flex w-max items-center gap-2 rounded-full border border-[#0E2A47] bg-[#0E2A47] px-4 py-1.5 text-sm font-semibold text-white transition group-hover:bg-white group-hover:text-[#0E2A47]">
          Explore
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
