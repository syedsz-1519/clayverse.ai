import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Globe,
  Brain,
  Bot,
  User,
  ExternalLink,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Flame,
  Check
} from 'lucide-react';
import ClayLogo from './ClayLogo';
import CopyCodeButton from './CopyCodeButton';
import { useLanguage } from '../hooks/useLanguage';
import {
  ChatMessage,
  GeminiModelType,
  sendGeminiChat,
  transcribeAudioBlob,
} from '../lib/geminiClient';
import { audioEngine } from '../lib/audioEngine';

interface ClayChatBotProps {
  isOpen?: boolean;
  onClose?: () => void;
  floatingMode?: boolean;
}

export default function ClayChatBot({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  floatingMode = true,
}: ClayChatBotProps) {
  const { lang, t } = useLanguage();
  
  // Local open state if not controlled externally
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-3.5-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [enableHighThinking, setEnableHighThinking] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Speech & Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome greeting based on current language
  const getInitialGreeting = (l: string): string => {
    switch (l) {
      case 'te':
        return 'నమస్కారం! నేను క్లే (Clay), మీ వ్యక్తిగత AI లెర్నింగ్ కంపానియన్. కృత్రిమ మేధస్సు, మెషిన్ లెర్నింగ్, న్యూరల్ నెట్‌వర్క్‌లు లేదా ప్రాంప్టింగ్ గురించి మీ సందేహాలు ఏవైనా ఉంటే నన్ను అడగండి!';
      case 'hyd':
        return 'Arey salaam miya! Main hoon Clay, tumhara apna AI dost. AI, Machine Learning, ya RAG ke baare mein jo dil chahe be-jhijhak poocho!';
      case 'hi':
        return 'नमस्ते! मैं Clay हूँ, आपका दोस्ताना AI ट्यूटर। आर्टिफिशियल इंटेलिजेंस, मशीन लर्निंग, ट्रांसफॉर्मर्स या प्रॉम्प्टिंग के बारे में कुछ भी पूछें!';
      case 'ta':
        return 'வணக்கம்! நான் Clay, உங்கள் AI நண்பன். AI, Machine Learning, அல்லது RAG பற்றி என்ன சந்தேகம் இருந்தாலும் தயங்காமல் கேளுங்கள்!';
      case 'bn':
        return 'নমস্কার! আমি Clay, আপনার বন্ধুত্বপূর্ণ AI টিউটর। AI, মেশিন লার্নিং বা RAG সম্পর্কে যেকোনো প্রশ্ন আমাকে করতে পারেন!';
      case 'ur':
        return 'السلام علیکم! میں Clay ہوں، آپ کا ذاتی AI استاد اور دوست۔ مصنوعی ذہانت، مشین لرننگ، یا پرامپٹنگ کے بارے میں کچھ بھی دریافت کریں۔';
      case 'hinglish':
        return 'Hello ji! Main hoon Clay, aapka friendly AI tutor. AI, Machine Learning, Transformers ya RAG ke baare mein jo bhi doubt ho, aasan bhasha mein poocho!';
      case 'thanglish':
        return 'Vanakkam! Naan Clay, unga personal AI buddy. AI, Machine Learning pathi enna doubt irundhalum simple-ah kettu therinjikonga!';
      default:
        return "Hello! I'm Clay, your tactile AI learning tutor and companion. Ask me anything about Artificial Intelligence, Machine Learning, Transformers, Prompting, or RAG!";
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const cached = localStorage.getItem('clay_chat_history_v2');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'welcome-0',
        role: 'model',
        content: getInitialGreeting(lang),
        timestamp: Date.now(),
        modelUsed: 'gemini-3.5-flash',
      },
    ];
  });

  // Sync welcome message when language changes if only welcome is present
  useEffect(() => {
    if (messages.length === 1 && messages[0].id.startsWith('welcome')) {
      setMessages([
        {
          id: 'welcome-0',
          role: 'model',
          content: getInitialGreeting(lang),
          timestamp: Date.now(),
          modelUsed: 'gemini-3.5-flash',
        },
      ]);
    }
  }, [lang]);

  // Persist messages in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clay_chat_history_v2', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Listen to global open event
  useEffect(() => {
    const handleOpenChat = (e?: any) => {
      setInternalIsOpen(true);
      if (e?.detail?.prompt) {
        setInputValue(e.detail.prompt);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    };

    window.addEventListener('clay_open_chat' as any, handleOpenChat);
    window.addEventListener('clay_open_ai_studio' as any, handleOpenChat);
    return () => {
      window.removeEventListener('clay_open_chat' as any, handleOpenChat);
      window.removeEventListener('clay_open_ai_studio' as any, handleOpenChat);
    };
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Blinking clay eyes effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Voice Speech listener sync
  useEffect(() => {
    const listener = (speaking: boolean) => {
      if (!speaking) {
        setCurrentlySpeakingId(null);
      }
    };
    audioEngine.setSpeakStateListener(listener);
  }, []);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    audioEngine.stopSpeaking();
    setCurrentlySpeakingId(null);
  };

  const handleClearHistory = () => {
    audioEngine.stopSpeaking();
    setCurrentlySpeakingId(null);
    const newWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'model',
      content: getInitialGreeting(lang),
      timestamp: Date.now(),
      modelUsed: selectedModel,
    };
    setMessages([newWelcome]);
    localStorage.removeItem('clay_chat_history_v2');
  };

  // Audio Recording (Voice Input)
  const startVoiceRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        stream.getTracks().forEach((track) => track.stop());

        setIsTranscribing(true);
        try {
          const transcript = await transcribeAudioBlob(audioBlob, lang as any);
          if (transcript.trim()) {
            setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        } catch (err: any) {
          setError(err.message || 'Voice transcription failed. Please try again.');
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setError('Microphone permission was denied or is unavailable.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Text-To-Speech for Clay
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (currentlySpeakingId === msgId) {
      audioEngine.stopSpeaking();
      setCurrentlySpeakingId(null);
    } else {
      audioEngine.stopSpeaking();
      setCurrentlySpeakingId(msgId);
      audioEngine.speak(text, lang as any, () => {
        setCurrentlySpeakingId(null);
      });
    }
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customPrompt || inputValue.trim();
    if (!promptToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    const historyForApi = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await sendGeminiChat({
        messages: historyForApi,
        model: enableHighThinking ? 'gemini-3.1-pro-preview' : selectedModel,
        useSearch: useSearchGrounding,
        thinking: enableHighThinking,
        language: lang as any,
      });

      const aiMsg: ChatMessage = {
        id: `clay-${Date.now()}`,
        role: 'model',
        content: response.reply,
        thought: response.thought,
        timestamp: Date.now(),
        sources: response.sources,
        modelUsed: response.model,
        thinkingMode: enableHighThinking,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Clay chat error:', err);
      setError(err.message || 'Clay could not connect to Gemini right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    { text: 'Explain RAG simply', desc: 'Zero Math explanation' },
    { text: 'Why do LLMs hallucinate?', desc: 'Pattern vs Memory' },
    { text: 'Transformer vs CNN', desc: 'Architecture differences' },
    { text: 'How do Neural Networks learn?', desc: 'Weights & feedback' },
  ];

  return (
    <>
      {/* Floating Trigger Bubble Button (Bottom Right) */}
      {floatingMode && !isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-40 flex items-center"
        >
          <button
            id="clay-floating-chat-trigger"
            onClick={() => {
              setInternalIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 150);
            }}
            className="group relative flex items-center gap-3 px-4 py-3 bg-[#E07A5F] hover:bg-[#D46B50] text-white rounded-full shadow-[0_10px_25px_-5px_rgba(224,122,95,0.5),0_8px_10px_-6px_rgba(224,122,95,0.3)] border-2 border-white/40 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            title="Chat with Clay - Your Gemini AI Tutor"
          >
            {/* Clay mini avatar */}
            <div className="relative w-8 h-8 rounded-full bg-[#F4EFE6] border border-[#E5DFD4] flex items-center justify-center shadow-inner overflow-hidden shrink-0">
              <ClayLogo size={24} />
              {/* Online indicator ping */}
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-tight leading-tight flex items-center gap-1.5 font-display">
                <span>Chat with Clay</span>
                <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200/50 animate-pulse" />
              </span>
              <span className="text-[9.5px] font-mono text-white/85 font-medium leading-none mt-0.5">
                Gemini AI Tutor
              </span>
            </div>
          </button>
        </motion.div>
      )}

      {/* Main Chatbot Window Modal / Dock */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 md:p-6 overflow-hidden pointer-events-none">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm pointer-events-auto"
            />

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
              className={`relative pointer-events-auto bg-[#FAF7F0] border-2 border-brand-amber/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-brand-charcoal transition-all duration-300 w-full ${
                isExpanded
                  ? 'max-w-4xl h-[92vh]'
                  : 'max-w-xl h-[86vh] sm:h-[680px]'
              }`}
            >
              {/* Header Bar */}
              <div className="px-4 sm:px-5 py-3.5 bg-white border-b border-brand-slate/10 flex items-center justify-between shrink-0 select-none">
                {/* Left: Avatar & Identity */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E07A5F]/15 border border-[#E07A5F]/30 flex items-center justify-center relative shadow-xs">
                    <ClayLogo size={30} />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-2xs" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-sm font-black text-brand-charcoal tracking-tight">
                        Clay <span className="text-brand-amber font-extrabold">• Gemini Chatbot</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Live
                      </span>
                    </div>
                    <p className="text-[10.5px] text-brand-muted font-medium">
                      Friendly Tactile AI Tutor • Zero Math & Zero Jargon
                    </p>
                  </div>
                </div>

                {/* Right: Controls (Model selector, Expand, Clear, Close) */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClearHistory}
                    className="p-2 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60 rounded-xl transition-colors cursor-pointer"
                    title="Clear conversation history"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden sm:flex p-2 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60 rounded-xl transition-colors cursor-pointer"
                    title={isExpanded ? 'Collapse window' : 'Expand window'}
                  >
                    {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleClose}
                    className="p-2 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/60 rounded-xl transition-colors cursor-pointer"
                    title="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-Header Toolbar (Model switcher, Grounding & Thinking Toggles) */}
              <div className="px-4 py-2 bg-white/75 backdrop-blur-xs border-b border-brand-slate/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
                {/* Model Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-brand-muted uppercase">Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as GeminiModelType)}
                    disabled={enableHighThinking}
                    className="bg-brand-sand/30 border border-brand-slate/20 rounded-lg px-2.5 py-1 text-xs font-bold text-brand-charcoal outline-none focus:border-brand-amber cursor-pointer disabled:opacity-50"
                  >
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash (Fast & Smart)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep Knowledge)</option>
                    <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Ultra Light)</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-2">
                  {/* Search Grounding */}
                  <button
                    type="button"
                    onClick={() => setUseSearchGrounding(!useSearchGrounding)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      useSearchGrounding
                        ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs font-extrabold'
                        : 'bg-white border-brand-slate/15 text-brand-muted hover:border-brand-slate/30'
                    }`}
                    title="Ground replies with Google Search data"
                  >
                    <Globe className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-blue-600' : 'text-brand-slate'}`} />
                    <span>Search Grounding</span>
                  </button>

                  {/* High Thinking Mode */}
                  <button
                    type="button"
                    onClick={() => setEnableHighThinking(!enableHighThinking)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      enableHighThinking
                        ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-2xs font-extrabold'
                        : 'bg-white border-brand-slate/15 text-brand-muted hover:border-brand-slate/30'
                    }`}
                    title="Enable high thinking budget with Gemini 3.1 Pro"
                  >
                    <Brain className={`w-3.5 h-3.5 ${enableHighThinking ? 'text-purple-600' : 'text-brand-slate'}`} />
                    <span>High Thinking</span>
                  </button>
                </div>
              </div>

              {/* Chat Thread Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const isSpeaking = currentlySpeakingId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[88%] ${
                        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isUser
                            ? 'bg-brand-amber text-white shadow-xs'
                            : 'bg-white border border-brand-amber/30 text-brand-amber shadow-2xs'
                        }`}
                      >
                        {isUser ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <div className="relative">
                            <ClayLogo size={22} />
                          </div>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-brand-amber text-white rounded-tr-xs shadow-xs'
                            : 'bg-white border border-brand-slate/10 text-brand-charcoal rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {/* Header bar for Model Response */}
                        {!isUser && (
                          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-brand-slate/5 text-[10px] font-mono text-brand-muted">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-brand-amber">Clay</span>
                              {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                              {msg.thinkingMode && (
                                <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                                  High Thinking
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Audio Listen Button */}
                              <button
                                onClick={() => handleToggleSpeak(msg.id, msg.content)}
                                className={`p-1 rounded-md transition-colors cursor-pointer ${
                                  isSpeaking
                                    ? 'bg-brand-amber text-white animate-pulse'
                                    : 'text-brand-slate hover:bg-brand-sand hover:text-brand-charcoal'
                                }`}
                                title={isSpeaking ? 'Stop voice' : "Listen to Clay's voice"}
                              >
                                {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                              </button>

                              {/* Copy response */}
                              <CopyCodeButton
                                text={msg.content}
                                label={lang === 'en' ? "Copy" : "Copy"}
                                variant="compact"
                                showIconOnly={true}
                                title="Copy Clay's response"
                              />
                            </div>
                          </div>
                        )}

                        {/* Thought process disclosure (if model reasoning occurred) */}
                        {msg.thought && (
                          <div className="mb-2 p-2.5 rounded-xl bg-purple-50/60 border border-purple-200/60 text-[11px] text-purple-900">
                            <button
                              onClick={() =>
                                setExpandedThoughtId(
                                  expandedThoughtId === msg.id ? null : msg.id
                                )
                              }
                              className="flex items-center justify-between w-full font-mono font-bold cursor-pointer text-[10px] text-purple-700"
                            >
                              <span className="flex items-center gap-1.5">
                                <Brain className="w-3 h-3 text-purple-600" />
                                <span>Reasoning Thought Process</span>
                              </span>
                              {expandedThoughtId === msg.id ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                            {expandedThoughtId === msg.id && (
                              <div className="mt-2 pt-2 border-t border-purple-200/60 font-mono text-[10px] text-purple-800 whitespace-pre-wrap leading-relaxed">
                                {msg.thought}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Content text */}
                        <div className="whitespace-pre-wrap font-medium font-sans text-xs leading-relaxed">
                          {msg.content}
                        </div>

                        {/* Grounding Web Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-brand-slate/10 text-[10px]">
                            <span className="font-mono font-bold text-brand-amber block mb-1.5">
                              Google Search Sources:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.sources.slice(0, 4).map((src, i) => (
                                <a
                                  key={i}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md border border-blue-200 flex items-center gap-1 transition-colors"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  <span className="max-w-[150px] truncate">{src.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3 mr-auto max-w-[85%]">
                    <div className="w-8 h-8 rounded-xl bg-white border border-brand-amber/30 text-brand-amber flex items-center justify-center shrink-0 shadow-2xs">
                      <ClayLogo size={22} />
                    </div>
                    <div className="p-4 bg-white border border-brand-slate/10 rounded-2xl rounded-tl-xs text-xs text-brand-charcoal flex items-center gap-2.5 shadow-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-amber" />
                      <span className="font-medium text-brand-muted">
                        {enableHighThinking
                          ? 'Thinking deeply through reasoning steps...'
                          : useSearchGrounding
                          ? 'Searching Google & verifying facts...'
                          : 'Clay is writing explanation...'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Transcribing Voice Banner */}
              {isTranscribing && (
                <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-amber" />
                  <span>Transcribing speech with Gemini 3.5 Flash...</span>
                </div>
              )}

              {/* Starter Prompt Chips */}
              <div className="px-4 py-2 bg-white/60 border-t border-brand-slate/10 flex items-center gap-2 overflow-x-auto scrollbar-none text-[10px]">
                <span className="text-brand-muted font-bold font-mono uppercase shrink-0">Ask:</span>
                {samplePrompts.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(undefined, starter.text)}
                    className="px-2.5 py-1 rounded-full bg-brand-sand/70 hover:bg-brand-sand text-brand-charcoal whitespace-nowrap transition-all cursor-pointer border border-brand-slate/15 hover:border-brand-amber/40 shadow-2xs active:scale-95"
                  >
                    {starter.text}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => handleSendMessage(e)}
                className="p-3 bg-white border-t border-brand-slate/10 flex items-center gap-2 shrink-0"
              >
                {/* Voice Microphone Input */}
                <button
                  type="button"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center relative ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse shadow-md'
                      : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-charcoal border border-brand-slate/10'
                  }`}
                  title={
                    isRecording
                      ? `Recording (${recordingSeconds}s) - Click to Stop & Transcribe`
                      : 'Record voice to transcribe with Gemini'
                  }
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 border border-white" />
                  )}
                </button>

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isRecording
                      ? `Listening to your voice... (${recordingSeconds}s)`
                      : lang === 'te'
                      ? 'క్లేతో మాట్లాడండి లేదా AI గురించి అడగండి...'
                      : lang === 'hyd'
                      ? 'Clay se poocho, jo dil chahe...'
                      : 'Ask Clay about any AI topic, math, code, or concept...'
                  }
                  disabled={isLoading}
                  className="flex-1 bg-brand-sand/30 border border-brand-slate/15 rounded-xl px-3.5 py-2 text-xs font-medium text-brand-charcoal outline-none focus:border-brand-amber placeholder:text-brand-muted"
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D46B50] text-white font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95"
                  title="Send message to Clay"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
