import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Globe,
  Brain,
  Video,
  Play,
  RotateCcw,
  ExternalLink,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Film,
  Upload,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import {
  ChatMessage,
  GeminiModelType,
  sendGeminiChat,
  transcribeAudioBlob,
  startVeoGeneration,
  checkVeoStatus,
} from '../lib/geminiClient';
import { useAuth } from '../lib/firebase';
import ClayLogo from './ClayLogo';
import CopyCodeButton from './CopyCodeButton';

interface GeminiAssistantHubProps {
  initialTab?: 'chat' | 'veo' | 'voice';
  onClose?: () => void;
}

export default function GeminiAssistantHub({ onClose }: GeminiAssistantHubProps) {
  const { lang } = useLanguage();
  const { user } = useAuth();

  // Assistant Mode Tab
  const [activeTab, setActiveTab] = useState<'chat' | 'veo'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        lang === 'te'
          ? 'నమస్కారం! నేను క్లే, మీ వ్యక్తిగత AI సహాయకుడిని. AI, మెషిన్ లెర్నింగ్, న్యూరల్ నెట్‌వర్క్‌లు లేదా RAG గురించి ఏమైనా అడగండి!'
          : lang === 'hyd'
          ? 'Arey salaam miya! Main hoon Clay, tumhara apna AI dost. AI, Machine Learning, ya RAG ke baare mein jo dil chahe be-jhijhak poocho!'
          : "Hello! I'm Clay, your tactile AI learning companion. Ask me anything about Artificial Intelligence, Machine Learning, Transformers, Prompting, or RAG!",
      timestamp: Date.now(),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-3.5-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [enableHighThinking, setEnableHighThinking] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Audio Recording / Transcription State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Veo Video Generation State
  const [veoPrompt, setVeoPrompt] = useState('Animate the neural connections flowing with glowing pulses of light');
  const [veoAspectRatio, setVeoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [veoImageBase64, setVeoImageBase64] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [veoOperationName, setVeoOperationName] = useState<string | null>(null);
  const [veoVideoUrl, setVeoVideoUrl] = useState<string | null>(null);
  const [veoStatusMessage, setVeoStatusMessage] = useState<string>('');
  const [veoError, setVeoError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingChat]);

  // Audio Recording Controls
  const startRecording = async () => {
    try {
      setChatError(null);
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
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());

        setIsTranscribing(true);
        try {
          const transcript = await transcribeAudioBlob(audioBlob, lang);
          if (transcript.trim()) {
            setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        } catch (err: any) {
          setChatError(err.message || 'Audio transcription failed. Please try again.');
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setChatError('Microphone access was denied or is unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  // Send Chat Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const prompt = inputValue.trim();
    if (!prompt || isLoadingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoadingChat(true);
    setChatError(null);

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
        language: lang,
      });

      const aiMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: response.reply,
        timestamp: Date.now(),
        sources: response.sources,
        modelUsed: response.model,
        thinkingMode: enableHighThinking,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatError(err.message || 'Failed to receive reply from Gemini');
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Veo Video Generation handler
  const handleStartVeo = async () => {
    if (!veoPrompt.trim() && !veoImageBase64) return;
    setIsGeneratingVideo(true);
    setVeoError(null);
    setVeoVideoUrl(null);
    setVeoStatusMessage('Initializing Veo 3.1 video synthesis engine...');

    try {
      const res = await startVeoGeneration({
        prompt: veoPrompt,
        imageBase64: veoImageBase64 ? veoImageBase64.split(',')[1] : undefined,
        aspectRatio: veoAspectRatio,
      });

      setVeoOperationName(res.operationName);
      pollVeoStatus(res.operationName);
    } catch (err: any) {
      console.error('Veo generation error:', err);
      setVeoError(err.message || 'Failed to start Veo video generation');
      setIsGeneratingVideo(false);
    }
  };

  const pollVeoStatus = (operationName: string) => {
    const reassuringMessages = [
      'Synthesizing photorealistic physics and lighting...',
      'Computing neural motion vectors across frames...',
      'Refining temporal continuity and visual coherence...',
      'Assembling final 720p HD MP4 video render...',
    ];
    let step = 0;

    const interval = setInterval(async () => {
      try {
        setVeoStatusMessage(reassuringMessages[step % reassuringMessages.length]);
        step++;

        const status = await checkVeoStatus(operationName);
        if (status.done) {
          clearInterval(interval);
          setIsGeneratingVideo(false);
          if (status.videoBase64) {
            setVeoVideoUrl(status.videoBase64);
            setVeoStatusMessage('Video generated successfully!');
          } else {
            setVeoStatusMessage('Video completed! Processing preview...');
          }
        }
      } catch (err: any) {
        clearInterval(interval);
        setIsGeneratingVideo(false);
        setVeoError(err.message || 'Error occurred while checking video progress.');
      }
    }, 5000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVeoImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] bg-[#FDFBF7] rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-amber/20 text-brand-charcoal">
      {/* Header Bar */}
      <div className="px-5 py-4 bg-white border-b border-brand-slate/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center shadow-xs">
            <ClayLogo size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-brand-charcoal">
                {lang === 'te' ? 'క్లే AI స్టూడియో' : lang === 'hyd' ? 'Clay AI Studio' : 'Clay Gemini Studio'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Online
              </span>
            </div>
            <p className="text-[10px] text-brand-muted font-medium">
              {lang === 'te'
                ? 'Gemini 3.5 & Veo శక్తితో పనిచేస్తుంది'
                : lang === 'hyd'
                ? 'Powered by Gemini 3.5 & Veo 3.1'
                : 'Powered by Gemini 3.5 Flash & Veo 3.1'}
            </p>
          </div>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-brand-sand/50 p-1 rounded-xl border border-brand-slate/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-brand-amber text-white shadow-xs'
                : 'text-brand-charcoal hover:bg-brand-sand'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'చాట్ & వాయిస్' : lang === 'hyd' ? 'AI Baatcheet' : 'Tutor Chat'}</span>
          </button>
          <button
            onClick={() => setActiveTab('veo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'veo'
                ? 'bg-brand-amber text-white shadow-xs'
                : 'text-brand-charcoal hover:bg-brand-sand'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>{lang === 'te' ? 'వీడియో స్టూడియో' : lang === 'hyd' ? 'Veo Video' : 'Veo Animator'}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Area */}
      {activeTab === 'chat' ? (
        <div className="flex flex-col flex-1 min-h-0 bg-[#FAF7F0]/40">
          {/* Controls Bar: Model Switcher & Feature Toggles */}
          <div className="px-4 py-2 bg-white/70 backdrop-blur-xs border-b border-brand-slate/10 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-brand-muted uppercase">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as GeminiModelType)}
                disabled={enableHighThinking}
                className="bg-white border border-brand-slate/15 rounded-lg px-2 py-1 text-xs font-bold text-brand-charcoal outline-none focus:border-brand-amber cursor-pointer disabled:opacity-50"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Balanced)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Complex Tasks)</option>
                <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Fast)</option>
              </select>
            </div>

            {/* Toggles: Search Grounding & High Thinking */}
            <div className="flex items-center gap-2">
              {/* Search Grounding Toggle */}
              <button
                onClick={() => setUseSearchGrounding(!useSearchGrounding)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  useSearchGrounding
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs'
                    : 'bg-white border-brand-slate/15 text-brand-muted hover:border-brand-slate/30'
                }`}
                title="Ground responses with Google Search data"
              >
                <Globe className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-blue-600' : 'text-brand-slate'}`} />
                <span>Google Search</span>
              </button>

              {/* High Thinking Mode Toggle */}
              <button
                onClick={() => setEnableHighThinking(!enableHighThinking)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  enableHighThinking
                    ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-2xs font-extrabold'
                    : 'bg-white border-brand-slate/15 text-brand-muted hover:border-brand-slate/30'
                }`}
                title="Enable deep reasoning (ThinkingLevel.HIGH on 3.1 Pro)"
              >
                <Brain className={`w-3.5 h-3.5 ${enableHighThinking ? 'text-purple-600' : 'text-brand-slate'}`} />
                <span>Thinking Mode</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isUser
                        ? 'bg-brand-amber text-white'
                        : 'bg-white border border-brand-amber/30 text-brand-amber shadow-2xs'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <ClayLogo size={20} />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-brand-amber text-white rounded-tr-xs shadow-xs'
                        : 'bg-white border border-brand-slate/10 text-brand-charcoal rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {/* Header tags for model reply */}
                    {!isUser && (
                      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-brand-slate/5 text-[9px] font-mono text-brand-muted">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-brand-amber">Clay</span>
                          {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                          {msg.thinkingMode && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold">
                              High Thinking
                            </span>
                          )}
                        </div>
                        <CopyCodeButton
                          text={msg.content}
                          label={lang === 'en' ? "Copy" : "Copy"}
                          variant="compact"
                          showIconOnly={true}
                          title={lang === 'en' ? "Copy response" : "Jawab copy karo"}
                        />
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-medium">{msg.content}</div>

                    {/* Grounding web sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-brand-slate/10 text-[10px]">
                        <span className="font-mono font-bold text-brand-amber block mb-1">Web Sources:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.slice(0, 3).map((src, i) => (
                            <a
                              key={i}
                              href={src.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md border border-blue-200 flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span className="max-w-[140px] truncate">{src.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoadingChat && (
              <div className="flex gap-3 mr-auto max-w-[80%]">
                <div className="w-7 h-7 rounded-xl bg-white border border-brand-amber/30 text-brand-amber flex items-center justify-center shrink-0 shadow-2xs">
                  <ClayLogo size={20} />
                </div>
                <div className="p-3.5 bg-white border border-brand-slate/10 rounded-2xl rounded-tl-xs text-xs text-brand-muted flex items-center gap-2 shadow-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-amber" />
                  <span>
                    {enableHighThinking
                      ? 'Thinking deeply through layers and reasoning steps...'
                      : useSearchGrounding
                      ? 'Searching Google and verifying grounded facts...'
                      : 'Clay is writing explanation...'}
                  </span>
                </div>
              </div>
            )}

            {chatError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{chatError}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Audio Transcribing Status Alert */}
          {isTranscribing && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-amber" />
              <span>Transcribing your audio with Gemini 3.5 Flash...</span>
            </div>
          )}

          {/* Quick Prompt Starters */}
          <div className="px-4 py-1.5 bg-white/50 border-t border-brand-slate/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
            <span className="text-brand-muted font-bold shrink-0">Try:</span>
            {[
              'Explain RAG like I am 10',
              'Why do LLMs hallucinate?',
              'Transformer vs CNN architecture',
              'Difference between model & chatbot',
            ].map((starter, i) => (
              <button
                key={i}
                onClick={() => setInputValue(starter)}
                className="px-2.5 py-1 rounded-full bg-brand-sand/60 hover:bg-brand-sand text-brand-charcoal whitespace-nowrap transition-colors cursor-pointer border border-brand-slate/10"
              >
                {starter}
              </button>
            ))}
          </div>

          {/* Input & Microphone Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-brand-slate/10 flex items-center gap-2 shrink-0"
          >
            {/* Microphone Button for Voice Transcription */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center relative ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse shadow-md'
                  : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-charcoal border border-brand-slate/10'
              }`}
              title={isRecording ? `Recording (${recordingSeconds}s) - Click to Stop` : 'Record voice with microphone to transcribe'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 border border-white" />
              )}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isRecording
                  ? `Listening... (${recordingSeconds}s)`
                  : lang === 'te'
                  ? 'AI గురించి ఏదైనా అడగండి...'
                  : lang === 'hyd'
                  ? 'AI ke baare mein kuch bhi poochho...'
                  : 'Ask Clay about any AI topic, math, or concept...'
              }
              disabled={isLoadingChat}
              className="flex-1 bg-brand-sand/30 border border-brand-slate/15 rounded-xl px-3.5 py-2 text-xs font-medium text-brand-charcoal outline-none focus:border-brand-amber placeholder:text-brand-muted"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoadingChat}
              className="p-2.5 rounded-xl bg-brand-amber hover:bg-brand-amber/90 text-white font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Veo Video Animator Studio */
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin bg-[#FAF7F0]/30">
          <div className="bg-white p-4 rounded-2xl border border-brand-slate/10 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-brand-amber" />
                <h4 className="text-xs font-black text-brand-charcoal">Veo 3.1 Video Animator</h4>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-brand-amber/10 text-brand-amber border border-brand-amber/20">
                veo-3.1-fast-generate-preview
              </span>
            </div>
            <p className="text-[11px] text-brand-muted leading-relaxed">
              Upload an AI concept illustration or photo to bring it to life with smooth temporal motion and neural animation.
            </p>

            {/* Image Upload / Drop area */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-brand-muted uppercase mb-1">
                Source Image (Optional)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {veoImageBase64 ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-brand-amber/30 max-h-48 bg-black flex items-center justify-center">
                  <img src={veoImageBase64} alt="Source upload" className="max-h-48 object-contain" />
                  <button
                    onClick={() => setVeoImageBase64(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-brand-slate/20 hover:border-brand-amber/50 bg-brand-sand/20 hover:bg-brand-sand/40 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5"
                >
                  <Upload className="w-5 h-5 text-brand-slate" />
                  <span className="text-xs font-bold text-brand-charcoal">Click or Drag Image to Animate</span>
                  <span className="text-[10px] text-brand-muted">Supports PNG, JPG, WebP</span>
                </button>
              )}
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-brand-muted uppercase mb-1">
                Animation Prompt
              </label>
              <textarea
                value={veoPrompt}
                onChange={(e) => setVeoPrompt(e.target.value)}
                rows={3}
                placeholder="Describe how the visual should animate..."
                className="w-full bg-brand-sand/30 border border-brand-slate/15 rounded-xl p-3 text-xs font-medium text-brand-charcoal outline-none focus:border-brand-amber"
              />
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-brand-muted uppercase">Aspect Ratio:</span>
                <div className="flex gap-1.5">
                  {(['16:9', '9:16'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setVeoAspectRatio(ratio)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        veoAspectRatio === ratio
                          ? 'bg-brand-amber text-white shadow-2xs'
                          : 'bg-brand-sand/50 text-brand-charcoal hover:bg-brand-sand'
                      }`}
                    >
                      {ratio === '16:9' ? '16:9 Landscape' : '9:16 Portrait'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleStartVeo}
                disabled={isGeneratingVideo || (!veoPrompt.trim() && !veoImageBase64)}
                className="px-4 py-2 rounded-xl bg-brand-amber hover:bg-brand-amber/90 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingVideo ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Generate Video</span>
                  </>
                )}
              </button>
            </div>

            {/* Error message */}
            {veoError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{veoError}</span>
              </div>
            )}

            {/* Progress Status Box */}
            {isGeneratingVideo && (
              <div className="p-4 bg-brand-sand/40 border border-brand-amber/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-amber">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-amber" />
                  <span>Veo Video Synthesis in Progress</span>
                </div>
                <p className="text-xs text-brand-charcoal font-medium">{veoStatusMessage}</p>
                <div className="w-full bg-brand-slate/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-amber h-full rounded-full animate-pulse w-3/4" />
                </div>
                <span className="text-[10px] text-brand-muted block">
                  Video generation usually takes 30-60 seconds. You can keep browsing while it renders.
                </span>
              </div>
            )}

            {/* Rendered Video Player */}
            {veoVideoUrl && (
              <div className="mt-4 p-3 bg-brand-sand/30 border border-brand-amber/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-brand-charcoal flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Generated Video Preview</span>
                  </span>
                  <a
                    href={veoVideoUrl}
                    download="simple-ai-veo.mp4"
                    className="text-[10px] font-bold text-brand-amber underline"
                  >
                    Download MP4
                  </a>
                </div>
                <video
                  src={veoVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full rounded-xl shadow-md border border-brand-slate/10"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
