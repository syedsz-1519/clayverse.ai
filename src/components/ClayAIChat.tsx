import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Mic,
  Loader,
  MessageCircle,
  AlertCircle,
  Zap,
  Volume2,
} from 'lucide-react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import { askClay, getClayTopics, getConversationTips } from '../lib/clayAIAssistant';
import { synthesizeSpeech, TTSConfig } from '../lib/ttsEngine';
import ClayVoiceHub from './ClayVoiceHub';

interface Message {
  type: 'user' | 'clay';
  content: string;
  timestamp: Date;
}

export default function ClayAIChat() {
  const { lang, t } = useLanguageMultilingual();
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'clay',
      content: 'Namaste! I am Clay, your AI learning assistant. Ask me anything about AI, Machine Learning, Deep Learning, or the history of computers. I am always here to help! 🤖',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (question: string = input) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage: Message = {
      type: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowTips(false);

    try {
      // Get answer from Clay
      const response = await askClay({
        question,
        language: lang,
      });

      // Construct Clay's response
      const clayResponse = `${response.answer}\n\n📚 ${response.explanation}\n\n💡 Examples:\n${response.examples.map((ex) => `• ${ex}`).join('\n')}\n\n🔗 Related: ${response.relatedTopics.join(', ')}`;

      const clayMessage: Message = {
        type: 'clay',
        content: clayResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, clayMessage]);

      // Optional: Speak answer automatically
      if (response.audioReady) {
        const config: TTSConfig = {
          provider: 'webSpeech',
          language: lang,
          voiceGender: 'female',
          speechRate: 1,
          volume: 0.8,
        };

        try {
          await synthesizeSpeech(response.answer, config);
        } catch (error) {
          console.error('TTS error:', error);
        }
      }
    } catch (error) {
      console.error('Error getting response:', error);

      const errorMessage: Message = {
        type: 'clay',
        content: 'I apologize, but I encountered an issue. Please try asking again with a different question. 😊',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in your browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = lang === 'en' ? 'en-US' : `${lang}-IN`;
    setIsMicActive(true);

    recognition.onstart = () => {
      console.log('🎤 Listening...');
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsMicActive(false);
    };

    recognition.onend = () => {
      setIsMicActive(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 h-screen md:h-[600px] bg-white border-l border-brand-slate/10 flex flex-col shadow-2xl z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-amber to-amber-600 text-white p-4 rounded-t-lg md:rounded-tl-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Clay AI Assistant</h3>
            <p className="text-xs opacity-90">Like Friday from Iron Man 🤖</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-sand/5">
        <AnimatePresence mode="wait">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg text-sm ${
                  msg.type === 'user'
                    ? 'bg-brand-amber text-white rounded-br-none'
                    : 'bg-white border border-brand-slate/10 text-brand-charcoal rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Speak Button for Clay Messages */}
                {msg.type === 'clay' && (
                  <button
                    onClick={() => {
                      const answer = msg.content.split('\n')[0]; // Just the main answer
                      const config: TTSConfig = {
                        provider: 'webSpeech',
                        language: lang,
                        voiceGender: 'female',
                        speechRate: 1,
                        volume: 0.8,
                      };
                      synthesizeSpeech(answer, config);
                    }}
                    className="mt-2 text-xs opacity-75 hover:opacity-100 flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    Hear
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-brand-slate/10 text-brand-charcoal rounded-lg rounded-bl-none p-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Loader className="w-4 h-4 text-brand-amber" />
                  </motion.div>
                  <span className="text-sm">Clay is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        {showTips && messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand-amber/10 border border-brand-amber/20 rounded-lg p-3"
          >
            <p className="text-xs font-bold text-brand-amber mb-2">💡 Try asking Clay about:</p>
            <div className="space-y-1">
              {getConversationTips().slice(0, 3).map((tip, idx) => (
                <p key={idx} className="text-xs text-brand-slate cursor-pointer hover:text-brand-amber">
                  • {tip}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-brand-slate/10 p-3 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask Clay anything about AI..."
            className="flex-1 px-3 py-2 border border-brand-slate/10 rounded-lg text-sm focus:outline-none focus:border-brand-amber"
            disabled={isLoading}
          />

          <motion.button
            onClick={handleVoiceInput}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-all ${
              isMicActive
                ? 'bg-red-500 text-white'
                : 'bg-brand-slate/10 text-brand-slate hover:bg-brand-slate/20'
            }`}
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={() => handleSubmit()}
            disabled={isLoading || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-brand-amber text-white hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-2">
            {['What is AI?', 'How does ML work?', 'Tell me about GPT', 'History of AI?'].map((q) => (
              <button
                key={q}
                onClick={() => handleSubmit(q)}
                className="text-xs px-2 py-1 rounded border border-brand-amber/30 text-brand-amber hover:bg-brand-amber/10 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Character Count */}
      <div className="text-xs text-brand-muted px-3 pb-2">
        {input.length > 0 && `${input.length} characters`}
      </div>
    </div>
  );
}
