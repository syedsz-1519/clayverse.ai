import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Play, 
  ArrowLeft, 
  Award, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Shield, 
  Zap,
  Flame,
  Star,
  Timer,
  Trophy,
  BookOpen,
  Cpu,
  Database,
  Globe,
  Crown,
  User,
  Share2,
  History,
  Calendar,
  Eye,
  Search,
  X
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { quizModules, QuizModule, QuizSection, Question } from '../data/quizQuestions';
import { weeklyChallengeSection } from '../data/weeklyChallenge';
import { syncQuizProgressToCloud } from '../lib/firebase';
import ClayLogo from './ClayLogo';
import Confetti from './Confetti';
import Leaderboard from './Leaderboard';
import BadgeShareModal from './BadgeShareModal';
import ReadSectionButton from './ReadSectionButton';

// Browser Audio Synthesizer for Retro Game SFX
const playTone = (frequency: number, type: OscillatorType, duration: number, volume = 0.1) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio Context blocked or not supported
  }
};

const playCorrectSFX = () => {
  playTone(523.25, 'sine', 0.1, 0.12); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.15, 0.12), 80); // E5
  setTimeout(() => playTone(783.99, 'sine', 0.2, 0.15), 160); // G5
};

const playWrongSFX = () => {
  playTone(220, 'sawtooth', 0.25, 0.08); // A3 Low
  setTimeout(() => playTone(180, 'sawtooth', 0.3, 0.08), 100);
};

const playVictorySFX = () => {
  const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5]; // C scale ascending
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 'triangle', 0.15, 0.1);
    }, idx * 100);
  });
};

const playTickSFX = (urgent: boolean) => {
  playTone(urgent ? 1000 : 650, 'sine', 0.02, urgent ? 0.04 : 0.015);
};

const playAchievementSFX = () => {
  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major arpeggio
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 'sine', 0.25, 0.08);
    }, idx * 70);
  });
};

export default function AIArena() {
  const { lang } = useLanguage();
  const currentLang = lang === 'hyd' ? 'ur' : 'en';
  
  // Game state
  const [score, setScore] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeModule, setActiveModule] = useState<QuizModule | null>(null);
  const [activeSection, setActiveSection] = useState<QuizSection | null>(null);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'victory'>('lobby');
  
  // Active Question flow
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [runCorrectCount, setRunCorrectCount] = useState<number>(0);
  const [runPointsEarned, setRunPointsEarned] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<boolean[]>([]); // Track correct/incorrect for current 5 questions
  const [selectedAnswersLog, setSelectedAnswersLog] = useState<(number | null)[]>([]); // Track exact index selected for history
  const [timeLeft, setTimeLeft] = useState<number>(20); // 20s per question
  const [practiceMode, setPracticeMode] = useState<boolean>(() => {
    return localStorage.getItem('clay_quiz_practice_mode') === 'true';
  });

  const [sessionHistory, setSessionHistory] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('clay_quiz_sessions');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<any | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Daily Streak Tracker
  const [streakCount, setStreakCount] = useState<number>(() => {
    const cached = localStorage.getItem('clay_quiz_streak_count');
    return cached ? parseInt(cached, 10) : 0;
  });
  const [lastQuizDate, setLastQuizDate] = useState<string>(() => {
    return localStorage.getItem('clay_quiz_last_date') || '';
  });

  // Avatar Customization style (Aqua Synth, Amber Nova, Cosmic Amethyst, Emerald Neural)
  const [avatarStyle, setAvatarStyle] = useState<string>(() => {
    return localStorage.getItem('clay_quiz_avatar_style') || 'Aqua Synth';
  });

  // Session search query
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');

  const questionContainerRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  const togglePracticeMode = () => {
    const newVal = !practiceMode;
    setPracticeMode(newVal);
    localStorage.setItem('clay_quiz_practice_mode', String(newVal));
    if (soundEnabled) {
      playTone(newVal ? 580 : 380, 'triangle', 0.1, 0.05);
    }
    // Dispatch event to sync with Settings safely outside updater
    window.dispatchEvent(new Event('clay_practice_mode_changed'));
  };

  const selectedIdxRef = useRef<number | null>(null);
  useEffect(() => {
    selectedIdxRef.current = selectedIdx;
  }, [selectedIdx]);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [leaderboardName, setLeaderboardName] = useState<string>(() => {
    return localStorage.getItem('clay_leaderboard_username') || '';
  });
  const [sharingAchievement, setSharingAchievement] = useState<any | null>(null);

  // Load from local storage & register events for Firebase updates
  useEffect(() => {
    const handleSync = () => {
      const savedScore = localStorage.getItem('clay_quiz_score') || '0';
      const savedCompleted = localStorage.getItem('clay_quiz_completed') || '{}';
      const savedHighScores = localStorage.getItem('clay_quiz_high_scores') || '{}';
      const savedSessions = localStorage.getItem('clay_quiz_sessions') || '[]';
      const savedProfile = localStorage.getItem('clay_user_profile');
      const savedStreak = localStorage.getItem('clay_quiz_streak_count') || '0';
      const savedLastDate = localStorage.getItem('clay_quiz_last_date') || '';
      
      setScore(parseInt(savedScore, 10));
      setCompletedSections(JSON.parse(savedCompleted));
      setHighScores(JSON.parse(savedHighScores));
      setStreakCount(parseInt(savedStreak, 10));
      setLastQuizDate(savedLastDate);
      try {
        setSessionHistory(JSON.parse(savedSessions));
      } catch (_) {}

      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        setUserProfile(null);
      }
    };
    
    const handlePracticeModeEvent = () => {
      setPracticeMode(localStorage.getItem('clay_quiz_practice_mode') === 'true');
    };
    
    handleSync();
    window.addEventListener('clay_auth_state_changed', handleSync);
    window.addEventListener('clay_practice_mode_changed', handlePracticeModeEvent);
    return () => {
      window.removeEventListener('clay_auth_state_changed', handleSync);
      window.removeEventListener('clay_practice_mode_changed', handlePracticeModeEvent);
    };
  }, []);

  // Compute Rank Badge based on score
  const getRankBadge = () => {
    if (score >= 400) return { title: { en: "AGI Commander", ur: "AGI Sipahsalar" }, color: "bg-red-500/15 text-red-600 border-red-500/25" };
    if (score >= 250) return { title: { en: "Prompt Master", ur: "Prompt Ka Ustad" }, color: "bg-brand-amber/15 text-brand-amber border-brand-amber/25" };
    if (score >= 120) return { title: { en: "Transformer Expert", ur: "Transformer Mahir" }, color: "bg-purple-500/15 text-purple-600 border-purple-500/25" };
    if (score >= 50) return { title: { en: "Neural Apprentice", ur: "Neural Shagird" }, color: "bg-blue-500/15 text-blue-600 border-blue-500/25" };
    return { title: { en: "Silicon Novice", ur: "Shuruati Explorer" }, color: "bg-brand-slate/15 text-brand-slate border-brand-slate/25" };
  };

  const rank = getRankBadge();

  // Calculate mastery level for each module
  const getModuleMastery = (mod: QuizModule) => {
    const totalCount = mod.sections.length;
    const completedCount = mod.sections.filter(sec => completedSections[sec.id]).length;
    
    // Status name
    let levelName = { en: "Locked", ur: "Locked" };
    let color = "from-brand-slate/5 to-brand-slate/10 text-brand-muted border-brand-slate/10";
    let textGlow = "text-brand-muted/70";
    
    if (completedCount === 1) {
      levelName = { en: "Novice", ur: "Novice" };
      color = "from-amber-700/10 to-amber-600/5 text-amber-700 border-amber-600/20";
      textGlow = "text-amber-700/80";
    } else if (completedCount === 2) {
      levelName = { en: "Adept", ur: "Adept" };
      color = "from-slate-400/10 to-slate-300/5 text-slate-500 border-slate-400/20";
      textGlow = "text-slate-500";
    } else if (completedCount === 3) {
      levelName = { en: "Master", ur: "Master" };
      color = "from-yellow-500/10 to-amber-500/5 text-brand-amber border-brand-amber/30 shadow-sm";
      textGlow = "text-brand-amber animate-pulse font-bold";
    }
    
    return { completedCount, totalCount, levelName, color, textGlow };
  };

  const [lobbyTab, setLobbyTab] = useState<'modules' | 'achievements' | 'leaderboard' | 'history'>('modules');

  // Dynamic Achievements & Badge System
  const getAchievements = (
    completed = completedSections,
    scoresMap = highScores
  ) => {
    // 1. First Steps: Unlock 1 section
    const completedCount = Object.values(completed).filter(Boolean).length;
    
    // 2. High Scorer: score >= 10 on any section
    const scores = Object.values(scoresMap) as number[];
    const hasHighScore = scores.some(s => s >= 10);
    const maxScoreVal = scores.length > 0 ? Math.max(...scores) : 0;

    // 3. Perfect run: score 15 (all 5 correct) on any section
    const hasPerfectRun = scores.some(s => s >= 15);

    // 4. Module 1 Conqueror: Complete all 3 sections of Mod 1
    const m1Secs = ['intro', 'reg', 'cls'];
    const m1DoneCount = m1Secs.filter(id => completed[id]).length;
    
    // 5. Module 2 Conqueror: Complete all 3 sections of Mod 2
    const m2Secs = ['dt', 'pre', 'opt'];
    const m2DoneCount = m2Secs.filter(id => completed[id]).length;

    // 6. Module 3 Conqueror: Complete all 3 of Mod 3
    const m3Secs = ['over', 'regu', 'eval'];
    const m3DoneCount = m3Secs.filter(id => completed[id]).length;

    // 7. Speed Demon: high score of 15 (perfect) on any of Module 4 or 5 sections
    const advancedSecs = ['cnn', 'rnn', 'tf', 'prompt', 'rag', 'llm'];
    const advancedHighScores = advancedSecs.map(id => scoresMap[id] || 0);
    const hasAdvancedPerfect = advancedHighScores.some(s => s >= 15);

    // 8. Weekly Champion
    const hasWeeklyCompleted = Object.keys(completed).some(key => key.startsWith('weekly-challenge-') && completed[key]);

    // 9. Grandmaster of Silicon: Complete all 15 sections
    const totalSectionsCount = 15; // 5 modules * 3 sections

    return [
      {
        id: 'first_steps',
        title: { en: "First Steps", ur: "Pehla Qadam" },
        desc: { 
          en: "Complete your very first AI Arena quiz section to initialize your learning weights.", 
          ur: "Apna pehla AI Arena test pass karein aur seekhne ka aghaaz karein." 
        },
        icon: 'BookOpen',
        color: 'blue',
        unlocked: completedCount >= 1,
        currentProgress: completedCount >= 1 ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'high_scorer',
        title: { en: "High Scorer", ur: "Aala Karkardagi" },
        desc: { 
          en: "Achieve a score of 10 points or more on any individual quiz section.", 
          ur: "Kisi bhi test me 10 ya us se zyada points haasil karein." 
        },
        icon: 'Zap',
        color: 'pink',
        unlocked: hasHighScore,
        currentProgress: maxScoreVal >= 10 ? 10 : maxScoreVal,
        maxProgress: 10
      },
      {
        id: 'perfect_precision',
        title: { en: "Perfect Precision", ur: "Bemisaal Mahaarat" },
        desc: { 
          en: "Get a perfect score of 15 points (5/5 correct answers) in any section.", 
          ur: "Kisi bhi aik section me mukammal 15 points (5/5 sahi jawab) haasil karein." 
        },
        icon: 'Award',
        color: 'yellow',
        unlocked: hasPerfectRun,
        currentProgress: hasPerfectRun ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'weekly_champion',
        title: { en: "Weekly Champion", ur: "Haftawar Fateh" },
        desc: { 
          en: "Successfully complete a Weekly Challenge quiz module to earn a rare badge and bonus XP.", 
          ur: "Rare badge aur bonus XP haasil karne ke liye Haftawar Challenge mukammal karein." 
        },
        icon: 'Crown',
        color: 'yellow',
        unlocked: hasWeeklyCompleted,
        currentProgress: hasWeeklyCompleted ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'mod1_conqueror',
        title: { en: "Module 1 Conqueror", ur: "Module 1 Fateh" },
        desc: { 
          en: "Unlock and complete all 3 core quiz sections in Module 1: Foundations of ML.", 
          ur: "Module 1 Foundations of ML ke tamam 3 sections ko kamyabi se mukammal karein." 
        },
        icon: 'Cpu',
        color: 'green',
        unlocked: m1DoneCount === 3,
        currentProgress: m1DoneCount,
        maxProgress: 3
      },
      {
        id: 'mod2_conqueror',
        title: { en: "Module 2 Conqueror", ur: "Module 2 Fateh" },
        desc: { 
          en: "Complete all 3 core sections of Module 2: Data Engineering & Preprocessing.", 
          ur: "Module 2 Data Engineering & Preprocessing ke tamam 3 sections clear karein." 
        },
        icon: 'Database',
        color: 'purple',
        unlocked: m2DoneCount === 3,
        currentProgress: m2DoneCount,
        maxProgress: 3
      },
      {
        id: 'mod3_conqueror',
        title: { en: "Module 3 Conqueror", ur: "Module 3 Fateh" },
        desc: { 
          en: "Complete all 3 core sections of Module 3: Model Tuning & Evaluation.", 
          ur: "Module 3 Model Tuning & Evaluation ke tamam 3 sections clear karein." 
        },
        icon: 'Globe',
        color: 'indigo',
        unlocked: m3DoneCount === 3,
        currentProgress: m3DoneCount,
        maxProgress: 3
      },
      {
        id: 'deep_learner',
        title: { en: "Deep Learner", ur: "Gehra Seekhne Wala" },
        desc: { 
          en: "Achieve a perfect high score of 15 points in any advanced neural network or LLM section (Modules 4 or 5).", 
          ur: "Module 4 ya 5 ke kisi advanced neural network ya LLM test me 15 points haasil karein." 
        },
        icon: 'Trophy',
        color: 'red',
        unlocked: hasAdvancedPerfect,
        currentProgress: hasAdvancedPerfect ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'grandmaster',
        title: { en: "Grandmaster of Silicon", ur: "Silicon Grandmaster" },
        desc: { 
          en: "Conquer all 15 quiz sections in the AI Arena with passing scores to achieve legendary status.", 
          ur: "AI Arena ke tamam 15 sections ko kamyabi se pass kar ke legendary rutba haasil karein." 
        },
        icon: 'Sparkles',
        color: 'yellow',
        unlocked: completedCount === totalSectionsCount,
        currentProgress: completedCount,
        maxProgress: totalSectionsCount
      }
    ];
  };

  const achievements = getAchievements();

  // Locked states logic: Module X is unlocked if Module X-1 has at least 1 section completed (or all, let's say at least 1 completed to keep it engaging yet guided!)
  const isModuleLocked = (mod: QuizModule) => {
    if (mod.number === 1) return false;
    const prevMod = quizModules.find(m => m.number === mod.number - 1);
    if (!prevMod) return false;
    
    // Check if any section in previous module is marked completed
    return !prevMod.sections.some(sec => completedSections[sec.id]);
  };

  // Handle Timeout when countdown runs out
  const handleTimeout = () => {
    if (isAnswerChecked || !activeSection) return;
    const currentSelected = selectedIdxRef.current;
    
    const question = activeSection.questions[currentQuestionIdx];
    const correct = currentSelected !== null && currentSelected === question.answerIndex;
    
    setIsAnswerChecked(true);
    setAnswersLog(prev => [...prev, correct]);
    setSelectedAnswersLog(prev => [...prev, currentSelected]);
    
    if (correct) {
      setRunCorrectCount(p => p + 1);
      setRunPointsEarned(p => p + question.points);
      if (soundEnabled) playCorrectSFX();
    } else {
      if (soundEnabled) playWrongSFX();
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (gameState !== 'playing' || isAnswerChecked || !activeSection || practiceMode) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        if (soundEnabled) playTickSFX(prev - 1 <= 5);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isAnswerChecked, currentQuestionIdx, activeSection, soundEnabled, practiceMode]);

  // Reset timer on question change
  useEffect(() => {
    if (gameState === 'playing') {
      setTimeLeft(20);
    }
  }, [gameState, currentQuestionIdx]);

  // Keyboard navigation support for accessibility and speed
  useEffect(() => {
    if (gameState !== 'playing' || !activeSection) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in some input or search box (e.g. within active element)
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }

      const key = e.key;

      // Map '1'-'4' to option indices
      if (['1', '2', '3', '4'].includes(key)) {
        const optionIdx = parseInt(key, 10) - 1;
        if (!isAnswerChecked) {
          handleOptionClick(optionIdx);
        }
      } 
      // Map 'a'-'d' / 'A'-'D' to option indices
      else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(key)) {
        const optionIdx = key.toLowerCase().charCodeAt(0) - 97; // 'a' is 97
        if (optionIdx >= 0 && optionIdx <= 3 && !isAnswerChecked) {
          handleOptionClick(optionIdx);
        }
      } 
      // Map 'Enter' to verify or next
      else if (key === 'Enter') {
        e.preventDefault();
        if (!isAnswerChecked) {
          if (selectedIdx !== null) {
            handleVerifyAnswer();
          }
        } else {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, activeSection, isAnswerChecked, selectedIdx, currentQuestionIdx]);

  // Launch quiz run
  const handleStartSectionQuiz = (section: QuizSection) => {
    setActiveSection(section);
    setCurrentQuestionIdx(0);
    setSelectedIdx(null);
    setIsAnswerChecked(false);
    setRunCorrectCount(0);
    setRunPointsEarned(0);
    setAnswersLog([]);
    setSelectedAnswersLog([]);
    setGameState('playing');
    
    if (soundEnabled) playTone(440, 'sine', 0.1, 0.05);
  };

  const handleOptionClick = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedIdx(idx);
    if (soundEnabled) playTone(350, 'sine', 0.05, 0.05);
  };

  const handleVerifyAnswer = () => {
    if (selectedIdx === null || isAnswerChecked || !activeSection) return;
    
    const question = activeSection.questions[currentQuestionIdx];
    const correct = selectedIdx === question.answerIndex;
    
    setIsAnswerChecked(true);
    setAnswersLog(prev => [...prev, correct]);
    setSelectedAnswersLog(prev => [...prev, selectedIdx]);
    
    if (correct) {
      setRunCorrectCount(p => p + 1);
      setRunPointsEarned(p => p + question.points);
      if (soundEnabled) playCorrectSFX();
    } else {
      if (soundEnabled) playWrongSFX();
    }
  };

  const handleNextQuestion = () => {
    if (!activeSection) return;
    
    if (currentQuestionIdx < activeSection.questions.length - 1) {
      setCurrentQuestionIdx(p => p + 1);
      setSelectedIdx(null);
      setIsAnswerChecked(false);
    } else {
      // Completed last question of the 5-MCQ batch! Let's trigger Victory
      handleCompleteSectionRun();
    }
  };

  const handleCompleteSectionRun = async () => {
    if (!activeSection) return;
    
    // Ensure final logs are complete
    let finalAnswersLog = [...answersLog];
    let finalSelectedLog = [...selectedAnswersLog];
    if (finalAnswersLog.length < activeSection.questions.length) {
      const question = activeSection.questions[currentQuestionIdx];
      const correct = selectedIdx !== null && selectedIdx === question.answerIndex;
      finalAnswersLog.push(correct);
      finalSelectedLog.push(selectedIdx);
    }
    
    // Daily Streak Tracker calculation
    const todayStr = new Date().toLocaleDateString('en-CA'); // "YYYY-MM-DD"
    let newStreak = streakCount;
    if (!lastQuizDate) {
      newStreak = 1;
    } else if (lastQuizDate === todayStr) {
      // Already did a quiz today, streak remains unchanged
    } else {
      const lastDate = new Date(lastQuizDate);
      const todayDate = new Date(todayStr);
      const msPerDay = 24 * 60 * 60 * 1000;
      const lastUtc = Date.UTC(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      const todayUtc = Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
      const diffDays = Math.round((todayUtc - lastUtc) / msPerDay);
      if (diffDays === 1) {
        newStreak = streakCount + 1;
      } else {
        newStreak = 1;
      }
    }

    setStreakCount(newStreak);
    setLastQuizDate(todayStr);
    localStorage.setItem('clay_quiz_streak_count', newStreak.toString());
    localStorage.setItem('clay_quiz_last_date', todayStr);

    const multiplier = 1 + Math.min((newStreak - 1) * 0.1, 0.5);
    const finalPointsWithMultiplier = Math.round(runPointsEarned * multiplier);

    const newSessionItem = {
      id: `session-${Date.now()}`,
      sectionId: activeSection.id,
      sectionTitle: {
        en: activeSection.title.en,
        ur: activeSection.title.ur
      },
      timestamp: new Date().toISOString(),
      practiceMode,
      scoreEarned: finalPointsWithMultiplier,
      correctCount: runCorrectCount,
      totalCount: activeSection.questions.length,
      streakApplied: newStreak,
      multiplierApplied: multiplier,
      questions: activeSection.questions.map((q, qIdx) => ({
        question: {
          en: q.text?.en || (q as any).question?.en || '',
          ur: q.text?.ur || (q as any).question?.ur || ''
        },
        options: {
          en: q.options?.en || [],
          ur: q.options?.ur || []
        },
        answerIndex: q.answerIndex,
        explanation: {
          en: q.explanation?.en || '',
          ur: q.explanation?.ur || ''
        },
        userAnswerIndex: finalSelectedLog[qIdx] !== undefined ? finalSelectedLog[qIdx] : null,
        isCorrect: finalAnswersLog[qIdx] !== undefined ? finalAnswersLog[qIdx] : false,
      }))
    };

    const updatedSessions = [newSessionItem, ...sessionHistory].slice(0, 50);
    setSessionHistory(updatedSessions);
    localStorage.setItem('clay_quiz_sessions', JSON.stringify(updatedSessions));

    if (practiceMode) {
      // In practice mode, we do NOT save score, completed state, or sync to Firebase
      setGameState('victory');
      if (soundEnabled) playVictorySFX();
      return;
    }
    
    const prevHighScore = highScores[activeSection.id] || 0;
    const isNewHigh = finalPointsWithMultiplier > prevHighScore;
    
    // Calculate new high score and global score delta
    const scoreDiff = isNewHigh ? (finalPointsWithMultiplier - prevHighScore) : 0;
    const updatedGlobalScore = score + scoreDiff;
    
    const updatedCompleted = { ...completedSections, [activeSection.id]: true };
    const updatedHighScores = { ...highScores, [activeSection.id]: Math.max(prevHighScore, finalPointsWithMultiplier) };
    
    // Write state
    setScore(updatedGlobalScore);
    setCompletedSections(updatedCompleted);
    setHighScores(updatedHighScores);

    // Check achievements
    const prevAchievements = getAchievements(completedSections, highScores);
    const prevUnlockedIds = new Set(prevAchievements.filter(a => a.unlocked).map(a => a.id));
    const nextAchievements = getAchievements(updatedCompleted, updatedHighScores);
    const newlyUnlocked = nextAchievements.filter(a => a.unlocked && !prevUnlockedIds.has(a.id));

    if (newlyUnlocked.length > 0) {
      setNewlyUnlockedAchievement(newlyUnlocked[0]);
      if (soundEnabled) playAchievementSFX();
    } else {
      if (soundEnabled) playVictorySFX();
    }

    setGameState('victory');
    
    // Sync back to Firebase Cloud
    await syncQuizProgressToCloud(updatedGlobalScore, updatedCompleted, updatedHighScores, updatedSessions, newStreak, todayStr);
  };

  const handleExitToLobby = () => {
    setGameState('lobby');
    setActiveSection(null);
  };

  // Reset progress confirmation
  const handleResetProgress = async () => {
    if (window.confirm(lang === 'en' ? "Are you sure you want to reset your AI Arena high scores, points, and sessions to 0?" : "Kya aap such me apne saare points, high scores aur sabaq records reset karna chahte hain?")) {
      setScore(0);
      setCompletedSections({});
      setHighScores({});
      setSessionHistory([]);
      setStreakCount(0);
      setLastQuizDate('');
      setGameState('lobby');
      setActiveSection(null);
      
      localStorage.setItem('clay_quiz_streak_count', '0');
      localStorage.setItem('clay_quiz_last_date', '');
      await syncQuizProgressToCloud(0, {}, {}, [], 0, '');
    }
  };

  // Clay's Commentary based on current status
  const getClayCommentary = () => {
    if (gameState === 'playing') {
      if (isAnswerChecked) {
        const correct = selectedIdx === activeSection?.questions[currentQuestionIdx].answerIndex;
        if (correct) {
          return lang === 'en' 
            ? "Excellent! Your neural pathways are fully matching mine." 
            : "Zabardast! Aapke dimaag ke patterns bilkul mujhse match ho rahe hain.";
        } else {
          return lang === 'en' 
            ? "Ah! Don't fret. Learning involves updating weights through error backpropagation." 
            : "Koi baat nahi! Galti hi machine ko behtar seekhne me madad karti hai.";
        }
      }
      if (timeLeft <= 5) {
        return lang === 'en'
          ? "Hurry! The countdown is running low! Confirm your selection now."
          : "Jaldi karein! Waqt khatam ho raha hai! Apne option ko confirm karein.";
      }
      return lang === 'en' 
        ? `Tackling Question ${currentQuestionIdx + 1} of 5. Read all 4 options closely!` 
        : `Sawaal number ${currentQuestionIdx + 1} samne hai. Charo options ko dhyan se parhein!`;
    }

    if (lobbyTab === 'achievements') {
      const unlockedCount = achievements.filter(a => a.unlocked).length;
      if (unlockedCount === 0) {
        return lang === 'en'
          ? "No badges unlocked yet! Begin with Module 1, Section 1 to earn your first AI Initiate medal!"
          : "Abhi tak koi badge unlock nahi hua! Apna pehla badge haasil karne ke liye Module 1, Section 1 se shuru karein!";
      }
      if (unlockedCount === 8) {
        return lang === 'en'
          ? "Spectacular! You have unlocked every single achievement in the database! Legendary status."
          : "Behtareen! Aapne database ka har aik badge unlock kar liya hai! Aap aik tareekhi legend hain.";
      }
      return lang === 'en'
        ? `You have unlocked ${unlockedCount} of 8 achievements. Keep crushing quizzes to claim them all!`
        : `Aapne 8 mein se ${unlockedCount} badges unlock kiye hain. Saare badges haasil karne ke liye koshish jaari rakhein!`;
    }

    if (lobbyTab === 'leaderboard') {
      if (score === 0) {
        return lang === 'en'
          ? "You are currently at the bottom of the ladder! Complete some modules to climb the rankings!"
          : "Aap abhi rankings me sabse neeche hain! Rank badhane ke liye tests clear karein!";
      }
      if (score >= 450) {
        return lang === 'en'
          ? "Amazing! You have surpassed Alan Turing and claimed the absolute peak of the AI Arena!"
          : "Kamal kar diya! Aapne Alan Turing ko bhi peeche chor kar AI Arena ki choti fatah kar li!";
      }
      return lang === 'en'
        ? `You have compiled ${score} XP. Keep completing modules to overtake your competitors!`
        : `Aapke paas ${score} XP hain. Apne muqablay baazo se aage nikalne ke liye tests clear karte rahein!`;
    }

    if (score === 0) {
      return lang === 'en'
        ? "Welcome to the AI Arena! Unlock modules sequentially by answering my topic-wise MCQs."
        : "AI Arena me aapka khush-amdeed! Ek-ek kar ke modules ke test pass karein aur points kamayein.";
    }
    
    if (score >= 400) {
      return lang === 'en'
        ? "Incredible! You have reached AGI Commander rank! I bow down to your silicon intelligence."
        : "MashaAllah! Aap AGI Commander ban chuke hain! Ab aapka dimaag computer se bhi tez hai.";
    }

    return lang === 'en'
      ? `Great job so far! You've gathered ${score} points. Can you reach the Hard Module 5 and unlock AGI level?`
      : `Boht khoob! Aapke paas ${score} points hain. Kya aap aakhri mushkil Module 5 ko unlock kar sakte hain?`;
  };

  return (
    <div id="ai-arena" className="max-w-5xl mx-auto my-16 px-6 relative text-left scroll-mt-24">
      {/* Visual background decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-brand-amber/5 rounded-full blur-3xl -ml-20 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl -mr-20 pointer-events-none" />

      {/* Main Container HUD Frame */}
      <div className="bg-white border border-brand-slate/15 rounded-3xl shadow-xl overflow-hidden relative backdrop-blur-xs">
        
        {/* Arena Navigation & Control Header */}
        <div className="bg-brand-charcoal text-brand-cream p-5 md:px-8 border-b border-brand-slate/15 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3.5 select-none text-left">
            <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 border border-brand-amber/35 flex items-center justify-center text-brand-amber shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] font-mono uppercase font-black text-brand-amber tracking-wider">
                {lang === 'en' ? "TACTILE GAMIFIED HORIZON" : "GAMIFIED LEARNING PORTAL"}
              </span>
              <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-tight">
                AI Arena
              </h2>
            </div>
          </div>

          {/* Sound, Reset & Points HUD */}
          <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
            <ReadSectionButton sectionId="ai-arena" variant="compact" />

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
              title={soundEnabled ? "Mute audio" : "Unmute audio"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-amber" /> : <VolumeX className="w-4 h-4 text-brand-slate" />}
            </button>
            
            <button
              onClick={handleResetProgress}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white/70 hover:text-white cursor-pointer"
              title="Reset Arena Progress"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-brand-amber text-brand-charcoal rounded-xl border border-brand-amber/25 font-mono font-bold text-sm">
              <Star className="w-4 h-4 fill-current text-brand-charcoal" />
              <span>{score} PTS</span>
            </div>
          </div>
        </div>

        {/* Dynamic Coach: Clay Commentary HUD */}
        <div className="bg-brand-sand/40 border-b border-brand-slate/10 px-6 py-4 flex items-start gap-4 text-left select-none">
          <div className="shrink-0 pt-0.5">
            <ClayLogo size={36} />
          </div>
          <div className="flex-1 space-y-1">
            <span className="block text-[9px] font-mono uppercase font-extrabold text-brand-slate/60 tracking-wider">
              CLAY THE HOST • COMMENTS
            </span>
            <p className="text-xs md:text-sm font-semibold text-brand-charcoal leading-relaxed">
              "{getClayCommentary()}"
            </p>
          </div>
        </div>

        {/* VIEW 1: LOBBY & MODULE SELECTION */}
        <AnimatePresence mode="wait">
          {gameState === 'lobby' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8 space-y-8 text-left"
            >
              {/* Profile Card & Global Rank Indicator */}
              <div className="p-6 bg-brand-sand/15 border border-brand-slate/10 rounded-2xl flex flex-col lg:flex-row justify-between items-stretch gap-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Left Panel: Custom Avatar and Profile Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Dynamic Glowing Avatar Container */}
                  <div className="relative shrink-0 select-none group">
                    <div className={`absolute -inset-1 rounded-full blur-md opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse bg-gradient-to-r ${
                      avatarStyle === 'Aqua Synth' ? 'from-cyan-400 via-teal-400 to-blue-500' :
                      avatarStyle === 'Amber Nova' ? 'from-amber-400 via-orange-400 to-red-500' :
                      avatarStyle === 'Cosmic Amethyst' ? 'from-purple-400 via-fuchsia-400 to-indigo-600' :
                      'from-emerald-400 via-green-400 to-teal-500'
                    }`} />
                    <div className="relative w-20 h-20 rounded-full bg-brand-charcoal flex items-center justify-center border-2 border-brand-sand shadow-inner overflow-hidden">
                      <div className={`absolute inset-0 opacity-25 bg-gradient-to-tr ${
                        avatarStyle === 'Aqua Synth' ? 'from-cyan-500 to-blue-600' :
                        avatarStyle === 'Amber Nova' ? 'from-amber-400 to-orange-600' :
                        avatarStyle === 'Cosmic Amethyst' ? 'from-purple-500 to-indigo-600' :
                        'from-emerald-400 to-teal-600'
                      }`} />
                      <Cpu className={`w-10 h-10 relative z-10 text-white ${
                        avatarStyle === 'Aqua Synth' ? 'text-cyan-200' :
                        avatarStyle === 'Amber Nova' ? 'text-amber-200' :
                        avatarStyle === 'Cosmic Amethyst' ? 'text-purple-200' :
                        'text-emerald-200'
                      }`} />
                    </div>
                    {/* Level number overlay badge */}
                    <div className="absolute -bottom-1 -right-1 bg-brand-amber text-brand-charcoal font-mono font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-brand-sand shadow-sm">
                      {Math.floor(score / 50) + 1}
                    </div>
                  </div>

                  {/* Identity and Streak status */}
                  <div className="text-center sm:text-left space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-sm font-bold text-brand-charcoal">
                        {leaderboardName ? leaderboardName : (lang === 'en' ? "AI Combatant" : "AI Mujahid")}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${rank.color}`}>
                        {lang === 'en' ? rank.title.en : rank.title.ur}
                      </span>
                    </div>

                    {/* Streak HUD */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-brand-muted select-none">
                      <div className="flex items-center gap-1.5 bg-brand-amber/10 border border-brand-amber/20 px-2 py-0.5 rounded-full text-brand-charcoal font-mono font-bold">
                        <Flame className="w-3.5 h-3.5 fill-current text-brand-amber animate-bounce" />
                        <span>{streakCount} {lang === 'en' ? "Day Streak" : "Rooz Streak"}</span>
                      </div>
                      <span className="font-mono text-brand-amber font-bold">
                        ({(1 + Math.min((streakCount - 1) * 0.1, 0.5)).toFixed(1)}x {lang === 'en' ? "Multiplier" : "Multiplier"})
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const styles = ['Aqua Synth', 'Amber Nova', 'Cosmic Amethyst', 'Emerald Neural'];
                        const nextIdx = (styles.indexOf(avatarStyle) + 1) % styles.length;
                        const nextStyle = styles[nextIdx];
                        setAvatarStyle(nextStyle);
                        localStorage.setItem('clay_quiz_avatar_style', nextStyle);
                        if (soundEnabled) playTone(500 + nextIdx * 100, 'sine', 0.08, 0.08);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-brand-amber hover:text-brand-charcoal bg-brand-sand/50 hover:bg-brand-sand px-2 py-1 rounded-md border border-brand-slate/10 cursor-pointer uppercase transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-brand-amber" />
                      <span>{lang === 'en' ? `Style: ${avatarStyle}` : `Design: ${avatarStyle}`}</span>
                    </button>
                  </div>
                </div>

                {/* Right Panel: Evolving Module Mastery Badges */}
                <div className="border-t lg:border-t-0 lg:border-l border-brand-slate/15 pt-5 lg:pt-0 lg:pl-6 flex flex-col justify-center space-y-3 flex-1 lg:max-w-md">
                  <span className="block text-[10px] font-mono uppercase text-brand-muted font-extrabold text-center lg:text-left select-none tracking-widest">
                    {lang === 'en' ? "EVOLVING MODULE MASTERY BADGES" : "EVOLVING MODULE KI MAHAARAT"}
                  </span>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {quizModules.slice(0, 5).map((mod, mIdx) => {
                      const mastery = getModuleMastery(mod);
                      return (
                        <div 
                          key={mod.id} 
                          className="flex flex-col items-center group relative cursor-help select-none"
                          title={`${mod.title.en}: ${mastery.completedCount}/${mastery.totalCount} ${lang === 'en' ? "completed" : "mukammal"}`}
                        >
                          {/* Circle badge */}
                          <div className={`w-10 h-10 rounded-full border bg-gradient-to-br flex items-center justify-center transition-all duration-300 ${mastery.color} ${
                            mastery.completedCount > 0 ? 'scale-105 shadow-md' : 'opacity-40 scale-95'
                          }`}>
                            <span className="text-[10px] font-mono font-black">
                              M{mIdx + 1}
                            </span>
                          </div>
                          
                          {/* Miniature Stars representing progress level */}
                          <div className="flex justify-center gap-0.5 mt-1.5 h-2">
                            {Array.from({ length: 3 }).map((_, sIdx) => (
                              <div 
                                key={sIdx} 
                                className={`w-1.5 h-1.5 rounded-full ${
                                  sIdx < mastery.completedCount 
                                    ? 'bg-brand-amber shadow shadow-brand-amber/30' 
                                    : 'bg-brand-slate/20'
                                }`} 
                              />
                            ))}
                          </div>
                          
                          {/* Micro indicator label */}
                          <span className={`text-[8px] font-mono font-black mt-1 ${mastery.textGlow}`}>
                            {lang === 'en' ? mastery.levelName.en : mastery.levelName.ur}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tab Selector: Modules vs Achievements */}
              <div className="flex border-b border-brand-slate/15 pb-1">
                <button
                  onClick={() => {
                    setLobbyTab('modules');
                    if (soundEnabled) playTone(550, 'sine', 0.05, 0.05);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 font-display font-bold text-sm tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                    lobbyTab === 'modules'
                      ? 'border-brand-amber text-brand-charcoal'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <Shield className="w-4 h-4 text-brand-amber" />
                  <span>{lang === 'en' ? "Quiz Modules" : "Sawaalat Modules"}</span>
                </button>
                <button
                  onClick={() => {
                    setLobbyTab('achievements');
                    if (soundEnabled) playTone(650, 'sine', 0.05, 0.05);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 font-display font-bold text-sm tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                    lobbyTab === 'achievements'
                      ? 'border-brand-amber text-brand-charcoal'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-brand-amber" />
                  <span>{lang === 'en' ? "Achievements & Badges" : "Kamyabiyan aur Badges"}</span>
                  <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-charcoal font-mono font-bold">
                    {achievements.filter(a => a.unlocked).length}/9
                  </span>
                </button>
                <button
                  onClick={() => {
                    setLobbyTab('leaderboard');
                    if (soundEnabled) playTone(750, 'sine', 0.05, 0.05);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 font-display font-bold text-sm tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                    lobbyTab === 'leaderboard'
                      ? 'border-brand-amber text-brand-charcoal'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <Crown className="w-4 h-4 text-brand-amber" />
                  <span>{lang === 'en' ? "Global Leaderboard" : "Aalmi Rankings"}</span>
                </button>
                <button
                  onClick={() => {
                    setLobbyTab('history');
                    if (soundEnabled) playTone(850, 'sine', 0.05, 0.05);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 font-display font-bold text-sm tracking-tight border-b-2 transition-all duration-200 cursor-pointer ${
                    lobbyTab === 'history'
                      ? 'border-brand-amber text-brand-charcoal'
                      : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                  }`}
                >
                  <History className="w-4 h-4 text-brand-amber" />
                  <span>{lang === 'en' ? "Session History" : "Sabaq Records"}</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {lobbyTab === 'modules' ? (
                  <motion.div
                    key="modules-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Practice Mode Toggle Banner */}
                    <div className="p-4 md:p-5 bg-gradient-to-r from-brand-sand/45 via-brand-sand/30 to-brand-amber/5 border border-brand-slate/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl transition-colors duration-200 ${practiceMode ? 'bg-green-500/10 text-green-600' : 'bg-brand-sand text-brand-muted'}`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-sans font-bold text-sm text-brand-charcoal flex flex-wrap items-center gap-2">
                            <span>{lang === 'en' ? "Practice Mode" : "Practice Mode"}</span>
                            {practiceMode && (
                              <span className="text-[9px] font-mono font-black bg-green-500/15 text-green-700 px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-wider animate-pulse">
                                {lang === 'en' ? "ACTIVE (No Timer)" : "CHALU HAI (Bina Timer)"}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-brand-muted max-w-xl leading-relaxed">
                            {lang === 'en' 
                              ? "Removes the countdown timer from quiz sessions, allowing you to learn the material without pressure. Progress & high scores are not recorded in this mode."
                              : "Quiz sessions se countdown timer ko khatam karta hai taake aap bina kisi dhabao ke seekh sakein. Is mode me progress save nahi hoti."}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={togglePracticeMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer self-end sm:self-auto shrink-0 ${
                          practiceMode ? 'bg-green-500' : 'bg-brand-slate/20'
                        }`}
                        title={lang === 'en' ? "Toggle Practice Mode" : "Practice Mode On/Off Karein"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            practiceMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Weekly Challenge Quiz Module Card */}
                    <div className="p-5 md:p-6 bg-gradient-to-br from-brand-charcoal to-neutral-900 text-brand-cream border border-brand-charcoal/20 rounded-2xl relative overflow-hidden shadow-lg select-none">
                      {/* Animated decorative circles */}
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-brand-amber/15 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute left-1/3 top-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative z-10">
                        <div className="space-y-2 max-w-xl text-left">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-amber/15 border border-brand-amber/35 rounded-full text-[9px] font-mono font-black text-brand-amber uppercase tracking-wider">
                            <Crown className="w-3 h-3 text-brand-amber animate-pulse" />
                            <span>{lang === 'en' ? "ACTIVE WEEKLY CHALLENGE" : "IS HAFTE KA KHAS TEST"}</span>
                          </span>
                          <h3 className="font-display text-xl md:text-2xl font-extrabold tracking-tight">
                            {lang === 'en' ? weeklyChallengeSection.title.en : weeklyChallengeSection.title.ur}
                          </h3>
                          <p className="text-xs text-brand-cream/80 leading-relaxed">
                            {lang === 'en' ? weeklyChallengeSection.subtitle.en : weeklyChallengeSection.subtitle.ur}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 pt-1.5 text-[11px] font-mono font-bold text-brand-cream/70">
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-brand-amber fill-brand-amber" />
                              <span>{lang === 'en' ? "Reward: 50 PTS per Question (250 PTS Max)" : "Inam: Har Sawaal Par 50 PTS (250 PTS Max)"}</span>
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md text-brand-amber">
                              <Crown className="w-3.5 h-3.5" />
                              <span>{lang === 'en' ? "Weekly Champion Badge" : "Haftawar Champion Badge"}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-stretch sm:items-start md:items-end gap-3 shrink-0 w-full md:w-auto">
                          {completedSections[weeklyChallengeSection.id] ? (
                            <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/35 text-green-400 px-4 py-2.5 rounded-xl text-xs font-mono font-black w-full justify-center">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                              <span>{lang === 'en' ? "COMPLETED" : "KAMYABI SE MUKAMMAL"}</span>
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                handleStartSectionQuiz(weeklyChallengeSection);
                              }}
                              className="px-6 py-3 bg-brand-amber hover:bg-brand-amber/95 text-brand-charcoal rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 w-full md:w-auto"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              <span>{lang === 'en' ? "LAUNCH CHALLENGE" : "CHALLENGE SHURU KAREIN"}</span>
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Modules Roadmap */}
                    <div className="space-y-4 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold text-brand-charcoal flex items-center gap-2 select-none">
                          <Shield className="w-5 h-5 text-brand-amber" />
                          <span>{lang === 'en' ? "Five Difficulty-Progressive Modules" : "Dushwari Ke 5 Mukhtalif Modules"}</span>
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-brand-slate bg-brand-sand px-2.5 py-1 rounded border border-brand-slate/10 uppercase select-none">
                          {lang === 'en' ? "Sequentially Locked" : "Sequence me locked"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {quizModules.map((mod) => {
                          const locked = isModuleLocked(mod);
                          const isActive = activeModule?.id === mod.id;
                          
                          // Count completed sections in this module
                          const modCompletedCount = mod.sections.filter(sec => completedSections[sec.id]).length;
                          
                          // Difficulty colors
                          let diffBadge = "bg-green-500/10 text-green-700 border-green-500/20";
                          if (mod.difficulty === 'Medium-Easy') diffBadge = "bg-blue-500/10 text-blue-700 border-blue-500/20";
                          if (mod.difficulty === 'Medium') diffBadge = "bg-purple-500/10 text-purple-700 border-purple-500/20";
                          if (mod.difficulty === 'Medium-Hard') diffBadge = "bg-brand-amber/10 text-brand-amber border-brand-amber/20";
                          if (mod.difficulty === 'Hard') diffBadge = "bg-red-500/10 text-red-700 border-red-500/20";

                          return (
                            <motion.button
                              key={mod.id}
                              onClick={() => {
                                if (locked) {
                                  alert(lang === 'en' 
                                    ? `This module is locked! Answer at least one section in Module ${mod.number - 1} first to unlock weight updates.` 
                                    : `Ye module locked hai! Pehle Module ${mod.number - 1} ke kisi aik section ka test clear karein.`);
                                  return;
                                }
                                setActiveModule(isActive ? null : mod);
                              }}
                              className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-48 transition-all duration-200 cursor-pointer relative ${
                                locked 
                                  ? 'bg-brand-sand/20 border-brand-slate/10 opacity-60'
                                  : isActive 
                                    ? 'bg-brand-charcoal text-brand-cream border-brand-charcoal scale-102 shadow-md'
                                    : 'bg-white hover:bg-brand-sand border-brand-slate/15 hover:scale-101 hover:border-brand-slate/30'
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Locking Badge overlay */}
                              {locked && (
                                <div className="absolute top-3 right-3 p-1.5 bg-brand-sand border border-brand-slate/10 rounded-lg text-brand-muted">
                                  <Lock className="w-3.5 h-3.5" />
                                </div>
                              )}

                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-mono font-bold border px-1.5 py-0.5 rounded ${
                                    isActive ? 'bg-white/10 border-white/20 text-brand-amber' : 'bg-brand-sand text-brand-slate border-brand-slate/10'
                                  }`}>
                                    MOD {mod.number}
                                  </span>
                                  
                                  <span className={`text-[9px] font-mono font-black border px-1.5 py-0.5 rounded uppercase ${
                                    isActive ? 'bg-white/5 border-white/10 text-white' : diffBadge
                                  }`}>
                                    {mod.difficulty}
                                  </span>
                                </div>

                                <h4 className={`font-display font-black text-sm tracking-tight leading-snug line-clamp-2 ${
                                  isActive ? 'text-brand-cream' : 'text-brand-charcoal'
                                }`}>
                                  {lang === 'en' ? mod.title.en : mod.title.ur}
                                </h4>
                              </div>

                              <div className="pt-2 border-t border-brand-slate/10 w-full flex items-center justify-between text-xs font-mono">
                                <span className={isActive ? 'text-white/60' : 'text-brand-muted'}>
                                  {lang === 'en' ? "COMPLETED" : "PASS HUE"}:
                                </span>
                                <span className={`font-bold ${isActive ? 'text-brand-amber' : 'text-brand-charcoal'}`}>
                                  {modCompletedCount}/3
                                </span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sub-Section Accordion Drawer */}
                    <AnimatePresence>
                      {activeModule && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 border border-brand-slate/15 bg-brand-sand/25 rounded-2xl space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="block text-[10px] font-mono uppercase font-black text-brand-amber">
                              {lang === 'en' ? `Module ${activeModule.number} Sections Checklist` : `Module ${activeModule.number} ke Sections`}
                            </span>
                            <span className="text-xs font-mono font-medium text-brand-muted">
                              {lang === 'en' ? "Every section contains 5 topic-focused MCQs" : "Har section me 5 sawalat hain"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {activeModule.sections.map((sec) => {
                              const scoreRecorded = highScores[sec.id] || 0;
                              const isDone = completedSections[sec.id];
                              const maxPossiblePoints = sec.questions.reduce((a, b) => a + b.points, 0);

                              return (
                                <div
                                  key={sec.id}
                                  className="bg-white p-5 border border-brand-slate/15 rounded-xl flex flex-col justify-between gap-4 text-left"
                                >
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] font-mono font-bold text-brand-amber uppercase">
                                        {sec.id.toUpperCase()}
                                      </span>
                                      
                                      {isDone ? (
                                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black text-green-600 bg-green-500/15 px-2 py-0.5 rounded-full border border-green-500/20">
                                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                                          <span>{lang === 'en' ? "PASSED" : "MUKAMMAL"}</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black text-brand-slate/60 bg-brand-sand px-2 py-0.5 rounded-full border border-brand-slate/10">
                                          <span>{lang === 'en' ? "READY" : "TAYYAR"}</span>
                                        </span>
                                      )}
                                    </div>

                                    <h5 className="font-sans font-bold text-sm text-brand-charcoal">
                                      {lang === 'en' ? sec.title.en : sec.title.ur}
                                    </h5>
                                    <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                                      {lang === 'en' ? sec.subtitle.en : sec.subtitle.ur}
                                    </p>
                                  </div>

                                  <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
                                    <div className="text-[10px] font-mono">
                                      <span className="block text-brand-muted uppercase">{lang === 'en' ? "HIGH SCORE" : "BEST SCORE"}</span>
                                      <span className="block text-xs font-black text-brand-charcoal">
                                        {scoreRecorded} / {maxPossiblePoints} PTS
                                      </span>
                                    </div>

                                    <button
                                      onClick={() => handleStartSectionQuiz(sec)}
                                      className="px-3.5 py-2 bg-brand-amber hover:bg-brand-amber/95 border border-brand-amber/20 hover:border-brand-amber/45 rounded-lg text-xs font-mono font-black text-brand-charcoal flex items-center gap-1 cursor-pointer transition-transform duration-150 hover:scale-102 active:scale-98"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>{lang === 'en' ? "ENTER" : "SHURU"}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : lobbyTab === 'achievements' ? (
                  <motion.div
                    key="achievements-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-left"
                  >
                    {/* Achievements Dashboard Header Banner */}
                    <div className="p-6 bg-brand-charcoal text-brand-cream rounded-2xl relative overflow-hidden shadow-lg border border-brand-slate/15">
                      {/* Decorative lights */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-amber/10 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div className="space-y-2">
                          <span className="block text-[10px] font-mono uppercase font-black text-brand-amber tracking-wider">
                            {lang === 'en' ? "ACCOMPLISHMENT LEDGER" : "SHARAF-E-KAMYABI"}
                          </span>
                          <h3 className="font-display text-2xl font-extrabold tracking-tight">
                            {lang === 'en' ? "Achievements Showcase" : "Aapka Badge Dashboard"}
                          </h3>
                          <p className="text-xs text-brand-cream/70 max-w-xl leading-relaxed">
                            {lang === 'en' 
                              ? "Earn special cryptographic badges as you progress through difficulty tiers and conquer quizzes with high scores. Your silicon wisdom is recorded here."
                              : "Jaise jaise aap modules pass karenge aur behtareen high scores banayenge, aapko khusoosi badges se nawaza jayega. Aapki aqalmandi ka mukammal record yahan mehfooz hai."}
                          </p>
                        </div>

                        {/* Unlocked Badges count widget */}
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-xl shrink-0">
                          <div className="relative">
                            {/* circular progress svg */}
                            <svg className="w-14 h-14 transform -rotate-90">
                              <circle cx="28" cy="28" r="24" className="stroke-white/10 fill-none" strokeWidth="4" />
                              <circle 
                                cx="28" 
                                cy="28" 
                                r="24" 
                                className="stroke-brand-amber fill-none transition-all duration-500" 
                                strokeWidth="4" 
                                strokeDasharray={2 * Math.PI * 24}
                                strokeDashoffset={2 * Math.PI * 24 * (1 - achievements.filter(a => a.unlocked).length / 8)}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold">
                              {achievements.filter(a => a.unlocked).length}/8
                            </div>
                          </div>
                          <div>
                            <span className="block text-[9px] font-mono text-white/50 uppercase">
                              {lang === 'en' ? "UNLOCKED BADGES" : "UNLOCK HUE BADGES"}
                            </span>
                            <span className="text-lg font-bold font-mono text-brand-amber">
                              {Math.round((achievements.filter(a => a.unlocked).length / 8) * 100)}% Complete
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badges Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {achievements.map((ach, idx) => {
                        // Icon resolver
                        let IconComponent = Sparkles;
                        if (ach.icon === 'BookOpen') IconComponent = BookOpen;
                        if (ach.icon === 'Cpu') IconComponent = Cpu;
                        if (ach.icon === 'Zap') IconComponent = Zap;
                        if (ach.icon === 'Database') IconComponent = Database;
                        if (ach.icon === 'Globe') IconComponent = Globe;
                        if (ach.icon === 'Award') IconComponent = Award;
                        if (ach.icon === 'Trophy') IconComponent = Trophy;

                        // Color theme resolver
                        let colorClasses = {
                          bg: "bg-amber-500/10 border-amber-500/20 text-amber-600",
                          glow: "shadow-amber-500/10 ring-amber-500/20",
                          progress: "bg-amber-500"
                        };
                        if (ach.color === 'blue') {
                          colorClasses = {
                            bg: "bg-blue-500/10 border-blue-500/20 text-blue-600",
                            glow: "shadow-blue-500/10 ring-blue-500/20",
                            progress: "bg-blue-500"
                          };
                        } else if (ach.color === 'purple') {
                          colorClasses = {
                            bg: "bg-purple-500/10 border-purple-500/20 text-purple-600",
                            glow: "shadow-purple-500/10 ring-purple-500/20",
                            progress: "bg-purple-500"
                          };
                        } else if (ach.color === 'pink') {
                          colorClasses = {
                            bg: "bg-pink-500/10 border-pink-500/20 text-pink-600",
                            glow: "shadow-pink-500/10 ring-pink-500/20",
                            progress: "bg-pink-500"
                          };
                        } else if (ach.color === 'green') {
                          colorClasses = {
                            bg: "bg-green-500/10 border-green-500/20 text-green-600",
                            glow: "shadow-green-500/10 ring-green-500/20",
                            progress: "bg-green-500"
                          };
                        } else if (ach.color === 'red') {
                          colorClasses = {
                            bg: "bg-red-500/10 border-red-500/20 text-red-600",
                            glow: "shadow-red-500/10 ring-red-500/20",
                            progress: "bg-red-500"
                          };
                        } else if (ach.color === 'yellow') {
                          colorClasses = {
                            bg: "bg-brand-amber/10 border-brand-amber/20 text-brand-amber",
                            glow: "shadow-brand-amber/10 ring-brand-amber/20",
                            progress: "bg-brand-amber"
                          };
                        } else if (ach.color === 'indigo') {
                          colorClasses = {
                            bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600",
                            glow: "shadow-indigo-500/10 ring-indigo-500/20",
                            progress: "bg-indigo-500"
                          };
                        }

                        const progressPercent = Math.min((ach.currentProgress / ach.maxProgress) * 100, 100);

                        return (
                          <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.04 }}
                            className={`p-5 rounded-2xl border transition-all duration-300 relative select-none flex flex-col justify-between gap-4 h-64 ${
                              ach.unlocked
                                ? 'bg-white border-brand-slate/15 hover:border-brand-slate/30 shadow-sm hover:shadow-md hover:scale-101'
                                : 'bg-brand-sand/15 border-brand-slate/5 opacity-70'
                            }`}
                          >
                            {/* Lock overlay icon for locked achievements, Share button for unlocked */}
                            {!ach.unlocked ? (
                              <div className="absolute top-4 right-4 text-brand-slate/40">
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSharingAchievement(ach);
                                  if (soundEnabled) playTone(600, 'sine', 0.05, 0.05);
                                }}
                                title={lang === 'en' ? "Share My Badge" : "Badge Share Karein"}
                                className="absolute top-4 right-4 p-1.5 bg-brand-sand/40 hover:bg-brand-amber/10 border border-transparent hover:border-brand-amber/25 text-brand-muted hover:text-brand-amber rounded-lg transition-all duration-200 cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Achievement details */}
                            <div className="space-y-3">
                              {/* Circle badge container */}
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-300 ${
                                ach.unlocked 
                                  ? `${colorClasses.bg} ${colorClasses.glow} ring-4` 
                                  : "bg-brand-sand border-brand-slate/10 text-brand-muted"
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>

                              <div className="space-y-1">
                                <h4 className={`font-display text-sm font-black tracking-tight leading-snug ${
                                  ach.unlocked ? 'text-brand-charcoal' : 'text-brand-muted'
                                }}`}>
                                  {lang === 'en' ? ach.title.en : ach.title.ur}
                                </h4>
                                <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                                  {lang === 'en' ? ach.desc.en : ach.desc.ur}
                                </p>
                              </div>
                            </div>

                            {/* Progress bar info */}
                            <div className="space-y-1.5 pt-2 border-t border-brand-slate/5">
                              <div className="flex items-center justify-between font-mono text-[10px] font-semibold text-brand-muted">
                                <span>{lang === 'en' ? "PROGRESS" : "RAFQAAR"}</span>
                                <span className={ach.unlocked ? "text-brand-charcoal font-bold" : ""}>
                                  {ach.unlocked ? (lang === 'en' ? "UNLOCKED" : "HASIL SHUDA") : `${ach.currentProgress}/${ach.maxProgress}`}
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden border border-brand-slate/5">
                                <div 
                                  className={`h-full transition-all duration-1000 rounded-full ${
                                    ach.unlocked ? colorClasses.progress : "bg-brand-slate/30"
                                  }`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : lobbyTab === 'leaderboard' ? (
                  <motion.div
                    key="leaderboard-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-1 space-y-6"
                  >
                    <Leaderboard
                      userScore={score}
                      userProfile={userProfile}
                      lang={lang}
                      soundEnabled={soundEnabled}
                      playTone={playTone}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="history-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6 text-left"
                  >
                    {/* Session History Header */}
                    <div className="p-6 bg-brand-charcoal text-brand-cream rounded-2xl relative overflow-hidden shadow-lg border border-brand-slate/15 select-none">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-amber/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="space-y-1 relative z-10">
                        <span className="block text-[10px] font-mono uppercase font-black text-brand-amber tracking-wider">
                          {lang === 'en' ? "ACADEMIC LEDGER & RECORDS" : "SABAQ KA MUKAMMAL RECORD"}
                        </span>
                        <h3 className="font-display text-2xl font-extrabold tracking-tight">
                          {lang === 'en' ? "Session History Review" : "Sabaq Records & Explanation"}
                        </h3>
                        <p className="text-xs text-brand-cream/70 max-w-xl leading-relaxed">
                          {lang === 'en' 
                            ? "Review your past quiz attempts, inspect which questions you missed, and read the corrective explanations to solidify your weights."
                            : "Apne purane tests ka jaiza lein, ghalat sawaalat ki nishandahi karein aur behtareen samjh ke liye unki wazahat parhein."}
                        </p>
                      </div>
                    </div>

                    {sessionHistory.length === 0 ? (
                      <div className="p-12 text-center bg-brand-sand/15 border border-dashed border-brand-slate/20 rounded-2xl space-y-3">
                        <History className="w-10 h-10 text-brand-slate/30 mx-auto animate-pulse" />
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-brand-charcoal">
                            {lang === 'en' ? "No session history recorded" : "Koi records majood nahi hain"}
                          </p>
                          <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                            {lang === 'en' 
                              ? "Complete a quiz module or the Weekly Challenge to populate your personalized revision workspace."
                              : "Revision workspace ko shuru karne ke liye koi bhi quiz module ya Weekly Challenge mukammal karein."}
                          </p>
                        </div>
                      </div>
                    ) : (() => {
                      const filteredSessions = sessionHistory.filter((sess: any) => {
                        if (!historySearchQuery) return true;
                        const query = historySearchQuery.toLowerCase();
                        const titleMatch = (sess.sectionTitle?.en || '').toLowerCase().includes(query) || 
                                           (sess.sectionTitle?.ur || '').toLowerCase().includes(query);
                        const questionMatch = sess.questions?.some((q: any) => {
                          const qEn = q.question?.en || q.text?.en || '';
                          const qUr = q.question?.ur || q.text?.ur || '';
                          const optsEn = (q.options?.en || []).join(' ');
                          const optsUr = (q.options?.ur || []).join(' ');
                          const explEn = q.explanation?.en || '';
                          const explUr = q.explanation?.ur || '';
                          return qEn.toLowerCase().includes(query) || 
                                 qUr.toLowerCase().includes(query) ||
                                 optsEn.toLowerCase().includes(query) ||
                                 optsUr.toLowerCase().includes(query) ||
                                 explEn.toLowerCase().includes(query) ||
                                 explUr.toLowerCase().includes(query);
                        });
                        return titleMatch || questionMatch;
                      });

                      return (
                        <div className="space-y-4">
                          {/* Search Bar Input */}
                          <div className="relative flex items-center bg-white border border-brand-slate/15 hover:border-brand-slate/25 focus-within:border-brand-amber rounded-2xl px-4 py-3 shadow-sm transition-all duration-200">
                            <Search className="w-4 h-4 text-brand-muted shrink-0 mr-2.5" />
                            <input
                              type="text"
                              value={historySearchQuery}
                              onChange={(e) => setHistorySearchQuery(e.target.value)}
                              placeholder={lang === 'en' ? "Search past questions, modules, or correct explanations..." : "Purane sawaalat, sabaq ya wazahat talaash karein..."}
                              className="w-full bg-transparent border-none text-brand-charcoal text-sm focus:outline-none placeholder-brand-muted"
                            />
                            {historySearchQuery && (
                              <button
                                onClick={() => {
                                  setHistorySearchQuery('');
                                  if (soundEnabled) playTone(300, 'sine', 0.05, 0.05);
                                }}
                                className="p-1 hover:bg-brand-sand rounded-full transition-colors cursor-pointer text-brand-muted hover:text-brand-charcoal"
                                title={lang === 'en' ? "Clear search" : "Saaf karein"}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {filteredSessions.length === 0 ? (
                            <div className="p-10 text-center bg-brand-sand/10 border border-brand-slate/10 rounded-2xl space-y-3">
                              <Search className="w-8 h-8 text-brand-muted mx-auto animate-pulse" />
                              <div className="space-y-1">
                                <p className="font-bold text-sm text-brand-charcoal">
                                  {lang === 'en' ? "No matching search results" : "Koi matching nateeja nahi mila"}
                                </p>
                                <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                                  {lang === 'en' 
                                    ? "Try checking your spelling or search for another topic (e.g. 'history', 'unsupervised', 'precision')."
                                    : "Apne spelling check karein ya koi aur term search karein (jaise 'history', 'precision')."}
                                </p>
                              </div>
                              <button
                                onClick={() => setHistorySearchQuery('')}
                                className="px-4 py-2 bg-brand-charcoal text-brand-cream hover:bg-brand-charcoal/90 text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer"
                              >
                                {lang === 'en' ? "Reset Search Filter" : "Talaash Saaf Karein"}
                              </button>
                            </div>
                          ) : (
                            filteredSessions.map((sess: any) => {
                              const isExpanded = expandedSessionId === sess.id;
                              const dateStr = new Date(sess.timestamp).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              });

                              return (
                                <div key={sess.id} className="bg-white border border-brand-slate/15 rounded-2xl overflow-hidden transition-all duration-300">
                                  {/* Summary Row */}
                                  <div className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-brand-sand/10 border-b border-brand-slate/5">
                                    <div className="space-y-1.5 text-left">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="font-sans font-black text-sm text-brand-charcoal">
                                          {lang === 'en' ? (sess.sectionTitle?.en || 'Quiz Session') : (sess.sectionTitle?.ur || 'Quiz Session')}
                                        </h4>
                                        
                                        {sess.practiceMode ? (
                                          <span className="text-[9px] font-mono font-black bg-blue-500/10 border border-blue-500/20 text-blue-700 px-2 py-0.5 rounded uppercase">
                                            {lang === 'en' ? "PRACTICE" : "PRACTICE RUN"}
                                          </span>
                                        ) : (
                                          <span className="text-[9px] font-mono font-black bg-green-500/10 border border-green-500/20 text-green-700 px-2 py-0.5 rounded uppercase">
                                            {lang === 'en' ? "OFFICIAL" : "ASLI TEST"}
                                          </span>
                                        )}
                                      </div>
                                      
                                      <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-brand-muted">
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3.5 h-3.5" />
                                          <span>{dateStr}</span>
                                        </span>
                                        <span>•</span>
                                        <span>
                                          {lang === 'en' ? `Score: +${sess.scoreEarned} PTS` : `Points: +${sess.scoreEarned} PTS`}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3.5 self-end sm:self-auto shrink-0">
                                      {/* Compact check circles timeline visualization */}
                                      <div className="flex gap-1.5 items-center">
                                        {sess.questions?.map((q: any, idx: number) => (
                                          <div 
                                            key={idx} 
                                            className={`w-2.5 h-2.5 rounded-full ${
                                              q.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                            title={q.isCorrect ? "Correct" : "Incorrect"}
                                          />
                                        ))}
                                        <span className="text-xs font-mono font-black text-brand-charcoal ml-1">
                                          {sess.correctCount} / {sess.totalCount}
                                        </span>
                                      </div>

                                      <button
                                        onClick={() => {
                                          setExpandedSessionId(isExpanded ? null : sess.id);
                                          if (soundEnabled) playTone(500, 'sine', 0.04, 0.04);
                                        }}
                                        className="p-2 border border-brand-slate/15 hover:border-brand-slate/30 bg-white hover:bg-brand-sand rounded-xl text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold font-mono"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>{isExpanded ? (lang === 'en' ? "Collapse" : "Chupayein") : (lang === 'en' ? "Review" : "Jaiza lein")}</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Expanded Questions Breakdown */}
                                  {isExpanded && (
                                    <div className="p-4 md:p-6 space-y-6 bg-brand-sand/5 text-left divide-y divide-brand-slate/10">
                                      {sess.questions?.map((q: any, qIdx: number) => (
                                        <div key={qIdx} className={`pt-6 first:pt-0 space-y-4`}>
                                          <div className="flex items-start gap-2.5">
                                            <span className={`p-1 rounded-lg shrink-0 mt-0.5 text-white ${
                                              q.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                            }`}>
                                              {q.isCorrect ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                              ) : (
                                                <XCircle className="w-4 h-4" />
                                              )}
                                            </span>
                                            <div className="space-y-1">
                                              <span className="block text-[9px] font-mono font-black text-brand-slate uppercase tracking-wider">
                                                {lang === 'en' ? `QUESTION ${qIdx + 1}` : `SAWAAL ${qIdx + 1}`}
                                              </span>
                                              <h5 className="font-sans font-bold text-sm text-brand-charcoal leading-relaxed">
                                                {lang === 'en' ? (q.question?.en || q.text?.en || '') : (q.question?.ur || q.text?.ur || '')}
                                              </h5>
                                            </div>
                                          </div>

                                          {/* Options list */}
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-7">
                                            {(q.options?.[lang === 'en' ? 'en' : 'ur'] || q.options?.en || []).map((opt: string, oIdx: number) => {
                                              const isSelectedByUser = q.userAnswerIndex === oIdx;
                                              const isRightIndex = q.answerIndex === oIdx;
                                              
                                              let cardStyle = "bg-white border-brand-slate/10 text-brand-charcoal";
                                              if (isRightIndex) {
                                                cardStyle = "bg-green-50 border-green-500/30 text-green-800 font-medium";
                                              } else if (isSelectedByUser && !q.isCorrect) {
                                                cardStyle = "bg-red-50 border-red-500/30 text-red-800";
                                              }

                                              return (
                                                <div 
                                                  key={oIdx} 
                                                  className={`p-3 rounded-xl border text-xs leading-relaxed flex items-center justify-between gap-2.5 ${cardStyle}`}
                                                >
                                                  <span>{opt}</span>
                                                  <div className="shrink-0 font-mono text-[9px] font-black uppercase tracking-wider">
                                                    {isRightIndex && (
                                                      <span className="text-green-600 font-bold">{lang === 'en' ? "CORRECT" : "SAHI"}</span>
                                                    )}
                                                    {isSelectedByUser && !q.isCorrect && (
                                                      <span className="text-red-500 font-bold">{lang === 'en' ? "YOUR SELECTION" : "AAPKA JAWAB"}</span>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>

                                          {/* Explanation Box */}
                                          <div className="pl-7 pt-1.5">
                                            <div className="p-4 bg-brand-sand/30 border border-brand-slate/10 rounded-xl space-y-1">
                                              <span className="block text-[9px] font-mono font-black text-brand-amber uppercase tracking-widest">
                                                {lang === 'en' ? "EXPLANATION / WAZAHAT" : "WAZAHAT / EXPLANATION"}
                                              </span>
                                              <p className="text-xs text-brand-muted leading-relaxed">
                                                {lang === 'en' ? (q.explanation?.en || '') : (q.explanation?.ur || '')}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* VIEW 2: ACTIVE PLAYING COMBAT ARENA */}
          {gameState === 'playing' && activeSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-8 space-y-6 text-left"
            >
              {/* Question Combat HUD Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-slate/10 pb-5">
                <button
                  onClick={handleExitToLobby}
                  className="flex items-center gap-1.5 text-xs font-mono font-black text-brand-slate uppercase hover:text-brand-amber transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'en' ? "ESCAPE ARENA" : "LOBBY ME WAPAS"}</span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  {practiceMode && (
                    <span className="text-[10px] font-mono font-bold bg-green-500/15 text-green-700 px-2.5 py-1 rounded-lg border border-green-500/20 uppercase tracking-wide">
                      {lang === 'en' ? "Practice Mode" : "Practice Mode"}
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-brand-muted bg-brand-sand border border-brand-slate/10 px-2.5 py-1 rounded-lg">
                    {lang === 'en' ? "Section:" : "Section:"} <span className="text-brand-charcoal font-black">{lang === 'en' ? activeSection.title.en : activeSection.title.ur}</span>
                  </span>
                  
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-charcoal text-brand-amber border border-brand-charcoal/25 rounded-lg text-xs font-mono font-black">
                    <Flame className="w-3.5 h-3.5 text-brand-amber animate-pulse" />
                    <span>+{activeSection.questions[currentQuestionIdx]?.points} PTS{practiceMode && "*"}</span>
                  </span>
                </div>
              </div>

              {/* Live Battle Stats Trackers & Countdown Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-5 gap-2.5 max-w-sm w-full">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const wasAnswered = idx < answersLog.length;
                    const isCorrectAnswer = answersLog[idx];
                    const isCurrent = idx === currentQuestionIdx;

                    let boxStyle = "bg-brand-sand border-brand-slate/10 text-brand-muted";
                    if (isCurrent) boxStyle = "bg-brand-amber border-brand-amber text-brand-charcoal scale-102 ring-2 ring-brand-amber/20";
                    else if (wasAnswered) {
                      boxStyle = isCorrectAnswer 
                        ? "bg-green-500/20 border-green-500/35 text-green-700 font-bold" 
                        : "bg-red-500/20 border-red-500/35 text-red-700 font-bold";
                    }

                    return (
                      <div
                        key={`tracker-${idx}`}
                        className={`h-9 border rounded-xl flex items-center justify-center font-mono text-xs select-none transition-all duration-200 ${boxStyle}`}
                      >
                        {idx + 1}
                      </div>
                    );
                  })}
                </div>

                {/* Countdown Timer HUD */}
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {practiceMode ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 border border-green-500/20 bg-green-500/5 text-green-700 font-mono text-xs font-bold rounded-2xl select-none">
                      <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
                      <span>{lang === 'en' ? "PRACTICE (∞ TIME)" : "PRACTICE (Bina Limit)"}</span>
                    </div>
                  ) : (
                    <>
                      <div className={`relative flex items-center gap-2 px-4 py-1.5 border rounded-2xl font-mono text-xs font-bold transition-all duration-300 ${
                        isAnswerChecked 
                          ? 'bg-brand-sand/30 border-brand-slate/5 text-brand-muted opacity-60' 
                          : timeLeft <= 5 
                            ? 'bg-red-500/10 border-red-500/35 text-red-600 animate-pulse scale-105' 
                            : 'bg-brand-sand/50 border-brand-slate/10 text-brand-charcoal'
                      }`}>
                        <Timer className={`w-4 h-4 ${timeLeft <= 5 && !isAnswerChecked ? 'text-red-500 animate-spin-slow' : 'text-brand-amber'}`} />
                        <span className="tabular-nums">
                          {isAnswerChecked 
                            ? (lang === 'en' ? "RESOLVED" : "HAL SHUDA") 
                            : `${timeLeft}s`}
                        </span>
                      </div>

                      {/* Horizontal visual indicator bar */}
                      {!isAnswerChecked && (
                        <div className="w-16 h-1.5 bg-brand-sand border border-brand-slate/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-brand-amber'}`}
                            style={{ width: `${(timeLeft / 20) * 100}%` }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Question Core Area */}
              <div ref={questionContainerRef} className="space-y-6">
                
                {/* Clay asking questions animation */}
                <div className="flex items-center gap-4 bg-brand-sand/20 border border-brand-slate/10 p-4 md:p-5 rounded-2xl select-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-amber/5 rounded-full blur-xl pointer-events-none" />
                  <div className="relative shrink-0">
                    <ClayLogo size={42} className="animate-bounce" />
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-brand-amber uppercase tracking-widest animate-pulse">
                        {lang === 'en' ? "CLAY TRANSMISSION" : "CLAY KI GUFTAGU"}
                      </span>
                      <span className="h-1.5 w-1.5 bg-brand-amber rounded-full animate-ping" />
                    </div>
                    <p className="text-xs font-semibold text-brand-charcoal italic leading-relaxed">
                      {lang === 'en' 
                        ? `"I am active and presenting this neural inquiry. Answer wisely!"`
                        : `"Main active hoon aur ye sawal pooch raha hoon. Sahi jawab chunye!"`}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-mono font-black text-brand-amber uppercase tracking-widest">
                    {lang === 'en' ? `LIVE SYSTEM QUERY 0${currentQuestionIdx + 1}` : `MASHINI QUERY SHUMAR 0${currentQuestionIdx + 1}`}
                  </span>
                  <h3 className="font-display text-lg md:text-xl font-bold text-brand-charcoal leading-relaxed max-w-3xl">
                    {lang === 'en' 
                      ? activeSection.questions[currentQuestionIdx]?.text.en 
                      : activeSection.questions[currentQuestionIdx]?.text.ur}
                  </h3>
                </div>

                {/* 4 options buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-4xl">
                  {activeSection.questions[currentQuestionIdx]?.options[currentLang]?.map((opt, idx) => {
                    const isSelected = selectedIdx === idx;
                    const isCorrectOption = idx === activeSection.questions[currentQuestionIdx].answerIndex;
                    
                    let buttonStyle = "bg-white hover:bg-brand-sand border-brand-slate/15 text-brand-charcoal";
                    if (isSelected) {
                      buttonStyle = "bg-brand-charcoal text-brand-cream border-brand-charcoal";
                    }
                    if (isAnswerChecked) {
                      if (isCorrectOption) {
                        buttonStyle = "bg-green-500/10 border-green-500/35 text-green-700 font-semibold";
                      } else if (isSelected && !isCorrectOption) {
                        buttonStyle = "bg-red-500/10 border-red-500/35 text-red-700";
                      } else {
                        buttonStyle = "bg-white/50 border-brand-slate/5 text-brand-muted opacity-50 pointer-events-none";
                      }
                    }

                    return (
                      <motion.button
                        key={`playing-opt-${idx}`}
                        whileHover={!isAnswerChecked ? { scale: 1.01 } : undefined}
                        whileTap={!isAnswerChecked ? { scale: 0.97 } : undefined}
                        onClick={() => handleOptionClick(idx)}
                        disabled={isAnswerChecked}
                        className={`p-4 md:p-5 min-h-[3.5rem] rounded-2xl border text-left text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 select-none cursor-pointer w-full focus:outline-hidden touch-manipulation ${buttonStyle}`}
                      >
                        <div className="flex items-start gap-3 flex-grow">
                          <span className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-mono font-black shrink-0 ${
                            isSelected 
                              ? 'bg-brand-amber text-brand-charcoal border-brand-amber' 
                              : 'bg-brand-sand text-brand-muted border-brand-slate/10'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-tight pt-0.5">{opt}</span>
                        </div>
                        {!isAnswerChecked && (
                          <kbd className="hidden sm:inline-flex items-center justify-center w-5 h-5 text-[10px] font-mono text-brand-muted bg-brand-sand/40 border border-brand-slate/10 rounded shadow-xs shrink-0 font-bold">
                            {idx + 1}
                          </kbd>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Actions & Explanations Layer */}
              <div className="pt-4 border-t border-brand-slate/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
                
                {/* Answer Explanation Box (Shown after checking) */}
                <div className="flex-1">
                  <AnimatePresence>
                    {isAnswerChecked && (
                      <motion.div
                        ref={explanationRef}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 bg-white/80 ${
                          selectedIdx === activeSection.questions[currentQuestionIdx].answerIndex
                            ? 'border-green-500/25 text-green-800'
                            : 'border-brand-slate/15 text-brand-charcoal'
                        }`}
                      >
                        <Award className="w-5 h-5 text-brand-amber shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-sans uppercase font-bold text-[10px] tracking-wider mb-1">
                            {lang === 'en' ? "EXPLANATION BREAKDOWN" : "MASHINI TAFSEEL"}
                          </strong>
                          <span>
                            {lang === 'en' 
                              ? activeSection.questions[currentQuestionIdx].explanation.en 
                              : activeSection.questions[currentQuestionIdx].explanation.ur}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Side Control Buttons */}
                <div className="flex justify-end items-center gap-3 shrink-0 self-end sm:self-auto">
                  {!isAnswerChecked ? (
                    <button
                      onClick={handleVerifyAnswer}
                      disabled={selectedIdx === null}
                      className={`px-6 py-3 rounded-2xl text-xs font-bold font-mono tracking-wider transition-all duration-200 shadow-xs cursor-pointer flex items-center gap-2 ${
                        selectedIdx !== null
                          ? 'bg-brand-amber hover:bg-brand-amber/95 text-brand-charcoal scale-102 hover:shadow-md'
                          : 'bg-brand-slate/15 text-brand-muted opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span>{lang === 'en' ? "VERIFY SELECTION" : "OPTION LOCK KAREIN"}</span>
                      {selectedIdx !== null && (
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-brand-charcoal/10 border border-brand-charcoal/15 rounded text-brand-charcoal">
                          ⏎ Enter
                        </kbd>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-3 bg-brand-charcoal hover:bg-brand-charcoal/95 text-brand-cream rounded-2xl text-xs font-bold font-mono tracking-wider transition-all duration-200 cursor-pointer shadow-xs scale-102 hover:shadow-md flex items-center gap-2"
                    >
                      <span>
                        {currentQuestionIdx < activeSection.questions.length - 1
                          ? (lang === 'en' ? "NEXT QUERY" : "AGLA SAWAAAL")
                          : (lang === 'en' ? "VIEW ARENA REPORT" : "ARENA REPORT DEKHEIN")}
                      </span>
                      <ChevronRight className="w-4 h-4 text-brand-amber" />
                      <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-white/10 border border-white/15 rounded text-brand-cream">
                        ⏎ Enter
                      </kbd>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3: VICTORY REPORT SCREEN */}
          {gameState === 'victory' && activeSection && (
            <>
              <Confetti />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center space-y-8 select-none text-left"
              >
              <div className="max-w-md mx-auto space-y-6 text-center">
                <div className={`inline-flex p-4 rounded-3xl animate-bounce ${
                  practiceMode 
                    ? "bg-green-500/10 border border-green-500/25 text-green-600" 
                    : "bg-brand-amber/15 border border-brand-amber/25 text-brand-amber"
                }`}>
                  {practiceMode ? <BookOpen className="w-12 h-12" /> : <Award className="w-12 h-12" />}
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] font-mono font-black text-brand-amber uppercase tracking-widest">
                    {practiceMode 
                      ? (lang === 'en' ? "PRACTICE RUN COMPLETED" : "PRACTICE TEST MUKAMMAL")
                      : (lang === 'en' ? "ARENA EXCURSION COMPLETED" : "ARENA CHIP VICTORY")}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-extrabold text-brand-charcoal">
                    {practiceMode 
                      ? (lang === 'en' ? "Practice Complete!" : "Practice Mukammal!")
                      : (lang === 'en' ? "Victory Achieved!" : "Fatah Hasil Hui!")}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
                    {practiceMode ? (
                      lang === 'en'
                        ? `You completed the '${activeSection.title.en}' learning arena in Practice Mode. Toggle Practice Mode off to take the Timed Challenge for XP!`
                        : `Aapne '${activeSection.title.ur}' learning arena ka test Practice Mode me safalata ke sath poora kar liya. Asli high score ke liye Practice Mode band karein!`
                    ) : (
                      lang === 'en'
                        ? `You completed the '${activeSection.title.en}' battle arena safely and synchronized progress.`
                        : `Aapne '${activeSection.title.ur}' battle arena ka test safalata ke sath poora kar liya.`
                    )}
                  </p>
                </div>

                {/* Score Summary Box */}
                <div className="p-6 bg-brand-sand/35 border border-brand-slate/10 rounded-2xl grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-mono text-brand-muted uppercase">{lang === 'en' ? "CORRECT BATCH" : "SAHI JAWAB"}</span>
                    <span className="block text-xl font-black text-brand-charcoal">
                      {runCorrectCount} / 5
                    </span>
                  </div>
                  
                  <div className="space-y-0.5 border-l border-brand-slate/10 pl-4">
                    <span className="block text-[10px] font-mono text-brand-muted uppercase">{lang === 'en' ? "EARNED SCORE" : "POINTS MILE"}</span>
                    {practiceMode ? (
                      <div className="flex flex-col items-center">
                        <span className="block text-sm font-bold text-green-600">
                          {lang === 'en' ? "Practice" : "Practice"}
                        </span>
                        <span className="block text-[9px] font-mono text-brand-muted font-bold leading-none">
                          {lang === 'en' ? "XP Not Registered" : "XP Register nahi hui"}
                        </span>
                      </div>
                    ) : (
                      <span className="block text-xl font-black text-brand-amber">
                        +{runPointsEarned} PTS
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive Feedback message from Clay */}
                <p className="text-xs font-semibold text-brand-charcoal italic bg-brand-sand/15 p-4 border border-brand-slate/10 rounded-xl leading-relaxed">
                  {practiceMode ? (
                    lang === 'en'
                      ? `"Excellent practice! You answered ${runCorrectCount} questions correctly without any clock pressure. When you're ready, take the timed challenge!"`
                      : `"Acha practice! Aapne bina kisi timer ke dhabao ke ${runCorrectCount} sahi jawab diye. Jab aap tayyar hon, toh timed challenge zaroor khelein!"`
                  ) : (
                    `"${runCorrectCount === 5 
                      ? (lang === 'en' ? "PERFECT RESPONSE ALIGNMENT! Flawless backpropagation achieved, all weights matching 100%!" : "LA-JAWAB JAWABAT! Har dimaagi weight bilkul sahi point par fit ho chuka hai!")
                      : (lang === 'en' ? `Solid run! You got ${runCorrectCount} correct. Retake the test anytime to maximize points.` : `Acha koshish! Aapne ${runCorrectCount} sahi kiye. Points behtar karne ke liye aap jab chahein dubara khel sakte hain.`)}"`
                  )}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleStartSectionQuiz(activeSection)}
                    className="px-5 py-3 border border-brand-slate/15 hover:bg-brand-sand rounded-2xl text-xs font-mono font-bold text-brand-charcoal tracking-wide cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-102 active:scale-98"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? "RETRY TEST" : "DUBARA KHELEIN"}</span>
                  </button>

                  <button
                    onClick={handleExitToLobby}
                    className="px-6 py-3 bg-brand-amber hover:bg-brand-amber/95 border border-brand-amber/20 rounded-2xl text-xs font-mono font-black text-brand-charcoal tracking-wide cursor-pointer flex items-center gap-1.5 transition-transform hover:scale-102 active:scale-98 shadow-sm hover:shadow-md"
                  >
                    <span>{lang === 'en' ? "RETURN TO ARENA LOBBY" : "LOBBY ME WAPAS"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Badge Share Showcase Modal */}
        <AnimatePresence>
          {sharingAchievement && (
            <BadgeShareModal
              isOpen={sharingAchievement !== null}
              onClose={() => setSharingAchievement(null)}
              achievement={sharingAchievement}
              userScore={score}
              userProfile={userProfile}
              lang={lang}
              soundEnabled={soundEnabled}
              playTone={playTone}
            />
          )}
        </AnimatePresence>

        {/* Achievement Unlocked Celebration Modal overlay */}
        <AnimatePresence>
          {newlyUnlockedAchievement && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-charcoal/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white border-2 border-brand-amber rounded-3xl p-6 md:p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
              >
                {/* Confetti-like ambient bursts */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-amber/15 rounded-full blur-2xl animate-pulse pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl animate-pulse pointer-events-none" />

                <div className="space-y-6 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-brand-amber/10 border-2 border-brand-amber flex items-center justify-center text-brand-amber mx-auto animate-bounce shadow-lg shadow-brand-amber/10">
                    <Trophy className="w-10 h-10" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-black text-brand-amber uppercase tracking-widest block">
                      {lang === 'en' ? "ACHIEVEMENT UNLOCKED!" : "NAYI KAMYABI HASIL!"}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-extrabold text-brand-charcoal tracking-tight">
                      {lang === 'en' ? (newlyUnlockedAchievement.title?.en || newlyUnlockedAchievement.name?.en || '') : (newlyUnlockedAchievement.title?.ur || newlyUnlockedAchievement.name?.ur || '')}
                    </h3>
                    <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
                      {lang === 'en' ? (newlyUnlockedAchievement.desc?.en || '') : (newlyUnlockedAchievement.desc?.ur || '')}
                    </p>
                  </div>

                  {/* Badge card visualization */}
                  <div className="p-4 bg-brand-sand/30 border border-brand-slate/10 rounded-2xl flex items-center gap-3.5 text-left">
                    <div className="w-11 h-11 rounded-xl bg-brand-amber border border-brand-amber/30 flex items-center justify-center text-brand-charcoal font-bold shrink-0">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="block text-[9px] font-mono font-bold text-brand-slate uppercase tracking-wider">
                        {lang === 'en' ? "PERMANENT BADGE AWARDED" : "HAMESHA K LIYE SHAMIL"}
                      </span>
                      <span className="block text-xs font-black text-brand-charcoal">
                        {lang === 'en' ? newlyUnlockedAchievement.title.en : newlyUnlockedAchievement.title.ur}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={() => {
                        setSharingAchievement(newlyUnlockedAchievement);
                        setNewlyUnlockedAchievement(null);
                        if (soundEnabled) playTone(600, 'sine', 0.05, 0.05);
                      }}
                      className="flex-1 px-5 py-3 bg-brand-amber hover:bg-brand-amber/95 text-brand-charcoal rounded-xl text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{lang === 'en' ? "SHARE BADGE" : "BADGE SHARE KAREIN"}</span>
                    </button>
                    <button
                      onClick={() => {
                        setNewlyUnlockedAchievement(null);
                        if (soundEnabled) playTone(350, 'sine', 0.05, 0.05);
                      }}
                      className="flex-1 px-5 py-3 bg-brand-sand hover:bg-brand-sand/85 text-brand-charcoal rounded-xl text-xs font-bold font-mono tracking-wider border border-brand-slate/10 transition-colors cursor-pointer"
                    >
                      <span>{lang === 'en' ? "CLOSE" : "BAND KAREIN"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
