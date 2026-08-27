import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Globe, GraduationCap, Briefcase, BookOpen, Rocket, Check, ArrowRight, Flame, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import ClayLogo from './ClayLogo';

const POPULAR_LANGUAGES = [
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'hinglish', name: 'Hinglish', native: 'Hindi + English' },
];

const LEARNER_PROFILES = [
  {
    id: 'student',
    icon: GraduationCap,
    title: 'Student / Young Learner',
    desc: 'Preparing for modern exams, college, or future AI jobs.'
  },
  {
    id: 'professional',
    icon: Briefcase,
    title: 'Working Professional',
    desc: 'Want to understand AI to boost daily productivity without coding.'
  },
  {
    id: 'educator',
    icon: BookOpen,
    title: 'Educator / Teacher',
    desc: 'Looking for intuitive analogies to explain AI to students.'
  },
  {
    id: 'curious',
    icon: Rocket,
    title: 'Curious Beginner',
    desc: 'Curious about ChatGPT and algorithms with zero math.'
  }
];

export default function OnboardingModal() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProfile, setSelectedProfile] = useState<string>('student');
  const [learnerName, setLearnerName] = useState<string>('');

  useEffect(() => {
    try {
      const completed = localStorage.getItem('clay_onboarding_completed');
      if (!completed) {
        // Show after 1.2s delay for pleasant page load experience
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleFinish = () => {
    try {
      localStorage.setItem('clay_onboarding_completed', 'true');
      localStorage.setItem('clay_learner_profile', selectedProfile);
      if (learnerName.trim()) {
        localStorage.setItem('clay_learner_name', learnerName.trim());
      }
      // Initialize daily streak
      const streak = localStorage.getItem('clay_streak_days') || '1';
      localStorage.setItem('clay_streak_days', streak);
      window.dispatchEvent(new CustomEvent('clay_streak_updated', { detail: parseInt(streak, 10) }));
    } catch {}
    setIsOpen(false);
  };

  const handleSkip = () => {
    try {
      localStorage.setItem('clay_onboarding_completed', 'true');
    } catch {}
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
        >
          {/* Close / Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-brand-muted hover:text-brand-charcoal p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer z-10"
            aria-label="Close onboarding"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Progress bar */}
          <div className="w-full bg-black/5 dark:bg-white/5 h-1.5">
            <div 
              className="bg-brand-amber h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-6 sm:p-8">
            {/* Step 1: Language Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 text-brand-amber flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-brand-charcoal">
                      Apni Bhasha Chunein (Choose Language)
                    </h3>
                    <p className="text-xs text-brand-muted">
                      You can change this anytime from the navigation bar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                  {POPULAR_LANGUAGES.map((l) => {
                    const isSelected = lang === l.code;
                    return (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'border-brand-amber bg-brand-amber/10 font-bold text-brand-charcoal ring-2 ring-brand-amber/30'
                            : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] text-brand-slate hover:bg-black/5'
                        }`}
                      >
                        <span className="text-sm font-bold">{l.native}</span>
                        <span className="text-[10px] text-brand-muted">{l.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-brand-amber hover:bg-brand-amber-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Next: Your Goal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Goal Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 text-brand-amber flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-brand-charcoal">
                      What describes you best?
                    </h3>
                    <p className="text-xs text-brand-muted">
                      We'll tailor your analogies and learning path.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-1">
                  {LEARNER_PROFILES.map((p) => {
                    const Icon = p.icon;
                    const isSelected = selectedProfile === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProfile(p.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-brand-amber bg-brand-amber/10 ring-1 ring-brand-amber/40 shadow-xs'
                            : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-brand-amber text-white' : 'bg-black/5 dark:bg-white/5 text-brand-muted'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm font-bold text-brand-charcoal">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-brand-muted">
                            {p.desc}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-brand-amber text-white flex items-center justify-center shrink-0 mt-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-brand-muted hover:text-brand-charcoal cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 bg-brand-amber hover:bg-brand-amber-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Next: Mascot Welcome</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Mascot Welcome & Streak Starter */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-amber via-orange-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center">
                    <ClayLogo size={36} />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-display text-brand-charcoal">
                    You're All Set with Clay! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted max-w-sm mx-auto mt-1">
                    Your 7-day zero-jargon AI learning streak starts today. Explore interactive sandboxes at your own pace.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-brand-amber/25 flex items-center justify-center gap-3">
                  <Flame className="w-6 h-6 text-brand-amber fill-brand-amber animate-bounce" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-brand-charcoal">Day 1 Streak Initialized</div>
                    <div className="text-[11px] text-brand-muted">Come back daily to unlock badges & certificates</div>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full py-3 bg-gradient-to-r from-brand-amber to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  Start Exploring Clayverse AI
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
