import type { Metadata } from "next";
import Link from "next/link";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Emergency from "@/components/Emergency";

export const metadata: Metadata = {
  title: "Not Available | Kings Care Medical Clinic",
  description: "This page is not available right now. Please check back soon.",
};

export default function NotAvailablePage() {
  return (
    <div>
      <Nav />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0E2A47] via-[#0E2A47]/90 to-[#4B5563] py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,200,158,0.18),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            Temporarily unavailable
          </p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
            This page is not available right now
          </h1>
          <p className="mt-4 text-base text-white/85 sm:text-lg">
            We are working on updates to this area. Please check back soon or reach out to
            the clinic for the latest information.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#D9C89E] px-6 py-3 text-sm font-semibold text-[#0E2A47] shadow hover:bg-[#C7B57A]"
            >
              Back to home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contact the clinic
            </Link>
          </div>
        </div>
      </section>

 

      <Footer />
      <Emergency />
    </div>
  );
}
