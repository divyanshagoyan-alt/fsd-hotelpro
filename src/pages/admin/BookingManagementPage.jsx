import { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Eye,
  XCircle,
  Download,
  Building,
  CreditCard
} from 'lucide-react';
import { mockReservations, mockHotels } from '../../data/mock/mockData';
import bookingService from '../../services/bookingService';
import {
  Button,
  StatusBadge,
  Tabs,
  Modal,
  Alert
} from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function BookingManagementPage() {
  const [reservations, setReservations] = useState(mockReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    bookingService.getAllBookings().then(res => {
      if (res?.bookings?.length) setReservations(res.bookings);
    }).catch(() => {});
  }, []);

  // Selected reservation for details modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const filteredReservations = reservations.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      r.guestName.toLowerCase().includes(q) ||
      r.bookingRef.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q) ||
      r.hotelName.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Booking status updated to ${newStatus}.`);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(prev => ({ ...prev, status: newStatus }));
    }
  };

  const tabs = [
    { id: 'all', label: 'All Bookings', count: reservations.length },
    { id: 'confirmed', label: 'Confirmed', count: reservations.filter(r => r.status === 'confirmed').length },
    { id: 'checked-in', label: 'Checked In', count: reservations.filter(r => r.status === 'checked-in').length },
    { id: 'checked-out', label: 'Checked Out', count: reservations.filter(r => r.status === 'checked-out').length },
    { id: 'cancelled', label: 'Cancelled', count: reservations.filter(r => r.status === 'cancelled').length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Reservation Administration
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Master directory of all guest reservations, revenue settlements, and stay lifecycles.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.print()}
          icon={<Download size={15} />}
        >
          Export Bookings
        </Button>
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
              placeholder="Search by guest name, booking ref (HP-2026-...), hotel, or room..."
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
      <Tabs tabs={tabs} activeTab={statusFilter} onChange={setStatusFilter} />

      {/* Bookings Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="ref-col">Ref</th>
                <th>Guest Information</th>
                <th>Property</th>
                <th>Room Type</th>
                <th>Dates</th>
                <th>Payment</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map(res => (
                <tr key={res.id}>
                  <td className="ref-col">
                    <span className="ref-badge">
                      {res.bookingRef}
                    </span>
                  </td>
                  <td>
                    <strong>{res.guestName}</strong>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{res.guestEmail}</div>
                  </td>
                  <td>{res.hotelName}</td>
                  <td>{res.roomName} (#{res.roomNumber})</td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>
                    {res.checkIn} → {res.checkOut}
                    <div style={{ color: 'var(--color-text-secondary)' }}>{res.nights} nights · {res.guests} guests</div>
                  </td>
                  <td>
                    <strong>{formatPrice(res.totalAmount)}</strong>
                    <div style={{ fontSize: 'var(--text-xs)' }}>
                      <StatusBadge status={res.paymentStatus} />
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={res.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(res);
                        setDetailsModalOpen(true);
                      }}
                      icon={<Eye size={14} />}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MANAGE RESERVATION MODAL ─────────────── */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={`Reservation Details — ${selectedBooking?.bookingRef}`}
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="destructive-outline"
              size="sm"
              onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
              disabled={selectedBooking?.status === 'cancelled'}
            >
              Cancel Reservation
            </Button>
            <Button variant="primary" onClick={() => setDetailsModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)' }}>{selectedBooking.guestName}</h3>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{selectedBooking.guestEmail} · {selectedBooking.guestPhone}</div>
              </div>
              <StatusBadge status={selectedBooking.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Property & Room</span>
                <div style={{ fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{selectedBooking.hotelName}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>{selectedBooking.roomName} (Room #{selectedBooking.roomNumber})</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Stay Dates</span>
                <div style={{ fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{selectedBooking.checkIn} to {selectedBooking.checkOut}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>{selectedBooking.nights} Nights ({selectedBooking.guests} Guests)</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Financial Breakdown</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span>Total Amount Paid</span>
                <strong style={{ color: 'var(--color-primary)' }}>{formatPrice(selectedBooking.totalAmount)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                <span>Method</span>
                <span>{selectedBooking.paymentMethod || 'Credit Card'}</span>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Update Status Directly</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {['confirmed', 'checked-in', 'checked-out'].map(st => (
                  <Button
                    key={st}
                    variant={selectedBooking.status === st ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedBooking.id, st)}
                  >
                    {st}
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
