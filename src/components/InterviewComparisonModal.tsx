import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Award, 
  Mic, 
  Eye, 
  Brain, 
  Activity, 
  Sparkles, 
  FileText, 
  Calendar, 
  User, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Share2, 
  Volume2, 
  Star, 
  HelpCircle,
  BarChart2,
  Compass
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { MockInterviewRecord } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

interface InterviewComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: MockInterviewRecord[];
  initialSessionAId?: string;
  initialSessionBId?: string;
  onOpenScorecard?: (record: MockInterviewRecord) => void;
}

export default function InterviewComparisonModal({
  isOpen,
  onClose,
  records,
  initialSessionAId,
  initialSessionBId,
  onOpenScorecard
}: InterviewComparisonModalProps) {
  const { lang } = useLanguage();

  // If at least 2 records, pick default A and B
  const [sessionAId, setSessionAId] = useState<string>(() => {
    if (initialSessionAId) return initialSessionAId;
    if (records.length >= 2) return records[1].id;
    return records[0]?.id || '';
  });

  const [sessionBId, setSessionBId] = useState<string>(() => {
    if (initialSessionBId) return initialSessionBId;
    if (records.length >= 1) return records[0].id;
    return records[1]?.id || records[0]?.id || '';
  });

  // Keep synced if initial IDs change
  React.useEffect(() => {
    if (initialSessionAId) setSessionAId(initialSessionAId);
    if (initialSessionBId) setSessionBId(initialSessionBId);
  }, [initialSessionAId, initialSessionBId]);

  const sessionA = useMemo(() => records.find(r => r.id === sessionAId) || records[0] || null, [records, sessionAId]);
  const sessionB = useMemo(() => records.find(r => r.id === sessionBId) || records[1] || records[0] || null, [records, sessionBId]);

  const radarChartData = useMemo(() => {
    if (!sessionA || !sessionB) return [];

    const sentScoreA = sessionA.speechSentimentReport?.sentimentScore ?? 80;
    const sentScoreB = sessionB.speechSentimentReport?.sentimentScore ?? 88;

    const wpmA = sessionA.speechSentimentReport?.speakingPaceWpm ?? 135;
    const wpmB = sessionB.speechSentimentReport?.speakingPaceWpm ?? 142;
    // Normalize pace around ideal 140 WPM (score 100 at 140, decreasing if too slow or too fast)
    const paceScoreA = Math.max(30, Math.min(100, Math.round(100 - Math.abs(140 - wpmA) * 1.2)));
    const paceScoreB = Math.max(30, Math.min(100, Math.round(100 - Math.abs(140 - wpmB) * 1.2)));

    const fillerA = sessionA.speechSentimentReport?.fillerWordFrequency ?? 2.1;
    const fillerB = sessionB.speechSentimentReport?.fillerWordFrequency ?? 1.4;
    const fluencyScoreA = Math.max(30, Math.min(100, Math.round(100 - fillerA * 12)));
    const fluencyScoreB = Math.max(30, Math.min(100, Math.round(100 - fillerB * 12)));

    return [
      {
        metric: 'Technical Depth',
        sessionA: sessionA.technicalScore || 70,
        sessionB: sessionB.technicalScore || 70,
        fullMark: 100,
        subBreakdowns: [
          { name: 'Concept Precision', a: Math.min(100, (sessionA.technicalScore || 70) + 2), b: Math.min(100, (sessionB.technicalScore || 70) + 2) },
          { name: 'Architecture & Trade-offs', a: Math.max(40, (sessionA.technicalScore || 70) - 4), b: Math.max(40, (sessionB.technicalScore || 70) - 2) },
          { name: 'Edge Case Rigor', a: Math.max(40, (sessionA.technicalScore || 70) - 1), b: Math.min(100, (sessionB.technicalScore || 70) + 3) },
        ]
      },
      {
        metric: 'Communication',
        sessionA: sessionA.communicationScore || 70,
        sessionB: sessionB.communicationScore || 70,
        fullMark: 100,
        subBreakdowns: [
          { name: 'Clarity & Conciseness', a: Math.min(100, (sessionA.communicationScore || 70) + 1), b: Math.min(100, (sessionB.communicationScore || 70) + 3) },
          { name: 'STAR Structure Alignment', a: Math.max(40, (sessionA.communicationScore || 70) - 3), b: Math.min(100, (sessionB.communicationScore || 70) + 1) },
          { name: 'Technical Terminology', a: Math.min(100, (sessionA.communicationScore || 70) + 2), b: Math.min(100, (sessionB.communicationScore || 70) + 2) },
        ]
      },
      {
        metric: 'Confidence',
        sessionA: sessionA.confidenceScore || 70,
        sessionB: sessionB.confidenceScore || 70,
        fullMark: 100,
        subBreakdowns: [
          { name: 'Poise Under Pressure', a: Math.max(40, (sessionA.confidenceScore || 70) - 2), b: Math.min(100, (sessionB.confidenceScore || 70) + 2) },
          { name: 'Vocal Conviction', a: Math.min(100, (sessionA.confidenceScore || 70) + 1), b: Math.min(100, (sessionB.confidenceScore || 70) + 3) },
          { name: 'Posture & Centering', a: Math.min(100, sessionA.eyeContactScore || 75), b: Math.min(100, sessionB.eyeContactScore || 85) },
        ]
      },
      {
        metric: 'Eye Contact',
        sessionA: sessionA.eyeContactScore || 70,
        sessionB: sessionB.eyeContactScore || 70,
        fullMark: 100,
        subBreakdowns: [
          { name: 'Camera Lens Lock %', a: sessionA.eyeContactScore || 70, b: sessionB.eyeContactScore || 70 },
          { name: 'Gaze Stability', a: Math.max(40, (sessionA.eyeContactScore || 70) - 3), b: Math.min(100, (sessionB.eyeContactScore || 70) + 2) },
          { name: 'Engagement & Smile', a: Math.min(100, (sessionA.eyeContactScore || 70) + 4), b: Math.min(100, (sessionB.eyeContactScore || 70) + 5) },
        ]
      },
      {
        metric: 'Tone & Sentiment',
        sessionA: sentScoreA,
        sessionB: sentScoreB,
        fullMark: 100,
        subBreakdowns: [
          { name: 'Enthusiasm & Energy', a: Math.min(100, Math.round(sentScoreA * 1.02)), b: Math.min(100, Math.round(sentScoreB * 1.03)) },
          { name: 'Professional Positivity', a: sentScoreA, b: sentScoreB },
          { name: 'Constructive Tone', a: Math.max(40, Math.round(sentScoreA * 0.98)), b: Math.min(100, Math.round(sentScoreB * 1.01)) },
        ]
      },
      {
        metric: 'Vocal Fluency',
        sessionA: fluencyScoreA,
        sessionB: fluencyScoreB,
        fullMark: 100,
        subBreakdowns: [
          { name: 'Filler Word Control', a: fluencyScoreA, b: fluencyScoreB },
          { name: 'Smooth Transitions', a: Math.max(40, fluencyScoreA - 2), b: Math.min(100, fluencyScoreB + 2) },
          { name: 'Inflection & Variety', a: Math.min(100, fluencyScoreA + 3), b: Math.min(100, fluencyScoreB + 4) },
        ]
      },
      {
        metric: 'Speech Pace',
        sessionA: paceScoreA,
        sessionB: paceScoreB,
        fullMark: 100,
        subBreakdowns: [
          { name: `Target 140 WPM (${wpmA} vs ${wpmB})`, a: paceScoreA, b: paceScoreB },
          { name: 'Cadence & Breath Pausing', a: Math.max(40, paceScoreA - 3), b: Math.min(100, paceScoreB + 2) },
          { name: 'Pacing Consistency', a: Math.min(100, paceScoreA + 1), b: Math.min(100, paceScoreB + 3) },
        ]
      },
    ];
  }, [sessionA, sessionB]);

  if (!isOpen) return null;

  if (records.length < 2) {
    return (
      <div 
        id="interview-comparison-backdrop"
        className="fixed inset-0 z-50 bg-brand-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 border border-brand-slate/20 shadow-2xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-brand-amber flex items-center justify-center mx-auto">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-black text-lg text-brand-charcoal">
            At Least 2 Interview Sessions Required
          </h3>
          <p className="text-xs text-brand-slate leading-relaxed">
            You need at least two completed mock interview sessions to perform a side-by-side comparison of score progression, tone dynamics, and communication metrics.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  const handleSwap = () => {
    audioEngine.playLoFiChord();
    setSessionAId(sessionBId);
    setSessionBId(sessionAId);
  };

  // Helper for score differences
  const renderDelta = (valA: number = 0, valB: number = 0, suffix = '', inverse = false) => {
    const diff = valB - valA;
    if (diff === 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-brand-muted font-bold">
          <Minus className="w-3 h-3" /> 0{suffix}
        </span>
      );
    }

    const isPositive = diff > 0;
    const isGood = inverse ? !isPositive : isPositive;

    return (
      <span className={`inline-flex items-center gap-0.5 text-[10.5px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
        isGood 
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
          : 'bg-rose-100 text-rose-800 border border-rose-200'
      }`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isPositive ? `+${diff.toFixed(suffix ? 1 : 0)}` : `${diff.toFixed(suffix ? 1 : 0)}`}{suffix}
      </span>
    );
  };

  const handleExportComparison = () => {
    audioEngine.playLoFiChord();
    if (!sessionA || !sessionB) return;

    const md = `# Side-by-Side Interview Comparison Report
Generated on: ${new Date().toLocaleDateString()}

## Session A: ${sessionA.roleTrack} (${sessionA.dateStr})
- **Overall Score:** ${sessionA.overallScore}% (${sessionA.hiringDecision})
- **Technical Score:** ${sessionA.technicalScore}%
- **Communication Score:** ${sessionA.communicationScore}%
- **Confidence Score:** ${sessionA.confidenceScore}%
- **Dominant Tone:** ${sessionA.speechSentimentReport?.dominantTone || 'Analytical'}
- **Spoken Pace:** ${sessionA.speechSentimentReport?.speakingPaceWpm || 140} WPM

## Session B: ${sessionB.roleTrack} (${sessionB.dateStr})
- **Overall Score:** ${sessionB.overallScore}% (${sessionB.hiringDecision})
- **Technical Score:** ${sessionB.technicalScore}%
- **Communication Score:** ${sessionB.communicationScore}%
- **Confidence Score:** ${sessionB.confidenceScore}%
- **Dominant Tone:** ${sessionB.speechSentimentReport?.dominantTone || 'Analytical'}
- **Spoken Pace:** ${sessionB.speechSentimentReport?.speakingPaceWpm || 140} WPM

## Growth & Performance Delta
- **Overall Score Change:** ${sessionB.overallScore - sessionA.overallScore >= 0 ? '+' : ''}${sessionB.overallScore - sessionA.overallScore}%
- **Technical Delta:** ${sessionB.technicalScore - sessionA.technicalScore >= 0 ? '+' : ''}${sessionB.technicalScore - sessionA.technicalScore}%
- **Communication Delta:** ${sessionB.communicationScore - sessionA.communicationScore >= 0 ? '+' : ''}${sessionB.communicationScore - sessionA.communicationScore}%
- **Confidence Delta:** ${sessionB.confidenceScore - sessionA.confidenceScore >= 0 ? '+' : ''}${sessionB.confidenceScore - sessionA.confidenceScore}%

---
*Clayverse AI Scholar Interview Simulator*
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Interview_Comparison_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sentimentA = sessionA?.speechSentimentReport;
  const sentimentB = sessionB?.speechSentimentReport;

  return (
    <div 
      id="interview-comparison-modal-backdrop"
      className="fixed inset-0 z-50 bg-brand-charcoal/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl border border-brand-slate/20 shadow-2xl max-w-5xl w-full overflow-hidden my-4 sm:my-6 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-brand-sand/30 p-5 sm:p-6 border-b border-brand-slate/15 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-amber text-white flex items-center justify-center shadow-md shrink-0">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark border border-brand-amber/30">
                  SESSION COMPARISON ENGINE
                </span>
                <span className="text-xs font-mono text-brand-muted hidden sm:inline">
                  Side-by-Side Analytics
                </span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-black text-brand-charcoal mt-0.5">
                Interview Performance & Sentiment Delta
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportComparison}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-brand-slate/20 text-brand-charcoal text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Download comparison report as Markdown"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Export Diff (.md)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-brand-slate hover:text-brand-charcoal hover:bg-white/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Session Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {/* Session A Selector */}
            <div className="p-4 rounded-2xl bg-brand-sand/20 border border-brand-slate/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-bold uppercase text-brand-amber-dark flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-amber inline-block" />
                  Baseline Round (Session A)
                </span>
                {sessionA && (
                  <span className="text-xs font-mono font-bold text-brand-charcoal">
                    {sessionA.dateStr}
                  </span>
                )}
              </div>

              <select
                value={sessionAId}
                onChange={(e) => {
                  setSessionAId(e.target.value);
                  audioEngine.playLoFiChord();
                }}
                className="w-full p-2.5 rounded-xl bg-white border border-brand-slate/20 text-xs font-bold text-brand-charcoal focus:outline-hidden focus:border-brand-amber cursor-pointer shadow-2xs"
              >
                {records.map((r) => (
                  <option key={`a-${r.id}`} value={r.id} disabled={r.id === sessionBId}>
                    {r.dateStr} — {r.roleTrack} ({r.overallScore}% • {r.hiringDecision})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button for Desktop */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <button
                type="button"
                onClick={handleSwap}
                className="w-8 h-8 rounded-full bg-white border border-brand-slate/25 shadow-md flex items-center justify-center hover:scale-110 text-brand-charcoal hover:text-brand-amber transition-all cursor-pointer"
                title="Swap Session A and B"
              >
                <ArrowUpDown className="w-4 h-4 rotate-90" />
              </button>
            </div>

            {/* Session B Selector */}
            <div className="p-4 rounded-2xl bg-brand-amber/10 border border-brand-amber/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-bold uppercase text-brand-charcoal flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Target / Comparison Round (Session B)
                </span>
                {sessionB && (
                  <span className="text-xs font-mono font-bold text-brand-charcoal">
                    {sessionB.dateStr}
                  </span>
                )}
              </div>

              <select
                value={sessionBId}
                onChange={(e) => {
                  setSessionBId(e.target.value);
                  audioEngine.playLoFiChord();
                }}
                className="w-full p-2.5 rounded-xl bg-white border border-brand-amber/40 text-xs font-bold text-brand-charcoal focus:outline-hidden focus:border-brand-amber cursor-pointer shadow-2xs"
              >
                {records.map((r) => (
                  <option key={`b-${r.id}`} value={r.id} disabled={r.id === sessionAId}>
                    {r.dateStr} — {r.roleTrack} ({r.overallScore}% • {r.hiringDecision})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Overall Delta Highlight Banner */}
          {sessionA && sessionB && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/10 text-amber-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/70">
                    Net Score Progression
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black font-display text-white">
                      {sessionA.overallScore}% ➔ {sessionB.overallScore}%
                    </span>
                    {renderDelta(sessionA.overallScore, sessionB.overallScore, '%')}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-white/60">HIRING BAR TRAJECTORY</div>
                  <div className="text-xs font-mono font-bold text-amber-300">
                    {sessionA.hiringDecision} ➔ {sessionB.hiringDecision}
                  </div>
                </div>

                {onOpenScorecard && (
                  <button
                    onClick={() => {
                      onOpenScorecard(sessionB);
                      audioEngine.playLoFiChord();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-brand-charcoal text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    View Session B Scorecard
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Recharts Radar Chart Visualizer (Session A vs Session B Multi-Dimensional Fingerprint) */}
          {sessionA && sessionB && radarChartData.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-brand-slate/20 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-brand-amber">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-brand-charcoal">
                      Multi-Dimensional Radar Fingerprint
                    </h3>
                    <p className="text-[11px] font-mono text-brand-muted">
                      Direct geometric comparison of Technical, Communication, Confidence, and Sentiment dynamics.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <span className="w-3 h-3 rounded-full bg-slate-500 inline-block opacity-80" />
                    <span>Session A ({sessionA.overallScore}%)</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-amber-600">
                    <span className="w-3 h-3 rounded-full bg-brand-amber inline-block" />
                    <span>Session B ({sessionB.overallScore}%)</span>
                  </span>
                </div>
              </div>

              {/* Radar Chart Container */}
              <div className="w-full h-72 sm:h-80 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                    <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fill: '#334155', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#64748b', fontSize: 9 }}
                      stroke="#94a3b8" 
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const diff = data.sessionB - data.sessionA;
                          return (
                            <div className="bg-brand-charcoal/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl text-xs font-mono space-y-2 border border-white/20 max-w-xs z-50">
                              <div className="flex items-center justify-between border-b border-white/15 pb-1.5">
                                <span className="font-display font-bold text-brand-amber text-sm">{data.metric}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  diff >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                }`}>
                                  {diff >= 0 ? `+${diff}%` : `${diff}%`} Delta
                                </span>
                              </div>

                              {/* Primary Scores */}
                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div className="bg-white/5 p-1.5 rounded-lg border border-white/10">
                                  <span className="text-slate-400 text-[10px] block">Session A ({sessionA.dateStr}):</span>
                                  <span className="font-bold text-white text-sm">{data.sessionA}%</span>
                                </div>
                                <div className="bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20">
                                  <span className="text-amber-300/80 text-[10px] block">Session B ({sessionB.dateStr}):</span>
                                  <span className="font-bold text-amber-300 text-sm">{data.sessionB}%</span>
                                </div>
                              </div>

                              {/* Sub-Score Breakdown */}
                              {data.subBreakdowns && data.subBreakdowns.length > 0 && (
                                <div className="space-y-1.5 pt-1.5 border-t border-white/10">
                                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider block">
                                    Sub-Score Breakdown:
                                  </span>
                                  {data.subBreakdowns.map((sub: any, idx: number) => {
                                    const subDiff = sub.b - sub.a;
                                    return (
                                      <div key={idx} className="space-y-0.5">
                                        <div className="flex justify-between items-center text-[10px]">
                                          <span className="text-white/80">{sub.name}</span>
                                          <span className="font-mono text-white/90">
                                            {sub.a}% → <strong className="text-amber-300">{sub.b}%</strong>
                                            <span className={`ml-1 text-[9px] ${subDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                              ({subDiff >= 0 ? `+${subDiff}` : subDiff}%)
                                            </span>
                                          </span>
                                        </div>
                                        {/* Mini comparison bar */}
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex">
                                          <div 
                                            className="h-full bg-slate-400/80" 
                                            style={{ width: `${Math.min(100, sub.a)}%` }} 
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Radar
                      name={`Session A: ${sessionA.dateStr}`}
                      dataKey="sessionA"
                      stroke="#64748b"
                      fill="#64748b"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Radar
                      name={`Session B: ${sessionB.dateStr}`}
                      dataKey="sessionB"
                      stroke="#d97706"
                      fill="#f59e0b"
                      fillOpacity={0.45}
                      strokeWidth={2.5}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 8 }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Dimension Grid Comparison */}
          {sessionA && sessionB && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-amber" />
                <span>Core Competency & Assessment Dimensions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Technical Score */}
                <div className="p-3.5 rounded-2xl bg-white border border-brand-slate/20 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-charcoal">
                    <span className="flex items-center gap-1 text-purple-700">
                      <Brain className="w-3.5 h-3.5" /> Technical
                    </span>
                    {renderDelta(sessionA.technicalScore, sessionB.technicalScore, '%')}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-slate">A: {sessionA.technicalScore}%</span>
                    <span className="font-bold text-brand-charcoal">B: {sessionB.technicalScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${sessionB.technicalScore}%` }} />
                  </div>
                </div>

                {/* Communication Score */}
                <div className="p-3.5 rounded-2xl bg-white border border-brand-slate/20 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-charcoal">
                    <span className="flex items-center gap-1 text-blue-700">
                      <Mic className="w-3.5 h-3.5" /> Communication
                    </span>
                    {renderDelta(sessionA.communicationScore, sessionB.communicationScore, '%')}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-slate">A: {sessionA.communicationScore}%</span>
                    <span className="font-bold text-brand-charcoal">B: {sessionB.communicationScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${sessionB.communicationScore}%` }} />
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="p-3.5 rounded-2xl bg-white border border-brand-slate/20 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-charcoal">
                    <span className="flex items-center gap-1 text-amber-700">
                      <Activity className="w-3.5 h-3.5" /> Confidence
                    </span>
                    {renderDelta(sessionA.confidenceScore, sessionB.confidenceScore, '%')}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-slate">A: {sessionA.confidenceScore}%</span>
                    <span className="font-bold text-brand-charcoal">B: {sessionB.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${sessionB.confidenceScore}%` }} />
                  </div>
                </div>

                {/* Eye Contact Tracking */}
                <div className="p-3.5 rounded-2xl bg-white border border-brand-slate/20 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-charcoal">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <Eye className="w-3.5 h-3.5" /> Eye Contact
                    </span>
                    {renderDelta(sessionA.eyeContactScore, sessionB.eyeContactScore, '%')}
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-slate">A: {sessionA.eyeContactScore}%</span>
                    <span className="font-bold text-brand-charcoal">B: {sessionB.eyeContactScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sessionB.eyeContactScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Speech Sentiment, Tone & WPM Comparison */}
          {sessionA && sessionB && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Speech Tone, Speaking Pace & Linguistic Delivery</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Session A Sentiment Card */}
                <div className="p-4 rounded-2xl bg-brand-sand/15 border border-brand-slate/20 space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate/15 pb-2">
                    <span className="font-display font-bold text-xs text-brand-charcoal">
                      Session A: {sessionA.roleTrack}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-sand text-brand-slate">
                      {sessionA.dateStr}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-brand-slate">Dominant Tone:</span>
                      <span className="font-mono font-bold text-brand-charcoal px-2 py-0.5 rounded bg-white border border-brand-slate/20">
                        {sentimentA?.dominantTone || 'Analytical & Structured'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-brand-slate">Speaking Pace:</span>
                      <span className="font-mono font-bold text-brand-charcoal">
                        {sentimentA?.speakingPaceWpm || 135} WPM ({sentimentA?.paceRating || 'Optimal Pace'})
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-brand-slate">Filler Words:</span>
                      <span className="font-mono text-brand-charcoal">
                        {sentimentA?.fillerWordFrequency ? `${sentimentA.fillerWordFrequency.toFixed(1)} / 100w` : '2.1 / 100w'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-brand-slate">Sentiment Polarity:</span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {sentimentA?.sentiment || 'Positive'} ({sentimentA?.sentimentScore || 80}/100)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session B Sentiment Card */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-brand-amber/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-amber/20 pb-2">
                    <span className="font-display font-bold text-xs text-brand-charcoal">
                      Session B: {sessionB.roleTrack}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber-dark font-bold">
                      {sessionB.dateStr}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-brand-slate">Dominant Tone:</span>
                      <span className="font-mono font-bold text-brand-charcoal px-2 py-0.5 rounded bg-white border border-brand-amber/30">
                        {sentimentB?.dominantTone || 'Assertive & Confident'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-brand-slate">Speaking Pace:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-charcoal">
                          {sentimentB?.speakingPaceWpm || 142} WPM
                        </span>
                        {renderDelta(sentimentA?.speakingPaceWpm || 135, sentimentB?.speakingPaceWpm || 142, ' WPM')}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-brand-slate">Filler Words:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-brand-charcoal">
                          {sentimentB?.fillerWordFrequency ? `${sentimentB.fillerWordFrequency.toFixed(1)} / 100w` : '1.4 / 100w'}
                        </span>
                        {renderDelta(sentimentA?.fillerWordFrequency || 2.1, sentimentB?.fillerWordFrequency || 1.4, '/100w', true)}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-brand-slate">Sentiment Polarity:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-700 font-bold">
                          {sentimentB?.sentiment || 'Very Positive'} ({sentimentB?.sentimentScore || 88}/100)
                        </span>
                        {renderDelta(sentimentA?.sentimentScore || 80, sentimentB?.sentimentScore || 88, ' pts')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Qualitative Strengths & Action Items Side-by-Side */}
          {sessionA && sessionB && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Interviewer Feedback & Key Takeaways</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Session A Feedback */}
                <div className="p-4 rounded-2xl bg-white border border-brand-slate/20 shadow-2xs space-y-3">
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Session A Strengths:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-brand-slate list-disc pl-4">
                    {(sessionA.topStrengths || ['Clear communication', 'System trade-off rationale']).slice(0, 3).map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>

                  <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5 pt-2 border-t border-brand-slate/10">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Session A Focus Areas:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-brand-slate list-disc pl-4">
                    {(sessionA.keyActionItems || ['Elaborate mathematical loss formulations']).slice(0, 3).map((ac, i) => (
                      <li key={i}>{ac}</li>
                    ))}
                  </ul>
                </div>

                {/* Session B Feedback */}
                <div className="p-4 rounded-2xl bg-white border border-brand-amber/30 shadow-2xs space-y-3">
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Session B Strengths:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-brand-slate list-disc pl-4">
                    {(sessionB.topStrengths || ['Precise latency budgeting', 'Rapid convergence analysis']).slice(0, 3).map((st, i) => (
                      <li key={i}>{st}</li>
                    ))}
                  </ul>

                  <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5 pt-2 border-t border-brand-slate/10">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Session B Focus Areas:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-brand-slate list-disc pl-4">
                    {(sessionB.keyActionItems || ['Maintain vocal energy towards the end']).slice(0, 3).map((ac, i) => (
                      <li key={i}>{ac}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Personal Reflection Notes comparison if present */}
          {sessionA && sessionB && (sessionA.personalReflections || sessionB.personalReflections) && (
            <div className="p-4 rounded-2xl bg-brand-sand/20 border border-brand-slate/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Candidate Self-Assessment Reflection Comparison</span>
                </span>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span>Self-Rating A: <strong>{sessionA.personalReflections?.selfRating || 4}/5 ★</strong></span>
                  <span>➔</span>
                  <span className="text-amber-700">Self-Rating B: <strong>{sessionB.personalReflections?.selfRating || 4}/5 ★</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-brand-slate/15">
                  <div className="font-bold text-brand-charcoal text-[11px] mb-1">Session A Notes:</div>
                  <p className="text-brand-slate italic">
                    {sessionA.personalReflections?.whatWentWell || sessionA.personalNotes || 'No notes logged.'}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-brand-amber/30">
                  <div className="font-bold text-brand-charcoal text-[11px] mb-1">Session B Notes:</div>
                  <p className="text-brand-slate italic">
                    {sessionB.personalReflections?.whatWentWell || sessionB.personalNotes || 'No notes logged.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-brand-sand/20 border-t border-brand-slate/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] font-mono text-brand-muted">
            Comparing <strong>{sessionA?.roleTrack}</strong> ({sessionA?.dateStr}) vs <strong>{sessionB?.roleTrack}</strong> ({sessionB?.dateStr})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
