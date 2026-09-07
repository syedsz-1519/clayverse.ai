/**
 * React Hook for Clay Text-to-Speech
 * Provides easy integration of TTS in React components
 */

import { useState, useCallback, useEffect } from 'react';
import { claySpeak, clayStop, clayIsSpeaking, getClayTTS } from '../lib/clayTTS';
import type { Language } from '../lib/clayTTS';

interface UseClayTTSOptions {
  language?: Language;
  autoInitialize?: boolean;
}

interface UseClayTTSReturn {
  speak: (text: string, lang?: Language) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  availableLanguages: Language[];
}

/**
 * Hook to use Clay TTS in components
 */
export function useClayTTS(options: UseClayTTSOptions = {}): UseClayTTSReturn {
  const { language = 'en', autoInitialize = true } = options;
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = typeof window !== 'undefined' && 
        (('speechSynthesis' in window) || ('webkitSpeechSynthesis' in window));
      setIsSupported(supported);
    };

    if (autoInitialize) {
      checkSupport();
    }

    return () => {
      clayStop();
    };
  }, [autoInitialize]);

  // Track speaking state
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(clayIsSpeaking());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const speak = useCallback(
    async (text: string, lang: Language = language) => {
      if (!isSupported) {
        console.warn('Text-to-Speech not supported in this browser');
        return;
      }

      try {
        setIsSpeaking(true);
        await claySpeak(text, lang, {
          rate: getClayTTS().getOptimalRate(lang)
        });
      } catch (error) {
        console.error('Error speaking:', error);
      } finally {
        setIsSpeaking(false);
      }
    },
    [language, isSupported]
  );

  const stop = useCallback(() => {
    clayStop();
    setIsSpeaking(false);
  }, []);

  const availableLanguages: Language[] = [
    'en', 'hi', 'te', 'mr', 'ta', 'ur', 'roman_ur', 'hinglish'
  ];

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    availableLanguages
  };
}

export default useClayTTS;
