import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown, 
  Clock, 
  Sparkles, 
  Compass, 
  BookOpen,
  ArrowUp,
  RotateCcw,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export interface GuideSectionMilestone {
  id: string;
  num: number;
  titleEn: string;
  titleHyd: string;
  shortEn: string;
  shortHyd: string;
  descriptionEn: string;
  descriptionHyd: string;
  estMinutes: number;
}

export const GUIDE_MILESTONES: GuideSectionMilestone[] = [
  {
    id: 'hero',
    num: 1,
    titleEn: '1. Overview & Core Philosophy',
    titleHyd: '1. Taaruf aur Buniyadi Falsafa',
    shortEn: 'Overview',
    shortHyd: 'Taaruf',
    descriptionEn: 'Pattern matching at massive scale — without the magic hype.',
    descriptionHyd: 'Bade paimane par pattern pehchanna — baghair kisi jadu ke.',
    estMinutes: 1,
  },
  {
    id: 'what-is-ai',
    num: 2,
    titleEn: '2. What Actually is AI?',
    titleHyd: '2. Asal mein AI Kya Hai?',
    shortEn: 'What is AI',
    shortHyd: 'AI Kya Hai',
    descriptionEn: 'Intuitive analogies, daily pocket AI examples, and historical milestones.',
    descriptionHyd: 'Aasan misalein, daily use hone wale AI tools, aur tareekh.',
    estMinutes: 2,
  },
  {
    id: 'family-tree',
    num: 3,
    titleEn: '3. The AI Family Tree & Deep Learning',
    titleHyd: '3. AI Shijra aur Deep Learning',
    shortEn: 'Family Tree',
    shortHyd: 'AI Shijra',
    descriptionEn: 'Nesting dolls: AI vs Machine Learning vs Deep Learning vs Neural Nets.',
    descriptionHyd: 'Nesting dolls: AI, ML, Deep Learning aur Neural Networks ka farq.',
    estMinutes: 3,
  },
  {
    id: 'generative-ai',
    num: 4,
    titleEn: '4. Generative AI & Large Language Models',
    titleHyd: '4. Generative AI aur LLMs',
    shortEn: 'Generative AI',
    shortHyd: 'Generative AI',
    descriptionEn: 'How next-token predictors create text, art, audio, and code.',
    descriptionHyd: 'Agla word predict karke naya content kaise banaya jata hai.',
    estMinutes: 2,
  },
  {
    id: 'prompting-rag',
    num: 5,
    titleEn: '5. Prompt Engineering & RAG',
    titleHyd: '5. Prompting aur RAG Nizaam',
    shortEn: 'Prompting & RAG',
    shortHyd: 'Prompting & RAG',
    descriptionEn: 'Zero-shot, few-shot, chain-of-thought, and factual grounding.',
    descriptionHyd: 'Zero-shot, few-shot, step-by-step prompts aur verified facts.',
    estMinutes: 3,
  },
  {
    id: 'ai-tools-directory',
    num: 6,
    titleEn: '6. Free AI Tools Directory',
    titleHyd: '6. Muft AI Tools Fehrist',
    shortEn: 'AI Toolbox',
    shortHyd: 'AI Tools',
    descriptionEn: 'Curated 100% free AI tools for students, writers, and developers.',
    descriptionHyd: 'Talib-e-ilmon aur developers ke liye behtareen muft tools.',
    estMinutes: 2,
  },
  {
    id: 'deeper',
    num: 7,
    titleEn: '7. 12 Core Concepts & 85+ Terms Roadmap',
    titleHyd: '7. 12 Asasi Sabaq aur 85+ Istelahat',
    shortEn: '12 Concepts',
    shortHyd: '12 Sabaq',
    descriptionEn: 'Deep-dive chapters, interactive quizzes, and term checklist.',
    descriptionHyd: 'Har term ki asan wazahat, quiz aur completion checklist.',
    estMinutes: 4,
  },
  {
    id: 'flashcards',
    num: 8,
    titleEn: '8. Interactive AI Flashcards Deck',
    titleHyd: '8. Interactive AI Flashcards',
    shortEn: 'Flashcards',
    shortHyd: 'Flashcards',
    descriptionEn: 'Active recall flashcards with voice reading and audio cues.',
    descriptionHyd: 'Yadasht mazboot karne ke liye audio flashcards.',
    estMinutes: 2,
  },
  {
    id: 'classroom-hub',
    num: 9,
    titleEn: '9. Google Classroom Educator Hub',
    titleHyd: '9. Google Classroom Hub',
    shortEn: 'Classroom Hub',
    shortHyd: 'Classroom Hub',
    descriptionEn: 'Publish curriculum, assignments, and announcements directly.',
    descriptionHyd: 'Direct Google Classroom mein sabaq aur assignments share karein.',
    estMinutes: 2,
  },
  {
    id: 'ai-arena',
    num: 10,
    titleEn: '10. AI Arena & Knowledge Championship',
    titleHyd: '10. AI Arena Muqabla',
    shortEn: 'AI Arena',
    shortHyd: 'Arena Quiz',
    descriptionEn: 'Timed trivia battles, speed rounds, and global leaderboard.',
    descriptionHyd: 'Quiz muqable, fast rounds aur ranking board.',
    estMinutes: 3,
  },
];

export default function ScrollProgressIndicator() {
  const { lang } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [isHovered, setIsHovered] = useState(false);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [hoveredMilestone, setHoveredMilestone] = useState<GuideSectionMilestone | null>(null);
  const [totalEstimatedMinutes, setTotalEstimatedMinutes] = useState(24);
  const barRef = useRef<HTMLDivElement>(null);

  // Track scroll position across the full document
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Identify currently active section in viewport
      let detectedId = 'hero';
      for (const milestone of GUIDE_MILESTONES) {
        const el = document.getElementById(milestone.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300 && rect.bottom >= 150) {
            detectedId = milestone.id;
            break;
          }
        }
      }
      setActiveSectionId(detectedId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate remaining estimated minutes
  const activeMilestoneIndex = GUIDE_MILESTONES.findIndex(m => m.id === activeSectionId);
  const currentMilestone = GUIDE_MILESTONES[Math.max(0, activeMilestoneIndex)] || GUIDE_MILESTONES[0];
  const completedSectionsCount = activeMilestoneIndex >= 0 ? activeMilestoneIndex + 1 : 1;
  const isComplete = scrollProgress >= 98;

  // Remaining reading time estimate
  const remainingMinutes = Math.max(
    1,
    Math.round(totalEstimatedMinutes * (1 - scrollProgress / 100))
  );

  // Jump to specific section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const newHash = id === 'hero' ? '' : `#${id}`;
      window.history.pushState(null, '', newHash || window.location.pathname);
    }
  };

  // Jump to next/prev section
  const jumpNext = () => {
    const nextIdx = Math.min(GUIDE_MILESTONES.length - 1, activeMilestoneIndex + 1);
    scrollToSection(GUIDE_MILESTONES[nextIdx].id);
  };

  const jumpPrev = () => {
    const prevIdx = Math.max(0, activeMilestoneIndex - 1);
    scrollToSection(GUIDE_MILESTONES[prevIdx].id);
  };

  // Click on progress track to scrub to that percentage of the page
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      window.scrollTo({
        top: ratio * totalHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside 
      aria-label="Reading progress"
      className="fixed top-0 left-0 right-0 z-[60] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredMilestone(null);
      }}
    >
      {/* 1. Ultra-tactile Multi-Stop Progress Track */}
      <div 
        ref={barRef}
        onClick={handleTrackClick}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`AI Guide progress: ${Math.round(scrollProgress)}% completed`}
        title={lang === 'en' ? `Click to jump (Currently ${Math.round(scrollProgress)}% completed)` : `Kahin bhi click karke wahan pohnchein (${Math.round(scrollProgress)}% mukammal)`}
        className={`relative w-full cursor-pointer transition-all duration-300 ${
          isHovered ? 'h-[7px] bg-brand-sand/90' : 'h-[4.5px] bg-brand-sand/60'
        } backdrop-blur-xs`}
      >
        {/* Animated Progress Fill with Ambient Glow */}
        <motion.div
          className={`absolute top-0 left-0 h-full origin-left transition-colors duration-500 ${
            isComplete
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
              : 'bg-gradient-to-r from-amber-400 via-brand-amber to-amber-600 shadow-[0_1px_8px_rgba(217,119,6,0.6)]'
          }`}
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: "easeOut", duration: 0.1 }}
        >
          {/* Glowing Animated Leading Head */}
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse" />
        </motion.div>

        {/* Milestone Node Dots positioned along the guide */}
        <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-1">
          {GUIDE_MILESTONES.map((sec, idx) => {
            const milestonePercent = (idx / (GUIDE_MILESTONES.length - 1)) * 100;
            const isPassed = scrollProgress >= milestonePercent - 1.5;
            const isCurrent = activeSectionId === sec.id;

            return (
              <div
                key={sec.id}
                onMouseEnter={() => setHoveredMilestone(sec)}
                onMouseLeave={() => setHoveredMilestone(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToSection(sec.id);
                }}
                className="relative group/pin pointer-events-auto cursor-pointer flex flex-col items-center py-1"
              >
                {/* Node Pill */}
                <div
                  className={`transition-all duration-200 rounded-full border ${
                    isCurrent
                      ? 'w-3 h-3 bg-white border-brand-amber ring-2 ring-brand-amber/80 shadow-md scale-125'
                      : isPassed
                      ? 'w-2 h-2 bg-brand-amber border-white/90 shadow-2xs'
                      : 'w-1.5 h-1.5 bg-brand-slate/25 border-white/40 hover:scale-125 hover:bg-brand-amber/70'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Milestone Hover Card / Preview Tooltip */}
      <AnimatePresence>
        {hoveredMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 max-w-xs w-72 bg-brand-charcoal text-white rounded-2xl p-3 shadow-2xl border border-white/15 backdrop-blur-md pointer-events-none z-50 text-left"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-brand-amber">
                {lang === 'en' ? `Chapter 0${hoveredMilestone.num} of 10` : `Sabaq 0${hoveredMilestone.num} / 10`}
              </span>
              <span className="text-[9px] font-mono text-white/60 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                ~{hoveredMilestone.estMinutes}m
              </span>
            </div>
            <h4 className="font-display text-xs font-bold text-white leading-snug">
              {lang === 'en' ? hoveredMilestone.titleEn : hoveredMilestone.titleHyd}
            </h4>
            <p className="text-[10px] text-white/70 mt-1 leading-relaxed">
              {lang === 'en' ? hoveredMilestone.descriptionEn : hoveredMilestone.descriptionHyd}
            </p>
            <span className="text-[8.5px] font-mono text-brand-amber/90 block mt-2 font-semibold">
              {lang === 'en' ? "👉 Click to jump directly" : "👉 Yahan pohnchne ke liye click karein"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Floating Quick-Progress Drawer Trigger (Visible on hover or click) */}
      <div className="max-w-5xl mx-auto px-4 pointer-events-none">
        <div className="flex justify-end pt-1">
          <AnimatePresence>
            {(isHovered || showDetailCard) && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto bg-white/95 backdrop-blur-md border border-brand-slate/15 rounded-2xl shadow-xl p-3 flex items-center gap-4 text-xs select-none"
              >
                {/* Completion Status Pill */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                    isComplete 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-brand-amber/15 text-brand-amber'
                  }`}>
                    {Math.round(scrollProgress)}%
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-brand-slate uppercase block">
                      {isComplete 
                        ? (lang === 'en' ? "Completed 🎉" : "Mukammal 🎉")
                        : (lang === 'en' ? `Chapter ${currentMilestone.num}/10` : `Sabaq ${currentMilestone.num}/10`)}
                    </span>
                    <span className="font-bold text-brand-charcoal truncate max-w-[150px] sm:max-w-[200px] block">
                      {lang === 'en' ? currentMilestone.shortEn : currentMilestone.shortHyd}
                    </span>
                  </div>
                </div>

                <div className="h-6 w-px bg-brand-slate/15 hidden sm:block" />

                {/* Time Remaining */}
                <div className="hidden sm:flex items-center gap-1.5 text-brand-slate text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-brand-amber" />
                  <span>
                    {isComplete
                      ? (lang === 'en' ? "Full guide read" : "Pura padh liya")
                      : (lang === 'en' ? `~${remainingMinutes} min left` : `~${remainingMinutes} min baqi`)}
                  </span>
                </div>

                <div className="h-6 w-px bg-brand-slate/15" />

                {/* Step Up / Step Down Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={jumpPrev}
                    disabled={activeMilestoneIndex <= 0}
                    className="p-1 rounded-lg hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                    title={lang === 'en' ? "Previous Section" : "Pichla Sabaq"}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={jumpNext}
                    disabled={activeMilestoneIndex >= GUIDE_MILESTONES.length - 1}
                    className="p-1 rounded-lg hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                    title={lang === 'en' ? "Next Section" : "Agla Sabaq"}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollToSection('hero')}
                    className="p-1 rounded-lg hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal cursor-pointer transition-colors ml-1"
                    title={lang === 'en' ? "Back to top" : "Shuru mein jayein"}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
