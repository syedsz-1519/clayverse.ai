import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  Volume2
} from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import CopyCodeButton from './CopyCodeButton';
import ClayLogo from './ClayLogo';

export default function ClayExplainer() {
  const { lang } = useLanguage();
  const [activeShot, setActiveShot] = useState<number>(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Sync state with SpeechSynthesis
  useEffect(() => {
    const timer = setInterval(() => {
      setIsPlayingVoice(audioEngine.isCurrentlySpeaking());
    }, 500);

    audioEngine.setSpeakStateListener((speaking) => {
      setIsPlayingVoice(speaking);
    });

    return () => clearInterval(timer);
  }, []);

  // Auto-blink animation logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4200);
    return () => clearInterval(blinkInterval);
  }, []);

  const storyShots = [
    {
      id: 0,
      title: lang === 'en' ? 'Shot 1: Meet Clay' : lang === 'te' ? 'సీన్ 1: క్లే పరిచయం' : 'Scene 1: Clay se Milo',
      caption: lang === 'en' 
        ? 'AI means machines that learn from patterns — not magic, just clever training.' 
        : lang === 'te'
        ? 'AI అంటే ప్యాటర్న్స్ నుండి నేర్చుకునే యంత్రాలు — మ్యాజిక్ కాదు, సరైన శిక్షణ మాత్రమే.'
        : 'AI ka matlab aisi machines jo patterns se seekhte hain - koi jaadu nahi, khali dhang ki training hai.',
      expression: 'happy',
      clayAction: 'waving',
      bubbleText: lang === 'en'
        ? "Hello there! I'm Clay, your friendly guide. Tap the steps below to see how I explain AI!"
        : lang === 'te'
        ? "నమస్కారం! నేను క్లేని, మీ స్నేహపూర్వక AI గైడ్. సంక్లిష్టమైన కాన్సెప్టులను దేశీ ఉదాహరణలతో సులభంగా నేర్చుకుందాం!"
        : "Sallam waalaikum yaaron! Main hoon Clay, aap ka dost aur guide. Neeche diye so steps dabaake dekho main AI kaise samjhata hoon!"
    },
    {
      id: 1,
      title: lang === 'en' ? 'Shot 2: What is AI?' : lang === 'te' ? 'సీన్ 2: AI అంటే ఏమిటి?' : 'Scene 2: AI Kya Hai?',
      caption: lang === 'en'
        ? 'Instead of following rigid hand-written rules, AI looks at examples to learn.'
        : lang === 'te'
        ? 'కఠినమైన నియమాల బదులు, AI వేలకొద్దీ ఉదాహరణలను చూసి స్వయంగా నేర్చుకుంటుంది.'
        : 'Sookhe haath se likhe so rules ke bajaye, AI khud examples dekh ke seekh leta hai.',
      expression: 'curious',
      clayAction: 'pointing',
      bubbleText: lang === 'en'
        ? "Think of me as a little kid. If you show me thousands of leaf pictures, my brain figures out the pattern by itself!"
        : lang === 'te'
        ? "నన్ను ఒక చిన్న పిల్లవాడిగా ఊహించండి. వేలకొద్దీ ఆకుల ఫోటోలు చూపిస్తే, మెదడు స్వయంగా ఆకు ప్యాటర్న్‌ను గుర్తిస్తుంది!"
        : "Hadd hai yaaron, mujhe ek chota bacha samjho. Agar tum mujhe hazaaro patton ki photo dikhaye toh dimaag pattern khud samajh jata!"
    },
    {
      id: 3,
      title: lang === 'en' ? 'Shot 3: Everyday Use' : lang === 'te' ? 'సీన్ 3: రోజువారీ ఉపయోగం' : 'Scene 3: Roz ka Istemaal',
      caption: lang === 'en'
        ? 'Recommendations, voice assistants, spam filters, and digital maps.'
        : lang === 'te'
        ? 'యూట్యూబ్ సిఫార్సులు, వాయిస్ అసిస్టెంట్లు, స్పామ్ ఫిల్టర్లు, డిజిటల్ మ్యాప్‌లు.'
        : 'Recommendations, voice assistants, spam filters, aur digital maps.',
      expression: 'excited',
      clayAction: 'holding',
      bubbleText: lang === 'en'
        ? "You already use pattern-matching daily when Netflix recommends a movie, or Google Maps routes your car!"
        : lang === 'te'
        ? "మీరు రోజూ యూట్యూబ్ రికమండేషన్లు లేదా గూగుల్ మ్యాప్స్ ఉపయోగించేటప్పుడు AI ప్యాటర్న్ మ్యాచింగ్ వాడుతున్నారు!"
        : "Arey miya, tum toh pehle se roz pattern matching use karre jab Netflix film bolta ya Google Maps sahi rasta batata!"
    },
    {
      id: 4,
      title: lang === 'en' ? 'Shot 4: Family Tree' : lang === 'te' ? 'సీన్ 4: AI కుటుంబం' : 'Scene 4: Family Tree',
      caption: lang === 'en'
        ? 'AI is the broad umbrella. ML and Deep Learning sit nested inside it.'
        : lang === 'te'
        ? 'AI ఒక పెద్ద గొడుగు లాంటిది. దాని కింద మెషిన్ లెర్నింగ్ మరియు డీప్ లెర్నింగ్ ఉంటాయి.'
        : 'AI sabse bada umbrella hai. Machine Learning aur Deep Learning iske andar rehte.',
      expression: 'thinking',
      clayAction: 'explaining',
      bubbleText: lang === 'en'
        ? "We are all nested together. Machine Learning lives inside AI, and Generative AI sits at the very heart of the tree!"
        : lang === 'te'
        ? "మనమంతా ఒకే కుటుంబం! AI లోపల మెషిన్ లెర్నింగ్ ఉంటుంది, దాని కేంద్రంలో జెనరేటివ్ AI ఉంటుంది!"
        : "Hum sab ek hi khandaan ke hain yaaron. Machine learning AI ke andar rehta, aur Generative AI shor machata bilkul beech mein!"
    }
  ];

  const handleSpeakBubble = () => {
    if (isPlayingVoice) {
      audioEngine.stopSpeaking();
      setIsPlayingVoice(false);
    } else {
      audioEngine.speak(storyShots[activeShot].bubbleText, lang, () => {
        setIsPlayingVoice(false);
      });
      setIsPlayingVoice(true);
    }
  };

  const handleShotChange = (index: number) => {
    setActiveShot(index);
    audioEngine.stopSpeaking();
    setIsPlayingVoice(false);

    if (index === 0) {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1200);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10" id="clay-explainer">
      
      {/* Top Banner */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF0EB] dark:bg-orange-950/40 border border-[#F6D3C5] dark:border-orange-900/50 mb-3 shadow-2xs">
          <ClayLogo size={20} />
          <span className="font-display text-xs font-black tracking-tight text-[#C1622D] dark:text-orange-400 uppercase">
            CLAYVERSE AI • STOP-MOTION EXPLAINER
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#2D231E] dark:text-white tracking-tight">
          {lang === 'te' ? 'క్లే పరిచయం: AI ఎలా పనిచేస్తుంది?' :
           lang === 'ur' || lang === 'hyd' ? 'کلے سے ملیں: AI کیسے کام کرتا ہے؟' :
           lang === 'hi' ? 'क्ले से मिलें: AI कैसे काम करता है?' :
           'Meet Clay: Stop-Motion Explainer'}
        </h2>

        <p className="font-sans text-xs sm:text-sm text-brand-slate dark:text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          {lang === 'te' 
            ? 'సరళమైన పదాలలో, దేశీ ఉదాహరణలతో AI కాన్సెప్టులను నేర్చుకోండి. క్లే వాయిస్ వినడానికి స్పీకర్ బటన్ నొక్కండి!'
            : lang === 'ur' || lang === 'hyd'
            ? 'سیدھی زبان اور دیسی مثالوں سے AI سیکھیں۔ کلے کی آواز سننے کے لیے اسپیکر بٹن دبائیں!'
            : 'Explore AI fundamentals through tactile, stop-motion style storytelling. Tap the scenes or listen to Clay explain each concept!'}
        </p>
      </div>

      {/* Stop-Motion Storyboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Interactive Storyboard Controller (Left Bento) */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-3">
            {storyShots.map((shot, index) => (
              <button
                key={shot.id}
                onClick={() => handleShotChange(index)}
                className={`p-4 text-left rounded-2xl transition-all border font-display text-sm font-bold cursor-pointer select-none flex items-start gap-3 ${
                  activeShot === index
                    ? 'bg-[#C1622D] text-white border-[#C1622D] shadow-md'
                    : 'bg-white dark:bg-zinc-800 hover:bg-[#FAF7F2] border-[#EFE4D6] dark:border-zinc-700 text-[#2D231E] dark:text-zinc-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0 ${activeShot === index ? 'bg-white text-[#C1622D] font-bold' : 'bg-[#FAF7F2] dark:bg-zinc-700 text-brand-slate'}`}>
                  {index + 1}
                </div>
                <div>
                  <span className="block font-display text-sm font-bold">{shot.title}</span>
                  <span className={`block text-xs font-normal mt-0.5 leading-snug ${activeShot === index ? 'text-white/90' : 'text-brand-muted'}`}>
                    {shot.caption}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-zinc-800 border border-[#EFE4D6] dark:border-zinc-700 text-xs text-brand-muted leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#C1622D] shrink-0 mt-0.5" />
            <span>
              {lang === 'en'
                ? 'This interactive showcase implements the tactile animation script designed for stop-motion video generation.'
                : 'ఈ ఇంటరాక్టివ్ షో స్టాప్-మోషన్ వీడియోల రూపకల్పన కోసం రూపొందించబడిన ట్యాక్టైల్ యానిమేషన్ స్క్రిప్ట్‌ను ప్రదర్శిస్తుంది.'}
            </span>
          </div>
        </div>

        {/* Tactile Clay Simulation Window (Right Bento centerpiece) */}
        <div className="lg:col-span-8 bg-[#FAF7F2] dark:bg-zinc-900 border border-[#EFE4D6] dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between min-h-[480px] relative overflow-hidden shadow-xs">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Interactive Speech Bubble */}
          <div className="relative z-10 mb-6 self-start w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeShot}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-800 text-[#2D231E] dark:text-white text-sm leading-relaxed border border-[#EFE4D6] dark:border-zinc-700 relative shadow-sm flex items-start justify-between gap-4"
              >
                {/* Speech Bubble Arrow */}
                <div className="absolute -bottom-2 left-24 w-4 h-4 bg-white dark:bg-zinc-800 rotate-45 border-r border-b border-[#EFE4D6] dark:border-zinc-700 pointer-events-none" />
                <p className="font-sans font-medium flex-grow text-left">
                  {storyShots[activeShot].bubbleText}
                </p>

                <div className="flex items-center gap-1.5 shrink-0">
                  <CopyCodeButton
                    text={storyShots[activeShot].bubbleText}
                    label={lang === 'en' ? 'Copy' : 'కాపీ'}
                    variant="compact"
                    showIconOnly={true}
                    title="Copy Clay's explanation"
                  />
                  {/* Speaker button to trigger voice reading */}
                  <button
                    onClick={handleSpeakBubble}
                    className={`p-2 rounded-xl transition-all border cursor-pointer flex items-center justify-center ${isPlayingVoice ? 'bg-orange-500/20 border-orange-500/30 text-[#C1622D] animate-pulse' : 'bg-[#FAF8F5] dark:bg-zinc-700 hover:bg-[#FDF0EB] text-[#2D231E] dark:text-zinc-200 border-[#EFE4D6] dark:border-zinc-600'}`}
                    title={isPlayingVoice ? 'Pause Speech' : "Listen to Clay's Voice"}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Full Body Clay Illustration */}
          <div className="flex flex-col items-center justify-center flex-grow mb-2 z-10">
            <div className="relative w-64 h-64 flex flex-col items-center justify-end">
              
              {/* Terracotta Capsule Bot */}
              <motion.div 
                animate={{ 
                  y: isPlayingVoice ? [0, -4, 0] : activeShot === 3 ? [0, -3, 0] : [0, -2, 0],
                  scaleY: isPlayingVoice ? [1, 1.02, 0.98, 1] : 1
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: isPlayingVoice ? 1.5 : 4, 
                  ease: 'easeInOut' 
                }}
                className="w-40 h-52 rounded-[4.5rem] bg-[#E07A5F] border border-[#C56338] shadow-[inset_6px_6px_14px_#ff9e85,inset_-6px_-6px_14px_#9c3e23,4px_10px_20px_rgba(0,0,0,0.12)] relative z-10 flex flex-col items-center justify-start pt-5 overflow-visible"
              >
                
                {/* Dark inner hood cavity shadow */}
                <div className="absolute top-4 w-32 h-34 rounded-[2.8rem] bg-[#C55937] opacity-90 shadow-[inset_2px_4px_8px_rgba(0,0,0,0.15)] z-0 pointer-events-none" />

                {/* Cream Face Plate */}
                <div className="w-28 h-28 rounded-[2rem] bg-[#F4EFE6] relative flex flex-col items-center justify-center shadow-[inset_-3px_-3px_6px_#ffffff,inset_3px_3px_6px_#c8c3ba,1px_4px_8px_rgba(0,0,0,0.06)] border border-[#E5DFD4] z-10 mt-1">
                  
                  {/* Oval Glossy Eyes */}
                  <div className="flex gap-6 mb-2">
                    {/* Left Eye */}
                    <div className="relative w-4.5 h-6 rounded-full bg-[#2E1810] flex items-start justify-center pt-1 overflow-hidden shadow-inner">
                      <motion.div 
                        animate={{ height: isBlinking ? '100%' : '0%' }}
                        className="absolute top-0 left-0 right-0 bg-[#F4EFE6] z-20"
                      />
                      <div className="relative w-full h-full">
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-90" />
                        <div className="absolute bottom-1 right-1 w-0.5 h-0.5 rounded-full bg-white opacity-60" />
                      </div>
                    </div>

                    {/* Right Eye */}
                    <div className="relative w-4.5 h-6 rounded-full bg-[#2E1810] flex items-start justify-center pt-1 overflow-hidden shadow-inner">
                      <motion.div 
                        animate={{ height: isBlinking ? '100%' : '0%' }}
                        className="absolute top-0 left-0 right-0 bg-[#F4EFE6] z-20"
                      />
                      <div className="relative w-full h-full">
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-90" />
                        <div className="absolute bottom-1 right-1 w-0.5 h-0.5 rounded-full bg-white opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* Cute Smiling Mouth */}
                  <div className="w-6 h-3 border-b-3 border-[#9A4228] rounded-b-full mt-1.5" />
                  
                </div>

                {/* Left Arm / Waving or Pointing */}
                <motion.div 
                  animate={isWaving || activeShot === 0 ? { rotate: [0, 45, -15, 45, 0] } : activeShot === 1 ? { rotate: 25 } : { rotate: 0 }}
                  transition={{ duration: 1.2 }}
                  className="absolute -left-4 top-24 w-5 h-14 bg-[#E07A5F] origin-top-right shadow-[inset_2px_2px_4px_#ff9e85,inset_-2px_-2px_4px_#9c3e23,2px_2px_4px_rgba(0,0,0,0.08)] border border-[#C56338] z-20"
                  style={{ borderRadius: '12px 6px 12px 12px' }}
                />

                {/* Right Arm */}
                <motion.div 
                  animate={activeShot === 2 ? { rotate: -25, x: -2 } : { rotate: 0, x: 0 }}
                  className="absolute -right-4 top-24 w-5 h-14 bg-[#E07A5F] origin-top-left shadow-[inset_-2px_2px_4px_#ff9e85,inset_2px_-2px_4px_#9c3e23,2px_2px_4px_rgba(0,0,0,0.08)] border border-[#C56338] z-20"
                  style={{ borderRadius: '6px 12px 12px 12px' }}
                />

              </motion.div>

              {/* Floor Shadow */}
              <div className="w-36 h-2 bg-brand-slate/15 rounded-full filter blur-[1px] absolute -bottom-1 z-0 shadow-inner" />
            </div>

            <div className="text-center mt-3 z-20">
              <span className="font-display text-sm font-extrabold text-[#2D231E] dark:text-white">
                Clay the Explainer
              </span>
              <p className="text-[10px] font-mono text-brand-muted mt-0.5 uppercase tracking-wider">
                Terracotta & Cream stop-motion bot
              </p>
            </div>
          </div>

          {/* Bottom Bar Controls */}
          <div className="flex justify-between items-center z-10 border-t border-[#EFE4D6] dark:border-zinc-800 pt-4">
            <span className="text-xs text-brand-muted font-medium">
              Scene: <span className="text-[#C1622D] font-bold">{storyShots[activeShot].title}</span>
            </span>
            <button
              onClick={() => handleShotChange((activeShot + 1) % storyShots.length)}
              className="flex items-center gap-1 text-xs font-bold text-[#C1622D] hover:text-[#A8481F] transition-colors cursor-pointer"
            >
              <span>Next Scene</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
