import React from 'react';
import { 
  BookOpen, 
  Video, 
  LayoutDashboard, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Brain, 
  Layers,
  GraduationCap,
  Volume2,
  Terminal,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

interface StructuredHubShowcaseProps {
  onOpenCurriculum: () => void;
  onOpenInterview: () => void;
  onOpenDashboard: () => void;
  onOpenLearningHub: () => void;
  onOpenLesson: (lessonId: string) => void;
}

export default function StructuredHubShowcase({
  onOpenCurriculum,
  onOpenInterview,
  onOpenDashboard,
  onOpenLearningHub,
  onOpenLesson
}: StructuredHubShowcaseProps) {
  const { lang } = useLanguage();

  const hubs = [
    {
      id: 'curriculum',
      badge: 'Core Syllabus',
      titleEn: '9-Step Zero-Math Curriculum',
      titleHyd: '9 Sabaq Zero-Math Curriculum',
      descEn: 'From intuitive mental models and next-token prediction to RAG architectures with live sandboxes.',
      descHyd: 'Intuitive mental models se le kar RAG aur Transformers tak mukammal visual sabaq.',
      icon: BookOpen,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-600',
      actionTextEn: 'Explore 9 Lessons',
      actionTextHyd: '9 Asbaaq Dekhein',
      action: onOpenCurriculum,
      tags: ['Mental Models', 'RAG', 'Transformers']
    },
    {
      id: 'interview',
      badge: 'Simulation',
      titleEn: 'AI Mock Interviewer',
      titleHyd: 'AI Mock Interviewer',
      descEn: 'Practice live AI/ML engineering interviews with real-time video feedback, voice synthesis, and rubric scoring.',
      descHyd: 'Live camera aur mic ke sath AI job interview practice karein aur score hasil karein.',
      icon: Video,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-600',
      actionTextEn: 'Launch Interview',
      actionTextHyd: 'Interview Shuru Karein',
      action: onOpenInterview,
      tags: ['Camera Tracking', 'Speech Rubrics', 'Instant Scorecard']
    },
    {
      id: 'dashboard',
      badge: 'Analytics',
      titleEn: 'Student Dashboard & Bento Hub',
      titleHyd: 'Student Analytics aur Bento',
      descEn: 'Track your learning velocity, streak heatmaps, knowledge quiz scores, and export verified certificates.',
      descHyd: 'Apni daily streak, quiz history, aur verified certificate dekhein.',
      icon: LayoutDashboard,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-600',
      actionTextEn: 'View Dashboard',
      actionTextHyd: 'Dashboard Kholein',
      action: onOpenDashboard,
      tags: ['Streak Tracking', 'Skill Radar', 'PDF Certificates']
    },
    {
      id: 'arena',
      badge: 'Drills & Memory',
      titleEn: 'AI Arena & Flashcards Deck',
      titleHyd: 'AI Arena aur Memory Flashcards',
      descEn: 'Battle against the clock in adaptive quiz challenges and retain 85+ terms with flip flashcards.',
      descHyd: 'Time-attack quiz battles aur flashcards se dimag ko taaza karein.',
      icon: Trophy,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-600',
      actionTextEn: 'Play Arena & Cards',
      actionTextHyd: 'Quiz aur Cards Kholein',
      action: () => onOpenLesson('arena'),
      tags: ['Timed Quizzes', 'Streak Multipliers', 'Spaced Repetition']
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-brand-slate/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/15 text-brand-amber text-xs font-bold font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? "Engineered Learning Ecosystem" : "AI Learning Ecosystem"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
            {lang === 'en' ? "Four Pillars of Clayverse AI" : "Clayverse AI ke 4 Khaas Nizaam"}
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate max-w-xl mt-1 leading-relaxed">
            {lang === 'en' 
              ? "Everything you need to go from absolute beginner to industry-ready AI practitioner in one cohesive workspace."
              : "Buniyaadi taleem se le kar real-world mock interviews aur memory retention tak."}
          </p>
        </div>

        <button
          onClick={() => {
            audioEngine.playClick();
            onOpenLearningHub();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-brand-sand border border-brand-slate/20 hover:border-brand-amber text-brand-charcoal font-bold text-xs shadow-2xs hover:shadow-sm transition-all cursor-pointer shrink-0"
        >
          <GraduationCap className="w-4 h-4 text-brand-amber" />
          <span>{lang === 'en' ? "Open Master Learning Hub" : "Master Hub Kholein"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-muted" />
        </button>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {hubs.map((hub) => {
          const Icon = hub.icon;
          return (
            <motion.div
              key={hub.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                audioEngine.playLoFiChord();
                hub.action();
              }}
              className="group flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden text-left"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                    {hub.badge}
                  </span>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${hub.color} border group-hover:scale-110 transition-transform shadow-2xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 className="font-display text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors leading-tight mb-2">
                  {lang === 'en' ? hub.titleEn : hub.titleHyd}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-4 line-clamp-3">
                  {lang === 'en' ? hub.descEn : hub.descHyd}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {hub.tags.map((t, idx) => (
                    <span key={idx} className="text-[9px] font-mono font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-0.5 rounded border border-slate-200/80 dark:border-zinc-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                <span>{lang === 'en' ? hub.actionTextEn : hub.actionTextHyd}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
