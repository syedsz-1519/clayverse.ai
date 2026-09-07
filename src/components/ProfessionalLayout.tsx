import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, BookOpen, BarChart3, Lock, Star, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import { LESSON_MODULES } from './HomeCurriculumGrid';

interface ProfessionalLayoutProps {
  children: React.ReactNode;
  currentLessonId?: string | null;
  onSelectLesson: (lessonId: string) => void;
  isMobileOpen?: boolean;
  onMobileToggle?: (open: boolean) => void;
}

export interface LessonProgress {
  id: string;
  completed: boolean;
  progress: number; // 0-100
  lastVisited?: number;
}

export const ProfessionalLayout: React.FC<ProfessionalLayoutProps> = ({
  children,
  currentLessonId,
  onSelectLesson,
  isMobileOpen = false,
  onMobileToggle
}) => {
  const { lang, t, dir } = useLanguageMultilingual();
  const [expandedSections, setExpandedSections] = useState<string[]>(['all']);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>(() => {
    try {
      const saved = localStorage.getItem('clay_lesson_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Group lessons by difficulty
  const lessonsByDifficulty = useMemo(() => {
    return {
      beginner: LESSON_MODULES.filter(m => m.difficulty === 'Beginner'),
      intermediate: LESSON_MODULES.filter(m => m.difficulty === 'Intermediate'),
      advanced: LESSON_MODULES.filter(m => m.difficulty === 'Advanced'),
    };
  }, []);

  const totalLessons = LESSON_MODULES.length;
  const completedLessons = Object.values(lessonProgress).filter(p => p.completed).length;
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getLessonDifficulty = (lessonId: string) => {
    return LESSON_MODULES.find(m => m.id === lessonId)?.difficulty || 'Beginner';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-300';
      case 'Intermediate': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  // Left Sidebar - Lessons Navigator
  const LeftSidebar = () => (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-brand-charcoal mb-2">Lessons</h3>
        <div className="text-xs text-brand-muted mb-3">
          {lang === 'en' ? `${completedLessons} of ${totalLessons} completed` : `${completedLessons} / ${totalLessons} पूर्ण`}
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-brand-amber to-orange-500 h-full"
          />
        </div>
        <div className="text-xs font-bold text-brand-amber mt-2">{overallProgress}% Complete</div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {Object.entries(lessonsByDifficulty).map(([difficulty, lessons]) => (
            <div key={difficulty} className="border-b border-slate-100 last:border-b-0">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(difficulty)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-sm text-brand-charcoal capitalize">
                  {difficulty} ({lessons.length})
                </span>
                <motion.div
                  animate={{ rotate: expandedSections.includes(difficulty) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-brand-slate" />
                </motion.div>
              </button>

              {/* Lessons in Section */}
              <AnimatePresence>
                {expandedSections.includes(difficulty) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {lessons.map((lesson, idx) => {
                      const progress = lessonProgress[lesson.id];
                      const isActive = currentLessonId === lesson.id;
                      const isCompleted = progress?.completed || false;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => onSelectLesson(lesson.id)}
                          className={`w-full px-6 py-3 text-left flex items-start gap-3 border-l-4 transition-all ${
                            isActive
                              ? 'bg-brand-amber/10 border-l-brand-amber'
                              : 'border-l-transparent hover:bg-slate-50'
                          }`}
                        >
                          {/* Lesson Number & Lock/Check Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white">
                                {idx + 1}
                              </div>
                            )}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-brand-charcoal truncate">
                              {lang === 'en' ? lesson.titleEn : lesson.titleHi || lesson.titleEn}
                            </div>
                            <div className="text-xs text-brand-muted mt-0.5">
                              Lesson {lesson.lessonNum}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="p-6 border-t border-slate-100 bg-slate-50">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-brand-muted">Total Lessons:</span>
            <span className="font-bold text-brand-charcoal">{totalLessons}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Completed:</span>
            <span className="font-bold text-green-600">{completedLessons}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Remaining:</span>
            <span className="font-bold text-amber-600">{totalLessons - completedLessons}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Right Sidebar - Progress & Resources
  const RightSidebar = () => (
    <div className="w-64 bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 flex flex-col overflow-hidden">
      {/* Current Lesson Stats */}
      {currentLessonId && (
        <>
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-brand-amber" />
              <h4 className="font-bold text-sm text-brand-charcoal">Current Progress</h4>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-brand-muted mb-1">Lesson Completion</div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lessonProgress[currentLessonId]?.progress || 0}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-brand-amber to-orange-500 h-full"
                  />
                </div>
                <div className="text-xs text-brand-amber font-bold mt-1">
                  {lessonProgress[currentLessonId]?.progress || 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-sm text-brand-charcoal">Achievements</h4>
            </div>
            <div className="space-y-2">
              {lessonProgress[currentLessonId]?.completed && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-green-700">Lesson Completed!</span>
                </div>
              )}
              {overallProgress >= 50 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <Star className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-blue-700">50% Milestone!</span>
                </div>
              )}
              {overallProgress === 100 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg">
                  <Star className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-amber-700">Master Completed!</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Recommended Resources */}
      <div className="p-6 border-b border-slate-100 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-brand-amber" />
          <h4 className="font-bold text-sm text-brand-charcoal">Resources</h4>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer">
            <div className="font-semibold text-blue-900 mb-1">📚 Documentation</div>
            <div className="text-blue-700">Complete reference guide</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors cursor-pointer">
            <div className="font-semibold text-purple-900 mb-1">🎥 Video Tutorials</div>
            <div className="text-purple-700">Step-by-step walkthroughs</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-100 hover:border-green-300 transition-colors cursor-pointer">
            <div className="font-semibold text-green-900 mb-1">💡 Code Examples</div>
            <div className="text-green-700">Practical implementations</div>
          </div>
        </div>
      </div>

      {/* Difficulty Legend */}
      <div className="p-6 border-t border-slate-100 bg-slate-50">
        <h4 className="font-bold text-xs text-brand-charcoal mb-3 uppercase tracking-wider">Difficulty Levels</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-brand-muted">Beginner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-brand-muted">Intermediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-brand-muted">Advanced</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar - Desktop */}
      <div className={`hidden md:flex ${dir === 'rtl' ? 'order-3' : ''}`}>
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${dir === 'rtl' ? 'order-2' : ''}`}>
        {/* Mobile Header with Toggle */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <h2 className="font-bold text-brand-charcoal">Clayverse AI</h2>
          <button
            onClick={() => onMobileToggle?.(!isMobileOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <BookOpen className="w-5 h-5 text-brand-charcoal" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Right Sidebar - Desktop */}
      <div className={`hidden xl:flex ${dir === 'rtl' ? 'order-1' : ''}`}>
        <RightSidebar />
      </div>

      {/* Mobile Left Sidebar - Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onMobileToggle?.(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
            >
              <LeftSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfessionalLayout;
