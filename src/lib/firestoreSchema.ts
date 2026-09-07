/**
 * Firestore Database Schema Types
 * Defines TypeScript interfaces for all Firestore collections
 * 
 * Collections:
 * - users/{uid} - User profiles and preferences
 * - progress/{uid} - Learning progress data
 * - achievements/{uid} - Badges and milestones
 * - leaderboards/global - Global rankings
 */

/**
 * ===================================
 * USERS COLLECTION
 * ===================================
 */

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  preferredLanguage: 'en' | 'hi' | 'te' | 'mr' | 'ta' | 'ur' | 'roman_ur' | 'hinglish';
  learnerType: 'student' | 'educator' | 'professional' | 'curious';
  createdAt: number;
  lastLogin: number;
  emailVerified: boolean;
  isActive: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'sand' | 'deep-blue' | 'deep-night' | 'red-light';
  notificationsEnabled: boolean;
  dailyRemindersEnabled: boolean;
  soundEnabled: boolean;
  accessibilityMode: boolean;
  textSize: 'sm' | 'md' | 'lg';
  autoScroll: boolean;
  debugMode: boolean;
}

export interface UserStats {
  totalXP: number;
  level: number;
  streakDays: number;
  lastActivityDate: number;
  lessonsCompleted: number;
  quizzesAttempted: number;
  quizzesPass: number;
  videosWatched: number;
  totalStudyTime: number; // in minutes
  averageQuizScore: number; // 0-100
}

/**
 * ===================================
 * PROGRESS COLLECTION
 * ===================================
 */

export interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  completed: boolean;
  completedAt?: number;
  timeSpent: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes: string;
  lastAccessedAt: number;
}

export interface QuizAttempt {
  quizId: string;
  quizTitle: string;
  attemptNumber: number;
  score: number; // 0-100
  maxScore: number;
  timeTaken: number; // in seconds
  questionsAnswered: number;
  totalQuestions: number;
  passed: boolean;
  attemptedAt: number;
  answers: {
    questionId: string;
    selectedAnswer: string | string[];
    isCorrect: boolean;
    explanation?: string;
  }[];
}

export interface VideoProgress {
  videoId: string;
  videoTitle: string;
  duration: number; // in seconds
  watched: number; // in seconds
  completionPercentage: number; // 0-100
  completed: boolean;
  completedAt?: number;
  watchedAt: number;
  topic: string;
}

export interface BookmarkedResource {
  resourceId: string;
  resourceTitle: string;
  resourceType: 'video' | 'article' | 'course' | 'documentation';
  resourceURL: string;
  addedAt: number;
  notes?: string;
}

/**
 * ===================================
 * ACHIEVEMENTS COLLECTION
 * ===================================
 */

export interface AchievementBadge {
  badgeId: string;
  title: string;
  description: string;
  category: 'learning' | 'engagement' | 'streak' | 'mastery' | 'social';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string; // emoji or icon URL
  criteria: string;
  xpReward: number;
  unlockedAt: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface LearningMilestone {
  milestoneId: string;
  title: string;
  description: string;
  threshold: number; // e.g., lessons completed
  thresholdType: 'lessons_completed' | 'total_xp' | 'quiz_score' | 'streak_days' | 'videos_watched';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  xpReward: number;
  unlockedAt: number;
  celebrated: boolean;
}

/**
 * ===================================
 * LEADERBOARD COLLECTION
 * ===================================
 */

export interface LeaderboardEntry {
  rank: number;
  uid: string;
  displayName: string;
  photoURL?: string;
  totalXP: number;
  level: number;
  streakDays: number;
  lessonsCompleted: number;
  lastUpdated: number;
  isFriend?: boolean;
}

export interface GlobalLeaderboard extends LeaderboardEntry {
  percentile: number; // 0-100
}

/**
 * ===================================
 * FIRESTORE COLLECTION PATHS
 * ===================================
 */

export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  progress: 'progress',
  achievements: 'achievements',
  leaderboards: 'leaderboards',
} as const;

export const FIRESTORE_SUBCOLLECTIONS = {
  lessons: 'lessons',
  quizzes: 'quizzes',
  videos: 'videos',
  bookmarks: 'bookmarks',
  badges: 'badges',
  milestones: 'milestones',
} as const;

/**
 * ===================================
 * TYPE UTILITIES
 * ===================================
 */

/**
 * Firebase Document with metadata
 */
export interface FirebaseDocument {
  id: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Paginated query result
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  pageSize: number;
  pageNumber: number;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  eventName: string;
  userId: string;
  timestamp: number;
  data: Record<string, any>;
}

/**
 * ===================================
 * QUERY FILTERS
 * ===================================
 */

export interface LessonProgressFilter {
  completed?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  dateFrom?: number;
  dateTo?: number;
}

export interface QuizAttemptsFilter {
  passed?: boolean;
  minScore?: number;
  dateFrom?: number;
  dateTo?: number;
}

export interface AchievementsFilter {
  category?: 'learning' | 'engagement' | 'streak' | 'mastery' | 'social';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}
