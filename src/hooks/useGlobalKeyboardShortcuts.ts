import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  onCloseModals?: () => boolean; // returns true if a modal was closed
  onGoHome?: () => void;
  onToggleShortcutsModal?: () => void;
  onOpenSearch?: () => void;
  onOpenLanguages?: () => void;
  onOpenOffline?: () => void;
  onSwitchView?: (view: 'guide' | 'interview' | 'dashboard' | 'learning-hub') => void;
  onCycleTheme?: () => void;
  onToggleAudio?: () => void;
  onToggleContinuous?: () => void;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
  onSaveBookmark?: () => void;
  isLessonActive?: boolean;
}

export function useGlobalKeyboardShortcuts({
  onCloseModals,
  onGoHome,
  onToggleShortcutsModal,
  onOpenSearch,
  onOpenLanguages,
  onOpenOffline,
  onSwitchView,
  onCycleTheme,
  onToggleAudio,
  onToggleContinuous,
  onPrevLesson,
  onNextLesson,
  onSaveBookmark,
  isLessonActive
}: KeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = 
        activeEl && (
          activeEl.tagName === 'INPUT' || 
          activeEl.tagName === 'TEXTAREA' || 
          activeEl.tagName === 'SELECT' || 
          (activeEl as HTMLElement).isContentEditable
        );

      // 1. ESCAPE is handled regardless of focus
      if (e.key === 'Escape') {
        if (isInput) {
          (activeEl as HTMLElement).blur();
        }
        const closed = onCloseModals?.();
        if (closed) {
          e.preventDefault();
          return;
        }
        // If no modal was closed and we are in a lesson, return to home
        if (isLessonActive && onGoHome) {
          e.preventDefault();
          onGoHome();
          return;
        }
        return;
      }

      // 2. Global Search (Cmd+K / Ctrl+K or / when not typing)
      if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        onOpenSearch?.();
        return;
      }

      // If user is currently typing in an input/textarea, ignore single character shortcuts
      if (isInput) {
        return;
      }

      // 3. Cheatsheet / Help Shortcut (? or Shift + /)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        onToggleShortcutsModal?.();
        return;
      }

      // 4. Quick Search with '/'
      if (e.key === '/') {
        e.preventDefault();
        onOpenSearch?.();
        return;
      }

      // 5. Home key or 'h' / 'H' to return to overview
      if (e.key === 'Home' || e.key.toLowerCase() === 'h') {
        e.preventDefault();
        onGoHome?.();
        return;
      }

      // 6. View navigation numbers (1: Guide, 2: Interviewer, 3: Dashboard, 4: Hub)
      if (e.key === '1') {
        e.preventDefault();
        onSwitchView?.('guide');
        return;
      }
      if (e.key === '2') {
        e.preventDefault();
        onSwitchView?.('interview');
        return;
      }
      if (e.key === '3') {
        e.preventDefault();
        onSwitchView?.('dashboard');
        return;
      }
      if (e.key === '4') {
        e.preventDefault();
        onSwitchView?.('learning-hub');
        return;
      }

      // 7. Languages Showcase ('l' / 'L')
      if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        onOpenLanguages?.();
        return;
      }

      // 7b. Offline Curriculum & Cache ('o' / 'O')
      if (e.key.toLowerCase() === 'o') {
        e.preventDefault();
        onOpenOffline?.();
        return;
      }

      // 8. Theme Cycle ('t' / 'T')
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        onCycleTheme?.();
        return;
      }

      // 9. Sound / SFX Toggle ('m' / 'M')
      if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        onToggleAudio?.();
        return;
      }

      // 10. Continuous Guide Toggle ('c' / 'C')
      if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        onToggleContinuous?.();
        return;
      }

      // 11. Bookmark ('b' / 'B')
      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onSaveBookmark?.();
        return;
      }

      // 12. Next / Prev Lesson Navigation (when in lesson)
      if (isLessonActive) {
        if (e.key.toLowerCase() === 'n' || e.key === ']' || e.key === 'ArrowRight') {
          e.preventDefault();
          onNextLesson?.();
          return;
        }
        if (e.key.toLowerCase() === 'p' || e.key === '[' || e.key === 'ArrowLeft') {
          e.preventDefault();
          onPrevLesson?.();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onCloseModals,
    onGoHome,
    onToggleShortcutsModal,
    onOpenSearch,
    onOpenLanguages,
    onOpenOffline,
    onSwitchView,
    onCycleTheme,
    onToggleAudio,
    onToggleContinuous,
    onPrevLesson,
    onNextLesson,
    onSaveBookmark,
    isLessonActive
  ]);
}
