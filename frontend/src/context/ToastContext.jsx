import React, { createContext, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-lg" />;
      case 'error':
        return <FaExclamationCircle className="text-red-500 text-lg" />;
      default:
        return <FaInfoCircle className="text-brand-blue text-lg" />;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-white/95 text-slate-800 shadow-green-500/5';
      case 'error':
        return 'border-red-500/20 bg-white/95 text-slate-800 shadow-red-500/5';
      default:
        return 'border-slate-800/20 bg-white/95 text-slate-800 shadow-slate-900/5';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-24 right-6 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
              className={`flex items-center justify-between p-4 rounded-xl border shadow-xl pointer-events-auto ${getColors(toast.type)}`}
            >
              <div className="flex items-center gap-3">
                {getIcon(toast.type)}
                <span className="text-xs font-semibold text-slate-800">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-650 p-1 transition-colors cursor-pointer"
              >
                <FaTimes className="text-xs" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
export default ToastContext;
