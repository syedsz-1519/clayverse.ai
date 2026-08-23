import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  BrainCircuit, 
  Award, 
  Lightbulb, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { syncQuizProgressToCloud } from '../lib/firebase';
import ClayLogo from './ClayLogo';

export interface DiagnosticItem {
  id: string;
  conceptTitle: { en: string; ur: string };
  diagnosticHint: { en: string; ur: string };
  drillQuestion: { en: string; ur: string };
  options: { en: string[]; ur: string[] };
  correctIndex: number;
  deepExplanation: { en: string; ur: string };
  reinforcementTakeaway: { en: string; ur: string };
}

export const KNOWLEDGE_GAP_DIAGNOSTICS: Record<string, DiagnosticItem> = {
  'basics': {
    id: 'gap-basics',
    conceptTitle: {
      en: "Machine Learning vs Deterministic Algorithms",
      ur: "Machine Learning aur Riwayati Algorithms ka Farq"
    },
    diagnosticHint: {
      en: "Misconception Detected: Traditional code executes explicit if-else rules. Machine Learning reverses this by inferring rules from (Data + Outcomes).",
      ur: "Ghalat-fehmi ka Ilaj: Riwayati code me insaan khud 'if-else' rules likhta hai. Machine Learning me computer data aur answers dekh kar khud rules dhoondta hai."
    },
    drillQuestion: {
      en: "If you want a computer to recognize spam emails without writing 5,000 keyword rules manually, which approach should you use?",
      ur: "Agar aap computer se spam emails pehchanwana chahte hain baghair 5,000 lafzon ki list manually banaye, toh kaunsa tareeqa behtar hai?"
    },
    options: {
      en: [
        "Write 10,000 hardcoded nested if/else statements",
        "Train a Machine Learning classifier on 50,000 labeled spam/non-spam emails so it learns statistical patterns",
        "Increase the computer CPU clock speed without changing code",
        "Delete all outgoing emails automatically"
      ],
      ur: [
        "10,000 hardcoded if/else statements likhein",
        "50,000 spam/non-spam emails par ML model train karein taake woh patterns seekh le",
        "Code badle baghair sirf CPU ki speed barha dein",
        "Saari emails ko delete kar dein"
      ]
    },
    correctIndex: 1,
    deepExplanation: {
      en: "Spot on! In Machine Learning, statistical representations replace hardcoded conditional heuristics, enabling generalization across unseen emails.",
      ur: "Shabash! ML model hazaron emails me patterns dekh kar khud samajh jata hai ke spam email ka andaz kaisa hota hai."
    },
    reinforcementTakeaway: {
      en: "Key Takeaway: Traditional = Rules + Data -> Answers. Machine Learning = Data + Answers -> Rules.",
      ur: "Aham Nuqta: Traditional = Rules + Data -> Answers. Machine Learning = Data + Answers -> Rules."
    }
  },
  'family-tree': {
    id: 'gap-family-tree',
    conceptTitle: {
      en: "Transformer Architecture & Self-Attention Mechanics",
      ur: "Transformers aur Self-Attention ka Mechanism"
    },
    diagnosticHint: {
      en: "Misconception Detected: Recurrent models processed words sequentially (one by one). Transformers process the entire context window simultaneously using Self-Attention matrices.",
      ur: "Ghalat-fehmi ka Ilaj: Purane RNN models aik aik lafz karke parhte the. Transformer aik sath poore jumlay ko dekhta hai."
    },
    drillQuestion: {
      en: "Why is 'Self-Attention' so much faster to train than older RNNs (Recurrent Neural Networks)?",
      ur: "Self-Attention purane RNNs ke muqable me train hone me itna tez kyun hai?"
    },
    options: {
      en: [
        "It skips mathematical gradient calculations completely",
        "It processes all tokens in parallel across GPU matrix cores rather than step-by-step sequential recursion",
        "It only works on English words with 4 letters",
        "It stores text as uncompressed audio files"
      ],
      ur: [
        "Ye mathematical calculations ko chhor deta hai",
        "Ye aik aik lafz ki bajaye poore jumlay ko aik sath parallel me GPUs par process karta hai",
        "Ye sirf 4 harf wale lafzon par kaam karta hai",
        "Ye text ko audio file me save karta hai"
      ]
    },
    correctIndex: 1,
    deepExplanation: {
      en: "Exactly right! Parallel processing across GPUs unlocked massive scaling, allowing LLMs to train on trillions of web tokens.",
      ur: "Bilkul sahi! Parallel processing ki wajah se models hazaron GPUs par trillion tokens ko boht tezi se train kar lete hain."
    },
    reinforcementTakeaway: {
      en: "Key Takeaway: Self-Attention calculates pairwise token relevance simultaneously, eliminating the sequential processing bottleneck.",
      ur: "Aham Nuqta: Self-Attention jumlay ke har lafz ka doosre lafzon se talluq aik sath measure karta hai."
    }
  },
  'prompting-rag': {
    id: 'gap-prompting-rag',
    conceptTitle: {
      en: "RAG (Retrieval-Augmented Generation) Architecture",
      ur: "RAG aur Vector Database ka Kirdar"
    },
    diagnosticHint: {
      en: "Misconception Detected: Fine-tuning modifies neural model weights. RAG acts like an 'open-book' prompt injector without changing internal weights.",
      ur: "Ghalat-fehmi ka Ilaj: Fine-tuning me model ke andar weights badal te hain. RAG me model ke prompt me live documents insert kiye jaate hain."
    },
    drillQuestion: {
      en: "A hospital needs an AI assistant that answers questions from daily updated patient records. Why is RAG the right solution rather than fine-tuning?",
      ur: "Ek hospital ko naye mareezon ke rozana records par AI assistant chahiye. RAG fine-tuning se behtar kyun hai?"
    },
    options: {
      en: [
        "Fine-tuning requires re-training the whole model every single hour which is slow, risky, and expensive; RAG fetches live patient records instantly into context",
        "RAG operates without using any electricity",
        "Fine-tuning turns all numbers into letters",
        "RAG deletes patient records after reading them once"
      ],
      ur: [
        "Fine-tuning har ghante karna boht mehanga aur namumkin hai; RAG foran live file dhoond kar prompt me daal deta hai",
        "RAG me bijli nahi lagti",
        "Fine-tuning saare numbers ko letters me badalti hai",
        "RAG files ko delete kar deta hai"
      ]
    },
    correctIndex: 0,
    deepExplanation: {
      en: "Perfect! RAG provides grounded, verifiable references from live databases while preventing stale hallucinations without costly retraining runs.",
      ur: "Zabardast! RAG naye data ko foran vector search se nikal kar AI ko de deta hai taake woh bilkul taaza aur sach jawab de sake."
    },
    reinforcementTakeaway: {
      en: "Key Takeaway: Fine-tuning teaches models new *styles/tasks*. RAG injects *fresh facts and proprietary documents*.",
      ur: "Aham Nuqta: Fine-tuning naya andaz seekhati hai; RAG taza data aur documents provide karta hai."
    }
  },
  'deeper': {
    id: 'gap-deeper',
    conceptTitle: {
      en: "AI Alignment, Safety Guardrails & RLHF",
      ur: "AI Alignment aur Safety Guardrails"
    },
    diagnosticHint: {
      en: "Misconception Detected: Alignment is not about code compilation speed; it is ensuring AI goals conform to human ethics, honesty, and safety.",
      ur: "Ghalat-fehmi ka Ilaj: Alignment ka talluq speed se nahi balki AI ko insaani akhlaaq aur safety ke mutabiq chalane se hai."
    },
    drillQuestion: {
      en: "Which technique is commonly used to align raw Base LLMs so they become helpful, harmless conversational assistants?",
      ur: "Base LLMs ko safe aur helpful banane ke liye aam taur par kaunsi technique use ki jati hai?"
    },
    options: {
      en: [
        "Deleting 90% of the model's layers",
        "RLHF (Reinforcement Learning from Human Feedback) with safety reward models",
        "Turning off the server fans during inference",
        "Converting Python code into HTML"
      ],
      ur: [
        "Model ke 90% hisse ko delete karna",
        "RLHF (Reinforcement Learning from Human Feedback) aur safety reward models",
        "Server ke fans band karna",
        "Python ko HTML me convert karna"
      ]
    },
    correctIndex: 1,
    deepExplanation: {
      en: "Correct! RLHF uses human preference signals to steer model outputs toward helpfulness and away from harmful responses.",
      ur: "Bilkul sahi! Insaan model ke jawabat ko rate karte hain taake model samajh sake ke safe aur madadgar jawab kaise dena hai."
    },
    reinforcementTakeaway: {
      en: "Key Takeaway: Base models predict next tokens. Alignment fine-tuning transforms raw predictors into safe, goal-aligned agents.",
      ur: "Aham Nuqta: Alignment raw models ko safe aur insaani bhalayi ke qabil banata hai."
    }
  }
};

interface KnowledgeGapDiagnosticQuizProps {
  sectionId: string;
  onResolved: () => void;
}

export default function KnowledgeGapDiagnosticQuiz({
  sectionId,
  onResolved
}: KnowledgeGapDiagnosticQuizProps) {
  const { lang } = useLanguage();
  const currentLang = lang === 'hyd' ? 'ur' : 'en';
  const diagnostic = KNOWLEDGE_GAP_DIAGNOSTICS[sectionId] || KNOWLEDGE_GAP_DIAGNOSTICS['basics'];

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isResolved, setIsResolved] = useState<boolean>(() => {
    return localStorage.getItem(`clay_gap_resolved_${sectionId}`) === 'true';
  });

  const handleVerify = () => {
    if (selectedIdx === null || hasChecked) return;
    const correct = selectedIdx === diagnostic.correctIndex;
    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      setIsResolved(true);
      localStorage.setItem(`clay_gap_resolved_${sectionId}`, 'true');
      
      // Award +25 Diagnostic XP
      try {
        const currentScoreStr = localStorage.getItem('clay_quiz_score') || '0';
        const currentScore = parseInt(currentScoreStr, 10);
        const newScore = currentScore + 25;
        
        const completedSaved = localStorage.getItem('clay_quiz_completed') || '{}';
        const completed = JSON.parse(completedSaved);
        completed[`gap-resolved-${sectionId}`] = true;
        
        const highSaved = localStorage.getItem('clay_quiz_high_scores') || '{}';
        const highScores = JSON.parse(highSaved);
        highScores[`gap-resolved-${sectionId}`] = 25;

        syncQuizProgressToCloud(newScore, completed, highScores);
        window.dispatchEvent(new Event('clay_auth_state_changed'));
        window.dispatchEvent(new CustomEvent('clay_gap_updated', { detail: { sectionId, resolved: true } }));
      } catch (e) {
        console.error("Gap resolution score update error:", e);
      }

      onResolved();
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setHasChecked(false);
    setIsCorrect(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-amber-500/10 via-brand-sand/40 to-orange-500/10 border-2 border-amber-500/30 rounded-3xl relative overflow-hidden shadow-sm"
    >
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/20 text-amber-700 rounded-xl">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-black uppercase text-amber-700 tracking-wider">
                {lang === 'en' ? "KNOWLEDGE GAP DIAGNOSTIC" : "KNOWLEDGE GAP DIAGNOSTIC"}
              </span>
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-800 text-[9px] font-mono font-black rounded-full">
                {isResolved ? "GAP RESOLVED" : "ACTIVE DIAGNOSIS"}
              </span>
            </div>
            <h4 className="font-display text-sm sm:text-base font-black text-brand-charcoal">
              {lang === 'en' ? diagnostic.conceptTitle.en : diagnostic.conceptTitle.ur}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded-full text-xs font-mono font-black">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>+25 XP BONUS</span>
        </div>
      </div>

      {/* Diagnosis insight */}
      <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-500/20 mb-4 flex items-start gap-3">
        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-brand-charcoal leading-relaxed font-medium">
          {lang === 'en' ? diagnostic.diagnosticHint.en : diagnostic.diagnosticHint.ur}
        </p>
      </div>

      {/* Drill Question */}
      <div className="mb-4">
        <span className="block text-[10px] font-mono font-bold text-brand-muted uppercase mb-1">
          {lang === 'en' ? "DIAGNOSTIC DRILL QUESTION:" : "DIAGNOSTIC SAWAAL:"}
        </span>
        <p className="font-sans text-sm font-bold text-brand-charcoal">
          {lang === 'en' ? diagnostic.drillQuestion.en : diagnostic.drillQuestion.ur}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-5">
        {diagnostic.options[currentLang]?.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isThisCorrect = idx === diagnostic.correctIndex;

          let btnStyle = "bg-white hover:bg-amber-50/50 border-brand-slate/15 text-brand-charcoal";
          if (isSelected) {
            btnStyle = "bg-brand-charcoal text-white border-brand-charcoal";
          }
          if (hasChecked) {
            if (isThisCorrect) {
              btnStyle = "bg-emerald-500/15 border-emerald-500/40 text-emerald-800 font-bold";
            } else if (isSelected && !isCorrect) {
              btnStyle = "bg-red-500/15 border-red-500/40 text-red-700";
            } else {
              btnStyle = "bg-white/40 border-brand-slate/10 text-brand-muted opacity-50 pointer-events-none";
            }
          }

          return (
            <button
              key={`gap-opt-${idx}`}
              onClick={() => {
                if (!hasChecked) setSelectedIdx(idx);
              }}
              disabled={hasChecked}
              className={`w-full text-left px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
            >
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono font-black shrink-0 ${
                isSelected 
                  ? 'bg-amber-500 text-brand-charcoal border-amber-500' 
                  : 'bg-brand-sand/60 text-brand-slate border-brand-slate/20'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Action / Result */}
      <div>
        <AnimatePresence mode="wait">
          {!hasChecked ? (
            <div className="flex justify-end">
              <button
                onClick={handleVerify}
                disabled={selectedIdx === null}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer shadow-xs ${
                  selectedIdx !== null
                    ? 'bg-amber-500 hover:bg-amber-600 text-brand-charcoal hover:shadow-md'
                    : 'bg-brand-slate/20 text-brand-muted opacity-50 cursor-not-allowed'
                }`}
              >
                {lang === 'en' ? "VERIFY DIAGNOSTIC" : "JAANCH KAREIN"}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border bg-white/90 space-y-3"
              style={{
                borderColor: isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${isCorrect ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/15 text-red-500'}`}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 animate-bounce" /> : <AlertCircle className="w-5 h-5 animate-pulse" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-black ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                      {isCorrect 
                        ? (lang === 'en' ? "KNOWLEDGE GAP RESOLVED! (+25 XP)" : "GHAREE KNOWLEDGE CLEAR HOGAYI! (+25 XP)")
                        : (lang === 'en' ? "STILL UNCLEAR • REVIEW TAKEAWAY" : "DUBARA SAMJHEIN")}
                    </span>
                    {isCorrect && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-amber-700 bg-amber-500/15 px-2 py-0.5 rounded-full">
                        <Award className="w-3 h-3" />
                        <span>MASTERED</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-charcoal leading-relaxed">
                    {lang === 'en' ? diagnostic.deepExplanation.en : diagnostic.deepExplanation.ur}
                  </p>
                </div>
              </div>

              {/* Reinforcement Box */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-900 font-medium">
                {lang === 'en' ? diagnostic.reinforcementTakeaway.en : diagnostic.reinforcementTakeaway.ur}
              </div>

              {!isCorrect && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-xs font-mono font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? "Retry Diagnostic Drill" : "Dubara Drill Karein"}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
