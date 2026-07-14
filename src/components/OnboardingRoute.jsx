import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function OnboardingRoute({ children }) {
  const { currentUser, loading, profileLoading, onboardingCompleted, profileError } = useAuth();

  // Wait for auth to finish loading
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  // Don't wait forever for profile — give it a pass-through if there's an error
  if (profileLoading && !profileError) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If onboarding already completed, go to tasks
  if (onboardingCompleted) {
    return <Navigate to="/tasks" replace />;
  }

  return children;
}

export default OnboardingRoute;
