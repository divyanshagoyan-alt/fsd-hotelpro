import { Link } from 'react-router-dom';
import { ShieldAlert, Home, LogIn } from 'lucide-react';
import { Button } from '../../components/common/UI';

export default function UnauthorizedPage() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-16)', textAlign: 'center', maxWidth: 560 }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'var(--color-error-bg)',
        color: 'var(--color-error)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto var(--space-6)'
      }}>
        <ShieldAlert size={40} />
      </div>

      <span style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--color-error)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        403 — Access Restricted
      </span>

      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', marginBlock: 'var(--space-3)' }}>
        Authorized Personnel Only
      </h1>

      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
        You do not possess the required staff or administrator permissions to view this section. Please sign in with an authorized account or return to the guest portal.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Home size={16} /> Home
        </Link>
        <Link to="/login" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <LogIn size={16} /> Switch Account
        </Link>
      </div>
    </div>
  );
}
