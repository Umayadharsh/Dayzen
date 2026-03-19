import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
import MemoryDetail from './pages/MemoryDetail.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right"
            toastOptions={{ style: { fontFamily: 'DM Sans' } }} />
            <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route
  path="/memory/:id"
  element={
    <PrivateRoute>
      <MemoryDetail/>
    </PrivateRoute>
  }
/>
          </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}