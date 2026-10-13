import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import BottomNotificationPopup from '../components/common/BottomNotificationPopup';

export default function DashboardLayout({ navItems = [], roleLabel = 'Dashboard', roleColor = 'var(--color-primary)' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out successfully.');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="dashboard-shell">
      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}
        aria-label="Dashboard navigation"
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">H</div>
          <div>
            <div>HotelPro</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontWeight: 'var(--weight-normal)' }}>
              {roleLabel}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label={`${roleLabel} navigation`}>
          {navItems.map((section, si) => (
            <div key={si}>
              {section.label && (
                <span className="sidebar-section-label">{section.label}</span>
              )}
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="link-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="link-badge">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top bar */}
        <header className="dashboard-header-bar">
          <button
            className="btn btn-ghost btn-icon mobile-sidebar-toggle"
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div style={{ flex: 1 }} />

          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setShowNotifications(v => !v)}
            aria-label="Operational Notifications"
            title="Operational Notifications"
          >
            <Bell size={18} />
          </button>

          <div className="avatar avatar-md" aria-hidden="true" style={{ cursor: 'default' }}>
            {initials}
          </div>
        </header>

        <main id="main-content" className="dashboard-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      {/* Live Operational Popup Notification at Bottom Right */}
      <BottomNotificationPopup
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
