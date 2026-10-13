import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Alert } from '../../components/common/UI';
import { Eye, EyeOff, Lock, UserCheck, ShieldCheck, Sparkles, Building } from 'lucide-react';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'guest@demo.com', password: 'demo123' });
  const [activeRole, setActiveRole] = useState('guest');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { role: 'guest', label: 'Guest', email: 'guest@demo.com', icon: <UserCheck size={14} />, desc: 'Guest Portal' },
    { role: 'staff', label: 'Staff', email: 'staff@demo.com', icon: <Building size={14} />, desc: 'Front Desk' },
    { role: 'manager', label: 'Manager', email: 'manager@demo.com', icon: <Sparkles size={14} />, desc: 'Operations' },
    { role: 'admin', label: 'Admin', email: 'admin@demo.com', icon: <ShieldCheck size={14} />, desc: 'Executive' },
  ];

  const handleSelectDemo = (account) => {
    setActiveRole(account.role);
    setForm({ email: account.email, password: 'demo123' });
    setError('');
    toast.info(`Selected ${account.label} demo account. Click 'Sign In' to proceed.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Both email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}!`);
      // Role-based redirect
      const redirectMap = {
        admin: '/admin',
        manager: '/admin',
        staff: '/staff/front-desk',
        guest: '/my-bookings'
      };
      navigate(redirectMap[user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 15%, var(--color-primary-light) 0%, var(--color-bg) 60%)',
      padding: 'var(--space-10) var(--space-4)',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: 52,
            height: 52,
            background: 'var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-secondary)',
            fontFamily: 'var(--font-editorial)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 'bold',
            margin: '0 auto var(--space-4)',
            boxShadow: 'var(--shadow-md)',
          }}>
            H
          </div>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--color-primary)',
            marginBottom: 'var(--space-2)',
            letterSpacing: '-0.02em'
          }}>
            Welcome to HotelPro
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
            Sign in to access your reservations or operational dashboard
          </p>
        </div>

        {/* Card Form */}
        <div className="card" style={{
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}>
          {/* Quick Demo Selector */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-3)'
            }}>
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-bold)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-text-secondary)'
              }}>
                1-Click Demo Accounts
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)', fontWeight: 'var(--weight-semibold)' }}>
                Pass: demo123
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-2)'
            }}>
              {demoAccounts.map((account) => {
                const isSelected = activeRole === account.role;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => handleSelectDemo(account)}
                    style={{
                      border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: isSelected ? 'var(--color-primary-light)' : 'var(--color-bg)',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-2) var(--space-1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    title={`Click to fill ${account.label} credentials`}
                  >
                    <span style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                      {account.icon}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}>
                      {account.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {error && (
              <Alert type="error">{error}</Alert>
            )}

            <div className="form-field">
              <label className="form-label" htmlFor="login-email" style={{ marginBottom: 'var(--space-2)' }}>
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${error ? 'error' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={e => {
                  setForm(f => ({ ...f, email: e.target.value }));
                  setActiveRole('');
                }}
                required
                style={{ height: 46, fontSize: 'var(--text-base)' }}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div className="form-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 'var(--weight-semibold)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="form-input-wrapper">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ height: 46, fontSize: 'var(--text-base)' }}
                />
                <button
                  type="button"
                  className="form-input-action"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPass(v => !v)}
                  style={{ height: 46 }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
              style={{ height: 48, fontSize: 'var(--text-base)', marginTop: 'var(--space-2)' }}
            >
              Sign In to HotelPro
            </Button>

            <p style={{
              textAlign: 'center',
              marginTop: 'var(--space-4)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              borderTop: '1px solid var(--color-border)',
              paddingTop: 'var(--space-4)'
            }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-link" style={{ fontWeight: 'var(--weight-semibold)' }}>
                Create one free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
