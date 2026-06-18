import React from 'react';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa';
import ContactForm from './ContactForm';

export default function Contact({ initialProduct }) {
  return (
    <section id="contact" className="py-20 md:py-28 px-4 md:px-8 bg-brand-gray scroll-mt-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Titles */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block bg-brand-red/15 border border-brand-red/20 text-brand-red font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Contact Information
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy">
            Get in Touch With Us
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Have questions about our tools or require a wholesale quote? Send us an inquiry, call us directly, or visit our Rajkot storefront.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Details & Map (7 columns on large screens) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div className="bg-brand-navy text-white rounded-2xl p-6 md:p-8 shadow-xl space-y-6 border border-slate-800">
              <h3 className="text-xl font-heading font-black text-white border-b border-slate-800 pb-4">
                Office & Store Details
              </h3>

              <div className="space-y-5">
                {/* Address (Clickable Map Link) */}
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Jay+Bhagwati+Tools+%26+Machinery+Shop+Number+2+Street+Number+7+Station+Road+opposite+Bal+Adalat+Bhakti+Nagar+Rajkot+Gujarat+360002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 items-start group/addr hover:bg-slate-900/40 p-2 rounded-xl transition-all block"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1 transition-transform group-hover/addr:scale-105">
                    <FaMapMarkerAlt className="text-brand-red text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Our Address</h4>
                    <p className="text-sm font-semibold text-slate-200 mt-1 leading-relaxed group-hover/addr:text-brand-red transition-colors">
                      Shop Number 2, Street Number 7, Station Road,<br />
                      opposite Bal Adalat, Bhakti Nagar,<br />
                      Rajkot, Gujarat 360002
                    </p>
                    <span className="text-[10px] text-slate-500 font-bold block mt-1.5 uppercase tracking-wider underline group-hover/addr:text-brand-blue transition-colors">Click to open on map</span>
                  </div>
                </a>

                {/* Phone */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <FaPhoneAlt className="text-brand-blue text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</h4>
                    <a href="tel:+919227070338" className="text-sm font-semibold text-slate-200 mt-1 block hover:text-brand-red transition-colors">
                      +91 9227070338
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <FaWhatsapp className="text-green-500 text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp</h4>
                    <a href="https://wa.me/919227070338" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-200 mt-1 block hover:text-green-400 transition-colors">
                      +91 9227070338 (Click to Chat)
                    </a>
                  </div>
                </div>

                {/* Email (Standard business professional addition) */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <FaEnvelope className="text-brand-red text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</h4>
                    <a href="mailto:jaybhagwati1@gmail.com" className="text-sm font-semibold text-slate-200 mt-1 block hover:text-brand-red transition-colors">
                      jaybhagwati1@gmail.com
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <FaClock className="text-brand-blue text-sm" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Hours</h4>
                    <p className="text-sm font-semibold text-slate-200 mt-1">
                      Monday - Saturday: 9:30 AM - 8:00 PM<br />
                      Sunday: <span className="text-brand-red">Closed</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Google Map Box */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 h-72 md:h-80 relative bg-slate-200 group w-full">
              <iframe 
                title="Jay Bhagwati Location"
                src="https://www.google.com/maps?q=Jay%20Bhagwati%20Tools%20%26%20Machinery,%20Bhaktinagar,%20Rajkot&t=&z=17&ie=UTF8&iwloc=B&output=embed" 
                className="w-full h-full border-0 absolute inset-0"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Floating Maps CTA Overlay */}
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Jay+Bhagwati+Tools+%26+Machinery+Shop+Number+2+Street+Number+7+Station+Road+opposite+Bal+Adalat+Bhakti+Nagar+Rajkot+Gujarat+360002"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 bg-white/95 hover:bg-brand-red hover:text-white text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold font-heading uppercase tracking-wider shadow-lg border border-slate-100 flex items-center gap-1.5 transition-all cursor-pointer z-20 hover:scale-105"
              >
                <FaMapMarkerAlt className="text-brand-blue group-hover:text-white" /> Open in Google Maps
              </a>
            </div>
          </div>

          {/* Right Column: Inquiry Form (5 columns) */}
          <div className="lg:col-span-6">
            <ContactForm initialProduct={initialProduct} />
          </div>

        </div>

      </div>
    </section>
  );
}
