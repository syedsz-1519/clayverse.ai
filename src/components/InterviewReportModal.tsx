import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  Award, 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Brain, 
  ShieldCheck, 
  ExternalLink,
  Target
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import ClayLogo from './ClayLogo';

interface InterviewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MockInterviewRecord | null;
  studentName?: string;
  studentEmail?: string;
}

export default function InterviewReportModal({
  isOpen,
  onClose,
  record,
  studentName = 'AI Explorer Student',
  studentEmail = 'scholar@clay.edu',
}: InterviewReportModalProps) {
  const { lang } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !record) return null;

  // Handle Browser Native Print / Save to PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // Download Standalone Formatted HTML Report
  const handleDownloadHTMLReport = () => {
    const reportHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Mock Interview Performance Report - ${record.roleTrack}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #faf8f5; }
    .report-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 900; color: #d97706; }
    .score-badge { background: #d97706; color: #fff; padding: 12px 24px; border-radius: 16px; font-size: 28px; font-weight: 900; text-align: center; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    .metric-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
    .metric-name { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
    .metric-val { font-size: 20px; font-weight: 800; color: #0f172a; }
    .question-box { background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 14px; }
    .tag { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #fef3c7; color: #92400e; margin-right: 6px; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="header">
      <div>
        <div class="logo">CLAY AI • OFFICIAL EVALUATION</div>
        <h1 style="margin: 4px 0 0 0; font-size: 22px;">Technical Mock Interview Assessment</h1>
        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Candidate: ${studentName} (${studentEmail})</p>
      </div>
      <div class="score-badge">
        ${record.overallScore}%
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">${record.hiringDecision}</div>
      </div>
    </div>

    <div style="margin-bottom: 24px;">
      <h3 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; color: #475569;">Session Metadata</h3>
      <div style="font-size: 13px; color: #334155;">
        <strong>Track:</strong> ${record.roleTrack} | <strong>Interviewer:</strong> ${record.interviewerName} | <strong>Date:</strong> ${record.dateStr} | <strong>Duration:</strong> ${Math.round(record.durationSeconds / 60)} mins
      </div>
    </div>

    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #475569;">Competency Metrics Breakdown</h3>
    <div class="grid">
      <div class="metric-box"><div class="metric-name">Technical Accuracy</div><div class="metric-val">${record.technicalScore}%</div></div>
      <div class="metric-box"><div class="metric-name">Communication Clarity</div><div class="metric-val">${record.communicationScore}%</div></div>
      <div class="metric-box"><div class="metric-name">Camera Eye Gaze</div><div class="metric-val">${record.eyeContactScore}%</div></div>
      <div class="metric-box"><div class="metric-name">Confidence & Poise</div><div class="metric-val">${record.confidenceScore}%</div></div>
    </div>

    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #475569;">Evaluator Summary Feedback</h3>
    <p style="background: #f8fafc; padding: 14px; border-radius: 12px; border-left: 4px solid #d97706; font-size: 13px; color: #334155; margin-bottom: 24px;">
      ${record.summaryFeedback}
    </p>

    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #475569;">Key Action Roadmap</h3>
    <ul style="font-size: 13px; color: #334155; padding-left: 20px; margin-bottom: 24px;">
      ${record.keyActionItems.map(item => `<li>${item}</li>`).join('')}
    </ul>

    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #475569;">Question-by-Question Attempt Record</h3>
    ${record.attempts.map((att, i) => `
      <div class="question-box">
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; margin-bottom: 6px;">
          <span>Q${i+1}: ${att.questionText}</span>
          <span style="color: #d97706;">Score: ${att.score}/100</span>
        </div>
        <p style="font-size: 12px; color: #475569; font-style: italic; margin-bottom: 8px;">"${att.userAnswer}"</p>
        <div style="font-size: 12px; color: #334155;"><strong>AI Feedback:</strong> ${att.aiFeedback}</div>
      </div>
    `).join('')}

    <div class="footer">
      Generated automatically by Clay AI Learning & Interview Assessment Engine • Verification ID: ${record.id}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Clay_AI_Interview_Report_${record.roleTrack.replace(/\s+/g, '_')}_${record.dateStr.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-brand-slate/20 shadow-2xl relative text-left flex flex-col"
        >
          {/* Action Header Bar (Excluded during Print) */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-brand-slate/15 flex items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-amber/15 text-brand-amber-dark">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-black text-brand-charcoal">
                  Official Candidate Assessment Report
                </h3>
                <span className="text-[10px] font-mono text-brand-muted">
                  Ready for Print / PDF Export • ID: {record.id.slice(0, 16)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintPDF}
                className="px-3.5 py-1.5 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={handleDownloadHTMLReport}
                className="px-3.5 py-1.5 rounded-xl bg-brand-sand hover:bg-brand-sand/80 text-brand-charcoal text-xs font-bold transition-all flex items-center gap-1.5 border border-brand-slate/15 cursor-pointer"
                title="Download Standalone HTML Report"
              >
                <Download className="w-3.5 h-3.5 text-brand-amber" />
                <span className="hidden sm:inline">Download HTML</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-brand-sand/40 hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Printable Report Document Body */}
          <div ref={printRef} className="p-6 sm:p-8 space-y-6 text-brand-charcoal print:p-0 print:space-y-4">
            
            {/* Academic Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-brand-slate/15 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-black text-brand-amber tracking-tight">
                    CLAY AI
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-brand-sand/70 text-brand-slate px-2 py-0.5 rounded-md font-bold">
                    Official Assessment
                  </span>
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal">
                  Technical Mock Interview Scorecard
                </h1>
                <p className="text-xs text-brand-muted">
                  Candidate: <strong>{studentName}</strong> • {studentEmail}
                </p>
              </div>

              {/* Big Grade Badge */}
              <div className="bg-gradient-to-br from-brand-charcoal to-slate-900 text-white rounded-2xl p-4 text-center sm:text-right shrink-0 border border-white/10 shadow-md">
                <span className="text-[9px] font-mono uppercase text-brand-amber font-bold block">
                  Composite Score
                </span>
                <div className="text-3xl font-black font-display text-white">
                  {record.overallScore}<span className="text-sm text-brand-amber">/100</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded mt-1 inline-block ${
                  record.hiringDecision === 'Strong Hire' ? 'bg-emerald-500 text-white' :
                  record.hiringDecision === 'Hire' ? 'bg-teal-500 text-white' :
                  record.hiringDecision === 'Leaning Hire' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {record.hiringDecision}
                </span>
              </div>
            </div>

            {/* Session Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-brand-sand/30 p-4 rounded-2xl border border-brand-slate/10 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-muted font-bold block">Role Track</span>
                <span className="font-bold text-brand-charcoal font-display text-xs sm:text-sm">{record.roleTrack}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-muted font-bold block">Interviewer</span>
                <span className="font-bold text-brand-charcoal text-xs sm:text-sm">{record.interviewerName}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-muted font-bold block">Evaluation Date</span>
                <span className="font-bold text-brand-charcoal text-xs sm:text-sm">{record.dateStr}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-brand-muted font-bold block">Session Duration</span>
                <span className="font-bold text-brand-charcoal text-xs sm:text-sm">{Math.round(record.durationSeconds / 60)} Minutes</span>
              </div>
            </div>

            {/* 5 Core Competency Metrics Breakdown */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-brand-amber" />
                <span>Competency Radar Metrics Breakdown</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Metric 1 */}
                <div className="p-3.5 bg-white rounded-2xl border border-brand-slate/15 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-charcoal flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-blue-600" />
                      Technical Accuracy & Depth
                    </span>
                    <span className="font-mono font-bold text-brand-charcoal">{record.technicalScore}%</span>
                  </div>
                  <div className="w-full bg-brand-sand/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${record.technicalScore}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-brand-muted block">Benchmark Target: 85% • Architectural correctness</span>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 bg-white rounded-2xl border border-brand-slate/15 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-charcoal flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      Communication & STAR Structure
                    </span>
                    <span className="font-mono font-bold text-brand-charcoal">{record.communicationScore}%</span>
                  </div>
                  <div className="w-full bg-brand-sand/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${record.communicationScore}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-brand-muted block">Benchmark Target: 85% • Structured explanation</span>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 bg-white rounded-2xl border border-brand-slate/15 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-charcoal flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-brand-amber" />
                      Camera Eye Contact & Gaze
                    </span>
                    <span className="font-mono font-bold text-brand-charcoal">{record.eyeContactScore}%</span>
                  </div>
                  <div className="w-full bg-brand-sand/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-brand-amber h-full rounded-full transition-all duration-500" 
                      style={{ width: `${record.eyeContactScore}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-brand-muted block">Benchmark Target: 80% • Vision HUD verified</span>
                </div>

                {/* Metric 4 */}
                <div className="p-3.5 bg-white rounded-2xl border border-brand-slate/15 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-charcoal flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      Confidence & Executive Delivery
                    </span>
                    <span className="font-mono font-bold text-brand-charcoal">{record.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-brand-sand/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${record.confidenceScore}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-brand-muted block">Benchmark Target: 80% • Posture & cadence stability</span>
                </div>

              </div>
            </div>

            {/* Evaluator Summary Statement */}
            <div className="p-4 bg-brand-sand/40 rounded-2xl border border-brand-slate/15 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-amber block">
                Evaluator Executive Statement
              </span>
              <p className="text-xs leading-relaxed text-brand-charcoal">
                "{record.summaryFeedback}"
              </p>
            </div>

            {/* Strengths & Action Items Roadmap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-2">
                <span className="font-display font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Strengths
                </span>
                <ul className="space-y-1 text-[11px] text-emerald-950">
                  {record.topStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-2">
                <span className="font-display font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Recommended Action Roadmap
                </span>
                <ul className="space-y-1 text-[11px] text-amber-950">
                  {record.keyActionItems.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question-by-Question Attempt Records Table */}
            <div className="space-y-3 pt-2">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-muted">
                Question Performance & Transcripts ({record.attempts.length})
              </h4>

              <div className="space-y-3">
                {record.attempts.map((att, aIdx) => (
                  <div key={aIdx} className="p-4 bg-white rounded-2xl border border-brand-slate/15 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-brand-charcoal">
                      <span>Question {aIdx + 1}: {att.questionText}</span>
                      <span className="text-brand-amber font-mono font-black">{att.score}/100</span>
                    </div>

                    <div className="p-2.5 bg-brand-sand/30 rounded-xl text-[11px] font-medium text-brand-slate italic">
                      "{att.userAnswer}"
                    </div>

                    <div className="text-[11px] text-brand-charcoal pt-1">
                      <strong className="text-brand-charcoal">AI Critique:</strong> {att.aiFeedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Footer Verification */}
            <div className="pt-6 border-t border-brand-slate/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-brand-muted">
              <span>Clay AI Learning Engine • Verified Assessment Standard</span>
              <span>Generated on {new Date().toLocaleDateString('en-US')}</span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
