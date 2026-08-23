import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Trophy, 
  Download, 
  X, 
  RotateCcw,
  BookOpen,
  Share2
} from 'lucide-react';
import Confetti from './Confetti';
import { useLanguage } from '../hooks/useLanguage';
import { type LessonModule } from './HomeCurriculumGrid';

interface LessonCompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: LessonModule;
  nextLesson?: LessonModule | null;
  onNextLesson?: () => void;
  onExportNotes?: () => void;
  streakCount?: number;
}

// Gentle pleasant audio chime synthesizer via Web Audio API
function playCompletionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Notes: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);

      // Soft envelope
      gain.gain.setValueAtTime(0, now + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.18, now + index * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.75);
    });
  } catch {
    // Gracefully ignore audio autoplay policies
  }
}

export default function LessonCompletionCelebration({
  isOpen,
  onClose,
  lesson,
  nextLesson,
  onNextLesson,
  onExportNotes,
  streakCount = 1
}: LessonCompletionCelebrationProps) {
  const { lang } = useLanguage();
  const [fillProgress, setFillProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      playCompletionChime();

      // Animate progress ring smoothly from 0 to 100
      setFillProgress(0);
      const timer = setTimeout(() => {
        setFillProgress(100);
      }, 100);

      // Auto fade confetti after 4.5 seconds to keep view clean
      const confettiTimer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(confettiTimer);
      };
    } else {
      setShowConfetti(false);
      setFillProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Circular progress ring math
  const radius = 48;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (fillProgress / 100) * circumference;

  return (
    <>
      {/* Subtle Confetti Particles Burst */}
      {showConfetti && <Confetti />}

      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
          />

          {/* Celebration Card Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 25 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl border-2 border-brand-amber/40 shadow-2xl p-6 sm:p-8 text-center z-10 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress Ring Fill-up Animation */}
            <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
              <svg
                height={radius * 2 + 16}
                width={radius * 2 + 16}
                className="rotate-[-90deg] transform"
              >
                {/* Background Ring */}
                <circle
                  stroke="#F3EDE2"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  r={normalizedRadius}
                  cx={radius + 8}
                  cy={radius + 8}
                />
                {/* Animated Filling Progress Ring */}
                <circle
                  stroke="url(#completionGradient)"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{
                    strokeDashoffset,
                    transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius + 8}
                  cy={radius + 8}
                />
                <defs>
                  <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E07A5F" />
                    <stop offset="60%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Checkmark / Percentage with Spring Scale */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: fillProgress === 100 ? 1 : 0.6, rotate: 0 }}
                  transition={{ delay: 0.4, type: 'spring', damping: 15, stiffness: 200 }}
                  className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
              </div>
            </div>

            {/* Title & Congratulations */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2 mt-3"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'en' ? 'Lesson Mastered!' : 'Sabaq Mukammal!'}</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal">
                {lang === 'en' ? lesson.titleEn : lesson.titleHyd}
              </h3>

              <p className="text-xs text-brand-slate max-w-xs mx-auto">
                {lang === 'en'
                  ? 'Great job! You completed all core subtopics and reinforced your neural understanding.'
                  : 'Boht khoob! Aapne is sabaq ke saare ahem hissay asani se samajh liye.'}
              </p>
            </motion.div>

            {/* Achievement Rewards Strip (+50 XP & Streak Bonus) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 p-3.5 rounded-2xl bg-brand-sand/50 border border-brand-slate/15 flex items-center justify-around text-left"
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-brand-amber flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-brand-muted font-bold">
                    XP Gained
                  </span>
                  <span className="font-black text-sm text-brand-charcoal">
                    +50 XP
                  </span>
                </div>
              </div>

              <div className="w-px h-8 bg-brand-slate/20" />

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-600 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-brand-muted font-bold">
                    Daily Streak
                  </span>
                  <span className="font-black text-sm text-brand-charcoal">
                    {streakCount} {streakCount === 1 ? 'Day' : 'Days'} 🔥
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 space-y-2.5"
            >
              {nextLesson && onNextLesson ? (
                <button
                  onClick={() => {
                    onClose();
                    onNextLesson();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-brand-charcoal hover:bg-black text-white font-bold text-sm shadow-md transition-all cursor-pointer group"
                >
                  <span>
                    {lang === 'en' 
                      ? `Continue to Lesson 0${nextLesson.lessonNum}` 
                      : `Agle Sabaq 0${nextLesson.lessonNum} par Jayein`}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : null}

              <div className="grid grid-cols-2 gap-2">
                {onExportNotes && (
                  <button
                    onClick={() => {
                      onClose();
                      onExportNotes();
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-brand-sand/70 border border-brand-slate/20 text-brand-charcoal text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? 'Export Notes' : 'Notes Export'}</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-sand/60 hover:bg-brand-sand border border-brand-slate/15 text-brand-slate hover:text-brand-charcoal text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Keep Exploring' : 'Mawad Dekhein'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}
