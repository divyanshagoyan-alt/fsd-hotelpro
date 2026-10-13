import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, Wifi, Car, Coffee, Waves, ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { mockHotels, mockRooms } from '../../data/mock/mockData';
import { StatusBadge, LoadingSkeleton, ErrorState, Button } from '../../components/common/UI';
import { useBooking } from '../../context/BookingContext';
import { toast } from 'react-toastify';

const formatPrice = (n) => '₹' + n.toLocaleString('en-IN');

const AMENITY_ICONS = {
  'WiFi': <Wifi size={14} />, 'Free WiFi': <Wifi size={14} />,
  'Parking': <Car size={14} />,
  'Pool': <Waves size={14} />,
  'Restaurant': <Coffee size={14} />,
};

export default function HotelDetailPage() {
  const params = useParams();
  const identifier = params.id || params.slug;
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const { updateBooking } = useBooking();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const h = mockHotels.find(h => h.slug === identifier || h.id === identifier);
      if (!h) { setError('Hotel not found'); setLoading(false); return; }
      setHotel(h);
      setRooms(mockRooms.filter(r => r.hotelId === h.id));
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [identifier]);

  const calcNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, Math.floor((new Date(checkOut) - new Date(checkIn)) / 86400000));
  };

  const handleBookRoom = (room) => {
    if (!checkIn || !checkOut) {
      toast.warning('Please select check-in and check-out dates first.');
      return;
    }
    if (room.status !== 'available') {
      toast.error('This room is not available for the selected dates.');
      return;
    }
    const nights = calcNights();
    updateBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomId: room.id,
      roomName: room.name,
      roomImage: room.image,
      pricePerNight: room.pricePerNight,
      checkIn,
      checkOut,
      nights,
      guests,
      step: 3,
    });
    navigate(`/checkout/${room.id}`);
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <LoadingSkeleton type="img" style={{ height: 420, borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-6)' }} />
        <LoadingSkeleton type="title" width="40%" style={{ marginBottom: 'var(--space-3)' }} />
        <LoadingSkeleton type="text" width="60%" />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-16)' }}>
        <ErrorState title="Hotel not found" description="This property may have been removed or the link is incorrect." onRetry={() => navigate('/hotels')} />
      </div>
    );
  }

  const allImages = hotel.images || [hotel.image];
  const nights = calcNights();

  return (
    <>
      {/* ── IMAGE GALLERY ──────────────────────────────── */}
      <div style={{ position: 'relative', background: '#000', height: 420, overflow: 'hidden' }}>
        <img
          src={allImages[imgIdx]}
          alt={`${hotel.name} — image ${imgIdx + 1}`}
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80';
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
        {allImages.length > 1 && (
          <>
            <button
              className="btn btn-sm"
              style={{ position: 'absolute', left: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 40, height: 40 }}
              onClick={() => setImgIdx(i => (i - 1 + allImages.length) % allImages.length)}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="btn btn-sm"
              style={{ position: 'absolute', right: 'var(--space-4)', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: 40, height: 40 }}
              onClick={() => setImgIdx(i => (i + 1) % allImages.length)}
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
            <div style={{ position: 'absolute', bottom: 'var(--space-4)', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  style={{
                    width: i === imgIdx ? 24 : 8,
                    height: 8,
                    borderRadius: 'var(--radius-full)',
                    background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                  }}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
        {/* Back button */}
        <Link
          to="/hotels"
          className="btn btn-sm"
          style={{ position: 'absolute', top: 'var(--space-4)', left: 'var(--space-4)', background: 'rgba(255,255,255,0.9)' }}
        >
          <ChevronLeft size={14} /> Back
        </Link>
      </div>

      <div className="container" style={{ paddingBlock: 'var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-8)', alignItems: 'start' }}>

          {/* ── HOTEL INFO ────────────────────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
              <div>
                <span className="badge" style={{ background: 'var(--color-secondary)', color: '#fff', marginBottom: 'var(--space-2)' }}>{hotel.category}</span>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-2)' }}>{hotel.name}</h1>
                <p style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-sm)' }}>
                  <MapPin size={14} aria-hidden="true" /> {hotel.location}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  <Star size={18} fill="#EAB308" color="#EAB308" aria-hidden="true" />
                  <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)' }}>{hotel.rating}</span>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{hotel.reviewCount.toLocaleString()} verified reviews</span>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-6)' }}>
              {hotel.description}
            </p>

            {/* Amenities */}
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>What's Included</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
              {hotel.amenities.map(a => (
                <span key={a} className="amenity-tag">
                  {AMENITY_ICONS[a] || <Check size={12} />} {a}
                </span>
              ))}
            </div>

            {/* Policies */}
            <div style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-8)' }}>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-4)' }}>Hotel Policies</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                <div>
                  <div style={{ color: 'var(--color-text-secondary)', marginBottom: 2 }}>Check-in</div>
                  <div style={{ fontWeight: 'var(--weight-medium)' }}>From {hotel.checkInTime}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--color-text-secondary)', marginBottom: 2 }}>Check-out</div>
                  <div style={{ fontWeight: 'var(--weight-medium)' }}>Until {hotel.checkOutTime}</div>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <div style={{ color: 'var(--color-text-secondary)', marginBottom: 2 }}>Cancellation</div>
                  <div style={{ fontWeight: 'var(--weight-medium)' }}>{hotel.cancellationPolicy}</div>
                </div>
              </div>
            </div>

            {/* Available Rooms */}
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-5)' }}>
              Available Rooms
              {nights > 0 && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-normal)', color: 'var(--color-text-secondary)', marginLeft: 8 }}>for {nights} night{nights > 1 ? 's' : ''}</span>}
            </h2>

            {rooms.length === 0 ? (
              <div className="alert alert-info">
                <AlertCircle size={16} className="alert-icon" />
                <div>No rooms are currently configured for this hotel.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {rooms.map(room => (
                  <article key={room.id} className="card" style={{ border: room.status !== 'available' ? '1px solid var(--color-border)' : '1.5px solid var(--color-primary)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 0 }}>
                      <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                        <img
                          src={room.image}
                          alt={room.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                          onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80';
                          }}
                        />
                      </div>
                      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {room.type}
                            </span>
                            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', marginTop: 2 }}>{room.name}</h3>
                          </div>
                          <StatusBadge status={room.status} />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                          <span><Users size={12} aria-hidden="true" /> Up to {room.maxGuests} guests</span>
                          <span>🛏 {room.bedType}</span>
                          <span>📐 {room.size} m²</span>
                          <span>🏨 Floor {room.floor}</span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                          {room.amenities.slice(0, 4).map(a => (
                            <span key={a} className="amenity-tag">{a}</span>
                          ))}
                          {room.amenities.length > 4 && <span className="amenity-tag">+{room.amenities.length - 4} more</span>}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                          <div>
                            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', fontVariantNumeric: 'tabular-nums' }}>
                              {formatPrice(room.pricePerNight)}
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                              per night {nights > 0 ? `· ${formatPrice(room.pricePerNight * nights)} total` : ''}
                            </div>
                            {room.isRefundable && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', marginTop: 2 }}>✓ Free cancellation</div>}
                          </div>
                          <Button
                            variant="primary"
                            onClick={() => handleBookRoom(room)}
                            disabled={room.status !== 'available'}
                          >
                            {room.status === 'available' ? 'Book This Room' : 'Not Available'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* ── BOOKING WIDGET (sticky) ──────────────── */}
          <aside style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-4))' }}>
            <div className="booking-search" style={{ boxShadow: 'var(--shadow-xl)' }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', marginBottom: 'var(--space-1)' }}>
                From {formatPrice(hotel.priceFrom)}
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>per night · taxes extra</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="widget-checkin">Check-in</label>
                  <input id="widget-checkin" type="date" className="form-input" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="widget-checkout">Check-out</label>
                  <input id="widget-checkout" type="date" className="form-input" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="widget-guests">Guests</label>
                  <select id="widget-guests" className="form-select" value={guests} onChange={e => setGuests(Number(e.target.value))}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                  </select>
                </div>

                {nights > 0 && (
                  <div style={{ background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                    <div className="d-flex justify-between">
                      <span>{nights} night{nights>1?'s':''}</span>
                      <span className="font-semibold tabular-nums">{formatPrice(hotel.priceFrom * nights)}</span>
                    </div>
                    <div className="d-flex justify-between mt-1" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-xs)' }}>
                      <span>Taxes (18%)</span>
                      <span>{formatPrice(Math.round(hotel.priceFrom * nights * 0.18))}</span>
                    </div>
                  </div>
                )}

                <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={() => document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  Check Availability
                </Button>
              </div>

              <div className="divider" />
              <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <li className="d-flex items-center gap-2"><Check size={12} color="var(--color-success)" /> No booking fees</li>
                <li className="d-flex items-center gap-2"><Check size={12} color="var(--color-success)" /> Best price guarantee</li>
                <li className="d-flex items-center gap-2"><Check size={12} color="var(--color-success)" /> Instant confirmation</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
