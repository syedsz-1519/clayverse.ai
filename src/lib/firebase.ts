import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Firebase credentials from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyC_fi966iPaGIybf2XPue3TtutCmXgoQJg",
  authDomain: "my-first-project-494611.firebaseapp.com",
  projectId: "my-first-project-494611",
  storageBucket: "my-first-project-494611.firebasestorage.app",
  messagingSenderId: "27782445441",
  appId: "1:27782445441:web:4fe1df3f69f0b5bcc15080"
};

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Provider for Google Auth
export const googleProvider = new GoogleAuthProvider();

// Core Types
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  avatar: string;
  joinedDate: string;
  streak: number;
  linkedPlatforms: string[];
  phoneNumber?: string;
}

export interface UserProgress {
  completedTerms: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

// ==========================================
// MANUAL LOCAL MULTI-USER AUTH SYSTEM
// ==========================================

export interface LocalUser {
  uid: string;
  email: string;
  phoneNumber?: string;
  fullName: string;
  password?: string;
  avatar: string;
  joinedDate: string;
  streak: number;
  linkedPlatforms: string[];
}

export function getLocalUsers(): LocalUser[] {
  try {
    const saved = localStorage.getItem('clay_local_users');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveLocalUsers(users: LocalUser[]) {
  localStorage.setItem('clay_local_users', JSON.stringify(users));
}

export function getActiveLocalUser(): LocalUser | null {
  const activeId = localStorage.getItem('clay_current_user_id');
  if (!activeId) return null;
  const users = getLocalUsers();
  return users.find(u => u.uid === activeId) || null;
}

export function registerUserManually(
  email: string,
  phoneNumber: string,
  fullName: string,
  password?: string
): UserProfile {
  const users = getLocalUsers();
  
  // Clean checks
  const normEmail = email.toLowerCase().trim();
  const normPhone = phoneNumber.trim();

  if (normEmail && users.some(u => u.email.toLowerCase() === normEmail)) {
    throw new Error('Email is already registered.');
  }

  if (normPhone && users.some(u => u.phoneNumber === normPhone)) {
    throw new Error('Phone number is already registered.');
  }

  const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName || email)}`;

  const newUser: LocalUser = {
    uid: `local_${Date.now()}`,
    email: normEmail,
    phoneNumber: normPhone || undefined,
    fullName: fullName || 'Explorer',
    password: password || '',
    avatar,
    joinedDate,
    streak: 1,
    linkedPlatforms: []
  };

  users.push(newUser);
  saveLocalUsers(users);

  // Set active
  localStorage.setItem('clay_current_user_id', newUser.uid);
  window.dispatchEvent(new Event('clay_local_auth_changed'));

  return {
    uid: newUser.uid,
    email: newUser.email,
    fullName: newUser.fullName,
    avatar: newUser.avatar,
    joinedDate: newUser.joinedDate,
    streak: newUser.streak,
    linkedPlatforms: newUser.linkedPlatforms,
    phoneNumber: newUser.phoneNumber
  };
}

export function loginUserManually(identifier: string, password?: string): UserProfile {
  const users = getLocalUsers();
  const normIdent = identifier.toLowerCase().trim();

  const matched = users.find(u => 
    u.email.toLowerCase() === normIdent || 
    (u.phoneNumber && u.phoneNumber.trim() === normIdent)
  );

  if (!matched) {
    throw new Error('Account not found with this email or phone number.');
  }

  if (password !== undefined && matched.password !== password) {
    throw new Error('Incorrect password.');
  }

  // Set active
  localStorage.setItem('clay_current_user_id', matched.uid);
  window.dispatchEvent(new Event('clay_local_auth_changed'));

  return {
    uid: matched.uid,
    email: matched.email,
    fullName: matched.fullName,
    avatar: matched.avatar,
    joinedDate: matched.joinedDate,
    streak: matched.streak,
    linkedPlatforms: matched.linkedPlatforms,
    phoneNumber: matched.phoneNumber
  };
}

export function logoutUserManually() {
  localStorage.removeItem('clay_current_user_id');
  window.dispatchEvent(new Event('clay_local_auth_changed'));
}

export function linkSocialPlatformManually(platform: string, platformUsername?: string): UserProfile {
  const activeUser = getActiveLocalUser();
  
  if (activeUser) {
    // 1. Link platform to active local user
    const users = getLocalUsers();
    const updatedUsers = users.map(u => {
      if (u.uid === activeUser.uid) {
        const platforms = u.linkedPlatforms.includes(platform)
          ? u.linkedPlatforms.filter(p => p !== platform)
          : [...u.linkedPlatforms, platform];
        return { ...u, linkedPlatforms: platforms };
      }
      return u;
    });

    saveLocalUsers(updatedUsers);
    window.dispatchEvent(new Event('clay_local_auth_changed'));

    const updated = updatedUsers.find(u => u.uid === activeUser.uid)!;
    return {
      uid: updated.uid,
      email: updated.email,
      fullName: updated.fullName,
      avatar: updated.avatar,
      joinedDate: updated.joinedDate,
      streak: updated.streak,
      linkedPlatforms: updated.linkedPlatforms,
      phoneNumber: updated.phoneNumber
    };
  } else {
    // 2. Sign up/Log in using social account if not already logged in!
    const users = getLocalUsers();
    const username = platformUsername || `${platform} Explorer`;
    const normEmail = `${platform.toLowerCase()}_${Date.now()}@social.com`;
    
    const newUser: LocalUser = {
      uid: `local_${Date.now()}`,
      email: normEmail,
      fullName: username,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      streak: 1,
      linkedPlatforms: [platform]
    };

    users.push(newUser);
    saveLocalUsers(users);

    localStorage.setItem('clay_current_user_id', newUser.uid);
    window.dispatchEvent(new Event('clay_local_auth_changed'));

    return {
      uid: newUser.uid,
      email: newUser.email,
      fullName: newUser.fullName,
      avatar: newUser.avatar,
      joinedDate: newUser.joinedDate,
      streak: newUser.streak,
      linkedPlatforms: newUser.linkedPlatforms
    };
  }
}

// 1. Listen to Auth state changes and sync (HYBRID: supports local manual + firebase fallback)
export function setupAuthListener(
  onUserChanged: (profile: UserProfile | null) => void,
  onProgressChanged?: (progress: UserProgress | null) => void
) {
  const syncLocalOrFirebaseState = async (firebaseUser: FirebaseUser | null) => {
    const localUser = getActiveLocalUser();
    
    if (localUser) {
      // 1. Convert to UserProfile
      const profile: UserProfile = {
        uid: localUser.uid,
        email: localUser.email,
        fullName: localUser.fullName,
        avatar: localUser.avatar,
        joinedDate: localUser.joinedDate,
        streak: localUser.streak,
        linkedPlatforms: localUser.linkedPlatforms,
        phoneNumber: localUser.phoneNumber
      };
      
      localStorage.setItem('clay_user_profile', JSON.stringify(profile));
      onUserChanged(profile);

      // 2. Load user's progress
      const savedCompleted = localStorage.getItem(`clay_completed_terms_${localUser.uid}`);
      const savedBookmarks = localStorage.getItem(`clay_bookmarks_${localUser.uid}`);
      
      const progress: UserProgress = {
        completedTerms: savedCompleted ? JSON.parse(savedCompleted) : {},
        bookmarks: savedBookmarks ? JSON.parse(savedBookmarks) : {}
      };
      
      localStorage.setItem('clay_completed_terms', JSON.stringify(progress.completedTerms));
      localStorage.setItem('clay_bookmarks', JSON.stringify(progress.bookmarks));
      if (onProgressChanged) onProgressChanged(progress);

      // 3. Load user's quiz
      const savedQuiz = localStorage.getItem(`clay_quiz_${localUser.uid}`);
      if (savedQuiz) {
        try {
          const q = JSON.parse(savedQuiz);
          localStorage.setItem('clay_quiz_score', (q.score || 0).toString());
          localStorage.setItem('clay_quiz_completed', JSON.stringify(q.completedSections || {}));
          localStorage.setItem('clay_quiz_high_scores', JSON.stringify(q.highScores || {}));
          localStorage.setItem('clay_quiz_sessions', JSON.stringify(q.sessionHistory || []));
          localStorage.setItem('clay_quiz_streak_count', (q.streakCount || 0).toString());
          localStorage.setItem('clay_quiz_last_date', q.lastQuizDate || '');
        } catch (_) {}
      } else {
        localStorage.setItem('clay_quiz_score', '0');
        localStorage.setItem('clay_quiz_completed', '{}');
        localStorage.setItem('clay_quiz_high_scores', '{}');
        localStorage.setItem('clay_quiz_sessions', '[]');
        localStorage.setItem('clay_quiz_streak_count', '0');
        localStorage.setItem('clay_quiz_last_date', '');
      }

      window.dispatchEvent(new Event('clay_auth_state_changed'));
      return;
    }

    if (firebaseUser) {
      // Fetch profile from Firestore or local storage fallback
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        let profile: UserProfile;

        if (userSnap.exists()) {
          profile = { uid: firebaseUser.uid, ...userSnap.data() } as UserProfile;
        } else {
          // Create new profile
          const joinedDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.email || firebaseUser.uid)}`;
          const fullName = firebaseUser.displayName || firebaseUser.email?.split('@')[0].toUpperCase() || 'Explorer';
          
          profile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            fullName,
            avatar,
            joinedDate,
            streak: 1,
            linkedPlatforms: firebaseUser.providerData.map(p => p.providerId === 'google.com' ? 'Google' : '').filter(Boolean)
          };
          
          await setDoc(userRef, {
            email: profile.email,
            fullName: profile.fullName,
            avatar: profile.avatar,
            joinedDate: profile.joinedDate,
            streak: profile.streak,
            linkedPlatforms: profile.linkedPlatforms
          });
        }

        // Save to local storage for quick cache
        localStorage.setItem('clay_user_profile', JSON.stringify(profile));
        onUserChanged(profile);

        // Fetch Progress (bookmarks and completed terms)
        const progressRef = doc(db, 'progress', firebaseUser.uid);
        const progressSnap = await getDoc(progressRef);
        
        let progress: UserProgress = { completedTerms: {}, bookmarks: {} };

        if (progressSnap.exists()) {
          const data = progressSnap.data();
          progress = {
            completedTerms: data.completedTerms || {},
            bookmarks: data.bookmarks || {}
          };
        } else {
          // Try importing from local storage if available to avoid data loss
          const localCompleted = localStorage.getItem('clay_completed_terms');
          const localBookmarks = localStorage.getItem('clay_bookmarks');
          
          progress = {
            completedTerms: localCompleted ? JSON.parse(localCompleted) : {},
            bookmarks: localBookmarks ? JSON.parse(localBookmarks) : {}
          };

          await setDoc(progressRef, {
            userId: firebaseUser.uid,
            completedTerms: progress.completedTerms,
            bookmarks: progress.bookmarks,
            updatedAt: serverTimestamp()
          });
        }

        // Update local storage
        localStorage.setItem('clay_completed_terms', JSON.stringify(progress.completedTerms));
        localStorage.setItem('clay_bookmarks', JSON.stringify(progress.bookmarks));
        if (onProgressChanged) onProgressChanged(progress);

        // Fetch Quiz Progress
        try {
          const quizRef = doc(db, 'quizProgress', firebaseUser.uid);
          const quizSnap = await getDoc(quizRef);
          let quizScore = 0;
          let quizCompleted: Record<string, boolean> = {};
          let quizHighScores: Record<string, number> = {};

          let quizHistory: any[] = [];
          let streakCount = 0;
          let lastQuizDate = '';
          if (quizSnap.exists()) {
            const qData = quizSnap.data();
            quizScore = qData.score || 0;
            quizCompleted = qData.completedSections || {};
            quizHighScores = qData.highScores || {};
            quizHistory = qData.sessionHistory || [];
            streakCount = qData.streakCount || 0;
            lastQuizDate = qData.lastQuizDate || '';
          } else {
            const localScore = localStorage.getItem('clay_quiz_score');
            const localCompleted = localStorage.getItem('clay_quiz_completed');
            const localHighScores = localStorage.getItem('clay_quiz_high_scores');
            const localHistory = localStorage.getItem('clay_quiz_sessions');
            const localStreak = localStorage.getItem('clay_quiz_streak_count');
            const localLastDate = localStorage.getItem('clay_quiz_last_date');
            quizScore = localScore ? parseInt(localScore, 10) : 0;
            quizCompleted = localCompleted ? JSON.parse(localCompleted) : {};
            quizHighScores = localHighScores ? JSON.parse(localHighScores) : {};
            streakCount = localStreak ? parseInt(localStreak, 10) : 0;
            lastQuizDate = localLastDate || '';
            try {
              quizHistory = localHistory ? JSON.parse(localHistory) : [];
            } catch (_) {
              quizHistory = [];
            }

            await setDoc(quizRef, {
              userId: firebaseUser.uid,
              score: quizScore,
              completedSections: quizCompleted,
              highScores: quizHighScores,
              sessionHistory: quizHistory,
              streakCount,
              lastQuizDate,
              updatedAt: serverTimestamp()
            });
          }

          localStorage.setItem('clay_quiz_score', quizScore.toString());
          localStorage.setItem('clay_quiz_completed', JSON.stringify(quizCompleted));
          localStorage.setItem('clay_quiz_high_scores', JSON.stringify(quizHighScores));
          localStorage.setItem('clay_quiz_sessions', JSON.stringify(quizHistory));
          localStorage.setItem('clay_quiz_streak_count', streakCount.toString());
          localStorage.setItem('clay_quiz_last_date', lastQuizDate);
        } catch (e) {
          console.error("Error loading quiz progress:", e);
        }

        window.dispatchEvent(new Event('clay_auth_state_changed'));
      } catch (err) {
        console.error("Firebase Auth Sync error:", err);
      }
    } else {
      // Logged out
      localStorage.removeItem('clay_user_profile');
      onUserChanged(null);
      onProgressChanged(null);
      window.dispatchEvent(new Event('clay_auth_state_changed'));
    }
  };

  const handleLocalAuthChanged = () => {
    syncLocalOrFirebaseState(auth.currentUser);
  };

  // Add event listener for manual auth changes
  window.addEventListener('clay_local_auth_changed', handleLocalAuthChanged);

  // Subscribe to Firebase auth
  const unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
    syncLocalOrFirebaseState(user);
  });

  // Initial sync run
  syncLocalOrFirebaseState(auth.currentUser);

  return () => {
    window.removeEventListener('clay_local_auth_changed', handleLocalAuthChanged);
    unsubscribeFirebase();
  };
}

// 2. Sync Progress updates (works for both local and firebase user)
export async function syncProgressToCloud(completedTerms: Record<string, boolean>, bookmarks: Record<string, boolean>) {
  const localUser = getActiveLocalUser();
  if (localUser) {
    localStorage.setItem(`clay_completed_terms_${localUser.uid}`, JSON.stringify(completedTerms));
    localStorage.setItem(`clay_bookmarks_${localUser.uid}`, JSON.stringify(bookmarks));
    // Save to session-wide keys
    localStorage.setItem('clay_completed_terms', JSON.stringify(completedTerms));
    localStorage.setItem('clay_bookmarks', JSON.stringify(bookmarks));
    window.dispatchEvent(new Event('clay_auth_state_changed'));
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const progressRef = doc(db, 'progress', currentUser.uid);
    await setDoc(progressRef, {
      userId: currentUser.uid,
      completedTerms,
      bookmarks,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Failed to sync progress to Firebase Firestore:", error);
  }
}

// 3. Mark a learning term completed
export async function toggleTermCompleted(termTitle: string, isCompleted: boolean) {
  const saved = localStorage.getItem('clay_completed_terms');
  const current: Record<string, boolean> = saved ? JSON.parse(saved) : {};
  current[termTitle] = isCompleted;
  localStorage.setItem('clay_completed_terms', JSON.stringify(current));

  const savedBookmarks = localStorage.getItem('clay_bookmarks');
  const bookmarks: Record<string, boolean> = savedBookmarks ? JSON.parse(savedBookmarks) : {};
  await syncProgressToCloud(current, bookmarks);

  window.dispatchEvent(new Event('clay_auth_state_changed'));
}

// 4. Toggle bookmark of a section
export async function toggleSectionBookmarked(sectionId: string, isBookmarked: boolean) {
  const saved = localStorage.getItem('clay_bookmarks');
  const current: Record<string, boolean> = saved ? JSON.parse(saved) : {};
  current[sectionId] = isBookmarked;
  localStorage.setItem('clay_bookmarks', JSON.stringify(current));

  const savedTerms = localStorage.getItem('clay_completed_terms');
  const completedTerms: Record<string, boolean> = savedTerms ? JSON.parse(savedTerms) : {};
  await syncProgressToCloud(completedTerms, current);

  window.dispatchEvent(new Event('clay_auth_state_changed'));
}

// 5. Sync Quiz progress
export async function syncQuizProgressToCloud(
  score: number, 
  completedSections: Record<string, boolean>, 
  highScores: Record<string, number>,
  sessionHistory?: any[],
  streakCount?: number,
  lastQuizDate?: string
) {
  // Always save locally first
  localStorage.setItem('clay_quiz_score', score.toString());
  localStorage.setItem('clay_quiz_completed', JSON.stringify(completedSections));
  localStorage.setItem('clay_quiz_high_scores', JSON.stringify(highScores));
  if (sessionHistory) {
    localStorage.setItem('clay_quiz_sessions', JSON.stringify(sessionHistory));
  }
  if (streakCount !== undefined) {
    localStorage.setItem('clay_quiz_streak_count', streakCount.toString());
  }
  if (lastQuizDate !== undefined) {
    localStorage.setItem('clay_quiz_last_date', lastQuizDate);
  }
  
  const localUser = getActiveLocalUser();
  if (localUser) {
    const quizData = {
      score,
      completedSections,
      highScores,
      sessionHistory,
      streakCount,
      lastQuizDate
    };
    localStorage.setItem(`clay_quiz_${localUser.uid}`, JSON.stringify(quizData));
    window.dispatchEvent(new Event('clay_auth_state_changed'));
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const quizRef = doc(db, 'quizProgress', currentUser.uid);
    const updateData: any = {
      userId: currentUser.uid,
      score,
      completedSections,
      highScores,
      updatedAt: serverTimestamp()
    };
    if (sessionHistory) {
      updateData.sessionHistory = sessionHistory;
    }
    if (streakCount !== undefined) {
      updateData.streakCount = streakCount;
    }
    if (lastQuizDate !== undefined) {
      updateData.lastQuizDate = lastQuizDate;
    }
    await setDoc(quizRef, updateData, { merge: true });
  } catch (error) {
    console.error("Failed to sync quiz progress to Firebase Firestore:", error);
  }
}

import { useState as useReactState, useEffect as useReactEffect } from 'react';

// Custom React hook for accessing current auth user and status
export function useAuth() {
  const [user, setUser] = useReactState<UserProfile | null>(() => {
    const saved = localStorage.getItem('clay_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useReactState(false);

  useReactEffect(() => {
    const updateUser = () => {
      const saved = localStorage.getItem('clay_user_profile');
      setUser(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener('clay_auth_state_changed', updateUser);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          localStorage.setItem('clay_user_profile', JSON.stringify(profile));
          setUser(profile);
        } else {
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            fullName: firebaseUser.displayName || 'Learner',
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            streak: 1,
            linkedPlatforms: ['google'],
          };
          localStorage.setItem('clay_user_profile', JSON.stringify(newProfile));
          setUser(newProfile);
        }
      }
    });

    return () => {
      window.removeEventListener('clay_auth_state_changed', updateUser);
      unsubscribe();
    };
  }, []);

  return { user, loading };
}

// ==========================================
// STUDY GROUPS CLOUD & LOCAL SYNC SYSTEM
// ==========================================

export interface StudyGroupMember {
  uid: string;
  name: string;
  avatar: string;
  role: 'leader' | 'member';
  joinedAt: string;
}

export interface StudyGroupMessage {
  id: string;
  groupId: string;
  senderUid: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  topicId: string;
  topicTitle: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  meetingTime: string;
  members: StudyGroupMember[];
  maxMembers: number;
  tags: string[];
}

export const INITIAL_DEFAULT_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'group_transformers',
    name: 'Transformers & Self-Attention Cohort',
    topicId: 'c4',
    topicTitle: 'Transformer Architecture & Self-Attention',
    category: 'GenAI',
    level: 'Advanced',
    description: 'Weekly deep dive into multi-head attention math, positional embeddings, and KV cache optimizations.',
    createdBy: 'scholar_priya',
    createdByName: 'Priya N. (Tutor)',
    createdAt: '2026-08-15',
    meetingTime: 'Tuesdays & Thursdays • 6:30 PM IST',
    maxMembers: 15,
    tags: ['Self-Attention', 'Transformers', 'Math Deep Dive'],
    members: [
      { uid: 'scholar_priya', name: 'Priya N.', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya', role: 'leader', joinedAt: '2026-08-15' },
      { uid: 'scholar_arjun', name: 'Arjun K.', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Arjun', role: 'member', joinedAt: '2026-08-16' },
      { uid: 'scholar_zainab', name: 'Zainab R.', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zainab', role: 'member', joinedAt: '2026-08-18' }
    ]
  },
  {
    id: 'group_rag_architects',
    name: 'RAG & Vector Search Builders',
    topicId: 'c5',
    topicTitle: 'RAG (Retrieval-Augmented Generation) & Vectors',
    category: 'GenAI',
    level: 'Advanced',
    description: 'Hands-on practice implementing chunking strategies, hybrid BM25 + dense retrieval, and reranking.',
    createdBy: 'scholar_farhan',
    createdByName: 'Farhan M.',
    createdAt: '2026-08-18',
    meetingTime: 'Saturdays • 4:00 PM IST',
    maxMembers: 12,
    tags: ['RAG', 'Vector DB', 'Embeddings', 'LangChain'],
    members: [
      { uid: 'scholar_farhan', name: 'Farhan M.', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Farhan', role: 'leader', joinedAt: '2026-08-18' },
      { uid: 'scholar_rahul', name: 'Rahul V.', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Rahul', role: 'member', joinedAt: '2026-08-19' }
    ]
  },
  {
    id: 'group_ai_foundations_hyd',
    name: 'AI Foundations & ML Basics (Urdu / Telugu Focus)',
    topicId: 'c1',
    topicTitle: 'AI vs ML vs Deep Learning Hierarchy',
    category: 'Foundations',
    level: 'Beginner',
    description: 'Beginner friendly cohort explaining neural networks, weights, and loss functions in plain colloquial language.',
    createdBy: 'scholar_ali',
    createdByName: 'Ali Hyder',
    createdAt: '2026-08-19',
    meetingTime: 'Daily Evening Practice • 7:00 PM IST',
    maxMembers: 20,
    tags: ['Beginners', 'Bilingual', 'Foundations', 'Intuition'],
    members: [
      { uid: 'scholar_ali', name: 'Ali Hyder', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ali', role: 'leader', joinedAt: '2026-08-19' },
      { uid: 'scholar_sneha', name: 'Sneha T.', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sneha', role: 'member', joinedAt: '2026-08-20' }
    ]
  },
  {
    id: 'group_prompt_pros',
    name: 'Prompt Engineering & System Personas',
    topicId: 'c6',
    topicTitle: 'Prompt Engineering & System Personas',
    category: 'Prompting',
    level: 'Beginner',
    description: 'Techniques for few-shot reasoning, structured JSON schemas, and jailbreak guardrail testing.',
    createdBy: 'scholar_maya',
    createdByName: 'Maya S.',
    createdAt: '2026-08-20',
    meetingTime: 'Mondays & Wednesdays • 5:30 PM IST',
    maxMembers: 10,
    tags: ['Few-Shot', 'CoT', 'Structured Output', 'Safety'],
    members: [
      { uid: 'scholar_maya', name: 'Maya S.', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maya', role: 'leader', joinedAt: '2026-08-20' }
    ]
  }
];

export function getLocalStudyGroups(): StudyGroup[] {
  try {
    const saved = localStorage.getItem('clay_study_groups');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('clay_study_groups', JSON.stringify(INITIAL_DEFAULT_STUDY_GROUPS));
    return INITIAL_DEFAULT_STUDY_GROUPS;
  } catch {
    return INITIAL_DEFAULT_STUDY_GROUPS;
  }
}

export function saveLocalStudyGroups(groups: StudyGroup[]) {
  localStorage.setItem('clay_study_groups', JSON.stringify(groups));
  window.dispatchEvent(new CustomEvent('clay_study_groups_updated'));
}

export async function fetchStudyGroups(): Promise<StudyGroup[]> {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const docSnap = await getDoc(doc(db, 'studyGroups', 'all_groups'));
      if (docSnap.exists() && docSnap.data()?.groups) {
        const cloudGroups = docSnap.data().groups as StudyGroup[];
        saveLocalStudyGroups(cloudGroups);
        return cloudGroups;
      }
    }
  } catch (err) {
    console.warn("Using local cache for study groups:", err);
  }
  return getLocalStudyGroups();
}

export async function createStudyGroupCloud(newGroup: Omit<StudyGroup, 'id' | 'createdAt'>): Promise<StudyGroup> {
  const groups = getLocalStudyGroups();
  const fullGroup: StudyGroup = {
    ...newGroup,
    id: `group_${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updated = [fullGroup, ...groups];
  saveLocalStudyGroups(updated);

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await setDoc(doc(db, 'studyGroups', 'all_groups'), {
        groups: updated,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Failed to sync new group to Firestore, saved locally:", err);
  }

  return fullGroup;
}

export async function joinStudyGroupCloud(groupId: string, user: UserProfile): Promise<boolean> {
  const groups = getLocalStudyGroups();
  const targetIndex = groups.findIndex(g => g.id === groupId);
  if (targetIndex === -1) return false;

  const target = groups[targetIndex];
  const alreadyMember = target.members.some(m => m.uid === user.uid);
  if (alreadyMember) return true;

  if (target.members.length >= target.maxMembers) {
    throw new Error('This study group is currently at full capacity.');
  }

  const newMember: StudyGroupMember = {
    uid: user.uid,
    name: user.fullName || user.email || 'Scholar',
    avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
    role: 'member',
    joinedAt: new Date().toISOString().split('T')[0]
  };

  target.members.push(newMember);
  groups[targetIndex] = target;
  saveLocalStudyGroups(groups);

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await setDoc(doc(db, 'studyGroups', 'all_groups'), {
        groups,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Synced group join locally:", err);
  }

  return true;
}

export async function leaveStudyGroupCloud(groupId: string, userUid: string): Promise<boolean> {
  const groups = getLocalStudyGroups();
  const targetIndex = groups.findIndex(g => g.id === groupId);
  if (targetIndex === -1) return false;

  const target = groups[targetIndex];
  target.members = target.members.filter(m => m.uid !== userUid);
  groups[targetIndex] = target;
  saveLocalStudyGroups(groups);

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await setDoc(doc(db, 'studyGroups', 'all_groups'), {
        groups,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Synced group leave locally:", err);
  }

  return true;
}

export function getStudyGroupMessages(groupId: string): StudyGroupMessage[] {
  try {
    const saved = localStorage.getItem(`clay_study_messages_${groupId}`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    {
      id: 'msg_1',
      groupId,
      senderUid: 'scholar_tutor',
      senderName: 'Cohort Guide',
      senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guide',
      text: 'Welcome everyone! Review this week’s lesson notes and post your questions or project links below.',
      timestamp: 'Yesterday at 5:30 PM'
    }
  ];
}

export function postStudyGroupMessage(groupId: string, user: UserProfile, text: string): StudyGroupMessage {
  const messages = getStudyGroupMessages(groupId);
  const newMsg: StudyGroupMessage = {
    id: `msg_${Date.now()}`,
    groupId,
    senderUid: user.uid,
    senderName: user.fullName || 'Scholar',
    senderAvatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`,
    text: text.trim(),
    timestamp: 'Just now'
  };

  const updated = [...messages, newMsg];
  localStorage.setItem(`clay_study_messages_${groupId}`, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(`clay_group_chat_${groupId}`));
  return newMsg;
}

