import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import ClayLogo from './ClayLogo';
import { useLanguage } from '../hooks/useLanguage';

export default function Hero() {
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

        {/* Subtle Scroll Indicator */}
        <motion.button
          onClick={() => {
            const el = document.getElementById('curriculum') || document.getElementById('main-content');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center gap-1.5 text-xs font-semibold text-brand-slate hover:text-brand-amber transition-colors group cursor-pointer mt-2"
        >
          <span className="text-[11px] font-mono tracking-wider uppercase text-brand-muted group-hover:text-brand-amber">
            {lang === 'en' ? "Explore Curriculum" : "Syllabus Dekhein"}
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/15 flex items-center justify-center shadow-2xs group-hover:border-brand-amber/40 transition-all"
          >
            <ArrowDown className="w-3.5 h-3.5 text-brand-slate group-hover:text-brand-amber" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}


