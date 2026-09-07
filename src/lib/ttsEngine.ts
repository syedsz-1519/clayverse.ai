/**
 * TTS Engine for Clayverse AI
 * Uses free TTS APIs to generate speech for Clay mascot
 * 
 * FREE APIs supported:
 * 1. Web Speech API (browser-native, 0 cost)
 * 2. Google Translate TTS (free, no auth required)
 * 3. ElevenLabs free tier (free credits, high quality)
 * 4. Neets.ai free tier (free credits, multilingual)
 */

export type TTSProvider = 'webSpeech' | 'googleTranslate' | 'elevenlabs' | 'neets';
export type SpeechRate = 0.5 | 0.75 | 1 | 1.25 | 1.5;
export type VoiceGender = 'male' | 'female' | 'neutral';

export interface TTSConfig {
  provider: TTSProvider;
  language: string; // 'en', 'hi', 'te', 'mr', 'ta', 'ur', 'roman_ur', 'hinglish'
  voiceGender?: VoiceGender;
  speechRate?: SpeechRate;
  pitch?: number; // 0.5 - 2
  volume?: number; // 0 - 1
}

export interface TTSResponse {
  success: boolean;
  error?: string;
  audioUrl?: string;
  duration?: number; // in seconds
}

// Language code mapping for different APIs
const LANGUAGE_CODES = {
  en: { webSpeech: 'en-US', google: 'en', neets: 'en', code: 'en' },
  hi: { webSpeech: 'hi-IN', google: 'hi', neets: 'hi', code: 'hi' },
  te: { webSpeech: 'te-IN', google: 'te', neets: 'te', code: 'te' },
  mr: { webSpeech: 'mr-IN', google: 'mr', neets: 'mr', code: 'mr' },
  ta: { webSpeech: 'ta-IN', google: 'ta', neets: 'ta', code: 'ta' },
  ur: { webSpeech: 'ur-PK', google: 'ur', neets: 'ur', code: 'ur' },
  roman_ur: { webSpeech: 'ur-PK', google: 'ur', neets: 'ur', code: 'ur' },
  hinglish: { webSpeech: 'hi-IN', google: 'hi', neets: 'hi', code: 'hi' },
};

/**
 * PRIMARY: Web Speech API (Native Browser TTS - 100% FREE)
 * No API calls needed, works offline
 */
export async function ttsWebSpeech(
  text: string,
  config: TTSConfig
): Promise<TTSResponse> {
  return new Promise((resolve) => {
    try {
      // Check browser support
      const SpeechSynthesisUtterance =
        window.SpeechSynthesisUtterance ||
        (window as any).webkitSpeechSynthesisUtterance;

      if (!SpeechSynthesisUtterance) {
        resolve({
          success: false,
          error: 'Web Speech API not supported in this browser',
        });
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const langCode =
        LANGUAGE_CODES[config.language as keyof typeof LANGUAGE_CODES]
          ?.webSpeech || 'en-US';

      utterance.lang = langCode;
      utterance.rate = config.speechRate || 1;
      utterance.pitch = config.pitch || 1;
      utterance.volume = config.volume || 1;

      // Set voice based on gender preference
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice = voices.find(
          (voice) =>
            voice.lang === langCode &&
            (!config.voiceGender ||
              voice.name.toLowerCase().includes(config.voiceGender))
        ) || voices.find((voice) => voice.lang === langCode);

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => {
        console.log('🎤 Clay speaking...');
      };

      utterance.onend = () => {
        resolve({
          success: true,
          duration: Math.ceil((text.split(' ').length / 150) * 60), // Estimate ~150 words per minute
        });
      };

      utterance.onerror = (event) => {
        resolve({
          success: false,
          error: `Speech synthesis error: ${event.error}`,
        });
      };

      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      resolve({
        success: false,
        error: `Web Speech API error: ${error}`,
      });
    }
  });
}

/**
 * SECONDARY: Google Translate TTS (FREE, No auth)
 * Generates audio URLs that can be played
 * Language support: 100+ languages
 */
export async function ttsGoogleTranslate(
  text: string,
  config: TTSConfig
): Promise<TTSResponse> {
  try {
    const langCode =
      LANGUAGE_CODES[config.language as keyof typeof LANGUAGE_CODES]?.google ||
      'en';

    // Encode text for URL
    const encoded = encodeURIComponent(text);

    // Google Translate TTS endpoint (free, no auth required)
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${langCode}&client=tw-ob`;

    // Create audio element and play
    const audio = new Audio(audioUrl);
    audio.volume = config.volume || 0.8;
    audio.playbackRate = config.speechRate || 1;

    return new Promise((resolve) => {
      audio.onended = () => {
        resolve({
          success: true,
          audioUrl,
          duration: audio.duration,
        });
      };

      audio.onerror = () => {
        resolve({
          success: false,
          error: 'Google Translate TTS failed',
          audioUrl,
        });
      };

      audio.play().catch((err) => {
        resolve({
          success: false,
          error: `Failed to play audio: ${err}`,
          audioUrl,
        });
      });
    });
  } catch (error) {
    return {
      success: false,
      error: `Google Translate TTS error: ${error}`,
    };
  }
}

/**
 * TERTIARY: ElevenLabs Free Tier
 * High quality, natural-sounding voices
 * Free: 10,000 characters/month
 * Requires API key (get free from elevenlabs.io)
 */
export async function ttsElevenLabs(
  text: string,
  config: TTSConfig,
  apiKey?: string
): Promise<TTSResponse> {
  if (!apiKey) {
    // Fall back to Web Speech if no API key
    return ttsWebSpeech(text, config);
  }

  try {
    // Map our language codes to ElevenLabs voices
    const voiceMap: Record<string, string> = {
      en: 'Adam', // English voice
      hi: 'Isha', // Hindi-compatible voice (if available)
      te: 'Isha', // Telugu fallback
      mr: 'Isha', // Marathi fallback
      ta: 'Isha', // Tamil fallback
      ur: 'Isha', // Urdu fallback
      roman_ur: 'Isha', // Roman Urdu fallback
      hinglish: 'Isha', // Hinglish fallback
    };

    const voiceId =
      voiceMap[config.language as keyof typeof voiceMap] || 'Adam';

    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `ElevenLabs API error: ${response.statusText}`,
      };
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play the audio
    const audio = new Audio(audioUrl);
    audio.volume = config.volume || 0.8;
    audio.playbackRate = config.speechRate || 1;

    return new Promise((resolve) => {
      audio.onended = () => {
        resolve({
          success: true,
          audioUrl,
          duration: audio.duration,
        });
      };

      audio.onerror = () => {
        resolve({
          success: false,
          error: 'ElevenLabs audio playback failed',
          audioUrl,
        });
      };

      audio.play().catch((err) => {
        resolve({
          success: false,
          error: `Failed to play audio: ${err}`,
          audioUrl,
        });
      });
    });
  } catch (error) {
    return {
      success: false,
      error: `ElevenLabs error: ${error}`,
    };
  }
}

/**
 * Neets.ai Free Tier
 * Multilingual, natural voices
 * Free: 50,000 characters/month
 */
export async function ttsNeetsAI(
  text: string,
  config: TTSConfig,
  apiKey?: string
): Promise<TTSResponse> {
  if (!apiKey) {
    return ttsWebSpeech(text, config);
  }

  try {
    const langCode =
      LANGUAGE_CODES[config.language as keyof typeof LANGUAGE_CODES]
        ?.neets || 'en';

    const response = await fetch('https://api.neets.ai/v1/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        text,
        voice_id: `${langCode}-${config.voiceGender || 'female'}`,
        params: {
          rate: config.speechRate || 1,
          pitch: config.pitch || 1,
        },
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Neets.ai API error: ${response.statusText}`,
      };
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    const audio = new Audio(audioUrl);
    audio.volume = config.volume || 0.8;
    audio.playbackRate = config.speechRate || 1;

    return new Promise((resolve) => {
      audio.onended = () => {
        resolve({
          success: true,
          audioUrl,
          duration: audio.duration,
        });
      };

      audio.onerror = () => {
        resolve({
          success: false,
          error: 'Neets.ai audio playback failed',
          audioUrl,
        });
      };

      audio.play().catch((err) => {
        resolve({
          success: false,
          error: `Failed to play audio: ${err}`,
          audioUrl,
        });
      });
    });
  } catch (error) {
    return {
      success: false,
      error: `Neets.ai error: ${error}`,
    };
  }
}

/**
 * Main TTS function - intelligently selects provider
 * Priority: WebSpeech (free, native) → GoogleTranslate (free, no-auth) → Premium APIs
 */
export async function synthesizeSpeech(
  text: string,
  config: TTSConfig
): Promise<TTSResponse> {
  console.log(`🎤 Clay synthesizing speech (${config.language}):`, text);

  // Try Web Speech API first (native, free, works offline)
  if (config.provider === 'webSpeech' || config.provider === 'webSpeech') {
    return ttsWebSpeech(text, config);
  }

  // Try Google Translate (free, no auth)
  if (config.provider === 'googleTranslate') {
    return ttsGoogleTranslate(text, config);
  }

  // Premium APIs with auth
  const apiKey = localStorage.getItem('TTS_API_KEY');

  if (config.provider === 'elevenlabs') {
    return ttsElevenLabs(text, config, apiKey || undefined);
  }

  if (config.provider === 'neets') {
    return ttsNeetsAI(text, config, apiKey || undefined);
  }

  // Default: use Web Speech API
  return ttsWebSpeech(text, config);
}

/**
 * Stop all current speech
 */
export function stopSpeech(): void {
  window.speechSynthesis?.cancel();
  console.log('🔇 Clay stopped speaking');
}

/**
 * Check if device supports TTS
 */
export function isTTSSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    (!!window.SpeechSynthesisUtterance ||
      !!(window as any).webkitSpeechSynthesisUtterance)
  );
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): Array<{
  code: string;
  name: string;
  nativeLabel: string;
}> {
  return [
    { code: 'en', name: 'English', nativeLabel: 'English' },
    { code: 'hi', name: 'Hindi', nativeLabel: 'हिंदी' },
    { code: 'te', name: 'Telugu', nativeLabel: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeLabel: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeLabel: 'தமிழ்' },
    { code: 'ur', name: 'Urdu', nativeLabel: 'اردو' },
    { code: 'roman_ur', name: 'Roman Urdu', nativeLabel: 'Roman Urdu' },
    { code: 'hinglish', name: 'Hinglish', nativeLabel: 'Hinglish' },
  ];
}

export default {
  synthesizeSpeech,
  stopSpeech,
  isTTSSupported,
  getAvailableLanguages,
  webSpeech: ttsWebSpeech,
  googleTranslate: ttsGoogleTranslate,
  elevenLabs: ttsElevenLabs,
  neetsAI: ttsNeetsAI,
};
