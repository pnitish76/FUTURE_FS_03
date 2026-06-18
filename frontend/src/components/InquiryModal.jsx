import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import ContactForm from './ContactForm';

export default function InquiryModal({ isOpen, onClose, selectedProduct }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-100 flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-brand-navy p-5 text-white flex justify-between items-center border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-red">
              Product Inquiry
            </span>
            <h3 className="text-lg font-heading font-black text-white mt-0.5">
              Request a Quote
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-brand-red text-white hover:text-white transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body with embedded form */}
        <div className="p-1 max-h-[85vh] overflow-y-auto">
          <ContactForm initialProduct={selectedProduct} />
        </div>
      </motion.div>
    </div>
  );
}
