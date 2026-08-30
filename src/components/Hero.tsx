import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  BookOpen, 
  Video, 
  Languages, 
  Sparkles, 
  ArrowRight, 
  PlayCircle, 
  CheckCircle2, 
  Zap, 
  Volume2, 
  Trophy, 
  BrainCircuit,
  Compass,
  ArrowDown,
  Layers
} from 'lucide-react';
import ClayLogo from './ClayLogo';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

export default function Hero() {
  const { t, lang, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'curriculum' | 'interview' | 'languages'>('curriculum');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Mouse parallax motion values for subtle ambient glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const bgGlowX = useTransform(smoothMouseX, [-300, 300], [-15, 15]);
  const bgGlowY = useTransform(smoothMouseY, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const sampleLanguages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'hyd', label: 'Dakhni Urdu', native: 'دکنی اردو' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <section 
      id="hero" 
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 overflow-hidden pt-20 pb-12 select-none"
    >
      {/* Clean Subtle Architectural Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Gentle Ambient Warm Accent Lighting with Parallax Tilt */}
      <motion.div 
        style={{ x: bgGlowX, y: bgGlowY }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] max-w-[90vw] h-[350px] rounded-full bg-brand-amber/10 blur-[100px] pointer-events-none z-0"
      />

      {/* Main Hero Content */}
      <div className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center relative">
        
        {/* Crisp Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-brand-amber/35 rounded-full text-xs font-bold text-brand-amber shadow-xs mb-5 hover:border-brand-amber/60 transition-all hover:scale-[1.02]"
        >
          <ClayLogo size={20} />
          <span className="tracking-tight">{t('hero.badge')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
        </motion.div>

        {/* Master Hook Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-brand-charcoal leading-[1.12] tracking-tight max-w-3xl mb-4 text-balance"
        >
          {lang === 'en' ? (
            <>
              AI is not magic. It’s <span className="text-brand-amber relative inline-block">pattern-matching</span> at massive scale.
            </>
          ) : lang === 'te' ? (
            <>
              AI అంటే మాయ కాదు. ఇది భారీ స్థాయిలో <span className="text-brand-amber relative inline-block">ప్యాటర్న్ మ్యాచింగ్</span> మాత్రమే.
            </>
          ) : (
            <>
              AI koi jaadu nahi hai yaaron. Ye bade paimane par <span className="text-brand-amber relative inline-block">pattern matching</span> hai.
            </>
          )}
        </motion.h1>

        {/* Beginner-Friendly Sub-intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="font-sans text-base sm:text-lg text-brand-slate max-w-2xl leading-relaxed mb-6 text-balance font-normal"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Scannable Key Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 mb-8 text-xs font-medium text-brand-charcoal"
        >
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? "Zero Math Prerequisite" : lang === 'te' ? "గణితం అవసరం లేదు" : "Zero Maths Required"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? "Interactive Visual Sandboxes" : lang === 'te' ? "ఇంటరాక్టివ్ శ్యాండ్‌బాక్స్" : "Live Visual Sandboxes"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? "AI Mock Interview Practice" : lang === 'te' ? "AI మాక్ ఇంటర్వ్యూ" : "Live AI Mock Interview"}</span>
          </div>
        </motion.div>

        {/* Interactive CTA Hub Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left"
        >
          {/* Card 1: 9-Step Curriculum */}
          <div
            onMouseEnter={() => {
              setHoveredCard('curriculum');
            }}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => {
              audioEngine.playLoFiChord();
              const el = document.getElementById('curriculum');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.dispatchEvent(new CustomEvent('clay_open_lesson', { detail: 'what-is-ai' }));
              }
            }}
            className="group relative p-5 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-zinc-900 dark:to-zinc-900 border-2 border-brand-amber/40 hover:border-brand-amber shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-2xl bg-brand-amber text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-xs">
              Primary Course
            </div>

            <div>
              <div className="w-10 h-10 rounded-2xl bg-brand-amber/20 text-brand-amber flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-black text-brand-charcoal group-hover:text-brand-amber transition-colors leading-tight mb-1">
                {lang === 'en' ? "9-Step Curriculum" : "9 Asbaaq Course"}
              </h3>
              <p className="text-xs text-brand-slate leading-relaxed mb-4">
                {lang === 'en'
                  ? "Master mental models, LLMs, prompting, and RAG architectures step-by-step."
                  : "Buniyaadi models se le kar RAG aur Transformers tak aasan visual sabaq."}
              </p>
            </div>

            <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
              <span className="text-xs font-bold text-brand-amber flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4" />
                <span>{lang === 'en' ? "Start Learning" : "Sabak Shuru Karein"}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-brand-amber group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: AI Mock Interviewer */}
          <div
            onMouseEnter={() => setHoveredCard('interview')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => {
              audioEngine.playClick();
              window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'interview' }));
            }}
            className="group relative p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900 border border-brand-slate/15 hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-2xl bg-blue-500/15 text-blue-600 font-mono text-[10px] font-bold uppercase tracking-wider">
              Simulation
            </div>

            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-black text-brand-charcoal group-hover:text-blue-600 transition-colors leading-tight mb-1">
                {lang === 'en' ? "AI Mock Interview" : "AI Mock Interview"}
              </h3>
              <p className="text-xs text-brand-slate leading-relaxed mb-4">
                {lang === 'en'
                  ? "Practice real ML job questions with live camera feedback, speech metrics, and rubric scoring."
                  : "Live video aur audio feedback ke sath real interview practice karein."}
              </p>
            </div>

            <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>{lang === 'en' ? "Practice Live" : "Interview Kholein"}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 25+ Indian Languages */}
          <div
            onMouseEnter={() => setHoveredCard('languages')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => {
              audioEngine.playPop();
              window.dispatchEvent(new CustomEvent('clay_open_languages_showcase'));
            }}
            className="group relative p-5 rounded-3xl bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-900 border border-brand-slate/15 hover:border-emerald-500/50 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-2xl bg-emerald-500/15 text-emerald-600 font-mono text-[10px] font-bold uppercase tracking-wider">
              25+ Dialects
            </div>

            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                <Languages className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-black text-brand-charcoal group-hover:text-emerald-600 transition-colors leading-tight mb-1">
                {lang === 'en' ? "Native Languages" : "Apni Zabaan Mein"}
              </h3>
              <p className="text-xs text-brand-slate leading-relaxed mb-3">
                {lang === 'en'
                  ? "Read or listen with full text-to-speech in Hindi, Dakhni, Telugu, Tamil, and Bengali."
                  : "Urdu, Telugu, Hindi aur Tamil mein aasaani se seekhein aur sunein."}
              </p>
              
              {/* Mini Language Selector Chips */}
              <div className="flex flex-wrap gap-1 mb-2">
                {sampleLanguages.slice(0, 5).map((l) => (
                  <button
                    key={l.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playClick();
                      setLanguage(l.code as any);
                    }}
                    className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                      lang === l.code
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-brand-sand/70 dark:bg-zinc-800 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand'
                    }`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                <span>{lang === 'en' ? "Explore Dialects" : "Zabaanein Dekhein"}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Direct Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          <button
            onClick={() => {
              audioEngine.playLoFiChord();
              const el = document.getElementById('curriculum');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.dispatchEvent(new CustomEvent('clay_open_lesson', { detail: 'what-is-ai' }));
            }}
            className="px-6 py-3 rounded-2xl bg-brand-charcoal hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-xl transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brand-amber" />
            <span>{lang === 'te' ? '9-పాఠాల కోర్స్ ప్రారంభించండి' : lang === 'hi' ? '9-पाठों का AI कोर्स शुरू करें' : 'Start 9-Step AI Course'}</span>
            <ArrowDown className="w-4 h-4 text-brand-amber" />
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'interview' }));
            }}
            className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-brand-sand/50 border border-brand-slate/20 hover:border-brand-charcoal text-brand-charcoal font-bold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Video className="w-4 h-4 text-blue-600" />
            <span>{lang === 'te' ? 'AI మాక్ ఇంటర్వ్యూ' : lang === 'hi' ? 'AI मॉक इंटरव्यूअर' : 'AI Mock Interviewer'}</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playPop();
              window.dispatchEvent(new CustomEvent('clay_open_tts_reader', { detail: { text: "AI is pattern matching at massive scale.", title: "Introduction to AI" } }));
            }}
            className="px-4 py-3 rounded-2xl bg-white/80 dark:bg-zinc-800/80 hover:bg-white border border-brand-slate/20 text-brand-slate hover:text-brand-charcoal font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-brand-amber" />
            <span>{lang === 'en' ? "Listen Narration" : "Awaaz Sunein"}</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

