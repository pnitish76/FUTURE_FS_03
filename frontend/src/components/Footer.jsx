import React from 'react';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

export default function Footer({ setCurrentView }) {
  const handleNavClick = (e, id) => {
    e.preventDefault();
    setCurrentView(id);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-brand-navy text-slate-400 text-sm border-t border-slate-800">
      
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Brand Bio Area (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-lg p-0.5 overflow-hidden flex items-center justify-center border border-slate-700">
              <img src="/logo.png" alt="Jay Bhagwati Logo" className="object-contain w-full h-full" />
            </div>
            <div>
              <span className="font-heading font-black text-lg text-white tracking-wide block leading-none">
                JAY BHAGWATI
              </span>
              <span className="text-[9px] tracking-[0.22em] text-brand-red font-semibold uppercase block mt-1">
                Tools & Machinery
              </span>
            </div>
          </a>
          <p className="text-slate-400 leading-relaxed text-xs">
            Jay Bhagwati Tools & Machinery is a premier industrial equipment supplier in Rajkot, Gujarat. We source and distribute top-grade power tools, hardware accessories, safety gears, and metal workshops machinery since 2011.
          </p>
          {/* Social Links */}
          <div className="flex space-x-3.5 pt-2">
            {[
              { icon: <FaFacebookF />, url: "#" },
              { icon: <FaTwitter />, url: "#" },
              { icon: <FaLinkedinIn />, url: "#" },
              { icon: <FaYoutube />, url: "#" }
            ].map((soc, i) => (
              <a 
                key={i} 
                href={soc.url} 
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300 shadow-md"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column (2 Columns) */}
        <div className="lg:col-span-2 lg:pl-4 space-y-5">
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-3">
            Quick Navigation
          </h4>
          <ul className="space-y-3 font-semibold text-xs text-slate-400">
            {[
              { label: "Home", id: "home" },
              { label: "About Us", id: "about" },
              { label: "Products", id: "products" },
              { label: "Why Choose Us", id: "why-choose-us" },
              { label: "Gallery", id: "gallery" },
              { label: "Testimonials", id: "testimonials" },
              { label: "Contact Us", id: "contact" }
            ].map((link, idx) => (
              <li key={idx}>
                <a 
                  href={`#${link.id}`} 
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="hover:text-brand-red transition-colors block py-0.5"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Categories Column (3 Columns) */}
        <div className="lg:col-span-3 space-y-5">
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-3">
            Product lines
          </h4>
          <ul className="space-y-3 font-semibold text-xs text-slate-400">
            {[
              "Automatic Flour Mills",
              "Power Tools",
              "Hand Tools",
              "Industrial Machinery",
              "Welding Equipment",
              "Safety Equipment",
              "Hardware Accessories"
            ].map((cat, idx) => (
              <li key={idx}>
                <a 
                  href="#products" 
                  onClick={(e) => handleNavClick(e, 'products')}
                  className="hover:text-brand-red transition-colors block py-0.5"
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column (3 Columns) */}
        <div className="lg:col-span-3 space-y-5">
          <h4 className="font-heading font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-3">
            Store Contact
          </h4>
          <ul className="space-y-4 text-xs font-semibold">
            {/* Phone */}
            <li className="flex items-start gap-3">
              <FaPhoneAlt className="text-brand-red mt-0.5 flex-shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Call Support</span>
                <a href="tel:+919227070338" className="hover:text-brand-red text-slate-200 mt-1 block">
                  +91 9227070338
                </a>
              </div>
            </li>
            {/* WhatsApp */}
            <li className="flex items-start gap-3">
              <FaWhatsapp className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-500 uppercase font-bold">WhatsApp Inquiry</span>
                <a href="https://wa.me/919227070338" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 text-slate-200 mt-1 block">
                  +91 9227070338
                </a>
              </div>
            </li>
            {/* Address */}
            <li className="flex items-start gap-3">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Jay+Bhagwati+Tools+%26+Machinery+Shop+Number+2+Street+Number+7+Station+Road+opposite+Bal+Adalat+Bhakti+Nagar+Rajkot+Gujarat+360002"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group/footaddr hover:text-brand-red transition-colors"
              >
                <FaMapMarkerAlt className="text-brand-blue mt-0.5 flex-shrink-0 group-hover/footaddr:text-brand-red transition-colors" />
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Visit Store</span>
                  <span className="text-slate-300 group-hover/footaddr:text-slate-200 leading-relaxed mt-1 block font-medium transition-colors">
                    Shop Number 2, Street Number 7, Station Road,<br />
                    opposite Bal Adalat, Bhakti Nagar,<br />
                    Rajkot, Gujarat 360002
                  </span>
                </div>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer Section */}
      <div className="bg-slate-950 py-6 border-t border-slate-900 px-4 md:px-8 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Jay Bhagwati Tools & Machinery. All Rights Reserved.</p>
          <div className="flex space-x-6 text-[11px]">
            <a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-red transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-red transition-colors">Sitemap</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
