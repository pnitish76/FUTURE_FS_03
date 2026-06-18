import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { 
  FaClipboardList, FaBoxes, FaImages, FaRegCommentDots, 
  FaUser, FaCalendarAlt, FaEnvelopeOpenText, FaEye, FaCheckCircle, 
  FaSpinner, FaMoneyCheckAlt, FaShoppingBag, FaFileInvoiceDollar 
} from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    totalGallery: 0,
    totalTestimonials: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalInvoices: 0,
    invoiceRevenue: 0
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      const [prodRes, inqRes, galRes, testRes, orderRes, invRes] = await Promise.all([
        api.get('/products'),
        api.get('/inquiries'),
        api.get('/gallery'),
        api.get('/testimonials'),
        api.get('/orders'),
        api.get('/invoices').catch(() => ({ data: { success: false } }))
      ]);

      const products = prodRes.data.products || [];
      const inquiries = inqRes.data.inquiries || [];
      const gallery = galRes.data.gallery || [];
      const testimonials = testRes.data.testimonials || [];
      const orders = orderRes.data.orders || [];
      const invoices = invRes && invRes.data && invRes.data.success ? invRes.data.invoices : [];

      // Calculate total sales from non-cancelled orders
      const nonCancelled = orders.filter(o => o.orderStatus !== 'Cancelled');
      const salesSum = nonCancelled.reduce((sum, o) => sum + o.total, 0);
      const invoiceSum = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

      setStats({
        totalProducts: products.length,
        totalInquiries: inquiries.length,
        unreadInquiries: inquiries.filter(i => i.status === 'unread').length,
        totalGallery: gallery.length,
        totalTestimonials: testimonials.length,
        totalOrders: orders.length,
        totalRevenue: salesSum,
        totalInvoices: invoices.length,
        invoiceRevenue: invoiceSum
      });

      setRecentInquiries(inquiries.slice(0, 5)); // Show top 5 recent inquiries
      setRecentOrders(orders.slice(0, 5)); // Show top 5 recent orders
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error.message);
      showToast('Offline mode: Using seeded mock database details.', 'info');
      
      // Seed fallback values
      setStats({
        totalProducts: 6,
        totalInquiries: 2,
        unreadInquiries: 2,
        totalGallery: 6,
        totalTestimonials: 3,
        totalOrders: 2,
        totalRevenue: 154000,
        totalInvoices: 5,
        invoiceRevenue: 375000
      });
      setRecentInquiries([
        { _id: '1', name: 'Kirit Savaliya', phone: '9876543210', productRequirement: 'Power Tools', message: 'Looking for a bulk quote of 15 heavy-duty cordless impact drills (20V)...', status: 'unread', createdAt: new Date().toISOString() },
        { _id: '2', name: 'Amit Mehta', phone: '9988776655', productRequirement: 'Industrial Machinery', message: 'Do you supply radial drilling press machines? Need specifications for a 50mm model...', status: 'unread', createdAt: new Date().toISOString() }
      ]);
      setRecentOrders([
        { _id: 'ord1', customerName: 'Rajesh Patel', total: 120000, orderStatus: 'Pending', createdAt: new Date().toISOString() },
        { _id: 'ord2', customerName: 'Vijay Shah', total: 34000, orderStatus: 'Shipped', createdAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await api.put(`/inquiries/${id}`, { status: 'read' });
      if (res.data.success) {
        showToast('Inquiry marked as read.', 'success');
        fetchDashboardData(); // Refresh counts and lists
      }
    } catch (error) {
      showToast('Failed to update inquiry status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-3xl text-brand-red" />
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading console metrics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales (INR)',
      count: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: <FaMoneyCheckAlt />,
      colorClass: 'text-green-600 bg-green-50 border-green-105',
      path: '/admin/dashboard/orders'
    },
    {
      title: 'Total Orders',
      count: stats.totalOrders,
      icon: <FaShoppingBag />,
      colorClass: 'text-brand-blue bg-blue-50 border-blue-100',
      path: '/admin/dashboard/orders'
    },
    {
      title: 'GST Billing Vol',
      count: `₹${stats.invoiceRevenue.toLocaleString('en-IN')}`,
      icon: <FaFileInvoiceDollar />,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
      path: '/admin/dashboard/invoices'
    },
    {
      title: 'Unread Inquiries',
      count: stats.unreadInquiries,
      icon: <FaEnvelopeOpenText />,
      colorClass: stats.unreadInquiries > 0 ? 'text-brand-red bg-red-50 border-red-100' : 'text-green-600 bg-green-50 border-green-100',
      path: '/admin/dashboard/inquiries'
    },
    {
      title: 'Total Products',
      count: stats.totalProducts,
      icon: <FaBoxes />,
      colorClass: 'text-brand-navy bg-slate-100 border-slate-205',
      path: '/admin/dashboard/products'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, idx) => (
          <Link 
            key={idx} 
            to={card.path}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{card.title}</span>
              <span className="text-2xl font-heading font-black text-brand-navy block leading-none">{card.count}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg border group-hover:scale-105 transition-transform duration-300 ${card.colorClass}`}>
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* 2. Main Row: Recent Inquiries & Recent Orders Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Inquiries (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-heading font-black text-sm text-brand-navy uppercase tracking-wider">Recent Inquiries</h3>
                <p className="text-[10px] font-semibold text-slate-500 mt-1">Latest specifications requested by website visitors.</p>
              </div>
              <Link 
                to="/admin/dashboard/inquiries"
                className="text-brand-red hover:text-brand-blue font-heading font-bold text-xs tracking-wider uppercase"
              >
                View All
              </Link>
            </div>

            {recentInquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400 bg-slate-50/30">
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Requirement</th>
                      <th className="py-4 px-6 text-center">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {recentInquiries.map((inq) => (
                      <tr key={inq._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-slate-800 font-bold">{inq.name}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{inq.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2 py-1 rounded bg-brand-blue/10 border border-brand-blue/15 text-brand-blue text-[9px] font-bold uppercase">
                            {inq.productRequirement}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${
                            inq.status === 'unread' 
                              ? 'bg-red-105 text-red-650 animate-pulse border border-red-200' 
                              : 'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {inq.status === 'unread' ? (
                            <button
                              onClick={() => handleMarkAsRead(inq._id)}
                              className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm cursor-pointer"
                              title="Mark as Read"
                            >
                              <FaCheckCircle className="text-xs" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold italic">Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-450 text-sm">No recent inquiries found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Orders (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-heading font-black text-sm text-brand-navy uppercase tracking-wider">Recent Orders</h3>
                <p className="text-[10px] font-semibold text-slate-500 mt-1">Latest online checkout storefront sales.</p>
              </div>
              <Link 
                to="/admin/dashboard/orders"
                className="text-brand-red hover:text-brand-blue font-heading font-bold text-xs tracking-wider uppercase"
              >
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400 bg-slate-50/30">
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {recentOrders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-55/50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-slate-805 font-bold truncate max-w-[120px]">{ord.customerName}</p>
                            <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{ord._id.slice(-6).toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                            ord.orderStatus === 'Pending' ? 'bg-yellow-50 border-yellow-250 text-amber-500' :
                            ord.orderStatus === 'Shipped' ? 'bg-blue-50 border-blue-200 text-brand-blue' :
                            ord.orderStatus === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                            'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-brand-red font-black">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-450 text-sm">No recent orders found.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
