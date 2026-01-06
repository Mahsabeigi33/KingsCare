import TeamMember from "@/components/TeamMember";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";


const TeamPage=()=>{

return(
        <div>
            <Nav/>
            <div className="bg-gradient-to-br from-[#0E2A47] to-[#4B5563] text-white lg:px-20 sm:px-4 py-20 ">
          <div className="max-w-6xl mx-auto px-4 text-center lg:text-left">
          <h2 className="text-xl font-semibold uppercase tracking-[0.35em] text-white/70">
            Meet Our Team
          </h2>
          <p className="mt-3 text-3xl font-semibold sm:text-4xl">
            Dedicated Professionals Caring for You
          </p>
          <p className="mt-4 max-w-3xl text-xl text-white/80 sm:text-base">
           At Kings Care Medical Clinic, our team of experienced healthcare professionals is committed to providing personalized and compassionate care to each patient.
          </p>  
            </div>
            
        </div>
        <TeamMember/>
        <Footer/>
        </div>
    )

}
export default TeamPage;
