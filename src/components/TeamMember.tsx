import React from 'react';
  const team = [
    {
      name: 'Dr. Mehrdad Emadi ',
      role: 'Chief Clinical Officer',
      image: '👩‍⚕️'
    },
    {
      name: 'Dr. James Chen',
      role: 'Lead Clinical',
      image: '👨‍⚕️'
    },
    {
      name: 'Emily Rodriguez',
      role: 'clinic Manager',
      image: '👩‍💼'
    },
    {
      name: 'Dr. Michael Brown',
      role: 'Family Physician',
      image: '👨‍⚕️'
    }
  ];
export default function TeamMember(){
 return (
    <>
    <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47]  mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-900  mb-12  ">
            Our experienced healthcare professionals are dedicated to providing you with expert guidance and compassionate care.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto bg-[#E6E8EB] rounded-full flex items-center justify-center text-6xl mb-4">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-[#0E2A47] font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>

  );
}
 
