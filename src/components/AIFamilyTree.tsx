import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Network, HelpCircle, Layers, Fingerprint, Cpu, Sparkles, Activity, Zap } from 'lucide-react';
import { MLType } from '../types';
import TechTooltip from './TechTooltip';
import { useLanguage } from '../hooks/useLanguage';
import ReadSectionButton from './ReadSectionButton';
import CopyCodeButton from './CopyCodeButton';
import CodeSnippetBlock from './CodeSnippetBlock';

export default function AIFamilyTree() {
  const { lang, t } = useLanguage();
  const [activeNestingLevel, setActiveNestingLevel] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [flippedMLCards, setFlippedMLCards] = useState<Record<number, boolean>>({});
  const [hoveredNeuronLayer, setHoveredNeuronLayer] = useState<number | null>(null);

  // Parallax scroll reference for the entire Family Tree section
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Smooth springs for fluid, tactile parallax without jitter
  const smoothProgress = useSpring(scrollYProgress, { damping: 25, stiffness: 120 });

  // Concentric nesting doll parallax transformations
  const yDollAI = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const yDollML = useTransform(smoothProgress, [0, 1], [-35, 35]);
  const yDollDL = useTransform(smoothProgress, [0, 1], [-55, 55]);
  const yDollGenAI = useTransform(smoothProgress, [0, 1], [-80, 80]);
  const rotateDolls = useTransform(smoothProgress, [0, 1], [-6, 6]);
  const scaleGenAICore = useTransform(smoothProgress, [0, 0.5, 1], [0.92, 1.08, 0.95]);

  // Counter-parallax on floating badges
  const yBadgeLeft = useTransform(smoothProgress, [0, 1], [25, -25]);
  const yBadgeRight = useTransform(smoothProgress, [0, 1], [-25, 25]);
  const bgLatticeY = useTransform(smoothProgress, [0, 1], [-40, 40]);

  // Deep Learning Neural Network layer parallax offsets
  const yNeuralInput = useTransform(smoothProgress, [0, 1], [-25, 25]);
  const yNeuralHidden1 = useTransform(smoothProgress, [0, 1], [-10, 10]);
  const yNeuralHidden2 = useTransform(smoothProgress, [0, 1], [15, -15]);
  const yNeuralOutput = useTransform(smoothProgress, [0, 1], [30, -30]);

  const mlTypes: MLType[] = [
    {
      title: lang === 'en' ? 'Supervised Learning' : 'Supervised Learning (Ustad ke Sath)',
      analogy: lang === 'en' ? 'Learning with a guide' : 'Ustad ki help se seekhna',
      description: lang === 'en'
        ? 'You feed the machine labeled pictures (like "dog" or "cat") until it learns which visual clues match which label.'
        : 'Tum machine ko pehle se naam likhe so photo’aa dete (jaise "billi" ya "kutti"), jab tak ke wo sahi visual clues na pakad le.'
    },
    {
      title: lang === 'en' ? 'Unsupervised Learning' : 'Unsupervised Learning (Apne Aap)',
      analogy: lang === 'en' ? 'Sorting a wild pile' : 'Bina ustad ke dher jama karna',
      description: lang === 'en'
        ? 'The machine groups unlabeled data by itself, spotting hidden structures or similarities you might have missed.'
        : 'Machine bina naam diye so data ko khud ba khud groups mein daal deti hai patterns pakad ke.'
    },
    {
      title: lang === 'en' ? 'Reinforcement Learning' : 'Reinforcement Learning (Inaam waala)',
      analogy: lang === 'en' ? 'Trial, error, and treats' : 'Inaam aur sazaa ka khel',
      description: lang === 'en'
        ? 'The machine operates in a trial-and-error loop, earning points for correct moves (like teaching a dog with treats).'
        : 'Machine galti kar kar ke seekhti hai. Sahi kaam pe points milte (jaise kutte ko treat de ke seekhana).'
    }
  ];

  const nestingLevels = [
    {
      id: 0,
      title: lang === 'en' ? 'Artificial Intelligence (AI)' : 'Artificial Intelligence (AI)',
      description: lang === 'en'
        ? 'The broadest umbrella. Any technology that lets machines simulate human-like reasoning, matching, or puzzle-solving.'
        : 'Sabse bada umbrella. Koi bhi technology jo computer ko insaan ke jaisa dimaag lagane aur puzzle solve karne mein madad kare.',
      color: 'bg-brand-cream border-brand-charcoal/20 text-brand-charcoal'
    },
    {
      id: 1,
      title: lang === 'en' ? 'Machine Learning (ML)' : 'Machine Learning (ML)',
      description: lang === 'en'
        ? 'A subset of AI where computer systems learn rules directly from historical examples, bypassing hand-written code rules.'
        : 'AI ka wo hissa jahan computers hazaaro examples dekh ke rules khud ba khud likh lete hain.',
      color: 'bg-white border-brand-slate/20 text-brand-charcoal shadow-sm'
    },
    {
      id: 2,
      title: lang === 'en' ? 'Deep Learning (DL)' : 'Deep Learning (DL)',
      description: lang === 'en'
        ? 'A deeper layer of ML using stacked artificial "neural networks" to automatically master complex structures like human voices or faces.'
        : 'ML ka bohot gehra hissa jahan multi-layered networks (jaise insaani dimaag ke neurons) bade mushkil kaam jaise awaaz ya chehra pehchanna seekhte hain.',
      color: 'bg-brand-sand/60 border-brand-amber/15 text-brand-charcoal shadow-sm'
    },
    {
      id: 3,
      title: lang === 'en' ? 'Generative AI (GenAI)' : 'Generative AI (GenAI)',
      description: lang === 'en'
        ? 'The newest inner-core. AI systems trained on massive content maps to create entirely fresh images, writings, or audio tracks.'
        : 'Aaj kal ka naya inner core. Ye systems naye photos, gaane aur asaan articles khud se likh ke generate kar sakte hain.',
      color: 'bg-brand-amber/10 border-brand-amber/40 text-brand-amber shadow-sm'
    }
  ];

  const deeperDetails = [
    {
      id: 0,
      conceptsEn: "Rule-based expert systems, static decision trees, and custom pattern matchers. AI doesn't always have to learn on its own; it can follow hand-written, smart logical pathways.",
      conceptsHyd: "Bina seekhe so expert systems aur decision maps. AI ko har baar seekhna nahi rehta miya, ye ustad ke hand-written rules par bhi behtareen chal sakta hai.",
      examplesEn: "Chess computers (IBM Deep Blue), automated route planning, logic solver programs.",
      examplesHyd: "Chess computer'aa, Google Maps ke purane route calculators.",
      tipEn: "Think of basic AI as a massive, pre-drawn map. The computer is super fast at finding roads on the map, but it cannot draw a single new road by itself.",
      tipHyd: "AI ko ek bade nakshay ke jaisa samjho. Computer nakshay pe rasta toh bohot jaldi dhoond lega, par khud se naya rasta nahi bana sakta."
    },
    {
      id: 1,
      conceptsEn: "Feature vectors, weights, linear regression, and classifiers. ML allows systems to optimize algorithms dynamically as more training files are parsed.",
      conceptsHyd: "Mathematical patterns aur statistical parameters. Isme computer hazaaron files ko analyze karke apna rasta aur prediction model khud bana leta hai.",
      examplesEn: "Email spam detection, credit scoring, product recommendation engines.",
      examplesHyd: "Spam email filters, YouTube recommendations, bank ke fraud signals.",
      tipEn: "ML is like training a dog by giving it treats for good behavior. The algorithm gets 'points' for correct predictions until it masters the skill.",
      tipHyd: "ML ek kutte ko seekhane ke jaisa hai. Sahi prediction pe algorithm ko points (treats) milte hain, jab tak ke wo poora kaam dhang se na seekh le."
    },
    {
      id: 2,
      conceptsEn: "Artificial Neural Networks (ANNs) with deep hidden layers. Activations propagate forward, errors are sent back to adjust neural weights automatically.",
      conceptsHyd: "Dimaag ke neurons ke jaise layers. Inputs aur feedback layers mil kar dher saari files process karti hain.",
      examplesEn: "Face recognition (Apple FaceID), real-time speech translation, autonomous vehicle vision.",
      examplesHyd: "Apple FaceID, Google Translate ki awaaz pehchanne wali system, self-driving cars.",
      tipEn: "Deep Learning uses a hierarchy of virtual filters. Early layers spot basic lines and edges, middle layers group them into shapes, and final layers see full objects.",
      tipHyd: "Deep learning virtual filters ka dher hai. Pehli layer lakeerein pehchanti hai, beech ki layers shapes dhoondti hain, aur aakhir ki layers poori cheez samajhti hain."
    },
    {
      id: 3,
      conceptsEn: "Generative models, Large Language Models (LLMs), attention mechanisms, and Transformers. They map world content to synthesize entirely new combinations.",
      conceptsHyd: "Transformers aur generative mathematical maps. Ye model pure world content ko seekh kar uske mutabiq bilkul naya content bana sakta hai.",
      examplesEn: "Gemini, ChatGPT, Midjourney, DALL-E, GitHub Copilot.",
      examplesHyd: "Google Gemini, ChatGPT, Midjourney naye drawings ke waaste.",
      tipEn: "GenAI does not just copy-paste! It learns the deep grammatical or visual 'recipes' of human creation so it can bake entirely fresh outputs from your instructions.",
      tipHyd: "GenAI copy-paste nahi karta miya! Ye insaani zabaan aur art ke recipes seekh leta hai taaki tumhare bolne pe bilkul naye pakwaan (outputs) bana sake."
    }
  ];

  const deeperMLDetails = [
    {
      techEn: "Goal: Map inputs to known outputs. Standard algorithms include Decision Trees, Neural Networks, and Support Vector Machines.",
      techHyd: "Bara goal: Pata so results ko naye inputs se match karna. Isme decision trees aur neural networks use hote hain.",
      examplesEn: "Image classification, diagnostic prediction, voice command mapping.",
      examplesHyd: "Face detection, bimarion ka early prediction, voice commands."
    },
    {
      techEn: "Goal: Cluster unstructured data points. Uses similarity metrics, distance equations, and dimensionality reduction.",
      techHyd: "Bara goal: Data ke chhupi hui similarities dhoondna bina pehle se diye so naam ke.",
      examplesEn: "Targeted advertising groups, raw data cleaning, compression.",
      examplesHyd: "Ad target groups banana, raw data ko saaf aur compress karna."
    },
    {
      techEn: "Goal: Maximize rewards over time. Powered by game theory, bellman equations, and continuous environment feedback loops.",
      techHyd: "Bara goal: Waqt ke sath points badhana. Environment se signals le kar best action chunna.",
      examplesEn: "Robotic warehouse navigation, game bots (Dota 2, Chess), HVAC cooling control.",
      examplesHyd: "Robots ka rasta dhoondna, game-playing bots, automated cooling systems."
    }
  ];

  const handleLevelChange = (levelId: number) => {
    setActiveNestingLevel(levelId);
    setIsFlipped(false);
  };

  const toggleMLCardFlip = (index: number) => {
    setFlippedMLCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Neural network sample architecture for Deep Learning visualizer
  const neuralLayers = [
    { name: lang === 'en' ? 'Input Layer' : 'Input Layer', desc: lang === 'en' ? 'Raw pixels & features' : 'Khaam data aur pixels', count: 4, color: 'bg-brand-slate' },
    { name: lang === 'en' ? 'Hidden Layer 1' : 'Hidden Layer 1', desc: lang === 'en' ? 'Edges & gradients' : 'Lakeerein aur corners', count: 5, color: 'bg-brand-amber' },
    { name: lang === 'en' ? 'Hidden Layer 2' : 'Hidden Layer 2', desc: lang === 'en' ? 'Textures & shapes' : 'Textures aur gole', count: 4, color: 'bg-brand-amber' },
    { name: lang === 'en' ? 'Output Layer' : 'Output Layer', desc: lang === 'en' ? 'Classification result' : 'Final Nateeja', count: 2, color: 'bg-emerald-600' }
  ];

  return (
    <div 
      id="family-tree" 
      ref={sectionRef}
      className="scroll-mt-16 bg-brand-sand/10 border-b border-brand-slate/5 py-16 relative overflow-hidden"
    >
      {/* Parallax Background Lattice & Ambient Drift */}
      <motion.div 
        style={{ y: bgLatticeY }} 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
      >
        <div className="w-full h-full bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
      </motion.div>
      <motion.div 
        style={{ y: useTransform(smoothProgress, [0, 1], [60, -60]) }}
        className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-brand-amber/5 blur-[100px] pointer-events-none"
      />
      <motion.div 
        style={{ y: useTransform(smoothProgress, [0, 1], [-80, 80]) }}
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-brand-slate/5 blur-[120px] pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Title with subtle spring reveal */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'en' ? "Layer 02: Core Concepts" : "Layer 02: Khaas Concepts"}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-charcoal mt-1 mb-3">
            {lang === 'en' ? "The AI Family Tree" : "AI ka Khandan (Family Tree)"}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
            {lang === 'en'
              ? "Many terms get thrown around like they mean the same thing. In reality, they are nested inside each other like Russian nesting dolls."
              : "Bohot saare log samjhte hain sab ka matlab ek hi hai. Par asal mein ye Russian nesting dolls ke jaise ek dusre ke andar nested hain."
            }
          </p>
          <div className="flex justify-center">
            <ReadSectionButton sectionId="family-tree" />
          </div>
        </div>

        {/* Nesting Interactive Diagram & Explanations (Bento Grid with Parallax Depth) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-12">
          
          {/* Bento Card 1: Nested Diagram (Col Span 6 with Multi-layer Parallax) */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 bg-white/90 backdrop-blur-sm border border-brand-slate/10 rounded-3xl skeuo-raised relative min-h-[460px] overflow-hidden">
            {/* Subtle background radial accent */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="flex-grow flex items-center justify-center py-6">
              <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center select-none">
                
                {/* 1. Broadest AI Doll (Layer 0 - Outer Parallax Frame) */}
                <motion.div 
                  style={{ y: yDollAI, rotate: rotateDolls }}
                  className="w-full h-full rounded-full skeuo-raised flex items-center justify-center p-6 bg-[#F5F2ED] relative cursor-pointer border border-brand-slate/15 transition-shadow hover:shadow-lg"
                  onClick={() => handleLevelChange(0)}
                  whileHover={{ scale: 1.015 }}
                >
                  <span className="absolute top-3 font-bold text-[9px] tracking-wider text-brand-muted uppercase">
                    Artificial Intelligence
                  </span>
                  
                  {/* 2. Machine Learning Doll (Layer 1 - Mid Parallax) */}
                  <motion.div 
                    style={{ y: yDollML }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full h-full rounded-full skeuo-pressed flex items-center justify-center p-5 cursor-pointer relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLevelChange(1);
                    }}
                  >
                    <span className="absolute top-3.5 font-bold text-[8.5px] tracking-wider text-brand-muted uppercase">
                      Machine Learning
                    </span>

                    {/* 3. Deep Learning Doll (Layer 2 - Deeper Parallax) */}
                    <motion.div 
                      style={{ y: yDollDL }}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="w-full h-full rounded-full skeuo-raised flex items-center justify-center p-5 cursor-pointer border border-brand-amber/25 relative bg-white/60"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLevelChange(2);
                      }}
                    >
                      <span className="absolute top-3.5 font-bold text-[8.5px] tracking-wider text-brand-amber uppercase">
                        Deep Learning
                      </span>

                      {/* 4. Generative AI Doll (Layer 3 - Floating Core with Dynamic Scale) */}
                      <motion.div 
                        style={{ y: yDollGenAI, scale: scaleGenAICore }}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-brand-amber to-amber-500 flex flex-col items-center justify-center p-1 cursor-pointer shadow-lg shadow-brand-amber/40 relative hover:scale-110 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLevelChange(3);
                        }}
                      >
                        <span className="font-display text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wider text-center leading-tight">
                          Gen<br/>AI
                        </span>
                        <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-25 pointer-events-none" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Floating Spatial Depth Tags with Counter-Parallax */}
                <motion.div 
                  style={{ y: yBadgeLeft }}
                  className="absolute -top-3 -left-3 text-[9px] font-bold text-brand-muted uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-brand-slate/10 shadow-xs"
                >
                  {lang === 'en' ? "Broad Umbrella" : "Bada System"}
                </motion.div>
                <motion.div 
                  style={{ y: yBadgeRight }}
                  className="absolute -bottom-3 -right-3 text-[9px] font-bold text-brand-amber uppercase font-mono tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-brand-amber/20 shadow-xs"
                >
                  {lang === 'en' ? "Generative Core" : "Main Core"}
                </motion.div>
              </div>
            </div>

            {/* Subfield Navigation Pill Controls */}
            <div className="flex gap-1.5 justify-center mt-4 pt-3 border-t border-brand-slate/5">
              {nestingLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelChange(level.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                    activeNestingLevel === level.id 
                      ? 'bg-brand-amber text-white shadow-sm scale-105' 
                      : 'bg-[#F5F2ED] hover:bg-brand-sand text-brand-slate border border-brand-slate/15'
                  }`}
                >
                  {level.id === 0 ? 'AI (Umbrella)' : level.id === 1 ? 'ML' : level.id === 2 ? 'DL' : 'GenAI'}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Card 2: Interactive Display Details (Col Span 6 with 3D Flip & Parallax Lift) */}
          <div className="lg:col-span-6 min-h-[460px] relative" style={{ perspective: '1200px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNestingLevel}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full relative cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* CARD FRONT SIDE */}
                <div 
                  className="glass-panel p-8 rounded-3xl border border-brand-slate/10 w-full h-full flex flex-col justify-between absolute top-0 left-0 right-0 bottom-0 overflow-hidden bg-white select-none shadow-xl hover:shadow-2xl transition-all"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div>
                    {/* 3D-style Tactile Icon Tile */}
                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                      {activeNestingLevel === 0 ? <Network className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" /> :
                       activeNestingLevel === 1 ? <Fingerprint className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" /> :
                       activeNestingLevel === 2 ? <Layers className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" /> :
                       <Cpu className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-mono text-xs font-bold text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-full">Doll 0{activeNestingLevel + 1}</span>
                      <h3 className="font-display text-xl font-extrabold text-brand-charcoal">
                        {nestingLevels[activeNestingLevel].title}
                      </h3>
                    </div>
                    <p className="font-sans text-[14px] text-brand-charcoal leading-relaxed">
                      {nestingLevels[activeNestingLevel].description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-brand-slate/5 mt-6">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-brand-amber animate-pulse">
                      <span>⚡ {lang === 'en' ? "Click Card to Flip!" : "Card pe dabao, piche dekho!"}</span>
                      <span className="text-xs">🔄</span>
                    </div>
                    <div className="flex gap-4 text-[9.5px] font-mono text-brand-muted mt-1">
                      <span>{lang === 'en' ? "Tap on circles or doll list to switch subfields" : "Dabbe ya button se change karo"}</span>
                    </div>
                  </div>
                </div>

                {/* CARD BACK SIDE */}
                <div 
                  className="glass-panel p-8 rounded-3xl border-2 border-brand-amber/30 w-full h-full flex flex-col justify-between absolute top-0 left-0 right-0 bottom-0 overflow-hidden bg-white select-none shadow-2xl"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="overflow-y-auto pr-1 flex-grow scrollbar-thin">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-amber bg-brand-amber/10 px-2.5 py-0.5 rounded-full">Doll 0{activeNestingLevel + 1} Back</span>
                        <h4 className="font-display text-sm font-black text-brand-charcoal uppercase tracking-wide">
                          {lang === 'en' ? "Deeps Explained" : "Gehri Baat"}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CopyCodeButton
                          text={`${nestingLevels[activeNestingLevel].title}: ${lang === 'en' ? deeperDetails[activeNestingLevel].conceptsEn : deeperDetails[activeNestingLevel].conceptsHyd}\nExamples: ${lang === 'en' ? deeperDetails[activeNestingLevel].examplesEn : deeperDetails[activeNestingLevel].examplesHyd}`}
                          label={lang === 'en' ? "Copy Notes" : "Notes Copy"}
                          variant="compact"
                        />
                        <span className="text-xs text-brand-amber">🔄</span>
                      </div>
                    </div>

                    {/* Concepts Block */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider block mb-1">
                        {lang === 'en' ? "Technical Engine:" : "Peeche ka engine:"}
                      </span>
                      <p className="text-xs text-brand-charcoal leading-relaxed font-sans">
                        {lang === 'en' ? deeperDetails[activeNestingLevel].conceptsEn : deeperDetails[activeNestingLevel].conceptsHyd}
                      </p>
                    </div>

                    {/* Examples Block */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono font-bold text-brand-slate uppercase tracking-wider block mb-1">
                        {lang === 'en' ? "Real-World Examples:" : "Asal Duniya ki Misaal:"}
                      </span>
                      <p className="text-xs font-bold text-brand-charcoal leading-relaxed font-mono">
                        💡 {lang === 'en' ? deeperDetails[activeNestingLevel].examplesEn : deeperDetails[activeNestingLevel].examplesHyd}
                      </p>
                    </div>

                    {/* Clay's Custom Tip Block */}
                    <div className="bg-brand-sand/35 p-3.5 rounded-xl border-l-4 border-brand-amber text-[11px] text-brand-muted leading-relaxed italic">
                      <strong className="font-mono text-[9px] uppercase tracking-wider block not-italic text-brand-amber mb-0.5">
                        Clay's Explainer Tip:
                      </strong>
                      "{lang === 'en' ? deeperDetails[activeNestingLevel].tipEn : deeperDetails[activeNestingLevel].tipHyd}"
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-slate/5 mt-4 shrink-0">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-brand-slate">
                      <span>↩️ {lang === 'en' ? "Click to flip back" : "Wapas samne dekhne ke liye dabao"}</span>
                      <span>• {lang === 'en' ? "Interactive Lesson" : "Sabaq"}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* What is Machine Learning? Deep-dive (Bento Row with Parallax Lift) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          
          {/* Bento Card 3: ML Definition (Col Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-8 bg-white border border-brand-slate/10 rounded-3xl skeuo-raised flex flex-col justify-between"
          >
            <div>
              {/* 3D-style Tactile Icon Tile */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                <Network className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono block mb-2">
                {lang === 'en' ? "Lesson 04" : "Sabak 04"}
              </span>
              <h3 className="font-display text-2xl font-extrabold text-brand-charcoal mb-4">
                {lang === 'en' ? "What is Machine Learning (ML)?" : "Machine Learning (ML) Kya hai?"}
              </h3>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] mb-6">
                {lang === 'en' ? (
                  <>
                    <TechTooltip term="Machine Learning">Machine Learning</TechTooltip> — <span className="text-brand-slate italic">a subset of AI where computers analyze thousands of examples to find patterns instead of following rigid programmed rules</span> — allows software to improve on its own. Rather than hand-coding a rule like "if a pixel is green, it's a leaf," we feed the system 100,000 photos of forests and let the algorithm write its own equations.
                  </>
                ) : (
                  <>
                    <strong className="text-brand-amber">Machine Learning</strong> — <span className="text-brand-slate italic">AI ka wo subset hai jahan computer rules seekhne ke liye bohot saare examples dekhta hai</span> — iski wajah se computer software khud behtar hota rehta hai. Pehle ke jaisa hand code nahi karna padta "agar green color hai toh patti bolo". Ab hum machine ko hazaaro jangal ki photos dedete hain aur wo khud apna dimaag lagake patti pehchanna seekh leta hai.
                  </>
                )}
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-l-4 border-brand-slate relative bg-brand-sand/20">
              <HelpCircle className="w-4 h-4 text-brand-slate absolute top-4 right-4 opacity-30" />
              <span className="font-mono text-[10px] font-bold text-brand-slate uppercase block mb-1">
                {lang === 'en' ? "How it feels" : "Ek aur Misaal"}
              </span>
              <p className="text-brand-charcoal text-xs leading-relaxed italic">
                {lang === 'en' ? (
                  `"Instead of cooking a dish by writing down a rigid list of steps, machine learning is like tasting a soup 500 times, adding a pinch of salt each time, until it matches the taste pattern of your memory."`
                ) : (
                  `"Shorba banane ke step-by-step rules likhne ke bajaye, machine learning 500 baar shorba chakhne ke jaisa hai. Har baar thoda namak dalke check karte, jab tak wo tumhare purane yaad so taste se dhang se match nahi ho jata!"`
                )}
              </p>
            </div>
          </motion.div>

          {/* Bento Card 4: Types of ML Cards (Col Span 5 with 3D Flip) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {mlTypes.map((type, i) => {
              const isMLFlipped = !!flippedMLCards[i];
              return (
                <div 
                  key={type.title}
                  className="h-[150px] relative cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onClick={() => toggleMLCardFlip(i)}
                >
                  <motion.div
                    className="w-full h-full relative"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isMLFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* ML Card Front */}
                    <div
                      className="skeuo-raised p-5 bg-white border border-brand-slate/10 rounded-2xl flex items-start gap-4 w-full h-full absolute top-0 left-0 right-0 bottom-0 select-none shadow-sm hover:shadow-md"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-sand flex items-center justify-center shrink-0 border border-brand-slate/5 shadow-inner">
                        <span className="font-mono text-xs font-bold text-brand-amber">0{i + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
                        <div>
                          <h4 className="font-display text-xs sm:text-sm font-bold text-brand-charcoal flex items-center gap-1.5 flex-wrap">
                            {type.title}
                            <span className="text-[9px] font-sans font-medium text-[#E07A5F] px-2 py-0.5 bg-brand-sand/60 rounded-full border border-brand-slate/5">
                              {type.analogy}
                            </span>
                          </h4>
                          <p className="text-[11px] text-brand-muted mt-1 leading-relaxed line-clamp-2">
                            {type.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[8.5px] font-mono text-brand-amber mt-1">
                          <span>⚡ {lang === 'en' ? "Tap card for deep details" : "Piche dekhne ke liye dabao"}</span>
                          <span>🔄</span>
                        </div>
                      </div>
                    </div>

                    {/* ML Card Back */}
                    <div
                      className="skeuo-raised p-5 bg-white border-2 border-brand-amber/30 rounded-2xl flex flex-col justify-between w-full h-full absolute top-0 left-0 right-0 bottom-0 select-none shadow-md"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="min-w-0 flex-grow overflow-y-auto pr-1 scrollbar-none">
                        <div className="flex items-center justify-between border-b border-brand-slate/5 pb-1 mb-1.5">
                          <span className="font-mono text-[9px] font-bold text-brand-amber uppercase tracking-wider">
                            0{i + 1} {lang === 'en' ? "Deep Engine" : "Khaas Engine"}
                          </span>
                          <div className="flex items-center gap-1">
                            <CopyCodeButton
                              text={`${type.title}: ${lang === 'en' ? deeperMLDetails[i].techEn : deeperMLDetails[i].techHyd}\nUse: ${lang === 'en' ? deeperMLDetails[i].examplesEn : deeperMLDetails[i].examplesHyd}`}
                              label={lang === 'en' ? "Copy" : "Copy"}
                              variant="compact"
                              showIconOnly={true}
                            />
                            <span className="text-[10px]">🔄</span>
                          </div>
                        </div>
                        
                        <div className="mb-1.5">
                          <p className="text-[10px] text-brand-charcoal leading-normal">
                            <strong>{lang === 'en' ? "How it works: " : "Kaise chalta hai: "}</strong>
                            {lang === 'en' ? deeperMLDetails[i].techEn : deeperMLDetails[i].techHyd}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9.5px] text-brand-muted leading-normal">
                            <strong>{lang === 'en' ? "Real Use: " : "Kahan use hota hai: "}</strong>
                            {lang === 'en' ? deeperMLDetails[i].examplesEn : deeperMLDetails[i].examplesHyd}
                          </p>
                        </div>
                      </div>

                      <div className="text-[8.5px] font-mono text-brand-slate border-t border-brand-slate/5 pt-1 mt-1 shrink-0 flex justify-between">
                        <span>↩️ {lang === 'en' ? "Tap to flip back" : "Dabaake wapas badlo"}</span>
                        <span className="text-brand-amber font-bold">{lang === 'en' ? "ML Card" : "ML Card"}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Learning Definition & Interactive Multi-Layer Parallax Neural Diagram (Bento Card 5, Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="skeuo-raised p-8 md:p-10 bg-white border border-brand-slate/10 rounded-3xl relative overflow-hidden"
        >
          {/* Abstract layered card visual depth */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-amber/5 blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Textual Narrative Explanation (Col Span 6) */}
            <div className="lg:col-span-6">
              {/* 3D-style Tactile Icon Tile */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                <Layers className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
              </div>

              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono">
                  {lang === 'en' ? "Lesson 05" : "Sabak 05"}
                </span>
              </div>
              
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-charcoal mb-4">
                {lang === 'en' ? "What is Deep Learning (DL)?" : "Deep Learning (DL) Kya Hai?"}
              </h3>
              <p className="font-sans text-brand-charcoal leading-relaxed text-[14px] md:text-[15px]">
                {lang === 'en' ? (
                  <>
                    <TechTooltip term="Deep Learning">Deep Learning</TechTooltip> — <span className="text-brand-slate italic">a specialized kind of Machine Learning that uses layered mathematical structures called <TechTooltip term="Neural Networks">neural networks</TechTooltip> to capture highly complex relationships in images or sounds</span> — mimics how human brains process raw sights and noises. 
                  </>
                ) : (
                  <>
                    <strong className="text-brand-amber">Deep Learning</strong> — <span className="text-brand-slate italic">Machine Learning ka wo hissa hai jo mathematical layer patterns jise artificial neural networks bolte, usse awaaz aur photo’aa samajhta hai</span> — ye bilkul insaan ke dimaag ki tarah dher saari files process kar sakta hai.
                  </>
                )}
              </p>
              <p className="font-sans text-brand-muted leading-relaxed text-xs sm:text-sm mt-3">
                {lang === 'en' ? (
                  "By stacking these virtual neurons on top of each other, the program starts finding tiny patterns (like lines or shades) in the first layers, then combines them into shapes in the middle layers, and finally recognizes complete objects at the end."
                ) : (
                  "Bohot saare virtual neurons ko layers mein set karke, computer pehli layer mein halki shading ya lakeerein pehchanta, phir beech ki layer mein shapes pehchanta, aur aakhir mein poora ka poora chehra pakad leta hai."
                )}
              </p>
            </div>

            {/* Interactive Multi-Layer Neural Parallax Diagram (Col Span 6) */}
            <div className="lg:col-span-6 bg-brand-cream/60 p-6 rounded-2xl border border-brand-slate/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-brand-slate/10 pb-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-amber flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-brand-amber" />
                  {lang === 'en' ? "Interactive Neural Network Layers" : "Layers ka Live Network"}
                </span>
                <span className="text-[9px] font-mono text-brand-muted bg-white px-2 py-0.5 rounded border border-brand-slate/10">
                  {lang === 'en' ? "Scroll parallax enabled" : "Parallax scroll active"}
                </span>
              </div>

              {/* Neural Layers Container with Parallax Staggered Columns */}
              <div className="grid grid-cols-4 gap-3 relative py-4 items-center min-h-[220px]">
                
                {/* Connecting SVG Synaptic Signal Rays */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <line x1="15%" y1="30%" x2="40%" y2="20%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="15%" y1="50%" x2="40%" y2="50%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="15%" y1="70%" x2="40%" y2="80%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="40%" y1="20%" x2="65%" y2="35%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="40%" y1="50%" x2="65%" y2="50%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="40%" y1="80%" x2="65%" y2="65%" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="65%" y1="35%" x2="88%" y2="40%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                  <line x1="65%" y1="65%" x2="88%" y2="60%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
                </svg>

                {/* Layer 1: Input Column */}
                <motion.div 
                  style={{ y: yNeuralInput }}
                  className="flex flex-col items-center gap-3 z-10"
                  onMouseEnter={() => setHoveredNeuronLayer(0)}
                  onMouseLeave={() => setHoveredNeuronLayer(null)}
                >
                  <span className="text-[9px] font-mono font-bold text-brand-slate uppercase text-center">Input</span>
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((node) => (
                      <div 
                        key={node} 
                        className="w-7 h-7 rounded-full bg-white border-2 border-brand-slate/40 flex items-center justify-center shadow-xs hover:border-brand-amber transition-colors cursor-pointer group"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-slate group-hover:bg-brand-amber transition-colors" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-brand-muted text-center leading-tight">Pixels</span>
                </motion.div>

                {/* Layer 2: Hidden 1 Column */}
                <motion.div 
                  style={{ y: yNeuralHidden1 }}
                  className="flex flex-col items-center gap-2.5 z-10"
                  onMouseEnter={() => setHoveredNeuronLayer(1)}
                  onMouseLeave={() => setHoveredNeuronLayer(null)}
                >
                  <span className="text-[9px] font-mono font-bold text-brand-amber uppercase text-center">Hidden 1</span>
                  <div className="flex flex-col gap-1.5">
                    {[1, 2, 3, 4, 5].map((node) => (
                      <div 
                        key={node} 
                        className="w-6 h-6 rounded-full bg-white border-2 border-brand-amber/40 flex items-center justify-center shadow-xs hover:border-brand-amber transition-colors cursor-pointer group"
                      >
                        <div className="w-2 h-2 rounded-full bg-brand-amber group-hover:scale-125 transition-transform" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-brand-muted text-center leading-tight">Edges</span>
                </motion.div>

                {/* Layer 3: Hidden 2 Column */}
                <motion.div 
                  style={{ y: yNeuralHidden2 }}
                  className="flex flex-col items-center gap-3 z-10"
                  onMouseEnter={() => setHoveredNeuronLayer(2)}
                  onMouseLeave={() => setHoveredNeuronLayer(null)}
                >
                  <span className="text-[9px] font-mono font-bold text-brand-amber uppercase text-center">Hidden 2</span>
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((node) => (
                      <div 
                        key={node} 
                        className="w-7 h-7 rounded-full bg-white border-2 border-brand-amber/40 flex items-center justify-center shadow-xs hover:border-brand-amber transition-colors cursor-pointer group"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-amber/80 group-hover:scale-125 transition-transform" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-brand-muted text-center leading-tight">Shapes</span>
                </motion.div>

                {/* Layer 4: Output Prediction Column */}
                <motion.div 
                  style={{ y: yNeuralOutput }}
                  className="flex flex-col items-center gap-4 z-10"
                  onMouseEnter={() => setHoveredNeuronLayer(3)}
                  onMouseLeave={() => setHoveredNeuronLayer(null)}
                >
                  <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase text-center">Output</span>
                  <div className="flex flex-col gap-3">
                    {[1, 2].map((node) => (
                      <div 
                        key={node} 
                        className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                      >
                        <div className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-emerald-700 font-bold text-center leading-tight">Concept</span>
                </motion.div>

              </div>

              {/* Dynamic feedback caption on hover/scroll */}
              <div className="mt-3 pt-2 border-t border-brand-slate/10 flex justify-between items-center text-[10px] font-mono text-brand-muted">
                <span>
                  {hoveredNeuronLayer !== null 
                    ? `Active: ${neuralLayers[hoveredNeuronLayer].name} (${neuralLayers[hoveredNeuronLayer].desc})`
                    : (lang === 'en' ? "⚡ Synapses propagate activations forward" : "⚡ Synapses dimaag ke signals aage bhejte hain")
                  }
                </span>
                <span className="text-brand-amber font-bold">ANN Depth</span>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Developer Technical Snippets: Scikit-Learn vs PyTorch */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 p-6 sm:p-8 bg-white border border-brand-slate/10 rounded-3xl skeuo-raised text-left"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-brand-slate/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center text-brand-amber">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-amber block">
                  {lang === 'en' ? "Developer Code Snippets" : "Developer Code Snippets"}
                </span>
                <h3 className="font-display text-lg font-black text-brand-charcoal">
                  {lang === 'en' ? "Machine Learning vs Neural Networks in Python" : "ML aur Deep Learning ka Python Code"}
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-brand-muted bg-brand-sand px-3 py-1 rounded-full border border-brand-slate/10 self-start sm:self-auto">
              {lang === 'en' ? "scikit-learn & PyTorch" : "scikit-learn & PyTorch"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Snippet 1: Classical ML (scikit-learn) */}
            <div>
              <span className="text-xs font-bold text-brand-charcoal block mb-1">
                {lang === 'en' ? "1. Classical ML Classifier (scikit-learn)" : "1. Classical ML Model (scikit-learn)"}
              </span>
              <p className="text-[11px] text-brand-muted mb-2">
                {lang === 'en'
                  ? "Fit a tabular dataset with a Random Forest or Logistic Regression classifier."
                  : "Tabular data ko train karke prediction lene ka standard Python code."
                }
              </p>
              <CodeSnippetBlock
                language="python"
                filename="ml_classifier.py"
                showLineNumbers={true}
                code={`from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# 1. Prepare labeled features (X) and target labels (y)
X = [[5.1, 3.5], [4.9, 3.0], [6.2, 3.4], [5.9, 3.0]]
y = [0, 0, 1, 1]

# 2. Train-test split & train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)

# 3. Predict on unseen example
prediction = clf.predict([[5.0, 3.2]])
print("Predicted Class:", prediction[0])`}
                copyLabel={lang === 'en' ? "Copy ML Code" : "ML Code Copy"}
              />
            </div>

            {/* Snippet 2: Deep Learning Neural Network (PyTorch) */}
            <div>
              <span className="text-xs font-bold text-brand-charcoal block mb-1">
                {lang === 'en' ? "2. Deep Neural Network Layer (PyTorch)" : "2. Deep Neural Network (PyTorch)"}
              </span>
              <p className="text-[11px] text-brand-muted mb-2">
                {lang === 'en'
                  ? "Feedforward neural network with Linear layers, ReLU activations, and Dropout."
                  : "Input, Hidden aur Output layers ke sath neural network banane ka snippet."
                }
              </p>
              <CodeSnippetBlock
                language="python"
                filename="neural_net.py"
                showLineNumbers={true}
                code={`import torch
import torch.nn as nn

class DeepNeuralNetwork(nn.Module):
    def __init__(self, input_dim=128, hidden_dim=64, num_classes=10):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),   # Input -> Hidden 1
            nn.ReLU(),                          # Non-linear activation
            nn.Dropout(0.2),                    # Regularization
            nn.Linear(hidden_dim, num_classes)  # Hidden -> Output
        )

    def forward(self, x):
        return self.network(x)

model = DeepNeuralNetwork()`}
                copyLabel={lang === 'en' ? "Copy PyTorch Code" : "PyTorch Copy"}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
