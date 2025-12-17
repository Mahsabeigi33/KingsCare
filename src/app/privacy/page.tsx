import type { Metadata } from "next";
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
export const metadata: Metadata = {
  title: "Privacy & Terms | Kings Care Medical Clinic",
  description: "Our privacy policy and terms of service.",
};

export default function PrivacyPage() {
  return (
    <main >
         <Nav />
         <div className="mx-auto  mt-6 max-w-6xl px-4 py-16 prose prose-slate">
      <h1>Privacy Policy</h1>
     
      </div>
       <Footer />
    </main>
  );
}

