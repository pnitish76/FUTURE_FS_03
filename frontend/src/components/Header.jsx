import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaClock, FaBars, FaTimes, FaShoppingBag, FaSearch } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ currentView, setCurrentView, onInquiryClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/products', { state: { search: navSearch.trim() } });
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Products', id: 'products' },
    { name: 'Why Choose Us', id: 'why-choose-us' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact Us', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setCurrentView(id);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300">


      {/* Main Glassmorphic Navigation Bar */}
      <nav className={`transition-all duration-300 px-4 md:px-8 py-3 md:py-4 ${
        isScrolled 
          ? 'glassmorphism shadow-lg py-2.5 md:py-3' 
          : 'bg-brand-navy/95 border-b border-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left Brand Logo & Navigation Links Group */}
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Logo Brand area */}
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-white rounded-lg p-0.5 overflow-hidden flex items-center justify-center border border-slate-700 transition-transform group-hover:scale-105 duration-300">
                <img src="/logo.png" alt="Jay Bhagwati Logo" className="object-contain w-full h-full" />
              </div>
              <div className="flex-shrink-0">
                <span className="font-heading font-black text-lg md:text-xl text-white tracking-wide block leading-none whitespace-nowrap">
                  JAY BHAGWATI
                </span>
                <span className="text-[9px] md:text-[10px] tracking-[0.22em] text-brand-red font-semibold uppercase block mt-1 whitespace-nowrap">
                  Tools & Machinery
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex space-x-0.5 xl:space-x-1.5 items-center">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-2 py-1.5 text-xs xl:text-sm font-semibold rounded-md transition-all duration-200 relative whitespace-nowrap ${
                    currentView === link.id
                      ? 'text-white bg-slate-800'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                  {currentView === link.id && (
                    <span className="absolute bottom-1.5 left-2 right-2 h-[2px] bg-brand-red rounded-full" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Action Area (Cart + Get Quote) */}
          <div className="flex items-center">
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative w-32 lg:w-44 focus-within:w-48 xl:focus-within:w-56 transition-all duration-300 mr-2 xl:mr-3 h-10">
              <input
                type="text"
                placeholder="Search..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full h-10 bg-slate-800 border border-slate-700 focus:border-brand-red focus:bg-slate-850 text-white rounded-xl pl-9 pr-7 text-xs transition-all outline-none"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => setNavSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer flex items-center justify-center"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              )}
            </form>

            {/* Cart Button */}
            <button 
              onClick={() => navigate('/cart')}
              className="relative h-10 w-10 bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl text-slate-350 hover:text-white transition-all cursor-pointer mr-2 lg:mr-3 flex items-center justify-center shadow-md hover:scale-105"
              title="Open Shopping Cart"
            >
              <FaShoppingBag className="text-sm" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-red text-white text-[9px] font-black rounded-full flex items-center justify-center shadow border border-slate-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Account section */}
            <div className="mr-2 lg:mr-3 hidden xl:block">
              {isAuthenticated ? (
                <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-3.5 h-10 rounded-xl text-slate-350">
                  <span className="text-xs font-bold text-white truncate max-w-[100px]" title={user?.name}>
                    Hi, {user?.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={logout}
                    className="text-[10px] uppercase font-heading font-extrabold tracking-wider bg-brand-red/20 hover:bg-brand-red text-brand-red hover:text-white px-2 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="h-10 px-4 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 rounded-xl text-xs font-heading font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors flex items-center justify-center shadow-md hover:scale-105"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* CTA Action Button - Desktop Only */}
            <div className="hidden xl:block">
              <button
                onClick={() => onInquiryClick("General Inquiry")}
                className="bg-gradient-to-r from-brand-red to-red-600 text-white font-heading font-bold text-xs px-5 h-10 rounded-xl shadow-md hover:shadow-brand-red/20 hover:scale-105 transition-all duration-300 uppercase tracking-wide cursor-pointer flex items-center justify-center"
              >
                Get a Quote
              </button>
            </div>

            {/* Mobile menu Toggle */}
            <div className="lg:hidden flex items-center ml-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-brand-red focus:outline-none p-1.5 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-30 bg-brand-navy/98 backdrop-blur-lg flex flex-col justify-start pt-8 px-6 space-y-4 border-t border-slate-800 transition-transform duration-300">
          {/* Mobile Search Box */}
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              setMobileMenuOpen(false); 
              handleSearchSubmit(e); 
            }} 
            className="w-full relative mb-2"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-brand-red text-white rounded-xl pl-10 pr-8 py-2.5 text-xs transition-all outline-none"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-xs pointer-events-none" />
            {navSearch && (
              <button
                type="button"
                onClick={() => setNavSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white text-sm cursor-pointer p-0.5"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </form>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={`py-3 text-lg font-heading font-bold tracking-wide border-b border-slate-800 transition-colors ${
                currentView === link.id ? 'text-brand-red border-brand-red/50' : 'text-slate-200 hover:text-brand-red'
              }`}
            >
              {link.name}
            </a>
          ))}


          <div className="pt-8 flex flex-col space-y-4">
            <a
              href="tel:+919227070338"
              className="flex items-center justify-center gap-2.5 bg-brand-blue text-white py-3 rounded-xl font-heading font-bold text-base hover:bg-brand-blue/90 shadow-md"
            >
              <FaPhoneAlt /> Call Support
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onInquiryClick("General Inquiry");
              }}
              className="bg-brand-red text-white py-3 rounded-xl font-heading font-bold text-base hover:bg-brand-red/90 shadow-md"
            >
              Request a Quote
            </button>
          </div>

          <div className="pt-6 flex flex-col space-y-4 border-t border-slate-800/80 mt-6">
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-slate-300 text-center">
                  Logged in as <strong className="text-white">{user?.name}</strong>
                </span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-white py-3 rounded-xl font-heading font-bold text-base hover:text-brand-red transition-all cursor-pointer text-center animate-fade-in"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-white py-3 rounded-xl font-heading font-bold text-base text-center uppercase tracking-wider block"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
