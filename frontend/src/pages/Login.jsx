import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FaUser, FaLock, FaSpinner, FaArrowLeft, FaRegEnvelope, FaPhone } from 'react-icons/fa';

export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, isAuthenticated, isAdminAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    } else if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isAdminAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password.trim()) {
      setErrorMsg('Please enter your email or phone number and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await login(emailOrPhone.trim(), password);

    if (res.success) {
      if (res.role === 'admin') {
        showToast('Welcome back, Admin!', 'success');
        navigate('/admin/dashboard');
      } else {
        showToast('Logged in successfully!', 'success');
        navigate('/');
      }
    } else {
      setLoading(false);
      setErrorMsg(res.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cinematic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-brand-blue/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-brand-red/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl z-10 relative">
        
        {/* Back navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-white mb-6 transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform" /> Back to Store
        </Link>

        {/* Brand header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-lg border border-slate-700">
            <img src="/logo.png" alt="Jay Bhagwati Logo" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="font-heading font-black text-xl text-white tracking-wide leading-none">
            JAY BHAGWATI
          </h2>
          <p className="text-[9px] tracking-[0.25em] text-brand-red font-bold uppercase mt-1.5">
            Tools & Machinery Portal Login
          </p>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="mb-5 bg-red-950/40 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email or Phone input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address / Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FaUser className="text-xs" />
              </span>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter email or 10-digit mobile number"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-semibold placeholder-slate-600 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FaLock className="text-xs" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-semibold placeholder-slate-600 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* CTA Action Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-red to-red-650 hover:from-brand-blue hover:to-brand-blue text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-sm" /> Processing...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Register Redirect footer */}
        <div className="mt-8 text-center border-t border-slate-850 pt-5 text-xs text-slate-400 leading-relaxed font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-red hover:text-white hover:underline transition-all">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
