import React, { useState } from 'react';
import { Lightbulb, Volume2, ChevronDown, Award, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import clayAvatarImg from '../assets/images/clay_avatar_portrait_1788758773504.jpg';

interface ClayMentorSidebarProps {
  onOpenTTS?: () => void;
}

export default function ClayMentorSidebar({ onOpenTTS }: ClayMentorSidebarProps) {
  const { lang } = useLanguage();
  const [speechRate, setSpeechRate] = useState<'0.75' | '1.0' | '1.25'>('1.0');
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const quoteEnglish = "Notice how the machine didn't need a math degree? It just learned from examples! That's the exact secret behind Neural Networks.";
  
  const regionalTranscripts: Record<string, string> = {
    hi: "देखा आपने? मशीन को किसी मैथ्स की डिग्री की जरूरत नहीं पड़ी! इसने सिर्फ आमों के नमूनों से सीखा। यही न्यूरल नेटवर्क्स (Neural Networks) का असली राज़ है।",
    ur: "Dekha aapne? Machine ko kisi math ki degree ki zaroorat nahi padi! Isne sirf aamo ke namoono se seekha. Yahi Neural Networks ka asli raaz hai.",
    te: "చూశారా? మెషీన్‌కి ఎలాంటి గణిత డిగ్రీ అవసరం రాలేదు! ఇది కేవలం ఉదాహరణల నుంచే నేర్చుకుంది. న్యూరల్ నెట్‌వర్క్స్ (Neural Networks) వెనుక ఉన్న అసలు రహస్యం ఇదే.",
    en: quoteEnglish
  };

  const speakQuote = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = lang === 'hi' || lang === 'te' || lang === 'ur' || lang === 'hyd'
      ? (regionalTranscripts[lang] || quoteEnglish)
      : quoteEnglish;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = parseFloat(speechRate);
    utterance.pitch = 1.1; // Warm, friendly pitch

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-4 text-left">
      {/* 1. Main Clay Dost Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE7DC] shadow-xs flex flex-col items-center text-center relative overflow-hidden">
        {/* Animated Green Audio Equalizer Bars above head */}
        <div className="flex items-end justify-center gap-1 h-5 mb-2">
          <span className={`w-1 bg-[#10B981] rounded-full transition-all duration-300 ${isPlaying ? 'h-5 animate-pulse' : 'h-2.5'}`} />
          <span className={`w-1 bg-[#10B981] rounded-full transition-all duration-300 ${isPlaying ? 'h-4 animate-pulse delay-75' : 'h-4'}`} />
          <span className={`w-1 bg-[#10B981] rounded-full transition-all duration-300 ${isPlaying ? 'h-3 animate-pulse delay-150' : 'h-3'}`} />
        </div>

        {/* Circular Avatar Portrait with Clay Frame */}
        <div className="relative group cursor-pointer" onClick={speakQuote} title="Click to hear Clay speak!">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-b from-[#EFE7DC] to-[#FCDCC9] shadow-sm overflow-hidden flex items-center justify-center">
            <img
              src={clayAvatarImg}
              alt="Clay - Your AI Dost"
              className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Quick Play Audio Button Overlay on Hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              speakQuote();
            }}
            className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#A8481F] text-white flex items-center justify-center shadow-md hover:bg-[#8F3C18] transition-transform active:scale-90 cursor-pointer"
            aria-label={isPlaying ? 'Pause speech' : 'Listen to Clay'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ms-0.5" />}
          </button>
        </div>

        {/* Clay Badge */}
        <div className="mt-3 inline-flex items-center px-4 py-1 rounded-full bg-[#8C3A16] text-white text-xs font-bold shadow-2xs">
          Clay • Your AI Dost
        </div>

        {/* Speech Bubble Quote */}
        <div className="bg-[#FDFBF7] border border-[#EFE7DC] rounded-2xl p-4 my-4 text-left w-full text-sm text-[#2D231E] leading-relaxed relative">
          <p className="text-[13px] text-[#2D231E] leading-relaxed">
            "Notice how the machine didn't need a math degree? It just learned from examples! That's the exact secret behind{' '}
            <strong className="font-bold text-[#1E1E1E]">Neural Networks</strong>."
          </p>
        </div>

        {/* Jargon Buster Box */}
        <div className="bg-[#E8F5E9]/70 border border-[#C8E6C9] rounded-xl p-3.5 text-left w-full mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] uppercase tracking-wider mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>JARGON BUSTER</span>
          </div>
          <p className="text-xs text-[#2E7D32]/90 leading-normal">
            <strong className="font-bold text-[#1B5E20]">"Training Data"</strong> = The sweet mangoes you feed the algorithm so it can spot patterns.
          </p>
        </div>

        {/* Speech Rate Controls */}
        <div className="w-full flex items-center justify-between pt-1 border-t border-[#EFE7DC] text-xs">
          <button
            onClick={speakQuote}
            className="flex items-center gap-1.5 font-semibold text-[#616161] hover:text-[#A8481F] transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#A8481F]" />
            <span>Speech Rate</span>
          </button>

          <div className="flex items-center gap-1">
            {(['0.75', '1.0', '1.25'] as const).map((rate) => (
              <button
                key={rate}
                onClick={() => {
                  setSpeechRate(rate);
                  if (isPlaying) speakQuote();
                }}
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  speechRate === rate
                    ? 'bg-[#A8481F] text-white'
                    : 'bg-[#FAF7F2] text-[#757575] hover:bg-[#EFE7DC]'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Regional Transcript Accordion */}
        <div className="w-full mt-3">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F5F0E6] text-xs font-medium text-[#616161] border border-[#EFE7DC] transition-colors cursor-pointer"
          >
            <span>📖 View Regional Transcript</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showTranscript ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE7DC] text-xs text-[#616161] space-y-2 text-left">
                  <div>
                    <span className="font-bold text-[#A8481F] block text-[10px] uppercase font-mono">हिन्दी / Urdu:</span>
                    <p className="mt-0.5">{regionalTranscripts.hi}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#A8481F] block text-[10px] uppercase font-mono">తెలుగు:</span>
                    <p className="mt-0.5">{regionalTranscripts.te}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Module Reward Banner */}
      <div className="bg-[#FFF5EE] border border-[#FAD9C3] rounded-2xl p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8C3A16] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8481F]">
              Module Reward
            </span>
            <span className="font-bold text-sm text-[#1E1E1E]">
              Clay Apprentice Badge
            </span>
          </div>
        </div>

        <span className="text-xs font-mono font-black text-[#C1622D] bg-[#FFE0B2] border border-[#FFCC80] px-2.5 py-1 rounded-full">
          +50 XP
        </span>
      </div>
    </div>
  );
}
