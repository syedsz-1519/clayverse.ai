import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  BookOpen, 
  ArrowUp, 
  Menu, 
  X, 
  Music, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Settings, 
  Search, 
  User, 
  Palette, 
  Languages, 
  Bookmark, 
  BookmarkCheck, 
  ListOrdered, 
  ChevronDown, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  Layers,
  CheckCircle2,
  Video,
  LayoutDashboard,
  GraduationCap,
  Flame,
  Heart,
  School,
  Info
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import ClayLogo from './ClayLogo';
import { useLanguage, type Language } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';
import { roadmapSections } from '../data/roadmapTerms';
import AuthModal from './AuthModal';
import SearchModal from './SearchModal';
import AboutClayverseModal from './AboutClayverseModal';

interface BookmarkData {
  scrollY: number;
  sectionId: string;
  sectionTitle: string;
  timestamp: number;
}

const GUIDE_SECTIONS = [
  { id: 'hero', num: 1, titleEn: '1. Overview', titleHyd: '1. Taaruf', shortEn: 'Intro' },
  { id: 'what-is-ai', num: 2, titleEn: '2. What is AI?', titleHyd: '2. AI Kya Hai?', shortEn: 'Basics' },
  { id: 'family-tree', num: 3, titleEn: '3. AI Family Tree', titleHyd: '3. AI Shijra', shortEn: 'Family Tree' },
  { id: 'prompting-rag', num: 4, titleEn: '4. Prompting & RAG', titleHyd: '4. RAG Nizaam', shortEn: 'RAG' },
  { id: 'ai-tools-directory', num: 5, titleEn: '5. AI Tools Directory', titleHyd: '5. AI Tools', shortEn: 'Tools' },
  { id: 'deeper', num: 6, titleEn: '6. 12 Core Concepts', titleHyd: '6. 12 Sabaq', shortEn: '12 Concepts' },
  { id: 'flashcards', num: 7, titleEn: '7. AI Flashcards', titleHyd: '7. AI Flashcards', shortEn: 'Flashcards' },
  { id: 'classroom-hub', num: 8, titleEn: '8. Classroom Hub', titleHyd: '8. Classroom', shortEn: 'Classroom' },
  { id: 'ai-arena', num: 9, titleEn: '9. AI Arena & Quiz', titleHyd: '9. Arena Quiz', shortEn: 'Quiz' },
];

export default function FloatingNav() {
  const { lang, setLang, t } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [readingTime, setReadingTime] = useState(6); // Default fallback
  const [wordCount, setWordCount] = useState(1200); // Default fallback
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const cached = localStorage.getItem('clay_quiz_streak_count');
      if (cached) {
        const parsed = parseInt(cached, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {}
    return 1;
  });

  useEffect(() => {
    const handleStreakUpdate = () => {
      try {
        const cached = localStorage.getItem('clay_quiz_streak_count');
        if (cached) {
          const parsed = parseInt(cached, 10);
          if (!isNaN(parsed) && parsed > 0) setStreakCount(parsed);
        }
      } catch {}
    };

    window.addEventListener('storage', handleStreakUpdate);
    window.addEventListener('clay_streak_updated' as any, handleStreakUpdate);
    return () => {
      window.removeEventListener('storage', handleStreakUpdate);
      window.removeEventListener('clay_streak_updated' as any, handleStreakUpdate);
    };
  }, []);
  
  // LocalStorage scroll position bookmark system
  const [savedBookmark, setSavedBookmark] = useState<BookmarkData | null>(null);
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  // Load bookmark on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('clay_scroll_bookmark');
      if (raw) {
        const parsed: BookmarkData = JSON.parse(raw);
        setSavedBookmark(parsed);
        // If bookmark is deeper down and user just opened the page
        if (parsed.scrollY > 300 && window.scrollY < 200) {
          setShowResumeBanner(true);
        }
      }
    } catch (e) {
      console.error('Error loading bookmark from localStorage', e);
    }
  }, []);

  // Close explore dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setIsExploreOpen(false);
      }
    };
    if (isExploreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExploreOpen]);

  // Save current scroll position to localStorage
  const handleSaveBookmark = () => {
    const currentScrollY = window.scrollY;
    let sectionTitle = 'Overview & Hero';
    if (activeSection === 'what-is-ai') sectionTitle = '1. What is AI?';
    else if (activeSection === 'family-tree') sectionTitle = '2. The AI Family Tree';
    else if (activeSection === 'prompting-rag') sectionTitle = '3. Prompting & RAG';
    else if (activeSection === 'ai-tools-directory') sectionTitle = '4. AI Tools Directory';
    else if (activeSection === 'deeper') sectionTitle = '5. 12 Core Concepts';
    else if (activeSection === 'classroom-hub') sectionTitle = '6. Classroom Hub';
    else if (activeSection === 'ai-arena') sectionTitle = '7. AI Arena & Quiz';

    const newBookmark: BookmarkData = {
      scrollY: Math.round(currentScrollY),
      sectionId: activeSection,
      sectionTitle,
      timestamp: Date.now(),
    };

    localStorage.setItem('clay_scroll_bookmark', JSON.stringify(newBookmark));
    setSavedBookmark(newBookmark);
    setShowResumeBanner(false);
    
    // Show toast
    setBookmarkToast(lang === 'en' ? `Bookmark saved at ${sectionTitle}!` : `Bookmark save ho gaya: ${sectionTitle}!`);
    setTimeout(() => setBookmarkToast(null), 3000);
  };

  // Jump to saved bookmark
  const handleJumpToBookmark = () => {
    if (!savedBookmark) return;
    window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'guide' }));
    setTimeout(() => {
      window.scrollTo({
        top: savedBookmark.scrollY,
        behavior: 'smooth'
      });
    }, 100);
    setShowResumeBanner(false);
    setIsExploreOpen(false);
    setIsMenuOpen(false);
    setBookmarkToast(lang === 'en' ? 'Resumed where you left off!' : 'Wapas wahi pahunch gaye!');
    setTimeout(() => setBookmarkToast(null), 2500);
  };

  // Clear bookmark
  const handleClearBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('clay_scroll_bookmark');
    setSavedBookmark(null);
    setShowResumeBanner(false);
    setBookmarkToast(lang === 'en' ? 'Bookmark cleared' : 'Bookmark hata diya gaya');
    setTimeout(() => setBookmarkToast(null), 2000);
  };

  useEffect(() => {
    const handleGlobalSearchKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    const handleOpenSearchEvent = () => {
      setIsSearchOpen(true);
    };
    window.addEventListener('keydown', handleGlobalSearchKey);
    window.addEventListener('clay_open_search', handleOpenSearchEvent);
    return () => {
      window.removeEventListener('keydown', handleGlobalSearchKey);
      window.removeEventListener('clay_open_search', handleOpenSearchEvent);
    };
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('clay_user_profile');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('clay_auth_state_changed', checkUser);
    return () => window.removeEventListener('clay_auth_state_changed', checkUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }

      // Track both main sections and the 12 glossary sub-sections
      const mainSections = ['hero', 'what-is-ai', 'family-tree', 'prompting-rag', 'ai-tools-directory', 'deeper', 'flashcards', 'classroom-hub', 'ai-arena'];
      const glossarySections = ['section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6', 'section-7', 'section-8', 'section-9', 'section-10', 'section-11', 'section-12'];

      let detectedActiveSection = 'hero';
      let detectedHash = '';

      // Check main sections first
      for (const sectionId of mainSections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            detectedActiveSection = sectionId;
            detectedHash = sectionId === 'hero' ? '' : sectionId;
            break;
          }
        }
      }

      // If active section is deeper, check if we are scrolling through any of the 12 glossary sections
      if (detectedActiveSection === 'deeper') {
        for (const secId of glossarySections) {
          const el = document.getElementById(secId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 250 && rect.bottom >= 250) {
              detectedHash = secId;
              break;
            }
          }
        }
      }

      setActiveSection(detectedActiveSection);

      // Silently sync URL hash with the current viewport location (without jump-triggering)
      const currentHash = window.location.hash;
      const expectedHash = detectedHash ? `#${detectedHash}` : '';
      if (currentHash !== expectedHash) {
        window.history.replaceState(null, '', expectedHash || window.location.pathname);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAmbient = () => {
    if (isAmbientOn) {
      audioEngine.stopAmbientLooper();
      setIsAmbientOn(false);
    } else {
      audioEngine.startAmbientLooper();
      setIsAmbientOn(true);
    }
  };

  useEffect(() => {
    const calculateWordCount = () => {
      const mainEl = document.querySelector('main');
      if (mainEl) {
        const text = mainEl.innerText || mainEl.textContent || '';
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        if (words > 100) {
          setWordCount(words);
          // Assume average reading speed of 200 words per minute
          setReadingTime(Math.ceil(words / 200));
        }
      }
    };

    // Calculate word count immediately on mount
    calculateWordCount();

    // Re-run after a 500ms delay to capture complete component rendering
    const timer = setTimeout(calculateWordCount, 500);

    // Watch for dynamic DOM changes inside <main> to keep word count perfectly precise
    const mainEl = document.querySelector('main');
    let observer: MutationObserver | null = null;
    if (mainEl) {
      observer = new MutationObserver(() => {
        calculateWordCount();
      });
      observer.observe(mainEl, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'guide' }));
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        const newHash = id === 'hero' ? '' : `#${id}`;
        window.history.pushState(null, '', newHash || window.location.pathname);
      }
    }, 50);
    setIsMenuOpen(false);
    setIsExploreOpen(false);
  };

  const currentSectionObj = GUIDE_SECTIONS.find(s => s.id === activeSection) || GUIDE_SECTIONS[0];
  const currentSectionNum = currentSectionObj.num;
  const totalSections = GUIDE_SECTIONS.length;
  const isGuideComplete = scrollProgress >= 96;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 pt-[4.5px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Brand Name & Reading Progress Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Brand Name */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2 cursor-pointer font-display text-base sm:text-lg font-extrabold text-brand-charcoal hover:text-brand-amber transition-colors shrink-0"
          >
            <ClayLogo size={30} />
            <span className="tracking-tight hidden xs:inline font-black">CLAYVERSE <span className="text-brand-amber font-black">AI</span></span>
          </button>

          {/* Progress Indicator Pill */}
          <button
            onClick={() => setIsExploreOpen(!isExploreOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer select-none shadow-xs ${
              isGuideComplete
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white/90 hover:bg-brand-sand text-brand-charcoal border-brand-amber/30'
            }`}
            title="Click to open Explore & Table of Contents"
          >
            <div className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0">
              {isGuideComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <svg className="w-3.5 h-3.5 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-brand-slate/15"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-brand-amber"
                    strokeDasharray={`${Math.round(scrollProgress)}, 100`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              <span className={`font-mono font-black ${isGuideComplete ? 'text-emerald-700' : 'text-brand-amber-dark'}`}>
                {Math.round(scrollProgress)}%
              </span>
              <span className="text-brand-slate/40 hidden sm:inline">•</span>
              <span className="text-brand-slate font-semibold truncate max-w-[120px] md:max-w-[160px] hidden sm:inline">
                {isGuideComplete 
                  ? (lang === 'en' ? 'Completed 🎉' : 'Mukammal 🎉') 
                  : (lang === 'en' ? `Sec ${currentSectionNum}/${totalSections}: ${currentSectionObj.shortEn}` : `Hissa ${currentSectionNum}/${totalSections}: ${currentSectionObj.titleHyd}`)}
              </span>
            </div>
          </button>

          {/* Reading Time Pill (Desktop) */}
          <div 
            className="group relative glass-panel px-2 py-0.5 rounded-full text-[10px] font-bold text-brand-amber border border-brand-amber/30 hidden md:flex items-center gap-1 shadow-2xs shrink-0 cursor-help transition-all duration-200 hover:bg-white/80"
            title={`${wordCount.toLocaleString()} words`}
          >
            <BookOpen className="w-3 h-3 text-brand-amber shrink-0" />
            <span className="tracking-tight">{readingTime} min read</span>
          </div>
        </div>

        {/* Right: Streak Indicator, Ask Clay, Ambient Audio, and Explore Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Daily Learning Streak Badge */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/10 hover:from-amber-500/25 hover:to-orange-500/20 text-brand-charcoal border border-amber-500/30 text-xs font-mono font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 group"
            title={`${streakCount}-Day Learning Streak Active! Click to view Scholar Profile & Stats.`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/40 group-hover:scale-110 transition-transform animate-pulse" />
            <span className="font-black text-amber-700 text-[11px]">{streakCount}d</span>
          </button>

          {/* Ambient Sound Button */}
          <button
            onClick={toggleAmbient}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer select-none ${isAmbientOn ? 'bg-brand-amber/15 text-brand-amber border-brand-amber/30 shadow-[0_0_12px_rgba(217,119,6,0.15)]' : 'bg-white/80 hover:bg-brand-sand text-brand-slate border-brand-slate/15'}`}
            title="Warm lo-fi study beats (procedurally synthesized)"
          >
            {isAmbientOn ? <Volume2 className="w-3.5 h-3.5 text-brand-amber animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-brand-slate" />}
            <span className="hidden lg:inline text-[11px] font-bold">{lang === 'en' ? 'Lo-Fi' : 'Lo-Fi'}: {isAmbientOn ? 'ON' : 'OFF'}</span>
          </button>

          {/* Learning Hub Direct Nav Button (Desktop) */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'learning-hub' }));
              setIsExploreOpen(false);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-amber/10 hover:bg-brand-amber/20 text-brand-charcoal border border-brand-amber/30 text-xs font-black transition-all cursor-pointer select-none shadow-2xs hover:scale-105 active:scale-95 group"
            title="Open all 9 AI Lessons, Tools, Quizzes & Flashcards in the Learning Hub"
          >
            <GraduationCap className="w-3.5 h-3.5 text-brand-amber group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-extrabold tracking-tight">
              {lang === 'en' ? 'Learning Hub' : lang === 'te' ? 'లెర్నింగ్ హబ్' : 'Learning Hub'}
            </span>
          </button>

          {/* EXPLORE BUTTON - Placed in the position of the 3-lined menu button */}
          <div className="relative" ref={exploreRef}>
            <button
              onClick={() => setIsExploreOpen(!isExploreOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer select-none border shadow-xs active:scale-95 group ${
                isExploreOpen 
                  ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-md' 
                  : 'bg-white/90 hover:bg-brand-sand text-brand-charcoal border-brand-amber/30 hover:border-brand-amber/60'
              }`}
              title="Explore Apps, Guide, Bookmarks & Table of Contents"
            >
              <Compass className={`w-3.5 h-3.5 transition-transform duration-300 ${isExploreOpen ? 'rotate-90 text-brand-amber' : 'text-brand-amber'}`} />
              <span className="text-[11px] font-extrabold tracking-tight">
                {lang === 'en' ? 'Explore' : lang === 'te' ? 'ఎక్స్‌ప్లోర్' : 'Explore'}
              </span>
              <ChevronDown className={`w-3 h-3 text-inherit transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Consolidated Quick Navigation Dropdown Panel */}
            <AnimatePresence>
              {isExploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-[310px] sm:w-[350px] bg-white/95 backdrop-blur-xl border border-brand-amber/30 rounded-3xl shadow-2xl p-3.5 z-50 overflow-hidden flex flex-col gap-3 text-left"
                >
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-brand-slate/10 px-1">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-brand-amber" />
                      <span className="text-xs font-black text-brand-charcoal uppercase tracking-wider">
                        {lang === 'en' ? 'Quick Navigation' : 'Sabaq aur Apps'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsExploreOpen(false);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 font-mono text-[10px] font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                        title={lang === 'en' ? 'Scholar Profile & Streak' : 'Settings & Streak'}
                      >
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500/30" />
                        <span>{streakCount}d Streak</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsExploreOpen(false);
                        }}
                        className="p-1 rounded-lg text-brand-slate hover:text-brand-amber hover:bg-brand-sand transition-colors cursor-pointer"
                        title={lang === 'en' ? 'Scholar Profile & Settings' : 'Settings & Profile'}
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1. Core Apps & Modules Grid */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {/* Learning Hub All-in-One Button */}
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'learning-hub' }));
                        setIsExploreOpen(false);
                      }}
                      className="flex flex-col items-center text-center p-2 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-brand-amber/30 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-xl bg-brand-amber text-white flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-brand-charcoal leading-tight">
                        {lang === 'en' ? 'Hub' : 'Hub'}
                      </span>
                      <span className="text-[7.5px] font-mono text-brand-amber font-black">All 9</span>
                    </button>

                    {/* Learn / Complete Guide Button */}
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'guide' }));
                        setIsExploreOpen(false);
                      }}
                      className="flex flex-col items-center text-center p-2 rounded-2xl bg-brand-sand/30 hover:bg-brand-sand/70 border border-brand-slate/10 hover:border-brand-amber/30 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-xl bg-amber-500/15 flex items-center justify-center text-brand-amber mb-1 group-hover:scale-105 transition-transform">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-brand-charcoal leading-tight">
                        {lang === 'en' ? 'Guide' : 'Sabaq'}
                      </span>
                      <span className="text-[7.5px] font-mono text-brand-muted">Chapters</span>
                    </button>

                    {/* Mock Interview Button */}
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'interview' }));
                        setIsExploreOpen(false);
                      }}
                      className="flex flex-col items-center text-center p-2 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-brand-amber/30 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-amber"></span>
                      </span>
                      <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-brand-charcoal leading-tight">
                        {lang === 'en' ? 'Mock AI' : 'Interview'}
                      </span>
                      <span className="text-[7.5px] font-mono text-brand-amber font-bold">LIVE</span>
                    </button>

                    {/* Student Dashboard Button */}
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'dashboard' }));
                        setIsExploreOpen(false);
                      }}
                      className="flex flex-col items-center text-center p-2 rounded-2xl bg-brand-sand/30 hover:bg-brand-sand/70 border border-brand-slate/10 hover:border-brand-amber/30 transition-all cursor-pointer group"
                    >
                      <div className="w-7 h-7 rounded-xl bg-slate-800/10 flex items-center justify-center text-slate-800 mb-1 group-hover:scale-105 transition-transform">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold text-brand-charcoal leading-tight">
                        {lang === 'en' ? 'Profile' : 'Profile'}
                      </span>
                      <span className="text-[7.5px] font-mono text-brand-muted">Stats</span>
                    </button>
                  </div>

                  {/* 2. Featured Clayverse AI Mission Section */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-500/5 border border-brand-amber/30 flex flex-col gap-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg bg-brand-amber text-white flex items-center justify-center shadow-2xs">
                          <Heart className="w-3 h-3 fill-white" />
                        </div>
                        <span className="text-[11px] font-black text-brand-charcoal uppercase tracking-wider">
                          {lang === 'en' ? 'About Clayverse AI' : 'Clayverse AI Mission'}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono font-extrabold bg-emerald-500/15 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                        100% Free
                      </span>
                    </div>

                    <p className="text-[10.5px] text-brand-slate leading-relaxed">
                      {lang === 'en'
                        ? 'Empowering non-native learners, Madrasa students, and Telugu & Indian language speakers to master AI with zero math and zero jargon.'
                        : lang === 'te'
                        ? 'కృత్రిమ మేధస్సును సులభంగా, మాతృభాషలో మరియు మదరసా విద్యార్థులకు ఉచితంగా అందించే ప్రజా వేదిక.'
                        : 'Madrasa ke bache, Telugu aur doosri zabaano ke log bina dimaag ki dahi kare mufat AI seekh sakte hain.'}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-brand-amber/20">
                      <span className="text-[9px] font-mono text-brand-muted">
                        By Syed Shahnawaz & Team
                      </span>
                      <button
                        onClick={() => {
                          setIsAboutModalOpen(true);
                          setIsExploreOpen(false);
                        }}
                        className="px-2.5 py-1 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-lg text-[9.5px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      >
                        <span>{lang === 'en' ? 'Who & What Are We?' : 'Hamara Mission'}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3. Reading Bookmark Manager Bar */}
                  <div className="bg-brand-sand/40 p-2.5 rounded-2xl border border-brand-slate/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <div className="p-1.5 rounded-lg bg-white border border-brand-slate/10 shrink-0">
                        {savedBookmark ? <BookmarkCheck className="w-3.5 h-3.5 text-brand-amber" /> : <Bookmark className="w-3.5 h-3.5 text-brand-slate" />}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8.5px] font-mono font-bold text-brand-muted uppercase leading-tight">
                          {savedBookmark ? (lang === 'en' ? 'Saved Bookmark' : 'Saved Bookmark') : (lang === 'en' ? 'Reading Position' : 'Reading Position')}
                        </span>
                        <span className="block text-[11px] font-bold text-brand-charcoal truncate leading-tight">
                          {savedBookmark ? savedBookmark.sectionTitle : (lang === 'en' ? 'No bookmark saved' : 'Koi bookmark nahi')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      {savedBookmark && (
                        <button
                          onClick={handleJumpToBookmark}
                          className="px-2.5 py-1 bg-brand-amber hover:bg-brand-amber-dark text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          {lang === 'en' ? 'Resume' : 'Chalo'}
                        </button>
                      )}
                      <button
                        onClick={handleSaveBookmark}
                        className="px-2.5 py-1 bg-white hover:bg-brand-sand text-brand-charcoal border border-brand-slate/20 text-[10px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                      >
                        {lang === 'en' ? 'Save' : 'Save'}
                      </button>
                    </div>
                  </div>

                  {/* 4. Table of Contents List */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between px-1 text-[10px] font-mono font-bold text-brand-muted uppercase">
                      <span>{lang === 'en' ? 'Guide Chapters' : 'Sabaq Fehrist'}</span>
                      <span>{GUIDE_SECTIONS.length} Lessons</span>
                    </div>

                    <div className="max-h-[190px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                      {[
                        { id: 'hero', titleEn: '1. Introduction & Core Philosophy', titleHyd: '1. Aghaz & Taaruf', read: '1m' },
                        { id: 'what-is-ai', titleEn: '2. What is AI? (Foundations)', titleHyd: '2. AI Kya Hai? (Buniyaad)', read: '2m' },
                        { id: 'family-tree', titleEn: '3. The AI Family Tree & Neural Nets', titleHyd: '3. AI Shijra & Neural Nets', read: '3m' },
                        { id: 'prompting-rag', titleEn: '4. Prompting & RAG Architecture', titleHyd: '4. Prompting & RAG Nizaam', read: '3m' },
                        { id: 'ai-tools-directory', titleEn: '5. AI Tools Directory', titleHyd: '5. AI Tools Fehrist', read: '2m' },
                        { id: 'deeper', titleEn: '6. 12 Core Concepts Deep Dive', titleHyd: '6. 12 Buniyaadi Sabaq', read: '6m' },
                        { id: 'flashcards', titleEn: '7. AI Flashcards Deck', titleHyd: '7. AI Flashcard Deck', read: '3m' },
                        { id: 'classroom-hub', titleEn: '8. Google Classroom Hub', titleHyd: '8. Classroom Hub', read: '2m' },
                        { id: 'ai-arena', titleEn: '9. AI Arena Championship Quiz', titleHyd: '9. Quiz Arena', read: '3m' },
                      ].map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
                              isActive
                                ? 'bg-brand-amber/15 text-brand-amber-dark font-black border border-brand-amber/30'
                                : 'text-brand-slate hover:bg-brand-sand/60 hover:text-brand-charcoal'
                            }`}
                          >
                            <span className="truncate pr-2 text-[11px]">
                              {lang === 'en' ? item.titleEn : item.titleHyd}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[9px] font-mono text-brand-muted opacity-70">
                                {item.read}
                              </span>
                              {isActive && <Check className="w-3 h-3 text-brand-amber stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Quick Settings Footer Action inside Explore dropdown */}
                  <div className="pt-2 border-t border-brand-slate/10 flex items-center justify-between px-1">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsExploreOpen(false);
                      }}
                      className="flex items-center gap-1.5 text-[10.5px] font-bold text-brand-slate hover:text-brand-amber transition-colors cursor-pointer"
                    >
                      <Settings className="w-3 h-3" />
                      <span>{lang === 'en' ? 'Language & App Settings' : 'Settings & Zabaan'}</span>
                    </button>
                    
                    <span className="text-[9px] font-mono font-bold text-brand-muted">
                      v2.0 • CLAYVERSE
                    </span>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Bookmark Toast Notification */}
      <AnimatePresence>
        {bookmarkToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl z-50 flex items-center gap-2 border border-brand-amber/30 pointer-events-none"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-brand-amber" />
            <span>{bookmarkToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return to Bookmark Banner (when returning to the page) */}
      <AnimatePresence>
        {showResumeBanner && savedBookmark && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-brand-amber text-white text-xs px-6 py-2 shadow-md flex items-center justify-between max-w-5xl mx-auto rounded-b-2xl"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span className="font-medium">
                {lang === 'en' 
                  ? `You have a saved reading bookmark at "${savedBookmark.sectionTitle}"` 
                  : `Aap ka bookmark "${savedBookmark.sectionTitle}" par mehfooz hai`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleJumpToBookmark}
                className="px-3 py-0.5 bg-white text-brand-amber-dark font-black rounded-full hover:bg-brand-sand transition-all text-[11px] cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>{lang === 'en' ? 'Resume Reading' : 'Wahan Jayein'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowResumeBanner(false)}
                className="p-1 hover:bg-white/20 rounded-full cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Hamburger Menu Sidebar for PC & Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-brand-charcoal/45 backdrop-blur-md z-40"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[320px] max-w-[85vw] bg-[#FDFBF7]/95 backdrop-blur-xl border-l-2 border-brand-charcoal/10 shadow-2xl z-50 flex flex-col p-6 overflow-hidden text-left"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-slate/10 mb-4 shrink-0">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white to-[#F4EFE6] border border-brand-charcoal/10 flex items-center justify-center shadow-xs">
                    <ClayLogo size={20} />
                  </div>
                  <div>
                    <span className="block font-display text-sm font-black text-brand-charcoal tracking-tight">
                      CLAYVERSE <span className="text-brand-amber font-extrabold">AI</span>
                    </span>
                    <span className="block text-[8px] font-mono font-bold text-brand-muted uppercase">
                      {lang === 'en' ? 'Learning Companion' : 'Sabaq ka Sathi'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 text-brand-slate hover:text-brand-charcoal rounded-xl bg-brand-sand/50 hover:bg-brand-sand transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Contents inside Sidebar */}
              <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-5 scrollbar-thin">
                
                {/* 1. Quick Launch Apps Cards in Sidebar */}
                <div className="flex flex-col gap-2">
                  <span className="block text-[9px] font-mono uppercase font-black text-brand-amber tracking-wider">
                    {lang === 'en' ? 'Main Apps' : 'Khaas Apps'}
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'interview' }));
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/15 border border-brand-amber/30 hover:border-brand-amber/60 transition-all cursor-pointer group text-left shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-brand-amber text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-extrabold text-brand-charcoal">
                            {lang === 'en' ? 'AI Mock Interview' : 'AI Mock Interview'}
                          </span>
                          <span className="block text-[9px] text-brand-muted">
                            {lang === 'en' ? 'Webcam & voice tracking' : 'Live practice simulation'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-brand-amber bg-brand-amber/15 px-2 py-0.5 rounded-md border border-brand-amber/20">
                        LIVE HUD
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'dashboard' }));
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-brand-sand/60 border border-brand-slate/15 hover:border-brand-amber/30 transition-all cursor-pointer group text-left shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <LayoutDashboard className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-extrabold text-brand-charcoal">
                            {lang === 'en' ? 'Student Dashboard' : 'Student Dashboard'}
                          </span>
                          <span className="block text-[9px] text-brand-muted">
                            {lang === 'en' ? 'Milestones & analytics' : 'Scorecards & roadmaps'}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-slate group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* 2. Control Center & Scholar Profile Card */}
                <div className="bg-[#FAF8F5]/90 border border-brand-charcoal/10 p-3.5 rounded-2xl shrink-0 flex flex-col gap-3 text-left shadow-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-brand-slate/10">
                    <span className="block text-[9px] font-mono font-bold text-brand-amber uppercase tracking-wider">
                      {lang === 'en' ? 'App Settings & Profile' : 'Settings & Profile'}
                    </span>
                    <Settings className="w-3.5 h-3.5 text-brand-amber" />
                  </div>

                  {/* Scholar Profile */}
                  <div className="flex items-center justify-between gap-3 bg-white/70 p-2 border border-brand-slate/10 rounded-xl">
                    {user ? (
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={user.avatar} 
                          alt={user.fullName} 
                          className="w-7 h-7 rounded-lg bg-white border border-brand-amber/30 p-0.5 shadow-2xs shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="block text-[8px] font-mono font-bold text-brand-amber uppercase tracking-tight">Active Scholar</span>
                          <span className="block text-xs font-black text-brand-charcoal truncate leading-tight">{user.fullName}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-brand-sand/50 flex items-center justify-center shrink-0 border border-brand-slate/10">
                          <User className="w-3.5 h-3.5 text-brand-muted" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] font-mono font-bold text-brand-muted uppercase tracking-tight">Guest Mode</span>
                          <span className="block text-xs font-black text-brand-charcoal truncate leading-tight">Guest Scholar</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer shadow-2xs uppercase tracking-tight shrink-0"
                    >
                      {user ? (lang === 'en' ? 'Profile' : 'Profile') : (lang === 'en' ? 'Login' : 'Login')}
                    </button>
                  </div>

                  {/* Language Selection Row */}
                  <div className="bg-white/80 p-2 border border-brand-slate/10 rounded-xl flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-brand-amber uppercase tracking-tight flex items-center gap-1">
                        <Languages className="w-3 h-3" />
                        <span>{lang === 'te' ? 'భాషను ఎంచుకోండి' : lang === 'hyd' ? 'Zabaan Chuno' : 'Choose Language'}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { code: 'en' as Language, label: 'EN', name: 'English' },
                        { code: 'hyd' as Language, label: 'HYD', name: 'హైదరాబాదీ' },
                        { code: 'te' as Language, label: 'TEL', name: 'తెలుగు' }
                      ].map((item) => (
                        <button
                          key={item.code}
                          onClick={() => setLang(item.code)}
                          className={`py-1 px-1 rounded-lg text-center font-bold text-[10px] transition-all cursor-pointer ${
                            lang === item.code
                              ? 'bg-brand-amber text-white shadow-xs'
                              : 'bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal'
                          }`}
                        >
                          <span className="block font-mono text-[9px]">{item.label}</span>
                          <span className="block text-[8px] opacity-85 truncate">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Quick Search */}
                <div 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="bg-white hover:bg-brand-sand border border-brand-slate/15 p-2.5 rounded-2xl shrink-0 flex items-center gap-2.5 text-left cursor-pointer transition-all shadow-2xs group"
                >
                  <Search className="w-4 h-4 text-brand-slate group-hover:text-brand-amber transition-colors" />
                  <div className="flex-grow">
                    <span className="block text-[8px] font-mono font-bold text-brand-muted uppercase tracking-tight">Quick Search</span>
                    <span className="block text-xs font-semibold text-brand-slate">{lang === 'en' ? "Search topics & terms..." : "Hisse aur alfaaz dhoondo..."}</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-brand-sand rounded border border-brand-slate/10 text-brand-slate">
                    ⌘K
                  </span>
                </div>

                {/* 4. Core Journey Chapters */}
                <div className="text-left">
                  <span className="block text-[9px] font-mono uppercase font-black text-brand-amber tracking-wider mb-2">
                    {lang === 'en' ? 'Guide Chapters' : lang === 'te' ? 'ప్రధాన ప్రయాణం' : 'Sabaq ka Rasta'}
                  </span>
                  <div className="flex flex-col gap-1">
                    {[
                      { id: 'hero', label: lang === 'en' ? 'Overview & Introduction' : 'Overview & Shuruat', num: '01' },
                      { id: 'what-is-ai', label: lang === 'en' ? 'What Actually is AI?' : 'AI Kya Hai?', num: '02' },
                      { id: 'family-tree', label: lang === 'en' ? 'AI Family Tree & Neural Nets' : 'AI Shijra & Neural Nets', num: '03' },
                      { id: 'prompting-rag', label: lang === 'en' ? 'Prompting & RAG Architecture' : 'Prompting & RAG', num: '04' },
                      { id: 'ai-tools-directory', label: lang === 'en' ? 'Free AI Tools Directory' : 'AI Tools Fehrist', num: '05' },
                      { id: 'deeper', label: lang === 'en' ? '12 Core Concepts Deep Dive' : '12 Buniyaadi Sabaq', num: '06' },
                      { id: 'flashcards', label: lang === 'en' ? 'AI Flashcards Deck' : 'AI Flashcards', num: '07' },
                      { id: 'classroom-hub', label: lang === 'en' ? 'Google Classroom Hub' : 'Classroom Hub', num: '08' },
                      { id: 'ai-arena', label: lang === 'en' ? 'AI Arena Quiz' : 'AI Arena Quiz', num: '09' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                          activeSection === item.id 
                            ? 'bg-brand-amber text-white shadow-xs' 
                            : 'text-brand-slate hover:bg-brand-sand'
                        }`}
                      >
                        <span className="font-mono text-[9px] opacity-75">{item.num}</span>
                        <span className="flex-grow truncate text-[11px]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. 12 Progressive Lessons Glossary */}
                <div className="text-left">
                  <span className="block text-[9px] font-mono uppercase font-black text-brand-amber tracking-wider mb-2">
                    {lang === 'en' ? '12 Lessons Glossary' : '12 Progressive Sabaq'}
                  </span>
                  <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto border border-brand-charcoal/5 rounded-2xl bg-[#F7F4EF]/60 p-2 text-left">
                    {roadmapSections.map((sec) => {
                      const isActiveSub = window.location.hash === `#${sec.id}`;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isActiveSub 
                              ? 'bg-brand-amber text-white' 
                              : 'text-brand-slate hover:bg-brand-sand'
                          }`}
                        >
                          <span className="truncate pr-1">
                            <span className="font-mono text-[9px] font-bold text-brand-amber mr-1.5">{sec.number}</span>
                            {sec.title}
                          </span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0 ${isActiveSub ? 'bg-white/20 text-white' : 'bg-brand-sand text-brand-muted'}`}>
                            {sec.terms.length} terms
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reading completion tracker */}
                <div className="bg-[#FAF8F5] border border-brand-slate/10 p-3 rounded-2xl shrink-0 text-left mt-auto">
                  <span className="block text-[9px] font-mono font-bold text-brand-muted uppercase mb-1">
                    {lang === 'en' ? "Reading Progress" : "Kitna Padhe"}
                  </span>
                  <div className="flex justify-between items-center mb-1 text-xs font-black text-brand-charcoal">
                    <span>{Math.round(scrollProgress)}%</span>
                    <span className="text-[9px] text-brand-amber font-mono font-bold">
                      {scrollProgress > 95 ? (lang === 'en' ? "COMPLETED" : "POORA") : (lang === 'en' ? "READING" : "PADH RAHE")}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden">
                    <div className="h-full bg-brand-amber rounded-full" style={{ width: `${scrollProgress}%` }} />
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Glassmorphic Back to Top Button */}
      <AnimatePresence>
        {activeSection !== 'hero' && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => scrollToSection('hero')}
            className="fixed bottom-22 right-6 z-40 p-3.5 rounded-full bg-white/80 backdrop-blur-md border border-brand-slate/15 shadow-lg hover:shadow-xl text-brand-slate hover:text-white hover:bg-brand-amber hover:border-brand-amber transition-all cursor-pointer group flex items-center justify-center"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Auth Modal for Achievements & Settings */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={() => setIsAuthModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Glassmorphic Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </nav>
  );
}
