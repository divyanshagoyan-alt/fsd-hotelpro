import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Building,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { mockRooms, mockHotels } from '../../data/mock/mockData';
import bookingService from '../../services/bookingService';
import { Button, Alert, Breadcrumbs, StatusBadge } from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function CheckoutPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { booking, updateBooking, calculateNights } = useBooking();

  // Find room and hotel
  const room = mockRooms.find(r => r.id === roomId) || mockRooms[0];
  const hotel = mockHotels.find(h => h.id === (booking.hotelId || room?.hotelId)) || mockHotels[0];

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  // Local state initialized with context or sensible defaults
  const [step, setStep] = useState(1); // 1: Info, 2: Review, 3: Payment
  const [checkIn, setCheckIn] = useState(booking.checkIn || today);
  const [checkOut, setCheckOut] = useState(booking.checkOut || tomorrow);
  const [guests, setGuests] = useState(booking.guests || 2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guest details form
  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : 'Arjun',
    lastName: user?.name ? (user.name.split(' ')[1] || 'Sharma') : 'Sharma',
    email: user?.email || 'arjun.sharma@email.com',
    phone: user?.phone || '+91 98765 43210',
    specialRequests: '',
    arrivalTime: '14:00 - 16:00',
    paymentMethod: 'card',
    cardNumber: '4532 •••• •••• 8821',
    cardExp: '08/29',
    cardCvc: '•••',
    upiId: 'guest@upi',
  });

  const [formErrors, setFormErrors] = useState({});

  const nights = calculateNights(checkIn, checkOut) || 1;
  const pricePerNight = room?.pricePerNight || 8500;
  const subtotal = pricePerNight * nights;
  const taxRate = room?.taxRate || 0.18;
  const taxAmount = Math.round(subtotal * taxRate);
  const totalAmount = subtotal + taxAmount;

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  // Sync checkIn/checkOut change to context
  useEffect(() => {
    if (room && hotel) {
      updateBooking({
        roomId: room.id,
        roomName: room.name,
        roomImage: room.image,
        hotelId: hotel.id,
        hotelName: hotel.name,
        pricePerNight: room.pricePerNight,
        checkIn,
        checkOut,
        nights,
        guests,
      });
    }
  }, [room?.id, hotel?.id, checkIn, checkOut, nights, guests]);

  const validateStep1 = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required.';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required.';
    if (nights <= 0) errs.dates = 'Check-out date must be after check-in date.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateStep1()) {
        toast.error('Please correct the errors in the form.');
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        hotelId: hotel.id,
        hotelName: hotel.name,
        roomId: room.id,
        roomName: room.name,
        roomNumber: room.roomNumber,
        guestId: user?.id || 'g1',
        guestName: `${formData.firstName} ${formData.lastName}`,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        checkIn,
        checkOut,
        nights,
        guests,
        totalAmount,
        baseAmount: subtotal,
        taxAmount,
        paymentMethod: formData.paymentMethod === 'card' ? 'Credit Card' : 'UPI',
        specialRequests: formData.specialRequests,
      };

      const res = await bookingService.createBooking(payload);
      toast.success('Reservation successfully confirmed!');
      navigate(`/booking/confirmation/${res.booking.bookingRef}`, {
        state: { booking: res.booking, hotel, room }
      });
    } catch (err) {
      toast.error(err.message || 'Failed to complete reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Hotels', href: '/hotels' },
    { label: hotel?.name || 'Hotel', href: `/hotels/${hotel?.id}` },
    { label: 'Checkout' },
  ];

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
      <Breadcrumbs items={breadcrumbs} />

      <div style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
          Complete Your Reservation
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', marginTop: 'var(--space-2)' }}>
          Transparent pricing, instant confirmation, and free cancellation up to 48 hours prior to arrival.
        </p>
      </div>

      {/* Step Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-8)',
        background: 'var(--color-surface)',
        padding: 'var(--space-4) var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {[
          { num: 1, label: 'Guest Details' },
          { num: 2, label: 'Review Stay' },
          { num: 3, label: 'Payment' }
        ].map((s, idx) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--text-sm)',
              background: step === s.num ? 'var(--color-primary)' : step > s.num ? 'var(--color-success)' : 'var(--color-border)',
              color: step >= s.num ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)'
            }}>
              {step > s.num ? '✓' : s.num}
            </div>
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: step === s.num ? 'var(--weight-bold)' : 'var(--weight-medium)',
              color: step === s.num ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
            }}>
              {s.label}
            </span>
            {idx < 2 && (
              <div style={{
                width: 60,
                height: 2,
                background: step > s.num ? 'var(--color-success)' : 'var(--color-border)',
                marginInline: 'var(--space-3)'
              }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: 'var(--space-8)', alignItems: 'start' }}>
        {/* Main form steps */}
        <section aria-label="Reservation form step">
          {step === 1 && (
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-6)' }}>
                Step 1: Guest Information
              </h2>

              {formErrors.dates && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <Alert type="error">{formErrors.dates}</Alert>
                </div>
              )}

              {/* Date & Guest Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div className="form-field">
                  <label htmlFor="chk-in" className="form-label">
                    <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} /> Check-in Date
                  </label>
                  <input
                    id="chk-in"
                    type="date"
                    className="form-input"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="chk-out" className="form-label">
                    <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} /> Check-out Date
                  </label>
                  <input
                    id="chk-out"
                    type="date"
                    className="form-input"
                    min={checkIn || today}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="chk-guests" className="form-label">
                    <Users size={14} style={{ display: 'inline', marginRight: 4 }} /> Guests
                  </label>
                  <select
                    id="chk-guests"
                    className="form-select"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Personal Data */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                <div className="form-field">
                  <label htmlFor="first-name" className="form-label required">First Name</label>
                  <input
                    id="first-name"
                    type="text"
                    className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  {formErrors.firstName && <span className="form-error">{formErrors.firstName}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="last-name" className="form-label required">Last Name</label>
                  <input
                    id="last-name"
                    type="text"
                    className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  />
                  {formErrors.lastName && <span className="form-error">{formErrors.lastName}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="form-label required">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${formErrors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                  {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                </div>

                <div className="form-field">
                  <label htmlFor="phone" className="form-label required">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    className={`form-input ${formErrors.phone ? 'error' : ''}`}
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
                </div>
              </div>

              <div className="form-field" style={{ marginTop: 'var(--space-4)' }}>
                <label htmlFor="arrival-time" className="form-label">Estimated Arrival Window</label>
                <select
                  id="arrival-time"
                  className="form-select"
                  value={formData.arrivalTime}
                  onChange={e => setFormData({ ...formData, arrivalTime: e.target.value })}
                >
                  <option value="12:00 - 14:00">Early Arrival (12:00 PM - 02:00 PM)</option>
                  <option value="14:00 - 16:00">Standard Check-In (02:00 PM - 04:00 PM)</option>
                  <option value="16:00 - 19:00">Evening Arrival (04:00 PM - 07:00 PM)</option>
                  <option value="19:00 - 23:00">Late Arrival (07:00 PM - 11:00 PM)</option>
                </select>
              </div>

              <div className="form-field" style={{ marginTop: 'var(--space-4)' }}>
                <label htmlFor="special-requests" className="form-label">Special Requests (Optional)</label>
                <textarea
                  id="special-requests"
                  rows={3}
                  className="form-textarea"
                  placeholder="e.g. Quiet room away from elevator, extra foam pillows, high floor"
                  value={formData.specialRequests}
                  onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                />
                <span className="form-hint">Special requests cannot be guaranteed, but the front desk will do their utmost to accommodate.</span>
              </div>

              <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="primary" size="lg" onClick={handleNextStep} icon={<ArrowRight size={18} />} iconPosition="right">
                  Proceed to Review
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-6)' }}>
                Step 2: Review Your Stay Details
              </h2>

              <div style={{
                background: 'var(--color-bg)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-6)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)'
              }}>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Primary Guest</span>
                  <div style={{ fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{formData.firstName} {formData.lastName}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{formData.email} · {formData.phone}</div>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Stay Duration</span>
                  <div style={{ fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{nights} Night{nights > 1 ? 's' : ''}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{checkIn} to {checkOut}</div>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Estimated Check-in</span>
                  <div style={{ fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{formData.arrivalTime}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Front desk open 24/7</div>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>
                  Room Amenities Included
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  {room?.amenities?.map((amenity) => (
                    <span key={amenity} className="amenity-tag" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={12} color="var(--color-primary)" /> {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <Alert type="info" title="Complimentary Inclusions">
                High-speed WiFi, complimentary morning breakfast buffet, welcome refreshment upon arrival, and swimming pool access.
              </Alert>

              <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="ghost" onClick={handlePrevStep} icon={<ArrowLeft size={16} />}>
                  Back to Details
                </Button>
                <Button variant="primary" size="lg" onClick={handleNextStep} icon={<ArrowRight size={18} />} iconPosition="right">
                  Proceed to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                Step 3: Secure Payment Simulation
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                Choose your preferred payment method. This is a demonstration sandbox — your card will not be debited.
              </p>

              {/* Payment Methods */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} /> },
                  { id: 'upi', label: 'UPI / QR Code', icon: <Sparkles size={18} /> },
                  { id: 'hotel', label: 'Pay at Property', icon: <Building size={18} /> }
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                    style={{
                      border: formData.paymentMethod === method.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: formData.paymentMethod === method.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ color: formData.paymentMethod === method.id ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                      {method.icon}
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>{method.label}</span>
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  <div className="form-field">
                    <label className="form-label">Demo Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.cardNumber}
                      onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-field">
                      <label className="form-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.cardExp}
                        onChange={e => setFormData({ ...formData, cardExp: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">CVV</label>
                      <input
                        type="password"
                        className="form-input"
                        value={formData.cardCvc}
                        onChange={e => setFormData({ ...formData, cardCvc: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'upi' && (
                <div className="form-field" style={{ marginBottom: 'var(--space-6)' }}>
                  <label className="form-label">Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.upiId}
                    onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                  />
                  <span className="form-hint">Fast & direct payments supported through Google Pay, PhonePe, Paytm, and BHIM.</span>
                </div>
              )}

              {formData.paymentMethod === 'hotel' && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <Alert type="warning" title="Pay Upon Arrival Policy">
                    Credit card pre-authorization is held. You will present your physical identification and settle the full bill at front desk reception during check-in.
                  </Alert>
                </div>
              )}

              <div style={{
                background: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              }}>
                <ShieldCheck size={24} color="var(--color-success)" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  256-bit TLS encrypted transaction. Your booking information is securely managed under HotelPro Hospitality data protection protocols.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button variant="ghost" onClick={handlePrevStep} icon={<ArrowLeft size={16} />} disabled={isSubmitting}>
                  Back to Review
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleConfirmBooking}
                  loading={isSubmitting}
                  icon={<ShieldCheck size={18} />}
                >
                  Pay & Confirm {formatPrice(totalAmount)}
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Order Summary Sidebar */}
        <aside style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-4))' }}>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-4)' }}>
              Stay Summary
            </h2>

            {/* Hotel & Room preview */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
              <img
                src={room?.image || hotel?.image}
                alt={room?.name}
                style={{ width: 80, height: 70, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-secondary)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
                  {hotel?.name}
                </span>
                <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', marginTop: 2 }}>{room?.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  Floor {room?.floor} · Room {room?.roomNumber} · {room?.bedType}
                </div>
              </div>
            </div>

            {/* Stay specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Dates</span>
                <span style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{checkIn} → {checkOut}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Length of Stay</span>
                <span style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{nights} night{nights > 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Guests</span>
                <span style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{guests} adult{guests > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{formatPrice(pricePerNight)} × {nights} nights</span>
                <span className="tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Taxes & GST (18%)</span>
                <span className="tabular-nums">{formatPrice(taxAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                <span>Resort & Service Fee</span>
                <span>Included</span>
              </div>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)' }}>Total Due</span>
              <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }} className="tabular-nums">
                {formatPrice(totalAmount)}
              </span>
            </div>

            {/* Cancellation Notice */}
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-success)' }}>
                ✓ Free Cancellation Available
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Cancel without penalty up to 48 hours prior to check-in at 2:00 PM.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
