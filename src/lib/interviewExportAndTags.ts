// Auto-Tagging and CSV Performance Export Utilities for Clayverse AI Mock Interviewer

import { MockInterviewRecord } from '../types';

export interface TopicTagMeta {
  id: string;
  name: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  iconName?: string;
  keywords: string[];
}

export const TOPIC_TAG_DEFINITIONS: TopicTagMeta[] = [
  {
    id: 'react-frontend',
    name: 'React',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-800',
    borderColor: 'border-cyan-500/30',
    keywords: [
      'react', 'hooks', 'useeffect', 'usestate', 'usememo', 'virtual dom', 'fiber',
      'jsx', 'redux', 'context api', 'rendering', 'reconciliation', 'frontend', 'props',
      'component lifecycle', 'hydration', 'ssr', 'nextjs', 'suspense'
    ]
  },
  {
    id: 'coding-algorithms',
    name: 'Algorithms',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-500/30',
    keywords: [
      'algorithm', 'binary tree', 'graph', 'dynamic programming', 'time complexity',
      'big o', 'space complexity', 'hash map', 'recursion', 'sorting', 'pointer', 'array',
      'stack', 'queue', 'dijkstra', 'dfs', 'bfs', 'greedy', 'two pointers', 'sliding window'
    ]
  },
  {
    id: 'system-design',
    name: 'System Design',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-500/30',
    keywords: [
      'system design', 'architecture', 'scalability', 'microservices', 'load balancer',
      'caching', 'throughput', 'latency', 'pipeline', 'sharding', 'distributed',
      'kv-cache', 'database design', 'high availability', 'failover', 'api gateway', 'concurrency',
      'message queue', 'kafka', 'redis', 'cap theorem', 'rate limiter'
    ]
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-500/30',
    keywords: [
      'machine learning', 'supervised', 'unsupervised', 'reinforcement', 'loss',
      'regularization', 'overfitting', 'gradient', 'weights', 'bias', 'svm',
      'random forest', 'clustering', 'l1', 'l2', 'classification', 'regression', 'xgboost', 'hyperparameter'
    ]
  },
  {
    id: 'deep-learning',
    name: 'Deep Learning',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-700',
    borderColor: 'border-purple-500/30',
    keywords: [
      'neural', 'backpropagation', 'cnn', 'convolution', 'activation', 'pooling',
      'rnn', 'lstm', 'synapse', 'feedforward', 'vanishing gradient', 'adam', 'sgd', 'batch normalization'
    ]
  },
  {
    id: 'genai-llms',
    name: 'Generative AI & LLMs',
    badgeBg: 'bg-teal-500/10',
    badgeText: 'text-teal-800',
    borderColor: 'border-teal-500/30',
    keywords: [
      'transformer', 'self-attention', 'llm', 'rag', 'retrieval', 'embedding',
      'vector', 'prompt', 'token', 'fine-tuning', 'lora', 'diffusion', 'hallucination',
      'gemini', 'gpt', 'temperature', 'top-p', 'agentic'
    ]
  },
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-800',
    borderColor: 'border-blue-500/30',
    keywords: [
      'computer vision', 'image', 'vision', 'segmentation', 'object detection',
      'yolo', 'opencv', 'bounding box', 'resnet', 'feature map', 'ocr', 'gaze'
    ]
  },
  {
    id: 'behavioral',
    name: 'Behavioral & Leadership',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-500/30',
    keywords: [
      'behavioral', 'conflict', 'leadership', 'star method', 'team', 'disagreement',
      'deadline', 'mistake', 'culture', 'communication', 'stakeholder', 'prioritization',
      'mentoring', 'negotiation', 'failure', 'ownership'
    ]
  },
  {
    id: 'mlops-production',
    name: 'MLOps & Deployment',
    badgeBg: 'bg-orange-500/10',
    badgeText: 'text-orange-800',
    borderColor: 'border-orange-500/30',
    keywords: [
      'quantization', 'docker', 'onnx', 'monitoring', 'drift', 'deployment',
      'gpu', 'inference', 'tensorrt', 'ci/cd', 'model registry', 'serving', 'triton'
    ]
  },
  {
    id: 'ethics-governance',
    name: 'AI Ethics & Safety',
    badgeBg: 'bg-fuchsia-500/10',
    badgeText: 'text-fuchsia-800',
    borderColor: 'border-fuchsia-500/30',
    keywords: [
      'ethics', 'safety', 'bias', 'fairness', 'guardrails', 'alignment',
      'toxicity', 'privacy', 'red teaming', 'watermarking', 'governance'
    ]
  }
];

export interface DerivedSessionTags {
  topicTags: string[];
  difficultyTag: string;
  primaryCategory: string;
  allMatchedMeta: TopicTagMeta[];
}

/**
 * Auto-tagging engine that inspects interview role track, questions, user answers, feedback, and notes
 * to automatically assign intelligent topic tags and standardize difficulty levels.
 */
export function deriveSessionTags(record: MockInterviewRecord): DerivedSessionTags {
  // If record already has explicit tags, retain them
  const existingTags = record.tags || record.topics || [];
  
  // Aggregate text corpus for auto-discovery
  let corpus = `${record.roleTrack} ${record.interviewerName} ${record.summaryFeedback} ${record.difficulty}`.toLowerCase();
  
  if (record.attempts && record.attempts.length > 0) {
    for (const att of record.attempts) {
      corpus += ` ${att.questionText || ''} ${att.userAnswer || ''} ${att.aiFeedback || ''} ${att.modelAnswer || ''} ${(att.strengths || []).join(' ')} ${(att.improvements || []).join(' ')}`;
    }
  }

  const matchedMeta: TopicTagMeta[] = [];

  for (const meta of TOPIC_TAG_DEFINITIONS) {
    // Check if tag name or ID is in existing tags
    const inExisting = existingTags.some(t => t.toLowerCase() === meta.name.toLowerCase() || t.toLowerCase() === meta.id.toLowerCase());
    
    if (inExisting) {
      matchedMeta.push(meta);
      continue;
    }

    // Check keyword matches in corpus
    let matchCount = 0;
    for (const kw of meta.keywords) {
      if (corpus.includes(kw.toLowerCase())) {
        matchCount++;
      }
    }

    // Minimum match threshold
    if (matchCount >= 1) {
      matchedMeta.push(meta);
    }
  }

  // Fallback defaults based on role track if no keyword match
  if (matchedMeta.length === 0) {
    const role = (record.roleTrack || '').toLowerCase();
    if (role.includes('system') || role.includes('architect')) {
      matchedMeta.push(TOPIC_TAG_DEFINITIONS[0], TOPIC_TAG_DEFINITIONS[4]); // System Design, GenAI
    } else if (role.includes('machine learning') || role.includes('ml')) {
      matchedMeta.push(TOPIC_TAG_DEFINITIONS[2], TOPIC_TAG_DEFINITIONS[3]); // ML, Deep Learning
    } else if (role.includes('prompt') || role.includes('rag') || role.includes('genai') || role.includes('llm')) {
      matchedMeta.push(TOPIC_TAG_DEFINITIONS[4], TOPIC_TAG_DEFINITIONS[0]); // GenAI, System Design
    } else if (role.includes('product') || role.includes('ethics') || role.includes('manager')) {
      matchedMeta.push(TOPIC_TAG_DEFINITIONS[1], TOPIC_TAG_DEFINITIONS[8]); // Behavioral, AI Ethics
    } else if (role.includes('vision') || role.includes('robotics')) {
      matchedMeta.push(TOPIC_TAG_DEFINITIONS[5], TOPIC_TAG_DEFINITIONS[3]); // Computer Vision, Deep Learning
    } else {
      matchedMeta.push(TOPIC_TAG_DEFINITIONS[2], TOPIC_TAG_DEFINITIONS[0]); // ML, System Design
    }
  }

  // Standardize difficulty tag
  let diff = record.difficulty || 'Mid-Level';
  if (diff.toLowerCase().includes('begin') || diff.toLowerCase().includes('junior')) {
    diff = 'Beginner';
  } else if (diff.toLowerCase().includes('staff') || diff.toLowerCase().includes('lead') || diff.toLowerCase().includes('principal')) {
    diff = 'Staff';
  } else if (diff.toLowerCase().includes('senior') || diff.toLowerCase().includes('advanc')) {
    diff = 'Senior';
  } else {
    diff = 'Mid-Level';
  }

  const topicNames = matchedMeta.map(m => m.name);
  const primaryCategory = topicNames[0] || 'Technical AI';

  return {
    topicTags: topicNames,
    difficultyTag: diff,
    primaryCategory,
    allMatchedMeta: matchedMeta
  };
}

export function getTopicTagMeta(topicName: string): TopicTagMeta | undefined {
  return TOPIC_TAG_DEFINITIONS.find(
    m => m.name.toLowerCase() === topicName.toLowerCase() || m.id.toLowerCase() === topicName.toLowerCase()
  );
}

/**
 * Updates tags for a specific interview record and persists to localStorage.
 */
export function updateRecordTags(recordId: string, updatedTags: string[]): MockInterviewRecord[] {
  try {
    const raw = localStorage.getItem('clay_mock_interview_history');
    if (!raw) return [];
    const list: MockInterviewRecord[] = JSON.parse(raw);
    const updated = list.map(item => {
      if (item.id === recordId) {
        return {
          ...item,
          tags: updatedTags,
          topics: updatedTags,
        };
      }
      return item;
    });
    localStorage.setItem('clay_mock_interview_history', JSON.stringify(updated));
    window.dispatchEvent(new Event('clay_interview_records_updated'));
    return updated;
  } catch (err) {
    console.error('Failed to update record tags:', err);
    return [];
  }
}

/**
 * Helper to escape CSV cell content in accordance with RFC 4180
 */
function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const str = String(value);
  // If string contains quotes, commas, newlines, or semicolons, wrap in quotes and escape internal quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes(';')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates and downloads a CSV spreadsheet for an individual mock interview record.
 */
export function exportSingleInterviewToCsv(record: MockInterviewRecord, studentName = 'AI Scholar Student'): void {
  const tags = deriveSessionTags(record);
  const dateStr = new Date(record.timestamp || Date.now()).toISOString().replace('T', ' ').substring(0, 19);
  const durationMins = (record.durationSeconds / 60).toFixed(1);

  const lines: string[] = [];

  // Header / Metadata Block
  lines.push('CLAYVERSE AI - MOCK INTERVIEW PERFORMANCE METRICS REPORT');
  lines.push(`Generated For,${escapeCsvCell(studentName)}`);
  lines.push(`Export Date,${escapeCsvCell(new Date().toLocaleString())}`);
  lines.push(`Session ID,${escapeCsvCell(record.id)}`);
  lines.push(`Date of Interview,${escapeCsvCell(dateStr)}`);
  lines.push(`Role Track,${escapeCsvCell(record.roleTrack)}`);
  lines.push(`Interviewer,${escapeCsvCell(record.interviewerName)}`);
  lines.push(`Difficulty Level,${escapeCsvCell(tags.difficultyTag)} (${escapeCsvCell(record.difficulty)})`);
  lines.push(`Auto Topics,${escapeCsvCell(tags.topicTags.join('; '))}`);
  lines.push(`Hiring Decision,${escapeCsvCell(record.hiringDecision)}`);
  lines.push(`Overall Score,${record.overallScore}%`);
  lines.push(`Technical Score,${record.technicalScore}%`);
  lines.push(`Communication Score,${record.communicationScore}%`);
  lines.push(`Eye Contact Gaze Score,${record.eyeContactScore}%`);
  lines.push(`Confidence Score,${record.confidenceScore}%`);
  lines.push(`Duration (Minutes),${durationMins}`);
  lines.push(`Top Strengths,${escapeCsvCell((record.topStrengths || []).join(' | '))}`);
  lines.push(`Key Action Items,${escapeCsvCell((record.keyActionItems || []).join(' | '))}`);
  lines.push(`AI Summary Feedback,${escapeCsvCell(record.summaryFeedback || '')}`);
  lines.push(''); // Blank line

  // Question-by-Question Breakdown Table
  lines.push('QUESTION-BY-QUESTION DETAILED EVALUATION');
  const headers = [
    'Question #',
    'Question Prompt',
    'Score (%)',
    'Duration (Sec)',
    'Candidate Answer Transcript',
    'Candidate Code Snippet',
    'AI Grader Feedback',
    'Demonstrated Strengths',
    'Key Improvements',
    'Model Ideal Answer'
  ];
  lines.push(headers.map(escapeCsvCell).join(','));

  if (record.attempts && record.attempts.length > 0) {
    record.attempts.forEach((att, idx) => {
      const row = [
        `Q${idx + 1}`,
        att.questionText || '',
        att.score,
        att.durationSeconds || 0,
        att.userAnswer || '',
        att.userCode || '',
        att.aiFeedback || '',
        (att.strengths || []).join('; '),
        (att.improvements || []).join('; '),
        att.modelAnswer || ''
      ];
      lines.push(row.map(escapeCsvCell).join(','));
    });
  } else {
    lines.push('No individual question attempts recorded for this session.');
  }

  const csvContent = lines.join('\r\n');
  downloadCsvBlob(csvContent, `Clayverse_Interview_${sanitizeFilename(record.roleTrack)}_${record.id.substring(0, 8)}.csv`);
}

/**
 * Generates and downloads a consolidated CSV spreadsheet containing all mock interview records.
 */
export function exportAllInterviewsToCsv(records: MockInterviewRecord[], studentName = 'AI Scholar Student'): void {
  if (!records || records.length === 0) {
    alert('No mock interview sessions available to export.');
    return;
  }

  const lines: string[] = [];

  // Title & Metadata
  lines.push('CLAYVERSE AI - ALL MOCK INTERVIEW SESSIONS HISTORICAL LOG');
  lines.push(`Student,${escapeCsvCell(studentName)}`);
  lines.push(`Total Sessions,${records.length}`);
  lines.push(`Exported At,${escapeCsvCell(new Date().toLocaleString())}`);
  lines.push('');

  // Primary Table Header
  const headers = [
    'Session ID',
    'Date / Time',
    'Role Track',
    'Interviewer',
    'Difficulty',
    'Topic Tags',
    'Hiring Decision',
    'Overall Score (%)',
    'Technical Score (%)',
    'Communication Score (%)',
    'Eye Contact Score (%)',
    'Confidence Score (%)',
    'Duration (Mins)',
    'Questions Count',
    'Top Strengths',
    'Key Action Items',
    'AI Summary Feedback'
  ];
  lines.push(headers.map(escapeCsvCell).join(','));

  records.forEach((rec) => {
    const tags = deriveSessionTags(rec);
    const dateStr = new Date(rec.timestamp || Date.now()).toISOString().replace('T', ' ').substring(0, 19);
    const durationMins = (rec.durationSeconds / 60).toFixed(1);

    const row = [
      rec.id,
      dateStr,
      rec.roleTrack,
      rec.interviewerName,
      tags.difficultyTag,
      tags.topicTags.join('; '),
      rec.hiringDecision,
      rec.overallScore,
      rec.technicalScore,
      rec.communicationScore,
      rec.eyeContactScore,
      rec.confidenceScore,
      durationMins,
      rec.attempts ? rec.attempts.length : 0,
      (rec.topStrengths || []).join(' | '),
      (rec.keyActionItems || []).join(' | '),
      rec.summaryFeedback || ''
    ];
    lines.push(row.map(escapeCsvCell).join(','));
  });

  const csvContent = lines.join('\r\n');
  downloadCsvBlob(csvContent, `Clayverse_All_Mock_Interviews_Summary_${new Date().toISOString().substring(0, 10)}.csv`);
}

/**
 * Utility to trigger browser file download from CSV string with UTF-8 BOM
 */
function downloadCsvBlob(csvText: string, filename: string): void {
  // Prepend UTF-8 BOM (\uFEFF) so Excel properly parses UTF-8 characters without encoding glitches
  const blob = new Blob(['\uFEFF' + csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9_-]/gi, '_').replace(/_+/g, '_').substring(0, 30);
}
