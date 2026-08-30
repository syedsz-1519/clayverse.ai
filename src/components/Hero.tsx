import { useState, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown, CheckCircle2 } from 'lucide-react';
import ClayLogo from './ClayLogo';
import { useLanguage } from '../hooks/useLanguage';

export default function Hero() {
  const { t, lang } = useLanguage();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const bgGlowX = useTransform(smoothMouseX, [-300, 300], [-15, 15]);
  const bgGlowY = useTransform(smoothMouseY, [-300, 300], [-15, 15]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  // A list of interactive "data points" for a miniature pattern matching game
  const nodes = [
    { id: 1, x: 25, y: 35, color: '#d97706', matches: [3, 5] },
    { id: 2, x: 75, y: 25, color: '#475569', matches: [4, 6] },
    { id: 3, x: 35, y: 70, color: '#d97706', matches: [1, 5] },
    { id: 4, x: 80, y: 65, color: '#475569', matches: [2, 6] },
    { id: 5, x: 50, y: 50, color: '#d97706', matches: [1, 3] },
    { id: 6, x: 65, y: 80, color: '#475569', matches: [2, 4] },
  ];

  return (
    <section 
      id="hero" 
      onMouseMove={handleMouseMove}
      className="relative min-h-[88vh] flex flex-col justify-center items-center px-6 overflow-hidden pt-24 pb-16 select-none"
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
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] h-[350px] rounded-full bg-brand-amber/8 blur-[100px] pointer-events-none z-0"
      />

      {/* Main Hero Content */}
      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center relative">
        
        {/* Crisp Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-brand-amber/35 rounded-full text-xs font-bold text-brand-amber shadow-xs mb-6 hover:border-brand-amber/60 transition-all hover:scale-[1.02]"
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
          className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-brand-charcoal leading-[1.12] tracking-tight max-w-3xl mb-5 text-balance"
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
          className="font-sans text-base sm:text-lg md:text-xl text-brand-slate max-w-2xl leading-relaxed mb-6 text-balance font-normal"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Scannable Key Beginner Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 mb-8 text-xs sm:text-sm font-medium text-brand-charcoal"
        >
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/5 dark:border-white/10 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? "Visual analogies" : lang === 'te' ? "విజువల్ ఉదాహరణలు" : "Aasan misaalein"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/5 dark:border-white/10 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? "Hands-on sandboxes" : lang === 'te' ? "ఇంటరాక్టివ్ శ్యాండ్‌బాక్స్" : "Live interactive sandboxes"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/5 dark:border-white/10 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? "25+ Indian Languages" : lang === 'te' ? "25+ భారతీయ భాషల మద్దతు" : "25+ Zabaano mein support"}</span>
          </div>
        </motion.div>

        {/* Tactile Interactive Pattern Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="relative w-full max-w-lg h-52 bg-white/95 dark:bg-zinc-900/90 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-5 mb-8 shadow-md flex flex-col justify-between overflow-hidden backdrop-blur-md hover:border-brand-amber/40 transition-all"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node) => 
              node.matches.map((matchId) => {
                const targetNode = nodes.find((n) => n.id === matchId);
                if (!targetNode || node.id > matchId) return null; // Avoid duplicate lines
                const isMatchingHover = hoveredNode === node.id || hoveredNode === targetNode.id;
                return (
                  <motion.line
                    key={`${node.id}-${matchId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${targetNode.x}%`}
                    y2={`${targetNode.y}%`}
                    stroke={isMatchingHover ? node.color : '#cbd5e1'}
                    strokeWidth={isMatchingHover ? 2.5 : 1}
                    strokeDasharray={isMatchingHover ? '0' : '4,4'}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Nodes */}
          {nodes.map((node) => (
            <button
              key={node.id}
              className="absolute group -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              aria-label={`Interactive pattern node ${node.id}`}
            >
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: hoveredNode === node.id ? node.color : '#ffffff',
                  border: `2px solid ${node.color}`,
                  boxShadow: hoveredNode === node.id 
                    ? `0 0 14px ${node.color}70, inset 0 1px 2px rgba(255,255,255,0.6)`
                    : '0 2px 5px rgba(0,0,0,0.06)'
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: hoveredNode === node.id ? '#ffffff' : node.color }}
                />
              </div>
            </button>
          ))}

          {/* Tactile interaction instructions */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-brand-muted pointer-events-none">
            <span className="font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse inline-block" />
              {t('hero.canvas.instruction')}
            </span>
            <span className="font-mono bg-brand-sand/70 dark:bg-zinc-800 px-2 py-0.5 rounded border border-black/5 dark:border-white/10 text-[10px]">{t('hero.canvas.engine')}</span>
          </div>
        </motion.div>

        {/* Clear Action CTA Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <button
            onClick={() => {
              const el = document.getElementById('curriculum') || document.getElementById('curriculum-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.dispatchEvent(new CustomEvent('clay_open_lesson', { detail: 'what-is-ai' }));
            }}
            className="px-6 py-3 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
          >
            <span>{lang === 'te' ? '9-పాఠాల కోర్స్ ప్రారంభించండి' : lang === 'hi' ? '9-पाठों का AI कोर्स शुरू करें' : 'Explore 9-Step Curriculum'}</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('clay_navigate_view', { detail: 'interview' }));
            }}
            className="px-5 py-3 rounded-xl bg-brand-charcoal hover:bg-black text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{lang === 'te' ? 'AI మాక్ ఇంటర్వ్యూ' : lang === 'hi' ? 'AI मॉक इंटरव्यूअर' : 'AI Mock Interviewer'}</span>
          </button>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('clay_open_languages_showcase'));
            }}
            className="px-5 py-3 rounded-xl bg-white dark:bg-zinc-800 hover:bg-brand-sand/40 border border-black/10 dark:border-white/10 text-brand-charcoal font-semibold text-sm shadow-xs hover:border-brand-amber/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{lang === 'te' ? '25+ భారతీయ భాషలు' : lang === 'hi' ? '25+ भारतीय भाषाएं' : '25+ Indian Languages'}</span>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={() => {
            const el = document.getElementById('curriculum') || document.getElementById('what-is-ai');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col items-center gap-2 text-xs font-semibold text-brand-slate hover:text-brand-amber transition-colors group cursor-pointer"
        >
          <span>{t('hero.button')}</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/15 flex items-center justify-center shadow-2xs group-hover:border-brand-amber/40 group-hover:shadow-xs transition-all"
          >
            <ArrowDown className="w-3.5 h-3.5 text-brand-slate group-hover:text-brand-amber" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
