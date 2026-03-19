import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem('dayzen_token');
  if (!token) {
    setLoading(false);
    return;
  }

  fetchMe();
}, []);

  const fetchMe = async () => {
  try {
    const { data } = await api.get('/api/auth/me');
    setUser(data.user);
  } catch (err) {
    // ✅ If offline → DO NOT logout
    if (!navigator.onLine) {
      console.log('Offline - keeping user session');
    } else {
      // ❌ Only logout if real auth error
      localStorage.removeItem('dayzen_token');
      setUser(null);
    }
  } finally {
    setLoading(false);
  }
};

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    localStorage.setItem('dayzen_token', data.token);
    setUser(data.user);
    toast.success('Welcome to Dayzen! ✨');
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('dayzen_token', data.token);
    setUser(data.user);
    toast.success('Welcome back! 🌟');
  };

  const logout = () => {
    localStorage.removeItem('dayzen_token');
    setUser(null);
    toast('See you soon 👋');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);