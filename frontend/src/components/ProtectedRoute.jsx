import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService.js';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const isAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;