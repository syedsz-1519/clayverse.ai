import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Sparkles, 
  Trophy, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Star, 
  Zap, 
  Flame, 
  Eye, 
  ShieldCheck, 
  Users, 
  HeartHandshake, 
  Network, 
  Terminal, 
  Video, 
  Mic, 
  TrendingUp, 
  X, 
  Share2, 
  ChevronRight, 
  Filter,
  Check
} from 'lucide-react';
import { 
  BadgeEngine as BadgeEngineLib, 
  AchievementBadge, 
  BadgeCategory, 
  BadgeTier, 
  StudentLevelProfile 
} from '../lib/badgeEngine';
import { MockInterviewRecord } from '../types';
import { DailyStreakState } from '../lib/streakManager';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

export interface BadgeEngineProps {
  completedLessonIds: string[];
  interviewHistory: MockInterviewRecord[];
  streakState: DailyStreakState;
  peerReviewsCount?: number;
  transcriptsSubmittedCount?: number;
  onLaunchInterview?: () => void;
  onNavigateLesson?: (lessonId: string) => void;
  className?: string;
}

export default function BadgeEngine({
  completedLessonIds,
  interviewHistory,
  streakState,
  peerReviewsCount = 0,
  transcriptsSubmittedCount = 0,
  onLaunchInterview,
  onNavigateLesson,
  className = ''
}: BadgeEngineProps) {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<BadgeTier | 'all'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [copiedShareToast, setCopiedShareToast] = useState(false);

  // Evaluate profile and badges programmatically
  const profile: StudentLevelProfile = useMemo(() => {
    return BadgeEngineLib.evaluateStudentProfile(
      completedLessonIds,
      interviewHistory,
      streakState,
      peerReviewsCount,
      transcriptsSubmittedCount
    );
  }, [completedLessonIds, interviewHistory, streakState, peerReviewsCount, transcriptsSubmittedCount]);

  // Filtered badges
  const filteredBadges = useMemo(() => {
    return profile.badges.filter((badge) => {
      if (selectedCategory !== 'all' && badge.category !== selectedCategory) return false;
      if (selectedTier !== 'all' && badge.tier !== selectedTier) return false;
      return true;
    });
  }, [profile.badges, selectedCategory, selectedTier]);

  const handleOpenBadge = (badge: AchievementBadge) => {
    audioEngine.playLoFiChord();
    setSelectedBadge(badge);
  };

  const handleShareBadge = () => {
    if (!selectedBadge) return;
    const text = `I unlocked the "${selectedBadge.title}" ${selectedBadge.tier} Achievement Badge on Clayverse AI Academy! 🏆`;
    navigator.clipboard.writeText(text);
    setCopiedShareToast(true);
    setTimeout(() => setCopiedShareToast(false), 3000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* ========================================================================= */}
      {/* 1. STUDENT LEVEL & XP PROGRESSION BANNER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-orange-500/10 border-2 border-brand-amber/35 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Level Badge & Title */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white flex flex-col items-center justify-center shadow-md relative group shrink-0">
              <span className="text-2xl">{profile.levelBadgeEmoji}</span>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                LVL {profile.currentLevel}
              </span>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-charcoal text-amber-400 text-[9px] rounded-full flex items-center justify-center font-bold border-2 border-white">
                ★
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark text-[10px] font-mono font-black uppercase tracking-wider border border-brand-amber/30">
                  ACHIEVEMENT XP ENGINE
                </span>
                <span className="text-xs font-mono font-bold text-brand-muted">
                  {profile.unlockedBadgesCount} / {profile.totalBadgesCount} Badges Unlocked
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal">
                {profile.levelTitle}
              </h3>
              <p className="text-xs text-brand-slate">
                Earn XP by completing curriculum chapters, achieving high interview scores, maintaining daily streaks, and writing peer reviews.
              </p>
            </div>
          </div>

          {/* Total XP Score Pill */}
          <div className="bg-white/90 p-3 rounded-2xl border border-brand-slate/10 shadow-2xs text-right shrink-0">
            <span className="text-[10px] font-mono font-bold text-brand-muted uppercase block">
              Cumulative Student XP
            </span>
            <span className="text-2xl font-black text-brand-charcoal font-display">
              {profile.totalXp.toLocaleString()} <span className="text-sm font-mono text-brand-amber font-bold">XP</span>
            </span>
          </div>

        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-5 pt-4 border-t border-brand-amber/15 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-charcoal font-bold">
              Level {profile.currentLevel} Progress ({profile.levelProgressPercent}%)
            </span>
            <span className="text-brand-muted">
              Next Rank at <span className="font-bold text-brand-amber">{profile.nextLevelXpThreshold.toLocaleString()} XP</span>
            </span>
          </div>
          <div className="w-full h-2.5 bg-brand-sand rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profile.levelProgressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-brand-amber via-orange-500 to-amber-600 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CATEGORY & TIER FILTER TOOLBAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-brand-slate/15 shadow-2xs">
        
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Badges' },
            { id: 'curriculum', label: 'Curriculum' },
            { id: 'interview', label: 'Interview Mastery' },
            { id: 'confidence', label: 'Speech & Confidence' },
            { id: 'consistency', label: 'Daily Habit' },
            { id: 'community', label: 'Peer Reviews' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-brand-charcoal text-white shadow-xs'
                  : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-1 bg-brand-sand/60 p-1 rounded-xl shrink-0 self-end sm:self-auto">
          {['all', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                selectedTier === tier
                  ? 'bg-white text-brand-charcoal shadow-2xs'
                  : 'text-brand-slate hover:text-brand-charcoal'
              }`}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE BADGES GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleOpenBadge(badge)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative group flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-white border-amber-500/40 hover:border-amber-500 shadow-sm hover:shadow-md'
                  : 'bg-slate-50/70 border-brand-slate/15 opacity-80 hover:opacity-100 hover:border-brand-slate/30'
              }`}
            >
              {/* Top Row: Emoji Icon + Tier Pill + XP */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
                    badge.unlocked 
                      ? `bg-gradient-to-tr ${badge.gradient} text-white` 
                      : 'bg-slate-200 text-slate-400 grayscale'
                  }`}>
                    {badge.badgeEmoji}
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider ${
                      badge.tier === 'Diamond' ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                      badge.tier === 'Platinum' ? 'bg-teal-100 text-teal-700 border border-teal-300' :
                      badge.tier === 'Gold' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      badge.tier === 'Silver' ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                      'bg-orange-100 text-orange-800 border border-orange-300'
                    }`}>
                      {badge.tier}
                    </span>
                    <span className="text-[10px] font-mono text-brand-muted block mt-0.5">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                </div>

                <div>
                  {badge.unlocked ? (
                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 my-2">
                <h4 className="font-display text-sm font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                  {lang === 'en' ? badge.title : (badge.titleHyd || badge.title)}
                </h4>
                <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar & Requirement */}
              <div className="pt-3 mt-2 border-t border-brand-slate/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-brand-slate line-clamp-1">{badge.requirementText}</span>
                  <span className="font-bold text-brand-charcoal shrink-0">
                    {badge.unlocked ? 'Unlocked' : `${badge.currentValue}/${badge.targetValue}`}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      badge.unlocked 
                        ? 'bg-emerald-500' 
                        : 'bg-brand-amber'
                    }`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. DETAILED BADGE INSPECT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-slate/20 space-y-6 relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-brand-sand/70 hover:bg-brand-sand flex items-center justify-center text-brand-charcoal transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Badge visual center */}
              <div className="flex flex-col items-center text-center pt-2 space-y-3">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl ${
                  selectedBadge.unlocked 
                    ? `bg-gradient-to-tr ${selectedBadge.gradient} text-white` 
                    : 'bg-slate-200 text-slate-400 grayscale'
                }`}>
                  {selectedBadge.badgeEmoji}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-brand-amber/20 text-brand-amber-dark">
                      {selectedBadge.tier} Tier
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-muted">
                      +{selectedBadge.xpReward} XP Reward
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-black text-brand-charcoal">
                    {lang === 'en' ? selectedBadge.title : (selectedBadge.titleHyd || selectedBadge.title)}
                  </h3>
                  <p className="text-xs text-brand-slate max-w-sm mx-auto leading-relaxed">
                    {selectedBadge.description}
                  </p>
                </div>
              </div>

              {/* Criteria & Progress Box */}
              <div className="p-4 rounded-2xl bg-brand-sand/40 border border-brand-slate/15 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-brand-slate font-medium">Unlock Requirement:</span>
                  <span className="font-bold text-brand-charcoal">{selectedBadge.requirementText}</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-brand-slate font-medium">Current Status:</span>
                  <span className={`font-bold ${selectedBadge.unlocked ? 'text-emerald-600' : 'text-brand-amber'}`}>
                    {selectedBadge.unlocked ? '✓ Verified & Unlocked' : `${selectedBadge.currentValue} / ${selectedBadge.targetValue} (${selectedBadge.progressPercent}%)`}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono pt-1">
                  <span className="text-brand-slate font-medium">Community Rarity:</span>
                  <span className="text-brand-muted">Unlocked by ~{selectedBadge.rarityPercent}% of students</span>
                </div>
              </div>

              {/* Share & Actions */}
              <div className="flex items-center gap-3 pt-2">
                {selectedBadge.unlocked ? (
                  <button
                    onClick={handleShareBadge}
                    className="w-full py-3 rounded-2xl bg-brand-charcoal hover:bg-black text-white text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-brand-amber" />
                    <span>{copiedShareToast ? 'COPIED TO CLIPBOARD! 🎉' : 'SHARE ACHIEVEMENT'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedBadge(null);
                      if (selectedBadge.category === 'interview') {
                        onLaunchInterview?.();
                      } else {
                        onNavigateLesson?.('what-is-ai');
                      }
                    }}
                    className="w-full py-3 rounded-2xl bg-brand-amber hover:bg-brand-amber-dark text-white text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>WORK TOWARD THIS BADGE</span>
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
