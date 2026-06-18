import React from 'react';
import { motion } from 'framer-motion';
import { FaCog } from 'react-icons/fa';

export default function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-navy text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    >
      <div className="relative flex items-center justify-center">
        {/* Rotating outer gear */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
          className="text-brand-red text-7xl md:text-8xl filter drop-shadow-[0_0_15px_rgba(243,59,74,0.4)]"
        >
          <FaCog />
        </motion.div>
        
        {/* Rotating inner gear in opposite direction */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute text-brand-blue text-4xl md:text-5xl filter drop-shadow-[0_0_10px_rgba(47,52,126,0.5)]"
        >
          <FaCog />
        </motion.div>
      </div>

      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-wider text-white">
          JAY BHAGWATI
        </h2>
        <p className="mt-1 text-xs md:text-sm tracking-[0.25em] text-gray-400 font-medium">
          TOOLS & MACHINERY
        </p>
      </motion.div>

      {/* Modern pulsing progress line */}
      <div className="mt-6 w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-blue to-brand-red"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
