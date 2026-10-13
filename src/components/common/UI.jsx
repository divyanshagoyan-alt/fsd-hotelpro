// Shared UI atoms — Button, StatusBadge, LoadingSkeleton, EmptyState, ErrorState, Modal, etc.

import { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, Check, TrendingUp, TrendingDown, Inbox, WifiOff } from 'lucide-react';

// ─── BUTTON ───────────────────────────────────────────────────────────────────
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  as: Tag = 'button',
  ...props
}) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag
      className={cls}
      aria-busy={loading}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {!loading && icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
    </Tag>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const STATUS_LABELS = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
  available: 'Available',
  occupied: 'Occupied',
  cleaning: 'Cleaning',
  maintenance: 'Maintenance',
  paid: 'Paid',
  refunded: 'Refunded',
  active: 'Active',
  inactive: 'Inactive',
};

export function StatusBadge({ status, label, showDot = true }) {
  const displayLabel = label || STATUS_LABELS[status] || status;
  return (
    <span className={`status-badge ${status}`} aria-label={`Status: ${displayLabel}`}>
      {showDot && <span className="status-dot" aria-hidden="true" />}
      {displayLabel}
    </span>
  );
}

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
export function LoadingSkeleton({ type = 'text', width, height, style = {} }) {
  const skeletonClass = type === 'text' ? 'skeleton skeleton-text'
    : type === 'title' ? 'skeleton skeleton-title'
    : type === 'img'   ? 'skeleton skeleton-img'
    : type === 'btn'   ? 'skeleton skeleton-btn'
    : type === 'avatar'? 'skeleton skeleton-avatar'
    : 'skeleton';
  return (
    <div
      className={skeletonClass}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card">
      <LoadingSkeleton type="img" />
      <div className="card-body d-flex flex-col gap-3">
        <LoadingSkeleton type="title" width="60%" />
        <LoadingSkeleton type="text" />
        <LoadingSkeleton type="text" width="80%" />
        <div className="d-flex gap-2 mt-2">
          <LoadingSkeleton type="btn" width="100px" />
        </div>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        {icon || <Inbox size={28} />}
      </div>
      <p className="empty-state-title">{title || 'Nothing here yet'}</p>
      {description && <p className="empty-state-text">{description}</p>}
      {action}
    </div>
  );
}

// ─── ERROR STATE ──────────────────────────────────────────────────────────────
export function ErrorState({ title, description, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state-icon" aria-hidden="true">
        <WifiOff size={28} />
      </div>
      <p className="empty-state-title" style={{ color: 'var(--color-error)' }}>
        {title || 'Failed to load'}
      </p>
      {description && <p className="empty-state-text">{description}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = '', footer }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      dialogRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`modal ${size ? `modal-${size}` : ''}`}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── CONFIRMATION DIALOG ──────────────────────────────────────────────────────
export function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', variant = 'destructive', loading = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="d-flex gap-3 items-start">
        <AlertCircle size={20} style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>{message}</p>
      </div>
    </Modal>
  );
}

// ─── METRIC CARD ──────────────────────────────────────────────────────────────
export function MetricCard({ label, value, change, changeLabel, icon, iconBg }) {
  const isUp = change > 0;
  return (
    <div className="metric-card">
      <div className="d-flex justify-between items-center">
        <span className="metric-label">{label}</span>
        {icon && (
          <div className="metric-icon" style={iconBg ? { background: iconBg } : {}}>
            {icon}
          </div>
        )}
      </div>
      <span className="metric-value tabular-nums">{value}</span>
      {change !== undefined && (
        <div className={`metric-change ${isUp ? 'up' : 'down'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(change)}% {changeLabel || (isUp ? 'increase' : 'decrease')}</span>
        </div>
      )}
    </div>
  );
}

// ─── ALERT ───────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', title, children }) {
  const icons = { info: '💡', success: <Check size={16} />, warning: '⚠️', error: <AlertCircle size={16} /> };
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="alert-icon" aria-hidden="true">{icons[type]}</span>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}

// ─── TABS ────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className="badge badge-outline" style={{ marginLeft: 4 }}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >‹</button>
      {visible.map((p, i) => {
        const prev = visible[i - 1];
        return (
          <>
            {prev && p - prev > 1 && (
              <span key={`ellipsis-${p}`} className="page-btn" style={{ cursor: 'default' }}>…</span>
            )}
            <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >{p}</button>
          </>
        );
      })}
      <button
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >›</button>
    </div>
  );
}

// ─── BREADCRUMBS ──────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((item, i) => (
        <span key={i} className="breadcrumb-item">
          {i > 0 && <ChevronRight size={14} aria-hidden="true" />}
          {item.href ? (
            <Link to={item.href} className="breadcrumb-link">{item.label}</Link>
          ) : (
            <span className="breadcrumb-current" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
