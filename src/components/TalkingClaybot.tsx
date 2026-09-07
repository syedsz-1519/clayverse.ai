import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import { ttsEngine } from '../lib/textToSpeech';

interface TalkingClaybotProps {
  className?: string;
  size?: number;
  defaultMessage?: string;
  autoPlay?: boolean;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export default function TalkingClaybot({
  className = '',
  size = 120,
  defaultMessage,
  autoPlay = false,
  onSpeakingChange,
}: TalkingClaybotProps) {
  const { lang } = useLanguageMultilingual();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>(defaultMessage ? [defaultMessage] : []);
  const [currentMessage, setCurrentMessage] = useState('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Initialize Web Audio for visualization
  useEffect(() => {
    if (!audioContextRef.current && ttsEngine.isAvailable()) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
      } catch (e) {
        console.log('Audio context not available');
      }
    }
  }, []);

  // Auto-play default message
  useEffect(() => {
    if (autoPlay && defaultMessage && !isSpeaking) {
      handleSpeak(defaultMessage);
    }
  }, [autoPlay, defaultMessage]);

  // Handle speaking
  const handleSpeak = async (text: string) => {
    if (!ttsEngine.isAvailable()) {
      alert('Text-to-Speech is not supported in your browser');
      return;
    }

    if (isSpeaking) {
      ttsEngine.stop();
      setIsSpeaking(false);
      setMouthOpen(false);
      return;
    }

    setCurrentMessage(text);
    setIsSpeaking(true);
    setIsListening(true);
    onSpeakingChange?.(true);

    try {
      await ttsEngine.speak(text, lang);
      setIsSpeaking(false);
      setMouthOpen(false);
      onSpeakingChange?.(false);
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
      setMouthOpen(false);
      onSpeakingChange?.(false);
    }

    setIsListening(false);
  };

  // Add message to queue
  const queueMessage = (text: string) => {
    setMessageQueue([...messageQueue, text]);
  };

  // Process message queue
  useEffect(() => {
    if (messageQueue.length > 0 && !isSpeaking) {
      const nextMessage = messageQueue[0];
      setMessageQueue(messageQueue.slice(1));
      handleSpeak(nextMessage);
    }
  }, [messageQueue, isSpeaking]);

  // Animate mouth while speaking
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  const scale = size / 100;

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Talking Claybot SVG */}
      <motion.div
        animate={{
          y: isSpeaking ? [-2, 2, -2] : 0,
          scale: isListening ? 1.05 : 1,
        }}
        transition={{
          duration: 0.4,
          repeat: isSpeaking ? Infinity : 0,
        }}
        className="cursor-pointer"
        onClick={() => {
          if (currentMessage) {
            handleSpeak(currentMessage);
          }
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg hover:drop-shadow-xl transition-all"
        >
          {/* Soft Shadow */}
          <motion.ellipse
            cx="50"
            cy="88"
            rx="30"
            ry="6"
            fill="#1C1917"
            fillOpacity="0.08"
            animate={{ ry: isSpeaking ? 5 : 6 }}
          />

          {/* Orange Capsule Body */}
          <motion.rect
            x="15"
            y="10"
            width="70"
            height="76"
            rx="35"
            fill="#E07A5F"
            stroke="#C56338"
            strokeWidth="1.5"
            animate={{ fill: isSpeaking ? '#F0956F' : '#E07A5F' }}
            transition={{ duration: 0.2 }}
          />

          {/* Clay Texture Gradient */}
          <rect
            x="18"
            y="13"
            width="64"
            height="70"
            rx="32"
            stroke="url(#clayGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity={0.45}
          />

          {/* Dark Inner Hood */}
          <rect
            x="22"
            y="18"
            width="56"
            height="56"
            rx="26"
            fill="#C55937"
            fillOpacity="0.85"
          />

          {/* Cream Face Plate */}
          <rect
            x="26"
            y="21"
            width="48"
            height="48"
            rx="21"
            fill="#F4EFE6"
            stroke="#E5DFD4"
            strokeWidth="1"
          />

          {/* Left Eye */}
          <g>
            {/* Eye white */}
            <circle cx="40" cy="40" r="5" fill="#FFFFFF" stroke="#E5DFD4" strokeWidth="0.5" />
            {/* Pupil with animation */}
            <motion.ellipse
              cx="40"
              cy="42"
              rx="4"
              ry="6"
              fill="#2E1810"
              animate={{
                cy: isSpeaking ? [42, 40, 42] : 42,
                rx: isListening ? 3 : 4,
                ry: isListening ? 5 : 6,
              }}
              transition={{ duration: 0.4, repeat: isSpeaking ? Infinity : 0 }}
            />
            {/* Specular highlight */}
            <circle cx="38.5" cy="39.5" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Right Eye */}
          <g>
            {/* Eye white */}
            <circle cx="60" cy="40" r="5" fill="#FFFFFF" stroke="#E5DFD4" strokeWidth="0.5" />
            {/* Pupil with animation */}
            <motion.ellipse
              cx="60"
              cy="42"
              rx="4"
              ry="6"
              fill="#2E1810"
              animate={{
                cy: isSpeaking ? [42, 40, 42] : 42,
                rx: isListening ? 3 : 4,
                ry: isListening ? 5 : 6,
              }}
              transition={{ duration: 0.4, repeat: isSpeaking ? Infinity : 0 }}
            />
            {/* Specular highlight */}
            <circle cx="58.5" cy="39.5" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Animated Mouth */}
          <g>
            {mouthOpen ? (
              // Open mouth (speaking)
              <>
                <ellipse cx="50" cy="56" rx="6" ry="7" fill="#9A4228" />
                <path
                  d="M 50,63 Q 48,65 46,64"
                  stroke="#8B3B24"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 50,63 Q 52,65 54,64"
                  stroke="#8B3B24"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : (
              // Closed/Smile mouth
              <path
                d="M 44,56 A 6,6 0 0,0 56,56"
                stroke="#9A4228"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* Blush when happy */}
          <motion.circle
            cx="32"
            cy="50"
            r="3"
            fill="#D98880"
            opacity={isSpeaking ? 0.4 : 0}
            animate={{ opacity: isSpeaking ? [0.2, 0.4, 0.2] : 0 }}
            transition={{ duration: 0.6, repeat: isSpeaking ? Infinity : 0 }}
          />

          <motion.circle
            cx="68"
            cy="50"
            r="3"
            fill="#D98880"
            opacity={isSpeaking ? 0.4 : 0}
            animate={{ opacity: isSpeaking ? [0.2, 0.4, 0.2] : 0 }}
            transition={{ duration: 0.6, repeat: isSpeaking ? Infinity : 0 }}
          />

          {/* Sound waves when speaking */}
          {isSpeaking && (
            <>
              <motion.circle
                cx="50"
                cy="50"
                r="18"
                fill="none"
                stroke="#E07A5F"
                strokeWidth="1"
                opacity="0.6"
                animate={{ r: [18, 28], opacity: [0.6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="12"
                fill="none"
                stroke="#E07A5F"
                strokeWidth="1"
                opacity="0.6"
                animate={{ r: [12, 22], opacity: [0.6, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
              />
            </>
          )}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="clayGrad" x1="15" y1="10" x2="85" y2="86" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FF9E85" />
              <stop offset="1" stopColor="#9C3E23" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Message Display */}
      {currentMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-center max-w-xs"
        >
          <p className="text-sm text-gray-700 italic">{currentMessage}</p>
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {/* Speak Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (currentMessage) {
              handleSpeak(currentMessage);
            }
          }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            isSpeaking
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSpeaking ? '⏸ Stop' : '▶ Speak'}
        </motion.button>
      </div>

      {/* Status Indicator */}
      <div className="text-xs text-gray-500">
        {isSpeaking ? (
          <span className="flex items-center gap-1">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block w-2 h-2 bg-green-500 rounded-full"
            />
            Speaking...
          </span>
        ) : isListening ? (
          <span>Ready to listen...</span>
        ) : (
          <span>Click to listen</span>
        )}
      </div>
    </div>
  );
}
