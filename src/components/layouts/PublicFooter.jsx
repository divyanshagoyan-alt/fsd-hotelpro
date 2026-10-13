import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, MessageCircle, Share2 } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="public-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-name">HotelPro</div>
            <p className="footer-tagline">
              Connecting guests with exceptional hotel experiences across India and beyond.
              Book with confidence through our verified hotel network.
            </p>
            <div className="d-flex gap-3 mt-6">
              {[
                { Icon: Globe, label: 'Website' },
                { Icon: MessageCircle, label: 'Community' },
                { Icon: Share2, label: 'Share' },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: '#3a3e3a', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#9ca39a',
                  transition: 'background var(--transition-fast)',
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Guests */}
          <div>
            <p className="footer-heading">For Guests</p>
            <Link to="/hotels" className="footer-link">Browse Hotels</Link>
            <Link to="/search" className="footer-link">Search Rooms</Link>
            <Link to="/my-bookings" className="footer-link">My Bookings</Link>
            <Link to="/profile" className="footer-link">My Profile</Link>
          </div>

          {/* Company */}
          <div>
            <p className="footer-heading">Company</p>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Careers</a>
            <a href="#" className="footer-link">Press</a>
            <a href="#" className="footer-link">Blog</a>
          </div>

          {/* Support */}
          <div>
            <p className="footer-heading">Support</p>
            <a href="#" className="footer-link">Help Centre</a>
            <a href="#" className="footer-link">Cancellation Policy</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link d-flex items-center gap-1 mt-4" style={{ color: '#9ca39a' }}>
              <Phone size={13} /> +91 1800 000 1234
            </a>
            <a href="mailto:support@hotelpro.com" className="footer-link d-flex items-center gap-1" style={{ color: '#9ca39a' }}>
              <Mail size={13} /> support@hotelpro.com
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} HotelPro. All rights reserved.</span>
          <div className="d-flex gap-4" style={{ flexWrap: 'wrap' }}>
            <a href="#" className="footer-copy" style={{ textDecoration: 'underline' }}>Privacy</a>
            <a href="#" className="footer-copy" style={{ textDecoration: 'underline' }}>Terms</a>
            <a href="#" className="footer-copy" style={{ textDecoration: 'underline' }}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
