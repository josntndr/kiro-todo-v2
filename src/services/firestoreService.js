import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firestore data layer for TaskFlow.
 * Uses single-document approach per data type:
 *   users/{userId}/data/tasks  → { items: [...] }
 *   users/{userId}/data/activities → { items: [...] }
 */

const MAX_ACTIVITIES = 100;

// --- Tasks ---

export async function getTasks(userId) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'tasks');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    throw error;
  }
}

export async function saveTasks(userId, tasks) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'tasks');
    await setDoc(docRef, { items: tasks, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw error;
  }
}

// --- Activities ---

export async function getActivities(userId) {
  try {
    const docRef = doc(db, 'users', userId, 'data', 'activities');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    }
    return [];
  } catch (error) {
    console.error('Error loading activities:', error);
    throw error;
  }
}

export async function saveActivities(userId, activities) {
  try {
    const trimmed = activities.slice(0, MAX_ACTIVITIES);
    const docRef = doc(db, 'users', userId, 'data', 'activities');
    await setDoc(docRef, { items: trimmed, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving activities:', error);
    throw error;
  }
}
