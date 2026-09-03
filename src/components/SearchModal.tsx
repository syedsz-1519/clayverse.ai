import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  BookOpen, 
  Sparkles, 
  Layers, 
  CornerDownLeft, 
  Command, 
  ChevronRight,
  SlidersHorizontal 
} from 'lucide-react';
import { roadmapSections, Section, Term } from '../data/roadmapTerms';
import { useLanguage } from '../hooks/useLanguage';
import ClayLogo from './ClayLogo';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchResultItem = 
  | { type: 'section'; section: Section; id: string; title: string; subtitle: string; score: number }
  | { type: 'term'; section: Section; term: Term; id: string; title: string; definition: string; score: number };

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'sections' | 'terms'>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus the input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setActiveIndex(0);
      // Prevent body scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard events (Escape, Arrow Up/Down, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[activeIndex]) {
          handleSelect(filteredResults[activeIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, query, activeTab]);

  // Scroll active item into view during keyboard navigation
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  // Translate terms locally
  const t = {
    searchPlaceholder: lang === 'en' 
      ? 'Search sections & terms... (e.g. Transformer, RAG, Core)' 
      : 'Sabaq aur alfaaz dhoondo... (jaise: Transformer, RAG, Core)',
    noResults: lang === 'en' 
      ? 'No results found. Try typing another term.' 
      : 'Kuch nahi mila. Koi doosra lafz likh kar dekhein.',
    sections: lang === 'en' ? 'Sections' : 'Hisse',
    terms: lang === 'en' ? 'Glossary Terms' : 'Glossary Alfaaz',
    all: lang === 'en' ? 'All' : 'Sabh',
    howToNavigate: lang === 'en' 
      ? 'Use Arrow keys to cycle, Enter to select, Esc to close.' 
      : 'Arrow keys se upar-niche karein, Enter se chunein, Esc se band karein.',
    sectionLabel: lang === 'en' ? 'Section' : 'Hissa',
    glossaryLabel: lang === 'en' ? 'Glossary' : 'Glossary',
    buildsOn: lang === 'en' ? 'Builds on' : 'Pehle',
  };

  // Memoized filter logic
  const filteredResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Gather all sections matching the criteria
    if (activeTab === 'all' || activeTab === 'sections') {
      roadmapSections.forEach(section => {
        let score = 0;
        if (section.title.toLowerCase().includes(cleanQuery)) score += 10;
        if (section.subtitle.toLowerCase().includes(cleanQuery)) score += 5;
        if (section.number.includes(cleanQuery)) score += 8;

        if (cleanQuery === '' || score > 0) {
          results.push({
            type: 'section',
            section,
            id: section.id,
            title: section.title,
            subtitle: section.subtitle,
            score: cleanQuery === '' ? 1 : score
          });
        }
      });
    }

    // 2. Gather all terms matching the criteria
    if (activeTab === 'all' || activeTab === 'terms') {
      roadmapSections.forEach(section => {
        section.terms.forEach(term => {
          let score = 0;
          if (term.title.toLowerCase().includes(cleanQuery)) score += 12;
          if (term.definition.toLowerCase().includes(cleanQuery)) score += 6;
          if (section.title.toLowerCase().includes(cleanQuery)) score += 3;

          if (cleanQuery === '' || score > 0) {
            results.push({
              type: 'term',
              section,
              term,
              id: `term-${term.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              title: term.title,
              definition: term.definition,
              score: cleanQuery === '' ? 1 : score
            });
          }
        });
      });
    }

    // Sort results by search relevance score, then by section sequence
    if (cleanQuery !== '') {
      results.sort((a, b) => b.score - a.score);
    } else {
      // Default order: Sections first, then terms
      results.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'section' ? -1 : 1;
        }
        return 0;
      });
    }

    return results;
  }, [query, activeTab]);

  // Reset selected index when query or tab changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query, activeTab]);

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    
    // Set URL hash to trigger the CSS target highlighter
    window.location.hash = item.id;

    // Smooth scroll to element
    setTimeout(() => {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 overflow-hidden select-none">
          {/* Blur Glassmorphic Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-md"
          />

          {/* Search Box Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
            className="relative w-full max-w-2xl bg-white/85 backdrop-blur-xl border border-brand-charcoal/10 rounded-3xl shadow-2xl flex flex-col max-h-[82vh] overflow-hidden"
          >
            {/* Soft decorative background glow */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-brand-slate/10 rounded-full blur-3xl pointer-events-none" />

            {/* Clay's Ask Header Banner */}
            <div className="bg-brand-amber/5 border-b border-brand-charcoal/5 px-5 py-4 flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-3">
                <ClayLogo size={36} />
                <div>
                  <h3 className="font-display text-sm font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                    {lang === 'en' ? "Ask Clay" : "Clay se Poochho"}
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-amber animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-brand-slate leading-normal max-w-[400px]">
                    {lang === 'en' 
                      ? "I can search across 12 lessons & glossary terms instantly. Type a word below to start!" 
                      : "Main poore 12 sabak aur glossary ke lafzaan ek second mein dhoond leta hoon yaaron! Neeche lafz likho."
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-brand-sand text-brand-slate hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header: Input Bar */}
            <div className="relative p-5 border-b border-brand-charcoal/5 flex items-center gap-3 shrink-0">
              <Search className="w-5 h-5 text-brand-slate shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-grow bg-transparent text-base font-medium text-brand-charcoal outline-none placeholder:text-brand-slate/40 border-0 p-0 focus:ring-0"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full hover:bg-brand-sand transition-colors cursor-pointer text-brand-slate/60 hover:text-brand-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-brand-sand border border-brand-charcoal/5 rounded-lg text-[10px] font-mono text-brand-slate font-bold shadow-inner">
                <Command className="w-2.5 h-2.5" />
                <span>ESC</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 py-2.5 bg-brand-sand/35 border-b border-brand-charcoal/5 flex items-center gap-2 shrink-0 overflow-x-auto scrollbar-none">
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-slate shrink-0 me-1 hidden sm:block" />
              {[
                { id: 'all', label: t.all, count: activeTab === 'all' ? filteredResults.length : null },
                { id: 'sections', label: t.sections, count: activeTab === 'sections' ? filteredResults.length : null },
                { id: 'terms', label: t.terms, count: activeTab === 'terms' ? filteredResults.length : null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none flex items-center gap-1.5 shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-brand-amber text-white shadow-sm'
                      : 'bg-white hover:bg-brand-sand text-brand-slate border border-brand-charcoal/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-brand-sand text-brand-slate'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div 
              ref={resultsContainerRef}
              className="flex-grow overflow-y-auto p-4 flex flex-col gap-2 scrollbar-thin max-h-[45vh]"
            >
              {filteredResults.length === 0 ? (
                <div className="py-10 px-6 text-center space-y-3">
                  <BookOpen className="w-9 h-9 text-brand-slate/30 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm font-semibold text-brand-slate/80">{t.noResults}</p>
                  <p className="text-xs text-brand-muted max-w-sm mx-auto">
                    {lang === 'en' 
                      ? "Ask Clay's Gemini AI directly for deeper explanations or real-time web search facts." 
                      : "Is mauzu par Clay Gemini AI se tafseelan poochhein."}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      window.dispatchEvent(new CustomEvent('clay_open_ai_studio'));
                    }}
                    className="px-4 py-2 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? "Ask Clay Gemini AI" : "Clay Gemini AI se Poochho"}</span>
                  </button>
                </div>
              ) : (
                filteredResults.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={item.id + '-' + idx}
                      data-active={isActive ? 'true' : 'false'}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer text-left flex gap-3.5 items-start relative select-none ${
                        isActive
                          ? 'bg-brand-amber/15 border-brand-amber/35 shadow-sm'
                          : 'bg-brand-sand/20 hover:bg-brand-sand/55 border-brand-charcoal/5'
                      }`}
                    >
                      {/* Left icon / badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border transition-colors ${
                        isActive 
                          ? 'bg-brand-amber text-white border-brand-amber/15' 
                          : 'bg-white text-brand-slate border-brand-charcoal/5'
                      }`}>
                        {item.type === 'section' ? (
                          <Layers className="w-5 h-5" />
                        ) : (
                          <Sparkles className="w-5 h-5" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0 pr-6">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded ${
                            item.type === 'section'
                              ? 'bg-brand-amber/10 text-brand-amber border border-brand-amber/20'
                              : 'bg-brand-slate/10 text-brand-slate border border-brand-slate/20'
                          }`}>
                            {item.type === 'section' ? t.sectionLabel : t.glossaryLabel} {item.type === 'section' ? item.section.number : ''}
                          </span>
                          
                          {item.type === 'term' && (
                            <span className="text-[9px] font-mono text-brand-slate truncate max-w-[150px]">
                              in Sec {item.section.number}: {item.section.title}
                            </span>
                          )}

                          {item.type === 'section' && item.section.buildsOn && (
                            <span className="text-[9px] font-mono text-brand-muted italic">
                              {t.buildsOn}: {item.section.buildsOn}
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm font-black transition-colors ${isActive ? 'text-brand-charcoal' : 'text-brand-charcoal'}`}>
                          {item.title}
                        </h4>

                        <p className="text-xs text-brand-slate leading-relaxed mt-1.5 line-clamp-2">
                          {item.type === 'section' ? item.subtitle : item.definition}
                        </p>
                      </div>

                      {/* Right shortcut / chevron */}
                      <div className="absolute right-4.5 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-brand-slate font-bold hidden sm:inline">{lang === 'en' ? 'Navigate' : 'Chalo'}</span>
                        <ChevronRight className="w-4 h-4 text-brand-slate" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-brand-sand/40 border-t border-brand-charcoal/5 flex justify-between items-center text-[10px] text-brand-slate shrink-0">
              <span className="font-medium">{t.howToNavigate}</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-white border border-brand-charcoal/5 rounded font-mono shadow-sm">↑↓</span>
                  <span>Cycle</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-white border border-brand-charcoal/5 rounded font-mono shadow-sm flex items-center gap-0.5">
                    <CornerDownLeft className="w-2.5 h-2.5" />
                  </span>
                  <span>Go</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
