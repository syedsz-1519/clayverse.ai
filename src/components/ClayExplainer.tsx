import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Volume2, Mic, MicOff } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import CopyCodeButton from './CopyCodeButton';

export default function ClayExplainer() {
  const { lang, t } = useLanguage();
  const [activeShot, setActiveShot] = useState<number>(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listenError, setListenError] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

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
      title: lang === 'en' ? 'Shot 1: Meet Clay' : 'Scene 1: Clay se Milo',
      caption: lang === 'en' 
        ? 'AI means machines that learn from patterns — not magic, just clever training.' 
        : 'AI ka matlab aisi machines jo patterns se seekhte hain - koi jaadu nahi, khali dhang ki training hai.',
      expression: 'happy',
      clayAction: 'waving',
      bubbleText: lang === 'en'
        ? "Hello there! I'm Clay, your friendly guide. Tap the steps below to see how I explain AI!"
        : "Sallam waalaikum yaaron! Main hoon Clay, aap ka dost aur guide. Neeche diye so steps dabaake dekho main AI kaise samjhata hoon!"
    },
    {
      id: 1,
      title: lang === 'en' ? 'Shot 2: What is AI?' : 'Scene 2: AI Kya Hai?',
      caption: lang === 'en'
        ? 'Instead of following rigid hand-written rules, AI looks at examples to learn.'
        : 'Sookhe haath se likhe so rules ke bajaye, AI khud examples dekh ke seekh leta hai.',
      expression: 'curious',
      clayAction: 'pointing',
      bubbleText: lang === 'en'
        ? "Think of me as a little kid. If you show me thousands of leaf pictures, my brain figures out the pattern by itself!"
        : "Hadd hai yaaron, mujhe ek chota bacha samjho. Agar tum mujhe hazaaro patton ki photo dikhaye toh dimaag pattern khud samajh jata!"
    },
    {
      id: 3,
      title: lang === 'en' ? 'Shot 3: Everyday Use' : 'Scene 3: Roz ka Istemaal',
      caption: lang === 'en'
        ? 'Recommendations, voice assistants, spam filters, and digital maps.'
        : 'Recommendations, voice assistants, spam filters, aur digital maps.',
      expression: 'excited',
      clayAction: 'holding',
      bubbleText: lang === 'en'
        ? "You already use pattern-matching daily when Netflix recommends a movie, or Google Maps routes your car!"
        : "Arey miya, tum toh pehle se roz pattern matching use karre jab Netflix film bolta ya Google Maps sahi rasta batata!"
    },
    {
      id: 4,
      title: lang === 'en' ? 'Shot 4: Family Tree' : 'Scene 4: Family Tree',
      caption: lang === 'en'
        ? 'AI is the broad umbrella. ML and Deep Learning sit nested inside it.'
        : 'AI sabse bada umbrella hai. Machine Learning aur Deep Learning iske andar rehte.',
      expression: 'thinking',
      clayAction: 'explaining',
      bubbleText: lang === 'en'
        ? "We are all nested together. Machine Learning lives inside AI, and Generative AI sits at the very heart of the tree!"
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
    <div className="max-w-5xl mx-auto px-6 py-12" id="clay-explainer">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono bg-brand-amber/10 px-3 py-1 rounded-full">
          {lang === 'en' ? "Featured Storyboard" : "Khaas Storyboard"}
        </span>
        <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mt-3 mb-4">
          {lang === 'en' ? "Meet Clay: Your AI Explainer Host" : "Clay se Milo: Aapka AI Explainer Guide"}
        </h2>
        <p className="font-sans text-brand-muted">
          {lang === 'en' 
            ? "Based on our custom stop-motion turnaround reference, interact with Clay to hear and see his visual explanations."
            : "Hamare stop-motion model ke mutabiq, Clay ke upar tap karo uski pyaari awaaz aur explanation sunne ke liye!"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Interactive Storyboard Controller (Left side, Bento style) */}
        <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-3">
            {storyShots.map((shot, index) => (
              <button
                key={shot.id}
                onClick={() => handleShotChange(index)}
                className={`p-4 text-left rounded-2xl transition-all border font-display text-sm font-bold cursor-pointer select-none flex items-start gap-3 ${activeShot === index ? 'bg-brand-amber text-white border-brand-amber shadow-md' : 'bg-white hover:bg-brand-sand border-brand-slate/10 text-brand-charcoal'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0 ${activeShot === index ? 'bg-white text-brand-amber' : 'bg-brand-sand text-brand-slate'}`}>
                  {index + 1}
                </div>
                <div>
                  <span className="block font-display text-sm font-bold">{shot.title}</span>
                  <span className={`block text-xs font-normal mt-0.5 leading-snug ${activeShot === index ? 'text-white/80' : 'text-brand-muted'}`}>
                    {shot.caption}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-brand-sand/40 border border-brand-slate/5 text-xs text-brand-muted leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
            <span>
              {lang === 'en'
                ? "This interactive showcase implements the tactile animation script designed for stop-motion video generation."
                : "Ye interactive show stop-motion video banane ke liye banaya gaya dhang ka animation script use karta hai."
              }
            </span>
          </div>
        </div>

        {/* Tactile Clay Simulation Window (Right side, Bento centerpiece) */}
        <div className="lg:col-span-8 skeuo-raised bg-[#F5F2ED] p-8 flex flex-col justify-between min-h-[480px] relative overflow-hidden">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Interactive Speech Bubble (Glassmorphic) */}
          <div className="relative z-10 mb-6 self-start w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeShot}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-5 rounded-2xl text-brand-charcoal text-sm leading-relaxed border-brand-amber/15 relative shadow-sm flex items-start justify-between gap-4"
              >
                {/* Speech Bubble Arrow */}
                <div className="absolute -bottom-2 left-24 w-4 h-4 bg-white/45 backdrop-blur-md rotate-45 border-r border-b border-brand-amber/10 pointer-events-none" />
                <p className="font-sans font-medium flex-grow text-left">
                  {storyShots[activeShot].bubbleText}
                </p>

                <div className="flex items-center gap-1.5 shrink-0">
                  <CopyCodeButton
                    text={storyShots[activeShot].bubbleText}
                    label={lang === 'en' ? "Copy" : "Copy"}
                    variant="compact"
                    showIconOnly={true}
                    title={lang === 'en' ? "Copy Clay's explanation" : "Clay ki baat copy karo"}
                  />
                  {/* Speaker button to trigger voice reading */}
                  <button
                    onClick={handleSpeakBubble}
                    className={`p-2 rounded-xl transition-all border cursor-pointer flex items-center justify-center ${isPlayingVoice ? 'bg-brand-amber/20 border-brand-amber/30 text-brand-amber animate-pulse' : 'bg-white hover:bg-brand-sand text-brand-slate border-brand-slate/10'}`}
                    title={isPlayingVoice ? 'Pause Speech' : "Listen to Clay's Voice"}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* FULL BODY CLAY ILLUSTRATION ALIGNED WITH TURNAROUND REFERENCE */}
          <div className="flex flex-col items-center justify-center flex-grow mb-2 z-10">
            <div className="relative w-64 h-64 flex flex-col items-center justify-end">
              
              {/* THE ENTIRE CAPSULE CLAY BOT (Terracotta, single piece, hooded) */}
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

                {/* CREAM FACE PLATE */}
                <div className="w-28 h-28 rounded-[2rem] bg-[#F4EFE6] relative flex flex-col items-center justify-center shadow-[inset_-3px_-3px_6px_#ffffff,inset_3px_3px_6px_#c8c3ba,1px_4px_8px_rgba(0,0,0,0.06)] border border-[#E5DFD4] z-10 mt-1">
                  
                  {/* OVAL GLOSSY CLAY EYES */}
                  <div className="flex gap-6 mb-2">
                    {/* Left Eye */}
                    <div className="relative w-4.5 h-6 rounded-full bg-[#2E1810] flex items-start justify-center pt-1 overflow-hidden shadow-inner">
                      {/* Blinking layer */}
                      <motion.div 
                        animate={{ height: isBlinking ? '100%' : '0%' }}
                        className="absolute top-0 left-0 right-0 bg-[#F4EFE6] z-20"
                      />
                      {/* Glossy reflection dots */}
                      <div className="relative w-full h-full">
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-90" />
                        <div className="absolute bottom-1 right-1 w-0.5 h-0.5 rounded-full bg-white opacity-60" />
                      </div>
                    </div>

                    {/* Right Eye */}
                    <div className="relative w-4.5 h-6 rounded-full bg-[#2E1810] flex items-start justify-center pt-1 overflow-hidden shadow-inner">
                      {/* Blinking layer */}
                      <motion.div 
                        animate={{ height: isBlinking ? '100%' : '0%' }}
                        className="absolute top-0 left-0 right-0 bg-[#F4EFE6] z-20"
                      />
                      {/* Glossy reflection dots */}
                      <div className="relative w-full h-full">
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white opacity-90" />
                        <div className="absolute bottom-1 right-1 w-0.5 h-0.5 rounded-full bg-white opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* CUTE SMILING MOUTH - terracotta color as given in image */}
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

              {/* Shadow floor */}
              <div className="w-36 h-2 bg-brand-slate/15 rounded-full filter blur-[1px] absolute -bottom-1 z-0 shadow-inner" />
            </div>

            <div className="text-center mt-3 z-20">
              <span className="font-display text-sm font-extrabold text-brand-charcoal">
                {lang === 'en' ? "Clay the Explainer" : "Clay the Explainer"}
              </span>
              <p className="text-[10px] font-mono text-brand-muted mt-0.5 uppercase tracking-wider">
                {lang === 'en' ? "Terracotta & Cream stop-motion bot" : "Terracotta & Cream stop-motion bot"}
              </p>
            </div>
          </div>

          {/* Bottom Bar Controls */}
          <div className="flex justify-between items-center z-10 border-t border-brand-slate/5 pt-4">
            <span className="text-xs text-brand-muted font-medium">
              {lang === 'en' ? "Active Scene:" : "Abhi ki Scene:"} <span className="text-brand-amber font-bold">{storyShots[activeShot].title}</span>
            </span>
            <button
              onClick={() => handleShotChange((activeShot + 1) % storyShots.length)}
              className="flex items-center gap-1 text-xs font-bold text-brand-amber hover:text-brand-amber-dark transition-colors cursor-pointer"
            >
              <span>{lang === 'en' ? "Next Scene" : "Agli Scene Dekho"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
