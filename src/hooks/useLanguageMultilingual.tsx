import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'te' | 'mr' | 'ta' | 'ur' | 'roman_ur' | 'hinglish';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  aiTerms: any[];
  getAITerm: (termId: string) => any;
  dir: 'ltr' | 'rtl';
  langName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  te: 'తెలుగు',
  mr: 'मराठी',
  ta: 'தமிழ்',
  ur: 'اردو',
  roman_ur: 'Roman Urdu',
  hinglish: 'Hinglish'
};

const LANGUAGE_DIRECTIONS: Record<Language, 'ltr' | 'rtl'> = {
  en: 'ltr',
  hi: 'ltr',
  te: 'ltr',
  mr: 'ltr',
  ta: 'ltr',
  ur: 'rtl',
  roman_ur: 'ltr',
  hinglish: 'ltr'
};

// Complete dictionaries for all languages
const dictionaries: Record<Language, Record<string, string>> = {
  en: require('../locales/en/common.json'),
  hi: require('../locales/hi/common.json'),
  te: require('../locales/te/common.json'),
  mr: require('../locales/mr/common.json'),
  ta: require('../locales/ta/common.json'),
  ur: require('../locales/ur/common.json'),
  roman_ur: require('../locales/roman_ur/common.json'),
  hinglish: require('../locales/hinglish/common.json')
};

// AI Terms dictionaries
const aiTermsDictionaries: Record<Language, any> = {
  en: require('../locales/en/ai-terms.json'),
  hi: require('../locales/hi/ai-terms.json'),
  te: require('../locales/te/ai-terms.json'),
  mr: require('../locales/mr/ai-terms.json'),
  ta: require('../locales/ta/ai-terms.json'),
  ur: require('../locales/ur/ai-terms.json'),
  roman_ur: require('../locales/roman_ur/ai-terms.json'),
  hinglish: require('../locales/hinglish/ai-terms.json')
};

function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  if (obj[path] && typeof obj[path] === 'string') return obj[path];
  
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clayverse_lang') as Language;
      return saved && Object.keys(LANGUAGE_NAMES).includes(saved) ? saved : 'en';
    }
    return 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clayverse_lang', newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = LANGUAGE_DIRECTIONS[newLang];
    }
  };

  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[lang];
    const value = getNestedValue(dict, key);
    return value || fallback || getNestedValue(dictionaries['en'], key) || key;
  };

  const aiTerms = aiTermsDictionaries[lang]?.terms || aiTermsDictionaries['en']?.terms || [];

  const getAITerm = (termId: string) => {
    const baseTerm = aiTermsDictionaries['en']?.terms?.find((term: any) => term.id === termId);
    if (!baseTerm) return null;

    // Map language to field suffixes
    const termFieldSuffix = lang === 'en' ? 'en' : lang === 'hi' ? 'hi' : lang === 'te' ? 'te' : lang === 'mr' ? 'mr' : lang === 'ta' ? 'ta' : lang === 'ur' ? 'ur' : lang === 'roman_ur' ? 'roman_ur' : lang === 'hinglish' ? 'hinglish' : 'en';
    
    return {
      ...baseTerm,
      term: baseTerm[`term_${termFieldSuffix}`] || baseTerm.term_en || baseTerm[`term_${lang}`] || baseTerm.term_en,
      definition: baseTerm[`definition_${termFieldSuffix}`] || baseTerm.definition_en || baseTerm[`definition_${lang}`] || baseTerm.definition_en,
      termEn: baseTerm.term_en,
      definitionEn: baseTerm.definition_en
    };
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGUAGE_DIRECTIONS[lang];
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        aiTerms,
        getAITerm,
        dir: LANGUAGE_DIRECTIONS[lang],
        langName: LANGUAGE_NAMES[lang]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageMultilingual(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageMultilingual must be used within LanguageProvider');
  }
  return context;
}

// For backward compatibility
export function useLanguage() {
  return useLanguageMultilingual();
}

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'hi', 'te', 'mr', 'ta', 'ur', 'roman_ur', 'hinglish'];
