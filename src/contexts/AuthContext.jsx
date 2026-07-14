import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from '../firebase';
import { getUserProfile, createUserProfile } from '../services/onboardingService';

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email, password, rememberMe = false) {
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle(rememberMe = true) {
    await setPersistence(auth, browserLocalPersistence);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      // If popup fails for any reason, try redirect
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/unauthorized-domain'
      ) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  const refreshProfile = useCallback(async () => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    try {
      const profile = await getUserProfile(currentUser.uid);
      setUserProfile(profile);
      setProfileError(false);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setProfileError(true);
    }
  }, [currentUser]);

  // Load or create user profile when auth state changes
  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      setProfileLoading(false);
      setProfileError(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setProfileLoading(true);
      setProfileError(false);
      try {
        let profile = await getUserProfile(currentUser.uid);
        if (!profile) {
          // First-time user — create profile
          profile = await createUserProfile(currentUser.uid, {
            email: currentUser.email,
            displayName: currentUser.displayName || '',
            photoURL: currentUser.photoURL || null,
          });
        }
        if (!cancelled) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        if (!cancelled) {
          // If Firestore fails, set a minimal profile so the app doesn't get stuck
          setUserProfile(null);
          setProfileError(true);
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, [currentUser]);

  useEffect(() => {
    // Handle redirect result (for when popup is blocked)
    getRedirectResult(auth).catch((error) => {
      if (error && error.code !== 'auth/popup-closed-by-user') {
        console.error('Redirect sign-in error:', error);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setUserProfile(null);
        setProfileLoading(false);
        setProfileError(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    profileLoading,
    profileError,
    onboardingCompleted: userProfile?.onboardingCompleted === true,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
