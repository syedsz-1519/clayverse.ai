import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Timer,
  Zap,
  CheckCircle2, 
  Sparkles, 
  Bookmark, 
  Compass, 
  Home, 
  Share2,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  ListOrdered,
  Layers,
  Flame,
  HelpCircle,
  PlayCircle,
  Download,
  FileText,
  Trophy,
  PartyPopper,
  Focus,
  Minimize2,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { LESSON_MODULES, type LessonModule } from './HomeCurriculumGrid';
import { streakManager } from '../lib/streakManager';
import { getLessonTTSContent } from '../lib/lessonContentHelper';
import TakeawaysNotesExportModal from './TakeawaysNotesExportModal';
import LessonCompletionCelebration from './LessonCompletionCelebration';

// Import Section Subcomponents
import WhatIsAI from './WhatIsAI';
import ClayExplainer from './ClayExplainer';
import AIFamilyTree from './AIFamilyTree';
import GenerativeAI from './GenerativeAI';
import PromptingAndRAG from './PromptingAndRAG';
import AIToolsList from './AIToolsList';
import ClosingAndDeeper from './ClosingAndDeeper';
import InteractiveFlashcards from './InteractiveFlashcards';
import GoogleClassroomHub from './GoogleClassroomHub';
import AIArena from './AIArena';
import QuickTakeaway from './QuickTakeaway';
import CheckYourKnowledge from './CheckYourKnowledge';
import SocialShareSection from './SocialShareSection';
import FruitPatternPredictor from './FruitPatternPredictor';
import ClayMentorSidebar from './ClayMentorSidebar';

export interface SubTopic {
  id: string;
  titleEn: string;
  titleHyd: string;
  readMins: string;
}

export const LESSON_SUBTOPICS: Record<string, SubTopic[]> = {
  'what-is-ai': [
    { id: 'sub-concept', titleEn: '1. Concept', titleHyd: '1. Tasawwur', readMins: '1 min' },
    { id: 'sub-sandbox', titleEn: '2. Interactive Sandbox', titleHyd: '2. Interactive Sandbox', readMins: '2 min' },
    { id: 'sub-analogy', titleEn: '3. Real-World Analogy', titleHyd: '3. Rozmarra Misaal', readMins: '1 min' },
    { id: 'sub-quiz', titleEn: '4. Quiz', titleHyd: '4. Imtehan', readMins: '1 min' },
  ],
  'family-tree': [
    { id: 'sub-tree-overview', titleEn: 'AI & ML Family Tree', titleHyd: 'AI aur ML ka Shijra', readMins: '1 min' },
    { id: 'sub-paradigms', titleEn: 'Supervised vs Unsupervised', titleHyd: 'Supervised vs Unsupervised', readMins: '1 min' },
    { id: 'sub-synapses', titleEn: 'Deep Neural Synapses', titleHyd: 'Neural Network Synapse', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
    { id: 'sub-quiz', titleEn: 'Knowledge Check', titleHyd: 'Chota Imtehan', readMins: '1 min' },
  ],
  'generative-ai': [
    { id: 'sub-gen-intro', titleEn: 'Generative AI Foundation', titleHyd: 'Generative AI Buniyaad', readMins: '1 min' },
    { id: 'sub-next-token', titleEn: 'Next-Token Predictor', titleHyd: 'Next-Token Predictor', readMins: '1 min' },
    { id: 'sub-attention', titleEn: 'Transformer Attention', titleHyd: 'Transformers aur Attention', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
  ],
  'prompting-rag': [
    { id: 'sub-prompt-basics', titleEn: 'Prompting Fundamentals', titleHyd: 'Prompting ke Usool', readMins: '1 min' },
    { id: 'sub-few-shot', titleEn: 'Zero, Few-Shot & CoT', titleHyd: 'Few-Shot aur Chain-of-Thought', readMins: '1 min' },
    { id: 'sub-rag-arch', titleEn: 'RAG & Vector Retrieval', titleHyd: 'RAG aur Vector Database', readMins: '1.5 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
    { id: 'sub-quiz', titleEn: 'Knowledge Check', titleHyd: 'Chota Imtehan', readMins: '1 min' },
  ],
  'tools': [
    { id: 'sub-tools-dir', titleEn: 'Curated Software Directory', titleHyd: 'AI Tools Directory', readMins: '1.5 min' },
    { id: 'sub-categories', titleEn: 'Writing, Image, Code & Audio', titleHyd: 'Writing, Coding aur Audio', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
  ],
  'deeper': [
    { id: 'sub-12-concepts', titleEn: '12 Core Concepts', titleHyd: '12 Buniyadi Concepts', readMins: '2 min' },
    { id: 'sub-glossary', titleEn: 'Searchable Glossary (85+)', titleHyd: 'AI Glossary & Dictionary', readMins: '2 min' },
    { id: 'sub-ethics', titleEn: 'Ethics, Bias & Alignment', titleHyd: 'Ethics aur Safety', readMins: '1 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '30s' },
    { id: 'sub-quiz', titleEn: 'Knowledge Check', titleHyd: 'Chota Imtehan', readMins: '1 min' },
  ],
  'flashcards': [
    { id: 'sub-flash-deck', titleEn: 'Spaced Repetition Deck', titleHyd: 'Memory Flip Cards', readMins: '1.5 min' },
    { id: 'sub-flash-categories', titleEn: 'Category Filters', titleHyd: 'Category Filter', readMins: '1 min' },
    { id: 'sub-flash-stats', titleEn: 'Mastery Tracker', titleHyd: 'Mastery Score', readMins: '1 min' },
  ],
  'classroom-hub': [
    { id: 'sub-class-overview', titleEn: 'Classroom Coursework Hub', titleHyd: 'Coursework & Streams', readMins: '1 min' },
    { id: 'sub-badges', titleEn: 'Milestone Badges', titleHyd: 'Certified Badges', readMins: '1 min' },
    { id: 'sub-sync', titleEn: 'Sync & Share', titleHyd: 'Google Classroom Sync', readMins: '1 min' },
  ],
  'arena': [
    { id: 'sub-arena-intro', titleEn: 'Battleground Rules', titleHyd: 'Quiz ke Qawaid', readMins: '1 min' },
    { id: 'sub-arena-quiz', titleEn: 'Live Timed Challenge', titleHyd: 'Timed Challenge Quiz', readMins: '2 min' },
    { id: 'sub-arena-leaderboard', titleEn: 'Streaks & Leaderboard', titleHyd: 'Leaderboard & Points', readMins: '1 min' },
  ]
};

interface IndividualLessonViewProps {
  lessonId: string;
  onBackToHome: () => void;
  onSelectLesson: (id: string) => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  onOpenTTSReader?: (text?: string, title?: string) => void;
}

export default function IndividualLessonView({
  lessonId,
  onBackToHome,
  onSelectLesson,
  isFocusMode = false,
  onToggleFocusMode,
  onOpenTTSReader
}: IndividualLessonViewProps) {
  const { lang } = useLanguage();

  const currentIndex = LESSON_MODULES.findIndex(m => m.id === lessonId);
  const currentModule = LESSON_MODULES[currentIndex >= 0 ? currentIndex : 0];
  const prevModule = currentIndex > 0 ? LESSON_MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < LESSON_MODULES.length - 1 ? LESSON_MODULES[currentIndex + 1] : null;

  const subTopics = LESSON_SUBTOPICS[lessonId] || [
    { id: 'sub-main', titleEn: 'Main Lesson Content', titleHyd: 'Sabaq ka Mawad', readMins: '2 min' },
    { id: 'sub-takeaways', titleEn: 'Key Takeaways', titleHyd: 'Aham Nuqaat', readMins: '1 min' }
  ];

  const [activeSubTopicId, setActiveSubTopicId] = useState<string>(subTopics[0]?.id || '');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSubTopicMenuOpen, setIsSubTopicMenuOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => streakManager.isLessonCompleted(lessonId));
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);
  const [streakState, setStreakState] = useState(() => streakManager.getStreakState());
  const contentRef = useRef<HTMLDivElement>(null);
  const recordedStreakRef = useRef<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSubTopicId(subTopics[0]?.id || '');
    setScrollProgress(0);
    recordedStreakRef.current = false;
    setIsCompleted(streakManager.isLessonCompleted(lessonId));
    setStreakState(streakManager.getStreakState());
  }, [lessonId]);

  // Mark completion handler with celebration animations
  const handleToggleComplete = (manualTrigger: boolean = true) => {
    const updated = streakManager.recordLessonCompletion(lessonId);
    setIsCompleted(true);
    setStreakState(updated);
    if (manualTrigger) {
      setIsCelebrationOpen(true);
    }
  };

  // ScrollSpy & Progress Calculation
  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate overall progress for this lesson
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const current = window.scrollY;
        const progress = Math.min(100, Math.max(0, Math.round((current / totalScrollable) * 100)));
        setScrollProgress(progress);

        // Record streak completion when student scrolls through 50%+ of lesson
        if (progress >= 50 && !recordedStreakRef.current) {
          recordedStreakRef.current = true;
          const updated = streakManager.recordLessonCompletion(lessonId);
          setIsCompleted(true);
          setStreakState(updated);
        }
      }

      // 2. Identify active sub-topic based on viewport position
      const scrollPosition = window.scrollY + 180;
      for (let i = subTopics.length - 1; i >= 0; i--) {
        const topic = subTopics[i];
        const el = document.getElementById(topic.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSubTopicId(topic.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [subTopics, lessonId]);

  const scrollToSubTopic = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // accounts for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSubTopicId(id);
      setIsSubTopicMenuOpen(false);
    }
  };

  const activeIndex = Math.max(0, subTopics.findIndex(t => t.id === activeSubTopicId));
  const activeSubTopic = subTopics[activeIndex] || subTopics[0];

  const handleFocusModeClick = () => {
    if (onToggleFocusMode) {
      onToggleFocusMode();
    } else {
      window.dispatchEvent(new CustomEvent('clay_toggle_focus_mode'));
    }
  };

  const handleOpenAudioReader = () => {
    const { title, text } = getLessonTTSContent(lessonId, lang);
    if (onOpenTTSReader) {
      onOpenTTSReader(text, title);
    } else {
      window.dispatchEvent(
        new CustomEvent('clay_open_tts_reader', {
          detail: { text, title }
        })
      );
    }
  };

  return (
    <div className={`min-h-screen ${isFocusMode ? 'pt-4' : 'pt-20'} pb-20 text-left transition-all`}>
      {/* Main Container with 2-Column Responsive Layout (Sticky Sidebar + Lesson Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Lesson Content Column (Col span 8 or 9) */}
          <main ref={contentRef} className="lg:col-span-8 xl:col-span-9 space-y-10">
            
            {/* Top Control Header & Breadcrumbs */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EFE7DC]">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 font-medium">
                  <button
                    onClick={onBackToHome}
                    className="hover:text-[#A8481F] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Curriculum</span>
                  </button>
                  <span className="text-neutral-400">›</span>
                  <span className="text-neutral-500 hidden sm:inline">
                    {lang === 'en' ? currentModule.stageNameEn : currentModule.stageNameHyd}
                  </span>
                  <span className="text-neutral-400 hidden sm:inline">›</span>
                  <span className="font-semibold text-neutral-900">
                    Lesson 0{currentModule.lessonNum}: {lang === 'en' ? currentModule.titleEn : currentModule.titleHyd}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {prevModule && (
                    <button
                      onClick={() => onSelectLesson(prevModule.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#F5F0E8] border border-[#E0E0E0] text-neutral-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                      title={lang === 'en' ? `Previous: Lesson ${prevModule.lessonNum}` : "Pichla Sabaq"}
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span className="hidden md:inline">0{prevModule.lessonNum}</span>
                    </button>
                  )}

                  {nextModule && (
                    <button
                      onClick={() => onSelectLesson(nextModule.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#F5F0E8] border border-[#E0E0E0] text-neutral-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                      title={lang === 'en' ? `Next: Lesson ${nextModule.lessonNum}` : "Agla Sabaq"}
                    >
                      <span className="hidden md:inline">0{nextModule.lessonNum}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    onClick={handleOpenAudioReader}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF0EB] hover:bg-[#FAE4DA] border border-[#F6D3C5] text-[#A8481F] text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
                    title={lang === 'en' ? "Listen to this lesson using TTS Reader" : "Is sabaq ko TTS Reader se sunein"}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#A8481F] animate-pulse" />
                    <span>Audio narration active (हिन्दी / EN)</span>
                    <Volume2 className="w-3.5 h-3.5 text-[#A8481F] ms-0.5 group-hover:scale-110 transition-transform" />
                  </button>

                  <button
                    onClick={onBackToHome}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F5F0E8] border border-[#E0E0E0] text-neutral-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>{lang === 'en' ? "All Lessons" : "Sabaq"}</span>
                  </button>
                </div>
              </div>

              {/* Subtopic Stepper & Progress Bar */}
              <div className="mt-4 pb-4 border-b border-[#EFE7DC]">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap font-bold">
                    {subTopics.map((topic, index) => {
                      const isActive = topic.id === activeSubTopicId;
                      const isPassed = index < activeIndex || isCompleted;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => scrollToSubTopic(topic.id)}
                          className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all cursor-pointer text-xs ${
                            isActive
                              ? 'text-[#A8481F] font-extrabold bg-[#FDF0EB] border border-[#F6D3C5]'
                              : isPassed
                              ? 'text-emerald-700 hover:text-emerald-800'
                              : 'text-neutral-500 hover:text-neutral-800'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : isActive ? (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#A8481F] flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#A8481F]" />
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border border-neutral-400" />
                          )}
                          <span>{index + 1}. {lang === 'en' ? topic.titleEn : topic.titleHyd}</span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="font-display font-bold text-neutral-800 text-xs sm:text-sm">
                    {isCompleted ? '100% Completed' : `${Math.max(15, scrollProgress)}% Complete`}
                  </span>
                </div>

                {/* Terracotta progress bar directly underneath */}
                <div className="w-full h-1.5 bg-[#EAE0D5] rounded-full overflow-hidden mt-2.5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#A8481F] to-[#C1622D] rounded-full transition-all duration-300" 
                    style={{ width: `${isCompleted ? 100 : Math.max(15, scrollProgress)}%` }}
                  />
                </div>
              </div>

              {/* Lesson Hero Banner */}
              <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-brand-sand/40 to-brand-sand/70 border border-brand-amber/20 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-charcoal text-white font-mono text-[11px] font-black uppercase tracking-wider">
                        Lesson 0{currentModule.lessonNum}
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-amber uppercase tracking-wider">
                        {lang === 'en' ? currentModule.categoryEn : currentModule.categoryHyd}
                      </span>
                      <span className="text-brand-slate/40 hidden sm:inline">•</span>
                      
                      {/* Prominent Estimated Reading Time Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-amber/15 border border-brand-amber/35 text-brand-charcoal text-xs font-mono font-bold shadow-2xs">
                        <Timer className="w-3.5 h-3.5 text-brand-amber" />
                        <span>
                          {lang === 'en' ? "Est. Reading Time:" : lang === 'te' ? "అంచనా పఠన సమయం:" : "Padhne ka Waqt:"} 
                        </span>
                        <strong className="text-brand-amber-dark">{currentModule.readTime}</strong>
                      </div>
                    </div>

                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-brand-charcoal tracking-tight">
                      {lang === 'en' ? currentModule.titleEn : currentModule.titleHyd}
                    </h1>

                    <p className="text-xs sm:text-sm text-brand-slate max-w-2xl leading-relaxed">
                      {lang === 'en' ? currentModule.subtitleEn : currentModule.subtitleHyd}
                    </p>
                  </div>

                  {/* Lesson Progress Badge & Mark Complete CTA */}
                  <div className="flex flex-row sm:flex-col items-stretch sm:items-center gap-2.5 shrink-0">
                    <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-brand-amber/30 shrink-0 shadow-xs min-w-[130px]">
                      <span className="text-[10px] font-mono font-bold text-brand-muted uppercase">
                        {lang === 'en' ? "Curriculum Progress" : "Course Progress"}
                      </span>
                      <span className="font-mono font-black text-xl text-brand-amber mt-0.5">
                        {currentModule.lessonNum} / {LESSON_MODULES.length}
                      </span>
                      <div className="w-24 h-1.5 bg-brand-slate/15 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-brand-amber rounded-full transition-all duration-500"
                          style={{ width: `${(currentModule.lessonNum / LESSON_MODULES.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Interactive Mark Complete Motion Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleToggleComplete(true)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                        isCompleted 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-600 shadow-emerald-500/20' 
                          : 'bg-brand-charcoal hover:bg-black text-white'
                      }`}
                    >
                      <motion.div
                        initial={false}
                        animate={{ scale: isCompleted ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : 'text-emerald-400'}`} />
                      </motion.div>
                      <span>
                        {isCompleted 
                          ? (lang === 'en' ? 'Completed ✓' : 'Mukammal ✓') 
                          : (lang === 'en' ? 'Mark Completed' : 'Mukammal Karein')}
                      </span>
                    </motion.button>
                  </div>
                </div>

                {/* Estimated Study Metrics & Reading Gauge Strip */}
                <div className="pt-4 border-t border-brand-slate/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white/90 border border-brand-slate/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-amber/15 text-brand-amber flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase text-brand-muted font-bold">
                        {lang === 'en' ? "Total Read Time" : "Kul Waqt"}
                      </span>
                      <span className="font-black text-brand-charcoal truncate block">
                        ~{currentModule.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/90 border border-brand-slate/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase text-brand-muted font-bold">
                        {lang === 'en' ? "Sub-Topics" : "Hissay"}
                      </span>
                      <span className="font-black text-brand-charcoal truncate block">
                        {subTopics.length} {lang === 'en' ? "Sections" : "Sections"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/90 border border-brand-slate/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase text-brand-muted font-bold">
                        {lang === 'en' ? "Reading Pace" : "Raftaar"}
                      </span>
                      <span className="font-black text-brand-charcoal truncate block">
                        ~180-220 wpm
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/90 border border-brand-slate/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase text-brand-muted font-bold">
                        {lang === 'en' ? "Difficulty" : "Darja"}
                      </span>
                      <span className="font-black text-emerald-700 truncate block">
                        {lang === 'en' ? "Beginner Safe" : "Bina Math ke"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Topics Interactive Container */}
            <div className="space-y-12">
              {lessonId === 'what-is-ai' && (
                <div className="space-y-10">
                  {/* 1. Theory Card: What Actually is Artificial Intelligence? */}
                  <div id="sub-concept" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DC] shadow-xs text-left scroll-mt-24 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] font-medium text-xs">
                        Lesson 1.1
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        • 4 min read & tinker
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1E1E] tracking-tight">
                      What Actually is Artificial Intelligence?
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                      In traditional programming, you act like a strict master chef writing down every single rule:{' '}
                      <code className="font-mono text-xs bg-[#F5F5F5] border border-[#E0E0E0] px-2 py-0.5 rounded text-[#C1622D] font-bold">
                        IF weight &gt; 250g AND color == #FFB800
                      </code>.
                    </p>

                    {/* Highlight Box: The Alphonso Mango Metaphor */}
                    <div className="bg-[#FFF5EE] border border-[#FAD9C3] rounded-2xl p-5 sm:p-6 my-4">
                      <div className="flex items-center gap-2 text-[#A8481F] font-bold text-base mb-2">
                        <Sparkles className="w-4 h-4 text-[#A8481F]" />
                        <span>The Alphonso Mango Metaphor</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#424242] leading-relaxed">
                        Think of AI like teaching your friend to recognize ripe mangoes: instead of memorizing 10,000 complicated botanical rules, you simply place{' '}
                        <strong className="font-bold text-[#1E1E1E]">100 sweet mangoes</strong> in front of them. With every single fruit, their brain detects tiny subtle patterns—the gentle softness, honeyed fragrance, and saffron hue.
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                      That's machine learning in pure desi terms! No rigid code handcrafting, just statistical intuition molded by sheer experience.
                    </p>
                  </div>

                  {/* 2. Interactive Sandbox: The Fruit Pattern Predictor */}
                  <div id="sub-sandbox" className="scroll-mt-24">
                    <FruitPatternPredictor />
                  </div>

                  {/* 3. Real-World Analogy */}
                  <div id="sub-analogy" className="scroll-mt-24 space-y-8">
                    <WhatIsAI />
                    <ClayExplainer />
                    <QuickTakeaway sectionId="what-is-ai" />
                  </div>

                  {/* 4. Quiz */}
                  <div id="sub-quiz" className="scroll-mt-24">
                    <CheckYourKnowledge sectionId="basics" />
                  </div>
                </div>
              )}

              {lessonId === 'family-tree' && (
                <div className="space-y-10">
                  <div id="sub-tree-overview" className="scroll-mt-24">
                    <AIFamilyTree />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="family-tree" />
                  </div>
                  <div id="sub-quiz" className="scroll-mt-24">
                    <CheckYourKnowledge sectionId="family-tree" />
                  </div>
                </div>
              )}

              {lessonId === 'generative-ai' && (
                <div className="space-y-10">
                  <div id="sub-gen-intro" className="scroll-mt-24">
                    <GenerativeAI />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="generative-ai" />
                  </div>
                </div>
              )}

              {lessonId === 'prompting-rag' && (
                <div className="space-y-10">
                  <div id="sub-prompt-basics" className="scroll-mt-24">
                    <PromptingAndRAG />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="prompting-rag" />
                  </div>
                  <div id="sub-quiz" className="scroll-mt-24">
                    <CheckYourKnowledge sectionId="prompting-rag" />
                  </div>
                </div>
              )}

              {lessonId === 'tools' && (
                <div className="space-y-10">
                  <div id="sub-tools-dir" className="scroll-mt-24">
                    <AIToolsList />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="tools" />
                  </div>
                </div>
              )}

              {lessonId === 'deeper' && (
                <div className="space-y-10">
                  <div id="sub-12-concepts" className="scroll-mt-24">
                    <ClosingAndDeeper />
                  </div>
                  <div id="sub-takeaways" className="scroll-mt-24">
                    <QuickTakeaway sectionId="deeper" />
                  </div>
                  <div id="sub-quiz" className="scroll-mt-24">
                    <CheckYourKnowledge sectionId="deeper" />
                  </div>
                </div>
              )}

              {lessonId === 'flashcards' && (
                <div className="space-y-10">
                  <div id="sub-flash-deck" className="scroll-mt-24">
                    <InteractiveFlashcards />
                  </div>
                </div>
              )}

              {lessonId === 'classroom-hub' && (
                <div className="space-y-10">
                  <div id="sub-class-overview" className="scroll-mt-24">
                    <GoogleClassroomHub />
                  </div>
                </div>
              )}

              {lessonId === 'arena' && (
                <div className="space-y-10">
                  <div id="sub-arena-intro" className="scroll-mt-24">
                    <AIArena />
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Lesson Completion Milestone Box with Progress Ring */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-brand-sand/30 to-amber-500/5 border-2 border-brand-amber/30 shadow-md relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Animated Circular Progress Ring Preview */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-16 h-16 rotate-[-90deg]">
                      <circle
                        cx="32"
                        cy="32"
                        r="25"
                        stroke="#E5E7EB"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="25"
                        stroke="#10B981"
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 25}
                        strokeDashoffset={isCompleted ? 0 : 2 * Math.PI * 25 * (1 - scrollProgress / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-emerald-600"
                        >
                          <CheckCircle2 className="w-7 h-7" />
                        </motion.div>
                      ) : (
                        <span className="font-mono text-xs font-black text-brand-charcoal">
                          {scrollProgress}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-brand-amber font-mono text-[10px] font-bold uppercase">
                        Lesson 0{currentModule.lessonNum} Mastery
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 font-mono text-[10px] font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          Mastered
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-black text-brand-charcoal">
                      {isCompleted
                        ? (lang === 'en' ? "Lesson Completed! 🎉" : "Sabaq Mukammal Hua! 🎉")
                        : (lang === 'en' ? "Finished Reading this Lesson?" : "Kya aapne ye sabaq parh liya?")}
                    </h3>
                    <p className="text-xs text-brand-slate max-w-md">
                      {isCompleted
                        ? (lang === 'en' ? "Your streak has been boosted and your progress is securely saved." : "Aapka streak barh gaya hai aur progress save ho gayi hai.")
                        : (lang === 'en' ? "Mark this lesson as completed to claim +50 XP and advance your daily streak." : "50 XP haasil karne aur streak barhane ke liye complete par click karein.")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleToggleComplete(true)}
                    className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
                        : 'bg-brand-charcoal hover:bg-black text-white shadow-brand-charcoal/20'
                    }`}
                  >
                    <PartyPopper className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-brand-amber'}`} />
                    <span>
                      {isCompleted
                        ? (lang === 'en' ? "Replay Celebration 🎉" : "Jashn Phir Se Dekhein 🎉")
                        : (lang === 'en' ? "Mark Lesson as Completed ✓" : "Sabaq Mukammal Mark Karein ✓")}
                    </span>
                  </motion.button>

                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-white hover:bg-brand-sand border border-brand-slate/20 text-brand-charcoal text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? "Export Takeaways" : "Notes Export"}</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Social Sharing Component at the End of Every Lesson */}
            <SocialShareSection currentChapterTitle={lang === 'en' ? currentModule.titleEn : currentModule.titleHyd} />

            {/* Bottom Lesson Pagination (Prev / Next) */}
            <div className="pt-8 border-t border-brand-slate/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevModule ? (
                <button
                  onClick={() => onSelectLesson(prevModule.id)}
                  className="w-full sm:w-auto flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-brand-sand border border-brand-slate/15 hover:border-brand-amber/40 text-left shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="p-2 rounded-xl bg-brand-sand text-brand-charcoal group-hover:bg-brand-amber group-hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-muted uppercase block">
                      {lang === 'en' ? "Previous Lesson" : "Pichla Sabaq"}
                    </span>
                    <span className="font-display text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                      0{prevModule.lessonNum}. {lang === 'en' ? prevModule.titleEn : prevModule.titleHyd}
                    </span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextModule ? (
                <button
                  onClick={() => onSelectLesson(nextModule.id)}
                  className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 p-4 rounded-2xl bg-white hover:bg-brand-sand border border-brand-slate/15 hover:border-brand-amber/40 text-right shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-muted uppercase block">
                      {lang === 'en' ? "Next Lesson" : "Agla Sabaq"}
                    </span>
                    <span className="font-display text-xs sm:text-sm font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                      0{nextModule.lessonNum}. {lang === 'en' ? nextModule.titleEn : nextModule.titleHyd}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-brand-amber text-white group-hover:bg-amber-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={onBackToHome}
                  className="w-full sm:w-auto flex items-center gap-2 px-6 py-4 rounded-2xl bg-brand-charcoal hover:bg-brand-charcoal/90 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'en' ? "Course Completed! Back to Overview" : "Mukammal Hua! Wapis Jayein"}</span>
                </button>
              )}
            </div>
          </main>

          {/* 2. Desktop Sticky Sidebar (TOC & Real-time Progress Monitor) */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-28 self-start space-y-4">
            {/* Clay Mentor Voice & Jargon Buster Sidebar Card */}
            <ClayMentorSidebar onOpenTTS={handleOpenAudioReader} />

            <div className="p-5 rounded-3xl bg-white border border-brand-slate/15 shadow-sm space-y-4">
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-brand-slate/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-brand-amber/15 text-brand-amber">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-muted uppercase block">
                      {lang === 'en' ? "Lesson Outline" : "Sabaq ka Khaka"}
                    </span>
                    <span className="font-display text-xs font-bold text-brand-charcoal">
                      {subTopics.length} {lang === 'en' ? "Sub-Topics" : "Hissay"}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-black text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-md">
                  {scrollProgress}%
                </span>
              </div>

              {/* Progress Bar in Sidebar */}
              <div className="w-full h-1.5 bg-brand-slate/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-amber rounded-full transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              {/* Quick Completion Action Card in Sidebar */}
              <div className="p-3 rounded-2xl bg-brand-sand/40 border border-brand-slate/15 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-brand-charcoal flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? "Lesson Status" : "Sabaq ki Halat"}</span>
                  </span>
                  {isCompleted ? (
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {lang === 'en' ? "Completed" : "Mukammal"}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold bg-brand-slate/10 text-brand-muted px-2 py-0.5 rounded-md">
                      {lang === 'en' ? "In Progress" : "Jari"}
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleToggleComplete(true)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isCompleted 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-brand-charcoal text-white hover:bg-black shadow-xs'
                  }`}
                >
                  <PartyPopper className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-brand-amber'}`} />
                  <span>
                    {isCompleted 
                      ? (lang === 'en' ? "View Celebration 🎉" : "Jashn Manayein") 
                      : (lang === 'en' ? "Complete (+50 XP)" : "Mukammal Karein")}
                  </span>
                </motion.button>
              </div>

              {/* Step-by-Step Subtopics List */}
              <div className="space-y-1.5">
                {subTopics.map((topic, index) => {
                  const isActive = topic.id === activeSubTopicId;
                  const isPassed = index < activeIndex;

                  return (
                    <button
                      key={topic.id}
                      onClick={() => scrollToSubTopic(topic.id)}
                      className={`w-full p-2.5 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                        isActive
                          ? 'bg-brand-charcoal text-white shadow-xs font-bold scale-[1.02]'
                          : isPassed
                          ? 'bg-brand-sand/40 hover:bg-brand-sand text-brand-charcoal'
                          : 'text-brand-slate hover:bg-brand-sand/50 hover:text-brand-charcoal'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isPassed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <span className={`w-5 h-5 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-brand-amber text-white' : 'bg-brand-slate/15 text-brand-muted group-hover:bg-brand-slate/25'
                          }`}>
                            0{index + 1}
                          </span>
                        )}

                        <span className={`text-xs truncate ${isActive ? 'text-white' : 'text-brand-charcoal'}`}>
                          {lang === 'en' ? topic.titleEn : topic.titleHyd}
                        </span>
                      </div>

                      <span className={`text-[9.5px] font-mono shrink-0 ${
                        isActive ? 'text-brand-sand/70' : 'text-brand-muted'
                      }`}>
                        {topic.readMins}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Fast Jump Card / Shortcuts */}
              <div className="pt-3 border-t border-brand-slate/10 flex flex-col gap-2">
                <button
                  onClick={handleOpenAudioReader}
                  className="flex items-center justify-between p-2 rounded-xl bg-brand-amber/10 hover:bg-brand-amber/20 border border-brand-amber/25 text-xs font-bold text-brand-charcoal dark:text-amber-200 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? "Listen in TTS Reader" : "TTS Reader me Sunein"}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-brand-amber uppercase">Audio</span>
                </button>

                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center justify-between p-2 rounded-xl bg-brand-charcoal hover:bg-black text-xs font-bold text-white transition-colors cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? "Export Notes & PDF" : "Notes Export Karein"}</span>
                  </span>
                  <FileText className="w-3.5 h-3.5 text-brand-amber" />
                </button>

                <button
                  onClick={() => {
                    const quizEl = document.getElementById('sub-quiz') || document.getElementById('sub-takeaways');
                    if (quizEl) {
                      quizEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center justify-between p-2 rounded-xl bg-brand-sand/60 hover:bg-brand-sand text-xs font-bold text-brand-charcoal transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? "Jump to Quiz & Notes" : "Quiz par Jayein"}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
                </button>

                {nextModule && (
                  <button
                    onClick={() => onSelectLesson(nextModule.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-brand-amber transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Next: 0{nextModule.lessonNum}. {lang === 'en' ? nextModule.titleEn : nextModule.titleHyd}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Quick Takeaways & Personal Knowledge Notes Export Modal */}
      <TakeawaysNotesExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        initialLessonId={lessonId}
      />

      {/* Lesson Completion Celebration Modal & Confetti Ring */}
      <LessonCompletionCelebration
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        lesson={currentModule}
        nextLesson={nextModule}
        onNextLesson={() => {
          if (nextModule) {
            onSelectLesson(nextModule.id);
          }
        }}
        onExportNotes={() => setIsExportModalOpen(true)}
        streakCount={streakState.currentStreak}
      />
    </div>
  );
}
