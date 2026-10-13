import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, Key, Sparkles, ExternalLink, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Reservation Confirmed',
    message: 'Booking Ref HP-2026-006 confirmed for Deluxe Sea View Room.',
    time: 'Just now',
    type: 'booking',
    link: '/admin/bookings',
    icon: <Key size={16} color="var(--color-primary)" />,
  },
  {
    id: 2,
    title: 'Housekeeping Completed',
    message: 'Room 601 marked Clean & Inspected by Mohan Pillai.',
    time: '2 mins ago',
    type: 'housekeeping',
    link: '/admin/housekeeping',
    icon: <Sparkles size={16} color="var(--color-success)" />,
  },
  {
    id: 3,
    title: 'VIP Guest Arrival Alert',
    message: 'Platinum VIP Arjun Sharma scheduled for check-in today.',
    time: '10 mins ago',
    type: 'front-desk',
    link: '/admin/front-desk',
    icon: <CheckCircle2 size={16} color="var(--color-info)" />,
  },
];

export default function BottomNotificationPopup({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [activeNotification, setActiveNotification] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();

  // Show a popup notification after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveNotification(notifications[0]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // When isOpen prop is triggered from header bell
  useEffect(() => {
    if (isOpen) {
      setActiveNotification(notifications[0]);
      setIsMinimized(false);
    }
  }, [isOpen]);

  const handleDismiss = () => {
    setActiveNotification(null);
    if (onClose) onClose();
  };

  const handleNavigate = (link) => {
    navigate(link);
    handleDismiss();
  };

  if (!activeNotification) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setActiveNotification(notifications[0])}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform 0.2s',
          }}
          title="Open Operational Alerts"
          aria-label="Operational Notifications"
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--color-secondary)',
              border: '2px solid #fff',
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Live System Notification"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 380,
        width: 'calc(100vw - 48px)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.16)',
        animation: 'slideInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          background: 'var(--color-primary)',
          color: '#ffffff',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-semibold)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#28a745',
              display: 'inline-block',
              boxShadow: '0 0 6px #28a745',
            }}
          />
          Live Operations Alert
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 2,
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Close Notification"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body Content */}
      <div style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {activeNotification.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
            <h4
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}
            >
              {activeNotification.title}
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
              {activeNotification.time}
            </span>
          </div>

          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
              marginTop: 4,
              marginBottom: 10,
              lineHeight: 1.4,
            }}
          >
            {activeNotification.message}
          </p>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => handleNavigate(activeNotification.link)}
              style={{
                fontSize: '11px',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-primary)',
                background: 'var(--color-primary-light)',
                border: '1px solid rgba(35, 75, 59, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              View in Console <ExternalLink size={11} />
            </button>
            <button
              onClick={handleDismiss}
              style={{
                fontSize: '11px',
                color: 'var(--color-text-secondary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
