import { Navigate } from 'react-router-dom';

function RequireSales({ children }) {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('cutes-user') : null;
  const user = stored ? JSON.parse(stored) : null;

  if (!user || (user.role !== 'SALES_MANAGEMENT' && user.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireSales;
