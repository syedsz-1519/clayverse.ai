import { useState, useEffect, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, ArrowDown, Activity, Cpu, Network, Binary, Lightbulb, Compass, CheckCircle2 } from 'lucide-react';
import ClayLogo from './ClayLogo';
import { useLanguage } from '../hooks/useLanguage';
import aiHeroBg from '../assets/images/ai_hero_bg_1787017861246.jpg';

export default function Hero() {
  const { t, lang } = useLanguage();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const bgOrb1X = useTransform(smoothMouseX, [-300, 300], [-25, 25]);
  const bgOrb1Y = useTransform(smoothMouseY, [-300, 300], [-25, 25]);
  const bgOrb2X = useTransform(smoothMouseX, [-300, 300], [30, -30]);
  const bgOrb2Y = useTransform(smoothMouseY, [-300, 300], [30, -30]);
  const particlesX = useTransform(smoothMouseX, [-300, 300], [-15, 15]);
  const particlesY = useTransform(smoothMouseY, [-300, 300], [-15, 15]);
  const bgImageScale = useTransform(smoothMouseY, [-300, 300], [1.03, 1.07]);
  const bgImageTranslate = useTransform(smoothMouseX, [-300, 300], [-12, 12]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  // Ambient floating background symbols representing math/AI foundation
  const floatingGlyphs = [
    { text: 'W·x + b', x: '12%', y: '22%', delay: 0 },
    { text: 'σ(z)', x: '85%', y: '18%', delay: 1.2 },
    { text: '∇L(θ)', x: '8%', y: '72%', delay: 0.8 },
    { text: 'P(w|ctx)', x: '88%', y: '68%', delay: 2.1 },
    { text: 'softmax(z)', x: '78%', y: '42%', delay: 1.5 },
    { text: 'd_model=768', x: '16%', y: '48%', delay: 2.7 },
  ];

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
      className="relative min-h-[95vh] flex flex-col justify-center items-center px-6 overflow-hidden pt-20 pb-16 select-none"
    >
      {/* Progressive AI Background Image with High Clarity & Parallax Motion */}
      <motion.div 
        style={{ scale: bgImageScale, x: bgImageTranslate }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <img
          src={aiHeroBg}
          alt="Abstract Neural Network AI Visual Architecture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-85 sm:opacity-90 filter contrast-105 saturate-105"
        />
        {/* Soft Radial Backing specifically behind center content so text has pristine contrast */}
        <div className="absolute inset-0 bg-radial-[ellipse_at_center,rgba(245,242,237,0.85)_0%,rgba(245,242,237,0.45)_50%,transparent_85%] pointer-events-none" />
        {/* Subtle bottom fade so background transitions smoothly into the next content section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-cream via-brand-cream/70 to-transparent pointer-events-none" />
      </motion.div>

      {/* Dynamic Background Graphic Elements (Softened & Transparent) */}
      
      {/* 1. Subtle Precision Coordinate Grid */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 2. Concentric Geometric Orbital Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-20 z-0">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-brand-amber/20"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-16 rounded-full border border-brand-slate/15"
        />
        <motion.div 
          animate={{ rotate: 180 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-32 rounded-full border border-dotted border-brand-amber/25"
        />
        
        {/* Orbital Pulse Nodes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-amber/80 shadow-[0_0_10px_rgba(217,119,6,0.6)]" />
        </motion.div>
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-16"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-brand-slate/80 shadow-[0_0_8px_rgba(71,85,105,0.5)]" />
        </motion.div>
      </div>

      {/* 3. Fluid Responsive Ambient Luminous Meshes with Parallax Tilt */}
      <motion.div 
        style={{ x: bgOrb1X, y: bgOrb1Y }}
        className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-gradient-to-tr from-brand-amber/10 via-amber-400/5 to-transparent blur-[100px] pointer-events-none z-0"
      />
      <motion.div 
        style={{ x: bgOrb2X, y: bgOrb2Y }}
        className="absolute bottom-1/4 right-1/5 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-brand-slate/10 via-sky-600/5 to-transparent blur-[120px] pointer-events-none z-0"
      />

      {/* 4. Ambient Mathematical & Pattern Floating Glyphs */}
      <motion.div 
        style={{ x: particlesX, y: particlesY }}
        className="absolute inset-0 pointer-events-none hidden sm:block z-0"
      >
        {floatingGlyphs.map((glyph, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0.2, 0.55, 0.2], 
              y: [0, -12, 0] 
            }}
            transition={{ 
              duration: 5 + index, 
              repeat: Infinity, 
              delay: glyph.delay, 
              ease: 'easeInOut' 
            }}
            className="absolute font-mono text-[11px] font-medium text-brand-slate/60 tracking-wider px-2 py-0.5 rounded border border-brand-slate/10 bg-white/40 backdrop-blur-[2px] shadow-2xs"
            style={{ left: glyph.x, top: glyph.y }}
          >
            {glyph.text}
          </motion.div>
        ))}

        {/* Subtle Decorative Technical Corner Reticles */}
        <div className="absolute top-12 left-10 font-mono text-[9px] text-brand-slate/50 tracking-widest uppercase flex items-center gap-1.5 bg-white/50 px-2.5 py-1 rounded-md border border-brand-slate/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>BEGINNER_TRACK // ONLINE</span>
        </div>
        <div className="absolute top-12 right-10 font-mono text-[9px] text-brand-slate/50 tracking-widest uppercase bg-white/50 px-2.5 py-1 rounded-md border border-brand-slate/10">
          <span>ZERO_JARGON_MODE: ACTIVE</span>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center relative">
        {/* Subtle Radial Backlight Glow for maximum text readability */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] max-w-[95vw] h-[480px] bg-white/70 backdrop-blur-sm rounded-[40px] pointer-events-none -z-10 shadow-2xl shadow-brand-slate/5 border border-white/60" />

        {/* Subtle Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/95 backdrop-blur-md border border-brand-amber/30 rounded-full text-xs font-bold text-brand-amber shadow-sm mb-6 hover:border-brand-amber/60 transition-all hover:scale-105"
        >
          <ClayLogo size={20} />
          <span>{t('hero.badge')}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
        </motion.div>

        {/* Master Hook Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black text-slate-900 leading-[1.08] tracking-tight max-w-3xl mb-6 text-balance drop-shadow-sm"
        >
          {lang === 'en' ? (
            <>
              AI is not magic. It’s <span className="text-brand-amber relative inline-block underline decoration-brand-amber/40 decoration-wavy underline-offset-8">pattern-matching</span> at massive scale.
            </>
          ) : lang === 'te' ? (
            <>
              AI అంటే మాయ కాదు. ఇది భారీ స్థాయిలో <span className="text-brand-amber relative inline-block underline decoration-brand-amber/40 decoration-wavy underline-offset-8">ప్యాటర్న్ మ్యాచింగ్</span> మాత్రమే.
            </>
          ) : (
            <>
              AI koi jaadu nahi hai yaaron. Ye bade paimane par <span className="text-brand-amber relative inline-block underline decoration-brand-amber/40 decoration-wavy underline-offset-8">pattern matching</span> hai.
            </>
          )}
        </motion.h1>

        {/* Captivating Beginner-Friendly Sub-intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-sans text-base sm:text-lg md:text-xl text-slate-700 max-w-2xl leading-relaxed mb-5 text-balance font-medium"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Scannable Key Beginner Hooks */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-7 text-xs sm:text-sm font-semibold text-slate-800"
        >
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'en' ? "Visual analogies" : lang === 'te' ? "విజువల్ ఉదాహరణలు" : "Aasan misaalein"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'en' ? "Hands-on sandboxes" : lang === 'te' ? "ఇంటరాక్టివ్ శ్యాండ్‌బాక్స్" : "Live interactive sandboxes"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'en' ? "25+ Indian Languages" : lang === 'te' ? "25+ భారతీయ భాషల మద్దతు" : "25+ Zabaano mein support"}</span>
          </div>
        </motion.div>

        {/* Tactile Interactive Pattern Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative w-full max-w-lg h-56 bg-white/85 border border-brand-slate/15 rounded-2xl p-6 mb-10 shadow-lg shadow-brand-slate/5 flex flex-col justify-between overflow-hidden backdrop-blur-md hover:border-brand-amber/35 transition-all"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

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
                    transition={{ duration: 1.5, delay: 0.8 }}
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
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: hoveredNode === node.id ? node.color : '#ffffff',
                  border: `2.5px solid ${node.color}`,
                  boxShadow: hoveredNode === node.id 
                    ? `0 0 18px ${node.color}60, inset 0 1px 2px rgba(255,255,255,0.6)`
                    : '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full transition-transform duration-300 group-hover:scale-125"
                  style={{ backgroundColor: hoveredNode === node.id ? '#ffffff' : node.color }}
                />
              </div>
            </button>
          ))}

          {/* Tactile interaction instructions */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs text-brand-muted pointer-events-none">
            <span className="font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse inline-block" />
              {t('hero.canvas.instruction')}
            </span>
            <span className="font-mono bg-brand-sand px-2 py-0.5 rounded border border-brand-slate/10 text-[10px]">{t('hero.canvas.engine')}</span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={() => {
            const el = document.getElementById('what-is-ai');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col items-center gap-2 text-xs font-semibold text-brand-slate hover:text-brand-amber transition-colors group cursor-pointer"
        >
          <span>{t('hero.button')}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-white border border-brand-slate/10 flex items-center justify-center shadow-sm group-hover:border-brand-amber/30 group-hover:shadow-md transition-all"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
