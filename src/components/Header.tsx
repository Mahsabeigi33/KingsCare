import Link from "next/link";
import { Button } from "./Button";

export default function Header() {
  return (
    <header className="bg-grayd text-white">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-wide">Kings Care Medical Clinic</Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/about" className="hover:underline">About </Link>
          <Link href="/team" className="hover:underline">Our Team</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/contact" className="hover:underline">Contact Us</Link>
        </nav>
        <Link href="/appointment" passHref>
          <Button variant="secondary" aria-label="Book Appointment">
            Book Appointment
          </Button>
        </Link>
      </div>
    </header>
  );
}
