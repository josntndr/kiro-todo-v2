import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser, loading, profileLoading, onboardingCompleted, profileError } = useAuth();

  // Wait for auth to finish loading
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Wait for profile (with a timeout guard — profileError prevents infinite spinner)
  if (profileLoading && !profileError) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  // If profile errored, still enforce onboarding check based on what we know
  // If we can't determine onboarding status, redirect to onboarding (safer)
  if (!onboardingCompleted && !profileError) {
    return <Navigate to="/onboarding" replace />;
  }

  // If profile errored but user is authenticated, let them through
  // (better than blocking entirely — onboarding can't work without Firestore anyway)
  return children;
}

export default PrivateRoute;
