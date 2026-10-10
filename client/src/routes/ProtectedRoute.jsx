import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { user, loading, needsSetup } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="p-10 text-muted">Checking session…</p>;
  }
  if (needsSetup) {
    return <Navigate to="/login" replace />;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
