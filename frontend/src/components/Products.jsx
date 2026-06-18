import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaWrench, FaTools, FaIndustry, FaShieldAlt, FaHardHat, FaBolt, FaArrowRight, FaSpinner, FaShoppingBag, FaTimes } from 'react-icons/fa';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

export default function Products({ onInquiryClick }) {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();
  const { addToCart, setIsCartOpen } = useCart();

  const categories = [
    'All',
    'Automatic Flour Mills',
    'Power Tools',
    'Hand Tools',
    'Industrial Machinery',
    'Welding Equipment',
    'Safety Equipment',
    'Hardware Accessories'
  ];

  // Map category names to icons
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Automatic Flour Mills':
        return <FaIndustry className="text-brand-blue text-xl" />;
      case 'Power Tools':
        return <FaBolt className="text-brand-red text-xl" />;
      case 'Hand Tools':
        return <FaWrench className="text-brand-blue text-xl" />;
      case 'Industrial Machinery':
        return <FaIndustry className="text-brand-red text-xl" />;
      case 'Welding Equipment':
        return <FaTools className="text-brand-blue text-xl" />;
      case 'Safety Equipment':
        return <FaHardHat className="text-brand-red text-xl" />;
      case 'Hardware Accessories':
        return <FaShieldAlt className="text-brand-blue text-xl" />;
      default:
        return <FaTools className="text-brand-blue text-xl" />;
    }
  };

  useEffect(() => {
    if (location.state?.category) {
      setActiveTab(location.state.category);
      setSearchQuery('');
    }
    if (location.state?.search !== undefined) {
      setSearchQuery(location.state.search);
      setActiveTab('All');
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error('Failed to load products from API:', error.message);
        showToast('Loading offline products catalogue...', 'info');
        
        // Mock fallback data to prevent page empty crash
        const fallback = [
          { _id: '1', title: 'Power Tools Suite', category: 'Power Tools', description: 'High-performance cordless drills, angle grinders, and impact wrenches.', image: '/power-tools.png' },
          { _id: '2', title: 'Industrial Hand Tools', category: 'Hand Tools', description: 'Premium spanners, socket sets, and heavy-duty pliers.', image: '/hand-tools.png' },
          { _id: '3', title: 'Milling & Lathe Machinery', category: 'Industrial Machinery', description: 'Heavy-duty lathe machines and CNC milling gear.', image: '/machinery.png' },
          { _id: '4', title: 'IGBT Inverter Welders', category: 'Welding Equipment', description: 'Advanced inverter welding machines and TIG/MIG torches.', image: '/welding.png' },
          { _id: '5', title: 'Certified PPE Gear', category: 'Safety Equipment', description: 'Certified helmets, steel-toe boots, and safety gloves.', image: '/safety.png' },
          { _id: '6', title: 'High-Tensile Fasteners', category: 'Hardware Accessories', description: 'High-tensile fasteners, bolts, and expansion anchor anchors.', image: '/hardware.png' }
        ];
        setProducts(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeTab === 'All' || p.category === activeTab;
    const matchesSearch = searchQuery === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-20 md:py-28 px-4 md:px-8 bg-brand-gray scroll-mt-section">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-block bg-brand-red/15 border border-brand-red/20 text-brand-red font-heading font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Product Catalogue
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-brand-navy">
            Our Premium Product Lines
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Explore our comprehensive range of high-performance tools and machinery. We provide certified products designed to satisfy international standards of safety and efficiency.
          </p>
        </div>

        {/* Search status / Clear button */}
        {searchQuery && (
          <div className="flex justify-center items-center gap-2.5 mb-10 -mt-4 animate-fade-in">
            <span className="text-xs text-slate-500 font-semibold">Showing results for:</span>
            <span className="inline-flex items-center gap-1.5 bg-brand-red/15 border border-brand-red/35 text-brand-red text-xs font-heading font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              "{searchQuery}"
              <button 
                onClick={() => setSearchQuery('')} 
                className="hover:text-white hover:bg-brand-red/50 rounded-full p-0.5 cursor-pointer transition-colors flex items-center justify-center"
                title="Clear Search"
              >
                <FaTimes className="text-[10px]" />
              </button>
            </span>
          </div>
        )}

        {/* Category Tabs Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 p-6 space-y-4 animate-pulse">
                <div className="bg-slate-200 aspect-[16/10] rounded-xl" />
                <div className="h-5 bg-slate-200 rounded w-2/3" />
                <div className="h-10 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-200 rounded w-full pt-4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 group flex flex-col h-full"
              >
                {/* Image Box */}
                <div className="relative overflow-hidden aspect-[16/10] bg-slate-900">
                  <img 
                    src={product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `http://localhost:5000${product.image}`} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  
                  {/* Floating Icon Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-md p-2.5 rounded-xl border border-slate-100 flex items-center justify-center">
                    {getCategoryIcon(product.category)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest text-brand-red font-bold font-heading">
                        {product.category}
                      </span>
                      {product.stock !== undefined && product.stock <= 0 ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-red-650 bg-red-50 border border-red-100 px-2 py-0.5 rounded">Out of Stock</span>
                      ) : product.stock !== undefined && product.stock <= 5 ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-650 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Only {product.stock} left!</span>
                      ) : (
                        <button 
                          onClick={() => onInquiryClick(product.title)}
                          className="text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-brand-blue cursor-pointer"
                        >
                          Ask Details
                        </button>
                      )}
                    </div>
                    <h3 className="text-xl font-heading font-black text-brand-navy line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                    
                    {/* Price and Details link */}
                    <div className="flex items-center justify-between border-t border-slate-105/60 pt-4 mt-2">
                      <span className="text-lg font-heading font-black text-brand-red">
                        ₹{product.price ? product.price.toLocaleString('en-IN') : '2,500'}
                      </span>
                      <Link 
                        to={`/products/${product._id}`} 
                        className="text-xs font-bold text-slate-700 hover:text-brand-blue flex items-center gap-1 group/btn transition-colors"
                      >
                        View Details <FaArrowRight className="text-[10px] transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Checkout CTAs */}
                  <div className="flex gap-2 mt-4 pt-1">
                    {product.stock !== undefined && product.stock <= 0 ? (
                      <button
                        disabled
                        className="w-full py-3.5 bg-slate-200 text-slate-400 font-heading font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            showToast(`Added ${product.title} to shopping cart.`, 'success');
                          }}
                          className="flex-grow py-3.5 bg-slate-900 hover:bg-brand-blue text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FaShoppingBag className="text-xs" /> Add To Cart
                        </button>
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            setIsCartOpen(true);
                          }}
                          className="flex-grow py-3.5 bg-brand-red hover:bg-brand-blue text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-brand-red/10 transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <FaBolt className="text-xs" /> Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-500 font-semibold text-sm">No products found under this category.</p>
          </div>
        )}

      </div>
    </section>
  );
}
