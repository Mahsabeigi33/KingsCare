import Link from "next/link";
import Image from "next/image";
import { LucideClipboardClock, LucideHouse, LucideLocate, LucideMapPin, LucidePhone, LucidePrinter } from "lucide-react";
export default function Footer() {
  return (
    // <footer className="bg-gradient-to-br from-[#0E2A47] to-[#4B5563] text-white mt-20">
    <footer className="bg-[#0E2A47] text-white ">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
        <div>
          <div className="text-white font-semibold"><Image height={200} width={200} className="border-4 rounded-full border-[#d9b356]" src="/website/Logo.png" alt="Kings Care Medical Clinic" /></div>
          <p className="mt-2 text-larg"></p>
        </div>
        <div className="text-xl sm:text-center">
          <h3 className="font-semibold text-2xl text-[#d9b356] mb-2">Links</h3>
          <ul>
            <li className="mb-4"><Link href="/" className="hover:text-[#D9C89E]">Home</Link></li>
            <li className="mb-4" ><Link href="/about" className="hover:text-[#D9C89E]">About</Link></li>
            <li className="mb-4"><Link href="/services" className="hover:text-[#D9C89E]">Services</Link></li>
            {/* <li><Link href="/blog" className="hover:text-[#D9C89E]">Blogs</Link></li> */}
            <li ><Link href="/contact" className="hover:text-[#D9C89E]">Contact</Link></li>
          </ul>
        </div>
        <div className="text-larg sm:text-center mt-6 ">
          <div className="flex mb-4 "><LucideClipboardClock className="text-[#d9b356] mr-2 text-xl"/> <p>Mon–Fri 8:30-17:00 • Sat 9:00-14:00</p> </div>
          <div  className="flex mb-4 "><LucideMapPin className="text-[#d9b356] mr-2 text-xl"/> <p>7712 Elbow Dr. SW, Calgary, AB, T2V 1K2</p></div>
          <div  className="flex mb-4 "><LucidePhone className="text-[#d9b356] mr-2 text-xl"/><a className="hover:text-[#D9C89E]" href="tel:5876">+1 (403) 984-0255</a> </div>
          
          <div  className="flex"><LucidePrinter className="text-[#d9b356] mr-2 text-xl"/><a className="hover:text-[#D9C89E]" href="tel:5876">+1 (403) 984-0256</a></div>
        </div>
        
      </div>
      <div className="!bg-[#0E2A47]/20 sm:text-sm text-white text-larg text-center border-t border-black/10 py-4 px-4  justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Kings Care Medical Clinic</p>
           <ul>
            <li><Link href="/privacy" className="hover:text-[#D9C89E] ">Privacy • Terms</Link></li>
            </ul>
      </div>
    </footer>
  );
}
