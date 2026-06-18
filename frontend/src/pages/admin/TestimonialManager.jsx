import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes, FaStar, FaRegCommentDots } from 'react-icons/fa';

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  
  const { showToast } = useToast();

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/testimonials');
      if (res.data.success) {
        setTestimonials(res.data.testimonials);
      }
    } catch (error) {
      showToast('Failed to load testimonials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAddModal = () => {
    setEditingTestimonial(null);
    setCustomerName('');
    setReview('');
    setRating(5);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (testi) => {
    setEditingTestimonial(testi);
    setCustomerName(testi.customerName);
    setReview(testi.review);
    setRating(testi.rating);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !review.trim()) {
      showToast('Please enter all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    
    const payload = {
      customerName,
      review,
      rating: Number(rating)
    };

    try {
      if (editingTestimonial) {
        // Edit route
        const res = await api.put(`/testimonials/${editingTestimonial._id}`, payload);
        if (res.data.success) {
          showToast('Testimonial updated successfully.', 'success');
          fetchTestimonials();
          handleCloseModal();
        }
      } else {
        // Create route
        const res = await api.post('/testimonials', payload);
        if (res.data.success) {
          showToast('Testimonial added successfully.', 'success');
          fetchTestimonials();
          handleCloseModal();
        }
      }
    } catch (error) {
      showToast('Failed to save testimonial details.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;

    try {
      const res = await api.delete(`/testimonials/${id}`);
      if (res.data.success) {
        showToast('Testimonial deleted successfully.', 'success');
        fetchTestimonials();
      }
    } catch (error) {
      showToast('Failed to delete testimonial.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-heading font-black text-slate-800 text-sm md:text-base uppercase tracking-wider">Testimonials Review</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">Add or edit reviews from contractors, workshops, or engineering plants.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-colors cursor-pointer"
        >
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
        </div>
      ) : testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testi) => (
            <div key={testi._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group">
              <div className="p-6 flex-grow space-y-4">
                {/* Rating stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-xs ${i < testi.rating ? 'text-amber-500' : 'text-slate-205'}`} />
                  ))}
                </div>
                
                {/* Review Text */}
                <p className="text-slate-500 text-xs italic leading-relaxed line-clamp-4">
                  "{testi.review}"
                </p>

                {/* Profile line */}
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-905 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {testi.customerName[0].toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="font-heading font-black text-slate-800 text-xs truncate leading-none">{testi.customerName}</h5>
                    <span className="text-[10px] text-slate-400 font-bold mt-1.5 block">Industrial Buyer</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2.5">
                <button
                  onClick={() => handleOpenEditModal(testi)}
                  className="flex-grow py-2 bg-slate-100 hover:bg-slate-205 text-slate-700 hover:text-slate-955 rounded-xl font-heading font-bold text-[10px] uppercase tracking-wider border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(testi._id)}
                  className="py-2 px-3 bg-red-50 hover:bg-red-100 border border-red-100 text-red-650 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  title="Delete Review"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white py-16 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
          <FaRegCommentDots className="text-4xl text-slate-350" />
          <p className="text-sm font-semibold text-slate-455">No reviews added yet.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleCloseModal} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" />

          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-scale-up">
            {/* Header */}
            <div className="bg-brand-navy p-5 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-heading font-black text-base uppercase tracking-wider">
                {editingTestimonial ? 'Edit Review Details' : 'Add Testimonial'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-brand-red text-slate-450 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Customer Name / Position
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Patel (MD, Patel Fabrication)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Star Rating Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Rating
                </label>
                <div className="flex gap-2.5 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <FaStar className={`text-xl ${star <= rating ? 'text-amber-500' : 'text-slate-250'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-500 ml-2">({rating} Stars)</span>
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Review Text
                </label>
                <textarea
                  required
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="4"
                  placeholder="e.g. They provide excellent power tools with warranty support..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer disabled:opacity-75"
                >
                  {submitting ? <FaSpinner className="animate-spin" /> : null}
                  {editingTestimonial ? 'Save Changes' : 'Create Review'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
