import React, { useState, useEffect } from 'react';
import { MessageCircle, Volume2, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import {
  getClayGreeting,
  getClayEncouragement,
  getClayTip,
  getClayACelebration,
  ClayMessage,
} from '../lib/clayPersonality';

interface ClayTalkingPersonalityProps {
  autoGreet?: boolean;
  showOnInit?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onMessage?: (message: ClayMessage) => void;
}

type EmotionEmoji = {
  [key: string]: string;
};

const EMOTION_EMOJI: EmotionEmoji = {
  happy: '😊',
  thinking: '🤔',
  excited: '🚀',
  helpful: '💡',
  encouraging: '💪',
  confused: '❓',
};

const ClayTalkingPersonality: React.FC<ClayTalkingPersonalityProps> = ({
  autoGreet = true,
  showOnInit = false,
  position = 'bottom-right',
  onMessage,
}) => {
  const { lang } = useLanguageMultilingual();
  const [isOpen, setIsOpen] = useState(showOnInit);
  const [currentMessage, setCurrentMessage] = useState<ClayMessage | null>(null);
  const [messageHistory, setMessageHistory] = useState<ClayMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto-greet on mount
  useEffect(() => {
    if (autoGreet && !currentMessage) {
      const greeting = getClayGreeting(lang as any);
      setCurrentMessage(greeting);
      setMessageHistory([greeting]);
      onMessage?.(greeting);
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Generate response based on input
    let response: ClayMessage;

    if (userInput.toLowerCase().includes('help') || userInput.toLowerCase().includes('explain')) {
      response = getClayEncouragement(lang as any);
    } else if (userInput.toLowerCase().includes('tip') || userInput.toLowerCase().includes('hint')) {
      response = getClayTip(lang as any);
    } else {
      response = getClayEncouragement(lang as any);
    }

    setCurrentMessage(response);
    setMessageHistory([...messageHistory, { ...response }]);
    setUserInput('');
    onMessage?.(response);

    // Speak the message
    speakMessage(response.text);
  };

  const speakMessage = async (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'en' ? 'en-US' : lang === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      }
    }
  };

  const handleShowEncouragement = () => {
    const message = getClayEncouragement(lang as any);
    setCurrentMessage(message);
    setMessageHistory([...messageHistory, message]);
    onMessage?.(message);
    speakMessage(message.text);
  };

  const handleShowTip = () => {
    const message = getClayTip(lang as any);
    setCurrentMessage(message);
    setMessageHistory([...messageHistory, message]);
    onMessage?.(message);
    speakMessage(message.text);
  };

  const handleCelebrate = () => {
    const message = getClayACelebration(lang as any);
    setCurrentMessage(message);
    setMessageHistory([...messageHistory, message]);
    onMessage?.(message);
    speakMessage(message.text);
  };

  const positionClasses: Record<string, string> = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-40`}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-amber to-orange-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{EMOTION_EMOJI[currentMessage?.emotion || 'happy']}</span>
                <h3 className="font-bold text-white">Clay AI</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messageHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-2"
                >
                  <span className="text-lg flex-shrink-0">{EMOTION_EMOJI[msg.emotion]}</span>
                  <div className="bg-white border border-slate-200 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-brand-charcoal">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 border-t border-slate-200 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={handleShowEncouragement}
                  className="flex-1 px-3 py-2 bg-brand-amber/10 hover:bg-brand-amber/20 text-brand-amber rounded-lg text-xs font-semibold transition-colors"
                  title="Get encouragement"
                >
                  💪 Encourage
                </button>
                <button
                  onClick={handleShowTip}
                  className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-semibold transition-colors"
                  title="Get a tip"
                >
                  💡 Tip
                </button>
                <button
                  onClick={handleCelebrate}
                  className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-semibold transition-colors"
                  title="Celebrate"
                >
                  🎉 Celebrate
                </button>
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask Clay anything..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-amber"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-lg transition-colors"
                  disabled={!userInput.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Speak Button */}
              <button
                onClick={() => currentMessage && speakMessage(currentMessage.text)}
                disabled={isSpeaking}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-300 text-brand-charcoal rounded-lg text-sm font-semibold transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                {isSpeaking ? 'Speaking...' : 'Speak'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-br from-brand-amber to-orange-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow group"
            title="Talk to Clay"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-2xl"
            >
              🤖
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute w-16 h-16 border-2 border-brand-amber rounded-full"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClayTalkingPersonality;
