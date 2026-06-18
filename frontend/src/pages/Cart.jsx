import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaWhatsapp, FaArrowLeft, FaSpinner, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import api from '../utils/api';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Success modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');

  // Checkout form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery'); // 'Delivery' or 'Store Pickup'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || (deliveryMethod === 'Delivery' && (!streetAddress.trim() || !apartment.trim() || !city.trim() || !stateName.trim() || !pincode.trim()))) {
      showToast('Please enter all customer details.', 'error');
      return;
    }

    if (deliveryMethod === 'Delivery') {
      const pincodeRegex = /^\d{6}$/;
      if (!pincodeRegex.test(pincode.trim())) {
        showToast('Please enter a valid 6-digit PIN code.', 'error');
        return;
      }
    }

    const phoneRegex = /^[6789]\d{9}$/;
    const cleanPhone = phone.replace(/[\s-+]/g, '').slice(-10);
    if (!phoneRegex.test(cleanPhone)) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload = cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const subtotal = getCartTotal();
      const shippingCost = 0; // Free delivery
      const total = subtotal + shippingCost;

      const finalAddress = deliveryMethod === 'Store Pickup'
        ? 'Store Pickup'
        : `${streetAddress.trim()}, ${apartment.trim()}${landmark.trim() ? `, Near ${landmark.trim()}` : ''}, ${city.trim()}, ${stateName.trim()} - ${pincode.trim()}`;

      const orderPayload = {
        customerName: name,
        phone: cleanPhone,
        shippingAddress: finalAddress,
        deliveryMethod,
        items: itemsPayload,
        subtotal,
        shippingCost,
        total,
        paymentMethod: 'WhatsApp Order'
      };

      // Save order in database
      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        const orderId = res.data.order._id;

        // Helper to construct photo URL
        const getProductPhotoUrl = (imagePath) => {
          if (!imagePath) return '';
          if (imagePath.startsWith('http')) return imagePath;
          if (imagePath.startsWith('/')) {
            if (imagePath.startsWith('/slide') || imagePath.startsWith('/logo.png') || imagePath.endsWith('.png') || imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')) {
              return `${window.location.origin}${imagePath}`;
            }
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const backendBase = apiBase.replace('/api', '');
            return `${backendBase}${imagePath}`;
          }
          const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const backendBase = apiBase.replace('/api', '');
          return `${backendBase}/${imagePath}`;
        };

        showToast('Order saved successfully!', 'success');

        // Format WhatsApp Order Message

        let messageText = `*NEW E-COMMERCE ORDER*\n*JAY BHAGWATI TOOLS & MACHINERY*\n`;
        messageText += `-----------------------------------------------\n`;
        messageText += `*Customer Info:*\n`;
        messageText += `• Name: ${name}\n`;
        messageText += `• Mobile: +91 ${cleanPhone}\n`;
        if (deliveryMethod === 'Delivery') {
          messageText += `• Delivery Option: Home Delivery\n`;
          messageText += `• Shipping Address: ${finalAddress}\n\n`;
        } else {
          messageText += `• Delivery Option: Store Pickup\n`;
          messageText += `• Pickup Address: Shop Number 2, Street Number 7, Station Road, opposite Bal Adalat, Bhakti Nagar, Rajkot, Gujarat 360002\n\n`;
        }

        messageText += `*Order Items:*\n`;
        cartItems.forEach((item) => {
          messageText += `• ${item.product.title} x ${item.quantity} (₹${item.product.price.toLocaleString('en-IN')})\n`;
          const photoUrl = getProductPhotoUrl(item.product.image);
          if (photoUrl) {
            messageText += `  Image: ${photoUrl}\n`;
          }
        });
        
        messageText += `\n*Financials:*\n`;
        messageText += `• Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n`;
        messageText += `• Shipping: FREE\n`;
        messageText += `• *Grand Total: ₹${total.toLocaleString('en-IN')}*\n`;
        messageText += `-----------------------------------------------\n`;
        messageText += `Please confirm my order. Thank you!`;

        // Direct WhatsApp redirection URL
        const encodedText = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/919227070338?text=${encodedText}`;

        // Redirect and cleanup
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
          clearCart();
          setName('');
          setPhone('');
          setStreetAddress('');
          setApartment('');
          setLandmark('');
          setCity('');
          setStateName('');
          setPincode('');
          setDeliveryMethod('Delivery');
          setSuccessOrderId(orderId);
          setShowSuccessModal(true);
        }, 1000);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Checkout failed. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray pt-36 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-brand-navy">
              Shopping Cart
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Review your selected industrial tools and complete your details to order.
            </p>
          </div>
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-heading font-bold text-brand-navy hover:text-brand-red uppercase tracking-wider transition-colors self-start md:self-auto"
          >
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items List (8 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden p-6 space-y-6">
                {cartItems.map((item) => (
                  <div 
                    key={item.product._id} 
                    className="flex flex-col sm:flex-row gap-4 py-6 border-b border-slate-100 last:border-b-0 last:pb-0 first:pt-0"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-24 h-24 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                      <img 
                        src={item.product.image.startsWith('http') || item.product.image.startsWith('/') ? item.product.image : `http://localhost:5000${item.product.image}`} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block">
                          {item.product.category}
                        </span>
                        <h3 className="font-heading font-black text-sm md:text-base text-brand-navy">
                          {item.product.title}
                        </h3>
                        <p className="text-slate-500 text-xs font-semibold">
                          Unit Price: ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2.5 mt-3">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-8 h-8 border border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-650 cursor-pointer transition-colors"
                        >
                          <FaMinus className="text-[8px]" />
                        </button>
                        <span className="text-sm font-bold text-slate-800 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (item.product.stock !== undefined && item.quantity >= item.product.stock) {
                              showToast(`Only ${item.product.stock} units available in stock.`, 'warning');
                              return;
                            }
                            updateQuantity(item.product._id, item.quantity + 1);
                          }}
                          className="w-8 h-8 border border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-650 cursor-pointer transition-colors"
                        >
                          <FaPlus className="text-[8px]" />
                        </button>
                      </div>
                    </div>

                    {/* Pricing Sum and Delete */}
                    <div className="flex sm:flex-col justify-between sm:items-end flex-shrink-0 mt-3 sm:mt-0">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-slate-400 hover:text-brand-red p-2 hover:bg-red-50 rounded-xl transition-all cursor-pointer self-start"
                        title="Remove Item"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                      <p className="font-heading font-black text-sm sm:text-base text-brand-navy">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Checkout Summary & Form (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Order Summary */}
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-4">
                <h2 className="font-heading font-black text-base text-brand-navy border-b border-slate-100 pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Items Subtotal:</span>
                    <span className="text-brand-navy">₹{getCartTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping / Handling:</span>
                    <span className="text-green-600 uppercase font-extrabold tracking-wider text-[10px]">FREE Delivery</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 font-black text-sm sm:text-base">
                    <span className="text-brand-navy">Total Pay:</span>
                    <span className="text-brand-red">₹{getCartTotal().toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
                <h2 className="font-heading font-black text-base text-brand-navy border-b border-slate-100 pb-3 mb-4">
                  Checkout Delivery Details
                </h2>

                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  {/* Delivery Option Selection */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Delivery Option
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('Delivery')}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                          deliveryMethod === 'Delivery'
                            ? 'bg-brand-navy border-brand-navy text-white shadow'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Home Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('Store Pickup')}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-center ${
                          deliveryMethod === 'Store Pickup'
                            ? 'bg-brand-navy border-brand-navy text-white shadow'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Store Pickup
                      </button>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      WhatsApp Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                    />
                  </div>

                  {/* Delivery Address / Store Pickup Address info */}
                  {deliveryMethod === 'Delivery' ? (
                    <div className="space-y-3.5">
                      {/* Street Address */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Flat, House No., Building, Apartment *
                        </label>
                        <input
                          type="text"
                          required
                          value={streetAddress}
                          onChange={(e) => setStreetAddress(e.target.value)}
                          placeholder="e.g. Shop No. 12, Floor 1"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                        />
                      </div>

                      {/* Apartment / Suite */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Area, Street, Sector, Road *
                        </label>
                        <input
                          type="text"
                          required
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          placeholder="e.g. Station Road, Bhaktinagar"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                        />
                      </div>

                      {/* Landmark */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. opposite Bal Adalat"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                        />
                      </div>

                      {/* City & State Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Rajkot"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            placeholder="e.g. Gujarat"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                          />
                        </div>
                      </div>

                      {/* PIN Code */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          6-Digit PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength="6"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 360002"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-650 leading-relaxed font-semibold">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Store Pickup Location</span>
                      <p className="font-bold text-brand-navy">Jay Bhagwati Tools & Machinery</p>
                      <p className="mt-1">
                        Shop Number 2, Street Number 7, Station Road,<br />
                        opposite Bal Adalat, Bhakti Nagar,<br />
                        Rajkot, Gujarat 360002
                      </p>
                      <p className="text-[10px] text-brand-red font-bold mt-2 uppercase tracking-wider">
                        ★ Pay at store or complete payment via WhatsApp.
                      </p>
                    </div>
                  )}

                  {/* Order CTA Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-white bg-green-600 hover:bg-green-700 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-all duration-300 cursor-pointer disabled:opacity-75 mt-6"
                  >
                    {isSubmitting ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <>
                        <FaWhatsapp className="text-sm" /> Order on WhatsApp
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>

          </div>
        ) : (
          /* Empty Cart Placeholder state */
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-12 text-center max-w-lg mx-auto space-y-6 my-10">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto shadow-inner border border-slate-100">
              <FaShoppingBag className="text-3xl" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-black text-lg text-brand-navy">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                Looks like you haven't added any industrial tools or machinery to your catalog cart yet.
              </p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3 bg-brand-navy hover:bg-brand-red text-white text-xs font-heading font-bold rounded-xl uppercase tracking-wider shadow cursor-pointer transition-colors inline-block"
            >
              Browse Catalogue
            </button>
          </div>
        )}

      </div>

      {/* Success Modal Overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-green-50 border border-green-150 rounded-full flex items-center justify-center text-green-500 mx-auto shadow-inner">
              <FaCheckCircle className="text-2xl" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-heading font-black text-lg text-brand-navy">Order Placed Successfully!</h2>
              <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs mx-auto">
                Your order is registered. We have launched WhatsApp to send your details. The admin will send your official invoice directly to your WhatsApp or Email ID.
              </p>

            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/products');
                }}
                className="w-full py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-heading font-bold rounded-xl uppercase tracking-wider shadow transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
