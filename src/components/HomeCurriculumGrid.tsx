import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  Network, 
  Bot, 
  Terminal, 
  Cpu, 
  Layers, 
  GraduationCap, 
  Trophy, 
  Award, 
  Flame, 
  CheckCircle2, 
  PlayCircle,
  HelpCircle,
  ChevronRight,
  Search,
  Filter,
  Check,
  RotateCcw,
  Compass,
  Zap,
  LayoutGrid,
  Milestone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { streakManager } from '../lib/streakManager';
import { audioEngine } from '../lib/audioEngine';
import CurriculumRoadmap from './CurriculumRoadmap';

export interface LessonModule {
  id: string;
  lessonNum: number;
  stage: 1 | 2 | 3;
  stageNameEn: string;
  stageNameHyd: string;
  titleEn: string;
  titleHyd: string;
  subtitleEn: string;
  subtitleHyd: string;
  readTime: string;
  categoryEn: string;
  categoryHyd: string;
  icon: any;
  color: string;
  tags: string[];
}

export const LESSON_MODULES: LessonModule[] = [
  {
    id: 'what-is-ai',
    lessonNum: 1,
    stage: 1,
    stageNameEn: 'Stage 1: Core Foundations',
    stageNameHyd: 'Marhala 1: Buniyaadi Soch',
    titleEn: 'Foundations of AI & Mental Models',
    titleHyd: 'AI ki Asli Buniyaad aur Misaalein',
    subtitleEn: 'Understand how pattern recognition differs from traditional coding with the pocket analogizer.',
    subtitleHyd: 'Bina kisi math ke samjhein ke AI normal coding se alag kaise hai.',
    readTime: '2 min',
    categoryEn: 'Foundations',
    categoryHyd: 'Buniyaad',
    icon: HelpCircle,
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-600',
    tags: ['Narrow vs General AI', 'Pattern Loops', '3 Horizons']
  },
  {
    id: 'family-tree',
    lessonNum: 2,
    stage: 1,
    stageNameEn: 'Stage 1: Core Foundations',
    stageNameHyd: 'Marhala 1: Buniyaadi Soch',
    titleEn: 'The AI Family Tree & Neural Nets',
    titleHyd: 'AI ka Shijra-e-Nasab aur Neural Nets',
    subtitleEn: 'Explore Supervised, Unsupervised, Reinforcement Learning, and deep multi-layer neural architectures.',
    subtitleHyd: 'Supervised, Unsupervised, aur Deep Neural networks ko visual circle diagrams se samjhein.',
    readTime: '3 min',
    categoryEn: 'Architecture',
    categoryHyd: 'Dhanche',
    icon: Network,
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-600',
    tags: ['Supervised Learning', 'Clustering', 'Neural Synapses']
  },
  {
    id: 'generative-ai',
    lessonNum: 3,
    stage: 1,
    stageNameEn: 'Stage 1: Core Foundations',
    stageNameHyd: 'Marhala 1: Buniyaadi Soch',
    titleEn: 'Generative AI & Large Language Models',
    titleHyd: 'Generative AI aur LLMs ka Jadoo',
    subtitleEn: 'Master next-token prediction, transformer attention mechanisms, and multi-modal creative synthesis.',
    subtitleHyd: 'Text, image aur code banane wali modern Generative AI kaise sochti hai.',
    readTime: '3 min',
    categoryEn: 'Generative Tech',
    categoryHyd: 'GenAI',
    icon: Bot,
    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-600',
    tags: ['Next-Token Math', 'Transformers', 'Hallucinations']
  },
  {
    id: 'prompting-rag',
    lessonNum: 4,
    stage: 2,
    stageNameEn: 'Stage 2: Applied AI & RAG',
    stageNameHyd: 'Marhala 2: Applied AI aur RAG',
    titleEn: 'Prompting & RAG Architecture',
    titleHyd: 'Prompt Engineering aur RAG System',
    subtitleEn: 'Learn Zero-Shot, Few-Shot, Chain-of-Thought prompting, and Retrieval-Augmented Generation.',
    subtitleHyd: 'AI se behtareen jawab lene ke tareeqay aur private data search ka nizaam.',
    readTime: '4 min',
    categoryEn: 'Practical Skills',
    categoryHyd: 'Hunar',
    icon: Terminal,
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-600',
    tags: ['Few-Shot Prompts', 'Vector Embeddings', 'Live Sandbox']
  },
  {
    id: 'tools',
    lessonNum: 5,
    stage: 2,
    stageNameEn: 'Stage 2: Applied AI & RAG',
    stageNameHyd: 'Marhala 2: Applied AI aur RAG',
    titleEn: 'Curated AI Tools Directory',
    titleHyd: 'AI Tools aur Softwares ki Directory',
    subtitleEn: 'Discover verified tools across Text, Image, Audio, Code, and Research workflows.',
    subtitleHyd: 'Rozmarra ke kaamon me madad karne wale behtareen AI apps aur tools.',
    readTime: '2 min',
    categoryEn: 'Toolbox',
    categoryHyd: 'Tools',
    icon: Cpu,
    color: 'from-rose-500/20 to-orange-500/20 border-rose-500/30 text-rose-600',
    tags: ['Writing', 'Visuals', 'Coding Assistants']
  },
  {
    id: 'deeper',
    lessonNum: 6,
    stage: 2,
    stageNameEn: 'Stage 2: Applied AI & RAG',
    stageNameHyd: 'Marhala 2: Applied AI aur RAG',
    titleEn: '12 Core Concepts Deep Dive',
    titleHyd: '12 Aham AI Concepts aur Glossary',
    subtitleEn: 'Comprehensive, plain-English breakdown of 85+ terms from Tokens to Overfitting and Alignment.',
    subtitleHyd: '85 se zyada AI alfaaz ka aasan khulasa aur future outlook.',
    readTime: '5 min',
    categoryEn: 'Deep Dive',
    categoryHyd: 'Tafseel',
    icon: Layers,
    color: 'from-amber-600/20 to-yellow-500/20 border-amber-600/30 text-amber-700',
    tags: ['Searchable Terms', 'Ethics & Safety', 'Audio Pronunciation']
  },
  {
    id: 'flashcards',
    lessonNum: 7,
    stage: 3,
    stageNameEn: 'Stage 3: Mastery & Certification',
    stageNameHyd: 'Marhala 3: Imtehan aur Mastery',
    titleEn: 'Interactive Flashcards Retention Deck',
    titleHyd: 'Interactive Flashcards aur Memory Deck',
    subtitleEn: 'Reinforce your memory with flip cards, category filters, and retention self-testing.',
    subtitleHyd: 'Seekhe hue sabak ko dimag me pukhta karne ke liye interactive flip cards.',
    readTime: '3 min',
    categoryEn: 'Memory Deck',
    categoryHyd: 'Revision',
    icon: BookOpen,
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-600',
    tags: ['Spaced Repetition', 'Mastery Tracker', 'Audio Flashcards']
  },
  {
    id: 'classroom-hub',
    lessonNum: 8,
    stage: 3,
    stageNameEn: 'Stage 3: Mastery & Certification',
    stageNameHyd: 'Marhala 3: Imtehan aur Mastery',
    titleEn: 'Google Classroom Hub & Coursework',
    titleHyd: 'Google Classroom Hub aur Asbaaq',
    subtitleEn: 'Connect real classroom streams, export certified milestone badges, and sync coursework.',
    subtitleHyd: 'Apne seekhe hue sabak ko teachers ke sath share karein aur certificates lein.',
    readTime: '2 min',
    categoryEn: 'Education',
    categoryHyd: 'Taleem',
    icon: GraduationCap,
    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-600',
    tags: ['OAuth Sync', 'Class Announcements', 'Verified Badges']
  },
  {
    id: 'arena',
    lessonNum: 9,
    stage: 3,
    stageNameEn: 'Stage 3: Mastery & Certification',
    stageNameHyd: 'Marhala 3: Imtehan aur Mastery',
    titleEn: 'AI Arena Battleground & Quiz Challenge',
    titleHyd: 'AI Arena: Quiz aur Imtehan',
    subtitleEn: 'Put your skills to the test with time-attack quiz battles, streak multipliers, and leaderboard scoring.',
    subtitleHyd: 'Live interactive quiz me hissa lein aur apna highscore banayein.',
    readTime: '4 min',
    categoryEn: 'Battleground',
    categoryHyd: 'Muqabla',
    icon: Trophy,
    color: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-600',
    tags: ['Timed Challenges', 'Leaderboard', 'Streak Multipliers']
  }
];

interface HomeCurriculumGridProps {
  onSelectLesson: (lessonId: string) => void;
  onViewContinuousGuide: () => void;
  onStartInterview?: () => void;
}

export default function HomeCurriculumGrid({ 
  onSelectLesson, 
  onViewContinuousGuide,
  onStartInterview 
}: HomeCurriculumGridProps) {
  const { lang } = useLanguage();
  const [selectedStage, setSelectedStage] = useState<'all' | 1 | 2 | 3 | 'roadmap'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Track completed lessons from streakManager
  const streakState = streakManager.getStreakState();
  const completedIds = streakState.completedLessonIds || [];
  const completedCount = LESSON_MODULES.filter(m => completedIds.includes(m.id)).length;
  const progressPercent = Math.round((completedCount / LESSON_MODULES.length) * 100);

  // Filter modules according to stage, status, and search query
  const filteredModules = useMemo(() => {
    return LESSON_MODULES.filter(mod => {
      // Stage filter
      if (selectedStage !== 'all' && selectedStage !== 'roadmap' && mod.stage !== selectedStage) {
        return false;
      }
      // Status filter
      const isCompleted = completedIds.includes(mod.id);
      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'pending' && isCompleted) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = mod.titleEn.toLowerCase().includes(query) || mod.titleHyd.toLowerCase().includes(query);
        const matchSub = mod.subtitleEn.toLowerCase().includes(query) || mod.subtitleHyd.toLowerCase().includes(query);
        const matchCategory = mod.categoryEn.toLowerCase().includes(query) || mod.categoryHyd.toLowerCase().includes(query);
        const matchTags = mod.tags.some(t => t.toLowerCase().includes(query));
        return matchTitle || matchSub || matchCategory || matchTags;
      }
      return true;
    });
  }, [selectedStage, statusFilter, searchQuery, completedIds]);

  // Determine next recommended lesson
  const nextUnfinishedLesson = useMemo(() => {
    return LESSON_MODULES.find(m => !completedIds.includes(m.id)) || LESSON_MODULES[0];
  }, [completedIds]);

  return (
    <section id="curriculum" className="max-w-6xl mx-auto px-6 py-12 text-left">
      {/* Section Header with Clear Architectural Positioning */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-brand-slate/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/15 text-brand-amber text-xs font-bold font-mono uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? "Structured Curriculum Architecture" : lang === 'te' ? "కోర్స్ సిలబస్" : "Mukammal AI Course"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-brand-charcoal tracking-tight">
            {lang === 'en' ? "9-Step Zero-Math AI Curriculum" : lang === 'te' ? "ప్రత్యేక 9 పాఠ్యాంశాలు" : "9-Sabaq AI Curriculum"}
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate max-w-2xl mt-1.5 leading-relaxed">
            {lang === 'en'
              ? "Designed for absolute clarity: 3 progressive stages moving from intuitive mental models to real-world RAG architectures and simulated interview evaluations."
              : lang === 'te'
              ? "మీ స్వంత వేగంతో ఇంటరాక్టివ్ పాఠాలను అన్వేషించండి."
              : "Buniyaadi models se le kar Generative AI aur mock interviews tak, step-by-step sabaq."}
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              audioEngine.playLoFiChord();
              onSelectLesson(nextUnfinishedLesson.id);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-charcoal hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-brand-amber" />
            <span>{completedCount === 0 ? (lang === 'en' ? "Start Lesson 01" : "Sabak 1 Shuru Karein") : (lang === 'en' ? `Resume: Lesson 0${nextUnfinishedLesson.lessonNum}` : `Jari Rakhein: Sabaq 0${nextUnfinishedLesson.lessonNum}`)}</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-amber" />
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              onViewContinuousGuide();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-brand-sand border border-brand-slate/20 hover:border-brand-amber text-brand-charcoal font-bold text-xs shadow-2xs hover:shadow-sm transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-amber" />
            <span>{lang === 'en' ? "Continuous Reading" : "Continuous Guide"}</span>
          </button>
        </div>
      </div>

      {/* Progress & Milestone Overview Banner */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs border border-brand-slate/15 rounded-3xl p-5 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-amber to-orange-600 text-white flex items-center justify-center font-mono font-black text-lg shadow-sm shrink-0">
            {progressPercent}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-brand-charcoal">
                {completedCount} of 9 Modules Completed
              </span>
              {progressPercent === 100 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Master Scholar
                </span>
              )}
            </div>
            <div className="w-48 sm:w-64 h-2 bg-brand-slate/10 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-amber to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-brand-muted">STAGES:</span>
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border ${completedCount >= 3 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-brand-sand text-brand-slate border-brand-slate/15'}`}>
            01. Foundations {completedCount >= 3 ? '✓' : ''}
          </span>
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border ${completedCount >= 6 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-brand-sand text-brand-slate border-brand-slate/15'}`}>
            02. Applied RAG {completedCount >= 6 ? '✓' : ''}
          </span>
          <span className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold border ${completedCount >= 9 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-brand-sand text-brand-slate border-brand-slate/15'}`}>
            03. Mastery {completedCount >= 9 ? '✓' : ''}
          </span>
        </div>
      </div>

      {/* Stage Navigation & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        {/* Stage Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/90 dark:bg-zinc-900/90 border border-brand-slate/15 rounded-2xl shadow-2xs">
          <button
            onClick={() => {
              audioEngine.playClick();
              setSelectedStage('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStage === 'all'
                ? 'bg-brand-charcoal text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Modules (9)</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setSelectedStage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStage === 1
                ? 'bg-brand-amber text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand'
            }`}
          >
            <span>01. Foundations (1-3)</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setSelectedStage(2);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStage === 2
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand'
            }`}
          >
            <span>02. Applied RAG (4-6)</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setSelectedStage(3);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStage === 3
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand'
            }`}
          >
            <span>03. Mastery (7-9)</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setSelectedStage('roadmap');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStage === 'roadmap'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand'
            }`}
          >
            <Milestone className="w-3.5 h-3.5 text-blue-500" />
            <span>Learning Roadmap</span>
          </button>
        </div>

        {/* Search & Status Filters */}
        {selectedStage !== 'roadmap' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? "Search concepts, RAG, neural..." : "Concepts search karein..."}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-brand-slate/15 rounded-xl focus:outline-hidden focus:border-brand-amber focus:ring-1 focus:ring-brand-amber text-brand-charcoal"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-brand-muted hover:text-brand-charcoal"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 border border-brand-slate/15 rounded-xl p-1 text-[11px] font-mono">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-0.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'all' ? 'bg-brand-charcoal text-white font-bold' : 'text-brand-muted hover:text-brand-charcoal'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2 py-0.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'pending' ? 'bg-brand-charcoal text-white font-bold' : 'text-brand-muted hover:text-brand-charcoal'}`}
              >
                Unfinished
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2 py-0.5 rounded-lg cursor-pointer transition-all ${statusFilter === 'completed' ? 'bg-brand-charcoal text-white font-bold' : 'text-brand-muted hover:text-brand-charcoal'}`}
              >
                Completed
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Either Roadmap View or Structured Grid */}
      {selectedStage === 'roadmap' ? (
        <div className="bg-white/90 dark:bg-zinc-900/90 border border-brand-slate/15 rounded-3xl p-6 sm:p-8 shadow-sm">
          <CurriculumRoadmap
            completedLessonIds={completedIds}
            onNavigateLesson={onSelectLesson}
            onLaunchInterview={onStartInterview}
          />
        </div>
      ) : (
        <>
          {filteredModules.length === 0 ? (
            <div className="text-center py-16 bg-white/60 dark:bg-zinc-900/60 border border-dashed border-brand-slate/20 rounded-3xl">
              <Compass className="w-10 h-10 text-brand-muted mx-auto mb-3" />
              <h4 className="font-display text-base font-bold text-brand-charcoal">No lessons match your filter</h4>
              <p className="text-xs text-brand-slate mt-1">Try changing your search terms or clearing the status filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSelectedStage('all');
                }}
                className="mt-4 px-4 py-1.5 rounded-xl bg-brand-charcoal text-white text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => {
                const Icon = module.icon;
                const isCompleted = completedIds.includes(module.id);
                return (
                  <motion.div
                    key={module.id}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      audioEngine.playLoFiChord();
                      onSelectLesson(module.id);
                    }}
                    className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-900 border ${
                      isCompleted 
                        ? 'border-emerald-500/50 shadow-xs' 
                        : 'border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 shadow-sm hover:shadow-xl'
                    } transition-all cursor-pointer text-left overflow-hidden`}
                  >
                    {/* Top Row: Stage & Lesson Number & Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-xl font-mono font-black text-xs flex items-center justify-center shadow-xs ${
                          isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-slate-900'
                        }`}>
                          0{module.lessonNum}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                          {lang === 'en' ? module.categoryEn : module.categoryHyd}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Completed
                          </span>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span>{module.readTime}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="space-y-2 mb-5">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${module.color} border shrink-0 group-hover:scale-110 transition-transform shadow-2xs`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 tracking-tight mb-0.5">
                            {lang === 'en' ? module.stageNameEn : module.stageNameHyd}
                          </div>
                          <h3 className="font-display text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors leading-tight">
                            {lang === 'en' ? module.titleEn : module.titleHyd}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
                        {lang === 'en' ? module.subtitleEn : module.subtitleHyd}
                      </p>
                    </div>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {module.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="text-[9.5px] font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-zinc-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Card Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      <span className="flex items-center gap-1.5">
                        <PlayCircle className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-amber-500'}`} />
                        <span>{isCompleted ? (lang === 'en' ? "Review Lesson" : "Sabak Dobara Padhein") : (lang === 'en' ? "Start Lesson" : "Sabaq Kholein")}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}

