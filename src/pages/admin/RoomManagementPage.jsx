import { useState } from 'react';
import {
  BedDouble,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { mockRooms, mockHotels } from '../../data/mock/mockData';
import {
  Button,
  StatusBadge,
  Modal,
  ConfirmationDialog,
  Tabs,
  Alert
} from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [roomModal, setRoomModal] = useState({ open: false, isEditing: false, room: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, room: null });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    type: 'Deluxe',
    floor: 6,
    capacity: 2,
    pricePerNight: 8500,
    status: 'available',
    amenities: 'Free WiFi, Sea View, King Bed, Smart TV',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
  });

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const filteredRooms = rooms.filter(r => {
    const q = searchTerm.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(q) || r.roomNumber.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      roomNumber: `${Math.floor(Math.random() * 10 + 1)}01`,
      type: 'Deluxe',
      floor: 6,
      capacity: 2,
      pricePerNight: 7500,
      status: 'available',
      amenities: 'Free WiFi, Smart TV, King Bed, Mini Bar',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    });
    setRoomModal({ open: true, isEditing: false, room: null });
  };

  const handleOpenEdit = (room) => {
    setFormData({
      name: room.name,
      roomNumber: room.roomNumber,
      type: room.type,
      floor: room.floor,
      capacity: room.capacity || room.maxGuests,
      pricePerNight: room.pricePerNight,
      status: room.status,
      amenities: room.amenities?.join(', ') || '',
      image: room.image,
    });
    setRoomModal({ open: true, isEditing: true, room });
  };

  const handleSaveRoom = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.roomNumber) {
      toast.error('Please fill in room name and room number.');
      return;
    }

    if (roomModal.isEditing && roomModal.room) {
      setRooms(prev => prev.map(r => r.id === roomModal.room.id ? {
        ...r,
        name: formData.name,
        roomNumber: formData.roomNumber,
        type: formData.type,
        floor: Number(formData.floor),
        pricePerNight: Number(formData.pricePerNight),
        status: formData.status,
        amenities: formData.amenities.split(',').map(a => a.trim()),
        image: formData.image,
      } : r));
      toast.success(`Room ${formData.roomNumber} updated successfully.`);
    } else {
      const newRoom = {
        id: `r${Date.now()}`,
        hotelId: 'h1',
        name: formData.name,
        roomNumber: formData.roomNumber,
        type: formData.type,
        floor: Number(formData.floor),
        capacity: Number(formData.capacity),
        pricePerNight: Number(formData.pricePerNight),
        status: formData.status,
        amenities: formData.amenities.split(',').map(a => a.trim()),
        image: formData.image,
        isRefundable: true,
        taxRate: 0.18,
      };
      setRooms([newRoom, ...rooms]);
      toast.success(`New Room ${formData.roomNumber} added to inventory.`);
    }
    setRoomModal({ open: false, isEditing: false, room: null });
  };

  const handleDeleteRoom = () => {
    if (!deleteDialog.room) return;
    setRooms(prev => prev.filter(r => r.id !== deleteDialog.room.id));
    toast.success(`Room ${deleteDialog.room.roomNumber} removed from inventory.`);
    setDeleteDialog({ open: false, room: null });
  };

  const tabs = [
    { id: 'all', label: 'All Rooms', count: rooms.length },
    { id: 'available', label: 'Available', count: rooms.filter(r => r.status === 'available').length },
    { id: 'occupied', label: 'Occupied', count: rooms.filter(r => r.status === 'occupied').length },
    { id: 'cleaning', label: 'Cleaning', count: rooms.filter(r => r.status === 'cleaning').length },
    { id: 'maintenance', label: 'Maintenance', count: rooms.filter(r => r.status === 'maintenance').length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Room & Inventory Management
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Manage hotel rooms, tariffs, amenities, floor assignments, and operational statuses.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} icon={<Plus size={16} />}>
          Add New Room
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by room name or room number (e.g. 1201)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>Clear</Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={statusFilter} onChange={setStatusFilter} />

      {/* Rooms Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="ref-col">Room #</th>
                <th>Room Type & Name</th>
                <th>Floor</th>
                <th>Capacity</th>
                <th>Nightly Rate</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(room => (
                <tr key={room.id}>
                  <td className="ref-col">
                    <span className="ref-badge">
                      #{room.roomNumber}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <img
                        src={room.image}
                        alt={room.name}
                        onError={e => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80';
                        }}
                        style={{ width: 52, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div>
                        <strong>{room.name}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                          {room.type} · {room.bedType || 'King Bed'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>Floor {room.floor}</td>
                  <td>{room.capacity || room.maxGuests || 2} Guests</td>
                  <td>
                    <strong style={{ color: 'var(--color-primary)' }}>{formatPrice(room.pricePerNight)}</strong>
                  </td>
                  <td>
                    <StatusBadge status={room.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(room)}
                        icon={<Edit2 size={14} />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, room })}
                        style={{ color: 'var(--color-error)' }}
                        icon={<Trash2 size={14} />}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD / EDIT ROOM MODAL ────────────────── */}
      <Modal
        isOpen={roomModal.open}
        onClose={() => setRoomModal({ open: false, isEditing: false, room: null })}
        title={roomModal.isEditing ? `Edit Room #${roomModal.room?.roomNumber}` : 'Add New Room to Inventory'}
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => setRoomModal({ open: false, isEditing: false, room: null })}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveRoom}>
              {roomModal.isEditing ? 'Save Changes' : 'Create Room'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveRoom} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div className="form-field" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="rm-name">Room Title</label>
            <input
              id="rm-name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Deluxe Sea View Suite"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="rm-num">Room Number</label>
            <input
              id="rm-num"
              type="text"
              className="form-input"
              value={formData.roomNumber}
              onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="rm-type">Room Type</label>
            <select
              id="rm-type"
              className="form-select"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Family">Family</option>
              <option value="Heritage">Heritage</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="rm-floor">Floor Number</label>
            <input
              id="rm-floor"
              type="number"
              className="form-input"
              value={formData.floor}
              onChange={e => setFormData({ ...formData, floor: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="rm-price">Nightly Rate (₹)</label>
            <input
              id="rm-price"
              type="number"
              className="form-input"
              value={formData.pricePerNight}
              onChange={e => setFormData({ ...formData, pricePerNight: e.target.value })}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="rm-status">Operational Status</label>
            <select
              id="rm-status"
              className="form-select"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="rm-cap">Capacity</label>
            <input
              id="rm-cap"
              type="number"
              className="form-input"
              value={formData.capacity}
              onChange={e => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>

          <div className="form-field" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="rm-amenities">Amenities (comma-separated)</label>
            <input
              id="rm-amenities"
              type="text"
              className="form-input"
              value={formData.amenities}
              onChange={e => setFormData({ ...formData, amenities: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* ── DELETE CONFIRMATION ──────────────────── */}
      <ConfirmationDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, room: null })}
        onConfirm={handleDeleteRoom}
        title="Delete Room from Inventory"
        message={`Are you sure you want to delete Room #${deleteDialog.room?.roomNumber} (${deleteDialog.room?.name})? This action cannot be reversed.`}
        confirmLabel="Delete Room"
      />
    </div>
  );
}
