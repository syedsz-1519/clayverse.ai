import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Send, 
  ChevronRight, 
  Clock, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Brain, 
  FileText, 
  Code, 
  Eye, 
  Smile, 
  MessageSquare, 
  ArrowLeft, 
  Download, 
  Share2, 
  ListOrdered,
  Layers,
  Zap,
  TrendingUp,
  XCircle,
  Lightbulb,
  Check,
  RefreshCw,
  Sliders,
  ChevronDown,
  Cloud,
  Save,
  Trash2,
  PlayCircle,
  History,
  Edit3,
  Users,
  Tag,
  Globe,
  Maximize2,
  Minimize2,
  Target,
  CheckSquare
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { CommunityPeerReviewManager } from '../lib/communityPeerReview';
import { 
  analyzeSpeechSentiment, 
  SpeechSentimentReport 
} from '../lib/speechSentimentAnalyzer';
import { 
  InterviewQuestion, 
  InterviewerPersona, 
  MockInterviewRecord, 
  MockInterviewDraft,
  QuestionAttempt, 
  CameraTrackingMetrics,
  InterviewDifficulty 
} from '../types';
import { 
  INTERVIEWER_PERSONAS, 
  INTERVIEW_ROLES, 
  INTERVIEW_QUESTIONS_DATABASE,
  getFilteredInterviewQuestions
} from '../data/interviewData';
import CameraTrackerHUD from './CameraTrackerHUD';
import InterviewPerformanceChart from './InterviewPerformanceChart';
import InterviewProTipsSidebar from './InterviewProTipsSidebar';
import CopyCodeButton from './CopyCodeButton';
import PracticeReminderModal from './PracticeReminderModal';
import PostInterviewReflectionModal from './PostInterviewReflectionModal';
import { sendGeminiChat } from '../lib/geminiClient';
import { audioEngine } from '../lib/audioEngine';

interface AIMockInterviewerProps {
  onBackToGuide?: () => void;
  onViewDashboard?: () => void;
}

export default function AIMockInterviewer({
  onBackToGuide,
  onViewDashboard,
}: AIMockInterviewerProps) {
  const { lang } = useLanguage();

  // Screen Stage: 'setup' | 'interview' | 'scorecard'
  const [stage, setStage] = useState<'setup' | 'interview' | 'scorecard'>('setup');

  // Selected configurations
  const [selectedRoleId, setSelectedRoleId] = useState<string>('ai_ml_engineer');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('dr_sarah');
  const [difficulty, setDifficulty] = useState<InterviewDifficulty>('Intermediate');
  const [isUrduMode, setIsUrduMode] = useState<boolean>(lang === 'hyd');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  // Session Goals & Objectives State (Configured before start, reminded live during session)
  const [sessionGoals, setSessionGoals] = useState<string>(() => {
    return localStorage.getItem('clay_mock_interview_goals') || 'Practice behavioral questions & STAR method, improve tone, and speak with concise 90s pacing';
  });
  const [isEditingGoalInLiveRoom, setIsEditingGoalInLiveRoom] = useState<boolean>(false);
  const [goalToast, setGoalToast] = useState<string | null>(null);

  // Goal Presets for quick selection
  const SESSION_GOAL_PRESETS = [
    { id: 'behavioral', label: 'Practice behavioral questions', icon: '🎯', text: 'Practice behavioral questions using the STAR framework' },
    { id: 'tone', label: 'Improve tone & confidence', icon: '🗣️', text: 'Improve tone, eliminate monotone pitch, and project vocal confidence' },
    { id: 'tradeoffs', label: 'Explain architecture trade-offs', icon: '⚡', text: 'Explain deep architectural trade-offs and engineering rationale' },
    { id: 'fillers', label: 'Eliminate filler words', icon: '🛑', text: 'Eliminate filler words (um, like, ah) and use deliberate pauses' },
    { id: 'timing', label: 'Concise timing (< 90s)', icon: '⏱️', text: 'Keep answers concise, well-structured, and under 90 seconds' },
    { id: 'eye_contact', label: '90%+ Eye contact & posture', icon: '👁️', text: 'Maintain strong 90%+ eye contact and steady camera presence' },
  ];

  const handleToggleGoalPreset = (presetText: string) => {
    let updated = '';
    if (!sessionGoals.trim()) {
      updated = presetText;
    } else if (sessionGoals.toLowerCase().includes(presetText.toLowerCase().slice(0, 20))) {
      // Remove it if already partially matching
      const regex = new RegExp(`(,\\s*)?${presetText.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'gi');
      updated = sessionGoals.replace(regex, '').trim().replace(/^,\s*/, '');
    } else {
      updated = `${sessionGoals.trim()}, ${presetText}`;
    }
    setSessionGoals(updated);
    localStorage.setItem('clay_mock_interview_goals', updated);
    audioEngine.playLoFiChord();
  };

  // Interview active session state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [userCode, setUserCode] = useState('');
  const [showCodePad, setShowCodePad] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [interviewerStatus, setInterviewerStatus] = useState<'Speaking' | 'Listening' | 'Taking Notes' | 'Pondering' | 'Interacting'>('Speaking');
  const [interviewerSpeechText, setInterviewerSpeechText] = useState('');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [inBetweenMessage, setInBetweenMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Timer states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [countdownTargetSeconds, setCountdownTargetSeconds] = useState<number>(90); // 90s default target
  const [isPaused, setIsPaused] = useState(false);

  // Live Speech Sentiment Analysis
  const liveSentimentReport = useMemo(() => {
    return analyzeSpeechSentiment(userAnswer, Math.max(1, questionSeconds));
  }, [userAnswer, questionSeconds]);

  // Live camera tracking metrics from HUD
  const [liveMetrics, setLiveMetrics] = useState<CameraTrackingMetrics>({
    eyeContactScore: 92,
    confidenceScore: 88,
    centeringScore: 95,
    postureAlert: false,
    smilePercentage: 65,
    speakingVolumeDb: -45,
    fillerWordCount: 0,
    blinkRatePerMin: 18,
    lightingQuality: 'Optimal',
  });

  // Scorecard state
  const [completedRecord, setCompletedRecord] = useState<MockInterviewRecord | null>(null);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);

  // Deep Focus Mode State (Hides distracting UI and expands video feed)
  const [isDeepFocus, setIsDeepFocus] = useState<boolean>(false);

  // Keyboard shortcut listener for Escape to exit Deep Focus
  useEffect(() => {
    if (stage !== 'interview') {
      if (isDeepFocus) setIsDeepFocus(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses Escape key while in Deep Focus mode, exit
      if (e.key === 'Escape' && isDeepFocus) {
        setIsDeepFocus(false);
        audioEngine.playLoFiChord();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, isDeepFocus]);

  // Community Peer Review & Anonymized Feedback State
  const [isCommunityOptIn, setIsCommunityOptIn] = useState<boolean>(false);
  const [customCommunityFeedbackPrompt, setCustomCommunityFeedbackPrompt] = useState<string>('Looking for constructive peer feedback on my technical answer clarity, system trade-offs, and algorithm depth.');
  const [hasSharedToCommunity, setHasSharedToCommunity] = useState<boolean>(false);
  const [communityShareToast, setCommunityShareToast] = useState<string | null>(null);

  // Community share handler
  const handleShareToCommunity = (record: MockInterviewRecord) => {
    try {
      CommunityPeerReviewManager.submitInterviewAnonymously(record, customCommunityFeedbackPrompt);
      setHasSharedToCommunity(true);
      audioEngine.playLoFiChord();
      setCommunityShareToast('Shared anonymously to the Community Peer Review Feed!');
      setTimeout(() => setCommunityShareToast(null), 4000);
    } catch (e) {
      console.warn('Failed to share to community:', e);
    }
  };

  // Auto-Save Draft State for Interrupted Session Recovery
  const [savedDraft, setSavedDraft] = useState<MockInterviewDraft | null>(null);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<{
    show: boolean;
    timeStr: string;
    questionNumber: number;
    totalQuestions: number;
    isManual?: boolean;
  } | null>(null);

  // Manual save trigger
  const triggerManualSave = () => {
    if (stage !== 'interview' || questions.length === 0) return;
    try {
      const draft: MockInterviewDraft = {
        id: `draft_${selectedRoleId}`,
        selectedRoleId,
        selectedPersonaId,
        difficulty,
        isUrduMode,
        sessionGoals,
        currentQuestionIndex,
        questions,
        userAnswer,
        userCode,
        showCodePad,
        attempts,
        elapsedSeconds,
        questionSeconds,
        liveMetrics,
        lastSavedTimestamp: Date.now(),
      };
      localStorage.setItem('clay_mock_interview_draft', JSON.stringify(draft));
      setSavedDraft(draft);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastAutoSavedTime(nowStr);
      setSaveToast({
        show: true,
        timeStr: nowStr,
        questionNumber: currentQuestionIndex + 1,
        totalQuestions: questions.length,
        isManual: true
      });
      window.dispatchEvent(new Event('clay_interview_draft_updated'));
      audioEngine.playLoFiChord();
      setTimeout(() => {
        setSaveToast(prev => prev ? { ...prev, show: false } : null);
      }, 3500);
    } catch (e) {
      console.warn('Manual save failed:', e);
    }
  };

  // Load any previously interrupted mock interview draft on mount
  useEffect(() => {
    const loadDraft = () => {
      try {
        const savedDraftJson = localStorage.getItem('clay_mock_interview_draft');
        if (savedDraftJson) {
          const parsed: MockInterviewDraft = JSON.parse(savedDraftJson);
          if (parsed && parsed.questions && parsed.questions.length > 0) {
            setSavedDraft(parsed);
          } else {
            setSavedDraft(null);
          }
        } else {
          setSavedDraft(null);
        }
      } catch (e) {
        console.warn('Failed to load mock interview draft:', e);
      }
    };

    loadDraft();
    window.addEventListener('clay_interview_draft_updated', loadDraft);
    return () => {
      window.removeEventListener('clay_interview_draft_updated', loadDraft);
    };
  }, []);

  // Real-time auto-save debounced effect while an interview is actively in progress
  useEffect(() => {
    if (stage !== 'interview' || questions.length === 0) return;

    setIsAutoSaving(true);
    const timeout = setTimeout(() => {
      try {
        const draft: MockInterviewDraft = {
          id: `draft_${selectedRoleId}`,
          selectedRoleId,
          selectedPersonaId,
          difficulty,
          isUrduMode,
          currentQuestionIndex,
          questions,
          userAnswer,
          userCode,
          showCodePad,
          attempts,
          elapsedSeconds,
          questionSeconds,
          liveMetrics,
          lastSavedTimestamp: Date.now(),
        };

        localStorage.setItem('clay_mock_interview_draft', JSON.stringify(draft));
        setSavedDraft(draft);
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastAutoSavedTime(nowStr);
        setSaveToast({
          show: true,
          timeStr: nowStr,
          questionNumber: currentQuestionIndex + 1,
          totalQuestions: questions.length,
          isManual: false
        });
        window.dispatchEvent(new Event('clay_interview_draft_updated'));
      } catch (err) {
        console.warn('Auto-save failed:', err);
      } finally {
        setIsAutoSaving(false);
        setTimeout(() => {
          setSaveToast(prev => prev ? { ...prev, show: false } : null);
        }, 3200);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [
    stage,
    selectedRoleId,
    selectedPersonaId,
    difficulty,
    isUrduMode,
    currentQuestionIndex,
    questions,
    userAnswer,
    userCode,
    showCodePad,
    attempts,
    elapsedSeconds,
    questionSeconds,
    liveMetrics
  ]);

  // Speech Recognition ref
  const recognitionRef = useRef<any>(null);

  // Selected Persona & Role objects
  const currentPersona = INTERVIEWER_PERSONAS.find(p => p.id === selectedPersonaId) || INTERVIEWER_PERSONAS[0];
  const currentRole = INTERVIEW_ROLES.find(r => r.id === selectedRoleId) || INTERVIEW_ROLES[0];
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Speak Question / In-Between Text via SpeechSynthesis
  const speakText = useCallback((text: string, persona: InterviewerPersona) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = persona.voiceGender === 'female' ? 1.15 : 0.9;
    
    // Choose appropriate browser voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (persona.voiceGender === 'female' ? (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google UK English Female')) : true)
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsSpeakingAudio(true);
      setInterviewerStatus('Speaking');
    };

    utterance.onend = () => {
      setIsSpeakingAudio(false);
      setInterviewerStatus('Listening');
    };

    utterance.onerror = () => {
      setIsSpeakingAudio(false);
      setInterviewerStatus('Listening');
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingAudio(false);
  };

  // Start Voice Recognition
  const startSpeechRecognition = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert(lang === 'en' ? 'Speech recognition is not supported in this browser. You can type your answer in the box below.' : 'Aapke browser me speech recognition nahi chali. Aap type kar sakte hain.');
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isUrduMode ? 'ur-PK' : 'en-US';

      recognition.onstart = () => {
        setIsRecordingVoice(true);
        setInterviewerStatus('Listening');
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTrans) {
          setUserAnswer(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + finalTrans.trim());
          
          // Trigger subtle in-between reaction from AI
          triggerInBetweenReaction(finalTrans);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsRecordingVoice(false);
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Recognition setup failed:', err);
      setIsRecordingVoice(false);
    }
  };

  // Stop Voice Recognition
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecordingVoice(false);
  };

  // Trigger Realistic In-Between Reaction from the AI Interviewer
  const triggerInBetweenReaction = (transcribedSnippet: string) => {
    if (!currentQuestion) return;
    
    // Check if snippet contains keywords from question
    const matchedKey = currentQuestion.keyConcepts.find(k => 
      transcribedSnippet.toLowerCase().includes(k.toLowerCase().split(' ')[0])
    );

    if (matchedKey && !inBetweenMessage) {
      const reactions = currentQuestion.interviewerInBetweenComments || [
        'Good point, keep expanding on that.',
        'Exactly right on that concept.',
        'Interesting angle!',
      ];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      
      setInBetweenMessage(reaction);
      setInterviewerStatus('Interacting');

      // Auto-clear in-between notification after 4.5 seconds
      setTimeout(() => {
        setInBetweenMessage(null);
        setInterviewerStatus('Listening');
      }, 4500);
    }
  };

  // Request a Hint / In-Between Clarification
  const handleRequestHint = () => {
    if (!currentQuestion) return;
    const hint = currentQuestion.interviewerFollowUpHint || 'Focus on the core trade-offs and structural differences.';
    const formattedHint = `${currentPersona.name}: "${hint}"`;
    setInBetweenMessage(formattedHint);
    setInterviewerStatus('Speaking');
    speakText(hint, currentPersona);

    setTimeout(() => {
      setInBetweenMessage(null);
      setInterviewerStatus('Listening');
    }, 6500);
  };

  // Start Full Interview Session (Fresh)
  const handleStartInterview = () => {
    // Clear any previous draft
    localStorage.removeItem('clay_mock_interview_draft');
    setSavedDraft(null);
    window.dispatchEvent(new Event('clay_interview_draft_updated'));

    // Filter questions tailored to selected role & difficulty
    const pool = getFilteredInterviewQuestions(selectedRoleId, difficulty);
    setQuestions(pool);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setUserCode('');
    setAttempts([]);
    setElapsedSeconds(0);
    setQuestionSeconds(0);
    setIsPaused(false);
    setStage('interview');

    // Introduce interview question
    if (pool[0]) {
      const qText = isUrduMode && pool[0].questionUrdu ? pool[0].questionUrdu : pool[0].question;
      setInterviewerSpeechText(qText);
      setTimeout(() => {
        speakText(qText, currentPersona);
      }, 400);
    }
  };

  // Resume an interrupted mock interview session
  const handleResumeDraft = (draft: MockInterviewDraft) => {
    setSelectedRoleId(draft.selectedRoleId);
    setSelectedPersonaId(draft.selectedPersonaId);
    setDifficulty(draft.difficulty);
    setIsUrduMode(draft.isUrduMode);
    if (draft.sessionGoals) {
      setSessionGoals(draft.sessionGoals);
    }
    setQuestions(draft.questions);
    setCurrentQuestionIndex(draft.currentQuestionIndex);
    setUserAnswer(draft.userAnswer || '');
    setUserCode(draft.userCode || '');
    setShowCodePad(draft.showCodePad || false);
    setAttempts(draft.attempts || []);
    setElapsedSeconds(draft.elapsedSeconds || 0);
    setQuestionSeconds(draft.questionSeconds || 0);
    if (draft.liveMetrics) {
      setLiveMetrics(draft.liveMetrics);
    }
    setIsPaused(false);
    setStage('interview');

    const persona = INTERVIEWER_PERSONAS.find(p => p.id === draft.selectedPersonaId) || INTERVIEWER_PERSONAS[0];
    const q = draft.questions[draft.currentQuestionIndex];
    if (q) {
      const qText = draft.isUrduMode && q.questionUrdu ? q.questionUrdu : q.question;
      setInterviewerSpeechText(qText);
      setTimeout(() => {
        speakText(qText, persona);
      }, 500);
    }
    audioEngine.playLoFiChord();
  };

  // Discard saved draft
  const handleDiscardDraft = () => {
    localStorage.removeItem('clay_mock_interview_draft');
    setSavedDraft(null);
    window.dispatchEvent(new Event('clay_interview_draft_updated'));
    audioEngine.playLoFiChord();
  };

  // Main Timer loop
  useEffect(() => {
    if (stage !== 'interview' || isPaused) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      setQuestionSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, isPaused]);

  // Submit Current Answer & Advance to Next Question
  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    stopSpeaking();
    stopSpeechRecognition();
    setIsEvaluating(true);
    setInterviewerStatus('Taking Notes');

    const duration = questionSeconds;
    const fullAnswerText = userAnswer.trim() || 'No answer provided verbally or in text.';

    // Evaluate answer with Gemini AI or Smart Rubric Fallback
    let score = 82;
    let feedback = '';
    let strengths: string[] = [];
    let improvements: string[] = [];

    try {
      const prompt = `You are ${currentPersona.name}, a ${currentPersona.role} conducting an AI technical mock interview for a ${difficulty} level candidate.
Evaluate the candidate's answer for the following question:
Question: "${currentQuestion.question}"
Candidate Target Seniority: ${difficulty}
Candidate Answer: "${fullAnswerText}"
Candidate Code/Scratchpad: "${userCode || 'None'}"
Key Expected Concepts: ${currentQuestion.keyConcepts.join(', ')}
Candidate's Self-Defined Session Goals: "${sessionGoals || 'General technical and behavioral practice'}"

Rubric Guidelines for ${difficulty}:
- If Beginner: Reward conceptual intuition, definitions, and understanding of core analogies. Provide encouraging guidance.
- If Intermediate: Expect standard trade-offs, architecture flow, and clear algorithmic rationale.
- If Advanced: Evaluate rigorous mathematical precision, scaling bottlenecks, distributed latency, and low-level trade-offs.
- Goal Alignment: Keep in mind the candidate's self-defined goals (e.g. improve tone, behavioral STAR structure, avoid fillers, trade-offs) and highlight in strengths/improvements how they did against these goals.

Please provide a JSON response with:
1. "score": number from 0 to 100
2. "feedback": 2-3 sentences of constructive critique in conversational interviewer voice.
3. "strengths": array of 2 bullet points
4. "improvements": array of 2 bullet points of missed nuances or trade-offs.`;

      const response = await sendGeminiChat({
        messages: [{ role: 'user', content: prompt }],
        systemInstruction: 'You are an expert AI interviewer scoring mock candidate responses. Return JSON only.',
      });

      // Parse JSON from Gemini reply
      const jsonMatch = response.reply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        score = parsed.score || 80;
        feedback = parsed.feedback || 'Solid conceptual grasp with good foundational points.';
        strengths = parsed.strengths || ['Clear terminology', 'Good structured explanation'];
        improvements = parsed.improvements || ['Could dive deeper into mathematical trade-offs', 'Mention edge-cases'];
      } else {
        feedback = response.reply.slice(0, 200);
      }
    } catch (err) {
      // Smart offline fallback rubric
      const wordCount = fullAnswerText.split(' ').length;
      const matchedConcepts = currentQuestion.keyConcepts.filter(k => 
        fullAnswerText.toLowerCase().includes(k.toLowerCase().split(' ')[0])
      );
      score = Math.min(95, Math.max(50, 60 + matchedConcepts.length * 8 + (wordCount > 30 ? 10 : 0)));
      feedback = `Good attempt! You captured ${matchedConcepts.length} out of ${currentQuestion.keyConcepts.length} key concepts. Your communication was structured and confident.`;
      strengths = matchedConcepts.length > 0 
        ? matchedConcepts.map(c => `Mentioned ${c}`)
        : ['Clear speaking tone', 'Direct approach'];
      improvements = [
        'Explore the mathematical derivatives and edge-case behaviors',
        'Elaborate on production latency and memory bottlenecks'
      ];
    }

    const attempt: QuestionAttempt = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      userAnswer: fullAnswerText,
      userCode: userCode || undefined,
      durationSeconds: duration,
      aiFeedback: feedback,
      score,
      strengths,
      improvements,
      modelAnswer: currentQuestion.sampleAnswer,
      inBetweenInteractions: inBetweenMessage ? [inBetweenMessage] : [],
    };

    const updatedAttempts = [...attempts, attempt];
    setAttempts(updatedAttempts);
    setIsEvaluating(false);

    // If there are more questions, advance
    if (currentQuestionIndex < questions.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setUserAnswer('');
      setUserCode('');
      setQuestionSeconds(0);
      setInBetweenMessage(null);

      const nextQ = questions[nextIdx];
      const nextQText = isUrduMode && nextQ.questionUrdu ? nextQ.questionUrdu : nextQ.question;
      setInterviewerSpeechText(nextQText);
      setTimeout(() => {
        speakText(nextQText, currentPersona);
      }, 500);
    } else {
      // Complete full interview session and generate Final Scorecard
      finalizeInterview(updatedAttempts);
    }
  };

  // Generate Final Scorecard & Save to LocalStorage / Dashboard
  const finalizeInterview = (allAttempts: QuestionAttempt[]) => {
    stopSpeaking();
    stopSpeechRecognition();

    const totalScore = Math.round(
      allAttempts.reduce((acc, curr) => acc + curr.score, 0) / (allAttempts.length || 1)
    );

    let hiringDecision: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Improvement' = 'Hire';
    if (totalScore >= 90) hiringDecision = 'Strong Hire';
    else if (totalScore >= 78) hiringDecision = 'Hire';
    else if (totalScore >= 65) hiringDecision = 'Leaning Hire';
    else hiringDecision = 'Needs Improvement';

    const techScore = totalScore;
    const commScore = Math.round(Math.min(98, Math.max(70, liveMetrics.confidenceScore + 5)));
    const eyeContact = liveMetrics.eyeContactScore;

    // Aggregate full spoken and typed text across all attempts for speech sentiment analysis
    const fullTranscript = allAttempts.map(a => a.userAnswer).join(' ');
    const totalAttemptDuration = allAttempts.reduce((sum, a) => sum + (a.durationSeconds || 60), 0);
    const overallSentimentReport = analyzeSpeechSentiment(fullTranscript, Math.max(1, totalAttemptDuration));

    const autoTopics = Array.from(new Set([
      currentRole.title.includes('AI') || currentRole.title.includes('ML') ? 'Deep Learning' : 'System Design',
      currentRole.title.includes('LLM') || currentRole.title.includes('Generative') ? 'Generative AI & LLMs' : 'Machine Learning',
      difficulty === 'Advanced' ? 'Optimization & Scaling' : 'Core Architecture'
    ]));

    const record: MockInterviewRecord = {
      id: `interview_${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      roleTrack: currentRole.title,
      interviewerName: currentPersona.name,
      difficulty,
      durationSeconds: elapsedSeconds,
      overallScore: totalScore,
      hiringDecision,
      technicalScore: techScore,
      communicationScore: commScore,
      eyeContactScore: eyeContact,
      confidenceScore: liveMetrics.confidenceScore,
      attempts: allAttempts,
      summaryFeedback: `Candidate demonstrated strong intuitive understanding of ${currentRole.title} fundamentals, maintaining ${eyeContact}% eye contact and ${overallSentimentReport.dominantTone} tone of voice.`,
      topStrengths: [
        'High composure and consistent camera gaze tracking',
        'Strong grasp of architectural tradeoffs (RAG, attention, loss optimization)',
        `Articulate ${overallSentimentReport.dominantTone.toLowerCase()} speech delivery (${overallSentimentReport.wordsPerMinute} WPM)`
      ],
      keyActionItems: [
        'Practice writing out mathematical loss functions and matrix dimensions',
        'Deepen familiarity with low-level GPU memory quantization and KV-cache constraints',
        overallSentimentReport.coachingTips[0] || 'Incorporate more quantitative metrics into verbal answers'
      ],
      topics: autoTopics,
      tags: autoTopics,
      speechSentimentReport: overallSentimentReport,
    };

    setCompletedRecord(record);
    setStage('scorecard');

    // Auto-prompt personal reflection modal after a brief pause so user can reflect on performance
    setTimeout(() => {
      setIsReflectionModalOpen(true);
    }, 700);

    // Save record to local storage for Dashboard integration and clear in-progress draft
    try {
      const savedHistory = localStorage.getItem('clay_mock_interviews');
      const parsedHistory: MockInterviewRecord[] = savedHistory ? JSON.parse(savedHistory) : [];
      parsedHistory.unshift(record);
      localStorage.setItem('clay_mock_interviews', JSON.stringify(parsedHistory));
      localStorage.removeItem('clay_mock_interview_draft');
      setSavedDraft(null);
      window.dispatchEvent(new Event('clay_interview_saved'));
      window.dispatchEvent(new Event('clay_interview_draft_updated'));

      // If user toggled Community Feedback opt-in during setup, share anonymously
      if (isCommunityOptIn) {
        CommunityPeerReviewManager.submitInterviewAnonymously(record, customCommunityFeedbackPrompt);
        setHasSharedToCommunity(true);
      }
    } catch (e) {
      console.warn('Failed to save interview record:', e);
    }
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <section className="w-full min-h-screen bg-brand-cream py-8 px-4 sm:px-6 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* ========================================================================= */}
        {/* STAGE 1: INTERVIEW SETUP & PERSONA SELECTION */}
        {/* ========================================================================= */}
        {stage === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Top Back / Navigation Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={onBackToGuide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-slate/15 text-brand-slate hover:text-brand-charcoal text-xs font-bold shadow-2xs hover:bg-brand-sand transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {lang === 'en' ? "Back to AI Guide" : "AI Guide Par Wapas Jayein"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onViewDashboard}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber-dark hover:bg-brand-amber/20 text-xs font-bold transition-all cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  {lang === 'en' ? "My Student Dashboard" : "Mera Student Dashboard"}
                </button>
              </div>
            </div>

            {/* Header Hero Banner */}
            <div className="bg-gradient-to-br from-brand-charcoal via-slate-900 to-brand-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden text-left">
              <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 border border-brand-amber/30 text-brand-amber text-[10px] font-mono font-black uppercase tracking-wider mb-3">
                  <Video className="w-3.5 h-3.5 animate-pulse" />
                  <span>AI Technical Mock Interviewer & Vision HUD</span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {lang === 'en' ? "Practice AI Technical Interviews with Real Camera Vision" : "Real Camera Tracker ke Sath AI Mock Interview Ki Practice Karein"}
                </h1>
                <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
                  {lang === 'en' 
                    ? "Experience real-time interviewer interactions, proactive in-between conversational nudges, live eye-contact tracking, and instant AI grading on your answers."
                    : "Real camera gaze tracker, animated AI interviewer aur live question-answer evaluations ke sath apni interview skills mazboot karein."}
                </p>

                {/* Feature Highlights Pills */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10 text-[11px] font-mono text-white/80">
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" /> Real Camera Eye-Contact HUD
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                    <Bot className="w-3.5 h-3.5 text-brand-amber" /> In-Between AI Interactivity
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                    <Mic className="w-3.5 h-3.5 text-purple-400" /> Voice & Speech Recognition
                  </span>
                </div>
              </div>
            </div>

            {/* Resume Interrupted Interview Banner (if auto-saved draft exists) */}
            {savedDraft && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-gradient-to-r from-brand-amber/15 via-amber-50 to-orange-50 border-2 border-brand-amber/40 rounded-3xl p-5 sm:p-6 shadow-md text-left flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-amber text-white rounded-2xl shadow-sm shrink-0">
                    <History className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark text-[10px] font-mono font-bold uppercase tracking-wider">
                        Interrupted Session Saved
                      </span>
                      <span className="text-[10px] font-mono text-brand-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-amber" />
                        {savedDraft.lastSavedTimestamp ? new Date(savedDraft.lastSavedTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </span>
                    </div>

                    <h3 className="font-display text-base font-bold text-brand-charcoal">
                      {INTERVIEW_ROLES.find(r => r.id === savedDraft.selectedRoleId)?.title || 'AI Technical Interview'} ({savedDraft.difficulty})
                    </h3>

                    <p className="text-xs text-brand-slate">
                      Progress: <strong>Question {savedDraft.currentQuestionIndex + 1} of {savedDraft.questions.length}</strong> • {savedDraft.attempts.length} graded answers • Time elapsed: {formatTime(savedDraft.elapsedSeconds)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleResumeDraft(savedDraft)}
                    className="px-4 py-2.5 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Resume Interview</span>
                  </button>

                  <button
                    onClick={handleDiscardDraft}
                    className="p-2.5 bg-white hover:bg-red-50 text-brand-muted hover:text-red-600 rounded-xl text-xs font-bold border border-brand-slate/15 transition-all cursor-pointer"
                    title="Discard saved draft and start fresh"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 1. Step: Select Role Track */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm text-left">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                  <Brain className="w-4 h-4 text-brand-amber" />
                  {lang === 'en' ? "1. Select Interview Role Track" : "1. Interview Ka Role Chuniye"}
                </h3>
                <span className="text-[10px] font-mono text-brand-muted uppercase font-bold">
                  {INTERVIEW_ROLES.length} Specialized Tracks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {INTERVIEW_ROLES.map((role) => {
                  const isSelected = selectedRoleId === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setSelectedRoleId(role.id);
                        setSelectedPersonaId(role.recommendedPersona);
                        audioEngine.playLoFiChord();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-brand-amber bg-brand-amber/[0.04] shadow-md ring-2 ring-brand-amber/30' 
                          : 'border-brand-slate/10 bg-brand-sand/20 hover:border-brand-slate/25'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-3 right-3 w-5 h-5 bg-brand-amber text-white rounded-full flex items-center justify-center text-xs shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-full inline-block mb-2">
                          {role.badge}
                        </span>
                        <h4 className="font-display font-bold text-xs text-brand-charcoal leading-snug">
                          {role.title}
                        </h4>
                        <p className="text-[10px] text-brand-muted mt-1 leading-relaxed line-clamp-2">
                          {role.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-brand-slate/10 flex items-center justify-between text-[9px] font-mono text-brand-slate">
                        <span>{role.totalQuestions} Questions</span>
                        <span className="text-brand-amber font-bold">~12 Mins</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Step: Select Interviewer Persona */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm text-left">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                  <Bot className="w-4 h-4 text-brand-amber" />
                  {lang === 'en' ? "2. Choose Your AI Interviewer Persona" : "2. Apna AI Interviewer Chuniye"}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {INTERVIEWER_PERSONAS.map((persona) => {
                  const isSelected = selectedPersonaId === persona.id;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersonaId(persona.id);
                        audioEngine.playLoFiChord();
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected 
                          ? 'border-brand-amber bg-brand-amber/[0.04] shadow-md ring-2 ring-brand-amber/30' 
                          : 'border-brand-slate/10 bg-brand-sand/20 hover:border-brand-slate/25'
                      }`}
                    >
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-12 h-12 rounded-xl object-cover border border-brand-slate/15 shrink-0 shadow-sm"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-xs text-brand-charcoal truncate">
                            {persona.name}
                          </h4>
                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-amber shrink-0" />}
                        </div>
                        <span className="text-[9px] font-mono text-brand-amber font-semibold block truncate">
                          {persona.role}
                        </span>
                        <p className="text-[9.5px] text-brand-muted line-clamp-2 mt-0.5">
                          {persona.tone}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Step: Experience Level & Language Options */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/10 pb-3">
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-charcoal flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-amber" />
                    <span>{lang === 'en' ? "Question Difficulty & Complexity" : "Interview Difficulty Level"}</span>
                  </h4>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {lang === 'en' 
                      ? "Calibrates question depth, rubric rigor, follow-up edge cases, and expected mathematical detail."
                      : "Apni tajarba ke mutabiq sawalat ki pechidgi muntakhib karein."}
                  </p>
                </div>
                
                <button
                  onClick={() => setIsReminderModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-brand-slate/20 bg-brand-sand/30 hover:bg-brand-sand text-brand-charcoal text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
                >
                  <Clock className="w-3.5 h-3.5 text-brand-amber" />
                  <span>{lang === 'en' ? "Practice Reminders" : "Yad-dihani Set Karein"}</span>
                </button>
              </div>

              {/* Difficulty Toggle Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'Beginner' as InterviewDifficulty,
                    title: 'Beginner',
                    badge: 'Foundations',
                    description: 'Core concepts, intuitive analogies, vocabulary & fundamental principles.',
                    color: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/30 text-emerald-950',
                    activeRing: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/60'
                  },
                  {
                    id: 'Intermediate' as InterviewDifficulty,
                    title: 'Intermediate',
                    badge: 'Standard Tech',
                    description: 'Architectural trade-offs, standard formulas & real-world system design.',
                    color: 'from-amber-500/10 to-orange-500/5 border-amber-500/30 text-amber-950',
                    activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-amber-50/60'
                  },
                  {
                    id: 'Advanced' as InterviewDifficulty,
                    title: 'Advanced',
                    badge: 'Staff / Expert',
                    description: 'Production scaling, low-level optimization, latency & deep derivations.',
                    color: 'from-purple-500/10 to-indigo-500/5 border-purple-500/30 text-purple-950',
                    activeRing: 'ring-2 ring-purple-500 border-purple-500 bg-purple-50/60'
                  },
                ].map((tier) => {
                  const isSelected = difficulty === tier.id || 
                    (difficulty === 'Junior' && tier.id === 'Beginner') ||
                    (difficulty === 'Mid-Level' && tier.id === 'Intermediate') ||
                    (difficulty === 'Senior' && tier.id === 'Advanced') ||
                    (difficulty === 'Staff' && tier.id === 'Advanced');

                  return (
                    <button
                      key={tier.id}
                      onClick={() => setDifficulty(tier.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-2 ${
                        isSelected
                          ? tier.activeRing
                          : 'bg-white border-brand-slate/15 hover:bg-brand-sand/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-display font-bold text-xs text-brand-charcoal">
                            {tier.title}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/80 border border-brand-slate/10 text-brand-slate">
                            {tier.badge}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-brand-muted leading-relaxed mt-1.5">
                          {tier.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-brand-charcoal pt-1 border-t border-brand-slate/10">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Active Complexity</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Language Mode Toggle */}
              <div className="pt-2 border-t border-brand-slate/10 flex items-center justify-between">
                <span className="text-xs text-brand-muted">
                  Language & Narration Accent:
                </span>
                <button
                  onClick={() => setIsUrduMode(!isUrduMode)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isUrduMode 
                      ? 'bg-brand-amber/15 border-brand-amber text-brand-amber-dark shadow-2xs' 
                      : 'bg-brand-sand/30 border-brand-slate/15 text-brand-slate hover:bg-brand-sand'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isUrduMode ? "Bilingual Urdu/English Mode ON" : "English Only Mode"}</span>
                </button>
              </div>
            </div>

            {/* 4. Step: Community Peer Review & Anonymized Feedback */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-700 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                      <span>4. Community Peer Feedback</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">
                        ANONYMOUS
                      </span>
                    </h3>
                    <p className="text-xs text-brand-muted mt-0.5">
                      {lang === 'en'
                        ? "Anonymously share interview transcript snippets with fellow students for peer critique and community feedback."
                        : "Apne interview ke jawab ka transcript dosre students ke sath anonymous peer review ke liye share karein."}
                    </p>
                  </div>
                </div>

                {/* Community Feedback Toggle */}
                <button
                  onClick={() => {
                    setIsCommunityOptIn(!isCommunityOptIn);
                    audioEngine.playLoFiChord();
                  }}
                  className={`px-4 py-2 rounded-2xl border text-xs font-bold font-mono transition-all flex items-center gap-2.5 cursor-pointer shrink-0 shadow-2xs ${
                    isCommunityOptIn
                      ? 'bg-indigo-600 border-indigo-700 text-white shadow-md'
                      : 'bg-brand-sand/30 border-brand-slate/20 text-brand-slate hover:bg-brand-sand/60'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isCommunityOptIn ? 'bg-white border-white' : 'border-brand-slate/40'
                  }`} />
                  <span>{isCommunityOptIn ? 'Community Feedback: ON' : 'Enable Community Feedback'}</span>
                </button>
              </div>

              {isCommunityOptIn && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3 pt-3 border-t border-brand-slate/10 overflow-hidden"
                >
                  <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-indigo-950 font-bold">
                        <Tag className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Assigned Topic Tags for Peer Feed:</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          currentRole.title.includes('AI') ? 'Deep Learning' : 'System Design',
                          currentRole.title.includes('LLM') ? 'Generative AI & LLMs' : 'Machine Learning',
                          difficulty === 'Advanced' ? 'Optimization & Scaling' : 'Core Architecture',
                          difficulty
                        ].map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-white text-indigo-900 border border-indigo-200 text-[10px] font-mono font-bold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-indigo-950 block font-sans">
                        Peer Review Focus Request (What should students critique?):
                      </label>
                      <input
                        type="text"
                        value={customCommunityFeedbackPrompt}
                        onChange={(e) => setCustomCommunityFeedbackPrompt(e.target.value)}
                        placeholder="e.g. Seeking critique on my explanation of gradient descent and KV-cache trade-offs..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-brand-charcoal text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-[10.5px] text-indigo-900/80 font-mono">
                      <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>Transcripts will appear in the Community Feed under <strong>Anonymous Scholar</strong>. Camera and audio remain 100% private.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Launch Action Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleStartInterview}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-brand-amber to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-display font-black text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
              >
                <Video className="w-5 h-5 animate-pulse" />
                <span>{lang === 'en' ? "Enter Live Mock Interview Room" : "Live Interview Room Me Dakhil Hon"}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: LIVE INTERVIEW ROOM WITH REAL CAMERA & AI INTERVIEWER */}
        {/* ========================================================================= */}
        {stage === 'interview' && currentQuestion && (
          <motion.div
            key={isDeepFocus ? 'deep-focus-active' : 'standard-session'}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={
              isDeepFocus
                ? "fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl text-white flex flex-col justify-between p-3 sm:p-5 overflow-y-auto lg:overflow-hidden select-none"
                : "space-y-4 text-left"
            }
          >
            {/* Top Live Bar: Role, Question Progress, Timers & Deep Focus Toggle */}
            <div
              className={`rounded-2xl p-3.5 px-5 border shadow-sm flex flex-wrap items-center justify-between gap-3 ${
                isDeepFocus
                  ? 'bg-white/[0.05] border-white/10 text-white backdrop-blur-md'
                  : 'bg-white border-brand-slate/15 text-brand-charcoal'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono uppercase font-bold block ${
                      isDeepFocus ? 'text-purple-300' : 'text-brand-amber'
                    }`}>
                      {currentRole.title} ({difficulty})
                    </span>
                    {isDeepFocus && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[9px] font-mono font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-purple-300 animate-pulse" />
                        <span>DEEP FOCUS ACTIVE</span>
                      </span>
                    )}
                  </div>
                  <h3 className={`font-display text-xs font-black ${
                    isDeepFocus ? 'text-white' : 'text-brand-charcoal'
                  }`}>
                    Question {currentQuestionIndex + 1} of {questions.length} • {currentQuestion.topic}
                  </h3>
                </div>
              </div>

              {/* Timers, Countdown, Deep Focus Toggle, Auto-Save Status & Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Visual Countdown Timer for Practice Questions */}
                {countdownTargetSeconds > 0 ? (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-2xs ${
                    countdownTargetSeconds - questionSeconds <= 15
                      ? 'bg-red-500/20 border-red-500/60 text-red-400 animate-pulse'
                      : countdownTargetSeconds - questionSeconds <= 30
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : isDeepFocus
                      ? 'bg-white/10 border-white/15 text-emerald-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
                  }`}>
                    {/* SVG Circular Progress Ring */}
                    <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className={isDeepFocus ? "text-slate-700 stroke-current" : "text-slate-200 stroke-current"}
                          strokeWidth="4"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={`stroke-current ${
                            countdownTargetSeconds - questionSeconds <= 15 ? 'text-red-500' :
                            countdownTargetSeconds - questionSeconds <= 30 ? 'text-amber-500' : 'text-emerald-500'
                          }`}
                          strokeDasharray={`${Math.min(100, Math.max(0, ((countdownTargetSeconds - questionSeconds) / countdownTargetSeconds) * 100))}, 100`}
                          strokeWidth="4"
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>

                    <span>
                      {formatTime(Math.max(0, countdownTargetSeconds - questionSeconds))}
                    </span>
                    <span className="text-[10px] font-sans font-medium opacity-70">left</span>

                    {/* +30s Emergency Extension */}
                    <button
                      onClick={() => setCountdownTargetSeconds(prev => prev + 30)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border transition-all cursor-pointer shadow-2xs ml-0.5 ${
                        isDeepFocus
                          ? 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                          : 'bg-white/80 hover:bg-white text-brand-charcoal border-brand-slate/20'
                      }`}
                      title="Add 30 seconds to countdown timer"
                    >
                      +30s
                    </button>
                  </div>
                ) : (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${
                    isDeepFocus
                      ? 'bg-white/10 border-white/15 text-white'
                      : 'bg-brand-sand/50 border-brand-slate/15 text-brand-charcoal'
                  }`}>
                    <Clock className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{formatTime(questionSeconds)}</span>
                    <span className="text-[10px] font-sans opacity-60">(Open-Ended)</span>
                  </div>
                )}

                {/* Hide secondary dropdowns in Deep Focus mode */}
                {!isDeepFocus && (
                  <>
                    {/* Target Countdown Dropdown */}
                    <select
                      value={countdownTargetSeconds}
                      onChange={(e) => setCountdownTargetSeconds(Number(e.target.value))}
                      className="px-2 py-1.5 rounded-xl bg-white border border-brand-slate/20 text-[10.5px] font-mono text-brand-slate cursor-pointer focus:outline-none"
                      title="Configure response countdown limit"
                    >
                      <option value={60}>⏱️ 60s Target</option>
                      <option value={90}>⏱️ 90s Target</option>
                      <option value={120}>⏱️ 2 Mins</option>
                      <option value={180}>⏱️ 3 Mins</option>
                      <option value={0}>♾️ No Limit</option>
                    </select>

                    {/* Real-time Auto-Save Live Badge & Manual Save Button */}
                    <button
                      onClick={triggerManualSave}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 text-[10.5px] font-mono font-bold shadow-2xs transition-all cursor-pointer"
                      title="Click to save session draft now or rely on background auto-save"
                    >
                      <Cloud className={`w-3.5 h-3.5 text-emerald-600 ${isAutoSaving ? 'animate-bounce' : ''}`} />
                      <span className="hidden sm:inline">{isAutoSaving ? 'Saving...' : lastAutoSavedTime ? `Saved ${lastAutoSavedTime}` : 'Saved'}</span>
                    </button>
                  </>
                )}

                {/* DEEP FOCUS TOGGLE BUTTON */}
                <button
                  onClick={() => {
                    setIsDeepFocus(!isDeepFocus);
                    audioEngine.playLoFiChord();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-2xs ${
                    isDeepFocus
                      ? 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 shadow-md ring-2 ring-purple-400/40'
                      : 'bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 hover:text-purple-950'
                  }`}
                  title={isDeepFocus ? "Exit Deep Focus (Esc)" : "Expand video feed to fill screen and hide distracting UI (Press F)"}
                >
                  {isDeepFocus ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-purple-200" />
                      <span>Exit Deep Focus (Esc)</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-purple-700" />
                      <span>Deep Focus</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                    isDeepFocus
                      ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                      : 'border-brand-slate/15 hover:bg-brand-sand text-brand-slate'
                  }`}
                  title={isPaused ? "Resume Interview" : "Pause Interview"}
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to end this mock interview early?')) {
                      finalizeInterview(attempts);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    isDeepFocus
                      ? 'bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30'
                      : 'bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white'
                  }`}
                >
                  End Session
                </button>
              </div>
            </div>

            {/* Main Video Stage: 2-Column Split View (EXPANDS IN DEEP FOCUS) */}
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch ${
                isDeepFocus ? 'flex-1 min-h-0 my-2' : ''
              }`}
            >
              {/* LEFT COLUMN: Candidate Live Video Feed + Real-Time Vision HUD */}
              <div
                className={`flex flex-col ${
                  isDeepFocus
                    ? 'h-[360px] lg:h-full min-h-[300px]'
                    : 'h-[380px] sm:h-[420px]'
                }`}
              >
                <CameraTrackerHUD
                  isInterviewActive={true}
                  onMetricsUpdate={(m) => setLiveMetrics(m)}
                  isUserSpeaking={isRecordingVoice || userAnswer.length > 5}
                />
              </div>

              {/* RIGHT COLUMN: AI Interviewer Video Avatar Studio & Live Audio Speech */}
              <div
                className={`rounded-3xl p-5 border shadow-2xl flex flex-col justify-between relative overflow-hidden text-white ${
                  isDeepFocus
                    ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border-purple-500/30 h-[360px] lg:h-full min-h-[300px]'
                    : 'bg-brand-charcoal border-white/10 min-h-[380px] sm:h-[420px]'
                }`}
              >
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Interviewer Profile Header */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={currentPersona.avatar}
                        alt={currentPersona.name}
                        className={`w-11 h-11 rounded-2xl object-cover border-2 shadow-md ${
                          interviewerStatus === 'Speaking' 
                            ? 'border-brand-amber ring-2 ring-brand-amber/60 animate-pulse' 
                            : 'border-white/20'
                        }`}
                      />
                      <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-brand-charcoal ${
                        interviewerStatus === 'Speaking' ? 'bg-brand-amber' : interviewerStatus === 'Listening' ? 'bg-emerald-400' : 'bg-purple-400'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display font-black text-xs text-white">
                          {currentPersona.name}
                        </h4>
                        <span className="text-[9px] font-mono text-white/50">• {currentPersona.company}</span>
                      </div>
                      <span className="text-[10px] font-mono text-brand-amber flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-ping" />
                        Status: {interviewerStatus}
                      </span>
                    </div>
                  </div>

                  {/* Speaker Replay Button */}
                  <button
                    onClick={() => {
                      if (isSpeakingAudio) stopSpeaking();
                      else speakText(interviewerSpeechText, currentPersona);
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSpeakingAudio 
                        ? 'bg-brand-amber/20 border-brand-amber text-brand-amber' 
                        : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
                    }`}
                    title={isSpeakingAudio ? "Mute Interviewer" : "Replay Question Audio"}
                  >
                    {isSpeakingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span className="text-[10px] font-mono hidden sm:inline">{isSpeakingAudio ? 'Speaking...' : 'Replay Voice'}</span>
                  </button>
                </div>

                {/* Center: Live Spoken Question Display */}
                <div className="relative z-10 my-auto py-3 space-y-3">
                  <div className="bg-white/[0.06] backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-inner">
                    <span className="text-[9.5px] font-mono uppercase font-bold text-brand-amber tracking-wider block mb-1">
                      Technical Question:
                    </span>
                    <p className={`font-display font-bold text-white leading-relaxed ${
                      isDeepFocus ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                    }`}>
                      {isUrduMode && currentQuestion.questionUrdu ? currentQuestion.questionUrdu : currentQuestion.question}
                    </p>

                    {/* Key expected concepts preview tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
                      <span className="text-[9px] font-mono text-white/40 uppercase font-bold mr-1">Focus Areas:</span>
                      {currentQuestion.keyConcepts.slice(0, 3).map((concept, idx) => (
                        <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-brand-amber">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* IN-BETWEEN CONVERSATIONAL INTERACTION BUBBLE (The AI bot acting in-between!) */}
                  <AnimatePresence>
                    {inBetweenMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-xs text-amber-200 shadow-xl flex items-start gap-2.5 backdrop-blur-md"
                      >
                        <Bot className="w-4 h-4 text-brand-amber shrink-0 mt-0.5 animate-bounce" />
                        <div>
                          <span className="text-[9px] font-mono uppercase font-black text-brand-amber block">
                            Interviewer Live In-Between Comment:
                          </span>
                          <p className="font-medium text-white/95 mt-0.5 leading-snug">
                            "{inBetweenMessage}"
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom In-Between Action Helpers */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={handleRequestHint}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-brand-amber" />
                    <span>{lang === 'en' ? "Request Hint" : "Hint Maangein"}</span>
                  </button>

                  <span className="text-[10px] font-mono text-white/50">
                    {isRecordingVoice ? '🎙️ Mic active - transcribing...' : 'Type or speak answer'}
                  </span>
                </div>
              </div>
            </div>

            {/* CANDIDATE ANSWER SUBMISSION BAR (Streamlined in Deep Focus) */}
            <div
              className={`rounded-3xl p-4 sm:p-5 border shadow-md space-y-3 ${
                isDeepFocus
                  ? 'bg-slate-900/90 border-white/15 text-white backdrop-blur-md'
                  : 'bg-white border-brand-slate/15 text-brand-charcoal'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className={`font-display font-bold text-xs flex items-center gap-1.5 ${
                    isDeepFocus ? 'text-white' : 'text-brand-charcoal'
                  }`}>
                    <MessageSquare className="w-4 h-4 text-brand-amber" />
                    {lang === 'en' ? "Your Spoken or Written Answer" : "Aapka Jawab"}
                  </h4>
                  <span className={`text-[10px] font-mono ${
                    isDeepFocus ? 'text-white/50' : 'text-brand-muted'
                  }`}>
                    ({userAnswer.trim().split(/\s+/).filter(Boolean).length} words)
                  </span>
                </div>

                {/* Code Scratchpad Toggle (only if needed or in standard mode) */}
                <button
                  onClick={() => setShowCodePad(!showCodePad)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    showCodePad 
                      ? isDeepFocus ? 'bg-purple-600 text-white' : 'bg-brand-charcoal text-white' 
                      : isDeepFocus ? 'bg-white/10 text-white/80 hover:bg-white/20' : 'bg-brand-sand/50 text-brand-slate hover:bg-brand-sand'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{showCodePad ? 'Hide Code Scratchpad' : 'Code Scratchpad'}</span>
                </button>
              </div>

              {/* Main Answer Text Area */}
              <div className="relative">
                <textarea
                  rows={isDeepFocus ? 2 : 3}
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    triggerInBetweenReaction(e.target.value);
                  }}
                  placeholder={lang === 'en' 
                    ? "Speak into your microphone or type your explanation here. The AI interviewer will analyze keywords, structure, and camera tracking..." 
                    : "Apna jawab bol kar ya type karke yahan likhein..."}
                  className={`w-full p-3.5 rounded-2xl text-xs font-medium focus:outline-none transition-colors leading-relaxed ${
                    isDeepFocus
                      ? 'bg-slate-950/80 border border-white/20 text-white placeholder:text-white/40 focus:border-purple-400'
                      : 'bg-brand-sand/20 border border-brand-slate/15 text-brand-charcoal placeholder-brand-muted/70 focus:border-brand-amber'
                  }`}
                />
              </div>

              {/* REAL-TIME LIVE SPEECH SENTIMENT & TONE ANALYSIS BAR */}
              {userAnswer.trim().length > 10 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2.5 sm:p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-2xs border ${
                    isDeepFocus
                      ? 'bg-white/[0.06] border-white/15 text-white'
                      : 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 border-blue-200/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold uppercase flex items-center gap-1 ${
                      isDeepFocus ? 'text-purple-300' : 'text-indigo-900'
                    }`}>
                      <Mic className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      <span>Live Speech Sentiment:</span>
                    </span>
                    
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      liveSentimentReport.sentimentLabel === 'Positive' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' :
                      liveSentimentReport.sentimentLabel === 'Constructive' ? 'bg-blue-500/20 text-blue-300 border-blue-400/40' :
                      'bg-slate-500/20 text-slate-300 border-slate-400/40'
                    }`}>
                      {liveSentimentReport.sentimentEmoji} {liveSentimentReport.sentimentLabel} Sentiment
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                      isDeepFocus
                        ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                        : 'bg-indigo-100 text-indigo-800 border-indigo-300'
                    }`}>
                      Tone: {liveSentimentReport.dominantTone}
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 font-mono text-[10px] ${
                    isDeepFocus ? 'text-white/70' : 'text-slate-600'
                  }`}>
                    <span>⚡ <strong className={isDeepFocus ? "text-white" : "text-slate-800"}>{liveSentimentReport.wordsPerMinute}</strong> WPM ({liveSentimentReport.paceCategory})</span>
                    <span>🎯 <strong className={isDeepFocus ? "text-white" : "text-slate-800"}>{liveSentimentReport.confidenceScore}%</strong> Confidence</span>
                    <span>🛑 <strong className={isDeepFocus ? "text-white" : "text-slate-800"}>{liveSentimentReport.fillerWordCount}</strong> Fillers</span>
                  </div>
                </motion.div>
              )}

              {/* Code scratchpad optional */}
              {showCodePad && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-brand-muted uppercase font-bold">
                    <span>Code / Architecture Diagram Scratchpad</span>
                    <CopyCodeButton text={userCode} label="Copy Code" variant="compact" />
                  </div>
                  <textarea
                    rows={3}
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="// Optional: paste Python/PyTorch snippet, Transformer pseudo-code, or RAG architecture flow..."
                    className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-2xl border border-slate-800 focus:outline-none focus:border-brand-amber"
                  />
                </div>
              )}

              {/* Control Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                {/* Voice Record Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={isRecordingVoice ? stopSpeechRecognition : startSpeechRecognition}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                      isRecordingVoice
                        ? 'bg-red-500 text-white animate-pulse shadow-red-500/40 ring-2 ring-red-400'
                        : isDeepFocus
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30'
                        : 'bg-brand-sand/70 text-brand-charcoal hover:bg-brand-sand'
                    }`}
                  >
                    {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isRecordingVoice ? 'Stop Recording' : 'Speak Answer (Mic)'}</span>
                  </button>

                  {isRecordingVoice && (
                    <span className="text-[10px] font-mono text-red-400 font-bold animate-pulse hidden sm:inline">
                      ● Recording live audio...
                    </span>
                  )}
                </div>

                {/* Next / Submit Button */}
                <button
                  onClick={handleNextQuestion}
                  disabled={isEvaluating}
                  className="px-6 py-2.5 bg-brand-amber hover:bg-brand-amber-dark disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isEvaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'en' ? "AI Evaluating Answer..." : "AI Jawab Check Kar Raha Hai..."}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {currentQuestionIndex < questions.length - 1 
                          ? (lang === 'en' ? "Submit & Next Question" : "Agla Sawal") 
                          : (lang === 'en' ? "Finish & View Scorecard" : "Scorecard Dekhein")}
                      </span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: COMPREHENSIVE AI EVALUATION SCORECARD */}
        {/* ========================================================================= */}
        {stage === 'scorecard' && completedRecord && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-left"
          >
            {/* Top Scorecard Header Banner */}
            <div className="bg-gradient-to-br from-brand-charcoal via-slate-900 to-brand-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-black uppercase tracking-wider mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mock Interview Completed • Verified AI Evaluation</span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                    {completedRecord.roleTrack}
                  </h2>
                  <p className="text-xs text-white/70 mt-1">
                    Evaluated by {completedRecord.interviewerName} • {completedRecord.dateStr} • Duration {formatTime(completedRecord.durationSeconds)}
                  </p>
                </div>

                {/* Big Overall Grade Badge */}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/15">
                  <div className="text-center">
                    <span className="text-[9px] font-mono uppercase font-bold text-brand-amber block">
                      Overall Score
                    </span>
                    <div className="text-4xl font-black text-white leading-tight font-display">
                      {completedRecord.overallScore}<span className="text-lg text-brand-amber">/100</span>
                    </div>
                  </div>

                  <div className="h-10 w-px bg-white/20" />

                  <div>
                    <span className="text-[9px] font-mono uppercase font-bold text-white/60 block">
                      Hiring Verdict
                    </span>
                    <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg inline-block mt-0.5 ${
                      completedRecord.hiringDecision === 'Strong Hire' ? 'bg-emerald-500 text-white' :
                      completedRecord.hiringDecision === 'Hire' ? 'bg-teal-500 text-white' :
                      completedRecord.hiringDecision === 'Leaning Hire' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {completedRecord.hiringDecision}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Radar & Breakdown Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-brand-amber mb-1">
                  <Brain className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">Technical Depth</span>
                </div>
                <div className="text-2xl font-black text-brand-charcoal font-display">
                  {completedRecord.technicalScore}%
                </div>
                <span className="text-[9px] text-brand-muted mt-0.5 block">Concept accuracy</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-purple-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">Communication</span>
                </div>
                <div className="text-2xl font-black text-brand-charcoal font-display">
                  {completedRecord.communicationScore}%
                </div>
                <span className="text-[9px] text-brand-muted mt-0.5 block">Structure & clarity</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">Eye Contact HUD</span>
                </div>
                <div className="text-2xl font-black text-brand-charcoal font-display">
                  {completedRecord.eyeContactScore}%
                </div>
                <span className="text-[9px] text-brand-muted mt-0.5 block">Camera presence</span>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-brand-slate/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-[9px] font-mono font-bold uppercase">Confidence</span>
                </div>
                <div className="text-2xl font-black text-brand-charcoal font-display">
                  {completedRecord.confidenceScore}%
                </div>
                <span className="text-[9px] text-brand-muted mt-0.5 block">Composure & pacing</span>
              </div>
            </div>

            {/* Recharts Performance Radar & Metrics Visualizer */}
            <InterviewPerformanceChart
              records={[completedRecord]}
              title={lang === 'en' ? "Session Performance Radar & Metrics" : "Session Performance Chart"}
              subtitle={lang === 'en' ? "Multi-axis breakdown of this mock interview session." : "Is session ka scorecard chart."}
            />

            {/* WEB SPEECH SENTIMENT, TONE & CONFIDENCE REPORT */}
            {completedRecord.speechSentimentReport && (
              <div className="bg-gradient-to-br from-indigo-900/90 via-slate-900 to-brand-charcoal text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-500/30 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase">
                          WEB SPEECH API ACOUSTIC & SENTIMENT REPORT
                        </span>
                        <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                          Live Audio Verified
                        </span>
                      </div>
                      <h3 className="font-display text-base font-black text-white">
                        Speech Sentiment, Tone & Articulation Summary
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                    <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-bold border border-white/15">
                      Dominant Tone: <span className="text-brand-amber">{completedRecord.speechSentimentReport.dominantTone}</span>
                    </span>
                  </div>
                </div>

                {/* Tone Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-200 block uppercase">Sentiment Polarity</span>
                    <div className="text-lg font-black text-white font-display flex items-center gap-1.5">
                      <span>{completedRecord.speechSentimentReport.sentimentEmoji}</span>
                      <span>{completedRecord.speechSentimentReport.sentimentLabel}</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/60 block">Polarity: {completedRecord.speechSentimentReport.sentimentScore.toFixed(2)}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-200 block uppercase">Speaking Pace</span>
                    <div className="text-lg font-black text-white font-display">
                      {completedRecord.speechSentimentReport.wordsPerMinute} <span className="text-xs font-mono text-brand-amber font-normal">WPM</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/60 block">{completedRecord.speechSentimentReport.paceCategory} (Target: 120-150)</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-200 block uppercase">Speech Confidence</span>
                    <div className="text-lg font-black text-emerald-400 font-display">
                      {completedRecord.speechSentimentReport.confidenceScore}%
                    </div>
                    <span className="text-[9px] font-mono text-white/60 block">Based on pace & hedging</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-200 block uppercase">Filler Words</span>
                    <div className="text-lg font-black text-amber-400 font-display">
                      {completedRecord.speechSentimentReport.fillerWordCount}
                    </div>
                    <span className="text-[9px] font-mono text-white/60 block">Rate: {completedRecord.speechSentimentReport.fillerWordPercentage}% of words</span>
                  </div>
                </div>

                {/* Tone Spectrum Progress Bars */}
                <div className="space-y-2 p-4 rounded-2xl bg-black/30 border border-white/10">
                  <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-wider block">
                    Observed Tone & Sentiment Distribution:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {Object.entries(completedRecord.speechSentimentReport.toneBreakdown).map(([toneKey, val]: [string, any]) => (
                      <div key={toneKey} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="capitalize text-white/90">{toneKey} Tone</span>
                          <span className="font-bold text-brand-amber">{val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-brand-amber rounded-full"
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speech Coaching Tips */}
                {completedRecord.speechSentimentReport.coachingTips.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 space-y-1.5 text-xs">
                    <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                      <span>Actionable Speech & Tone Coaching Tips:</span>
                    </span>
                    <ul className="space-y-1 text-white/90 text-[11px] list-disc list-inside">
                      {completedRecord.speechSentimentReport.coachingTips.map((tip: string, idx: number) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Strengths & Action Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3">
                <h3 className="font-display text-sm font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Strengths Observed
                </h3>
                <ul className="space-y-2 text-xs text-brand-charcoal">
                  {completedRecord.topStrengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-3">
                <h3 className="font-display text-sm font-bold text-amber-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-amber" />
                  High-Impact Improvement Areas
                </h3>
                <ul className="space-y-2 text-xs text-brand-charcoal">
                  {completedRecord.keyActionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-brand-amber font-bold">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Question-by-Question Deep Dive */}
            <div className="bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-4">
              <h3 className="font-display text-base font-bold text-brand-charcoal flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-brand-amber" />
                Question-by-Question Breakdown & Ideal Model Answers
              </h3>

              <div className="space-y-4">
                {completedRecord.attempts.map((att, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-brand-sand/20 border border-brand-slate/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase font-bold text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-full">
                        Question {idx + 1} • Score: {att.score}/100
                      </span>
                      <span className="text-[10px] font-mono text-brand-muted">
                        Answered in {formatTime(att.durationSeconds)}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-xs text-brand-charcoal">
                      {att.questionText}
                    </h4>

                    {/* Candidate Transcript */}
                    <div className="p-3 bg-white rounded-xl border border-brand-slate/10 text-xs">
                      <span className="font-mono text-[9px] text-brand-muted uppercase font-bold block mb-1">
                        Your Transcript / Answer:
                      </span>
                      <p className="text-brand-charcoal italic leading-relaxed">
                        "{att.userAnswer}"
                      </p>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-900">
                      <span className="font-mono text-[9px] text-amber-800 uppercase font-black block mb-0.5">
                        Interviewer Critique:
                      </span>
                      <p>{att.aiFeedback}</p>
                    </div>

                    {/* Ideal Model Answer with Copy */}
                    <div className="p-3 bg-slate-900 rounded-xl text-white text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-emerald-400 uppercase font-black">
                          Ideal Model Technical Answer:
                        </span>
                        <CopyCodeButton text={att.modelAnswer} label="Copy Answer" variant="compact" />
                      </div>
                      <p className="text-white/80 leading-relaxed font-sans text-[11px]">
                        {att.modelAnswer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Peer Review Feedback Card */}
            <div className="p-5 bg-gradient-to-r from-indigo-900/90 via-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase">
                        COMMUNITY PEER REVIEW & FEEDBACK
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[9px] font-mono font-bold">
                        Anonymous Peer Network
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-white">
                      Share Transcript Snippets for Peer Review
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasSharedToCommunity ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Shared to Community Feed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleShareToCommunity(completedRecord)}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Anonymously</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/[0.06] rounded-2xl border border-white/10 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-200 font-mono text-[10px] font-bold">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Included Topic Tags:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {(completedRecord.tags || completedRecord.topics || ['System Design', 'AI/ML']).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white/[0.06] rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-indigo-200 block uppercase">Privacy & Anonymity</span>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Posted as <strong>Anonymous Scholar</strong>. Camera HUD gaze stats and voice audio recordings are never shared.
                  </p>
                </div>
              </div>

              {!hasSharedToCommunity && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-indigo-200 block">
                    Peer Critique Focus Note:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCommunityFeedbackPrompt}
                      onChange={(e) => setCustomCommunityFeedbackPrompt(e.target.value)}
                      placeholder="e.g. Please critique my explanation of transformer self-attention and latency bottlenecks..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs placeholder:text-white/40 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                      onClick={() => handleShareToCommunity(completedRecord)}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Post to Feed
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reflection & Personal Notes Card Banner */}
            <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 rounded-2xl border border-brand-amber/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-amber text-white flex items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-brand-charcoal">
                    Personal Notes & Performance Reflection
                  </h4>
                  <p className="text-[11px] text-brand-slate">
                    {completedRecord.personalReflections ? 'Reflections recorded! Click to review or update.' : 'Record your key takeaways, self-rating, and focus areas for later review.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReflectionModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-charcoal text-white hover:bg-black text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-amber" />
                <span>{completedRecord.personalReflections ? 'Edit Reflection Notes' : 'Add Personal Reflection'}</span>
              </button>
            </div>

            {/* Bottom Actions: Retake, Go to Dashboard, Back to Guide */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
              <button
                onClick={() => setStage('setup')}
                className="px-5 py-2.5 rounded-2xl bg-white border border-brand-slate/15 hover:bg-brand-sand text-brand-charcoal text-xs font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brand-amber" />
                <span>Retake / Try Another Track</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onViewDashboard}
                  className="px-6 py-2.5 rounded-2xl bg-brand-amber hover:bg-brand-amber-dark text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>View in My Student Dashboard</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Pro Tips Sidebar for dynamic live interview guidance */}
      <InterviewProTipsSidebar
        stage={stage}
        currentQuestion={currentQuestion}
        currentPersona={currentPersona}
        liveMetrics={liveMetrics}
        isUserSpeaking={isRecordingVoice}
        questionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />

      {/* Post-Interview Reflection & Personal Notes Modal */}
      <PostInterviewReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        record={completedRecord}
        onSaveReflection={(recordId, reflectionData) => {
          setCompletedRecord(prev => prev ? {
            ...prev,
            personalReflections: reflectionData,
            personalNotes: reflectionData.generalNotes
          } : null);
        }}
      />

      {/* Real-Time Auto-Save Toast Notification */}
      <AnimatePresence>
        {communityShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-indigo-950/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-indigo-500/40 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display font-bold text-xs text-white">
                Community Peer Review
              </div>
              <p className="text-[11px] text-indigo-200">
                {communityShareToast}
              </p>
            </div>
            <button
              onClick={() => setCommunityShareToast(null)}
              className="ml-1 text-white/40 hover:text-white text-xs cursor-pointer p-1"
            >
              ✕
            </button>
          </motion.div>
        )}

        {saveToast && saveToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-4 py-3 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-emerald-500/40 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xs text-white">
                  {saveToast.isManual ? 'Interview Session Draft Saved' : 'Auto-Saved to Local Storage'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {saveToast.timeStr}
                </span>
              </div>
              <p className="text-[11px] text-white/70">
                Question {saveToast.questionNumber} of {saveToast.totalQuestions} progress preserved.
              </p>
            </div>
            <button
              onClick={() => setSaveToast(null)}
              className="ml-1 text-white/40 hover:text-white text-xs cursor-pointer p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Practice Reminders Modal */}
      <PracticeReminderModal 
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      />
    </section>
  );
}
