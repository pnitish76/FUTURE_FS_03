import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaPhoneAlt, FaArrowUp } from 'react-icons/fa';

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-3">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919227070338?text=Hello%20Jay%20Bhagwati%20Tools%20%26%20Machinery%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(34,197,94,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group relative"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md border border-slate-800 pointer-events-none">
          WhatsApp Inquiry
        </span>
      </a>

      {/* Call Button (Mobile Only / Hide on Desktop) */}
      <a
        href="tel:+919227070338"
        className="w-14 h-14 bg-brand-blue hover:bg-brand-red text-white rounded-full flex lg:hidden items-center justify-center shadow-[0_4px_15px_rgba(47,52,126,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group relative"
        aria-label="Call Now"
      >
        <FaPhoneAlt className="text-xl animate-pulse" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md border border-slate-800 pointer-events-none">
          Call Now
        </span>
      </a>

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-slate-900 hover:bg-brand-red text-white rounded-full flex items-center justify-center shadow-lg border border-slate-800 hover:scale-110 active:scale-95 transition-all duration-300 group relative cursor-pointer"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-base" />
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md border border-slate-800 pointer-events-none">
            Back to Top
          </span>
        </button>
      )}
    </div>
  );
}
