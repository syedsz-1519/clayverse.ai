import React, { useMemo, useState } from 'react';
import { Filter, ChevronDown, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import LessonCard from './LessonCard';
import { LESSON_MODULES } from './HomeCurriculumGrid';

interface LessonExplorerProps {
  onSelectLesson: (lessonId: string) => void;
  currentLessonId?: string | null;
  showFilters?: boolean;
}

export const LessonExplorer: React.FC<LessonExplorerProps> = ({
  onSelectLesson,
  currentLessonId,
  showFilters = true
}) => {
  const { lang, t } = useLanguageMultilingual();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'number' | 'difficulty' | 'duration'>('number');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort lessons
  const filteredAndSortedLessons = useMemo(() => {
    let lessons = [...LESSON_MODULES];

    // Filter by difficulty
    if (selectedDifficulty) {
      lessons = lessons.filter(l => l.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortBy) {
      case 'difficulty':
        const difficultyOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
        lessons.sort((a, b) => difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]);
        break;
      case 'duration':
        lessons.sort((a, b) => (a.estimatedMinutes || 0) - (b.estimatedMinutes || 0));
        break;
      case 'number':
      default:
        lessons.sort((a, b) => a.lessonNum - b.lessonNum);
        break;
    }

    return lessons;
  }, [selectedDifficulty, sortBy]);

  const difficultyStats = useMemo(() => ({
    Beginner: LESSON_MODULES.filter(l => l.difficulty === 'Beginner').length,
    Intermediate: LESSON_MODULES.filter(l => l.difficulty === 'Intermediate').length,
    Advanced: LESSON_MODULES.filter(l => l.difficulty === 'Advanced').length,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-charcoal">
            {lang === 'en' ? 'AI Learning Lessons' : 'एआई सीखने के पाठ'}
          </h2>
          <p className="text-sm text-brand-muted mt-1">
            {lang === 'en' ? `${filteredAndSortedLessons.length} lessons to explore` : `${filteredAndSortedLessons.length} पाठों का अन्वेषण करें`}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-brand-amber/15 text-brand-amber'
                : 'text-brand-muted hover:bg-slate-100'
            }`}
            title="Grid View"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-brand-amber/15 text-brand-amber'
                : 'text-brand-muted hover:bg-slate-100'
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters & Sort */}
      {showFilters && (
        <div className="space-y-4">
          {/* Difficulty Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-brand-muted font-semibold">
              <Filter className="w-4 h-4" />
              <span>{lang === 'en' ? 'Filter:' : 'फ़िल्टर:'}</span>
            </div>

            <button
              onClick={() => setSelectedDifficulty(null)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                selectedDifficulty === null
                  ? 'bg-brand-amber/20 text-brand-amber border border-brand-amber/40'
                  : 'bg-slate-100 text-brand-slate border border-slate-200 hover:border-brand-amber/30'
              }`}
            >
              {lang === 'en' ? 'All' : 'सभी'}
            </button>

            {['Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all flex items-center gap-1 ${
                  selectedDifficulty === difficulty
                    ? 'border'
                    : 'bg-slate-100 text-brand-slate border border-slate-200 hover:border-brand-amber/30'
                } ${
                  difficulty === 'Beginner'
                    ? selectedDifficulty === difficulty
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : ''
                    : difficulty === 'Intermediate'
                    ? selectedDifficulty === difficulty
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : ''
                    : selectedDifficulty === difficulty
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : ''
                }`}
              >
                <span>
                  {difficulty === 'Beginner'
                    ? '🎯'
                    : difficulty === 'Intermediate'
                    ? '⚡'
                    : '🚀'}
                </span>
                {difficulty} ({difficultyStats[difficulty as keyof typeof difficultyStats]})
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative inline-block">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-brand-slate rounded-lg font-medium text-sm transition-colors"
            >
              <span>{lang === 'en' ? 'Sort by' : 'द्वारा क्रमबद्ध:'}</span>
              <span className="text-xs font-semibold text-brand-amber">
                {sortBy === 'number'
                  ? lang === 'en'
                    ? 'Lesson #'
                    : 'पाठ #'
                  : sortBy === 'difficulty'
                  ? lang === 'en'
                    ? 'Difficulty'
                    : 'कठिनाई'
                  : 'Duration'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-10"
                >
                  {[
                    { value: 'number', label: lang === 'en' ? 'Lesson #' : 'पाठ #' },
                    { value: 'difficulty', label: lang === 'en' ? 'Difficulty' : 'कठिनाई' },
                    { value: 'duration', label: lang === 'en' ? 'Duration' : 'अवधि' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortBy(value as any);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                        sortBy === value
                          ? 'bg-brand-amber/15 text-brand-amber'
                          : 'text-brand-slate hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Lessons Grid or List */}
      <motion.div
        layout
        className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'space-y-3'
        }`}
      >
        <AnimatePresence mode="wait">
          {filteredAndSortedLessons.map((lesson, idx) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <LessonCard
                id={lesson.id}
                lessonNumber={lesson.lessonNum}
                title={lesson.titleEn}
                titleLocalized={lang === 'hi' ? lesson.titleHi : lesson.titleEn}
                description={lesson.descriptionEn || lesson.titleEn}
                difficulty={lesson.difficulty}
                duration={lesson.estimatedMinutes || 15}
                topicsCount={Math.floor(Math.random() * 5) + 3} // Placeholder
                isCompleted={false}
                progress={0}
                onClick={() => onSelectLesson(lesson.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredAndSortedLessons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-16"
        >
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-brand-charcoal mb-1">
            {lang === 'en' ? 'No lessons found' : 'कोई पाठ नहीं मिला'}
          </h3>
          <p className="text-sm text-brand-muted">
            {lang === 'en'
              ? 'Try adjusting your filters to find lessons'
              : 'पाठ खोजने के लिए अपनी फ़िल्टर को समायोजित करने का प्रयास करें'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LessonExplorer;
