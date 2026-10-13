import { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Edit2,
  Trash2
} from 'lucide-react';
import { mockStaff } from '../../data/mock/mockData';
import {
  Button,
  StatusBadge,
  Modal,
  ConfirmationDialog,
  Tabs
} from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');

  // Modal
  const [staffModal, setStaffModal] = useState({ open: false, staff: null });
  const [formData, setFormData] = useState({
    name: '',
    role: 'Front Desk',
    shift: 'Morning',
    email: '',
    phone: '',
    status: 'active',
  });

  const filteredStaff = staffList.filter(s => {
    const q = searchTerm.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchShift = shiftFilter === 'all' || s.shift.toLowerCase() === shiftFilter.toLowerCase();
    return matchSearch && matchShift;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      role: 'Front Desk',
      shift: 'Morning',
      email: '',
      phone: '+91 98000 ',
      status: 'active',
    });
    setStaffModal({ open: true, staff: null });
  };

  const handleOpenEdit = (st) => {
    setFormData({
      name: st.name,
      role: st.role,
      shift: st.shift,
      email: st.email,
      phone: st.phone,
      status: st.status,
    });
    setStaffModal({ open: true, staff: st });
  };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please enter name and email.');
      return;
    }

    if (staffModal.staff) {
      setStaffList(prev => prev.map(s => s.id === staffModal.staff.id ? { ...s, ...formData } : s));
      toast.success(`Staff member ${formData.name} updated.`);
    } else {
      const newStaff = {
        id: `s${Date.now()}`,
        ...formData,
        hotelId: 'h1',
      };
      setStaffList([newStaff, ...staffList]);
      toast.success(`New staff member ${formData.name} added.`);
    }
    setStaffModal({ open: false, staff: null });
  };

  const handleToggleStatus = (id) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        const next = s.status === 'active' ? 'off-duty' : 'active';
        toast.info(`${s.name} is now ${next}.`);
        return { ...s, status: next };
      }
      return s;
    }));
  };

  const tabs = [
    { id: 'all', label: 'All Staff', count: staffList.length },
    { id: 'morning', label: 'Morning Shift', count: staffList.filter(s => s.shift.toLowerCase() === 'morning').length },
    { id: 'evening', label: 'Evening Shift', count: staffList.filter(s => s.shift.toLowerCase() === 'evening').length },
    { id: 'night', label: 'Night Shift', count: staffList.filter(s => s.shift.toLowerCase() === 'night').length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Staff & Workforce Directory
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Manage hotel personnel, departmental roles, shifts, and active duty statuses.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd} icon={<UserPlus size={16} />}>
          Add Team Member
        </Button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by staff name, role (Housekeeping, Front Desk), or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>Clear</Button>
          )}
        </div>
      </div>

      {/* Shift Tabs */}
      <Tabs tabs={tabs} activeTab={shiftFilter} onChange={setShiftFilter} />

      {/* Staff Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Department / Role</th>
                <th>Shift Schedule</th>
                <th>Contact Info</th>
                <th>Duty Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map(st => (
                <tr key={st.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div className="avatar avatar-md" style={{ background: 'var(--color-primary)', color: '#ffffff' }}>
                        {st.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <strong>{st.name}</strong>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>ID: {st.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline" style={{ fontWeight: 'var(--weight-semibold)' }}>
                      {st.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} color="var(--color-text-secondary)" /> {st.shift}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span><Mail size={12} style={{ display: 'inline', marginRight: 4 }} /> {st.email}</span>
                      <span><Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> {st.phone}</span>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(st.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      title="Click to toggle duty status"
                    >
                      <StatusBadge status={st.status === 'active' ? 'active' : 'inactive'} label={st.status === 'active' ? 'On Duty' : 'Off Duty'} />
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEdit(st)}
                      icon={<Edit2 size={14} />}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD/EDIT MODAL ───────────────────────── */}
      <Modal
        isOpen={staffModal.open}
        onClose={() => setStaffModal({ open: false, staff: null })}
        title={staffModal.staff ? `Edit ${staffModal.staff.name}` : 'Add Staff Member'}
        size="md"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => setStaffModal({ open: false, staff: null })}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveStaff}>
              {staffModal.staff ? 'Save Member' : 'Add Member'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveStaff} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <div className="form-field" style={{ gridColumn: '1/-1' }}>
            <label className="form-label" htmlFor="st-name">Full Name</label>
            <input
              id="st-name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="st-role">Role / Department</label>
            <select
              id="st-role"
              className="form-select"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="Front Desk">Front Desk</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Concierge">Concierge</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="st-shift">Assigned Shift</label>
            <select
              id="st-shift"
              className="form-select"
              value={formData.shift}
              onChange={e => setFormData({ ...formData, shift: e.target.value })}
            >
              <option value="Morning">Morning (07:00 - 15:30)</option>
              <option value="Evening">Evening (15:00 - 23:30)</option>
              <option value="Night">Night (23:00 - 07:30)</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="st-email">Email Address</label>
            <input
              id="st-email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="st-phone">Phone Number</label>
            <input
              id="st-phone"
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
