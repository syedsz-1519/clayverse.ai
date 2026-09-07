/**
 * Text-to-Speech Engine
 * Supports 8 languages with proper voice configuration
 * Uses Web Speech API with fallback support
 */

export interface TTSConfig {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

const languageVoiceMap: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  ur: 'ur-IN',
  roman_ur: 'en-US', // Use English voice for Roman Urdu
  hinglish: 'en-IN',
};

const languageNameMap: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
  mr: 'Marathi',
  ta: 'Tamil',
  ur: 'Urdu',
  roman_ur: 'Roman Urdu',
  hinglish: 'Hinglish',
};

export class TextToSpeechEngine {
  private synth: SpeechSynthesis;
  private isSupported: boolean;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.isSupported = !!this.synth;
  }

  /**
   * Check if browser supports Web Speech API
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Get available voices
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  /**
   * Find the best voice for a language
   */
  private findVoiceForLanguage(language: string): SpeechSynthesisVoice | undefined {
    const voiceCode = languageVoiceMap[language] || 'en-US';
    const voices = this.synth.getVoices();

    // Try exact match first
    let voice = voices.find(v => v.lang.startsWith(voiceCode.split('-')[0]));

    // If not found, return first available
    if (!voice && voices.length > 0) {
      voice = voices[0];
    }

    return voice;
  }

  /**
   * Speak text with specified language
   */
  speak(
    text: string,
    language: string = 'en',
    config: Partial<TTSConfig> = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Text-to-Speech not supported in this browser'));
        return;
      }

      // Cancel any ongoing speech
      if (this.isSpeaking) {
        this.synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.findVoiceForLanguage(language);

      if (voice) {
        utterance.voice = voice;
      }

      utterance.lang = languageVoiceMap[language] || 'en-US';
      utterance.rate = config.rate ?? 0.95; // Slightly slower for clarity
      utterance.pitch = config.pitch ?? 1;
      utterance.volume = config.volume ?? 1;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Stop speaking
   */
  stop(): void {
    if (this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Pause speaking
   */
  pause(): void {
    if (this.isSupported && this.isSpeaking) {
      this.synth.pause();
    }
  }

  /**
   * Resume speaking
   */
  resume(): void {
    if (this.isSupported && this.isSpeaking) {
      this.synth.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  getSpeakingState(): boolean {
    return this.isSpeaking;
  }

  /**
   * Get language name for display
   */
  getLanguageName(language: string): string {
    return languageNameMap[language] || 'Unknown';
  }
}

// Singleton instance
export const ttsEngine = new TextToSpeechEngine();

// Initialize voices (they load asynchronously)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices have been loaded
  };
}
