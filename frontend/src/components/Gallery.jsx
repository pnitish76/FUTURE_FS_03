import React, { useState, useEffect } from 'react';
import { FaSearchPlus, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import api from '../utils/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data.success) {
          setImages(res.data.gallery);
        }
      } catch (error) {
        console.error('Failed to load gallery items:', error.message);
        // Fallback images
        const fallback = [
          { _id: '1', image: '/gallery1.png', title: 'Premium Tools Display', category: 'Showroom' },
          { _id: '2', image: '/gallery2.png', title: 'CNC Machining Cutter', category: 'Machining' },
          { _id: '3', image: '/gallery3.png', title: 'Precision Welding Frame', category: 'Welding' },
          { _id: '4', image: '/gallery4.png', title: 'Organized Tool Chest', category: 'Workshop' },
          { _id: '5', image: '/gallery5.png', title: 'Industrial Drill Press', category: 'Machinery' },
          { _id: '6', image: '/gallery6.png', title: 'Heavy Machinery Stock', category: 'Warehouse' }
        ];
        setImages(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (index) => {
    setActiveImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section id="gallery" className="py-20 md:py-28 px-4 md:px-8 bg-brand-gray scroll-mt-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block bg-brand-red/15 border border-brand-red/20 text-brand-red font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Visual Tour
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy">
            Our Facility & Equipment Gallery
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Take a look inside our Rajkot workshop, showroom, and warehouses to see our tools, operations, and quality inventory display.
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 p-3 aspect-[4/3] animate-pulse">
                <div className="bg-slate-200 w-full h-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div 
                key={img._id || index}
                onClick={() => openLightbox(index)}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md border border-slate-100 hover:border-slate-350 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                {/* Image */}
                <img 
                  src={img.image.startsWith('http') || img.image.startsWith('/') ? img.image : `http://localhost:5000${img.image}`} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
                
                {/* Text & Icon Layer */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <span className="text-brand-red font-heading font-bold text-[10px] uppercase tracking-widest bg-brand-red/15 border border-brand-red/35 px-2.5 py-1.5 rounded-md self-start mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {img.category || 'Machinery'}
                  </span>
                  
                  <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div>
                      <h3 className="font-heading font-bold text-base text-white leading-tight line-clamp-1">
                        {img.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 font-semibold tracking-wider mt-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                        Click to expand
                      </p>
                    </div>
                    
                    {/* Search Icon */}
                    <div className="w-10 h-10 bg-brand-red hover:bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300">
                      <FaSearchPlus className="text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500 font-semibold text-sm">No gallery items loaded.</p>
          </div>
        )}

      </div>

      {/* Fullscreen Lightbox Overlay */}
      {activeImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex flex-col justify-between py-6 px-4 md:px-8 select-none animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Lightbox Header */}
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center z-10 text-white">
            <div>
              <p className="text-brand-red font-heading font-bold text-xs uppercase tracking-widest">
                {images[activeImageIndex].category || 'Machinery'}
              </p>
              <h3 className="font-heading font-black text-lg md:text-xl mt-1">
                {images[activeImageIndex].title}
              </h3>
            </div>
            <button 
              onClick={closeLightbox}
              className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl hover:bg-brand-red text-white hover:text-white transition-colors cursor-pointer"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Lightbox Main Content (Image & Controls) */}
          <div className="relative flex-grow flex items-center justify-center max-w-7xl mx-auto w-full">
            {/* Left Arrow */}
            <button
              onClick={prevImage}
              className="absolute left-0 md:-left-4 p-4 bg-slate-900/60 hover:bg-brand-blue border border-slate-850 hover:border-slate-700 text-white rounded-xl transition-all duration-200 z-10 cursor-pointer"
            >
              <FaArrowLeft className="text-sm" />
            </button>

            {/* Display Image */}
            <div 
              className="max-h-[70vh] max-w-[90vw] md:max-w-[75vw] rounded-2xl overflow-hidden shadow-2xl border border-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={images[activeImageIndex].image.startsWith('http') || images[activeImageIndex].image.startsWith('/') ? images[activeImageIndex].image : `http://localhost:5000${images[activeImageIndex].image}`} 
                alt={images[activeImageIndex].title} 
                className="w-full h-full object-contain max-h-[70vh] max-w-[90vw] md:max-w-[75vw]"
              />
            </div>

            {/* Right Arrow */}
            <button
              onClick={nextImage}
              className="absolute right-0 md:-right-4 p-4 bg-slate-900/60 hover:bg-brand-blue border border-slate-850 hover:border-slate-700 text-white rounded-xl transition-all duration-200 z-10 cursor-pointer"
            >
              <FaArrowRight className="text-sm" />
            </button>
          </div>

          {/* Lightbox Footer */}
          <div className="max-w-7xl mx-auto w-full text-center z-10 text-slate-400 font-semibold text-xs tracking-wider">
            Image {activeImageIndex + 1} of {images.length}
          </div>
        </div>
      )}
    </section>
  );
}
