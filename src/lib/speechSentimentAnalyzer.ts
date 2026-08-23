/**
 * Speech Sentiment, Tone & Confidence Analyzer
 * Analyzes real-time transcript streams and completed interview answers
 * for sentiment polarity, dominant tone, confidence level, speaking pace (WPM),
 * filler words, and hedging language.
 */

export interface SpeechSentimentResult {
  sentiment: 'Very Positive' | 'Positive' | 'Analytical' | 'Neutral' | 'Hesitant' | 'Constructive';
  sentimentLabel: string;
  sentimentEmoji: string;
  sentimentScore: number; // 0 to 100
  dominantTone: 'Assertive & Confident' | 'Analytical & Structured' | 'Inquisitive & Thoughtful' | 'Hesitant / Apologetic' | 'Conversational';
  toneBreakdown: {
    assertive: number; // 0-100%
    analytical: number;
    structured: number;
    hesitant: number;
    casual: number;
  };
  confidenceScore: number; // 0 to 100
  speakingPaceWpm: number;
  wordsPerMinute: number;
  paceRating: 'Optimal Pace' | 'Slightly Fast' | 'Too Fast' | 'Slightly Slow' | 'Too Slow';
  paceCategory: string;
  fillerWordCount: number;
  fillerWordFrequency: number; // per 100 words
  fillerWordPercentage: number;
  hedgingPhrases: string[];
  powerPhrases: string[];
  coachingTips: string[];
}

export type SpeechSentimentReport = SpeechSentimentResult;

// Power phrases indicating assertiveness, ownership, and technical authority
const ASSERTIVE_KEYWORDS = [
  'designed', 'architected', 'implemented', 'optimized', 'validated',
  'benchmarked', 'deployed', 'ensured', 'mitigated', 'delivered',
  'guaranteed', 'refactored', 'resolved', 'spearheaded', 'analyzed',
  'measured', 'proved', 'isolated', 'scaled', 'decoupled',
  'decided', 'established', 'standardized', 'quantified', 'monitored'
];

// Analytical & structural markers
const ANALYTICAL_KEYWORDS = [
  'trade-off', 'tradeoff', 'latency', 'throughput', 'complexity',
  'big-o', 'bottleneck', 'hypothesis', 'specifically', 'firstly',
  'secondly', 'furthermore', 'alternatively', 'in contrast', 'consequently',
  'architecture', 'constraint', 'distribution', 'gradient', 'parameter',
  'vector', 'embedding', 'attention', 'regularization', 'inference'
];

// Hedging and uncertain vocabulary
const HEDGING_PATTERNS = [
  'i guess', 'maybe', 'sort of', 'kind of', 'i think maybe',
  'probably', 'not sure', 'i assume', 'i suppose', 'might be wrong',
  'or something like that', 'if that makes sense', 'just basically',
  'honestly i have no idea', 'um i dont know', 'could be perhaps'
];

// Common speech filler tokens
const FILLER_TOKENS = [
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'basically', 'literally',
  'actually', 'so yeah', 'right', 'i mean', 'kind of', 'sort of'
];

// Positive sentiment tokens
const POSITIVE_TOKENS = [
  'efficient', 'robust', 'optimal', 'scalable', 'effective',
  'successful', 'improved', 'reliable', 'clean', 'seamless',
  'accelerated', 'precise', 'high-performance', 'elegant', 'secure'
];

/**
 * Real-time analysis of a spoken response
 */
export function analyzeSpeechSentiment(
  transcript: string,
  durationSeconds: number = 60
): SpeechSentimentResult {
  if (!transcript || transcript.trim().length === 0) {
    return {
      sentiment: 'Neutral',
      sentimentLabel: 'Neutral',
      sentimentEmoji: '⚖️',
      sentimentScore: 50,
      dominantTone: 'Analytical & Structured',
      toneBreakdown: { assertive: 30, analytical: 30, structured: 30, hesitant: 5, casual: 5 },
      confidenceScore: 75,
      speakingPaceWpm: 0,
      wordsPerMinute: 0,
      paceRating: 'Optimal Pace',
      paceCategory: 'Normal Pace',
      fillerWordCount: 0,
      fillerWordFrequency: 0,
      fillerWordPercentage: 0,
      hedgingPhrases: [],
      powerPhrases: [],
      coachingTips: ['Speak clearly and outline your thoughts in structured points.']
    };
  }

  const lower = transcript.toLowerCase();
  const words = lower.match(/\b[a-z0-9'-]+\b/g) || [];
  const wordCount = words.length;

  // 1. Calculate Speaking Pace (WPM)
  const safeMinutes = Math.max(0.1, durationSeconds / 60);
  const wpm = Math.round(wordCount / safeMinutes);
  
  let paceRating: SpeechSentimentResult['paceRating'] = 'Optimal Pace';
  let paceCategory = 'Optimal Pace';
  if (wpm > 180) { paceRating = 'Too Fast'; paceCategory = 'Fast'; }
  else if (wpm > 155) { paceRating = 'Slightly Fast'; paceCategory = 'Brisk'; }
  else if (wpm < 90) { paceRating = 'Too Slow'; paceCategory = 'Slow'; }
  else if (wpm < 115) { paceRating = 'Slightly Slow'; paceCategory = 'Deliberate'; }

  // 2. Count Fillers
  let fillerCount = 0;
  FILLER_TOKENS.forEach(f => {
    if (f.includes(' ')) {
      const regex = new RegExp(`\\b${f}\\b`, 'g');
      const matches = lower.match(regex);
      if (matches) fillerCount += matches.length;
    } else {
      words.forEach(w => {
        if (w === f) fillerCount++;
      });
    }
  });
  const fillerFreq = wordCount > 0 ? (fillerCount / wordCount) * 100 : 0;

  // 3. Find Hedging Phrases
  const detectedHedging: string[] = [];
  HEDGING_PATTERNS.forEach(pattern => {
    if (lower.includes(pattern)) {
      detectedHedging.push(pattern);
    }
  });

  // 4. Find Power / Assertive Phrases
  const detectedPower: string[] = [];
  ASSERTIVE_KEYWORDS.forEach((kw) => {
    if ((words as string[]).indexOf(kw) !== -1 && !detectedPower.includes(kw)) {
      detectedPower.push(kw);
    }
  });

  // 5. Calculate Tone Weights
  let assertiveScore = detectedPower.length * 15;
  let analyticalScore = 0;
  ANALYTICAL_KEYWORDS.forEach((kw) => {
    if (lower.includes(kw)) analyticalScore += 12;
  });

  let positiveScore = 0;
  POSITIVE_TOKENS.forEach((kw) => {
    if ((words as string[]).indexOf(kw) !== -1) positiveScore += 10;
  });

  let hesitantScore = (detectedHedging.length * 20) + (fillerCount * 5);

  // Normalize scores to percentages
  const rawTotal = Math.max(1, assertiveScore + analyticalScore + hesitantScore + 40);
  const assertivePct = Math.min(100, Math.round((assertiveScore / rawTotal) * 100));
  const analyticalPct = Math.min(100, Math.round((analyticalScore / rawTotal) * 100));
  const structuredPct = Math.min(100, Math.max(15, 100 - (hesitantScore * 2)));
  const hesitantPct = Math.min(100, Math.round((hesitantScore / rawTotal) * 100));
  const casualPct = Math.max(5, 100 - (assertivePct + analyticalPct + structuredPct) / 2);

  // 6. Determine Dominant Tone
  let dominantTone: SpeechSentimentResult['dominantTone'] = 'Analytical & Structured';
  if (hesitantPct > 45 || (detectedHedging.length >= 3 && fillerFreq > 6)) {
    dominantTone = 'Hesitant / Apologetic';
  } else if (assertivePct > 40 && assertiveScore > analyticalScore) {
    dominantTone = 'Assertive & Confident';
  } else if (analyticalPct > 35) {
    dominantTone = 'Analytical & Structured';
  } else if (detectedPower.length > 0 && wordCount > 30) {
    dominantTone = 'Inquisitive & Thoughtful';
  } else {
    dominantTone = 'Conversational';
  }

  // 7. Calculate Confidence Score (0-100)
  let baseConfidence = 82;
  baseConfidence += Math.min(18, detectedPower.length * 4);
  baseConfidence -= Math.min(30, detectedHedging.length * 8);
  baseConfidence -= Math.min(20, Math.round(fillerFreq * 2));
  
  if (paceRating === 'Optimal Pace') baseConfidence += 4;
  else if (paceRating === 'Too Fast' || paceRating === 'Too Slow') baseConfidence -= 6;
  
  const finalConfidence = Math.min(99, Math.max(35, baseConfidence));

  // 8. Sentiment Polarity
  let sentiment: SpeechSentimentResult['sentiment'] = 'Analytical';
  let sentimentScore = Math.min(100, Math.max(20, 50 + (positiveScore * 2) + (detectedPower.length * 3) - (detectedHedging.length * 6)));
  let sentimentLabel = 'Analytical';
  let sentimentEmoji = '📊';

  if (dominantTone === 'Assertive & Confident' && sentimentScore > 75) {
    sentiment = 'Very Positive';
    sentimentLabel = 'Positive';
    sentimentEmoji = '✨';
  } else if (sentimentScore > 65) {
    sentiment = 'Positive';
    sentimentLabel = 'Positive';
    sentimentEmoji = '👍';
  } else if (dominantTone === 'Hesitant / Apologetic' || sentimentScore < 45) {
    sentiment = 'Hesitant';
    sentimentLabel = 'Hesitant';
    sentimentEmoji = '🤔';
  } else if (analyticalPct > 30) {
    sentiment = 'Analytical';
    sentimentLabel = 'Analytical';
    sentimentEmoji = '📐';
  } else {
    sentiment = 'Constructive';
    sentimentLabel = 'Constructive';
    sentimentEmoji = '💡';
  }

  // 9. Generate Actionable Coaching Tips
  const tips: string[] = [];
  if (detectedHedging.length > 0) {
    tips.push(`Replace tentative phrasing like "${detectedHedging[0]}" with declarative statements (e.g. "My approach is..." instead of "I guess maybe...")`);
  }
  if (fillerFreq > 4) {
    tips.push(`Your filler word frequency is ${fillerFreq.toFixed(1)}%. Embrace a brief 1-second pause rather than saying "um" or "like" while structuring thoughts.`);
  }
  if (paceRating === 'Too Fast' || paceRating === 'Slightly Fast') {
    tips.push(`Speaking pace was ${wpm} WPM (ideal is 125-155 WPM). Slow down slightly on complex system architecture explanations.`);
  } else if (paceRating === 'Too Slow' || paceRating === 'Slightly Slow') {
    tips.push(`Speaking pace was ${wpm} WPM. Increase your cadence slightly to convey decisiveness.`);
  }
  if (detectedPower.length >= 2) {
    tips.push(`Great use of strong technical action verbs ("${detectedPower.slice(0, 2).join('", "')}"), which projects technical authority.`);
  } else {
    tips.push(`Incorporate more specific action verbs like "benchmarked", "implemented", or "quantified" to demonstrate hands-on execution.`);
  }

  return {
    sentiment,
    sentimentLabel,
    sentimentEmoji,
    sentimentScore,
    dominantTone,
    toneBreakdown: {
      assertive: assertivePct,
      analytical: analyticalPct,
      structured: structuredPct,
      hesitant: hesitantPct,
      casual: casualPct
    },
    confidenceScore: finalConfidence,
    speakingPaceWpm: wpm,
    wordsPerMinute: wpm,
    paceRating,
    paceCategory,
    fillerWordCount: fillerCount,
    fillerWordFrequency: Number(fillerFreq.toFixed(1)),
    fillerWordPercentage: Number(fillerFreq.toFixed(1)),
    hedgingPhrases: detectedHedging,
    powerPhrases: detectedPower,
    coachingTips: tips.slice(0, 3)
  };
}
