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
  Layers,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  Orbit,
  Headphones,
  Sliders,
  FileText,
  Copy,
  Check,
  Trash2,
  Maximize2,
  Minimize2,
  Save,
  MessageSquareQuote
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { focusMetrics, type FocusMetricsState } from '../lib/focusMetricsManager';
import { focusSoundEngine, type SoundscapeType } from '../lib/focusSoundEngine';
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
  const [activeTab, setActiveTab] = useState<'metrics' | 'scratchpad' | 'soundscape'>('metrics');

  // Soundscape state
  const [soundType, setSoundType] = useState<SoundscapeType>(focusSoundEngine.getSoundType());
  const [soundVolume, setSoundVolume] = useState<number>(focusSoundEngine.getVolume());

  // Scratchpad state
  const [scratchpadText, setScratchpadText] = useState<string>(() => {
    try {
      return localStorage.getItem('clay_focus_scratchpad_v1') || '';
    } catch {
      return '';
    }
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSavedRecently, setIsSavedRecently] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Subscribe to persistent focus metrics state
  useEffect(() => {
    const unsub = focusMetrics.subscribe(state => {
      setMetricsState(state);
    });
    return () => unsub();
  }, []);

  // Subscribe to Soundscape Engine
  useEffect(() => {
    const unsub = focusSoundEngine.subscribe((type, vol) => {
      setSoundType(type);
      setSoundVolume(vol);
    });
    return () => unsub();
  }, []);

  // Auto-save scratchpad to local storage with debounced save indicator
  useEffect(() => {
    try {
      localStorage.setItem('clay_focus_scratchpad_v1', scratchpadText);
      setIsSavedRecently(true);
      const timer = setTimeout(() => setIsSavedRecently(false), 2000);
      return () => clearTimeout(timer);
    } catch (e) {}
  }, [scratchpadText]);

  // Update deep work time periodically
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      focusMetrics.addDeepWorkSeconds(5);
    }, 5000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleCopyNotes = async () => {
    if (!scratchpadText.trim()) return;
    try {
      await navigator.clipboard.writeText(scratchpadText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {}
  };

  const handleClearNotes = () => {
    setScratchpadText('');
    setShowClearConfirm(false);
    try {
      localStorage.removeItem('clay_focus_scratchpad_v1');
    } catch (e) {}
  };

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

  // Total Deep Work Time
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

  // Scratchpad word and char counts
  const wordCount = scratchpadText.trim() ? scratchpadText.trim().split(/\s+/).length : 0;
  const charCount = scratchpadText.length;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="focus-sidebar-container"
          initial={{ opacity: 0, x: -70, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -70, scale: 0.95 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280, mass: 0.85 }}
          className="fixed top-20 left-4 z-50 pointer-events-auto select-none font-sans"
        >
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              /* Collapsed Floating Tab */
              <motion.button
                key="collapsed-metrics"
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.9 }}
                transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                onClick={() => setIsCollapsed(false)}
                className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-zinc-900/95 hover:bg-zinc-850 text-white backdrop-blur-xl shadow-2xl border border-amber-500/40 cursor-pointer transition-all hover:scale-105"
                title="Expand Focus Metrics Sidebar"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-wider">
                    Focus Telemetry
                  </div>
                  <div className="text-xs font-mono font-extrabold text-white">
                    {totalDeepWorkMins}m • {soundType !== 'off' ? `🎵 ${soundType}` : `${focusScore}%`}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </motion.button>
            ) : (
              /* Expanded Full Metrics Sidebar */
              <motion.div
                key="expanded-metrics"
                initial={{ opacity: 0, x: -40, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.94 }}
                transition={{ type: 'spring', damping: 25, stiffness: 280 }}
                className="w-80 sm:w-88 bg-zinc-900/95 text-white backdrop-blur-2xl rounded-3xl p-4 sm:p-5 shadow-2xl border border-amber-500/30 text-left relative overflow-hidden flex flex-col max-h-[85vh]"
              >
                {/* Ambient Background Radial Glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header: Title, Streak & Collapse Trigger */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-white/10 relative z-10 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                        <span>{lang === 'te' ? 'ఫోకస్ హబ్' : lang === 'hi' ? 'फोकस हब' : 'Focus Hub'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </h3>
                      <span className="text-[10px] text-zinc-400 font-mono">Telemetry & Scratchpad</span>
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

                {/* Navigation Pills: Metrics | Soundscapes | Scratchpad */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-black/40 rounded-2xl border border-white/10 mb-3.5 shrink-0">
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'metrics'
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Stats</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('soundscape')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer relative ${
                      activeTab === 'soundscape'
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Audio</span>
                    {soundType !== 'off' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute top-1.5 right-1.5" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('scratchpad')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      activeTab === 'scratchpad'
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Notes</span>
                    {scratchpadText.trim().length > 0 && (
                      <span className="text-[9px] px-1 bg-white/20 rounded font-mono">
                        {wordCount}w
                      </span>
                    )}
                  </button>
                </div>

                {/* Tab 1: METRICS & TELEMETRY */}
                {activeTab === 'metrics' && (
                  <motion.div
                    key="tab-metrics"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3 overflow-y-auto pr-0.5 custom-scrollbar"
                  >
                    {/* Metric Card 1: Total Deep Work Time */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 relative group">
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
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
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
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                        <span className="flex items-center gap-1.5 font-medium text-sky-300">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{lang === 'te' ? 'పాఠంలో మిగిలిన కంటెంట్' : lang === 'hi' ? 'पाठ में शेष सामग्री' : 'Remaining Content'}</span>
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
                          {subtopics.length > 0 ? `${Math.min(subtopics.length, Math.ceil((contentProgressPercent / 100) * subtopics.length))}/${subtopics.length} Done` : 'In Progress'}
                        </span>
                      </div>
                    </div>

                    {/* Metric Card 4: Focus Score & Distraction Shield */}
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
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
                  </motion.div>
                )}

                {/* Tab 2: AMBIENT SOUNDSCAPES */}
                {activeTab === 'soundscape' && (
                  <motion.div
                    key="tab-soundscape"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3 overflow-y-auto pr-0.5 custom-scrollbar"
                  >
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <Headphones className="w-3.5 h-3.5" />
                          <span>Soundscape Generator</span>
                        </span>
                        {soundType !== 'off' && (
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-75" />
                            <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse delay-150" />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                        Procedurally synthesized audio waves engineered to mask ambient noise and enhance cognitive concentration.
                      </p>

                      {/* Sound Preset Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Off */}
                        <button
                          onClick={() => focusSoundEngine.setSoundType('off')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                            soundType === 'off'
                              ? 'bg-zinc-800 text-white border-white/30 shadow-sm'
                              : 'bg-black/20 text-zinc-400 hover:text-white border-white/5 hover:border-white/15'
                          }`}
                        >
                          <VolumeX className="w-4 h-4 text-zinc-400" />
                          <span>Off</span>
                        </button>

                        {/* Rain */}
                        <button
                          onClick={() => focusSoundEngine.setSoundType('rain')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                            soundType === 'rain'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-400/50 shadow-md font-bold'
                              : 'bg-black/20 text-zinc-400 hover:text-blue-300 border-white/5 hover:border-white/15'
                          }`}
                        >
                          <CloudRain className="w-4 h-4 text-blue-400" />
                          <span>Rainfall</span>
                        </button>

                        {/* White / Pink Noise */}
                        <button
                          onClick={() => focusSoundEngine.setSoundType('whiteNoise')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                            soundType === 'whiteNoise'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-md font-bold'
                              : 'bg-black/20 text-zinc-400 hover:text-purple-300 border-white/5 hover:border-white/15'
                          }`}
                        >
                          <Radio className="w-4 h-4 text-purple-400" />
                          <span>White Noise</span>
                        </button>

                        {/* Deep Space Drone */}
                        <button
                          onClick={() => focusSoundEngine.setSoundType('deepSpace')}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                            soundType === 'deepSpace'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-md font-bold'
                              : 'bg-black/20 text-zinc-400 hover:text-amber-300 border-white/5 hover:border-white/15'
                          }`}
                        >
                          <Orbit className="w-4 h-4 text-amber-400" />
                          <span>Deep Space</span>
                        </button>

                        {/* Gamma Binaural Beats */}
                        <button
                          onClick={() => focusSoundEngine.setSoundType('binaural')}
                          className={`col-span-2 p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition-all cursor-pointer ${
                            soundType === 'binaural'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-md font-bold'
                              : 'bg-black/20 text-zinc-400 hover:text-emerald-300 border-white/5 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span>40Hz Gamma Binaural Beats</span>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Focus
                          </span>
                        </button>
                      </div>

                      {/* Volume Slider */}
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5 font-mono">
                          <span className="flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Volume</span>
                          </span>
                          <span>{Math.round(soundVolume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={soundVolume}
                          onChange={(e) => focusSoundEngine.setVolume(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: LOCAL-ONLY SCRATCHPAD */}
                {activeTab === 'scratchpad' && (
                  <motion.div
                    key="tab-scratchpad"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-2 flex-1 flex flex-col min-h-0"
                  >
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex-1 flex flex-col">
                      {/* Scratchpad Header & Status */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-bold text-zinc-200">Study Scratchpad</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isSavedRecently && (
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Saved locally
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {wordCount} words • {charCount} chars
                          </span>
                        </div>
                      </div>

                      {/* Textarea */}
                      <textarea
                        value={scratchpadText}
                        onChange={(e) => setScratchpadText(e.target.value)}
                        placeholder="Jot down quick thoughts, formulas, code snippets, or questions here without leaving Focus Mode..."
                        className="w-full flex-1 min-h-[140px] p-2.5 rounded-xl bg-zinc-950/70 border border-white/10 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 resize-none font-sans leading-relaxed custom-scrollbar"
                      />

                      {/* Scratchpad Action Toolbar */}
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handleCopyNotes}
                            disabled={!scratchpadText.trim()}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] border border-white/10 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Copy scratchpad notes to clipboard"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-zinc-400" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {showClearConfirm ? (
                            <div className="flex items-center gap-1 bg-red-950/60 p-0.5 rounded-lg border border-red-500/40">
                              <button
                                onClick={handleClearNotes}
                                className="px-2 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold cursor-pointer hover:bg-red-400"
                              >
                                Clear All
                              </button>
                              <button
                                onClick={() => setShowClearConfirm(false)}
                                className="px-1.5 py-0.5 text-zinc-400 hover:text-white text-[10px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowClearConfirm(true)}
                              disabled={!scratchpadText.trim()}
                              className="p-1 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 text-[11px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              title="Clear notes"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] text-zinc-500 font-mono">
                          Auto-persists locally
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bottom Quick Action: Trigger 5-Min Visual Rest */}
                <div className="mt-3 pt-2.5 border-t border-white/10 shrink-0">
                  <button
                    onClick={onTriggerVisualBreak}
                    className="w-full py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 group hover:scale-[1.01]"
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
