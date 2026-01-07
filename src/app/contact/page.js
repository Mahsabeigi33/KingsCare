"use client";
import ContactForm from '@/components/ContactForm';
import ContactStrip from '@/components/ContactStrip';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
export default function ContactPage() {
  return (
    <div>
     <Nav />
        
      <ContactForm />
       <ContactStrip />
       <Footer />
    </div>
  );
}
