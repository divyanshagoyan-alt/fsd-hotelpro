import { useState } from 'react';
import {
  Users,
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { mockGuestsList } from '../../data/mock/mockData';
import { Button, StatusBadge, Tabs, Modal } from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function GuestDirectoryPage() {
  const [guests, setGuests] = useState(mockGuestsList);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const filteredGuests = guests.filter(g => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.phone.includes(q) ||
      g.city.toLowerCase().includes(q);
    const matchesTier = tierFilter === 'all' || g.vipTier.toLowerCase() === tierFilter.toLowerCase();
    return matchesSearch && matchesTier;
  });

  const tabs = [
    { id: 'all', label: 'All Guests', count: guests.length },
    { id: 'platinum', label: 'Platinum VIP', count: guests.filter(g => g.vipTier === 'Platinum').length },
    { id: 'gold', label: 'Gold', count: guests.filter(g => g.vipTier === 'Gold').length },
    { id: 'silver', label: 'Silver', count: guests.filter(g => g.vipTier === 'Silver').length },
    { id: 'bronze', label: 'Bronze', count: guests.filter(g => g.vipTier === 'Bronze').length },
  ];

  const handleUpdateTier = (id, newTier) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, vipTier: newTier } : g));
    if (selectedGuest && selectedGuest.id === id) {
      setSelectedGuest(prev => ({ ...prev, vipTier: newTier }));
    }
    toast.success(`Loyalty tier updated to ${newTier}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Guest Directory & CRM
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Master directory of guest profiles, stay records, lifetime revenue, and VIP loyalty status.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()} icon={<Download size={15} />}>
          Export Guest List
        </Button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Profiles</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', marginTop: 4 }}>
            1,420
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>+18 new this week</span>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>VIP Loyalty Members</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-secondary)', marginTop: 4 }}>
            382
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>27% of total guest base</span>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Avg. Guest Lifetime Value</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', marginTop: 4 }}>
            ₹64,200
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>+8.4% YoY</span>
        </div>
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Repeat Guest Rate</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-info)', marginTop: 4 }}>
            44.8%
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>High retention index</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by guest name, email, phone number, or city..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>Clear</Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={tierFilter} onChange={setTierFilter} />

      {/* Guests Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="ref-col">Guest ID</th>
                <th>Guest Profile</th>
                <th>Contact</th>
                <th>Location</th>
                <th>VIP Tier</th>
                <th>Stays</th>
                <th>Lifetime Spend</th>
                <th>Last Stay</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-secondary)' }}>
                    No guests found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredGuests.map(g => (
                  <tr key={g.id}>
                    <td className="ref-col">
                      <span className="ref-badge secondary">
                        {g.id.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong>{g.name}</strong>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{g.email}</div>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Phone size={13} color="var(--color-text-secondary)" /> {g.phone}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}>
                        <MapPin size={13} color="var(--color-text-secondary)" /> {g.city}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${g.vipTier === 'Platinum' ? 'badge-primary' : g.vipTier === 'Gold' ? 'badge-warning' : 'badge-outline'}`}>
                        {g.vipTier}
                      </span>
                    </td>
                    <td>
                      <strong>{g.totalBookings}</strong> stays
                    </td>
                    <td>
                      <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(g.totalSpent)}</strong>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                      {g.lastStay}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedGuest(g);
                          setModalOpen(true);
                        }}
                        icon={<Eye size={14} />}
                      >
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Details Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Guest Profile — ${selectedGuest?.name}`}
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedGuest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)' }}>{selectedGuest.name}</h3>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {selectedGuest.email} · {selectedGuest.phone}
                </div>
              </div>
              <span className="badge badge-primary">{selectedGuest.vipTier} VIP</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Resident City</span>
                <div style={{ fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{selectedGuest.city}, India</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Recent Stay Date</span>
                <div style={{ fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{selectedGuest.lastStay}</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Lifetime Completed Bookings</span>
                <div style={{ fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{selectedGuest.totalBookings} Total Reservations</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Revenue Contribution</span>
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-primary)', marginTop: 2 }}>{formatCurrency(selectedGuest.totalSpent)}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
              <label className="form-label">Adjust VIP Tier Level</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 6 }}>
                {['Bronze', 'Silver', 'Gold', 'Platinum'].map(tier => (
                  <Button
                    key={tier}
                    variant={selectedGuest.vipTier === tier ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateTier(selectedGuest.id, tier)}
                  >
                    {tier}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
