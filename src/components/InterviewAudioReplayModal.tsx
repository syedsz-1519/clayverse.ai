import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  MessageSquare,
  Bot,
  User,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  Copy,
  Check,
  Search,
  Brain,
  Code,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Filter,
  FileText
} from 'lucide-react';
import { MockInterviewRecord, QuestionAttempt } from '../types';
import { audioEngine } from '../lib/audioEngine';
import CopyCodeButton from './CopyCodeButton';

interface InterviewAudioReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MockInterviewRecord | null;
  studentName?: string;
}

export default function InterviewAudioReplayModal({
  isOpen,
  onClose,
  record,
  studentName = 'AI Scholar'
}: InterviewAudioReplayModalProps) {
  // Active selected question in the replay
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'interviewer' | 'candidate' | 'idle'>('idle');
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100%

  const progressIntervalRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop audio on close or unmount
  const stopAudio = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentSpeaker('idle');
    setPlaybackProgress(0);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopAudio();
    } else {
      setActiveQuestionIndex(0);
      setPlaybackProgress(0);
    }
  }, [isOpen, stopAudio]);

  if (!isOpen || !record) return null;

  const attempts = record.attempts || [];
  const currentAttempt: QuestionAttempt | undefined = attempts[activeQuestionIndex];

  // Play audio for the currently active question (Interviewer -> Candidate)
  const playCurrentQuestionAudio = (startIndex = activeQuestionIndex) => {
    if (!('speechSynthesis' in window) || !attempts[startIndex]) return;

    window.speechSynthesis.cancel();
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    const att = attempts[startIndex];
    setIsPlaying(true);
    setCurrentSpeaker('interviewer');
    setPlaybackProgress(10);

    // 1. Interviewer reads Question
    const qUtterance = new SpeechSynthesisUtterance(`Question ${startIndex + 1}: ${att.questionText}`);
    qUtterance.rate = playbackSpeed * 0.95;
    qUtterance.pitch = record.interviewerName.includes('Sarah') || record.interviewerName.includes('Elena') ? 1.1 : 0.95;

    // Attempt voice selection
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    if (englishVoices.length > 0) {
      qUtterance.voice = englishVoices[0];
    }

    qUtterance.onend = () => {
      // 2. Candidate reads Answer
      setCurrentSpeaker('candidate');
      setPlaybackProgress(50);

      const candidateUtterance = new SpeechSynthesisUtterance(`Candidate Answer: ${att.userAnswer || 'No vocal answer recorded.'}`);
      candidateUtterance.rate = playbackSpeed * 1.0;
      candidateUtterance.pitch = 1.0;
      if (englishVoices.length > 1) {
        candidateUtterance.voice = englishVoices[1];
      }

      candidateUtterance.onend = () => {
        setPlaybackProgress(100);
        setCurrentSpeaker('idle');

        // Automatically advance to next question if available
        if (startIndex < attempts.length - 1) {
          setTimeout(() => {
            setActiveQuestionIndex(startIndex + 1);
            playCurrentQuestionAudio(startIndex + 1);
          }, 1200);
        } else {
          setIsPlaying(false);
          audioEngine.playLoFiChord();
        }
      };

      candidateUtterance.onerror = () => {
        setIsPlaying(false);
        setCurrentSpeaker('idle');
      };

      currentUtteranceRef.current = candidateUtterance;
      if (!isMuted) {
        window.speechSynthesis.speak(candidateUtterance);
      }
    };

    qUtterance.onerror = () => {
      setIsPlaying(false);
      setCurrentSpeaker('idle');
    };

    currentUtteranceRef.current = qUtterance;
    if (!isMuted) {
      window.speechSynthesis.speak(qUtterance);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      audioEngine.playLoFiChord();
      playCurrentQuestionAudio(activeQuestionIndex);
    }
  };

  const handleSelectQuestion = (index: number) => {
    stopAudio();
    setActiveQuestionIndex(index);
    audioEngine.playLoFiChord();
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < attempts.length - 1) {
      handleSelectQuestion(activeQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      handleSelectQuestion(activeQuestionIndex - 1);
    }
  };

  // Copy full transcript text
  const handleCopyTranscript = () => {
    const lines = [
      `=== CLAY AI MOCK INTERVIEW TRANSCRIPT REPLAY ===`,
      `Track: ${record.roleTrack}`,
      `Interviewer: ${record.interviewerName}`,
      `Candidate: ${studentName}`,
      `Date: ${record.dateStr}`,
      `Overall Score: ${record.overallScore}% (${record.hiringDecision})`,
      `Eye Contact: ${record.eyeContactScore}% | Technical: ${record.technicalScore}%`,
      `\n------------------------------------------------\n`,
      ...attempts.map((att, idx) => {
        return [
          `[Q${idx + 1}] INTERVIEWER:`,
          att.questionText,
          ``,
          `[Q${idx + 1}] CANDIDATE ANSWER (${att.score}%):`,
          att.userAnswer || '(No written answer)',
          att.userCode ? `\n[CODE SNIPPET]:\n${att.userCode}` : '',
          ``,
          `AI FEEDBACK:`,
          att.aiFeedback,
          att.strengths?.length ? `Strengths: ${att.strengths.join(', ')}` : '',
          att.improvements?.length ? `Improvements: ${att.improvements.join(', ')}` : '',
          `\n------------------------------------------------\n`
        ].filter(Boolean).join('\n');
      })
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopiedTranscript(true);
    audioEngine.playLoFiChord();
    setTimeout(() => setCopiedTranscript(false), 2500);
  };

  // Download Transcript as .txt
  const handleDownloadTranscript = () => {
    const text = [
      `=== CLAY AI MOCK INTERVIEW TRANSCRIPT REPLAY ===`,
      `Track: ${record.roleTrack}`,
      `Interviewer: ${record.interviewerName}`,
      `Candidate: ${studentName}`,
      `Date: ${record.dateStr}`,
      `Score: ${record.overallScore}% (${record.hiringDecision})`,
      `\n`,
      ...attempts.map((att, idx) => `[Question ${idx + 1} - Score: ${att.score}%]\nQ: ${att.questionText}\nA: ${att.userAnswer}\nAI Feedback: ${att.aiFeedback}\n\n`)
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview_transcript_${record.roleTrack.replace(/\s+/g, '_')}_${record.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered attempts for search query
  const filteredAttempts = attempts.filter((att, idx) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      att.questionText.toLowerCase().includes(q) ||
      att.userAnswer.toLowerCase().includes(q) ||
      att.aiFeedback.toLowerCase().includes(q) ||
      `q${idx + 1}`.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-brand-slate/20 overflow-hidden relative"
      >
        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-brand-charcoal via-slate-900 to-brand-charcoal text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-amber text-white flex items-center justify-center shadow-lg shrink-0">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-[9px] font-mono font-bold uppercase">
                  Interview Audio & Transcript Replay
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                  record.hiringDecision === 'Strong Hire' ? 'bg-emerald-500/20 text-emerald-300' :
                  record.hiringDecision === 'Hire' ? 'bg-teal-500/20 text-teal-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {record.hiringDecision} • {record.overallScore}%
                </span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-black text-white mt-0.5">
                {record.roleTrack}
              </h2>
              <div className="flex items-center gap-3 text-xs text-white/70 mt-0.5 font-mono text-[10.5px]">
                <span>Interviewer: {record.interviewerName}</span>
                <span>•</span>
                <span>{record.dateStr}</span>
                <span>•</span>
                <span>{attempts.length} Questions</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Close Button */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleCopyTranscript}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
              title="Copy complete transcript to clipboard"
            >
              {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-brand-amber" />}
              <span>{copiedTranscript ? 'Copied!' : 'Copy Transcript'}</span>
            </button>

            <button
              onClick={handleDownloadTranscript}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/15"
              title="Download text transcript"
            >
              <Download className="w-3.5 h-3.5 text-brand-amber" />
              <span className="hidden sm:inline">Export .txt</span>
            </button>

            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* AUDIO PLAYBACK DOCK & WAVEFORM BAR */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white p-4 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Main Controls: Prev, Play/Pause, Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevQuestion}
              disabled={activeQuestionIndex === 0}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-all cursor-pointer"
              title="Previous Question"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTogglePlay}
              className="px-5 py-2.5 rounded-2xl bg-brand-amber hover:bg-brand-amber-dark text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              <span>{isPlaying ? 'Pause Audio Replay' : `Play Question ${activeQuestionIndex + 1}`}</span>
            </motion.button>

            <button
              onClick={handleNextQuestion}
              disabled={activeQuestionIndex === attempts.length - 1}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition-all cursor-pointer"
              title="Next Question"
            >
              <FastForward className="w-4 h-4" />
            </button>

            {/* Audio Waveform Equalizer Bars */}
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 h-8">
              {[8, 16, 10, 22, 14, 28, 18, 12, 24, 16, 8].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-brand-amber' : 'bg-white/20'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(4, (height * (isPlaying ? Math.sin(Date.now() / 150 + i) * 0.5 + 0.8 : 1)))}px` : '4px',
                  }}
                />
              ))}
            </div>

            {/* Current Speaker Tag */}
            {isPlaying && (
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                currentSpeaker === 'interviewer' ? 'bg-purple-500/20 text-purple-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                {currentSpeaker === 'interviewer' ? `Speaking: ${record.interviewerName}` : `Speaking: ${studentName}`}
              </span>
            )}
          </div>

          {/* Secondary Controls: Speed & Sound Settings */}
          <div className="flex items-center gap-3">
            {/* Speed Multiplier */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl text-[11px] font-mono font-bold">
              {[0.75, 1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    setPlaybackSpeed(speed);
                    if (isPlaying) {
                      stopAudio();
                      setTimeout(() => playCurrentQuestionAudio(activeQuestionIndex), 100);
                    }
                  }}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    playbackSpeed === speed ? 'bg-brand-amber text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Mute Toggle */}
            <button
              onClick={() => {
                if (!isMuted) stopAudio();
                setIsMuted(!isMuted);
              }}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isMuted ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/10 border-white/15 text-white'
              }`}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY: SPLIT VIEW (QUESTIONS NAV + ACTIVE TRANSCRIPT DETAIL) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden bg-brand-cream/30">
          
          {/* LEFT 4 COLS: Question Selector & Search */}
          <div className="lg:col-span-4 border-r border-brand-slate/15 bg-white p-4 flex flex-col gap-3 overflow-y-auto max-h-[50vh] lg:max-h-[62vh]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcript questions or keywords..."
                className="w-full pl-8.5 pr-3 py-2 bg-brand-sand/30 border border-brand-slate/15 rounded-xl text-xs text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-slate block">
                Question Stepper ({filteredAttempts.length} of {attempts.length})
              </span>

              {filteredAttempts.map((att, idx) => {
                const originalIndex = attempts.indexOf(att);
                const isSelected = originalIndex === activeQuestionIndex;
                return (
                  <button
                    key={originalIndex}
                    onClick={() => handleSelectQuestion(originalIndex)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col gap-1.5 ${
                      isSelected
                        ? 'border-brand-amber bg-brand-amber/[0.06] shadow-sm ring-2 ring-brand-amber/30'
                        : 'border-brand-slate/10 bg-white hover:bg-brand-sand/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-display font-bold text-xs text-brand-charcoal">
                        Question {originalIndex + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold ${
                        att.score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                        att.score >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {att.score}%
                      </span>
                    </div>

                    <p className="text-[11px] text-brand-slate line-clamp-2 leading-relaxed">
                      {att.questionText}
                    </p>

                    <div className="flex items-center justify-between text-[9px] font-mono text-brand-muted pt-1 border-t border-brand-slate/10">
                      <span>{att.durationSeconds ? `${Math.round(att.durationSeconds)}s duration` : 'Answered'}</span>
                      {isSelected && isPlaying && (
                        <span className="text-brand-amber font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-ping" />
                          Playing
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT 8 COLS: Detailed Transcript & AI Feedback Breakdown */}
          <div className="lg:col-span-8 p-5 sm:p-6 overflow-y-auto max-h-[60vh] lg:max-h-[62vh] space-y-5 text-left">
            {currentAttempt ? (
              <div className="space-y-5">
                
                {/* 1. Interviewer Question Bubble */}
                <div className="bg-white rounded-3xl p-5 border border-brand-slate/15 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-purple-500/15 text-purple-700 flex items-center justify-center font-bold text-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-display font-bold text-xs text-brand-charcoal">
                          {record.interviewerName}
                        </span>
                        <span className="text-[10px] font-mono text-brand-muted block">
                          Interviewer Prompt • Q{activeQuestionIndex + 1}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => playCurrentQuestionAudio(activeQuestionIndex)}
                      className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-800 text-[10.5px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Replay Question Audio</span>
                    </button>
                  </div>

                  <p className="font-display text-sm sm:text-base font-bold text-brand-charcoal leading-relaxed">
                    {currentAttempt.questionText}
                  </p>
                </div>

                {/* 2. Candidate Answer & Code Bubble */}
                <div className="bg-white rounded-3xl p-5 border border-brand-slate/15 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-slate/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-display font-bold text-xs text-brand-charcoal">
                          {studentName} (Candidate Answer)
                        </span>
                        <span className="text-[10px] font-mono text-brand-muted block">
                          Recorded Transcript • {currentAttempt.userAnswer.split(/\s+/).filter(Boolean).length} Words
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                      currentAttempt.score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                      currentAttempt.score >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Question Score: {currentAttempt.score}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-brand-sand/20 border border-brand-slate/10 text-xs text-brand-charcoal font-medium leading-relaxed">
                    {currentAttempt.userAnswer ? (
                      <p>{currentAttempt.userAnswer}</p>
                    ) : (
                      <p className="italic text-brand-muted">No verbal answer provided for this question.</p>
                    )}
                  </div>

                  {/* Submitted Code Snippet if applicable */}
                  {currentAttempt.userCode && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-brand-slate">
                        <span className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-brand-amber" />
                          Submitted Code Snippet
                        </span>
                        <CopyCodeButton text={currentAttempt.userCode} label="Copy Code" variant="compact" />
                      </div>
                      <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto border border-slate-800">
                        <code>{currentAttempt.userCode}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* 3. AI Evaluation & Strengths / Improvements Breakdown */}
                <div className="bg-gradient-to-br from-amber-500/5 via-white to-orange-500/5 rounded-3xl p-5 border border-brand-amber/30 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-amber" />
                      AI Evaluation & Feedback Breakdown
                    </h4>

                    <button
                      onClick={() => setShowModelAnswer(!showModelAnswer)}
                      className="px-2.5 py-1 rounded-xl bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal text-[10.5px] font-bold transition-all cursor-pointer"
                    >
                      {showModelAnswer ? 'Hide Model Reference' : 'View Model Reference Answer'}
                    </button>
                  </div>

                  <p className="text-xs text-brand-slate leading-relaxed">
                    {currentAttempt.aiFeedback}
                  </p>

                  {/* Strengths & Improvements Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {currentAttempt.strengths && currentAttempt.strengths.length > 0 && (
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                        <span className="font-mono text-[9px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Key Strengths:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-emerald-950 text-[11px]">
                          {currentAttempt.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentAttempt.improvements && currentAttempt.improvements.length > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                        <span className="font-mono text-[9px] font-bold uppercase text-amber-800 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Actionable Upgrades:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-amber-950 text-[11px]">
                          {currentAttempt.improvements.map((imp, idx) => (
                            <li key={idx}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Optional Model Reference Answer Expansion */}
                  <AnimatePresence>
                    {showModelAnswer && currentAttempt.modelAnswer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 border border-white/10"
                      >
                        <span className="text-[9.5px] font-mono uppercase font-bold text-brand-amber block">
                          Ideal Model Reference Solution:
                        </span>
                        <p className="text-white/90 text-[11px] leading-relaxed">
                          {currentAttempt.modelAnswer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-brand-muted space-y-2">
                <FileText className="w-8 h-8 mx-auto text-brand-muted" />
                <p className="text-xs">No questions matched your search criteria.</p>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* FOOTER BAR */}
        {/* ========================================================================= */}
        <div className="p-4 bg-white border-t border-brand-slate/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3 text-brand-muted font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700">
              <Eye className="w-3.5 h-3.5" /> {record.eyeContactScore}% Camera Eye Contact
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-purple-700">
              <Brain className="w-3.5 h-3.5" /> {record.technicalScore}% Technical Score
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-brand-charcoal text-white hover:bg-black font-bold text-xs transition-all cursor-pointer"
            >
              Close Replay
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
