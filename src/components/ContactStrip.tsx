import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import Emergency from "./Emergency";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (587) 327-6106",
    href: "tel:+15873276106",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@kingscare.com",
    href: "mailto:info@kingscare.com",
  },
  {
    icon: MapPin,
    title: "Visit",
    content: "#159 328 Centre Street SE, Calgary, AB",
    href: "https://maps.app.goo.gl/e1dLBNX6KV4KhtRJ6",
  },
  {
    icon: Clock,
    title: "Hours",
    content: "Mon–Fri 9am–6pm · Sat 10am–4pm",
  },
];

type ContactInfoItem = {
  icon: React.ElementType;
  title: string;
  content: string;
  href?: string;
};

const ContactInfoCard = ({ item }: { item: ContactInfoItem }) => {
  const Icon = item.icon;
  const card = (
    <div className="flex items-start gap-4 rounded-2xl border border-[#E6E8EB] bg-white/90 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6E8EB]">
        <Icon className="h-6 w-6 text-[#0E2A47]" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[#0E2A47]">{item.title}</p>
        <p className="text-sm text-[#4B5563]">{item.content}</p>
      </div>
    </div>
  );

  if (item.href) {
    const external = item.href.startsWith("http");
    return (
      <a
        href={item.href}
        className="block"
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {card}
      </a>
    );
  }
  return card;
};

export default function ContactStrip() {
  return (
    <section className="bg-gradient-to-b from-white to-[#E6E8EB] py-14 rounded-xl" >
      <div className="mx-auto max-w-6xl px-4 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-[#E6E8EB]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,42,71,0.08),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(217,200,158,0.18),transparent_35%)]" />
          <iframe
            title="Kings Care Medical Clinic Map"
            src="https://maps.google.com/maps?width=600&height=400&hl=en&q=%20328%20Centre%20Street%20SE%20T2G%204X6&t=&z=14&ie=UTF8&iwloc=B&output=embed"
            className="relative w-full aspect-[30/24] rounded-3xl"
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#0E2A47] shadow-lg backdrop-blur">
            Find us downtown Calgary
          </div>
          
        </div>

        <div className="space-y-4 p-4 rounded-xl"  style={{ background: "linear-gradient(135deg, #0E2A47 0%, #4B5563 65%)" }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0E2A47]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0E2A47]">
            <MessageSquare className="h-4 w-4" />
            Contact
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Reach the care team</h3>
          <p className="text-sm sm:text-base text-white/80" >
            Call, email, or visit us for appointments, refills, travel consults, and personalized advice.
          </p>
          <div className="space-y-3">
            {CONTACT_INFO.map((item, idx) => (
              <ContactInfoCard key={idx} item={item} />
            ))}
          </div>
        </div>
        
      </div>
      <Emergency />
    </section>
  );
}
