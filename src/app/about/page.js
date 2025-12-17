
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
      description: 'We treat every patient with empathy, respect, and personalized attention to their unique healthcare needs.'
    },
    {
      icon: Shield,
      title: 'Trust & Integrity',
      description: 'Your health information is secure, and our advice is always honest and in your best interest.'
    },
    {
      icon: Clock,
      title: 'Accessible Service',
      description: 'Modern telemedicine combined with convenient hours to ensure healthcare fits your schedule.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We are more than a pharmacy - we are your neighborhood health partner and trusted advisor.'
    }
  ];

  const stats = [
    { number: '15+', label: 'Years of Service' },
    { number: '50K+', label: 'Patients Served' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' }
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
                   <p className="mt-4 max-w-3xl text-sm text-white/80 sm:text-base">
                     At Kings Care Medical Clinic, we combine modern telemedicine with compassionate, personalized care. We are committed to making healthcare accessible, affordable, and centered around you.
                   </p>
                   <div className="mt-6 flex flex-wrap gap-3">            
                     <Link
                       href="/contact"
                       className="inline-flex items-center justify-center rounded-full bg-[#D9C89E] border border-white/70 px-5 py-4 text-sm font-semibold text-[#0E2A47] transition hover:bg-[#C7B57A]"
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
                We believe healthcare should be personal, accessible, and built on trust. Our mission is to revolutionize the pharmacy experience by integrating cutting-edge technology with the warmth of human connection.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every prescription filled, every consultation provided, and every question answered is done with your wellbeing at the forefront of our minds.
              </p>
            </div>
            <div className="bg-[#0E2A47] rounded-2xl p-8 text-white">
              <Award className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Award-Winning Service</h3>
              <p className="text-white/80 leading-relaxed">
                Recognized by the National Pharmacy Association for excellence in patient care and innovation in healthcare delivery. Our commitment to quality has earned us the trust of thousands of families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#0E2A47] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
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
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
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
      <TeamMember />
            <Footer />

    </div>
  );
};

export default AboutPage;
