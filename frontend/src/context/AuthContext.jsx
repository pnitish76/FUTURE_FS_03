import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Customer authentication states
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admin authentication states
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      // 1. Load Admin Session
      const storedAdminToken = localStorage.getItem('adminToken');
      const storedAdminUser = localStorage.getItem('adminUser');

      if (storedAdminToken && storedAdminUser) {
        try {
          const parsedAdmin = JSON.parse(storedAdminUser);
          setAdminToken(storedAdminToken);
          setAdminUser(parsedAdmin);
          setIsAdminAuthenticated(true);

          // Verify token with backend
          const res = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${storedAdminToken}` }
          });
          if (res.data.success && res.data.user.role === 'admin') {
            setAdminUser(res.data.user);
            localStorage.setItem('adminUser', JSON.stringify(res.data.user));
          } else {
            adminLogout();
          }
        } catch (error) {
          console.error('Failed to validate admin token:', error.message);
          if (error.response && error.response.status === 401) {
            adminLogout();
          }
        }
      }

      // 2. Load Customer Session
      const storedCustomerToken = localStorage.getItem('customerToken');
      const storedCustomerUser = localStorage.getItem('customerUser');

      if (storedCustomerToken && storedCustomerUser) {
        try {
          const parsedCustomer = JSON.parse(storedCustomerUser);
          setToken(storedCustomerToken);
          setUser(parsedCustomer);
          setIsAuthenticated(true);

          // Verify token with backend
          const res = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${storedCustomerToken}` }
          });
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('customerUser', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to validate customer token:', error.message);
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      }

      setLoading(false);
    };

    loadSessions();
  }, []);

  // Unified Login
  const login = async (emailOrPhone, password) => {
    try {
      const res = await api.post('/auth/login', { emailOrPhone, password });
      
      if (res.data.success) {
        const { token: userToken, ...userData } = res.data;
        
        if (userData.role === 'admin') {
          // Store Admin Session
          localStorage.setItem('adminToken', userToken);
          localStorage.setItem('adminUser', JSON.stringify(userData));
          setAdminToken(userToken);
          setAdminUser(userData);
          setIsAdminAuthenticated(true);
          return { success: true, role: 'admin' };
        } else {
          // Store Customer Session
          localStorage.setItem('customerToken', userToken);
          localStorage.setItem('customerUser', JSON.stringify(userData));
          setToken(userToken);
          setUser(userData);
          setIsAuthenticated(true);
          return { success: true, role: 'customer' };
        }
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message: msg };
    }
  };

  // Customer Registration
  const register = async (name, email, phone, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, phone, password, role: 'customer' });
      
      if (res.data.success) {
        const { token: userToken, ...userData } = res.data;
        
        localStorage.setItem('customerToken', userToken);
        localStorage.setItem('customerUser', JSON.stringify(userData));
        
        setToken(userToken);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      return { success: false, message: msg };
    }
  };

  // Customer Logout
  const logout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.success && res.data.role === 'admin') {
        const { token: userToken, ...userData } = res.data;
        
        localStorage.setItem('adminToken', userToken);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        
        setAdminToken(userToken);
        setAdminUser(userData);
        setIsAdminAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: 'Access denied: Admin credentials only' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Admin login failed.';
      return { success: false, message: msg };
    }
  };

  // Admin Logout
  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
    setIsAdminAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        adminUser,
        adminToken,
        isAdminAuthenticated,
        loading,
        login,
        register,
        logout,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
