import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Brain, 
  Zap, 
  CheckCircle2, 
  MessageSquare, 
  Target, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  BookOpen, 
  AlertTriangle,
  Layers,
  Award
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { InterviewQuestion, InterviewerPersona, CameraTrackingMetrics } from '../types';

interface InterviewProTipsSidebarProps {
  stage: 'setup' | 'interview' | 'scorecard';
  currentQuestion: InterviewQuestion | null;
  currentPersona: InterviewerPersona;
  liveMetrics: CameraTrackingMetrics;
  isUserSpeaking: boolean;
  questionIndex: number;
  totalQuestions: number;
}

export default function InterviewProTipsSidebar({
  stage,
  currentQuestion,
  currentPersona,
  liveMetrics,
  isUserSpeaking,
  questionIndex,
  totalQuestions
}: InterviewProTipsSidebarProps) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'star' | 'delivery' | 'persona' | 'recovery'>('star');

  // Dynamic advice tailored to the live camera and posture tracking
  const getLiveCameraTip = () => {
    if (liveMetrics.eyeContactScore < 75) {
      return {
        type: 'warning',
        text: 'Look slightly higher directly into the webcam lens to project executive presence.',
      };
    }
    if (liveMetrics.centeringScore < 75) {
      return {
        type: 'warning',
        text: 'Center your shoulders within the guide box to stabilize the vision tracking HUD.',
      };
    }
    if (liveMetrics.confidenceScore >= 88) {
      return {
        type: 'success',
        text: 'Pacing and vocal stability are optimal. Maintain this cadence!',
      };
    }
    return {
      type: 'info',
      text: 'Frame your core argument in the first 20 seconds before giving examples.',
    };
  };

  const cameraTip = getLiveCameraTip();

  return (
    <>
      {/* Mobile / Collapsed Floating Trigger */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-brand-amber text-white p-3.5 rounded-full shadow-2xl hover:shadow-amber-500/40 border border-amber-300/40 flex items-center gap-2 cursor-pointer group hover:scale-105 active:scale-95 transition-all"
          title="Open Pro Tips Sidebar"
        >
          <Lightbulb className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-black tracking-wide pr-1">Pro Tips</span>
          <span className="bg-white/20 text-[10px] font-mono px-1.5 py-0.5 rounded-full">
            Live
          </span>
        </motion.button>
      )}

      {/* Main Sidebar Drawer / Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full lg:w-80 shrink-0 bg-brand-charcoal text-white rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden text-left"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-amber/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              
              {/* Header with Close / Collapse */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-brand-amber border border-amber-500/30">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-white flex items-center gap-1.5">
                      <span>Pro Interview Coaching</span>
                    </h4>
                    <span className="text-[9.5px] font-mono text-white/50">
                      Stage: {stage === 'setup' ? 'Calibration' : stage === 'interview' ? `Question ${questionIndex + 1}/${totalQuestions}` : 'Scorecard Review'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer"
                  title="Collapse Pro Tips"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Live HUD Coaching Banner */}
              {stage === 'interview' && (
                <div className={`p-3 rounded-2xl border text-xs space-y-1 backdrop-blur-md transition-colors ${
                  cameraTip.type === 'warning' 
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-200' 
                    : cameraTip.type === 'success'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                    : 'bg-white/5 border-white/10 text-white/80'
                }`}>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-brand-amber" />
                    <span>Real-Time Vision HUD Tip:</span>
                  </div>
                  <p className="text-[11px] leading-snug font-medium">
                    {cameraTip.text}
                  </p>
                </div>
              )}

              {/* Tip Category Tabs */}
              <div className="grid grid-cols-4 gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-mono font-bold">
                <button
                  onClick={() => setActiveTab('star')}
                  className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === 'star' ? 'bg-brand-amber text-brand-charcoal font-black shadow-xs' : 'text-white/60 hover:text-white'
                  }`}
                >
                  STAR
                </button>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === 'delivery' ? 'bg-brand-amber text-brand-charcoal font-black shadow-xs' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Delivery
                </button>
                <button
                  onClick={() => setActiveTab('persona')}
                  className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === 'persona' ? 'bg-brand-amber text-brand-charcoal font-black shadow-xs' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Persona
                </button>
                <button
                  onClick={() => setActiveTab('recovery')}
                  className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === 'recovery' ? 'bg-brand-amber text-brand-charcoal font-black shadow-xs' : 'text-white/60 hover:text-white'
                  }`}
                >
                  Rescue
                </button>
              </div>

              {/* TAB 1: THE STAR METHOD */}
              {activeTab === 'star' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5 text-xs text-white/80"
                >
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block">
                      S — Situation (15-20s)
                    </span>
                    <p className="text-[11px] leading-relaxed text-white/90">
                      Set context: "When deploying a 7B LLM on a constrained single A10G GPU with 24GB VRAM..."
                    </p>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-teal-400 uppercase block">
                      T — Task & Bottleneck (15s)
                    </span>
                    <p className="text-[11px] leading-relaxed text-white/90">
                      State the challenge: "We encountered OOM errors during peak multi-turn KV-cache generation."
                    </p>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase block">
                      A — Action & Architecture (45-60s)
                    </span>
                    <p className="text-[11px] leading-relaxed text-white/90">
                      Detail solution: "Implemented FlashAttention-2 + AWQ 4-bit weight quantization, reducing memory by 55%."
                    </p>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">
                      R — Quantitative Result (15s)
                    </span>
                    <p className="text-[11px] leading-relaxed text-white/90">
                      Provide metrics: "Achieved 38 tokens/sec throughput with 99.4% benchmark retention."
                    </p>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: DELIVERY & BODY LANGUAGE */}
              {activeTab === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5 text-xs text-white/80"
                >
                  <div className="flex items-start gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <Eye className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white text-[11px] block">Eye Gaze Discipline</span>
                      <p className="text-[10px] text-white/70 mt-0.5">
                        Never look down at your keyboard while answering. Look directly into the top webcam lens.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white text-[11px] block">Pacing & Fillers</span>
                      <p className="text-[10px] text-white/70 mt-0.5">
                        Replace "um", "like", and "you know" with a silent 1.5 second deliberate pause. Pauses convey authority.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white text-[11px] block">High-Level Before Low-Level</span>
                      <p className="text-[10px] text-white/70 mt-0.5">
                        Start with the system diagram before reciting PyTorch tensor dimension transformations.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: INTERVIEWER PERSONA CHEAT SHEET */}
              {activeTab === 'persona' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2.5 text-xs text-white/80"
                >
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentPersona.avatar}
                        alt={currentPersona.name}
                        className="w-8 h-8 rounded-xl object-cover border border-brand-amber"
                      />
                      <div>
                        <span className="font-bold text-white text-xs block">{currentPersona.name}</span>
                        <span className="text-[10px] font-mono text-brand-amber">{currentPersona.role}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/75 leading-relaxed pt-1">
                      <strong>Style:</strong> {currentPersona.styleDescription}
                    </p>
                    <div className="bg-black/30 p-2 rounded-xl text-[10px] font-mono text-amber-200 border border-white/5">
                      💡 <strong>Persona Strategy:</strong> Emphasize {currentPersona.name.includes('Sarah') ? 'production scalability & clean code abstractions' : currentPersona.name.includes('Alex') ? 'low-level CUDA & GPU memory optimization' : 'product trade-offs and user latency benchmarks'}.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: BRAIN FREEZE & EMERGENCY RECOVERY */}
              {activeTab === 'recovery' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 text-xs text-white/80"
                >
                  <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase block">
                      Phrase 1: Clarify Scope
                    </span>
                    <p className="text-[10.5px] italic text-white/90">
                      "To ensure we address the core bottleneck, are we optimizing primarily for p99 inference latency or maximum batch throughput?"
                    </p>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-teal-300 uppercase block">
                      Phrase 2: Buy 5 Seconds
                    </span>
                    <p className="text-[10.5px] italic text-white/90">
                      "That's an interesting distributed systems challenge. Let's analyze the tradeoff between synchronous and asynchronous parameter updates..."
                    </p>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-300 uppercase block">
                      Phrase 3: Admit & Pivot Gracefully
                    </span>
                    <p className="text-[10.5px] italic text-white/90">
                      "While I haven't implemented that exact paper in production, based on foundational gradient descent dynamics, we would expect..."
                    </p>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Bottom Quick Help Action */}
            <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[10px] font-mono text-white/50">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-amber" />
                Clay AI Real-Time Assistant
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-brand-amber hover:underline cursor-pointer"
              >
                Hide
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
