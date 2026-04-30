import { Navigate } from 'react-router-dom';

function RequireAdmin({ children }) {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('cutes-user') : null;
  const user = stored ? JSON.parse(stored) : null;

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAdmin;
