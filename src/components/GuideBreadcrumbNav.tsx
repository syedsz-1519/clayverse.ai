import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles,
  Flame,
  LayoutGrid,
  Clock,
  Compass,
  FileText,
  Share2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { streakManager } from '../lib/streakManager';
import { audioEngine } from '../lib/audioEngine';
import { LESSON_MODULES, type LessonModule } from './HomeCurriculumGrid';

interface GuideBreadcrumbNavProps {
  currentLessonId: string | null;
  isContinuousGuide: boolean;
  onNavigateHome: () => void;
  onSelectLesson: (lessonId: string) => void;
  onToggleContinuousGuide: (enable: boolean) => void;
}

export default function GuideBreadcrumbNav({
  currentLessonId,
  isContinuousGuide,
  onNavigateHome,
  onSelectLesson,
  onToggleContinuousGuide
}: GuideBreadcrumbNavProps) {
  const { lang, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBarHovered, setIsBarHovered] = useState(false);
  const [hoverPercentage, setHoverPercentage] = useState<number | null>(null);
  const [hoverPositionX, setHoverPositionX] = useState<number>(0);
  const [isCopiedOrShared, setIsCopiedOrShared] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll position for the active lesson reading progress
  useEffect(() => {
    const calculateScrollProgress = () => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(100, Math.max(0, (currentScroll / totalScrollable) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    window.addEventListener('resize', calculateScrollProgress, { passive: true });
    calculateScrollProgress();

    return () => {
      window.removeEventListener('scroll', calculateScrollProgress);
      window.removeEventListener('resize', calculateScrollProgress);
    };
  }, [currentLessonId, isContinuousGuide]);

  // Click on progress bar track to smoothly scrub / jump to that part of the lesson
  const handleProgressTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScrollable > 0) {
      window.scrollTo({
        top: ratio * totalScrollable,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    setHoverPercentage(Math.round(ratio * 100));
    setHoverPositionX(x);
  };

  const currentModule = LESSON_MODULES.find(m => m.id === currentLessonId) || null;
  const currentIndex = currentModule ? LESSON_MODULES.findIndex(m => m.id === currentModule.id) : -1;
  const prevModule = currentIndex > 0 ? LESSON_MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < LESSON_MODULES.length - 1 ? LESSON_MODULES[currentIndex + 1] : null;

  // Calculate completed stats
  const completedCount = LESSON_MODULES.filter(m => streakManager.isLessonCompleted(m.id)).length;
  const progressPercent = Math.round((completedCount / LESSON_MODULES.length) * 100);

  // Stages grouping
  const stage1Lessons = LESSON_MODULES.filter(m => m.stage === 1);
  const stage2Lessons = LESSON_MODULES.filter(m => m.stage === 2);
  const stage3Lessons = LESSON_MODULES.filter(m => m.stage === 3);

  const getStageTitle = (stage: number) => {
    if (stage === 1) return lang === 'en' ? 'Stage 1: Core Foundations' : 'Marhala 1: Buniyaad';
    if (stage === 2) return lang === 'en' ? 'Stage 2: Applied AI & RAG' : 'Marhala 2: Applied AI';
    return lang === 'en' ? 'Stage 3: Mastery & Certification' : 'Marhala 3: Mastery';
  };

  // Web Share API handler to share the current lesson's URL and title
  const handleShareLesson = async () => {
    audioEngine.playPop();

    const lessonTitle = currentModule 
      ? (lang === 'en' ? currentModule.titleEn : currentModule.titleHyd)
      : (lang === 'en' ? 'Complete AI Curriculum' : 'Mukammal AI Syllabus');

    const shareTitle = currentModule 
      ? `Lesson 0${currentModule.lessonNum}: ${lessonTitle} — Clayverse AI`
      : `Clayverse AI — Master Artificial Intelligence`;

    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#${currentModule ? currentModule.id : 'guide'}`
      : '';

    const shareText = currentModule
      ? (lang === 'en'
          ? `Explore Lesson 0${currentModule.lessonNum}: "${currentModule.titleEn}" with zero-math interactive visual models on Clayverse AI.`
          : `Seekhein Sabaq 0${currentModule.lessonNum}: "${currentModule.titleHyd}" Clayverse AI par.`)
      : (lang === 'en'
          ? 'Learn Artificial Intelligence with zero-math interactive mental models on Clayverse AI.'
          : 'Seekhein Artificial Intelligence Clayverse AI par.');

    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    const copyToClipboard = (urlToCopy: string) => {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(urlToCopy).then(() => {
          setIsCopiedOrShared(true);
          setTimeout(() => setIsCopiedOrShared(false), 2500);
        }).catch(() => {
          // If clipboard access is restricted
        });
      }
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setIsCopiedOrShared(true);
        setTimeout(() => setIsCopiedOrShared(false), 2500);
      } catch (err: any) {
        // Only fallback to clipboard if not intentionally aborted/cancelled by user
        if (err?.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback if Web Share API is not supported in this browser
      copyToClipboard(shareUrl);
    }
  };

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className="sticky top-14 sm:top-16 z-35 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-2xs transition-all relative select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        
        {/* Left: Breadcrumbs Trail */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          
          {/* Root Link: Home / Curriculum */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onNavigateHome();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
            title={lang === 'en' ? "Return to Curriculum Overview" : "Home Overview par Wapis"}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'en' ? "Curriculum" : "Syllabus"}</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600 shrink-0" />

          {/* If inside an individual lesson */}
          {currentModule ? (
            <>
              {/* Stage Badge (Desktop) */}
              <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 shrink-0">
                <span className={`w-2 h-2 rounded-full ${
                  currentModule.stage === 1 ? 'bg-amber-500' : currentModule.stage === 2 ? 'bg-blue-500' : 'bg-emerald-500'
                }`} />
                <span className="truncate max-w-[140px] lg:max-w-[180px]">
                  {lang === 'en' ? currentModule.stageNameEn : currentModule.stageNameHyd}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600 shrink-0 ml-0.5" />
              </div>

              {/* Active Lesson Dropdown Selector */}
              <div className="relative min-w-0" ref={dropdownRef}>
                <button
                  onClick={() => {
                    audioEngine.playPop();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 border border-amber-500/30 text-xs font-bold transition-all truncate cursor-pointer group"
                >
                  <span className="w-4 h-4 rounded bg-amber-600 dark:bg-amber-500 text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                    0{currentModule.lessonNum}
                  </span>
                  <span className="truncate max-w-[160px] sm:max-w-[240px] md:max-w-[320px]">
                    {lang === 'en' ? currentModule.titleEn : currentModule.titleHyd}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu for Quick Jumping between Lessons */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1.5 w-80 sm:w-96 max-h-[75vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-2 z-50 text-left"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                          {lang === 'en' ? "Jump to Lesson (1-9)" : "Kisi Sabaq Par Jayein"}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          {completedCount}/{LESSON_MODULES.length} Done
                        </span>
                      </div>

                      <div className="py-1 space-y-3">
                        {/* Stage 1 */}
                        <div>
                          <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-black uppercase text-amber-600 dark:text-amber-400">
                            {getStageTitle(1)}
                          </div>
                          <div className="space-y-0.5">
                            {stage1Lessons.map((m) => {
                              const isCompleted = streakManager.isLessonCompleted(m.id);
                              const isCurrent = m.id === currentLessonId;
                              return (
                                <button
                                  key={m.id}
                                  onClick={() => {
                                    audioEngine.playLoFiChord();
                                    onSelectLesson(m.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                      : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <span className={`w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                      isCurrent ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                                    }`}>
                                      0{m.lessonNum}
                                    </span>
                                    <span className="truncate">{lang === 'en' ? m.titleEn : m.titleHyd}</span>
                                  </div>
                                  {isCompleted && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Stage 2 */}
                        <div>
                          <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-black uppercase text-blue-600 dark:text-blue-400">
                            {getStageTitle(2)}
                          </div>
                          <div className="space-y-0.5">
                            {stage2Lessons.map((m) => {
                              const isCompleted = streakManager.isLessonCompleted(m.id);
                              const isCurrent = m.id === currentLessonId;
                              return (
                                <button
                                  key={m.id}
                                  onClick={() => {
                                    audioEngine.playLoFiChord();
                                    onSelectLesson(m.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                                      : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <span className={`w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                      isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                                    }`}>
                                      0{m.lessonNum}
                                    </span>
                                    <span className="truncate">{lang === 'en' ? m.titleEn : m.titleHyd}</span>
                                  </div>
                                  {isCompleted && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Stage 3 */}
                        <div>
                          <div className="px-3 pt-2 pb-1 text-[10px] font-mono font-black uppercase text-emerald-600 dark:text-emerald-400">
                            {getStageTitle(3)}
                          </div>
                          <div className="space-y-0.5">
                            {stage3Lessons.map((m) => {
                              const isCompleted = streakManager.isLessonCompleted(m.id);
                              const isCurrent = m.id === currentLessonId;
                              return (
                                <button
                                  key={m.id}
                                  onClick={() => {
                                    audioEngine.playLoFiChord();
                                    onSelectLesson(m.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                      : 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <span className={`w-5 h-5 rounded-md font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                      isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                                    }`}>
                                      0{m.lessonNum}
                                    </span>
                                    <span className="truncate">{lang === 'en' ? m.titleEn : m.titleHyd}</span>
                                  </div>
                                  {isCompleted && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : isContinuousGuide ? (
            /* Continuous Guide Mode Breadcrumb */
            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-bold truncate">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {lang === 'en' ? "Continuous Full Syllabus (9 Chapters)" : "Mukammal Sabaq (9 Chapters)"}
              </span>
            </div>
          ) : (
            /* Home / Modular Overview Breadcrumb */
            <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-xs font-bold truncate">
              <LayoutGrid className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">
                {lang === 'en' ? "Master 9-Step AI Curriculum" : "9 Asbaaq AI Syllabus"}
              </span>
            </div>
          )}
        </div>

        {/* Right: Step Controls & Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Prev / Next Lesson Buttons when in a Lesson */}
          {currentModule ? (
            <div className="flex items-center gap-1">
              <button
                disabled={!prevModule}
                onClick={() => {
                  if (prevModule) {
                    audioEngine.playClick();
                    onSelectLesson(prevModule.id);
                  }
                }}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  prevModule
                    ? 'hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer border border-slate-200 dark:border-zinc-700'
                    : 'opacity-40 text-slate-400 dark:text-zinc-600 cursor-not-allowed border border-transparent'
                }`}
                title={prevModule ? `Previous: ${prevModule.titleEn}` : 'First Lesson'}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'en' ? "Prev" : "Peeche"}</span>
              </button>

              <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-zinc-500 px-1 hidden xs:inline">
                {currentModule.lessonNum}/9
              </span>

              <button
                disabled={!nextModule}
                onClick={() => {
                  if (nextModule) {
                    audioEngine.playLoFiChord();
                    onSelectLesson(nextModule.id);
                  }
                }}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  nextModule
                    ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 cursor-pointer'
                    : 'opacity-40 text-slate-400 dark:text-zinc-600 cursor-not-allowed border border-transparent'
                }`}
                title={nextModule ? `Next: ${nextModule.titleEn}` : 'Last Lesson'}
              >
                <span className="hidden sm:inline">{lang === 'en' ? "Next" : "Aage"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Home / Continuous Mode Switcher */
            <button
              onClick={() => {
                audioEngine.playClick();
                onToggleContinuousGuide(!isContinuousGuide);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {isContinuousGuide ? (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">{lang === 'en' ? "Modular Grid" : "Modular Grid"}</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span className="hidden sm:inline">{lang === 'en' ? "Continuous Reader" : "Continuous View"}</span>
                </>
              )}
            </button>
          )}

          {/* Active Lesson / Continuous Mode Reading Progress Percentage Badge */}
          {(currentModule || isContinuousGuide) && (
            <div 
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all border shrink-0 ${
                scrollProgress >= 98
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
              }`}
              title={
                lang === 'en'
                  ? `Reading progress: ${Math.round(scrollProgress)}% scrolled`
                  : `Sabaq progress: ${Math.round(scrollProgress)}% padha gaya`
              }
            >
              {scrollProgress >= 98 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              )}
              <span className="tabular-nums">{Math.round(scrollProgress)}%</span>
              <span className="text-[10px] font-sans font-semibold text-slate-500 dark:text-zinc-400 hidden sm:inline">
                {scrollProgress >= 98 
                  ? (lang === 'en' ? 'Completed' : 'Mukammal') 
                  : (lang === 'en' ? 'Read' : 'Padha')}
              </span>
            </div>
          )}

          {/* Share Lesson Button (uses Web Share API with clipboard fallback) */}
          <button
            id="guide-share-lesson-btn"
            onClick={handleShareLesson}
            className="px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 cursor-pointer shadow-2xs group shrink-0"
            title={
              lang === 'en' 
                ? (currentModule ? `Share Lesson: ${currentModule.titleEn}` : 'Share Lesson') 
                : 'Sabaq Share Karein'
            }
            aria-label="Share Lesson"
          >
            {isCopiedOrShared ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{lang === 'en' ? 'Link Copied!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 shrink-0 transition-colors" />
                <span className="hidden xs:inline">Share Lesson</span>
              </>
            )}
          </button>

          {/* Overall Progress Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-zinc-800 text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{progressPercent}% Mastered</span>
          </div>
        </div>

      </div>

      {/* Visual Reading Progress Percentage Bar at the Bottom of Breadcrumb Container */}
      <div 
        ref={progressBarRef}
        onMouseEnter={() => setIsBarHovered(true)}
        onMouseLeave={() => {
          setIsBarHovered(false);
          setHoverPercentage(null);
        }}
        onMouseMove={handleMouseMove}
        onClick={handleProgressTrackClick}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={
          lang === 'en' 
            ? `Lesson scroll progress: ${Math.round(scrollProgress)}%` 
            : `Sabaq scroll progress: ${Math.round(scrollProgress)}%`
        }
        title={
          lang === 'en'
            ? `Lesson scroll progress: ${Math.round(scrollProgress)}% (click to jump)`
            : `Sabaq scroll progress: ${Math.round(scrollProgress)}% (jump karne ke liye click karein)`
        }
        className="absolute bottom-0 left-0 right-0 h-1 sm:h-[4.5px] hover:h-2 bg-slate-200/60 dark:bg-zinc-800/80 cursor-pointer overflow-hidden transition-all duration-200 group/bar z-20"
      >
        {/* Animated Progress Fill */}
        <div 
          className={`h-full transition-all duration-150 ease-out relative ${
            scrollProgress >= 98
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
          }`}
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Subtle glowing leading pulse head */}
          {scrollProgress > 1 && scrollProgress < 99 && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,1)] animate-pulse" />
          )}
        </div>
      </div>

      {/* Floating Hover Percentage Tooltip along the bar */}
      <AnimatePresence>
        {isBarHovered && hoverPercentage !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute bottom-3 z-50 transform -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-[10px] font-mono font-bold shadow-lg backdrop-blur-xs whitespace-nowrap"
            style={{ 
              left: `${Math.max(28, Math.min(progressBarRef.current ? progressBarRef.current.clientWidth - 28 : 50, hoverPositionX))}px` 
            }}
          >
            {hoverPercentage}%
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
