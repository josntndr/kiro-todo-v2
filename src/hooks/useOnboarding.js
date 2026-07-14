import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateOnboardingStep, provisionWorkspace } from '../services/onboardingService';

const TOTAL_STEPS = 6;
const MIN_PROCESSING_TIME = 1800;

const STATUS_MESSAGES = [
  'Creating your workspace...',
  'Preparing your task preferences...',
  'Configuring your dashboard...',
  'Applying your selected features...',
  'Almost ready...',
];

function getDefaultWorkspaceName(user) {
  if (user?.displayName) {
    const firstName = user.displayName.split(' ')[0];
    return `${firstName}'s Workspace`;
  }
  if (user?.email) {
    const name = user.email.split('@')[0];
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return `${capitalized}'s Workspace`;
  }
  return 'My Workspace';
}

export function useOnboarding() {
  const { currentUser, userProfile, refreshProfile } = useAuth();

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [useCase, setUseCase] = useState(null);
  const [managementArea, setManagementArea] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingSuccess, setProcessingSuccess] = useState(false);
  const [processingError, setProcessingError] = useState(false);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const statusIntervalRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    };
  }, []);

  // Initialize from existing profile
  useEffect(() => {
    if (userProfile) {
      setCurrentStep(userProfile.onboardingStep || 0);
      setUseCase(userProfile.useCase || null);
      setManagementArea(userProfile.managementArea || null);
      setSelectedFeatures(userProfile.selectedFeatures || []);
      setWorkspaceName(
        userProfile.workspaceName || getDefaultWorkspaceName(currentUser)
      );
      setInvitedEmails(userProfile.invitedEmails || []);
    } else if (currentUser) {
      setWorkspaceName(getDefaultWorkspaceName(currentUser));
    }
  }, [userProfile, currentUser]);

  // Save current step data to Firestore
  const saveStepData = useCallback(
    async (step, data = {}) => {
      if (!currentUser) return;
      setSaving(true);
      setSaveError('');
      try {
        await updateOnboardingStep(currentUser.uid, {
          onboardingStep: step,
          ...data,
        });
      } catch (error) {
        // Don't block the user — just log it. Data is preserved locally.
        console.warn('Could not save onboarding progress:', error);
      } finally {
        if (mountedRef.current) {
          setSaving(false);
        }
      }
    },
    [currentUser]
  );

  // Navigate steps
  const goNext = useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep > TOTAL_STEPS) return;

    const stepData = {};
    switch (currentStep) {
      case 0:
        stepData.useCase = useCase;
        break;
      case 1:
        stepData.managementArea = managementArea;
        break;
      case 2:
        stepData.selectedFeatures = selectedFeatures;
        break;
      case 3:
        stepData.workspaceName = workspaceName.trim();
        break;
      case 4:
        stepData.invitedEmails = invitedEmails;
        break;
      default:
        break;
    }

    setCurrentStep(nextStep);
    // Save in background — don't block navigation
    saveStepData(nextStep, stepData);
  }, [currentStep, useCase, managementArea, selectedFeatures, workspaceName, invitedEmails, saveStepData]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  // Check if current step can proceed
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 0:
        return !!useCase;
      case 1:
        return !!managementArea;
      case 2:
        return selectedFeatures.length > 0;
      case 3:
        return workspaceName.trim().length >= 2 && workspaceName.trim().length <= 50;
      case 4:
        return true; // Optional step
      case 5:
        return true; // Review step
      default:
        return false;
    }
  }, [currentStep, useCase, managementArea, selectedFeatures, workspaceName]);

  // Provision workspace
  const createWorkspace = useCallback(async () => {
    if (!currentUser || processing) return;

    setProcessing(true);
    setProcessingError(false);
    setProcessingSuccess(false);
    setProcessingStatus(STATUS_MESSAGES[0]);

    // Rotate status messages
    let msgIndex = 0;
    statusIntervalRef.current = setInterval(() => {
      msgIndex = (msgIndex + 1) % STATUS_MESSAGES.length;
      if (mountedRef.current) {
        setProcessingStatus(STATUS_MESSAGES[msgIndex]);
      }
    }, 1500);

    const startTime = Date.now();

    try {
      await provisionWorkspace(currentUser.uid, {
        workspaceName: workspaceName.trim(),
        useCase,
        managementArea,
        selectedFeatures,
        invitedEmails,
      });

      // Ensure minimum display time
      const elapsed = Date.now() - startTime;
      const remaining = MIN_PROCESSING_TIME - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }

      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }

      if (mountedRef.current) {
        setProcessingSuccess(true);
        setProcessing(false);
        setProcessingStatus('');
        // Refresh the profile in context
        if (refreshProfile) {
          try {
            await refreshProfile();
          } catch (e) {
            // Non-critical — profile will refresh on next page load
          }
        }
      }
    } catch (error) {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
      if (mountedRef.current) {
        setProcessingError(true);
        setProcessing(false);
        setProcessingStatus('');
      }
    }
  }, [currentUser, processing, workspaceName, useCase, managementArea, selectedFeatures, invitedEmails, refreshProfile]);

  const retryProvisioning = useCallback(() => {
    setProcessingError(false);
    createWorkspace();
  }, [createWorkspace]);

  const returnToReview = useCallback(() => {
    setProcessing(false);
    setProcessingError(false);
    setCurrentStep(5);
  }, []);

  return {
    // State
    currentStep,
    totalSteps: TOTAL_STEPS,
    useCase,
    managementArea,
    selectedFeatures,
    workspaceName,
    invitedEmails,

    // Setters
    setUseCase,
    setManagementArea,
    setSelectedFeatures,
    setWorkspaceName,
    setInvitedEmails,

    // Navigation
    goNext,
    goBack,
    goToStep,
    canProceed,

    // Processing
    processing,
    processingStatus,
    processingSuccess,
    processingError,
    createWorkspace,
    retryProvisioning,
    returnToReview,

    // Save
    saving,
    saveError,
  };
}
