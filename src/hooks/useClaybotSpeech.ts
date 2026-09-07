import { useState, useCallback, useRef } from 'react';
import { ttsEngine } from '../lib/textToSpeech';
import { useLanguageMultilingual } from './useLanguageMultilingual';

/**
 * Hook for managing Claybot speech
 * Provides easy-to-use interface for text-to-speech
 */
export function useClaybotSpeech() {
  const { lang } = useLanguageMultilingual();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const messageQueueRef = useRef<string[]>([]);

  /**
   * Speak a single message
   */
  const speak = useCallback(
    async (text: string, waitForEnd = false) => {
      if (!ttsEngine.isAvailable()) {
        console.warn('Text-to-Speech not available');
        return false;
      }

      return new Promise<boolean>((resolve) => {
        setCurrentMessage(text);
        setIsSpeaking(true);

        ttsEngine
          .speak(text, lang)
          .then(() => {
            setIsSpeaking(false);
            setCurrentMessage('');
            resolve(true);
          })
          .catch((error) => {
            console.error('Speech error:', error);
            setIsSpeaking(false);
            resolve(false);
          });

        if (!waitForEnd) {
          resolve(true);
        }
      });
    },
    [lang]
  );

  /**
   * Queue multiple messages to be spoken sequentially
   */
  const queueMessages = useCallback(
    async (messages: string[]) => {
      messageQueueRef.current = [...messages];
      return processQueue();
    },
    []
  );

  /**
   * Process the message queue
   */
  const processQueue = useCallback(async () => {
    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current.shift();
      if (message) {
        await speak(message, true);
        // Small delay between messages
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }, [speak]);

  /**
   * Stop speaking
   */
  const stop = useCallback(() => {
    ttsEngine.stop();
    setIsSpeaking(false);
    setCurrentMessage('');
    messageQueueRef.current = [];
  }, []);

  /**
   * Check if available
   */
  const isAvailable = useCallback(() => {
    return ttsEngine.isAvailable();
  }, []);

  /**
   * Get language name for display
   */
  const getLanguageName = useCallback(() => {
    return ttsEngine.getLanguageName(lang);
  }, [lang]);

  return {
    isSpeaking,
    currentMessage,
    speak,
    queueMessages,
    stop,
    isAvailable,
    getLanguageName,
    language: lang,
  };
}
