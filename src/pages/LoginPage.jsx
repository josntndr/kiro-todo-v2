import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  CircleAlert,
  CheckCircle,
  ListChecks,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  function getErrorMessage(code) {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/user-disabled':
        return 'Your account has been temporarily disabled.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection.';
      case 'auth/popup-closed-by-user':
        return '';
      default:
        return 'Unable to sign in. Please try again.';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }

    if (resetMode) {
      setLoading(true);
      try {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
        setResetMode(false);
      } catch (err) {
        const msg = getErrorMessage(err.code);
        setError(msg || 'Failed to send reset email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setError('Enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate('/tasks');
    } catch (err) {
      const msg = getErrorMessage(err.code);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/tasks');
    } catch (err) {
      const msg = getErrorMessage(err.code);
      if (msg) setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  }

  const isProcessing = loading || googleLoading;

  return (
    <div className="login-page">
      {/* Background decorative elements */}
      <div className="login-bg-glow" aria-hidden="true" />
      <div className="login-bg-circle login-bg-circle--1" aria-hidden="true" />
      <div className="login-bg-circle login-bg-circle--2" aria-hidden="true" />

      {/* Login card */}
      <div className="login-card">
        {/* Back to home */}
        <Link to="/" className="login-back-home">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>

        {/* Branding */}
        <div className="login-brand">
          <div className="login-brand-logo">
            <ListChecks size={27} aria-hidden="true" />
          </div>
          <span className="login-brand-name">
            <span className="login-brand-task">Task</span>
            <span className="login-brand-flow">Flow</span>
          </span>
        </div>

        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">
            {resetMode ? 'Reset Password' : 'Welcome back'}
          </h1>
          <p className="login-subtitle">
            {resetMode
              ? 'Enter your email to receive a password reset link.'
              : 'Sign in to manage your tasks and stay productive.'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="login-alert login-alert--error" role="alert">
            <CircleAlert size={16} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="login-alert login-alert--success" role="alert">
            <CheckCircle size={16} aria-hidden="true" />
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Email field */}
          <div className="login-field">
            <label htmlFor="login-email" className="login-label">
              Email address
            </label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-input-icon" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                autoComplete="email"
                disabled={isProcessing}
                aria-invalid={error && !email.trim() ? 'true' : undefined}
                aria-describedby={error && !email.trim() ? 'login-error' : undefined}
              />
            </div>
          </div>

          {/* Password field */}
          {!resetMode && (
            <div className="login-field">
              <label htmlFor="login-password" className="login-label">
                Password
              </label>
              <div className="login-input-wrapper">
                <LockKeyhole size={18} className="login-input-icon" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input login-input--password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  disabled={isProcessing}
                  aria-invalid={error && !password ? 'true' : undefined}
                  aria-describedby={error && !password ? 'login-error' : undefined}
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isProcessing}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Remember me and Forgot password */}
          {!resetMode && (
            <div className="login-options-row">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isProcessing}
                />
                <span className="login-remember-text">Remember me</span>
              </label>
              <button
                type="button"
                className="login-forgot-btn"
                onClick={() => {
                  setResetMode(true);
                  setError('');
                  setMessage('');
                }}
                disabled={isProcessing}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isProcessing}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="login-spinner" aria-hidden="true" />
                <span>{resetMode ? 'Sending...' : 'Signing in...'}</span>
              </>
            ) : (
              <span>{resetMode ? 'Send Reset Link' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Reset mode: back link */}
        {resetMode ? (
          <div className="login-footer">
            <button
              type="button"
              className="login-back-btn"
              onClick={() => {
                setResetMode(false);
                setError('');
                setMessage('');
              }}
              disabled={isProcessing}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Divider */}
            <div className="login-divider">
              <span className="login-divider-text">or continue with</span>
            </div>

            {/* Google button */}
            <button
              type="button"
              className="login-google-btn"
              onClick={handleGoogleSignIn}
              disabled={isProcessing}
            >
              {googleLoading ? (
                <Loader2 size={18} className="login-spinner" aria-hidden="true" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="login-google-icon"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Sign up link */}
            <div className="login-signup">
              <span className="login-signup-text">New to TaskFlow? </span>
              <Link to="/register" className="login-signup-link">
                Create an account
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
