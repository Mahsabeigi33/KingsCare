import { LucidePhoneCall } from "lucide-react";
import Link from "next/link";

export default function Emergency() {
  return (
        <div className="fixed right-4 bottom-2 mx-4 bg-[#0E2A47]/70 backdrop-blur-sm  text-white rounded-full hover:bg-[#0E2A47] shadow-[#0E2A47]/80 transition-colors p-4 shadow-lg sm:p-2  items-center mx-auto max-w-xl sm:max-w-sm md:max-w-md px-4 flex flex-col  justify-between">
             
              
              <Link
                href="tel:+14039840255"
                className="inline-block text-[#E6E8EB] font-semibold px-4  lg:xl:px-6 lg:xl:py-4 py-2 rounded-full "
              >
                <span className="mb-2 text-[#D9C89E]">Call Us</span>
                <LucidePhoneCall className=" h-10 w-10 text-[#d9b356]" />
                
              </Link>
        </div>
  )};
