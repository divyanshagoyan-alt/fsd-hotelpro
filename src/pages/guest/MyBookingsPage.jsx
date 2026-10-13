import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Download,
  AlertTriangle,
  Building,
  CheckCircle,
  Eye,
  XCircle,
  Plus,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockReservations, mockHotels, mockRooms } from '../../data/mock/mockData';
import bookingService from '../../services/bookingService';
import {
  Button,
  StatusBadge,
  Tabs,
  Modal,
  ConfirmationDialog,
  EmptyState,
  Breadcrumbs,
  Alert
} from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Selected booking for viewing receipt or cancelling
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Find guest bookings from service or fallback to mockReservations
        const res = await bookingService.getMyBookings(user?.id || 'g1');
        // If guest has few mock reservations, include all mock reservations associated with the guest
        const list = res.bookings?.length > 0
          ? res.bookings
          : mockReservations.filter(r => r.guestId === (user?.id || 'g1') || r.guestEmail === user?.email);
        setBookings(list.length > 0 ? list : mockReservations.slice(0, 4));
      } catch (err) {
        setBookings(mockReservations.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'all') return true;
    if (activeTab === 'confirmed') return b.status === 'confirmed';
    if (activeTab === 'active') return b.status === 'checked-in' || b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'checked-out';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleOpenReceipt = (booking) => {
    setSelectedBooking(booking);
    setReceiptModalOpen(true);
  };

  const handleOpenCancel = (booking) => {
    setSelectedBooking(booking);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(selectedBooking.id, cancelReason);
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: 'cancelled' } : b));
      toast.success('Reservation successfully cancelled. Simulated refund initiated.');
      setCancelModalOpen(false);
    } catch (err) {
      toast.error('Failed to cancel reservation.');
    } finally {
      setIsCancelling(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Stays', count: bookings.length },
    { id: 'active', label: 'Active & Upcoming', count: bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in').length },
    { id: 'completed', label: 'Past Stays', count: bookings.filter(b => b.status === 'checked-out').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Guest Portal' },
    { label: 'My Bookings' },
  ];

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBlock: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            My Reservations
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', marginTop: 'var(--space-1)' }}>
            Review your upcoming getaways, view digital vouchers, or manage your reservations.
          </p>
        </div>
        <Link to="/hotels" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Book New Stay
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={<Calendar size={40} color="var(--color-text-secondary)" />}
          title="No reservations found"
          description={activeTab === 'all' ? "You don't have any bookings yet. Start planning your next journey today!" : `No bookings currently under the "${activeTab}" filter.`}
          action={
            <Link to="/hotels" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
              Explore Available Hotels
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {filteredBookings.map(b => {
            const hotel = mockHotels.find(h => h.id === b.hotelId);
            const room = mockRooms.find(r => r.id === b.roomId);
            const isCancellable = b.status === 'confirmed' || b.status === 'pending';

            return (
              <article key={b.id} className="card" style={{ padding: 'var(--space-6)' }}>
                <div className="guest-booking-card-grid">
                  <img
                    src={room?.image || hotel?.image || 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80'}
                    alt={b.roomName}
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                    }}
                    style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                  />

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                          <span className="ref-badge secondary">
                            {b.bookingRef}
                          </span>
                        </div>
                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text-primary)', marginTop: 2 }}>
                          {b.hotelName}
                        </h2>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                          {b.roomName} · Room #{b.roomNumber}
                        </div>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)', marginBlock: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                      <div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>Check-in</span>
                        <strong>{b.checkIn}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>Check-out</span>
                        <strong>{b.checkOut}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>Duration</span>
                        <strong>{b.nights} Night{b.nights > 1 ? 's' : ''}</strong> ({b.guests} Guests)
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>Amount Paid</span>
                        <strong style={{ color: 'var(--color-primary)' }}>{formatPrice(b.totalAmount)}</strong>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', flexWrap: 'wrap' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenReceipt(b)}
                        icon={<Receipt size={15} />}
                      >
                        View Receipt
                      </Button>

                      {isCancellable && (
                        <Button
                          variant="destructive-outline"
                          size="sm"
                          onClick={() => handleOpenCancel(b)}
                          icon={<XCircle size={15} />}
                        >
                          Cancel Stay
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── RECEIPT MODAL ───────────────────────── */}
      <Modal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        title="Stay Receipt & Billing Summary"
        size="md"
      >
        {selectedBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
              <div>
                <strong>{selectedBooking.hotelName}</strong>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Ref: {selectedBooking.bookingRef}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <StatusBadge status={selectedBooking.status} />
                <Button variant="outline" size="sm" onClick={() => window.print()} icon={<Download size={13} />} className="no-print">
                  Print
                </Button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', background: 'var(--color-bg)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Guest Name</span>
                <div>{selectedBooking.guestName}</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Room Assigned</span>
                <div>{selectedBooking.roomName} (#{selectedBooking.roomNumber})</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Check-In</span>
                <div>{selectedBooking.checkIn}</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Check-Out</span>
                <div>{selectedBooking.checkOut}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Room Charges ({selectedBooking.nights} nights)</span>
                <span>{formatPrice(selectedBooking.baseAmount || selectedBooking.totalAmount * 0.82)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>GST / Goods & Services Tax (18%)</span>
                <span>{formatPrice(selectedBooking.taxAmount || selectedBooking.totalAmount * 0.18)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-2)', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-base)' }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--color-primary)' }}>{formatPrice(selectedBooking.totalAmount)}</span>
              </div>
            </div>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Payment Mode: {selectedBooking.paymentMethod || 'Credit Card'} · Status: Verified
            </div>
          </div>
        )}
      </Modal>

      {/* ── CANCELLATION MODAL ─────────────────── */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Reservation"
        size="sm"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => setCancelModalOpen(false)} disabled={isCancelling}>
              Keep Reservation
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel} loading={isCancelling}>
              Confirm Cancellation
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Alert type="warning">
            Are you sure you want to cancel your stay at <strong>{selectedBooking?.hotelName}</strong>?
          </Alert>
          <div className="form-field">
            <label className="form-label" htmlFor="cancel-reason">Reason for cancellation</label>
            <select
              id="cancel-reason"
              className="form-select"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            >
              <option value="Change of plans">Change of travel plans</option>
              <option value="Found alternative accommodation">Found alternative accommodation</option>
              <option value="Personal emergency">Personal or health reason</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            Free cancellation applies. Any paid advance of <strong>{formatPrice(selectedBooking?.totalAmount)}</strong> will be credited to your original payment method within 3–5 banking business days.
          </p>
        </div>
      </Modal>
    </div>
  );
}
