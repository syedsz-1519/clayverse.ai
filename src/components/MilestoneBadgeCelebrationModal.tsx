import React, { useEffect, useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Sparkles,
  Award,
  Star,
  Zap,
  CheckCircle2,
  Share2,
  X,
  RotateCcw,
  Flame,
  ArrowRight,
  ShieldCheck,
  Crown,
  Check
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import { LearningMilestone } from './LearningMilestonesSection';

interface MilestoneBadgeCelebrationModalProps {
  isOpen: boolean;
  milestone: LearningMilestone | null;
  onClose: () => void;
  onClaim?: (milestone: LearningMilestone) => void;
}

// Synthesize pleasant celebratory fanfare progression
function playCelebrationFanfare() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Fanfare Notes: C5 (523.25), E5 (659.25), G5 (783.99), B5 (987.77), C6 (1046.50), E6 (1318.51)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    const now = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index >= 4 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.09);

      // Envelope
      gain.gain.setValueAtTime(0, now + index * 0.09);
      gain.gain.linearRampToValueAtTime(0.22, now + index * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.09 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.09);
      osc.stop(now + index * 0.09 + 0.95);
    });
  } catch {
    // Gracefully handle browser autoplay policies
  }
}

// Generate static deterministic particle specs for Framer Motion confetti
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'pill' | 'star';
  rotate: number;
  delay: number;
}

const CELEBRATION_COLORS = [
  '#f59e0b', // Brand Amber
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#eab308'  // Yellow
];

function generateConfettiParticles(count = 50): ConfettiParticle[] {
  const list: ConfettiParticle[] = [];
  const shapes: ('circle' | 'square' | 'pill' | 'star')[] = ['circle', 'square', 'pill', 'star'];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const distance = 140 + Math.random() * 260;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance - 40; // Slight upward bias

    list.push({
      id: i,
      x: 0,
      y: 0,
      targetX,
      targetY,
      size: Math.random() * 10 + 6,
      color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotate: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.18
    });
  }
  return list;
}

export default function MilestoneBadgeCelebrationModal({
  isOpen,
  milestone,
  onClose,
  onClaim
}: MilestoneBadgeCelebrationModalProps) {
  const { lang } = useLanguage();
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [burstKey, setBurstKey] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [displayedXp, setDisplayedXp] = useState(0);

  // Trigger celebration effects on open
  useEffect(() => {
    if (isOpen && milestone) {
      playCelebrationFanfare();
      setParticles(generateConfettiParticles(56));
      setBurstKey(prev => prev + 1);

      // Animate XP count up from 0 to milestone.xpReward
      setDisplayedXp(0);
      const target = milestone.xpReward;
      const duration = 1200;
      const steps = 30;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const nextVal = Math.round(eased * target);
        setDisplayedXp(nextVal);

        if (currentStep >= steps) {
          clearInterval(timer);
          setDisplayedXp(target);
        }
      }, stepDuration);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isOpen, milestone]);

  const handleReplayCelebration = () => {
    playCelebrationFanfare();
    setParticles(generateConfettiParticles(56));
    setBurstKey(prev => prev + 1);
  };

  const handleShare = () => {
    if (!milestone) return;
    const text = `🎉 I just unlocked the "${milestone.title.en}" ${milestone.tier} Learning Milestone on Clayverse AI Academy! 🏆 Earned +${milestone.xpReward} XP!`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2800);
  };

  const handleClaim = () => {
    audioEngine.playLoFiChord();
    if (milestone && onClaim) {
      onClaim(milestone);
    }
    onClose();
  };

  if (!milestone) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Scrim with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md"
          />

          {/* Celebration Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{
              type: 'spring',
              damping: 22,
              stiffness: 260
            }}
            className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-white/20 shadow-2xl space-y-6 text-center z-10 overflow-hidden select-none"
          >
            {/* Background Radiant Spinning Glow Rays */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center -top-20 overflow-hidden opacity-35">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="w-96 h-96 rounded-full bg-[conic-gradient(from_0deg,#f59e0b_0deg,#10b981_72deg,#8b5cf6_144deg,#ec4899_216deg,#3b82f6_288deg,#f59e0b_360deg)] opacity-25 blur-xl"
              />
            </div>

            {/* Confetti Explosion System (Framer Motion) */}
            <div key={burstKey} className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  initial={{
                    x: p.x,
                    y: p.y,
                    scale: 0,
                    opacity: 1,
                    rotate: 0
                  }}
                  animate={{
                    x: p.targetX,
                    y: p.targetY,
                    scale: [0, 1.3, 1, 0.8],
                    opacity: [1, 1, 0.9, 0],
                    rotate: p.rotate
                  }}
                  transition={{
                    duration: 2.2,
                    delay: p.delay,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="absolute"
                  style={{
                    width: p.size,
                    height: p.shape === 'pill' ? p.size * 2 : p.size,
                    backgroundColor: p.color,
                    borderRadius:
                      p.shape === 'circle' ? '9999px' : p.shape === 'pill' ? '9999px' : '3px'
                  }}
                />
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal transition-all cursor-pointer z-20"
              title="Close Celebration"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Top Eyebrow Tag */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{lang === 'en' ? "New Milestone Achieved!" : "Naya Milestone Mukammal!"}</span>
              </motion.div>
            </div>

            {/* Central Badge Avatar with Multi-Ring Shockwaves */}
            <div className="relative flex items-center justify-center my-2">
              {/* Concentric Expanding Shockwave Waves */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: [0.8, 1.8], opacity: [0.8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-28 h-28 rounded-full border-2 border-amber-400/40 pointer-events-none"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: [0.8, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, delay: 0.3, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-28 h-28 rounded-full border-2 border-emerald-400/30 pointer-events-none"
              />

              {/* Main Badge Pop-in Box */}
              <motion.div
                initial={{ scale: 0, rotate: -25, opacity: 0 }}
                animate={{
                  scale: [0, 1.25, 0.95, 1.05, 1],
                  rotate: [-25, 12, -6, 2, 0],
                  opacity: 1
                }}
                transition={{
                  type: 'spring',
                  damping: 14,
                  stiffness: 200,
                  delay: 0.1
                }}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl shadow-xl border-2 ${
                  milestone.unlocked ? milestone.borderClass : 'border-amber-400/60'
                } bg-gradient-to-br ${milestone.gradient} text-white`}
              >
                {/* Floating Gentle Bobbing after Landing */}
                <motion.span
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="drop-shadow-md select-none"
                >
                  {milestone.emoji}
                </motion.span>

                {/* Sparkling Star Badge at corner */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-amber-400 text-brand-charcoal shadow-md border-2 border-white"
                >
                  <Star className="w-4 h-4 fill-current" />
                </motion.div>
              </motion.div>
            </div>

            {/* Badge Title & Tier */}
            <div className="space-y-1.5 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                  milestone.tier === 'Diamond' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                  milestone.tier === 'Platinum' ? 'bg-teal-100 text-teal-800 border border-teal-300' :
                  milestone.tier === 'Gold' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  milestone.tier === 'Silver' ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                  'bg-orange-100 text-orange-900 border border-orange-200'
                }`}>
                  {milestone.tier} Tier Milestone
                </span>

                <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>UNLOCKED</span>
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal">
                {lang === 'en' ? milestone.title.en : milestone.title.ur}
              </h2>

              <p className="text-xs sm:text-sm text-brand-slate max-w-sm mx-auto leading-relaxed">
                {lang === 'en' ? milestone.description.en : milestone.description.ur}
              </p>
            </div>

            {/* XP Award Banner with Animated Number Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/10 border border-amber-500/25 flex items-center justify-between px-5"
            >
              <div className="flex items-center gap-2 text-left">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-800">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-900 uppercase block">
                    {lang === 'en' ? "Reward Granted" : "Inaam"}
                  </span>
                  <span className="text-xs text-brand-slate font-mono">
                    {lang === 'en' ? milestone.requirementText.en : milestone.requirementText.ur}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <motion.div
                  key={displayedXp}
                  className="font-display font-black text-xl text-amber-800"
                >
                  +{displayedXp} <span className="text-xs font-mono font-bold">XP</span>
                </motion.div>
                <span className="text-[9.5px] font-mono text-emerald-700 font-bold block">
                  ✓ Claimed to Profile
                </span>
              </div>
            </motion.div>

            {/* Rarity & Completion Stats */}
            <div className="flex items-center justify-between text-[11px] font-mono text-brand-muted px-2">
              <span className="flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-brand-amber" />
                <span>Rarity: <strong>Top {milestone.rarityPercent}% of Scholars</strong></span>
              </span>
              <span>100% Verified</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                onClick={handleReplayCelebration}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 border border-brand-slate/20 cursor-pointer"
                title="Replay Celebration"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-slate" />
                <span>{lang === 'en' ? "Replay 🎉" : "Replay"}</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 border border-brand-slate/20 cursor-pointer"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span className="text-emerald-700">{lang === 'en' ? "Copied!" : "Copied!"}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-brand-slate" />
                    <span>{lang === 'en' ? "Share Badge" : "Share"}</span>
                  </>
                )}
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                className="w-full sm:flex-1 px-5 py-3 rounded-2xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{lang === 'en' ? "Awesome, Continue!" : "Theek Hai, Aage Badhein"}</span>
                <ArrowRight className="w-4 h-4 text-brand-amber" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
