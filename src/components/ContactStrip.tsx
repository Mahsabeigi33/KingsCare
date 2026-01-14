import {  MessageSquare } from "lucide-react";
import Emergency from "./Emergency";
import ContactInfo from "./ContactInfo";


type ContactInfoItem = {
  icon: React.ElementType;
  title: string;
  content: string;
  href?: string;
};



export default function ContactStrip() {
  return (
    <section className="bg-gradient-to-b from-white to-[#E6E8EB] py-14 rounded-xl" >
      <div className="mx-auto max-w-6xl px-4 grid  lg:grid-cols-1 lg:items-start  relative">

        
          <div className="min-h-[300px]  pb-12 absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,42,71,0.08),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(217,200,158,0.18),transparent_35%)]" />
          <iframe
            title="Kings Care Medical Clinic Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2511.68015293935!2d-114.0823235!3d50.9851024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5371710529a2581d%3A0x7a8d33ecae953db0!2s7712%20Elbow%20Dr%20SW%2C%20Calgary%2C%20AB%20T2V%201K1!5e0!3m2!1sen!2sca!4v1766524119611!5m2!1sen!2sca"
            className=" w-full rounded-3xl h-80"
            loading="lazy"
          />
          
          
     
        
      </div>
      <Emergency />
    </section>
  );
}
