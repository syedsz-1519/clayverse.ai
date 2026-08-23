import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Edit3, 
  Save, 
  Check, 
  Sparkles, 
  Star, 
  Plus, 
  X, 
  Lightbulb, 
  Target, 
  AlertTriangle, 
  CheckCircle2,
  Trash2,
  BookOpen
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { audioEngine } from '../lib/audioEngine';

interface SessionInlineReflectionEditorProps {
  record: MockInterviewRecord;
  onSave?: (updatedRecord: MockInterviewRecord) => void;
  className?: string;
  isCompact?: boolean;
}

export default function SessionInlineReflectionEditor({
  record,
  onSave,
  className = '',
  isCompact = false
}: SessionInlineReflectionEditorProps) {
  const [generalNotes, setGeneralNotes] = useState(
    record.personalReflections?.generalNotes || record.personalNotes || ''
  );
  const [whatWentWell, setWhatWentWell] = useState(
    record.personalReflections?.whatWentWell || ''
  );
  const [areasToImprove, setAreasToImprove] = useState(
    record.personalReflections?.areasToImprove || ''
  );
  const [selfRating, setSelfRating] = useState<number>(
    record.personalReflections?.selfRating || 4
  );
  const [takeaways, setTakeaways] = useState<string[]>(
    record.personalReflections?.keyTakeaways || []
  );
  const [newTakeawayInput, setNewTakeawayInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeSubTab, setActiveSubTab] = useState<'takeaways' | 'notes' | 'strengths'>('takeaways');

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if record prop changes
  useEffect(() => {
    setGeneralNotes(record.personalReflections?.generalNotes || record.personalNotes || '');
    setWhatWentWell(record.personalReflections?.whatWentWell || '');
    setAreasToImprove(record.personalReflections?.areasToImprove || '');
    setSelfRating(record.personalReflections?.selfRating || 4);
    setTakeaways(record.personalReflections?.keyTakeaways || []);
  }, [record.id]);

  const persistReflections = (
    updatedTakeaways = takeaways,
    updatedGeneralNotes = generalNotes,
    updatedWhatWentWell = whatWentWell,
    updatedAreasToImprove = areasToImprove,
    updatedRating = selfRating
  ) => {
    setSaveStatus('saving');

    const reflectionPayload = {
      whatWentWell: updatedWhatWentWell,
      areasToImprove: updatedAreasToImprove,
      generalNotes: updatedGeneralNotes,
      selfRating: updatedRating,
      keyTakeaways: updatedTakeaways,
      updatedAt: Date.now()
    };

    const updatedRecord: MockInterviewRecord = {
      ...record,
      personalNotes: updatedGeneralNotes,
      personalReflections: reflectionPayload
    };

    try {
      // Save to localStorage 'clay_mock_interviews'
      const saved = localStorage.getItem('clay_mock_interviews');
      if (saved) {
        const list: MockInterviewRecord[] = JSON.parse(saved);
        const nextList = list.map(r => r.id === record.id ? updatedRecord : r);
        localStorage.setItem('clay_mock_interviews', JSON.stringify(nextList));
      }

      // Also sync to legacy/alternate key if present
      const altSaved = localStorage.getItem('ai_mock_interview_history');
      if (altSaved) {
        const altList: MockInterviewRecord[] = JSON.parse(altSaved);
        const nextAltList = altList.map(r => r.id === record.id ? updatedRecord : r);
        localStorage.setItem('ai_mock_interview_history', JSON.stringify(nextAltList));
      }

      window.dispatchEvent(new Event('clay_interview_records_updated'));
      window.dispatchEvent(new Event('clay_interview_saved'));

      if (onSave) {
        onSave(updatedRecord);
      }

      setSaveStatus('saved');
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (err) {
      console.warn('Failed to save session reflections:', err);
      setSaveStatus('idle');
    }
  };

  const handleAddTakeaway = () => {
    if (!newTakeawayInput.trim()) return;
    audioEngine.playLoFiChord();
    const updated = [...takeaways, newTakeawayInput.trim()];
    setTakeaways(updated);
    setNewTakeawayInput('');
    persistReflections(updated);
  };

  const handleRemoveTakeaway = (indexToRemove: number) => {
    audioEngine.playLoFiChord();
    const updated = takeaways.filter((_, idx) => idx !== indexToRemove);
    setTakeaways(updated);
    persistReflections(updated);
  };

  const handleAddQuickPrompt = (promptText: string) => {
    audioEngine.playLoFiChord();
    setNewTakeawayInput(promptText);
  };

  const handleExplicitSave = () => {
    audioEngine.playLoFiChord();
    persistReflections();
  };

  return (
    <div className={`bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 sm:p-5 space-y-4 ${className}`}>
      
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-800 shrink-0">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display font-bold text-xs sm:text-sm text-brand-charcoal">
                Personal Reflections & Key Takeaways
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[9.5px] font-mono font-bold">
                INLINE JOURNAL
              </span>
            </div>
            <p className="text-[11px] text-brand-slate">
              Jot down actionable lessons, mental models, or mistakes to avoid before your next round.
            </p>
          </div>
        </div>

        {/* Action Controls & Autosave Indicator */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          {/* Self Assessment Rating Stars */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-amber-200/80 shadow-2xs">
            <span className="text-[10px] font-mono text-brand-slate mr-1">Self Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  audioEngine.playLoFiChord();
                  setSelfRating(star);
                  persistReflections(takeaways, generalNotes, whatWentWell, areasToImprove, star);
                }}
                className="cursor-pointer hover:scale-110 transition-transform"
                title={`Rate this session: ${star} of 5 stars`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    star <= selfRating 
                      ? 'text-amber-400 fill-amber-400' 
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Save Status Badge */}
          <div className="flex items-center gap-1.5">
            {saveStatus === 'saving' && (
              <span className="text-[10px] font-mono text-amber-700 animate-pulse font-medium">
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                Saved
              </span>
            )}

            <button
              onClick={handleExplicitSave}
              className="px-3 py-1.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5 text-brand-amber" />
              <span>Save Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Key Takeaways vs Freeform Notes vs Strength Critique */}
      <div className="flex items-center gap-1.5 border-b border-amber-200/50 pb-2">
        <button
          onClick={() => setActiveSubTab('takeaways')}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'takeaways'
              ? 'bg-amber-500 text-white shadow-2xs'
              : 'text-brand-slate hover:bg-amber-100/70'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Key Takeaways ({takeaways.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'notes'
              ? 'bg-amber-500 text-white shadow-2xs'
              : 'text-brand-slate hover:bg-amber-100/70'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Personal Reflection Journal</span>
        </button>

        <button
          onClick={() => setActiveSubTab('strengths')}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'strengths'
              ? 'bg-amber-500 text-white shadow-2xs'
              : 'text-brand-slate hover:bg-amber-100/70'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>What Went Well & Next Goal</span>
        </button>
      </div>

      {/* SUB-TAB 1: KEY TAKEAWAYS BULLETS & QUICK CHIPS */}
      {activeSubTab === 'takeaways' && (
        <div className="space-y-3">
          {/* Prompt Suggestion Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-brand-muted font-bold uppercase mr-1">
              Quick Prompts:
            </span>
            {[
              '💡 Quantization AWQ vs GGUF trade-off',
              '🎯 Maintain direct camera lens lock during STAR results',
              '⚠️ Mention distributed KV-cache latency penalty',
              '⚡ Slow down speaking pace to 135 WPM on technical trade-offs'
            ].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddQuickPrompt(prompt)}
                className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white hover:bg-amber-100 border border-amber-200/80 text-amber-950 transition-all cursor-pointer shadow-2xs truncate max-w-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Existing Takeaways List */}
          {takeaways.length > 0 ? (
            <div className="space-y-1.5">
              {takeaways.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-amber-200/70 text-xs shadow-2xs"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-brand-amber font-black text-xs shrink-0 mt-0.5">•</span>
                    <span className="text-brand-charcoal font-medium leading-relaxed break-words">
                      {item}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveTakeaway(index)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all shrink-0 cursor-pointer"
                    title="Remove takeaway"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-white/70 rounded-xl border border-dashed border-amber-300/80 text-center text-xs text-brand-muted">
              No takeaways recorded yet for this session. Add your first key takeaway below!
            </div>
          )}

          {/* Add Takeaway Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTakeawayInput}
              onChange={(e) => setNewTakeawayInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTakeaway();
                }
              }}
              placeholder="e.g. Remember to structure trade-offs with explicit memory vs latency numbers..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-xs font-sans text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            <button
              onClick={handleAddTakeaway}
              disabled={!newTakeawayInput.trim()}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-2xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Takeaway</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: FREEFORM NOTES & JOURNAL */}
      {activeSubTab === 'notes' && (
        <div className="space-y-2">
          <label className="text-[10.5px] font-mono font-bold text-brand-charcoal uppercase block">
            Personal Session Notes & Deep Takeaways:
          </label>
          <textarea
            value={generalNotes}
            onChange={(e) => {
              setGeneralNotes(e.target.value);
            }}
            onBlur={() => persistReflections(takeaways, generalNotes, whatWentWell, areasToImprove, selfRating)}
            rows={4}
            placeholder="Write freeform notes about how you felt, areas you excelled in, or specific feedback from the interviewer..."
            className="w-full p-3 rounded-xl bg-white border border-amber-300 text-xs text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-sans leading-relaxed"
          />
          <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted">
            <span>Autosaves on blur or when clicking 'Save Note'</span>
            <span>{generalNotes.length} characters</span>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: WHAT WENT WELL & AREAS TO IMPROVE */}
      {activeSubTab === 'strengths' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-emerald-800 uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              What Went Well
            </label>
            <textarea
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              onBlur={() => persistReflections(takeaways, generalNotes, whatWentWell, areasToImprove, selfRating)}
              rows={3}
              placeholder="e.g. Great structured opening using the STAR framework; concise analogies..."
              className="w-full p-2.5 rounded-xl bg-white border border-emerald-300/80 text-xs text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-amber-900 uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Areas to Improve / Next Round Focus
            </label>
            <textarea
              value={areasToImprove}
              onChange={(e) => setAreasToImprove(e.target.value)}
              onBlur={() => persistReflections(takeaways, generalNotes, whatWentWell, areasToImprove, selfRating)}
              rows={3}
              placeholder="e.g. Need to avoid saying 'um' when transitioning between algorithmic steps..."
              className="w-full p-2.5 rounded-xl bg-white border border-amber-300/80 text-xs text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>
        </div>
      )}

    </div>
  );
}
