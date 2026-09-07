/**
 * Clay Voice Assistant Component
 * Interactive component that speaks responses in the selected language
 * Integrates with useLanguageMultilingual for multilingual support
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Loader, MessageCircle } from 'lucide-react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import { useClayTTS } from '../hooks/useClayTTS';
import type { Language } from '../lib/clayTTS';

interface ClayVoiceAssistantProps {
  /** Text to speak when activated */
  text: string;
  /** Custom label for the button */
  label?: string;
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Callback when speaking starts */
  onSpeakStart?: () => void;
  /** Callback when speaking ends */
  onSpeakEnd?: () => void;
  /** Auto-play on mount */
  autoPlay?: boolean;
  /** Show button or just use function */
  showButton?: boolean;
}

function ClayVoiceAssistant({
  text,
  label,
  size = 'md',
  onSpeakStart,
  onSpeakEnd,
  autoPlay = false,
  showButton = true
}: ClayVoiceAssistantProps) {
  const { lang } = useLanguageMultilingual();
  const { speak, stop, isSpeaking, isSupported } = useClayTTS({ language: lang as Language });
  
  const [hasSpoken, setHasSpoken] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play if requested
  useEffect(() => {
    if (autoPlay && !hasSpoken) {
      handleSpeak();
      setHasSpoken(true);
    }
  }, [autoPlay, text]);

  // Call callbacks
  useEffect(() => {
    if (isSpeaking && onSpeakStart) {
      onSpeakStart();
    } else if (!isSpeaking && hasSpoken && onSpeakEnd) {
      onSpeakEnd();
      setHasSpoken(false);
    }
  }, [isSpeaking, onSpeakStart, onSpeakEnd, hasSpoken]);

  const handleSpeak = async () => {
    try {
      await speak(text, lang as Language);
    } catch (error) {
      console.error('Failed to speak:', error);
    }
  };

  const handleStop = () => {
    stop();
    setHasSpoken(false);
  };

  if (!showButton || !isSupported) {
    return null;
  }

  // Size variants
  const sizeConfig = {
    sm: {
      button: 'px-2 py-1.5',
      icon: 'w-3.5 h-3.5',
      text: 'text-xs'
    },
    md: {
      button: 'px-3 py-2',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      button: 'px-4 py-2.5',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="inline-block"
    >
      <button
        onClick={isSpeaking ? handleStop : handleSpeak}
        disabled={!text || text.trim().length === 0}
        className={`
          ${config.button}
          flex items-center gap-2
          rounded-lg
          font-medium
          transition-all
          ${isSpeaking
            ? 'bg-brand-amber text-white shadow-lg shadow-brand-amber/50'
            : 'bg-brand-amber/10 text-brand-amber hover:bg-brand-amber/20'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:disabled:bg-brand-amber/10
          border border-brand-amber/30
          group
        `}
        title={isSpeaking ? 'Stop speaking' : 'Listen to this'}
      >
        <AnimatePresence mode="wait">
          {isSpeaking ? (
            <motion.div
              key="speaking"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Volume2 className={`${config.icon} text-white`} />
            </motion.div>
          ) : (
            <motion.div key="idle">
              <MessageCircle className={`${config.icon}`} />
            </motion.div>
          )}
        </AnimatePresence>

        <span className={`${config.text} font-mono font-bold uppercase tracking-wider`}>
          {isSpeaking 
            ? lang === 'en' ? 'Clay Speaking...' : 'सुन रहे हैं...'
            : label || (lang === 'en' ? 'Hear It' : 'सुनें')
          }
        </span>
      </button>

      {/* Hidden audio element for reference */}
      <audio ref={audioRef} className="hidden" />
    </motion.div>
  );
}

/**
 * Inline TTS Button - Smaller variant for inline use
 */
export function ClayVoiceButton({
  text,
  size = 'sm'
}: {
  text: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { lang } = useLanguageMultilingual();
  const { speak, isSpeaking } = useClayTTS({ language: lang as Language });

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => speak(text, lang as Language)}
      disabled={!text}
      className={`
        ${sizeClasses[size]}
        p-1.5
        rounded-lg
        bg-brand-amber/10
        hover:bg-brand-amber/20
        text-brand-amber
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center
      `}
      title="Listen"
    >
      {isSpeaking ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Volume2 className={`${sizeClasses[size]}`} />
        </motion.div>
      ) : (
        <MessageCircle className={`${sizeClasses[size]}`} />
      )}
    </motion.button>
  );
}

export default ClayVoiceAssistant;
