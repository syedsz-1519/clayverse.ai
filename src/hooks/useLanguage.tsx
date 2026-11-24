// This file re-exports from useLanguageMultilingual for backward compatibility
// All old imports from useLanguage should work automatically

export { 
  useLanguageMultilingual as useLanguage,
  LanguageProvider,
  useLanguage as useLanguageMultilingual,
  SUPPORTED_LANGUAGES,
  type Language,
} from './useLanguageMultilingual';
