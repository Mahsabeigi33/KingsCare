import { Phone, Mail, MapPin, Clock, MessageSquare,Printer } from "lucide-react";
import Emergency from "./Emergency";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (403) 984-0255",
    href: "tel:+14039840255",
  },
  {
    icon: Printer,
    title: "Fax",
    content: "+1  (403) 984-0256",
    href: "fax:+14039840256",
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
    content: "7712 Elbow Dr. SW, Calgary, AB, T2V 1K2",
    href: "https://maps.app.goo.gl/U2fuSG5iXC1xCcKF7",
  },
  {
    icon: Clock,
    title: "Hours",
    content: "Mon–Fri 8:30-17:00 • Sat 9:00-14:00 • Sun Closed",
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2511.68015293935!2d-114.0823235!3d50.9851024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5371710529a2581d%3A0x7a8d33ecae953db0!2s7712%20Elbow%20Dr%20SW%2C%20Calgary%2C%20AB%20T2V%201K1!5e0!3m2!1sen!2sca!4v1766524119611!5m2!1sen!2sca"
            className="relative w-full aspect-[33/30] rounded-3xl"
            loading="lazy"
          />
          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#0E2A47] shadow-lg backdrop-blur">
            Find us downtown Calgary
          </div>
          
        </div>

        <div className="space-y-4 p-4 rounded-xl"  style={{ background: "linear-gradient(135deg, #0E2A47 0%, #4B5563 65%)" }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0E2A47]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D9C89E]">
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
