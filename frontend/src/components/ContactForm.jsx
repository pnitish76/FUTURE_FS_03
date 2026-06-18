import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaSpinner, FaPaperPlane } from 'react-icons/fa';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

export default function ContactForm({ initialProduct = "" }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    product: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ ...prev, product: initialProduct }));
    }
  }, [initialProduct]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Full Name is required";
    
    // Indian Mobile regex
    const phoneRegex = /^[6789]\d{9}$/;
    const cleanPhone = formData.phone.replace(/[\s-+]/g, '').slice(-10);
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(cleanPhone)) {
      tempErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.product.trim()) tempErrors.product = "Product Requirement is required";
    if (!formData.message.trim()) tempErrors.message = "Message details are required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone.replace(/[\s-+]/g, '').slice(-10),
        productRequirement: formData.product,
        message: formData.message
      };

      const res = await api.post('/inquiries', payload);
      
      if (res.data.success) {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        showToast('Inquiry sent successfully! Our team will call you.', 'success');
        setFormData({ name: '', phone: '', product: '', message: '' });
      }
    } catch (error) {
      setIsSubmitting(false);
      const errMsg = error.response?.data?.message || 'Failed to submit inquiry. Please try again.';
      showToast(errMsg, 'error');
    }
  };

  return (
    <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-100 h-full flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {!submitSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 text-sm font-semibold transition-all duration-200 outline-none focus:bg-white ${
                  errors.name 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 text-sm font-semibold transition-all duration-200 outline-none focus:bg-white ${
                  errors.phone 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs font-semibold mt-1">{errors.phone}</p>}
            </div>

            {/* Product Category select */}
            <div>
              <label htmlFor="product" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Product Requirement
              </label>
              <select
                id="product"
                name="product"
                value={formData.product}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 text-sm font-semibold transition-all duration-200 outline-none focus:bg-white cursor-pointer ${
                  errors.product 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue'
                }`}
              >
                <option value="">-- Select Category --</option>
                <option value="Power Tools">Power Tools</option>
                <option value="Hand Tools">Hand Tools</option>
                <option value="Industrial Machinery">Industrial Machinery</option>
                <option value="Welding Equipment">Welding Equipment</option>
                <option value="Safety Equipment">Safety Equipment</option>
                <option value="Hardware Accessories">Hardware Accessories</option>
                <option value="General Inquiry">General Machinery / Other</option>
              </select>
              {errors.product && <p className="text-red-500 text-xs font-semibold mt-1">{errors.product}</p>}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Specific Requirement / Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Details of sizes, brands, or machine capacities required..."
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 text-sm font-semibold transition-all duration-200 outline-none focus:bg-white ${
                  errors.message 
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-slate-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue'
                }`}
              />
              {errors.message && <p className="text-red-500 text-xs font-semibold mt-1">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-brand-red to-red-650 hover:from-brand-blue hover:to-brand-blue text-white font-heading font-bold text-sm py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 uppercase tracking-wider disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin text-lg" /> Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-xs" /> Send Inquiry
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center py-12 px-4 h-full"
          >
            <div className="text-green-500 text-6xl mb-6 filter drop-shadow-md">
              <FaCheckCircle />
            </div>
            <h3 className="text-2xl font-heading font-black text-brand-navy">
              Inquiry Submitted!
            </h3>
            <p className="text-slate-505 text-sm mt-3 leading-relaxed max-w-sm">
              Thank you for contacting Jay Bhagwati Tools & Machinery. Our executive will reach out to you via Phone/WhatsApp shortly.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-8 bg-slate-900 hover:bg-brand-red text-white text-xs font-heading font-bold px-6 py-2.5 rounded-lg shadow uppercase tracking-wider transition-colors cursor-pointer"
            >
              Send Another Message
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
