import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Protects routes requiring authentication
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Restricts route to specific roles
export function RoleGuard({ children, roles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || (roles.length > 0 && !roles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
