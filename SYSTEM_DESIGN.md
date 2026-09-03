# Clayverse AI — System Design Document (v1.0)

**AI Learning That Speaks Your Language — Architecture, Multilingual System & Stage-Ready Product Design**

Prepared: September 2026 · Repository: `github.com/syedsz-1519/clayverse.ai` · Live: `clayverseai.vercel.app`

This document supersedes `prd.md`, `trd.md`, `architecture.md`, `roadmap.md`, `phases.md`, `implementation_plan.md`, `deign.md`, and `memory.md`. It is the single source of truth for product and system design going forward. `ACADEMIC_DOCUMENT.md` and `CLAYVERSE_ENHANCED_DIAGRAMS.md` remain as-is for the college submission.

---

## 1. Executive Summary

Clayverse AI is a multilingual, interactive AI/ML learning platform for non-native English speakers across India. Concepts are explained with zero jargon, narrated by an animated mascot ("Clay"), in the learner's own language — Hindi, Urdu, Roman Urdu, Telugu, Kannada, Tamil, and English at launch.

The codebase already contains substantial engineering: a React 19 + Vite + Tailwind v4 frontend, an Express proxy layer securing a Google Gemini integration, Firebase authentication and Firestore, a procedural Web Audio engine, and 70+ components spanning lessons, quizzes, gamification, dashboards, and AI-powered tools.

**The real gap is not missing design — it is fragmentation.** Design intent was spread across ten overlapping documents written at different times, the live deployment shows a much thinner experience than the codebase implies is built, and the language roadmap did not match the founder's actual launch priority. This document fixes that, and adds two things that were missing entirely: a stage-demo-safe feature cut, and a concrete multilingual content pipeline that needs no paid API.

---

## 2. Current State Audit

| Area | Finding |
|---|---|
| Frontend stack | React 19, Vite 6, TypeScript, Tailwind CSS v4, Framer Motion (`motion`), Lucide icons, dnd-kit, Recharts |
| Backend | Express server (`server.ts`) proxying the Google Gemini API (`@google/genai`) — chat, transcription, explanation, and Veo video generation endpoints |
| Auth & data | Firebase Authentication (email/password + Google OAuth) and Firestore for per-user, per-language progress |
| Audio | Custom procedural Web Audio lo-fi synthesizer plus Web Speech Synthesis for narration — zero-bandwidth, no external audio files |
| Components | 70+ components: lessons, mascot animation, quizzes, badges, leaderboards, study groups, Google Classroom integration, AI mock interviewer, AI arena chat, focus-lockdown mode, camera-tracking HUD |
| Live deployment | `clayverseai.vercel.app` currently serves a single-page English explainer — a fraction of what the component library implements |

**Three real problems:**
1. **Fragmented source of truth** — ten planning documents, no clear "current" one.
2. **Scope exceeds what one person can reliably demo** — camera-tracking focus mode, mock interviewer, study groups, and Classroom sync add live-demo failure surface.
3. **Language plan didn't match reality** — actual near-term priority is 7 languages, not the larger "planned" list; Urdu RTL and Roman Urdu transliteration were unspecified.

---

## 3. Product Vision & Positioning

**Positioning statement:** "Clayverse AI teaches the concepts behind AI to anyone in India, in the language they think in — no English fluency, no math background, no jargon required."

**Who it's for:** Tier-2/3 city students and job-seekers blocked by English-only content; non-CS learners who need conceptual fluency, not code fluency; educators who want a ready-made regional-language AI literacy module.

| Existing options | Clayverse AI |
|---|---|
| English-only MOOCs (Coursera, YouTube) | Native-language narration + text, not subtitles bolted onto English content |
| Text-heavy blogs / Wikipedia | Mascot-led, interactive sandboxes (token predictor, RAG simulator) — concepts are felt, not just read |
| Generic translation apps | Culturally-adapted analogies per language/region, not literal machine translation |

---

## 4. System Architecture

```
Client — React 19 + Vite + Tailwind v4
   (lesson UI, mascot animation, quizzes, dashboards, language switcher)
        │
        ▼
Client audio layer — Web Audio API + Web Speech Synthesis
   (procedural ambience, phoneme-synced mascot mouth, per-language TTS voice mapping)
        │
        ▼
Auth & data — Firebase Auth + Firestore
   (accounts, per-user per-language progress, badges, streaks)
        │
        ▼
Server proxy — Express (server.ts)
   (hides Gemini credentials; /api/gemini/chat, /explain, /transcribe, /veo/*)
        │
        ▼
External AI — Google Gemini API
   (chat with search grounding, quick explanations, transcription, Veo video)
```

**Keep as-is:** routing all Gemini calls through the Express proxy instead of calling from the browser. This keeps the API key server-side and lets the model be swapped or rate-limited without a client release.

**What to add:** a content/translation layer separating lesson *structure* (layout, interactivity, quiz logic) from lesson *content* (the actual text per language). See Section 6.

---

## 5. Data Model (Firestore)

| Collection | Key fields | Notes |
|---|---|---|
| `users` | uid, displayName, email, preferredLanguage, createdAt | Synced from Firebase Auth on first login |
| `languages` | code, nativeName, script, isRTL, status | Single source of truth for supported languages |
| `lessons` | slug, moduleId, order, sandboxType | Structure only, language-agnostic |
| `lessonContent` | lessonId, languageCode, title, body, glossaryTerms[], status (draft/reviewed/published) | One document per lesson per language — the new layer |
| `progress` | uid, lessonId, languageUsed, completedAt, quizScore | Per-user, per-language |
| `badges` | uid, badgeId, earnedAt | Existing gamification system, unchanged |

**Migration note:** content currently lives as hardcoded strings inside `.tsx` components. Moving strings into `lessonContent` (or matching static JSON files) is the single highest-leverage refactor — it makes 7 languages maintainable instead of 7x the component code.

---

## 6. Multilingual System Design

### 6.1 Launch language set

| Language | Code | Direction | Translation approach |
|---|---|---|---|
| English | en | LTR | Source language — written first |
| Hindi | hi | LTR | Bhashini-assisted draft + native review |
| Urdu | ur | **RTL** | Bhashini-assisted draft + native review; requires `dir="rtl"` layout |
| Roman Urdu | ur-Latn | LTR | **Transliteration, not translation** — auto-generated from Urdu via Aksharamukha |
| Telugu | te | LTR | Bhashini-assisted draft + native review |
| Kannada | kn | LTR | Bhashini-assisted draft + native review |
| Tamil | ta | LTR | Bhashini-assisted draft + native review |

### 6.2 Free, no-paid-API translation pipeline

1. **Author** — write lesson content once in English inside `lessonContent`.
2. **Draft** — batch-translate via the Bhashini API (Government of India, free, unlimited, 22 Indian languages).
3. **Review** — native-speaker pass for tone and cultural analogy fit.
4. **Transliterate** — run the reviewed Urdu text through Aksharamukha (open-source, free, rule-based) to auto-generate Roman Urdu.
5. **Publish** — mark `status: published` — zero runtime API cost from here on.
6. **Serve** — client fetches by `(lessonId, languageCode)`, a static lookup; no live translation call happens at read time.

Bhashini and Aksharamukha are used only in the offline authoring pipeline — the deployed app never calls a translation API at runtime.

### 6.3 The AI tutor exception

"Clay" chat / AI Arena responses are generated live by Gemini and can't be pre-translated. Instruct Gemini directly, in the system prompt, to respond in the learner's selected language — it already writes fluent Hindi, Urdu, Telugu, Kannada, and Tamil natively. Don't add a separate translation hop.

### 6.4 RTL handling for Urdu

- Root layout toggles `dir="rtl"` when `languageCode === 'ur'`; Roman Urdu (`ur-Latn`) stays LTR (Latin script).
- Use Tailwind logical properties (`ms-*`, `me-*`) instead of `ml-*`/`mr-*` to avoid hand-flipping every component.
- Directional icons (arrows, progress chevrons) need an explicit mirror rule for RTL — the detail most commonly missed and most visible on stage.

---

## 7. Feature Inventory & Stage-Demo Prioritization

### 7.1 Demo-critical path — show on stage

| Component | Why it stays |
|---|---|
| Hero, LanguageSwitcher / FloatingLanguageBubble | Live language switch (English → Urdu RTL flip) is the most convincing 10 seconds of the demo |
| ClayAvatar + ClayNarrationHub | Mascot narrating in the switched language is the emotional hook |
| WhatIsAI / IndividualLessonView | One complete, polished lesson beats five half-working ones |
| CheckYourKnowledge (quiz) | Shows the learning loop closes, not just content delivery |
| BadgeEngine / LessonCompletionCelebration | Visible payoff, works fully offline/local |
| StudentDashboard (trimmed) | Shows per-language progress tracking, the key differentiator |
| AIArena (Gemini chat, one prepared example) | Demonstrates the "AI tutor speaks your language" claim live |

### 7.2 Phase 2 — strong features, not demo-first

| Component | Reason to defer |
|---|---|
| Leaderboard, StudyGroupsSection | Needs populated multi-user data to look convincing |
| WeeklyEmailDigestModal, DailyLearningGoalTracker | Backend/email infra dependency, not visual in a live pitch |
| GoogleClassroomHub | Third-party OAuth adds a live failure point |
| InteractiveFlashcards, KnowledgeGapDiagnosticQuiz | Valuable for retention, secondary to the core narrative |

### 7.3 Backlog / reconsider scope

| Component | Reason |
|---|---|
| CameraTrackerHUD, FocusLockdownManager | Webcam/lockdown is high-risk to demo live and tangential to the core story |
| AIMockInterviewer, InterviewComparisonModal, HistoricalInterviewTable | A different product grafted on — dilutes positioning; consider spinning out |
| CommunityPeerReviewFeed | Needs real community volume to not look empty |

---

## 8. Pitch-Ready User Journey

A single unbroken path, rehearsable end to end in under four minutes:

1. **Land** — Hero loads in English, Clay greets the audience.
2. **Switch** — tap language bubble → Urdu. Layout flips RTL live, Clay re-narrates the same line in Urdu.
3. **Learn** — open "What is AI?" — interactive sandbox responds in Urdu text + audio.
4. **Test** — answer a quiz question — instant feedback, still in Urdu.
5. **Reward** — badge celebration animation fires.
6. **Prove it scales** — switch to Roman Urdu, then Telugu — same lesson, same UI, new language each time.
7. **Close** — open AI Arena, ask Clay a live question in Telugu, get a live Gemini answer in Telugu — proves the AI tutor claim, not just static content.

---

## 9. Roadmap

| Phase | Window | Deliverables |
|---|---|---|
| Phase 0 — Consolidate | Now → 15 Sept 2026 | Merge planning docs into this document; extract hardcoded lesson strings into `lessonContent`; finalize Firestore schema |
| Phase 1 — Pilot languages | 15 Sept → 15 Oct 2026 | Bhashini-draft + review 3–5 lessons in hi, te, kn, ta, ur; Aksharamukha-generate ur-Latn; ship RTL layout support |
| Phase 2 — Review prep | 15 → 27 Oct 2026 | Package architecture, ER, and use-case diagrams for the College First Review; rehearse the pitch-ready journey (Section 8) as the 30% code demo |
| Phase 3 — Scale | Nov 2026 onward | Remaining lessons across all 7 languages; Gemini system-prompt localization for AI Arena; begin Phase 2 feature set |

---

## 10. Risks & Recommendations

| Risk | Recommendation |
|---|---|
| Live deployment lags far behind the component library | Deploy the trimmed demo-critical path (7.1) as the default homepage before adding anything else |
| Overlapping docs cause conflicting decisions over time | This document is now the single source of truth; the superseded docs have been removed |
| Machine-translated content reads unnatural, especially in Urdu/Roman Urdu | Never skip the native-speaker review step in 6.2 — treat Bhashini output as a first draft only |
| Webcam/OAuth-dependent features fail live | Keep Section 7.3 items out of any pitch or review demo entirely |
| Gemini free-tier rate limits during live audience Q&A | Pre-warm one cached example answer per language as a fallback if the live call is slow |

---

*Clayverse AI — System Design Document v1.0 — Prepared September 2026*
