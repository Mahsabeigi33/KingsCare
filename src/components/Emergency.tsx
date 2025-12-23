import { LucidePhoneCall } from "lucide-react";
import Link from "next/link";

export default function Emergency() {
  return (
        <div className="fixed right-4 bottom-2 mx-4 bg-[#0E2A47]/70 backdrop-blur-sm leading-relaxed  text-white rounded-full hover:bg-[#0E2A47] transition-colors p-4 shadow-lg  items-center mx-auto max-w-xl px-4 flex flex-col  justify-between">
             
              
              <Link
                href="tel:+14039840255"
                className="inline-block text-[#E6E8EB] font-semibold px-6 py-3 rounded-full "
              >
                <LucidePhoneCall className=" h-10 w-10 text-[#D9C89E]" />
                
              </Link>
        </div>
  )};
