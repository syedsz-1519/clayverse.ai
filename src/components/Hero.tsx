import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface HeroProps {
  onStartFirstLesson?: () => void;
  onExploreCurriculum?: () => void;
}

export default function Hero({ onStartFirstLesson, onExploreCurriculum }: HeroProps) {
  const { t, lang } = useLanguage();

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

  return (
    <section 
      id="hero" 
      onMouseMove={handleMouseMove}
      className="relative min-h-[60vh] sm:min-h-[65vh] flex flex-col justify-center items-center px-6 overflow-hidden pt-20 pb-8 select-none"
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
      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center relative">
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

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3.5 mb-6"
        >
          <button
            onClick={() => {
              if (onStartFirstLesson) {
                onStartFirstLesson();
              } else {
                const el = document.getElementById('curriculum') || document.getElementById('main-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#A8481F] hover:bg-[#8C3A16] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-0.5"
          >
            <BookOpen className="w-4 h-4 text-white/90" />
            <span>{lang === 'en' ? "Start Lesson 1: How Machines Learn" : "Sabaq 1 Shuru Karein"}</span>
            <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              if (onExploreCurriculum) {
                onExploreCurriculum();
              } else {
                const el = document.getElementById('curriculum') || document.getElementById('main-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold border border-neutral-300 shadow-xs hover:border-neutral-400 transition-all cursor-pointer"
          >
            <span>{lang === 'en' ? "Browse All 9 Lessons" : "Tamam 9 Sabaq"}</span>
          </button>
        </motion.div>

        {/* Feature Value Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-500 font-medium"
        >
          <span className="flex items-center gap-1.5 bg-white/90 border border-neutral-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Zero Math Required
          </span>
          <span className="flex items-center gap-1.5 bg-white/90 border border-neutral-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <Volume2 className="w-3.5 h-3.5 text-[#A8481F]" />
            Vernacular Audio Voice
          </span>
          <span className="flex items-center gap-1.5 bg-white/90 border border-neutral-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Hands-on Sandboxes
          </span>
        </motion.div>
      </div>
    </section>
  );
}


