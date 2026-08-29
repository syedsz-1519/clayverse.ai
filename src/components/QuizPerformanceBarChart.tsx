import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import {
  BarChart3,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Target,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  Brain,
  Clock,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';
import { quizModules } from '../data/quizQuestions';

export interface QuizSessionRecord {
  id: string;
  sectionId: string;
  sectionTitle: {
    en: string;
    ur: string;
  };
  timestamp: string;
  practiceMode?: boolean;
  scoreEarned: number;
  correctCount: number;
  totalCount: number;
  streakApplied?: number;
  multiplierApplied?: number;
}

interface QuizPerformanceBarChartProps {
  onNavigateSection?: (sectionId: string) => void;
  className?: string;
}

// Sample realistic completion sessions for fresh profiles
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

export default function QuizPerformanceBarChart({
  onNavigateSection,
  className = ''
}: QuizPerformanceBarChartProps) {
  const { lang } = useLanguage();
  const [sessions, setSessions] = useState<QuizSessionRecord[]>([]);
  const [isSampleData, setIsSampleData] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'modules' | 'timeline' | 'scores' | 'domains'>('modules');
  const [activeMetric, setActiveMetric] = useState<'accuracy' | 'points' | 'correct'>('accuracy');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d'>('all');

  // Load quiz sessions from local storage
  const loadSessionsFromStorage = () => {
    try {
      const cached = localStorage.getItem('clay_quiz_sessions');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setIsSampleData(false);
          setSelectedSessionId(parsed[parsed.length - 1]?.id || null);
          return;
        }
      }
      // If none, load sample demonstration sessions
      setSessions(DEFAULT_SAMPLE_QUIZ_SESSIONS);
      setIsSampleData(true);
      setSelectedSessionId(DEFAULT_SAMPLE_QUIZ_SESSIONS[DEFAULT_SAMPLE_QUIZ_SESSIONS.length - 1].id);
    } catch (e) {
      setSessions(DEFAULT_SAMPLE_QUIZ_SESSIONS);
      setIsSampleData(true);
    }
  };

  useEffect(() => {
    loadSessionsFromStorage();

    const handleSync = () => {
      loadSessionsFromStorage();
    };

    window.addEventListener('clay_auth_state_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('clay_auth_state_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Filter sessions by timeframe
  const filteredSessions = useMemo(() => {
    if (timeFilter === 'all') return sessions;
    const now = Date.now();
    const daysLimit = timeFilter === '7d' ? 7 : 30;
    const msLimit = daysLimit * 86400000;
    return sessions.filter(s => {
      const sessionTime = new Date(s.timestamp).getTime();
      return now - sessionTime <= msLimit;
    });
  }, [sessions, timeFilter]);

  // Aggregate stats across filtered sessions
  const kpiStats = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        avgAccuracy: 0,
        totalPoints: 0,
        totalCompleted: 0,
        bestCategory: 'N/A',
        streakBonusCount: 0
      };
    }

    let totalCorrect = 0;
    let totalQuestions = 0;
    let totalScore = 0;
    let streakBonuses = 0;

    filteredSessions.forEach(s => {
      totalCorrect += s.correctCount || 0;
      totalQuestions += s.totalCount || 5;
      totalScore += s.scoreEarned || 0;
      if (s.multiplierApplied && s.multiplierApplied > 1) {
        streakBonuses++;
      }
    });

    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return {
      avgAccuracy,
      totalPoints: totalScore,
      totalCompleted: filteredSessions.length,
      bestCategory: avgAccuracy >= 85 ? 'Transformers & GenAI' : 'AI Foundations',
      streakBonusCount: streakBonuses
    };
  }, [filteredSessions]);

  // 1. Data transformation for 'Module Accuracy' Bar Chart
  const moduleChartData = useMemo(() => {
    return quizModules.map(mod => {
      // Find all sessions matching this module's sections
      const sectionIds = mod.sections.map(s => s.id);
      const matchingSessions = filteredSessions.filter(s => sectionIds.includes(s.sectionId));

      let totalCorrect = 0;
      let totalQuestions = 0;
      let totalPoints = 0;
      let highestScore = 0;

      matchingSessions.forEach(s => {
        totalCorrect += s.correctCount;
        totalQuestions += s.totalCount;
        totalPoints += s.scoreEarned;
        if (s.scoreEarned > highestScore) highestScore = s.scoreEarned;
      });

      const attemptsCount = matchingSessions.length;
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      const avgPoints = attemptsCount > 0 ? Math.round(totalPoints / attemptsCount) : 0;

      // Module color palette matching theme
      const moduleColors: Record<number, string> = {
        1: '#d97706', // amber-600
        2: '#059669', // emerald-600
        3: '#2563eb', // blue-600
        4: '#7c3aed', // violet-600
        5: '#e11d48'  // rose-600
      };

      return {
        id: mod.id,
        moduleNumber: mod.number,
        name: `Mod ${mod.number}: ${mod.title.en.split(' ')[0]}`,
        fullName: mod.title.en,
        fullNameUr: mod.title.ur,
        difficulty: mod.difficulty,
        attempts: attemptsCount,
        accuracy: attemptsCount > 0 ? accuracy : 0,
        points: totalPoints,
        avgPoints,
        highestScore,
        benchmark: 80,
        color: moduleColors[mod.number] || '#d97706',
        targetScore: 50
      };
    });
  }, [filteredSessions]);

  // 2. Data transformation for 'Recent Attempts Timeline' Bar Chart
  const timelineChartData = useMemo(() => {
    // Sort chronological ascending for line/bar left-to-right
    const sorted = [...filteredSessions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const recent = sorted.slice(-10);

    return recent.map((s, idx) => {
      const dateObj = new Date(s.timestamp);
      const dateLabel = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
      const accuracy = s.totalCount > 0 ? Math.round((s.correctCount / s.totalCount) * 100) : 0;

      let barColor = '#059669'; // Emerald
      if (accuracy < 60) barColor = '#e11d48'; // Red
      else if (accuracy < 80) barColor = '#d97706'; // Amber

      return {
        id: s.id,
        index: idx + 1,
        date: dateLabel,
        title: s.sectionTitle.en,
        shortTitle: s.sectionTitle.en.length > 14 ? s.sectionTitle.en.substring(0, 12) + '…' : s.sectionTitle.en,
        accuracy,
        points: s.scoreEarned,
        correctCount: s.correctCount,
        totalCount: s.totalCount,
        multiplier: s.multiplierApplied || 1.0,
        practiceMode: s.practiceMode || false,
        benchmark: 80,
        color: barColor,
        rawSession: s
      };
    });
  }, [filteredSessions]);

  // 3. Data transformation for 'Section Mastery' Bar Chart (Score Earned vs Max)
  const sectionMasteryData = useMemo(() => {
    const allSections = quizModules.flatMap(m => m.sections);
    return allSections.map(sec => {
      const matching = filteredSessions.filter(s => s.sectionId === sec.id);
      const attempts = matching.length;
      let highestPoints = 0;
      let latestAccuracy = 0;

      matching.forEach(s => {
        if (s.scoreEarned > highestPoints) highestPoints = s.scoreEarned;
        latestAccuracy = Math.round((s.correctCount / s.totalCount) * 100);
      });

      return {
        id: sec.id,
        title: sec.title.en,
        shortTitle: sec.title.en.length > 12 ? sec.title.en.substring(0, 10) + '…' : sec.title.en,
        highScore: highestPoints,
        maxPossible: 50,
        attempts,
        accuracy: attempts > 0 ? latestAccuracy : 0,
        isCompleted: attempts > 0
      };
    }).slice(0, 8); // Top 8 active sections for clean visual density
  }, [filteredSessions]);

  // 4. Data transformation for 'Domain Breakdown' Bar Chart
  const domainBreakdownData = useMemo(() => {
    const domains = [
      { name: 'Core Foundations', sectionIds: ['m1-s1', 'm1-s2', 'm1-s3'], color: '#d97706' },
      { name: 'Neural Nets & DL', sectionIds: ['m2-s1', 'm2-s2', 'm2-s3'], color: '#059669' },
      { name: 'Model Optimization', sectionIds: ['m3-s1', 'm3-s2', 'm3-s3'], color: '#2563eb' },
      { name: 'Transformers & GenAI', sectionIds: ['m4-s1', 'm4-s2', 'm4-s3'], color: '#7c3aed' },
      { name: 'Safety & Guardrails', sectionIds: ['m5-s1', 'm5-s2', 'm5-s3'], color: '#e11d48' }
    ];

    return domains.map(dom => {
      const matching = filteredSessions.filter(s => dom.sectionIds.includes(s.sectionId));
      let totalCorrect = 0;
      let totalQuestions = 0;
      let totalPoints = 0;

      matching.forEach(s => {
        totalCorrect += s.correctCount;
        totalQuestions += s.totalCount;
        totalPoints += s.scoreEarned;
      });

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      return {
        domain: dom.name,
        accuracy: matching.length > 0 ? accuracy : 0,
        attempts: matching.length,
        points: totalPoints,
        color: dom.color,
        benchmark: 80
      };
    });
  }, [filteredSessions]);

  // Currently inspected session
  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return sessions.find(s => s.id === selectedSessionId) || null;
  }, [sessions, selectedSessionId]);

  // Custom Tooltip Renderer
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-charcoal/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-white/15 text-left text-xs max-w-xs space-y-1.5 z-50">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
            <span className="font-display font-bold text-brand-amber truncate">
              {data.fullName || data.title || data.domain || label}
            </span>
            {data.attempts !== undefined && (
              <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-white/80 shrink-0">
                {data.attempts} {data.attempts === 1 ? 'attempt' : 'attempts'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5 font-mono">
            <div>
              <span className="text-white/60 block text-[9px] uppercase">Accuracy:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {data.accuracy !== undefined ? `${data.accuracy}%` : `${data.score}%`}
              </span>
            </div>
            {data.points !== undefined && (
              <div>
                <span className="text-white/60 block text-[9px] uppercase">Total XP:</span>
                <span className="font-bold text-amber-300 text-sm">{data.points} pts</span>
              </div>
            )}
            {data.highScore !== undefined && (
              <div>
                <span className="text-white/60 block text-[9px] uppercase">High Score:</span>
                <span className="font-bold text-amber-300 text-sm">{data.highScore} / 50</span>
              </div>
            )}
            {data.multiplier && data.multiplier > 1 && (
              <div>
                <span className="text-white/60 block text-[9px] uppercase">Streak Bonus:</span>
                <span className="font-bold text-orange-400 text-xs">+{Math.round((data.multiplier - 1) * 100)}%</span>
              </div>
            )}
          </div>

          {data.benchmark && (
            <div className="text-[10px] font-mono text-emerald-300/80 pt-1 border-t border-white/10 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Target Benchmark: {data.benchmark}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-6 text-left ${className}`}>
      
      {/* Header Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-brand-amber/15 text-brand-amber shadow-2xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-black text-brand-charcoal">
                  {lang === 'en' ? "Quiz Performance & Historical Analytics" : "Quiz Performance aur Tareekhi Jaanch"}
                </h3>
                {isSampleData && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-900 text-[9px] font-mono font-black uppercase">
                    Sample Data Active
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-muted">
                {lang === 'en'
                  ? "Interactive Recharts bar visualization tracking score accuracy, points progression, and module mastery."
                  : "AI Arena quizzes ke nataij, durust jawab aur module-wise accuracy ka bar chart."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe Filter */}
          <div className="flex items-center p-0.5 rounded-xl bg-brand-sand/40 border border-brand-slate/15 text-xs font-mono font-bold">
            <button
              onClick={() => {
                setTimeFilter('all');
                audioEngine.playLoFiChord();
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeFilter === 'all' ? 'bg-white text-brand-charcoal shadow-2xs' : 'text-brand-slate hover:text-brand-charcoal'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => {
                setTimeFilter('30d');
                audioEngine.playLoFiChord();
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeFilter === '30d' ? 'bg-white text-brand-charcoal shadow-2xs' : 'text-brand-slate hover:text-brand-charcoal'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => {
                setTimeFilter('7d');
                audioEngine.playLoFiChord();
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                timeFilter === '7d' ? 'bg-white text-brand-charcoal shadow-2xs' : 'text-brand-slate hover:text-brand-charcoal'
              }`}
            >
              7 Days
            </button>
          </div>

          {/* Direct Launch AI Arena Button */}
          {onNavigateSection && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audioEngine.playLoFiChord();
                onNavigateSection('quiz-arena');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{lang === 'en' ? "Open AI Arena" : "Quiz Kholein"}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 text-[10px] font-mono font-bold uppercase">
            <span>Avg Quiz Accuracy</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-brand-charcoal font-display mt-1">
            {kpiStats.avgAccuracy}%
          </div>
          <span className="text-[10px] text-emerald-700 font-mono mt-0.5">
            {kpiStats.avgAccuracy >= 80 ? '✓ Exceeding Benchmark (80%)' : 'Near Passing Target'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/[0.06] border border-brand-amber/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-900 text-[10px] font-mono font-bold uppercase">
            <span>Total Arena XP</span>
            <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
          </div>
          <div className="text-2xl font-black text-brand-charcoal font-display mt-1">
            {kpiStats.totalPoints} pts
          </div>
          <span className="text-[10px] text-brand-muted font-mono mt-0.5">
            Includes daily streak bonus
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-500/[0.06] border border-blue-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-900 text-[10px] font-mono font-bold uppercase">
            <span>Sessions Recorded</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-brand-charcoal font-display mt-1">
            {kpiStats.totalCompleted}
          </div>
          <span className="text-[10px] text-blue-700 font-mono mt-0.5">
            5-MCQ evaluation batches
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-500/[0.06] border border-purple-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-900 text-[10px] font-mono font-bold uppercase">
            <span>Strongest Domain</span>
            <Award className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-sm font-black text-brand-charcoal font-display mt-1 truncate" title={kpiStats.bestCategory}>
            {kpiStats.bestCategory}
          </div>
          <span className="text-[10px] text-purple-700 font-mono mt-0.5">
            Highest relative accuracy
          </span>
        </div>
      </div>

      {/* Visualizer Mode & Metric Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-brand-slate/10">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setActiveViewMode('modules');
              audioEngine.playLoFiChord();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeViewMode === 'modules'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-brand-sand/30 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>By Module (1-5)</span>
          </button>

          <button
            onClick={() => {
              setActiveViewMode('timeline');
              audioEngine.playLoFiChord();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeViewMode === 'timeline'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-brand-sand/30 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Timeline Attempts</span>
          </button>

          <button
            onClick={() => {
              setActiveViewMode('scores');
              audioEngine.playLoFiChord();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeViewMode === 'scores'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-brand-sand/30 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Score vs Max</span>
          </button>

          <button
            onClick={() => {
              setActiveViewMode('domains');
              audioEngine.playLoFiChord();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeViewMode === 'domains'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'bg-brand-sand/30 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Domain Breakdown</span>
          </button>
        </div>

        {/* Secondary Metric Toggle (for module & timeline modes) */}
        {(activeViewMode === 'modules' || activeViewMode === 'timeline') && (
          <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
            <span className="text-[10px] font-mono text-brand-muted uppercase mr-1">Metric:</span>
            <button
              onClick={() => setActiveMetric('accuracy')}
              className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                activeMetric === 'accuracy' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-brand-sand/30 text-brand-slate'
              }`}
            >
              Accuracy (%)
            </button>
            <button
              onClick={() => setActiveMetric('points')}
              className={`px-2 py-0.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                activeMetric === 'points' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-brand-sand/30 text-brand-slate'
              }`}
            >
              XP Points
            </button>
          </div>
        )}
      </div>

      {/* Recharts Bar Chart Stage */}
      <div className="w-full h-[320px] pt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          {activeViewMode === 'modules' ? (
            <BarChart
              data={moduleChartData}
              margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                  audioEngine.playLoFiChord();
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, activeMetric === 'accuracy' ? 100 : 'auto']}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                unit={activeMetric === 'accuracy' ? '%' : 'p'}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(217, 119, 6, 0.06)' }} />
              {activeMetric === 'accuracy' && (
                <ReferenceLine
                  y={80}
                  stroke="#059669"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: '80% Benchmark',
                    position: 'top',
                    fill: '#059669',
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: 'monospace'
                  }}
                />
              )}
              <Bar
                dataKey={activeMetric === 'accuracy' ? 'accuracy' : 'points'}
                radius={[8, 8, 2, 2]}
                animationDuration={800}
              >
                {moduleChartData.map((entry, index) => (
                  <Cell
                    key={`cell-mod-${index}`}
                    fill={entry.color}
                    className="transition-all duration-200 hover:opacity-85 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          ) : activeViewMode === 'timeline' ? (
            <BarChart
              data={timelineChartData}
              margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                  const payload = e.activePayload[0].payload;
                  setSelectedSessionId(payload.id);
                  audioEngine.playLoFiChord();
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis
                dataKey="shortTitle"
                tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, activeMetric === 'accuracy' ? 100 : 'auto']}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                unit={activeMetric === 'accuracy' ? '%' : 'p'}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(5, 150, 105, 0.06)' }} />
              {activeMetric === 'accuracy' && (
                <ReferenceLine
                  y={80}
                  stroke="#059669"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: '80% Benchmark',
                    position: 'top',
                    fill: '#059669',
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: 'monospace'
                  }}
                />
              )}
              <Bar
                dataKey={activeMetric === 'accuracy' ? 'accuracy' : 'points'}
                radius={[8, 8, 2, 2]}
                animationDuration={800}
              >
                {timelineChartData.map((entry, index) => (
                  <Cell
                    key={`cell-timeline-${index}`}
                    fill={entry.id === selectedSessionId ? '#d97706' : entry.color}
                    className="transition-all duration-200 hover:opacity-85 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          ) : activeViewMode === 'scores' ? (
            <BarChart
              data={sectionMasteryData}
              margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis
                dataKey="shortTitle"
                tick={{ fill: '#475569', fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 60]}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                unit="p"
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingBottom: '8px' }}
              />
              <Bar name="Your High Score" dataKey="highScore" fill="#d97706" radius={[6, 6, 0, 0]} />
              <Bar name="Max Possible Points" dataKey="maxPossible" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart
              data={domainBreakdownData}
              margin={{ top: 20, right: 15, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis
                dataKey="domain"
                tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.06)' }} />
              <ReferenceLine
                y={80}
                stroke="#059669"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '80% Benchmark',
                  position: 'top',
                  fill: '#059669',
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: 'monospace'
                }}
              />
              <Bar dataKey="accuracy" radius={[8, 8, 2, 2]}>
                {domainBreakdownData.map((entry, index) => (
                  <Cell key={`cell-dom-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Selected Session Drilldown Inspector (If viewing timeline) */}
      {selectedSession && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-brand-sand/20 border border-brand-slate/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber-dark uppercase">
                Attempt Details
              </span>
              <span className="text-[11px] font-mono text-brand-muted">
                {new Date(selectedSession.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {selectedSession.practiceMode && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                  Practice Mode
                </span>
              )}
            </div>

            <div className="font-display font-bold text-sm text-brand-charcoal">
              {selectedSession.sectionTitle.en}
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-brand-slate">
              <span>Score: <strong>{selectedSession.scoreEarned} pts</strong></span>
              <span>•</span>
              <span>Correct: <strong>{selectedSession.correctCount} / {selectedSession.totalCount} ({Math.round((selectedSession.correctCount / selectedSession.totalCount) * 100)}%)</strong></span>
              {selectedSession.streakApplied && selectedSession.streakApplied > 1 && (
                <>
                  <span>•</span>
                  <span className="text-amber-700 font-bold flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-brand-amber" />
                    Streak x{selectedSession.multiplierApplied}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {onNavigateSection && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  audioEngine.playLoFiChord();
                  onNavigateSection('quiz-arena');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>Retake Quiz in Arena</span>
                <ChevronRight className="w-3 h-3 text-brand-amber" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

    </div>
  );
}
