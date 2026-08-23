import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  Star, 
  ThumbsUp, 
  AlertCircle, 
  X, 
  BookOpen, 
  Tag, 
  Share2,
  Download
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

interface PostInterviewReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MockInterviewRecord | null;
  onSaveReflection?: (recordId: string, reflectionData: NonNullable<MockInterviewRecord['personalReflections']>) => void;
}

export default function PostInterviewReflectionModal({
  isOpen,
  onClose,
  record,
  onSaveReflection
}: PostInterviewReflectionModalProps) {
  const { lang } = useLanguage();

  const [whatWentWell, setWhatWentWell] = useState('');
  const [areasToImprove, setAreasToImprove] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [selfRating, setSelfRating] = useState<number>(4);
  const [keyTakeawaysText, setKeyTakeawaysText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Initialize from record if already present
  useEffect(() => {
    if (record) {
      if (record.personalReflections) {
        setWhatWentWell(record.personalReflections.whatWentWell || '');
        setAreasToImprove(record.personalReflections.areasToImprove || '');
        setGeneralNotes(record.personalReflections.generalNotes || record.personalNotes || '');
        setSelfRating(record.personalReflections.selfRating || 4);
        setKeyTakeawaysText((record.personalReflections.keyTakeaways || []).join('\n'));
      } else if (record.personalNotes) {
        setGeneralNotes(record.personalNotes);
        setWhatWentWell('');
        setAreasToImprove('');
        setSelfRating(4);
        setKeyTakeawaysText('');
      } else {
        // Prepopulate with a helpful starter template
        setWhatWentWell(record.topStrengths?.[0] ? `Strong delivery on: ${record.topStrengths[0]}` : '');
        setAreasToImprove(record.keyActionItems?.[0] ? `Need to polish: ${record.keyActionItems[0]}` : '');
        setGeneralNotes('');
        setSelfRating(4);
        setKeyTakeawaysText('');
      }
      setIsSaved(false);
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const handleSave = () => {
    audioEngine.playLoFiChord();
    const takeaways = keyTakeawaysText
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const reflectionPayload = {
      whatWentWell,
      areasToImprove,
      generalNotes,
      selfRating,
      keyTakeaways: takeaways,
      updatedAt: Date.now()
    };

    // Update in localStorage
    try {
      const stored = localStorage.getItem('ai_mock_interview_history');
      if (stored) {
        const history: MockInterviewRecord[] = JSON.parse(stored);
        const updatedHistory = history.map(r => {
          if (r.id === record.id) {
            return {
              ...r,
              personalNotes: generalNotes,
              personalReflections: reflectionPayload
            };
          }
          return r;
        });
        localStorage.setItem('ai_mock_interview_history', JSON.stringify(updatedHistory));
      }
    } catch (e) {
      console.error('Error saving reflection to local storage', e);
    }

    if (onSaveReflection) {
      onSaveReflection(record.id, reflectionPayload);
    }

    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleExportMarkdown = () => {
    audioEngine.playLoFiChord();
    const md = `# Interview Reflection: ${record.roleTrack}
**Date:** ${record.dateStr} | **Score:** ${record.overallScore}% (${record.hiringDecision})
**Interviewer:** ${record.interviewerName} | **Difficulty:** ${record.difficulty}

## 🌟 Self Assessment Rating
Score: ${selfRating} / 5 Stars

## ✅ What Went Well
${whatWentWell || '_No notes recorded._'}

## 🎯 Areas to Improve Next Round
${areasToImprove || '_No notes recorded._'}

## 💡 Key Technical Takeaways
${keyTakeawaysText || '_No takeaways recorded._'}

## 📝 General Reflection & Thoughts
${generalNotes || '_No additional notes._'}

---
*Generated with AI Scholar Interview Assistant*
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Interview_Reflection_${record.roleTrack.replace(/\s+/g, '_')}_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      id="post-interview-reflection-modal-backdrop"
      className="fixed inset-0 z-50 bg-brand-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl border border-brand-slate/20 shadow-2xl max-w-2xl w-full overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-brand-sand/30 p-6 border-b border-brand-slate/15 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber text-white flex items-center justify-center shadow-md shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark border border-brand-amber/30">
                  POST-ROUND REFLECTION
                </span>
                <span className="text-xs font-mono text-brand-muted">
                  {record.dateStr}
                </span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-black text-brand-charcoal mt-1">
                Personal Performance Notes & Reflections
              </h2>
              <p className="text-xs text-brand-slate mt-0.5">
                {record.roleTrack} • Score: <strong>{record.overallScore}%</strong> ({record.hiringDecision})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-slate hover:text-brand-charcoal hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Self Rating Bar */}
          <div className="p-4 rounded-2xl bg-brand-sand/20 border border-brand-slate/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-brand-charcoal block">
                How confident did you feel in this round?
              </label>
              <span className="text-[11px] text-brand-muted">
                Self-rate your overall poise, clarity, and depth
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setSelfRating(star);
                    audioEngine.playLoFiChord();
                  }}
                  className="p-1 rounded-lg hover:scale-115 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= selfRating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-brand-slate/30'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-brand-charcoal ml-2">
                {selfRating}/5
              </span>
            </div>
          </div>

          {/* Grid: What went well & Areas to improve */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* What went well */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>What went well? (Strengths)</span>
              </label>
              <textarea
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                placeholder="e.g., Confident explanation of Transformer attention heads, solid pacing, good eye contact..."
                rows={3}
                className="w-full p-3 rounded-xl bg-white border border-brand-slate/20 text-xs text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none shadow-2xs"
              />
            </div>

            {/* Areas to improve */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Areas to improve next time</span>
              </label>
              <textarea
                value={areasToImprove}
                onChange={(e) => setAreasToImprove(e.target.value)}
                placeholder="e.g., Memorize exact mathematical loss formula, cut down filler words like 'basically'..."
                rows={3}
                className="w-full p-3 rounded-xl bg-white border border-brand-slate/20 text-xs text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none shadow-2xs"
              />
            </div>
          </div>

          {/* Key Technical Takeaways / Bullet points */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Key Concept Takeaways & Formulas to Remember</span>
              <span className="text-[10px] font-normal text-brand-muted font-mono">(1 per line)</span>
            </label>
            <textarea
              value={keyTakeawaysText}
              onChange={(e) => setKeyTakeawaysText(e.target.value)}
              placeholder="e.g.&#10;QKV matrix scaling factor is sqrt(d_k)&#10;Cosine similarity threshold for RAG chunking = 0.75"
              rows={3}
              className="w-full p-3 rounded-xl bg-white border border-brand-slate/20 text-xs font-mono text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-hidden focus:border-brand-amber focus:ring-1 focus:ring-brand-amber resize-none shadow-2xs"
            />
          </div>

          {/* General Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>General Performance Notes & Personal Thoughts</span>
            </label>
            <textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="Any other reminders, interviewer observations, or feelings about this mock round..."
              rows={2}
              className="w-full p-3 rounded-xl bg-white border border-brand-slate/20 text-xs text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-hidden focus:border-brand-amber focus:ring-1 focus:ring-brand-amber resize-none shadow-2xs"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-brand-sand/15 border-t border-brand-slate/15 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-brand-sand/40 border border-brand-slate/20 text-brand-charcoal text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Notes (.md)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-brand-sand/40 hover:bg-brand-sand/70 text-brand-slate text-xs font-bold transition-colors cursor-pointer"
            >
              Skip / Later
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-charcoal hover:bg-black text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Reflections Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-brand-amber" />
                  <span>Save Performance Notes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
