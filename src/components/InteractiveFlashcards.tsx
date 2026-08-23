import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  CheckCircle2, 
  Layers, 
  Search, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  ArrowUpRight, 
  Filter, 
  Check, 
  RefreshCcw, 
  HelpCircle,
  Grid,
  CreditCard,
  Zap,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { roadmapSections, type Section, type Term } from '../data/roadmapTerms';
import { audioEngine } from '../lib/audioEngine';
import { useLanguage } from '../hooks/useLanguage';
import ReadSectionButton from './ReadSectionButton';
import CopyCodeButton from './CopyCodeButton';

interface FlashcardItem {
  id: string;
  term: string;
  definition: string;
  sectionId: string;
  sectionTitle: string;
  sectionNumber: string;
  analogy?: string;
}

// Extract and enrich all terms across the entire roadmap
const ALL_FLASHCARDS: FlashcardItem[] = roadmapSections.flatMap((sec) =>
  sec.terms.map((t, idx) => {
    let analogy: string | undefined;
    const lower = t.title.toLowerCase();

    if (lower.includes('supervised')) {
      analogy = "Like learning with a teacher who grades your homework with an answer key.";
    } else if (lower.includes('unsupervised')) {
      analogy = "Like sorting a box of mixed LEGO bricks into piles by color without instructions.";
    } else if (lower.includes('reinforcement')) {
      analogy = "Like training a puppy with treats when it does a good trick and no treats when it doesn't.";
    } else if (lower.includes('neural network')) {
      analogy = "Like a stadium doing 'the wave' where each fan passes energy to the next row.";
    } else if (lower.includes('transformer')) {
      analogy = "Like reading a sentence and instantly connecting every word to its context simultaneously.";
    } else if (lower.includes('rag') || lower.includes('retrieval')) {
      analogy = "Like taking an open-book exam where you look up verified encyclopedia facts before answering.";
    } else if (lower.includes('hallucination')) {
      analogy = "Like a confident friend telling an elaborate made-up story with absolute conviction.";
    } else if (lower.includes('overfitting')) {
      analogy = "Like memorizing the exact practice exam questions word-for-word, but failing when real questions change slightly.";
    } else if (lower.includes('token')) {
      analogy = "Like syllable puzzle pieces that language models digest one piece at a time.";
    } else if (lower.includes('embedding') || lower.includes('vector')) {
      analogy = "Like placing words on a giant 3D map where similar ideas (king & queen, pizza & burger) sit close together.";
    } else if (lower.includes('fine-tuning')) {
      analogy = "Like sending a general doctor to a 6-month specialized cardiology residency.";
    } else if (lower.includes('zero-shot')) {
      analogy = "Like solving a brand new riddle on your very first try without any practice examples.";
    } else if (lower.includes('temperature')) {
      analogy = "Low temperature is like an accountant playing by the book; high temperature is like a jazz musician improvising.";
    }

    return {
      id: `${sec.id}-term-${idx}`,
      term: t.title,
      definition: t.definition,
      sectionId: sec.id,
      sectionTitle: sec.title,
      sectionNumber: sec.number,
      analogy
    };
  })
);

export default function InteractiveFlashcards() {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [onlyReviewNeeded, setOnlyReviewNeeded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load mastered flashcards from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('clay_mastered_terms');
      if (saved) {
        setMasteredIds(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
  }, []);

  // Save mastered flashcards to localStorage
  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('clay_mastered_terms', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const resetAllMastery = () => {
    if (window.confirm(lang === 'en' ? 'Reset all flashcard mastery progress?' : 'Sari flashcard progress reset karein?')) {
      setMasteredIds([]);
      try {
        localStorage.removeItem('clay_mastered_terms');
      } catch {
        // ignore
      }
    }
  };

  // Filter terms based on category, search, and review filter
  const filteredCards = useMemo(() => {
    return ALL_FLASHCARDS.filter((card) => {
      // Category filter
      if (selectedCategory !== 'all' && card.sectionId !== selectedCategory) {
        return false;
      }
      // Review only filter
      if (onlyReviewNeeded && masteredIds.includes(card.id)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTerm = card.term.toLowerCase().includes(q);
        const matchesDef = card.definition.toLowerCase().includes(q);
        const matchesSec = card.sectionTitle.toLowerCase().includes(q);
        return matchesTerm || matchesDef || matchesSec;
      }
      return true;
    });
  }, [selectedCategory, onlyReviewNeeded, masteredIds, searchQuery]);

  // Adjust index if out of bounds after filtering
  useEffect(() => {
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length]);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  // Keyboard navigation for deck mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in search input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (currentCard) {
          toggleMastered(currentCard.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard, filteredCards.length]);

  const handleNext = () => {
    if (filteredCards.length <= 1) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    if (filteredCards.length <= 1) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const rand = Math.floor(Math.random() * filteredCards.length);
    setCurrentIndex(rand);
  };

  const handleSpeak = (card: FlashcardItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (speakingId === card.id) {
      audioEngine.stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(card.id);
    const speechText = `${card.term}. ${card.definition}${card.analogy ? ` For example: ${card.analogy}` : ''}`;
    audioEngine.speak(speechText, lang, () => {
      setSpeakingId(null);
    });
  };

  const jumpToSection = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalMasteredCount = masteredIds.length;
  const totalTermsCount = ALL_FLASHCARDS.length;
  const masteryPercentage = Math.round((totalMasteredCount / totalTermsCount) * 100);

  return (
    <section 
      id="flashcards" 
      ref={containerRef}
      className="max-w-5xl mx-auto px-6 py-12 scroll-mt-20"
    >
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-brand-amber/20 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-amber/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center shrink-0 shadow-sm text-brand-amber-dark">
              <CreditCard className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber-dark border border-brand-amber/30">
                  {lang === 'en' ? 'Active Recall Engine' : 'Hifz-o-Faham Deck'}
                </span>
                <span className="text-xs font-mono font-bold text-brand-slate">
                  {ALL_FLASHCARDS.length} {lang === 'en' ? 'Core Terms' : 'Alfaz'}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
                {lang === 'en' ? 'Interactive AI Flashcards' : 'Interactive AI Flashcards'}
              </h2>
              <p className="text-sm text-brand-slate max-w-xl mt-1 mb-3">
                {lang === 'en' 
                  ? 'Flip cards to test your understanding of machine learning architectures, training pipelines, and generative concepts.'
                  : 'Card paltiye aur machine learning, deep neural networks, aur generative AI ki buniyaad ko dimaag mein pakka karein.'}
              </p>
              <ReadSectionButton sectionId="flashcards" variant="compact" />
            </div>
          </div>

          {/* Retention & Mastery Progress Metric Box */}
          <div className="bg-brand-sand/60 rounded-2xl p-4 border border-brand-slate/10 flex items-center gap-4 shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-brand-slate/15"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-amber transition-all duration-500"
                  strokeDasharray={`${masteryPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute font-mono text-xs font-black text-brand-charcoal">
                {masteryPercentage}%
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-brand-amber" />
                <span>{totalMasteredCount} / {totalTermsCount} Mastered</span>
              </div>
              <p className="text-[11px] text-brand-slate mt-0.5">
                {totalMasteredCount === totalTermsCount 
                  ? (lang === 'en' ? 'All terms mastered! 🎉' : 'Shabash! Sab mukammal!') 
                  : (lang === 'en' ? `${totalTermsCount - totalMasteredCount} left to master` : `${totalTermsCount - totalMasteredCount} bache hain`)}
              </p>
            </div>
          </div>
        </div>

        {/* Controls Bar (Category Filter, Search, Mode Toggle) */}
        <div className="mt-6 pt-6 border-t border-brand-slate/10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Categories Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border ${
                selectedCategory === 'all'
                  ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-sm'
                  : 'bg-white/80 text-brand-slate hover:bg-brand-sand border-brand-slate/15'
              }`}
            >
              {lang === 'en' ? 'All Sections' : 'Sabhi Hissay'} ({ALL_FLASHCARDS.length})
            </button>
            {roadmapSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedCategory(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                  selectedCategory === sec.id
                    ? 'bg-brand-amber text-white border-brand-amber shadow-sm'
                    : 'bg-white/80 text-brand-slate hover:bg-brand-sand border-brand-slate/15'
                }`}
              >
                {sec.number}. {sec.title}
              </button>
            ))}
          </div>

          {/* Search & View Mode Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-brand-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search terms...' : 'Dhoondein...'}
                className="w-full pl-8 pr-3 py-1.5 bg-white/90 border border-brand-slate/20 rounded-xl text-xs text-brand-charcoal placeholder:text-brand-slate/60 focus:outline-none focus:border-brand-amber focus:ring-1 focus:ring-brand-amber shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-slate hover:text-brand-charcoal text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Deck vs Grid Toggle */}
            <div className="bg-brand-sand/70 p-1 rounded-xl border border-brand-slate/15 flex items-center gap-1">
              <button
                onClick={() => setViewMode('deck')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'deck'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-brand-slate hover:text-brand-charcoal'
                }`}
                title="Deck Flip Mode (One by One)"
              >
                <CreditCard className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-brand-charcoal shadow-sm'
                    : 'text-brand-slate hover:text-brand-charcoal'
                }`}
                title="Grid Overview Mode"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Content Area */}
      {filteredCards.length === 0 ? (
        <div className="bg-white/80 rounded-3xl p-12 text-center border border-dashed border-brand-slate/20">
          <HelpCircle className="w-12 h-12 text-brand-slate/40 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-brand-charcoal">
            {lang === 'en' ? 'No flashcards found' : 'Koi flashcard nahi mila'}
          </h3>
          <p className="text-xs text-brand-slate mt-1 max-w-sm mx-auto">
            {lang === 'en'
              ? 'Try adjusting your search query or selecting a different section filter.'
              : 'Apna search word badlein ya doosra section muntakhib karein.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyReviewNeeded(false);
            }}
            className="mt-4 px-4 py-2 bg-brand-amber text-white text-xs font-bold rounded-xl hover:bg-brand-amber-dark transition-all cursor-pointer"
          >
            {lang === 'en' ? 'Reset Filters' : 'Filters Reset Karein'}
          </button>
        </div>
      ) : viewMode === 'deck' ? (
        /* DECK VIEW: Single Card with 3D Flip */
        <div className="flex flex-col items-center">
          {/* Deck Status Bar */}
          <div className="w-full max-w-xl flex items-center justify-between text-xs text-brand-slate mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-brand-charcoal">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
              <span className="text-brand-slate/40">•</span>
              <span className="font-semibold text-brand-amber truncate max-w-[200px]">
                {currentCard.sectionTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-brand-sand text-brand-charcoal border border-brand-slate/20 rounded-lg font-bold text-[11px] cursor-pointer transition-all active:scale-95 shadow-sm"
                title="Shuffle Flashcard Deck"
              >
                <Shuffle className="w-3 h-3 text-brand-amber" />
                <span>{lang === 'en' ? 'Shuffle' : 'Shuffle'}</span>
              </button>

              <button
                onClick={() => setOnlyReviewNeeded(!onlyReviewNeeded)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] border cursor-pointer transition-all ${
                  onlyReviewNeeded
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white hover:bg-brand-sand text-brand-charcoal border-brand-slate/20'
                }`}
                title="Show only unmastered flashcards"
              >
                <Filter className="w-3 h-3" />
                <span>{lang === 'en' ? 'Needs Review' : 'Baqi'}</span>
              </button>
            </div>
          </div>

          {/* 3D Perspective Flashcard Container */}
          <div className="w-full max-w-xl h-80 sm:h-96 [perspective:1200px]">
            <motion.div
              className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-white to-[#FDFBF7] rounded-3xl p-6 sm:p-8 border-2 border-brand-amber/30 shadow-xl flex flex-col justify-between select-none">
                {/* Front Header */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-brand-amber/10 text-brand-amber-dark border border-brand-amber/25 text-[11px] font-black uppercase tracking-wider">
                    {currentCard.sectionNumber} • {currentCard.sectionTitle}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Voice Read Button */}
                    <button
                      onClick={(e) => handleSpeak(currentCard, e)}
                      className={`p-2 rounded-xl transition-all cursor-pointer border ${
                        speakingId === currentCard.id
                          ? 'bg-brand-amber text-white border-brand-amber animate-pulse'
                          : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal border-brand-slate/10'
                      }`}
                      title="Listen with Clay voice"
                    >
                      {speakingId === currentCard.id ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Mastered Star/Check */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(currentCard.id);
                      }}
                      className={`p-2 rounded-xl transition-all cursor-pointer border ${
                        masteredIds.includes(currentCard.id)
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                          : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal border-brand-slate/10'
                      }`}
                      title={masteredIds.includes(currentCard.id) ? 'Mastered (Click to unmark)' : 'Mark as Mastered'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Front Center: Term Title */}
                <div className="text-center py-4 my-auto">
                  <span className="text-[11px] font-bold text-brand-slate/60 uppercase tracking-widest block mb-2">
                    {lang === 'en' ? 'AI Key Term' : 'AI Ka Sabaq'}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight px-4 leading-tight">
                    {currentCard.term}
                  </h3>
                </div>

                {/* Front Footer: Hint & Flip cue */}
                <div className="flex items-center justify-between text-xs text-brand-slate pt-4 border-t border-brand-slate/10">
                  <span className="text-[11px] font-semibold text-brand-muted">
                    {lang === 'en' ? 'Press Space or Click' : 'Space dabayein ya Click'}
                  </span>
                  <div className="flex items-center gap-1.5 text-brand-amber font-black text-xs">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Flip for Definition' : 'Tareef Dekhein'}</span>
                  </div>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-brand-charcoal text-white rounded-3xl p-6 sm:p-8 border-2 border-brand-amber/40 shadow-2xl flex flex-col justify-between select-none">
                {/* Back Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber text-brand-charcoal font-mono">
                      Definition
                    </span>
                    <span className="text-xs font-bold text-brand-sand/80 truncate max-w-[180px]">
                      {currentCard.term}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy Flashcard Button */}
                    <CopyCodeButton
                      text={`${currentCard.term} (${currentCard.sectionTitle})\n\nDefinition:\n${currentCard.definition}${currentCard.analogy ? `\n\nAnalogy:\n${currentCard.analogy}` : ''}`}
                      label={lang === 'en' ? "Copy" : "Copy"}
                      variant="dark"
                      showIconOnly={true}
                      title={lang === 'en' ? "Copy flashcard text" : "Flashcard text copy karo"}
                      className="p-2! rounded-xl!"
                    />

                    {/* Voice Read Button */}
                    <button
                      onClick={(e) => handleSpeak(currentCard, e)}
                      className={`p-2 rounded-xl transition-all cursor-pointer border ${
                        speakingId === currentCard.id
                          ? 'bg-brand-amber text-white border-brand-amber animate-pulse'
                          : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'
                      }`}
                      title="Listen with Clay voice"
                    >
                      {speakingId === currentCard.id ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Mastered button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(currentCard.id);
                      }}
                      className={`p-2 rounded-xl transition-all cursor-pointer border ${
                        masteredIds.includes(currentCard.id)
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-white/10 hover:bg-white/20 text-white/80 border-white/10'
                      }`}
                      title={masteredIds.includes(currentCard.id) ? 'Mastered' : 'Mark as Mastered'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Back Center: Comprehensive Definition & Analogy */}
                <div className="my-auto space-y-3 pr-1 overflow-y-auto max-h-44 scrollbar-thin">
                  <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                    {currentCard.definition}
                  </p>

                  {currentCard.analogy && (
                    <div className="bg-white/10 border border-brand-amber/30 rounded-2xl p-3 text-xs flex items-start gap-2">
                      <Zap className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                      <div className="text-brand-sand">
                        <span className="font-bold text-white block mb-0.5">
                          {lang === 'en' ? 'Mental Analogy:' : 'Aasan Misal:'}
                        </span>
                        {currentCard.analogy}
                      </div>
                    </div>
                  )}
                </div>

                {/* Back Footer: Jump to Section & Flip Back */}
                <div className="flex items-center justify-between text-xs text-white/60 pt-3 border-t border-white/10">
                  <button
                    onClick={(e) => jumpToSection(currentCard.sectionId, e)}
                    className="flex items-center gap-1 text-brand-amber hover:text-brand-amber-light font-bold text-xs cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Read in Guide' : 'Sabaq Mein Padhein'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1.5 text-brand-sand/80 font-bold text-xs">
                    <RotateCw className="w-3 h-3" />
                    <span>{lang === 'en' ? 'Flip Back' : 'Wapas'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Deck Controls (Previous, Next, Mastered Toggle) */}
          <div className="w-full max-w-xl flex items-center justify-between mt-6 gap-3">
            <button
              onClick={handlePrev}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-brand-sand text-brand-charcoal border border-brand-slate/20 rounded-2xl font-bold text-xs cursor-pointer transition-all shadow-sm active:scale-98"
            >
              <ChevronLeft className="w-4 h-4 text-brand-amber" />
              <span>{lang === 'en' ? 'Previous Card' : 'Pichhla'}</span>
            </button>

            {/* Mark Mastered Quick Button */}
            <button
              onClick={() => toggleMastered(currentCard.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs cursor-pointer transition-all shadow-md active:scale-98 ${
                masteredIds.includes(currentCard.id)
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-brand-amber hover:bg-brand-amber-dark text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {masteredIds.includes(currentCard.id) 
                  ? (lang === 'en' ? 'Mastered ✓' : 'Hifz Hai ✓') 
                  : (lang === 'en' ? 'Mark Mastered' : 'Hifz Karein')}
              </span>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-brand-sand text-brand-charcoal border border-brand-slate/20 rounded-2xl font-bold text-xs cursor-pointer transition-all shadow-sm active:scale-98"
            >
              <span>{lang === 'en' ? 'Next Card' : 'Agla'}</span>
              <ChevronRight className="w-4 h-4 text-brand-amber" />
            </button>
          </div>
        </div>
      ) : (
        /* GRID VIEW: Responsive Bento Grid of All Filtered Terms */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-brand-slate mb-2">
            <span>Showing {filteredCards.length} flashcards</span>
            {masteredIds.length > 0 && (
              <button
                onClick={resetAllMastery}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold cursor-pointer transition-colors"
              >
                <RefreshCcw className="w-3 h-3" />
                <span>{lang === 'en' ? 'Reset Mastery' : 'Reset Progress'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => {
              const isMastered = masteredIds.includes(card.id);
              return (
                <GridFlashcardItem
                  key={card.id}
                  card={card}
                  isMastered={isMastered}
                  isSpeaking={speakingId === card.id}
                  onToggleMastered={() => toggleMastered(card.id)}
                  onSpeak={(e) => handleSpeak(card, e)}
                  onJumpToSection={(e) => jumpToSection(card.sectionId, e)}
                  lang={lang}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

interface GridFlashcardItemProps {
  key?: React.Key;
  card: FlashcardItem;
  isMastered: boolean;
  isSpeaking: boolean;
  onToggleMastered: () => void;
  onSpeak: (e: React.MouseEvent) => void;
  onJumpToSection: (e: React.MouseEvent) => void;
  lang: string;
}

// Sub-component for individual grid flashcards
function GridFlashcardItem({
  card,
  isMastered,
  isSpeaking,
  onToggleMastered,
  onSpeak,
  onJumpToSection,
  lang
}: GridFlashcardItemProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="h-64 [perspective:1000px] select-none">
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d] cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Front of Grid Card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-2xl p-5 border border-brand-amber/25 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-brand-slate uppercase bg-brand-sand px-2 py-0.5 rounded-md">
              {card.sectionNumber}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onSpeak}
                className="p-1 text-brand-slate hover:text-brand-amber rounded-md cursor-pointer"
                title="Speak"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMastered();
                }}
                className={`p-1 rounded-md cursor-pointer ${
                  isMastered ? 'text-emerald-600' : 'text-brand-slate/40 hover:text-brand-slate'
                }`}
                title={isMastered ? 'Mastered' : 'Mark as Mastered'}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="my-auto text-center py-2">
            <h4 className="font-display text-lg font-black text-brand-charcoal leading-snug">
              {card.term}
            </h4>
            <span className="text-[10px] text-brand-muted mt-1 block">
              {card.sectionTitle}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-brand-slate/60 pt-2 border-t border-brand-slate/10">
            <span>{isMastered ? '✓ Mastered' : 'Learning'}</span>
            <span className="text-brand-amber font-bold flex items-center gap-1">
              <RotateCw className="w-3 h-3" />
              Flip
            </span>
          </div>
        </div>

        {/* Back of Grid Card */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-brand-charcoal text-white rounded-2xl p-5 border border-brand-amber/40 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-brand-amber uppercase">
              Definition
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMastered();
              }}
              className={`p-1 rounded-md cursor-pointer ${
                isMastered ? 'text-emerald-400' : 'text-white/40 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-brand-sand leading-relaxed my-auto line-clamp-5">
            {card.definition}
          </p>

          <div className="flex items-center justify-between text-[10.5px] text-white/60 pt-2 border-t border-white/10">
            <button
              onClick={onJumpToSection}
              className="text-brand-amber hover:text-brand-amber-light font-bold flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3 h-3" />
              Guide
            </button>
            <span className="text-white/80 flex items-center gap-1 font-semibold">
              <RotateCw className="w-3 h-3" />
              Back
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
