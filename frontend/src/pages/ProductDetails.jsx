import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { FaArrowLeft, FaShoppingBag, FaBolt, FaSpinner, FaTools, FaShieldAlt } from 'react-icons/fa';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (error) {
        console.error('Failed to load product specifications:', error.message);
        showToast('Error: Product details unavailable.', 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, navigate]);

  const handleQuantityChange = (val) => {
    const maxStock = product?.stock !== undefined ? product.stock : 999;
    setQuantity(Math.min(maxStock, Math.max(1, val)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock !== undefined && product.stock <= 0) {
      showToast('Product is currently out of stock.', 'error');
      return;
    }
    if (product.stock !== undefined && quantity > product.stock) {
      showToast(`Only ${product.stock} units available in stock.`, 'error');
      return;
    }
    addToCart(product, quantity);
    showToast(`Added ${quantity} x ${product.title} to shopping cart.`, 'success');
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (product.stock !== undefined && product.stock <= 0) {
      showToast('Product is currently out of stock.', 'error');
      return;
    }
    if (product.stock !== undefined && quantity > product.stock) {
      showToast(`Only ${product.stock} units available in stock.`, 'error');
      return;
    }
    addToCart(product, quantity);
    setIsCartOpen(true); // Open the Cart Drawer instantly
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Loading specifications...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  // Mock product specifications list based on category for rich visual content
  const getProductSpecs = (cat) => {
    switch (cat) {
      case 'Automatic Flour Mills':
        return [
          { label: 'Motor Power', value: '1 HP (750W)' },
          { label: 'Motor Speed', value: '2880 RPM' },
          { label: 'Grinding Capacity', value: '8 - 12 Kg/Hr' },
          { label: 'Hopper Capacity', value: '4.5 Kg' },
          { label: 'Jali Set Included', value: '7 Stainless Steel Jalis' },
          { label: 'Cabinet Type', value: 'High-Gloss Matte Laminate' },
          { label: 'Power Consumption', value: '0.75 Units/Hour' }
        ];
      case 'Power Tools':
        return [
          { label: 'Voltage Range', value: '18V - 22V' },
          { label: 'Battery Capacity', value: '4.0 Ah Li-Ion' },
          { label: 'Motor Type', value: 'Brushless' },
          { label: 'Torque Capacity', value: 'Up to 65 Nm' }
        ];
      case 'Industrial Machinery':
        return [
          { label: 'Power Input', value: '3-Phase AC (415V)' },
          { label: 'Precision Rating', value: '±0.01 mm' },
          { label: 'Certification', value: 'CE & ISO Compliant' },
          { label: 'Work Bed Length', value: '1000 mm - 1500 mm' }
        ];
      case 'Safety Equipment':
        return [
          { label: 'Material Type', value: 'High-Density Polyethylene' },
          { label: 'Quality Grade', value: 'ISI Certified Class A' },
          { label: 'Thermal Resistance', value: 'Up to 120°C' },
          { label: 'Protection Standard', value: 'EN 397 Standard' }
        ];
      default:
        return [
          { label: 'Quality Grade', value: 'Chrome Vanadium (Cr-V)' },
          { label: 'Coating Finish', value: 'Anti-Rust Electroplating' },
          { label: 'Durability Standard', value: 'Heavy Duty Industrial' },
          { label: 'Warranty Cover', value: '1 Year Manufacturer Cover' }
        ];
    }
  };

  const specs = getProductSpecs(product.category);

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <FaArrowLeft /> Back to Products Catalog
        </Link>

        {/* Details Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10 items-start">
          
          {/* Left Panel: Image (5 cols) */}
          <div className="md:col-span-5 relative rounded-xl overflow-hidden border border-slate-100 bg-slate-900 aspect-[4/3] md:aspect-square">
            <img 
              src={product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `http://localhost:5000${product.image}`} 
              alt={product.title} 
              className="w-full h-full object-cover" 
            />
            <span className="absolute top-4 left-4 bg-slate-900/90 text-white border border-slate-850 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
              {product.category}
            </span>
          </div>

          {/* Right Panel: Data Summary (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-red">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-heading font-black text-brand-navy leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Price & Stock Status Tag */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl inline-block">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Special Sale Price</span>
                <span className="text-2xl md:text-3xl font-heading font-black text-brand-red mt-1 block">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                {product.stock !== undefined && product.stock <= 0 ? (
                  <span className="inline-block bg-red-50 border border-red-200 text-red-650 px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider animate-pulse">
                    Out of Stock
                  </span>
                ) : product.stock !== undefined && product.stock <= 5 ? (
                  <span className="inline-block bg-amber-50 border border-amber-250 text-amber-650 px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider">
                    Only {product.stock} left in stock!
                  </span>
                ) : product.stock !== undefined ? (
                  <span className="inline-block bg-green-50 border border-green-200 text-green-655 px-3.5 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider">
                    In Stock ({product.stock} available)
                  </span>
                ) : null}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Product Overview</h4>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Specifications Table */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Technical Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specs.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 px-3 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                    <span className="text-slate-400 font-semibold">{item.label}:</span>
                    <span className="text-slate-800 font-bold text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* E-Commerce Checkout Actions */}
            {product.stock !== undefined && product.stock <= 0 ? (
              <div className="pt-6 border-t border-slate-100 w-full">
                <button
                  disabled
                  className="w-full py-4 bg-slate-200 text-slate-400 font-heading font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              </div>
            ) : (
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
                {/* Quantity Picker */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 w-full sm:w-auto">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 bg-white border border-slate-200 hover:border-slate-350 rounded-lg flex items-center justify-center text-xs font-bold text-slate-650 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 bg-white border border-slate-200 hover:border-slate-355 rounded-lg flex items-center justify-center text-xs font-bold text-slate-650 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full sm:flex-grow">
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow py-3.5 bg-slate-900 hover:bg-brand-blue text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaShoppingBag className="text-xs" /> Add To Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-grow py-3.5 bg-brand-red hover:bg-brand-blue text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-brand-red/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FaBolt className="text-xs" /> Buy Now
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
