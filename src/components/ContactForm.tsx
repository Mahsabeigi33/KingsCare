import Image from "next/image";
import ContactInfo from "./ContactInfo";
import { fetchSiteSettings } from '@/lib/site-settings';

// Types
  const siteSettings = await fetchSiteSettings();
  const announcement = siteSettings?.homeHeroAnnouncement ?? null;
   const announcementLines = announcement
    ? announcement.split(/<\/?br\s*\/?>|\\n|\r?\n/i)
    : [];
    
const ContactForm = () => {
  return (
     <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
          {announcement ? (
            <div
              className="mb-8 pl-12 py-10 sm:pl-16  md:pl-16 md:pr-6 md:pt-8 sm:pl-10 sm:pt-6 lg:pt-8 lg:pb-10 
              inline-flex items-center justify-center
              rounded-full border border-white/30
              text-xl pr-4  md:text-2xl lg:text-3xl xl:text-4xl font-semibold
              text-[#0E2A47]
              bg-[#0E2A47]/10 backdrop-blur-lg
              hover:border-[#D9C89E]
              transition-all duration-1000 ease-in-out delay-[50ms]
              ${entered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}"
              style={{
                transition: "opacity 1s ease 0.05s, transform 1s ease 0.05s",
                boxShadow: "0 -16px 30px rgba(255, 56, 56, 0.35), 0 16px 30px rgba(255, 56, 56, 0.69)",
                fontFamily: "CalistoMT ,serif",
              }}
            >
              <ul className="list-disc pl-6">
                {announcementLines.map((line, index) => (
                  <li key={`announcement-${index}`}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image and Contact Info */}
          
          <div className="space-y-6">
            <div className="text-left  mb-12 mt-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold  mb-4 text-[#0E2A47] ">
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
