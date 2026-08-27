import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Wind, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Flame, 
  Heart, 
  Zap, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { focusMetrics } from '../lib/focusMetricsManager';

export interface VisualRestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type BreathingTechnique = 'box' | 'relax478' | 'eyeRelax';

export default function VisualRestModal({
  isOpen,
  onClose,
  onComplete
}: VisualRestModalProps) {
  const { lang } = useLanguage();

  const BREAK_DURATION = 5 * 60; // 5 minutes (300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(BREAK_DURATION);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [technique, setTechnique] = useState<BreathingTechnique>('box');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Breathing Cycle State
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [phaseSecondsRemaining, setPhaseSecondsRemaining] = useState<number>(4);
  const [breathCycleCount, setBreathCycleCount] = useState<number>(0);

  // Audio Context Ref for gentle harmonic chimes
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Technique timing maps
  const techniquePhases = {
    box: [
      { phase: 'inhale' as const, duration: 4, labelEn: 'Breathe In Deeply', labelTe: 'లోతుగా శ్వాస తీసుకోండి', labelHi: 'गहरी सांस अंदर लें' },
      { phase: 'hold' as const, duration: 4, labelEn: 'Hold Gently', labelTe: 'శ్వాసను అలాగే ఉంచండి', labelHi: 'सांस रोककर रखें' },
      { phase: 'exhale' as const, duration: 4, labelEn: 'Release & Exhale', labelTe: 'శ్వాసను నెమ్మదిగా వదలండి', labelHi: 'धीरे-धीरे सांस छोड़ें' },
      { phase: 'rest' as const, duration: 4, labelEn: 'Empty Rest & Hold', labelTe: 'విశ్రాంతిలో ఉంచండి', labelHi: 'शांत रहें' },
    ],
    relax478: [
      { phase: 'inhale' as const, duration: 4, labelEn: 'Inhale Quietly (Nose)', labelTe: 'ముక్కుతో గాలి పీల్చుకోండి', labelHi: 'नाक से सांस भरें' },
      { phase: 'hold' as const, duration: 7, labelEn: 'Full Retention Hold', labelTe: 'పూర్తిగా నిలిపి ఉంచండి', labelHi: 'सांस को थामे रखें' },
      { phase: 'exhale' as const, duration: 8, labelEn: 'Slow Audible Whoosh', labelTe: 'నోటి ద్వారా నిదానంగా వదలండి', labelHi: 'मुंह से धीमी सांस छोड़ें' },
    ],
    eyeRelax: [
      { phase: 'inhale' as const, duration: 6, labelEn: 'Look 20ft Away into Distance', labelTe: '20 అడుగుల దూరం చూడండి', labelHi: '20 फीट दूर किसी वस्तु को देखें' },
      { phase: 'hold' as const, duration: 6, labelEn: 'Softly Roll Eyes in a Gentle Circle', labelTe: 'కళ్లను సున్నితంగా తిప్పండి', labelHi: 'आंखों को धीरे-धीरे घुमाएं' },
      { phase: 'exhale' as const, duration: 6, labelEn: 'Slow Blinks & Face Muscle Release', labelTe: 'రెప్పలు వేస్తూ ముఖాన్ని సడలించండి', labelHi: 'पलकें झपकाएं और तनाव छोड़ें' },
    ]
  };

  // Play serene harmonic bell / tone
  const playHarmonicTone = (frequency: number = 432, duration: number = 1.8) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Main 5-Minute Countdown
  useEffect(() => {
    if (!isOpen || !isRunning) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Completed 5 min break!
          focusMetrics.recordVisualBreakCompleted(30);
          if (onComplete) onComplete();
          playHarmonicTone(528, 3.0); // 528 Hz transformation frequency
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isRunning, onComplete]);

  // Breathing Animation Cycle
  useEffect(() => {
    if (!isOpen || !isRunning || secondsRemaining <= 0) return;

    const currentPhases = techniquePhases[technique];
    let currentIdx = currentPhases.findIndex(p => p.phase === breathPhase);
    if (currentIdx === -1) currentIdx = 0;

    const breathInterval = setInterval(() => {
      setPhaseSecondsRemaining(prev => {
        if (prev <= 1) {
          const nextIdx = (currentIdx + 1) % currentPhases.length;
          const nextPhaseObj = currentPhases[nextIdx];
          setBreathPhase(nextPhaseObj.phase);
          
          if (nextIdx === 0) {
            setBreathCycleCount(c => c + 1);
            playHarmonicTone(432, 2.0); // Cycle restart tone
          } else if (nextPhaseObj.phase === 'exhale') {
            playHarmonicTone(324, 2.0);
          } else {
            playHarmonicTone(384, 1.5);
          }

          return nextPhaseObj.duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breathInterval);
  }, [isOpen, isRunning, technique, breathPhase, secondsRemaining]);

  // Format mm:ss
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPhaseConfig = techniquePhases[technique].find(p => p.phase === breathPhase) || techniquePhases[technique][0];
  const progressPercent = Math.min(100, Math.round(((BREAK_DURATION - secondsRemaining) / BREAK_DURATION) * 100));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-2xl text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-xl bg-zinc-900/95 rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/40 relative overflow-hidden flex flex-col items-center"
      >
        {/* Background Ambient Glow */}
        <motion.div
          animate={{
            scale: breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 0.9,
            opacity: breathPhase === 'inhale' ? 0.35 : 0.15
          }}
          transition={{ duration: currentPhaseConfig.duration, ease: 'easeInOut' }}
          className="absolute w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none -top-10 -right-10"
        />

        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between gap-3 mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  {lang === 'te' 
                    ? '5 నిమిషాల కంటి & శ్వాస పునరుద్ధరణ' 
                    : lang === 'hi' 
                    ? '5 मिनट नेत्र व श्वास विश्राम' 
                    : '5-Minute Visual & Breath Rest'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  +30 XP
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {lang === 'te' ? '20-20-20 నియమం & మానసిక పునరుజ్జీవనం' : lang === 'hi' ? '20-20-20 नियम और माइंडफुल रिकवरी' : '20-20-20 Rule & Diaphragmatic Oxygenation'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                soundEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-white/5 text-zinc-500 border-white/10'
              }`}
              title={soundEnabled ? "Mute Harmonic Chimes" : "Enable Harmonic Chimes"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Close Break"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10 mb-6 w-full max-w-md">
          <button
            onClick={() => {
              setTechnique('box');
              setBreathPhase('inhale');
              setPhaseSecondsRemaining(4);
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              technique === 'box'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Box (4-4-4)</span>
          </button>

          <button
            onClick={() => {
              setTechnique('relax478');
              setBreathPhase('inhale');
              setPhaseSecondsRemaining(4);
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              technique === 'relax478'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>4-7-8 Rest</span>
          </button>

          <button
            onClick={() => {
              setTechnique('eyeRelax');
              setBreathPhase('inhale');
              setPhaseSecondsRemaining(6);
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              technique === 'eyeRelax'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>20-20-20 Eye</span>
          </button>
        </div>

        {/* Central Animated Breathing Guide & Visual Orb */}
        <div className="relative my-4 flex items-center justify-center w-56 h-56">
          {/* Animated Pulsing Outer Wave */}
          <motion.div
            animate={{
              scale: breathPhase === 'inhale' ? 1.35 : breathPhase === 'hold' ? 1.35 : 1.0,
              opacity: breathPhase === 'inhale' ? [0.3, 0.7] : breathPhase === 'hold' ? 0.7 : [0.7, 0.2]
            }}
            transition={{
              duration: currentPhaseConfig.duration,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 rounded-full border-2 border-emerald-400/50 bg-emerald-500/10 pointer-events-none"
          />

          {/* Second Harmonic Ring */}
          <motion.div
            animate={{
              scale: breathPhase === 'inhale' ? 1.18 : breathPhase === 'hold' ? 1.18 : 1.0,
              opacity: breathPhase === 'hold' ? 0.8 : 0.4
            }}
            transition={{
              duration: currentPhaseConfig.duration,
              ease: 'easeInOut'
            }}
            className="absolute inset-4 rounded-full border border-emerald-300/40 bg-emerald-500/5 pointer-events-none"
          />

          {/* Core Orb Center */}
          <div className="w-36 h-36 rounded-full bg-zinc-950/90 border-2 border-emerald-400/80 shadow-2xl flex flex-col items-center justify-center p-3 relative z-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              {breathPhase.toUpperCase()}
            </span>
            <span className="text-3xl font-black font-mono text-white my-0.5">
              {phaseSecondsRemaining}s
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Cycle #{breathCycleCount + 1}
            </span>
          </div>
        </div>

        {/* Guided Instruction Text */}
        <div className="w-full text-center my-3 max-w-md">
          <motion.p 
            key={`${technique}-${breathPhase}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-emerald-300"
          >
            {lang === 'te' 
              ? currentPhaseConfig.labelTe 
              : lang === 'hi' 
              ? currentPhaseConfig.labelHi 
              : currentPhaseConfig.labelEn}
          </motion.p>
          <p className="text-xs text-zinc-400 mt-1">
            {technique === 'eyeRelax' 
              ? 'Focus on an object 20 feet away to relax eye focusing muscles and lubricate eyes.'
              : 'Diaphragmatic rhythm triggers parasympathetic nervous calm, resetting cognitive fatigue.'}
          </p>
        </div>

        {/* Overall 5-Min Timer & Progress Bar */}
        <div className="w-full max-w-md bg-black/40 rounded-2xl p-3 border border-white/10 mt-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recovery Time Left</span>
            </span>
            <span className="font-bold text-white text-sm">{formatTime(secondsRemaining)}</span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls Footer */}
        <div className="w-full flex items-center justify-between gap-3 mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={() => {
                setSecondsRemaining(BREAK_DURATION);
                setBreathCycleCount(0);
                setPhaseSecondsRemaining(4);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs transition-all cursor-pointer"
              title="Reset 5-min timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              focusMetrics.recordVisualBreakCompleted(20);
              onClose();
              if (onComplete) onComplete();
            }}
            className="py-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{lang === 'te' ? 'పునరుద్ధరణ పూర్తి' : lang === 'hi' ? 'विश्राम पूरा हुआ' : 'Finish & Return to Lesson'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
