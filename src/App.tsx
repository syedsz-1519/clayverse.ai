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
import AudioNarrationHub from './components/AudioNarrationHub';
import FloatingLanguageBubble from './components/FloatingLanguageBubble';
import CheckYourKnowledge from './components/CheckYourKnowledge';
import AIArena from './components/AIArena';
import GoogleClassroomHub from './components/GoogleClassroomHub';
import InteractiveFlashcards from './components/InteractiveFlashcards';
import QuickTakeaway from './components/QuickTakeaway';
import AIMockInterviewer from './components/AIMockInterviewer';
import StudentDashboard from './components/StudentDashboard';
import AuthModal from './components/AuthModal';
import DidYouKnowNotification from './components/DidYouKnowNotification';
import HomeCurriculumGrid from './components/HomeCurriculumGrid';
import IndividualLessonView from './components/IndividualLessonView';
import LearningHubPage from './components/LearningHubPage';
import SocialShareSection from './components/SocialShareSection';
import { Compass, Sparkles, BookOpen, Video, TrendingUp, ArrowLeft, LayoutGrid, List, GraduationCap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ClayLogo from './components/ClayLogo';
import { useLanguage } from './hooks/useLanguage';

export default function App() {
  const { lang } = useLanguage();
  const [currentView, setCurrentView] = useState<'guide' | 'interview' | 'dashboard' | 'learning-hub'>('guide');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isContinuousGuide, setIsContinuousGuide] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

    window.addEventListener('clay_navigate_view' as any, handleNavigateView);
    window.addEventListener('clay_open_lesson' as any, handleOpenLesson);

    // Smoothly handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.replace('#', '');
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
      {/* Persistent Scroll Progress Indicator at the Top of Screen */}
      <ScrollProgressIndicator />

      {/* Translucent Navigation Layer */}
      <FloatingNav />

      {/* Global Auth / Profile Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Floating Audio Guide for Clay */}
      {(currentView === 'guide' || currentView === 'learning-hub') && <AudioNarrationHub />}

      {/* Floating Language Change Bubble (Bottom Right) */}
      <FloatingLanguageBubble />

      {/* Contextual 'Did You Know' Floating AI Trivia Notification (Bottom Left) */}
      <DidYouKnowNotification currentView={currentView} />

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
            />
          ) : isContinuousGuide ? (
            /* 2. Full Continuous Guide Mode */
            <main className="relative z-10 flex flex-col gap-6 pt-16">
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
            /* 3. Streamlined, Highly Professional Modular Home Page */
            <main className="relative z-10 flex flex-col gap-6">
              {/* Hero: What is Clayverse AI, Ethos & Sensory Tactile Mission */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <Hero />
              </motion.div>

              {/* Foundations: What is AI? Intro, Mental Models & 3 Horizons */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionAnimation}>
                <WhatIsAI />
                <QuickTakeaway sectionId="what-is-ai" />
                <ClayExplainer />
              </motion.div>

              {/* Dedicated Curriculum Course Modules Hub */}
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

              {/* Social Sharing Banner */}
              <SocialShareSection />
            </main>
          )}
        </>
      )}

      {/* Editorial Journal Styled Footer */}
      <footer className="bg-brand-sand/50 border-t border-brand-slate/10 py-16 relative z-10 text-left">
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
                  <Sparkles className="w-3 h-3 text-brand-amber shrink-0" />
                  <span>Tactile HUD v1.0</span>
                </span>
                <span className="flex items-center gap-1 justify-start">
                  <BookOpen className="w-3 h-3 text-brand-slate shrink-0" />
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
      </footer>
    </div>
  );
}
