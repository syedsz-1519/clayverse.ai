import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  Network, 
  Bot, 
  Terminal, 
  Cpu, 
  Layers, 
  GraduationCap, 
  Trophy, 
  Video, 
  Compass, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Play, 
  RotateCcw,
  Zap,
  HelpCircle,
  Lightbulb,
  Check,
  Filter
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { LESSON_MODULES, LessonModule } from './HomeCurriculumGrid';
import { streakManager } from '../lib/streakManager';
import { audioEngine } from '../lib/audioEngine';

export interface CurriculumRoadmapProps {
  completedLessonIds?: string[];
  onNavigateLesson: (lessonId: string) => void;
  onLaunchInterview?: () => void;
  className?: string;
  isCompact?: boolean;
}

interface RoadmapPhase {
  id: string;
  number: string;
  nameEn: string;
  nameHyd: string;
  descriptionEn: string;
  descriptionHyd: string;
  modules: LessonModule[];
}

export default function CurriculumRoadmap({
  completedLessonIds: propCompletedIds,
  onNavigateLesson,
  onLaunchInterview,
  className = '',
  isCompact = false
}: CurriculumRoadmapProps) {
  const { lang } = useLanguage();
  const [activeFilterPhase, setActiveFilterPhase] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'roadmap' | 'list'>('roadmap');

  // Compute completed lessons from manager if not passed as prop
  const completedIds = useMemo(() => {
    if (propCompletedIds && propCompletedIds.length > 0) return propCompletedIds;
    return streakManager.getStreakState().completedLessonIds;
  }, [propCompletedIds]);

  // Group lessons into 4 strategic learning phases
  const phases: RoadmapPhase[] = useMemo(() => {
    return [
      {
        id: 'foundations',
        number: 'Phase 01',
        nameEn: 'Core Foundations & Mental Models',
        nameHyd: 'Buniyaadi Concepts aur Soch',
        descriptionEn: 'Grasp what artificial intelligence actually is, how pattern loops operate without mathematical friction, and explore the AI family tree.',
        descriptionHyd: 'AI ki shuruat, pattern matching aur neural network shijra.',
        modules: LESSON_MODULES.filter(m => m.id === 'what-is-ai' || m.id === 'family-tree')
      },
      {
        id: 'genai',
        number: 'Phase 02',
        nameEn: 'Generative AI, LLMs & Prompting',
        nameHyd: 'Generative AI aur Prompting',
        descriptionEn: 'Learn transformer self-attention, next-token prediction, zero/few-shot prompting, and RAG vector search.',
        descriptionHyd: 'Transformers, prompt engineering aur RAG vector databases.',
        modules: LESSON_MODULES.filter(m => m.id === 'generative-ai' || m.id === 'prompting-rag')
      },
      {
        id: 'applied',
        number: 'Phase 03',
        nameEn: 'Applied Tooling & Comprehensive Concepts',
        nameHyd: 'Practical Tools aur 85+ Glossary',
        descriptionEn: 'Explore curated software directories for production coding/visuals and master 85+ technical glossary definitions.',
        descriptionHyd: 'Real world tools aur mukammal glossary terms.',
        modules: LESSON_MODULES.filter(m => m.id === 'tools' || m.id === 'deeper')
      },
      {
        id: 'mastery',
        number: 'Phase 04',
        nameEn: 'Retention, Battles & Mock Interviews',
        nameHyd: 'Revision, Quiz Arena aur Mock Interview',
        descriptionEn: 'Solidify concepts through flashcards, classroom assignments, timed quiz battles, and AI mock interviews in the hot seat.',
        descriptionHyd: 'Flashcards revision, arena battles aur AI technical interviews.',
        modules: LESSON_MODULES.filter(m => m.id === 'flashcards' || m.id === 'classroom-hub' || m.id === 'arena')
      }
    ];
  }, []);

  // Determine the Next Logical Step in the curriculum
  const nextLogicalStep = useMemo(() => {
    // 1. Find the first uncompleted module in sequence
    for (const mod of LESSON_MODULES) {
      if (!completedIds.includes(mod.id)) {
        return {
          type: 'lesson' as const,
          module: mod,
          reasonEn: `You have completed prior milestones. Progressing into "${mod.titleEn}" unlocks critical prerequisite knowledge.`,
          reasonHyd: `Agli manzil "${mod.titleHyd}" hai. Is sabaq se agle concepts aasan ho jayenge.`
        };
      }
    }

    // 2. If all 9 modules are complete, suggest live Mock Interview
    return {
      type: 'interview' as const,
      module: null,
      reasonEn: 'Congratulations! You completed all 9 core curriculum modules. The next logical path is taking an AI Mock Interview simulation!',
      reasonHyd: 'Mubarak ho! Aapne saare 9 asbaaq mukammal kar liye. Ab AI Mock Interview round dein!'
    };
  }, [completedIds]);

  const completionPercentage = Math.round((completedIds.length / LESSON_MODULES.length) * 100);

  const filteredPhases = activeFilterPhase === 'all' 
    ? phases 
    : phases.filter(p => p.id === activeFilterPhase);

  const handleSelectModule = (modId: string) => {
    audioEngine.playLoFiChord();
    onNavigateLesson(modId);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* ========================================================================= */}
      {/* 1. NEXT LOGICAL LEARNING PATH HERO SUGGESTION CARD */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-brand-charcoal via-slate-900 to-black text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10"
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-amber/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-amber/20 text-brand-amber border border-brand-amber/40 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SUGGESTED NEXT PATH</span>
              </span>
              <span className="text-white/60 text-xs font-mono">
                {completedIds.length} of {LESSON_MODULES.length} Chapters Mastered ({completionPercentage}%)
              </span>
            </div>

            {nextLogicalStep.type === 'lesson' && nextLogicalStep.module ? (
              <>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
                  {lang === 'en' ? nextLogicalStep.module.titleEn : nextLogicalStep.module.titleHyd}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {lang === 'en' ? nextLogicalStep.reasonEn : nextLogicalStep.reasonHyd}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-white/70">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-amber" />
                    <span>Est. {nextLogicalStep.module.readTime}</span>
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white/90">
                    {lang === 'en' ? nextLogicalStep.module.categoryEn : nextLogicalStep.module.categoryHyd}
                  </span>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
                  {lang === 'en' ? 'AI Mock Interview Simulation (Hot Seat)' : 'AI Mock Interview Simulation'}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  {lang === 'en' ? nextLogicalStep.reasonEn : nextLogicalStep.reasonHyd}
                </p>
              </>
            )}

          </div>

          <div className="shrink-0 flex items-center gap-3">
            {nextLogicalStep.type === 'lesson' && nextLogicalStep.module ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectModule(nextLogicalStep.module!.id)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-amber to-amber-500 hover:from-amber-500 hover:to-orange-500 text-brand-charcoal font-black text-xs sm:text-sm font-mono tracking-wider transition-all shadow-lg flex items-center gap-2.5 cursor-pointer"
              >
                <span>{lang === 'en' ? 'CONTINUE NEXT CHAPTER' : 'AGLA SABAQ SHURU KAREIN'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onLaunchInterview}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-amber to-orange-500 text-brand-charcoal font-black text-xs sm:text-sm font-mono tracking-wider transition-all shadow-lg flex items-center gap-2.5 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>{lang === 'en' ? 'LAUNCH MOCK INTERVIEW' : 'MOCK INTERVIEW SHURU KAREIN'}</span>
              </motion.button>
            )}
          </div>

        </div>

        {/* Linear Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-white/70">
            <span>Curriculum Completion Progress</span>
            <span className="font-bold text-brand-amber">{completionPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-brand-amber via-amber-400 to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. CONTROLS & PHASE FILTER TABS */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-brand-slate/15 shadow-2xs">
        
        {/* Phase Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveFilterPhase('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
              activeFilterPhase === 'all'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
            }`}
          >
            All Phases (9 Chapters)
          </button>
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActiveFilterPhase(phase.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                activeFilterPhase === phase.id
                  ? 'bg-brand-charcoal text-white shadow-xs'
                  : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50'
              }`}
            >
              {phase.number}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-brand-sand/60 p-1 rounded-xl shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'roadmap'
                ? 'bg-white text-brand-charcoal shadow-2xs'
                : 'text-brand-slate hover:text-brand-charcoal'
            }`}
          >
            Trail Map
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-brand-charcoal shadow-2xs'
                : 'text-brand-slate hover:text-brand-charcoal'
            }`}
          >
            Modular Grid
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. ROADMAP TRAIL PATH VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'roadmap' && (
        <div className="space-y-8">
          {filteredPhases.map((phase, phaseIdx) => {
            const phaseCompletedCount = phase.modules.filter(m => completedIds.includes(m.id)).length;
            const phaseAllDone = phaseCompletedCount === phase.modules.length;

            return (
              <div key={phase.id} className="relative bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-6">
                
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-brand-slate/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber-dark font-mono text-[10px] font-black uppercase">
                        {phase.number}
                      </span>
                      {phaseAllDone && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-[9px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Phase Completed</span>
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-lg font-black text-brand-charcoal">
                      {lang === 'en' ? phase.nameEn : phase.nameHyd}
                    </h4>
                    <p className="text-xs text-brand-slate max-w-xl">
                      {lang === 'en' ? phase.descriptionEn : phase.descriptionHyd}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-brand-muted">
                      {phaseCompletedCount} / {phase.modules.length} Completed
                    </span>
                  </div>
                </div>

                {/* Nodes on the Trail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                  {phase.modules.map((mod, modIdx) => {
                    const isCompleted = completedIds.includes(mod.id);
                    const isNextSuggested = nextLogicalStep.type === 'lesson' && nextLogicalStep.module?.id === mod.id;
                    const IconComponent = mod.icon || BookOpen;

                    return (
                      <motion.div
                        key={mod.id}
                        whileHover={{ y: -3, scale: 1.01 }}
                        onClick={() => handleSelectModule(mod.id)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group flex flex-col justify-between ${
                          isNextSuggested
                            ? 'bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 border-brand-amber ring-2 ring-brand-amber/30 shadow-md'
                            : isCompleted
                            ? 'bg-white border-emerald-500/30 hover:border-emerald-500 shadow-2xs'
                            : 'bg-white border-brand-slate/15 hover:border-brand-slate/40 shadow-2xs'
                        }`}
                      >
                        {/* Status Ribbon Badge */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-brand-charcoal text-white font-mono text-xs font-black flex items-center justify-center">
                              0{mod.lessonNum}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-brand-muted uppercase">
                              {lang === 'en' ? mod.categoryEn : mod.categoryHyd}
                            </span>
                          </div>

                          {isNextSuggested ? (
                            <span className="px-2 py-0.5 rounded-full bg-brand-amber text-brand-charcoal font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-xs animate-pulse">
                              <Sparkles className="w-3 h-3" />
                              <span>NEXT STEP</span>
                            </span>
                          ) : isCompleted ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-[9px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-brand-sand text-brand-slate/70 font-mono text-[9px] font-medium">
                              Ready to Start
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5 my-2">
                          <div className="flex items-start gap-2.5">
                            <div className={`p-2 rounded-xl border shrink-0 ${mod.color}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="font-display text-sm font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                                {lang === 'en' ? mod.titleEn : mod.titleHyd}
                              </h5>
                              <p className="text-xs text-brand-slate line-clamp-2 mt-0.5 leading-relaxed">
                                {lang === 'en' ? mod.subtitleEn : mod.subtitleHyd}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Tags & Jump Button */}
                        <div className="pt-3 mt-2 border-t border-brand-slate/10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand-muted">
                            <Clock className="w-3 h-3 text-brand-amber" />
                            <span>{mod.readTime} read</span>
                          </div>

                          <span className="text-[11px] font-mono font-bold text-brand-charcoal group-hover:text-brand-amber flex items-center gap-1">
                            <span>Open Chapter</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODULAR GRID VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LESSON_MODULES.map((mod) => {
            const isCompleted = completedIds.includes(mod.id);
            const isNextSuggested = nextLogicalStep.type === 'lesson' && nextLogicalStep.module?.id === mod.id;
            const IconComponent = mod.icon || BookOpen;

            return (
              <div
                key={mod.id}
                onClick={() => handleSelectModule(mod.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isNextSuggested
                    ? 'bg-amber-500/10 border-brand-amber shadow-sm'
                    : isCompleted
                    ? 'bg-white border-emerald-500/30'
                    : 'bg-white border-brand-slate/15 hover:border-brand-slate/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-brand-charcoal text-white font-mono text-[11px] font-bold flex items-center justify-center">
                      {mod.lessonNum}
                    </span>
                    <span className="text-[10px] font-mono text-brand-muted uppercase">
                      {mod.readTime}
                    </span>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isNextSuggested ? (
                    <span className="w-2 h-2 rounded-full bg-brand-amber animate-ping" />
                  ) : null}
                </div>

                <h5 className="font-display text-xs font-bold text-brand-charcoal mb-1">
                  {lang === 'en' ? mod.titleEn : mod.titleHyd}
                </h5>

                <div className="pt-2 mt-2 border-t border-brand-slate/10 flex items-center justify-between text-[10px] font-mono text-brand-slate">
                  <span>{lang === 'en' ? mod.categoryEn : mod.categoryHyd}</span>
                  <ArrowRight className="w-3 h-3 text-brand-amber" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
