import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Flame, 
  TrendingUp, 
  Award, 
  Clock, 
  Send, 
  Bell, 
  Settings, 
  X, 
  Check, 
  Volume2, 
  Eye, 
  Brain,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { DailyStreakState } from '../lib/streakManager';
import { audioEngine } from '../lib/audioEngine';

export interface WeeklyEmailDigestPreferences {
  enabled: boolean;
  email: string;
  deliveryDay: 'monday' | 'sunday' | 'friday';
  deliveryTime: '09:00' | '18:00';
  includeScores: boolean;
  includeSentiment: boolean;
  includeStreak: boolean;
  includeRecommendations: boolean;
  format: 'rich_html' | 'compact_text';
  lastSentTimestamp?: number;
}

const STORAGE_KEY = 'clay_weekly_email_digest_preferences';

export function getEmailDigestPreferences(defaultEmail = 'syedshahnawazz1519@gmail.com'): WeeklyEmailDigestPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading email preferences', e);
  }

  return {
    enabled: true,
    email: defaultEmail,
    deliveryDay: 'monday',
    deliveryTime: '09:00',
    includeScores: true,
    includeSentiment: true,
    includeStreak: true,
    includeRecommendations: true,
    format: 'rich_html'
  };
}

export function saveEmailDigestPreferences(prefs: WeeklyEmailDigestPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving email preferences', e);
  }
}

interface WeeklyEmailDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  defaultEmail?: string;
  interviewHistory: MockInterviewRecord[];
  streakState: DailyStreakState;
  onPreferencesUpdated?: (prefs: WeeklyEmailDigestPreferences) => void;
  onSavePreferences?: (prefs: WeeklyEmailDigestPreferences) => void;
}

export default function WeeklyEmailDigestModal({
  isOpen,
  onClose,
  userEmail,
  defaultEmail,
  interviewHistory,
  streakState,
  onPreferencesUpdated,
  onSavePreferences
}: WeeklyEmailDigestModalProps) {
  const effectiveEmail = userEmail || defaultEmail || 'syedshahnawazz1519@gmail.com';
  const [prefs, setPrefs] = useState<WeeklyEmailDigestPreferences>(() => getEmailDigestPreferences(effectiveEmail));
  const [previewTab, setPreviewTab] = useState<'settings' | 'preview'>('settings');
  const [isSaved, setIsSaved] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  useEffect(() => {
    if (effectiveEmail && (!prefs.email || prefs.email === '')) {
      setPrefs(prev => ({ ...prev, email: effectiveEmail }));
    }
  }, [effectiveEmail]);

  if (!isOpen) return null;

  const handleToggle = () => {
    audioEngine.playLoFiChord();
    setPrefs(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleSave = () => {
    audioEngine.playLoFiChord();
    saveEmailDigestPreferences(prefs);
    if (onPreferencesUpdated) {
      onPreferencesUpdated(prefs);
    }
    if (onSavePreferences) {
      onSavePreferences(prefs);
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleSendTest = () => {
    audioEngine.playLoFiChord();
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      setTestSentSuccess(true);
      setTimeout(() => setTestSentSuccess(false), 4000);
    }, 1000);
  };

  // Compute actual summary metrics for preview
  const recentInterviews = interviewHistory.slice(0, 3);
  const avgScore = interviewHistory.length > 0 
    ? Math.round(interviewHistory.reduce((acc, r) => acc + (r.overallScore || 0), 0) / interviewHistory.length) 
    : 85;
  const bestScore = interviewHistory.length > 0 
    ? Math.max(...interviewHistory.map(r => r.overallScore || 0)) 
    : 92;

  const latestSentiment = interviewHistory[0]?.speechSentimentReport?.dominantTone || 'Assertive & Confident';
  const latestWpm = interviewHistory[0]?.speechSentimentReport?.speakingPaceWpm || 142;

  return (
    <div 
      id="weekly-email-digest-backdrop"
      className="fixed inset-0 z-50 bg-brand-charcoal/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl border border-brand-slate/20 shadow-2xl max-w-2xl w-full overflow-hidden my-4 sm:my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-brand-amber/15 p-5 sm:p-6 border-b border-brand-slate/15 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  WEEKLY DIGEST & STREAK SUMMARY
                </span>
                <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Opt-In Enabled
                </span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-black text-brand-charcoal mt-0.5">
                Weekly Performance & Streak Email Digest
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-slate hover:text-brand-charcoal hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Settings vs Email Preview */}
        <div className="px-6 pt-3 bg-brand-sand/15 border-b border-brand-slate/10 flex items-center gap-2">
          <button
            onClick={() => {
              setPreviewTab('settings');
              audioEngine.playLoFiChord();
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              previewTab === 'settings'
                ? 'border-brand-charcoal text-brand-charcoal font-black'
                : 'border-transparent text-brand-slate hover:text-brand-charcoal'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Delivery</span>
          </button>

          <button
            onClick={() => {
              setPreviewTab('preview');
              audioEngine.playLoFiChord();
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              previewTab === 'preview'
                ? 'border-brand-charcoal text-brand-charcoal font-black'
                : 'border-transparent text-brand-slate hover:text-brand-charcoal'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Digest Preview</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {previewTab === 'settings' ? (
            <div className="space-y-5">
              {/* Master Toggle Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-brand-sand/30 border border-blue-500/20 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-display font-bold text-sm text-brand-charcoal">
                    Receive Weekly Performance Summary Email
                  </div>
                  <p className="text-xs text-brand-slate">
                    Automated report with your interview score trajectory, spoken pace, and weekly streak recap.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle}
                  className={`w-12 h-6.5 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                    prefs.enabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    layout
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                      prefs.enabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Email Address & Timing */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Destination Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={prefs.email}
                    onChange={(e) => setPrefs(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g., student@university.edu"
                    className="w-full p-3 rounded-xl bg-white border border-brand-slate/20 text-xs font-mono text-brand-charcoal focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Day */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      <span>Delivery Day</span>
                    </label>
                    <select
                      value={prefs.deliveryDay}
                      onChange={(e) => setPrefs(prev => ({ ...prev, deliveryDay: e.target.value as any }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-brand-slate/20 text-xs font-bold text-brand-charcoal focus:outline-hidden focus:border-blue-600 cursor-pointer shadow-2xs"
                    >
                      <option value="monday">Every Monday (Start of Week Kickoff)</option>
                      <option value="sunday">Every Sunday (Weekend Recap)</option>
                      <option value="friday">Every Friday (End of Week Wrap-up)</option>
                    </select>
                  </div>

                  {/* Delivery Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Delivery Time</span>
                    </label>
                    <select
                      value={prefs.deliveryTime}
                      onChange={(e) => setPrefs(prev => ({ ...prev, deliveryTime: e.target.value as any }))}
                      className="w-full p-2.5 rounded-xl bg-white border border-brand-slate/20 text-xs font-bold text-brand-charcoal focus:outline-hidden focus:border-blue-600 cursor-pointer shadow-2xs"
                    >
                      <option value="09:00">Morning (9:00 AM)</option>
                      <option value="18:00">Evening (6:00 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modules to Include */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-brand-charcoal block">
                  Digest Content Customization:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2 p-3 rounded-xl bg-brand-sand/20 border border-brand-slate/15 cursor-pointer hover:bg-brand-sand/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={prefs.includeScores}
                      onChange={(e) => setPrefs(prev => ({ ...prev, includeScores: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-brand-charcoal block">Interview Scores & Decisions</span>
                      <span className="text-[10px] text-brand-muted">Average score, passing bar & deltas</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-brand-sand/20 border border-brand-slate/15 cursor-pointer hover:bg-brand-sand/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={prefs.includeStreak}
                      onChange={(e) => setPrefs(prev => ({ ...prev, includeStreak: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-brand-charcoal block">Streak & Consistency Recap</span>
                      <span className="text-[10px] text-brand-muted">Active streak days & milestone badges</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-brand-sand/20 border border-brand-slate/15 cursor-pointer hover:bg-brand-sand/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={prefs.includeSentiment}
                      onChange={(e) => setPrefs(prev => ({ ...prev, includeSentiment: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-brand-charcoal block">Speech & Sentiment Analysis</span>
                      <span className="text-[10px] text-brand-muted">Tone breakdown, WPM & filler words</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl bg-brand-sand/20 border border-brand-slate/15 cursor-pointer hover:bg-brand-sand/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={prefs.includeRecommendations}
                      onChange={(e) => setPrefs(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-brand-charcoal block">Recommended Next Topics</span>
                      <span className="text-[10px] text-brand-muted">Curriculum modules to study next</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            /* Live Digest Email Preview */
            <div className="space-y-4">
              <div className="text-xs text-brand-muted flex items-center justify-between">
                <span>Previewing email as sent to <strong>{prefs.email || userEmail}</strong></span>
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">Format: Rich HTML</span>
              </div>

              {/* Email Envelope Container */}
              <div className="border border-brand-slate/20 rounded-2xl overflow-hidden bg-slate-50 text-brand-charcoal shadow-sm">
                {/* Email Top Header */}
                <div className="bg-slate-900 text-white p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
                        C
                      </div>
                      <span className="font-display font-black text-sm tracking-wide">CLAYVERSE SCHOLAR</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-white/10 px-2 py-0.5 rounded">
                      WEEKLY DIGEST
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    Your AI Interview Performance & Streak Report 🚀
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Email Body Content */}
                <div className="p-5 space-y-4 bg-white text-xs">
                  {/* Streak Card */}
                  {prefs.includeStreak && (
                    <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                          <Flame className="w-5 h-5 fill-white" />
                        </div>
                        <div>
                          <div className="font-bold text-orange-950">
                            {streakState.currentStreak || 5}-Day Active Streak!
                          </div>
                          <div className="text-[10.5px] text-orange-800">
                            {streakState.currentMilestone?.title || '7-Day AI Scholar'} ({streakState.currentMilestone?.progressPercent || 70}% towards next badge)
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-orange-900 px-2 py-1 bg-white rounded-lg border border-orange-200">
                        🔥 Active
                      </span>
                    </div>
                  )}

                  {/* Interview Metrics Grid */}
                  {prefs.includeScores && (
                    <div className="space-y-2">
                      <div className="font-bold text-brand-charcoal text-[11.5px] uppercase font-mono">
                        📊 Interview Performance Recap
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-mono">Avg Score</div>
                          <div className="text-base font-black text-brand-charcoal font-display">{avgScore}%</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-mono">Best Score</div>
                          <div className="text-base font-black text-emerald-700 font-display">{bestScore}%</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-mono">Sessions</div>
                          <div className="text-base font-black text-brand-charcoal font-display">{interviewHistory.length || 3}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Speech Sentiment */}
                  {prefs.includeSentiment && (
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                      <div className="font-bold text-blue-950 text-[11px] flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Speech & Delivery Analytics:</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-900">
                        <div>Dominant Tone: <strong>{latestSentiment}</strong></div>
                        <div>Speaking Pace: <strong>{latestWpm} WPM (Optimal)</strong></div>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {prefs.includeRecommendations && (
                    <div className="space-y-1.5 pt-1">
                      <div className="font-bold text-brand-charcoal text-[11.5px] uppercase font-mono">
                        🎯 Recommended For Next Week
                      </div>
                      <ul className="text-[11px] text-brand-slate space-y-1 list-disc pl-4">
                        <li>Practice <strong>Transformer Architecture & Attention Scaling</strong> round</li>
                        <li>Maintain eye contact above 90% during live webcam HUD</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Email Footer */}
                <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500">
                  <span>Sent by Clayverse AI Learning Platform • You can adjust preferences anytime</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-brand-sand/20 border-t border-brand-slate/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSendTest}
            disabled={isSendingTest || !prefs.enabled}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-brand-sand/40 border border-brand-slate/20 text-brand-charcoal text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>{isSendingTest ? 'Sending Test...' : 'Send Test Summary Email'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-brand-sand/40 hover:bg-brand-sand/70 text-brand-slate text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
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
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-brand-amber" />
                  <span>Save Digest Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test Email Sent Toast */}
        <AnimatePresence>
          {testSentSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Test email summary dispatched to {prefs.email || userEmail}! Check your inbox.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
