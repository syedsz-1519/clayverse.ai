import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Headphones, 
  Gauge, 
  Languages, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import { SECTION_NARRATION_ITEMS, SectionNarrationItem, getNarrationForSection } from '../data/sectionNarrationData';
import ClayLogo from './ClayLogo';

export default function FloatingSectionReaderBar() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentSectionId, setCurrentSectionId] = useState<string>('what-is-ai');
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [totalSentences, setTotalSentences] = useState<number>(5);
  const [currentSentenceText, setCurrentSentenceText] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showFullTranscript, setShowFullTranscript] = useState<boolean>(false);

  const isHyd = lang === 'hyd' || lang === 'te';
  const activeNarration: SectionNarrationItem = getNarrationForSection(currentSectionId);
  const activeSentences = isHyd ? activeNarration.sentencesHyd : activeNarration.sentencesEn;
  const currentSectionIndex = SECTION_NARRATION_ITEMS.findIndex(s => s.id === currentSectionId);

  // Listen to narration state updates
  useEffect(() => {
    const handleNarrationEvent = (e: any) => {
      const detail = e.detail;
      if (!detail) return;

      if (detail.status === 'playing') {
        setIsOpen(true);
        setIsPlaying(true);
        setIsPaused(false);
        if (detail.sectionId) setCurrentSectionId(detail.sectionId);
        if (typeof detail.sentenceIndex === 'number') {
          setCurrentSentenceIdx(detail.sentenceIndex);
        }
        if (typeof detail.totalSentences === 'number') {
          setTotalSentences(detail.totalSentences);
        }
        if (detail.sentenceText) {
          setCurrentSentenceText(detail.sentenceText);
        }
      } else if (detail.status === 'paused') {
        setIsPlaying(true);
        setIsPaused(true);
      } else if (detail.status === 'stopped') {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    window.addEventListener('clay_narration_state_changed', handleNarrationEvent);
    return () => window.removeEventListener('clay_narration_state_changed', handleNarrationEvent);
  }, []);

  const handlePlayPause = () => {
    if (isPlaying && !isPaused) {
      audioEngine.pauseSpeaking();
    } else if (isPlaying && isPaused) {
      audioEngine.resumeSpeaking();
    } else {
      // Start current section
      startReadingSection(currentSectionId);
    }
  };

  const handleStop = () => {
    audioEngine.stopSpeaking();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const startReadingSection = (sectionId: string) => {
    const targetItem = getNarrationForSection(sectionId);
    const sentences = isHyd ? targetItem.sentencesHyd : targetItem.sentencesEn;
    const langCode: 'en' | 'hyd' = isHyd ? 'hyd' : 'en';

    setCurrentSectionId(sectionId);
    setCurrentSentenceIdx(0);
    setTotalSentences(sentences.length);
    setCurrentSentenceText(sentences[0] || '');
    setIsOpen(true);

    audioEngine.speakSectionSentences(
      sectionId,
      sentences,
      langCode,
      (idx) => {
        setCurrentSentenceIdx(idx);
        setCurrentSentenceText(sentences[idx] || '');
      },
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      }
    );
  };

  const handleNextSection = () => {
    const nextIdx = (currentSectionIndex + 1) % SECTION_NARRATION_ITEMS.length;
    const nextSec = SECTION_NARRATION_ITEMS[nextIdx];
    startReadingSection(nextSec.id);
    scrollToSection(nextSec.targetElementId);
  };

  const handlePrevSection = () => {
    const prevIdx = (currentSectionIndex - 1 + SECTION_NARRATION_ITEMS.length) % SECTION_NARRATION_ITEMS.length;
    const prevSec = SECTION_NARRATION_ITEMS[prevIdx];
    startReadingSection(prevSec.id);
    scrollToSection(prevSec.targetElementId);
  };

  const scrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    audioEngine.setSpeechRate(rate);
    // Restart current sentence at new speed if playing
    if (isPlaying && !isPaused) {
      startReadingSection(currentSectionId);
    }
  };

  // If closed or completely stopped and not manually opened, render small launcher if user wants
  if (!isOpen) return null;

  const progressPercent = totalSentences > 0 ? ((currentSentenceIdx + 1) / totalSentences) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl pointer-events-auto"
      >
        <div className="bg-white/95 backdrop-blur-xl border-2 border-brand-slate/20 rounded-3xl shadow-2xl shadow-brand-charcoal/15 overflow-hidden transition-all">
          {/* Top subtle progress bar */}
          <div className="w-full bg-brand-sand/80 h-1.5 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-brand-amber to-amber-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Compact / Minimized Header */}
          <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
            {/* Mascot Avatar + Section Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="relative shrink-0">
                <ClayLogo 
                  size={42} 
                />
                {isPlaying && !isPaused && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-amber"></span>
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber-dark font-bold">
                    {isHyd ? activeNarration.badgeHyd : activeNarration.badgeEn}
                  </span>
                  <span className="text-xs text-brand-charcoal/60 font-mono">
                    Sentence {currentSentenceIdx + 1}/{totalSentences || activeSentences.length}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-brand-charcoal truncate mt-0.5">
                  {isHyd ? activeNarration.titleHyd : activeNarration.titleEn}
                </h4>
              </div>
            </div>

            {/* Quick Playback Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Skip Prev */}
              <button
                onClick={handlePrevSection}
                className="p-2 rounded-xl text-brand-charcoal hover:bg-brand-sand transition-colors cursor-pointer"
                title="Previous section"
                aria-label="Previous section"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Main Play / Pause */}
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-amber to-amber-500 text-white flex items-center justify-center shadow-md shadow-brand-amber/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={isPlaying && !isPaused ? 'Pause' : 'Play'}
                aria-label={isPlaying && !isPaused ? 'Pause narration' : 'Play narration'}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Skip Next */}
              <button
                onClick={handleNextSection}
                className="p-2 rounded-xl text-brand-charcoal hover:bg-brand-sand transition-colors cursor-pointer"
                title="Next section"
                aria-label="Next section"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Stop */}
              <button
                onClick={handleStop}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Stop audio"
                aria-label="Stop audio narration"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>

              {/* Expand / Minimize Toggle */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 rounded-xl text-brand-charcoal/70 hover:bg-brand-sand transition-colors cursor-pointer ml-1"
                title={isMinimized ? 'Expand reader controls' : 'Collapse controls'}
                aria-label={isMinimized ? 'Expand reader controls' : 'Collapse controls'}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  handleStop();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-brand-charcoal/50 hover:bg-brand-sand transition-colors cursor-pointer"
                title="Close narrator"
                aria-label="Close narrator"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expandable Live Sentence & Settings Panel */}
          {!isMinimized && (
            <div className="px-4 pb-4 pt-1 border-t border-brand-slate/10 bg-brand-sand/30">
              {/* Active Sentence Callout */}
              <div className="p-3 rounded-2xl bg-white border border-brand-slate/15 shadow-sm my-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-brand-charcoal/60 mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-brand-amber-dark">
                    <span className="w-2 h-2 rounded-full bg-brand-amber animate-ping"></span>
                    Live Narration Subtitle:
                  </span>
                  <button 
                    onClick={() => scrollToSection(activeNarration.targetElementId)}
                    className="text-brand-amber hover:underline flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <span>Jump to section</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm font-medium text-brand-charcoal leading-relaxed">
                  {currentSentenceText || activeSentences[currentSentenceIdx] || activeNarration.takeawayEn}
                </p>
              </div>

              {/* Settings bar: Speed, Dialect, Jump Menu */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                {/* Dialect Selector */}
                <div className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-brand-charcoal/60" />
                  <span className="text-brand-charcoal/70 font-medium">Voice Language:</span>
                  <button
                    onClick={() => {
                      setLang('en');
                      if (isPlaying) startReadingSection(currentSectionId);
                    }}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      !isHyd ? 'bg-brand-amber text-white shadow-xs' : 'bg-white text-brand-charcoal border border-brand-slate/20'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLang('hyd');
                      if (isPlaying) startReadingSection(currentSectionId);
                    }}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      isHyd ? 'bg-brand-amber text-white shadow-xs' : 'bg-white text-brand-charcoal border border-brand-slate/20'
                    }`}
                  >
                    Hyderabadi
                  </button>
                </div>

                {/* Speed Selector */}
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-brand-charcoal/60" />
                  <span className="text-brand-charcoal/70 font-medium">Speed:</span>
                  {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                        speechRate === rate
                          ? 'bg-brand-charcoal text-white font-bold'
                          : 'bg-white text-brand-charcoal/80 border border-brand-slate/20 hover:bg-brand-sand'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Full Transcript Toggle */}
                <button
                  onClick={() => setShowFullTranscript(!showFullTranscript)}
                  className="flex items-center gap-1 text-brand-charcoal/80 hover:text-brand-amber transition-colors font-medium cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{showFullTranscript ? 'Hide Full Script' : 'View Full Script'}</span>
                </button>
              </div>

              {/* Full Section Transcript Dropdown */}
              {showFullTranscript && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 rounded-2xl bg-white border border-brand-slate/15 max-h-48 overflow-y-auto space-y-2 text-xs"
                >
                  <div className="font-bold text-brand-charcoal mb-1">Full Section Script:</div>
                  {activeSentences.map((sentence, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        // Jump to specific sentence
                        audioEngine.speakSectionSentences(
                          currentSectionId,
                          activeSentences.slice(idx),
                          isHyd ? 'hyd' : 'en',
                          (newIdx) => setCurrentSentenceIdx(idx + newIdx)
                        );
                      }}
                      className={`p-2 rounded-xl cursor-pointer transition-all ${
                        idx === currentSentenceIdx && isPlaying
                          ? 'bg-brand-amber/15 text-brand-amber-dark font-semibold border-l-4 border-brand-amber pl-3'
                          : 'hover:bg-brand-sand/50 text-brand-charcoal/80'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-60 mr-1.5">{idx + 1}.</span>
                      {sentence}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
