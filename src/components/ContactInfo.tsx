import { Phone, Mail, MapPin, Clock,Printer,MessageSquare } from "lucide-react";
import { LucideIcon } from "lucide-react";

type ContactInfoItem = {
  icon: LucideIcon;
  title: string;
  content: string;
  href?: string;
};

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
    content: "info@kingscare.ca",
    href: "mailto:info@kingscare.ca",
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
export default function ContactInfo() {
  return (
     <div className="space-y-4 p-10 rounded-xl"  style={{ background: "linear-gradient(135deg, #0E2A47 0%, #4B5563 65%)" }}>
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
  );
}