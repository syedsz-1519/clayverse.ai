# RTL Layout Migration Audit (`migration-audit.md`)

This document lists every component in `src/components/` that contains `ml-*` or `mr-*` classes for layout, icons, badges, and structural alignment. For each instance, the exact replacement logical Tailwind CSS property (`ms-*` or `me-*`) is specified, along with whether the change is **purely structural** (e.g. automatic alignment or spacing that flips naturally with `dir="rtl"`) or **requires wrapper adjustment / directional handling** (e.g. directional icon rotation `rtl:rotate-180`, flex container wrapping, or glyph optical centroid preservation).

---

## 1. Summary Statistics

- **Total Audited Components**: 32 components
- **Total Physical Margin Occurrences**: 59 occurrences
- **Target Standard**: Tailwind CSS logical properties (`ms-*` for margin-inline-start, `me-*` for margin-inline-end)
- **Supported Languages**: LTR default (English, Hindi, Bengali, Telugu, Tamil, Marathi, etc.) and RTL (Urdu `ur`).

---

## 2. Component-by-Component Migration Table

### 1. `AIArena.tsx` (5 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L803 | `ml-20` | `ms-20` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L804 | `mr-20` | `me-20` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L1028 | `ml-1` | `ms-1` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L1617 | `mr-2.5` | `me-2.5` | Purely structural: Standard inline separation between layout elements. |
| L1714 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |

### 2. `AIMockInterviewer.tsx` (4 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L1354 | `ml-0.5` | `ms-0.5` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L1556 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |
| L2268 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |
| L2300 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |

### 3. `AboutClayverseModal.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L58 | `mr-16` | `me-16` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |

### 4. `AudioNarrationHub.tsx` (3 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L548 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |
| L721 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |
| L731 | `ml-2` | `ms-2` | Purely structural: Standard inline separation between layout elements. |

### 5. `CheckYourKnowledge.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L202 | `mr-10` | `me-10` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |

### 6. `ClayLogo.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L108 | `ml-1.5` | `ms-1.5` | Purely structural: Standard inline separation between layout elements. |

### 7. `ClosingAndDeeper.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L654 | `ml-2` | `ms-2` | Purely structural: Standard inline separation between layout elements. |

### 8. `CodeSnippetBlock.tsx` (2 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L59 | `ml-2` | `ms-2` | Wrapper adjustment optional: Can either use logical margin or be refactored to parent flex gap. |
| L76 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |

### 9. `CommunityPeerReviewFeed.tsx` (2 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L152 | `mr-10` | `me-10` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L341 | `ml-2` | `ms-2` | Purely structural: Standard inline separation between layout elements. |

### 10. `CurriculumRoadmap.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L158 | `mr-8` | `me-8` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |

### 11. `FloatingNav.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L1073 | `mr-1.5` | `me-1.5` | Purely structural: Standard inline separation between layout elements. |

### 12. `GuideBreadcrumbNav.tsx` (4 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L222 | `ml-0.5` | `ms-0.5 + rtl:rotate-180` | Requires directional adjustment: Directional arrow/chevron indicator flips orientation in RTL mode. |
| L295 | `ml-2` | `ms-2` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L335 | `ml-2` | `ms-2` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L375 | `ml-2` | `ms-2` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |

### 13. `HistoricalInterviewTable.tsx` (4 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L189 | `ml-1` | `ms-1 + rtl:rotate-180` | Requires directional adjustment: Directional arrow/chevron indicator flips orientation in RTL mode. |
| L192 | `ml-1` | `ms-1 + rtl:rotate-180` | Requires directional adjustment: Directional arrow/chevron indicator flips orientation in RTL mode. |
| L194 | `ml-1` | `ms-1 + rtl:rotate-180` | Requires directional adjustment: Directional arrow/chevron indicator flips orientation in RTL mode. |
| L204 | `mr-1` | `me-1` | Wrapper adjustment optional: Can either use logical margin or be refactored to parent flex gap. |

### 14. `IndividualLessonView.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L347 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |

### 15. `InterviewAudioReplayModal.tsx` (2 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L278 | `ml-0.5` | `Keep ml-0.5 (Exception)` | Glyph optical centering (Right-pointing triangle optical centroid compensation; do NOT flip in RTL). |
| L359 | `ml-0.5` | `Keep ml-0.5 (Exception)` | Glyph optical centering (Right-pointing triangle optical centroid compensation; do NOT flip in RTL). |

### 16. `InterviewComparisonModal.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L549 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |

### 17. `InterviewConsistencyCalendar.tsx` (2 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L398 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |
| L482 | `mr-2` | `me-2` | Purely structural: Standard inline separation between layout elements. |

### 18. `KnowledgeGapDiagnosticQuiz.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L256 | `mr-12` | `me-12` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |

### 19. `LearningHubPage.tsx` (2 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L77 | `mr-20` | `me-20` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L78 | `ml-20` | `ms-20` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |

### 20. `LearningPathDependencyMap.tsx` (3 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L154 | `ml-paradigms` | `ms-paradigms` | Purely structural: Standard inline separation between layout elements. |
| L236 | `ml-paradigms` | `ms-paradigms` | Purely structural: Standard inline separation between layout elements. |
| L301 | `ml-paradigms` | `ms-paradigms` | Purely structural: Standard inline separation between layout elements. |

### 21. `OfflineManagerModal.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L182 | `ml-2` | `ms-2` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |

### 22. `PostInterviewReflectionModal.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L229 | `ml-2` | `ms-2` | Purely structural: Standard inline separation between layout elements. |

### 23. `QuizPerformanceBarChart.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L930 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |

### 24. `ReadSectionButton.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L129 | `ml-0.5` | `ms-0.5` | Purely structural: Standard inline separation between layout elements. |

### 25. `RecommendedNextLessonCard.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L529 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |

### 26. `ScrollProgressIndicator.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L401 | `ml-1` | `ms-1` | Purely structural: Standard inline separation between layout elements. |

### 27. `SearchModal.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L268 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |

### 28. `SessionInlineReflectionEditor.tsx` (2 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L175 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |
| L268 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |

### 29. `SocialShareSection.tsx` (2 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L92 | `mr-20` | `me-20` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |
| L93 | `ml-20` | `ms-20` | Purely structural: Trailing badge/indicator margin flips to natural inline start/end based on reading direction. |

### 30. `StudentDashboard.tsx` (1 occurrence)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L1004 | `ml-2` | `ms-2` | Purely structural: Standard inline separation between layout elements. |

### 31. `StudentOverviewBentoContent.tsx` (3 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L752 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |
| L773 | `mr-1` | `me-1` | Wrapper adjustment optional: Can either use logical margin or be refactored to parent flex gap. |
| L1075 | `mr-1.5` | `me-1.5` | Purely structural: Standard inline separation between layout elements. |

### 32. `TTSReaderModal.tsx` (2 occurrences)

| Line | Class Found | Proposed Tailwind Replacement | Nature of Change & RTL Action Required |
| :---: | :--- | :--- | :--- |
| L405 | `mr-1` | `me-1` | Purely structural: Standard inline separation between layout elements. |
| L523 | `ml-0.5` | `Keep ml-0.5 (Exception)` | Glyph optical centering (Right-pointing triangle optical centroid compensation; do NOT flip in RTL). |

---

## 3. General Implementation Guidelines

1. **Purely Structural Margin Migrations**:
   - Standard inline item spacing (`mr-2` -> `me-2`, `ml-3` -> `ms-3`) and auto alignments (`ml-auto` -> `ms-auto`, `mr-auto` -> `me-auto`) seamlessly flip between LTR and RTL when `dir="rtl"` is applied to `<html>` or the root wrapper.
   - No additional wrapper is needed.
   
2. **Directional Icons (Chevrons & Next/Prev Arrows)**:
   - Icons such as `ChevronRight`, `ChevronLeft`, `ArrowRight`, and `ArrowLeft` indicate conceptual progression (forward / backward).
   - In RTL, forward progression points to the left. These elements must pair the logical margin with the `rtl:rotate-180` utility class.
   
3. **Preserved Exceptions (Optical Centering)**:
   - Single-character glyphs or non-symmetrical visual icons (e.g. the `<Play className="w-4 h-4 ml-0.5" />` triangle inside a circular button) use `ml-0.5` to balance the right-skewed bounding box of the triangle.
   - These are optical compensations, not directional reading margins, and must be preserved as physical margins.
