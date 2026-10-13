import { useState, useEffect } from 'react';
import {
  Users,
  Key,
  LogIn,
  LogOut,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  DoorOpen
} from 'lucide-react';
import {
  mockReservations,
  mockRequests,
  mockRooms,
  mockDashboardMetrics
} from '../../data/mock/mockData';
import bookingService from '../../services/bookingService';
import {
  Button,
  StatusBadge,
  MetricCard,
  Tabs,
  Modal,
  Alert
} from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function FrontDeskPage() {
  const [reservations, setReservations] = useState(mockReservations);
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('arrivals');

  useEffect(() => {
    bookingService.getAllBookings().then(res => {
      if (res?.bookings?.length) setReservations(res.bookings);
    }).catch(() => {});
  }, []);

  // Modal states for Check-In and Check-Out
  const [checkInModal, setCheckInModal] = useState({ open: false, booking: null, roomNumber: '' });
  const [checkOutModal, setCheckOutModal] = useState({ open: false, booking: null, incidentals: 0 });
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ roomNumber: '1201', guestName: '', type: 'Extra Towels', notes: '' });

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);

  // Filter reservations based on search term
  const searchedReservations = reservations.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      r.guestName.toLowerCase().includes(q) ||
      r.bookingRef.toLowerCase().includes(q) ||
      r.roomNumber.toLowerCase().includes(q)
    );
  });

  const arrivals = searchedReservations.filter(r => r.status === 'confirmed');
  const inHouse = searchedReservations.filter(r => r.status === 'checked-in');
  const departures = searchedReservations.filter(r => r.status === 'checked-in' || r.status === 'checked-out');

  // Handle Check-In
  const handleOpenCheckIn = (booking) => {
    setCheckInModal({ open: true, booking, roomNumber: booking.roomNumber || '1201' });
  };

  const handleConfirmCheckIn = async () => {
    if (!checkInModal.booking) return;
    try {
      await bookingService.checkIn(checkInModal.booking.id);
      setReservations(prev =>
        prev.map(r => r.id === checkInModal.booking.id ? { ...r, status: 'checked-in', roomNumber: checkInModal.roomNumber } : r)
      );
      toast.success(`Guest ${checkInModal.booking.guestName} successfully checked into Room ${checkInModal.roomNumber}!`);
      setCheckInModal({ open: false, booking: null, roomNumber: '' });
    } catch (err) {
      toast.error('Check-in failed');
    }
  };

  // Handle Check-Out
  const handleOpenCheckOut = (booking) => {
    setCheckOutModal({ open: true, booking, incidentals: 0 });
  };

  const handleConfirmCheckOut = async () => {
    if (!checkOutModal.booking) return;
    try {
      await bookingService.checkOut(checkOutModal.booking.id);
      setReservations(prev =>
        prev.map(r => r.id === checkOutModal.booking.id ? { ...r, status: 'checked-out' } : r)
      );
      toast.success(`Check-out completed for ${checkOutModal.booking.guestName}. Room marked for cleaning.`);
      setCheckOutModal({ open: false, booking: null, incidentals: 0 });
    } catch (err) {
      toast.error('Check-out failed');
    }
  };

  // Handle guest request status update
  const handleToggleRequestStatus = (reqId) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== reqId) return req;
      const nextStatus = req.status === 'open' ? 'in-progress' : req.status === 'in-progress' ? 'complete' : 'open';
      toast.info(`Request #${req.id} updated to ${nextStatus}`);
      return { ...req, status: nextStatus };
    }));
  };

  const handleAddRequest = (e) => {
    e.preventDefault();
    const newReq = {
      id: `req${Date.now().toString().slice(-4)}`,
      roomNumber: requestForm.roomNumber,
      guestName: requestForm.guestName || 'In-House Guest',
      type: requestForm.type,
      status: 'open',
      priority: 'normal',
      createdAt: new Date().toISOString(),
      notes: requestForm.notes,
    };
    setRequests([newReq, ...requests]);
    toast.success('Guest service ticket created.');
    setNewRequestModal(false);
    setRequestForm({ roomNumber: '1201', guestName: '', type: 'Extra Towels', notes: '' });
  };

  const tabs = [
    { id: 'arrivals', label: 'Expected Arrivals', count: arrivals.length, icon: <LogIn size={15} /> },
    { id: 'inhouse', label: 'In-House Guests', count: inHouse.length, icon: <Users size={15} /> },
    { id: 'departures', label: 'Departures', count: departures.length, icon: <LogOut size={15} /> },
    { id: 'requests', label: 'Guest Service Requests', count: requests.filter(r => r.status !== 'complete').length, icon: <Bell size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Front Desk Operations
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Manage daily guest arrivals, keycards, departures, and active room service requests.
          </p>
        </div>
        <Button variant="primary" onClick={() => setNewRequestModal(true)} icon={<Bell size={16} />}>
          New Guest Request
        </Button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <MetricCard
          label="Today's Arrivals"
          value={mockDashboardMetrics.arrivalsToday}
          change={8}
          changeLabel="vs yesterday"
          icon={<LogIn size={20} color="var(--color-primary)" />}
          iconBg="var(--color-primary-light)"
        />
        <MetricCard
          label="In-House Guests"
          value={mockDashboardMetrics.inHouseGuests}
          icon={<Users size={20} color="var(--color-info)" />}
          iconBg="var(--color-info-bg)"
        />
        <MetricCard
          label="Today's Departures"
          value={mockDashboardMetrics.departuresToday}
          icon={<LogOut size={20} color="var(--color-warning)" />}
          iconBg="var(--color-warning-bg)"
        />
        <MetricCard
          label="Rooms Available"
          value={mockDashboardMetrics.availableRooms}
          icon={<DoorOpen size={20} color="var(--color-success)" />}
          iconBg="var(--color-success-bg)"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by guest name, booking ref (HP-2026-...), or room number..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          )}
        </div>
      </div>

      {/* Operational Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'arrivals' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className="ref-col">Ref</th>
                  <th>Guest Name</th>
                  <th>Room Type</th>
                  <th>Room Assigned</th>
                  <th>Check-In Window</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {arrivals.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                      No pending arrivals matching criteria.
                    </td>
                  </tr>
                ) : (
                  arrivals.map(b => (
                    <tr key={b.id}>
                      <td className="ref-col"><span className="ref-badge">{b.bookingRef}</span></td>
                      <td>
                        <strong>{b.guestName}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{b.guestPhone}</div>
                      </td>
                      <td>{b.roomName}</td>
                      <td>
                        <span className="badge badge-outline">Room {b.roomNumber}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={14} color="var(--color-text-secondary)" /> Today ({b.nights} nights)
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={b.paymentStatus} />
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenCheckIn(b)}
                          icon={<Key size={14} />}
                        >
                          Check In
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'inhouse' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Guest Name</th>
                  <th>Check-In Date</th>
                  <th>Check-Out Due</th>
                  <th>Special Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inHouse.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                      No active in-house guests currently registered.
                    </td>
                  </tr>
                ) : (
                  inHouse.map(b => (
                    <tr key={b.id}>
                      <td><strong style={{ fontSize: 'var(--text-md)', color: 'var(--color-primary)' }}>#{b.roomNumber}</strong></td>
                      <td>
                        <strong>{b.guestName}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{b.guests} Guests</div>
                      </td>
                      <td>{b.checkIn}</td>
                      <td><strong>{b.checkOut}</strong></td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        {b.specialRequests || 'Standard guest profile'}
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenCheckOut(b)}
                          icon={<LogOut size={14} />}
                        >
                          Check Out
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'departures' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className="ref-col">Ref</th>
                  <th>Guest Name</th>
                  <th>Room #</th>
                  <th>Departure Date</th>
                  <th>Billing Status</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departures.map(b => (
                  <tr key={b.id}>
                    <td className="ref-col"><span className="ref-badge">{b.bookingRef}</span></td>
                    <td>{b.guestName}</td>
                    <td><strong>#{b.roomNumber}</strong></td>
                    <td>{b.checkOut}</td>
                    <td><StatusBadge status={b.paymentStatus} /></td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      {b.status === 'checked-in' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenCheckOut(b)}
                          icon={<LogOut size={14} />}
                        >
                          Check Out
                        </Button>
                      ) : (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 'var(--weight-semibold)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {requests.map(req => (
            <div key={req.id} className="card" style={{ padding: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)' }}>
                  Room #{req.roomNumber}
                </span>
                <StatusBadge
                  status={req.status === 'complete' ? 'confirmed' : req.status === 'in-progress' ? 'pending' : 'cleaning'}
                  label={req.status.toUpperCase()}
                />
              </div>

              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-bold)', marginTop: 'var(--space-2)' }}>
                {req.type}
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBlock: 'var(--space-2)' }}>
                "{req.notes}"
              </p>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Guest: {req.guestName}
              </div>

              <Button
                variant={req.status === 'complete' ? 'ghost' : 'outline'}
                size="sm"
                onClick={() => handleToggleRequestStatus(req.id)}
                icon={<CheckCircle2 size={14} />}
              >
                {req.status === 'open' ? 'Mark In-Progress' : req.status === 'in-progress' ? 'Mark Complete' : 'Re-open Ticket'}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ── CHECK-IN MODAL ──────────────────────── */}
      <Modal
        isOpen={checkInModal.open}
        onClose={() => setCheckInModal({ open: false, booking: null, roomNumber: '' })}
        title="Process Guest Check-In"
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => setCheckInModal({ open: false, booking: null, roomNumber: '' })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmCheckIn} icon={<Key size={16} />}>
              Issue Keycard & Confirm Check-In
            </Button>
          </div>
        }
      >
        {checkInModal.booking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Alert type="info">
              Verify guest identification against <strong>{checkInModal.booking.guestName}</strong>.
            </Alert>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Guest Contact</span>
                <div style={{ fontWeight: 'var(--weight-semibold)' }}>{checkInModal.booking.guestPhone}</div>
              </div>
              <div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Stay Duration</span>
                <div style={{ fontWeight: 'var(--weight-semibold)' }}>{checkInModal.booking.nights} nights ({checkInModal.booking.checkIn} - {checkInModal.booking.checkOut})</div>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="room-assign">Assigned Room Number</label>
              <input
                id="room-assign"
                type="text"
                className="form-input"
                value={checkInModal.roomNumber}
                onChange={e => setCheckInModal({ ...checkInModal, roomNumber: e.target.value })}
              />
              <span className="form-hint">RFID keycard encoder will program key for selected room.</span>
            </div>
          </div>
        )}
      </Modal>

      {/* ── CHECK-OUT MODAL ─────────────────────── */}
      <Modal
        isOpen={checkOutModal.open}
        onClose={() => setCheckOutModal({ open: false, booking: null, incidentals: 0 })}
        title="Process Guest Departure & Settlement"
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => setCheckOutModal({ open: false, booking: null, incidentals: 0 })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmCheckOut} icon={<CheckCircle2 size={16} />}>
              Settle Bill & Complete Check-Out
            </Button>
          </div>
        }
      >
        {checkOutModal.booking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ background: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span>Room #{checkOutModal.booking.roomNumber}</span>
                <strong>{checkOutModal.booking.guestName}</strong>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                Room Rate Billed: {formatPrice(checkOutModal.booking.totalAmount)}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="incidentals">Incidentals / Minibar / Room Service (₹)</label>
              <input
                id="incidentals"
                type="number"
                className="form-input"
                value={checkOutModal.incidentals}
                onChange={e => setCheckOutModal({ ...checkOutModal, incidentals: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <Alert type="warning">
              Completing check-out will immediately flag Room #{checkOutModal.booking.roomNumber} as <strong>Dirty</strong> on the Housekeeping dashboard.
            </Alert>
          </div>
        )}
      </Modal>

      {/* ── NEW REQUEST MODAL ───────────────────── */}
      <Modal
        isOpen={newRequestModal}
        onClose={() => setNewRequestModal(false)}
        title="Create Guest Service Request"
        size="sm"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => setNewRequestModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddRequest}>Create Ticket</Button>
          </div>
        }
      >
        <form onSubmit={handleAddRequest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="req-room">Room Number</label>
            <input
              id="req-room"
              type="text"
              className="form-input"
              value={requestForm.roomNumber}
              onChange={e => setRequestForm({ ...requestForm, roomNumber: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="req-type">Request Type</label>
            <select
              id="req-type"
              className="form-select"
              value={requestForm.type}
              onChange={e => setRequestForm({ ...requestForm, type: e.target.value })}
            >
              <option value="Extra Towels">Extra Towels & Linens</option>
              <option value="Room Service">Room Service / Dining Order</option>
              <option value="Luggage Assistance">Luggage Assistance / Bellhop</option>
              <option value="Housekeeping Refresh">Housekeeping Cleaning</option>
              <option value="Maintenance">Maintenance / Technical Help</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="req-notes">Notes / Details</label>
            <textarea
              id="req-notes"
              className="form-textarea"
              rows={3}
              value={requestForm.notes}
              onChange={e => setRequestForm({ ...requestForm, notes: e.target.value })}
              placeholder="e.g. 2 extra pillows and water bottles"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
