import { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Layers,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  Shield,
  Eye,
  Sliders,
  Code
} from 'lucide-react';
import {
  Button,
  StatusBadge,
  MetricCard,
  Alert,
  Tabs,
  Pagination,
  Modal,
  LoadingSkeleton,
  EmptyState,
  Breadcrumbs
} from '../../components/common/UI';

export default function StyleGuidePage() {
  const [activeTab, setActiveTab] = useState('colors');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoPage, setDemoPage] = useState(1);
  const [demoInput, setDemoInput] = useState('The Grand Meridian');

  const tabs = [
    { id: 'colors', label: 'Color System', icon: <Palette size={15} /> },
    { id: 'typography', label: 'Typography Scale', icon: <Type size={15} /> },
    { id: 'components', label: 'Interactive UI Atoms', icon: <Layers size={15} /> },
    { id: 'forms', label: 'Form Controls & States', icon: <Sliders size={15} /> },
    { id: 'accessibility', label: 'Human-Centered A11y', icon: <Shield size={15} /> },
  ];

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-10)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 'var(--space-2)'
        }}>
          Design System & Style Guide
        </span>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
          HotelPro Frontend Architecture
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', maxWidth: 780, marginTop: 'var(--space-2)', lineHeight: 'var(--leading-relaxed)' }}>
          Inspired by the <em>Redwerk Frontend Design Guide</em>, HotelPro incorporates human-centered CSS tokens, semantic color schemes, scalable typography, accessible micro-interactions, and modular design components.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* ── COLOR SYSTEM ───────────────────────── */}
      {activeTab === 'colors' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              1. Brand & Accent Palette
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Deep botanical Forest Green invokes calm luxury, balanced by Warm Brass accents for premium editorial resonance.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {[
                { name: 'Primary Forest Green', hex: '#234B3B', token: '--color-primary', text: '#fff' },
                { name: 'Primary Hover', hex: '#193A2D', token: '--color-primary-hover', text: '#fff' },
                { name: 'Primary Tint Light', hex: '#EAF1EE', token: '--color-primary-light', text: '#234B3B' },
                { name: 'Secondary Warm Brass', hex: '#B88B5A', token: '--color-secondary', text: '#fff' },
                { name: 'Secondary Hover', hex: '#9B7445', token: '--color-secondary-hover', text: '#fff' },
              ].map(c => (
                <div key={c.hex} className="card" style={{ padding: 'var(--space-4)' }}>
                  <div style={{ height: 72, background: c.hex, borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.text, fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>
                    {c.hex}
                  </div>
                  <strong>{c.name}</strong>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{c.token}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              2. Semantic Status Colors
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              High-contrast status tones designed to exceed WCAG 2.1 AA luminance standards for visual clarity.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {[
                { name: 'Success / Confirmed', hex: '#287A50', bg: '#EAF5EF', token: '--color-success' },
                { name: 'Warning / Attention', hex: '#A56817', bg: '#FEF3E2', token: '--color-warning' },
                { name: 'Error / Cancelled', hex: '#B42318', bg: '#FEE9E7', token: '--color-error' },
                { name: 'Info / Notice', hex: '#245CB5', bg: '#E8EEFB', token: '--color-info' },
              ].map(c => (
                <div key={c.hex} className="card" style={{ padding: 'var(--space-4)' }}>
                  <div style={{ height: 72, background: c.bg, border: `1px solid ${c.hex}`, borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.hex, fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-sm)' }}>
                    {c.hex}
                  </div>
                  <strong>{c.name}</strong>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>{c.token}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TYPOGRAPHY ─────────────────────────── */}
      {activeTab === 'typography' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
              Font Pairings & Rationale
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase' }}>UI & Content Font</span>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginTop: 4 }}>Inter</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  Engineered specifically for computer screens with tall x-height and clear distinction between glyphs.
                </p>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase' }}>Hero & Headings</span>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginTop: 4 }}>Playfair Display</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  Transitional serif font giving high-end hotel titles warmth, tradition, and architectural elegance.
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-6)' }}>
              Modular Type Scale
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { label: 'Display 4XL (48px)', size: 'var(--text-4xl)', weight: 'var(--weight-bold)', sample: 'Experience Timeless Hospitality' },
                { label: 'Heading 3XL (36px)', size: 'var(--text-3xl)', weight: 'var(--weight-bold)', sample: 'Handpicked Luxury Hotels & Suites' },
                { label: 'Heading 2XL (30px)', size: 'var(--text-2xl)', weight: 'var(--weight-bold)', sample: 'Executive Front Desk Management' },
                { label: 'Heading XL (24px)', size: 'var(--text-xl)', weight: 'var(--weight-semibold)', sample: 'Deluxe Sea View Suite Reservations' },
                { label: 'Body Base (16px)', size: 'var(--text-base)', weight: 'var(--weight-normal)', sample: 'A landmark of luxury offering ocean panoramas and world-class culinary dining.' },
                { label: 'Caption SM (14px)', size: 'var(--text-sm)', weight: 'var(--weight-normal)', sample: 'Free cancellation up to 48 hours prior to arrival · Taxes included' },
                { label: 'Micro XS (12px)', size: 'var(--text-xs)', weight: 'var(--weight-semibold)', sample: 'BOOKING REF: HP-2026-001 · RFID KEYCARD ISSUED' },
              ].map(item => (
                <div key={item.label} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block', marginBottom: 2 }}>{item.label}</span>
                  <div style={{ fontSize: item.size, fontWeight: item.weight, color: 'var(--color-primary)' }}>
                    {item.sample}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── UI ATOMS ───────────────────────────── */}
      {activeTab === 'components' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Buttons */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
              Button Variants & States
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Brass</Button>
              <Button variant="outline">Outline Border</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="primary" loading>Loading State</Button>
              <Button variant="primary" disabled>Disabled State</Button>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" size="sm">Small (sm)</Button>
              <Button variant="primary" size="md">Medium (md)</Button>
              <Button variant="primary" size="lg">Large (lg)</Button>
            </div>
          </div>

          {/* Status Badges */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
              Status Badges
            </h2>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <StatusBadge status="confirmed" />
              <StatusBadge status="pending" />
              <StatusBadge status="checked-in" />
              <StatusBadge status="checked-out" />
              <StatusBadge status="cancelled" />
              <StatusBadge status="available" />
              <StatusBadge status="occupied" />
              <StatusBadge status="cleaning" />
              <StatusBadge status="maintenance" />
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <MetricCard
              label="Live Occupancy"
              value="84.2%"
              change={5.1}
              changeLabel="vs target"
              icon={<Sparkles size={20} color="var(--color-primary)" />}
              iconBg="var(--color-primary-light)"
            />
            <MetricCard
              label="Avg Daily Rate"
              value="₹9,450"
              change={-2.4}
              icon={<Shield size={20} color="var(--color-warning)" />}
              iconBg="var(--color-warning-bg)"
            />
          </div>

          {/* Alerts */}
          <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              Alert Feedbacks
            </h2>
            <Alert type="info" title="Information Notice">
              Complimentary continental breakfast buffet is served daily on Level 2 between 06:30 and 10:30 AM.
            </Alert>
            <Alert type="success" title="Action Completed">
              Your room reservation #HP-2026-001 has been confirmed with instant payment verification.
            </Alert>
            <Alert type="warning" title="Advisory Alert">
              Ocean pool maintenance scheduled for tomorrow morning from 06:00 to 09:00 AM.
            </Alert>
            <Alert type="error" title="Critical Issue">
              Payment gateway timeout. No funds were deducted. Please retry with UPI or alternate card.
            </Alert>
          </div>

          {/* Modal Demo */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
              Accessible Modal Dialog
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Supports body scroll locking, background blur, Escape key dismissal, trap focus, and WCAG dialog roles.
            </p>
            <Button variant="outline" onClick={() => setDemoModalOpen(true)}>
              Launch Interactive Modal
            </Button>
          </div>

          <Modal
            isOpen={demoModalOpen}
            onClose={() => setDemoModalOpen(false)}
            title="Demonstration Accessible Modal"
            size="md"
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                <Button variant="ghost" onClick={() => setDemoModalOpen(false)}>Close</Button>
                <Button variant="primary" onClick={() => setDemoModalOpen(false)}>Save Changes</Button>
              </div>
            }
          >
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
              This dialog meets WCAG 2.1 AA accessibility standards: focus trapped inside container, <code>aria-modal="true"</code>, and smooth micro-animations.
            </p>
          </Modal>
        </section>
      )}

      {/* ── FORM CONTROLS ───────────────────────── */}
      {activeTab === 'forms' && (
        <section className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
            Accessible Form Inputs & Interactive States
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="form-field">
              <label className="form-label" htmlFor="inp-standard">Standard Input</label>
              <input
                id="inp-standard"
                type="text"
                className="form-input"
                value={demoInput}
                onChange={e => setDemoInput(e.target.value)}
              />
              <span className="form-hint">Standard state with focus outline on click.</span>
            </div>

            <div className="form-field">
              <label className="form-label required" htmlFor="inp-error">Input with Error State</label>
              <input
                id="inp-error"
                type="email"
                className="form-input error"
                defaultValue="invalid-email-format"
              />
              <span className="form-error">Please enter a valid guest email address.</span>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="inp-disabled">Disabled Input</label>
              <input
                id="inp-disabled"
                type="text"
                className="form-input"
                disabled
                defaultValue="Locked system value"
              />
              <span className="form-hint">Read-only system field.</span>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="inp-select">Select Dropdown</label>
              <select id="inp-select" className="form-select">
                <option>Deluxe Suite (King Bed)</option>
                <option>Presidential Sea View</option>
                <option>Family Connecting Room</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* ── ACCESSIBILITY ──────────────────────── */}
      {activeTab === 'accessibility' && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
              Human-Centered Design & Accessibility (WCAG 2.1 AA)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)' }}>
                  <CheckCircle size={16} /> 4.5:1 Contrast Ratios
                </strong>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  All text colors have been verified against background tokens to ensure effortless legibility in bright or dim lighting.
                </p>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)' }}>
                  <CheckCircle size={16} /> Visible Keyboard Focus Ring
                </strong>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  Focus indicator uses <code>--color-focus: #276EF1</code> with 2px offset for keyboard accessibility (Tab / Shift+Tab).
                </p>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)' }}>
                  <CheckCircle size={16} /> Respects Reduced Motion
                </strong>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  Media query <code>prefers-reduced-motion: reduce</code> disables heavy transitions for vestibular-sensitive guests.
                </p>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)' }}>
                  <CheckCircle size={16} /> Semantic HTML5 Landmarks
                </strong>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  Built with <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, and <code>&lt;footer&gt;</code> for assistive screen readers.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
