import { LucidePhoneCall } from "lucide-react";
import Link from "next/link";

export default function Emergency() {
  return (
              <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
            
              <Link
                href="tel:+14039840255"
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0E2A47]/85 text-[#E6E8EB] shadow-lg shadow-[#0E2A47]/50 backdrop-blur-sm transition hover:bg-[#0E2A47] sm:h-14 sm:w-14"
                aria-label="Call KingsCare"
              >
               
                <LucidePhoneCall className="h-6 w-6 text-[#d9b356] sm:h-6 sm:w-6" />
              </Link>
              <span className="hidden rounded-full bg-[#0E2A47]/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C89E] shadow-lg shadow-[#0E2A47]/30 backdrop-blur-sm sm:inline-block">
                Call Us
              </span>
        </div>
  )};
