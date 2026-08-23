import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Award, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Sparkles, 
  Video, 
  Brain, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Check, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Star,
  Trophy
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { DailyStreakState } from '../lib/streakManager';
import { audioEngine } from '../lib/audioEngine';

export interface InterviewBadge {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'interview' | 'mastery' | 'consistency' | 'speed';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
  unlocked: boolean;
  unlockDate?: string;
  progressPercent: number;
  currentValue: number;
  targetValue: number;
  requirementText: string;
  gradient: string;
}

interface DailyLearningGoalTrackerProps {
  streakState: DailyStreakState;
  interviewHistory: MockInterviewRecord[];
  masteredConceptsCount: number;
  totalConceptsCount: number;
  onLaunchInterview: () => void;
  onNavigateLesson: (lessonId: string) => void;
  onMarkLessonComplete: () => void;
}

export default function DailyLearningGoalTracker({
  streakState,
  interviewHistory,
  masteredConceptsCount,
  totalConceptsCount,
  onLaunchInterview,
  onNavigateLesson,
  onMarkLessonComplete
}: DailyLearningGoalTrackerProps) {
  const [selectedBadge, setSelectedBadge] = useState<InterviewBadge | null>(null);
  const [celebrateGoal, setCelebrateGoal] = useState(false);

  // 1. Calculate Daily Goals Progress for Today
  const dailyGoals = useMemo(() => {
    // Goal 1: Concept Lesson / Check-in
    const goal1Done = streakState.todayCompleted;

    // Goal 2: Completed / Attempted a Mock Interview Round today or at least 1 round total
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const hasInterviewToday = interviewHistory.some(rec => rec.timestamp >= todayStart.getTime());
    const goal2Done = hasInterviewToday || interviewHistory.length > 0;

    // Goal 3: High Performance standard (Score ≥ 80% or Eye Contact ≥ 85%)
    const highPerformer = interviewHistory.some(rec => rec.overallScore >= 80 || rec.eyeContactScore >= 85);
    const goal3Done = highPerformer;

    return [
      {
        id: 'lesson_checkin',
        title: 'Daily AI Concept Check-in',
        description: 'Complete a curriculum lesson or mark daily study check-in.',
        isCompleted: goal1Done,
        xp: 25,
        actionLabel: goal1Done ? 'Completed' : 'Check In Now',
        onAction: onMarkLessonComplete,
        icon: Brain,
      },
      {
        id: 'mock_interview_round',
        title: 'Practice 1 Mock Interview Round',
        description: 'Test your knowledge with live AI interviewer & camera gaze tracking.',
        isCompleted: goal2Done,
        xp: 50,
        actionLabel: goal2Done ? 'Session Verified' : 'Launch Mock Interview',
        onAction: onLaunchInterview,
        icon: Video,
      },
      {
        id: 'performance_benchmark',
        title: 'Achieve ≥80% Technical / Eye Contact Score',
        description: 'Deliver structured answers with steady camera gaze.',
        isCompleted: goal3Done,
        xp: 40,
        actionLabel: goal3Done ? 'Benchmark Achieved' : 'Attempt Benchmark',
        onAction: onLaunchInterview,
        icon: ShieldCheck,
      },
    ];
  }, [streakState.todayCompleted, interviewHistory, onMarkLessonComplete, onLaunchInterview]);

  const completedGoalsCount = dailyGoals.filter(g => g.isCompleted).length;
  const totalGoals = dailyGoals.length;
  const goalProgressPercent = Math.round((completedGoalsCount / totalGoals) * 100);
  const totalEarnedXp = dailyGoals.filter(g => g.isCompleted).reduce((acc, curr) => acc + curr.xp, 0);

  // 2. Calculate Interview Session & Milestone Badges
  const badges: InterviewBadge[] = useMemo(() => {
    const totalInterviews = interviewHistory.length;
    const bestScore = totalInterviews > 0 ? Math.max(...interviewHistory.map(r => r.overallScore)) : 0;
    const bestEyeContact = totalInterviews > 0 ? Math.max(...interviewHistory.map(r => r.eyeContactScore)) : 0;
    const bestTechScore = totalInterviews > 0 ? Math.max(...interviewHistory.map(r => r.technicalScore)) : 0;
    const fastSession = interviewHistory.some(r => r.durationSeconds > 0 && r.durationSeconds <= 600);

    return [
      {
        id: 'first_interview',
        title: 'First Step Pioneer',
        description: 'Completed your first full AI Mock Interview session with camera tracking.',
        icon: Video,
        category: 'interview',
        rarity: 'Common',
        xpReward: 50,
        unlocked: totalInterviews >= 1,
        unlockDate: totalInterviews >= 1 ? interviewHistory[0]?.dateStr : undefined,
        progressPercent: Math.min(100, (totalInterviews / 1) * 100),
        currentValue: totalInterviews,
        targetValue: 1,
        requirementText: 'Complete 1 AI Mock Interview',
        gradient: 'from-amber-500 to-orange-600',
      },
      {
        id: 'high_performer',
        title: 'Interview High Performer',
        description: 'Achieved an overall interview score of 85% or higher with a Hire decision.',
        icon: Trophy,
        category: 'interview',
        rarity: 'Rare',
        xpReward: 100,
        unlocked: bestScore >= 85,
        unlockDate: bestScore >= 85 ? 'Earned' : undefined,
        progressPercent: Math.min(100, Math.round((bestScore / 85) * 100)),
        currentValue: bestScore,
        targetValue: 85,
        requirementText: 'Score ≥85% in an interview round',
        gradient: 'from-blue-500 to-indigo-600',
      },
      {
        id: 'laser_gaze',
        title: 'Executive Camera Presence',
        description: 'Maintained 90%+ camera eye contact and posture alignment throughout a round.',
        icon: Eye,
        category: 'interview',
        rarity: 'Rare',
        xpReward: 75,
        unlocked: bestEyeContact >= 90,
        unlockDate: bestEyeContact >= 90 ? 'Earned' : undefined,
        progressPercent: Math.min(100, Math.round((bestEyeContact / 90) * 100)),
        currentValue: bestEyeContact,
        targetValue: 90,
        requirementText: 'Achieve ≥90% camera eye gaze rating',
        gradient: 'from-emerald-500 to-teal-600',
      },
      {
        id: 'tech_virtuoso',
        title: 'Technical Virtuoso',
        description: 'Demonstrated exceptional conceptual clarity with 90%+ technical accuracy.',
        icon: Brain,
        category: 'interview',
        rarity: 'Epic',
        xpReward: 150,
        unlocked: bestTechScore >= 90,
        unlockDate: bestTechScore >= 90 ? 'Earned' : undefined,
        progressPercent: Math.min(100, Math.round((bestTechScore / 90) * 100)),
        currentValue: bestTechScore,
        targetValue: 90,
        requirementText: 'Score ≥90% technical accuracy score',
        gradient: 'from-purple-500 to-pink-600',
      },
      {
        id: 'speed_scholar',
        title: 'Agile Problem Solver',
        description: 'Completed a full 5-question technical interview in under 10 minutes.',
        icon: Zap,
        category: 'speed',
        rarity: 'Epic',
        xpReward: 120,
        unlocked: fastSession,
        unlockDate: fastSession ? 'Earned' : undefined,
        progressPercent: fastSession ? 100 : (totalInterviews > 0 ? 60 : 0),
        currentValue: fastSession ? 1 : 0,
        targetValue: 1,
        requirementText: 'Finish all interview questions in <10 mins',
        gradient: 'from-amber-400 to-yellow-600',
      },
      {
        id: 'concept_champion',
        title: 'Concept Mastermind',
        description: 'Mastered 5 or more core AI & Machine Learning curriculum concepts.',
        icon: ShieldCheck,
        category: 'mastery',
        rarity: 'Rare',
        xpReward: 100,
        unlocked: masteredConceptsCount >= 5,
        unlockDate: masteredConceptsCount >= 5 ? 'Earned' : undefined,
        progressPercent: Math.min(100, Math.round((masteredConceptsCount / 5) * 100)),
        currentValue: masteredConceptsCount,
        targetValue: 5,
        requirementText: 'Master 5 AI curriculum concepts',
        gradient: 'from-teal-500 to-emerald-700',
      },
      {
        id: 'interview_marathoner',
        title: 'Interview Marathoner',
        description: 'Completed 3 or more technical mock interview practice sessions.',
        icon: Award,
        category: 'interview',
        rarity: 'Legendary',
        xpReward: 200,
        unlocked: totalInterviews >= 3,
        unlockDate: totalInterviews >= 3 ? 'Earned' : undefined,
        progressPercent: Math.min(100, Math.round((totalInterviews / 3) * 100)),
        currentValue: totalInterviews,
        targetValue: 3,
        requirementText: 'Complete 3 mock interview rounds',
        gradient: 'from-orange-500 to-red-600',
      },
      {
        id: 'streak_titan',
        title: 'Streak Titan',
        description: 'Built a 3+ day consecutive daily learning consistency habit.',
        icon: Flame,
        category: 'consistency',
        rarity: 'Legendary',
        xpReward: 250,
        unlocked: streakState.currentStreak >= 3 || streakState.longestStreak >= 3,
        unlockDate: (streakState.currentStreak >= 3 || streakState.longestStreak >= 3) ? 'Earned' : undefined,
        progressPercent: Math.min(100, Math.round((Math.max(streakState.currentStreak, streakState.longestStreak) / 3) * 100)),
        currentValue: Math.max(streakState.currentStreak, streakState.longestStreak),
        targetValue: 3,
        requirementText: 'Maintain 3 consecutive active days streak',
        gradient: 'from-rose-500 to-amber-600',
      },
    ];
  }, [interviewHistory, masteredConceptsCount, streakState]);

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  const handleBadgeClick = (badge: InterviewBadge) => {
    setSelectedBadge(badge);
    audioEngine.playLoFiChord();
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* ========================================================================= */}
      {/* 1. VISUAL LEARNING STREAK & CONSISTENCY COUNTER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-charcoal to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Active Flame & Streak Count */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div
                animate={{
                  scale: streakState.todayCompleted ? [1, 1.08, 1] : 1,
                  rotate: streakState.todayCompleted ? [0, -3, 3, 0] : 0,
                }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center shadow-2xl relative ${
                  streakState.currentStreak > 0
                    ? 'bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 text-white shadow-orange-500/40'
                    : 'bg-white/10 text-white/50 border border-white/10'
                }`}
              >
                <Flame className="w-9 h-9 sm:w-11 sm:h-11 fill-current filter drop-shadow-md" />
                {streakState.todayCompleted && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md border-2 border-slate-900">
                    ✓
                  </span>
                )}
              </motion.div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                  Learning Streak
                </span>
                <span className="text-[10px] font-mono text-white/60">
                  Best: <strong className="text-white">{streakState.longestStreak} days</strong>
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {streakState.currentStreak} {streakState.currentStreak === 1 ? 'Day' : 'Days'} Active
                </h2>
                <span className="text-xs font-mono font-bold text-orange-400">
                  {streakState.todayCompleted ? '🔥 Blaze Maintained' : '⏳ Action Needed'}
                </span>
              </div>

              <p className="text-xs text-white/70 max-w-md">
                {streakState.todayCompleted 
                  ? "Today's learning consistency goal achieved! Your streak is secured for today." 
                  : "Complete a quick lesson or mock interview practice to protect your streak before midnight."}
              </p>
            </div>
          </div>

          {/* Right: Milestone Progress & Check-in Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5 min-w-[200px]">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-white/80 font-bold flex items-center gap-1">
                  <span>{streakState.currentMilestone.badgeEmoji}</span>
                  <span>{streakState.currentMilestone.title}</span>
                </span>
                <span className="text-orange-400 font-bold">{streakState.currentStreak}/{streakState.currentMilestone.nextMilestoneDays} d</span>
              </div>
              
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${streakState.currentMilestone.progressPercent}%` }}
                />
              </div>

              <span className="text-[9.5px] text-white/60 block font-mono">
                {streakState.currentMilestone.description}
              </span>
            </div>

            {!streakState.todayCompleted && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onMarkLessonComplete}
                className="px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Log Daily Activity</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* 7-Day Weekly Activity Calendar Trail */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold text-white/60">
              7-Day Activity Calendar Trail
            </span>
            <span className="text-[10.5px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {streakState.totalDaysActive} Total Study Days Recorded
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {streakState.weeklyActivity.map((day, idx) => {
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    day.completed
                      ? 'bg-orange-500/20 border-orange-500/50 text-white'
                      : day.isToday
                      ? 'bg-white/10 border-amber-400/60 text-white shadow-xs'
                      : 'bg-white/5 border-white/5 text-white/40'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase block opacity-80">
                    {day.dayName}
                  </span>
                  
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${
                    day.completed 
                      ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-xs' 
                      : day.isToday
                      ? 'border-2 border-dashed border-amber-400 text-amber-300'
                      : 'bg-white/5 text-white/40'
                  }`}>
                    {day.completed ? '🔥' : day.dayNumber}
                  </div>

                  <span className="text-[9px] font-mono font-bold">
                    {day.completed ? 'Active' : day.isToday ? 'Today' : 'Rest'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DAILY LEARNING GOAL TRACKER CARD */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-orange-500/10 border-2 border-brand-amber/35 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Header Title & Progress Ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-brand-sand stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-amber stroke-current transition-all duration-700 ease-out"
                  strokeDasharray={`${goalProgressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display font-black text-xs text-brand-charcoal">
                {goalProgressPercent}%
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark border border-brand-amber/30">
                  Daily Learning Goal
                </span>
                <span className="text-[11px] font-mono font-bold text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  +{totalEarnedXp} XP Earned Today
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-black text-brand-charcoal mt-0.5 flex items-center gap-2">
                <span>{completedGoalsCount} of {totalGoals} Goals Completed</span>
                {goalProgressPercent === 100 && <span>🎉</span>}
              </h3>
              <p className="text-xs text-brand-slate">
                {goalProgressPercent === 100 
                  ? "Outstanding! You've crushed all your daily learning objectives and earned your streak reward." 
                  : "Complete today's learning objectives to earn milestone badges and keep your streak blazing."}
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLaunchInterview}
              className="px-4 py-2 rounded-2xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-brand-amber" />
              <span>Practice Mock Interview</span>
            </motion.button>
          </div>
        </div>

        {/* 3 Step Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {dailyGoals.map((goal) => {
            const Icon = goal.icon;
            return (
              <div
                key={goal.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  goal.isCompleted 
                    ? 'bg-emerald-500/[0.06] border-emerald-500/30 text-emerald-950 shadow-2xs' 
                    : 'bg-white border-brand-slate/15 hover:border-brand-slate/30'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${goal.isCompleted ? 'bg-emerald-500 text-white' : 'bg-brand-sand/50 text-brand-slate'}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      goal.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-sand text-brand-slate'
                    }`}>
                      +{goal.xp} XP
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-xs text-brand-charcoal leading-snug">
                    {goal.title}
                  </h4>
                  <p className="text-[11px] text-brand-slate leading-relaxed">
                    {goal.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-brand-slate/10 flex items-center justify-between">
                  <span className={`text-[10.5px] font-mono font-bold flex items-center gap-1.5 ${
                    goal.isCompleted ? 'text-emerald-700' : 'text-brand-muted'
                  }`}>
                    {goal.isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4" />}
                    <span>{goal.isCompleted ? 'Done for Today' : 'Pending'}</span>
                  </span>

                  {!goal.isCompleted && (
                    <button
                      onClick={goal.onAction}
                      className="text-[11px] font-bold text-brand-amber hover:text-brand-amber-dark flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{goal.actionLabel}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INTERVIEW REWARDS & MILESTONE BADGES SHOWCASE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/10 pb-3">
          <div>
            <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-amber" />
              <span>Interview Rewards & Milestone Badges</span>
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">
              Unlock exclusive scholar badges and bonus XP by completing mock interview rounds and demonstrating technical mastery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-amber-dark text-xs font-mono font-bold">
              {unlockedBadgesCount} / {badges.length} Badges Unlocked
            </span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBadgeClick(badge)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-white via-brand-sand/15 to-white border-brand-amber/40 shadow-xs'
                    : 'bg-brand-sand/15 border-brand-slate/10 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Top Badge Icon & Rarity Tag */}
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md ${
                    badge.unlocked 
                      ? `bg-gradient-to-tr ${badge.gradient} text-white shadow-brand-amber/20` 
                      : 'bg-brand-sand text-brand-slate/40'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                    badge.rarity === 'Legendary' ? 'bg-orange-500/20 text-orange-800' :
                    badge.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-800' :
                    badge.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {badge.rarity}
                  </span>
                </div>

                {/* Badge Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-bold text-xs text-brand-charcoal">
                      {badge.title}
                    </h4>
                    {badge.unlocked && (
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10.5px] text-brand-muted line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Progress or Unlocked Status */}
                <div className="pt-2 border-t border-brand-slate/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-brand-slate font-bold">
                      {badge.unlocked ? 'Unlocked' : `${badge.currentValue}/${badge.targetValue}`}
                    </span>
                    <span className="text-brand-amber font-bold">+{badge.xpReward} XP</span>
                  </div>

                  {/* Mini Progress Bar */}
                  {!badge.unlocked && (
                    <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-amber rounded-full transition-all duration-500"
                        style={{ width: `${badge.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BADGE DETAIL POPUP MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-brand-slate/20 space-y-5 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-amber/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col items-center space-y-3">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
                  selectedBadge.unlocked
                    ? `bg-gradient-to-tr ${selectedBadge.gradient} text-white shadow-brand-amber/30`
                    : 'bg-brand-sand text-brand-slate/40'
                }`}>
                  <selectedBadge.icon className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    selectedBadge.rarity === 'Legendary' ? 'bg-orange-500/20 text-orange-800' :
                    selectedBadge.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-800' :
                    selectedBadge.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedBadge.rarity} Badge • +{selectedBadge.xpReward} XP
                  </span>

                  <h3 className="font-display text-lg font-black text-brand-charcoal">
                    {selectedBadge.title}
                  </h3>

                  <p className="text-xs text-brand-slate max-w-xs mx-auto leading-relaxed">
                    {selectedBadge.description}
                  </p>
                </div>
              </div>

              {/* Requirement Box */}
              <div className="p-3.5 rounded-2xl bg-brand-sand/20 border border-brand-slate/15 text-left text-xs space-y-1.5">
                <span className="font-mono text-[9.5px] uppercase font-bold text-brand-muted block">
                  Unlock Requirement:
                </span>
                <p className="font-bold text-brand-charcoal text-xs">
                  {selectedBadge.requirementText}
                </p>
                
                <div className="pt-2 border-t border-brand-slate/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-brand-slate">Progress:</span>
                  <span className="font-bold text-brand-amber">{selectedBadge.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-brand-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-amber to-orange-500 rounded-full"
                    style={{ width: `${selectedBadge.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 rounded-2xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close Badge Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
