// Daily Streak & Consistency Manager for Clayverse AI Students

export interface DayActivity {
  dateStr: string; // "YYYY-MM-DD"
  dayName: string; // "Mon", "Tue", etc.
  dayNumber: number; // 1-31
  isToday: boolean;
  completed: boolean;
  lessonIds: string[];
}

export interface DailyStreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // "YYYY-MM-DD"
  todayCompleted: boolean;
  totalDaysActive: number;
  totalLessonsCompleted: number;
  completedLessonIds: string[];
  completionDates: string[]; // unique ISO date strings "YYYY-MM-DD"
  weeklyActivity: DayActivity[];
  currentMilestone: {
    title: string;
    description: string;
    nextMilestoneDays: number;
    progressPercent: number;
    badgeEmoji: string;
  };
}

const STORAGE_KEY = 'clay_student_streak_data';
const COMPLETED_LESSONS_KEY = 'clay_completed_lessons_list';

// Helper to format date as YYYY-MM-DD
export function getIsoDateStr(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper to calculate difference in calendar days
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// Compute Milestone details
function computeMilestone(currentStreak: number) {
  const milestones = [
    { target: 3, title: 'AI Novice Starter', description: 'Complete 3 days in a row', emoji: '🌱' },
    { target: 7, title: '7-Day AI Scholar', description: 'A full week of non-stop learning', emoji: '🔥' },
    { target: 14, title: '14-Day Deep Learner', description: 'Two weeks of neural mastery', emoji: '⚡' },
    { target: 30, title: '30-Day Master Mind', description: 'One month of consistent habit', emoji: '🏆' },
    { target: 60, title: 'AI Grandmaster', description: 'Sixty days of continuous growth', emoji: '👑' },
    { target: 100, title: 'Clayverse Legend', description: 'Century streak legend', emoji: '🌟' },
  ];

  let currentTarget = milestones[0];
  for (const m of milestones) {
    if (currentStreak < m.target) {
      currentTarget = m;
      break;
    }
    currentTarget = m;
  }

  const prevTarget = milestones.find((_, idx) => milestones[idx + 1]?.target === currentTarget.target)?.target || 0;
  const range = currentTarget.target - prevTarget;
  const progress = Math.min(100, Math.max(10, Math.round(((currentStreak - prevTarget) / (range || 1)) * 100)));

  return {
    title: currentTarget.title,
    description: currentTarget.description,
    nextMilestoneDays: currentTarget.target,
    progressPercent: currentStreak >= currentTarget.target ? 100 : progress,
    badgeEmoji: currentTarget.emoji
  };
}

// Build 7-day trailing week activity (Mon to Sun or last 7 days)
function computeWeeklyActivity(completionDates: string[], todayStr: string): DayActivity[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const week: DayActivity[] = [];

  // Generate 7 days ending today (or centered on current week)
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = getIsoDateStr(d);
    const dayName = dayNames[d.getDay()];
    const dayNumber = d.getDate();
    const completed = completionDates.includes(dateStr);

    week.push({
      dateStr,
      dayName,
      dayNumber,
      isToday: dateStr === todayStr,
      completed,
      lessonIds: []
    });
  }

  return week;
}

export class StreakManager {
  private static instance: StreakManager;

  private constructor() {}

  public static getInstance(): StreakManager {
    if (!StreakManager.instance) {
      StreakManager.instance = new StreakManager();
    }
    return StreakManager.instance;
  }

  public getStreakState(): DailyStreakState {
    const todayStr = getIsoDateStr();
    
    let rawData: any = null;
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          rawData = JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn('Failed to parse streak data:', e);
    }

    // Default pre-seeded baseline if brand new user
    let currentStreak = rawData?.currentStreak ?? 1;
    let longestStreak = rawData?.longestStreak ?? Math.max(1, currentStreak);
    let lastActiveDate = rawData?.lastActiveDate ?? null;
    let completionDates: string[] = Array.isArray(rawData?.completionDates) ? rawData.completionDates : [];
    let completedLessonIds: string[] = [];

    try {
      if (typeof window !== 'undefined') {
        const storedLessons = localStorage.getItem(COMPLETED_LESSONS_KEY);
        if (storedLessons) {
          completedLessonIds = JSON.parse(storedLessons);
        }
      }
    } catch {}

    if (completedLessonIds.length === 0 && Array.isArray(rawData?.completedLessonIds)) {
      completedLessonIds = rawData.completedLessonIds;
    }

    // If never initialized before, seed yesterday as active to give student an encouraging start
    if (!lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getIsoDateStr(yesterday);
      lastActiveDate = yesterdayStr;
      if (!completionDates.includes(yesterdayStr)) {
        completionDates.push(yesterdayStr);
      }
    }

    // Determine if today is completed
    const todayCompleted = completionDates.includes(todayStr) || lastActiveDate === todayStr;

    // Check streak validity against today's date
    if (lastActiveDate) {
      const diffDays = getDaysDifference(lastActiveDate, todayStr);
      if (diffDays === 0) {
        // Active today, streak is current
      } else if (diffDays === 1) {
        // Active yesterday, streak is waiting for today's completion
      } else {
        // Missed more than 1 day -> streak broken, resets to 0 (or 1 once completed)
        currentStreak = 0;
      }
    }

    const weeklyActivity = computeWeeklyActivity(completionDates, todayStr);
    const currentMilestone = computeMilestone(currentStreak);

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastActiveDate,
      todayCompleted,
      totalDaysActive: completionDates.length,
      totalLessonsCompleted: Math.max(completedLessonIds.length, 1),
      completedLessonIds,
      completionDates,
      weeklyActivity,
      currentMilestone
    };
  }

  public recordLessonCompletion(lessonId?: string): DailyStreakState {
    const todayStr = getIsoDateStr();
    const currentState = this.getStreakState();
    
    let { currentStreak, longestStreak, completionDates, completedLessonIds, lastActiveDate } = currentState;

    // Add unique completion date
    if (!completionDates.includes(todayStr)) {
      completionDates.push(todayStr);
    }

    // Add unique completed lesson
    if (lessonId && !completedLessonIds.includes(lessonId)) {
      completedLessonIds.push(lessonId);
    }

    // Calculate updated streak
    if (lastActiveDate === todayStr) {
      // Already completed today, keep current streak
    } else if (lastActiveDate) {
      const diff = getDaysDifference(lastActiveDate, todayStr);
      if (diff === 1) {
        // Consecutive day! Increment streak
        currentStreak += 1;
      } else {
        // Restart streak
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    lastActiveDate = todayStr;

    // Save to storage
    try {
      if (typeof window !== 'undefined') {
        const payload = {
          currentStreak,
          longestStreak,
          lastActiveDate,
          completionDates,
          completedLessonIds,
          updatedAt: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(completedLessonIds));
        localStorage.setItem('clay_quiz_streak_count', String(currentStreak));

        // Dispatch global events
        window.dispatchEvent(new CustomEvent('clay_streak_updated', { detail: payload }));
        window.dispatchEvent(new CustomEvent('clay_lesson_completed', { detail: { lessonId, currentStreak } }));
      }
    } catch (e) {
      console.warn('Failed to save streak state:', e);
    }

    return this.getStreakState();
  }

  public isLessonCompleted(lessonId: string): boolean {
    const state = this.getStreakState();
    return state.completedLessonIds.includes(lessonId);
  }
}

export const streakManager = StreakManager.getInstance();
