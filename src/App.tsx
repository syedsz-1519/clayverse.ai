import FloatingNav from './components/FloatingNav';
import Hero from './components/Hero';
import WhatIsAI from './components/WhatIsAI';
import ClayExplainer from './components/ClayExplainer';
import AIFamilyTree from './components/AIFamilyTree';
import GenerativeAI from './components/GenerativeAI';
import PromptingAndRAG from './components/PromptingAndRAG';
import ClosingAndDeeper from './components/ClosingAndDeeper';
import AudioNarrationHub from './components/AudioNarrationHub';
import { Compass, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const sectionAnimation = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal selection:bg-brand-amber/10 selection:text-brand-amber font-sans antialiased overflow-x-hidden">
      {/* Translucent Navigation Layer */}
      <FloatingNav />

      {/* Floating Audio Guide for Clay */}
      <AudioNarrationHub />

      {/* Main Narrative Scroll Flow */}
      <main className="relative z-10 flex flex-col gap-4">

        {/* Layer 1: Hero Intro */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <Hero />
        </motion.div>

        {/* Layer 1: The Basics (What is AI, pocket grid, stage horizons) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <WhatIsAI />
        </motion.div>

        {/* Interactive Host: Clay, the AI Explainer Bot */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <ClayExplainer />
        </motion.div>

        {/* Layer 2: Core Concepts (Circle Nest Map, ML definition + sub-types, Deep Learning) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <AIFamilyTree />
        </motion.div>

        {/* Layer 2: Generative AI & Large Language Models */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <GenerativeAI />
        </motion.div>

        {/* Layer 3: Practical Use (Prompting styles & Retrieval-Augmented Generation flow) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <PromptingAndRAG />
        </motion.div>

        {/* Layer 3 & 4: Closing, Future Outlook, and collapsible glossary terms */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionAnimation}
        >
          <ClosingAndDeeper />
        </motion.div>

      </main>

      {/* Editorial Journal Styled Footer */}
      <footer className="bg-brand-sand/50 border-t border-brand-slate/10 py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 font-display text-base font-bold text-brand-charcoal">
              <Compass className="w-5 h-5 text-brand-amber" />
              <span>AI, <span className="font-light italic text-brand-slate">Explained Simply</span></span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
              An interactive, beginner-safe editorial journal dedicated to demystifying modern artificial intelligence, machine learning structures, and generative algorithms through clean visual logic.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">Narrative Path</h5>
              <ul className="flex flex-col gap-2 text-xs font-medium text-brand-muted">
                <li><a href="#what-is-ai" className="hover:text-brand-amber transition-colors">1. The Basics</a></li>
                <li><a href="#family-tree" className="hover:text-brand-amber transition-colors">2. The Family Tree</a></li>
                <li><a href="#prompting-rag" className="hover:text-brand-amber transition-colors">3. Prompting & RAG</a></li>
                <li><a href="#deeper" className="hover:text-brand-amber transition-colors">4. Deep Dive Glossary</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">Topic Guides</h5>
              <ul className="flex flex-col gap-2 text-xs font-medium text-brand-muted">
                <li><span className="hover:text-brand-amber transition-colors cursor-pointer">Machine Learning</span></li>
                <li><span className="hover:text-brand-amber transition-colors cursor-pointer">Deep Networks</span></li>
                <li><span className="hover:text-brand-amber transition-colors cursor-pointer">Generative Logic</span></li>
                <li><span className="hover:text-brand-amber transition-colors cursor-pointer">Prompt Engineering</span></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h5 className="font-mono text-[10px] font-bold text-brand-amber uppercase tracking-wider mb-3">Journal Ethos</h5>
              <div className="flex flex-col gap-2 text-xs text-brand-muted">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-amber shrink-0" />
                  <span>Tactile HUD v1.0</span>
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-brand-slate shrink-0" />
                  <span>100% Beginner-Safe</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-12 pt-6 border-t border-brand-slate/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-brand-muted">
          <span>© 2026 AI, Explained Simply. Constructed with skeuomorphic-glass hybrid layouts.</span>
          <div className="flex gap-4">
            <span className="hover:text-brand-amber transition-colors cursor-pointer">Editorial Policies</span>
            <span className="hover:text-brand-amber transition-colors cursor-pointer">Privacy Principles</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
