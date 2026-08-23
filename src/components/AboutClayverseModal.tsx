import React from 'react';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Globe2, 
  Users, 
  ShieldCheck, 
  Award, 
  Languages, 
  School, 
  Code, 
  CheckCircle2, 
  ArrowRight, 
  X,
  ExternalLink,
  Cpu,
  Smile,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import ClayLogo from './ClayLogo';

interface AboutClayverseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutClayverseModal({ isOpen, onClose }: AboutClayverseModalProps) {
  const { lang } = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-[#FDFBF7] border-2 border-brand-amber/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 text-left max-h-[90vh] flex flex-col"
        >
          {/* Top Header Banner */}
          <div className="relative bg-gradient-to-br from-brand-charcoal via-[#262A33] to-[#1E2128] text-white p-6 sm:p-8 border-b border-brand-amber/20 shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-brand-sand transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-md">
                <ClayLogo size={28} />
              </div>
              <div>
                <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-brand-amber bg-brand-amber/20 border border-brand-amber/30 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  About Clayverse AI & Our Mission
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Democratizing AI for Every Mind
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-brand-sand/80 max-w-2xl leading-relaxed mt-2">
              {lang === 'en'
                ? "A 100% free, beginner-safe grassroots educational movement bringing Artificial Intelligence literacy to non-native English learners, Madrasa scholars, Telugu speakers, and regional communities worldwide."
                : lang === 'te'
                ? "ప్రతి ఒక్కరికీ కృత్రిమ మేధస్సు (AI) ఉచితంగా, సులభంగా అర్థమయ్యేలా అందించే ప్రజా విద్యా వేదిక."
                : "Miya, ye ek 100% mufat aur asaan mission hai jahan Madrasa ke bache, Telugu aur doosri zabaano ke log bina dar ke AI seekh sakte hain."}
            </p>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8 scrollbar-thin text-brand-charcoal text-left">
            
            {/* 1. Who Are We & What Are We? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-brand-slate/15 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-brand-amber font-mono font-bold text-xs uppercase">
                  <Users className="w-4 h-4" />
                  <span>Who Are We?</span>
                </div>
                <h3 className="font-display font-black text-base text-brand-charcoal">
                  Grassroots Educators & Engineers
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  Founded by <strong>Syed Shahnawaz</strong> and a collective of passionate technologists, educators, and community volunteers dedicated to eliminating gatekeeping in tech education. We believe understanding AI should not depend on having an elite engineering degree or fluent English proficiency.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-brand-slate/15 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-orange-600 font-mono font-bold text-xs uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>What Is Clayverse AI?</span>
                </div>
                <h3 className="font-display font-black text-base text-brand-charcoal">
                  Tactile & Jargon-Free Learning
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed">
                  An interactive editorial journal hosted by <strong>Clay</strong> (a friendly stop-motion-inspired explainer bot). We convert heavy neural network math, transformer matrices, and vector embeddings into everyday tangible mental models, visual token sandboxes, and audio explanations.
                </p>
              </div>
            </div>

            {/* 2. Who Is This Built For? (Madrasa, Non-Native & Regional Languages) */}
            <div className="p-6 rounded-3xl bg-amber-500/10 border border-brand-amber/30 space-y-4">
              <div className="flex items-center gap-2 text-brand-amber-dark font-mono font-black text-xs uppercase tracking-wider">
                <Heart className="w-4 h-4 fill-brand-amber/30" />
                <span>Our Core Purpose & Audience</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-black text-brand-charcoal">
                Why We Built This: Bridging the Grassroots Language & Education Divide
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white border border-brand-slate/15 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold">
                    <School className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">Madrasa & Traditional Scholars</h4>
                  <p className="text-[11px] text-brand-slate leading-relaxed">
                    Designed with respectful cultural framing and authentic Hyderabadi & classical Urdu vocabulary, enabling students in Madrasas and religious institutions to master AI tools without feeling alienated.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-brand-slate/15 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-700 flex items-center justify-center font-bold">
                    <Languages className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">Telugu & Indian Languages</h4>
                  <p className="text-[11px] text-brand-slate leading-relaxed">
                    Comprehensive localization into Telugu, Urdu, and a roadmap covering all 22+ Scheduled Indian Languages so vernacular students can think, ask, and build in their mother tongue.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-brand-slate/15 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-brand-charcoal">Non-Native English Learners</h4>
                  <p className="text-[11px] text-brand-slate leading-relaxed">
                    Zero complex calculus and zero intimidating tech jargon. Everything is explained with tactile analogies (cooking recipes, pet recognition, library shelves, and stop-motion animations).
                  </p>
                </div>
              </div>
            </div>

            {/* 3. What Kind of Work Are We Doing? */}
            <div className="space-y-3">
              <h3 className="font-display text-base font-black text-brand-charcoal flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-amber" />
                <span>The Work We Are Actively Doing</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-brand-slate/15 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-charcoal block">9 Interactive Curriculum Chapters</span>
                    <span className="text-brand-slate text-[11.5px]">From foundational Pattern Recognition to RAG systems and LLM Next-Token predictors.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-brand-slate/15 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-charcoal block">Live AI Mock Interviewer HUD</span>
                    <span className="text-brand-slate text-[11.5px]">Real-time camera & voice simulation to prepare non-native learners for real tech interviews.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-brand-slate/15 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-charcoal block">Spaced-Repetition Memory Flashcards</span>
                    <span className="text-brand-slate text-[11.5px]">Tactile flip cards reinforcing AI fundamentals for long-term memory retention.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-brand-slate/15 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-charcoal block">Google Classroom Hub & Quizzes</span>
                    <span className="text-brand-slate text-[11.5px]">Assignment stream sync, daily study streaks, certified badges, and live Arena quizzes.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Our 100% Free Guarantee */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-emerald-950">100% Free Forever Pledge</h4>
                  <p className="text-xs text-emerald-800">
                    No subscriptions, no hidden paywalls, no ads. Built as a public educational service for humanity.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-brand-charcoal hover:bg-black text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Start Learning Now
              </button>
            </div>

          </div>

          {/* Footer note */}
          <div className="p-4 bg-brand-sand/50 border-t border-brand-slate/10 flex items-center justify-between text-[11px] text-brand-muted shrink-0 px-6 sm:px-8">
            <span>© 2026 Clayverse AI • Syed Shahnawaz</span>
            <div className="flex items-center gap-1.5 font-bold text-brand-amber">
              <Heart className="w-3.5 h-3.5 fill-brand-amber" />
              <span>Built with love for all languages</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
