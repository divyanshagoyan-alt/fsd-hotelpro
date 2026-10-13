import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockGuest } from '../../data/mock/mockData';
import {
  User,
  Mail,
  Phone,
  Award,
  Sparkles,
  BedDouble,
  Coffee,
  CheckCircle,
  Save,
  Shield
} from 'lucide-react';
import { Button, Alert, Breadcrumbs } from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { user } = useAuth();
  const currentGuest = user || mockGuest;

  const [formData, setFormData] = useState({
    name: currentGuest.name || 'Arjun Sharma',
    email: currentGuest.email || 'arjun.sharma@email.com',
    phone: currentGuest.phone || '+91 98765 43210',
    bedType: currentGuest.preferences?.bedType || 'King',
    roomType: currentGuest.preferences?.roomType || 'Deluxe',
    dietary: currentGuest.preferences?.dietary || 'Vegetarian',
    floorPreference: 'High Floor',
    emailNotifications: true,
    smsAlerts: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Profile and hospitality preferences saved successfully.');
    }, 600);
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Guest Portal' },
    { label: 'Profile & Preferences' },
  ];

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)', maxWidth: 880 }}>
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ marginBlock: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
          Profile & Preferences
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', marginTop: 'var(--space-1)' }}>
          Manage your personal information and personalize your hotel stay preferences.
        </p>
      </div>

      {/* Loyalty Club Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #173629 100%)',
        color: '#ffffff',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 'var(--space-8)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-4)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <Award size={20} color="var(--color-secondary)" />
            <span style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-secondary)', fontWeight: 'var(--weight-bold)' }}>
              HotelPro Privilege Club
            </span>
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)' }}>
            Gold Tier Member
          </h2>
          <p style={{ opacity: 0.85, fontSize: 'var(--text-sm)', marginTop: 4 }}>
            Enjoy 10% dining discounts, late check-out privileges, and priority room assignment.
          </p>
        </div>

        <div style={{ textAlign: 'right', background: 'rgba(255, 255, 255, 0.1)', padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: 'var(--text-xs)', opacity: 0.8, textTransform: 'uppercase' }}>Available Balance</span>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', color: '#ffffff' }} className="tabular-nums">
            {currentGuest.loyaltyPoints || 2480} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-normal)' }}>Pts</span>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)' }}>≈ ₹2,480 stay credits</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Personal Details */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <User size={18} color="var(--color-primary)" /> Personal Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="form-field">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Hospitality Preferences */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Sparkles size={18} color="var(--color-secondary)" /> Stay Preferences
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            Our hospitality team will automatically adapt future room bookings to your desired accommodations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="form-field">
              <label className="form-label" htmlFor="pref-bed">Preferred Bed Type</label>
              <select
                id="pref-bed"
                className="form-select"
                value={formData.bedType}
                onChange={e => setFormData({ ...formData, bedType: e.target.value })}
              >
                <option value="King">King Bed</option>
                <option value="Queen">Queen Bed</option>
                <option value="Twin">Twin Beds</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="pref-floor">Floor Preference</label>
              <select
                id="pref-floor"
                className="form-select"
                value={formData.floorPreference}
                onChange={e => setFormData({ ...formData, floorPreference: e.target.value })}
              >
                <option value="High Floor">High Floor (Quiet & Panoramic)</option>
                <option value="Low Floor">Low Floor (Convenient Access)</option>
                <option value="Near Elevator">Near Elevator</option>
                <option value="No Preference">No Preference</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="pref-diet">Dietary Preference</label>
              <select
                id="pref-diet"
                className="form-select"
                value={formData.dietary}
                onChange={e => setFormData({ ...formData, dietary: e.target.value })}
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Non-Vegetarian">Non-Vegetarian / No Restrictions</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Jain">Jain Friendly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <Button variant="primary" size="lg" type="submit" loading={saving} icon={<Save size={18} />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
