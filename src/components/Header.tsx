import Link from "next/link";
import { Button } from "./Button";

export default function Header() {
  return (
    <header className="bg-grayd text-white">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-wide">Kings Care Medical Clinic</Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/travel" className="hover:underline">Travel Clinic</Link>
          <Link href="/refill" className="hover:underline">Refill</Link>
          <Link href="/transfer" className="hover:underline">Transfer</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
        <Link href="/book" passHref>
          <Button variant="secondary" aria-label="Book Appointment">
            Book Appointment
          </Button>
        </Link>
      </div>
    </header>
  );
}
