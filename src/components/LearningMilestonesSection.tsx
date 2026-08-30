import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Trophy,
  Sparkles,
  CheckCircle2,
  Lock,
  Star,
  Zap,
  Flame,
  ShieldCheck,
  Target,
  ChevronRight,
  Share2,
  Check,
  Brain,
  Layers,
  Filter,
  Play,
  X,
  TrendingUp,
  Medal,
  Crown,
  PartyPopper,
  Sparkle
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';
import { quizModules } from '../data/quizQuestions';
import { QuizSessionRecord } from './QuizPerformanceBarChart';
import MilestoneBadgeCelebrationModal from './MilestoneBadgeCelebrationModal';

export type MilestoneCategory = 'all' | 'completion' | 'threshold' | 'mastery';
export type MilestoneTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface LearningMilestone {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  description: {
    en: string;
    ur: string;
  };
  category: 'completion' | 'threshold' | 'mastery';
  tier: MilestoneTier;
  emoji: string;
  gradient: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  xpReward: number;
  unlocked: boolean;
  currentValue: number;
  targetValue: number;
  progressPercent: number;
  metricLabel: string;
  requirementText: {
    en: string;
    ur: string;
  };
  rarityPercent: number;
  targetSectionId?: string;
}

interface LearningMilestonesSectionProps {
  onNavigateSection?: (sectionId: string) => void;
  className?: string;
}

// Fallback initial sample sessions
const DEFAULT_SAMPLE_QUIZ_SESSIONS: QuizSessionRecord[] = [
  {
    id: 'quiz-sess-1',
    sectionId: 'm1-s1',
    sectionTitle: { en: 'AI Basics & History', ur: 'AI ka Shuruaat aur Tareekh' },
    timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
    scoreEarned: 50,
    correctCount: 5,
    totalCount: 5,
    practiceMode: false,
    streakApplied: 1,
    multiplierApplied: 1.0
  },
  {
    id: 'quiz-sess-2',
    sectionId: 'm1-s2',
    sectionTitle: { en: 'Machine Learning Intro', ur: 'Machine Learning ka Taaruf' },
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    scoreEarned: 40,
    correctCount: 4,
    totalCount: 5,
    practiceMode: false,
    streakApplied: 2,
    multiplierApplied: 1.1
  },
  {
    id: 'quiz-sess-3',
    sectionId: 'm2-s1',
    sectionTitle: { en: 'Perceptrons & Neurons', ur: 'Perceptrons aur Neurons' },
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    scoreEarned: 50,
    correctCount: 5,
    totalCount: 5,
    practiceMode: false,
    streakApplied: 3,
    multiplierApplied: 1.2
  },
  {
    id: 'quiz-sess-4',
    sectionId: 'm2-s2',
    sectionTitle: { en: 'Backpropagation & Loss', ur: 'Backpropagation aur Loss' },
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    scoreEarned: 30,
    correctCount: 3,
    totalCount: 5,
    practiceMode: false,
    streakApplied: 4,
    multiplierApplied: 1.3
  },
  {
    id: 'quiz-sess-5',
    sectionId: 'm3-s1',
    sectionTitle: { en: 'Evaluation Metrics', ur: 'Evaluation Metrics' },
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    scoreEarned: 40,
    correctCount: 4,
    totalCount: 5,
    practiceMode: false,
    streakApplied: 5,
    multiplierApplied: 1.4
  },
  {
    id: 'quiz-sess-6',
    sectionId: 'm4-s1',
    sectionTitle: { en: 'Self-Attention & Transformers', ur: 'Self-Attention aur Transformers' },
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    scoreEarned: 50,
    correctCount: 5,
    totalCount: 5,
    practiceMode: false,
    streakApplied: 6,
    multiplierApplied: 1.5
  },
  {
    id: 'quiz-sess-7',
    sectionId: 'm5-s1',
    sectionTitle: { en: 'AI Safety & Alignment', ur: 'AI Safety aur Alignment' },
    timestamp: new Date().toISOString(),
    scoreEarned: 40,
    correctCount: 4,
    totalCount: 5,
    practiceMode: false,
    streakApplied: 7,
    multiplierApplied: 1.5
  }
];

export default function LearningMilestonesSection({
  onNavigateSection,
  className = ''
}: LearningMilestonesSectionProps) {
  const { lang } = useLanguage();
  const [sessions, setSessions] = useState<QuizSessionRecord[]>([]);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [completedSectionIds, setCompletedSectionIds] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<MilestoneCategory>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<LearningMilestone | null>(null);
  const [celebratingMilestone, setCelebratingMilestone] = useState<LearningMilestone | null>(null);
  const [copiedShareToast, setCopiedShareToast] = useState(false);
  const previousUnlockedIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  // Load quiz progress from storage
  const loadQuizData = () => {
    try {
      const cachedSessions = localStorage.getItem('clay_quiz_sessions');
      let loadedSessions = DEFAULT_SAMPLE_QUIZ_SESSIONS;
      if (cachedSessions) {
        const parsed = JSON.parse(cachedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedSessions = parsed;
        }
      }
      setSessions(loadedSessions);

      const cachedScores = localStorage.getItem('clay_quiz_high_scores');
      if (cachedScores) {
        setHighScores(JSON.parse(cachedScores));
      } else {
        // Build high scores map from loaded sessions
        const map: Record<string, number> = {};
        loadedSessions.forEach(s => {
          if (!map[s.sectionId] || s.scoreEarned > map[s.sectionId]) {
            map[s.sectionId] = s.scoreEarned;
          }
        });
        setHighScores(map);
      }

      const cachedCompleted = localStorage.getItem('clay_quiz_completed_sections');
      if (cachedCompleted) {
        setCompletedSectionIds(JSON.parse(cachedCompleted));
      } else {
        const compMap: Record<string, boolean> = {};
        loadedSessions.forEach(s => {
          compMap[s.sectionId] = true;
        });
        setCompletedSectionIds(compMap);
      }
    } catch (e) {
      setSessions(DEFAULT_SAMPLE_QUIZ_SESSIONS);
    }
  };

  useEffect(() => {
    loadQuizData();

    const handleSync = () => {
      loadQuizData();
    };

    window.addEventListener('clay_auth_state_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('clay_auth_state_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Compute stats for milestones evaluation
  const stats = useMemo(() => {
    const totalQuizzesCompleted = sessions.length;
    let totalScore = 0;
    let perfectRunsCount = 0;
    let highScoreOver40Count = 0;
    let highestSingleScore = 0;
    let consecutivePerfectCount = 0;
    let maxConsecutivePerfect = 0;

    // Unique sections completed
    const uniqueSectionsCompleted = new Set(sessions.map(s => s.sectionId)).size;

    // Module-wise completion count
    const moduleDoneCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    quizModules.forEach(mod => {
      const sectionIds = mod.sections.map(s => s.id);
      const doneSectionsInMod = sectionIds.filter(id => {
        return sessions.some(s => s.sectionId === id) || completedSectionIds[id];
      }).length;
      moduleDoneCounts[mod.number] = doneSectionsInMod;
    });

    // Check accuracy and streak runs
    sessions.forEach(s => {
      totalScore += s.scoreEarned || 0;
      if (s.scoreEarned > highestSingleScore) highestSingleScore = s.scoreEarned;
      if (s.scoreEarned >= 40) highScoreOver40Count++;
      if (s.scoreEarned >= 50 && s.correctCount === s.totalCount) {
        perfectRunsCount++;
        consecutivePerfectCount++;
        if (consecutivePerfectCount > maxConsecutivePerfect) {
          maxConsecutivePerfect = consecutivePerfectCount;
        }
      } else {
        consecutivePerfectCount = 0;
      }
    });

    const hasAdvancedHighScorer = sessions.some(
      s => (s.sectionId.startsWith('m4-') || s.sectionId.startsWith('m5-')) && (s.correctCount / (s.totalCount || 5)) >= 0.8
    );

    return {
      totalQuizzesCompleted,
      uniqueSectionsCompleted,
      totalScore,
      perfectRunsCount,
      highScoreOver40Count,
      highestSingleScore,
      maxConsecutivePerfect,
      moduleDoneCounts,
      hasAdvancedHighScorer
    };
  }, [sessions, completedSectionIds]);

  // Define Learning Milestones with dynamic thresholds and badge calculations
  const milestones: LearningMilestone[] = useMemo(() => {
    const list: LearningMilestone[] = [
      // 1. QUIZ COMPLETION MILESTONES
      {
        id: 'quiz_pioneer',
        title: { en: 'Quiz Arena Pioneer', ur: 'Quiz Arena ka Pehla Kadam' },
        description: {
          en: 'Complete your first interactive challenge in the AI Championship Arena.',
          ur: 'AI Championship Arena me apna pehla quiz mukammal karein.'
        },
        category: 'completion',
        tier: 'Bronze',
        emoji: '🌱',
        gradient: 'from-amber-400 to-orange-500',
        borderClass: 'border-amber-400/40',
        bgClass: 'bg-amber-500/10',
        textClass: 'text-amber-800',
        xpReward: 100,
        unlocked: stats.totalQuizzesCompleted >= 1,
        currentValue: stats.totalQuizzesCompleted,
        targetValue: 1,
        progressPercent: Math.min(100, Math.round((stats.totalQuizzesCompleted / 1) * 100)),
        metricLabel: 'Quizzes Completed',
        requirementText: {
          en: 'Complete 1 quiz session',
          ur: '1 quiz session mukammal karein'
        },
        rarityPercent: 92,
        targetSectionId: 'm1-s1'
      },
      {
        id: 'foundations_scholar',
        title: { en: 'Foundations Scholar', ur: 'AI Bunyadiat Mahir' },
        description: {
          en: 'Conquer all 3 foundational quiz topics in Module 1: AI & ML Basics.',
          ur: 'Module 1 ke tamam 3 bunyadi sections ke tests kamyabi se pass karein.'
        },
        category: 'completion',
        tier: 'Bronze',
        emoji: '🧠',
        gradient: 'from-amber-500 to-yellow-600',
        borderClass: 'border-amber-500/40',
        bgClass: 'bg-amber-500/10',
        textClass: 'text-amber-900',
        xpReward: 200,
        unlocked: (stats.moduleDoneCounts[1] || 0) >= 3,
        currentValue: stats.moduleDoneCounts[1] || 0,
        targetValue: 3,
        progressPercent: Math.min(100, Math.round(((stats.moduleDoneCounts[1] || 0) / 3) * 100)),
        metricLabel: 'Module 1 Sections',
        requirementText: {
          en: 'Complete all 3 sections in Module 1',
          ur: 'Module 1 ke tamam 3 sections clear karein'
        },
        rarityPercent: 78,
        targetSectionId: 'm1-s2'
      },
      {
        id: 'neural_synergy',
        title: { en: 'Neural Architect', ur: 'Neural Synapses Fateh' },
        description: {
          en: 'Master Perceptrons, Multi-Layer Perceptrons, and Backpropagation quizzes in Module 2.',
          ur: 'Module 2 ke Perceptrons aur Backpropagation tests mukammal karein.'
        },
        category: 'completion',
        tier: 'Silver',
        emoji: '⚡',
        gradient: 'from-emerald-500 to-teal-600',
        borderClass: 'border-emerald-500/40',
        bgClass: 'bg-emerald-500/10',
        textClass: 'text-emerald-800',
        xpReward: 350,
        unlocked: (stats.moduleDoneCounts[2] || 0) >= 2,
        currentValue: stats.moduleDoneCounts[2] || 0,
        targetValue: 3,
        progressPercent: Math.min(100, Math.round(((stats.moduleDoneCounts[2] || 0) / 3) * 100)),
        metricLabel: 'Module 2 Sections',
        requirementText: {
          en: 'Complete 3 sections in Deep Learning & Neural Nets',
          ur: 'Module 2 ke sections pass karein'
        },
        rarityPercent: 55,
        targetSectionId: 'm2-s1'
      },
      {
        id: 'transformer_artisan',
        title: { en: 'Transformer & LLM Artisan', ur: 'Transformer aur LLM Specialist' },
        description: {
          en: 'Pass Self-Attention, Positional Encoding, and Prompt Engineering evaluation quizzes in Module 4.',
          ur: 'Module 4 Self-Attention aur Prompting ke tests clear karein.'
        },
        category: 'completion',
        tier: 'Gold',
        emoji: '🔥',
        gradient: 'from-purple-500 to-indigo-600',
        borderClass: 'border-purple-500/40',
        bgClass: 'bg-purple-500/10',
        textClass: 'text-purple-800',
        xpReward: 500,
        unlocked: (stats.moduleDoneCounts[4] || 0) >= 1,
        currentValue: stats.moduleDoneCounts[4] || 0,
        targetValue: 3,
        progressPercent: Math.min(100, Math.round(((stats.moduleDoneCounts[4] || 0) / 3) * 100)),
        metricLabel: 'Module 4 Sections',
        requirementText: {
          en: 'Complete GenAI & Transformer quizzes',
          ur: 'Transformers ke tests mukammal karein'
        },
        rarityPercent: 32,
        targetSectionId: 'm4-s1'
      },
      {
        id: 'arena_grandmaster',
        title: { en: 'Arena Grandmaster', ur: 'AI Arena Grandmaster' },
        description: {
          en: 'Achieve total curriculum coverage by completing 10 or more distinct quiz sections across all modules.',
          ur: 'Tamam modules ke 10 ya us se zyada mukhtalif quiz sections clear karein.'
        },
        category: 'completion',
        tier: 'Diamond',
        emoji: '👑',
        gradient: 'from-amber-400 via-rose-500 to-purple-600',
        borderClass: 'border-amber-400/50',
        bgClass: 'bg-amber-500/10',
        textClass: 'text-amber-900',
        xpReward: 1000,
        unlocked: stats.uniqueSectionsCompleted >= 10,
        currentValue: stats.uniqueSectionsCompleted,
        targetValue: 10,
        progressPercent: Math.min(100, Math.round((stats.uniqueSectionsCompleted / 10) * 100)),
        metricLabel: 'Unique Sections',
        requirementText: {
          en: 'Complete 10 distinct quiz sections',
          ur: '10 mukhtalif quiz sections clear karein'
        },
        rarityPercent: 12,
        targetSectionId: 'm5-s1'
      },

      // 2. SCORE THRESHOLD BADGES
      {
        id: 'sharp_shooter_80',
        title: { en: 'Benchmark Marksman (80%+)', ur: '80% Benchmark Marksman' },
        description: {
          en: 'Score 80% (4 out of 5 questions correct) or higher in any quiz session.',
          ur: 'Kisi bhi quiz me 80% ya 4 durust jawab haasil karein.'
        },
        category: 'threshold',
        tier: 'Bronze',
        emoji: '🎯',
        gradient: 'from-blue-500 to-indigo-600',
        borderClass: 'border-blue-500/40',
        bgClass: 'bg-blue-500/10',
        textClass: 'text-blue-800',
        xpReward: 150,
        unlocked: stats.highScoreOver40Count >= 1,
        currentValue: stats.highScoreOver40Count,
        targetValue: 1,
        progressPercent: stats.highScoreOver40Count >= 1 ? 100 : 0,
        metricLabel: '80%+ Attempts',
        requirementText: {
          en: 'Score ≥80% on any quiz',
          ur: 'Kisi bhi quiz me 80%+ marks lein'
        },
        rarityPercent: 84
      },
      {
        id: 'perfect_50_bullseye',
        title: { en: 'Flawless Bullseye (100%)', ur: '100% Perfect Bullseye' },
        description: {
          en: 'Attain a flawless 100% score (50/50 points, 5/5 correct answers) in a single quiz session.',
          ur: 'Pehli koshish me 50/50 points (5/5 sahi jawab) haasil karein.'
        },
        category: 'threshold',
        tier: 'Silver',
        emoji: '⭐',
        gradient: 'from-amber-400 to-yellow-500',
        borderClass: 'border-amber-400/50',
        bgClass: 'bg-amber-500/10',
        textClass: 'text-amber-800',
        xpReward: 300,
        unlocked: stats.perfectRunsCount >= 1,
        currentValue: stats.perfectRunsCount,
        targetValue: 1,
        progressPercent: stats.perfectRunsCount >= 1 ? 100 : 0,
        metricLabel: 'Perfect 100% Runs',
        requirementText: {
          en: 'Score 50/50 points in 1 quiz',
          ur: '1 quiz me 50/50 points lein'
        },
        rarityPercent: 48
      },
      {
        id: 'triple_perfect_streak',
        title: { en: 'Hat-Trick Perfectionist', ur: '3 Perfect Runs Hat-Trick' },
        description: {
          en: 'Score 3 perfect 100% runs, demonstrating deep mastery and consistency.',
          ur: '3 mukhtalif quizzes me mukammal 100% score haasil karein.'
        },
        category: 'threshold',
        tier: 'Gold',
        emoji: '🏆',
        gradient: 'from-amber-500 to-orange-600',
        borderClass: 'border-amber-500/50',
        bgClass: 'bg-amber-500/10',
        textClass: 'text-amber-900',
        xpReward: 600,
        unlocked: stats.perfectRunsCount >= 3,
        currentValue: stats.perfectRunsCount,
        targetValue: 3,
        progressPercent: Math.min(100, Math.round((stats.perfectRunsCount / 3) * 100)),
        metricLabel: 'Perfect Runs',
        requirementText: {
          en: 'Earn 3 perfect 50/50 scores',
          ur: '3 perfect scores haasil karein'
        },
        rarityPercent: 24
      },
      {
        id: 'xp_centurion',
        title: { en: 'Quiz XP Titan (250+ XP)', ur: 'Quiz XP Titan 250+' },
        description: {
          en: 'Accumulate 250 or more total XP points solely through Arena challenge quizzes.',
          ur: 'Quiz Arena se 250 ya us se zyada total XP points jama karein.'
        },
        category: 'threshold',
        tier: 'Platinum',
        emoji: '💎',
        gradient: 'from-teal-400 to-emerald-600',
        borderClass: 'border-teal-400/50',
        bgClass: 'bg-teal-500/10',
        textClass: 'text-teal-800',
        xpReward: 750,
        unlocked: stats.totalScore >= 250,
        currentValue: stats.totalScore,
        targetValue: 250,
        progressPercent: Math.min(100, Math.round((stats.totalScore / 250) * 100)),
        metricLabel: 'Total Quiz Points',
        requirementText: {
          en: 'Earn 250+ Quiz XP points',
          ur: '250+ Quiz XP jama karein'
        },
        rarityPercent: 18
      },

      // 3. MASTERY MILESTONES
      {
        id: 'advanced_domain_master',
        title: { en: 'Advanced Domain Champion', ur: 'Advanced AI Domain Fateh' },
        description: {
          en: 'Score 80%+ in advanced LLM Architectures or AI Safety & Ethics modules.',
          ur: 'Transformers ya AI Safety ke advanced sections me 80%+ score karein.'
        },
        category: 'mastery',
        tier: 'Gold',
        emoji: '🛡️',
        gradient: 'from-indigo-600 via-purple-600 to-pink-500',
        borderClass: 'border-indigo-500/40',
        bgClass: 'bg-indigo-500/10',
        textClass: 'text-indigo-800',
        xpReward: 500,
        unlocked: stats.hasAdvancedHighScorer,
        currentValue: stats.hasAdvancedHighScorer ? 1 : 0,
        targetValue: 1,
        progressPercent: stats.hasAdvancedHighScorer ? 100 : 0,
        metricLabel: 'Advanced Mastery',
        requirementText: {
          en: 'Score 80%+ on Module 4 or 5',
          ur: 'Module 4 ya 5 me 80%+ lein'
        },
        rarityPercent: 28,
        targetSectionId: 'm4-s1'
      },
      {
        id: 'flawless_consistency',
        title: { en: 'High Caliber Veteran', ur: 'High Caliber Veteran' },
        description: {
          en: 'Complete 5 or more total quizzes maintaining an average score threshold above 40 points.',
          ur: '5 se zyada quizzes pass karein jin me ausat score 40 points se buland ho.'
        },
        category: 'mastery',
        tier: 'Diamond',
        emoji: '🌟',
        gradient: 'from-amber-400 via-orange-500 to-red-500',
        borderClass: 'border-orange-500/50',
        bgClass: 'bg-orange-500/10',
        textClass: 'text-orange-900',
        xpReward: 900,
        unlocked: stats.totalQuizzesCompleted >= 5 && stats.highScoreOver40Count >= 4,
        currentValue: stats.highScoreOver40Count,
        targetValue: 4,
        progressPercent: Math.min(100, Math.round((stats.highScoreOver40Count / 4) * 100)),
        metricLabel: 'High-Score Batches',
        requirementText: {
          en: 'Complete 5+ quizzes with 4+ scores ≥40',
          ur: '5+ quizzes me 4+ dafa 40+ points lein'
        },
        rarityPercent: 15
      }
    ];

    return list;
  }, [stats]);

  // Filter milestones by category
  const filteredMilestones = useMemo(() => {
    if (activeCategory === 'all') return milestones;
    return milestones.filter(m => m.category === activeCategory);
  }, [milestones, activeCategory]);

  // Aggregate badge unlocked count & XP
  const milestoneSummary = useMemo(() => {
    const unlocked = milestones.filter(m => m.unlocked);
    const totalXp = unlocked.reduce((acc, m) => acc + m.xpReward, 0);
    return {
      unlockedCount: unlocked.length,
      totalCount: milestones.length,
      totalXpEarned: totalXp,
      completionRate: Math.round((unlocked.length / milestones.length) * 100)
    };
  }, [milestones]);

  // Check for newly earned badges to trigger celebratory animation
  useEffect(() => {
    try {
      const storedCelebrated = localStorage.getItem('clay_celebrated_milestones');
      const celebratedIds = new Set<string>(storedCelebrated ? JSON.parse(storedCelebrated) : []);
      
      const currentUnlocked = milestones.filter(m => m.unlocked);
      const currentUnlockedIds = new Set(currentUnlocked.map(m => m.id));

      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        // On initial load, track unlocked IDs so subsequent triggers in session detect deltas
        previousUnlockedIdsRef.current = currentUnlockedIds;
        return;
      }

      // Check if any milestone became unlocked that wasn't previously unlocked and uncelebrated
      const newlyEarned = currentUnlocked.find(m => !previousUnlockedIdsRef.current.has(m.id) && !celebratedIds.has(m.id));

      if (newlyEarned) {
        setCelebratingMilestone(newlyEarned);
        celebratedIds.add(newlyEarned.id);
        localStorage.setItem('clay_celebrated_milestones', JSON.stringify(Array.from(celebratedIds)));
      }

      previousUnlockedIdsRef.current = currentUnlockedIds;
    } catch (e) {
      // Gracefully ignore storage access issues
    }
  }, [milestones]);

  // Listen for explicit milestone celebration events (from quizzes, etc.)
  useEffect(() => {
    const handleCelebrateEvent = (e: any) => {
      const id = e?.detail?.milestoneId;
      const targetMilestone = 
        (id ? milestones.find(m => m.id === id) : null) || 
        milestones.find(m => m.unlocked) || 
        milestones[0];

      if (targetMilestone) {
        setCelebratingMilestone(targetMilestone);
      }
    };

    window.addEventListener('clay_celebrate_milestone', handleCelebrateEvent);
    return () => {
      window.removeEventListener('clay_celebrate_milestone', handleCelebrateEvent);
    };
  }, [milestones]);

  const handleOpenMilestone = (m: LearningMilestone) => {
    audioEngine.playLoFiChord();
    setSelectedMilestone(m);
  };

  const handleCelebrateBadge = (m: LearningMilestone, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioEngine.playLoFiChord();
    setCelebratingMilestone(m);
  };

  const handleClaimMilestone = (m: LearningMilestone) => {
    try {
      const stored = localStorage.getItem('clay_celebrated_milestones');
      const set = new Set<string>(stored ? JSON.parse(stored) : []);
      set.add(m.id);
      localStorage.setItem('clay_celebrated_milestones', JSON.stringify(Array.from(set)));
    } catch {}
    setCelebratingMilestone(null);
  };

  const handleShareBadge = () => {
    if (!selectedMilestone) return;
    const text = `I unlocked the "${selectedMilestone.title.en}" ${selectedMilestone.tier} Learning Milestone on Clayverse AI Academy! 🏆 (Reward: +${selectedMilestone.xpReward} XP)`;
    navigator.clipboard.writeText(text);
    setCopiedShareToast(true);
    setTimeout(() => setCopiedShareToast(false), 2500);
  };

  // Find most prestigious unlocked milestone for celebration replay in header
  const topUnlockedMilestone = useMemo(() => {
    const unlocked = milestones.filter(m => m.unlocked);
    if (unlocked.length === 0) return milestones[0];
    return unlocked[unlocked.length - 1];
  }, [milestones]);

  return (
    <div className={`bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-6 text-left ${className}`}>
      
      {/* Header Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-800 shadow-2xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base sm:text-lg font-black text-brand-charcoal">
                {lang === 'en' ? "Learning Milestones & Quiz Achievements" : "Seekhne ke Ahdaaf aur Quiz Badges"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[9.5px] font-mono font-bold">
                {milestoneSummary.unlockedCount} / {milestoneSummary.totalCount} Unlocked
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              {lang === 'en'
                ? "Unlock prestigious badges and bonus XP based on your quiz completions, high scores, and topic mastery."
                : "Quiz completions aur score thresholds par mabni badges aur XP rewards."}
            </p>
          </div>
        </div>

        {/* Quick Launch & Celebration Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {milestoneSummary.unlockedCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCelebrateBadge(topUnlockedMilestone)}
              className="px-3.5 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-900 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Celebrate your latest earned achievement badge with celebratory confetti & fanfare"
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'en' ? "Celebrate Badge 🎉" : "Badge Manaein 🎉"}</span>
            </motion.button>
          )}

          {onNavigateSection && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audioEngine.playLoFiChord();
                onNavigateSection('quiz-arena');
              }}
              className="px-4 py-2 rounded-2xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-brand-amber" />
              <span>{lang === 'en' ? "Play AI Arena" : "Quiz Shuru Karein"}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-900 text-[10px] font-mono font-bold uppercase">
            <span>Milestones Unlocked</span>
            <Award className="w-3.5 h-3.5 text-brand-amber" />
          </div>
          <div className="text-2xl font-black text-brand-charcoal font-display mt-1">
            {milestoneSummary.unlockedCount} <span className="text-xs text-brand-muted font-normal font-mono">/ {milestoneSummary.totalCount}</span>
          </div>
          <div className="w-full bg-brand-sand/50 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${milestoneSummary.completionRate}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-900 text-[10px] font-mono font-bold uppercase">
            <span>Milestone XP Earned</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-display mt-1">
            +{milestoneSummary.totalXpEarned} <span className="text-xs font-mono font-normal">XP</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-mono mt-0.5">
            Boosts student level
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-500/[0.06] border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-900 text-[10px] font-mono font-bold uppercase">
            <span>Perfect 100% Scores</span>
            <Star className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-brand-charcoal font-display mt-1">
            {stats.perfectRunsCount}
          </div>
          <span className="text-[10px] text-purple-800 font-mono mt-0.5">
            50/50 pts achieved
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-500/[0.06] border border-blue-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-900 text-[10px] font-mono font-bold uppercase">
            <span>Curriculum Breadth</span>
            <Brain className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-brand-charcoal font-display mt-1">
            {stats.uniqueSectionsCompleted} <span className="text-xs text-brand-muted font-normal font-mono">/ 15</span>
          </div>
          <span className="text-[10px] text-blue-800 font-mono mt-0.5">
            Sections cleared
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-brand-slate/10">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setActiveCategory('all');
              audioEngine.playLoFiChord();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'all'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-brand-sand/30 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>All Milestones ({milestones.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('completion');
              audioEngine.playLoFiChord();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'completion'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-brand-sand/30 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quiz Completion ({milestones.filter(m => m.category === 'completion').length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('threshold');
              audioEngine.playLoFiChord();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'threshold'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-brand-sand/30 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Score Thresholds ({milestones.filter(m => m.category === 'threshold').length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('mastery');
              audioEngine.playLoFiChord();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'mastery'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-brand-sand/30 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-purple-400" />
            <span>Domain Mastery ({milestones.filter(m => m.category === 'mastery').length})</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-brand-muted hidden md:inline">
          Click any milestone for details & share options
        </span>
      </div>

      {/* Milestones Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredMilestones.map((milestone) => (
          <motion.div
            key={milestone.id}
            whileHover={{ y: -3, scale: 1.015, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.06)" }}
            whileTap={{ scale: 0.985 }}
            onClick={() => handleOpenMilestone(milestone)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left relative overflow-hidden ${
              milestone.unlocked
                ? `${milestone.bgClass} ${milestone.borderClass} shadow-2xs`
                : 'bg-brand-sand/15 border-brand-slate/15 opacity-85 hover:opacity-100'
            }`}
          >
            {/* Top Bar with Emoji, Status, and Tier */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl drop-shadow-2xs">{milestone.emoji}</span>
                <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  milestone.tier === 'Diamond' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                  milestone.tier === 'Platinum' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                  milestone.tier === 'Gold' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  milestone.tier === 'Silver' ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                  'bg-orange-100 text-orange-900 border border-orange-200'
                }`}>
                  {milestone.tier}
                </span>
              </div>

              {milestone.unlocked ? (
                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleCelebrateBadge(milestone, e)}
                    className="p-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Play celebratory fanfare and confetti animation"
                  >
                    <PartyPopper className="w-3 h-3 text-amber-700" />
                    <span>Celebrate</span>
                  </motion.button>
                  <span className="flex items-center gap-1 text-[10px] font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>UNLOCKED</span>
                  </span>
                </div>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-brand-muted bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  <Lock className="w-3 h-3 text-brand-slate" />
                  <span>{milestone.progressPercent}%</span>
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-display font-bold text-sm text-brand-charcoal truncate">
                  {lang === 'en' ? milestone.title.en : milestone.title.ur}
                </h4>
                {milestone.unlocked && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
                {lang === 'en' ? milestone.description.en : milestone.description.ur}
              </p>
            </div>

            {/* Progress Bar & Numeric Target */}
            <div className="space-y-1.5 pt-1 border-t border-brand-slate/10">
              <div className="flex items-center justify-between text-[10.5px] font-mono">
                <span className="text-brand-muted font-medium truncate">
                  {lang === 'en' ? milestone.requirementText.en : milestone.requirementText.ur}
                </span>
                <span className="font-bold text-brand-charcoal shrink-0">
                  +{milestone.xpReward} XP
                </span>
              </div>

              <div className="w-full h-1.5 bg-brand-sand/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${milestone.gradient}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Milestone Modal / Inspector */}
      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-brand-slate/20 shadow-2xl space-y-5 text-left relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMilestone(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-brand-sand/40 hover:bg-brand-sand text-brand-charcoal transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Big Badge Avatar Header */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${
                  selectedMilestone.unlocked ? selectedMilestone.borderClass : 'border-slate-200 bg-slate-50'
                }`}>
                  {selectedMilestone.emoji}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-amber-100 text-amber-900 border border-amber-200">
                      {selectedMilestone.tier} Milestone
                    </span>
                    {selectedMilestone.unlocked && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-black text-brand-charcoal mt-1">
                    {lang === 'en' ? selectedMilestone.title.en : selectedMilestone.title.ur}
                  </h3>
                </div>
              </div>

              {/* Description & Requirement */}
              <div className="p-4 rounded-2xl bg-brand-sand/20 border border-brand-slate/10 space-y-2 text-xs">
                <div className="text-brand-slate leading-relaxed">
                  {lang === 'en' ? selectedMilestone.description.en : selectedMilestone.description.ur}
                </div>
                <div className="pt-2 border-t border-brand-slate/10 font-mono text-[11px] text-brand-charcoal flex items-center justify-between">
                  <span className="text-brand-muted">Requirement:</span>
                  <span className="font-bold">
                    {lang === 'en' ? selectedMilestone.requirementText.en : selectedMilestone.requirementText.ur}
                  </span>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-brand-muted">Current Progress:</span>
                  <span className="font-bold text-brand-charcoal">
                    {selectedMilestone.currentValue} / {selectedMilestone.targetValue} ({selectedMilestone.progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-brand-sand/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${selectedMilestone.gradient}`}
                    style={{ width: `${selectedMilestone.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-brand-muted pt-1">
                  <span>Earns: <strong className="text-brand-amber">+{selectedMilestone.xpReward} XP</strong></span>
                  <span>Unlocked by: <strong>{selectedMilestone.rarityPercent}% of students</strong></span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-brand-slate/15">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareBadge}
                    className="px-3.5 py-2.5 rounded-xl bg-brand-sand/50 hover:bg-brand-sand border border-brand-slate/20 text-brand-charcoal text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-brand-slate" />
                    <span>{copiedShareToast ? "Copied!" : "Share"}</span>
                  </button>

                  {selectedMilestone.unlocked && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        const m = selectedMilestone;
                        setSelectedMilestone(null);
                        handleCelebrateBadge(m);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <PartyPopper className="w-3.5 h-3.5 text-amber-700" />
                      <span>Celebrate 🎉</span>
                    </motion.button>
                  )}
                </div>

                {onNavigateSection && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      audioEngine.playLoFiChord();
                      setSelectedMilestone(null);
                      onNavigateSection('quiz-arena');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-brand-amber" />
                    <span>Take Quiz</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebratory Milestone Unlocked Framer Motion Modal */}
      <MilestoneBadgeCelebrationModal
        isOpen={!!celebratingMilestone}
        milestone={celebratingMilestone}
        onClose={() => setCelebratingMilestone(null)}
        onClaim={handleClaimMilestone}
      />

    </div>
  );
}
