import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, ChevronRight, Shield, Clock, Award, Phone } from 'lucide-react';
import { mockHotels, mockDestinations, mockTestimonials } from '../../data/mock/mockData';
import { Button, StatusBadge } from '../../components/common/UI';

const formatPrice = (n) => '₹' + n.toLocaleString('en-IN');

export default function HomePage() {
  const [search, setSearch] = useState({ destination: '', checkIn: '', checkOut: '', guests: 1 });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.destination) params.set('city', search.destination);
    if (search.checkIn) params.set('checkIn', search.checkIn);
    if (search.checkOut) params.set('checkOut', search.checkOut);
    if (search.guests > 1) params.set('guests', search.guests);
    navigate(`/hotels?${params.toString()}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #1a3a2c 0%, #234B3B 60%, #2d5e4b 100%)',
          color: '#fff',
          paddingTop: 'var(--space-20)',
          paddingBottom: 'var(--space-24)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 30% 50%, #B88B5A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: '680px' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(184,139,90,0.2)',
              border: '1px solid rgba(184,139,90,0.4)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 14px',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-semibold)',
              color: '#d4a86b',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-5)',
            }}>
              Premium Hospitality Network
            </span>

            <h1
              className="editorial-heading"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                lineHeight: 1.1,
                color: '#fff',
                marginBottom: 'var(--space-5)',
              }}
            >
              Your perfect stay,<br />thoughtfully chosen.
            </h1>

            <p style={{
              fontSize: 'var(--text-lg)',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: 'var(--space-10)',
              maxWidth: '520px',
            }}>
              Discover handpicked hotels across India — from heritage havelis to coastal resorts.
              Book with confidence, stay with comfort.
            </p>

            {/* Search Widget */}
            <form onSubmit={handleSearch} aria-label="Hotel search">
              <div className="booking-search" style={{ background: '#fff', maxWidth: '840px' }}>
                <div className="booking-search-grid">
                  {/* Destination */}
                  <div className="booking-search-field">
                    <label htmlFor="dest" className="booking-search-label">
                      <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      Destination
                    </label>
                    <input
                      id="dest"
                      type="text"
                      className="booking-search-input"
                      placeholder="City or hotel name"
                      value={search.destination}
                      onChange={e => setSearch(s => ({ ...s, destination: e.target.value }))}
                    />
                  </div>

                  {/* Check-in */}
                  <div className="booking-search-field">
                    <label htmlFor="checkin" className="booking-search-label">
                      <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      Check-in
                    </label>
                    <input
                      id="checkin"
                      type="date"
                      className="booking-search-input"
                      min={today}
                      value={search.checkIn}
                      onChange={e => setSearch(s => ({ ...s, checkIn: e.target.value }))}
                    />
                  </div>

                  {/* Check-out */}
                  <div className="booking-search-field">
                    <label htmlFor="checkout" className="booking-search-label">
                      <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                      Check-out
                    </label>
                    <input
                      id="checkout"
                      type="date"
                      className="booking-search-input"
                      min={search.checkIn || tomorrow}
                      value={search.checkOut}
                      onChange={e => setSearch(s => ({ ...s, checkOut: e.target.value }))}
                    />
                  </div>

                  {/* Guests + Search btn */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    <div className="booking-search-field" style={{ marginBottom: 0 }}>
                      <label htmlFor="guests" className="booking-search-label">
                        <Users size={12} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
                        Guests
                      </label>
                      <select
                        id="guests"
                        className="booking-search-input form-select"
                        value={search.guests}
                        onChange={e => setSearch(s => ({ ...s, guests: e.target.value }))}
                        style={{ border: 'none', outline: 'none', background: 'transparent', padding: 0, fontSize: 'var(--text-sm)' }}
                      >
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-end mt-4">
                  <Button type="submit" variant="primary" size="lg" icon={<Search size={18} />}>
                    Search Hotels
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── TRUST INDICATORS ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-6)',
            padding: 'var(--space-8) 0',
          }}>
            {[
              { icon: <Shield size={20} />, label: 'Secure Booking', desc: 'SSL-encrypted checkout' },
              { icon: <Award size={20} />, label: '200+ Hotels', desc: 'Verified properties' },
              { icon: <Clock size={20} />, label: '24/7 Support', desc: 'Always available' },
              { icon: <Star size={20} />, label: '4.8 Average Rating', desc: 'From verified guests' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="d-flex items-center gap-3">
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-primary)' }}>{label}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Popular Destinations</h2>
              <p className="section-subtitle">Explore top hotel destinations across India</p>
            </div>
            <Link to="/hotels" className="btn btn-outline btn-sm">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {mockDestinations.map(dest => (
              <Link
                key={dest.id}
                to={`/hotels?city=${dest.name}`}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'block',
                  position: 'relative',
                  aspectRatio: '4/5',
                  textDecoration: 'none',
                }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)',
                }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-4)' }}>
                  <div style={{ color: '#fff', fontWeight: 'var(--weight-bold)', fontSize: 'var(--text-base)' }}>
                    {dest.name}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-xs)', marginTop: 2 }}>
                    {dest.hotels} hotels · {dest.tagline}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOTELS ───────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--color-surface-raised)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Featured Hotels</h2>
              <p className="section-subtitle">Curated properties handpicked for their quality and guest experience</p>
            </div>
            <Link to="/hotels" className="btn btn-outline btn-sm">
              See All Hotels <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid-auto-fill-lg">
            {mockHotels.slice(0, 4).map(hotel => (
              <Link to={`/hotels/${hotel.slug}`} key={hotel.id} style={{ textDecoration: 'none' }}>
                <article className="hotel-card">
                  <div className="hotel-card-image">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
                      }}
                    />
                    <div style={{
                      position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)',
                    }}>
                      <span className="badge badge-primary" style={{ background: 'var(--color-secondary)' }}>
                        {hotel.category}
                      </span>
                    </div>
                  </div>
                  <div className="hotel-card-body">
                    <h3 className="hotel-card-name">{hotel.name}</h3>
                    <p className="hotel-card-location">
                      <MapPin size={13} aria-hidden="true" /> {hotel.location}
                    </p>
                    <div className="hotel-card-rating">
                      <Star size={14} className="rating-star" aria-hidden="true" fill="currentColor" />
                      {hotel.rating} <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'var(--weight-normal)' }}>({hotel.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-3)' }}>
                      {hotel.description.slice(0, 100)}...
                    </p>
                    <div className="d-flex justify-between items-center">
                      <div>
                        <span className="hotel-card-price tabular-nums">From {formatPrice(hotel.priceFrom)}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'block' }}>per night</span>
                      </div>
                      <span className="btn btn-outline btn-sm">View Rooms</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2 className="section-title">Guests Love HotelPro</h2>
            <p className="section-subtitle" style={{ margin: '0 auto var(--space-8)' }}>
              Real reviews from verified guests who booked through our platform
            </p>
          </div>
          <div className="grid-3">
            {mockTestimonials.map(t => (
              <figure key={t.id} className="card card-body" style={{ gap: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                <div className="d-flex gap-1" aria-label={`Rating: ${t.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} fill={i < t.rating ? '#EAB308' : 'transparent'} color={i < t.rating ? '#EAB308' : 'var(--color-border)'} />
                  ))}
                </div>
                <blockquote style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', fontStyle: 'italic', flex: 1 }}>
                  "{t.text}"
                </blockquote>
                <figcaption>
                  <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}>{t.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{t.location} · Stayed at {t.hotel} · {t.date}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ─────────────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-primary)',
        color: '#fff',
        padding: 'var(--space-16) 0',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="editorial-heading" style={{ fontSize: 'var(--text-3xl)', color: '#fff', marginBottom: 'var(--space-3)' }}>
            Ready to book your next stay?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)' }}>
            Browse over 200 verified hotels. Best price guaranteed.
          </p>
          <div className="d-flex gap-4 justify-center flex-wrap">
            <Link to="/hotels" className="btn btn-secondary btn-lg">
              Browse Hotels
            </Link>
            <Link to="/register" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}>
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
