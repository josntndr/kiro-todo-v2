import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListChecks,
  BriefcaseBusiness,
  UserRound,
  GraduationCap,
  Columns3,
  CalendarDays,
  Bell,
  Timer,
  Target,
  LayoutDashboard,
  UsersRound,
  Paperclip,
  Repeat2,
  Flag,
  Mail,
  X,
  CircleAlert,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Pencil,
} from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';
import { useAuth } from '../contexts/AuthContext';
import './OnboardingPage.css';

// --- Option Card Component ---
function OptionCard({ icon: Icon, label, selected, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`ob-option-card ${selected ? 'ob-option-card--selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {Icon && <Icon size={22} className="ob-option-card-icon" aria-hidden="true" />}
      <span className="ob-option-card-label">{label}</span>
      {selected && (
        <span className="ob-option-card-check" aria-hidden="true">
          <Check size={14} />
        </span>
      )}
    </button>
  );
}

// --- Feature Card Component ---
function FeatureCard({ icon: Icon, label, selected, onClick }) {
  return (
    <button
      type="button"
      className={`ob-feature-card ${selected ? 'ob-feature-card--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="ob-feature-card-icon">
        {Icon && <Icon size={20} aria-hidden="true" />}
      </span>
      <span className="ob-feature-card-label">{label}</span>
      {selected && (
        <span className="ob-feature-card-check" aria-hidden="true">
          <Check size={12} />
        </span>
      )}
    </button>
  );
}

// --- Email Invite Input ---
function EmailInviteInput({ emails, onChange, currentUserEmail }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function addEmails(raw) {
    const parts = raw.split(/[,;\s]+/).filter(Boolean);
    const newEmails = [...emails];
    let lastError = '';

    for (const part of parts) {
      const trimmed = part.trim().toLowerCase();
      if (!trimmed) continue;
      if (!emailRegex.test(trimmed)) {
        lastError = `"${trimmed}" is not a valid email.`;
        continue;
      }
      if (trimmed === currentUserEmail?.toLowerCase()) {
        lastError = 'You cannot invite yourself.';
        continue;
      }
      if (newEmails.includes(trimmed)) {
        lastError = `"${trimmed}" is already added.`;
        continue;
      }
      if (newEmails.length >= 10) {
        lastError = 'Maximum 10 invitations during onboarding.';
        break;
      }
      newEmails.push(trimmed);
    }

    setError(lastError);
    onChange(newEmails);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addEmails(inputValue);
        setInputValue('');
      }
    }
    if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      onChange(emails.slice(0, -1));
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    addEmails(pasted);
    setInputValue('');
  }

  function handleBlur() {
    if (inputValue.trim()) {
      addEmails(inputValue);
      setInputValue('');
    }
  }

  function removeEmail(email) {
    onChange(emails.filter((e) => e !== email));
    setError('');
  }

  return (
    <div className="ob-email-input-container">
      <label htmlFor="ob-invite-email" className="ob-label">
        Email addresses
      </label>
      <div className="ob-email-chips-wrapper">
        {emails.map((email) => (
          <span key={email} className="ob-email-chip">
            <span className="ob-email-chip-text">{email}</span>
            <button
              type="button"
              className="ob-email-chip-remove"
              onClick={() => removeEmail(email)}
              aria-label={`Remove ${email}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id="ob-invite-email"
          type="email"
          className="ob-email-input"
          placeholder={emails.length === 0 ? 'Enter email addresses' : 'Add more...'}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          autoComplete="off"
          disabled={emails.length >= 10}
        />
      </div>
      {error && (
        <p className="ob-email-error" role="alert">
          <CircleAlert size={13} aria-hidden="true" />
          {error}
        </p>
      )}
      <p className="ob-email-hint">
        Press Enter or comma to add. You can paste multiple addresses.
      </p>
    </div>
  );
}

// --- Setup Loader ---
function SetupLoader({ status, success, error, onRetry, onReturn }) {
  if (success) {
    return (
      <div className="ob-loader-content">
        <div className="ob-loader-success">
          <div className="ob-success-circle">
            <Check size={40} className="ob-success-icon" />
          </div>
        </div>
        <h2 className="ob-loader-heading">Your workspace is ready</h2>
        <p className="ob-loader-text" role="status" aria-live="polite">
          Taking you to your TaskFlow dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ob-loader-content">
        <div className="ob-loader-error-icon">
          <CircleAlert size={40} />
        </div>
        <h2 className="ob-loader-heading">We couldn't finish setting up your workspace</h2>
        <p className="ob-loader-text">
          Your account is safe. Please try the setup again.
        </p>
        <div className="ob-loader-actions">
          <button type="button" className="ob-btn ob-btn--primary" onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            Try again
          </button>
          <button type="button" className="ob-btn ob-btn--secondary" onClick={onReturn}>
            <ArrowLeft size={16} aria-hidden="true" />
            Return to review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ob-loader-content">
      <div className="ob-loader-animation">
        <div className="ob-loader-ring" aria-hidden="true">
          <div className="ob-loader-ring-inner" />
        </div>
        <div className="ob-loader-logo">
          <ListChecks size={32} aria-hidden="true" />
        </div>
      </div>
      <h2 className="ob-loader-heading">Setting up your TaskFlow workspace</h2>
      <p className="ob-loader-text" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

// --- Progress Bar ---
function OnboardingProgress({ current, total }) {
  const percentage = ((current + 1) / total) * 100;
  return (
    <div className="ob-progress">
      <div
        className="ob-progress-bar"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${current + 1} of ${total}`}
      >
        <div className="ob-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <span className="ob-progress-label">{current + 1} of {total}</span>
    </div>
  );
}

// --- Main Onboarding Page ---
const USE_CASE_OPTIONS = [
  { value: 'work', label: 'Work', icon: BriefcaseBusiness },
  { value: 'personal', label: 'Personal', icon: UserRound },
  { value: 'school', label: 'School', icon: GraduationCap },
];

const MANAGEMENT_OPTIONS = [
  { value: 'personal-tasks', label: 'Personal Tasks' },
  { value: 'schoolwork', label: 'Schoolwork' },
  { value: 'software-development', label: 'Software Development' },
  { value: 'projects', label: 'Projects' },
  { value: 'team-operations', label: 'Team Operations' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'finance', label: 'Finance' },
  { value: 'events', label: 'Events' },
  { value: 'client-work', label: 'Client Work' },
  { value: 'recruitment', label: 'Recruitment' },
  { value: 'other', label: 'Other' },
];

const FEATURE_OPTIONS = [
  { value: 'tasks-projects', label: 'Tasks and Projects', icon: ListChecks },
  { value: 'boards', label: 'Boards', icon: Columns3 },
  { value: 'calendar', label: 'Calendar', icon: CalendarDays },
  { value: 'reminders', label: 'Reminders', icon: Bell },
  { value: 'time-tracking', label: 'Time Tracking', icon: Timer },
  { value: 'goals', label: 'Goals', icon: Target },
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'team-collaboration', label: 'Team Collaboration', icon: UsersRound },
  { value: 'file-attachments', label: 'File Attachments', icon: Paperclip },
  { value: 'recurring-tasks', label: 'Recurring Tasks', icon: Repeat2 },
  { value: 'task-priorities', label: 'Task Priorities', icon: Flag },
  { value: 'notifications', label: 'Notifications', icon: Bell },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    currentStep,
    totalSteps,
    useCase,
    managementArea,
    selectedFeatures,
    workspaceName,
    invitedEmails,
    setUseCase,
    setManagementArea,
    setSelectedFeatures,
    setWorkspaceName,
    setInvitedEmails,
    goNext,
    goBack,
    goToStep,
    canProceed,
    processing,
    processingStatus,
    processingSuccess,
    processingError,
    createWorkspace,
    retryProvisioning,
    returnToReview,
    saving,
    saveError,
  } = useOnboarding();

  const [workspaceError, setWorkspaceError] = useState('');

  // Redirect after success
  useEffect(() => {
    if (processingSuccess) {
      const timer = setTimeout(() => {
        navigate('/tasks', { replace: true });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [processingSuccess, navigate]);

  // Toggle feature selection
  function toggleFeature(value) {
    setSelectedFeatures((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  }

  // Workspace name validation
  function validateWorkspaceName(name) {
    const trimmed = name.trim();
    if (trimmed.length < 2) return 'Name must be at least 2 characters.';
    if (trimmed.length > 50) return 'Name must be 50 characters or fewer.';
    return '';
  }

  // Handle next with workspace validation
  function handleNext() {
    if (currentStep === 3) {
      const err = validateWorkspaceName(workspaceName);
      if (err) {
        setWorkspaceError(err);
        return;
      }
      setWorkspaceError('');
    }
    goNext();
  }

  // Handle create workspace (step 5 → processing)
  function handleCreateWorkspace() {
    createWorkspace();
  }

  // --- Processing Screen ---
  if (processing || processingSuccess || processingError) {
    return (
      <div className="ob-page">
        <div className="ob-bg-glow" aria-hidden="true" />
        <div className="ob-card ob-card--loader">
          <SetupLoader
            status={processingStatus}
            success={processingSuccess}
            error={processingError}
            onRetry={retryProvisioning}
            onReturn={returnToReview}
          />
        </div>
      </div>
    );
  }

  // --- Step Content ---
  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return (
          <div className="ob-step">
            <h2 className="ob-step-heading">What would you like to use TaskFlow for?</h2>
            <p className="ob-step-subtext">
              We'll personalize your workspace based on how you plan to use it.
            </p>
            <div className="ob-options-row">
              {USE_CASE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  selected={useCase === opt.value}
                  onClick={() => setUseCase(opt.value)}
                />
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="ob-step">
            <h2 className="ob-step-heading">What would you like to manage?</h2>
            <p className="ob-step-subtext">
              Choose the area that best describes what you'll be organizing.
            </p>
            <div className="ob-options-grid">
              {MANAGEMENT_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={managementArea === opt.value}
                  onClick={() => setManagementArea(opt.value)}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="ob-step">
            <h2 className="ob-step-heading">Which features would help you most?</h2>
            <p className="ob-step-subtext">
              Choose all that apply. You can change these later.
            </p>
            <div className="ob-features-grid">
              {FEATURE_OPTIONS.map((opt) => (
                <FeatureCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  selected={selectedFeatures.includes(opt.value)}
                  onClick={() => toggleFeature(opt.value)}
                />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="ob-step">
            <h2 className="ob-step-heading">What would you like to name your workspace?</h2>
            <p className="ob-step-subtext">
              You can use your name, project name, team name, or organization name.
            </p>
            <div className="ob-workspace-field">
              <label htmlFor="ob-workspace-name" className="ob-label">
                Workspace name
              </label>
              <input
                id="ob-workspace-name"
                type="text"
                className={`ob-input ${workspaceError ? 'ob-input--error' : ''}`}
                value={workspaceName}
                onChange={(e) => {
                  setWorkspaceName(e.target.value);
                  if (workspaceError) setWorkspaceError('');
                }}
                placeholder="My Workspace"
                maxLength={50}
                aria-invalid={!!workspaceError}
                aria-describedby={workspaceError ? 'ob-workspace-error' : undefined}
              />
              {workspaceError && (
                <p id="ob-workspace-error" className="ob-field-error" role="alert">
                  <CircleAlert size={13} aria-hidden="true" />
                  {workspaceError}
                </p>
              )}
              <p className="ob-field-hint">
                {workspaceName.trim().length}/50 characters
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="ob-step">
            <h2 className="ob-step-heading">Invite people to your workspace</h2>
            <p className="ob-step-subtext">
              You can collaborate with classmates, teammates, or project members.
            </p>
            <EmailInviteInput
              emails={invitedEmails}
              onChange={setInvitedEmails}
              currentUserEmail={currentUser?.email}
            />
          </div>
        );

      case 5:
        return (
          <div className="ob-step">
            <h2 className="ob-step-heading">Your TaskFlow workspace is ready to be created</h2>
            <p className="ob-step-subtext">
              Review your choices below, then create your workspace.
            </p>
            <div className="ob-review">
              <div className="ob-review-item">
                <span className="ob-review-label">Intended use</span>
                <span className="ob-review-value">
                  {USE_CASE_OPTIONS.find((o) => o.value === useCase)?.label || 'Not set'}
                </span>
                <button
                  type="button"
                  className="ob-review-edit"
                  onClick={() => goToStep(0)}
                  aria-label="Edit intended use"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <div className="ob-review-item">
                <span className="ob-review-label">Management area</span>
                <span className="ob-review-value">
                  {MANAGEMENT_OPTIONS.find((o) => o.value === managementArea)?.label || 'Not set'}
                </span>
                <button
                  type="button"
                  className="ob-review-edit"
                  onClick={() => goToStep(1)}
                  aria-label="Edit management area"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <div className="ob-review-item">
                <span className="ob-review-label">Features</span>
                <span className="ob-review-value">
                  {selectedFeatures.length} selected
                </span>
                <button
                  type="button"
                  className="ob-review-edit"
                  onClick={() => goToStep(2)}
                  aria-label="Edit features"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <div className="ob-review-item">
                <span className="ob-review-label">Workspace</span>
                <span className="ob-review-value">{workspaceName.trim()}</span>
                <button
                  type="button"
                  className="ob-review-edit"
                  onClick={() => goToStep(3)}
                  aria-label="Edit workspace name"
                >
                  <Pencil size={14} />
                </button>
              </div>
              <div className="ob-review-item">
                <span className="ob-review-label">Invitations</span>
                <span className="ob-review-value">
                  {invitedEmails.length === 0 ? 'None' : `${invitedEmails.length} people`}
                </span>
                <button
                  type="button"
                  className="ob-review-edit"
                  onClick={() => goToStep(4)}
                  aria-label="Edit invitations"
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="ob-page">
      <div className="ob-bg-glow" aria-hidden="true" />

      <div className="ob-card">
        {/* Brand */}
        <div className="ob-brand">
          <div className="ob-brand-logo">
            <ListChecks size={22} aria-hidden="true" />
          </div>
          <span className="ob-brand-name">
            <span className="ob-brand-task">Task</span>
            <span className="ob-brand-flow">Flow</span>
          </span>
        </div>

        {/* Step content */}
        <div className="ob-content">
          {renderStepContent()}
        </div>

        {/* Save error */}
        {saveError && (
          <div className="ob-save-error" role="alert">
            <CircleAlert size={14} aria-hidden="true" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Footer */}
        <div className="ob-footer">
          <OnboardingProgress current={currentStep} total={totalSteps} />

          <div className="ob-footer-actions">
            {currentStep > 0 && (
              <button
                type="button"
                className="ob-btn ob-btn--ghost"
                onClick={goBack}
              >
                <ChevronLeft size={16} aria-hidden="true" />
                Back
              </button>
            )}

            <div className="ob-footer-right">
              {currentStep === 4 && (
                <button
                  type="button"
                  className="ob-btn ob-btn--ghost"
                  onClick={goNext}
                >
                  Skip for now
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  className="ob-btn ob-btn--primary"
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Next
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  className="ob-btn ob-btn--primary"
                  onClick={handleCreateWorkspace}
                >
                  Create workspace
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
