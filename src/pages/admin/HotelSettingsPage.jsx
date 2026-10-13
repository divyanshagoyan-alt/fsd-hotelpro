import { useState } from 'react';
import {
  Building2,
  Save,
  Clock,
  Shield,
  Percent,
  Bell,
  Mail,
  MapPin,
  CheckCircle,
  Phone
} from 'lucide-react';
import { mockHotels } from '../../data/mock/mockData';
import { Button } from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function HotelSettingsPage() {
  const [selectedHotelId, setSelectedHotelId] = useState('h1');
  const [saving, setSaving] = useState(false);

  const selectedHotel = mockHotels.find(h => h.id === selectedHotelId) || mockHotels[0];

  const [settings, setSettings] = useState({
    name: selectedHotel.name,
    location: selectedHotel.location,
    city: selectedHotel.city,
    checkInTime: selectedHotel.checkInTime || '14:00',
    checkOutTime: selectedHotel.checkOutTime || '11:00',
    gstRate: 18,
    currency: 'INR (₹)',
    cancellationWindow: '48',
    autoAssignHousekeeping: true,
    emailConfirmations: true,
    smsAlerts: true,
    dailyReportEmail: 'generalmanager@hotelpro.com',
  });

  const handleHotelChange = (e) => {
    const newId = e.target.value;
    setSelectedHotelId(newId);
    const hotel = mockHotels.find(h => h.id === newId) || mockHotels[0];
    setSettings(prev => ({
      ...prev,
      name: hotel.name,
      location: hotel.location,
      city: hotel.city,
      checkInTime: hotel.checkInTime || '14:00',
      checkOutTime: hotel.checkOutTime || '11:00',
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success(`Settings updated successfully for ${settings.name}.`);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 1080 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Property & System Settings
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Configure hotel branches, check-in policies, taxation rules, and operational automation.
          </p>
        </div>
        <Button variant="primary" onClick={handleSave} loading={saving} icon={<Save size={16} />}>
          Save All Changes
        </Button>
      </div>

      {/* Property Switcher */}
      <div className="card" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <label className="form-label" style={{ marginBottom: 4 }}>Active Hotel Property</label>
            <select
              className="form-select"
              value={selectedHotelId}
              onChange={handleHotelChange}
              style={{ fontWeight: 'var(--weight-semibold)' }}
            >
              {mockHotels.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.location} ({h.totalRooms} rooms)
                </option>
              ))}
            </select>
          </div>
          <span className="badge badge-success" style={{ alignSelf: 'center' }}>
            Live & Operational
          </span>
        </div>
      </div>

      {/* Form Sections */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* General Details */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
            Property Identification & Schedule
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
            Official property metadata and daily front-office check-in / check-out timings
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="form-field">
              <label className="form-label">Hotel Display Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.name}
                onChange={e => setSettings(s => ({ ...s, name: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Location / Address</label>
              <input
                type="text"
                className="form-input"
                value={settings.location}
                onChange={e => setSettings(s => ({ ...s, location: e.target.value }))}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Check-In Standard Time</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                <input
                  type="time"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={settings.checkInTime}
                  onChange={e => setSettings(s => ({ ...s, checkInTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Check-Out Standard Time</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                <input
                  type="time"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={settings.checkOutTime}
                  onChange={e => setSettings(s => ({ ...s, checkOutTime: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Taxation & Policies */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
            Taxation, Currency & Cancellation Policies
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
            Statutory Goods & Services Tax (GST) rate, billing currency, and guest cancellation window
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="form-field">
              <label className="form-label">Default GST Rate (%)</label>
              <div style={{ position: 'relative' }}>
                <Percent size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                <input
                  type="number"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  value={settings.gstRate}
                  onChange={e => setSettings(s => ({ ...s, gstRate: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Billing Currency</label>
              <input
                type="text"
                className="form-input"
                value={settings.currency}
                disabled
              />
            </div>
            <div className="form-field">
              <label className="form-label">Free Cancellation Threshold</label>
              <select
                className="form-select"
                value={settings.cancellationWindow}
                onChange={e => setSettings(s => ({ ...s, cancellationWindow: e.target.value }))}
              >
                <option value="24">Up to 24 hours prior to check-in</option>
                <option value="48">Up to 48 hours prior to check-in</option>
                <option value="72">Up to 72 hours prior to check-in</option>
                <option value="120">Up to 5 days prior to check-in</option>
              </select>
            </div>
          </div>
        </div>

        {/* Operational Automations */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
            Operational Automation & Notifications
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
            Automatic housekeeping task generation, guest SMS alerts, and staff reporting
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.autoAssignHousekeeping}
                onChange={e => setSettings(s => ({ ...s, autoAssignHousekeeping: e.target.checked }))}
                style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
              />
              <div>
                <strong>Auto-generate cleaning task on guest check-out</strong>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Immediately routes a high-priority cleaning assignment to housekeeping floor staff when Front Desk checks out a guest.
                </div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.emailConfirmations}
                onChange={e => setSettings(s => ({ ...s, emailConfirmations: e.target.checked }))}
                style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
              />
              <div>
                <strong>Send automated digital booking voucher & invoice</strong>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Dispatches PDF reservation confirmation and payment receipt directly to the guest's registered email address.
                </div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <Button type="submit" variant="primary" loading={saving} icon={<Save size={16} />}>
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
