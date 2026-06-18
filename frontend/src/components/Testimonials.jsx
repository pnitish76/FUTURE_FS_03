import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import api from '../utils/api';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        if (res.data.success) {
          setReviews(res.data.testimonials);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error.message);
        // Fallback reviews
        const fallback = [
          {
            _id: '1',
            customerName: 'Ramesh Patel',
            review: 'We have been sourcing heavy-duty power tools and welding gear from Jay Bhagwati for the last 5 years. Their products are incredibly reliable, their pricing is unbeatable, and they stand behind their warranties. A trusted supplier in every sense.',
            rating: 5,
            initials: 'RP',
            role: 'Managing Director',
            company: 'Patel Fabrication, Rajkot'
          },
          {
            _id: '2',
            customerName: 'Sanjay Shah',
            review: 'Their expertise is what separates them. When we needed specialized fasteners and precision machinery, they spent time analyzing our specs and delivered the perfect solutions. Highly recommended for wholesale purchases.',
            rating: 5,
            initials: 'SS',
            role: 'Purchase Manager',
            company: 'Apex Castings, Bhakti Nagar'
          },
          {
            _id: '3',
            customerName: 'Haresh Savaliya',
            review: 'In civil construction, equipment breakdown means huge losses. Jay Bhagwati Tools has always supplied us with quality machinery and safety gears instantly. Their logistics are extremely fast in Gujarat.',
            rating: 5,
            initials: 'HS',
            role: 'Owner',
            company: 'Savaliya Infrastructure'
          }
        ];
        setReviews(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'JB';
    const cleanName = name.replace(/\(.*\)/g, '').trim(); // Remove company suffix inside parenthesis
    const parts = cleanName.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const getSubDetails = (name, reviewItem) => {
    // If we have separate fields from fallbacks we show them,
    // otherwise parse details or provide defaults for user additions
    if (reviewItem.company) {
      return {
        role: reviewItem.role || 'Partner',
        company: reviewItem.company
      };
    }
    // For new reviews added from admin panel:
    return {
      role: 'Industrial Buyer',
      company: 'Gujarat Engineering Sector'
    };
  };

  return (
    <section id="testimonials" className="py-20 md:py-28 px-4 md:px-8 bg-white scroll-mt-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Customer Feedback
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy">
            What Our Clients Say
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Don't just take our word for it. Read the experiences of fabrication, workshop, and construction companies in Rajkot who rely on our supplies.
          </p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 h-48 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => {
              const subInfo = getSubDetails(review.customerName, review);
              const accentColorClass = index % 2 === 0 ? 'border-t-brand-red' : 'border-t-brand-blue';
              
              return (
                <div 
                  key={review._id || index}
                  className={`bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 border-t-4 ${accentColorClass} relative flex flex-col justify-between`}
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-slate-200 text-4xl pointer-events-none select-none">
                    <FaQuoteLeft />
                  </div>

                  <div>
                    {/* Rating stars */}
                    <div className="flex gap-1.5 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} className="text-amber-500 text-sm" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-slate-600 italic text-sm leading-relaxed mb-6 relative z-10">
                      "{review.review}"
                    </p>
                  </div>

                  {/* Author Profile */}
                  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100">
                    <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-bold text-white text-base">
                        {getInitials(review.customerName)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-brand-navy leading-none">
                        {review.customerName.replace(/\(.*\)/g, '').trim()}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1.5">
                        {subInfo.role}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">
                        {subInfo.company}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-slate-500 font-semibold text-sm">No reviews added yet.</p>
          </div>
        )}

      </div>
    </section>
  );
}
