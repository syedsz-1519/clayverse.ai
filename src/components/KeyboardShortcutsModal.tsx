import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Command, 
  CornerDownLeft, 
  Sparkles, 
  Compass, 
  Search, 
  Globe, 
  Palette, 
  Volume2, 
  Bookmark, 
  ArrowRight, 
  ArrowLeft, 
  Home, 
  GraduationCap, 
  MessageSquare, 
  Layers,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  descriptionEn: string;
  descriptionHyd: string;
  category: 'navigation' | 'actions' | 'lesson' | 'accessibility';
}

const SHORTCUTS: ShortcutItem[] = [
  // Navigation
  {
    keys: ['Esc'],
    descriptionEn: 'Close any open modal or exit lesson view to overview',
    descriptionHyd: 'Kisi bhi modal ya sabaq ko band karke overview par jayein',
    category: 'navigation'
  },
  {
    keys: ['Home', 'H'],
    descriptionEn: 'Return to Main Course Overview & Curriculum',
    descriptionHyd: 'Main Overview aur Curriculum par foran wapas jayein',
    category: 'navigation'
  },
  {
    keys: ['1'],
    descriptionEn: 'Switch to Course Guide & Interactive Modules',
    descriptionHyd: 'Course Guide aur interactive sabaq par switch karein',
    category: 'navigation'
  },
  {
    keys: ['2'],
    descriptionEn: 'Switch to AI Mock Interviewer Simulator',
    descriptionHyd: 'AI Mock Interviewer Simulator par switch karein',
    category: 'navigation'
  },
  {
    keys: ['3'],
    descriptionEn: 'Switch to Student Dashboard & Analytics',
    descriptionHyd: 'Student Dashboard aur progress tracker kholein',
    category: 'navigation'
  },
  {
    keys: ['4'],
    descriptionEn: 'Switch to Learning Hub & Resource Vault',
    descriptionHyd: 'Learning Hub aur mawaad vault par jayein',
    category: 'navigation'
  },

  // Actions & Tools
  {
    keys: ['?', 'Shift + /'],
    descriptionEn: 'Toggle Keyboard Shortcuts Cheatsheet (this modal)',
    descriptionHyd: 'Keyboard shortcuts ki fehrist kholein ya band karein',
    category: 'actions'
  },
  {
    keys: ['Ctrl + K', '⌘K', '/'],
    descriptionEn: 'Open Quick Search & Topic Navigator',
    descriptionHyd: 'Search modal kholein aur kisi bhi unwan ko talash karein',
    category: 'actions'
  },
  {
    keys: ['L'],
    descriptionEn: 'Open 25+ Indian Languages Showcase & Audio Pronunciations',
    descriptionHyd: '25+ Hindustani Zubaanon ka showcase aur talaffuz kholein',
    category: 'actions'
  },
  {
    keys: ['O'],
    descriptionEn: 'Open Offline Curriculum Cache & Storage Manager',
    descriptionHyd: 'Offline Curriculum Cache aur Storage Manager kholein',
    category: 'actions'
  },
  {
    keys: ['V'],
    descriptionEn: 'Open Web Speech TTS Reader (Listen to anything)',
    descriptionHyd: 'Web Speech TTS Reader kholein (Kisi bhi matan ko sunein)',
    category: 'actions'
  },
  {
    keys: ['F'],
    descriptionEn: 'Toggle Focus Mode (Distraction-Free Reading)',
    descriptionHyd: 'Focus Mode chalu ya band karein (Pur-sukoon mutalaa)',
    category: 'actions'
  },
  {
    keys: ['T'],
    descriptionEn: 'Cycle Theme Palette (Sand / Deep Blue / Deep Night / Red Light)',
    descriptionHyd: 'Themes tabdeel karein (Sand, Deep Blue, Deep Night, Red Light)',
    category: 'accessibility'
  },
  {
    keys: ['M'],
    descriptionEn: 'Toggle Audio & Ambient SFX sounds',
    descriptionHyd: 'Audio aur sound effects ko chalu ya band karein',
    category: 'accessibility'
  },
  {
    keys: ['B'],
    descriptionEn: 'Save current reading position bookmark',
    descriptionHyd: 'Maujooda mutalae ka scroll position bookmark karein',
    category: 'actions'
  },
  {
    keys: ['C'],
    descriptionEn: 'Toggle Continuous Reading Guide mode',
    descriptionHyd: 'Musalsal mutalae ka mode chalu ya band karein',
    category: 'actions'
  },

  // Lesson Reading
  {
    keys: ['N', ']', '→'],
    descriptionEn: 'Next lesson module (when inside a lesson)',
    descriptionHyd: 'Agla sabaq (jab sabaq ke andar hon)',
    category: 'lesson'
  },
  {
    keys: ['P', '[', '←'],
    descriptionEn: 'Previous lesson module (when inside a lesson)',
    descriptionHyd: 'Pichla sabaq (jab sabaq ke andar hon)',
    category: 'lesson'
  },
  {
    keys: ['E'],
    descriptionEn: 'Export Takeaways & Study Notes PDF/MD',
    descriptionHyd: 'Sabaq ke aham nuqaat aur notes export karein',
    category: 'lesson'
  }
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const { lang } = useLanguage();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'navigation' | 'actions' | 'lesson' | 'accessibility'>('all');

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredShortcuts = SHORTCUTS.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const query = filterQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery = 
      s.descriptionEn.toLowerCase().includes(query) ||
      s.descriptionHyd.toLowerCase().includes(query) ||
      s.keys.some(k => k.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-shortcuts-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#FCFAF6] dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between bg-white dark:bg-zinc-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 text-brand-amber flex items-center justify-center shadow-xs">
                <Command className="w-5 h-5" />
              </div>
              <div>
                <h2 id="keyboard-shortcuts-title" className="text-xl font-bold font-display text-brand-charcoal">
                  {lang === 'te' ? 'కీబోర్డ్ షార్ట్‌కట్‌లు' : lang === 'hi' ? 'कीबोर्ड शॉर्टकट्स' : 'Keyboard Shortcuts'}
                </h2>
                <p className="text-xs text-brand-muted">
                  {lang === 'te' ? 'వేగవంతమైన నావిగేషన్ కోసం కీబోర్డ్ ఉపయోగించండి' : lang === 'hi' ? 'फास्ट नेविगेशन और एक्सेसिबिलिटी के लिए शॉर्टकट्स' : 'Navigate Clayverse AI effortlessly at lightning speed'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Close shortcuts dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Category Pills */}
          <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.01] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={lang === 'te' ? 'షార్ట్‌కట్‌లను వెతకండి...' : lang === 'hi' ? 'शॉर्टकट सर्च करें...' : 'Filter shortcuts (e.g. Esc, Theme, Lesson)...'}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-amber/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(['all', 'navigation', 'actions', 'lesson', 'accessibility'] as const).map((cat) => {
                const label = 
                  cat === 'all' ? 'All Shortcuts' :
                  cat === 'navigation' ? 'Navigation' :
                  cat === 'actions' ? 'Tools & Search' :
                  cat === 'lesson' ? 'Lesson Controls' : 'Theme & Audio';

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-brand-amber text-white shadow-xs'
                        : 'bg-black/5 dark:bg-white/5 text-brand-muted hover:bg-black/10 hover:text-brand-charcoal'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shortcuts List */}
          <div className="p-6 overflow-y-auto space-y-2.5 flex-1 divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {filteredShortcuts.length === 0 ? (
              <div className="text-center py-10 text-brand-muted text-xs">
                No matching keyboard shortcuts found.
              </div>
            ) : (
              filteredShortcuts.map((s, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex-1 text-xs text-brand-charcoal font-medium">
                    {lang === 'te' || lang === 'hi' || lang === 'ur' ? s.descriptionHyd : s.descriptionEn}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {s.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2.5 py-1 text-xs font-mono font-bold text-brand-charcoal bg-white dark:bg-zinc-800 border border-black/15 dark:border-white/15 rounded-md shadow-xs"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Quick Tip */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between text-xs text-brand-muted">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              <span>Press <kbd className="px-1.5 py-0.5 font-mono text-[11px] font-bold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded">?</kbd> anywhere to open this menu</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-brand-amber hover:bg-brand-amber-dark text-white font-bold rounded-lg transition-all cursor-pointer"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
