import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FaUser, FaLock, FaSpinner, FaArrowLeft, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setErrorMsg('Please enter either an email address or a phone number to register.');
      return;
    }

    if (phone.trim()) {
      const phoneRegex = /^[6789]\d{9}$/;
      const cleanPhone = phone.replace(/[\s-+]/g, '').slice(-10);
      if (!phoneRegex.test(cleanPhone)) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    if (email.trim()) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email.trim().toLowerCase())) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);

    const res = await register(
      name.trim(),
      email.trim() ? email.trim().toLowerCase() : undefined,
      phone.trim() ? phone.trim().replace(/[\s-+]/g, '').slice(-10) : undefined,
      password
    );

    if (res.success) {
      showToast('Registration successful! Welcome to Jay Bhagwati Store.', 'success');
      navigate('/');
    } else {
      setLoading(false);
      setErrorMsg(res.message || 'Registration failed. User may already exist.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-brand-blue/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-brand-red/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl z-10 relative my-8">
        
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
            Create Customer Account
          </p>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="mb-5 bg-red-950/40 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FaUser className="text-xs" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-semibold placeholder-slate-650 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* Email Address input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address <span className="text-[9px] text-slate-550 lowercase font-normal">(Optional if phone is filled)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FaEnvelope className="text-xs" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-semibold placeholder-slate-650 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* Phone Number input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Phone Number <span className="text-[9px] text-slate-550 lowercase font-normal">(Optional if email is filled)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FaPhone className="text-xs" />
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-semibold placeholder-slate-650 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Password <span className="text-[9px] text-slate-550 lowercase font-normal">(Min. 6 characters)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FaLock className="text-xs" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-semibold placeholder-slate-650 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* Confirm Password input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FaLock className="text-xs" />
              </span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-white text-xs font-semibold placeholder-slate-650 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
              />
            </div>
          </div>

          {/* CTA Action Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-red to-red-650 hover:from-brand-blue hover:to-brand-blue text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 pt-6"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-sm" /> Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Redirect footer */}
        <div className="mt-8 text-center border-t border-slate-850 pt-5 text-xs text-slate-400 leading-relaxed font-semibold">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-red hover:text-white hover:underline transition-all">
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
}
