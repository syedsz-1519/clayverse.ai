/**
 * BadgeEngine & Student Achievement Progression Engine
 * Programmatically tracks, evaluates, and awards visual achievement badges
 * across learning milestones, mock interview records, streak consistency,
 * camera tracking gaze, and community peer review participation.
 */

import { MockInterviewRecord } from '../types';
import { DailyStreakState } from './streakManager';

export type BadgeCategory = 'curriculum' | 'interview' | 'confidence' | 'consistency' | 'community';
export type BadgeTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface AchievementBadge {
  id: string;
  title: string;
  titleHyd?: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  iconName: string;
  badgeEmoji: string;
  gradient: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  xpReward: number;
  unlocked: boolean;
  unlockDate?: string;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  requirementText: string;
  rarityPercent: number; // e.g. 15% of students unlocked
}

export interface StudentProgressMetrics {
  completedLessonsCount: number;
  completedLessonIds: string[];
  totalInterviewsCount: number;
  highestInterviewScore: number;
  averageInterviewScore: number;
  strongHireCount: number;
  seniorStaffPassCount: number;
  averageEyeContact: number;
  currentStreakDays: number;
  longestStreakDays: number;
  totalStudyDays: number;
  peerReviewsGivenCount: number;
  transcriptsSubmittedCount: number;
}

export interface StudentLevelProfile {
  totalXp: number;
  currentLevel: number;
  levelTitle: string;
  levelBadgeEmoji: string;
  currentLevelXp: number;
  nextLevelXpThreshold: number;
  levelProgressPercent: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  badges: AchievementBadge[];
}

const BADGE_DEFINITIONS: Omit<AchievementBadge, 'unlocked' | 'unlockDate' | 'currentValue' | 'progressPercent'>[] = [
  // 1. CURRICULUM MASTERY
  {
    id: 'first_step_ai',
    title: 'First Step into Clayverse',
    titleHyd: 'AI ki Pehli Manzil',
    description: 'Complete your first interactive lesson in the AI curriculum.',
    category: 'curriculum',
    tier: 'Bronze',
    iconName: 'Sparkles',
    badgeEmoji: '🌱',
    gradient: 'from-amber-400 to-orange-500',
    borderClass: 'border-amber-400/50',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-700',
    xpReward: 100,
    targetValue: 1,
    requirementText: 'Complete 1 core curriculum lesson',
    rarityPercent: 88
  },
  {
    id: 'neural_architect',
    title: 'Neural Architect',
    titleHyd: 'Neural Network Mahir',
    description: 'Master Supervised, Unsupervised learning, and multi-layer neural synapses.',
    category: 'curriculum',
    tier: 'Silver',
    iconName: 'Network',
    badgeEmoji: '🧠',
    gradient: 'from-blue-500 to-indigo-600',
    borderClass: 'border-blue-400/50',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-700',
    xpReward: 250,
    targetValue: 3,
    requirementText: 'Complete 3 curriculum modules',
    rarityPercent: 64
  },
  {
    id: 'prompt_artisan',
    title: 'Prompt & RAG Artisan',
    titleHyd: 'Prompting aur RAG Specialist',
    description: 'Complete Prompting, Vector Embeddings, and RAG Architecture modules.',
    category: 'curriculum',
    tier: 'Gold',
    iconName: 'Terminal',
    badgeEmoji: '⚡',
    gradient: 'from-emerald-400 to-teal-600',
    borderClass: 'border-emerald-400/50',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-700',
    xpReward: 400,
    targetValue: 5,
    requirementText: 'Complete 5 curriculum modules',
    rarityPercent: 42
  },
  {
    id: 'curriculum_conqueror',
    title: 'Curriculum Conqueror',
    titleHyd: 'Mukammal AI Syllabus Fateh',
    description: 'Complete all 9 core lessons, flashcard decks, and AI Arena challenges.',
    category: 'curriculum',
    tier: 'Diamond',
    iconName: 'Award',
    badgeEmoji: '👑',
    gradient: 'from-purple-600 via-pink-500 to-amber-400',
    borderClass: 'border-purple-400/50',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-700',
    xpReward: 1000,
    targetValue: 9,
    requirementText: 'Complete all 9 curriculum lessons',
    rarityPercent: 12
  },

  // 2. MOCK INTERVIEW MASTERY
  {
    id: 'hot_seat_debut',
    title: 'Hot Seat Debut',
    titleHyd: 'Pehla Mock Interview',
    description: 'Complete your first live AI technical mock interview session.',
    category: 'interview',
    tier: 'Bronze',
    iconName: 'Video',
    badgeEmoji: '🎙️',
    gradient: 'from-orange-500 to-amber-500',
    borderClass: 'border-orange-400/50',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-700',
    xpReward: 150,
    targetValue: 1,
    requirementText: 'Complete 1 full mock interview round',
    rarityPercent: 75
  },
  {
    id: 'technical_titan',
    title: 'Technical Titan (90%+)',
    titleHyd: 'Technical Titan 90%+',
    description: 'Score 90% or higher on an AI/ML or LLM Engineer interview round.',
    category: 'interview',
    tier: 'Gold',
    iconName: 'Trophy',
    badgeEmoji: '🏆',
    gradient: 'from-amber-400 to-yellow-500',
    borderClass: 'border-amber-400/60',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-800',
    xpReward: 500,
    targetValue: 90,
    requirementText: 'Score 90%+ in any mock interview',
    rarityPercent: 28
  },
  {
    id: 'strong_hire_trio',
    title: 'Unanimous Strong Hire',
    titleHyd: 'Strong Hire Champion',
    description: 'Receive 3 "Strong Hire" decisions from different AI interviewer personas.',
    category: 'interview',
    tier: 'Platinum',
    iconName: 'CheckCircle2',
    badgeEmoji: '⭐',
    gradient: 'from-teal-400 to-emerald-600',
    borderClass: 'border-teal-400/60',
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-800',
    xpReward: 750,
    targetValue: 3,
    requirementText: 'Earn 3 "Strong Hire" decisions',
    rarityPercent: 18
  },
  {
    id: 'rising_star',
    title: 'Rising Star',
    titleHyd: 'Umeed-e-Sahar (Rising Star)',
    description: 'Score 80% or higher on a mock interview, demonstrating outstanding foundational growth.',
    category: 'interview',
    tier: 'Bronze',
    iconName: 'Star',
    badgeEmoji: '🌟',
    gradient: 'from-amber-400 to-orange-500',
    borderClass: 'border-amber-400/60',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-800',
    xpReward: 300,
    targetValue: 80,
    requirementText: 'Score 80%+ on any mock interview session',
    rarityPercent: 62
  },
  {
    id: 'system_design_pro',
    title: 'System Design Pro',
    titleHyd: 'System Design Mahir',
    description: 'Pass a System Design or Distributed AI Architecture interview with an 85%+ score.',
    category: 'interview',
    tier: 'Gold',
    iconName: 'Network',
    badgeEmoji: '🏗️',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    borderClass: 'border-blue-400/60',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-800',
    xpReward: 600,
    targetValue: 85,
    requirementText: 'Score 85%+ on a System Design interview round',
    rarityPercent: 22
  },
  {
    id: 'algorithm_ace',
    title: 'Algorithm Ace',
    titleHyd: 'Algorithms Ace',
    description: 'Score 90%+ in technical algorithmic problem solving and optimization analysis.',
    category: 'interview',
    tier: 'Silver',
    iconName: 'Terminal',
    badgeEmoji: '⚡',
    gradient: 'from-emerald-500 to-teal-600',
    borderClass: 'border-emerald-400/60',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-800',
    xpReward: 450,
    targetValue: 90,
    requirementText: 'Score 90%+ in technical accuracy',
    rarityPercent: 35
  },
  {
    id: 'senior_staff_caliber',
    title: 'Senior & Staff Caliber',
    titleHyd: 'Senior Engineer Caliber',
    description: 'Successfully pass a Senior or Staff level Systems & Architecture mock interview.',
    category: 'interview',
    tier: 'Diamond',
    iconName: 'Zap',
    badgeEmoji: '💎',
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
    borderClass: 'border-indigo-400/60',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-800',
    xpReward: 900,
    targetValue: 1,
    requirementText: 'Pass a Senior or Staff level interview round',
    rarityPercent: 9
  },

  // 3. CONFIDENCE & NON-VERBAL EXCELLENCE
  {
    id: 'laser_focus_gaze',
    title: 'Laser-Focused Gaze',
    titleHyd: 'Behtareen Eye Contact',
    description: 'Maintain 92% or higher camera eye-contact during an entire interview.',
    category: 'confidence',
    tier: 'Silver',
    iconName: 'Eye',
    badgeEmoji: '🎯',
    gradient: 'from-cyan-400 to-blue-600',
    borderClass: 'border-cyan-400/50',
    bgClass: 'bg-cyan-500/10',
    textClass: 'text-cyan-700',
    xpReward: 300,
    targetValue: 92,
    requirementText: 'Achieve 92%+ camera eye contact',
    rarityPercent: 46
  },
  {
    id: 'executive_articulation',
    title: 'Executive Articulation',
    titleHyd: 'Pur-Aetemad Guftagu',
    description: 'Deliver an interview with 85%+ speech confidence and low filler word rate.',
    category: 'confidence',
    tier: 'Gold',
    iconName: 'Mic',
    badgeEmoji: '🗣️',
    gradient: 'from-violet-500 to-purple-600',
    borderClass: 'border-violet-400/50',
    bgClass: 'bg-violet-500/10',
    textClass: 'text-violet-800',
    xpReward: 450,
    targetValue: 85,
    requirementText: 'Achieve 85%+ speech confidence score',
    rarityPercent: 32
  },

  // 4. CONSISTENCY & DAILY HABIT
  {
    id: 'daily_spark',
    title: 'Spark of Consistency',
    titleHyd: '3-Rooza Streak',
    description: 'Maintain an active daily learning streak for 3 consecutive days.',
    category: 'consistency',
    tier: 'Bronze',
    iconName: 'Flame',
    badgeEmoji: '🔥',
    gradient: 'from-orange-500 to-amber-500',
    borderClass: 'border-orange-400/50',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-700',
    xpReward: 150,
    targetValue: 3,
    requirementText: 'Achieve a 3-day daily streak',
    rarityPercent: 70
  },
  {
    id: 'unstoppable_scholar',
    title: '7-Day Scholar Streak',
    titleHyd: 'Hafta-war Consistency Champion',
    description: 'Maintain a 7-day unbroken learning streak without missing a single day.',
    category: 'consistency',
    tier: 'Silver',
    iconName: 'ShieldCheck',
    badgeEmoji: '⚡',
    gradient: 'from-amber-500 to-orange-600',
    borderClass: 'border-amber-500/60',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-800',
    xpReward: 350,
    targetValue: 7,
    requirementText: 'Reach a 7-day daily study streak',
    rarityPercent: 38
  },
  {
    id: 'relentless_mastermind',
    title: '14-Day Relentless Mastermind',
    titleHyd: '14-Rooza Deep Learner',
    description: 'Keep the learning fire burning for 14 continuous days.',
    category: 'consistency',
    tier: 'Gold',
    iconName: 'Flame',
    badgeEmoji: '🌟',
    gradient: 'from-red-500 via-orange-500 to-amber-400',
    borderClass: 'border-red-400/50',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-700',
    xpReward: 600,
    targetValue: 14,
    requirementText: 'Reach a 14-day study streak',
    rarityPercent: 19
  },

  // 5. COMMUNITY & PEER REVIEW
  {
    id: 'peer_contributor',
    title: 'Community Peer Contributor',
    titleHyd: 'Community Peer Reviewer',
    description: 'Submit an anonymous interview transcript or leave a constructive peer review.',
    category: 'community',
    tier: 'Bronze',
    iconName: 'Users',
    badgeEmoji: '🤝',
    gradient: 'from-blue-400 to-indigo-500',
    borderClass: 'border-blue-400/50',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-700',
    xpReward: 200,
    targetValue: 1,
    requirementText: 'Submit or review 1 community transcript',
    rarityPercent: 55
  },
  {
    id: 'mentor_mindset',
    title: 'Scholar Mentor Mindset',
    titleHyd: 'Mentor & Feedback Champion',
    description: 'Leave 3+ in-depth constructive peer reviews on peer interview answers.',
    category: 'community',
    tier: 'Gold',
    iconName: 'HeartHandshake',
    badgeEmoji: '🎓',
    gradient: 'from-teal-500 to-emerald-600',
    borderClass: 'border-teal-400/50',
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-800',
    xpReward: 500,
    targetValue: 3,
    requirementText: 'Write 3 constructive peer reviews',
    rarityPercent: 24
  }
];

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'AI Explorer Apprentice', emoji: '🌱', xpRequired: 0 },
  { level: 2, title: 'Neural Tinkerer', emoji: '⚡', xpRequired: 300 },
  { level: 3, title: 'Prompt & Model Practitioner', emoji: '🛠️', xpRequired: 800 },
  { level: 4, title: 'Interview Candidate Pro', emoji: '🎯', xpRequired: 1600 },
  { level: 5, title: 'Senior AI Engineer Caliber', emoji: '👑', xpRequired: 2800 },
  { level: 6, title: 'Clayverse AI Grandmaster', emoji: '🌟', xpRequired: 4500 },
];

export class BadgeEngine {
  /**
   * Evaluate all badges against current student metrics and streak state
   */
  public static evaluateStudentProfile(
    completedLessonIds: string[],
    interviewHistory: MockInterviewRecord[],
    streakState: DailyStreakState,
    peerReviewsCount: number = 0,
    transcriptsSubmittedCount: number = 0
  ): StudentLevelProfile {
    const completedCount = completedLessonIds.length;
    const totalInterviews = interviewHistory.length;
    const highestScore = interviewHistory.reduce((max, r) => Math.max(max, r.overallScore), 0);
    const avgScore = totalInterviews > 0 
      ? Math.round(interviewHistory.reduce((sum, r) => sum + r.overallScore, 0) / totalInterviews)
      : 0;
    const strongHires = interviewHistory.filter(r => r.hiringDecision === 'Strong Hire').length;
    const seniorStaffPasses = interviewHistory.filter(
      r => (r.difficulty === 'Senior' || r.difficulty === 'Staff' || r.difficulty === 'Advanced') && (r.hiringDecision === 'Hire' || r.hiringDecision === 'Strong Hire')
    ).length;
    const avgEyeContact = totalInterviews > 0
      ? Math.round(interviewHistory.reduce((sum, r) => sum + r.eyeContactScore, 0) / totalInterviews)
      : (totalInterviews === 0 ? 0 : 92);

    const systemDesignBest = interviewHistory
      .filter(r => 
        r.roleTrack.toLowerCase().includes('system') || 
        r.roleTrack.toLowerCase().includes('architecture') ||
        (r.topics && r.topics.some(t => t.toLowerCase().includes('system') || t.toLowerCase().includes('architecture'))) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes('system') || t.toLowerCase().includes('architecture')))
      )
      .reduce((max, r) => Math.max(max, r.overallScore), 0);

    const algoBest = interviewHistory
      .filter(r => 
        r.roleTrack.toLowerCase().includes('algorithm') || 
        r.roleTrack.toLowerCase().includes('ml') || 
        r.roleTrack.toLowerCase().includes('ai') ||
        (r.topics && r.topics.some(t => t.toLowerCase().includes('algorithm') || t.toLowerCase().includes('deep learning'))) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes('algorithm') || t.toLowerCase().includes('deep learning')))
      )
      .reduce((max, r) => Math.max(max, r.technicalScore || r.overallScore), 0);

    let totalXp = 0;
    let unlockedCount = 0;

    const evaluatedBadges: AchievementBadge[] = BADGE_DEFINITIONS.map((def) => {
      let currentValue = 0;
      let unlocked = false;

      switch (def.id) {
        case 'first_step_ai':
          currentValue = completedCount;
          unlocked = completedCount >= def.targetValue;
          break;
        case 'neural_architect':
          currentValue = completedCount;
          unlocked = completedCount >= def.targetValue;
          break;
        case 'prompt_artisan':
          currentValue = completedCount;
          unlocked = completedCount >= def.targetValue;
          break;
        case 'curriculum_conqueror':
          currentValue = completedCount;
          unlocked = completedCount >= def.targetValue;
          break;
        case 'hot_seat_debut':
          currentValue = totalInterviews;
          unlocked = totalInterviews >= def.targetValue;
          break;
        case 'rising_star':
          currentValue = highestScore;
          unlocked = highestScore >= def.targetValue;
          break;
        case 'system_design_pro':
          currentValue = systemDesignBest;
          unlocked = systemDesignBest >= def.targetValue;
          break;
        case 'algorithm_ace':
          currentValue = algoBest;
          unlocked = algoBest >= def.targetValue;
          break;
        case 'technical_titan':
          currentValue = highestScore;
          unlocked = highestScore >= def.targetValue;
          break;
        case 'strong_hire_trio':
          currentValue = strongHires;
          unlocked = strongHires >= def.targetValue;
          break;
        case 'senior_staff_caliber':
          currentValue = seniorStaffPasses;
          unlocked = seniorStaffPasses >= def.targetValue;
          break;
        case 'laser_focus_gaze':
          currentValue = avgEyeContact;
          unlocked = avgEyeContact >= def.targetValue;
          break;
        case 'executive_articulation':
          const highestConfidence = interviewHistory.reduce((max, r) => Math.max(max, r.confidenceScore || 0), 0);
          currentValue = highestConfidence || (totalInterviews > 0 ? 88 : 0);
          unlocked = currentValue >= def.targetValue;
          break;
        case 'daily_spark':
          currentValue = Math.max(streakState.currentStreak, streakState.longestStreak);
          unlocked = currentValue >= def.targetValue;
          break;
        case 'unstoppable_scholar':
          currentValue = Math.max(streakState.currentStreak, streakState.longestStreak);
          unlocked = currentValue >= def.targetValue;
          break;
        case 'relentless_mastermind':
          currentValue = Math.max(streakState.currentStreak, streakState.longestStreak);
          unlocked = currentValue >= def.targetValue;
          break;
        case 'peer_contributor':
          currentValue = peerReviewsCount + transcriptsSubmittedCount;
          unlocked = currentValue >= def.targetValue;
          break;
        case 'mentor_mindset':
          currentValue = peerReviewsCount;
          unlocked = currentValue >= def.targetValue;
          break;
        default:
          currentValue = 0;
          unlocked = false;
      }

      const progressPercent = unlocked 
        ? 100 
        : Math.min(99, Math.round((currentValue / (def.targetValue || 1)) * 100));

      if (unlocked) {
        unlockedCount++;
        totalXp += def.xpReward;
      }

      return {
        ...def,
        unlocked,
        currentValue,
        progressPercent,
        unlockDate: unlocked ? 'Verified' : undefined
      };
    });

    // Base XP from completed lessons (50 XP each) and interviews (100 XP each)
    totalXp += (completedCount * 50) + (totalInterviews * 100);

    // Calculate Current Level
    let currentLevelObj = LEVEL_THRESHOLDS[0];
    let nextLevelObj = LEVEL_THRESHOLDS[1];

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (totalXp >= LEVEL_THRESHOLDS[i].xpRequired) {
        currentLevelObj = LEVEL_THRESHOLDS[i];
        nextLevelObj = LEVEL_THRESHOLDS[i + 1] || { ...LEVEL_THRESHOLDS[i], xpRequired: LEVEL_THRESHOLDS[i].xpRequired + 2000 };
      } else {
        break;
      }
    }

    const currentLevelBaseXp = currentLevelObj.xpRequired;
    const nextLevelTargetXp = nextLevelObj.xpRequired;
    const levelSpan = Math.max(1, nextLevelTargetXp - currentLevelBaseXp);
    const xpInCurrentLevel = totalXp - currentLevelBaseXp;
    const levelProgressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / levelSpan) * 100)));

    return {
      totalXp,
      currentLevel: currentLevelObj.level,
      levelTitle: currentLevelObj.title,
      levelBadgeEmoji: currentLevelObj.emoji,
      currentLevelXp: totalXp,
      nextLevelXpThreshold: nextLevelTargetXp,
      levelProgressPercent,
      unlockedBadgesCount: unlockedCount,
      totalBadgesCount: evaluatedBadges.length,
      badges: evaluatedBadges
    };
  }
}
