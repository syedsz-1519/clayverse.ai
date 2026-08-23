import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Sparkles, 
  ChevronRight, 
  RotateCw, 
  X, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  Volume2,
  VolumeX,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { AI_TRIVIA_DATABASE, AITriviaItem, getTriviaForSection } from '../data/didYouKnowData';
import { audioEngine } from '../lib/audioEngine';

interface DidYouKnowNotificationProps {
  currentView?: 'guide' | 'interview' | 'dashboard';
}

export default function DidYouKnowNotification({ currentView = 'guide' }: DidYouKnowNotificationProps) {
  const { lang } = useLanguage();
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Available facts for currently active section
  const currentPool = getTriviaForSection(
    currentView === 'interview' ? 'interview' : 
    currentView === 'dashboard' ? 'interview' : 
    activeSectionId
  );

  const activeTrivia: AITriviaItem = currentPool[currentTriviaIndex % currentPool.length] || AI_TRIVIA_DATABASE[0];

  // 1. Scroll Position Observer to detect current section in view
  useEffect(() => {
    if (currentView !== 'guide') {
      setActiveSectionId('interview');
      return;
    }

    const sectionIds = [
      'hero',
      'what-is-ai',
      'family-tree',
      'generative-ai',
      'prompting-rag',
      'tools',
      'deeper',
      'flashcards',
      'classroom',
      'arena'
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const midpoint = scrollY + windowHeight * 0.4;

      let foundSection = 'hero';

      for (const secId of sectionIds) {
        const el = document.getElementById(secId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (midpoint >= top && midpoint <= top + height) {
            foundSection = secId;
            break;
          }
        }
      }

      if (foundSection !== activeSectionId) {
        setActiveSectionId(foundSection);
        setCurrentTriviaIndex(0);
        setProgress(0);
        if (soundEnabled && !isDismissed) {
          // Play a very subtle ambient pop on section change
          audioEngine.playPop();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSectionId, currentView, soundEnabled, isDismissed]);

  // 2. Auto-cycle timer with pause on hover (14 seconds)
  useEffect(() => {
    if (isMinimized || isDismissed || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentTriviaIndex((c) => (c + 1) % currentPool.length);
          return 0;
        }
        return prev + 1.25; // updates every 150ms -> ~12.5 seconds total
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isMinimized, isDismissed, isHovered, currentPool.length]);

  const handleNextFact = () => {
    setCurrentTriviaIndex((prev) => (prev + 1) % currentPool.length);
    setProgress(0);
    if (soundEnabled) audioEngine.playClick();
  };

  const handleCopyFact = () => {
    const textToCopy = `${activeTrivia.topic} (${activeTrivia.badge}): ${activeTrivia.fact[lang as 'en' | 'hyd' | 'te'] || activeTrivia.fact.en}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (soundEnabled) audioEngine.playChime();
    setTimeout(() => setCopied(false), 2000);
  };

  // Section title mapping for user friendly display
  const getSectionTitle = (id: string) => {
    switch (id) {
      case 'hero': return 'AI Fundamentals';
      case 'what-is-ai': return 'Core Concept';
      case 'family-tree': return 'Neural Networks & Deep Learning';
      case 'generative-ai': return 'Transformers & LLMs';
      case 'prompting-rag': return 'Prompting & RAG Architecture';
      case 'tools': return 'AI Engineering Tools';
      case 'deeper': return 'Ethics & Future Horizons';
      case 'flashcards': return 'Active Recall Labs';
      case 'classroom': return 'Classroom Hub';
      case 'arena': return 'AI Battleground';
      case 'interview': return 'AI Mock Interview';
      default: return 'AI Knowledge';
    }
  };

  if (isDismissed) {
    // Small floating trigger to reopen anytime
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          setIsDismissed(false);
          setIsMinimized(false);
          if (soundEnabled) audioEngine.playPop();
        }}
        className="fixed bottom-6 left-6 z-40 p-3 bg-brand-charcoal text-white rounded-full shadow-2xl border border-brand-amber/40 flex items-center gap-2 cursor-pointer hover:bg-slate-800 transition-all group"
        title="Open AI Trivia"
        aria-label="Reopen Did You Know AI trivia"
      >
        <Lightbulb className="w-5 h-5 text-brand-amber group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold font-display pr-1 hidden sm:inline">Did You Know?</span>
      </motion.button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 left-6 z-40 select-none max-w-[calc(100vw-2rem)] sm:max-w-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized Compact Pill Bar */
          <motion.div
            key="minimized-pill"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="flex items-center gap-2 p-2 px-4 bg-white/95 backdrop-blur-md border border-brand-amber/35 rounded-full shadow-2xl shadow-brand-slate/15 hover:border-brand-amber/70 transition-all cursor-pointer group"
            onClick={() => {
              setIsMinimized(false);
              if (soundEnabled) audioEngine.playLoFiChord();
            }}
          >
            <div className="w-6 h-6 rounded-full bg-brand-amber/20 flex items-center justify-center text-brand-amber">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono font-bold uppercase text-brand-amber tracking-wider">
                {lang === 'en' ? "Did You Know?" : lang === 'te' ? "మీకు తెలుసా?" : "Kya aap jaante hain?"}
              </span>
              <span className="text-xs font-display font-bold text-brand-charcoal truncate max-w-[180px]">
                {activeTrivia.topic}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-brand-slate group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        ) : (
          /* Full Contextual Floating Notification Card */
          <motion.div
            key="full-notification-card"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="w-[90vw] max-w-[360px] sm:max-w-[390px] bg-white/95 backdrop-blur-xl border border-brand-amber/30 rounded-3xl p-5 shadow-2xl shadow-brand-slate/20 text-left relative overflow-hidden"
          >
            {/* Top Auto-timer subtle Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-sand/50">
              <motion.div 
                className="h-full bg-gradient-to-r from-brand-amber to-orange-500"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Header / Pill Badge & Controls */}
            <div className="flex items-center justify-between gap-2 mb-3 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="p-1.5 rounded-xl bg-amber-500/15 text-brand-amber">
                  <Lightbulb className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-extrabold text-[11px] uppercase tracking-wider text-brand-charcoal">
                      {lang === 'en' ? "Did You Know?" : lang === 'te' ? "మీకు తెలుసా?" : "Kya aap jaante hain?"}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-amber/15 text-brand-amber-dark border border-brand-amber/20">
                      {activeTrivia.badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-muted block truncate max-w-[190px]">
                    📍 {getSectionTitle(activeSectionId)}
                  </span>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1 text-brand-slate">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg hover:bg-brand-sand/60 transition-colors cursor-pointer"
                  title={soundEnabled ? "Mute audio cues" : "Unmute audio cues"}
                  aria-label="Toggle trivia sound"
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-brand-slate" /> : <VolumeX className="w-3.5 h-3.5 text-brand-muted" />}
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg hover:bg-brand-sand/60 transition-colors cursor-pointer"
                  title="Minimize trivia"
                  aria-label="Minimize trivia card"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-brand-slate" />
                </button>
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  title="Dismiss trivia"
                  aria-label="Dismiss trivia notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Trivia Body */}
            <div className="space-y-2 relative">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display font-bold text-sm text-brand-charcoal leading-snug">
                  {activeTrivia.topic}
                </h4>
                {activeTrivia.statHighlight && (
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-brand-sand rounded-lg border border-brand-slate/15 text-brand-charcoal shrink-0">
                    {activeTrivia.statHighlight}
                  </span>
                )}
              </div>

              <p className="text-xs text-brand-slate leading-relaxed font-sans text-pretty">
                {activeTrivia.fact[lang as 'en' | 'hyd' | 'te'] || activeTrivia.fact.en}
              </p>

              {activeTrivia.readMoreTip && (
                <div className="p-2.5 rounded-xl bg-brand-sand/30 border border-brand-slate/10 text-[11px] text-brand-charcoal/80 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-amber shrink-0 mt-0.5" />
                  <span className="leading-snug italic">
                    {activeTrivia.readMoreTip[lang as 'en' | 'hyd' | 'te'] || activeTrivia.readMoreTip.en}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="mt-3.5 pt-2.5 border-t border-brand-slate/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyFact}
                  className="px-2.5 py-1 rounded-xl bg-brand-sand/40 hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal text-[10.5px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Copy trivia to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <span className="text-[10px] font-mono text-brand-muted">
                  {((currentTriviaIndex % currentPool.length) + 1)} / {currentPool.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleNextFact}
                  className="px-3 py-1 rounded-xl bg-brand-charcoal hover:bg-slate-800 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                >
                  <RotateCw className="w-3 h-3 text-brand-amber" />
                  <span>{lang === 'en' ? "Next Trivia" : lang === 'te' ? "తదుపరి వాస్తవం" : "Agla Fact"}</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
