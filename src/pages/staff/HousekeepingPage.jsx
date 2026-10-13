import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  User,
  Plus,
  RefreshCw,
  DoorClosed
} from 'lucide-react';
import { mockRooms, mockHousekeeping, mockStaff } from '../../data/mock/mockData';
import {
  Button,
  StatusBadge,
  Tabs,
  Modal,
  Alert,
  MetricCard
} from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState(mockHousekeeping);
  const [rooms, setRooms] = useState(mockRooms);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal to assign task
  const [assignModal, setAssignModal] = useState({ open: false, task: null });
  const [selectedStaff, setSelectedStaff] = useState('Mohan Pillai');

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        toast.success(`Task for Room ${t.roomNumber} marked as ${newStatus}.`);
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleAssignStaff = () => {
    if (!assignModal.task) return;
    setTasks(prev => prev.map(t => {
      if (t.id === assignModal.task.id) {
        return { ...t, assignedTo: selectedStaff };
      }
      return t;
    }));
    toast.success(`Room ${assignModal.task.roomNumber} assigned to ${selectedStaff}.`);
    setAssignModal({ open: false, task: null });
  };

  const cleanCount = tasks.filter(t => t.status === 'complete').length;
  const inProgressCount = tasks.filter(t => t.status === 'cleaning').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const maintenanceCount = tasks.filter(t => t.status === 'maintenance').length;

  const tabs = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'cleaning', label: 'In Progress', count: inProgressCount },
    { id: 'pending', label: 'Needs Cleaning', count: pendingCount },
    { id: 'complete', label: 'Cleaned & Inspected', count: cleanCount },
    { id: 'maintenance', label: 'Maintenance Issues', count: maintenanceCount },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Housekeeping & Room Cleanliness
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Real-time room sanitation tracking, housekeeper staff assignments, and inspection logs.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            toast.info('Refreshed housekeeping status data.');
          }}
          icon={<RefreshCw size={15} />}
        >
          Refresh Grid
        </Button>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <MetricCard
          label="Clean & Inspected"
          value={cleanCount}
          icon={<CheckCircle2 size={20} color="var(--color-success)" />}
          iconBg="var(--color-success-bg)"
        />
        <MetricCard
          label="Cleaning In-Progress"
          value={inProgressCount}
          icon={<Sparkles size={20} color="var(--color-primary)" />}
          iconBg="var(--color-primary-light)"
        />
        <MetricCard
          label="Pending Cleaning"
          value={pendingCount}
          icon={<Clock size={20} color="var(--color-warning)" />}
          iconBg="var(--color-warning-bg)"
        />
        <MetricCard
          label="Maintenance Required"
          value={maintenanceCount}
          icon={<AlertTriangle size={20} color="var(--color-error)" />}
          iconBg="var(--color-error-bg)"
        />
      </div>

      {/* Status Filter Tabs */}
      <Tabs tabs={tabs} activeTab={statusFilter} onChange={setStatusFilter} />

      {/* Housekeeping Tasks Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {filteredTasks.map(task => (
          <div key={task.id} className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
                  Room #{task.roomNumber}
                </span>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {task.roomName}
                </div>
              </div>
              <StatusBadge status={task.status} />
            </div>

            <div style={{ background: 'var(--color-bg)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBlock: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Assigned Staff:</span>
                <strong>{task.assignedTo || 'Unassigned'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Priority:</span>
                <span style={{
                  color: task.priority === 'high' ? 'var(--color-error)' : 'var(--color-text-secondary)',
                  fontWeight: task.priority === 'high' ? 'var(--weight-bold)' : 'normal',
                  textTransform: 'capitalize'
                }}>
                  {task.priority} Priority
                </span>
              </div>
            </div>

            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              {task.notes}
            </p>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}>
              {task.status !== 'complete' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleUpdateStatus(task.id, 'complete')}
                  icon={<CheckCircle2 size={14} />}
                >
                  Mark Clean
                </Button>
              )}
              {task.status !== 'cleaning' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(task.id, 'cleaning')}
                  icon={<Sparkles size={14} />}
                >
                  Start Cleaning
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedStaff(task.assignedTo || 'Mohan Pillai');
                  setAssignModal({ open: true, task });
                }}
                icon={<User size={14} />}
              >
                Reassign
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ── REASSIGN MODAL ───────────────────────── */}
      <Modal
        isOpen={assignModal.open}
        onClose={() => setAssignModal({ open: false, task: null })}
        title={`Assign Housekeeper for Room #${assignModal.task?.roomNumber}`}
        size="sm"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button variant="ghost" onClick={() => setAssignModal({ open: false, task: null })}>Cancel</Button>
            <Button variant="primary" onClick={handleAssignStaff}>Update Assignment</Button>
          </div>
        }
      >
        <div className="form-field">
          <label className="form-label" htmlFor="staff-select">Select Housekeeper</label>
          <select
            id="staff-select"
            className="form-select"
            value={selectedStaff}
            onChange={e => setSelectedStaff(e.target.value)}
          >
            {mockStaff.map(st => (
              <option key={st.id} value={st.name}>{st.name} ({st.role} - {st.shift})</option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}
