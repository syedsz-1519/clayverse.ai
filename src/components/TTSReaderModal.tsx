import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Square, 
  X, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Keyboard, 
  Check, 
  Copy,
  RefreshCw,
  Layers
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface TTSReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
  initialTitle?: string;
}

const SAMPLE_PRESETS = [
  {
    id: 'deep-learning',
    title: 'Deep Learning & Neural Networks',
    text: `Deep learning is a subset of machine learning that uses neural networks with many layers. These layers learn representations of data with increasing levels of abstraction. The key breakthrough came with the availability of large datasets and powerful GPUs. Today, deep learning powers image recognition, natural language processing, speech synthesis, and autonomous systems. The architecture of a neural network consists of an input layer, hidden layers, and an output layer. Each neuron applies a weighted sum followed by a non-linear activation function. Training is done via backpropagation, where gradients flow backward through the network to update weights.`
  },
  {
    id: 'rag-architecture',
    title: 'Retrieval-Augmented Generation (RAG)',
    text: `Retrieval-Augmented Generation, commonly called RAG, is an AI architecture that enhances large language models by retrieving relevant factual documents from external databases before generating an answer. Instead of relying solely on parameters learned during training, RAG grounds responses in verified enterprise knowledge. This significantly eliminates hallucinations, ensures real-time accuracy, and provides traceable source citations.`
  },
  {
    id: 'what-is-ai',
    title: 'What is Artificial Intelligence?',
    text: `Artificial Intelligence is the science of engineering intelligent machines capable of performing tasks that typically require human cognition. These tasks include pattern visual perception, speech recognition, decision-making, and translation between languages. Modern AI does not think like a human; rather, it uses statistical patterns and mathematical optimization across billions of data parameters.`
  },
  {
    id: 'transformers',
    title: 'Self-Attention & Transformers',
    text: `The Transformer architecture revolutionized artificial intelligence through its multi-head self-attention mechanism. Unlike previous sequential recurrent neural networks, Transformers process entire paragraphs in parallel. This allows the model to capture intricate long-range dependencies and nuances across complex human literature and code.`
  }
];

export default function TTSReaderModal({
  isOpen,
  onClose,
  initialText,
  initialTitle = "Listen to anything"
}: TTSReaderModalProps) {
  const { lang } = useLanguage();

  // Active reading text
  const [displayText, setDisplayText] = useState<string>(
    initialText || SAMPLE_PRESETS[0].text
  );
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'reading' | 'paused'>('idle');

  // TTS Voice & Controls
  const [speed, setSpeed] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);

  // Custom User Input Text
  const [customInputText, setCustomInputText] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Refs for speech synthesis and scroll tracking
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textDisplayRef = useRef<HTMLDivElement | null>(null);
  const wordSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const isSpeakingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);

  // Sync initialText if passed from external source (e.g. lesson reader)
  useEffect(() => {
    if (initialText && initialText.trim().length > 0) {
      setDisplayText(initialText.trim());
      setCurrentWordIndex(0);
      setStatus('idle');
      setIsPlaying(false);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [initialText]);

  // Load and cache browser TTS voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices && availableVoices.length > 0) {
        setVoices(availableVoices);
        // Prefer natural English voices or matching language
        const preferredIndex = availableVoices.findIndex(
          v => (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Enhanced')))
        );
        if (preferredIndex >= 0) {
          setSelectedVoiceIndex(preferredIndex);
        } else {
          setSelectedVoiceIndex(0);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Split current displayText into discrete words whenever displayText changes
  useEffect(() => {
    const raw = displayText.trim();
    if (!raw) {
      setWords([]);
      return;
    }
    const tokenized = raw.split(/\s+/).filter(Boolean);
    setWords(tokenized);
    wordSpansRef.current = [];
  }, [displayText]);

  // Clean up speech synthesis on unmount or modal close
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setStatus('idle');
      isSpeakingRef.current = false;
      isPausedRef.current = false;
    }
  }, [isOpen]);

  // Speak from a given word index using Web Speech API
  const speakFrom = (startIndex: number) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any active speech
    window.speechSynthesis.cancel();

    if (startIndex >= words.length || words.length === 0) {
      setIsPlaying(false);
      setStatus('idle');
      setCurrentWordIndex(0);
      return;
    }

    const textToSpeak = words.slice(startIndex).join(' ');
    if (!textToSpeak.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speed;
    utterance.pitch = pitch;

    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }

    // Word boundary tracking for exact word highlight
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const spokenText = textToSpeak.substring(0, event.charIndex);
        const spokenWordCount = spokenText.trim().split(/\s+/).filter(Boolean).length;
        const targetIndex = startIndex + spokenWordCount;
        setCurrentWordIndex(targetIndex);

        // Smoothly scroll active word into viewport
        const targetSpan = wordSpansRef.current[targetIndex];
        if (targetSpan) {
          targetSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setStatus('idle');
      isSpeakingRef.current = false;
      isPausedRef.current = false;
      setTimeout(() => {
        setCurrentWordIndex(words.length);
      }, 400);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.error('Speech synthesis error:', e);
      }
      setIsPlaying(false);
      setStatus('idle');
      isSpeakingRef.current = false;
      isPausedRef.current = false;
    };

    utteranceRef.current = utterance;
    isSpeakingRef.current = true;
    isPausedRef.current = false;
    setIsPlaying(true);
    setStatus('reading');
    setCurrentWordIndex(startIndex);

    window.speechSynthesis.speak(utterance);
  };

  // Play / Pause Toggle
  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (!isPlaying) {
      if (window.speechSynthesis.paused && isPausedRef.current) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
        setStatus('reading');
        isPausedRef.current = false;
      } else {
        const resumeIndex = currentWordIndex >= words.length ? 0 : currentWordIndex;
        speakFrom(resumeIndex);
      }
    } else {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setStatus('paused');
      isPausedRef.current = true;
    }
  };

  // Stop Speech
  const handleStop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setStatus('idle');
    setCurrentWordIndex(0);
    isSpeakingRef.current = false;
    isPausedRef.current = false;
  };

  // Restart Speech from beginning
  const handleRestart = () => {
    setCurrentWordIndex(0);
    speakFrom(0);
  };

  // Click on a word to seek and begin reading from there
  const handleSeekWord = (index: number) => {
    setCurrentWordIndex(index);
    speakFrom(index);
  };

  // Speed change handler
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      speakFrom(currentWordIndex);
    }
  };

  // Pitch change handler
  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    if (isPlaying) {
      speakFrom(currentWordIndex);
    }
  };

  // Load custom user text
  const handleLoadCustomText = () => {
    const trimmed = customInputText.trim();
    if (!trimmed) return;
    handleStop();
    setDisplayText(trimmed);
    setCurrentWordIndex(0);
    // Slight tick to ensure tokenized state updates before speech
    setTimeout(() => {
      const tokenized = trimmed.split(/\s+/).filter(Boolean);
      setWords(tokenized);
      speakFrom(0);
    }, 50);
  };

  // Copy current text to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(displayText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  // Keyboard Shortcuts Handler inside the Reader
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting keystrokes when user is typing in textarea or inputs
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleTogglePlay();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          handleStop();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRestart();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSpeed(prev => {
            const next = Math.min(2.0, +(prev + 0.1).toFixed(1));
            return next;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSpeed(prev => {
            const next = Math.max(0.5, +(prev - 0.1).toFixed(1));
            return next;
          });
          break;
        case 'Escape':
          e.preventDefault();
          handleStop();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, currentWordIndex, words, speed, pitch, selectedVoiceIndex]);

  if (!isOpen) return null;

  const progressPercent = words.length > 0 ? Math.min(100, Math.round((currentWordIndex / words.length) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto font-lato">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-3xl bg-[#f5f0e8] text-[#2c2416] rounded-2xl shadow-2xl border border-[#e0d8c8] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-label="TTS Reader - Listen to anything"
      >
        {/* ── Header ── */}
        <div className="text-center pt-6 pb-4 px-6 relative shrink-0 border-b border-[#e0d8c8]/70 bg-[#f5f0e8]">
          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-[#8a7d68] hover:text-[#2c2416] hover:bg-[#e0d8c8]/40 transition-all cursor-pointer"
            title="Close reader (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="font-plex-mono text-[11px] tracking-[0.2em] uppercase text-[#c05c1a] inline-flex items-center gap-2 mb-1.5 font-semibold">
            <span className="text-[#e0d8c8]">—</span>
            <span>Web Speech API • Clayverse AI</span>
            <span className="text-[#e0d8c8]">—</span>
          </div>

          <h1 className="font-instrument text-3xl sm:text-4xl text-[#2c2416] font-normal leading-tight">
            Listen to <em className="italic text-[#c05c1a]">anything</em>.
          </h1>
          <p className="text-xs sm:text-sm text-[#8a7d68] mt-1">
            Paste your notes, articles, or research — press play.
          </p>

          {/* Quick Preset Selector */}
          <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-plex-mono uppercase text-[#8a7d68] me-1">
              Sample Text:
            </span>
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  handleStop();
                  setDisplayText(preset.text);
                  setCurrentWordIndex(0);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                  displayText === preset.text
                    ? 'bg-[#c05c1a] text-white border-[#c05c1a] shadow-xs'
                    : 'bg-[#fffdf8] text-[#8a7d68] border-[#e0d8c8] hover:border-[#c05c1a] hover:text-[#c05c1a]'
                }`}
              >
                {preset.title.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Reading Panel Scrollable Content ── */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">
          <div className="bg-[#fffdf8] border border-[#e0d8c8] rounded-xl shadow-xs overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e0d8c8] bg-[#f5f0e8]/80 flex-wrap gap-2">
              <span className="font-plex-mono text-[11px] tracking-widest uppercase text-[#8a7d68] font-semibold flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#c05c1a]" />
                <span>Reading View</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyText}
                  className="px-2 py-1 text-[11px] font-plex-mono text-[#8a7d68] hover:text-[#2c2416] hover:bg-[#e0d8c8]/40 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  title="Copy current reading text"
                >
                  {copiedNotification ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Status Badge */}
                <span
                  className={`font-plex-mono text-[10px] tracking-wider uppercase px-3 py-1 rounded-full border font-bold transition-all ${
                    status === 'reading'
                      ? 'text-[#c05c1a] border-[#c05c1a] bg-[#c05c1a]/12 animate-pulse'
                      : status === 'paused'
                      ? 'text-[#b07d10] border-[#e5b432] bg-[#e5b432]/15'
                      : 'text-[#8a7d68] border-[#e0d8c8] bg-transparent'
                  }`}
                >
                  {status === 'reading' ? '● Reading' : status === 'paused' ? '❚❚ Paused' : 'Idle'}
                </span>
              </div>
            </div>

            {/* Text Display Area with Word-by-Word Active Highlighting */}
            <div
              ref={textDisplayRef}
              className="p-6 sm:p-8 text-base sm:text-lg leading-relaxed sm:leading-loose text-[#2c2416] min-h-[180px] max-h-[300px] overflow-y-auto select-text font-light"
            >
              {words.length === 0 ? (
                <p className="text-[#8a7d68] italic">No text loaded. Paste notes below or choose a preset.</p>
              ) : (
                words.map((word, i) => {
                  const isActive = i === currentWordIndex && (status === 'reading' || status === 'paused');
                  return (
                    <React.Fragment key={i}>
                      <span
                        ref={(el) => (wordSpansRef.current[i] = el)}
                        onClick={() => handleSeekWord(i)}
                        className={`cursor-pointer rounded-sm px-0.5 transition-all inline-block ${
                          isActive
                            ? 'bg-[#fde68a] text-[#7c4a00] font-medium shadow-xs scale-105'
                            : 'hover:bg-[#c05c1a]/15 text-[#2c2416]'
                        }`}
                        title="Click to read from here"
                      >
                        {word}
                      </span>
                      {' '}
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* Playback Controls Bar */}
            <div className="flex items-center gap-3 p-4 sm:px-6 border-t border-[#e0d8c8] bg-[#fffdf8] flex-wrap">
              {/* Restart Button */}
              <button
                onClick={handleRestart}
                className="w-10 h-10 rounded-full border border-[#e0d8c8] bg-[#fffdf8] text-[#8a7d68] hover:text-[#c05c1a] hover:border-[#c05c1a] hover:bg-[#c05c1a]/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Restart from beginning (R)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Main Play / Pause Button */}
              <button
                onClick={handleTogglePlay}
                className="w-12 h-12 rounded-full bg-[#c05c1a] hover:bg-[#a34d14] text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md hover:scale-105 active:scale-95"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Stop Button */}
              <button
                onClick={handleStop}
                className="w-10 h-10 rounded-full border border-[#e0d8c8] bg-[#fffdf8] text-[#8a7d68] hover:text-[#c05c1a] hover:border-[#c05c1a] hover:bg-[#c05c1a]/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Stop playback (S)"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>

              {/* Progress Bar & Word Counter */}
              <div className="flex-1 min-w-[140px]">
                <div className="font-plex-mono text-[10px] text-[#8a7d68] tracking-wider mb-1 flex justify-between">
                  <span>PROGRESS</span>
                  <span className="font-semibold text-[#2c2416]">
                    {words.length > 0 ? `${currentWordIndex} / ${words.length} words` : '0 / 0 words'} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-[#e0d8c8] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#c05c1a] h-full transition-all duration-200 ease-out rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Voice & Acoustic Settings */}
            <div className="p-4 sm:px-6 border-t border-[#e0d8c8] bg-[#f5f0e8]/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Speed Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-plex-mono text-[10px] tracking-widest uppercase text-[#8a7d68] font-semibold">
                    Speed
                  </label>
                  <span className="font-plex-mono text-xs font-bold text-[#c05c1a]">
                    {speed.toFixed(1)}×
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="w-full accent-[#c05c1a] cursor-pointer h-1.5 bg-[#e0d8c8] rounded-lg"
                />
              </div>

              {/* Pitch Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-plex-mono text-[10px] tracking-widest uppercase text-[#8a7d68] font-semibold">
                    Pitch
                  </label>
                  <span className="font-plex-mono text-xs font-bold text-[#c05c1a]">
                    {pitch.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                  className="w-full accent-[#c05c1a] cursor-pointer h-1.5 bg-[#e0d8c8] rounded-lg"
                />
              </div>

              {/* Voice Selector */}
              <div className="space-y-1.5">
                <label className="font-plex-mono text-[10px] tracking-widest uppercase text-[#8a7d68] font-semibold block">
                  Voice
                </label>
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => {
                    const idx = parseInt(e.target.value, 10);
                    setSelectedVoiceIndex(idx);
                    if (isPlaying) {
                      speakFrom(currentWordIndex);
                    }
                  }}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#fffdf8] border border-[#e0d8c8] rounded-lg text-[#2c2416] outline-none focus:border-[#c05c1a] font-lato cursor-pointer truncate"
                >
                  {voices.length === 0 ? (
                    <option>Loading browser voices…</option>
                  ) : (
                    voices.map((v, i) => (
                      <option key={i} value={i}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* ── Paste Your Own Custom Text Section ── */}
          <div className="space-y-2 pt-2">
            <h3 className="font-instrument text-xl text-[#2c2416] font-normal">
              Use your own text
            </h3>
            <textarea
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="Paste your notes, an article, research paper, or any text here…"
              rows={3}
              className="w-full p-3.5 bg-[#fffdf8] border border-[#e0d8c8] rounded-xl text-sm leading-relaxed text-[#2c2416] placeholder:text-[#8a7d68]/60 focus:border-[#c05c1a] outline-none resize-y shadow-xs"
            />
            <div className="flex gap-2">
              <button
                onClick={handleLoadCustomText}
                disabled={!customInputText.trim()}
                className="px-5 py-2 font-plex-mono text-[11px] tracking-wider uppercase font-bold rounded-lg bg-[#c05c1a] hover:bg-[#a34d14] text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Load &amp; Read</span>
              </button>

              <button
                onClick={() => setCustomInputText('')}
                className="px-4 py-2 font-plex-mono text-[11px] tracking-wider uppercase text-[#8a7d68] hover:text-[#2c2416] border border-[#e0d8c8] hover:border-[#c05c1a] bg-[#fffdf8] rounded-lg transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* ── Keyboard Shortcuts Legend ── */}
          <div className="p-3.5 bg-[#fffdf8] border border-[#e0d8c8] rounded-xl">
            <h4 className="font-plex-mono text-[10px] tracking-widest uppercase text-[#8a7d68] font-bold mb-2">
              Keyboard Shortcuts
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#8a7d68]">
              <div className="flex items-center gap-1.5">
                <kbd className="font-plex-mono text-[10px] px-1.5 py-0.5 bg-[#f5f0e8] border border-[#e0d8c8] rounded text-[#2c2416] font-bold">
                  Space
                </kbd>
                <span>Play / Pause</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="font-plex-mono text-[10px] px-1.5 py-0.5 bg-[#f5f0e8] border border-[#e0d8c8] rounded text-[#2c2416] font-bold">
                  S
                </kbd>
                <span>Stop</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="font-plex-mono text-[10px] px-1.5 py-0.5 bg-[#f5f0e8] border border-[#e0d8c8] rounded text-[#2c2416] font-bold">
                  R
                </kbd>
                <span>Restart</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="font-plex-mono text-[10px] px-1.5 py-0.5 bg-[#f5f0e8] border border-[#e0d8c8] rounded text-[#2c2416] font-bold">
                  ↑
                </kbd>
                <span>Speed up</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="font-plex-mono text-[10px] px-1.5 py-0.5 bg-[#f5f0e8] border border-[#e0d8c8] rounded text-[#2c2416] font-bold">
                  ↓
                </kbd>
                <span>Slow down</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="font-plex-mono text-[10px] px-1.5 py-0.5 bg-[#f5f0e8] border border-[#e0d8c8] rounded text-[#2c2416] font-bold">
                  Esc
                </kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
