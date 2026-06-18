import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Public Layout & View Components
import Loader from './components/Loader';
import Header from './components/Header';
import HomeView from './components/HomeView';
import About from './components/About';
import Products from './components/Products';
import WhyChooseUs from './components/WhyChooseUs';
import Stats from './components/Stats';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import InquiryModal from './components/InquiryModal';
import CartDrawer from './components/CartDrawer';

// Admin Core & View Components
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManager from './pages/admin/ProductManager';
import InquiryManager from './pages/admin/InquiryManager';
import GalleryManager from './pages/admin/GalleryManager';
import VideoManager from './pages/admin/VideoManager';
import TestimonialManager from './pages/admin/TestimonialManager';
import OrderManager from './pages/admin/OrderManager';
import CustomerManager from './pages/admin/CustomerManager';
import InvoiceManager from './pages/admin/InvoiceManager';
import InvoiceForm from './pages/admin/InvoiceForm';
import InvoicePreview from './pages/admin/InvoicePreview';
import Reports from './pages/admin/Reports';
import ProductDetails from './pages/ProductDetails';
import { useCart } from './context/CartContext';

// Auth Pages
import Login from './pages/Login';
import CustomerRegister from './pages/Register';
import Cart from './pages/Cart';
import Invoice from './pages/Invoice';

// Scroll reset on path navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper to map state-routing calls in HomeView to URL redirect paths
function HomeRouteWrapper({ handleInquiryClick }) {
  const navigate = useNavigate();
  return (
    <HomeView
      onInquiryClick={handleInquiryClick}
      setCurrentView={(viewId) => navigate(viewId === 'home' ? '/' : `/${viewId}`)}
    />
  );
}

// Global Layout wrapper coordinating headers, footers, and inquiries modals
function MainLayout({ onInquiryClick, selectedProduct, handleCloseInquiry, isInquiryOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCartOpen, setIsCartOpen } = useCart();

  // Sync state routing links
  const getActiveView = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    return path.substring(1); // '/about' -> 'about'
  };

  const currentView = getActiveView();
  const setCurrentView = (viewId) => {
    navigate(viewId === 'home' ? '/' : `/${viewId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentView={currentView} setCurrentView={setCurrentView} onInquiryClick={onInquiryClick} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer setCurrentView={setCurrentView} />
      <FloatingActions />
      <AnimatePresence>
        {isInquiryOpen && (
          <InquiryModal
            isOpen={isInquiryOpen}
            onClose={handleCloseInquiry}
            selectedProduct={selectedProduct}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleInquiryClick = (productName = '') => {
    setSelectedProduct(productName);
    setIsInquiryOpen(true);
  };

  const handleCloseInquiry = () => {
    setIsInquiryOpen(false);
    setSelectedProduct('');
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader />}
      </AnimatePresence>

      {!isLoading && (
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Layout and Routes */}
            <Route element={
              <MainLayout 
                onInquiryClick={handleInquiryClick}
                selectedProduct={selectedProduct}
                handleCloseInquiry={handleCloseInquiry}
                isInquiryOpen={isInquiryOpen}
              />
            }>
              <Route path="/" element={<HomeRouteWrapper handleInquiryClick={handleInquiryClick} />} />
              
              <Route path="/about" element={
                <>
                  <div className="bg-brand-navy text-white pt-36 pb-16 px-4 text-center border-b border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,52,126,0.15),transparent_70%)]" />
                    <h1 className="text-3xl md:text-5xl font-heading font-black relative z-10 animate-fade-in">About Our Company</h1>
                    <p className="text-slate-400 text-xs md:text-sm mt-3 tracking-widest uppercase font-bold relative z-10">Jay Bhagwati Tools & Machinery</p>
                  </div>
                  <About />
                  <WhyChooseUs />
                  <Stats />
                </>
              } />
              
              <Route path="/products" element={
                <>
                  <div className="bg-brand-navy text-white pt-36 pb-16 px-4 text-center border-b border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,52,126,0.15),transparent_70%)]" />
                    <h1 className="text-3xl md:text-5xl font-heading font-black relative z-10 animate-fade-in">Product Catalogue</h1>
                    <p className="text-slate-400 text-xs md:text-sm mt-3 tracking-widest uppercase font-bold relative z-10">Certified Engineering Supplies</p>
                  </div>
                  <Products onInquiryClick={handleInquiryClick} />
                </>
              } />

              <Route path="/products/:id" element={
                <>
                  <ProductDetails />
                </>
              } />

              <Route path="/cart" element={
                <>
                  <Cart />
                </>
              } />


              <Route path="/why-choose-us" element={
                <>
                  <div className="bg-brand-navy text-white pt-36 pb-16 px-4 text-center border-b border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,52,126,0.15),transparent_70%)]" />
                    <h1 className="text-3xl md:text-5xl font-heading font-black relative z-10 animate-fade-in">Why Choose Us</h1>
                    <p className="text-slate-400 text-xs md:text-sm mt-3 tracking-widest uppercase font-bold relative z-10">Our Structural Advantages</p>
                  </div>
                  <WhyChooseUs />
                </>
              } />

              <Route path="/gallery" element={
                <>
                  <div className="bg-brand-navy text-white pt-36 pb-16 px-4 text-center border-b border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,52,126,0.15),transparent_70%)]" />
                    <h1 className="text-3xl md:text-5xl font-heading font-black relative z-10 animate-fade-in">Media Gallery</h1>
                    <p className="text-slate-400 text-xs md:text-sm mt-3 tracking-widest uppercase font-bold relative z-10">A Visual Tour of Our Facility</p>
                  </div>
                  <Gallery />
                </>
              } />

              <Route path="/testimonials" element={
                <>
                  <div className="bg-brand-navy text-white pt-36 pb-16 px-4 text-center border-b border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,52,126,0.15),transparent_70%)]" />
                    <h1 className="text-3xl md:text-5xl font-heading font-black relative z-10 animate-fade-in">Client Testimonials</h1>
                    <p className="text-slate-400 text-xs md:text-sm mt-3 tracking-widest uppercase font-bold relative z-10">What Gujarat's Industries Say</p>
                  </div>
                  <Testimonials />
                </>
              } />

              <Route path="/contact" element={
                <>
                  <div className="bg-brand-navy text-white pt-36 pb-16 px-4 text-center border-b border-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,52,126,0.15),transparent_70%)]" />
                    <h1 className="text-3xl md:text-5xl font-heading font-black relative z-10 animate-fade-in">Contact Us</h1>
                    <p className="text-slate-400 text-xs md:text-sm mt-3 tracking-widest uppercase font-bold relative z-10">Connect With Our Team</p>
                  </div>
                  <Contact initialProduct={selectedProduct} />
                </>
              } />
            </Route>

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<CustomerRegister />} />

            {/* Invoice Page Route */}
            <Route path="/invoice/:orderId" element={<Invoice />} />

            {/* Admin Authentication Login Route (rendered using unified page) */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin Console Protected Sub-Routes */}
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="inquiries" element={<InquiryManager />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="videos" element={<VideoManager />} />
              <Route path="testimonials" element={<TestimonialManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="customers" element={<CustomerManager />} />
              <Route path="invoices" element={<InvoiceManager />} />
              <Route path="invoices/new" element={<InvoiceForm />} />
              <Route path="invoices/edit/:id" element={<InvoiceForm />} />
              <Route path="invoices/view/:id" element={<InvoicePreview />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Wildcard 404 redirect */}
            <Route path="*" element={<HomeRouteWrapper handleInquiryClick={handleInquiryClick} />} />
          </Routes>
        </Router>
      )}
    </>
  );
}
