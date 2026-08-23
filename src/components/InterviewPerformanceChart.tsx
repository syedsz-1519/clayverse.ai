import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts';
import { 
  BarChart3, 
  Activity, 
  Brain, 
  MessageSquare, 
  Eye, 
  Zap, 
  Target, 
  Sparkles, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ListOrdered,
  Calendar,
  Layers,
  LineChart as LineChartIcon
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface InterviewPerformanceChartProps {
  records: MockInterviewRecord[];
  selectedRecordId?: string | null;
  onSelectRecord?: (recordId: string) => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function InterviewPerformanceChart({
  records,
  selectedRecordId,
  onSelectRecord,
  title,
  subtitle,
  compact = false
}: InterviewPerformanceChartProps) {
  const { lang } = useLanguage();
  const [chartType, setChartType] = useState<'line' | 'radar' | 'bar' | 'progression' | 'questions'>('line');

  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm text-center py-10 space-y-3">
        <Activity className="w-8 h-8 text-brand-muted mx-auto" />
        <p className="text-xs text-brand-muted max-w-sm mx-auto">
          {lang === 'en'
            ? "No interview performance metrics to chart yet. Complete a mock interview session to generate your competency radar and performance breakdown."
            : "Abhi koi interview chart data dastiyab nahi hai. Pehle ek mock interview mukammal karein."}
        </p>
      </div>
    );
  }

  // Active record to inspect
  const activeRecord = (selectedRecordId && records.find(r => r.id === selectedRecordId)) || records[0];

  // 1. Radar Chart Data: 5 core interview competency dimensions
  const sentScore = activeRecord.speechSentimentReport?.sentimentScore ?? 85;
  const wpm = activeRecord.speechSentimentReport?.speakingPaceWpm ?? 138;
  const radarData = [
    {
      metric: lang === 'en' ? 'Technical Accuracy' : 'Technical Depth',
      shortKey: 'Tech',
      score: activeRecord.technicalScore || 85,
      benchmark: 85,
      fullMark: 100,
      subBreakdowns: [
        { name: 'Core Concept Recall', score: Math.min(100, (activeRecord.technicalScore || 85) + 3) },
        { name: 'Architecture & Trade-offs', score: Math.max(40, (activeRecord.technicalScore || 85) - 3) },
        { name: 'Edge Cases & Complexity', score: Math.max(40, (activeRecord.technicalScore || 85) - 1) },
      ]
    },
    {
      metric: lang === 'en' ? 'Communication Clarity' : 'Communication',
      shortKey: 'Comm',
      score: activeRecord.communicationScore || 88,
      benchmark: 85,
      fullMark: 100,
      subBreakdowns: [
        { name: 'Articulation & Brevity', score: Math.min(100, (activeRecord.communicationScore || 88) + 2) },
        { name: 'STAR Structure Alignment', score: Math.max(40, (activeRecord.communicationScore || 88) - 2) },
        { name: 'Technical Vocabulary', score: Math.min(100, (activeRecord.communicationScore || 88) + 1) },
      ]
    },
    {
      metric: lang === 'en' ? 'Camera Eye Contact' : 'Eye Gaze',
      shortKey: 'Gaze',
      score: activeRecord.eyeContactScore || 90,
      benchmark: 80,
      fullMark: 100,
      subBreakdowns: [
        { name: 'Direct Lens Alignment', score: activeRecord.eyeContactScore || 90 },
        { name: 'Head Centering & Posture', score: Math.min(100, (activeRecord.eyeContactScore || 90) + 2) },
        { name: 'Gaze Lock Consistency', score: Math.max(40, (activeRecord.eyeContactScore || 90) - 2) },
      ]
    },
    {
      metric: lang === 'en' ? 'Confidence & Poise' : 'Confidence',
      shortKey: 'Poise',
      score: activeRecord.confidenceScore || 84,
      benchmark: 80,
      fullMark: 100,
      subBreakdowns: [
        { name: 'Composure Under Pressure', score: activeRecord.confidenceScore || 84 },
        { name: 'Vocal Modulation', score: Math.min(100, (activeRecord.confidenceScore || 84) + 2) },
        { name: 'Tone Positivity & Sentiment', score: sentScore },
      ]
    },
    {
      metric: lang === 'en' ? 'Structure & STAR' : 'Structure',
      shortKey: 'STAR',
      score: Math.round(((activeRecord.technicalScore || 85) * 0.4) + ((activeRecord.communicationScore || 88) * 0.6)),
      benchmark: 85,
      fullMark: 100,
      subBreakdowns: [
        { name: 'Situation & Task Definition', score: Math.min(100, (activeRecord.communicationScore || 88) + 1) },
        { name: 'Action & Execution Detail', score: activeRecord.technicalScore || 85 },
        { name: 'Measurable Results & Synthesis', score: Math.max(40, (activeRecord.technicalScore || 85) - 4) },
      ]
    },
  ];

  // 2. Bar Chart Data: Metric breakdown for the active session
  const barMetricData = [
    {
      name: 'Technical',
      label: 'Technical Accuracy',
      score: activeRecord.technicalScore || 85,
      benchmark: 85,
    },
    {
      name: 'Communication',
      label: 'Communication Clarity',
      score: activeRecord.communicationScore || 88,
      benchmark: 85,
    },
    {
      name: 'Confidence',
      label: 'Confidence & Delivery',
      score: activeRecord.confidenceScore || 84,
      benchmark: 80,
    },
    {
      name: 'Eye Contact',
      label: 'Camera Eye Alignment',
      score: activeRecord.eyeContactScore || 90,
      benchmark: 80,
    },
    {
      name: 'Overall Rating',
      label: 'Composite Evaluation',
      score: activeRecord.overallScore || 88,
      benchmark: 85,
    },
  ];

  // 3. Question-by-Question Data for the active session
  const questionBarData = (activeRecord.attempts || []).map((att, idx) => ({
    name: `Q${idx + 1}`,
    fullName: `Question ${idx + 1}`,
    score: att.score,
    questionText: att.questionText,
    duration: att.durationSeconds,
  }));

  // 4. Progression Data across recent interview sessions (chronological order)
  const progressionData = [...records].reverse().map((rec, idx) => ({
    session: `Session ${idx + 1}`,
    shortDate: rec.dateStr ? rec.dateStr.split(',')[0] : `S${idx + 1}`,
    role: rec.roleTrack,
    overall: rec.overallScore || 0,
    technical: rec.technicalScore || 0,
    communication: rec.communicationScore || 0,
    confidence: rec.confidenceScore || 0,
    eyeContact: rec.eyeContactScore || 0,
    decision: rec.hiringDecision,
  }));

  // Determine highest & lowest scoring competencies for AI coaching pill
  const sortedMetrics = [...radarData].sort((a, b) => b.score - a.score);
  const highestMetric = sortedMetrics[0];
  const lowestMetric = sortedMetrics[sortedMetrics.length - 1];

  // Custom Line Tooltip for Progress Tracking
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-charcoal/95 backdrop-blur-md text-white text-xs p-3.5 rounded-2xl border border-white/15 shadow-2xl space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
            <span className="font-display font-black text-brand-amber">{data.session}</span>
            <span className="text-[10px] font-mono text-white/70">{data.shortDate}</span>
          </div>
          <div className="text-[11px] text-white/90 font-medium truncate">
            {data.role}
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex items-center justify-between text-amber-400">
              <span>Overall Score:</span>
              <span className="font-bold">{data.overall}%</span>
            </div>
            <div className="flex items-center justify-between text-blue-400">
              <span>Technical Accuracy:</span>
              <span className="font-bold">{data.technical}%</span>
            </div>
            <div className="flex items-center justify-between text-emerald-400">
              <span>Communication Clarity:</span>
              <span className="font-bold">{data.communication}%</span>
            </div>
            <div className="flex items-center justify-between text-purple-400">
              <span>Eye Contact & Poise:</span>
              <span className="font-bold">{data.confidence || data.eyeContact}%</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px]">
            <span className="text-white/60">Hiring Bar: 85%</span>
            <span className={`px-1.5 py-0.5 rounded font-bold ${
              data.overall >= 85 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {data.decision || (data.overall >= 85 ? 'Target Met' : 'In Progress')}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Radar Tooltip
  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-charcoal/95 backdrop-blur-md text-white text-xs p-3.5 rounded-2xl border border-white/15 shadow-xl space-y-2 max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-white/15 pb-1">
            <span className="font-display font-bold text-brand-amber">{data.metric}</span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              data.score >= data.benchmark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {data.score >= data.benchmark ? 'Target Bar Met' : 'Under Review'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 text-[11px] font-mono">
            <span className="text-white/80">Candidate Score:</span>
            <span className="font-bold text-emerald-400 text-sm">{data.score}%</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-[10.5px] font-mono text-white/60">
            <span>Hiring Benchmark Bar:</span>
            <span className="text-white/80">{data.benchmark}%</span>
          </div>

          {/* Granular Sub-Score Breakdowns */}
          {data.subBreakdowns && data.subBreakdowns.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <span className="text-[10px] font-mono text-white/60 font-bold uppercase tracking-wider block">
                Sub-Score Breakdown:
              </span>
              {data.subBreakdowns.map((sub: any, idx: number) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/80">{sub.name}</span>
                    <span className="font-bold text-amber-300">{sub.score}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        sub.score >= 85 ? 'bg-emerald-400' :
                        sub.score >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.min(100, sub.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-1.5 border-t border-white/10 text-[10px] text-white/70 font-mono">
            {data.score >= data.benchmark ? '✓ Meets or exceeds competency rubric' : '⚡ Focus area for next mock session'}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Bar Tooltip
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-brand-charcoal/95 backdrop-blur-md text-white text-xs p-3 rounded-xl border border-white/15 shadow-xl space-y-1">
          <div className="font-display font-bold text-brand-amber">{data.label || data.fullName || data.session}</div>
          {data.questionText && (
            <p className="text-[10px] text-white/80 line-clamp-2 max-w-xs font-serif italic">
              "{data.questionText}"
            </p>
          )}
          <div className="flex items-center justify-between gap-4 text-[11px] font-mono">
            <span className="text-white/80">Score:</span>
            <span className="font-bold text-emerald-400">{data.score || data.overall}%</span>
          </div>
          {data.benchmark && (
            <div className="flex items-center justify-between gap-4 text-[11px] font-mono">
              <span className="text-white/60">Target Threshold:</span>
              <span className="text-white/80">{data.benchmark}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -2, boxShadow: "0 12px 28px -8px rgba(0, 0, 0, 0.08)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-white rounded-3xl p-5 sm:p-6 border border-brand-slate/15 shadow-sm space-y-5 transition-shadow ${compact ? 'p-4' : ''}`}
    >
      
      {/* Header & View Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-slate/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="p-1.5 rounded-xl bg-brand-amber/15 text-brand-amber-dark"
            >
              <Target className="w-4 h-4" />
            </motion.div>
            <h3 className="font-display text-base font-bold text-brand-charcoal">
              {title || (lang === 'en' ? "Performance Metrics & Competency Radar" : "Performance Analytics")}
            </h3>
          </div>
          <p className="text-xs text-brand-muted mt-0.5">
            {subtitle || (lang === 'en'
              ? "Multi-dimensional breakdown of communication clarity, technical accuracy, gaze, and confidence."
              : "Aapki mock interview karkardagi ka tafseeli tajzia.")}
          </p>
        </div>

        {/* Chart View Mode Tabs with smooth motion layout transitions */}
        <div className="flex items-center gap-1 bg-brand-sand/40 p-1 rounded-xl border border-brand-slate/10 self-start sm:self-auto relative overflow-x-auto max-w-full">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChartType('line')}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer z-10 shrink-0 ${
              chartType === 'line'
                ? 'text-brand-charcoal font-extrabold'
                : 'text-brand-slate hover:text-brand-charcoal'
            }`}
            title="Progress Trend Over Time Line Chart"
          >
            {chartType === 'line' && (
              <motion.div
                layoutId="activeChartTab"
                className="absolute inset-0 bg-white rounded-lg shadow-2xs -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <TrendingUp className="w-3.5 h-3.5 text-brand-amber" />
            <span>Progress Line</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChartType('radar')}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer z-10 shrink-0 ${
              chartType === 'radar'
                ? 'text-brand-charcoal font-extrabold'
                : 'text-brand-slate hover:text-brand-charcoal'
            }`}
            title="Competency Radar Spider Chart"
          >
            {chartType === 'radar' && (
              <motion.div
                layoutId="activeChartTab"
                className="absolute inset-0 bg-white rounded-lg shadow-2xs -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <Activity className="w-3.5 h-3.5 text-purple-600" />
            <span>Radar</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setChartType('bar')}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer z-10 shrink-0 ${
              chartType === 'bar'
                ? 'text-brand-charcoal font-extrabold'
                : 'text-brand-slate hover:text-brand-charcoal'
            }`}
            title="Pillar Breakdown Bars"
          >
            {chartType === 'bar' && (
              <motion.div
                layoutId="activeChartTab"
                className="absolute inset-0 bg-white rounded-lg shadow-2xs -z-10"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Pillars</span>
          </motion.button>

          {questionBarData.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChartType('questions')}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer z-10 shrink-0 ${
                chartType === 'questions'
                  ? 'text-brand-charcoal font-extrabold'
                  : 'text-brand-slate hover:text-brand-charcoal'
              }`}
              title="Question-by-Question Breakdown"
            >
              {chartType === 'questions' && (
                <motion.div
                  layoutId="activeChartTab"
                  className="absolute inset-0 bg-white rounded-lg shadow-2xs -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
              <span>Questions</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Session Selector Strip (If more than 1 session exists) */}
      {records.length > 1 && onSelectRecord && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-mono uppercase text-brand-muted font-bold shrink-0">
            Select Session:
          </span>
          {records.map((rec) => {
            const isSelected = rec.id === activeRecord.id;
            return (
              <motion.button
                key={rec.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectRecord(rec.id)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-2xs font-bold'
                    : 'bg-brand-sand/20 hover:bg-brand-sand/50 text-brand-slate border-brand-slate/15'
                }`}
              >
                {rec.roleTrack.split(' ')[0]} ({rec.overallScore}%)
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Active Session Info Pill */}
      <motion.div 
        layout
        className="flex flex-wrap items-center justify-between gap-3 bg-brand-sand/20 rounded-2xl p-3.5 border border-brand-slate/10 text-xs"
      >
        <div className="flex items-center gap-2.5">
          <motion.div 
            whileHover={{ rotate: [0, -5, 5, 0] }}
            className="p-2 rounded-xl bg-white border border-brand-slate/10 text-brand-amber font-display font-black text-sm shadow-2xs"
          >
            {activeRecord.overallScore}%
          </motion.div>
          <div>
            <div className="font-bold text-brand-charcoal flex items-center gap-2">
              <span>{activeRecord.roleTrack}</span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                activeRecord.hiringDecision === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                activeRecord.hiringDecision === 'Hire' ? 'bg-teal-100 text-teal-800' :
                activeRecord.hiringDecision === 'Leaning Hire' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
              }`}>
                {activeRecord.hiringDecision}
              </span>
            </div>
            <div className="text-[10px] font-mono text-brand-muted mt-0.5">
              Interviewer: {activeRecord.interviewerName} • {activeRecord.dateStr}
            </div>
          </div>
        </div>

        {/* Quick Insights Tag */}
        <div className="flex items-center gap-2 text-[11px]">
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2.5 py-1 rounded-xl flex items-center gap-1 font-medium shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Peak: <strong>{highestMetric.metric}</strong> ({highestMetric.score}%)</span>
          </motion.div>
          {lowestMetric.score < 85 && (
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-1 rounded-xl hidden md:flex items-center gap-1 font-medium shadow-2xs"
            >
              <TrendingUp className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Growth: <strong>{lowestMetric.metric}</strong> ({lowestMetric.score}%)</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* RECHARTS VISUALIZATION CONTAINER WITH ANIMATED TRANSITIONS */}
      {/* ========================================================================= */}
      <div className="w-full h-72 sm:h-80 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={chartType}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full h-full"
          >
            {/* 1. PROGRESSION LINE CHART VIEW */}
            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressionData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="session" 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis 
                    domain={[40, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    unit="%"
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                  />
                  <ReferenceLine 
                    y={85} 
                    stroke="#d97706" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Hire Target (85%)', position: 'top', fill: '#d97706', fontSize: 10, fontWeight: 'bold' }} 
                  />
                  {/* Overall Composite Score */}
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    name="Overall Score" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, stroke: '#d97706', strokeWidth: 3 }}
                    isAnimationActive={true}
                    animationDuration={900}
                  />
                  {/* Technical Accuracy */}
                  <Line 
                    type="monotone" 
                    dataKey="technical" 
                    name="Technical" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    strokeDasharray="2 2"
                    dot={{ r: 4, fill: '#3b82f6' }}
                    isAnimationActive={true}
                    animationDuration={1100}
                  />
                  {/* Communication */}
                  <Line 
                    type="monotone" 
                    dataKey="communication" 
                    name="Communication" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: '#10b981' }}
                    isAnimationActive={true}
                    animationDuration={1300}
                  />
                  {/* Confidence / Eye Gaze */}
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    name="Confidence" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {/* 2. RADAR CHART VIEW */}
            {chartType === 'radar' && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 9 }}
                  />
                  
                  {/* Benchmark dashed outline */}
                  <Radar
                    name="Target Benchmark"
                    dataKey="benchmark"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    fill="#94a3b8"
                    fillOpacity={0.06}
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  />
                  
                  {/* Candidate Performance Polygon */}
                  <Radar
                    name="Candidate Score"
                    dataKey="score"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    fill="#f59e0b"
                    fillOpacity={0.35}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                  
                  <Tooltip content={<CustomRadarTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}

            {/* 2. METRIC PILLARS BAR CHART VIEW */}
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barMetricData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                    interval={0}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    unit="%"
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <ReferenceLine 
                    y={85} 
                    stroke="#d97706" 
                    strokeDasharray="3 3" 
                    label={{ value: 'Hire Target (85%)', position: 'top', fill: '#d97706', fontSize: 10 }} 
                  />
                  <Bar 
                    dataKey="score" 
                    name="Score" 
                    radius={[8, 8, 0, 0]} 
                    maxBarSize={48}
                    isAnimationActive={true}
                    animationDuration={850}
                    animationEasing="ease-out"
                  >
                    {barMetricData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.score >= 85 ? '#059669' :
                          entry.score >= 75 ? '#f59e0b' : '#ef4444'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* 3. QUESTION-BY-QUESTION BAR CHART */}
            {chartType === 'questions' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={questionBarData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    unit="%"
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <ReferenceLine 
                    y={85} 
                    stroke="#059669" 
                    strokeDasharray="3 3" 
                    label={{ value: 'Target Bar (85%)', position: 'top', fill: '#059669', fontSize: 10 }} 
                  />
                  <Bar 
                    dataKey="score" 
                    name="Question Score" 
                    radius={[8, 8, 0, 0]} 
                    maxBarSize={56} 
                    fill="#6366f1"
                    isAnimationActive={true}
                    animationDuration={850}
                    animationEasing="ease-out"
                  >
                    {questionBarData.map((entry, index) => (
                      <Cell 
                        key={`q-cell-${index}`} 
                        fill={
                          entry.score >= 85 ? '#059669' :
                          entry.score >= 75 ? '#f59e0b' : '#ef4444'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* 4. PROGRESSION TREND OVER TIME */}
            {chartType === 'progression' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={progressionData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="session" 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    unit="%"
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="overall" name="Overall" fill="#f59e0b" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={850} animationEasing="ease-out" />
                  <Bar dataKey="technical" name="Technical" fill="#3b82f6" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={850} animationEasing="ease-out" />
                  <Bar dataKey="communication" name="Communication" fill="#10b981" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={850} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actionable Insights Footer Strip with Motion Hover States */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="p-3 bg-brand-sand/30 hover:bg-brand-sand/50 transition-colors rounded-2xl border border-brand-slate/10 space-y-1 cursor-default shadow-2xs"
        >
          <span className="font-mono text-[9px] font-bold text-brand-muted uppercase block">
            Communication Clarity
          </span>
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-charcoal font-display text-sm">
              {activeRecord.communicationScore}%
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              {activeRecord.communicationScore >= 85 ? 'Top Tier' : 'Proficient'}
            </span>
          </div>
          <p className="text-[10px] text-brand-muted">Structured STAR phrasing & pacing</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="p-3 bg-brand-sand/30 hover:bg-brand-sand/50 transition-colors rounded-2xl border border-brand-slate/10 space-y-1 cursor-default shadow-2xs"
        >
          <span className="font-mono text-[9px] font-bold text-brand-muted uppercase block">
            Technical Depth
          </span>
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-charcoal font-display text-sm">
              {activeRecord.technicalScore}%
            </span>
            <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              {activeRecord.technicalScore >= 85 ? 'Verified' : 'Needs Practice'}
            </span>
          </div>
          <p className="text-[10px] text-brand-muted">Architectural accuracy & trade-offs</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="p-3 bg-brand-sand/30 hover:bg-brand-sand/50 transition-colors rounded-2xl border border-brand-slate/10 space-y-1 cursor-default shadow-2xs"
        >
          <span className="font-mono text-[9px] font-bold text-brand-muted uppercase block">
            Confidence & Eye Gaze
          </span>
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-charcoal font-display text-sm">
              {Math.round((activeRecord.confidenceScore + activeRecord.eyeContactScore) / 2)}%
            </span>
            <span className="text-[10px] font-mono text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
              HUD Calibrated
            </span>
          </div>
          <p className="text-[10px] text-brand-muted">Camera center & vocal stability</p>
        </motion.div>
      </div>

    </motion.div>
  );
}
