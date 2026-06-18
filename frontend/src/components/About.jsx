import React from 'react';
import { FaCheckCircle, FaAward, FaTruck, FaUsers, FaGlobe } from 'react-icons/fa';

export default function About() {
  const highlights = [
    {
      icon: <FaAward className="text-brand-red text-2xl" />,
      title: "Premium Quality & Versatility",
      description: "We supply high-test workshop machines and quality home appliances engineered for excellent performance, versatility, and efficiency."
    },
    {
      icon: <FaTruck className="text-brand-blue text-2xl" />,
      title: "12,840+ Machines Across India",
      description: "A solid footprint in the Indian industrial market, having successfully installed over 12,840 machines across the nation."
    },
    {
      icon: <FaGlobe className="text-brand-red text-2xl" />,
      title: "Global Machinery Footprint",
      description: "Proven reliability beyond borders with more than 300 heavy-duty industrial machinery units installed worldwide."
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 px-4 md:px-8 bg-white scroll-mt-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Styled Image with Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-[4/3] lg:aspect-auto lg:h-[480px]">
              <img 
                src="/gallery1.png" 
                alt="Jay Bhagwati Showroom" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            </div>

            {/* Glowing red accent outline */}
            <div className="absolute -top-4 -left-4 w-2/3 h-2/3 border-t-4 border-l-4 border-brand-red/35 rounded-tl-2xl z-0" />
            <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-b-4 border-r-4 border-brand-blue/35 rounded-br-2xl z-0" />

            {/* Experience Floating Badge */}
            <div className="absolute bottom-6 left-6 z-20 bg-brand-navy border border-slate-800 text-white rounded-xl p-4 shadow-xl flex items-center gap-3">
              <span className="text-brand-red font-heading font-black text-4xl block leading-none">15+</span>
              <span className="text-[10px] uppercase font-bold tracking-widest leading-tight block text-slate-300">
                Years of<br />Industry Trust
              </span>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Company Profile
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy leading-tight">
              A Trusted Partner in Industrial <span className="text-brand-red">Machinery & Spares</span>
            </h2>
            
            <p className="text-slate-600 leading-relaxed text-base md:text-lg">
              Established in Bhakti Nagar, Rajkot, Gujarat, <strong>Jay Bhagwati Tools & Machinery</strong> is a reliable trading company and distributor with more than 15 years of rich experience. We are considered a prominent supplier of high-precision workshop machinery, electric motors, and quality home appliances.
            </p>
            
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              We deal in a premium range of machine tool products—including Mechanical and Pneumatic Power Press machines, Hydraulic Shearing machines, Sheet Metal machinery, electric motors, and domestic flour mills. Our products are recognized across Indian and overseas markets for their superior efficiency, durability, and versatility.
            </p>

            <div className="border-t border-slate-100 pt-6 mt-6 space-y-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-brand-navy">{item.title}</h4>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
