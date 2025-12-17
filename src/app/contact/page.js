"use client";
import ContactForm from '@/components/ContactForm';
import ContactStrip from '@/components/ContactStrip';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
export default function ContactPage() {
  return (
    <div>
     <Nav />
        <div  className="bg-gradient-to-br from-[#0E2A47] to-[#4B5563] text-white lg:px-20 sm:px-4 py-20 ">
           <div className="max-w-6xl mx-auto px-4 text-center lg:text-left">
            <h2 className="text-xl font-semibold uppercase tracking-[0.35em] text-white/70">
              Contact Us
              </h2>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Contact with Kings Care Medical Clinic
              </h1>
            <p className="mt-4 max-w-3xl text-sm text-white/80 sm:text-base">
              We are here to help with all your healthcare needs. Reach out to us for personalized service and expert advice.
            </p>
          </div>
        </div>
      {/* Contact Form Section */}
      <ContactForm />
       <ContactStrip />
       <Footer />
    </div>
  );
}
