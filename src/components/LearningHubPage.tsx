import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Trophy, 
  Terminal, 
  Bot, 
  Cpu, 
  Layers, 
  Network, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  Video, 
  LayoutDashboard, 
  Share2, 
  Flame, 
  CheckCircle2, 
  PlayCircle,
  FolderKanban,
  Search,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { LESSON_MODULES, type LessonModule } from './HomeCurriculumGrid';
import SocialShareSection from './SocialShareSection';
import ClayLogo from './ClayLogo';

interface LearningHubPageProps {
  onSelectLesson: (lessonId: string) => void;
  onStartInterview: () => void;
  onOpenDashboard: () => void;
  onViewContinuousGuide: () => void;
}

export default function LearningHubPage({
  onSelectLesson,
  onStartInterview,
  onOpenDashboard,
  onViewContinuousGuide
}: LearningHubPageProps) {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', labelEn: 'All Sections (9)', labelHyd: 'Saare Sabaq (9)' },
    { id: 'Foundations', labelEn: 'Foundations', labelHyd: 'Buniyaad' },
    { id: 'Architecture', labelEn: 'Architecture', labelHyd: 'Dhanche' },
    { id: 'Generative Tech', labelEn: 'Generative AI', labelHyd: 'GenAI' },
    { id: 'Practical Skills', labelEn: 'Practical Skills', labelHyd: 'Hunar' },
    { id: 'Toolbox', labelEn: 'Toolbox', labelHyd: 'Tools' },
    { id: 'Deep Dive', labelEn: 'Deep Dive', labelHyd: 'Tafseel' },
    { id: 'Battleground', labelEn: 'Arena & Quizzes', labelHyd: 'Muqabla' },
    { id: 'Education', labelEn: 'Classroom', labelHyd: 'Taleem' }
  ];

  const filteredModules = LESSON_MODULES.filter(module => {
    const matchesCategory = activeCategory === 'all' || module.categoryEn.toLowerCase() === activeCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      module.titleEn.toLowerCase().includes(query) ||
      module.titleHyd.toLowerCase().includes(query) ||
      module.subtitleEn.toLowerCase().includes(query) ||
      module.tags.some(t => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20 pb-20 text-left">
      {/* Learning Hub Hero Banner */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-charcoal via-[#23272F] to-[#1A1D23] text-white p-8 sm:p-12 border border-brand-amber/25 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-xs font-mono font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>{lang === 'en' ? "Clayverse AI • Complete Learning Hub" : "Clayverse AI • Mukammal Sabaq Hub"}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {lang === 'en' 
                ? "Every section, topic & interactive tool in one place" 
                : lang === 'te'
                ? "అన్ని పాఠ్యాంశాలు మరియు ఇంటరాక్టివ్ సాధనాలు ఒకే చోట"
                : "Saare AI asbaaq, interactive sandboxes aur tools ek hi jagah"}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-brand-sand/80 leading-relaxed max-w-2xl">
              {lang === 'en'
                ? "Explore all 9 comprehensive AI chapters—from Neural Synapses and Large Language Models to RAG systems, tactile memory flashcards, and live mock interview HUDs."
                : lang === 'te'
                ? "కృత్రిమ మేధస్సు భావనలను సులభంగా అర్థం చేసుకోండి మరియు ప్రత్యక్ష సాధనాలతో సాధన చేయండి."
                : "Neural networks, Generative LLMs, Prompt Engineering aur live Arena quizzes ko apni sahulat ke mutabiq step-by-step seekhein."}
            </p>

            {/* Quick Action Buttons Row */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={onStartInterview}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>{lang === 'en' ? "AI Mock Interviewer (Live HUD)" : "AI Mock Interview"}</span>
              </button>

              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-amber" />
                <span>{lang === 'en' ? "Student Dashboard & Stats" : "Student Dashboard"}</span>
              </button>

              <button
                onClick={onViewContinuousGuide}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'en' ? "Continuous Linear Guide" : "Full Guide Mode"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-brand-slate/15 shadow-2xs">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? "Filter lessons by topic, term, or tag..." : "Sabaq ya keyword talash karein..."}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-brand-sand/40 border border-brand-slate/15 text-xs text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:border-brand-amber focus:bg-white transition-all"
            />
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-brand-charcoal text-white shadow-xs'
                    : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal'
                }`}
              >
                {lang === 'en' ? cat.labelEn : cat.labelHyd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of All Comprehensive Learning Hub Sections */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectLesson(module.id)}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white hover:bg-white border border-brand-slate/15 hover:border-brand-amber/50 shadow-sm hover:shadow-xl transition-all cursor-pointer text-left overflow-hidden"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-brand-charcoal text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                      0{module.lessonNum}
                    </span>
                    <span className="text-[10.5px] font-mono font-bold text-brand-muted uppercase tracking-wider">
                      {lang === 'en' ? module.categoryEn : module.categoryHyd}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-brand-muted bg-brand-sand/70 px-2.5 py-1 rounded-full border border-brand-slate/10">
                    <Clock className="w-3 h-3 text-brand-amber" />
                    <span>{module.readTime}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${module.color} border shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-black text-brand-charcoal group-hover:text-brand-amber transition-colors leading-tight">
                        {lang === 'en' ? module.titleEn : module.titleHyd}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-brand-slate leading-relaxed">
                    {lang === 'en' ? module.subtitleEn : module.subtitleHyd}
                  </p>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {module.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-[9.5px] font-medium bg-brand-sand/60 text-brand-slate px-2 py-0.5 rounded-md border border-brand-slate/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="pt-3.5 border-t border-brand-slate/10 flex items-center justify-between text-xs font-bold text-brand-charcoal group-hover:text-brand-amber transition-colors">
                  <span className="flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4 text-brand-amber" />
                    <span>{lang === 'en' ? "Open Interactive Chapter" : "Sabaq Kholein"}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-amber group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-brand-slate/15 my-8">
            <Search className="w-8 h-8 text-brand-muted mx-auto mb-3 opacity-50" />
            <h4 className="font-display font-bold text-base text-brand-charcoal mb-1">
              {lang === 'en' ? "No sections match your search" : "Koi sabaq nahi mila"}
            </h4>
            <p className="text-xs text-brand-muted mb-4">
              {lang === 'en' ? "Try clearing the search query or switching categories." : "Search filter ko clear karein."}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-brand-charcoal text-white text-xs font-bold cursor-pointer"
            >
              {lang === 'en' ? "Reset Filters" : "Reset Karein"}
            </button>
          </div>
        )}
      </div>

      {/* Social Sharing Section */}
      <div className="mt-12">
        <SocialShareSection currentChapterTitle="Clayverse AI Learning Hub" />
      </div>
    </div>
  );
}
