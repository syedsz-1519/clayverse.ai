# Technical Design: Clayverse AI - Multilingual Expansion

**Project**: Clayverse AI: An Interactive Multilingual System for Visualizing Machine Learning and Generative AI Architectures

**Objective**: Expand from English + Hyderabadi focus to a comprehensive multilingual educational platform supporting all major Indian languages (Telugu, Hindi, Marathi, Gujarati, Tamil, Kannada, Bengali, Punjabi, Urdu, Malayalam, Odia, Assamese) with zero-jargon analogies, interactive sandboxes, and outcome-driven learning.

---

## 1. HIGH-LEVEL ARCHITECTURE

### 1.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLAYVERSE AI PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │             FRONTEND (React + TypeScript)                  │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │ │
│  │  │ UI Layer    │  │ State Mgmt  │  │ Localization│       │ │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤       │ │
│  │  │ Components  │  │ React Hooks │  │ LanguageCtx│       │ │
│  │  │ Animations  │  │ Custom      │  │ DictLoader │       │ │
│  │  │ Tailwind    │  │ Context API │  │ RTL Support│       │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │ │
│  │                                                             │ │
│  │  ┌─────────────────┐  ┌──────────────┐                    │ │
│  │  │ Interactive     │  │ Audio Engine │                    │ │
│  │  │ Sandboxes       │  ├──────────────┤                    │ │
│  │  ├─────────────────┤  │ TTS (Multi-  │                    │ │
│  │  │ Token Predictor │  │ language)    │                    │ │
│  │  │ RAG Simulator   │  │ Lo-Fi Synth  │                    │ │
│  │  │ CNN Explorer    │  │ Voice Effects│                    │ │
│  │  │ ML Visualizer   │  └──────────────┘                    │ │
│  │  └─────────────────┘                                       │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │      TRANSLATION & LOCALIZATION SERVICE                    │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Multi-Language Dictionary Repository                │  │ │
│  │  ├──────────────────────────────────────────────────────┤  │ │
│  │  │ • Translation Keys (UI strings)                      │  │ │
│  │  │ • Content Glossaries (85+ terms per language)        │  │ │
│  │  │ • Phonetic Guides (pronunciation hints)              │  │ │
│  │  │ • Cultural Context (region-specific analogies)       │  │ │
│  │  │ • Voice Profiles (language-specific TTS config)      │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │ Localization Engine                                 │  │ │
│  │  ├──────────────────────────────────────────────────────┤  │ │
│  │  │ • Language Detection (browser locale fallback)        │  │ │
│  │  │ • RTL/LTR Layout Detection                           │  │ │
│  │  │ • Pluralization & Gender Rules (per language)        │  │ │
│  │  │ • Date/Number Formatting                             │  │
│  │  │ • Lazy-Load Dictionaries (code-splitting)            │  │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │      DATA LAYER (Static Dictionaries + CDN)                │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │  src/data/localization/                                     │ │
│  │  ├── languages/                                             │ │
│  │  │   ├── en.ts (English base)                              │ │
│  │  │   ├── te.ts (Telugu)                                    │ │
│  │  │   ├── hi.ts (Hindi)                                     │ │
│  │  │   ├── mr.ts (Marathi)                                   │ │
│  │  │   ├── gu.ts (Gujarati)                                  │ │
│  │  │   ├── ta.ts (Tamil)                                     │ │
│  │  │   ├── kn.ts (Kannada)                                   │ │
│  │  │   ├── bn.ts (Bengali)                                   │ │
│  │  │   ├── pa.ts (Punjabi)                                   │ │
│  │  │   ├── ml.ts (Malayalam)                                 │ │
│  │  │   └── ... (other Indian languages)                      │ │
│  │  └── glossaries/                                            │ │
│  │      ├── ai-terms-en.ts                                    │ │
│  │      ├── ai-terms-te.ts                                    │ │
│  │      └── ... (per language)                                │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │           BACKEND (Express + Node)                          │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                             │ │
│  │  • Language Metadata API (/api/languages)                   │ │
│  │  • Audio Assets Streaming (language-specific TTS)           │ │
│  │  • Glossary Search (multi-language full-text)               │ │
│  │  • Progress Sync (Firebase - per language)                  │ │
│  │  • Analytics (language adoption metrics)                    │ │
│  │                                                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Supported Languages

| Language | Code | Native Name | RTL? | TTS Available | Priority |
|----------|------|-------------|------|---------------|----------|
| English | en | English | No | Yes | 1 |
| Telugu | te | తెలుగు | No | Yes | 1 |
| Hindi | hi | हिंदी | No | Yes | 1 |
| Marathi | mr | मराठी | No | Yes | 2 |
| Gujarati | gu | ગુજરાતી | No | Yes | 2 |
| Tamil | ta | தமிழ் | No | Yes | 2 |
| Kannada | kn | ಕನ್ನಡ | No | Yes | 3 |
| Bengali | bn | বাংলা | No | Yes | 3 |
| Punjabi | pa | ਪੰਜਾਬੀ | No | Yes | 3 |
| Malayalam | ml | മലയാളം | No | Yes | 3 |
| Odia | or | ଓଡିଆ | No | Yes | 4 |
| Assamese | as | অসমীয়া | No | Yes | 4 |
| Urdu | ur | اردو | Yes | Yes | 4 |

---

## 2. LOW-LEVEL DESIGN

### 2.1 Language Context & State Management

```typescript
// src/hooks/useLanguage.tsx - Expanded for multilingual support

type SupportedLanguage = 'en' | 'te' | 'hi' | 'mr' | 'gu' | 'ta' | 'kn' | 'bn' | 'pa' | 'ml' | 'or' | 'as' | 'ur';

interface LanguageMetadata {
  code: SupportedLanguage;
  name: string;               // Native name (e.g., "తెలుగు")
  englishName: string;        // English name (e.g., "Telugu")
  dir: 'ltr' | 'rtl';        // Text direction
  scriptType: ScriptType;    // Devanagari | Dravidian | Perso-Arabic
  nativeSpeaker: string;     // TTS voice profile ID
  pluralRules: (n: number) => string;
  dateFormat: string;        // 'DD/MM/YYYY' | 'MM/DD/YYYY'
  numberFormat: Intl.NumberFormat;
}

interface LanguageContextType {
  lang: SupportedLanguage;
  metadata: LanguageMetadata;
  dict: TranslationDictionary;
  glossary: GlossaryEntry[];
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  t: (key: string, params?: Record<string, any>) => string;
  tGlossary: (term: string) => GlossaryEntry | undefined;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    // Detect from browser locale, fallback to 'en'
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    return SUPPORTED_LANGUAGES[browserLang] ? browserLang : 'en';
  });

  const [dict, setDict] = useState<TranslationDictionary>({});
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([]);
  const metadata = LANGUAGE_METADATA[lang];

  const setLanguage = async (newLang: SupportedLanguage) => {
    try {
      // Lazy-load translation dictionary
      const newDict = await import(`../data/localization/languages/${newLang}.ts`);
      const newGlossary = await import(`../data/localization/glossaries/ai-terms-${newLang}.ts`);

      setDict(newDict.default);
      setGlossary(newGlossary.default);
      setLangState(newLang);

      // Update HTML lang attribute
      document.documentElement.lang = newLang;
      document.documentElement.dir = metadata.dir;

      // Store in localStorage
      localStorage.setItem('preferred_language', newLang);
    } catch (error) {
      console.error(`Failed to load language: ${newLang}`, error);
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    let value = dict[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{{${k}}}`, String(v));
      });
    }
    return value;
  };

  const tGlossary = (term: string): GlossaryEntry | undefined => {
    return glossary.find(g => g.term.toLowerCase() === term.toLowerCase());
  };

  return (
    <LanguageContext.Provider value={{ lang, metadata, dict, glossary, setLanguage, t, tGlossary }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

### 2.2 Translation Dictionary Structure

```typescript
// src/data/localization/languages/en.ts
export const englishDictionary: TranslationDictionary = {
  // Navigation
  'nav.home': 'Home',
  'nav.learn': 'Learn AI',
  'nav.glossary': 'Glossary',
  'nav.sandbox': 'Sandboxes',
  'nav.tools': 'Tools',

  // Section Titles
  'section.basics': 'The Basics: What is AI?',
  'section.family_tree': 'The AI Family Tree',
  'section.generative': 'Generative AI & LLMs',
  'section.prompting': 'Prompting & RAG',
  'section.tools': 'Free AI Tools Directory',
  'section.glossary': 'Deep Dive Glossary',

  // Interactive Components
  'sandbox.token_title': 'Next-Token Predictor',
  'sandbox.token_desc': 'See how LLMs predict words with probability weights',
  'sandbox.rag_title': 'RAG Simulator',
  'sandbox.rag_desc': 'Watch how context retrieval prevents hallucinations',

  // Glossary Terms (examples)
  'glossary.ai': 'Artificial Intelligence',
  'glossary.ml': 'Machine Learning',
  'glossary.llm': 'Large Language Model',
  'glossary.rag': 'Retrieval-Augmented Generation',

  // Clay Mascot
  'clay.greeting': 'Hello! I\'m Clay. Let\'s explore AI together!',
  'clay.prompt': 'Click me to hear an explanation...',

  // Progress & Feedback
  'progress.completed': 'You\'ve mastered {{count}} concepts',
  'progress.continue': 'Keep learning!',
};

// src/data/localization/languages/te.ts
export const teluguDictionary: TranslationDictionary = {
  // Navigation
  'nav.home': 'హోమ్',
  'nav.learn': 'AI నేర్చుకోండి',
  'nav.glossary': 'పదకోశం',
  'nav.sandbox': 'ఇంటరాక్టివ్ ప్రయోగం',
  'nav.tools': 'ఉపకరణాలు',

  // Section Titles
  'section.basics': 'ప్రాథమికాలు: AI అంటే ఏమిటి?',
  'section.family_tree': 'AI కుటుంబ చెట్టు',
  'section.generative': 'జనరేటివ్ AI & LLMs',
  'section.prompting': 'ప్రాంప్టింగ్ & RAG',
  'section.tools': 'ఉచిత AI సాధనాల జాబితా',
  'section.glossary': 'లోతైన డివ్ గ్లోసరీ',

  // Interactive Components
  'sandbox.token_title': 'తరువాత-టోకన్ ప్రిడిక్టర్',
  'sandbox.token_desc': 'LLMs సంభావ్యత బరువులతో పదాలను ఎలా అంచనా వేస్తాయో చూడండి',
  'sandbox.rag_title': 'RAG సిమ్యులేటర్',
  'sandbox.rag_desc': 'సందర్భం పునరుద్ధరణ ఎలా భ్రాంతిని నిరోధిస్తుందో చూడండి',

  // Glossary Terms
  'glossary.ai': 'కృత్రిమ మేధస్సు',
  'glossary.ml': 'యంత్ర శిక్షణ',
  'glossary.llm': 'పెద్ద భాష మోడల్',
  'glossary.rag': 'పునరుద్ధరణ-విస్తరణ ఉత్పత్తి',

  // Clay Mascot
  'clay.greeting': 'హలో! నేను Clay. AI ను కలిసి అన్వేషించుకుందాం!',
  'clay.prompt': 'నన్ను క్లిక్ చేసి వివరణ వినండి...',

  // Progress & Feedback
  'progress.completed': 'మీరు {{count}} కాన్సెప్టులను నేర్చుకున్నారు',
  'progress.continue': 'తరువాత కూడా నేర్చుకోండి!',
};

// Similar structure for hi.ts, mr.ts, gu.ts, ta.ts, etc.
```

### 2.3 Glossary Structure (Per Language)

```typescript
// src/data/localization/glossaries/ai-terms-en.ts
export interface GlossaryEntry {
  id: string;
  term: string;                    // "Artificial Intelligence"
  definition: string;              // Clear, beginner-friendly explanation
  analogies?: string[];            // Real-world examples
  prerequisites?: string[];        // Pre-requisite terms
  section: number;                 // 1-12 based on curriculum
  tags?: string[];                 // ['basics', 'ML', 'beginner']
  audioUrl?: string;              // Language-specific audio snippet
  imageUrl?: string;              // Diagrams/visuals
}

export const aiTermsEnglish: GlossaryEntry[] = [
  {
    id: 'ai_001',
    term: 'Artificial Intelligence',
    definition: 'Systems designed to perform tasks that normally require human intelligence, like learning from data, recognizing patterns, and making decisions.',
    analogies: [
      'Like teaching a child to recognize dogs by showing many dog pictures',
      'A very smart assistant that learns from examples instead of following a rulebook'
    ],
    section: 1,
    tags: ['basics', 'foundational'],
  },
  {
    id: 'ml_001',
    term: 'Machine Learning',
    definition: 'A method where computers learn patterns from data instead of being explicitly programmed with rules.',
    prerequisites: ['ai_001'],
    analogies: [
      'Learning to cook by making dishes many times, not by reading instructions',
      'A student who gets better at math by solving many problems'
    ],
    section: 2,
    tags: ['ML', 'core-concept'],
  },
  // ... 85+ terms
];

// src/data/localization/glossaries/ai-terms-te.ts
export const aiTermsTelugu: GlossaryEntry[] = [
  {
    id: 'ai_001',
    term: 'కృత్రిమ మేధస్సు',
    definition: 'డేటా నుండి నేర్చుకోవడం, నమూనాలను గుర్తించడం మరియు నిర్ణయాలు తీసుకోవడం వంటి సాధారణంగా మానవ మేధస్సు అవసరమయ్యే విధులను నిర్వహించడానికి ఆకృతీకరించిన సంస్థలు.',
    analogies: [
      'చాలా కుక్కల చిత్రాలను చూపించడం ద్వారా కుక్కలను గుర్తించడానికి ఒక బిడ్డకు నేర్పించడం వంటిది',
      'నియమ పుస్తకం నుండి కాకుండా ఉదాహరణల నుండి నేర్చుకునే చాలా తెలివైన సహాయకుడు'
    ],
    section: 1,
    tags: ['basics', 'foundational'],
  },
  // ... 85+ terms
];
```

### 2.4 Component Pattern: Multilingual-Aware Components

```typescript
// src/components/LocalizedCard.tsx - Reusable pattern
interface LocalizedCardProps {
  contentKey: string;           // 'section.basics'
  glossaryTerms?: string[];    // ['ai_001', 'ml_001']
  interactiveElements?: ReactNode;
  lang?: SupportedLanguage;    // Optional override
}

export function LocalizedCard({ 
  contentKey, 
  glossaryTerms = [], 
  interactiveElements 
}: LocalizedCardProps) {
  const { t, tGlossary, lang } = useLanguage();
  const metadata = useLanguageMetadata();

  return (
    <motion.div
      className={`skeuo-raised p-8 rounded-2xl ${metadata.dir === 'rtl' ? 'rtl' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <h2 className={`font-display text-3xl ${metadata.dir === 'rtl' ? 'text-right' : ''}`}>
        {t(contentKey)}
      </h2>

      {glossaryTerms.length > 0 && (
        <div className="mt-4 space-y-2">
          {glossaryTerms.map(termId => {
            const term = tGlossary(termId);
            return term ? (
              <p key={termId} className="text-sm text-brand-muted">
                <strong>{term.term}:</strong> {term.definition}
              </p>
            ) : null;
          })}
        </div>
      )}

      {interactiveElements}
    </motion.div>
  );
}
```

### 2.5 Audio Engine: Multilingual TTS Integration

```typescript
// src/lib/audioEngine.ts - Extended for multilingual TTS

interface LanguageVoiceProfile {
  lang: SupportedLanguage;
  voiceMap: {
    male: string;
    female: string;
    neutral: string;
  };
  speechRate: number;        // Language-specific optimal rate
  pitch: number;
  prosody: 'natural' | 'expressive' | 'formal';
}

const LANGUAGE_VOICE_PROFILES: Record<SupportedLanguage, LanguageVoiceProfile> = {
  en: {
    lang: 'en',
    voiceMap: { male: 'en-US-Neural2-C', female: 'en-US-Neural2-E', neutral: 'en-US-Neural2-A' },
    speechRate: 0.95,
    pitch: 1.0,
    prosody: 'natural',
  },
  te: {
    lang: 'te',
    voiceMap: { male: 'te-IN-Neural2-C', female: 'te-IN-Neural2-A', neutral: 'te-IN-Neural2-B' },
    speechRate: 0.85,  // Slightly slower for complex Telugu grammar
    pitch: 1.0,
    prosody: 'expressive',
  },
  hi: {
    lang: 'hi',
    voiceMap: { male: 'hi-IN-Neural2-C', female: 'hi-IN-Neural2-A', neutral: 'hi-IN-Neural2-B' },
    speechRate: 0.80,
    pitch: 1.1,
    prosody: 'expressive',
  },
  // ... profiles for all languages
};

export class AudioEngine {
  private currentLang: SupportedLanguage = 'en';
  private voiceProfile: LanguageVoiceProfile;

  constructor(lang: SupportedLanguage = 'en') {
    this.currentLang = lang;
    this.voiceProfile = LANGUAGE_VOICE_PROFILES[lang];
  }

  async setLanguage(lang: SupportedLanguage) {
    this.currentLang = lang;
    this.voiceProfile = LANGUAGE_VOICE_PROFILES[lang];
  }

  async speak(text: string, options?: { voice?: 'male' | 'female' | 'neutral' }) {
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = `${this.currentLang}-IN`;
    utterance.rate = this.voiceProfile.speechRate;
    utterance.pitch = this.voiceProfile.pitch;

    const voiceKey = options?.voice || 'neutral';
    // Map voice profile to system TTS voice
    const voices = synthesis.getVoices();
    const selectedVoice = voices.find(v => v.lang.startsWith(this.currentLang));
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    synthesis.speak(utterance);
  }

  // Lo-Fi synthesis customized per language (same Web Audio implementation)
  startAmbientLooper() {
    // Same as before - language-independent
  }
}
```

### 2.6 RTL & Script Support

```typescript
// src/hooks/useLanguageMetadata.ts
export interface LanguageMetadata {
  code: SupportedLanguage;
  dir: 'ltr' | 'rtl';
  scriptType: 'Latin' | 'Devanagari' | 'Dravidian' | 'Bengali' | 'Perso-Arabic';
}

const LANGUAGE_METADATA: Record<SupportedLanguage, LanguageMetadata> = {
  en: { code: 'en', dir: 'ltr', scriptType: 'Latin' },
  te: { code: 'te', dir: 'ltr', scriptType: 'Dravidian' },
  hi: { code: 'hi', dir: 'ltr', scriptType: 'Devanagari' },
  mr: { code: 'mr', dir: 'ltr', scriptType: 'Devanagari' },
  gu: { code: 'gu', dir: 'ltr', scriptType: 'Devanagari' },
  ta: { code: 'ta', dir: 'ltr', scriptType: 'Dravidian' },
  kn: { code: 'kn', dir: 'ltr', scriptType: 'Dravidian' },
  bn: { code: 'bn', dir: 'ltr', scriptType: 'Bengali' },
  pa: { code: 'pa', dir: 'ltr', scriptType: 'Devanagari' },
  ml: { code: 'ml', dir: 'ltr', scriptType: 'Dravidian' },
  or: { code: 'or', dir: 'ltr', scriptType: 'Dravidian' },
  as: { code: 'as', dir: 'ltr', scriptType: 'Bengali' },
  ur: { code: 'ur', dir: 'rtl', scriptType: 'Perso-Arabic' },
};

// Tailwind config for RTL support
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/rtl'),  // RTL plugin for Tailwind
  ],
};

// Component usage with RTL
export function Hero() {
  const { lang } = useLanguage();
  const metadata = useLanguageMetadata();

  return (
    <div className={metadata.dir === 'rtl' ? 'rtl' : 'ltr'}>
      <h1 className="text-right">{/* RTL-aware */}</h1>
    </div>
  );
}
```

### 2.7 Dictionary Lazy-Loading Strategy

```typescript
// src/lib/dictionaryLoader.ts
type DictionaryCache = Record<SupportedLanguage, TranslationDictionary>;
type GlossaryCache = Record<SupportedLanguage, GlossaryEntry[]>;

const dictionaryCache: DictionaryCache = {};
const glossaryCache: GlossaryCache = {};

export async function loadDictionary(lang: SupportedLanguage): Promise<TranslationDictionary> {
  // Return from cache if already loaded
  if (dictionaryCache[lang]) {
    return dictionaryCache[lang];
  }

  try {
    // Lazy import based on language code
    const module = await import(`../data/localization/languages/${lang}.ts`);
    dictionaryCache[lang] = module.default;
    return module.default;
  } catch (error) {
    console.error(`Failed to load dictionary for ${lang}:`, error);
    // Fallback to English
    return dictionaryCache['en'] || {};
  }
}

export async function loadGlossary(lang: SupportedLanguage): Promise<GlossaryEntry[]> {
  if (glossaryCache[lang]) {
    return glossaryCache[lang];
  }

  try {
    const module = await import(`../data/localization/glossaries/ai-terms-${lang}.ts`);
    glossaryCache[lang] = module.default;
    return module.default;
  } catch (error) {
    console.error(`Failed to load glossary for ${lang}:`, error);
    return glossaryCache['en'] || [];
  }
}

// Preload critical languages on app boot
export function preloadCriticalLanguages() {
  const criticalLangs: SupportedLanguage[] = ['en', 'te', 'hi'];
  return Promise.all(
    criticalLangs.map(lang => Promise.all([
      loadDictionary(lang),
      loadGlossary(lang),
    ]))
  );
}
```

### 2.8 Glossary Search (Full-Text, Multi-Language)

```typescript
// src/components/GlossarySearch.tsx
interface SearchResult extends GlossaryEntry {
  matchType: 'term' | 'definition' | 'analogy';
  highlightedText: string;
}

export function GlossarySearch() {
  const { lang, glossary, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const performSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchTerm.toLowerCase();
    const matches: SearchResult[] = [];

    glossary.forEach(entry => {
      // Search in term
      if (entry.term.toLowerCase().includes(lowerQuery)) {
        matches.push({
          ...entry,
          matchType: 'term',
          highlightedText: entry.term,
        });
        return;
      }

      // Search in definition
      if (entry.definition.toLowerCase().includes(lowerQuery)) {
        matches.push({
          ...entry,
          matchType: 'definition',
          highlightedText: entry.definition.substring(0, 100) + '...',
        });
        return;
      }

      // Search in analogies
      entry.analogies?.forEach(analogy => {
        if (analogy.toLowerCase().includes(lowerQuery)) {
          matches.push({
            ...entry,
            matchType: 'analogy',
            highlightedText: analogy.substring(0, 100) + '...',
          });
        }
      });
    });

    setResults(matches);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder={t('glossary.search_placeholder')}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          performSearch(e.target.value);
        }}
        className="w-full p-3 border border-brand-amber rounded-lg"
      />

      <div className="space-y-2">
        {results.map(result => (
          <div key={result.id} className="p-4 bg-brand-sand rounded-lg">
            <h3 className="font-bold text-brand-charcoal">{result.term}</h3>
            <p className="text-sm text-brand-muted">{result.highlightedText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 3. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-2)
- Set up multi-language file structure and base context
- Implement lazy-loading infrastructure
- Create translation files for English + Telugu + Hindi
- Add RTL support and language metadata

### Phase 2: Core Features (Weeks 3-4)
- Integrate multilingual TTS into Audio Engine
- Create localized components (Hero, WhatIsAI, etc.)
- Implement glossary search across languages
- Add language switcher UI

### Phase 3: Regional Expansion (Weeks 5-6)
- Add Marathi, Gujarati, Tamil, Kannada dictionaries
- Implement region-specific analogies in components
- Add pronunciation guides for complex terms
- Test TTS across all languages

### Phase 4: Polish & Analytics (Week 7+)
- Add learning analytics (per-language user metrics)
- Optimize dictionary loading (code-splitting by language)
- Implement A/B testing for regional variations
- Deploy to production with CDN optimization

---

## 4. DATA STRUCTURE SUMMARY

```
src/
├── data/
│   └── localization/
│       ├── languages/
│       │   ├── en.ts
│       │   ├── te.ts
│       │   ├── hi.ts
│       │   ├── mr.ts
│       │   ├── gu.ts
│       │   ├── ta.ts
│       │   ├── kn.ts
│       │   ├── bn.ts
│       │   ├── pa.ts
│       │   ├── ml.ts
│       │   ├── or.ts
│       │   ├── as.ts
│       │   └── ur.ts
│       └── glossaries/
│           ├── ai-terms-en.ts
│           ├── ai-terms-te.ts
│           ├── ai-terms-hi.ts
│           ├── ai-terms-mr.ts
│           └── ... (per language)
├── hooks/
│   ├── useLanguage.tsx (expanded)
│   ├── useLanguageMetadata.ts (new)
│   └── useScrollProgress.ts (existing)
├── lib/
│   ├── audioEngine.ts (enhanced)
│   ├── dictionaryLoader.ts (new)
│   └── firebase.ts (existing)
└── components/
    ├── LocalizedCard.tsx (new)
    ├── GlossarySearch.tsx (enhanced)
    └── ... (other components updated for i18n)
```

---

## 5. KEY DESIGN PRINCIPLES

1. **Zero-Jargon Approach**: All content uses analogies from daily life
2. **Cultural Relevance**: Region-specific examples in translations
3. **Lazy Loading**: Only load dictionary for selected language
4. **RTL Support**: Full support for Urdu and other RTL languages
5. **Accessibility**: All TTS outputs tested for clarity
6. **Performance**: Minimal bundle size per language (target <50KB per language file)
7. **Fallback Strategy**: Always gracefully fall back to English
8. **Analytics**: Track per-language learning outcomes separately

