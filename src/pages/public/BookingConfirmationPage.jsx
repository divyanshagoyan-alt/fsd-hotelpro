import { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Printer,
  Copy,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  Clock,
  Sparkles
} from 'lucide-react';
import { mockReservations, mockHotels, mockRooms } from '../../data/mock/mockData';
import { getStoredOfflineBookings } from '../../services/bookingService';
import { Button, StatusBadge, Alert } from '../../components/common/UI';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function BookingConfirmationPage() {
  const { bookingRef } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Security Check: Disallow direct URL access to view receipts
  const isDirectUrlAccess = !location.state?.fromCheckout && !location.state?.booking;

  useEffect(() => {
    if (isDirectUrlAccess) {
      toast.warning('Direct URL access to receipts is restricted. Please view your receipts in My Bookings.');
      const timer = setTimeout(() => {
        navigate(isAuthenticated ? '/my-bookings' : '/login', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDirectUrlAccess, isAuthenticated, navigate]);

  // Try retrieving booking from location state or fallback to offline storage / mockReservations
  const [bookingData, setBookingData] = useState(() => {
    if (location.state?.booking) return location.state.booking;
    const offlineBookings = getStoredOfflineBookings();
    const offlineFound = offlineBookings.find(r => r.bookingRef === bookingRef || r.id === bookingRef);
    if (offlineFound) return offlineFound;
    const found = mockReservations.find(r => r.bookingRef === bookingRef || r.id === bookingRef);
    return found || mockReservations[0];
  });

  const hotel = location.state?.hotel || mockHotels.find(h => h.id === bookingData?.hotelId) || mockHotels[0];
  const room = location.state?.room || mockRooms.find(r => r.id === bookingData?.roomId) || mockRooms[0];

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(bookingData?.bookingRef || bookingRef);
    toast.success('Booking reference copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  if (isDirectUrlAccess) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-16)', maxWidth: 640 }}>
        <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>
            Direct URL Access to Receipts Restricted
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
            For guest privacy and fraud prevention, receipt vouchers cannot be accessed via direct URL links. Please log in to view your stay receipts inside your verified guest portal.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
            <Link to={isAuthenticated ? "/my-bookings" : "/login"} className="btn btn-primary">
              {isAuthenticated ? "Go to My Bookings" : "Sign In to View Receipts"}
            </Link>
            <Link to="/" className="btn btn-ghost">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-10)', maxWidth: 880 }}>
      {/* Success banner */}
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-6)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 'var(--space-8)'
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--color-success-bg)',
          color: 'var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-4)'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <span style={{
          display: 'inline-block',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 'var(--space-2)'
        }}>
          Reservation Confirmed
        </span>

        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
          Thank You! Your Stay is Booked.
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', maxWidth: 520, margin: '0 auto' }}>
          A confirmation email with your reservation voucher and check-in barcode has been sent to <strong>{bookingData?.guestEmail || 'your email'}</strong>.
        </p>

        {/* Reference Number Card */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          background: 'var(--color-bg)',
          border: '1px dashed var(--color-primary)',
          padding: 'var(--space-3) var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          marginTop: 'var(--space-6)'
        }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Booking Reference</span>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
              {bookingData?.bookingRef || bookingRef}
            </div>
          </div>
          <button
            onClick={handleCopyRef}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px 10px', marginLeft: 'var(--space-2)' }}
            title="Copy reference code"
          >
            <Copy size={16} /> Copy
          </button>
        </div>
      </div>

      {/* Printable Receipt Card */}
      <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }} id="printable-voucher">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <Building size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)' }}>{hotel?.name}</h2>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={14} /> {hotel?.location || hotel?.city}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <StatusBadge status="confirmed" label="Confirmed" />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              Status: Paid in Full
            </div>
          </div>
        </div>

        {/* Stay Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Check-In</span>
            <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-base)', marginTop: 2 }}>{bookingData?.checkIn}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>From {hotel?.checkInTime || '14:00'}</div>
          </div>

          <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Check-Out</span>
            <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-base)', marginTop: 2 }}>{bookingData?.checkOut}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>Until {hotel?.checkOutTime || '12:00'}</div>
          </div>

          <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Reserved Room</span>
            <div style={{ fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-base)', marginTop: 2 }}>{room?.name}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>Room #{bookingData?.roomNumber || room?.roomNumber} · Floor {room?.floor}</div>
          </div>
        </div>

        {/* Guest info & Payment Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              Guest & Contact Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={15} color="var(--color-text-secondary)" />
                <strong>{bookingData?.guestName || 'Guest'}</strong> ({bookingData?.guests || 1} guest)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={15} color="var(--color-text-secondary)" />
                <span>{bookingData?.guestEmail}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={15} color="var(--color-text-secondary)" />
                <span>{bookingData?.guestPhone}</span>
              </div>
              {bookingData?.specialRequests && (
                <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  <em>Note: "{bookingData.specialRequests}"</em>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-bold)', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
              Financial Settlement
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Base Room Charge</span>
                <span>{formatPrice(bookingData?.baseAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>GST / Government Tax (18%)</span>
                <span>{formatPrice(bookingData?.taxAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-border)', paddingTop: 'var(--space-2)', fontWeight: 'var(--weight-bold)' }}>
                <span>Total Amount Paid</span>
                <span style={{ color: 'var(--color-primary)', fontSize: 'var(--text-md)' }}>{formatPrice(bookingData?.totalAmount)}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                Payment Method: {bookingData?.paymentMethod || 'Credit Card'} (Simulated Authorization)
              </div>
            </div>
          </div>
        </div>

        {/* Important notes alert */}
        <div style={{ marginTop: 'var(--space-8)' }}>
          <Alert type="info" title="Check-in Guidelines">
            Please present a government-issued photo ID upon check-in. Reception is available 24 hours. Contact the concierge desk anytime at frontdesk@hotelpro.com or +91 22 2200 4000.
          </Alert>
        </div>
      </div>

      {/* Next Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <Button variant="outline" onClick={handlePrint} icon={<Printer size={16} />}>
          Print Stay Voucher
        </Button>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Link to="/hotels" className="btn btn-ghost">
            Browse More Hotels
          </Link>
          <Link to="/my-bookings" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            View in My Bookings <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
