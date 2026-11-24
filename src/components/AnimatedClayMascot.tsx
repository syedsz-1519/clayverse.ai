import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface AnimatedClayProps {
  isSpeaking: boolean;
  mood?: 'happy' | 'thinking' | 'excited';
}

export default function AnimatedClayMascot({ isSpeaking, mood = 'happy' }: AnimatedClayProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0); // 0 to 1 for lip sync

  // Auto-blink logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Lip sync simulation (random movement when speaking)
  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(0);
      return;
    }

    const talkInterval = setInterval(() => {
      setMouthOpen(Math.random() * 0.8 + 0.2);
    }, 150);

    return () => clearInterval(talkInterval);
  }, [isSpeaking]);

  // Mood-based head tilt
  const headTilt = mood === 'thinking' ? -5 : mood === 'excited' ? 5 : 0;

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
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
        className="relative z-10"
      >
        {/* Terracotta Head */}
        <div className="w-48 h-52 bg-[#E07A5F] rounded-[4rem] relative shadow-[inset_-8px_-8px_20px_rgba(0,0,0,0.1),inset_8px_8px_20px_rgba(255,255,255,0.2)] border-4 border-[#C56338]">
          
          {/* Face Plate */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-36 h-32 bg-[#F4EFE6] rounded-[2.5rem] shadow-inner flex flex-col items-center justify-center gap-4">
            
            {/* Eyes */}
            <div className="flex gap-6 mt-2">
              {/* Left Eye */}
              <div className="relative w-5 h-6 bg-[#2E1810] rounded-full overflow-hidden">
                <motion.div 
                  animate={{ scaleY: isBlinking ? 0 : 1 }}
                  className="absolute inset-0 bg-[#F4EFE6] origin-top"
                />
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
              </div>
              
              {/* Right Eye */}
              <div className="relative w-5 h-6 bg-[#2E1810] rounded-full overflow-hidden">
                <motion.div 
                  animate={{ scaleY: isBlinking ? 0 : 1 }}
                  className="absolute inset-0 bg-[#F4EFE6] origin-top"
                />
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-80" />
              </div>
            </div>

            {/* Animated Mouth */}
            <motion.div 
              animate={{ 
                height: 4 + (mouthOpen * 12),
                borderRadius: mouthOpen > 0.5 ? '50%' : '4px'
              }}
              className="w-8 bg-[#9A4228] transition-all duration-100"
            />
          </div>

          {/* Ears / Side Details */}
          <div className="absolute top-20 -left-3 w-4 h-12 bg-[#E07A5F] rounded-l-xl border-l-4 border-y-4 border-[#C56338]" />
          <div className="absolute top-20 -right-3 w-4 h-12 bg-[#E07A5F] rounded-r-xl border-r-4 border-y-4 border-[#C56338]" />
        </div>

        {/* Floor Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/10 rounded-[50%] blur-sm" />
      </motion.div>
    </div>
  );
}
