import { useState } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Building,
  DollarSign,
  BedDouble,
  BarChart3,
  Percent,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { mockOccupancyData, mockHotels, mockDashboardMetrics } from '../../data/mock/mockData';
import { Button } from '../../components/common/UI';

export default function AnalyticsReportsPage() {
  const [reportPeriod, setReportPeriod] = useState('6m');

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const propertyPerformance = [
    { name: 'The Grand Meridian', city: 'Mumbai', rooms: 240, occupancy: 86, revenue: 14200000, adr: 9800, revpar: 8428 },
    { name: 'Serene Haveli', city: 'Jaipur', rooms: 68, occupancy: 78, revenue: 4120000, adr: 5900, revpar: 4602 },
    { name: 'Coastline Retreat', city: 'Goa', rooms: 180, occupancy: 91, revenue: 9800000, adr: 7400, revpar: 6734 },
    { name: 'The Urban Edge', city: 'Bengaluru', rooms: 120, occupancy: 74, revenue: 5200000, adr: 5100, revpar: 3774 },
    { name: 'Mountain Escape Lodge', city: 'Shimla', rooms: 45, occupancy: 82, revenue: 2650000, adr: 4400, revpar: 3608 },
    { name: 'Palace on the Lake', city: 'Udaipur', rooms: 83, occupancy: 94, revenue: 18900000, adr: 29500, revpar: 27730 },
  ];

  const monthlyFinancials = [
    { month: 'May', roomRevenue: 1820000, fnbRevenue: 420000, spaRevenue: 160000 },
    { month: 'Jun', roomRevenue: 1650000, fnbRevenue: 340000, spaRevenue: 110000 },
    { month: 'Jul', roomRevenue: 2240000, fnbRevenue: 480000, spaRevenue: 180000 },
    { month: 'Aug', roomRevenue: 2510000, fnbRevenue: 510000, spaRevenue: 180000 },
    { month: 'Sep', roomRevenue: 2180000, fnbRevenue: 410000, spaRevenue: 160000 },
    { month: 'Oct', roomRevenue: 2450000, fnbRevenue: 470000, spaRevenue: 180000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)' }}>
            Financial & Analytics Reports
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
            Comprehensive revenue analytics, RevPAR trends, departmental breakdowns, and property benchmarking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="outline" onClick={() => window.print()} icon={<Download size={15} />}>
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Gross Revenue (H2)</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', marginTop: 4 }}>
            ₹54.87M
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <ArrowUpRight size={13} /> +12.4% vs H1
          </span>
        </div>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Portfolio RevPAR</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-secondary)', marginTop: 4 }}>
            {formatCurrency(mockDashboardMetrics.revPAR)}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <ArrowUpRight size={13} /> +6.1% MoM
          </span>
        </div>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Portfolio ADR</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-primary)', marginTop: 4 }}>
            {formatCurrency(mockDashboardMetrics.avgDailyRate)}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Target: ₹9,000</span>
        </div>
        <div className="card" style={{ padding: 'var(--space-5)' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Avg Occupancy</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', color: 'var(--color-info)', marginTop: 4 }}>
            84.2%
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <ArrowUpRight size={13} /> +3.8% above plan
          </span>
        </div>
      </div>

      {/* Revenue Trajectory Chart */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>Monthly Revenue by Department</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Stacked comparison of Room stays, Food & Beverage, and Spa & Wellness</p>
          </div>
        </div>

        <div style={{ height: 320, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-text-secondary)" fontSize={12} />
              <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)'
                }}
              />
              <Legend />
              <Bar dataKey="roomRevenue" name="Room Stays" fill="#234B3B" stackId="a" />
              <Bar dataKey="fnbRevenue" name="Dining & Bars" fill="#B88B5A" stackId="a" />
              <Bar dataKey="spaRevenue" name="Spa & Wellness" fill="#287A50" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Performance Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>Property Benchmark Breakdown</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Financial yield, capacity utilization, and RevPAR rankings across properties</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th className="ref-col">Property</th>
                <th>Location</th>
                <th>Inventory</th>
                <th>Occupancy</th>
                <th>ADR</th>
                <th>RevPAR</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {propertyPerformance.map(p => (
                <tr key={p.name}>
                  <td className="ref-col">
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.city}</td>
                  <td>{p.rooms} keys</td>
                  <td>
                    <span className="badge badge-success">{p.occupancy}%</span>
                  </td>
                  <td>
                    <strong>{formatCurrency(p.adr)}</strong>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(p.revpar)}</strong>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(p.revenue)}</strong>
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
