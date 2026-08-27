// Focus Metrics & Deep Work Persistence Engine for Clayverse AI

export interface DailyFocusRecord {
  dateStr: string; // "YYYY-MM-DD"
  totalDeepWorkSeconds: number;
  sessionsCompleted: number;
  visualBreaksCompleted: number;
  distractionsAvoided: number;
  xpEarned: number;
  currentLessonId?: string;
}

export interface FocusMetricsState {
  todayDeepWorkSeconds: number;
  todaySessionsCompleted: number;
  todayVisualBreaksCompleted: number;
  todayDistractionCount: number;
  todayXp: number;
  dailyGoalMinutes: number;
  focusStreakDays: number;
  lastActiveDate: string;
}

const STORAGE_KEY = 'clay_focus_metrics_v1';

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class FocusMetricsManager {
  private state: FocusMetricsState;
  private listeners: Array<(state: FocusMetricsState) => void> = [];

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): FocusMetricsState {
    const today = getTodayDateStr();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.lastActiveDate === today) {
          return {
            todayDeepWorkSeconds: parsed.todayDeepWorkSeconds || 0,
            todaySessionsCompleted: parsed.todaySessionsCompleted || 0,
            todayVisualBreaksCompleted: parsed.todayVisualBreaksCompleted || 0,
            todayDistractionCount: parsed.todayDistractionCount || 0,
            todayXp: parsed.todayXp || 0,
            dailyGoalMinutes: parsed.dailyGoalMinutes || 45,
            focusStreakDays: parsed.focusStreakDays || 1,
            lastActiveDate: today
          };
        } else {
          // New day rollover
          const prevDate = new Date(parsed.lastActiveDate + 'T00:00:00');
          const currDate = new Date(today + 'T00:00:00');
          const dayDiff = Math.round(Math.abs(currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          const maintainedStreak = dayDiff === 1 ? (parsed.focusStreakDays || 1) + 1 : 1;

          return {
            todayDeepWorkSeconds: 0,
            todaySessionsCompleted: 0,
            todayVisualBreaksCompleted: 0,
            todayDistractionCount: 0,
            todayXp: 0,
            dailyGoalMinutes: parsed.dailyGoalMinutes || 45,
            focusStreakDays: maintainedStreak,
            lastActiveDate: today
          };
        }
      }
    } catch (e) {}

    return {
      todayDeepWorkSeconds: 0,
      todaySessionsCompleted: 0,
      todayVisualBreaksCompleted: 0,
      todayDistractionCount: 0,
      todayXp: 0,
      dailyGoalMinutes: 45,
      focusStreakDays: 1,
      lastActiveDate: today
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {}
    this.notify();
  }

  public getState(): FocusMetricsState {
    return { ...this.state };
  }

  public addDeepWorkSeconds(seconds: number) {
    if (seconds <= 0) return;
    this.state.todayDeepWorkSeconds += seconds;
    // Earn 1 XP for every 30 seconds of deep work
    this.state.todayXp += Math.floor(seconds / 30);
    this.saveState();
  }

  public recordCompletedSession(xpBonus: number = 50) {
    this.state.todaySessionsCompleted += 1;
    this.state.todayXp += xpBonus;
    this.saveState();
  }

  public recordVisualBreakCompleted(xpBonus: number = 25) {
    this.state.todayVisualBreaksCompleted += 1;
    this.state.todayXp += xpBonus;
    this.saveState();
  }

  public recordDistraction() {
    this.state.todayDistractionCount += 1;
    this.saveState();
  }

  public setDailyGoal(minutes: number) {
    this.state.dailyGoalMinutes = Math.max(10, Math.min(240, minutes));
    this.saveState();
  }

  public subscribe(listener: (state: FocusMetricsState) => void) {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(l => l(s));
  }
}

export const focusMetrics = new FocusMetricsManager();
