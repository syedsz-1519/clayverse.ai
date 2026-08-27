import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from './useLanguage';
import audioManifest from '../data/audioManifest.json';

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  langCode?: string;
}

export function useImprovedTTS() {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentText, setCurrentText] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

  const getBestVoiceForLanguage = useCallback((targetLang: string) => {
    if (!availableVoices.length) return null;

    // Direct mapping to standard BCP 47 tags for Indian and international languages
    const langMap: Record<string, string[]> = {
      en: ['en-IN', 'en-US', 'en-GB'],
      hi: ['hi-IN', 'hi'],
      te: ['te-IN', 'te'],
      ta: ['ta-IN', 'ta'],
      bn: ['bn-IN', 'bn-BD', 'bn'],
      mr: ['mr-IN', 'mr'],
      gu: ['gu-IN', 'gu'],
      kn: ['kn-IN', 'kn'],
      ml: ['ml-IN', 'ml'],
      pa: ['pa-IN', 'pa'],
      ur: ['ur-IN', 'ur-PK', 'ur'],
      as: ['as-IN', 'as'],
      or: ['or-IN', 'or', 'od-IN'],
      sa: ['sa-IN', 'sa', 'hi-IN'],
      hinglish: ['hi-IN', 'en-IN'],
      thanglish: ['ta-IN', 'en-IN'],
      hyd: ['ur-IN', 'hi-IN', 'en-IN'],
      roman_ur: ['ur-IN', 'en-IN']
    };

    const targetLocales = langMap[targetLang] || [targetLang, 'en-IN', 'en-US'];

    for (const locale of targetLocales) {
      const match = availableVoices.find(v => 
        v.lang.toLowerCase().replace('_', '-') === locale.toLowerCase() ||
        v.lang.toLowerCase().startsWith(locale.split('-')[0].toLowerCase())
      );
      if (match) return match;
    }

    return availableVoices[0] || null;
  }, [availableVoices]);

  const speak = useCallback((text: string, options?: TTSOptions) => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    const targetLang = options?.langCode || lang;
    const voice = getBestVoiceForLanguage(targetLang);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1.05;
    utterance.volume = options?.volume ?? 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentText(cleanText);
      window.dispatchEvent(new CustomEvent('clay_tts_start', { detail: { text: cleanText, lang: targetLang } }));
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentText('');
      window.dispatchEvent(new CustomEvent('clay_tts_end'));
    };

    utterance.onerror = (e) => {
      console.warn('TTS playback issue:', e);
      setIsPlaying(false);
      setCurrentText('');
      window.dispatchEvent(new CustomEvent('clay_tts_end'));
    };

    window.speechSynthesis.speak(utterance);
  }, [lang, getBestVoiceForLanguage]);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentText('');
      window.dispatchEvent(new CustomEvent('clay_tts_end'));
    }
  }, []);

  const speakPresetPrompt = useCallback((promptKey: 'welcome' | 'what_is_ai' | 'streak_cheer') => {
    const langData = (audioManifest.languages as Record<string, any>)[lang] || audioManifest.languages.en;
    const text = langData?.prompts?.[promptKey] || audioManifest.languages.en.prompts[promptKey];
    speak(text);
  }, [lang, speak]);

  return {
    speak,
    stop,
    isPlaying,
    isSupported,
    currentText,
    speakPresetPrompt,
    availableVoicesCount: availableVoices.length
  };
}
