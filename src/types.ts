export interface PocketExample {
  id: string;
  title: string;
  iconName: string;
  description: string;
  explanation: string;
}

export interface AIType {
  title: string;
  short: string;
  description: string;
  badge: string;
}

export interface MLType {
  title: string;
  analogy: string;
  description: string;
}

export interface PromptingType {
  title: string;
  definition: string;
  example: string;
}

export interface GoDeeperItem {
  id: string;
  title: string;
  oneLiner: string;
  expandedDetails: string;
  iconName: string;
}

// AI Mock Interviewer Types
export type InterviewDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Junior' | 'Mid-Level' | 'Senior' | 'Staff';

export interface PracticeReminderSettings {
  enabled: boolean;
  frequency: 'daily' | 'weekdays' | 'weekly' | 'custom';
  customIntervalDays?: number;
  reminderTime: string; // "HH:MM" e.g. "09:00" or "18:30"
  selectedDayOfWeek?: number; // 0 for Sun, 1 for Mon, etc.
  preferredRoleId?: string;
  preferredDifficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  browserNotifications: boolean;
  soundAlerts: boolean;
  lastReminderSentTimestamp?: number;
  streakDays: number;
}

export interface InterviewQuestion {
  id: string;
  role: string;
  topic: string;
  difficulty: InterviewDifficulty;
  question: string;
  questionUrdu?: string;
  contextOrCode?: string;
  keyConcepts: string[];
  sampleAnswer: string;
  interviewerFollowUpHint: string;
  interviewerInBetweenComments: string[];
}

export interface InterviewerPersona {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  voiceGender: 'female' | 'male';
  tone: string;
  styleDescription: string;
}

export interface QuestionAttempt {
  questionId: string;
  questionText: string;
  userAnswer: string;
  userCode?: string;
  durationSeconds: number;
  aiFeedback: string;
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  inBetweenInteractions: string[];
}

export interface CameraTrackingMetrics {
  eyeContactScore: number; // 0-100%
  confidenceScore: number; // 0-100%
  centeringScore: number; // 0-100%
  postureAlert: boolean;
  smilePercentage: number;
  speakingVolumeDb: number;
  fillerWordCount: number;
  blinkRatePerMin: number;
  lightingQuality: 'Optimal' | 'Low' | 'Harsh';
}

export interface MockInterviewRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  roleTrack: string;
  interviewerName: string;
  difficulty: string;
  durationSeconds: number;
  overallScore: number; // 0-100
  hiringDecision: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Improvement';
  technicalScore: number;
  communicationScore: number;
  eyeContactScore: number;
  confidenceScore: number;
  attempts: QuestionAttempt[];
  summaryFeedback: string;
  topStrengths: string[];
  keyActionItems: string[];
  tags?: string[];
  topics?: string[];
  speechSentimentReport?: any;
  personalNotes?: string;
  personalReflections?: {
    whatWentWell?: string;
    areasToImprove?: string;
    generalNotes?: string;
    selfRating?: number;
    keyTakeaways?: string[];
    updatedAt?: number;
  };
  sessionGoals?: string;
}

export interface MockInterviewDraft {
  id: string;
  selectedRoleId: string;
  selectedPersonaId: string;
  difficulty: InterviewDifficulty;
  isUrduMode: boolean;
  sessionGoals?: string;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  userAnswer: string;
  userCode: string;
  showCodePad: boolean;
  attempts: QuestionAttempt[];
  elapsedSeconds: number;
  questionSeconds: number;
  liveMetrics: CameraTrackingMetrics;
  lastSavedTimestamp: number;
}


