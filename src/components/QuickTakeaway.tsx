import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  Zap, 
  Compass, 
  Layers, 
  Target, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';

export interface TakeawayData {
  sectionId: string;
  badgeEn: string;
  badgeHyd: string;
  titleEn: string;
  titleHyd: string;
  tldrEn: string;
  tldrHyd: string;
  keyPointsEn: string[];
  keyPointsHyd: string[];
  mentalModelEn: string;
  mentalModelHyd: string;
  nextUpEn?: string;
  nextUpHyd?: string;
}

export const TAKEAWAYS_DATA: Record<string, TakeawayData> = {
  'what-is-ai': {
    sectionId: 'what-is-ai',
    badgeEn: 'Quick Takeaway • Lesson 01',
    badgeHyd: 'Sabaq Khulasa • Hissa 01',
    titleEn: 'Foundations of AI in 30 Seconds',
    titleHyd: 'AI ki Buniyaad: 30 Seconds Mein',
    tldrEn: 'AI is not conscious magic—it is high-speed pattern recognition trained on massive data to predict outcomes or generate helpful content.',
    tldrHyd: 'AI koi jaadu ya zinda dimaag nahi hai—ye data me patterns dhoond kar faislay aur naye jawab nikaalne ka computerized nizaam hai.',
    keyPointsEn: [
      'Traditional code relies on fixed manual rules; Machine Learning automatically learns rules by studying examples.',
      'Daily AI surrounds you: spam filters, face recognition, map navigation routing, and predictive auto-complete.',
      'Today\'s systems are Narrow AI (specialized for single tasks), rather than self-aware General AI (AGI).'
    ],
    keyPointsHyd: [
      'Aam coding me insan ko har rule khud likhna padta hai; ML data dekh kar khud ba khud patterns seekh leti hai.',
      'Rozmarra ki AI: Spam filters, Face ID unlock, Google Maps raste, aur typing auto-complete.',
      'Aaj ki AI "Narrow AI" hai jo sirf makhsoos kaam karti hai, koi azaad sochne wala AGI dimaag nahi.'
    ],
    mentalModelEn: 'Data In → Pattern Extracted → Prediction Out.',
    mentalModelHyd: 'Data Daalo → Pattern Nikla → Nateeja / Jawab Hazir.',
    nextUpEn: 'Next Up: The AI Family Tree & Hierarchy of Learning Models.',
    nextUpHyd: 'Agla Sabaq: AI ka Shijra-e-Nasab aur ML ki Qismein.'
  },

  'family-tree': {
    sectionId: 'family-tree',
    badgeEn: 'Quick Takeaway • Lesson 02',
    badgeHyd: 'Sabaq Khulasa • Hissa 02',
    titleEn: 'The AI Hierarchy & Learning Blueprint',
    titleHyd: 'AI Hierarchy aur Seekhne ke Tareeqay',
    tldrEn: 'AI is the broadest umbrella, Machine Learning is the pattern engine inside it, and Deep Learning uses deep neural layers to master complex tasks.',
    tldrHyd: 'AI sabse bada daera hai, ML uske andar pattern seekhta hai, aur Deep Learning neural networks se pechida kaam karti hai.',
    keyPointsEn: [
      'Supervised Learning trains on labeled data (e.g. photo + "Dog" label) with an answer key.',
      'Unsupervised Learning groups unlabeled data into natural hidden clusters and customer segments.',
      'Reinforcement Learning learns optimal policies via trial, error, rewards, and penalties.',
      'Deep Learning stacks multiple artificial neural network layers to process audio, vision, and language.'
    ],
    keyPointsHyd: [
      'Supervised Learning: Answer key aur labels ke sath seekhna (jaise photo + "Kutta").',
      'Unsupervised Learning: Baghair label ke data me khud ba khud patterns aur groups banana.',
      'Reinforcement Learning: Inam (reward) aur saza (penalty) ke sath trial-and-error se seekhna.',
      'Deep Learning: Insani dimaag ki tarah kayi neural layers jod kar awaaz, tasveer aur zaban samajhna.'
    ],
    mentalModelEn: 'AI (Broadest) > Machine Learning > Deep Learning > Transformers (Generative AI).',
    mentalModelHyd: 'AI (Bada Daera) > Machine Learning > Deep Learning > Transformers (Generative AI).',
    nextUpEn: 'Next Up: Generative AI & Large Language Models.',
    nextUpHyd: 'Agla Sabaq: Generative AI aur Large Language Models.'
  },

  'generative-ai': {
    sectionId: 'generative-ai',
    badgeEn: 'Quick Takeaway • Lesson 03',
    badgeHyd: 'Sabaq Khulasa • Hissa 03',
    titleEn: 'Generative AI & LLMs in a Nutshell',
    titleHyd: 'Generative AI aur LLMs ka Khulasa',
    tldrEn: 'Generative models do not just analyze existing data—they synthesize entirely new text, code, audio, and visuals one token at a time.',
    tldrHyd: 'Generative AI sirf data analyze nahi karti—balki naya text, code, tasveerein aur awaaz khud banati hai.',
    keyPointsEn: [
      'Next-Token Prediction: LLMs predict the mathematically most probable next word fragment based on context.',
      'Self-Attention (Transformer): Allows the model to look across all words in a prompt simultaneously.',
      'Multimodal Intelligence: Modern models fuse vision, code, voice, and text into unified reasoning streams.'
    ],
    keyPointsHyd: [
      'Next-Token Prediction: LLM mathematically agla sabse behtareen lafz ya token guess karta hai.',
      'Self-Attention Mechanism: Transformer poore sentence ko ek sath dekh kar context samajhta hai.',
      'Multimodal AI: Ek sath text, tasveer, awaaz aur coding par kaam karne ki salahiyat.'
    ],
    mentalModelEn: 'Generative models predict the most coherent continuation of human patterns.',
    mentalModelHyd: 'Generative models insan ke patterns ka sabse munasib agla hissa generate karte hain.',
    nextUpEn: 'Next Up: Prompt Engineering, RAG & Autonomous Agents.',
    nextUpHyd: 'Agla Sabaq: Prompting, RAG aur Autonomous AI Agents.'
  },

  'prompting-rag': {
    sectionId: 'prompting-rag',
    badgeEn: 'Quick Takeaway • Lesson 04',
    badgeHyd: 'Sabaq Khulasa • Hissa 04',
    titleEn: 'Prompting, RAG & Agents Playbook',
    titleHyd: 'Prompting, RAG aur Agents ka Khulasa',
    tldrEn: 'Crisp prompts direct the model, RAG provides verified external facts, and Agents give models the ability to execute multi-step tools.',
    tldrHyd: 'Acha prompt rasta dikhata hai, RAG live aur sahi maloomat jodta hai, aur Agents khud ba khud steps lete hain.',
    keyPointsEn: [
      'Effective Prompting: Assign a clear role, outline constraints, and provide concrete few-shot examples.',
      'RAG (Retrieval-Augmented Generation): Grounds the LLM in real-time databases to prevent hallucinations.',
      'AI Agents: Autonomous loops that reason, plan, query APIs, and verify output until a goal is achieved.'
    ],
    keyPointsHyd: [
      'Kamyab Prompting: Clear role dein, sharaet (rules) batayein aur misalein provide karein.',
      'RAG Architecture: Model ko live database se jodna taaki wo ghalat batein (hallucinations) na banaye.',
      'Autonomous Agents: Wo models jo khud planning karke tools aur APIs chala sakte hain.'
    ],
    mentalModelEn: 'Prompting = Asking clearly • RAG = Open-book lookup • Agents = Hands to take action.',
    mentalModelHyd: 'Prompting = Sawaal • RAG = Kitab dekh kar jawab • Agents = Hath se kaam karna.',
    nextUpEn: 'Next Up: Curated AI Tools Directory.',
    nextUpHyd: 'Agla Sabaq: AI Tools Directory aur Behtareen Apps.'
  },

  'tools': {
    sectionId: 'tools',
    badgeEn: 'Quick Takeaway • Lesson 05',
    badgeHyd: 'Sabaq Khulasa • Hissa 05',
    titleEn: 'AI Tool Selection Strategy',
    titleHyd: 'AI Tools Muntakhib Karne ki Strategy',
    tldrEn: 'Match the tool to the specific modality (text, image, audio, code) and verify data privacy before pasting proprietary workflows.',
    tldrHyd: 'Har kaam ke liye munasib tool chunein (text, image, coding) aur company ka secret data share karne se pehle sochein.',
    keyPointsEn: [
      'Text & Reasoning: ChatGPT, Claude, and Gemini excel at writing, summarization, and strategic synthesis.',
      'Media & Visuals: Midjourney, Flux, and Runway lead in high-fidelity image and cinematic video synthesis.',
      'Code Acceleration: Cursor, Copilot, and Claude Code streamline refactoring, debugging, and testing.'
    ],
    keyPointsHyd: [
      'Likhayi aur Analysis: ChatGPT, Claude aur Gemini behtareen hain.',
      'Tasveerein aur Videos: Midjourney, Flux aur Runway top-tier results dete hain.',
      'Coding aur Software: Cursor aur GitHub Copilot coding ki speed 3x badha dete hain.'
    ],
    mentalModelEn: 'Choose specialized domain models over generic one-size-fits-all chatbots.',
    mentalModelHyd: 'Har kaam ke liye specialized model use karein bajaye aam general bot ke.',
    nextUpEn: 'Next Up: 12 Core Deep Concepts Technical Roadmap.',
    nextUpHyd: 'Agla Sabaq: 12 Buniyaadi Technical Sabaq.'
  },

  'deeper': {
    sectionId: 'deeper',
    badgeEn: 'Quick Takeaway • Lesson 06',
    badgeHyd: 'Sabaq Khulasa • Hissa 06',
    titleEn: '12 Core Technical Principles Summary',
    titleHyd: '12 Buniyaadi Sabaq ka Mukammal Khulasa',
    tldrEn: 'From vector embeddings to fine-tuning and safety alignment, these 12 concepts form the complete engineering foundation of AI.',
    tldrHyd: 'Vector embeddings se lekar fine-tuning aur safety rules tak, ye 12 concepts poori AI engineering ki buniyaad hain.',
    keyPointsEn: [
      'Vector Embeddings: Translating words into multidimensional coordinates where similar concepts cluster together.',
      'Fine-Tuning vs. RAG: Fine-tuning teaches specialized format and tone; RAG provides dynamic factual knowledge.',
      'Safety & Alignment (RLHF): Guardrails and human feedback ensure models remain safe, truthful, and helpful.'
    ],
    keyPointsHyd: [
      'Vector Embeddings: Alfaz ko numbers ki shakl me space me rakhna taaki milte julte matlab paas rahein.',
      'Fine-Tuning vs RAG: Fine-tuning naya lehja sikhata hai; RAG taaza maloomat provide karta hai.',
      'Safety & Alignment: Insani feedback (RLHF) model ko safe aur sachha banata hai.'
    ],
    mentalModelEn: 'Mastering the 12 concepts turns AI from a black box into a predictable engineering tool.',
    mentalModelHyd: 'Ye 12 sabaq samajhne se AI jaadu ke bajaye ek asan engineering tool ban jati hai.',
    nextUpEn: 'Next Up: Interactive Flashcards & Knowledge Arena.',
    nextUpHyd: 'Agla Sabaq: Interactive Flashcards aur Quiz Arena.'
  }
};

interface QuickTakeawayProps {
  sectionId: 'what-is-ai' | 'family-tree' | 'generative-ai' | 'prompting-rag' | 'tools' | 'deeper';
  defaultOpen?: boolean;
}

export default function QuickTakeaway({ sectionId, defaultOpen = true }: QuickTakeawayProps) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const data = TAKEAWAYS_DATA[sectionId] || TAKEAWAYS_DATA['what-is-ai'];

  const isHyd = lang === 'hyd' || lang === 'te';
  const badge = isHyd ? data.badgeHyd : data.badgeEn;
  const title = isHyd ? data.titleHyd : data.titleEn;
  const tldr = isHyd ? data.tldrHyd : data.tldrEn;
  const keyPoints = isHyd ? data.keyPointsHyd : data.keyPointsEn;
  const mentalModel = isHyd ? data.mentalModelHyd : data.mentalModelEn;
  const nextUp = isHyd ? data.nextUpHyd : data.nextUpEn;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const copyText = `📌 ${title}\n\n💡 The Big Picture:\n${tldr}\n\n🔑 Key Takeaways:\n${keyPoints.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}\n\n🧠 Mental Model:\n${mentalModel}`;
    navigator.clipboard.writeText(copyText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleToggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      audioEngine.stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    const speechText = `${title}. Summary: ${tldr}. Key points: ${keyPoints.join('. ')}. Mental model: ${mentalModel}`;
    audioEngine.speak(speechText, lang, () => {
      setIsSpeaking(false);
    });
  };

  // Determine subtle slide direction (alternate between subtle left and right slide)
  const slideDirection = ['what-is-ai', 'generative-ai', 'tools'].includes(sectionId) ? -28 : 28;

  return (
    <motion.div 
      initial={{ opacity: 0, x: slideDirection, y: 15 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto px-6 py-6 transition-all duration-300"
    >
      <div className="bg-gradient-to-br from-white via-[#FAF7F2] to-[#F5EFE6] rounded-3xl border border-brand-amber/30 shadow-md hover:shadow-lg transition-all overflow-hidden">
        {/* Clickable Header Bar */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none border-b border-brand-amber/15 group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center shrink-0 shadow-sm text-brand-amber-dark group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber-dark border border-brand-amber/30 font-mono">
                  {badge}
                </span>
                <span className="text-[10.5px] font-mono text-brand-muted hidden sm:inline">
                  30s Review
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-black text-brand-charcoal tracking-tight mt-0.5 flex items-center gap-2">
                <span>{title}</span>
              </h3>
            </div>
          </div>

          {/* Action Buttons & Toggle Chevron */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Listen */}
            <button
              onClick={handleToggleSpeak}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isSpeaking
                  ? 'bg-brand-amber text-white border-brand-amber animate-pulse'
                  : 'bg-white hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal border-brand-slate/15'
              }`}
              title={isSpeaking ? 'Stop narration' : 'Listen to Quick Takeaway'}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Copy Summary Button */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal border border-brand-slate/15 transition-all cursor-pointer shadow-sm"
              title="Copy takeaway summary to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Expand / Collapse Chevron */}
            <button 
              className="p-2 rounded-xl bg-brand-sand/70 hover:bg-brand-sand text-brand-charcoal border border-brand-slate/15 transition-transform"
              aria-label={isOpen ? 'Collapse summary' : 'Expand summary'}
            >
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content Body */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="p-6 sm:p-7 space-y-5 bg-white/70">
                {/* The Big Picture / TL;DR Box */}
                <div className="bg-brand-amber/10 border-l-4 border-brand-amber rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-brand-amber-dark shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-brand-amber-dark block mb-1">
                      {isHyd ? 'Asli Baat (The Big Picture):' : 'The Big Picture (TL;DR):'}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-brand-charcoal leading-relaxed">
                      {tldr}
                    </p>
                  </div>
                </div>

                {/* Key Points & Learning Objectives */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-brand-slate flex items-center gap-1.5 mb-3">
                    <Target className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{isHyd ? 'Khaas Nukat (Key Objectives):' : 'Key Learning Takeaways:'}</span>
                  </h4>
                  <div className="space-y-2.5">
                    {keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-charcoal/90">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mental Model / Rule of Thumb */}
                <div className="bg-brand-sand/50 rounded-2xl p-3.5 border border-brand-slate/15 flex items-start gap-2.5 text-xs">
                  <Zap className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-charcoal block mb-0.5">
                      {isHyd ? 'Dimaag me Yaad Rakhne ka Formula:' : 'Mental Model & Rule of Thumb:'}
                    </span>
                    <span className="text-brand-slate font-medium italic">
                      "{mentalModel}"
                    </span>
                  </div>
                </div>

                {/* Next Section Bridge */}
                {nextUp && (
                  <div className="pt-2 border-t border-brand-slate/10 flex items-center justify-between text-xs text-brand-slate">
                    <span className="font-medium flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-brand-amber" />
                      <span>{nextUp}</span>
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
