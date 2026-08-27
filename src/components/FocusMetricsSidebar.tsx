import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  ShieldAlert, 
  BookOpen, 
  TrendingUp, 
  Award,
  Layers
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { focusMetrics, type FocusMetricsState } from '../lib/focusMetricsManager';
import { LESSON_MODULES, type LessonModule } from './HomeCurriculumGrid';
import { LESSON_SUBTOPICS } from './IndividualLessonView';

export interface FocusMetricsSidebarProps {
  isVisible: boolean;
  currentLessonId?: string;
  activeSeconds: number;
  distractionCount: number;
  onTriggerVisualBreak: () => void;
}

export default function FocusMetricsSidebar({
  isVisible,
  currentLessonId,
  activeSeconds,
  distractionCount,
  onTriggerVisualBreak
}: FocusMetricsSidebarProps) {
  const { lang } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [metricsState, setMetricsState] = useState<FocusMetricsState>(focusMetrics.getState());

  // Subscribe to persistent focus metrics state
  useEffect(() => {
    const unsub = focusMetrics.subscribe(state => {
      setMetricsState(state);
    });
    return () => unsub();
  }, []);

  // Update deep work time periodically
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      // Periodically sync 5 seconds to storage
      focusMetrics.addDeepWorkSeconds(5);
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  // Active Lesson Metadata
  const currentModule = LESSON_MODULES.find(m => m.id === currentLessonId) || LESSON_MODULES[0];
  const subtopics = (currentLessonId && LESSON_SUBTOPICS[currentLessonId]) || [
    { id: 'sec-1', titleEn: 'Core Concepts', titleHyd: 'Core Concepts', readMins: '3 min' },
    { id: 'sec-2', titleEn: 'Architecture Deep-Dive', titleHyd: 'Architecture', readMins: '4 min' },
    { id: 'sec-3', titleEn: 'Real-World Applications', titleHyd: 'Applications', readMins: '3 min' },
    { id: 'sec-4', titleEn: 'Interactive Knowledge Check', titleHyd: 'Knowledge Check', readMins: '2 min' }
  ];

  // Calculate remaining content estimation
  const totalLessonMinutes = subtopics.reduce((acc, s) => {
    const parsed = parseInt(s.readMins, 10);
    return acc + (isNaN(parsed) ? 3 : parsed);
  }, 0);

  // Minutes spent in current session
  const currentSessionMinutes = Math.floor(activeSeconds / 60);
  const remainingLessonMinutes = Math.max(1, totalLessonMinutes - currentSessionMinutes);
  const contentProgressPercent = Math.min(100, Math.round((currentSessionMinutes / Math.max(totalLessonMinutes, 1)) * 100));

  // Total Deep Work Time (live today + current unsaved seconds)
  const totalTodaySeconds = metricsState.todayDeepWorkSeconds + activeSeconds;
  const totalDeepWorkHours = Math.floor(totalTodaySeconds / 3600);
  const totalDeepWorkMins = Math.floor((totalTodaySeconds % 3600) / 60);
  const totalDeepWorkSecs = totalTodaySeconds % 60;

  const formatDeepWorkString = () => {
    if (totalDeepWorkHours > 0) {
      return `${totalDeepWorkHours}h ${totalDeepWorkMins}m ${totalDeepWorkSecs}s`;
    }
    return `${totalDeepWorkMins}m ${totalDeepWorkSecs}s`;
  };

  // Focus Score
  const focusScore = Math.max(0, Math.min(100, Math.round(100 - (distractionCount * 12))));

  // Daily Deep Work Goal progress
  const goalProgressPercent = Math.min(100, Math.round((totalTodaySeconds / (metricsState.dailyGoalMinutes * 60)) * 100));

  return (
    <div className="fixed top-20 left-4 z-50 pointer-events-auto select-none font-sans">
      <AnimatePresence mode="wait">
        {isCollapsed ? (
          /* Collapsed Floating Tab */
          <motion.button
            key="collapsed-metrics"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setIsCollapsed(false)}
            className="group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white backdrop-blur-md shadow-2xl border border-amber-500/40 cursor-pointer transition-all hover:scale-105"
            title="Expand Focus Metrics Sidebar"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-bold text-amber-400 font-mono uppercase">
                Focus Metrics
              </div>
              <div className="text-xs font-mono font-extrabold text-white">
                {totalDeepWorkMins}m Deep Work
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </motion.button>
        ) : (
          /* Expanded Full Metrics Sidebar */
          <motion.div
            key="expanded-metrics"
            initial={{ opacity: 0, x: -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="w-72 sm:w-80 bg-zinc-900/95 text-white backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-amber-500/30 text-left relative overflow-hidden"
          >
            {/* Ambient Background Radial Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Title, Streak & Collapse Trigger */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{lang === 'te' ? 'ఫోకస్ గణాంకాలు' : lang === 'hi' ? 'फोकस मेट्रिक्स' : 'Focus Metrics'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Live Study Telemetry</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Focus Streak Badge */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-mono font-bold" title="Daily Focus Streak">
                  <Flame className="w-3.5 h-3.5 fill-orange-400/30" />
                  <span>{metricsState.focusStreakDays}d</span>
                </div>

                <button
                  onClick={() => setIsCollapsed(true)}
                  className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Minimize Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Metric Card 1: Total Deep Work Time */}
            <div className="mb-3 p-3 rounded-2xl bg-black/40 border border-white/10 relative group">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span className="flex items-center gap-1.5 font-medium text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'మొత్తం డీప్ వర్క్ సమయం' : lang === 'hi' ? 'कुल डीप वर्क समय' : 'Total Deep Work Time'}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Today</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xl font-extrabold text-white tracking-tight">
                  {formatDeepWorkString()}
                </span>
                <span className="text-[11px] text-amber-400/90 font-mono font-semibold">
                  +{metricsState.todayXp} XP
                </span>
              </div>
              
              {/* Daily Goal Bar */}
              <div className="mt-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 font-mono">
                  <span>Daily Goal ({metricsState.dailyGoalMinutes}m)</span>
                  <span>{goalProgressPercent}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${goalProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metric Card 2: Sessions Completed Today */}
            <div className="mb-3 p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-400 leading-tight">
                    {lang === 'te' ? 'నేడు పూర్తయిన సెషన్‌లు' : lang === 'hi' ? 'आज पूरे किए गए सत्र' : 'Sessions Completed Today'}
                  </div>
                  <div className="text-sm font-bold font-mono text-white">
                    {metricsState.todaySessionsCompleted} {metricsState.todaySessionsCompleted === 1 ? 'Session' : 'Sessions'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  {metricsState.todayVisualBreaksCompleted} Breaks
                </span>
              </div>
            </div>

            {/* Metric Card 3: Remaining Content in Lesson */}
            <div className="mb-3.5 p-3 rounded-2xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span className="flex items-center gap-1.5 font-medium text-sky-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{lang === 'te' ? 'పాఠంలో మిగిలిన కంటెంట్' : lang === 'hi' ? 'पाठ में शेष सामग्री' : 'Remaining Content in Lesson'}</span>
                </span>
                <span className="font-mono text-[10px] text-sky-400 font-bold">
                  ~{remainingLessonMinutes} min left
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-200 mt-1 mb-1.5">
                <span className="truncate max-w-[170px] text-[11px] text-zinc-300">
                  {currentModule.titleEn}
                </span>
                <span className="font-mono text-[11px] font-bold text-white">
                  {contentProgressPercent}%
                </span>
              </div>

              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-sky-400 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${contentProgressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 pt-1.5 border-t border-white/5 font-mono">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-zinc-400" />
                  <span>{subtopics.length} Subtopics</span>
                </span>
                <span className="text-zinc-300">
                  {subtopics.length > 0 ? `${Math.min(subtopics.length, Math.ceil((contentProgressPercent / 100) * subtopics.length))}/${subtopics.length} Sections` : 'In Progress'}
                </span>
              </div>
            </div>

            {/* Metric Card 4: Focus Score & Distraction Shield */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${focusScore > 80 ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  <span className="text-xs font-semibold text-zinc-300">Focus Score</span>
                </div>
                <span className="font-mono font-extrabold text-sm text-emerald-300">
                  {focusScore}%
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 leading-snug">
                {distractionCount === 0 
                  ? 'Pristine deep work streak. Zero distractions.' 
                  : `${distractionCount} app switch interruptions detected.`}
              </p>
            </div>

            {/* Quick Action: Trigger 5-Min Visual Rest */}
            <button
              onClick={onTriggerVisualBreak}
              className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <Eye className="w-4 h-4 text-zinc-950 group-hover:animate-bounce" />
              <span>
                {lang === 'te' 
                  ? '5 నిమిషాల కంటి విశ్రాంతి తీసుకోండి' 
                  : lang === 'hi' 
                  ? '5 मिनट का नेत्र विराम लें' 
                  : 'Take 5-Min Visual Break'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
