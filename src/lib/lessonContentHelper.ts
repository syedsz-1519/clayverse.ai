import { LESSON_MODULES } from '../components/HomeCurriculumGrid';
import { getNarrationForSection } from '../data/sectionNarrationData';
import { TAKEAWAYS_DATA } from '../components/QuickTakeaway';
import { LESSON_SUBTOPICS } from '../components/IndividualLessonView';

/**
 * Generates rich, clean spoken content for the TTS Reader based on the given lesson ID.
 */
export function getLessonTTSContent(
  lessonId: string, 
  lang: 'en' | 'hyd' | 'te' = 'en'
): { title: string; text: string } {
  const mod = LESSON_MODULES.find(m => m.id === lessonId) || LESSON_MODULES[0];
  const isHyd = lang === 'hyd' || lang === 'te';
  
  const title = `Lesson 0${mod.lessonNum}: ${isHyd ? mod.titleHyd : mod.titleEn}`;
  const subtitle = isHyd ? mod.subtitleHyd : mod.subtitleEn;
  
  // Narration paragraphs
  const narration = getNarrationForSection(lessonId);
  const sentences = isHyd && narration.sentencesHyd && narration.sentencesHyd.length > 0
    ? narration.sentencesHyd.join(' ')
    : narration.sentencesEn.join(' ');
  const takeaway = isHyd && narration.takeawayHyd
    ? narration.takeawayHyd
    : narration.takeawayEn;

  // Subtopics breakdown
  const subtopics = LESSON_SUBTOPICS[lessonId] || [];
  const subtopicsText = subtopics.length > 0
    ? (isHyd
        ? `Sabaq ke hissay: ${subtopics.map(s => s.titleHyd).join(', ')}.`
        : `Key topics covered in this lesson: ${subtopics.map(s => s.titleEn).join(', ')}.`)
    : '';

  // Takeaways and mental model
  const takeawayData = TAKEAWAYS_DATA[lessonId];
  let pointsText = '';
  let mentalModelText = '';
  if (takeawayData) {
    const points = isHyd ? takeawayData.keyPointsHyd : takeawayData.keyPointsEn;
    if (points && points.length > 0) {
      pointsText = isHyd
        ? `Aham Nuqaat: ${points.join('. ')}.`
        : `Core Principles: ${points.join('. ')}.`;
    }
    const mm = isHyd ? takeawayData.mentalModelHyd : takeawayData.mentalModelEn;
    if (mm) {
      mentalModelText = isHyd ? `Mental Model: ${mm}` : `Mental Model to remember: ${mm}`;
    }
  }

  const sections = [
    title,
    subtitle,
    subtopicsText,
    sentences,
    takeaway ? (isHyd ? `Khulasa: ${takeaway}` : `Key Takeaway: ${takeaway}`) : '',
    pointsText,
    mentalModelText
  ].filter(Boolean);

  return {
    title,
    text: sections.join('\n\n')
  };
}
