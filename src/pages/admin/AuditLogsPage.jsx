import { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Clock,
  User,
  Activity,
  Download,
  Filter
} from 'lucide-react';
import { mockAuditLogs } from '../../data/mock/mockData';
import { Button, StatusBadge } from '../../components/common/UI';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([
    ...mockAuditLogs,
    { id: "al4", user: "kavita@hotelpro.com", action: "Guest Check-In Completed", target: "res001 (Room 1201)", timestamp: "2026-10-11T10:15:00Z", ip: "192.168.1.15" },
    { id: "al5", user: "admin@hotelpro.com", action: "Room Tariff Modified", target: "r2 (Club Suite)", timestamp: "2026-10-11T08:45:00Z", ip: "192.168.1.10" },
    { id: "al6", user: "anjali@hotelpro.com", action: "Housekeeping Priority Escalated", target: "Room 305 AC Fix", timestamp: "2026-10-10T16:20:00Z", ip: "192.168.1.22" },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(l => {
    const q = searchTerm.toLowerCase();
    return (
      l.user.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.target.toLowerCase().includes(q) ||
      l.ip.includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            System Audit & Security Logs
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Immutable event records tracking administrative modifications, price adjustments, and system authorizations.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()} icon={<Download size={15} />}>
          Export Audit Trail
        </Button>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 38 }}
            placeholder="Search by user email, action type, IP address..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="ref-col">Timestamp (UTC)</th>
                <th>Operator</th>
                <th>Action Taken</th>
                <th>Target Resource</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td className="ref-col" style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
                    {log.timestamp.replace('T', ' ').replace('Z', '')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={14} color="var(--color-text-secondary)" />
                      <strong>{log.user}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{log.action}</span>
                  </td>
                  <td style={{ fontSize: 'var(--text-sm)' }}>
                    <code>{log.target}</code>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
