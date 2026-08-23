import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Headphones, 
  Search, 
  Sparkles, 
  BookOpen, 
  Layers, 
  X, 
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Bot,
  Sliders,
  RotateCcw,
  Languages,
  CheckCircle2,
  Gauge,
  Info
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import { roadmapSections, Section, Term } from '../data/roadmapTerms';
import { SECTION_NARRATION_ITEMS, SectionNarrationItem } from '../data/sectionNarrationData';
import ClayLogo from './ClayLogo';

interface SectionContent {
  id: string;
  lessonNum?: number;
  titleEn: string;
  titleHyd: string;
  titleTe?: string;
  textEn: string;
  textHyd: string;
  textTe?: string;
  readTime: string;
  sentencesEn: string[];
  sentencesHyd: string[];
  sectionId?: string; // mapped to actual HTML id if applicable
}

type SearchResultItem = 
  | { type: 'section'; section: Section; id: string; title: string; subtitle: string }
  | { type: 'term'; section: Section; term: Term; id: string; title: string; definition: string };

export default function AudioNarrationHub() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'audio' | 'search'>('audio');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSectionId, setPlayingSectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Text-To-Speech (TTS) Master State
  const [isTtsEnabled, setIsTtsEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clay_tts_enabled');
      return saved !== 'false'; // Enabled by default for accessibility
    }
    return true;
  });

  // Speech rate & active sentence state
  const [speechRate, setSpeechRateState] = useState<number>(() => audioEngine.getSpeechRate() || 0.96);
  const [activeSentenceText, setActiveSentenceText] = useState<string>('');
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [totalSentences, setTotalSentences] = useState<number>(0);
  const [selectedTtsVoiceLang, setSelectedTtsVoiceLang] = useState<string>(lang);

  // Play subtle feedback sound
  const playTone = (freq = 440, type: OscillatorType = 'sine', duration = 0.08, vol = 0.05) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio context errors
    }
  };

  // Sync selected voice language when global language changes
  useEffect(() => {
    setSelectedTtsVoiceLang(lang);
  }, [lang]);

  // Toggle TTS enabled
  const handleToggleTts = () => {
    const nextState = !isTtsEnabled;
    setIsTtsEnabled(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clay_tts_enabled', String(nextState));
      window.dispatchEvent(new CustomEvent('clay_tts_toggled', { detail: { enabled: nextState } }));
    }
    if (!nextState && isPlaying) {
      audioEngine.stopSpeaking();
      setIsPlaying(false);
      setPlayingSectionId(null);
    }
    playTone(nextState ? 660 : 330, 'sine', 0.1, 0.06);
  };

  // Change TTS speech rate (speed)
  const handleChangeSpeechRate = (rate: number) => {
    const clampedRate = Math.max(0.5, Math.min(2.0, rate));
    setSpeechRateState(clampedRate);
    audioEngine.setSpeechRate(clampedRate);
    playTone(520, 'triangle', 0.04, 0.03);
  };

  // Listen for narration state changes from audioEngine
  useEffect(() => {
    const handleNarrationEvent = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      if (detail.status === 'playing') {
        setIsPlaying(true);
        if (detail.sectionId) setPlayingSectionId(detail.sectionId);
        if (detail.sentenceText) setActiveSentenceText(detail.sentenceText);
        if (typeof detail.sentenceIndex === 'number') setActiveSentenceIndex(detail.sentenceIndex);
        if (typeof detail.totalSentences === 'number') setTotalSentences(detail.totalSentences);
      } else if (detail.status === 'stopped' || detail.status === 'paused') {
        if (detail.status === 'stopped') {
          setIsPlaying(false);
          setPlayingSectionId(null);
          setActiveSentenceText('');
        } else {
          setIsPlaying(false);
        }
      }
    };

    window.addEventListener('clay_narration_state_changed', handleNarrationEvent);
    return () => window.removeEventListener('clay_narration_state_changed', handleNarrationEvent);
  }, []);

  // Event listener to open narration hub from other components
  useEffect(() => {
    const handleOpenNarration = (e: any) => {
      setIsOpen(true);
      setActiveTab('audio');
      if (e?.detail?.sectionId) {
        const target = sections.find(s => s.id === e.detail.sectionId || s.sectionId === e.detail.sectionId);
        if (target && isTtsEnabled) {
          toggleSectionPlay(target);
        }
      }
    };
    window.addEventListener('clay_open_narration_hub', handleOpenNarration);
    return () => window.removeEventListener('clay_open_narration_hub', handleOpenNarration);
  }, [isTtsEnabled]);

  // Sync state with global speech synthesis status
  useEffect(() => {
    const checkState = setInterval(() => {
      const activeSpeaking = audioEngine.isCurrentlySpeaking();
      setIsPlaying(activeSpeaking);
      if (!activeSpeaking && playingSectionId) {
        setPlayingSectionId(null);
        setActiveSentenceText('');
      }
    }, 500);

    audioEngine.setSpeakStateListener((speaking) => {
      setIsPlaying(speaking);
      if (!speaking) {
        setPlayingSectionId(null);
        setActiveSentenceText('');
      }
    });

    return () => clearInterval(checkState);
  }, [playingSectionId]);

  // Comprehensive Curriculum Sections for Audio Narration
  const sections: SectionContent[] = useMemo(() => {
    const defaultList: SectionContent[] = [
      {
        id: 'all',
        titleEn: 'Full Curriculum Audio Walkthrough',
        titleHyd: 'Mukammal Course ka Audio Guide',
        titleTe: 'పూర్తి కోర్సు ఆడియో గైడ్',
        textEn: "Welcome to Clayverse AI! Let me guide you through the foundations of Artificial Intelligence, Machine Learning, Deep Neural Networks, Generative AI, Transformers, and Retrieval-Augmented Generation.",
        textHyd: "Clayverse AI me aapka khush amdeed hai! Main aapko Artificial Intelligence, Machine Learning, Deep Neural Networks, Generative AI aur RAG ki poori sair asaan zabaan me karaata hoon.",
        textTe: "క్లేవర్స్ AI కి స్వాగతం! కృత్రిమ మేధస్సు, మెషిన్ లెర్నింగ్ మరియు జనరేటివ్ AI గురించి సులభంగా తెలుసుకోండి.",
        readTime: '1.5 min',
        sentencesEn: [
          "Welcome to Clayverse AI, your sensory-friendly guide to demystifying artificial intelligence.",
          "Artificial Intelligence is the broad concept of teaching computer systems to learn from massive amounts of data.",
          "Nested within AI is Machine Learning, which extracts recurring patterns through statistical algorithms.",
          "Deep Learning stacks artificial neural networks inspired by the human brain to understand images, audio, and language.",
          "At the core is Generative AI, synthesizing brand new text, code, and artwork using Large Language Models like Gemini."
        ],
        sentencesHyd: [
          "Clayverse AI me aapka khush amdeed hai, jahan hum AI ko bilkul asaan misalon se samjhate hain.",
          "Artificial Intelligence ka matlab aisi computer machines banana hai jo data dekh kar khud seekhein.",
          "Iske andar Machine Learning baithti hai jo statistical formulas se patterns pehchanti hai.",
          "Deep Learning insani dimaag ki tarah neural networks ki layers chala kar tasveerein aur zabaan samajhti hai.",
          "Aur sabse aage Generative AI hai, jo Gemini jaise models ke zariye naya text aur tasveerein banati hai."
        ]
      }
    ];

    // Map all items from SECTION_NARRATION_ITEMS into rich lesson objects
    SECTION_NARRATION_ITEMS.forEach((item, index) => {
      defaultList.push({
        id: item.id,
        lessonNum: index + 1,
        titleEn: item.titleEn,
        titleHyd: item.titleHyd,
        titleTe: item.titleEn,
        textEn: item.sentencesEn[0] || item.takeawayEn,
        textHyd: item.sentencesHyd[0] || item.takeawayHyd,
        textTe: item.sentencesEn[0] || item.takeawayEn,
        readTime: `~${item.durationSeconds}s`,
        sentencesEn: item.sentencesEn,
        sentencesHyd: item.sentencesHyd,
        sectionId: item.targetElementId
      });
    });

    return defaultList;
  }, []);

  // Search filter logic for the Ask Clay search tab
  const filteredSearchResults = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return [];

    const results: SearchResultItem[] = [];

    roadmapSections.forEach(section => {
      if (section.title.toLowerCase().includes(cleanQuery) || section.subtitle.toLowerCase().includes(cleanQuery) || section.number.includes(cleanQuery)) {
        results.push({
          type: 'section',
          section,
          id: section.id,
          title: section.title,
          subtitle: section.subtitle
        });
      }

      section.terms.forEach(term => {
        if (term.title.toLowerCase().includes(cleanQuery) || term.definition.toLowerCase().includes(cleanQuery)) {
          results.push({
            type: 'term',
            section,
            term,
            id: `term-${term.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            title: term.title,
            definition: term.definition
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  // Toggle play/pause for a section via Text-to-Speech
  const toggleSectionPlay = (section: SectionContent) => {
    // If TTS is disabled, automatically enable it
    if (!isTtsEnabled) {
      setIsTtsEnabled(true);
      localStorage.setItem('clay_tts_enabled', 'true');
    }

    if (playingSectionId === section.id && isPlaying) {
      audioEngine.stopSpeaking();
      setIsPlaying(false);
      setPlayingSectionId(null);
      setActiveSentenceText('');
    } else {
      audioEngine.stopSpeaking();
      const currentLangCode = selectedTtsVoiceLang || lang || 'en';
      const sentences = (currentLangCode === 'hyd' || currentLangCode === 'ur' || currentLangCode === 'hi') 
        ? section.sentencesHyd 
        : section.sentencesEn;

      setPlayingSectionId(section.id);
      setIsPlaying(true);
      setActiveSentenceIndex(0);
      setTotalSentences(sentences.length);
      setActiveSentenceText(sentences[0] || '');

      audioEngine.speakSectionSentences(
        section.id,
        sentences,
        currentLangCode,
        (idx) => {
          setActiveSentenceIndex(idx);
          setActiveSentenceText(sentences[idx] || '');
        },
        () => {
          setIsPlaying(false);
          setPlayingSectionId(null);
          setActiveSentenceText('');
        }
      );
    }
  };

  const handleStopAll = () => {
    audioEngine.stopSpeaking();
    setIsPlaying(false);
    setPlayingSectionId(null);
    setActiveSentenceText('');
  };

  const handleSelectSearchResult = (item: SearchResultItem) => {
    setIsOpen(false);
    window.location.hash = item.id;
    setTimeout(() => {
      const el = document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const panelRef = useRef<HTMLDivElement>(null);

  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;

    const focusables = (Array.from(
      panelRef.current.querySelectorAll(
        'button, input[type="text"], [tabindex="0"]'
      )
    ) as HTMLElement[]).filter(el => {
      return !el.hasAttribute('disabled') && el.offsetParent !== null;
    });

    const activeEl = document.activeElement as HTMLElement;
    const activeIdx = focusables.indexOf(activeEl);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = activeIdx + 1 < focusables.length ? activeIdx + 1 : 0;
      focusables[nextIdx]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = activeIdx - 1 >= 0 ? activeIdx - 1 : focusables.length - 1;
      focusables[prevIdx]?.focus();
    }
  };

  // Open the search via custom global event trigger
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsOpen(true);
      setActiveTab('search');
    };
    window.addEventListener('clay_open_search', handleOpenSearch);
    return () => window.removeEventListener('clay_open_search', handleOpenSearch);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Consolidated Clay Helper Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            onKeyDown={handlePanelKeyDown}
            tabIndex={0}
            aria-label={lang === 'en' ? "Clay's Assistant Hub, use arrow keys to navigate options" : "کِلے اسسٹنٹ ہب، اختیارات نیویگیٹ کرنے کے لیے تیر کے نشان والے بٹنوں کا استعمال کریں"}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`glass-panel rounded-3xl p-5 border-brand-amber/25 shadow-2xl mb-4.5 flex flex-col gap-4 relative overflow-hidden border-2 bg-white/95 backdrop-blur-xl focus:ring-2 focus:ring-brand-amber/40 focus:outline-none transition-all duration-300 ${
              activeTab === 'ai' ? 'w-[92vw] sm:w-[480px] md:w-[560px] max-h-[82vh]' : 'w-85 sm:w-105'
            }`}
          >
            {/* Ambient clay texture overlay */}
            <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            {/* Header with Close and Identity */}
            <div className="flex items-center justify-between border-b border-brand-slate/10 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <ClayLogo size={32} />
                <div>
                  <h3 className="font-display text-sm font-black text-brand-charcoal flex items-center gap-1.5 uppercase tracking-wide">
                    {lang === 'en' ? "Audio Narration Hub" : "Audio Narration Hub"}
                    {isPlaying && <span className="inline-block w-2 h-2 rounded-full bg-brand-amber animate-ping" />}
                  </h3>
                  <p className="text-[10px] text-brand-slate">
                    {lang === 'en' ? "Text-to-Speech Voice & Quick Navigator" : "Awaaz me sabaq suno aur seekho"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal transition-colors cursor-pointer"
                title="Close Hub"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modern 2-Way Tab Control */}
            <div className="flex bg-brand-sand/50 p-1 rounded-2xl border border-brand-slate/10 shrink-0 gap-1">
              <button
                data-tab="audio"
                onClick={() => setActiveTab('audio')}
                className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 focus:outline-none ${
                  activeTab === 'audio'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-brand-slate hover:text-brand-charcoal'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-brand-amber" />
                <span className="truncate">{lang === 'en' ? "Read Aloud (TTS)" : "Awaaz (TTS)"}</span>
              </button>
              <button
                data-tab="search"
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-1.5 focus:outline-none ${
                  activeTab === 'search'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-brand-slate hover:text-brand-charcoal'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-brand-amber" />
                <span className="truncate">{lang === 'en' ? "Search & Index" : "Dhoondo"}</span>
              </button>
            </div>

            {/* TAB CONTENT: 1. TEXT-TO-SPEECH (TTS) NARRATION HUB */}
            {activeTab === 'audio' && (
              <div className="flex flex-col gap-3.5 max-h-[390px] overflow-y-auto pr-1 scrollbar-thin">
                
                {/* 1. TEXT-TO-SPEECH MASTER TOGGLE CARD */}
                <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                  isTtsEnabled
                    ? "bg-gradient-to-br from-brand-amber/10 via-brand-sand/30 to-brand-sand/60 border-brand-amber/35 shadow-xs"
                    : "bg-brand-sand/30 border-brand-slate/15 opacity-90"
                }`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isTtsEnabled 
                          ? "bg-brand-amber text-white border-brand-amber/30 shadow-xs" 
                          : "bg-brand-sand text-brand-slate border-brand-slate/20"
                      }`}>
                        {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-bold text-xs text-brand-charcoal">
                            {lang === 'en' ? "Text-to-Speech Narration" : "Text-to-Speech (Likhai Suno)"}
                          </h4>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                            isTtsEnabled
                              ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                              : "bg-brand-slate/10 text-brand-slate border-brand-slate/20"
                          }`}>
                            {isTtsEnabled ? "ACTIVE" : "MUTED"}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-slate leading-tight truncate mt-0.5">
                          {lang === 'en'
                            ? "Reads lessons aloud with clear pronunciation for non-native learners."
                            : "Ghair-angrezi seekhne walon ke liye sabaq aawaz me parha jata hai."}
                        </p>
                      </div>
                    </div>

                    {/* Prominent Master Toggle Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isTtsEnabled}
                      onClick={handleToggleTts}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-amber/50 ${
                        isTtsEnabled ? 'bg-brand-amber' : 'bg-brand-slate/30'
                      }`}
                      title={isTtsEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-xs transition-transform ${
                          isTtsEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Accessible Voice Pacing Slider & Dialect Controls */}
                  {isTtsEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-brand-amber/20 space-y-2.5 text-[10px]"
                    >
                      {/* Interactive Continuous Speed Control Slider */}
                      <div className="space-y-1.5 bg-white/70 p-2.5 rounded-xl border border-brand-slate/10 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-brand-charcoal font-bold flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5 text-brand-amber" />
                            {lang === 'en' ? "Playback Speed Rate" : "Awaaz ki Raftaar"}:
                          </span>
                          <span className="font-mono font-black text-brand-amber bg-brand-sand/60 border border-brand-amber/20 px-2 py-0.5 rounded-md shadow-2xs">
                            {speechRate.toFixed(2)}x {speechRate <= 0.8 ? '(Slow)' : speechRate >= 1.3 ? '(Fast)' : '(Normal)'}
                          </span>
                        </div>
                        
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.05"
                          value={speechRate}
                          onChange={(e) => handleChangeSpeechRate(parseFloat(e.target.value))}
                          className="w-full h-2 bg-brand-slate/20 rounded-lg appearance-none cursor-pointer accent-brand-amber"
                          aria-label="Speech playback speed slider"
                        />
                        
                        <div className="flex justify-between text-[8px] font-mono text-brand-muted px-0.5">
                          <span>0.5x Slow</span>
                          <span>1.0x Normal</span>
                          <span>1.5x Brisk</span>
                          <span>2.0x Fast</span>
                        </div>

                        {/* Quick Speed Preset Chips */}
                        <div className="flex items-center gap-1 pt-1">
                          <span className="font-mono text-brand-muted text-[9px] mr-1">Presets:</span>
                          {[
                            { label: '0.75x', val: 0.75 },
                            { label: '0.95x', val: 0.95 },
                            { label: '1.25x', val: 1.25 },
                            { label: '1.50x', val: 1.50 }
                          ].map((spd) => (
                            <button
                              key={spd.val}
                              onClick={() => handleChangeSpeechRate(spd.val)}
                              className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold transition-all cursor-pointer ${
                                Math.abs(speechRate - spd.val) < 0.04
                                  ? 'bg-brand-charcoal text-white'
                                  : 'bg-white hover:bg-brand-sand text-brand-slate border border-brand-slate/15'
                              }`}
                            >
                              {spd.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dialect Voice Selector */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span className="font-mono text-brand-slate font-bold flex items-center gap-1">
                          <Languages className="w-3 h-3 text-brand-amber" />
                          {lang === 'en' ? "Audio Dialect" : "Sabaq ki Zaban"}:
                        </span>
                        <select
                          value={selectedTtsVoiceLang}
                          onChange={(e) => {
                            setSelectedTtsVoiceLang(e.target.value);
                            playTone(480, 'sine', 0.05, 0.04);
                          }}
                          className="bg-white text-brand-charcoal font-bold text-[10px] rounded-lg border border-brand-slate/20 px-2 py-1 outline-none cursor-pointer"
                        >
                          <option value="en">English (US/UK)</option>
                          <option value="hyd">Urdu / Hyderabadi</option>
                          <option value="hi">Hindi (हिंदी)</option>
                          <option value="te">Telugu (తెలుగు)</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 2. ACTIVE LIVE READING CAPTIONS STRIP (When TTS is speaking) */}
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-2xl bg-brand-charcoal text-white shadow-md border border-brand-amber/40 space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex gap-0.5 items-end h-3 shrink-0">
                          <span className="w-0.5 h-3 bg-brand-amber rounded-full animate-pulse" />
                          <span className="w-0.5 h-2 bg-brand-amber rounded-full animate-pulse delay-75" />
                          <span className="w-0.5 h-3.5 bg-brand-amber rounded-full animate-pulse delay-150" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-brand-amber uppercase tracking-wider truncate">
                          {lang === 'en' ? "Reading Aloud Sentence" : "Jumla Parha Ja Raha Hai"} ({activeSentenceIndex + 1}/{totalSentences || 1})
                        </span>
                      </div>
                      <button
                        onClick={handleStopAll}
                        className="px-2 py-0.5 rounded-md bg-white/15 hover:bg-red-500 text-white font-mono text-[9px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        title="Stop Narration"
                      >
                        <Square className="w-2.5 h-2.5 fill-current" />
                        <span>Stop</span>
                      </button>
                    </div>

                    <p className="text-xs text-white/95 font-medium leading-relaxed bg-white/10 p-2.5 rounded-xl border border-white/10">
                      "{activeSentenceText}"
                    </p>

                    {totalSentences > 1 && (
                      <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-brand-amber h-full transition-all duration-300"
                          style={{ width: `${Math.min(100, ((activeSentenceIndex + 1) / totalSentences) * 100)}%` }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. CURRICULUM LESSON AUDIO LIST */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-brand-muted uppercase tracking-wider">
                      {lang === 'en' ? "Lesson Narration Library" : "Sabaq ki Audio Library"}
                    </span>
                    <span className="text-[9px] font-mono text-brand-slate">
                      {sections.length} {lang === 'en' ? "Narrated Modules" : "Audio Sabaq"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sections.map((section) => {
                      const isCurrentPlaying = playingSectionId === section.id && isPlaying;
                      return (
                        <div
                          key={section.id}
                          className={`p-3 rounded-2xl border transition-all text-left flex flex-col gap-2 ${
                            isCurrentPlaying
                              ? "bg-brand-amber/10 border-brand-amber/40 shadow-xs"
                              : "bg-white hover:bg-brand-sand/30 border-brand-slate/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border transition-all font-mono font-bold text-[10px] ${
                                isCurrentPlaying
                                  ? "bg-brand-amber text-white border-brand-amber/20"
                                  : "bg-brand-sand/60 text-brand-slate border-brand-slate/10"
                              }`}>
                                {section.lessonNum ? `0${section.lessonNum}` : "ALL"}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-black text-brand-charcoal truncate">
                                  {lang === 'en' ? section.titleEn : (lang === 'te' && section.titleTe ? section.titleTe : section.titleHyd)}
                                </h4>
                                <span className="text-[9px] font-mono text-brand-amber-dark font-bold block">
                                  ⏱️ {section.readTime}
                                </span>
                              </div>
                            </div>

                            {/* Play / Pause Toggle Button */}
                            <button
                              onClick={() => toggleSectionPlay(section)}
                              className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-bold ${
                                isCurrentPlaying
                                  ? "bg-brand-amber text-white shadow-xs"
                                  : "bg-brand-sand/60 hover:bg-brand-amber/15 text-brand-charcoal border border-brand-slate/10 hover:border-brand-amber/30"
                              }`}
                              title={isCurrentPlaying ? "Pause Audio" : "Read this lesson aloud"}
                            >
                              {isCurrentPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-[10px] font-mono">Pause</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-[10px] font-mono">Read Aloud</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-[10px] text-brand-slate line-clamp-2 leading-relaxed bg-brand-sand/20 p-2 rounded-xl border border-brand-slate/5">
                            {lang === 'en' ? section.textEn : (lang === 'te' && section.textTe ? section.textTe : section.textHyd)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: 2. ASK CLAY SEARCH BOX */}
            {activeTab === 'search' && (
              <div className="flex flex-col gap-3.5">
                
                {/* Search Input bar */}
                <div className="relative flex items-center bg-brand-sand/30 border border-brand-slate/10 rounded-2xl p-2.5">
                  <Search className="w-4 h-4 text-brand-slate shrink-0 ml-1" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'en'
                        ? "Search AI lessons & glossary..."
                        : "Sabaq aur glossary dhoondo..."
                    }
                    className="w-full bg-transparent text-xs font-bold text-brand-charcoal outline-none placeholder:text-brand-slate/40 border-0 p-0 ml-2 focus:ring-0"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full hover:bg-brand-sand transition-colors text-brand-slate/60 hover:text-brand-charcoal cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filtered Search Results list */}
                <div className="max-h-[250px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
                  {searchQuery.trim() === '' ? (
                    <div className="py-8 text-center text-brand-muted flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 text-brand-slate/30 animate-pulse" />
                      <p className="text-xs font-bold">
                        {lang === 'en' ? "Type to search all interactive lessons!" : "Lafz likh kar sabak mein dhoondo!"}
                      </p>
                      <span className="text-[10px] opacity-70">
                        {lang === 'en' ? "Try: RAG, Transformer, or Neural" : "Jaise ke: RAG, Neural network"}
                      </span>
                    </div>
                  ) : filteredSearchResults.length === 0 ? (
                    <div className="py-8 text-center text-brand-muted">
                      <p className="text-xs font-bold">
                        {lang === 'en' ? "No matching concepts found." : "Kuch nahi mila yaaron!"}
                      </p>
                    </div>
                  ) : (
                    filteredSearchResults.map((item, idx) => (
                      <button
                        key={item.id + '-' + idx}
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full p-3 rounded-2xl border border-brand-slate/5 bg-white hover:bg-brand-sand/35 text-left transition-all flex gap-3 items-start cursor-pointer group focus:outline-none focus:ring-2 focus:ring-brand-amber/50"
                      >
                        <div className="w-7 h-7 rounded-lg bg-brand-amber/10 border border-brand-amber/15 text-brand-amber flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                          {item.type === 'section' ? <Layers className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[8px] font-mono font-black text-brand-amber uppercase tracking-wider block">
                            {item.type === 'section' ? (lang === 'en' ? "Lesson Content" : "Sabak") : (lang === 'en' ? "Glossary Term" : "Mushkil Lafz")}
                          </span>
                          <h4 className="text-xs font-black text-brand-charcoal truncate mt-0.5">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-brand-slate line-clamp-2 mt-1 leading-relaxed">
                            {item.type === 'section' ? item.subtitle : item.definition}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-brand-slate shrink-0 self-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Accessibility Tip Footer */}
            <div className="p-3 bg-brand-sand/40 border border-brand-slate/10 rounded-2xl text-[10px] text-brand-muted shrink-0 flex items-center gap-2">
              <span className="text-sm">🎧</span>
              <p className="leading-snug">
                {lang === 'en' 
                  ? "Accessibility Tip: You can adjust the reading pace (0.8x) to easily absorb technical vocabulary." 
                  : "Asani ke liye: Agar alfaz tez lagein toh 0.8x Speed chun kar aaram se sunein."}
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Trigger Button */}
      <div className="relative flex items-center justify-end">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08, rotate: isOpen ? -90 : -4 }}
          whileTap={{ scale: 0.95 }}
          className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer relative group pointer-events-auto border-2 ${
            isOpen || isPlaying
              ? "bg-[#FDFBF7] border-brand-amber text-brand-amber shadow-brand-amber/25"
              : "bg-[#FDFBF7] hover:bg-[#F6F2EA] border-brand-amber/30 text-brand-charcoal"
          }`}
          title={lang === 'en' ? "Clay's Audio & AI Hub" : "Clay se Poochho aur Suno"}
        >
          {/* Main Logo */}
          <div className="group-hover:scale-110 transition-transform duration-300">
            <ClayLogo size={36} />
          </div>

          {/* Sparkly Status indicator badge */}
          <span className={`absolute -top-1 -right-1 p-0.5 rounded-full border border-white shadow-sm text-white ${
            isPlaying ? "bg-brand-amber animate-pulse" : "bg-brand-amber"
          }`}>
            {isTtsEnabled ? <Volume2 className="w-3 h-3 stroke-[2.5]" /> : <HelpCircle className="w-3 h-3 stroke-[2.5]" />}
          </span>

          {/* Glowing pulse indicator when reading */}
          {isPlaying && (
            <span className="absolute -inset-1.5 rounded-full border-2 border-brand-amber opacity-40 animate-ping pointer-events-none" />
          )}
        </motion.button>
      </div>

    </div>
  );
}
