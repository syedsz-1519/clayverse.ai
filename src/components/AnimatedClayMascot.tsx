import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface AnimatedClayProps {
  isSpeaking: boolean;
  mood?: 'happy' | 'thinking' | 'excited';
  gesture?: 'wave' | 'point' | 'think' | 'none';
}

// Phoneme to viseme mapping for realistic lip sync
const PHONEME_TO_VISEME: Record<string, number> = {
  // Closed mouth (0)
  'p': 0, 'b': 0, 'm': 0,
  // Tight lips (0.2)
  'f': 0.2, 'v': 0.2,
  // Open (0.5)
  'a': 0.5, 'æ': 0.5, 'ʌ': 0.5,
  // Wide open (0.8)
  'o': 0.8, 'ɔ': 0.8, 'u': 0.8,
  // Neutral (0.4)
  'ə': 0.4, 'ɪ': 0.4, 'e': 0.4,
  // Silence
  ' ': 0, '.': 0, ',': 0, '?': 0, '!': 0,
};

export default function AnimatedClayMascot({ isSpeaking, mood = 'happy', gesture = 'none' }: AnimatedClayProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0); // 0 to 1 for lip sync
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const textIndexRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
        setVoicesLoaded(true);
      };

      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Auto-blink logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Advanced lip sync: map phonemes to mouth shapes
  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(0);
      return;
    }

    // Simulate phoneme-based mouth movement
    // In a real implementation, you'd parse actual phonemes from the speech
    const talkInterval = setInterval(() => {
      // Generate pseudo-random phoneme-based mouth positions
      const phonemes = Object.values(PHONEME_TO_VISEME);
      const randomViseme = phonemes[Math.floor(Math.random() * phonemes.length)];
      setMouthOpen(randomViseme + (Math.random() * 0.1 - 0.05)); // Add slight variation
    }, 100);

    return () => clearInterval(talkInterval);
  }, [isSpeaking]);

  // Mood-based head tilt
  const headTilt = mood === 'thinking' ? -5 : mood === 'excited' ? 5 : 0;

  // Gesture animations
  const getGestureAnimation = () => {
    switch (gesture) {
      case 'wave':
        return { rotate: [0, 45, -15, 45, 0], x: [0, 5, -5, 5, 0] };
      case 'point':
        return { rotate: 25, x: -2 };
      case 'think':
        return { rotate: -10, x: -5 };
      default:
        return { rotate: 0, x: 0 };
    }
  };

  return (
    <div className="relative w-64 h-64 flex items-center justify-center will-change-transform" style={{ transform: 'translateZ(0)' }}>
      {/* Main Body Container */}
      <motion.div
        animate={{ 
          y: isSpeaking ? [0, -5, 0] : 0,
          rotate: headTilt
        }}
        transition={{ 
          repeat: isSpeaking ? Infinity : 0, 
          duration: 0.5,
          ease: "easeInOut" 
        }}
        className="relative z-10 will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Terracotta Head */}
        <div className="w-48 h-52 bg-[#E07A5F] rounded-[4rem] relative shadow-[inset_-8px_-8px_20px_rgba(0,0,0,0.1),inset_8px_8px_20px_rgba(255,255,255,0.2)] border-4 border-[#C56338]">
          
          {/* Face Plate */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-36 h-32 bg-[#F4EFE6] rounded-[2.5rem] shadow-inner flex flex-col items-center justify-center gap-4">
            
            {/* Eyes */}
            <div className="flex gap-6 mt-2">
              {/* Left Eye */}
              <div className="relative w-5 h-6 bg-[#2E1810] rounded-full overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>
                <motion.div 
                  animate={{ scaleY: isBlinking ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="absolute inset-0 bg-[#F4EFE6] origin-top"
                />
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
              </div>
              
              {/* Right Eye */}
              <div className="relative w-5 h-6 bg-[#2E1810] rounded-full overflow-hidden will-change-transform" style={{ transform: 'translateZ(0)' }}>
                <motion.div 
                  animate={{ scaleY: isBlinking ? 0 : 1 }}
                  transition={{ duration: 0.1 }}
                  className="absolute inset-0 bg-[#F4EFE6] origin-top"
                />
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
              </div>
            </div>

            {/* Animated Mouth - Phoneme-based */}
            <motion.div 
              animate={{ 
                height: 4 + (mouthOpen * 12),
                borderRadius: mouthOpen > 0.5 ? '50%' : '4px'
              }}
              transition={{ duration: 0.05 }}
              className="w-8 bg-[#9A4228] will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            />
          </div>

          {/* Left Arm - Gesture Support */}
          <motion.div 
            animate={getGestureAnimation()}
            transition={{ 
              duration: gesture === 'wave' ? 0.8 : 0.3,
              repeat: gesture === 'wave' ? Infinity : 0,
            }}
            className="absolute top-20 -left-3 w-4 h-12 bg-[#E07A5F] rounded-l-xl border-l-4 border-y-4 border-[#C56338] will-change-transform origin-top"
            style={{ transform: 'translateZ(0)' }}
          />

          {/* Right Arm / Side Details */}
          <div className="absolute top-20 -right-3 w-4 h-12 bg-[#E07A5F] rounded-r-xl border-r-4 border-y-4 border-[#C56338]" />
        </div>

        {/* Floor Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/10 rounded-[50%] blur-sm will-change-transform" style={{ transform: 'translateZ(0)' }} />
      </motion.div>
    </div>
  );
}
