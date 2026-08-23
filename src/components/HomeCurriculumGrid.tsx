import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';

export interface LessonModule {
  id: string;
  lessonNum: number;
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
}

export default function HomeCurriculumGrid({ onSelectLesson, onViewContinuousGuide }: HomeCurriculumGridProps) {
  const { lang } = useLanguage();

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 text-left">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-brand-slate/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/15 text-brand-amber text-xs font-bold font-mono uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? "Clayverse AI Curriculum" : lang === 'te' ? "కోర్స్ సిలబస్" : "Mukammal AI Course"}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-brand-charcoal tracking-tight">
            {lang === 'en' ? "Individual AI Learning Modules" : lang === 'te' ? "ప్రత్యేక పాఠ్యాంశాలు" : "Khaas AI Sabaq Modules"}
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate max-w-2xl mt-1.5 leading-relaxed">
            {lang === 'en'
              ? "Master AI chapter-by-chapter at your own pace with bite-sized lessons, interactive sandboxes, and instant knowledge checks."
              : lang === 'te'
              ? "మీ స్వంత వేగంతో ఇంటరాక్టివ్ పాఠాలను అన్వేషించండి."
              : "Apni marzi ke mutabiq har chapter ko tafseel se seekhein, widgets chalayein aur quizzes solve karein."}
          </p>
        </div>

        {/* View All / Continuous Reading Button */}
        <button
          onClick={onViewContinuousGuide}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-brand-sand border border-brand-slate/20 hover:border-brand-amber text-brand-charcoal font-bold text-xs sm:text-sm shadow-2xs hover:shadow-sm transition-all cursor-pointer shrink-0"
        >
          <BookOpen className="w-4 h-4 text-brand-amber" />
          <span>{lang === 'en' ? "Continuous Guide Mode" : "Mukammal Guide Padhein"}</span>
          <ChevronRight className="w-3.5 h-3.5 text-brand-muted" />
        </button>
      </div>

      {/* Grid of 9 Clean Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LESSON_MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectLesson(module.id)}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white/90 hover:bg-white border border-brand-slate/15 hover:border-brand-amber/50 shadow-sm hover:shadow-xl transition-all cursor-pointer text-left overflow-hidden"
            >
              {/* Top Row: Lesson Number & Category Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-brand-charcoal text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                    0{module.lessonNum}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-brand-muted uppercase tracking-wider">
                    {lang === 'en' ? module.categoryEn : module.categoryHyd}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-brand-muted bg-brand-sand/70 px-2 py-0.5 rounded-full border border-brand-slate/10">
                  <Clock className="w-3 h-3 text-brand-amber" />
                  <span>{module.readTime}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2 mb-5">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${module.color} border shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-black text-brand-charcoal group-hover:text-brand-amber transition-colors leading-tight">
                      {lang === 'en' ? module.titleEn : module.titleHyd}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-brand-slate leading-relaxed line-clamp-2">
                  {lang === 'en' ? module.subtitleEn : module.subtitleHyd}
                </p>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {module.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[9.5px] font-medium bg-brand-sand/60 text-brand-slate px-2 py-0.5 rounded-md border border-brand-slate/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom Card Action */}
              <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between text-xs font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                <span className="flex items-center gap-1">
                  <PlayCircle className="w-3.5 h-3.5 text-brand-amber" />
                  <span>{lang === 'en' ? "Open Lesson Page" : "Sabaq Kholein"}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-brand-amber group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
