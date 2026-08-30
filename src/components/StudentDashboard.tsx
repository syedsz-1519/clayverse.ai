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
import InterviewReportModal from './InterviewReportModal';
import InterviewAudioReplayModal from './InterviewAudioReplayModal';
import PostInterviewReflectionModal from './PostInterviewReflectionModal';
import BentoDashboardDndGrid, { BentoTileId } from './BentoDashboardDndGrid';
import { StudentOverviewBentoContent, AI_CURRICULUM_CONCEPTS } from './StudentOverviewBentoContent';
export { AI_CURRICULUM_CONCEPTS } from './StudentOverviewBentoContent';
import DailyLearningGoalTracker from './DailyLearningGoalTracker';
import PracticeReminderModal from './PracticeReminderModal';
import TakeawaysNotesExportModal from './TakeawaysNotesExportModal';
import StudyGroupsSection from './StudyGroupsSection';
import CurriculumRoadmap from './CurriculumRoadmap';
import BadgeEngine from './BadgeEngine';
import CommunityPeerReviewFeed from './CommunityPeerReviewFeed';
import InterviewComparisonModal from './InterviewComparisonModal';
import WeeklyEmailDigestModal, { getEmailDigestPreferences, type WeeklyEmailDigestPreferences } from './WeeklyEmailDigestModal';
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
