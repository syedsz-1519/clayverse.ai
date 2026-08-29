import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Brain,
  Compass,
  Clock,
  Zap,
  CheckCircle2,
  Award,
  Trophy,
  ChevronRight,
  HelpCircle,
  Network,
  Bot,
  Terminal,
  Cpu,
  Layers,
  GraduationCap,
  Flame,
  Play,
  RefreshCw,
  Info,
  Check,
  ShieldCheck,
  Target,
  AlertCircle,
  BookmarkCheck,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';
import { streakManager, type DailyStreakState } from '../lib/streakManager';
import { LESSON_MODULES, type LessonModule } from './HomeCurriculumGrid';
import { quizModules } from '../data/quizQuestions';
import { QuizSessionRecord } from './QuizPerformanceBarChart';

export type RecommendationType = 'remediation' | 'progression' | 'mastery' | 'retention';

export interface LessonRecommendation {
  lesson: LessonModule;
  type: RecommendationType;
  badgeLabel: {
    en: string;
    ur: string;
  };
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  headline: {
    en: string;
    ur: string;
  };
  reason: {
    en: string;
    ur: string;
  };
  scoreContext?: {
    sectionTitle: string;
    scorePercent: number;
  };
  estimatedTime: string;
  xpReward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readinessPercent: number;
  prerequisitesMet: boolean;
  prerequisiteNote?: {
    en: string;
    ur: string;
  };
  targetQuizSectionId?: string;
  keyConcepts: string[];
}

interface RecommendedNextLessonCardProps {
  onNavigateSection: (sectionId: string) => void;
  className?: string;
}

// Fallback initial sample sessions for algorithmic recommendation seeding if none exist
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
  }
];

export default function RecommendedNextLessonCard({
  onNavigateSection,
  className = ''
}: RecommendedNextLessonCardProps) {
  const { lang } = useLanguage();
  const [streakState, setStreakState] = useState<DailyStreakState>(() => streakManager.getStreakState());
  const [quizSessions, setQuizSessions] = useState<QuizSessionRecord[]>([]);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [selectedAltIndex, setSelectedAltIndex] = useState<number | null>(null);
  const [justCompletedToast, setJustCompletedToast] = useState<string | null>(null);

  // Sync data from storage
  const reloadData = () => {
    setStreakState(streakManager.getStreakState());

    try {
      const cachedSessions = localStorage.getItem('clay_quiz_sessions');
      let loadedSessions = DEFAULT_SAMPLE_QUIZ_SESSIONS;
      if (cachedSessions) {
        const parsed = JSON.parse(cachedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedSessions = parsed;
        }
      }
      setQuizSessions(loadedSessions);

      const cachedScores = localStorage.getItem('clay_quiz_high_scores');
      if (cachedScores) {
        setHighScores(JSON.parse(cachedScores));
      } else {
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
        setCompletedSections(JSON.parse(cachedCompleted));
      }
    } catch {
      setQuizSessions(DEFAULT_SAMPLE_QUIZ_SESSIONS);
    }
  };

  useEffect(() => {
    reloadData();

    const handleSync = () => reloadData();
    window.addEventListener('clay_streak_updated', handleSync);
    window.addEventListener('clay_lesson_completed', handleSync);
    window.addEventListener('clay_auth_state_changed', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('clay_streak_updated', handleSync);
      window.removeEventListener('clay_lesson_completed', handleSync);
      window.removeEventListener('clay_auth_state_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Compute recommendations using multi-factor analysis
  const { primaryRecommendation, alternativeRecommendations, recommendationSummary } = useMemo(() => {
    const completedLessonIds = streakState.completedLessonIds || [];

    // Map quiz section prefixes to lesson IDs
    const sectionToLessonMap: Record<string, { lessonId: string; title: string }> = {
      'm1-s1': { lessonId: 'what-is-ai', title: 'AI Basics & History' },
      'm1-s2': { lessonId: 'what-is-ai', title: 'Machine Learning Intro' },
      'm1-s3': { lessonId: 'what-is-ai', title: 'Narrow vs General AI' },
      'm2-s1': { lessonId: 'family-tree', title: 'Perceptrons & Neurons' },
      'm2-s2': { lessonId: 'family-tree', title: 'Backpropagation & Loss' },
      'm2-s3': { lessonId: 'family-tree', title: 'Convolutional & Recurrent Nets' },
      'm3-s1': { lessonId: 'deeper', title: 'Evaluation Metrics' },
      'm3-s2': { lessonId: 'deeper', title: 'Overfitting & Regularization' },
      'm3-s3': { lessonId: 'deeper', title: 'Gradient Descent Optimizers' },
      'm4-s1': { lessonId: 'generative-ai', title: 'Self-Attention & Transformers' },
      'm4-s2': { lessonId: 'generative-ai', title: 'Large Language Models (LLMs)' },
      'm4-s3': { lessonId: 'prompting-rag', title: 'Prompt Engineering Techniques' },
      'm4-s4': { lessonId: 'prompting-rag', title: 'Retrieval-Augmented Generation (RAG)' },
      'm5-s1': { lessonId: 'tools', title: 'AI Safety & Alignment' },
      'm5-s2': { lessonId: 'tools', title: 'Bias, Hallucinations & Ethics' },
      'm5-s3': { lessonId: 'tools', title: 'Autonomous Agents & Future AI' }
    };

    // 1. Check for Weak Quiz Sections (Remediation Opportunity)
    // Find any quiz session with score < 80% (i.e. < 40 points or correctCount < 4)
    let weakestSession: QuizSessionRecord | null = null;
    let lowestAccuracy = 1.0;

    quizSessions.forEach(s => {
      const accuracy = s.totalCount > 0 ? s.correctCount / s.totalCount : s.scoreEarned / 50;
      if (accuracy < 0.75 && accuracy < lowestAccuracy) {
        lowestAccuracy = accuracy;
        weakestSession = s;
      }
    });

    const recommendationsList: LessonRecommendation[] = [];

    // Remediation Candidate
    if (weakestSession) {
      const session = weakestSession as QuizSessionRecord;
      const mapped = sectionToLessonMap[session.sectionId];
      if (mapped) {
        const targetLesson = LESSON_MODULES.find(m => m.id === mapped.lessonId);
        if (targetLesson) {
          const scorePercent = Math.round(lowestAccuracy * 100);
          recommendationsList.push({
            lesson: targetLesson,
            type: 'remediation',
            badgeLabel: {
              en: '⚡ Knowledge Gap Reinforcement',
              ur: '⚡ Bunyaad Mazboot Karein'
            },
            badgeColor: 'text-amber-800',
            badgeBg: 'bg-amber-500/15',
            badgeBorder: 'border-amber-500/30',
            headline: {
              en: `Targeted Review: Boost your ${mapped.title} accuracy`,
              ur: `Khas Sabak: ${mapped.title} me apni samajh behtar banayein`
            },
            reason: {
              en: `Based on your recent Arena quiz score of ${scorePercent}% in "${mapped.title}", revisiting this lesson will solidify key mechanisms and improve retention.`,
              ur: `Aap ke pichle quiz me "${mapped.title}" me ${scorePercent}% score aya tha. Is sabak ko dohrane se aap ke concepts bilkul clear ho jayenge.`
            },
            scoreContext: {
              sectionTitle: mapped.title,
              scorePercent
            },
            estimatedTime: targetLesson.readTime || '3 min',
            xpReward: 150,
            difficulty: targetLesson.lessonNum <= 2 ? 'Beginner' : targetLesson.lessonNum <= 4 ? 'Intermediate' : 'Advanced',
            readinessPercent: 100,
            prerequisitesMet: true,
            targetQuizSectionId: session.sectionId,
            keyConcepts: targetLesson.tags || ['Key Concepts', 'Formulas', 'Mental Models']
          });
        }
      }
    }

    // 2. Check Logical Progression: Find the First Uncompleted Lesson in Curriculum Order
    const uncompletedLessons = LESSON_MODULES.filter(m => !completedLessonIds.includes(m.id));

    if (uncompletedLessons.length > 0) {
      const nextLesson = uncompletedLessons[0];
      const prevLessonNum = nextLesson.lessonNum - 1;
      const prevLesson = LESSON_MODULES.find(m => m.lessonNum === prevLessonNum);
      const isPrevCompleted = prevLesson ? completedLessonIds.includes(prevLesson.id) : true;

      recommendationsList.push({
        lesson: nextLesson,
        type: 'progression',
        badgeLabel: {
          en: '🚀 Next in Learning Roadmap',
          ur: '🚀 Agla Qadam'
        },
        badgeColor: 'text-emerald-800',
        badgeBg: 'bg-emerald-500/15',
        badgeBorder: 'border-emerald-500/30',
        headline: {
          en: `Lesson ${nextLesson.lessonNum}: ${nextLesson.titleEn}`,
          ur: `Sabak ${nextLesson.lessonNum}: ${nextLesson.titleHyd}`
        },
        reason: {
          en: isPrevCompleted
            ? `You've completed foundational prerequisites! Continue your sequential journey with ${nextLesson.titleEn} to unlock advanced AI concepts.`
            : `The natural next step in your curriculum progression. Dive in to expand your foundational knowledge.`,
          ur: isPrevCompleted
            ? `Aap ne pichle asbaaq mukammal kar liye hain! Agle marhale me ${nextLesson.titleHyd} parhain aur naye concepts seekhein.`
            : `Aap ki taleemi rah ka agla aham sabaq. Mazeed seekhein aur XP points haasil karein.`
        },
        estimatedTime: nextLesson.readTime || '3 min',
        xpReward: 200,
        difficulty: nextLesson.lessonNum <= 2 ? 'Beginner' : nextLesson.lessonNum <= 4 ? 'Intermediate' : 'Advanced',
        readinessPercent: isPrevCompleted ? 100 : 85,
        prerequisitesMet: isPrevCompleted,
        prerequisiteNote: !isPrevCompleted && prevLesson ? {
          en: `Recommended after Lesson ${prevLesson.lessonNum}: ${prevLesson.titleEn}`,
          ur: `Pehle Sabaq ${prevLesson.lessonNum} mukammal karne ki sifarish hai`
        } : undefined,
        keyConcepts: nextLesson.tags || ['Neural Architecture', 'Practical Skills']
      });
    }

    // 3. Spaced Repetition / Active Recall Candidate (Flashcards or Deeper Glossary)
    const flashcardsLesson = LESSON_MODULES.find(m => m.id === 'flashcards');
    if (flashcardsLesson) {
      recommendationsList.push({
        lesson: flashcardsLesson,
        type: 'retention',
        badgeLabel: {
          en: '🧠 Spaced Repetition & Retention',
          ur: '🧠 Yad-dasht aur Revision'
        },
        badgeColor: 'text-purple-800',
        badgeBg: 'bg-purple-500/15',
        badgeBorder: 'border-purple-500/30',
        headline: {
          en: 'Active Recall: Memory Deck & Flip Cards',
          ur: 'Interactive Memory Cards se Revision Karein'
        },
        reason: {
          en: 'Reinforce mental models and core definitions with interactive flip cards, preventing the forgetting curve.',
          ur: 'Seekhe hue tamam alfaaz aur concepts ko interactive flashcards ke zariye dimag me pukhta karein.'
        },
        estimatedTime: '3 min',
        xpReward: 120,
        difficulty: 'Beginner',
        readinessPercent: 100,
        prerequisitesMet: true,
        keyConcepts: ['Spaced Repetition', 'Key Definitions', 'Retention Scoring']
      });
    }

    // 4. Advanced Hands-on Candidate (Prompting & RAG Sandbox or Deep Concepts)
    const promptingLesson = LESSON_MODULES.find(m => m.id === 'prompting-rag');
    if (promptingLesson && !recommendationsList.some(r => r.lesson.id === 'prompting-rag')) {
      recommendationsList.push({
        lesson: promptingLesson,
        type: 'mastery',
        badgeLabel: {
          en: '⭐ Practical Hands-on Skills',
          ur: '⭐ Amli Hunar aur Prompting'
        },
        badgeColor: 'text-blue-800',
        badgeBg: 'bg-blue-500/15',
        badgeBorder: 'border-blue-500/30',
        headline: {
          en: 'Prompting & RAG Architecture Lab',
          ur: 'Prompt Engineering aur RAG System'
        },
        reason: {
          en: 'Learn real-world Few-Shot prompt templates and live Retrieval-Augmented Generation architectures.',
          ur: 'Asal zindagi me kaam aane wale prompting tareeqay aur private search systems samjhein.'
        },
        estimatedTime: '4 min',
        xpReward: 250,
        difficulty: 'Intermediate',
        readinessPercent: 95,
        prerequisitesMet: true,
        keyConcepts: ['Few-Shot Prompts', 'Vector Embeddings', 'Live Sandbox']
      });
    }

    // Default primary recommendation: prefer progression if beginner, or remediation if weak score exists
    const primary = recommendationsList[0] || {
      lesson: LESSON_MODULES[0],
      type: 'progression' as RecommendationType,
      badgeLabel: { en: '🚀 Recommended Starter', ur: '🚀 Shuruati Sabak' },
      badgeColor: 'text-amber-800',
      badgeBg: 'bg-amber-500/15',
      badgeBorder: 'border-amber-500/30',
      headline: { en: 'Foundations of AI & Mental Models', ur: 'AI ki Asli Buniyaad' },
      reason: {
        en: 'The essential starting point for understanding how AI pattern recognition functions without complex math.',
        ur: 'AI ko bina kisi math ke aasan visual misaalon se samajhne ka behtareen pehla qadam.'
      },
      estimatedTime: '2 min',
      xpReward: 100,
      difficulty: 'Beginner' as const,
      readinessPercent: 100,
      prerequisitesMet: true,
      keyConcepts: ['Narrow vs General AI', 'Pattern Loops']
    };

    const alternatives = recommendationsList.slice(1, 4);

    return {
      primaryRecommendation: primary,
      alternativeRecommendations: alternatives,
      recommendationSummary: {
        completedCount: completedLessonIds.length,
        totalLessons: LESSON_MODULES.length,
        quizAttempts: quizSessions.length,
        hasWeakness: !!weakestSession
      }
    };
  }, [streakState, quizSessions]);

  // Active displayed recommendation (either primary or chosen alternative)
  const activeRec: LessonRecommendation = selectedAltIndex !== null && alternativeRecommendations[selectedAltIndex]
    ? alternativeRecommendations[selectedAltIndex]
    : primaryRecommendation;

  const isCurrentCompleted = streakManager.isLessonCompleted(activeRec.lesson.id);

  // Toggle mark lesson complete directly from card
  const handleToggleComplete = () => {
    audioEngine.playLoFiChord();
    const updated = streakManager.recordLessonCompletion(activeRec.lesson.id);
    setStreakState(updated);
    setJustCompletedToast(`Completed: ${activeRec.lesson.titleEn}`);
    setTimeout(() => setJustCompletedToast(null), 3000);
  };

  const handleStartLesson = (lessonId: string) => {
    audioEngine.playLoFiChord();
    onNavigateSection(lessonId);
  };

  return (
    <div className={`space-y-4 text-left ${className}`}>
      
      {/* Main Hero Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-white via-brand-sand/15 to-amber-500/[0.04] rounded-3xl p-6 sm:p-7 border border-brand-slate/20 shadow-sm relative overflow-hidden text-left"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Badge & Meta Strip */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 shadow-2xs ${activeRec.badgeBg} ${activeRec.badgeBorder} ${activeRec.badgeColor}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? activeRec.badgeLabel.en : activeRec.badgeLabel.ur}</span>
            </span>

            {isCurrentCompleted && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                Completed
              </span>
            )}
          </div>

          {/* Algorithmic Reason Info Button */}
          <button
            onClick={() => {
              setIsWhyModalOpen(true);
              audioEngine.playLoFiChord();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-muted hover:text-brand-charcoal transition-colors px-2.5 py-1 rounded-xl bg-white/80 border border-brand-slate/15 hover:bg-white shadow-2xs cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-brand-amber" />
            <span>{lang === 'en' ? "Why this lesson?" : "Kyun sifarish ki gayi?"}</span>
          </button>
        </div>

        {/* Core Lesson Identity */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Lesson Icon, Title, Subtitle, AI Rationale */}
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-amber to-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-brand-amber uppercase tracking-wider">
                    Lesson {activeRec.lesson.lessonNum} • {lang === 'en' ? activeRec.lesson.categoryEn : activeRec.lesson.categoryHyd}
                  </span>
                  <span className="text-brand-slate/40">•</span>
                  <span className="text-[11px] font-mono text-brand-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activeRec.estimatedTime}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal leading-tight">
                  {lang === 'en' ? activeRec.lesson.titleEn : activeRec.lesson.titleHyd}
                </h3>

                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {lang === 'en' ? activeRec.lesson.subtitleEn : activeRec.lesson.subtitleHyd}
                </p>
              </div>
            </div>

            {/* AI Recommendation Reason Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-500/[0.08] border border-amber-500/20 text-xs text-brand-charcoal space-y-1 text-left">
              <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] text-amber-900">
                <Brain className="w-3.5 h-3.5 text-brand-amber" />
                <span>Personalized AI Tutor Rationale</span>
              </div>
              <p className="text-brand-slate leading-relaxed">
                {lang === 'en' ? activeRec.reason.en : activeRec.reason.ur}
              </p>
            </div>

            {/* Key Concepts Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-brand-muted font-bold mr-1">
                Covers:
              </span>
              {activeRec.keyConcepts.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-white border border-brand-slate/15 text-brand-charcoal text-[11px] font-mono font-medium shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Readiness Meter, XP Reward & CTA Launch Box */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4 p-4 sm:p-5 rounded-2xl bg-white border border-brand-slate/15 shadow-2xs">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-brand-muted font-medium">Readiness Score:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {activeRec.readinessPercent}% Ready
                </span>
              </div>

              <div className="w-full h-2 bg-brand-sand/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${activeRec.readinessPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-brand-muted">Completion Reward:</span>
                <span className="font-black text-brand-amber flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  +{activeRec.xpReward} XP
                </span>
              </div>

              {activeRec.prerequisiteNote && (
                <div className="text-[10.5px] font-mono text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  {lang === 'en' ? activeRec.prerequisiteNote.en : activeRec.prerequisiteNote.ur}
                </div>
              )}
            </div>

            {/* Actions: Start Lesson / Mark Complete */}
            <div className="space-y-2 pt-2 border-t border-brand-slate/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartLesson(activeRec.lesson.id)}
                className="w-full py-3 px-4 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-brand-amber" />
                <span>
                  {isCurrentCompleted 
                    ? (lang === 'en' ? "Review Lesson Again" : "Sabak Dobara Parhein")
                    : (lang === 'en' ? "Start Recommended Lesson" : "Sabak Shuru Karein")}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/70" />
              </motion.button>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleToggleComplete}
                  className={`w-full py-2 px-3 rounded-xl border text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrentCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-brand-sand/30 hover:bg-brand-sand/60 border-brand-slate/20 text-brand-charcoal'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentCompleted ? 'text-emerald-600' : 'text-brand-muted'}`} />
                  <span>{isCurrentCompleted ? "Marked Complete" : "Mark as Complete"}</span>
                </button>

                {activeRec.targetQuizSectionId && (
                  <button
                    type="button"
                    onClick={() => onNavigateSection('quiz-arena')}
                    title="Practice this topic in the Arena Quiz"
                    className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Trophy className="w-3 h-3 text-brand-amber" />
                    <span>Arena</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Alternatives Strip */}
        {alternativeRecommendations.length > 0 && (
          <div className="relative z-10 mt-6 pt-5 border-t border-brand-slate/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-brand-charcoal flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-brand-amber" />
                <span>{lang === 'en' ? "Alternative Learning Suggestions:" : "Deegar Tajveezat:"}</span>
              </span>

              {selectedAltIndex !== null && (
                <button
                  onClick={() => setSelectedAltIndex(null)}
                  className="text-[11px] font-mono text-brand-amber hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Primary Recommendation</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {alternativeRecommendations.map((alt, idx) => {
                const isSelected = selectedAltIndex === idx;
                const isAltCompleted = streakManager.isLessonCompleted(alt.lesson.id);

                return (
                  <motion.div
                    key={alt.lesson.id}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedAltIndex(idx);
                      audioEngine.playLoFiChord();
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-left ${
                      isSelected
                        ? 'bg-white border-brand-amber ring-2 ring-brand-amber/20 shadow-xs'
                        : 'bg-white/70 hover:bg-white border-brand-slate/15'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md ${alt.badgeBg} ${alt.badgeColor}`}>
                        {lang === 'en' ? alt.badgeLabel.en : alt.badgeLabel.ur}
                      </span>
                      {isAltCompleted && (
                        <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Done
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-xs text-brand-charcoal truncate">
                        {lang === 'en' ? alt.lesson.titleEn : alt.lesson.titleHyd}
                      </h4>
                      <p className="text-[10.5px] text-brand-muted line-clamp-1">
                        {alt.estimatedTime} • +{alt.xpReward} XP
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-brand-slate pt-1 border-t border-brand-slate/10">
                      <span>{isSelected ? "Active View" : "Click to Inspect"}</span>
                      <ChevronRight className="w-3 h-3 text-brand-muted" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </motion.div>

      {/* "Why this was recommended?" Algorithmic Inspector Modal */}
      <AnimatePresence>
        {isWhyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-brand-slate/20 shadow-2xl space-y-5 text-left relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-charcoal">
                      Recommendation Engine Logic
                    </h3>
                    <span className="text-xs text-brand-muted">
                      How Clayverse AI chooses your next lesson
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsWhyModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-brand-sand text-brand-charcoal transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Factors Breakdown */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-brand-sand/20 border border-brand-slate/10 space-y-1.5">
                  <div className="flex items-center justify-between font-mono font-bold text-brand-charcoal">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-brand-amber" />
                      1. Quiz Accuracy & Weakness Detection
                    </span>
                    <span className="text-emerald-700">{recommendationSummary.quizAttempts} Quizzes Evaluated</span>
                  </div>
                  <p className="text-brand-slate leading-relaxed">
                    The recommendation engine monitors your score percentages in each quiz module. If a particular topic (e.g. Backpropagation, Attention, RAG) scores below 75%, it prioritizes targeted revision before moving ahead.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-brand-sand/20 border border-brand-slate/10 space-y-1.5">
                  <div className="flex items-center justify-between font-mono font-bold text-brand-charcoal">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      2. Sequential Curriculum Progression
                    </span>
                    <span className="text-brand-amber font-bold">{recommendationSummary.completedCount}/{recommendationSummary.totalLessons} Lessons Done</span>
                  </div>
                  <p className="text-brand-slate leading-relaxed">
                    When prerequisite topics are mastered with high confidence, the system advances to the next logical chapter in the nine-module curriculum.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-brand-sand/20 border border-brand-slate/10 space-y-1.5">
                  <div className="flex items-center justify-between font-mono font-bold text-brand-charcoal">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      3. Spaced Repetition & Retention
                    </span>
                    <span className="text-purple-700 font-bold">Active Recall Mode</span>
                  </div>
                  <p className="text-brand-slate leading-relaxed">
                    Interactive flip cards and championship arena battles are suggested periodically to combat the forgetting curve and lock concepts into long-term memory.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end pt-3 border-t border-brand-slate/15">
                <button
                  onClick={() => setIsWhyModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-xs"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Completion Toast Notification */}
      <AnimatePresence>
        {justCompletedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-brand-charcoal text-white rounded-2xl shadow-xl border border-white/15 flex items-center gap-2.5 text-xs font-mono font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{justCompletedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
