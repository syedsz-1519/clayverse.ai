import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Sparkles, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Maximize2,
  Sliders,
  Flame,
  X,
  Globe,
  Ban,
  ExternalLink,
  BookOpen,
  Eye,
  EyeOff,
  Coffee,
  Heart,
  Timer,
  Check,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import FocusMetricsSidebar from './FocusMetricsSidebar';
import VisualRestModal from './VisualRestModal';
import { focusMetrics } from '../lib/focusMetricsManager';

export interface FocusSessionStats {
  secondsFocused: number;
  distractionCount: number;
  focusScore: number; // 0 - 100
}

interface FocusLockdownManagerProps {
  isActive: boolean;
  onExit: () => void;
  currentLessonTitle?: string;
  currentLessonId?: string;
}

export default function FocusLockdownManager({
  isActive,
  onExit,
  currentLessonTitle = "Active Lesson",
  currentLessonId
}: FocusLockdownManagerProps) {
  const { lang } = useLanguage();

  // Focus Timer States
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [targetSeconds, setTargetSeconds] = useState<number>(25 * 60); // default 25 min Pomodoro
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Anti-Distraction & App Switch Detection
  const [distractionCount, setDistractionCount] = useState<number>(0);
  const [showDistractionWarning, setShowDistractionWarning] = useState<boolean>(false);
  const [lastDistractionTime, setLastDistractionTime] = useState<string | null>(null);

  // External Navigation Lockdown State
  const [blockedNavUrl, setBlockedNavUrl] = useState<string | null>(null);
  const [showBlockedNavModal, setShowBlockedNavModal] = useState<boolean>(false);

  // 30-Minute Reading Visual Break Reminder (5-min Eye Rest)
  const BREAK_INTERVAL_SECONDS = 30 * 60; // Prompt every 30 minutes (1800s)
  const [showVisualBreakPrompt, setShowVisualBreakPrompt] = useState<boolean>(false);
  const [isVisualRestModalOpen, setIsVisualRestModalOpen] = useState<boolean>(false);

  // Ambient Sound Generator (Web Audio API)
  const [soundType, setSoundType] = useState<'off' | 'binaural' | 'brownNoise' | 'rain'>('off');
  const [soundVolume, setSoundVolume] = useState<number>(0.25);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ [key: string]: any }>({});

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isHudCollapsed, setIsHudCollapsed] = useState<boolean>(false);

  // Initialize or handle Fullscreen on active
  useEffect(() => {
    if (!isActive) {
      stopAmbientSound();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      return;
    }

    // Attempt fullscreen if supported
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // User gesture or iframe policy might reject silently, graceful fallback
      });
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isActive]);

  // Prevent accidental navigation when in focus lockdown mode
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Focus Lockdown active! Leaving will end your focus streak.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive]);

  // Intercept and block all external navigation (target='_blank', external URLs, window.open)
  useEffect(() => {
    if (!isActive) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      const targetAttr = anchor.getAttribute('target');

      // Check if it opens in a new tab/window or points to an external destination
      const isTargetBlank = targetAttr === '_blank' || targetAttr === '_new';
      const isExternalScheme = 
        href.startsWith('http://') || 
        href.startsWith('https://') || 
        href.startsWith('//') || 
        href.startsWith('mailto:') ||
        href.startsWith('tel:');
      
      let isExternalDestination = false;
      if (isExternalScheme && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          const urlObj = new URL(href, window.location.href);
          if (urlObj.origin !== window.location.origin) {
            isExternalDestination = true;
          }
        } catch (err) {
          isExternalDestination = true;
        }
      }

      if (isTargetBlank || isExternalDestination) {
        // Block external navigation entirely
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const readableUrl = href || (anchor.innerText ? `Link: "${anchor.innerText.trim()}"` : 'External Website');
        setBlockedNavUrl(readableUrl);
        setShowBlockedNavModal(true);

        // Play warning cue sound
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.28);
        } catch (err) {}
      }
    };

    // Override window.open to prevent scripts from launching external tabs/apps
    const originalWindowOpen = window.open;
    (window as any).open = function(url?: string | URL, target?: string, features?: string) {
      const urlStr = url ? url.toString() : 'External Application';
      setBlockedNavUrl(urlStr);
      setShowBlockedNavModal(true);
      return null;
    };

    // Capture phase intercepts all clicks before child components or browser defaults fire
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      window.open = originalWindowOpen;
    };
  }, [isActive]);

  // Anti-Distraction & Tab/App Switch Detection
  useEffect(() => {
    if (!isActive) return;

    const triggerDistractionAlert = () => {
      setDistractionCount(prev => prev + 1);
      setShowDistractionWarning(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastDistractionTime(timeStr);
      focusMetrics.recordDistraction();

      // Play soft alert beep
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } catch (err) {
        // AudioContext may be restricted
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerDistractionAlert();
      }
    };

    const handleWindowBlur = () => {
      // Blur indicates switching to another application or window
      triggerDistractionAlert();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isActive]);

  // Play soft gentle chime (pleasant harmonic chord)
  const playGentleChime = (type: 'breakReminder' | 'breakComplete' | 'breakStart') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const freqs = type === 'breakReminder' 
        ? [523.25, 659.25, 783.99] // C5, E5, G5 major triad
        : type === 'breakComplete'
        ? [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 triumphant chord
        : [440.00, 554.37, 659.25]; // A4, C#5, E5 serene chord

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + (i * 0.08));
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + (i * 0.08) + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i * 0.08) + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + (i * 0.08));
        osc.stop(ctx.currentTime + (i * 0.08) + 1.3);
      });
    } catch (e) {}
  };

  // Timer Tick Interval for Active Reading & 30-Minute Visual Break Detection
  useEffect(() => {
    if (!isActive || !isTimerRunning || isCompleted) return;

    const interval = setInterval(() => {
      setSecondsElapsed(prev => {
        const next = prev + 1;
        // Check if 30-minute interval is reached (1800s, 3600s, etc.)
        if (next > 0 && next % BREAK_INTERVAL_SECONDS === 0 && !isVisualRestModalOpen) {
          setShowVisualBreakPrompt(true);
          playGentleChime('breakReminder');
        }
        return next;
      });

      if (timerMode === 'pomodoro') {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsCompleted(true);
            setIsTimerRunning(false);
            focusMetrics.recordCompletedSession(50);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isTimerRunning, timerMode, isCompleted, isVisualRestModalOpen]);

  const handleStartVisualBreak = () => {
    setShowVisualBreakPrompt(false);
    setIsVisualRestModalOpen(true);
    playGentleChime('breakStart');
  };

  const handleSnoozeVisualBreak = () => {
    setShowVisualBreakPrompt(false);
  };

  // Ambient Sound Generator Engine (Native Web Audio)
  const stopAmbientSound = () => {
    try {
      if (soundNodesRef.current) {
        Object.values(soundNodesRef.current).forEach((node: any) => {
          if (node && typeof node.stop === 'function') node.stop();
          if (node && typeof node.disconnect === 'function') node.disconnect();
        });
        soundNodesRef.current = {};
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    } catch (e) {}
  };

  const startAmbientSound = (type: 'binaural' | 'brownNoise' | 'rain') => {
    stopAmbientSound();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(soundVolume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'binaural') {
        // 40Hz Gamma Focus Frequency (Left: 200Hz, Right: 240Hz)
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(200, ctx.currentTime);
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(240, ctx.currentTime);

        if (panL && panR) {
          panL.pan.setValueAtTime(-1, ctx.currentTime);
          panR.pan.setValueAtTime(1, ctx.currentTime);
          oscL.connect(panL);
          panL.connect(masterGain);
          oscR.connect(panR);
          panR.connect(masterGain);
        } else {
          oscL.connect(masterGain);
          oscR.connect(masterGain);
        }

        oscL.start();
        oscR.start();
        soundNodesRef.current = { oscL, oscR, masterGain };
      } else if (type === 'brownNoise' || type === 'rain') {
        // Brown noise / soothing static
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain compensation
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 800 : 400, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        soundNodesRef.current = { whiteNoise, filter, masterGain };
      }
    } catch (e) {
      console.warn("Ambient sound could not be initialized:", e);
    }
  };

  const handleSoundChange = (newType: 'off' | 'binaural' | 'brownNoise' | 'rain') => {
    setSoundType(newType);
    if (newType === 'off') {
      stopAmbientSound();
    } else {
      startAmbientSound(newType);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate focus score percentage
  const focusScore = Math.max(0, Math.min(100, Math.round(100 - (distractionCount * 12))));

  if (!isActive) return null;

  return (
    <>
      {/* 1. Distraction Warning Alert Overlay (Fires if user switches app or tab) */}
      <AnimatePresence>
        {showDistractionWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-60 w-[92%] max-w-lg bg-amber-950/90 dark:bg-zinc-950/95 text-white p-4 rounded-2xl shadow-2xl border-2 border-amber-500/80 backdrop-blur-xl pointer-events-auto"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-amber-300 flex items-center gap-1.5">
                    <span>{lang === 'te' ? 'అంతరాయం గుర్తించబడింది!' : lang === 'hi' ? 'ध्यान भटकाव का पता चला!' : 'Focus Lockdown Alert!'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 font-mono">
                      #{distractionCount}
                    </span>
                  </h4>
                  <button 
                    onClick={() => setShowDistractionWarning(false)}
                    className="text-white/60 hover:text-white p-1 rounded-md hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {lang === 'te' 
                    ? `మీరు క్లేవర్స్ AI పాఠం నుండి వేరే యాప్ లేదా ట్యాబ్‌కి మారినట్లు గుర్తించబడింది (${lastDistractionTime}). మీ ఏకాగ్రతను కాపాడుకోండి!`
                    : lang === 'hi'
                    ? `आप Clayverse AI पाठ से किसी अन्य ऐप या टैब पर चले गए थे (${lastDistractionTime})। पढ़ाई पर ध्यान बनाए रखें!`
                    : `App switch detected (${lastDistractionTime}). Focus Mode blocks non-essential activities to keep your study streak uninterrupted.`}
                </p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                  <span className="text-amber-200/80 font-mono">
                    Focus Score: <strong className="text-white font-bold">{focusScore}%</strong>
                  </span>
                  <button
                    onClick={() => setShowDistractionWarning(false)}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-xs"
                  >
                    {lang === 'te' ? 'తిరిగి కొనసాగించు' : lang === 'hi' ? 'अध्ययन जारी रखें' : 'Resume Reading'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. External Navigation Blocked Modal (Intercepts target='_blank' & external apps) */}
      <AnimatePresence>
        {showBlockedNavModal && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="w-full max-w-md bg-zinc-900 text-white rounded-3xl p-6 shadow-2xl border-2 border-amber-500/50 text-left relative overflow-hidden"
            >
              {/* Subtle decorative glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                    <span>
                      {lang === 'te' 
                        ? 'బాహ్య లింక్ నిరోధించబడింది' 
                        : lang === 'hi' 
                        ? 'बाहरी वेबसाइट ब्लॉक की गई' 
                        : 'External Navigation Blocked'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                      Lockdown
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {lang === 'te' 
                      ? 'క్లేవర్స్ AI ఏకాగ్రత రక్షణ సక్రియం' 
                      : lang === 'hi' 
                      ? 'Clayverse AI एकाग्रता मोड सक्रिय' 
                      : 'Clayverse AI Focus Isolation Active'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                {lang === 'te'
                  ? 'ఫోకస్ మోడ్ మీ చదువును క్లేవర్స్ AIకి మాత్రమే పరిమితం చేస్తుంది. మీ ఏకాగ్రత భంగం కాకుండా ఇతర వెబ్‌సైట్‌లు మరియు యాప్‌లు నిరోధించబడతాయి.'
                  : lang === 'hi'
                  ? 'फोकस मोड आपके अध्ययन को केवल Clayverse AI तक सीमित रखता है। ध्यान भटकाव से बचने के लिए बाहरी वेबसाइटें और नए टैब ब्लॉक हैं।'
                  : 'Focus Mode strictly isolates your session to Clayverse AI. All external websites, new tabs, and third-party apps are intercepted to keep your learning streak uninterrupted.'}
              </p>

              {/* Blocked URL Display */}
              {blockedNavUrl && (
                <div className="mb-5 p-3 rounded-xl bg-black/50 border border-white/10 flex items-center gap-2.5">
                  <Ban className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-mono text-[11px] text-amber-200/90 truncate block flex-1">
                    {blockedNavUrl}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={() => setShowBlockedNavModal(false)}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'te' 
                      ? 'క్లేవర్స్ AIలోనే ఉండండి' 
                      : lang === 'hi' 
                      ? 'Clayverse AI में बने रहें' 
                      : 'Stay in Clayverse AI'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    const urlToOpen = blockedNavUrl;
                    setShowBlockedNavModal(false);
                    onExit();
                    if (urlToOpen && (urlToOpen.startsWith('http://') || urlToOpen.startsWith('https://'))) {
                      window.open(urlToOpen, '_blank');
                    }
                  }}
                  className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-medium text-xs border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1"
                  title="Exit Focus Mode to open link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'te' ? 'నిష్క్రమించి తెరవండి' : lang === 'hi' ? 'बाहर निकलें और खोलें' : 'Exit & Open'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Subtle Non-Intrusive 30-Minute Visual Break Prompt Banner */}
      <AnimatePresence>
        {showVisualBreakPrompt && !isVisualRestModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-65 w-[92%] max-w-md bg-zinc-900/95 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-xl pointer-events-auto"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/30">
                <Eye className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-emerald-300 flex items-center gap-2">
                    <span>
                      {lang === 'te' 
                        ? '30 నిమిషాల పఠనం • 5 నిమిషాల కంటి విశ్రాంతి' 
                        : lang === 'hi' 
                        ? '30 मिनट का अध्ययन • 5 मिनट का नेत्र विराम' 
                        : '30-Min Reading • 5-Min Visual Break'}
                    </span>
                  </h4>
                  <button 
                    onClick={handleSnoozeVisualBreak}
                    className="text-white/50 hover:text-white p-1 rounded-md hover:bg-white/10 transition-all cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {lang === 'te'
                    ? 'మీరు 30 నిమిషాలుగా చదువుతున్నారు. కంటి ఒత్తిడిని తగ్గించడానికి మరియు ఏకాగ్రతను పునరుద్ధరించడానికి 5 నిమిషాల విశ్రాంతి తీసుకోండి (20-20-20 నియమం & శ్వాస వ్యాయామాలు).'
                    : lang === 'hi'
                    ? 'आप पिछले 30 मिनट से पढ़ रहे हैं। आंखों की थकान दूर करने और ध्यान बनाए रखने के लिए 5 मिनट का माइंडफुल ब्रेक लें।'
                    : 'You have been reading for 30 minutes. Take a 5-minute visual break with guided breathing exercises to rest your eyes and restore cognitive endurance.'}
                </p>

                {/* Break Action Buttons */}
                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={handleStartVisualBreak}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'te' ? '5 నిమిషాల విశ్రాంతి ప్రారంభించు' : lang === 'hi' ? '5 मिनट ब्रेक शुरू करें' : 'Start 5-Min Break'}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleSnoozeVisualBreak}
                    className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-medium border border-white/10 transition-all cursor-pointer"
                  >
                    {lang === 'te' ? 'తరువాత (స్నూజ్)' : lang === 'hi' ? 'बाद में (स्नूज़)' : 'Snooze'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Dedicated 5-Minute Visual Rest Component with Guided Breathing */}
      <VisualRestModal
        isOpen={isVisualRestModalOpen}
        onClose={() => setIsVisualRestModalOpen(false)}
        onComplete={() => {
          setIsVisualRestModalOpen(false);
          setShowVisualBreakPrompt(false);
        }}
      />

      {/* 5. Real-Time Gamified Focus Metrics Sidebar (Appears only in Focus Mode) */}
      <FocusMetricsSidebar
        isVisible={isActive}
        currentLessonId={currentLessonId}
        activeSeconds={secondsElapsed}
        distractionCount={distractionCount}
        onTriggerVisualBreak={() => setIsVisualRestModalOpen(true)}
      />

      {/* 6. Floating Minimal Focus HUD Bar (Pinned at top of screen) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-2xl w-[94%]"
      >
        <div className="bg-zinc-900/90 text-white backdrop-blur-md rounded-2xl shadow-xl border border-white/15 px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Active Status & Shield */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Focus Lockdown
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className="text-[10px] text-zinc-400 truncate max-w-[140px] block">
                {currentLessonTitle}
              </span>
            </div>
          </div>

          {/* Center: Live Focus Timer */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="font-mono text-sm sm:text-base font-extrabold text-amber-300 tracking-wider">
              {timerMode === 'pomodoro' ? formatTime(secondsRemaining) : formatTime(secondsElapsed)}
            </span>
            
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 rounded-md hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title={isTimerRunning ? "Pause timer" : "Start timer"}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={() => {
                setSecondsRemaining(targetSeconds);
                setSecondsElapsed(0);
                setIsCompleted(false);
              }}
              className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Right: Quick Distraction Shield Badge & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Visual Eye-Rest Trigger in HUD */}
            <button
              onClick={handleStartVisualBreak}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                showVisualBreakPrompt
                  ? 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400 animate-bounce'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 border-white/10'
              }`}
              title="Take 5-Minute Visual Eye-Rest Break"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Distraction Counter */}
            <div 
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                distractionCount === 0 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
              title="Switches to other apps or tabs detected"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{distractionCount}</span>
            </div>

            {/* Ambient Audio Pill */}
            <div className="relative group">
              <button
                onClick={() => {
                  const nextSound: Record<string, 'off' | 'binaural' | 'brownNoise' | 'rain'> = {
                    off: 'binaural',
                    binaural: 'rain',
                    rain: 'brownNoise',
                    brownNoise: 'off'
                  };
                  handleSoundChange(nextSound[soundType]);
                }}
                className={`p-2 rounded-xl transition-all cursor-pointer border ${
                  soundType !== 'off'
                    ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border-white/10'
                }`}
                title={`Ambient Focus Sound: ${soundType.toUpperCase()}`}
              >
                {soundType !== 'off' ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="hidden md:flex p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Exit Focus Mode */}
            <button
              onClick={onExit}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Exit Focus Mode (Esc or F)"
            >
              <span>{lang === 'te' ? 'నిష్క్రమించు' : lang === 'hi' ? 'बाहर निकलें' : 'Exit'}</span>
              <kbd className="hidden sm:inline px-1 py-0.2 bg-black/30 rounded text-[9px] font-mono">Esc</kbd>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
