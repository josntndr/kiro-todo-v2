import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  // Authenticated users shouldn't see login/register pages
  if (currentUser) {
    return <Navigate to="/tasks" replace />;
  }

  return children;
}

export default PublicRoute;
