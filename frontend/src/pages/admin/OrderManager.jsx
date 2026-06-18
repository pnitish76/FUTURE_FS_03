import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { 
  FaClipboardList, FaTrash, FaSpinner, FaCalendarAlt, 
  FaPhoneAlt, FaMapMarkerAlt, FaShippingFast, FaCheckCircle, FaMoneyCheckAlt,
  FaFileInvoice
} from 'react-icons/fa';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      showToast('Failed to load customer orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setSubmitting(true);
    try {
      const res = await api.put(`/orders/${id}`, { orderStatus: status });
      if (res.data.success) {
        showToast(`Order status updated to "${status}".`, 'success');
        fetchOrders();
      }
    } catch (error) {
      showToast('Failed to update order status.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;

    try {
      const res = await api.delete(`/orders/${id}`);
      if (res.data.success) {
        showToast('Order record deleted.', 'success');
        fetchOrders();
      }
    } catch (error) {
      showToast('Failed to delete order.', 'error');
    }
  };

  // Compute metrics
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(o => o.orderStatus === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Quick Stats Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-205 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales</span>
            <span className="text-xl font-heading font-black text-brand-navy block mt-1">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-55/90 text-green-600 flex items-center justify-center text-sm border border-green-100">
            <FaMoneyCheckAlt />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-205 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
            <span className="text-xl font-heading font-black text-brand-navy block mt-1">{orders.length}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center text-sm border border-blue-100">
            <FaClipboardList />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-205 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending Delivery</span>
            <span className="text-xl font-heading font-black text-brand-navy block mt-1">{pendingOrders}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-50 text-amber-500 flex items-center justify-center text-sm border border-yellow-100">
            <FaShippingFast />
          </div>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-205 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Delivered Orders</span>
            <span className="text-xl font-heading font-black text-brand-navy block mt-1">{completedOrders}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-sm border border-green-100">
            <FaCheckCircle />
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-heading font-black text-slate-800 text-xs md:text-sm uppercase tracking-wider">E-Commerce Orders</h3>
          <p className="text-[10px] text-slate-450 font-semibold mt-1">Verify cart checkout forms and change dispatch delivery statuses.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-650 outline-none bg-white cursor-pointer"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending Only</option>
            <option value="Shipped">Shipped Only</option>
            <option value="Delivered">Delivered Only</option>
            <option value="Cancelled">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* 3. Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 flex flex-col justify-between items-stretch">
              {/* Card Title Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">Order ID</span>
                  <span className="text-xs font-bold text-slate-800 uppercase font-mono mt-0.5 block">{order._id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs font-semibold flex items-center gap-1.5 font-normal">
                    <FaCalendarAlt className="text-slate-400" />
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  
                  {/* Delivery method badge */}
                  <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase border ${
                    order.deliveryMethod === 'Store Pickup' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-teal-50 border-teal-200 text-teal-700'
                  }`}>
                    {order.deliveryMethod || 'Delivery'}
                  </span>

                  {/* Payment status badge */}
                  <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase border ${
                    order.paymentStatus === 'Paid' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    {order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                  </span>

                  {/* Status badge */}
                  <span className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase border ${
                    order.orderStatus === 'Pending' ? 'bg-yellow-50 border-yellow-250 text-amber-500 animate-pulse' :
                    order.orderStatus === 'Shipped' ? 'bg-blue-50 border-blue-200 text-brand-blue' :
                    order.orderStatus === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                    'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Card Body Details split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Customer info (4 cols) */}
                <div className="md:col-span-4 space-y-3.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-1">Customer Details</h5>
                  <div className="space-y-2 text-xs font-semibold text-slate-700">
                    <p className="flex items-center gap-2 text-slate-900 font-bold"><FaCalendarAlt className="text-slate-400" /> {order.customerName}</p>
                    <p className="flex items-center gap-2"><FaPhoneAlt className="text-slate-400" /> {order.phone}</p>
                    <p className="flex items-start gap-2 leading-relaxed">
                      <FaMapMarkerAlt className="text-slate-400 mt-0.5" /> 
                      <span>
                        <span className="text-[10px] uppercase font-bold block text-slate-400 mb-0.5">
                          {order.deliveryMethod || 'Delivery'} Address
                        </span>
                        {order.shippingAddress}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Items Ordered (5 cols) */}
                <div className="md:col-span-5 space-y-3.5 border-t md:border-t-0 md:border-l md:pl-6 border-slate-100">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-1">Items Summary</h5>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center text-xs">
                        <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden flex-shrink-0 border">
                          <img src={item.product?.image || '/logo.png'} alt="Product" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h6 className="font-bold text-slate-800 line-clamp-1">{item.product?.title || 'Unknown Product'}</h6>
                          <p className="text-[10px] text-slate-450 mt-0.5 font-semibold">Qty: {item.quantity} x ₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <span className="font-black text-brand-navy font-mono">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary (3 cols) */}
                <div className="md:col-span-3 space-y-3.5 border-t md:border-t-0 md:border-l md:pl-6 border-slate-100 text-right font-semibold text-xs text-slate-500">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-50 pb-1 text-right">Summary</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-slate-805">₹{order.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="text-slate-750 font-bold">{order.deliveryMethod || 'Delivery'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="text-green-600 uppercase font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1.5">
                      <span>Payment:</span>
                      <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                        {order.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                    {order.paymentStatus === 'Paid' && (
                      <div className="flex justify-between">
                        <span>Gateway:</span>
                        <span className="text-slate-500 font-semibold text-[10px] truncate max-w-[120px]">{order.paymentMethod}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black border-t border-slate-100 pt-2 text-brand-navy">
                      <span>Total Pay:</span>
                      <span className="text-brand-red">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status selectors & Delete footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-xl flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Update Shipment:</span>
                  <div className="flex gap-1.5">
                    {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        disabled={order.orderStatus === status || submitting}
                        onClick={() => handleUpdateStatus(order._id, status)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-heading font-black uppercase tracking-wider border cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          order.orderStatus === status
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/invoice/${order._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-lg shadow-sm cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-bold font-heading uppercase tracking-wide"
                  >
                    <FaFileInvoice className="text-sm" /> Invoice
                  </a>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="p-2.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-650 rounded-lg shadow-sm cursor-pointer transition-colors flex items-center gap-1.5 text-xs font-bold font-heading uppercase tracking-wide"
                    title="Delete Order Record"
                  >
                    <FaTrash /> Delete Record
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white py-16 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3">
          <FaClipboardList className="text-4xl text-slate-350" />
          <p className="text-sm font-semibold text-slate-450">No customer orders recorded yet.</p>
        </div>
      )}
    </div>
  );
}
