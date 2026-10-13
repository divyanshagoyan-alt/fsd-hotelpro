import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
  TrendingUp,
  BedDouble,
  Calendar,
  Users,
  Shield,
  Key,
  Sparkles,
  Building,
  Home,
  CheckCircle2
} from 'lucide-react';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Common Components & Guards
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute, RoleGuard } from './components/common/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import HotelsPage from './pages/public/HotelsPage';
import HotelDetailPage from './pages/public/HotelDetailPage';
import CheckoutPage from './pages/public/CheckoutPage';
import BookingConfirmationPage from './pages/public/BookingConfirmationPage';
import StyleGuidePage from './pages/public/StyleGuidePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Guest Pages
import MyBookingsPage from './pages/guest/MyBookingsPage';
import ProfilePage from './pages/guest/ProfilePage';

// Staff Pages
import FrontDeskPage from './pages/staff/FrontDeskPage';
import HousekeepingPage from './pages/staff/HousekeepingPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import RoomManagementPage from './pages/admin/RoomManagementPage';
import BookingManagementPage from './pages/admin/BookingManagementPage';
import StaffManagementPage from './pages/admin/StaffManagementPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

// Common Fallback Pages
import NotFoundPage from './pages/common/NotFoundPage';
import UnauthorizedPage from './pages/common/UnauthorizedPage';

// Staff Navigation Configuration
const staffNavItems = [
  {
    label: 'Front Office',
    items: [
      { to: '/staff/front-desk', label: 'Front Desk Console', icon: <Key size={18} /> },
      { to: '/staff/housekeeping', label: 'Housekeeping Grid', icon: <Sparkles size={18} /> },
    ],
  },
  {
    label: 'Guest Experience',
    items: [
      { to: '/hotels', label: 'Browse Properties', icon: <Building size={18} /> },
      { to: '/', label: 'Public Portal', icon: <Home size={18} /> },
    ],
  },
];

// Admin & Manager Navigation Configuration
const adminNavItems = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Executive Metrics', icon: <TrendingUp size={18} />, end: true },
    ],
  },
  {
    label: 'Operations & Inventory',
    items: [
      { to: '/admin/rooms', label: 'Room Management', icon: <BedDouble size={18} /> },
      { to: '/admin/bookings', label: 'All Reservations', icon: <Calendar size={18} /> },
      { to: '/staff/front-desk', label: 'Front Desk Live', icon: <Key size={18} /> },
      { to: '/staff/housekeeping', label: 'Housekeeping Tasks', icon: <Sparkles size={18} /> },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/admin/staff', label: 'Staff & Shifts', icon: <Users size={18} /> },
      { to: '/admin/audit-logs', label: 'Security & Audit Logs', icon: <Shield size={18} /> },
    ],
  },
  {
    label: 'System & Views',
    items: [
      { to: '/style-guide', label: 'Style Guide & Tokens', icon: <CheckCircle2 size={18} /> },
      { to: '/', label: 'Guest Homepage', icon: <Home size={18} /> },
    ],
  },
];

function StaffShell() {
  return (
    <DashboardLayout
      navItems={staffNavItems}
      roleLabel="Staff Desk"
      roleColor="var(--color-info)"
    />
  );
}

function AdminShell() {
  return (
    <DashboardLayout
      navItems={adminNavItems}
      roleLabel="Management"
      roleColor="var(--color-primary)"
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <ErrorBoundary>
            <Routes>
              {/* ── PUBLIC & GUEST ROUTES (with Navbar and Footer) ── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelsPage />} />
                <Route path="/search" element={<HotelsPage />} />
                <Route path="/hotels/:id" element={<HotelDetailPage />} />
                <Route path="/checkout/:roomId" element={<CheckoutPage />} />
                <Route path="/booking/confirmation/:bookingRef" element={<BookingConfirmationPage />} />
                <Route path="/style-guide" element={<StyleGuidePage />} />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Guest Account Portal */}
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Unauthorized and 404 under Public Layout */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* ── STAFF OPERATIONAL ROUTES ─────────────────────── */}
              <Route
                path="/staff"
                element={
                  <RoleGuard roles={['staff', 'manager', 'admin']}>
                    <StaffShell />
                  </RoleGuard>
                }
              >
                <Route index element={<Navigate to="/staff/front-desk" replace />} />
                <Route path="front-desk" element={<FrontDeskPage />} />
                <Route path="housekeeping" element={<HousekeepingPage />} />
              </Route>

              {/* ── ADMIN & MANAGEMENT ROUTES ────────────────────── */}
              <Route
                path="/admin"
                element={
                  <RoleGuard roles={['manager', 'admin']}>
                    <AdminShell />
                  </RoleGuard>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="rooms" element={<RoomManagementPage />} />
                <Route path="bookings" element={<BookingManagementPage />} />
                <Route path="staff" element={<StaffManagementPage />} />
                <Route path="audit-logs" element={<AuditLogsPage />} />
              </Route>

              {/* Manager alias redirecting to /admin */}
              <Route path="/manager" element={<Navigate to="/admin" replace />} />
            </Routes>
          </ErrorBoundary>

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
