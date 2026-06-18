import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaPlus, FaMinus, FaTrash, FaShoppingBag, FaArrowRight, FaSpinner, FaWhatsapp, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Success modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');

  // Checkout Form states
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
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-white w-full max-w-md h-full relative z-10 shadow-2xl flex flex-col justify-between border-l border-slate-100"
      >
        {/* Drawer Header */}
        <div className="bg-brand-navy p-5 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FaShoppingBag className="text-brand-red text-base" />
            <h3 className="font-heading font-black text-sm uppercase tracking-wider">
              Shopping Cart ({cartItems.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-brand-red text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        {/* Drawer Body (Content scrollable) */}
        <div className="flex-grow overflow-y-auto p-5 space-y-6">
          {!showCheckoutForm ? (
            cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex gap-4 p-3 bg-slate-50 border border-slate-150/40 rounded-xl relative overflow-hidden">
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-100">
                      <img 
                        src={item.product.image.startsWith('http') || item.product.image.startsWith('/') ? item.product.image : `http://localhost:5000${item.product.image}`} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    {/* Item details */}
                    <div className="flex-grow overflow-hidden flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="font-heading font-black text-xs text-brand-navy truncate">
                          {item.product.title}
                        </h4>
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold block mt-0.5">
                          {item.product.category}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 border border-slate-200 bg-white hover:border-slate-350 rounded flex items-center justify-center text-xs text-slate-650 cursor-pointer"
                        >
                          <FaMinus className="text-[8px]" />
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            if (item.product.stock !== undefined && item.quantity >= item.product.stock) {
                              showToast(`Only ${item.product.stock} units available in stock.`, 'warning');
                              return;
                            }
                            updateQuantity(item.product._id, item.quantity + 1);
                          }}
                          className="w-6 h-6 border border-slate-200 bg-white hover:border-slate-350 rounded flex items-center justify-center text-xs text-slate-650 cursor-pointer"
                        >
                          <FaPlus className="text-[8px]" />
                        </button>
                      </div>
                    </div>

                    {/* Pricing details */}
                    <div className="text-right flex flex-col justify-between py-0.5 items-end flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-slate-400 hover:text-brand-red p-1 transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                      <p className="text-xs font-black text-brand-navy">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
                  <FaShoppingBag className="text-2xl" />
                </div>
                <p className="text-sm font-semibold text-slate-400">Your shopping cart is empty.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-red-500 text-white text-xs font-heading font-bold rounded-lg uppercase tracking-wider shadow cursor-pointer transition-colors"
                >
                  Browse Tools Catalogue
                </button>
              </div>
            )
          ) : (
            // Checkout Form
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <h4 className="font-heading font-black text-sm text-slate-900 border-b border-slate-100 pb-2">
                Checkout Details
              </h4>

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
                        : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
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
                        : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100'
                    }`}
                  >
                    Store Pickup
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  WhatsApp Contact Mobile
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Delivery Address / Store Pickup Address info */}
              {deliveryMethod === 'Delivery' ? (
                <div className="space-y-3">
                  {/* Street Address */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Flat, House No., Building, Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. Shop No. 12, Floor 1"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Apartment / Suite */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Area, Street, Sector, Road *
                    </label>
                    <input
                      type="text"
                      required
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="e.g. Station Road, Bhaktinagar"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. opposite Bal Adalat"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* City & State Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Rajkot"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="e.g. Gujarat"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 360002"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20"
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

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order Subtotal:</span>
                  <span className="text-slate-900">₹{getCartTotal().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping:</span>
                  <span className="text-green-600 uppercase font-bold">FREE Delivery</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm">
                  <span className="text-brand-navy">Total Pay:</span>
                  <span className="text-brand-red">₹{getCartTotal().toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(false)}
                  className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <>
                      <FaWhatsapp className="text-sm" /> WhatsApp Order
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer (Summary & Checkout CTA) */}
        {!showCheckoutForm && cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-4">
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-slate-500">Cart Total:</span>
                <span className="text-brand-navy">₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm">
                <span className="text-brand-navy">Payable Subtotal:</span>
                <span className="text-brand-red">₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckoutForm(true)}
              className="w-full bg-slate-900 hover:bg-brand-red text-white py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer group"
            >
              Checkout Order <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </motion.div>

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
                  onClose();
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
