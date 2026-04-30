import { Navigate } from 'react-router-dom';

function RequirePackage({ children }) {
  const stored = localStorage.getItem('cutes-user');
  const user = stored ? JSON.parse(stored) : null;

  if (!user || (user.role !== 'PACKAGE' && user.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequirePackage;
