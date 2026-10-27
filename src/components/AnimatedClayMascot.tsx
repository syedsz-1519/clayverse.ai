import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

interface AnimatedClayMascotProps {
  size?: number;
  isSpeaking?: boolean;
  onSpeakClick?: () => void;
  autoPlay?: boolean;
}

export default function AnimatedClayMascot({
  size = 280,
  isSpeaking = false,
  onSpeakClick,
  autoPlay = false,
}: AnimatedClayMascotProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Simulate speech mouth animation
  useEffect(() => {
    if (!isPlaying) {
      setMouthOpen(false);
      return;
    }

    const interval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 150); // Mouth opens/closes every 150ms during speech

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSpeakClick = () => {
    setIsPlaying(!isPlaying);
    onSpeakClick?.();

    // Here you would typically trigger TTS
    // For now, we'll just animate the speaking state
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Clay Mascot SVG with animations */}
      <div className="relative">
        {/* Sound wave indicator when speaking */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="absolute w-full h-full rounded-full border-2 border-blue-400"
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-full h-full rounded-full border-2 border-blue-300"
              initial={{ scale: 0.9, opacity: 0.4 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
          </div>
        )}

        {/* Main Clay SVG with idle breathing animation */}
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            scale: isPlaying ? [1, 1.02, 1] : [1, 1.015, 1],
          }}
          transition={{
            duration: isPlaying ? 0.3 : 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="drop-shadow-[0_8px_16px_rgba(224,122,95,0.25)]"
        >
          {/* Soft Shadow behind the bot */}
          <ellipse cx="50" cy="88" rx="32" ry="8" fill="#1C1917" fillOpacity="0.12" />

          {/* Rounded Orange Capsule Body (Clay Mascot Shape) */}
          <rect
            x="15"
            y="10"
            width="70"
            height="76"
            rx="35"
            fill="#E07A5F"
            stroke="#C56338"
            strokeWidth="1.5"
          />

          {/* Clay texture / 3D gradients inner highlights */}
          <rect
            x="18"
            y="13"
            width="64"
            height="70"
            rx="32"
            stroke="url(#clayGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="opacity-45"
          />

          {/* Dark Inner Hood Cavity shadow */}
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

          {/* Eye Left - Animated */}
          <g>
            <motion.ellipse
              cx="40"
              cy="42"
              rx="4.5"
              ry={mouthOpen ? 5 : 6.5}
              fill="#2E1810"
              animate={
                isPlaying
                  ? { ry: [6.5, 5, 6.5] }
                  : { ry: [6.5, 6, 6.5] }
              }
              transition={{
                duration: isPlaying ? 0.3 : 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Specular highlight */}
            <circle cx="38.5" cy="39.5" r="1.5" fill="#FFFFFF" />
            <circle cx="41.5" cy="44.5" r="0.5" fill="#FFFFFF" fillOpacity="0.7" />
          </g>

          {/* Eye Right - Animated */}
          <g>
            <motion.ellipse
              cx="60"
              cy="42"
              rx="4.5"
              ry={mouthOpen ? 5 : 6.5}
              fill="#2E1810"
              animate={
                isPlaying
                  ? { ry: [6.5, 5, 6.5] }
                  : { ry: [6.5, 6, 6.5] }
              }
              transition={{
                duration: isPlaying ? 0.3 : 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {/* Specular highlight */}
            <circle cx="58.5" cy="39.5" r="1.5" fill="#FFFFFF" />
            <circle cx="61.5" cy="44.5" r="0.5" fill="#FFFFFF" fillOpacity="0.7" />
          </g>

          {/* Animated Mouth */}
          {isPlaying ? (
            // Speaking mouth - open/close animation
            <motion.ellipse
              cx="50"
              cy="56"
              rx="6"
              ry="4"
              fill="#9A4228"
              animate={{ ry: [4, 6, 4] }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : (
            // Resting mouth - smile
            <path
              d="M 44,53 A 6,6 0 0,0 56,53"
              stroke="#9A4228"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient
              id="clayGrad"
              x1="15"
              y1="10"
              x2="85"
              y2="86"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#FF9E85" />
              <stop offset="1" stopColor="#9C3E23" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Speech Control Button */}
      <motion.button
        onClick={handleSpeakClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all ${
          isPlaying
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 text-slate-700 border-2 border-amber-200 hover:border-amber-300'
        }`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>Listening to Clay...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Hear Clay's Intro</span>
          </>
        )}
      </motion.button>

      {/* Description Text */}
      <div className="text-center max-w-sm">
        <p className="text-slate-600 text-sm leading-relaxed">
          Meet <span className="font-bold text-orange-600">Clay</span>, your friendly AI tutor.
          Click the button above to hear a warm introduction to your learning journey.
        </p>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
