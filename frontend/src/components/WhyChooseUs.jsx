import React from 'react';
import { FaShieldAlt, FaTag, FaHandshake, FaUserTie, FaCheckCircle, FaBoxes } from 'react-icons/fa';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <FaShieldAlt className="text-white text-xl" />,
      colorClass: "bg-brand-red shadow-brand-red/20",
      borderClass: "border-t-4 border-t-brand-red",
      title: "Quality Products",
      description: "Every item in our catalogue is sourced from ISO-certified manufacturers and passes stringent inspection checks for field performance."
    },
    {
      icon: <FaTag className="text-white text-xl" />,
      colorClass: "bg-brand-blue shadow-brand-blue/20",
      borderClass: "border-t-4 border-t-brand-blue",
      title: "Competitive Prices",
      description: "We offer wholesale price advantages directly to our buyers, assuring maximum value for small and large-scale industrial orders."
    },
    {
      icon: <FaHandshake className="text-white text-xl" />,
      colorClass: "bg-brand-red shadow-brand-red/20",
      borderClass: "border-t-4 border-t-brand-red",
      title: "Trusted Service",
      description: "Over 15 years of industry presence in Rajkot guarantees that you are dealing with professionals committed to business integrity."
    },
    {
      icon: <FaUserTie className="text-white text-xl" />,
      colorClass: "bg-brand-blue shadow-brand-blue/20",
      borderClass: "border-t-4 border-t-brand-blue",
      title: "Expert Guidance",
      description: "Not sure about specifications? Our technicians analyze your application specs and recommend the ideal machinery options."
    },
    {
      icon: <FaCheckCircle className="text-white text-xl" />,
      colorClass: "bg-brand-red shadow-brand-red/20",
      borderClass: "border-t-4 border-t-brand-red",
      title: "Customer Satisfaction",
      description: "We establish lifetime partnerships with our clients, offering quick replacements, site assistance, and priority customer care."
    },
    {
      icon: <FaBoxes className="text-white text-xl" />,
      colorClass: "bg-brand-blue shadow-brand-blue/20",
      borderClass: "border-t-4 border-t-brand-blue",
      title: "Wide Product Range",
      description: "From micro-fasteners to heavy metal-cutting lathe machines, we are your one-stop supplier for all industrial engineering tools."
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 md:py-28 px-4 md:px-8 bg-white scroll-mt-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Our Advantages
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy">
            Why Industrial Professionals Choose Us
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            We are dedicated to supporting Rajkot's engineering community with reliability, expert advice, and premium quality products.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 ${feature.borderClass} group hover:-translate-y-1`}
            >
              <div className="flex gap-5 items-start">
                {/* Icon Wrapper */}
                <div className={`p-3.5 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${feature.colorClass}`}>
                  {feature.icon}
                </div>
                {/* Feature Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-black text-brand-navy">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
