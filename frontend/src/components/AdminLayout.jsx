import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  FaCog, FaChartLine, FaBoxes, FaClipboardList, 
  FaImages, FaRegCommentDots, FaSignOutAlt, FaBars, FaTimes, 
  FaUserShield, FaGlobe, FaShoppingBag, FaFileInvoiceDollar, FaUsers, FaChartBar, FaVideo 
} from 'react-icons/fa';

export default function AdminLayout() {
  const { adminUser, isAdminAuthenticated, adminLogout, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartLine /> },
    { name: 'Products Manager', path: '/admin/dashboard/products', icon: <FaBoxes /> },
    { name: 'GST Billing', path: '/admin/dashboard/invoices', icon: <FaFileInvoiceDollar /> },
    { name: 'Customer Directory', path: '/admin/dashboard/customers', icon: <FaUsers /> },
    { name: 'Financial Reports', path: '/admin/dashboard/reports', icon: <FaChartBar /> },
    { name: 'Orders Manager', path: '/admin/dashboard/orders', icon: <FaShoppingBag /> },
    { name: 'Inquiries List', path: '/admin/dashboard/inquiries', icon: <FaClipboardList /> },
    { name: 'Gallery Manager', path: '/admin/dashboard/gallery', icon: <FaImages /> },
    { name: 'Video Manager', path: '/admin/dashboard/videos', icon: <FaVideo /> },
    { name: 'Testimonials Mgr', path: '/admin/dashboard/testimonials', icon: <FaRegCommentDots /> },
  ];

  const handleLogout = () => {
    adminLogout();
    showToast('Logged out successfully.', 'info');
    navigate('/admin/login');
  };

  // Redirect to login if not authenticated (after loading completes)
  React.useEffect(() => {
    if (!loading && (!isAdminAuthenticated || adminUser?.role !== 'admin')) {
      navigate('/admin/login');
    }
  }, [loading, isAdminAuthenticated, adminUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wider uppercase text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated || adminUser?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigation - Desktop */}
      <aside className="bg-brand-navy text-slate-300 w-64 fixed inset-y-0 left-0 z-30 hidden lg:flex flex-col border-r border-slate-800 shadow-xl">
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white">
            <FaCog className="text-lg animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-heading font-black text-white text-sm tracking-wide">JB TOOLS</h1>
            <p className="text-[9px] text-slate-400 tracking-wider font-bold uppercase leading-none">Admin Panel</p>
          </div>
        </div>

        {/* User Info */}
        <div className="p-5 border-b border-slate-850 flex items-center gap-3 bg-slate-900/30">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-red">
            <FaUserShield />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-heading font-bold text-xs text-white truncate">{adminUser?.name || 'Admin'}</h4>
            <p className="text-[9px] text-slate-500 truncate font-semibold">{adminUser?.email}</p>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="flex-grow p-4 space-y-1.5 pt-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-lg border-l-4 border-brand-red' 
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick redirect to website + Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col gap-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-350 transition-colors uppercase border border-slate-800"
          >
            <FaGlobe /> Live Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-brand-red hover:bg-red-700 rounded-xl text-white transition-colors uppercase cursor-pointer"
          >
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          {/* Mobile drawer toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-650 hover:text-slate-900 lg:hidden p-2"
          >
            <FaBars className="text-xl" />
          </button>
          
          <h2 className="font-heading font-black text-brand-navy text-lg hidden md:block">
            {menuItems.find(item => item.path === location.pathname)?.name || 'Admin Console'}
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Welcome, <strong className="text-brand-navy font-bold">{adminUser?.name}</strong>
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
              <FaUserShield className="text-sm" />
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace Content */}
        <main className="p-6 md:p-8 flex-grow">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer Menu Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
          />
          {/* Drawer box */}
          <aside className="bg-brand-navy text-slate-300 w-64 relative z-10 flex flex-col h-full border-r border-slate-800 shadow-2xl animate-fade-in">
            {/* Close Button */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Logo */}
            <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-white">
                <FaCog className="text-lg animate-spin-slow" />
              </div>
              <h1 className="font-heading font-black text-white text-sm tracking-wide">JB TOOLS</h1>
            </div>

            {/* Menu */}
            <nav className="flex-grow p-4 space-y-1.5 pt-8">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-850 text-white shadow-lg border-l-4 border-brand-red' 
                        : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-slate-900 rounded-xl text-slate-350 border border-slate-805"
              >
                <FaGlobe /> Live Website
              </Link>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-brand-red rounded-xl text-white cursor-pointer"
              >
                <FaSignOutAlt /> Log Out
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
