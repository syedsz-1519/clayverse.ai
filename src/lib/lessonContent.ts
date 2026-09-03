import whatIsAiEn from '../content/lessons/what-is-ai/en.json';
import whatIsAiUr from '../content/lessons/what-is-ai/ur.json';

export interface LessonContent {
  slug: string;
  lessonNum: number;
  stage: number;
  title: string;
  subtitle: string;
  readTime: string;
  sections: {
    hero: {
      badge: string;
      heading: string;
      intro: string;
      timelineButton: string;
      timelineHideButton: string;
    };
    analogy: {
      label: string;
      text: string;
    };
    patternMatcher: {
      title: string;
      subtitle: string;
    };
    pocketExamples: {
      badge: string;
      title: string;
      subtitle: string;
      hint: string;
      revealLabel: string;
      closeLabel: string;
      items: Array<{
        id: string;
        title: string;
        iconName: string;
        description: string;
        explanation: string;
      }>;
    };
    threeHorizons: {
      badge: string;
      title: string;
      subtitle: string;
      items: Array<{
        title: string;
        short: string;
        badge: string;
        description: string;
      }>;
    };
  };
}

const LESSON_MAP: Record<string, { en: LessonContent; ur: LessonContent }> = {
  'what-is-ai': {
    en: whatIsAiEn as unknown as LessonContent,
    ur: whatIsAiUr as unknown as LessonContent,
  },
};

export function getLessonContent(slug: string, lang: 'en' | 'ur' = 'en'): LessonContent | null {
  const lesson = LESSON_MAP[slug];
  if (!lesson) return null;
  return lesson[lang] || lesson.en;
}
