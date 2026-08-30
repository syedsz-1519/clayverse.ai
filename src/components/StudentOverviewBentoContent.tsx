import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Check,
  CheckCircle2,
  Sparkles,
  Award,
  BarChart3,
  TrendingUp,
  Download,
  Wifi,
  WifiOff,
  RefreshCw,
  FolderDown,
  Edit3,
  Mail,
  Video,
  Calendar,
  BarChart2,
  FileSpreadsheet,
  Search,
  Tag,
  Play,
  PlayCircle,
  ChevronUp,
  ChevronDown,
  Activity,
  Brain,
  Zap,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { BentoTileId } from './BentoDashboardDndGrid';
import { LearningPathDependencyMap } from './LearningPathDependencyMap';
import { RecommendedNextLessonCard } from './RecommendedNextLessonCard';
import { QuizPerformanceBarChart } from './QuizPerformanceBarChart';
import { CurriculumProgressChart } from './CurriculumProgressChart';
import { LearningMilestonesSection } from './LearningMilestonesSection';
import { InterviewPerformanceChart } from './InterviewPerformanceChart';
import { HistoricalInterviewTable } from './HistoricalInterviewTable';
import { InterviewConsistencyCalendar } from './InterviewConsistencyCalendar';
import { SessionInlineReflectionEditor } from './SessionInlineReflectionEditor';
import { AI_CURRICULUM_CONCEPTS } from '../curriculumData';

export interface StudentOverviewBentoContentProps {
  tileId: BentoTileId;
  onNavigateSection: (section: string) => void;
  lang: 'en' | 'ur';
  audioEngine: any;
  streakState: any;
  streakCelebrate: boolean;
  handleMarkTodayComplete: () => void;
  masteredConcepts: string[];
  setMasteredConcepts: React.Dispatch<React.SetStateAction<string[]>>;
  toggleConceptMastery: (id: string) => void;
  masteryPercent: number;
  analyticsChartType: 'quiz' | 'curriculum';
  setAnalyticsChartType: (type: 'quiz' | 'curriculum') => void;
  handleDownloadQuizPdf: () => void;
  isOnline: boolean;
  cacheStats: { totalCached: number; estimatedSizeKB: number; lastSynced: string };
  handleSyncCacheManually: () => void;
  isSyncingCache: boolean;
  savedNotesCount: number;
  setIsExportNotesModalOpen: (open: boolean) => void;
  emailDigestPrefs: any;
  setIsEmailDigestModalOpen: (open: boolean) => void;
  currentUser: any;
  interviewHistory: any[];
  setInterviewHistory: (history: any[]) => void;
  selectedChartSessionId: string | null;
  setSelectedChartSessionId: (id: string | null) => void;
  historyViewMode: 'table' | 'cards' | 'calendar';
  setHistoryViewMode: (mode: 'table' | 'cards' | 'calendar') => void;
  setIsComparisonModalOpen: (open: boolean) => void;
  setComparisonSessionAId: (id: string) => void;
  setComparisonSessionBId: (id: string) => void;
  handleExportAllCsv: () => void;
  handleExportSingleCsv: (record: any) => void;
  onStartInterview: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDifficultyFilter: string;
  setSelectedDifficultyFilter: (diff: string) => void;
  selectedTopicFilter: string;
  setSelectedTopicFilter: (topic: string) => void;
  availableTopicTagsWithCounts: Record<string, number>;
  getTopicTagMeta: (topic: string) => any;
  filteredInterviewRecords: Array<{ record: any; derivedTags: any }>;
  expandedInterviewId: string | null;
  setExpandedInterviewId: (id: string | null) => void;
  setSelectedReplayRecord: (rec: any) => void;
  setIsAudioReplayOpen: (open: boolean) => void;
  setSelectedReportRecord: (rec: any) => void;
  setIsReportModalOpen: (open: boolean) => void;
  setSelectedReflectionRecord: (rec: any) => void;
  setIsReflectionModalOpen: (open: boolean) => void;
  studentProfile: any;
  setActiveTab: (tab: string) => void;
  setIsReminderModalOpen: (open: boolean) => void;
}

export const StudentOverviewBentoContent: React.FC<StudentOverviewBentoContentProps> = (props) => {
  const {
    tileId,
    onNavigateSection,
    lang,
    audioEngine,
    streakState,
    streakCelebrate,
    handleMarkTodayComplete,
    masteredConcepts,
    setMasteredConcepts,
    toggleConceptMastery,
    masteryPercent,
    analyticsChartType,
    setAnalyticsChartType,
    handleDownloadQuizPdf,
    isOnline,
    cacheStats,
    handleSyncCacheManually,
    isSyncingCache,
    savedNotesCount,
    setIsExportNotesModalOpen,
    emailDigestPrefs,
    setIsEmailDigestModalOpen,
    currentUser,
    interviewHistory,
    setInterviewHistory,
    selectedChartSessionId,
    setSelectedChartSessionId,
    historyViewMode,
    setHistoryViewMode,
    setIsComparisonModalOpen,
    setComparisonSessionAId,
    setComparisonSessionBId,
    handleExportAllCsv,
    handleExportSingleCsv,
    onStartInterview,
    searchQuery,
    setSearchQuery,
    selectedDifficultyFilter,
    setSelectedDifficultyFilter,
    selectedTopicFilter,
    setSelectedTopicFilter,
    availableTopicTagsWithCounts,
    getTopicTagMeta,
    filteredInterviewRecords,
    expandedInterviewId,
    setExpandedInterviewId,
    setSelectedReplayRecord,
    setIsAudioReplayOpen,
    setSelectedReportRecord,
    setIsReportModalOpen,
    setSelectedReflectionRecord,
    setIsReflectionModalOpen,
    studentProfile,
    setActiveTab,
    setIsReminderModalOpen,
  } = props;

  switch (tileId) {
    case 'recommendations':
      return (
        <div className="flex flex-col h-full">
          <RecommendedNextLessonCard onNavigateSection={onNavigateSection} className="h-full" />
        </div>
      );

    case 'streak':
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            boxShadow: streakCelebrate 
              ? [
                  "0 4px 12px rgba(0,0,0,0.05)",
                  "0 0 35px rgba(217, 119, 6, 0.4)",
                  "0 4px 12px rgba(0,0,0,0.05)"
                ]
              : "0 1px 3px rgba(0, 0, 0, 0.05)"
          }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            boxShadow: { duration: 2, repeat: streakCelebrate ? Infinity : 0 }
          }}
          className={`bg-gradient-to-br from-amber-500/10 via-white to-orange-500/10 border-2 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5 transition-all h-full ${
            streakCelebrate ? 'border-brand-amber ring-4 ring-amber-500/20' : 'border-brand-amber/35'
          }`}
        >
          <div className="space-y-4">
            {/* Header & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={streakCelebrate ? { 
                    scale: [1, 1.25, 0.95, 1.15, 1], 
                    rotate: [0, -10, 10, -5, 0] 
                  } : { scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md relative group shrink-0"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.14, 1],
                      y: [0, -2, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  >
                    <Flame className="w-6 h-6 stroke-[2.5]" />
                  </motion.div>

                  {streakState.todayCompleted && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold border-2 border-white shadow-xs"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark border border-brand-amber/30">
                      Consistency Pulse
                    </span>
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-black text-brand-charcoal mt-0.5 flex items-center gap-1.5">
                    <span>{streakState.currentStreak} Day Streak</span>
                    <motion.span 
                      animate={streakCelebrate ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
                      transition={{ duration: 0.6 }}
                      className="text-base inline-block"
                    >
                      {streakState.todayCompleted ? '🔥' : '⏳'}
                    </motion.span>
                  </h2>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-brand-muted bg-white px-2 py-1 rounded-xl border border-brand-slate/15 shrink-0">
                Best: {streakState.longestStreak}d
              </span>
            </div>

            <p className="text-xs text-brand-slate leading-relaxed">
              {streakState.todayCompleted
                ? (lang === 'en' ? "Awesome job! Today's learning streak is secured." : "Zabardast! Aaj ka sabaq mukammal ho gaya.")
                : (lang === 'en' ? "Complete a lesson or quiz today to maintain your streak!" : "Streak bachane ke liye aaj ka sabaq mukammal karein!")}
            </p>

            {/* 7-Day Visual Dots */}
            <div className="flex items-center justify-between gap-1 p-2.5 rounded-2xl bg-white/80 border border-brand-slate/10 overflow-x-auto">
              {streakState.weeklyActivity.map((day: any, idx: number) => (
                <div key={idx} className="flex flex-col items-center gap-0.5 text-center min-w-[28px]">
                  <span className="text-[9px] font-mono font-bold text-brand-muted">
                    {day.dayName}
                  </span>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      day.completed
                        ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs font-bold text-[10px]'
                        : day.isToday
                        ? 'border-2 border-dashed border-brand-amber bg-brand-amber/10 text-brand-amber text-[10px]'
                        : 'bg-brand-sand/50 text-brand-slate/40 text-[10px]'
                    }`}
                  >
                    {day.completed ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : day.isToday ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-ping" />
                    ) : (
                      <span className="text-[9px] font-mono">{day.dayNumber}</span>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Milestone Badge & Progress */}
            <div className="p-3 rounded-2xl bg-white/80 border border-brand-slate/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-charcoal flex items-center gap-1.5">
                  <span className="text-base">{streakState.currentMilestone.badgeEmoji}</span>
                  <span className="text-xs truncate">{streakState.currentMilestone.title}</span>
                </span>
                <span className="font-mono text-[10.5px] font-bold text-brand-amber shrink-0">
                  Target: {streakState.currentMilestone.nextMilestoneDays}d
                </span>
              </div>

              <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${streakState.currentMilestone.progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-brand-amber to-orange-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Action / Celebration Button */}
          <div className="pt-2">
            {streakCelebrate ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full py-2.5 rounded-2xl bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Streak Milestone Secured! 🎉</span>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMarkTodayComplete}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                  streakState.todayCompleted
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 hover:bg-emerald-500/25'
                    : 'bg-brand-charcoal hover:bg-black text-white'
                }`}
              >
                {streakState.todayCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Today's Learning Verified</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-brand-amber" />
                    <span>Check In & Mark Complete</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      );

    case 'learning-path':
      return (
        <LearningPathDependencyMap
          completedLessonIds={streakState.completedLessonIds || []}
          masteredConceptIds={masteredConcepts}
          onNavigateLesson={() => onNavigateSection('curriculum')}
          onNavigateSection={onNavigateSection}
          onMasterConcept={(conceptId) => {
            setMasteredConcepts((prev: string[]) => Array.from(new Set([...prev, conceptId])));
          }}
        />
      );

    case 'analytics':
      return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-brand-amber/15 text-brand-amber">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-brand-charcoal">
                  {lang === 'en' ? "Performance Visualizer & Analytics" : "Performance Charts aur Analytics"}
                </h3>
                <p className="text-xs text-brand-muted">
                  {lang === 'en'
                    ? "Interactive Recharts visualizer for quiz historical scores, competency accuracy, and curriculum completion."
                    : "Quizzes ki tareekhi accuracy aur curriculum ki raftaar ka visual chart."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center p-1 rounded-2xl bg-white border border-brand-slate/15 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setAnalyticsChartType('quiz');
                    audioEngine.playLoFiChord();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    analyticsChartType === 'quiz'
                      ? 'bg-brand-charcoal text-white shadow-xs'
                      : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/40'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-brand-amber" />
                  <span>Quiz Performance (Bar Chart)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnalyticsChartType('curriculum');
                    audioEngine.playLoFiChord();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    analyticsChartType === 'curriculum'
                      ? 'bg-brand-charcoal text-white shadow-xs'
                      : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/40'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Curriculum Mastery & Time</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadQuizPdf}
                className="px-3 py-2 rounded-2xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Download Quiz Performance Summary Report as PDF"
              >
                <Download className="w-3.5 h-3.5 text-brand-amber" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {analyticsChartType === 'quiz' ? (
            <QuizPerformanceBarChart onNavigateSection={onNavigateSection} />
          ) : (
            <CurriculumProgressChart
              completedLessonIds={streakState.completedLessonIds || []}
              masteredConceptIds={masteredConcepts}
              streakState={streakState}
              onNavigateSection={onNavigateSection}
            />
          )}
        </div>
      );

    case 'milestones':
      return <LearningMilestonesSection onNavigateSection={onNavigateSection} />;

    case 'offline-tools':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Offline Cache Card */}
          <div className="bg-white rounded-3xl p-5 border border-brand-slate/15 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-500/15 text-amber-700'}`}>
                    {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-charcoal">
                      Offline Curriculum
                    </h3>
                    <span className="text-[10px] font-mono text-brand-muted block">
                      {isOnline ? 'Sync: Connected' : 'Offline Mode Active'}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-[10px] font-mono font-bold">
                  100% Cached
                </span>
              </div>

              <p className="text-xs text-brand-slate leading-relaxed">
                All 9 core lessons and glossary terms are stored locally in your browser for study anywhere.
              </p>
            </div>

            <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
              <span className="text-[10.5px] font-mono text-brand-muted">
                {cacheStats.estimatedSizeKB} KB
              </span>

              <button
                onClick={handleSyncCacheManually}
                disabled={isSyncingCache}
                className="px-2.5 py-1.5 rounded-xl bg-brand-sand/60 hover:bg-brand-sand border border-brand-slate/20 text-brand-charcoal text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 text-brand-amber ${isSyncingCache ? 'animate-spin' : ''}`} />
                <span>{isSyncingCache ? 'Syncing...' : 'Refresh Cache'}</span>
              </button>
            </div>
          </div>

          {/* Knowledge Notes & Takeaways Exporter Card */}
          <div className="bg-white rounded-3xl p-5 border border-brand-slate/15 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-brand-amber/15 text-brand-amber">
                    <FolderDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-charcoal">
                      Notes & Takeaways
                    </h3>
                    <span className="text-[10px] font-mono text-brand-muted block">
                      {savedNotesCount} Custom Notes
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-amber-dark text-[10px] font-mono font-bold">
                  PDF / TXT
                </span>
              </div>

              <p className="text-xs text-brand-slate leading-relaxed">
                Export all lesson key points, mental models, and personal reflections into printable PDF or text notes.
              </p>
            </div>

            <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between gap-2">
              <button
                onClick={() => setIsExportNotesModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-brand-sand/60 hover:bg-brand-sand border border-brand-slate/20 text-brand-charcoal text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-blue-600" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => setIsExportNotesModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-brand-amber" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Weekly Email Summary & Digest Card */}
          <div className="bg-white rounded-3xl p-5 border border-brand-slate/15 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${emailDigestPrefs.enabled ? 'bg-indigo-500/15 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-charcoal">
                      Weekly Email Summary
                    </h3>
                    <span className="text-[10px] font-mono text-brand-muted block">
                      {emailDigestPrefs.enabled 
                        ? `${emailDigestPrefs.deliveryDay.charAt(0).toUpperCase() + emailDigestPrefs.deliveryDay.slice(1)} • ${emailDigestPrefs.deliveryTime === '09:00' ? '9:00 AM' : '6:00 PM'}`
                        : 'Opt-in for weekly email'}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  emailDigestPrefs.enabled 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800' 
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  {emailDigestPrefs.enabled ? 'ACTIVE' : 'OPT-IN'}
                </span>
              </div>

              <p className="text-xs text-brand-slate leading-relaxed">
                Automated weekly email recap of your mock interview performance, score progress, and learning streak badges.
              </p>
            </div>

            <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-mono text-brand-muted truncate max-w-[110px]" title={emailDigestPrefs.email || currentUser?.email || 'syedshahnawazz1519@gmail.com'}>
                {emailDigestPrefs.email || currentUser?.email || 'syedshahnawazz1519@gmail.com'}
              </span>

              <button
                onClick={() => {
                  setIsEmailDigestModalOpen(true);
                  audioEngine.playLoFiChord();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
              >
                <Mail className="w-3 h-3 text-indigo-600" />
                <span>{emailDigestPrefs.enabled ? 'Preferences' : 'Opt In'}</span>
              </button>
            </div>
          </div>
        </div>
      );

    case 'interview-history':
      return (
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

              {/* SEARCH & AUTO-TAG TOPIC / DIFFICULTY FILTER TOOLBAR */}
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
                  </div>
                </div>
              )}

              {/* Interview Records Rendering */}
              {filteredInterviewRecords.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-brand-slate/20 rounded-2xl p-6 bg-brand-sand/10">
                  <div className="w-12 h-12 rounded-full bg-brand-sand flex items-center justify-center mx-auto mb-3 text-brand-muted">
                    <Video className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-brand-charcoal">
                    {interviewHistory.length === 0 ? "No Practice Interviews Yet" : "No Matching Interviews Found"}
                  </h4>
                  <p className="text-xs text-brand-muted max-w-sm mx-auto mt-1 mb-4">
                    {interviewHistory.length === 0 
                      ? "Complete your first AI mock interview to generate full analytical scorecards, gaze metrics, audio replays, and CSV logs." 
                      : "Try clearing your search query or topic filter to view historical records."}
                  </p>
                  {interviewHistory.length === 0 ? (
                    <button
                      onClick={onStartInterview}
                      className="px-4 py-2 rounded-xl bg-brand-amber text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start First Mock Interview</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTopicFilter('all');
                        setSelectedDifficultyFilter('all');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-charcoal text-white font-bold text-xs"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              ) : historyViewMode === 'calendar' ? (
                <InterviewConsistencyCalendar
                  records={interviewHistory}
                  onSelectSession={(rec) => {
                    setSelectedReportRecord(rec);
                    setIsReportModalOpen(true);
                    audioEngine.playLoFiChord();
                  }}
                  onSelectDateFilter={(dateStr) => {
                    setSearchQuery(dateStr);
                    setHistoryViewMode('cards');
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
                  onOpenAudioReplayModal={(rec) => {
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
                              {derivedTags.topicTags.map((topic: string) => {
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
                                    {rec.attempts.map((att: any, attIdx: number) => (
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
                {studentProfile.badges.slice(0, 4).map((badge: any) => (
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
      );

    default:
      return null;
  }
};
