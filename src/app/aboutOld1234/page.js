
import { Heart, Shield, Clock, Users, Award } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import TeamMember from '@/components/TeamMember';
const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy, dignity, and personalized attention, recognizing that each individual’s health journey is unique.'
    },
    {
      icon: Shield,
      title: 'Trust & Integrity',
      description: 'Your health and privacy come first. We provide honest medical guidance, maintain strict confidentiality, and act in your best interest at every visit.'
    },
    {
      icon: Clock,
      title: 'Accessible Service',
      description: 'We prioritize timely care through walk-in availability, same-day appointments, and efficient scheduling designed around our patients’ needs.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We are proud to be a community-focused medical clinic, supporting the health and wellbeing of families and individuals in our neighborhood.'
    }
  ];

  
  return (
     <div>
         <Nav />
          <div  className="bg-gradient-to-br from-[#0E2A47] to-[#4B5563] text-white py-20 lg:px-20 sm:px-4 py-20">
                   <div className="max-w-6xl mx-auto px-4  text-center lg:text-left">
                   
                    <p className="text-xl font-semibold uppercase tracking-[0.35em] text-white/70">
                    About Us
                  </p>
                   
                   <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                    About Kings Care Medical Clinic
                   </h1>
                  <div className="mt-6 flex flex-wrap gap-3 items-center justify-center lg:justify-start">            
                     <Link
                       href="/contact"
                       className="inline-flex items-center justify-center rounded-full bg-[#D9C89E] border border-white/70 px-5 py-4 text-sm font-semibold text-[#0E2A47] transition hover:bg-[#C7B57A] hover:border-white/90 focus:outline-none focus:ring-2 focus:ring-[#D9C89E] focus:ring-offset-2 hover:shadow-lg shadow-xl shadow-[#D9C89E]/30"
                     >
                       Get in Touch
                     </Link>
                   </div>
                 
                   </div>
          </div>
        


      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                We believe healthcare should be personal, accessible, and built on trust. Our mission is to provide high-quality medical care that supports patients through every stage of life, delivered with compassion, professionalism, and respect.              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                At Kings Care Medical Clinic, every appointment, consultation, and treatment is guided by a commitment to your health, comfort, and long-term wellbeing. We focus on listening first, caring deeply, and delivering medical services you can rely on.              </p>
            </div>
            <div className="bg-[#0E2A47] rounded-2xl p-8 text-white">
              <Award className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Trusted Medical Care</h3>
              <p className="text-white/80 leading-relaxed">
              Kings Care Medical Clinic is proud to serve individuals and families with comprehensive primary care, same-day appointments, and specialized services. Our physicians are dedicated to providing evidence-based medicine in a welcoming and respectful environment.              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47]  mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white/80 rounded-xl p-8  hover:shadow-xl hover:transition duration-150 motion-reduce:duration-0 motion-reduce:duration-0">
                  <div className="w-14 h-14 bg-[#E6E8EB] rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-[#0E2A47]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
            <Footer />

    </div>
  );
};

export default AboutPage;
