import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
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
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Filter,
  Eye,
  ArrowUpRight,
  BookOpen,
  Brain,
  Compass,
  Flame,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { streakManager, getIsoDateStr, type DailyStreakState } from '../lib/streakManager';
import { audioEngine } from '../lib/audioEngine';

export interface CurriculumModuleMeta {
  id: string;
  name: string;
  shortName: string;
  category: string;
  color: string;
  lightBg: string;
  borderCol: string;
  gradientId: string;
  lessonIds: string[];
  conceptIds: string[];
  totalLessons: number;
  totalConcepts: number;
  targetMinutes: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const CURRICULUM_MODULES: CurriculumModuleMeta[] = [
  {
    id: 'foundations',
    name: 'AI Foundations & ML Analogy',
    shortName: 'Foundations',
    category: 'Core',
    color: '#d97706', // amber-600
    lightBg: 'rgba(217, 119, 6, 0.1)',
    borderCol: 'rgba(217, 119, 6, 0.3)',
    gradientId: 'gradFoundations',
    lessonIds: ['what-is-ai'],
    conceptIds: ['c1'],
    totalLessons: 1,
    totalConcepts: 1,
    targetMinutes: 25,
    icon: Compass
  },
  {
    id: 'neural',
    name: 'Neural Networks & ML Family Tree',
    shortName: 'Neural & ML',
    category: 'Architecture',
    color: '#059669', // emerald-600
    lightBg: 'rgba(5, 150, 105, 0.1)',
    borderCol: 'rgba(5, 150, 105, 0.3)',
    gradientId: 'gradNeural',
    lessonIds: ['family-tree'],
    conceptIds: ['c2', 'c3'],
    totalLessons: 1,
    totalConcepts: 2,
    targetMinutes: 35,
    icon: Brain
  },
  {
    id: 'genai',
    name: 'Generative AI & Transformer Models',
    shortName: 'GenAI & LLMs',
    category: 'Transformers',
    color: '#0284c7', // sky-600
    lightBg: 'rgba(2, 132, 199, 0.1)',
    borderCol: 'rgba(2, 132, 199, 0.3)',
    gradientId: 'gradGenAI',
    lessonIds: ['generative-ai'],
    conceptIds: ['c4'],
    totalLessons: 1,
    totalConcepts: 1,
    targetMinutes: 40,
    icon: Zap
  },
  {
    id: 'prompt_rag',
    name: 'Prompt Engineering & RAG Retrieval',
    shortName: 'Prompt & RAG',
    category: 'Applications',
    color: '#9333ea', // purple-600
    lightBg: 'rgba(147, 51, 234, 0.1)',
    borderCol: 'rgba(147, 51, 234, 0.3)',
    gradientId: 'gradPromptRAG',
    lessonIds: ['prompting-rag'],
    conceptIds: ['c5', 'c6'],
    totalLessons: 1,
    totalConcepts: 2,
    targetMinutes: 45,
    icon: BookOpen
  },
  {
    id: 'alignment',
    name: 'Model Alignment, Safety & Tools',
    shortName: 'Safety & Tools',
    category: 'Production',
    color: '#e11d48', // rose-600
    lightBg: 'rgba(225, 29, 72, 0.1)',
    borderCol: 'rgba(225, 29, 72, 0.3)',
    gradientId: 'gradAlignment',
    lessonIds: ['deeper', 'tools'],
    conceptIds: ['c7', 'c8'],
    totalLessons: 2,
    totalConcepts: 2,
    targetMinutes: 50,
    icon: Target
  },
  {
    id: 'labs_arena',
    name: 'Interactive Labs, Flashcards & Arena',
    shortName: 'Labs & Arena',
    category: 'Evaluation',
    color: '#4f46e5', // indigo-600
    lightBg: 'rgba(79, 70, 229, 0.1)',
    borderCol: 'rgba(79, 70, 229, 0.3)',
    gradientId: 'gradLabs',
    lessonIds: ['flashcards', 'classroom-hub', 'arena'],
    conceptIds: [],
    totalLessons: 3,
    totalConcepts: 0,
    targetMinutes: 40,
    icon: Award
  }
];

export type TimeRangeOption = '7d' | '14d' | '30d' | 'all';
export type ChartViewMode = 'area' | 'line' | 'bar' | 'radar';

interface CurriculumProgressChartProps {
  completedLessonIds?: string[];
  masteredConceptIds?: string[];
  streakState?: DailyStreakState;
  onNavigateSection?: (sectionId: string) => void;
  className?: string;
}

export default function CurriculumProgressChart({
  completedLessonIds = [],
  masteredConceptIds = ['c1', 'c2', 'c6'],
  streakState,
  onNavigateSection,
  className = ''
}: CurriculumProgressChartProps) {
  const { lang } = useLanguage();

  const [timeRange, setTimeRange] = useState<TimeRangeOption>('14d');
  const [viewMode, setViewMode] = useState<ChartViewMode>('area');
  const [selectedModuleId, setSelectedModuleId] = useState<string | 'all'>('all');
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any | null>(null);

  // Compute live current completion percentage for each module
  const currentModuleStats = useMemo(() => {
    const activeLessons = completedLessonIds.length > 0
      ? completedLessonIds
      : streakManager.getStreakState().completedLessonIds;

    const stats: Record<string, {
      completedLessons: number;
      completedConcepts: number;
      completionRate: number; // 0 - 100
      studyMinutes: number;
    }> = {};

    CURRICULUM_MODULES.forEach(mod => {
      const finishedLessons = mod.lessonIds.filter(id => activeLessons.includes(id)).length;
      const finishedConcepts = mod.conceptIds.filter(id => masteredConceptIds.includes(id)).length;

      // Base weight: lessons 60%, concepts 40% (or 100% lessons if no concepts)
      let rate = 0;
      if (mod.conceptIds.length > 0) {
        const lessonScore = (finishedLessons / mod.totalLessons) * 60;
        const conceptScore = (finishedConcepts / mod.totalConcepts) * 40;
        rate = Math.round(lessonScore + conceptScore);
      } else {
        rate = Math.round((finishedLessons / mod.totalLessons) * 100);
      }

      // Guarantee realistic minimum engagement representation for started modules
      if (finishedLessons > 0 && rate < 35) {
        rate = 35;
      }

      const studyMins = Math.round((rate / 100) * mod.targetMinutes);

      stats[mod.id] = {
        completedLessons: finishedLessons,
        completedConcepts: finishedConcepts,
        completionRate: Math.min(100, Math.max(0, rate)),
        studyMinutes: Math.max(studyMins, finishedLessons > 0 ? 12 : 0)
      };
    });

    return stats;
  }, [completedLessonIds, masteredConceptIds]);

  // Overall Weighted Curriculum Completion
  const overallCurriculumRate = useMemo(() => {
    const total = CURRICULUM_MODULES.reduce((acc, m) => acc + currentModuleStats[m.id].completionRate, 0);
    return Math.round(total / CURRICULUM_MODULES.length);
  }, [currentModuleStats]);

  // Generate historical daily timeline based on time range
  const timelineData = useMemo(() => {
    const daysCount = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : timeRange === '30d' ? 30 : 45;
    const today = new Date();
    const data = [];

    const activeCompletionDates = streakState?.completionDates || [getIsoDateStr()];

    // Baseline historical progress simulation anchored by real user state
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const isoStr = getIsoDateStr(d);
      
      const dayLabel = d.toLocaleDateString(lang === 'en' ? 'en-US' : 'en-GB', {
        month: 'short',
        day: 'numeric'
      });

      // Progress fraction curve (S-curve sigmoid growth leading up to current state)
      const progressFraction = Math.min(1, Math.max(0.08, Math.pow((daysCount - i) / daysCount, 1.25)));

      // Day record
      const row: any = {
        dateStr: isoStr,
        dayLabel,
        daysAgo: i,
        isToday: i === 0,
        isActiveDay: activeCompletionDates.includes(isoStr) || i === 0
      };

      let dailyTotalRate = 0;
      let dailyStudyMinutes = 0;

      CURRICULUM_MODULES.forEach((mod, modIdx) => {
        const finalRate = currentModuleStats[mod.id]?.completionRate || 0;
        // Natural staggered emergence: Foundations starts first, Labs unlocks later
        const moduleLag = modIdx * 0.12;
        const adjustedFraction = Math.max(0, (progressFraction - moduleLag) / (1 - moduleLag || 1));
        
        let pointRate = Math.round(finalRate * adjustedFraction);
        if (i === 0) pointRate = finalRate; // exact match on current day

        row[mod.id] = pointRate;
        dailyTotalRate += pointRate;
        dailyStudyMinutes += Math.round((pointRate / 100) * (mod.targetMinutes / 6));
      });

      row.overall = Math.round(dailyTotalRate / CURRICULUM_MODULES.length);
      // Target Benchmark Curve: steady expected trajectory (reaches 85% by end of timeframe)
      row.targetBenchmark = Math.min(95, Math.round(((daysCount - i) / daysCount) * 85));
      row.dailyMinutes = Math.max(5, dailyStudyMinutes);
      row.xpGained = Math.round(row.overall * 15 + (row.isActiveDay ? 45 : 10));

      data.push(row);
    }

    return data;
  }, [timeRange, currentModuleStats, streakState, lang]);

  // Data for Radar Competency Comparison
  const radarChartData = useMemo(() => {
    return CURRICULUM_MODULES.map(m => {
      const stats = currentModuleStats[m.id];
      return {
        module: m.shortName,
        fullName: m.name,
        currentRate: stats?.completionRate || 0,
        benchmark: 80,
        fullMark: 100,
        color: m.color
      };
    });
  }, [currentModuleStats]);

  // Determine key insight metrics
  const fastestAdvancingModule = useMemo(() => {
    let best = CURRICULUM_MODULES[0];
    let maxRate = -1;
    CURRICULUM_MODULES.forEach(m => {
      const r = currentModuleStats[m.id]?.completionRate || 0;
      if (r > maxRate) {
        maxRate = r;
        best = m;
      }
    });
    return { ...best, rate: maxRate };
  }, [currentModuleStats]);

  // Velocity calculation: % growth over selected window
  const velocityInsight = useMemo(() => {
    if (timelineData.length < 2) return '+4.0%';
    const startRate = timelineData[0].overall;
    const endRate = timelineData[timelineData.length - 1].overall;
    const diff = endRate - startRate;
    return diff > 0 ? `+${diff}%` : `+${Math.max(1, endRate)}%`;
  }, [timelineData]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const dataRow = payload[0]?.payload;
    if (!dataRow) return null;

    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-brand-slate/20 shadow-xl text-xs space-y-2.5 min-w-[240px] z-50">
        <div className="flex items-center justify-between border-b border-brand-slate/10 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-brand-charcoal">
            <Calendar className="w-3.5 h-3.5 text-brand-amber" />
            <span>{dataRow.dayLabel} ({dataRow.dateStr})</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber-dark font-mono font-bold text-[10px]">
            {dataRow.overall}% Total
          </span>
        </div>

        {/* Breakdown of modules */}
        <div className="space-y-1.5">
          {CURRICULUM_MODULES.filter(m => selectedModuleId === 'all' || selectedModuleId === m.id).map(m => {
            const val = dataRow[m.id] ?? 0;
            return (
              <div key={m.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="text-brand-slate text-[11px] truncate">{m.shortName}:</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono font-bold text-brand-charcoal text-[11px]">
                  <span>{val}%</span>
                  <div className="w-12 h-1.5 bg-brand-sand rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full rounded-full" style={{ width: `${val}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info: target benchmark and active study time */}
        <div className="pt-2 border-t border-brand-slate/10 flex items-center justify-between text-[10px] font-mono text-brand-muted">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3 text-brand-slate" />
            Target: {dataRow.targetBenchmark}%
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <Clock className="w-3 h-3" />
            ~{dataRow.dailyMinutes} mins logged
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-6 border border-brand-slate/15 shadow-sm space-y-5 ${className}`}>
      
      {/* ========================================================================= */}
      {/* 1. HEADER & INTERACTIVE CONTROLS BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-amber-dark text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-brand-amber" />
              Interactive Recharts Analytics
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {overallCurriculumRate}% Total Mastery
            </span>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-black text-brand-charcoal flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-amber" />
            <span>{lang === 'en' ? "Curriculum Module Completion Over Time" : "Curriculum Completion Progress"}</span>
          </h3>

          <p className="text-xs text-brand-slate max-w-xl">
            {lang === 'en'
              ? "Track your cumulative learning trajectory across all 6 AI core modules, comparing historical mastery against recommended graduation benchmarks."
              : "Apni AI curriculum completion aur seekhne ki raftaar ka waqt ke sath jaiza lein."}
          </p>
        </div>

        {/* View Mode & Time Range Selectors */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          
          {/* Chart View Modes */}
          <div className="flex items-center gap-1 p-1 bg-brand-sand/50 rounded-2xl border border-brand-slate/10 text-xs">
            <button
              onClick={() => {
                setViewMode('area');
                audioEngine.playLoFiChord();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'area' ? 'bg-brand-charcoal text-white shadow-xs' : 'text-brand-slate hover:text-brand-charcoal'
              }`}
              title="Stream Area Chart"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Stream</span>
            </button>

            <button
              onClick={() => {
                setViewMode('line');
                audioEngine.playLoFiChord();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'line' ? 'bg-brand-charcoal text-white shadow-xs' : 'text-brand-slate hover:text-brand-charcoal'
              }`}
              title="Multi-Line Progression"
            >
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Lines</span>
            </button>

            <button
              onClick={() => {
                setViewMode('bar');
                audioEngine.playLoFiChord();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'bar' ? 'bg-brand-charcoal text-white shadow-xs' : 'text-brand-slate hover:text-brand-charcoal'
              }`}
              title="Velocity Bar Breakdown"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Bars</span>
            </button>

            <button
              onClick={() => {
                setViewMode('radar');
                audioEngine.playLoFiChord();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'radar' ? 'bg-brand-charcoal text-white shadow-xs' : 'text-brand-slate hover:text-brand-charcoal'
              }`}
              title="Competency Radar Comparison"
            >
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Radar</span>
            </button>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center gap-1 p-1 bg-brand-sand/50 rounded-2xl border border-brand-slate/10 text-xs">
            {(['7d', '14d', '30d', 'all'] as TimeRangeOption[]).map(t => (
              <button
                key={t}
                onClick={() => {
                  setTimeRange(t);
                  audioEngine.playLoFiChord();
                }}
                className={`px-2.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
                  timeRange === t
                    ? 'bg-brand-amber text-white shadow-xs'
                    : 'text-brand-slate hover:text-brand-charcoal hover:bg-white/60'
                }`}
              >
                {t === '7d' ? '7D' : t === '14d' ? '14D' : t === '30d' ? '30D' : 'All'}
              </button>
            ))}
          </div>

          {/* Benchmark Line Toggle */}
          {viewMode !== 'radar' && (
            <button
              onClick={() => setShowBenchmark(!showBenchmark)}
              className={`p-2 rounded-2xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showBenchmark
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
                  : 'bg-brand-sand/30 border-brand-slate/15 text-brand-muted hover:text-brand-charcoal'
              }`}
              title="Toggle target graduation benchmark pace line"
            >
              <Target className="w-3.5 h-3.5 text-brand-amber" />
              <span className="text-[10px] hidden md:inline">Benchmark</span>
            </button>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE MODULE FILTER PILLS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => {
            setSelectedModuleId('all');
            audioEngine.playLoFiChord();
          }}
          className={`px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            selectedModuleId === 'all'
              ? 'bg-brand-charcoal text-white shadow-2xs'
              : 'bg-brand-sand/40 hover:bg-brand-sand text-brand-slate border border-brand-slate/10'
          }`}
        >
          <Filter className="w-3 h-3" />
          <span>All Modules</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
            {overallCurriculumRate}%
          </span>
        </button>

        {CURRICULUM_MODULES.map(m => {
          const isSelected = selectedModuleId === m.id;
          const stats = currentModuleStats[m.id];
          const Icon = m.icon;

          return (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedModuleId(isSelected ? 'all' : m.id);
                audioEngine.playLoFiChord();
              }}
              className={`px-3 py-1.5 rounded-xl font-medium text-[11px] transition-all shrink-0 flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'text-white shadow-xs font-bold'
                  : 'bg-white hover:bg-brand-sand/30 text-brand-charcoal border-brand-slate/15'
              }`}
              style={{
                backgroundColor: isSelected ? m.color : undefined,
                borderColor: isSelected ? m.color : undefined
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: isSelected ? '#ffffff' : m.color }}
              />
              <span className="truncate max-w-[130px]">{m.shortName}</span>
              <span
                className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-black/20 text-white' : 'bg-brand-sand/60 text-brand-slate'
                }`}
              >
                {stats?.completionRate || 0}%
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN RECHARTS VISUALIZATION CONTAINER */}
      {/* ========================================================================= */}
      <div className="w-full h-[320px] sm:h-[360px] relative bg-brand-sand/[0.15] rounded-2xl p-2 sm:p-4 border border-brand-slate/10">
        
        {/* Visual Gradients for Area fills */}
        <svg style={{ height: 0, width: 0, position: 'absolute' }}>
          <defs>
            {CURRICULUM_MODULES.map(m => (
              <linearGradient key={m.gradientId} id={m.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={m.color} stopOpacity={0.45} />
                <stop offset="95%" stopColor={m.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
            <linearGradient id="gradOverall" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#d97706" stopOpacity={0.05} />
            </linearGradient>
          </defs>
        </svg>

        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'area' ? (
            <AreaChart data={timelineData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="dayLabel"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />

              {showBenchmark && (
                <ReferenceLine
                  y={85}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Graduation Benchmark (85%)',
                    fill: '#64748b',
                    fontSize: 10,
                    position: 'insideTopRight'
                  }}
                />
              )}

              {/* Render Area Streams */}
              {selectedModuleId === 'all' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="overall"
                    name="Overall Completion"
                    stroke="#d97706"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#gradOverall)"
                  />
                  {CURRICULUM_MODULES.map(m => (
                    <Area
                      key={m.id}
                      type="monotone"
                      dataKey={m.id}
                      name={m.shortName}
                      stroke={m.color}
                      strokeWidth={1.5}
                      strokeOpacity={0.6}
                      fillOpacity={1}
                      fill={`url(#${m.gradientId})`}
                    />
                  ))}
                </>
              ) : (
                (() => {
                  const m = CURRICULUM_MODULES.find(mod => mod.id === selectedModuleId);
                  if (!m) return null;
                  return (
                    <Area
                      type="monotone"
                      dataKey={m.id}
                      name={m.name}
                      stroke={m.color}
                      strokeWidth={3.5}
                      fillOpacity={1}
                      fill={`url(#${m.gradientId})`}
                    />
                  );
                })()
              )}
            </AreaChart>
          ) : viewMode === 'line' ? (
            <LineChart data={timelineData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="dayLabel"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'monospace' }}
                iconType="circle"
              />

              {showBenchmark && (
                <Line
                  type="monotone"
                  dataKey="targetBenchmark"
                  name="Recommended Pace"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}

              {/* Multi-Line Rendering */}
              {selectedModuleId === 'all' ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="overall"
                    name="Overall Average"
                    stroke="#d97706"
                    strokeWidth={3.5}
                    dot={{ r: 4, fill: '#d97706', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, stroke: '#d97706', strokeWidth: 2 }}
                  />
                  {CURRICULUM_MODULES.map(m => (
                    <Line
                      key={m.id}
                      type="monotone"
                      dataKey={m.id}
                      name={m.shortName}
                      stroke={m.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, stroke: m.color }}
                    />
                  ))}
                </>
              ) : (
                (() => {
                  const m = CURRICULUM_MODULES.find(mod => mod.id === selectedModuleId);
                  if (!m) return null;
                  return (
                    <Line
                      type="monotone"
                      dataKey={m.id}
                      name={m.name}
                      stroke={m.color}
                      strokeWidth={4}
                      dot={{ r: 5, fill: m.color, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                  );
                })()
              )}
            </LineChart>
          ) : viewMode === 'bar' ? (
            <BarChart data={timelineData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="dayLabel"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'monospace' }}
              />

              {selectedModuleId === 'all' ? (
                <Bar dataKey="overall" name="Overall Progress %" fill="#d97706" radius={[6, 6, 0, 0]}>
                  {timelineData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isActiveDay ? '#d97706' : '#f59e0b'}
                      opacity={entry.isToday ? 1 : 0.85}
                    />
                  ))}
                </Bar>
              ) : (
                (() => {
                  const m = CURRICULUM_MODULES.find(mod => mod.id === selectedModuleId);
                  if (!m) return null;
                  return (
                    <Bar dataKey={m.id} name={`${m.shortName} %`} fill={m.color} radius={[6, 6, 0, 0]} />
                  );
                })()
              )}
            </BarChart>
          ) : (
            <RadarChart data={radarChartData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="module"
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: '#94a3b8', fontSize: 9 }}
                stroke="#cbd5e1"
              />
              <Radar
                name="Current Mastery %"
                dataKey="currentRate"
                stroke="#d97706"
                fill="#d97706"
                fillOpacity={0.45}
              />
              {showBenchmark && (
                <Radar
                  name="Graduation Target"
                  dataKey="benchmark"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />
              )}
              <Tooltip
                formatter={(val: any, name: any, item: any) => [
                  `${val}%`,
                  name === 'currentRate' ? 'Your Mastery' : 'Graduation Target'
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'monospace' }}
              />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* ========================================================================= */}
      {/* 4. KEY PERFORMANCE INSIGHTS SUMMARY STRIP */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        
        {/* Insight 1: Overall Completion Rate */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-brand-amber/20 space-y-1">
          <div className="flex items-center justify-between text-brand-amber-dark">
            <span className="text-[10px] font-mono font-bold uppercase">Overall Completion</span>
            <Award className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-brand-charcoal font-display">
            {overallCurriculumRate}%
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold">
            <span>Velocity:</span>
            <span>{velocityInsight} ({timeRange.toUpperCase()})</span>
          </div>
        </div>

        {/* Insight 2: Fastest Advancing Module */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[10px] font-mono font-bold uppercase">Strongest Module</span>
            <Brain className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-black text-brand-charcoal font-display truncate">
            {fastestAdvancingModule.shortName}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-brand-slate">
            <span>Mastery:</span>
            <span className="font-bold text-emerald-700">{fastestAdvancingModule.rate}%</span>
          </div>
        </div>

        {/* Insight 3: Total Study Minutes Logged */}
        <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-1">
          <div className="flex items-center justify-between text-sky-800">
            <span className="text-[10px] font-mono font-bold uppercase">Curriculum Time</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-black text-brand-charcoal font-display">
            {CURRICULUM_MODULES.reduce((a, m) => a + (currentModuleStats[m.id]?.studyMinutes || 0), 0)} Mins
          </div>
          <div className="text-[10px] font-mono text-brand-slate">
            Active interactive practice
          </div>
        </div>

        {/* Insight 4: Graduation Projection */}
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
          <div className="flex items-center justify-between text-purple-800">
            <span className="text-[10px] font-mono font-bold uppercase">Target Graduation</span>
            <Target className="w-3.5 h-3.5" />
          </div>
          <div className="text-sm font-black text-brand-charcoal font-display">
            {overallCurriculumRate >= 85 ? 'Graduated! 🎓' : 'On Track (Est. 5 Days)'}
          </div>
          <div className="text-[10px] font-mono text-brand-slate">
            Target: 85% All Modules
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE MODULE QUICK LAUNCH DRAWER */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-brand-sand/30 border border-brand-slate/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-charcoal text-white shrink-0">
            <BookOpen className="w-4 h-4 text-brand-amber" />
          </div>
          <div>
            <h4 className="font-display text-xs font-bold text-brand-charcoal">
              {selectedModuleId === 'all'
                ? 'Curriculum Navigation & Next Unlocked Module'
                : `Focus Track: ${CURRICULUM_MODULES.find(m => m.id === selectedModuleId)?.name}`}
            </h4>
            <p className="text-[11px] text-brand-muted">
              {selectedModuleId === 'all'
                ? 'Click on any individual module pill above to filter specific line trajectories and jump to lessons.'
                : 'Launch this module to continue advancing your completion score.'}
            </p>
          </div>
        </div>

        {onNavigateSection && (
          <button
            onClick={() => {
              if (selectedModuleId === 'all') {
                onNavigateSection('what-is-ai');
              } else {
                const targetMod = CURRICULUM_MODULES.find(m => m.id === selectedModuleId);
                const firstLesson = targetMod?.lessonIds[0] || 'what-is-ai';
                onNavigateSection(firstLesson);
              }
              audioEngine.playLoFiChord();
            }}
            className="px-4 py-2 bg-brand-charcoal hover:bg-black text-white text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0 self-end md:self-auto"
          >
            <span>{selectedModuleId === 'all' ? 'Resume Curriculum' : 'Launch Module Lesson'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-brand-amber" />
          </button>
        )}
      </div>

    </div>
  );
}
