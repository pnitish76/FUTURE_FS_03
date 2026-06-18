import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaWhatsapp, FaArrowRight, FaCog } from 'react-icons/fa';

export default function Hero({ onInquiryClick, setCurrentView }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const desktopSlides = [
    'https://cdn.dotpe.in/longtail/themes/7917771/GdzU4U1k.webp',
    'https://cdn.dotpe.in/longtail/themes/7917771/Dk2vXy2M.webp',
    'https://cdn.dotpe.in/longtail/themes/7917771/65cGFPel.webp'
  ];

  const mobileSlides = [
    'https://cdn.dotpe.in/longtail/themes/7917771/RYUEWZcU.webp',
    'https://cdn.dotpe.in/longtail/themes/7917771/WqEk8oiC.webp',
    'https://cdn.dotpe.in/longtail/themes/7917771/zXvMy2gC.webp'
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = isMobile ? mobileSlides : desktopSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // changes every 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleScrollToProducts = (e) => {
    e.preventDefault();
    if (setCurrentView) {
      setCurrentView('products');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 px-4 md:px-8 overflow-hidden bg-brand-navy"
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slides[currentSlide]}')` }}
          />
        </AnimatePresence>
      </div>

      {/* Dark overlay with brand color gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/75 to-brand-navy/90 z-10 pointer-events-none" />
      
      {/* Subtle glowing mesh circles */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-blue/15 rounded-full blur-[120px] pointer-events-none z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none z-10" />

      {/* Floating Gear Decoration */}
      <div className="absolute right-[-8%] bottom-[10%] text-slate-800/10 text-[35rem] pointer-events-none select-none z-10 hidden lg:block animate-spin-slow">
        <FaCog />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-20 flex flex-col items-center">
        {/* Animated Brand Logo Emblem */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl p-1.5 shadow-2xl mb-8 flex items-center justify-center border border-slate-700 relative"
        >
          <img src="/logo.png" alt="Jay Bhagwati Logo" className="object-contain w-full h-full" />
          <span className="absolute -inset-0.5 rounded-2xl border-2 border-brand-red/35 animate-pulse pointer-events-none" />
        </motion.div>

        {/* Brand Tag/Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-brand-red/15 border border-brand-red/30 px-4 py-1.5 rounded-full mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
          <span className="text-xs md:text-sm font-heading font-bold text-brand-red tracking-wider uppercase">
            Rajkot's Leading Industrial Supplier
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight max-w-4xl tracking-tight"
        >
          Authorized Distributors of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">Milcent Flour Mills</span> & ABB Motors
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-base md:text-lg lg:text-xl text-slate-300 mt-6 max-w-2xl font-light leading-relaxed"
        >
          A prominent Rajkot-based supplier of electric induction motors, domestic automatic flour mills, and precision workshop machinery. Sourcing directly from top manufacturers for guaranteed performance.
        </motion.p>

        {/* Call-to-action Button Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <a
            href="tel:+919227070338"
            className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-brand-red to-red-600 text-white font-heading font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-brand-red/30 hover:scale-105 transition-all duration-300 uppercase tracking-wider"
          >
            <FaPhoneAlt /> Call Now
          </a>
          <a
            href="https://wa.me/919227070338"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 bg-green-600 text-white font-heading font-bold text-base px-8 py-4 rounded-xl shadow-lg hover:shadow-green-600/30 hover:scale-105 transition-all duration-300 uppercase tracking-wider"
          >
            <FaWhatsapp className="text-xl" /> WhatsApp Us
          </a>
          <a
            href="#products"
            onClick={handleScrollToProducts}
            className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-heading font-bold text-base px-8 py-4 rounded-xl shadow-md hover:bg-slate-800 transition-all duration-300 uppercase tracking-wider cursor-pointer"
          >
            View Products <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
