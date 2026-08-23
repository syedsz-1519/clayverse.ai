import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, AlertTriangle, Sparkles, Award, BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { syncQuizProgressToCloud } from '../lib/firebase';
import ClayLogo from './ClayLogo';
import KnowledgeGapDiagnosticQuiz from './KnowledgeGapDiagnosticQuiz';

interface CheckYourKnowledgeProps {
  sectionId: 'basics' | 'family-tree' | 'prompting-rag' | 'deeper';
}

interface MiniQuestion {
  question: { en: string; ur: string };
  options: { en: string[]; ur: string[] };
  correctIndex: number;
  explanation: { en: string; ur: string };
}

const SECTION_QUESTIONS: Record<string, MiniQuestion> = {
  'basics': {
    question: {
      en: "What makes Machine Learning different from standard traditional programming?",
      ur: "Machine Learning ko aam traditional programming se kya cheez alag banati hai?"
    },
    options: {
      en: [
        "It only runs on binary quantum hard drives",
        "It takes data and answers to discover patterns, rather than relying on hand-written rules",
        "It doesn't use standard computer chips",
        "It is written in high-level human spoken sentences"
      ],
      ur: [
        "Ye sirf binary quantum hard drives par chalti hai",
        "Ye likhe-likhaye rules ke bajaye data aur targets dekh kar khud patterns seekhti hai",
        "Isme computer chips istemal nahi hotein",
        "Ye direct insaani bol-chal me likhi jati hai"
      ]
    },
    correctIndex: 1,
    explanation: {
      en: "Exactly! Traditional coding requires developers to write every rule manually. Machine Learning allows the system to analyze data and automatically map rules.",
      ur: "Bilkul sahi! Traditional coding me hume har rule khud likhna hota hai, jabki ML me computer data ko dekh kar khud rules aur formula seekhta hai."
    }
  },
  'family-tree': {
    question: {
      en: "Which neural network architecture forms the engine of modern Generative AI and LLMs (such as GPT-4 and Gemini)?",
      ur: "Kaunsa neural network structure modern Generative AI aur LLMs (jaise GPT-4 aur Gemini) ka asli engine hai?"
    },
    options: {
      en: [
        "Simple Binary Perceptrons",
        "The Transformer (Self-Attention mechanism)",
        "Decision Trees",
        "Static Markov Chains"
      ],
      ur: [
        "Simple Binary Perceptrons",
        "The Transformer (Self-Attention mechanism)",
        "Decision Trees",
        "Static Markov Chains"
      ]
    },
    correctIndex: 1,
    explanation: {
      en: "Spot on! The Transformer architecture (introduced in 2017) uses 'Self-Attention' to process entire sentences in parallel, revolutionizing how AI models understand context.",
      ur: "Aala! 2017 ka 'Transformer' architecture 'Self-Attention' ka istemal karta hai jo aik sath saare lafzon ko parallel parhta hai aur context behtar samajhta hai."
    }
  },
  'prompting-rag': {
    question: {
      en: "Why is Retrieval-Augmented Generation (RAG) highly preferred over model fine-tuning for giving AI fresh factual knowledge?",
      ur: "AI ko latest aur sahi maloomat dene ke liye RAG ko fine-tuning ke muqable me kyun behtar mana jata hai?"
    },
    options: {
      en: [
        "RAG deletes the model's older biases permanently",
        "RAG is cheap, requires no heavy weight retraining, and allows instant document updates like an 'open-book' exam",
        "RAG runs twice as fast on mobile web screens",
        "RAG translates everything into binary mathematical trees"
      ],
      ur: [
        "RAG model ke purane biases ko permanently delete kar deta hai",
        "RAG sasta hai, isme weights retraining nahi lagti, aur 'open-book exam' ki tarah naye documents instantly shamil kiye ja sakte hain",
        "RAG mobile screens par do-guna speed se chalta hai",
        "RAG har cheez ko binary math trees me tabdeel karta hai"
      ]
    },
    correctIndex: 1,
    explanation: {
      en: "Perfect! Fine-tuning is slow and computationally expensive. RAG fetches relevant facts from your documents and supplies them directly to the prompt context on-the-fly.",
      ur: "Zabardast! Fine-tuning boht mehangi aur slow hoti hai. RAG direct database ya folder se sahi maloomat la kar prompt me bar-waqt shamil karta hai."
    }
  },
  'deeper': {
    question: {
      en: "In the context of artificial intelligence safety, what does the term 'Alignment' mean?",
      ur: "AI safety aur ethics ke silsile mein 'Alignment' ka kya matlab hai?"
    },
    options: {
      en: [
        "Aligning lines of code to prevent syntax compiler crashes",
        "Ensuring the AI's goals, decisions, and actions are perfectly aligned with human values and ethics",
        "Arranging physical GPU racks in straight rows inside server centers",
        "Making sure translation speeds match the reader's scrolling pace"
      ],
      ur: [
        "Code ki lines ko ek line me seedha karna taake crash na ho",
        "Ye pakka karna ke AI ke faisle, maqsad aur actions insaani bhalayi, values aur safe rules ke bilkul mutabiq hon",
        "Data centers me physical servers ko bilkul ek seedh me lagana",
        "Ye dekhna ke translation ki speed user ke scroll karne se match kare"
      ]
    },
    correctIndex: 1,
    explanation: {
      en: "Indeed! AI Alignment is the critical discipline of ensuring systems remain helpful, harmless, and honest, avoiding rogue decision loops or unintended harms.",
      ur: "Bilkul! AI Alignment ka matlab hai computer ko safe aur helpful rakhna, taake uske banaye faisle insaani akhlaqiyat aur hmare maqsad ke mutabiq hon."
    }
  }
};

export default function CheckYourKnowledge({ sectionId }: CheckYourKnowledgeProps) {
  const { lang } = useLanguage();
  const currentLang = lang === 'hyd' ? 'ur' : 'en';
  const qData = SECTION_QUESTIONS[sectionId];
  
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  // Sync state with localstorage when checked
  useEffect(() => {
    const savedSelected = localStorage.getItem(`mini_quiz_${sectionId}_selected`);
    const savedChecked = localStorage.getItem(`mini_quiz_${sectionId}_checked`);
    const savedIsCorrect = localStorage.getItem(`mini_quiz_${sectionId}_correct`);
    
    if (savedChecked === 'true') {
      setSelectedIdx(savedSelected ? parseInt(savedSelected, 10) : null);
      setHasChecked(true);
      setIsCorrect(savedIsCorrect === 'true');
      setPointsAwarded(true);
    }
  }, [sectionId]);

  const handleOptionSelect = (index: number) => {
    if (hasChecked) return;
    setSelectedIdx(index);
  };

  const handleVerify = () => {
    if (selectedIdx === null || hasChecked) return;
    
    const correct = selectedIdx === qData.correctIndex;
    setIsCorrect(correct);
    setHasChecked(true);
    
    localStorage.setItem(`mini_quiz_${sectionId}_selected`, selectedIdx.toString());
    localStorage.setItem(`mini_quiz_${sectionId}_checked`, 'true');
    localStorage.setItem(`mini_quiz_${sectionId}_correct`, correct.toString());

    if (correct && !pointsAwarded) {
      setPointsAwarded(true);
      // Award 20 points globally!
      try {
        const currentScoreStr = localStorage.getItem('clay_quiz_score') || '0';
        const currentScore = parseInt(currentScoreStr, 10);
        const newScore = currentScore + 20;
        
        const completedSaved = localStorage.getItem('clay_quiz_completed') || '{}';
        const completed = JSON.parse(completedSaved);
        completed[`mini-quiz-${sectionId}`] = true;
        
        const highSaved = localStorage.getItem('clay_quiz_high_scores') || '{}';
        const highScores = JSON.parse(highSaved);
        highScores[`mini-quiz-${sectionId}`] = 20;

        // Sync back to Firestore (handles local and cloud auto-sync)
        syncQuizProgressToCloud(newScore, completed, highScores);
        
        // Trigger navbar points update
        window.dispatchEvent(new Event('clay_auth_state_changed'));
      } catch (e) {
        console.error("Mini-quiz score update failed:", e);
      }
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setHasChecked(false);
    setIsCorrect(false);
    setPointsAwarded(false);
    localStorage.removeItem(`mini_quiz_${sectionId}_selected`);
    localStorage.removeItem(`mini_quiz_${sectionId}_checked`);
    localStorage.removeItem(`mini_quiz_${sectionId}_correct`);
  };

  return (
    <div className="max-w-3xl mx-auto my-12 p-6 md:p-8 bg-brand-sand/40 border border-brand-slate/10 rounded-3xl text-left relative overflow-hidden backdrop-blur-xs">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-slate/10 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-amber/10 border border-brand-amber/20 rounded-xl text-brand-amber">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase font-extrabold text-brand-amber tracking-wider">
              {lang === 'en' ? "QUIZ TIMEOUT • INTERACTIVE FACT CHECK" : "CHOTA PARIKSHA • INTERACTIVE JAANCH"}
            </span>
            <h4 className="font-display text-lg font-bold text-brand-charcoal">
              {lang === 'en' ? "Check Your Knowledge" : "Apne Dimag ki Jaanch Karein"}
            </h4>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 bg-brand-charcoal text-brand-cream border border-brand-charcoal/10 rounded-full text-xs font-mono font-bold">
          <Sparkles className="w-3 h-3 text-brand-amber animate-pulse" />
          <span>+20 PTS</span>
        </div>
      </div>

      {/* Clay asking questions animation */}
      <div className="flex items-center gap-3 bg-brand-sand/20 border border-brand-slate/10 p-3.5 rounded-2xl select-none mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-amber/5 rounded-full blur-lg pointer-events-none" />
        <div className="relative shrink-0">
          <ClayLogo size={36} className="animate-bounce" />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="block text-[9px] font-mono font-black text-brand-amber uppercase tracking-widest animate-pulse">
            {lang === 'en' ? "CLAY INQUIRY" : "CLAY KA SAWAAL"}
          </span>
          <p className="text-xs font-medium text-brand-charcoal italic">
            {lang === 'en' 
              ? `"Let's test your memory on this section!"`
              : `"Aayein is section par aapke dimaag ka test lein!"`}
          </p>
        </div>
      </div>

      {/* Question Text */}
      <p className="font-sans text-base font-semibold text-brand-charcoal mb-5 leading-relaxed">
        {lang === 'en' ? qData.question.en : qData.question.ur}
      </p>

      {/* Option Buttons */}
      <div className="space-y-3 mb-6">
        {qData.options[currentLang]?.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isThisCorrect = idx === qData.correctIndex;
          
          let btnStyle = "bg-white hover:bg-brand-sand border-brand-slate/10 text-brand-charcoal";
          if (isSelected) {
            btnStyle = "bg-brand-charcoal text-brand-cream border-brand-charcoal";
          }
          if (hasChecked) {
            if (isThisCorrect) {
              btnStyle = "bg-green-500/10 border-green-500/35 text-green-700 font-medium";
            } else if (isSelected && !isCorrect) {
              btnStyle = "bg-red-500/10 border-red-500/35 text-red-700";
            } else {
              btnStyle = "bg-white/50 border-brand-slate/5 text-brand-muted opacity-60 pointer-events-none";
            }
          }

          return (
            <button
              key={`${sectionId}-opt-${idx}`}
              onClick={() => handleOptionSelect(idx)}
              disabled={hasChecked}
              className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${btnStyle}`}
            >
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-mono font-black shrink-0 ${
                isSelected 
                  ? 'bg-brand-amber text-brand-charcoal border-brand-amber' 
                  : 'bg-brand-sand/50 text-brand-muted border-brand-slate/10'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="leading-tight">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Control Actions / Explanations */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          {!hasChecked ? (
            <div className="flex justify-end">
              <button
                onClick={handleVerify}
                disabled={selectedIdx === null}
                className={`px-6 py-3 rounded-2xl text-xs font-bold font-mono tracking-wider transition-all duration-200 shadow-xs cursor-pointer ${
                  selectedIdx !== null
                    ? 'bg-brand-amber hover:bg-brand-amber/95 text-brand-charcoal scale-102 hover:shadow-md'
                    : 'bg-brand-slate/15 text-brand-muted opacity-50 cursor-not-allowed'
                }`}
              >
                {lang === 'en' ? "VERIFY ANSWER" : "JAANCH KAREIN"}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="p-5 border rounded-2xl bg-white/70 backdrop-blur-xs flex flex-col md:flex-row items-start gap-4"
              style={{
                borderColor: isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
              }}
            >
              <div className={`p-3 rounded-xl shrink-0 ${isCorrect ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
                {isCorrect ? <CheckCircle2 className="w-6 h-6 animate-bounce" /> : <AlertTriangle className="w-6 h-6 animate-pulse" />}
              </div>
              
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold font-mono ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {isCorrect 
                      ? (lang === 'en' ? "CORRECT • CONGRATULATIONS!" : "SAHI JAWAB • SHABASH!") 
                      : (lang === 'en' ? "INCORRECT • TRY AGAIN!" : "GALAT JAWAB • DUBARA KOSHISH KAREIN!")}
                  </span>
                  
                  {isCorrect && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-brand-amber bg-brand-amber/10 border border-brand-amber/20 px-2.5 py-0.5 rounded-full">
                      <Award className="w-3 h-3" />
                      <span>CLAIMED +20 PTS</span>
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-brand-charcoal leading-relaxed">
                  {lang === 'en' ? qData.explanation.en : qData.explanation.ur}
                </p>

                {!isCorrect && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleReset}
                      className="text-[10px] font-mono font-bold uppercase text-brand-amber hover:underline tracking-wider cursor-pointer"
                    >
                      {lang === 'en' ? "🔄 TRY OPTION AGAIN" : "🔄 DUBARA TRY KAREIN"}
                    </button>
                    <span className="text-xs text-brand-slate/40">•</span>
                    <span className="text-[10px] font-mono font-bold text-amber-600">
                      {lang === 'en' ? "👇 Diagnostic Quiz Activated Below" : "👇 Diagnostic Quiz Neeche Dekhein"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Knowledge Gaps Diagnostic Quiz (Appears after CheckYourKnowledge) */}
        {hasChecked && (
          <KnowledgeGapDiagnosticQuiz 
            sectionId={sectionId} 
            onResolved={() => {
              // trigger points refresh
              window.dispatchEvent(new Event('clay_auth_state_changed'));
            }} 
          />
        )}
      </div>
    </div>
  );
}
