import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Brain, 
  Video, 
  Award, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Eye, 
  MessageSquare, 
  BookOpen, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight, 
  Play, 
  ShieldCheck, 
  Target, 
  Zap, 
  Settings, 
  LogOut, 
  LogIn, 
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Activity,
  BarChart3,
  Download,
  Printer,
  PlayCircle,
  Calendar,
  Wifi,
  WifiOff,
  FolderDown,
  HardDrive,
  Check,
  RefreshCw,
  Edit3,
  Users,
  Compass,
  Lightbulb,
  AlertCircle,
  Search,
  Filter,
  FileSpreadsheet,
  Tag,
  Map,
  Medal,
  Globe,
  Mail,
  BarChart2
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { MockInterviewRecord, MockInterviewDraft } from '../types';
import { UserProfile, setupAuthListener, logoutUserManually } from '../lib/firebase';
import { audioEngine } from '../lib/audioEngine';
import CurriculumProgressChart from './CurriculumProgressChart';
import QuizPerformanceBarChart from './QuizPerformanceBarChart';
import LearningMilestonesSection from './LearningMilestonesSection';
import RecommendedNextLessonCard from './RecommendedNextLessonCard';
import InterviewPerformanceChart from './InterviewPerformanceChart';
import InterviewReportModal from './InterviewReportModal';
import InterviewAudioReplayModal from './InterviewAudioReplayModal';
import PostInterviewReflectionModal from './PostInterviewReflectionModal';
import HistoricalInterviewTable from './HistoricalInterviewTable';
import BentoDashboardDndGrid, { BentoTileId } from './BentoDashboardDndGrid';
import { StudentOverviewBentoContent } from './StudentOverviewBentoContent';
import LearningPathDependencyMap from './LearningPathDependencyMap';
import DailyLearningGoalTracker from './DailyLearningGoalTracker';
import PracticeReminderModal from './PracticeReminderModal';
import TakeawaysNotesExportModal from './TakeawaysNotesExportModal';
import StudyGroupsSection from './StudyGroupsSection';
import CurriculumRoadmap from './CurriculumRoadmap';
import BadgeEngine from './BadgeEngine';
import CommunityPeerReviewFeed from './CommunityPeerReviewFeed';
import InterviewComparisonModal from './InterviewComparisonModal';
import WeeklyEmailDigestModal, { getEmailDigestPreferences, type WeeklyEmailDigestPreferences } from './WeeklyEmailDigestModal';
import InterviewConsistencyCalendar from './InterviewConsistencyCalendar';
import SessionInlineReflectionEditor from './SessionInlineReflectionEditor';
import { BadgeEngine as BadgeEngineLib } from '../lib/badgeEngine';
import { streakManager, type DailyStreakState } from '../lib/streakManager';
import { offlineLessonCache, type OfflineCacheStats } from '../lib/offlineLessonCache';
import { getStudentKnowledgeNotes } from '../lib/notesExporter';
import { exportQuizPerformancePdf } from '../lib/quizPdfExporter';
import { 
  deriveSessionTags, 
  TOPIC_TAG_DEFINITIONS, 
  getTopicTagMeta,
  exportSingleInterviewToCsv, 
  exportAllInterviewsToCsv 
} from '../lib/interviewExportAndTags';

interface StudentDashboardProps {
  onStartInterview: () => void;
  onOpenAuth: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const AI_CURRICULUM_CONCEPTS = [
  { id: 'c1', title: 'AI vs ML vs Deep Learning Hierarchy', category: 'Foundations', level: 'Beginner' },
  { id: 'c2', title: 'Supervised vs Unsupervised vs Reinforcement', category: 'ML Types', level: 'Beginner' },
  { id: 'c3', title: 'Neural Networks & Backpropagation', category: 'Deep Learning', level: 'Intermediate' },
  { id: 'c4', title: 'Transformer Architecture & Self-Attention', category: 'GenAI', level: 'Advanced' },
  { id: 'c5', title: 'RAG (Retrieval-Augmented Generation) & Vectors', category: 'GenAI', level: 'Advanced' },
  { id: 'c6', title: 'Prompt Engineering & System Personas', category: 'Prompting', level: 'Beginner' },
  { id: 'c7', title: 'Loss Functions, Regularization & Overfitting', category: 'Optimization', level: 'Intermediate' },
  { id: 'c8', title: 'KV-Caching, Quantization & Model Latency', category: 'Production', level: 'Advanced' },
];

export default function StudentDashboard({
  onStartInterview,
  onOpenAuth,
  onNavigateSection,
}: StudentDashboardProps) {
  const { lang } = useLanguage();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<MockInterviewRecord[]>([]);
  const [selectedChartSessionId, setSelectedChartSessionId] = useState<string | null>(null);
  const [masteredConcepts, setMasteredConcepts] = useState<string[]>(['c1', 'c2', 'c6']);
  const [expandedInterviewId, setExpandedInterviewId] = useState<string | null>(null);
  const [activeDraft, setActiveDraft] = useState<MockInterviewDraft | null>(null);
  const [selectedReportRecord, setSelectedReportRecord] = useState<MockInterviewRecord | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReplayRecord, setSelectedReplayRecord] = useState<MockInterviewRecord | null>(null);
  const [isAudioReplayOpen, setIsAudioReplayOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isExportNotesModalOpen, setIsExportNotesModalOpen] = useState(false);
  const [selectedReflectionRecord, setSelectedReflectionRecord] = useState<MockInterviewRecord | null>(null);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [historyViewMode, setHistoryViewMode] = useState<'table' | 'cards' | 'calendar'>('table');

  // Side-by-Side Interview Comparison State
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [comparisonSessionAId, setComparisonSessionAId] = useState<string | undefined>(undefined);
  const [comparisonSessionBId, setComparisonSessionBId] = useState<string | undefined>(undefined);

  // Weekly Email Digest Settings State
  const [isEmailDigestModalOpen, setIsEmailDigestModalOpen] = useState(false);
  const [emailDigestPrefs, setEmailDigestPrefs] = useState<WeeklyEmailDigestPreferences>(() => getEmailDigestPreferences());

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'badges' | 'community' | 'study-groups'>('overview');
  const [analyticsChartType, setAnalyticsChartType] = useState<'quiz' | 'curriculum'>('quiz');

  // Daily Streak State
  const [streakState, setStreakState] = useState<DailyStreakState>(() => streakManager.getStreakState());
  const [streakCelebrate, setStreakCelebrate] = useState(false);

  // Check-in / mark activity complete
  const handleMarkDailyCheckin = () => {
    const nextState = streakManager.recordLessonCompletion('daily-checkin');
    setStreakState(nextState);
    setStreakCelebrate(true);
    audioEngine.playLoFiChord();
    setTimeout(() => setStreakCelebrate(false), 4000);
  };

  // Offline Cache State
  const [isOnline, setIsOnline] = useState(() => offlineLessonCache.isOnline());
  const [cacheStats, setCacheStats] = useState<OfflineCacheStats>(() => offlineLessonCache.getStats());
  const [isSyncingCache, setIsSyncingCache] = useState(false);

  // Auto-Tagging & Filtering State for Interview History
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all');
  const [csvToast, setCsvToast] = useState<string | null>(null);

  // Student Notes count
  const [savedNotesCount, setSavedNotesCount] = useState<number>(() => {
    return Object.keys(getStudentKnowledgeNotes()).length;
  });

  // Categorize each record with derived auto-tags and custom user tags
  const taggedInterviewHistory = useMemo(() => {
    return interviewHistory.map((rec) => {
      const derived = deriveSessionTags(rec);
      // Merge auto-derived topic tags with custom assigned tags
      const combinedTopics = Array.from(new Set([
        ...derived.topicTags,
        ...(rec.tags || []),
        ...(rec.topics || [])
      ]));
      return {
        record: rec,
        derivedTags: {
          ...derived,
          topicTags: combinedTopics
        }
      };
    });
  }, [interviewHistory]);

  // Extract unique topic tags present across records with counts
  const availableTopicTagsWithCounts = useMemo(() => {
    const map: Record<string, number> = {};
    taggedInterviewHistory.forEach(({ derivedTags }) => {
      derivedTags.topicTags.forEach((topic) => {
        map[topic] = (map[topic] || 0) + 1;
      });
    });
    return map;
  }, [taggedInterviewHistory]);

  // Filtered interview records
  const filteredInterviewRecords = useMemo(() => {
    return taggedInterviewHistory.filter(({ record, derivedTags }) => {
      // Topic filter
      if (selectedTopicFilter !== 'all') {
        const hasTopic = derivedTags.topicTags.some(t => t.toLowerCase() === selectedTopicFilter.toLowerCase());
        if (!hasTopic) return false;
      }

      // Difficulty filter
      if (selectedDifficultyFilter !== 'all') {
        if (derivedTags.difficultyTag.toLowerCase() !== selectedDifficultyFilter.toLowerCase()) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchRole = record.roleTrack.toLowerCase().includes(q);
        const matchInterviewer = record.interviewerName.toLowerCase().includes(q);
        const matchFeedback = (record.summaryFeedback || '').toLowerCase().includes(q);
        const matchDecision = record.hiringDecision.toLowerCase().includes(q);
        const matchTopic = derivedTags.topicTags.some(t => t.toLowerCase().includes(q));
        const matchQuestions = record.attempts?.some(a => 
          (a.questionText || '').toLowerCase().includes(q) || 
          (a.userAnswer || '').toLowerCase().includes(q)
        );
        
        if (!matchRole && !matchInterviewer && !matchFeedback && !matchDecision && !matchTopic && !matchQuestions) {
          return false;
        }
      }

      return true;
    });
  }, [taggedInterviewHistory, selectedTopicFilter, selectedDifficultyFilter, searchQuery]);

  // CSV Export handlers
  const handleExportSingleCsv = (rec: MockInterviewRecord) => {
    audioEngine.playLoFiChord();
    exportSingleInterviewToCsv(rec, currentUser?.displayName || 'AI Scholar Student');
    setCsvToast(`Exported CSV metrics for ${rec.roleTrack}`);
    setTimeout(() => setCsvToast(null), 3500);
  };

  const handleExportAllCsv = () => {
    if (interviewHistory.length === 0) return;
    audioEngine.playLoFiChord();
    exportAllInterviewsToCsv(interviewHistory, currentUser?.displayName || 'AI Scholar Student');
    setCsvToast(`Exported all ${interviewHistory.length} mock interview sessions to CSV!`);
    setTimeout(() => setCsvToast(null), 3500);
  };

  // Evaluate Student Performance Badges & Milestones
  const studentProfile = useMemo(() => {
    return BadgeEngineLib.evaluateStudentProfile(masteredConcepts, interviewHistory, streakState);
  }, [masteredConcepts, interviewHistory, streakState]);

  // Calculate intelligent 'Recommended Next Step' based on progress & quiz performance
  const recommendedNextStep = useMemo(() => {
    // 1. Check for active Knowledge Gaps
    const gapSections = [
      { key: 'basics', lessonId: 'what-is-ai', title: 'ML vs Deterministic Rules', time: '2 min drill' },
      { key: 'family-tree', lessonId: 'family-tree', title: 'Self-Attention vs RNNs', time: '2 min drill' },
      { key: 'prompting-rag', lessonId: 'prompting-rag', title: 'RAG vs Model Fine-Tuning', time: '2 min drill' },
      { key: 'deeper', lessonId: 'deeper', title: 'AI Alignment & Safety Guardrails', time: '2 min drill' }
    ];

    for (const gap of gapSections) {
      const isChecked = localStorage.getItem(`mini_quiz_${gap.key}_checked`) === 'true';
      const isCorrect = localStorage.getItem(`mini_quiz_${gap.key}_correct`) === 'true';
      const isResolved = localStorage.getItem(`clay_gap_resolved_${gap.key}`) === 'true';

      if (isChecked && !isCorrect && !isResolved) {
        return {
          type: 'gap' as const,
          badge: 'DIAGNOSTIC KNOWLEDGE GAP',
          badgeColor: 'bg-amber-500/20 text-amber-900 border-amber-500/40',
          title: `Resolve Concept Gap: ${gap.title}`,
          reason: 'Identified a misconception in your recent knowledge check. Clear this gap to claim +25 Scholar XP.',
          estimatedTime: gap.time,
          ctaText: 'Launch Diagnostic Drill',
          onAction: () => onNavigateSection(gap.lessonId)
        };
      }
    }

    // 2. Check for active interview draft
    if (activeDraft && activeDraft.questions && activeDraft.questions.length > 0) {
      return {
        type: 'interview-draft' as const,
        badge: 'UNFINISHED SESSION',
        badgeColor: 'bg-amber-500/20 text-amber-900 border-amber-500/40',
        title: 'Resume Interrupted AI Mock Interview',
        reason: `Question ${activeDraft.currentQuestionIndex + 1} of ${activeDraft.questions.length} is saved and ready to continue.`,
        estimatedTime: '5 mins remaining',
        ctaText: 'Resume Interview Now',
        onAction: onStartInterview
      };
    }

    // 3. Check sequential lesson curriculum progress
    const coreLessons = [
      { id: 'what-is-ai', title: 'What is AI? Foundations & Analogies', time: '4 mins' },
      { id: 'family-tree', title: 'AI & ML Family Tree & Synapses', time: '4 mins' },
      { id: 'generative-ai', title: 'Generative AI & Attention Mechanisms', time: '5 mins' },
      { id: 'prompting-rag', title: 'Prompt Engineering & RAG Retrieval', time: '6 mins' },
      { id: 'tools', title: 'Curated AI Software Directory', time: '3 mins' },
      { id: 'deeper', title: '12 Core Concepts & Comprehensive Glossary', time: '5 mins' },
      { id: 'flashcards', title: 'Spaced Repetition Flashcard Deck', time: '3 mins' },
      { id: 'classroom-hub', title: 'Classroom Coursework Hub & Badges', time: '4 mins' },
      { id: 'arena', title: 'AI Championship Arena Challenge', time: '3 mins' }
    ];

    for (const lesson of coreLessons) {
      if (!streakManager.isLessonCompleted(lesson.id)) {
        return {
          type: 'lesson' as const,
          badge: 'RECOMMENDED NEXT LESSON',
          badgeColor: 'bg-brand-amber/20 text-brand-amber-dark border-brand-amber/40',
          title: `Next Up: ${lesson.title}`,
          reason: 'Continue building your foundational AI understanding step-by-step and maintain your learning streak.',
          estimatedTime: lesson.time,
          ctaText: 'Start Lesson',
          onAction: () => onNavigateSection(lesson.id)
        };
      }
    }

    // 4. If all lessons completed, check if interview was attempted
    if (interviewHistory.length === 0) {
      return {
        type: 'interview' as const,
        badge: 'MILESTONE ASSESSMENT',
        badgeColor: 'bg-purple-500/20 text-purple-900 border-purple-500/40',
        title: 'Attempt AI Mock Interview with Live Camera Tracking',
        reason: 'You have completed the core curriculum! Put your knowledge to the test under real technical interview simulation.',
        estimatedTime: '8 mins',
        ctaText: 'Start First Interview',
        onAction: onStartInterview
      };
    }

    // 5. Default: Join or Lead a Study Group Cohort
    return {
      type: 'study-group' as const,
      badge: 'PEER COLLABORATION',
      badgeColor: 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40',
      title: 'Join or Host a Curriculum Study Group',
      reason: 'Connect with fellow scholars studying advanced transformer optimizations, RAG, and prompt techniques.',
      estimatedTime: 'Live Discussion',
      ctaText: 'Explore Study Groups',
      onAction: () => setActiveTab('study-groups')
    };
  }, [activeDraft, interviewHistory.length, onNavigateSection, onStartInterview]);

  // Sync user and mock interview records
  useEffect(() => {
    const unsub = setupAuthListener((user) => {
      setCurrentUser(user);
    });

    const updateStreak = () => {
      setStreakState(streakManager.getStreakState());
    };

    const updateNotes = () => {
      setSavedNotesCount(Object.keys(getStudentKnowledgeNotes()).length);
    };

    const updateConnectivity = (e: any) => {
      setIsOnline(e.detail?.online ?? navigator.onLine);
    };

    const updateCache = () => {
      setCacheStats(offlineLessonCache.getStats());
    };

    window.addEventListener('clay_streak_updated' as any, updateStreak);
    window.addEventListener('clay_lesson_completed' as any, updateStreak);
    window.addEventListener('clay_notes_updated' as any, updateNotes);
    window.addEventListener('clay_connectivity_change' as any, updateConnectivity);
    window.addEventListener('clay_cache_synced' as any, updateCache);

    // Check for auto-saved interview draft
    const checkDraft = () => {
      try {
        const savedDraftJson = localStorage.getItem('clay_mock_interview_draft');
        if (savedDraftJson) {
          const parsed: MockInterviewDraft = JSON.parse(savedDraftJson);
          if (parsed && parsed.questions && parsed.questions.length > 0) {
            setActiveDraft(parsed);
          } else {
            setActiveDraft(null);
          }
        } else {
          setActiveDraft(null);
        }
      } catch (e) {
        console.warn('Failed to load draft in dashboard:', e);
      }
    };

    checkDraft();
    window.addEventListener('clay_interview_draft_updated', checkDraft);

    // Load interviews from local storage
    const loadInterviews = () => {
      try {
        const saved = localStorage.getItem('clay_mock_interviews');
        if (saved) {
          const parsed = JSON.parse(saved);
          setInterviewHistory(parsed);
          if (parsed.length > 0 && !selectedChartSessionId) {
            setSelectedChartSessionId(parsed[0].id);
          }
        } else {
          // Pre-seed an initial sample record for demonstration
          const sample: MockInterviewRecord = {
            id: 'sample_1',
            timestamp: Date.now() - 86400000,
            dateStr: 'Yesterday',
            roleTrack: 'AI & Machine Learning Engineer',
            interviewerName: 'Dr. Sarah Chen',
            difficulty: 'Mid-Level',
            durationSeconds: 540,
            overallScore: 88,
            hiringDecision: 'Hire',
            technicalScore: 88,
            communicationScore: 92,
            eyeContactScore: 94,
            confidenceScore: 86,
            attempts: [
              {
                questionId: 'ml_1',
                questionText: 'How do L1 and L2 regularization differ in penalizing model weights?',
                userAnswer: 'L1 adds absolute weights creating sparsity while L2 adds squared weights shrinking coefficients.',
                durationSeconds: 120,
                aiFeedback: 'Clear geometric explanation of diamond vs circle penalty contours.',
                score: 90,
                strengths: ['Accurate penalty formula', 'Mentioned sparsity'],
                improvements: ['Could mention non-differentiability at zero'],
                modelAnswer: 'L1 adds sum of absolute weights (|w|) leading to sharp diamond contours...',
                inBetweenInteractions: ['Spot on with L1 and L2 formulas!'],
              }
            ],
            summaryFeedback: 'Excellent grasp of regularization and attention mechanisms.',
            topStrengths: ['Great camera eye contact', 'Structured responses'],
            keyActionItems: ['Practice low-level quantization trade-offs'],
          };
          setInterviewHistory([sample]);
          setSelectedChartSessionId('sample_1');
          localStorage.setItem('clay_mock_interviews', JSON.stringify([sample]));
        }
      } catch (e) {
        console.warn('Failed to load interview history:', e);
      }
    };

    loadInterviews();

    // Listen to custom event when a new interview completes or tags are modified
    window.addEventListener('clay_interview_saved', loadInterviews);
    window.addEventListener('clay_interview_records_updated', loadInterviews);

    // Load mastered concepts
    try {
      const savedMastery = localStorage.getItem('clay_mastered_concepts');
      if (savedMastery) {
        setMasteredConcepts(JSON.parse(savedMastery));
      }
    } catch (e) {}

    return () => {
      unsub();
      window.removeEventListener('clay_interview_saved', loadInterviews);
      window.removeEventListener('clay_interview_records_updated', loadInterviews);
      window.removeEventListener('clay_interview_draft_updated', checkDraft);
    };
  }, []);

  // Toggle concept mastery
  const toggleConceptMastery = (id: string) => {
    audioEngine.playLoFiChord();
    setMasteredConcepts((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('clay_mastered_concepts', JSON.stringify(updated));
      return updated;
    });
  };

  // Calculations
  const averageInterviewScore = interviewHistory.length
    ? Math.round(interviewHistory.reduce((acc, curr) => acc + curr.overallScore, 0) / interviewHistory.length)
    : 0;

  const averageEyeContact = interviewHistory.length
    ? Math.round(interviewHistory.reduce((acc, curr) => acc + curr.eyeContactScore, 0) / interviewHistory.length)
    : 0;

  const masteryPercent = Math.round((masteredConcepts.length / AI_CURRICULUM_CONCEPTS.length) * 100);

  const handleMarkTodayComplete = () => {
    audioEngine.playLoFiChord();
    const updated = streakManager.recordLessonCompletion('dashboard-checkin');
    setStreakState(updated);
    setStreakCelebrate(true);
    setTimeout(() => setStreakCelebrate(false), 3500);
  };

  const handleSyncCacheManually = () => {
    setIsSyncingCache(true);
    audioEngine.playLoFiChord();
    setTimeout(() => {
      const stats = offlineLessonCache.syncCache();
      setCacheStats(stats);
      setIsSyncingCache(false);
    }, 600);
  };

  const handleDownloadQuizPdf = () => {
    audioEngine.playLoFiChord();
    const studentName = currentUser?.displayName || 'Clayverse AI Scholar';
    const studentEmail = currentUser?.email || 'student@clayverse.ai';
    
    let sessions: any[] = [];
    try {
      const saved = localStorage.getItem('clay_quiz_sessions');
      if (saved) {
        sessions = JSON.parse(saved);
      }
    } catch {}

    exportQuizPerformancePdf({
      studentName,
      studentEmail,
      sessions,
      streakState,
      language: lang === 'ur' ? 'ur' : 'en'
    });
  };

  return (
    <section className="w-full min-h-screen bg-brand-cream py-8 px-4 sm:px-6 select-none">
      <div className="max-w-6xl mx-auto space-y-6 text-left">
        
        {/* ========================================================================= */}
        {/* TOP PROFILE & STATS HEADER BANNER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-br from-brand-charcoal via-slate-900 to-brand-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* User Profile Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    currentUser?.photoURL ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                  }
                  alt="User Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-amber shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-brand-amber text-white p-1 rounded-full text-[10px]">
                  <Award className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl sm:text-2xl font-black text-white">
                    {currentUser?.displayName || (lang === 'en' ? 'AI Explorer Student' : 'AI Student')}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-[10px] font-mono font-bold">
                    Level 4 • AI Scholar
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  {currentUser?.email || (lang === 'en' ? 'Local Student Profile' : 'Student Profile')}
                </p>

                {/* Status Badges */}
                <div className="flex items-center gap-2.5 mt-2 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> {interviewHistory.length} Interviews Attempted
                  </span>
                  <span className={`hidden sm:flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-lg border ${
                    isOnline ? 'text-blue-300 bg-blue-500/15 border-blue-500/20' : 'text-amber-300 bg-amber-500/15 border-amber-500/20'
                  }`}>
                    {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                    <span>{isOnline ? 'Online Sync' : 'Offline Cache Ready'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Auth */}
            <div className="flex flex-wrap items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadQuizPdf}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
                title="Download complete quiz performance and progress summary as PDF"
              >
                <Download className="w-4 h-4 text-brand-amber" />
                <span>{lang === 'en' ? "Download PDF Report" : "PDF Report"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsReminderModalOpen(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
                title="Configure daily/weekly mock interview practice reminders"
              >
                <Clock className="w-4 h-4 text-brand-amber" />
                <span>{lang === 'en' ? "Practice Reminders" : "Reminders"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onStartInterview}
                className="px-5 py-2.5 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-2xl text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>{lang === 'en' ? "Launch AI Mock Interview" : "Mock Interview Shuru Karein"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenAuth}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-brand-amber" />
                <span>{currentUser ? (lang === 'en' ? "Profile & Settings" : "Settings") : (lang === 'en' ? "Login / Sign Up" : "Login Karein")}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTELLIGENT 'RECOMMENDED NEXT STEP' ACTION CARD */}
        {/* ========================================================================= */}
        {recommendedNextStep && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, boxShadow: "0 12px 30px -5px rgba(217, 119, 6, 0.12)" }}
            className="bg-gradient-to-r from-amber-500/15 via-white to-orange-500/10 border-2 border-brand-amber/40 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4 z-10">
              <div className="p-3 bg-brand-amber text-white rounded-2xl shadow-sm shrink-0 mt-0.5">
                {recommendedNextStep.type === 'gap' ? (
                  <Brain className="w-6 h-6 animate-pulse" />
                ) : recommendedNextStep.type === 'interview' || recommendedNextStep.type === 'interview-draft' ? (
                  <Video className="w-6 h-6 animate-pulse" />
                ) : recommendedNextStep.type === 'study-group' ? (
                  <Users className="w-6 h-6" />
                ) : (
                  <Compass className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black border uppercase tracking-wider ${recommendedNextStep.badgeColor}`}>
                    {recommendedNextStep.badge}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-brand-muted flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{recommendedNextStep.estimatedTime}</span>
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-black text-brand-charcoal">
                  {recommendedNextStep.title}
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed max-w-2xl">
                  {recommendedNextStep.reason}
                </p>
              </div>
            </div>

            <div className="z-10 shrink-0 self-end md:self-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={recommendedNextStep.onAction}
                className="px-5 py-3 rounded-2xl bg-brand-charcoal hover:bg-black text-white font-mono text-xs font-black tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{recommendedNextStep.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-brand-amber" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* DASHBOARD TAB NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-xs border border-brand-slate/15 rounded-2xl shadow-2xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? "OVERVIEW" : "OVERVIEW"}</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? "CURRICULUM ROADMAP" : "ROADMAP"}</span>
            <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-800 text-[9px] font-mono font-black rounded-full">
              GUIDED
            </span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
            }`}
          >
            <Medal className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? "BADGES & XP" : "BADGES"}</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-800 text-[9px] font-mono font-black rounded-full">
              LEVEL 4
            </span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'community'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? "PEER REVIEW FEED" : "COMMUNITY"}</span>
            <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-800 text-[9px] font-mono font-black rounded-full">
              ANONYMOUS
            </span>
          </button>

          <button
            onClick={() => setActiveTab('study-groups')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'study-groups'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? "STUDY GROUPS" : "STUDY GROUPS"}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB: CURRICULUM ROADMAP */}
        {/* ========================================================================= */}
        {activeTab === 'roadmap' && (
          <CurriculumRoadmap
            completedLessonIds={streakState.completedLessons || []}
            onNavigateLesson={onNavigateSection}
            onLaunchInterview={onStartInterview}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: BADGE ENGINE & MILESTONES */}
        {/* ========================================================================= */}
        {activeTab === 'badges' && (
          <BadgeEngine
            completedLessonIds={streakState.completedLessons || []}
            interviewHistory={interviewHistory}
            streakState={streakState}
            onLaunchInterview={onStartInterview}
            onNavigateLesson={onNavigateSection}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: COMMUNITY PEER REVIEWS FEED */}
        {/* ========================================================================= */}
        {activeTab === 'community' && (
          <CommunityPeerReviewFeed
            interviewHistory={interviewHistory}
            onOpenAuth={onOpenAuth}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: STUDY GROUPS SECTION */}
        {/* ========================================================================= */}
        {activeTab === 'study-groups' && (
          <StudyGroupsSection
            currentUser={currentUser}
            onOpenAuth={onOpenAuth}
            onSelectTopic={(topicId) => {
              onNavigateSection('what-is-ai');
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS CONTENT */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

        {/* ========================================================================= */}
        {/* ACTIVE DRAFT RESUME ALERT BANNER (If Mock Interview in progress) */}
        {/* ========================================================================= */}
        {activeDraft && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(217, 119, 6, 0.15)" }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border-2 border-brand-amber/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-brand-amber text-white rounded-2xl shadow-sm shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark text-[9px] font-mono font-bold uppercase">
                    Unfinished Interview Saved
                  </span>
                  <span className="text-[10px] font-mono text-brand-muted">
                    Question {activeDraft.currentQuestionIndex + 1} of {activeDraft.questions.length}
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-brand-charcoal mt-0.5">
                  Resume your interrupted mock interview session
                </h4>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartInterview}
              className="px-4 py-2 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 self-end sm:self-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Now</span>
            </motion.button>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* DAILY LEARNING GOAL PROGRESS TRACKER & BADGES */}
        {/* ========================================================================= */}
        <DailyLearningGoalTracker
          streakState={streakState}
          interviewHistory={interviewHistory}
          masteredConceptsCount={masteredConcepts.length}
          totalConceptsCount={AI_CURRICULUM_CONCEPTS.length}
          onLaunchInterview={onStartInterview}
          onNavigateLesson={onNavigateSection}
          onMarkLessonComplete={handleMarkDailyCheckin}
        />

        {/* ========================================================================= */}
        {/* STATS OVERVIEW CARDS WITH FRAMER MOTION HOVER */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs transition-shadow cursor-default"
          >
            <div className="flex items-center gap-1.5 text-brand-amber mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase">Avg Interview Score</span>
            </div>
            <div className="text-2xl font-black text-brand-charcoal font-display">
              {averageInterviewScore ? `${averageInterviewScore}%` : 'N/A'}
            </div>
            <span className="text-[9px] text-brand-muted mt-0.5 block">Across all mock rounds</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
            className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs transition-shadow cursor-default"
          >
            <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
              <Eye className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase">Avg Eye Contact</span>
            </div>
            <div className="text-2xl font-black text-brand-charcoal font-display">
              {averageEyeContact ? `${averageEyeContact}%` : '92%'}
            </div>
            <span className="text-[9px] text-brand-muted mt-0.5 block">Camera tracker gaze</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
            className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs transition-shadow cursor-default"
          >
            <div className="flex items-center gap-1.5 text-purple-600 mb-1">
              <Brain className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase">Curriculum Mastery</span>
            </div>
            <div className="text-2xl font-black text-brand-charcoal font-display">
              {masteryPercent}%
            </div>
            <span className="text-[9px] text-brand-muted mt-0.5 block">{masteredConcepts.length} of {AI_CURRICULUM_CONCEPTS.length} concepts</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)" }}
            className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs transition-shadow cursor-default"
          >
            <div className="flex items-center gap-1.5 text-blue-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-[9px] font-mono font-bold uppercase">Study Time</span>
            </div>
            <div className="text-2xl font-black text-brand-charcoal font-display">
              4.2 Hrs
            </div>
            <span className="text-[9px] text-brand-muted mt-0.5 block">Total active practice</span>
          </motion.div>
        </div>

        {/* ========================================================================= */}
        {/* DRAG-AND-DROP CUSTOMIZABLE BENTO-GRID SYSTEM WITH LOCALSTORAGE PERSISTENCE */}
        {/* ========================================================================= */}
        <BentoDashboardDndGrid
          renderTileContent={(tileId) => (
            <StudentOverviewBentoContent
              tileId={tileId}
              onNavigateSection={onNavigateSection}
              lang={lang}
              audioEngine={audioEngine}
              streakState={streakState}
              streakCelebrate={streakCelebrate}
              handleMarkTodayComplete={handleMarkTodayComplete}
              masteredConcepts={masteredConcepts}
              setMasteredConcepts={setMasteredConcepts}
              toggleConceptMastery={toggleConceptMastery}
              masteryPercent={masteryPercent}
              analyticsChartType={analyticsChartType}
              setAnalyticsChartType={setAnalyticsChartType}
              handleDownloadQuizPdf={handleDownloadQuizPdf}
              isOnline={isOnline}
              cacheStats={cacheStats}
              handleSyncCacheManually={handleSyncCacheManually}
              isSyncingCache={isSyncingCache}
              savedNotesCount={savedNotesCount}
              setIsExportNotesModalOpen={setIsExportNotesModalOpen}
              emailDigestPrefs={emailDigestPrefs}
              setIsEmailDigestModalOpen={setIsEmailDigestModalOpen}
              currentUser={currentUser}
              interviewHistory={interviewHistory}
              setInterviewHistory={setInterviewHistory}
              selectedChartSessionId={selectedChartSessionId}
              setSelectedChartSessionId={setSelectedChartSessionId}
              historyViewMode={historyViewMode}
              setHistoryViewMode={setHistoryViewMode}
              setIsComparisonModalOpen={setIsComparisonModalOpen}
              setComparisonSessionAId={setComparisonSessionAId}
              setComparisonSessionBId={setComparisonSessionBId}
              handleExportAllCsv={handleExportAllCsv}
              handleExportSingleCsv={handleExportSingleCsv}
              onStartInterview={onStartInterview}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDifficultyFilter={selectedDifficultyFilter}
              setSelectedDifficultyFilter={setSelectedDifficultyFilter}
              selectedTopicFilter={selectedTopicFilter}
              setSelectedTopicFilter={setSelectedTopicFilter}
              availableTopicTagsWithCounts={availableTopicTagsWithCounts}
              getTopicTagMeta={getTopicTagMeta}
              filteredInterviewRecords={filteredInterviewRecords}
              expandedInterviewId={expandedInterviewId}
              setExpandedInterviewId={setExpandedInterviewId}
              setSelectedReplayRecord={setSelectedReplayRecord}
              setIsAudioReplayOpen={setIsAudioReplayOpen}
              setSelectedReportRecord={setSelectedReportRecord}
              setIsReportModalOpen={setIsReportModalOpen}
              setSelectedReflectionRecord={setSelectedReflectionRecord}
              setIsReflectionModalOpen={setIsReflectionModalOpen}
              studentProfile={studentProfile}
              setActiveTab={setActiveTab}
              setIsReminderModalOpen={setIsReminderModalOpen}
            />
          )}
        />

        {/* ========================================================================= */}
        {/* MAIN DASHBOARD CONTENT GRID: CURRICULUM + INTERVIEW HISTORY */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: Performance Radar/Bar Analytics & Mock Interview History */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Recharts Performance Radar & Bar Chart Visualizer */}
            {interviewHistory.length > 0 && (
              <InterviewPerformanceChart
                records={interviewHistory}
                selectedRecordId={selectedChartSessionId}
                onSelectRecord={(id) => {
                  setSelectedChartSessionId(id);
                  audioEngine.playLoFiChord();
                }}
              />
            )}

            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                    <Video className="w-4 h-4 text-brand-amber" />
                    {lang === 'en' ? "Mock Interview History & Scorecards" : "Mock Interview Records"}
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {lang === 'en' 
                      ? "Auto-categorized by topic & difficulty, with audio replays and downloadable CSV/PDF metrics." 
                      : "Pichli mock interviews ke nataij, audio replays aur CSV/PDF export."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Mode Switcher: Table vs Cards vs Calendar */}
                  {interviewHistory.length > 0 && (
                    <div className="flex items-center p-0.5 rounded-xl bg-brand-sand/40 border border-brand-slate/15">
                      <button
                        type="button"
                        onClick={() => {
                          setHistoryViewMode('table');
                          audioEngine.playLoFiChord();
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          historyViewMode === 'table'
                            ? 'bg-white text-brand-charcoal shadow-2xs font-black'
                            : 'text-brand-slate hover:text-brand-charcoal'
                        }`}
                      >
                        <span>Table</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHistoryViewMode('cards');
                          audioEngine.playLoFiChord();
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          historyViewMode === 'cards'
                            ? 'bg-white text-brand-charcoal shadow-2xs font-black'
                            : 'text-brand-slate hover:text-brand-charcoal'
                        }`}
                      >
                        <span>Cards</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHistoryViewMode('calendar');
                          audioEngine.playLoFiChord();
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          historyViewMode === 'calendar'
                            ? 'bg-white text-brand-charcoal shadow-2xs font-black'
                            : 'text-brand-slate hover:text-brand-charcoal'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 text-brand-amber" />
                        <span>Calendar</span>
                      </button>
                    </div>
                  )}

                  {/* Side-by-Side Session Comparison Trigger */}
                  {interviewHistory.length >= 2 && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setIsComparisonModalOpen(true);
                        audioEngine.playLoFiChord();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Compare two past interview sessions side-by-side"
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-brand-amber" />
                      <span>Compare (2)</span>
                    </motion.button>
                  )}

                  {interviewHistory.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleExportAllCsv}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Export all interview session records to a combined CSV file"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Export All (CSV)</span>
                    </motion.button>
                  )}

                  <button
                    onClick={onStartInterview}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber-dark hover:bg-brand-amber/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? "New Interview" : "Nayi Interview"}</span>
                  </button>
                </div>
              </div>

              {/* =================================================================== */}
              {/* SEARCH & AUTO-TAG TOPIC / DIFFICULTY FILTER TOOLBAR */}
              {/* =================================================================== */}
              {interviewHistory.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-brand-sand/15 border border-brand-slate/15 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by role, topic, interviewer, questions..."
                        className="w-full pl-8.5 pr-8 py-1.5 rounded-xl bg-white border border-brand-slate/20 text-xs text-brand-charcoal placeholder:text-brand-muted focus:outline-hidden focus:border-brand-amber focus:ring-1 focus:ring-brand-amber"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Difficulty Quick Filter */}
                    <div className="flex items-center gap-1 shrink-0 overflow-x-auto pb-1 sm:pb-0">
                      <span className="text-[10px] font-mono font-bold uppercase text-brand-muted mr-1 hidden sm:inline">
                        Level:
                      </span>
                      {['all', 'Beginner', 'Mid-Level', 'Senior', 'Staff'].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficultyFilter(diff)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                            selectedDifficultyFilter === diff
                              ? 'bg-brand-charcoal text-white shadow-2xs'
                              : 'bg-white border border-brand-slate/15 text-brand-slate hover:bg-brand-sand/30'
                          }`}
                        >
                          {diff === 'all' ? 'All Levels' : diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic Auto-Tag Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-brand-slate/10">
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-brand-muted mr-1">
                      <Tag className="w-3 h-3 text-brand-amber" />
                      <span>Topic Tags:</span>
                    </div>

                    <button
                      onClick={() => setSelectedTopicFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                        selectedTopicFilter === 'all'
                          ? 'bg-brand-amber text-white shadow-2xs'
                          : 'bg-white border border-brand-slate/15 text-brand-slate hover:bg-brand-sand/30'
                      }`}
                    >
                      All Topics ({interviewHistory.length})
                    </button>

                    {Object.entries(availableTopicTagsWithCounts).map(([topic, count]) => {
                      const isSelected = selectedTopicFilter.toLowerCase() === topic.toLowerCase();
                      const meta = getTopicTagMeta(topic);
                      const badgeTheme = meta 
                        ? `${meta.badgeBg} ${meta.badgeText} ${meta.borderColor} border` 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200';
                      return (
                        <button
                          key={topic}
                          onClick={() => setSelectedTopicFilter(isSelected ? 'all' : topic)}
                          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-brand-charcoal text-white font-bold shadow-2xs ring-2 ring-brand-amber/50'
                              : badgeTheme
                          }`}
                        >
                          <span>{topic}</span>
                          <span className={`text-[9.5px] font-mono font-bold px-1 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-black/10 text-brand-charcoal'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}

                    {/* Reset Button if filtered */}
                    {(searchQuery || selectedTopicFilter !== 'all' || selectedDifficultyFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedTopicFilter('all');
                          setSelectedDifficultyFilter('all');
                        }}
                        className="ml-auto text-[10px] font-mono text-brand-amber hover:underline font-bold cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>

                  {/* Filter results count banner */}
                  <div className="flex items-center justify-between text-[10.5px] font-mono text-brand-muted pt-0.5">
                    <span>
                      Showing <strong>{filteredInterviewRecords.length}</strong> of {interviewHistory.length} recorded interview sessions
                    </span>
                    {(selectedTopicFilter !== 'all' || selectedDifficultyFilter !== 'all' || searchQuery) && (
                      <span className="text-brand-amber font-bold flex items-center gap-1">
                        <Filter className="w-3 h-3" />
                        Active filters applied
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* History List */}
              {interviewHistory.length === 0 ? (
                <div className="p-8 rounded-2xl bg-brand-sand/20 border border-dashed border-brand-slate/20 text-center space-y-3">
                  <Video className="w-8 h-8 text-brand-muted mx-auto" />
                  <p className="text-xs text-brand-muted max-w-sm mx-auto">
                    You haven't completed any mock interviews yet. Attempt your first round with real camera tracking and get graded by our AI interviewer!
                  </p>
                  <button
                    onClick={onStartInterview}
                    className="px-4 py-2 bg-brand-amber text-white rounded-xl text-xs font-bold shadow hover:bg-brand-amber-dark transition-all cursor-pointer"
                  >
                    Start First Interview
                  </button>
                </div>
              ) : filteredInterviewRecords.length === 0 ? (
                <div className="p-6 rounded-2xl bg-brand-sand/15 border border-dashed border-brand-slate/20 text-center space-y-2">
                  <p className="text-xs text-brand-slate font-medium">
                    No past mock interviews match your current search or topic filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTopicFilter('all');
                      setSelectedDifficultyFilter('all');
                    }}
                    className="text-xs font-bold text-brand-amber hover:underline cursor-pointer"
                  >
                    Clear Search & Reset All Filters
                  </button>
                </div>
              ) : historyViewMode === 'calendar' ? (
                <InterviewConsistencyCalendar
                  interviewHistory={interviewHistory}
                  streakState={streakState}
                  onOpenReportModal={(rec) => {
                    setSelectedReportRecord(rec);
                    setIsReportModalOpen(true);
                    audioEngine.playLoFiChord();
                  }}
                  onOpenAudioReplay={(rec) => {
                    setSelectedReplayRecord(rec);
                    setIsAudioReplayOpen(true);
                    audioEngine.playLoFiChord();
                  }}
                  onStartInterview={onStartInterview}
                  onCompareSessions={(sA, sB) => {
                    setComparisonSessionAId(sA.id);
                    setComparisonSessionBId(sB.id);
                    setIsComparisonModalOpen(true);
                    audioEngine.playLoFiChord();
                  }}
                />
              ) : historyViewMode === 'table' ? (
                <HistoricalInterviewTable
                  records={filteredInterviewRecords.map(f => f.record)}
                  onOpenReportModal={(rec) => {
                    setSelectedReportRecord(rec);
                    setIsReportModalOpen(true);
                    audioEngine.playLoFiChord();
                  }}
                  onOpenAudioReplay={(rec) => {
                    setSelectedReplayRecord(rec);
                    setIsAudioReplayOpen(true);
                    audioEngine.playLoFiChord();
                  }}
                  onOpenReflectionModal={(rec) => {
                    setSelectedReflectionRecord(rec);
                    setIsReflectionModalOpen(true);
                    audioEngine.playLoFiChord();
                  }}
                  onExportCsv={handleExportSingleCsv}
                  onOpenComparison={(rec) => {
                    setComparisonSessionAId(rec.id);
                    const other = interviewHistory.find(r => r.id !== rec.id);
                    if (other) setComparisonSessionBId(other.id);
                    setIsComparisonModalOpen(true);
                    audioEngine.playLoFiChord();
                  }}
                  onTagSelected={(tag) => setSelectedTopicFilter(tag)}
                  onRecordsUpdated={() => {
                    const saved = localStorage.getItem('clay_mock_interviews');
                    if (saved) {
                      setInterviewHistory(JSON.parse(saved));
                    }
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {filteredInterviewRecords.map(({ record: rec, derivedTags }) => {
                    const isExpanded = expandedInterviewId === rec.id;
                    return (
                      <motion.div
                        key={rec.id}
                        whileHover={{ borderColor: 'rgba(217, 119, 6, 0.4)', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)' }}
                        className="rounded-2xl border border-brand-slate/15 bg-white transition-all overflow-hidden shadow-2xs"
                      >
                        {/* Summary Header Row */}
                        <div
                          onClick={() => setExpandedInterviewId(isExpanded ? null : rec.id)}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-brand-sand/10 transition-colors"
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display font-bold text-xs sm:text-sm text-brand-charcoal">
                                {rec.roleTrack}
                              </span>

                              {/* Difficulty Tag */}
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                derivedTags.difficultyTag === 'Staff' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                                derivedTags.difficultyTag === 'Senior' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                                derivedTags.difficultyTag === 'Mid-Level' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}>
                                {derivedTags.difficultyTag}
                              </span>

                              {/* Hiring Decision Tag */}
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                rec.hiringDecision === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                                rec.hiringDecision === 'Hire' ? 'bg-teal-100 text-teal-800' :
                                rec.hiringDecision === 'Leaning Hire' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {rec.hiringDecision}
                              </span>
                            </div>

                            {/* Auto-detected Topic Tags Row */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {derivedTags.topicTags.map((topic) => {
                                const meta = getTopicTagMeta(topic);
                                const badgeClass = meta 
                                  ? `${meta.badgeBg} ${meta.badgeText} ${meta.borderColor} border`
                                  : 'bg-slate-100 text-slate-700 border border-slate-200';
                                return (
                                  <span
                                    key={topic}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTopicFilter(topic);
                                    }}
                                    className={`text-[9.5px] font-medium px-2 py-0.5 rounded-md transition-transform hover:scale-105 cursor-pointer ${badgeClass}`}
                                    title={`Click to filter interviews by ${topic}`}
                                  >
                                    #{topic}
                                  </span>
                                );
                              })}
                            </div>

                            <div className="flex items-center gap-3 text-[10px] font-mono text-brand-muted">
                              <span>Interviewer: {rec.interviewerName}</span>
                              <span>•</span>
                              <span>{rec.dateStr}</span>
                              <span>•</span>
                              <span>{Math.round(rec.durationSeconds / 60)} mins</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <div className="text-right">
                              <span className="text-[9px] font-mono uppercase text-brand-muted block font-bold">Score</span>
                              <span className="font-display font-black text-base text-brand-charcoal">
                                {rec.overallScore}%
                              </span>
                            </div>

                            <div className="text-right hidden sm:block">
                              <span className="text-[9px] font-mono uppercase text-brand-muted block font-bold">Eye Gaze</span>
                              <span className="font-display font-bold text-xs text-emerald-600">
                                {rec.eyeContactScore}%
                              </span>
                            </div>

                            {/* CSV Export Action Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExportSingleCsv(rec);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Export individual session performance metrics to CSV"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="hidden sm:inline">CSV</span>
                            </motion.button>

                            {/* Replay Audio & Transcript Trigger Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReplayRecord(rec);
                                setIsAudioReplayOpen(true);
                                audioEngine.playLoFiChord();
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-brand-amber text-white hover:bg-brand-amber-dark text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Replay audio speech and full transcript"
                            >
                              <PlayCircle className="w-3.5 h-3.5 fill-current" />
                              <span className="hidden sm:inline">Replay</span>
                            </motion.button>

                            {/* Scorecard Report Trigger Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReportRecord(rec);
                                setIsReportModalOpen(true);
                                audioEngine.playLoFiChord();
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-brand-charcoal text-white hover:bg-slate-800 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Download summary report & PDF"
                            >
                              <Download className="w-3.5 h-3.5 text-brand-amber" />
                              <span className="hidden sm:inline">PDF</span>
                            </motion.button>

                            <div className="p-1 rounded-lg bg-brand-sand/40 text-brand-slate">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Full Report Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 pt-2 border-t border-brand-slate/10 bg-brand-sand/10 space-y-3"
                            >
                              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-900">
                                <span className="font-mono text-[9px] font-black uppercase text-amber-800 block mb-0.5">
                                  AI Feedback Summary:
                                </span>
                                <p>{rec.summaryFeedback}</p>
                              </div>

                              {/* Question Attempts Count Preview */}
                              {rec.attempts && rec.attempts.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-mono font-bold text-brand-slate uppercase block">
                                    Question Breakdown ({rec.attempts.length} Questions):
                                  </span>
                                  <div className="grid grid-cols-1 gap-1.5">
                                    {rec.attempts.map((att, attIdx) => (
                                      <div 
                                        key={attIdx} 
                                        className="p-2 rounded-xl bg-white border border-brand-slate/10 text-xs flex items-center justify-between gap-2"
                                      >
                                        <div className="truncate flex-1">
                                          <span className="font-bold text-brand-amber mr-1.5">Q{attIdx + 1}:</span>
                                          <span className="text-brand-charcoal text-[11px] font-medium">{att.questionText}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                                          att.score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                                          att.score >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {att.score}%
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Personal Reflections & Key Takeaways Inline Editor */}
                              <div className="pt-2">
                                <SessionInlineReflectionEditor
                                  record={rec}
                                  onSave={() => {
                                    handleSyncCacheManually();
                                  }}
                                />
                              </div>

                              {/* Quick session focus and replay actions */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-brand-slate/10">
                                <div className="flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleExportSingleCsv(rec);
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <FileSpreadsheet className="w-3.5 h-3.5" />
                                    <span>Export CSV Metrics</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedReplayRecord(rec);
                                      setIsAudioReplayOpen(true);
                                      audioEngine.playLoFiChord();
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-brand-amber text-white hover:bg-brand-amber-dark text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <PlayCircle className="w-3.5 h-3.5 fill-current" />
                                    <span>Replay Audio & Speech</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedReportRecord(rec);
                                      setIsReportModalOpen(true);
                                      audioEngine.playLoFiChord();
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-brand-charcoal text-white hover:bg-slate-800 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <Download className="w-3.5 h-3.5 text-brand-amber" />
                                    <span>Scorecard & Download PDF</span>
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedChartSessionId(rec.id);
                                      audioEngine.playLoFiChord();
                                      window.scrollTo({ top: 180, behavior: 'smooth' });
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-brand-amber/15 text-brand-amber-dark hover:bg-brand-amber/25 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Activity className="w-3.5 h-3.5" />
                                    <span>Inspect on Charts</span>
                                  </button>

                                  {interviewHistory.length >= 2 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setComparisonSessionAId(rec.id);
                                        const other = interviewHistory.find(r => r.id !== rec.id);
                                        if (other) setComparisonSessionBId(other.id);
                                        setIsComparisonModalOpen(true);
                                        audioEngine.playLoFiChord();
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <BarChart2 className="w-3.5 h-3.5 text-brand-amber" />
                                      <span>Compare</span>
                                    </button>
                                  )}
                                </div>

                                <span className="text-[10px] font-mono text-brand-muted">
                                  Duration: {Math.round(rec.durationSeconds / 60)} mins
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Performance Milestones, Curriculum Mastery & Quick Launch Bar */}
          <div className="space-y-4">
            
            {/* Performance Milestones & Badges Showcase */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-charcoal">
                      Performance Milestones
                    </h3>
                    <span className="text-[10px] font-mono text-brand-muted block">
                      {studentProfile.unlockedBadgesCount} / {studentProfile.totalBadgesCount} Badges Unlocked
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('badges');
                    audioEngine.playLoFiChord();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[10.5px] font-bold font-mono transition-all cursor-pointer shadow-2xs"
                >
                  View All
                </button>
              </div>

              {/* Milestone Badges Strip */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {studentProfile.badges.slice(0, 4).map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.02, y: -1 }}
                    onClick={() => {
                      setActiveTab('badges');
                      audioEngine.playLoFiChord();
                    }}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      badge.unlocked
                        ? `${badge.bgClass} ${badge.borderClass} shadow-2xs`
                        : 'bg-brand-sand/15 border-brand-slate/10 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{badge.badgeEmoji}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        badge.unlocked 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {badge.unlocked ? 'UNLOCKED' : `${badge.progressPercent}%`}
                      </span>
                    </div>
                    <div>
                      <div className="font-display font-bold text-[11px] text-brand-charcoal truncate">
                        {badge.title}
                      </div>
                      <div className="text-[9.5px] text-brand-muted truncate">
                        +{badge.xpReward} XP • {badge.tier}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* XP Level Progress Indicator */}
              <div className="pt-2 border-t border-brand-slate/10 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-brand-charcoal flex items-center gap-1">
                    <span>{studentProfile.levelBadgeEmoji}</span>
                    <span>Level {studentProfile.currentLevel}: {studentProfile.levelTitle}</span>
                  </span>
                  <span className="text-brand-amber font-bold">{studentProfile.totalXp} XP</span>
                </div>
                <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{ width: `${studentProfile.levelProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Concept Mastery Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Concept Mastery Roadmap
                </h3>
                <span className="text-[10px] font-mono font-bold text-brand-amber">
                  {masteredConcepts.length}/{AI_CURRICULUM_CONCEPTS.length}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-brand-sand/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-amber to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${masteryPercent}%` }}
                />
              </div>

              {/* Concepts List */}
              <div className="space-y-2 pt-2">
                {AI_CURRICULUM_CONCEPTS.map((concept) => {
                  const isMastered = masteredConcepts.includes(concept.id);
                  return (
                    <motion.button
                      key={concept.id}
                      whileHover={{ scale: 1.015, x: 2 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => toggleConceptMastery(concept.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-500/[0.04] border-emerald-500/30 text-emerald-950 shadow-2xs'
                          : 'bg-brand-sand/20 border-brand-slate/10 text-brand-slate hover:bg-brand-sand/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 ${
                          isMastered ? 'bg-emerald-500 text-white' : 'border border-brand-slate/30'
                        }`}>
                          {isMastered && '✓'}
                        </span>
                        <span className="text-[11px] font-medium truncate">
                          {concept.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-brand-muted shrink-0">
                        {concept.level}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quick Launchpad to Learning Modules */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3">
              <h3 className="font-display text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-brand-amber" />
                Quick Launchpad
              </h3>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  onClick={() => onNavigateSection('prompt-sandbox')}
                  className="p-2.5 rounded-xl bg-brand-sand/20 hover:bg-brand-sand/50 text-brand-charcoal font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Interactive Prompt Sandbox
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
                </button>

                <button
                  onClick={() => onNavigateSection('rag-simulator')}
                  className="p-2.5 rounded-xl bg-brand-sand/20 hover:bg-brand-sand/50 text-brand-charcoal font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5 text-brand-amber" />
                    RAG Knowledge Simulator
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
                </button>

                <button
                  onClick={() => onNavigateSection('quiz-arena')}
                  className="p-2.5 rounded-xl bg-brand-sand/20 hover:bg-brand-sand/50 text-brand-charcoal font-bold flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    AI Championship Quiz Arena
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
                </button>

                <button
                  onClick={() => setIsReminderModalOpen(true)}
                  className="p-2.5 rounded-xl bg-brand-amber/10 hover:bg-brand-amber/20 text-brand-charcoal font-bold flex items-center justify-between transition-all cursor-pointer border border-brand-amber/20"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-amber" />
                    Schedule Practice Reminders
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-amber" />
                </button>
              </div>
            </div>

          </div>
        </div>

          </div>
        )}

      </div>

      {/* Comprehensive Interview Performance & Scorecard Modal */}
      <InterviewReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedReportRecord(null);
        }}
        record={selectedReportRecord}
        studentName={currentUser?.displayName || 'AI Explorer Student'}
        studentEmail={currentUser?.email || 'scholar@clay.edu'}
      />

      {/* Audio & Transcript Replay Modal */}
      <InterviewAudioReplayModal
        isOpen={isAudioReplayOpen}
        onClose={() => {
          setIsAudioReplayOpen(false);
          setSelectedReplayRecord(null);
        }}
        record={selectedReplayRecord}
        studentName={currentUser?.displayName || 'AI Explorer Student'}
      />

      {/* Practice Reminders Scheduling Modal */}
      <PracticeReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      />

      {/* Quick Takeaways & Personal Knowledge Notes Export Modal */}
      <TakeawaysNotesExportModal
        isOpen={isExportNotesModalOpen}
        onClose={() => setIsExportNotesModalOpen(false)}
      />

      {/* Post-Interview Personal Reflections & Notes Modal */}
      <PostInterviewReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => {
          setIsReflectionModalOpen(false);
          setSelectedReflectionRecord(null);
        }}
        record={selectedReflectionRecord}
        onSaveReflection={(recordId, reflectionData) => {
          setInterviewHistory(prev => prev.map(rec => {
            if (rec.id === recordId) {
              return {
                ...rec,
                personalReflections: reflectionData,
                personalNotes: reflectionData.generalNotes
              };
            }
            return rec;
          }));
        }}
      />

      {/* Side-by-Side Interview Comparison Modal */}
      <InterviewComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        records={interviewHistory}
        initialSessionAId={comparisonSessionAId}
        initialSessionBId={comparisonSessionBId}
      />

      {/* Weekly Email Summary & Progress Digest Modal */}
      <WeeklyEmailDigestModal
        isOpen={isEmailDigestModalOpen}
        onClose={() => setIsEmailDigestModalOpen(false)}
        defaultEmail={currentUser?.email || 'syedshahnawazz1519@gmail.com'}
        interviewHistory={interviewHistory}
        streakState={streakState}
        onSavePreferences={(newPrefs) => {
          setEmailDigestPrefs(newPrefs);
        }}
      />

      {/* Quick Start Mock Interview Floating Action Button (FAB) */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            audioEngine.playLoFiChord();
            onStartInterview();
          }}
          className="relative group flex items-center gap-3 px-4.5 py-3.5 rounded-full bg-slate-950 text-white shadow-2xl border-2 border-brand-amber/60 hover:border-brand-amber cursor-pointer overflow-hidden backdrop-blur-md"
          title="Start an immediate mock interview simulation on recommended topic"
        >
          {/* Animated Ambient Pulse Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Icon with pulsing indicator */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-brand-amber text-brand-charcoal shadow-md shrink-0">
            <Zap className="w-4 h-4 fill-brand-charcoal animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          </div>

          {/* Text & Recommendation Badge */}
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xs sm:text-sm tracking-wide text-white">
                Quick Start Mock
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-brand-amber/20 text-brand-amber border border-brand-amber/40">
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-white/70 font-mono flex items-center gap-1">
              <span>🎯 Next:</span>
              <span className="text-brand-amber font-bold truncate max-w-[140px] sm:max-w-[200px]">
                {interviewHistory[0]?.roleTrack || 'Generative AI & LLMs'}
              </span>
            </p>
          </div>
        </motion.button>
      </motion.div>

      {/* CSV Export & Action Feedback Toast Notification */}
      <AnimatePresence>
        {csvToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl border border-emerald-500/40 text-xs font-medium backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Spreadsheet Export Complete</p>
              <p className="text-[11px] text-white/70">{csvToast}</p>
            </div>
            <button
              onClick={() => setCsvToast(null)}
              className="ml-2 text-white/40 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
