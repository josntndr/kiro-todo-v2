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

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Wait for profile to load before deciding — prevents flashing onboarding to existing users
  if (profileLoading && !profileError) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" />
      </div>
    );
  }

  // If user already has a record in the database (onboardingCompleted is derived from
  // profile existence), redirect to the main app immediately
  if (onboardingCompleted) {
    return <Navigate to="/tasks" replace />;
  }

  // If profile errored, redirect to tasks rather than showing broken onboarding
  if (profileError) {
    return <Navigate to="/tasks" replace />;
  }

  // Brand-new user with no existing record — show onboarding
  return children;
}

export default OnboardingRoute;
