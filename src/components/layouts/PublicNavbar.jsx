import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bell, LogOut, ChevronDown, Building, Search, LayoutDashboard, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully.');
    navigate('/');
    setUserMenuOpen(false);
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    } else {
      navigate('/search');
    }
  };

  const navLinks = [
    { to: '/hotels', label: 'Explore Hotels', icon: <Building size={16} /> },
  ];

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'admin' || user.role === 'manager') return '/admin';
    if (user.role === 'staff') return '/staff/front-desk';
    return '/my-bookings';
  };

  return (
    <>
      <header className="public-navbar" role="banner">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="HotelPro home">
            <div className="navbar-logo-mark" aria-hidden="true">H</div>
            HotelPro
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar-nav" aria-label="Main navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Quick Search in Navbar */}
          <form onSubmit={handleNavSearch} className="hide-mobile" style={{ position: 'relative', width: 220, marginInline: 'var(--space-2)' }} role="search">
            <input
              type="text"
              placeholder="Search hotels, cities..."
              value={navSearch}
              onChange={e => setNavSearch(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: 34,
                paddingBlock: '6px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                width: '100%',
              }}
              aria-label="Search hotels by name or city"
            />
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                pointerEvents: 'none'
              }}
            />
          </form>

          {/* Actions */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-ghost d-flex items-center gap-2"
                  onClick={() => setUserMenuOpen(v => !v)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <div className="avatar avatar-sm" aria-hidden="true">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hide-mobile" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="dropdown-menu" role="menu">
                      <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>{user.name}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{user.email}</div>
                      </div>
                      {getDashboardLink() && (
                        <Link to={getDashboardLink()} className="dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                          <LayoutDashboard size={15} /> Management Console
                        </Link>
                      )}
                      <Link to="/my-bookings" className="dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <Calendar size={15} /> My Bookings
                      </Link>
                      <Link to="/profile" className="dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                        <User size={15} /> My Profile
                      </Link>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item destructive" role="menuitem" onClick={handleLogout}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 'calc(var(--z-dropdown) - 1)' }}
                      onClick={() => setUserMenuOpen(false)}
                    />
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm hide-mobile">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className="navbar-hamburger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <nav className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`} aria-label="Mobile navigation">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
        {!isAuthenticated && (
          <>
            <div className="divider" />
            <Link to="/login" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Sign In</Link>
            <Link to="/register" className="mobile-nav-link" style={{ color: 'var(--color-primary)', fontWeight: 'var(--weight-semibold)' }} onClick={() => setMobileOpen(false)}>Create Account</Link>
          </>
        )}
      </nav>
    </>
  );
}
