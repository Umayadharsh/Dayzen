import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Returns 0-4 score for password strength
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = [
  'bg-red-400', 'bg-red-400', 'bg-yellow-400',
  'bg-green-400', 'bg-green-500'
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const pwStrength = getStrength(form.password);

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = 'Name is required';
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = 'Enter a valid email';
    if (form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm)
      e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-brown-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brown-700 mb-3">
            <BookOpen size={22} className="text-brown-100" />
          </div>
          <h1 className="font-serif text-4xl text-brown-800 dark:text-brown-100 mb-1">
            Dayzen
          </h1>
          <p className="text-brown-400 text-sm">Start your memory journal today</p>
        </div>

        <div className="card p-8">
          <h2 className="font-serif text-2xl text-brown-800 dark:text-brown-100 mb-6">
            Create account
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-brown-600 dark:text-brown-300 mb-1.5 block">
                Full name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="Your name"
                autoComplete="name"
                className={`input ${errors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-brown-600 dark:text-brown-300 mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                autoComplete="email"
                className={`input ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-brown-600 dark:text-brown-300 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className={`input pr-10 ${errors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-600 transition"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          pwStrength >= i
                            ? strengthColor[pwStrength]
                            : 'bg-brown-100 dark:bg-brown-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-brown-400">
                    {strengthLabel[pwStrength]}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-sm font-medium text-brown-600 dark:text-brown-300 mb-1.5 block">
                Confirm password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`input ${errors.confirm ? 'border-red-400 focus:ring-red-300' : ''}`}
              />
              {errors.confirm && (
                <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>
              )}
            </div>

            {/* Terms note */}
            <p className="text-xs text-brown-400 leading-relaxed">
              By creating an account, you agree to store your memories privately and securely.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-brown-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brown-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}