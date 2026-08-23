import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  GraduationCap, 
  Search, 
  Check, 
  Trophy, 
  Calendar, 
  BookOpen, 
  HelpCircle,
  RefreshCw,
  Award,
  Compass,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { roadmapSections, Section, Term } from '../data/roadmapTerms';
import ClayLogo from './ClayLogo';
import { useLanguage } from '../hooks/useLanguage';
import ReadSectionButton from './ReadSectionButton';
import CopyCodeButton from './CopyCodeButton';
import { 
  toggleTermCompleted, 
  toggleSectionBookmarked, 
  syncProgressToCloud 
} from '../lib/firebase';

export default function ClosingAndDeeper() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true); // Open by default to showcase the roadmap immediately
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedQuizzes, setRevealedQuizzes] = useState<Record<string, boolean>>({});
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isDeeperDrawerOpen, setIsDeeperDrawerOpen] = useState(false);
  
  // Quiz Mode states
  const [isGlobalQuizMode, setIsGlobalQuizMode] = useState(false);
  const [quizModeSections, setQuizModeSections] = useState<Record<string, boolean>>({});
  const [revealedTerms, setRevealedTerms] = useState<Record<string, boolean>>({});
  
  // Track checked terms in localStorage & Firebase
  const [completedTerms, setCompletedTerms] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('clay_completed_terms');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('clay_bookmarks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync state when auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const savedTerms = localStorage.getItem('clay_completed_terms');
        if (savedTerms) setCompletedTerms(JSON.parse(savedTerms));
        const savedBookmarks = localStorage.getItem('clay_bookmarks');
        if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('clay_auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('clay_auth_state_changed', handleAuthChange);
  }, []);

  // Compute stats
  const totalTermsCount = roadmapSections.reduce((acc, sec) => acc + sec.terms.length, 0);
  const completedCount = Object.values(completedTerms).filter(Boolean).length;
  const percentComplete = Math.round((completedCount / totalTermsCount) * 100);

  const toggleTerm = async (termTitle: string) => {
    const newValue = !completedTerms[termTitle];
    setCompletedTerms(prev => {
      const next = { ...prev, [termTitle]: newValue };
      localStorage.setItem('clay_completed_terms', JSON.stringify(next));
      return next;
    });
    
    // Sync to Firestore
    await toggleTermCompleted(termTitle, newValue);
  };

  const toggleBookmark = async (sectionId: string) => {
    const newValue = !bookmarks[sectionId];
    setBookmarks(prev => {
      const next = { ...prev, [sectionId]: newValue };
      localStorage.setItem('clay_bookmarks', JSON.stringify(next));
      return next;
    });

    // Sync to Firestore
    await toggleSectionBookmarked(sectionId, newValue);
  };

  const toggleQuiz = (sectionId: string) => {
    setRevealedQuizzes(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const resetProgress = async () => {
    if (window.confirm('Reset all learned terms progress?')) {
      setCompletedTerms({});
      localStorage.setItem('clay_completed_terms', '{}');
      await syncProgressToCloud({}, bookmarks);
      window.dispatchEvent(new Event('clay_auth_state_changed'));
    }
  };

  const checkAllInSection = async (section: Section) => {
    const nextCompleted = { ...completedTerms };
    const allChecked = section.terms.every(t => completedTerms[t.title]);
    
    section.terms.forEach(t => {
      nextCompleted[t.title] = !allChecked;
    });
    setCompletedTerms(nextCompleted);
    localStorage.setItem('clay_completed_terms', JSON.stringify(nextCompleted));

    // Sync to Firestore
    await syncProgressToCloud(nextCompleted, bookmarks);
    window.dispatchEvent(new Event('clay_auth_state_changed'));
  };

  // Filter terms by search query
  const filteredResults: { section: Section; term: Term }[] = [];
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    roadmapSections.forEach(section => {
      section.terms.forEach(term => {
        if (
          term.title.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          section.title.toLowerCase().includes(query)
        ) {
          filteredResults.push({ section, term });
        }
      });
    });
  }

  return (
    <div id="deeper" className="scroll-mt-16 bg-white py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-amber/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-brand-slate/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Head Block with Clay Integration */}
        <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
          <div className="flex justify-center mb-5">
            <ClayLogo size={72} />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sand border border-brand-slate/10 rounded-full text-[11px] font-mono font-bold text-brand-slate mb-4">
            <Calendar className="w-3 h-3 text-brand-amber" />
            <span>{lang === 'en' ? "Updated Roadmap: 6 July 2026" : "Naya Roadmap: 6 July 2026"}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-brand-charcoal tracking-tight mb-4 text-center">
            {lang === 'en' ? "85+ AI Terms Explained in Simple Words" : "85+ AI ke Alfaaz Boht Aasan Zubaan mein"}
          </h2>
          <p className="font-sans text-brand-slate text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-center mb-5">
            {lang === 'en' 
              ? "A real learning path, not just a random dictionary. Start at the top, work your way down. Each of the 12 sections builds directly on the ones before it."
              : "Ye bilkul ek seedha learning rasta hai miya, koi ainvayi dictionary nai hai. Upar se shuru karo aur seekhte seekhte niche jao. Ek-ek section pehle wale pe bana hua hai."
            }
          </p>
          <div className="flex justify-center mb-8">
            <ReadSectionButton sectionId="deeper" />
          </div>
        </div>

        {/* Global Progress Dashboard Widget (Tactile Bento Panel) */}
        <div className="max-w-4xl mx-auto mb-10 bg-[#F9F7F3] border-2 border-brand-charcoal/10 rounded-3xl p-6 sm:p-8 skeuo-raised relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 relative">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-brand-amber" />
                <h3 className="font-display text-lg font-bold text-brand-charcoal">
                  {lang === 'en' ? "Your Interactive Study Progress" : "Aapki Padhayi ki Progress"}
                </h3>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed max-w-md">
                {lang === 'en'
                  ? "Tick off terms as you scroll and read to master the AI ecosystem! Your progress is locally saved."
                  : "Miya, jaise jaise padhte jaa rahe ho, tick lagate jao! Sab progress browser mein automatically save hoti."
                }
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              {/* Global Quiz Mode Toggle Card */}
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-brand-slate/10 shadow-sm text-left select-none">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-brand-amber" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase font-bold text-brand-muted">
                    {lang === 'en' ? "Quiz Mode" : "Imtehaan Mode"}
                  </span>
                  <button
                    onClick={() => setIsGlobalQuizMode(!isGlobalQuizMode)}
                    className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      isGlobalQuizMode 
                        ? 'bg-brand-amber text-white border-brand-amber shadow-sm' 
                        : 'bg-brand-sand/60 hover:bg-brand-sand text-brand-[#4E564F] border-brand-slate/10'
                    }`}
                  >
                    <span>{isGlobalQuizMode ? (lang === 'en' ? "GLOBAL: ON" : "GLOBAL: ON") : (lang === 'en' ? "GLOBAL: OFF" : "GLOBAL: OFF")}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-brand-slate/10 shadow-sm text-left">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-brand-amber" />
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase font-bold text-brand-muted">
                    {lang === 'en' ? "Learned" : "Seekh Liye"}
                  </span>
                  <span className="font-display text-base font-extrabold text-brand-charcoal">
                    {completedCount} <span className="font-normal text-xs text-brand-slate">/ {totalTermsCount} {lang === 'en' ? 'Terms' : 'Alfaaz'}</span>
                  </span>
                </div>
              </div>

              {completedCount > 0 && (
                <button
                  onClick={resetProgress}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-brand-sand border border-brand-slate/10 rounded-xl text-xs font-bold text-brand-slate cursor-pointer transition-colors active:scale-95"
                  title="Reset learning checklist"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? "Reset" : "Shuru se"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-brand-slate mb-2">
              <span>{lang === 'en' ? "PROGRESS" : "PROGRESS"}</span>
              <span className="text-brand-amber">
                {percentComplete}% {lang === 'en' ? "MASTERED" : "SEEKH LIYE"}
              </span>
            </div>
            <div className="w-full h-3 bg-brand-sand border border-brand-slate/10 rounded-full overflow-hidden p-[2px] shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-brand-amber to-brand-amber-dark rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentComplete}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Saved Bookmarks Section */}
          {Object.values(bookmarks).some(Boolean) && (
            <div className="mt-6 pt-5 border-t border-brand-slate/10 text-left">
              <span className="block text-[10px] font-mono uppercase font-black text-brand-amber tracking-wider mb-2.5 flex items-center gap-1.5">
                <BookmarkCheck className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                {lang === 'en' ? "Your Bookmarked Learning Paths" : "Aapke Bookmark Kiye Hue Raste"}
              </span>
              <div className="flex flex-wrap gap-2">
                {roadmapSections.map(section => {
                  if (!bookmarks[section.id]) return null;
                  return (
                    <button
                      key={`bookmark-badge-${section.id}`}
                      onClick={() => {
                        const el = document.getElementById(section.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-amber/10 hover:bg-brand-amber/20 border border-brand-amber/20 rounded-full text-xs font-bold text-brand-amber transition-all cursor-pointer hover:scale-102 active:scale-98"
                    >
                      <span className="opacity-65 text-[10px] font-mono">{section.number}</span>
                      <span>{section.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Global Instant Search Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-slate" />
            <input
              type="text"
              placeholder={lang === 'en' ? "Search all 85+ terms instantly... (e.g., Transformer, RAG, Epoch)" : "Sabh 85+ alfaaz mein se kuch dhoondo... (jaise: Transformer, RAG, Epoch)"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white border-2 border-brand-charcoal/10 rounded-2xl focus:border-brand-amber outline-none font-sans text-sm shadow-sm transition-all placeholder:text-brand-slate/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-brand-slate hover:text-brand-amber bg-brand-sand px-2 py-0.5 rounded border border-brand-slate/10"
              >
                {lang === 'en' ? "CLEAR" : "SAAF"}
              </button>
            )}
          </div>
        </div>

        {/* SEARCH RESULTS VIEW */}
        <AnimatePresence mode="wait">
          {searchQuery.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-mono font-bold text-brand-muted uppercase">
                  Search Results: found {filteredResults.length} matches
                </span>
              </div>

              {filteredResults.length === 0 ? (
                <div className="p-12 text-center bg-[#F9F7F3] border border-brand-slate/10 rounded-3xl">
                  <p className="text-brand-muted text-sm italic">
                    No terms found matching "{searchQuery}". Try looking up "transformer", "ML", or "agent".
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredResults.map(({ section, term }) => {
                    const isChecked = !!completedTerms[term.title];
                    return (
                      <div 
                        key={term.title}
                        onClick={() => toggleTerm(term.title)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex gap-4 select-none ${isChecked ? 'bg-brand-amber/5 border-brand-amber/35 shadow-sm' : 'bg-[#F9F7F3] hover:bg-white border-brand-slate/10 hover:shadow-md'}`}
                      >
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${isChecked ? 'bg-brand-amber border-brand-amber text-white' : 'bg-white border-brand-slate/25'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-display text-sm font-bold text-brand-charcoal">{term.title}</h4>
                            <span className="text-[9px] font-mono font-bold bg-brand-sand border border-brand-slate/10 text-brand-slate px-1.5 py-0.5 rounded">
                              Sec {section.number}
                            </span>
                          </div>
                          <p className="text-xs text-brand-slate leading-relaxed mt-2">{term.definition}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ROADMAP CURRICULUM VIEW (12 SECTIONS) */}
        {searchQuery.trim() === '' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-8 relative">
            
            {/* Left Timeline vertical indicator bar (desktop only) */}
            <div className="absolute left-10 top-12 bottom-12 w-[2px] bg-brand-amber/15 hidden lg:block" />

            {roadmapSections.map((section, idx) => {
              const isSectionActive = activeSectionId === section.id;
              const sectionCheckedCount = section.terms.filter(t => completedTerms[t.title]).length;
              const isSectionFullyMastered = sectionCheckedCount === section.terms.length;
              const isSectionInQuizMode = isGlobalQuizMode || !!quizModeSections[section.id];

              return (
                <React.Fragment key={section.id}>
                  <motion.div
                    id={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className={`relative lg:pl-16 transition-all duration-300 scroll-mt-24 target:ring-2 target:ring-brand-amber/40 target:rounded-[32px] ${isSectionFullyMastered ? 'opacity-90' : ''}`}
                  >
                    {/* Timeline Badge (Desktop) */}
                    <div className="absolute left-5 top-0 w-10 h-10 rounded-full bg-white border-2 border-brand-charcoal/10 flex items-center justify-center z-20 hidden lg:flex shadow-sm">
                      {isSectionFullyMastered ? (
                        <div className="w-7 h-7 rounded-full bg-brand-amber flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-bold text-brand-slate">{section.number}</span>
                      )}
                    </div>

                    {/* Section Frame (Bento Card style) */}
                    <div className="bg-[#F9F7F3] border-2 border-brand-charcoal/10 hover:border-brand-charcoal/20 rounded-3xl p-6 sm:p-8 skeuo-raised relative overflow-hidden transition-all text-left">
                      
                      {/* Top Accent Strip */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-amber/10" />

                      {/* Header bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-brand-slate/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-brand-amber/10 text-brand-amber px-2.5 py-1 rounded-md">
                              {lang === 'en' ? `Section ${section.number}` : `Hissa ${section.number}`}
                            </span>
                            {section.buildsOn && (
                              <span className="text-[10px] font-mono font-bold text-brand-muted">
                                {lang === 'en' ? "Builds on:" : "Pehle chahiye:"} <span className="text-brand-slate italic">{section.buildsOn}</span>
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-2xl font-extrabold text-brand-charcoal mt-2">
                            {section.title}
                          </h3>
                          <p className="text-xs text-brand-muted mt-1 max-w-xl italic text-left">
                            {section.subtitle}
                          </p>
                        </div>

                        {/* Section Quick Stats + Actions */}
                        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                          <span className="text-xs font-mono font-bold text-brand-slate">
                            {sectionCheckedCount}/{section.terms.length} {lang === 'en' ? 'MASTERED' : 'POORA SEEKHE'}
                          </span>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {/* Read Subsection Aloud */}
                            <ReadSectionButton sectionId={section.id} variant="compact" showDuration={false} />

                            {/* Bookmark Toggle Button */}
                            <button
                              onClick={() => toggleBookmark(section.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                bookmarks[section.id]
                                  ? 'bg-brand-amber/10 text-brand-amber border-brand-amber/20'
                                  : 'bg-white hover:bg-brand-sand text-brand-slate border-brand-slate/10 hover:border-brand-slate/20'
                              }`}
                              title={bookmarks[section.id] ? "Remove bookmark" : "Bookmark this section"}
                            >
                              {bookmarks[section.id] ? (
                                <>
                                  <BookmarkCheck className="w-3 h-3 text-brand-amber" />
                                  <span>{lang === 'en' ? "BOOKMARKED" : "SAVED"}</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3 h-3 text-brand-slate/50" />
                                  <span>{lang === 'en' ? "BOOKMARK" : "SAVE"}</span>
                                </>
                              )}
                            </button>

                            {/* Local Quiz Toggle */}
                            <button
                              onClick={() => setQuizModeSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                              disabled={isGlobalQuizMode}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                                isSectionInQuizMode 
                                  ? 'bg-[#E07A5F] text-white border-[#E07A5F]' 
                                  : 'bg-white hover:bg-brand-sand text-brand-slate border-brand-slate/10 hover:border-brand-slate/20'
                              } ${isGlobalQuizMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={isGlobalQuizMode ? "Global Quiz Mode is active" : "Toggle Quiz Mode for this section"}
                            >
                              {isSectionInQuizMode ? (lang === 'en' ? "QUIZ: ON" : "QUIZ: ON") : (lang === 'en' ? "QUIZ: OFF" : "QUIZ: OFF")}
                            </button>

                            <button
                              onClick={() => checkAllInSection(section)}
                              className="text-[10px] font-mono font-bold text-brand-amber hover:text-brand-amber-dark underline cursor-pointer bg-transparent border-0 p-0"
                            >
                              {isSectionFullyMastered 
                                ? (lang === 'en' ? "Deselect" : "Uncheck") 
                                : (lang === 'en' ? "Check All" : "Sabh")}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Terms Grid (Clean cards / Interactive Quiz Cards) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        {section.terms.map((term) => {
                          const isChecked = !!completedTerms[term.title];
                          const isRevealed = !!revealedTerms[term.title];
                          
                          return (
                            <div
                              key={term.title}
                              id={`term-${term.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                              className={`group p-5 bg-white border rounded-2xl flex flex-col justify-between transition-all select-none relative overflow-hidden scroll-mt-24 target:ring-2 target:ring-brand-amber target:border-brand-amber target:bg-brand-amber/[0.04] ${
                                isChecked 
                                  ? 'border-brand-amber/40 bg-brand-amber/[0.02] shadow-inner' 
                                  : 'border-brand-slate/10 shadow-sm'
                              } ${isSectionInQuizMode && !isRevealed ? 'border-dashed border-brand-amber/30 hover:border-brand-amber/50 bg-[#FDFBF7]' : 'hover:border-brand-amber/30'}`}
                            >
                              <div className="flex gap-3">
                                {/* Visual toggle checkbox */}
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTerm(term.title);
                                  }}
                                  className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                                    isChecked ? 'bg-brand-amber border-brand-amber text-white' : 'bg-white border-brand-slate/25 group-hover:border-brand-amber/50'
                                  }`}
                                >
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>

                                <div className="flex-grow min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-display text-xs sm:text-sm font-black text-brand-charcoal group-hover:text-brand-amber transition-colors flex items-center gap-1.5 truncate">
                                      {term.title}
                                      {isSectionInQuizMode && (
                                        <span className="text-[8px] font-mono font-bold bg-[#E07A5F]/10 text-[#E07A5F] px-1.5 py-0.5 rounded shrink-0">
                                          Q
                                        </span>
                                      )}
                                    </h4>
                                    <CopyCodeButton
                                      text={`${term.title}: ${term.definition}`}
                                      label={lang === 'en' ? "Copy" : "Copy"}
                                      variant="compact"
                                      showIconOnly={true}
                                      title={lang === 'en' ? `Copy definition of ${term.title}` : `${term.title} ki definition copy karo`}
                                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shrink-0"
                                    />
                                  </div>
                                  
                                  {/* Definition or Quiz placeholder */}
                                  <div className="mt-2.5">
                                    {isSectionInQuizMode && !isRevealed ? (
                                      <div className="py-2 px-3 bg-brand-sand/50 rounded-xl border border-brand-slate/5 text-[11px] sm:text-xs text-brand-muted italic flex flex-col items-start gap-2">
                                        <span>
                                          {lang === 'en' ? "Can you define this concept?" : "Kya aap iska matlab bata sakte hain?"}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setRevealedTerms(prev => ({ ...prev, [term.title]: true }));
                                          }}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-amber/10 hover:bg-brand-amber text-brand-amber hover:text-white border border-brand-amber/15 hover:border-brand-amber text-[9px] font-bold rounded-md transition-all cursor-pointer"
                                        >
                                          {lang === 'en' ? "Reveal Definition" : "Definition Dekho"}
                                        </button>
                                      </div>
                                    ) : (
                                      <p className="text-[11px] sm:text-xs text-brand-slate leading-relaxed text-left animate-fade-in">
                                        {term.definition}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Small Quick-Hide Button if revealed in Quiz Mode */}
                              {isSectionInQuizMode && isRevealed && (
                                <div className="mt-3.5 flex justify-end border-t border-brand-slate/5 pt-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRevealedTerms(prev => ({ ...prev, [term.title]: false }));
                                    }}
                                    className="text-[9px] font-mono font-bold text-brand-muted hover:text-[#E07A5F] transition-colors cursor-pointer"
                                  >
                                    {lang === 'en' ? "[ Hide definition ]" : "[ Definition chupao ]"}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Interactive "Test yourself" accordion card */}
                      {section.testYourself && (
                        <div className="mt-8 pt-6 border-t border-brand-slate/10 text-left">
                          <div className="bg-white/70 border border-brand-amber/15 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-brand-amber/10 flex items-center justify-center text-brand-amber shrink-0">
                                <HelpCircle className="w-4.5 h-4.5" />
                              </div>
                              <div className="flex-grow">
                                <span className="text-[10px] font-mono uppercase font-bold text-brand-amber block mb-1">
                                  {lang === 'en' ? "Test yourself" : "Apna imtehaan lo"}
                                </span>
                                <p className="text-xs sm:text-sm font-medium text-brand-charcoal leading-relaxed text-left">
                                  {section.testYourself.question}
                                </p>

                                {/* Toggle Reveal Button */}
                                <button
                                  onClick={() => toggleQuiz(section.id)}
                                  className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-sand hover:bg-brand-sand-dark text-brand-amber border border-brand-amber/20 hover:border-brand-amber/40 font-display text-xs font-bold rounded-lg cursor-pointer transition-all active:scale-95"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>
                                    {revealedQuizzes[section.id] 
                                      ? (lang === 'en' ? "Hide Answer" : "Jawab Chupao") 
                                      : (lang === 'en' ? "Reveal Answer" : "Jawab Dekho")}
                                  </span>
                                </button>

                                {/* Animated Answer Box */}
                                <AnimatePresence>
                                  {revealedQuizzes[section.id] && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                      animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                      className="overflow-hidden border-t border-brand-slate/10 text-left"
                                    >
                                      <div className="pt-3 flex gap-2.5 items-start justify-between">
                                        <div className="flex gap-2.5 items-start flex-1 min-w-0">
                                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                          </div>
                                          <div>
                                            <span className="font-mono text-[9px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                                              {lang === 'en' ? "EXPLAINED BY CLAY:" : "CLAY KA JAWAB:"}
                                            </span>
                                            <p className="text-xs text-brand-slate leading-relaxed text-left">
                                              {section.testYourself.answer}
                                            </p>
                                          </div>
                                        </div>
                                        <CopyCodeButton
                                          text={`Question: ${section.testYourself.question}\nAnswer: ${section.testYourself.answer}`}
                                          label={lang === 'en' ? "Copy Answer" : "Jawab Copy"}
                                          variant="compact"
                                          className="shrink-0 ml-2"
                                        />
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}

          </div>
        )}

        {/* Layer 4: Go Deeper Drawer */}
        <div className="max-w-4xl mx-auto mt-14 pt-8 border-t border-brand-slate/10">
          <div className="bg-[#F5F2ED] border-2 border-brand-charcoal/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left">
            <button
              onClick={() => setIsDeeperDrawerOpen(!isDeeperDrawerOpen)}
              className="w-full flex items-center justify-between p-5 bg-brand-sand/30 hover:bg-brand-sand/50 transition-colors text-left font-display font-extrabold text-brand-charcoal cursor-pointer outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-amber/10 flex items-center justify-center text-brand-amber shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold">
                    {lang === 'en' ? "Layer 4: Go Deeper" : "Hissa 4: Gehra Seekho"}
                  </h4>
                  <p className="text-xs font-normal text-brand-muted">
                    {lang === 'en' 
                      ? "Expand to explore advanced, adjacent AI concepts (Opt-in only)" 
                      : "Sabh bade bade aur advanced AI ke baatein seekho (Maza aayega)"}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-brand-slate/10 flex items-center justify-center text-brand-slate shrink-0">
                {isDeeperDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence>
              {isDeeperDrawerOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-white border-t border-brand-slate/10 text-left"
                >
                  <div className="p-6 sm:p-8 flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-3.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/5 pb-3">
                        <span className="font-display font-extrabold text-sm text-[#E07A5F] sm:w-48 shrink-0 text-left">
                          <strong>{lang === 'en' ? "AI Agents" : "AI Agents"}</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow text-left">
                          {lang === 'en'
                            ? "AI systems that can plan and take actions using tools, rather than just generating text answers."
                            : "Aise AI systems jo khudi se plan karke kaam kar sakte hain, sirf baatein ya text likhne ke bajaye."
                          }
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/5 pb-3">
                        <span className="font-display font-extrabold text-sm text-[#E07A5F] sm:w-48 shrink-0 text-left">
                          <strong>{lang === 'en' ? "Fine-tuning" : "Fine-tuning"}</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow text-left">
                          {lang === 'en'
                            ? "The process of customizing a pre-trained model further on your own specific dataset."
                            : "Pehle se bane hue model ko aapke khud ke data pe daal ke use ekdum khaas banana."
                          }
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/5 pb-3">
                        <span className="font-display font-extrabold text-sm text-[#E07A5F] sm:w-48 shrink-0 text-left">
                          <strong>{lang === 'en' ? "Embeddings" : "Embeddings"}</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow text-left">
                          {lang === 'en'
                            ? "Turning the core meaning of text into lists of numbers to allow computer systems to compare them."
                            : "Poore alfaaz ya text ke matlab ko numbers ki list banana, taake computer use aasaani se samajh sake."
                          }
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/5 pb-3">
                        <span className="font-display font-extrabold text-sm text-[#E07A5F] sm:w-48 shrink-0 text-left">
                          <strong>{lang === 'en' ? "Multimodal AI" : "Multimodal AI"}</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow text-left">
                          {lang === 'en'
                            ? "Advanced neural networks built to process multiple types of information (text, images, and audio) together."
                            : "Aise models jo ek sath likha hua text, photo aur audio sabh ek sath samajh lete hain."
                          }
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                        <span className="font-display font-extrabold text-sm text-rose-500 sm:w-48 shrink-0 text-left">
                          <strong>{lang === 'en' ? "AI Ethics & Bias" : "AI Ethics aur Bias"}</strong>
                        </span>
                        <span className="text-xs sm:text-sm text-brand-slate flex-grow text-left">
                          {lang === 'en'
                            ? "The study of how models can make unfair or incorrect decisions due to human patterns in their training data."
                            : "Ye study karna ki models galat ya ek-tarfa faisle kaise karte hain kyunki unki training ka data waisa tha."
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
