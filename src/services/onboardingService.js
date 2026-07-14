import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  writeBatch,
  collection,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Onboarding service — manages user profile and workspace provisioning.
 * Profile stored at: users/{uid}
 * Workspace stored at: users/{uid}/workspaces/{workspaceId}
 */

// --- User Profile ---

export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function createUserProfile(uid, userData) {
  try {
    const docRef = doc(db, 'users', uid);
    const profile = {
      uid,
      email: userData.email || '',
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || null,
      onboardingCompleted: false,
      onboardingStep: 0,
      onboardingStartedAt: serverTimestamp(),
      onboardingCompletedAt: null,
      useCase: null,
      managementArea: null,
      selectedFeatures: [],
      workspaceName: '',
      invitedEmails: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    // Use merge to avoid overwriting if another tab created the doc concurrently
    await setDoc(docRef, profile, { merge: true });
    // Read back to get resolved timestamps
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : profile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function updateOnboardingStep(uid, stepData) {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(
      docRef,
      {
        ...stepData,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating onboarding step:', error);
    throw error;
  }
}

// --- Workspace Provisioning ---

const DEFAULT_WORKSPACE_ID_PREFIX = 'ws_';

function generateWorkspaceId(uid) {
  return `${DEFAULT_WORKSPACE_ID_PREFIX}${uid}`;
}

export async function provisionWorkspace(uid, onboardingData) {
  const workspaceId = generateWorkspaceId(uid);
  const batch = writeBatch(db);

  // Check if workspace already exists (idempotent)
  const workspaceRef = doc(db, 'users', uid, 'workspaces', workspaceId);
  const existingWorkspace = await getDoc(workspaceRef);
  if (existingWorkspace.exists()) {
    // Already provisioned — just mark onboarding complete
    const profileRef = doc(db, 'users', uid);
    batch.set(
      profileRef,
      {
        onboardingCompleted: true,
        onboardingCompletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    await batch.commit();
    return { workspaceId, alreadyExisted: true };
  }

  // Create workspace document
  batch.set(workspaceRef, {
    ownerId: uid,
    name: onboardingData.workspaceName,
    useCase: onboardingData.useCase,
    managementArea: onboardingData.managementArea,
    enabledFeatures: onboardingData.selectedFeatures,
    members: [uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Create sample tasks in existing tasks document
  const sampleTasks = createSampleTasks(onboardingData);
  const tasksRef = doc(db, 'users', uid, 'data', 'tasks');
  const existingTasks = await getDoc(tasksRef);
  const currentItems = existingTasks.exists() ? existingTasks.data().items || [] : [];

  // Only add sample tasks if user has no tasks yet
  if (currentItems.length === 0) {
    batch.set(tasksRef, {
      items: sampleTasks,
      updatedAt: new Date().toISOString(),
    });
  }

  // Mark onboarding as completed in profile
  const profileRef = doc(db, 'users', uid);
  batch.set(
    profileRef,
    {
      onboardingCompleted: true,
      onboardingCompletedAt: serverTimestamp(),
      onboardingStep: 6,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await batch.commit();
  return { workspaceId, alreadyExisted: false };
}

function createSampleTasks(onboardingData) {
  const now = new Date().toISOString();
  const baseTasks = [
    {
      id: 'sample_welcome_1',
      title: 'Explore your TaskFlow dashboard',
      description: 'Visit the Dashboard page to see your productivity overview.',
      priority: 'medium',
      category: 'Getting Started',
      status: 'todo',
      completed: false,
      createdAt: now,
      order: 0,
      subtasks: [],
      recurrence: 'none',
      tags: ['onboarding'],
      archived: false,
      dueDate: '',
    },
    {
      id: 'sample_welcome_2',
      title: 'Create your first task',
      description: 'Use the task form to add something you need to get done.',
      priority: 'high',
      category: 'Getting Started',
      status: 'todo',
      completed: false,
      createdAt: now,
      order: 1,
      subtasks: [],
      recurrence: 'none',
      tags: ['onboarding'],
      archived: false,
      dueDate: '',
    },
    {
      id: 'sample_welcome_3',
      title: 'Choose a due date',
      description: 'Add a due date to a task to keep yourself on track.',
      priority: 'low',
      category: 'Getting Started',
      status: 'todo',
      completed: false,
      createdAt: now,
      order: 2,
      subtasks: [],
      recurrence: 'none',
      tags: ['onboarding'],
      archived: false,
      dueDate: '',
    },
    {
      id: 'sample_welcome_4',
      title: 'Try a board or calendar view',
      description: 'Switch to Kanban board view to organize tasks visually.',
      priority: 'low',
      category: 'Getting Started',
      status: 'todo',
      completed: false,
      createdAt: now,
      order: 3,
      subtasks: [],
      recurrence: 'none',
      tags: ['onboarding'],
      archived: false,
      dueDate: '',
    },
  ];

  return baseTasks;
}
