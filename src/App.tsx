import { useState, useEffect } from 'react';
import FloatingNav from './components/FloatingNav';
import ScrollProgressIndicator from './components/ScrollProgressIndicator';
import Hero from './components/Hero';
import WhatIsAI from './components/WhatIsAI';
import ClayExplainer from './components/ClayExplainer';
import AIFamilyTree from './components/AIFamilyTree';
import GenerativeAI from './components/GenerativeAI';
import PromptingAndRAG from './components/PromptingAndRAG';
import AIToolsList from './components/AIToolsList';
import ClosingAndDeeper from './components/ClosingAndDeeper';
import FloatingLanguageBubble from './components/FloatingLanguageBubble';
import CheckYourKnowledge from './components/CheckYourKnowledge';
import AIArena from './components/AIArena';
import GoogleClassroomHub from './components/GoogleClassroomHub';
import InteractiveFlashcards from './components/InteractiveFlashcards';
import QuickTakeaway from './components/QuickTakeaway';
import AIMockInterviewer from './components/AIMockInterviewer';
import StudentDashboard from './components/StudentDashboard';
import AuthModal from './components/AuthModal';
import HomeCurriculumGrid from './components/HomeCurriculumGrid';
import IndividualLessonView from './components/IndividualLessonView';
import LearningHubPage from './components/LearningHubPage';
import StructuredHubShowcase from './components/StructuredHubShowcase';
import SocialShareSection from './components/SocialShareSection';
import TrustSignals from './components/TrustSignals';
import ValueProps from './components/ValueProps';
import LanguagesShowcase from './components/LanguagesShowcase';
import OnboardingModal from './components/OnboardingModal';
import GuestModeBanner from './components/GuestModeBanner';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import OfflineStatusBanner from './components/OfflineStatusBanner';
import OfflineManagerModal from './components/OfflineManagerModal';
import FocusLockdownManager from './components/FocusLockdownManager';
import TTSReaderModal from './components/TTSReaderModal';
import { LESSON_MODULES } from './components/HomeCurriculumGrid';
import { useGlobalKeyboardShortcuts } from './hooks/useGlobalKeyboardShortcuts';
import { useTheme, type Theme } from './hooks/useTheme';
import { audioEngine } from './lib/audioEngine';
import { Compass, Sparkles, BookOpen, Video, TrendingUp, ArrowLeft, LayoutGrid, List, GraduationCap, MessageSquare, Command, Keyboard, WifiOff, HardDriveDownload, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ClayLogo from './components/ClayLogo';
import { useLanguage } from './hooks/useLanguage';

export default function App() {
  const { lang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState<'guide' | 'interview' | 'dashboard' | 'learning-hub'>('guide');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isContinuousGuide, setIsContinuousGuide] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isTTSReaderOpen, setIsTTSReaderOpen] = useState(false);
  const [ttsReaderText, setTtsReaderText] = useState<string | undefined>(undefined);
  const [ttsReaderTitle, setTtsReaderTitle] = useState<string | undefined>(undefined);
  const [shortcutToast, setShortcutToast] = useState<string | null>(null);

  const showShortcutToast = (msg: string) => {
    setShortcutToast(msg);
    setTimeout(() => {
      setShortcutToast((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  const handleToggleFocusMode = (explicitValue?: boolean) => {
    setIsFocusMode((prev) => {
      const next = typeof explicitValue === 'boolean' ? explicitValue : !prev;
      showShortcutToast(
        next 
          ? (lang === 'te' ? 'ఫోకస్ మోడ్: సక్రియం (అంతరాయం లేని పఠనం)' : lang === 'hi' ? 'फोकस मोड: सक्रिय (एकाग्र अध्ययन)' : lang === 'hyd' || lang === 'ur' ? 'Focus Mode: Shuru ho gaya' : 'Focus Mode: Active (Distraction-Free Reading)')
          : (lang === 'te' ? 'ఫోకస్ మోడ్: నిష్క్రమించారు' : lang === 'hi' ? 'फोकस मोड: बंद किया गया' : lang === 'hyd' || lang === 'ur' ? 'Focus Mode: Band ho gaya' : 'Focus Mode: Deactivated (Full Navigation)')
      );
      return next;
    });
  };

  const handleNextLesson = () => {
    if (!currentLessonId) return;
    const idx = LESSON_MODULES.findIndex(m => m.id === currentLessonId);
    if (idx >= 0 && idx < LESSON_MODULES.length - 1) {
      const nextMod = LESSON_MODULES[idx + 1];
      setCurrentLessonId(nextMod.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showShortcutToast(`Lesson ${nextMod.lessonNum}: ${nextMod.titleEn}`);
    }
  };

  const handlePrevLesson = () => {
    if (!currentLessonId) return;
    const idx = LESSON_MODULES.findIndex(m => m.id === currentLessonId);
    if (idx > 0) {
      const prevMod = LESSON_MODULES[idx - 1];
      setCurrentLessonId(prevMod.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showShortcutToast(`Lesson ${prevMod.lessonNum}: ${prevMod.titleEn}`);
    }
  };

  const handleCycleTheme = () => {
    const themes: Theme[] = ['sand', 'deep-blue', 'deep-night', 'red-light'];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    const nextTheme = themes[nextIdx];
    setTheme(nextTheme);
    showShortcutToast(`Theme: ${nextTheme.replace('-', ' ').toUpperCase()}`);
  };

  const handleToggleAudio = () => {
    const currentVol = audioEngine.getVolume();
    if (currentVol > 0) {
      audioEngine.setVolume(0);
      showShortcutToast('Audio SFX: Muted');
    } else {
      audioEngine.setVolume(0.5);
      showShortcutToast('Audio SFX: Active');
    }
  };

  const handleToggleContinuous = () => {
    setIsContinuousGuide(prev => {
      const next = !prev;
      showShortcutToast(next ? 'Continuous Reading: ON' : 'Modular Overview: ON');
      return next;
    });
  };

  const handleSaveBookmark = () => {
    const scrollY = window.scrollY;
    const bookmark = {
      scrollY: Math.round(scrollY),
      sectionId: currentLessonId || 'overview',
      sectionTitle: currentLessonId ? `Lesson: ${currentLessonId}` : 'Overview',
      timestamp: Date.now()
    };
    try {
      localStorage.setItem('clay_scroll_bookmark', JSON.stringify(bookmark));
      showShortcutToast('Bookmark Saved at Current Position');
    } catch {}
  };

  const handleGoHome = () => {
    setCurrentView('guide');
    setCurrentLessonId(null);
    setIsContinuousGuide(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showShortcutToast('Returned to Course Overview (Home)');
  };

  const handleCloseModals = (): boolean => {
    if (isTTSReaderOpen) {
      setIsTTSReaderOpen(false);
      return true;
    }
    if (isOfflineModalOpen) {
      setIsOfflineModalOpen(false);
      return true;
    }
    if (isShortcutsModalOpen) {
      setIsShortcutsModalOpen(false);
      return true;
    }
    if (isLanguagesModalOpen) {
      setIsLanguagesModalOpen(false);
      return true;
    }
    if (isAuthModalOpen) {
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  // Wire global keyboard shortcuts
  useGlobalKeyboardShortcuts({
    onCloseModals: handleCloseModals,
    onGoHome: handleGoHome,
    onToggleShortcutsModal: () => setIsShortcutsModalOpen(prev => !prev),
    onOpenSearch: () => window.dispatchEvent(new CustomEvent('clay_open_search')),
    onOpenLanguages: () => setIsLanguagesModalOpen(true),
    onOpenOffline: () => setIsOfflineModalOpen(true),
    onOpenTTSReader: () => setIsTTSReaderOpen(true),
    onToggleFocusMode: () => handleToggleFocusMode(),
    onSwitchView: (v) => {
      setCurrentView(v);
      if (v === 'guide') setCurrentLessonId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const label = 
        v === 'guide' ? 'Course Guide & Overview' :
        v === 'interview' ? 'AI Mock Interviewer' :
        v === 'dashboard' ? 'Student Dashboard & Analytics' : 'Learning Hub';
      showShortcutToast(`Switched to: ${label}`);
    },
    onCycleTheme: handleCycleTheme,
    onToggleAudio: handleToggleAudio,
    onToggleContinuous: handleToggleContinuous,
    onPrevLesson: handlePrevLesson,
    onNextLesson: handleNextLesson,
    onSaveBookmark: handleSaveBookmark,
    isLessonActive: currentLessonId !== null,
    isFocusModeActive: isFocusMode
  });

  useEffect(() => {
    // Listen to custom navigation events from FloatingNav or subcomponents
    const handleNavigateView = (e: CustomEvent<'guide' | 'interview' | 'dashboard' | 'learning-hub'>) => {
      if (e.detail) {
        setCurrentView(e.detail);
        if (e.detail === 'guide') {
          // Default to home overview unless a lesson was requested
          setCurrentLessonId(null);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleOpenLesson = (e: CustomEvent<string>) => {
      if (e.detail) {
        setCurrentView('guide');
        setCurrentLessonId(e.detail);
        setIsContinuousGuide(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleOpenLanguages = () => {
      setIsLanguagesModalOpen(true);
    };

    const handleOpenOfflineManager = () => {
      setIsOfflineModalOpen(true);
    };

    const handleOpenTTSReaderEvent = (e: CustomEvent<{ text?: string; title?: string }>) => {
      if (e?.detail) {
        if (e.detail.text) setTtsReaderText(e.detail.text);
        if (e.detail.title) setTtsReaderTitle(e.detail.title);
      }
      setIsTTSReaderOpen(true);
    };

    const handleToggleFocusEvent = (e: any) => {
      if (e?.detail && typeof e.detail.active === 'boolean') {
        handleToggleFocusMode(e.detail.active);
      } else {
        handleToggleFocusMode();
      }
    };

    window.addEventListener('clay_navigate_view' as any, handleNavigateView);
    window.addEventListener('clay_open_lesson' as any, handleOpenLesson);
    window.addEventListener('clay_open_languages_showcase' as any, handleOpenLanguages);
    window.addEventListener('clay_open_offline_manager' as any, handleOpenOfflineManager);
    window.addEventListener('clay_open_tts_reader' as any, handleOpenTTSReaderEvent);
    window.addEventListener('clay_toggle_focus_mode' as any, handleToggleFocusEvent);

    // Smoothly handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace('#', '');
        if (targetId === 'languages' || targetId === 'languages-showcase') {
          setIsLanguagesModalOpen(true);
          return;
        }

        if (targetId === 'offline' || targetId === 'offline-manager') {
          setIsOfflineModalOpen(true);
          return;
        }

        if (targetId === 'learning-hub' || targetId === 'hub') {
          setCurrentView('learning-hub');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const lessonKeys = ['what-is-ai', 'family-tree', 'generative-ai', 'prompting-rag', 'tools', 'ai-tools-directory', 'deeper', 'flashcards', 'classroom-hub', 'ai-arena', 'arena'];
        
        if (lessonKeys.includes(targetId)) {
          const normalized = targetId === 'ai-tools-directory' ? 'tools' : targetId === 'ai-arena' ? 'arena' : targetId;
          setCurrentView('guide');
          setCurrentLessonId(normalized);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setCurrentView('guide');
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('clay_navigate_view' as any, handleNavigateView);
      window.removeEventListener('clay_open_lesson' as any, handleOpenLesson);
      window.removeEventListener('clay_open_languages_showcase' as any, handleOpenLanguages);
      window.removeEventListener('clay_open_offline_manager' as any, handleOpenOfflineManager);
      window.removeEventListener('clay_open_tts_reader' as any, handleOpenTTSReaderEvent);
      window.removeEventListener('clay_toggle_focus_mode' as any, handleToggleFocusEvent);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const sectionAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08
      } 
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal selection:bg-brand-amber/10 selection:text-brand-amber font-sans antialiased overflow-x-hidden">
      {/* Accessible Skip to Main Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-amber focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* Persistent Scroll Progress Indicator at the Top of Screen */}
      <ScrollProgressIndicator />

      {/* Fullscreen Focus Lockdown & Anti-Distraction Manager */}
      <FocusLockdownManager
        isActive={isFocusMode}
        onExit={() => handleToggleFocusMode(false)}
        currentLessonId={currentLessonId || undefined}
        currentLessonTitle={
          currentLessonId 
            ? (LESSON_MODULES.find(m => m.id === currentLessonId)?.titleEn || "Clayverse AI Lesson")
            : "Clayverse AI Study Session"
        }
      />

      {/* Translucent Navigation Layer (Hidden in Focus Mode) */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.22 }}
            className="relative z-50"
          >
            <FloatingNav />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Status & Reconnection Banner (Hidden in Focus Mode) */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="pt-16"
          >
            <OfflineStatusBanner onOpenOfflineManager={() => setIsOfflineModalOpen(true)} />
            <GuestModeBanner onOpenAuth={() => setIsAuthModalOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* First-Visit Multilingual Onboarding Modal */}
      <OnboardingModal />

      {/* Offline Curriculum Storage Manager Modal */}
      <OfflineManagerModal 
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
      />

      {/* 25+ Indian Languages Interactive Showcase Modal */}
      <LanguagesShowcase 
        isOpen={isLanguagesModalOpen} 
        onClose={() => setIsLanguagesModalOpen(false)} 
      />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Web Speech API Editorial Text-to-Speech Reader Modal */}
      <TTSReaderModal
        isOpen={isTTSReaderOpen}
        onClose={() => setIsTTSReaderOpen(false)}
        initialText={ttsReaderText}
        initialTitle={ttsReaderTitle}
      />

      {/* Keyboard Action Toast Feedback */}
      <AnimatePresence>
        {shortcutToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-brand-charcoal dark:bg-zinc-800 text-white rounded-full shadow-2xl border border-brand-amber/30 text-xs font-bold flex items-center gap-2 pointer-events-none backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-amber animate-pulse" />
            <span>{shortcutToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Auth / Profile Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Floating Action Controls Stack (Back to Top, Clay Audio Hub, Focus Mode Toggle, and Language Selector in One Vertical Line) */}
      <FloatingLanguageBubble 
        showAudioHub={currentView === 'guide' || currentView === 'learning-hub'}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => handleToggleFocusMode()}
      />

      {/* Main Content Area: Switch between Guide, Learning Hub, Mock Interviewer, and Student Dashboard */}
      {currentView === 'interview' && (
        <div className="pt-16 min-h-screen">
          <AIMockInterviewer
            onBackToGuide={() => {
              setCurrentView('guide');
              setCurrentLessonId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {currentView === 'dashboard' && (
        <div className="pt-16 min-h-screen">
          <StudentDashboard
            onStartInterview={() => {
              setCurrentView('interview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigateSection={(secId) => {
              setCurrentView('guide');
              setCurrentLessonId(secId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      {currentView === 'learning-hub' && (
        <LearningHubPage
          onSelectLesson={(lessonId) => {
            setCurrentView('guide');
            setCurrentLessonId(lessonId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartInterview={() => {
            setCurrentView('interview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDashboard={() => {
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onViewContinuousGuide={() => {
            setCurrentView('guide');
            setCurrentLessonId(null);
            setIsContinuousGuide(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {currentView === 'guide' && (
        <>
          {/* 1. If an Individual Lesson is Active, render Dedicated Lesson Page */}
          {currentLessonId ? (
            <IndividualLessonView 
              lessonId={currentLessonId}
              onBackToHome={() => {
                setCurrentLessonId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectLesson={(newId) => {
                setCurrentLessonId(newId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isFocusMode={isFocusMode}
              onToggleFocusMode={() => handleToggleFocusMode()}
            />
          ) : isContinuousGuide ? (
            /* 2. Full Continuous Guide Mode */
            <main id="main-content" className="relative z-10 flex flex-col gap-6 pt-16">
              {/* Continuous Mode Banner */}
              <div className="max-w-5xl mx-auto px-6 w-full pt-4 flex items-center justify-between">
                <button
                  onClick={() => setIsContinuousGuide(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-brand-sand border border-brand-slate/20 text-xs font-bold text-brand-charcoal transition-all shadow-2xs cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? "Return to Modular Home Overview" : "Home Overview par Wapis"}</span>
                </button>

                <span className="text-xs font-mono font-bold text-brand-amber bg-brand-amber/10 px-3 py-1 rounded-full border border-brand-amber/20">
                  Continuous Reading Mode (9 Chapters)
                </span>
              </div>

              {/* Layer 1: Hero Intro */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <Hero />
              </motion.div>

              {/* Trust Signals: Core Mission Pillars */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <TrustSignals onOpenLanguages={() => setIsLanguagesModalOpen(true)} />
              </motion.div>

              {/* Layer 2: Foundations */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <WhatIsAI />
                <QuickTakeaway sectionId="what-is-ai" />
                <CheckYourKnowledge sectionId="basics" />
              </motion.div>

              {/* Interactive Host: Clay, the AI Explainer Bot */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <ClayExplainer />
              </motion.div>

              {/* Educational Value Proposition Comparison */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <ValueProps onOpenLanguages={() => setIsLanguagesModalOpen(true)} />
              </motion.div>

              {/* Layer 3: The Family Tree */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <AIFamilyTree />
                <QuickTakeaway sectionId="family-tree" />
                <CheckYourKnowledge sectionId="family-tree" />
              </motion.div>

              {/* Layer 4: Generative AI & Large Language Models */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <GenerativeAI />
                <QuickTakeaway sectionId="generative-ai" />
              </motion.div>

              {/* Layer 5: Prompting & RAG */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <PromptingAndRAG />
                <QuickTakeaway sectionId="prompting-rag" />
                <CheckYourKnowledge sectionId="prompting-rag" />
              </motion.div>

              {/* Layer 6: Curated AI Tools */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <AIToolsList />
                <QuickTakeaway sectionId="tools" />
              </motion.div>

              {/* Layer 7: 12 Core Concepts Deep Dive */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <ClosingAndDeeper />
                <QuickTakeaway sectionId="deeper" />
                <CheckYourKnowledge sectionId="deeper" />
              </motion.div>

              {/* Layer 8: Flashcards Deck */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <InteractiveFlashcards />
              </motion.div>

              {/* Layer 9: Google Classroom Hub */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <GoogleClassroomHub />
              </motion.div>

              {/* Layer 10: AI Arena */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <AIArena />
              </motion.div>

              {/* Social Sharing Component */}
              <SocialShareSection />
            </main>
          ) : (
            /* 3. Streamlined, Highly Professional Engineered Masterpiece Home Page */
            <main id="main-content" className="relative z-10 flex flex-col gap-10">
              {/* 1. Hero: Ethos, Interactive Pattern Canvas, Direct Action CTAs */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <Hero />
              </motion.div>

              {/* 2. Trust Signals: Zero-math, 25+ Languages, Verified Pedagogy */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <TrustSignals onOpenLanguages={() => setIsLanguagesModalOpen(true)} />
              </motion.div>

              {/* 3. Four Pillars of the Ecosystem Showcase */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <StructuredHubShowcase
                  onOpenCurriculum={() => {
                    const el = document.getElementById('curriculum');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onOpenInterview={() => {
                    setCurrentView('interview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenDashboard={() => {
                    setCurrentView('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenLearningHub={() => {
                    setCurrentView('learning-hub');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenLesson={(lessonId) => {
                    setCurrentLessonId(lessonId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </motion.div>

              {/* 4. Structured 9-Step Curriculum Architecture Grid & Roadmap */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <HomeCurriculumGrid 
                  onSelectLesson={(lessonId) => {
                    setCurrentLessonId(lessonId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onViewContinuousGuide={() => {
                    setIsContinuousGuide(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onStartInterview={() => {
                    setCurrentView('interview');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </motion.div>

              {/* 5. Interactive Starter AI Assistant Sandbox */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <div className="max-w-4xl mx-auto px-6">
                  <ClayExplainer />
                </div>
              </motion.div>

              {/* 6. Value Props: Zero-Math Visual Approach */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <ValueProps onOpenLanguages={() => setIsLanguagesModalOpen(true)} />
              </motion.div>

              {/* 7. Social Sharing & Peer Certification */}
              <SocialShareSection />
            </main>
          )}
        </>
      )}

      {/* Editorial Journal Styled Footer (Hidden in Focus Mode) */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.footer 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-brand-sand/50 border-t border-brand-slate/10 py-16 relative z-10 text-left"
          >
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 flex flex-col gap-3 text-left">
                <div className="flex items-center gap-2 font-display text-lg font-bold text-brand-charcoal justify-start">
                  <ClayLogo size={28} />
                  <span>CLAYVERSE <span className="text-brand-amber font-extrabold">AI</span></span>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed max-w-sm text-left">
                  {lang === 'en' 
                    ? "An interactive, beginner-safe editorial journal dedicated to demystifying modern artificial intelligence, machine learning structures, and generative algorithms through clean visual logic."
                    : lang === 'te'
                    ? "కృత్రిమ మేధస్సు (AI), మెషిన్ లెర్నింగ్, మరియు జనరేటివ్ అల్గారిథమ్‌లను గణితం మరియు కష్టమైన పదాలు లేకుండా దృశ్య రూపంలో సులభంగా వివరించే సరళమైన ఇంటరాక్టివ్ గైడ్."
                    : "Miya, ye ek interactive aur boht aasan editorial journal hai jo modern AI, machine learning, aur generative systems ko boht saaf aur asaan zubaan mein samjhati hai."
                  }
                </p>
              </div>

              <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-left">
                <div>
                  <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">
                    {lang === 'en' ? "Individual Lessons" : lang === 'te' ? "పాఠ్యాంశాలు" : "AI Asbaaq"}
                  </h5>
                  <ul className="flex flex-col gap-2 text-xs font-medium text-brand-muted text-left">
                    <li>
                      <button onClick={() => { setCurrentView('guide'); setCurrentLessonId('what-is-ai'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer">
                        {lang === 'en' ? "1. What is AI?" : "1. Shuruati Baatein"}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { setCurrentView('guide'); setCurrentLessonId('family-tree'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer">
                        {lang === 'en' ? "2. The Family Tree" : "2. Khandan ka Tree"}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { setCurrentView('guide'); setCurrentLessonId('prompting-rag'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer">
                        {lang === 'en' ? "3. Prompting & RAG" : "3. Prompting aur RAG"}
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { setCurrentView('guide'); setCurrentLessonId('deeper'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer">
                        {lang === 'en' ? "4. 12 Core Concepts" : "4. Gehra Glossary"}
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">
                    {lang === 'en' ? "Interactive Hub" : lang === 'te' ? "ముఖ్య అంశాలు" : "Interactive Apps"}
                  </h5>
                  <ul className="flex flex-col gap-2 text-xs font-medium text-brand-muted text-left">
                    <li>
                      <button onClick={() => { setCurrentView('learning-hub'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer font-bold text-brand-charcoal flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-brand-amber" />
                        <span>Learning Hub (All 9)</span>
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { setCurrentView('guide'); setCurrentLessonId('flashcards'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer">
                        Memory Flashcards
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { setCurrentView('guide'); setCurrentLessonId('classroom-hub'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer">
                        Classroom Hub
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { setCurrentView('guide'); setCurrentLessonId('arena'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer">
                        AI Arena & Quizzes
                      </button>
                    </li>
                    <li>
                      <button onClick={() => { setCurrentView('interview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-brand-amber transition-colors text-left cursor-pointer">
                        AI Mock Interviewer
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="col-span-2 sm:col-span-1 text-left">
                  <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">
                    {lang === 'en' ? "Journal Ethos" : lang === 'te' ? "విశేషాలు" : "Khaas Baatein"}
                  </h5>
                  <div className="flex flex-col gap-2 text-xs text-brand-muted text-left">
                    <span className="flex items-center gap-1 justify-start">
                      <Sparkles className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                      <span>Tactile HUD v1.0</span>
                    </span>
                    <span className="flex items-center gap-1 justify-start">
                      <BookOpen className="w-3.5 h-3.5 text-brand-slate shrink-0" />
                      <span>{lang === 'en' ? "100% Beginner-Safe" : lang === 'te' ? "ప్రారంభకులకు 100% అనుకూలం" : "Naye Seekhne Walo ke liye"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 mt-12 pt-6 border-t border-brand-slate/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-brand-muted">
              <span>© 2026 Clayverse AI. By Syed Shahnawaz.</span>
              <div className="flex gap-4">
                <span className="hover:text-brand-amber transition-colors cursor-pointer">{lang === 'en' ? "Editorial Policies" : lang === 'te' ? "విధానాలు" : "Khaas Policies"}</span>
                <span className="hover:text-brand-amber transition-colors cursor-pointer">{lang === 'en' ? "Privacy Principles" : lang === 'te' ? "గోప్యతా సూత్రాలు" : "Privacy ke Rules"}</span>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  );
}
