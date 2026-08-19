# Implementation Tasks: Clayverse AI - Multilingual Expansion

**Spec**: Clayverse AI - Multilingual Expansion  
**Scope**: Transform the platform to support 12+ Indian languages with full localization, TTS, RTL support, and interactive sandboxes

---

## TASK DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 1: FOUNDATION (Weeks 1-2)                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Task 1.1: Set up multi-language file structure                    │
│  Task 1.2: Implement Language Context API (useLanguage hook)       │
│  Task 1.3: Create base English translation dictionary              │
│  Task 1.4: Implement lazy-loading infrastructure                   │
│                                                                     │
│  ↓ ↓ ↓ ↓ (all must complete before Phase 2)                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ PHASE 2: MVP LANGUAGES (Weeks 3-4)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Task 2.1: Create Telugu (te) translation dictionary               │
│  Task 2.2: Create Hindi (hi) translation dictionary                │
│  Task 2.3: Create Telugu AI glossary (85+ terms)                   │
│  Task 2.4: Create Hindi AI glossary (85+ terms)                    │
│  Task 2.5: Implement multilingual TTS integration                  │
│  Task 2.6: Add language metadata & RTL support                     │
│  Task 2.7: Localize Hero, WhatIsAI, AIFamilyTree components       │
│  Task 2.8: Create language switcher UI                             │
│                                                                     │
│  ↓ ↓ ↓ ↓ (all must complete before Phase 3)                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ PHASE 3: EXPANSION LANGUAGES (Weeks 5-6)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Task 3.1: Create Marathi (mr) translation & glossary              │
│  Task 3.2: Create Gujarati (gu) translation & glossary             │
│  Task 3.3: Create Tamil (ta) translation & glossary                │
│  Task 3.4: Create Kannada (kn) translation & glossary              │
│  Task 3.5: Implement glossary search (multi-language)              │
│  Task 3.6: Add pronunciation guides                                │
│  Task 3.7: Test TTS across all Phase 3 languages                   │
│                                                                     │
│  ↓ ↓ ↓ ↓                                                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ PHASE 4: FINAL LANGUAGES & POLISH (Weeks 7-8)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Task 4.1: Create Bengali (bn) translation & glossary              │
│  Task 4.2: Create Punjabi (pa) translation & glossary              │
│  Task 4.3: Create Malayalam (ml) translation & glossary            │
│  Task 4.4: Create Odia (or) translation & glossary                 │
│  Task 4.5: Create Assamese (as) translation & glossary             │
│  Task 4.6: Create Urdu (ur) translation & glossary + RTL fix       │
│  Task 4.7: Localize all interactive sandboxes (Token, RAG, CNN)   │
│  Task 4.8: Per-language learning progress tracking                 │
│  Task 4.9: Language-specific analytics dashboard                   │
│  Task 4.10: Performance optimization & code-splitting              │
│  Task 4.11: Accessibility audit & fixes                            │
│  Task 4.12: Cross-language integration testing                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: FOUNDATION (Weeks 1-2)

### Task 1.1: Set Up Multi-Language File Structure

**Objective**: Create the directory structure and configuration for supporting 12+ languages with lazy-loading

**User Story**: As a developer, I need a scalable file structure for language dictionaries so that adding new languages is simple and consistent.

**Acceptance Criteria**:
1. Create `/src/data/localization/` directory with subdirectories:
   - `languages/` (for UI translation files)
   - `glossaries/` (for AI term definitions per language)
   - `metadata.ts` (language metadata, voice profiles, formatting rules)
2. Configure Vite/webpack for code-splitting by language (each language loads as separate chunk)
3. Create `.config.kiro` with proper spec metadata
4. Document file structure in project README
5. Set up TypeScript types for language structure

**Subtasks**:
- [ ] Create directory structure
- [ ] Define TypeScript interfaces (`TranslationDictionary`, `GlossaryEntry`, `LanguageMetadata`)
- [ ] Configure build tool code-splitting
- [ ] Add to `.gitignore` (if needed for generated files)
- [ ] Document localization guidelines

**Time Estimate**: 2-3 hours

**Dependencies**: None (starter task)

---

### Task 1.2: Implement Language Context API (useLanguage Hook)

**Objective**: Create React Context and custom hooks for managing language state, translations, and glossary lookups

**User Story**: As a component developer, I want a single hook I can use to access translations and language metadata, so I don't duplicate localization logic across components.

**Acceptance Criteria**:
1. Create `useLanguage()` hook that returns: `{ lang, metadata, dict, glossary, setLanguage, t, tGlossary }`
2. Implement `t(key, params)` function for string translation with parameter substitution
3. Implement `tGlossary(term)` function for glossary term lookup
4. Hook uses lazy-loading to fetch dictionaries only when needed
5. Implement caching so re-selecting a language doesn't re-fetch
6. Browser language auto-detection with localStorage fallback
7. Support for RTL detection based on language
8. TypeScript fully typed with no `any` types

**Subtasks**:
- [ ] Create LanguageContext with proper TypeScript types
- [ ] Implement lazy dictionary loading with error handling
- [ ] Add browser language detection logic
- [ ] Implement localStorage persistence
- [ ] Create `useLanguageMetadata()` hook for RTL/script detection
- [ ] Write unit tests for context API
- [ ] Document hook usage in components

**Time Estimate**: 4-5 hours

**Dependencies**: Task 1.1 (file structure, TypeScript types)

---

### Task 1.3: Create Base English Translation Dictionary

**Objective**: Build comprehensive English translation dictionary covering all UI strings and component labels

**User Story**: As a developer, I need a complete English translation file as the base dictionary, so other languages can use it as a reference and fallback.

**Acceptance Criteria**:
1. Create `src/data/localization/languages/en.ts` with all UI strings
2. Include translations for: navigation, section titles, component labels, interactive elements, Clay dialogs, progress messages
3. At minimum 200+ translation keys covering full app flow
4. Use consistent key naming: `'section.name'`, `'button.action'`, `'error.message'` format
5. Support parameterized strings: `'progress.completed': 'You\'ve mastered {{count}} concepts'`
6. No hardcoded English strings in UI components after this task
7. Export as default object with type `TranslationDictionary`

**Subtasks**:
- [ ] Audit all components and identify strings to translate
- [ ] Create comprehensive key list (200+)
- [ ] Write English translations for all keys
- [ ] Add parameterized strings where needed
- [ ] Test parameter substitution with t() function
- [ ] Document translation keys in README

**Time Estimate**: 4-5 hours

**Dependencies**: Task 1.1, Task 1.2

---

### Task 1.4: Implement Lazy-Loading Infrastructure for Dictionaries

**Objective**: Set up efficient lazy-loading mechanism so dictionaries load only when user selects that language

**User Story**: As a platform maintainer, I want language dictionaries to load on-demand, so the initial app bundle stays small and fast.

**Acceptance Criteria**:
1. Create `src/lib/dictionaryLoader.ts` with async loading functions
2. Implement `loadDictionary(lang)` function with caching
3. Implement `loadGlossary(lang)` function with caching
4. Implement `preloadCriticalLanguages()` for English, Telugu, Hindi on app boot
5. Show loading indicator while fetching non-cached language
6. Handle loading failures gracefully (fallback to English)
7. Measure bundle sizes: base bundle < 200KB, each language < 50KB
8. Test lazy-loading with multiple language switches

**Subtasks**:
- [ ] Implement dictionary loader with caching
- [ ] Add loading state to LanguageContext
- [ ] Create loading indicator component
- [ ] Implement critical language preloading
- [ ] Add error handling & fallback
- [ ] Measure bundle sizes for base + each language
- [ ] Performance test: measure language switch time

**Time Estimate**: 3-4 hours

**Dependencies**: Task 1.1, Task 1.2, Task 1.3

---

## PHASE 2: MVP LANGUAGES (Weeks 3-4)

### Task 2.1: Create Telugu (te) Translation Dictionary

**Objective**: Build complete Telugu translation for all UI strings, optimized for Telugu speakers

**User Story**: As a Telugu learner, I want the entire platform interface in my language, so I can learn without code-switching to English.

**Acceptance Criteria**:
1. Create `src/data/localization/languages/te.ts` with all translation keys from English
2. All 200+ keys translated to Telugu (not machine-translated; human-reviewed)
3. Translations use formal, clear Telugu suitable for educational content
4. No transliteration of English technical terms where not necessary
5. All translated strings match or exceed English string length capacity (no layout breaking)
6. Export as default object
7. Tested with language switcher (verify no missing keys)

**Subtasks**:
- [ ] Compile master list of 200+ translation keys
- [ ] Translate all keys to Telugu with native speaker review
- [ ] Handle pluralization rules for Telugu
- [ ] Test in UI with actual components
- [ ] Verify no layout issues with Telugu text length
- [ ] Final review by Telugu speaker

**Time Estimate**: 6-7 hours (with native speaker involvement)

**Dependencies**: Task 1.3 (English dictionary)

---

### Task 2.2: Create Hindi (hi) Translation Dictionary

**Objective**: Build complete Hindi translation for all UI strings, culturally adapted for Hindi-speaking learners

**User Story**: As a Hindi learner, I want the platform available in Hindi so I can learn AI concepts in my native language.

**Acceptance Criteria**:
1. Create `src/data/localization/languages/hi.ts` with all 200+ translation keys
2. Hindi translations use Devanagari script correctly
3. Formal Hindi suitable for educational context (not colloquial)
4. Handle Hindi-specific grammar and gender where applicable
5. All strings properly formatted and tested in UI
6. No layout breaking with Hindi text length
7. Export as default object

**Subtasks**:
- [ ] Translate all 200+ keys to Hindi
- [ ] Hindi speaker review for accuracy and formality
- [ ] Handle Devanagari script rendering
- [ ] Test in UI components
- [ ] Verify layout stability
- [ ] Final approval

**Time Estimate**: 6-7 hours

**Dependencies**: Task 1.3

---

### Task 2.3: Create Telugu AI Glossary (85+ Terms)

**Objective**: Build comprehensive glossary of AI terms in Telugu with definitions, analogies, and prerequisites

**User Story**: As a Telugu learner, I want all 85+ AI concepts explained in Telugu with local analogies, so I understand complex topics through familiar contexts.

**Acceptance Criteria**:
1. Create `src/data/localization/glossaries/ai-terms-te.ts` with 85+ entries
2. Each term includes: id, term (Telugu), definition (Telugu), analogies (2-3, culturally adapted), prerequisites, section (1-12), tags, optional audioUrl
3. Analogies use Telugu/Indian contexts (farmers, daily life, local examples)
4. Prerequisites correctly map to other Telugu terms
5. Curriculum sections 1-12 are all populated
6. Terms are organized by section and difficulty progression
7. All terms reviewed by Telugu speaker for accuracy
8. Tested with glossary search function

**Subtasks**:
- [ ] Compile 85+ terms based on English glossary
- [ ] Write Telugu definitions for each term
- [ ] Create 2-3 culturally relevant analogies per term
- [ ] Map prerequisites correctly
- [ ] Organize by section (1-12)
- [ ] Telugu speaker review
- [ ] Test glossary search
- [ ] Load testing with 85+ entries

**Time Estimate**: 10-12 hours (with native speaker collaboration)

**Dependencies**: Task 2.1

---

### Task 2.4: Create Hindi AI Glossary (85+ Terms)

**Objective**: Build comprehensive glossary of AI terms in Hindi with cultural adaptations

**User Story**: As a Hindi learner, I want Hindi explanations of AI concepts with Indian context, so learning feels personally relevant.

**Acceptance Criteria**:
1. Create `src/data/localization/glossaries/ai-terms-hi.ts` with 85+ entries
2. Each term fully translated and defined in Hindi
3. Analogies use Hindi/Indian cultural context
4. All 12 curriculum sections populated
5. Hindi speaker reviewed
6. Tested with search and display

**Subtasks**:
- [ ] Translate 85+ terms to Hindi
- [ ] Write Hindi definitions
- [ ] Create Hindi-context analogies
- [ ] Map prerequisites
- [ ] Organize by section
- [ ] Hindi speaker review
- [ ] Test glossary

**Time Estimate**: 10-12 hours

**Dependencies**: Task 2.2

---

### Task 2.5: Implement Multilingual TTS Integration

**Objective**: Integrate Web Speech Synthesis API with language-specific voice profiles and optimize speech quality per language

**User Story**: As a learner, I want Clay to speak explanations in my native language at a comfortable listening pace, so I can learn through audio narration.

**Acceptance Criteria**:
1. Extend `audioEngine.ts` to support multilingual TTS
2. Implement `setLanguage(lang)` method to switch TTS language
3. Define voice profiles for English, Telugu, Hindi with: voiceMap, speechRate, pitch, prosody
4. Speech rate optimized per language (e.g., Telugu 0.85, English 0.95)
5. Pitch adjusted to sound natural per language
6. TTS works across all browsers (graceful fallback if unsupported)
7. TTS works simultaneously with lo-fi audio (Web Audio API)
8. User can adjust volume, speech rate, pitch independently
9. Tested with sample text in English, Telugu, Hindi

**Subtasks**:
- [ ] Research Web Speech Synthesis API for language support
- [ ] Define voice profiles for each language
- [ ] Implement language switching in AudioEngine
- [ ] Test TTS with all browsers (Chrome, Safari, Firefox)
- [ ] Implement speech rate/pitch adjustment UI
- [ ] Test concurrent audio (TTS + lo-fi synthesis)
- [ ] Add fallback for unsupported browsers
- [ ] Performance test on low-end devices

**Time Estimate**: 5-6 hours

**Dependencies**: Task 1.2, existing audioEngine.ts

---

### Task 2.6: Add Language Metadata & RTL Support

**Objective**: Implement language metadata (text direction, script type, formatting rules) and RTL layout support

**User Story**: As a developer, I want language-specific metadata (RTL, script type) to automatically apply correct styling, so RTL languages and special scripts render correctly without manual adjustments per component.

**Acceptance Criteria**:
1. Create `src/data/localization/metadata.ts` with `LANGUAGE_METADATA` for all 12 languages
2. Include for each language: code, name, englishName, dir (ltr/rtl), scriptType, nativeSpeaker, pluralRules, dateFormat
3. Create `useLanguageMetadata()` hook to access metadata
4. Implement RTL detection: set `dir` attribute on HTML element
5. Add Tailwind CSS RTL utilities (using `@tailwindcss/rtl` plugin or custom Tailwind config)
6. Update components to use `metadata.dir` for conditional RTL styling
7. Test RTL layout with Urdu (when available)
8. No layout breaking in RTL mode

**Subtasks**:
- [ ] Define metadata structure
- [ ] Create metadata for all 12 languages
- [ ] Install @tailwindcss/rtl plugin
- [ ] Create useLanguageMetadata hook
- [ ] Update HTML element RTL attribute
- [ ] Audit components for RTL-unsafe styles
- [ ] Update key components with RTL support
- [ ] Test RTL layout

**Time Estimate**: 4-5 hours

**Dependencies**: Task 1.2, Task 2.1, Task 2.2

---

### Task 2.7: Localize Hero, WhatIsAI, AIFamilyTree Components

**Objective**: Update key educational components to render in the user's selected language

**User Story**: As a learner, I want the main educational sections (Hero, What is AI, AI Family Tree) displayed in my language, so I can follow the entire learning path in my native language.

**Acceptance Criteria**:
1. Update `Hero.tsx` to use `useLanguage()` hook and display translated section titles, descriptions
2. Update `WhatIsAI.tsx` to display content in selected language with translations for all text and labels
3. Update `AIFamilyTree.tsx` to show AI hierarchy diagram with labels in selected language
4. Verify all text nodes use `t()` function instead of hardcoded strings
5. Test all three components with English, Telugu, Hindi
6. No missing translations (use fallback keys to verify)
7. Interactive elements work correctly in all languages

**Subtasks**:
- [ ] Audit Hero component for hardcoded strings
- [ ] Replace strings with t() calls
- [ ] Audit WhatIsAI for translations
- [ ] Update interactive elements with translations
- [ ] Audit AIFamilyTree
- [ ] Update diagram labels and descriptions
- [ ] Test with all three languages
- [ ] Verify no layout breaking with translated text

**Time Estimate**: 4-5 hours

**Dependencies**: Task 2.1, Task 2.2, Task 1.2

---

### Task 2.8: Create Language Switcher UI

**Objective**: Build intuitive language switcher component allowing users to switch between languages easily

**User Story**: As a learner, I want an easy way to switch between languages while learning, so I can explore concepts in different languages or help friends in their language.

**Acceptance Criteria**:
1. Create `FloatingLanguageSwitcher.tsx` component (or extend existing)
2. Display all 12 languages with native names and English names
3. Show currently selected language highlighted
4. Clicking a language triggers language switch (< 500ms)
5. Component positions: floating bubble or in navigation bar
6. Mobile-friendly (touch targets 44px+)
7. Display loading indicator while language loads
8. Smooth animation on language switch
9. Show language code on hover (e.g., "te", "hi")
10. Persist selection to localStorage

**Subtasks**:
- [ ] Design language switcher UI (floating or nav bar)
- [ ] Create component with all 12 language options
- [ ] Implement language switching logic
- [ ] Add loading indicator
- [ ] Test language switch performance
- [ ] Mobile testing
- [ ] Animation polishing
- [ ] localStorage integration

**Time Estimate**: 3-4 hours

**Dependencies**: Task 1.2, Task 2.1, Task 2.2

---

## PHASE 3: EXPANSION LANGUAGES (Weeks 5-6)

### Task 3.1: Create Marathi (mr) Translation & Glossary

**Objective**: Build Marathi language support (UI + 85+ glossary terms)

**User Story**: As a Marathi learner, I want to access the platform entirely in Marathi, so I can learn AI in my native language.

**Acceptance Criteria**:
1. Create `src/data/localization/languages/mr.ts` with 200+ translations
2. Create `src/data/localization/glossaries/ai-terms-mr.ts` with 85+ terms
3. All translations human-reviewed by native Marathi speaker
4. Analogies adapted for Marathi cultural context
5. All 12 glossary sections populated
6. Tested in UI with language switcher

**Subtasks**:
- [ ] Translate UI strings to Marathi
- [ ] Translate 85+ glossary terms
- [ ] Create Marathi-context analogies
- [ ] Native speaker review
- [ ] Test in UI
- [ ] Fix any layout issues

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3, Task 2.1

---

### Task 3.2: Create Gujarati (gu) Translation & Glossary

**Objective**: Build Gujarati language support (UI + 85+ glossary terms)

**User Story**: As a Gujarati learner, I want platform access in Gujarati for seamless learning.

**Acceptance Criteria**:
1. Create `src/data/localization/languages/gu.ts` (200+ keys)
2. Create `src/data/localization/glossaries/ai-terms-gu.ts` (85+ terms)
3. Native speaker review
4. Cultural adaptation of analogies
5. All sections populated

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3, Task 2.1

---

### Task 3.3: Create Tamil (ta) Translation & Glossary

**Objective**: Build Tamil language support (UI + 85+ glossary terms)

**Acceptance Criteria**:
1. Create `src/data/localization/languages/ta.ts` (200+ keys)
2. Create `src/data/localization/glossaries/ai-terms-ta.ts` (85+ terms)
3. Native speaker review
4. Tamil script properly rendered
5. Cultural context analogies

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3

---

### Task 3.4: Create Kannada (kn) Translation & Glossary

**Objective**: Build Kannada language support (UI + 85+ glossary terms)

**Acceptance Criteria**:
1. Create `src/data/localization/languages/kn.ts` (200+ keys)
2. Create `src/data/localization/glossaries/ai-terms-kn.ts` (85+ terms)
3. Native speaker review
4. Kannada script rendering

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3

---

### Task 3.5: Implement Glossary Search (Multi-Language)

**Objective**: Build full-text search across glossary terms in all languages

**User Story**: As a learner, I want to search for AI glossary terms in my language, so I can quickly find definitions and related concepts.

**Acceptance Criteria**:
1. Create `GlossarySearch.tsx` component
2. Search works across: term name, definition, analogies, tags
3. Supports partial matches and case-insensitive search
4. Results sorted by relevance (term match > definition > analogy)
5. Highlights matched text in results
6. Includes prerequisite terms in results
7. Search performance < 200ms for any query
8. Works across all 8+ languages available

**Subtasks**:
- [ ] Create search component UI
- [ ] Implement search algorithm
- [ ] Add relevance ranking
- [ ] Implement text highlighting
- [ ] Add prerequisite linking
- [ ] Performance testing
- [ ] Mobile testing

**Time Estimate**: 4-5 hours

**Dependencies**: Task 3.1-3.4

---

### Task 3.6: Add Pronunciation Guides

**Objective**: Add optional pronunciation hints for complex AI terms in each language

**User Story**: As a learner unfamiliar with technical terminology, I want pronunciation guides for complex AI terms, so I can pronounce them correctly.

**Acceptance Criteria**:
1. Add optional `pronunciation` field to GlossaryEntry
2. Create pronunciation guides for technical terms (Transformer, Convolution, Hallucination, etc.)
3. Use International Phonetic Alphabet (IPA) or language-specific phonetic representation
4. Pronunciation available in UI (hover tooltip or expandable section)
5. Integrated with TTS (users can click to hear pronunciation)
6. Cover at least 30+ technical terms per language

**Subtasks**:
- [ ] Add pronunciation field to GlossaryEntry interface
- [ ] Create pronunciation guide for 30+ key terms
- [ ] Implement pronunciation tooltip/display
- [ ] Integrate with TTS playback
- [ ] Test pronunciation audio quality
- [ ] Mobile support

**Time Estimate**: 3-4 hours

**Dependencies**: Task 2.3, Task 2.4

---

### Task 3.7: Test TTS Across All Phase 3 Languages

**Objective**: Validate and optimize TTS for Marathi, Gujarati, Tamil, Kannada

**User Story**: As a platform maintainer, I want to ensure TTS quality is consistent and natural-sounding across all Indian languages, so learners have a pleasant audio experience.

**Acceptance Criteria**:
1. Test TTS with Web Speech Synthesis API for all 4 new languages (mr, gu, ta, kn)
2. Verify speech rate is appropriate (not too fast, not too slow)
3. Verify pitch sounds natural per language
4. Verify pronunciation accuracy for 20+ sample terms
5. Test on multiple browsers (Chrome, Safari, Firefox)
6. Document any language-specific issues or optimizations
7. Create fallback voices if system TTS unavailable
8. User satisfaction: 80%+ of TTS feedback is positive

**Subtasks**:
- [ ] Research language voice support in browsers
- [ ] Test TTS with sample sentences
- [ ] Measure speech rate comfort level
- [ ] Adjust pitch/rate as needed
- [ ] Test cross-browser
- [ ] Document findings
- [ ] Create voice profile refinements

**Time Estimate**: 3-4 hours

**Dependencies**: Task 2.5, Task 3.1-3.4

---

## PHASE 4: FINAL LANGUAGES & POLISH (Weeks 7-8)

### Task 4.1: Create Bengali (bn) Translation & Glossary

**Objective**: Build Bengali language support

**Acceptance Criteria**:
1. `src/data/localization/languages/bn.ts` (200+ keys)
2. `src/data/localization/glossaries/ai-terms-bn.ts` (85+ terms)
3. Bengali script rendering verified
4. Native speaker reviewed

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3

---

### Task 4.2: Create Punjabi (pa) Translation & Glossary

**Objective**: Build Punjabi language support

**Acceptance Criteria**:
1. `src/data/localization/languages/pa.ts` (200+ keys)
2. `src/data/localization/glossaries/ai-terms-pa.ts` (85+ terms)
3. Gurmukhi script support

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3

---

### Task 4.3: Create Malayalam (ml) Translation & Glossary

**Objective**: Build Malayalam language support

**Acceptance Criteria**:
1. `src/data/localization/languages/ml.ts` (200+ keys)
2. `src/data/localization/glossaries/ai-terms-ml.ts` (85+ terms)
3. Complex Malayalam script rendering verified

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3

---

### Task 4.4: Create Odia (or) Translation & Glossary

**Objective**: Build Odia language support

**Acceptance Criteria**:
1. `src/data/localization/languages/or.ts` (200+ keys)
2. `src/data/localization/glossaries/ai-terms-or.ts` (85+ terms)

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3

---

### Task 4.5: Create Assamese (as) Translation & Glossary

**Objective**: Build Assamese language support

**Acceptance Criteria**:
1. `src/data/localization/languages/as.ts` (200+ keys)
2. `src/data/localization/glossaries/ai-terms-as.ts` (85+ terms)

**Time Estimate**: 10-11 hours

**Dependencies**: Task 1.3

---

### Task 4.6: Create Urdu (ur) Translation & Glossary + RTL Fix

**Objective**: Build Urdu language support with full RTL support

**User Story**: As an Urdu learner, I want the platform in Urdu with proper right-to-left layout, so I can read naturally in my script direction.

**Acceptance Criteria**:
1. Create `src/data/localization/languages/ur.ts` (200+ keys, RTL-aware)
2. Create `src/data/localization/glossaries/ai-terms-ur.ts` (85+ terms)
3. Full RTL layout verification (HTML dir="rtl", component mirroring)
4. Urdu script (Perso-Arabic) renders correctly
5. All UI elements mirror properly in RTL
6. Navigation and buttons align correctly
7. Tested on desktop and mobile

**Subtasks**:
- [ ] Translate 200+ strings to Urdu
- [ ] Translate 85+ glossary terms
- [ ] Verify RTL layout works
- [ ] Test component mirroring
- [ ] Test on mobile RTL
- [ ] Final QA

**Time Estimate**: 12-13 hours

**Dependencies**: Task 1.3, Task 2.6

---

### Task 4.7: Localize All Interactive Sandboxes

**Objective**: Localize Token Predictor, RAG Simulator, and CNN Explorer for all 12 languages

**User Story**: As a learner, I want all interactive sandboxes (Token Predictor, RAG Simulator, CNN Explorer) fully translated into my language, so I understand the mechanics without language confusion.

**Acceptance Criteria**:
1. **Token Predictor Sandbox**:
   - Prompts translated to each language
   - Candidate words displayed in language
   - Explanatory text translated
   - Probability display correct per language formatting
   - Interactive controls translated

2. **RAG Simulator**:
   - Flow labels translated (Question, Search, Retrieved Context, Answer)
   - Step-by-step narration in each language
   - Example documents adapted for region
   - All buttons/toggles translated

3. **CNN Explorer**:
   - Layer labels translated
   - Descriptions in each language
   - Sliders/controls translated

**Subtasks**:
- [ ] Audit Token Predictor component
- [ ] Add translation keys for all labels/text
- [ ] Test Token Predictor in all 12 languages
- [ ] Audit RAG Simulator
- [ ] Translate RAG flow labels
- [ ] Test RAG Simulator across languages
- [ ] Audit CNN Explorer
- [ ] Translate CNN labels
- [ ] Test CNN Explorer

**Time Estimate**: 6-8 hours

**Dependencies**: All language dictionaries (Tasks 2.1-4.6)

---

### Task 4.8: Per-Language Learning Progress Tracking

**Objective**: Implement learning progress tracking that maintains separate progress per language

**User Story**: As a learner, I want my progress tracked separately for each language, so switching languages doesn't affect my achievements and I can track mastery per language.

**Acceptance Criteria**:
1. Firebase schema stores progress with: userId + languageCode as composite key
2. Track: language, glossary terms mastered, sections completed, quiz scores, timestamp
3. Switching languages preserves progress in previously selected language
4. Progress syncs in real-time or on save to Firebase
5. Offline progress saved locally in IndexedDB, synced when online
6. Progress bar shows mastery percentage for current language
7. User can view progress history across all languages studied

**Subtasks**:
- [ ] Design Firebase schema for per-language progress
- [ ] Implement progress context hook
- [ ] Create IndexedDB schema for offline storage
- [ ] Implement sync logic (online/offline)
- [ ] Update progress UI to show language-specific data
- [ ] Test language switching with progress preservation
- [ ] Test offline sync

**Time Estimate**: 5-6 hours

**Dependencies**: Firebase setup, Task 1.2

---

### Task 4.9: Language-Specific Analytics Dashboard

**Objective**: Create analytics views showing learning outcomes per language

**User Story**: As a platform administrator, I want to see per-language analytics (adoption, completion rates, popular terms), so I can identify which languages need improvement and where learners struggle.

**Acceptance Criteria**:
1. Dashboard shows: total learners per language, average completion rate per language, popular glossary terms per region
2. Analytics distinguish between languages to identify regional gaps
3. Data includes: language code, session duration, terms mastered, quiz performance
4. Reports filterable by language, date range, learner demographics
5. Visualizations: language adoption pie chart, regional completion heatmap, term difficulty by language
6. Exportable reports (CSV)

**Subtasks**:
- [ ] Design analytics schema
- [ ] Create Firebase queries for analytics
- [ ] Build admin dashboard UI
- [ ] Implement filtering/date range
- [ ] Create visualizations
- [ ] Test data accuracy
- [ ] Add export functionality

**Time Estimate**: 6-7 hours

**Dependencies**: Task 4.8, Firebase setup

---

### Task 4.10: Performance Optimization & Code-Splitting

**Objective**: Optimize bundle size and performance for multilingual app

**User Story**: As a user on slow networks in rural India, I want the app to load quickly and not consume excessive data, so I can access learning content without frustration.

**Acceptance Criteria**:
1. Base app bundle (without dictionaries): < 200KB gzipped
2. Each language dictionary: < 50KB gzipped
3. Total app with 12 languages: < 1MB gzipped
4. Language switching completes in < 500ms
5. Glossary search performs in < 200ms
6. App works on 3G (100-200ms latency) without major lag
7. Lazy-load sandboxes if not immediately visible (Task 4.7)
8. Implement React.lazy and Suspense for code-splitting

**Subtasks**:
- [ ] Measure current bundle sizes
- [ ] Identify large bundles
- [ ] Implement code-splitting by route/language
- [ ] Enable gzip compression in build
- [ ] Use tree-shaking to remove unused code
- [ ] Lazy-load heavy components
- [ ] Measure final sizes
- [ ] Performance test on 3G connection

**Time Estimate**: 4-5 hours

**Dependencies**: All language tasks completed

---

### Task 4.11: Accessibility Audit & Fixes

**Objective**: Ensure platform is accessible to visually impaired and motor-impaired learners

**User Story**: As a visually impaired learner, I want to use a screen reader to access all content and interact with sandboxes, so I can learn AI concepts as effectively as sighted learners.

**Acceptance Criteria**:
1. All interactive components have proper ARIA labels and roles
2. Keyboard navigation works across all pages (Tab, Enter, Escape)
3. Color contrast meets WCAG AA standards (4.5:1 for text)
4. All images have descriptive alt text
5. Form inputs have associated labels
6. Focus indicators are visible and clear
7. Screen reader testing: content reads correctly and in logical order
8. Touchscreen targets are 44px+ (mobile accessibility)
9. Audio descriptions available for complex visualizations (sandboxes)

**Subtasks**:
- [ ] Audit components for ARIA labels
- [ ] Test keyboard navigation
- [ ] Check color contrast (use WebAIM contrast checker)
- [ ] Verify alt text on images
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Add audio descriptions for sandboxes
- [ ] Mobile accessibility testing
- [ ] Fix identified issues

**Time Estimate**: 6-7 hours

**Dependencies**: All previous tasks

---

### Task 4.12: Cross-Language Integration Testing

**Objective**: Comprehensive testing of all languages working together seamlessly

**User Story**: As a QA engineer, I want to verify the entire app works correctly across all 12 languages, so users have a bug-free experience regardless of language choice.

**Acceptance Criteria**:
1. **Language Switching**: Switch between any two languages 10x, verify no data loss or layout breaking
2. **Dictionary Completeness**: Verify no missing translation keys in any language (< 1% missing acceptable)
3. **Glossary Search**: Search for 20+ terms in each language, verify results are accurate
4. **TTS Quality**: Test TTS playback for 5+ terms in each language
5. **RTL Rendering**: Test Urdu and any RTL language on desktop and mobile
6. **Performance**: Measure app load time, language switch time, search time across all languages
7. **Cross-Browser**: Test on Chrome, Safari, Firefox with at least 3 languages
8. **Mobile**: Test all 12 languages on iOS and Android devices
9. **Offline**: Verify offline functionality works across language switches
10. **Progress Sync**: Switch languages and verify progress is preserved and synced

**Subtasks**:
- [ ] Create comprehensive test plan
- [ ] Test language switching (10x each language pair)
- [ ] Audit dictionaries for missing keys
- [ ] Test glossary search accuracy
- [ ] Test TTS in all languages
- [ ] Test RTL rendering
- [ ] Performance benchmarking
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Offline/online sync testing
- [ ] File bug reports
- [ ] Re-test after fixes

**Time Estimate**: 10-12 hours

**Dependencies**: All previous tasks

---

## SUMMARY

**Total Tasks**: 49 (1 overview + 48 implementation)
**Estimated Timeline**: 8 weeks
**Total Development Hours**: ~250-300 hours

**Phases**:
- Phase 1 (Foundation): 14-17 hours
- Phase 2 (MVP): 40-45 hours
- Phase 3 (Expansion): 45-50 hours
- Phase 4 (Polish): 150-190 hours

**Key Milestones**:
- Week 2: Foundation complete (support structure ready)
- Week 4: MVP (English, Telugu, Hindi) production-ready
- Week 6: 8 languages live (MVP + Marathi, Gujarati, Tamil, Kannada)
- Week 8: All 12 languages + full polish

