import { useState, useEffect } from 'react';
import FloatingNav from './components/FloatingNav';
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
import HomeCurriculumGrid from './components/HomeCurriculumGrid';
import IndividualLessonView from './components/IndividualLessonView';
import GuideBreadcrumbNav from './components/GuideBreadcrumbNav';
import LearningHubPage from './components/LearningHubPage';
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
import MindMapLearning from './components/MindMapLearning';
import InteractiveVisualization from './components/InteractiveVisualization';
import ClaybotIntroduction from './components/ClaybotIntroduction';
import { LESSON_MODULES } from './components/HomeCurriculumGrid';
import { useGlobalKeyboardShortcuts } from './hooks/useGlobalKeyboardShortcuts';
import { useTheme, type Theme } from './hooks/useTheme';
import { audioEngine } from './lib/audioEngine';
import { Sparkles, ArrowLeft, LayoutGrid, List, GraduationCap, MessageSquare, Command, Keyboard, WifiOff, HardDriveDownload, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguageMultilingual } from './hooks/useLanguageMultilingual';

interface StudentAppProps {
  onLogout?: () => void;
}

export default function AppStudent({ onLogout }: StudentAppProps) {
  const { lang, t, dir } = useLanguageMultilingual();
  const { theme, setTheme } = useTheme();
  const [currentView, setCurrentView] = useState<'guide' | 'interview' | 'dashboard' | 'learning-hub'>('guide');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isContinuousGuide, setIsContinuousGuide] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
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
          ? (lang === 'te' ? 'ఫోకస్ మోడ్: సక్రియం (అంతరాయం లేని పఠనం)' : lang === 'hi' ? 'फोकस मोड: सक्रिय (एकाग्र अध्ययन)' : lang === 'ur' || lang === 'roman_ur' ? 'Focus Mode: Shuru ho gaya' : 'Focus Mode: Active (Distraction-Free Reading)')
          : (lang === 'te' ? 'ఫోకస్ మోడ్: నిష్క్రమించారు' : lang === 'hi' ? 'फोकस मोड: बंद किया गया' : lang === 'ur' || lang === 'roman_ur' ? 'Focus Mode: Band ho gaya' : 'Focus Mode: Deactivated (Full Navigation)')
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
    return false;
  };

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
    const handleNavigateView = (e: CustomEvent<'guide' | 'interview' | 'dashboard' | 'learning-hub'>) => {
      if (e.detail) {
        setCurrentView(e.detail);
        if (e.detail === 'guide') {
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

        const lessonKeys = ['what-is-ai', 'family-tree', 'generative-ai', 'prompting-rag', 'tools', 'ai-tools-directory', 'deeper', 'flashcards', 'classroom-hub', 'ai-arena'];
        
        if (lessonKeys.includes(targetId)) {
          const normalized = targetId === 'ai-tools-directory' ? 'tools' : targetId;
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
    <div 
      dir={lang === 'ur' ? 'rtl' : 'ltr'} 
      className="min-h-screen bg-white text-brand-charcoal selection:bg-brand-amber/10 selection:text-brand-amber font-sans antialiased overflow-x-hidden"
    >
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-amber focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl"
      >
        Skip to main content
      </a>

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

      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <OfflineStatusBanner onOpenOfflineManager={() => setIsOfflineModalOpen(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <OnboardingModal />

      <OfflineManagerModal 
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
      />

      <LanguagesShowcase 
        isOpen={isLanguagesModalOpen} 
        onClose={() => setIsLanguagesModalOpen(false)} 
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <TTSReaderModal
        isOpen={isTTSReaderOpen}
        onClose={() => setIsTTSReaderOpen(false)}
        initialText={ttsReaderText}
        initialTitle={ttsReaderTitle}
      />

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

      <FloatingLanguageBubble 
        showAudioHub={currentView === 'guide' || currentView === 'learning-hub'}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => handleToggleFocusMode()}
      />

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
            onOpenAuth={() => {}}
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
        <div className="min-h-screen">
          {!isFocusMode && isContinuousGuide && (
            <GuideBreadcrumbNav
              currentLessonId={currentLessonId}
              isContinuousGuide={isContinuousGuide}
              onNavigateHome={() => {
                setCurrentLessonId(null);
                setIsContinuousGuide(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectLesson={(newId) => {
                setCurrentLessonId(newId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onToggleContinuousGuide={(enable) => {
                setIsContinuousGuide(enable);
                setCurrentLessonId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

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
              onOpenTTSReader={(text, title) => {
                if (text) setTtsReaderText(text);
                if (title) setTtsReaderTitle(title);
                setIsTTSReaderOpen(true);
              }}
            />
          ) : (
            <main id="main-content" className="relative z-10 flex flex-col gap-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <Hero />
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <TrustSignals onOpenLanguages={() => setIsLanguagesModalOpen(true)} />
              </motion.div>

              {/* Curriculum Grid - The Professional 9-Step Overview */}
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
                />
              </motion.div>

              <SocialShareSection />
            </main>
          )}
        </div>
      )}
    </div>
  );
}
