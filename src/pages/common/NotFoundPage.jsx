import { Link } from 'react-router-dom';
import { Home, Search, Compass } from 'lucide-react';
import { Button } from '../../components/common/UI';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-16)', textAlign: 'center', maxWidth: 600 }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto var(--space-6)'
      }}>
        <Compass size={40} />
      </div>

      <span style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--weight-bold)',
        color: 'var(--color-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        404 — Page Not Found
      </span>

      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', marginBlock: 'var(--space-3)' }}>
        We Couldn't Find That Destination
      </h1>

      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
        The page you are looking for may have been moved, renamed, or is temporarily unavailable. Let us guide you back to our luxury properties.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Home size={16} /> Return to Home
        </Link>
        <Link to="/hotels" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Search size={16} /> Explore Hotels
        </Link>
      </div>
    </div>
  );
}
