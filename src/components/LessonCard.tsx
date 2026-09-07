import React from 'react';
import { ArrowRight, Clock, BookOpen, Zap, CheckCircle, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';

export interface LessonCardProps {
  id: string;
  lessonNumber: number;
  title: string;
  titleLocalized?: string;
  description: string;
  descriptionLocalized?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  topicsCount: number;
  isCompleted?: boolean;
  progress?: number; // 0-100
  isLocked?: boolean;
  onClick?: () => void;
  isPremium?: boolean;
}

const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const getDifficultyStyle = () => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getDifficultyEmoji = () => {
    switch (difficulty) {
      case 'Beginner':
        return '🎯';
      case 'Intermediate':
        return '⚡';
      case 'Advanced':
        return '🚀';
      default:
        return '📚';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs border ${getDifficultyStyle()}`}>
      <span>{getDifficultyEmoji()}</span>
      <span>{difficulty}</span>
    </div>
  );
};

export const LessonCard: React.FC<LessonCardProps> = ({
  id,
  lessonNumber,
  title,
  titleLocalized,
  description,
  descriptionLocalized,
  difficulty,
  duration,
  topicsCount,
  isCompleted = false,
  progress = 0,
  isLocked = false,
  onClick,
  isPremium = false
}) => {
  const { lang } = useLanguageMultilingual();

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      whileHover={!isLocked ? { y: -4, boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.12)' } : {}}
      whileTap={!isLocked ? { y: -2 } : {}}
      className={`relative group w-full text-left rounded-xl overflow-hidden transition-all ${
        isLocked
          ? 'bg-slate-100 opacity-50 cursor-not-allowed'
          : 'bg-white border border-slate-200 hover:border-brand-amber cursor-pointer shadow-sm hover:shadow-md'
      }`}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-amber/0 via-transparent to-orange-500/0 opacity-0 group-hover:opacity-5 transition-opacity"></div>

      <div className="relative p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {/* Lesson Number */}
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 ${
              isCompleted
                ? 'bg-green-100 text-green-700'
                : 'bg-brand-amber/10 text-brand-amber'
            }`}>
              {isCompleted ? <CheckCircle className="w-6 h-6 text-green-600" /> : lessonNumber}
            </div>

            {/* Title & Lesson Number Label */}
            <div>
              <h3 className="font-bold text-base text-brand-charcoal line-clamp-2">
                {titleLocalized || title}
              </h3>
              <p className="text-xs text-brand-muted mt-1">Lesson {lessonNumber}</p>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2">
            {isPremium && (
              <div className="p-1.5 bg-amber-100 rounded-lg" title="Premium Content">
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
            )}
            {isCompleted && (
              <div className="p-1.5 bg-green-100 rounded-lg" title="Completed">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            )}
            {isLocked && (
              <div className="p-1.5 bg-slate-200 rounded-lg" title="Locked">
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-brand-slate mb-4 line-clamp-2">
          {descriptionLocalized || description}
        </p>

        {/* Progress Bar */}
        {progress > 0 && !isCompleted && (
          <div className="mb-4">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-brand-amber to-orange-500 h-full"
              />
            </div>
            <p className="text-xs text-brand-muted mt-1.5">{progress}% completed</p>
          </div>
        )}

        {/* Metadata Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Left Side - Difficulty Badge */}
          <DifficultyBadge difficulty={difficulty} />

          {/* Right Side - Stats */}
          <div className="flex items-center gap-4 text-xs text-brand-muted">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{topicsCount} topics</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="text-xs font-semibold text-brand-amber">
            {isCompleted ? '✓ Completed' : isLocked ? 'Locked' : 'Start Learning'}
          </div>
          <ArrowRight className="w-4 h-4 text-brand-amber group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.button>
  );
};

export default LessonCard;
