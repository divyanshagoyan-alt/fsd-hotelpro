import { useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Building,
  Calendar,
  BedDouble,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  mockDashboardMetrics,
  mockOccupancyData,
  mockRevenueByCategory,
  mockReservations,
  mockHotels
} from '../../data/mock/mockData';
import {
  MetricCard,
  StatusBadge,
  Button
} from '../../components/common/UI';
import { toast } from 'react-toastify';

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState('6m');

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const PIE_COLORS = ['#234B3B', '#B88B5A', '#287A50', '#245CB5', '#A56817'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Page Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Hospitality Executive Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Real-time occupancy rates, RevPAR metrics, department revenue, and active bookings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.print();
            }}
            icon={<Download size={15} />}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 'var(--space-4)' }}>
        <MetricCard
          label="Occupancy Rate"
          value={`${mockDashboardMetrics.occupancyRate}%`}
          change={4.2}
          changeLabel="vs target"
          icon={<BedDouble size={20} color="var(--color-primary)" />}
          iconBg="var(--color-primary-light)"
        />
        <MetricCard
          label="Revenue This Month"
          value={formatCurrency(mockDashboardMetrics.revenueThisMonth)}
          change={12.5}
          changeLabel="MoM growth"
          icon={<DollarSign size={20} color="var(--color-success)" />}
          iconBg="var(--color-success-bg)"
        />
        <MetricCard
          label="RevPAR (Rev / Room)"
          value={formatCurrency(mockDashboardMetrics.revPAR)}
          change={6.1}
          changeLabel="vs last month"
          icon={<TrendingUp size={20} color="var(--color-info)" />}
          iconBg="var(--color-info-bg)"
        />
        <MetricCard
          label="Average Daily Rate (ADR)"
          value={formatCurrency(mockDashboardMetrics.avgDailyRate)}
          change={-1.5}
          changeLabel="vs last month"
          icon={<Building size={20} color="var(--color-warning)" />}
          iconBg="var(--color-warning-bg)"
        />
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: 'var(--space-6)', alignItems: 'stretch' }}>
        {/* Occupancy Trend Area Chart */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>Occupancy Rate Trend</h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Monthly performance benchmark across properties</p>
            </div>
            <span className="badge badge-success">+4.2% Average</span>
          </div>

          <div style={{ height: 280, width: '100%', marginTop: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockOccupancyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#234B3B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#234B3B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-text-secondary)" fontSize={12} />
                <YAxis unit="%" stroke="var(--color-text-secondary)" fontSize={12} domain={[50, 100]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Occupancy']}
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)'
                  }}
                />
                <Area type="monotone" dataKey="occupancy" stroke="#234B3B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown Donut Chart */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>Revenue by Department</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Rooms, Dining, Spa, and Event share</p>
          </div>

          <div style={{ height: 220, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockRevenueByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockRevenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Share']}
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'auto', fontSize: 'var(--text-xs)' }}>
            {mockRevenueByCategory.map((cat, idx) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>{cat.name}</span>
                <strong style={{ marginLeft: 'auto' }}>{cat.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>Recent Reservations</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Latest booked stays across all hotel properties</p>
          </div>
          <span className="badge badge-outline">{mockReservations.length} Active Bookings</span>
        </div>

        <div className="table-responsive">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="ref-col">Ref</th>
                <th>Guest</th>
                <th>Hotel</th>
                <th>Room Type</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReservations.map(res => (
                <tr key={res.id}>
                  <td className="ref-col">
                    <span className="ref-badge">
                      {res.bookingRef}
                    </span>
                  </td>
                  <td>
                    <strong>{res.guestName}</strong>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{res.guestEmail}</div>
                  </td>
                  <td>{res.hotelName}</td>
                  <td>{res.roomName}</td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>
                    {res.checkIn} → {res.checkOut} ({res.nights}n)
                  </td>
                  <td>
                    <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(res.totalAmount)}</strong>
                  </td>
                  <td>
                    <StatusBadge status={res.status} />
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
