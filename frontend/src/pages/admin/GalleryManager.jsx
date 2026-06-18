import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { FaPlus, FaTrash, FaSpinner, FaUpload, FaTimes, FaImages } from 'react-icons/fa';

export default function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const { showToast } = useToast();

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get('/gallery');
      if (res.data.success) {
        setGalleryItems(res.data.gallery);
      }
    } catch (error) {
      showToast('Failed to load gallery items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenModal = () => {
    setTitle('');
    setImage(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter an image title.', 'error');
      return;
    }
    if (!image) {
      showToast('Please upload an image file.', 'error');
      return;
    }

    setSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      const res = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        showToast('Gallery image uploaded successfully.', 'success');
        fetchGallery();
        handleCloseModal();
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to upload image.';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.data.success) {
        showToast('Gallery item deleted.', 'success');
        fetchGallery();
      }
    } catch (error) {
      showToast('Failed to delete gallery item.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-heading font-black text-slate-800 text-sm md:text-base uppercase tracking-wider">Gallery Inventory</h3>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">Upload and manage facility tours or workshop images.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition-colors cursor-pointer"
        >
          <FaPlus /> Upload Photo
        </button>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
        </div>
      ) : galleryItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group relative">
              
              {/* Image box */}
              <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative border-b border-slate-100">
                <img 
                  src={item.image.startsWith('http') || item.image.startsWith('/') ? item.image : `http://localhost:5000${item.image}`} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Card Footer details */}
              <div className="p-4 flex items-center justify-between gap-4">
                <h4 className="font-heading font-black text-slate-800 text-xs truncate flex-grow">
                  {item.title}
                </h4>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-650 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                  title="Delete Gallery Photo"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white py-16 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
          <FaImages className="text-4xl text-slate-350" />
          <p className="text-sm font-semibold text-slate-450">No gallery items uploaded yet.</p>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={handleCloseModal} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs" />

          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-100 animate-scale-up">
            {/* Header */}
            <div className="bg-brand-navy p-5 text-white flex justify-between items-center border-b border-slate-800">
              <h3 className="font-heading font-black text-base uppercase tracking-wider">
                Upload Gallery Photo
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
              {/* Photo Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Photo Title / Description
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Radial Drill Section"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Upload image */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Photo File
                </label>
                <div className="flex gap-4 items-center">
                  <label className="px-4 py-3 bg-slate-100 hover:bg-slate-205 text-slate-650 rounded-xl border border-slate-200 font-heading font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors flex-shrink-0">
                    <FaUpload /> Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold truncate flex-grow">
                    {image ? image.name : 'Select file (max 5MB)'}
                  </span>
                </div>
                {imagePreview && (
                  <div className="mt-4 w-28 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
                  Upload Item
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
