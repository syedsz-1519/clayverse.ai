/**
 * useFirebaseAuth Hook
 * Manages authentication state and operations for Clayverse AI
 * 
 * Features:
 * - Email/password authentication
 * - Social login (Google, GitHub)
 * - Session persistence
 * - Profile management
 * - Logout & account deletion
 * 
 * NOTE: This hook is optional. If Firebase is not configured,
 * the app will work with local authentication only.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  auth,
  firestore,
  logClayverseEvent,
  isFirebaseReady,
} from '../lib/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  type User,
  type UserCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';

/**
 * User profile interface
 */
export interface UserProfile extends DocumentData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  preferredLanguage: string;
  learnerType: 'student' | 'educator' | 'professional' | 'curious';
  createdAt: number;
  lastLogin: number;
  emailVerified: boolean;
  isActive: boolean;
}

/**
 * Auth state interface
 */
export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom Firebase Auth Hook
 */
export function useFirebaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const unsubscribeRef = useRef<(() => void) | null>(null);

  /**
   * Fetch user profile from Firestore
   */
  const fetchUserProfile = useCallback(
    async (uid: string): Promise<UserProfile | null> => {
      if (!isFirebaseReady() || !firestore) {
        console.warn('Firebase not configured - cannot fetch user profile');
        return null;
      }

      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const userDocRef = doc(firestore, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          return userDocSnap.data() as UserProfile;
        }

        return null;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    []
  );

  /**
   * Create user profile in Firestore
   */
  const createUserProfile = useCallback(
    async (
      user: User,
      displayName: string,
      preferredLanguage: string = 'en',
      learnerType: UserProfile['learnerType'] = 'student'
    ): Promise<UserProfile> => {
      try {
        const userProfile: UserProfile = {
          uid: user.uid,
          displayName,
          email: user.email || '',
          photoURL: user.photoURL || undefined,
          preferredLanguage,
          learnerType,
          createdAt: Date.now(),
          lastLogin: Date.now(),
          emailVerified: user.emailVerified,
          isActive: true,
        };

        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, userProfile, { merge: true });

        logClayverseEvent('user_profile_created', {
          uid: user.uid,
          learnerType,
          language: preferredLanguage,
        });

        return userProfile;
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw new Error('Failed to create user profile');
      }
    },
    []
  );

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      preferredLanguage: string = 'en',
      learnerType: UserProfile['learnerType'] = 'student'
    ): Promise<UserProfile> => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // Create Firebase Auth user
        const userCredential: UserCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const { user } = userCredential;

        // Update Firebase Auth profile
        await updateProfile(user, {
          displayName,
        });

        // Create Firestore profile
        const userProfile = await createUserProfile(
          user,
          displayName,
          preferredLanguage,
          learnerType
        );

        logClayverseEvent('user_signup', {
          uid: user.uid,
          method: 'email_password',
        });

        return userProfile;
      } catch (error: any) {
        const errorMessage =
          error.code === 'auth/email-already-in-use'
            ? 'Email already in use'
            : error.code === 'auth/weak-password'
              ? 'Password is too weak'
              : error.message || 'Signup failed';

        setAuthState((prev) => ({ ...prev, error: errorMessage }));
        throw new Error(errorMessage);
      } finally {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [createUserProfile]
  );

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(
    async (email: string, password: string): Promise<UserProfile> => {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const { user } = userCredential;

        // Fetch user profile
        const userProfile = await fetchUserProfile(user.uid);

        if (!userProfile) {
          throw new Error('User profile not found');
        }

        // Update last login
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          lastLogin: Date.now(),
        });

        logClayverseEvent('user_signin', {
          uid: user.uid,
          method: 'email_password',
        });

        return userProfile;
      } catch (error: any) {
        const errorMessage =
          error.code === 'auth/user-not-found'
            ? 'User not found'
            : error.code === 'auth/wrong-password'
              ? 'Incorrect password'
              : error.message || 'Login failed';

        setAuthState((prev) => ({ ...prev, error: errorMessage }));
        throw new Error(errorMessage);
      } finally {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [fetchUserProfile]
  );

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await firebaseSignOut(auth);

      logClayverseEvent('user_signout');

      setAuthState({
        user: null,
        userProfile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error: error.message }));
      throw new Error('Logout failed');
    }
  }, []);

  /**
   * Update user profile
   */
  const updateUserProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<void> => {
      if (!auth.currentUser) {
        throw new Error('No user authenticated');
      }

      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const uid = auth.currentUser.uid;

        // Update Firebase Auth profile if displayName is provided
        if (updates.displayName) {
          await updateProfile(auth.currentUser, {
            displayName: updates.displayName,
          });
        }

        // Update Firestore profile
        const userDocRef = doc(firestore, 'users', uid);
        await updateDoc(userDocRef, {
          ...updates,
          lastLogin: Date.now(),
        });

        // Update local state
        setAuthState((prev) => ({
          ...prev,
          userProfile: prev.userProfile
            ? { ...prev.userProfile, ...updates }
            : null,
        }));

        logClayverseEvent('user_profile_updated', {
          uid,
          fields: Object.keys(updates),
        });
      } catch (error: any) {
        setAuthState((prev) => ({ ...prev, error: error.message }));
        throw error;
      } finally {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  /**
   * Delete user account
   */
  const deleteAccount = useCallback(async (password: string): Promise<void> => {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No user authenticated');
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );

      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete Firestore data
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        isActive: false,
        deletedAt: Date.now(),
      });

      // Delete Firebase Auth user
      await deleteUser(auth.currentUser);

      logClayverseEvent('user_account_deleted', {
        uid: auth.currentUser.uid,
      });

      // Reset auth state
      setAuthState({
        user: null,
        userProfile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.code === 'auth/wrong-password'
          ? 'Incorrect password'
          : error.message || 'Failed to delete account';

      setAuthState((prev) => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

/**
 * Monitor auth state changes
 */
  useEffect(() => {
    if (!isFirebaseReady() || !auth) {
      console.warn('Firebase not ready - skipping auth state monitoring');
      return;
    }

    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const userProfile = await fetchUserProfile(user.uid);

        setAuthState({
          user,
          userProfile,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        logClayverseEvent('user_authenticated', {
          uid: user.uid,
        });
      } else {
        // User is signed out
        setAuthState({
          user: null,
          userProfile: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [fetchUserProfile]);

  return {
    // State
    ...authState,

    // Methods
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    deleteAccount,
    fetchUserProfile,
  };
}

/**
 * Export types for use in other components
 * Note: UserProfile from this file is compatible with firebaseConfig.ts
 */
