import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    // <footer className="bg-gradient-to-br from-[#0E2A47] to-[#4B5563] text-white mt-20">
    <footer className="bg-white/50 text-[#0E2A47] ">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3">
        <div>
          <div className="text-white font-semibold"><Image height={200} width={200} className="border-4 rounded-full border-[#0E2A47]" src="/website/logo-footer.png" alt="Kings Care Medical Clinic" /></div>
          <p className="mt-2 text-larg"></p>
        </div>
        <div className="text-larg sm:text-center">
          <h3 className="font-semibold text-2xl  mb-2">Links</h3>
          <ul>
            <li><Link href="/" className="hover:text-[#D9C89E]">Home</Link></li>
            <li><Link href="/about" className="hover:text-[#D9C89E]">About</Link></li>
            <li><Link href="/services" className="hover:text-[#D9C89E]">Services</Link></li>
            <li><Link href="/blog" className="hover:text-[#D9C89E]">Blogs</Link></li>
            <li><Link href="/contact" className="hover:text-[#D9C89E]">Contact</Link></li>
          </ul>
        </div>
        <div className="text-larg sm:text-center mt-6 ">
          <p>Mon–Fri 9–6 • Sat 10–4</p>
          <p> 328 Centre Street SE T2G 4X6 #159 </p><p>Calgary ,AB</p>
          <a className="hover:text-[#D9C89E]" href="tel:5873276106">+1 (587)3276106</a>
        </div>
        
      </div>
      <div className="bg-[#0E2A47]/80 sm:text-sm text-white text-larg text-center border-t border-black/10 py-4 px-4  justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Kings Care Medical Clinic</p>
           <ul>
            <li><Link href="/privacy" className="hover:text-[#D9C89E] ">Privacy • Terms</Link></li>
            </ul>
      </div>
    </footer>
  );
}
