import Image from "next/image";
import ContactInfo from "./ContactInfo";
import { fetchSiteSettings } from '@/lib/site-settings';

// Types
  const siteSettings = await fetchSiteSettings();
  const announcement = siteSettings?.homeHeroAnnouncement ?? null;
const ContactForm = () => {
  return (
     <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
          {announcement ? (
        <div
          className="mb-8 p-8 inline-flex items-center text-[#0E2A47] justify-center rounded-full border border-white/30  px-6 py-4 shadow-xl shadow-red-600 hover:border-[#D9C89E] text-4xl lg:text-5xl pl-20 pt-10 pb-10 font-semibold bg-[#0E2A47]/10 backdrop-blur-lg"
          style={{ fontFamily: 'CalistoMT, serif',
             boxShadow: "0 -16px 30px rgba(255, 56, 56, 0.36), 0 16px 30px rgba(248, 46, 46, 0.63)",
           }}
        >
         {announcement
            .split(/<\/?br\s*\/?>|\\n|\r?\n/i)
            .map((line, index) => (index === 0 ? line : [<br key={`br-${index}`} />, line]))}
        </div>
      ) : null}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image and Contact Info */}
          
          <div className="space-y-6">
            <div className="text-left  mb-12 mt-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold  mb-4 text-[#0E2A47]">
            Get in Touch
          </h2>
          <p className="text-xl sm:text-2xl  text-gray-600  ">
            Have questions about our services? We are here to help. Send us a message and we will respond as soon as possible.
          </p>
        </div>
            {/* Image */}
           <div className="relative aspect-[4/3]  rounded-2xl w-full  overflow-hidden shadow-lg shadow-gray-400 border border-gray-200/20">
              <Image
                src="/website/contact.png"
                alt="Kings Care Medical Clinic contact "
                className="w-full cover absolute object-cover aspect-[4/3]"
                priority
                width={600}
                height={800}
               
              />
            </div>
          </div>

          {/* Right Side - Contact Form */}
          
            <ContactInfo/>    
          
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
