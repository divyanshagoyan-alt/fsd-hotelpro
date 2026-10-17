import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Alert } from '../../components/common/UI';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    if (!form.email) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: 'guest',
      });
      toast.success('Account created! Welcome to HotelPro.');
      navigate('/my-bookings', { replace: true });
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: 'var(--space-8) var(--space-4)',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: 48, height: 48, background: 'var(--color-primary)', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-secondary)', fontFamily: 'var(--font-editorial)',
            fontSize: 'var(--text-2xl)', fontWeight: 'bold', margin: '0 auto var(--space-4)',
          }}>H</div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>Create your account</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Start booking with HotelPro today</p>
        </div>

        <form className="card card-body" onSubmit={handleSubmit} noValidate>
          {errors.general && <Alert type="error">{errors.general}</Alert>}

          <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
            <div className="form-field">
              <label className="form-label" htmlFor="reg-fname">First Name</label>
              <input id="reg-fname" type="text" className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="Arjun" value={form.firstName} onChange={set('firstName')} autoComplete="given-name" />
              {errors.firstName && <span className="form-error">{errors.firstName}</span>}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="reg-lname">Last Name</label>
              <input id="reg-lname" type="text" className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Sharma" value={form.lastName} onChange={set('lastName')} autoComplete="family-name" />
              {errors.lastName && <span className="form-error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-field mt-4">
            <label className="form-label" htmlFor="reg-email">Email address</label>
            <input id="reg-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-field mt-4">
            <label className="form-label" htmlFor="reg-pass">Password</label>
            <div className="form-input-wrapper">
              <input id="reg-pass" type={showPass ? 'text' : 'password'} className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="At least 8 characters" value={form.password} onChange={set('password')} autoComplete="new-password" />
              <button type="button" className="form-input-action" onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-field mt-4">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
            <input id="reg-confirm" type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <div className="form-check mt-4 mb-6" style={{ alignItems: 'flex-start' }}>
            <input type="checkbox" className="form-check-input" id="reg-terms" required />
            <label className="form-check-label" htmlFor="reg-terms" style={{ cursor: 'pointer' }}>
              I agree to the{' '}
              <a href="#terms" className="text-link" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-link" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Create Account
          </Button>

          <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Already have an account? <Link to="/login" className="text-link">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
