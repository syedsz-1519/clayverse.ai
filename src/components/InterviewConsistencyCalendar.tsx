import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  Flame, 
  Video, 
  FileText, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Volume2, 
  ArrowRight,
  Filter,
  Play
} from 'lucide-react';
import { MockInterviewRecord } from '../types';
import { DailyStreakState, getIsoDateStr } from '../lib/streakManager';
import { audioEngine } from '../lib/audioEngine';

interface InterviewConsistencyCalendarProps {
  interviewHistory: MockInterviewRecord[];
  streakState: DailyStreakState;
  onOpenReportModal: (record: MockInterviewRecord) => void;
  onOpenAudioReplay?: (record: MockInterviewRecord) => void;
  onStartInterview: () => void;
  onCompareSessions?: (sessionA: MockInterviewRecord, sessionB: MockInterviewRecord) => void;
}

export default function InterviewConsistencyCalendar({
  interviewHistory,
  streakState,
  onOpenReportModal,
  onOpenAudioReplay,
  onStartInterview,
  onCompareSessions
}: InterviewConsistencyCalendarProps) {
  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayDateStr, setSelectedDayDateStr] = useState<string>(() => getIsoDateStr(new Date()));
  const [filterMode, setFilterMode] = useState<'all' | 'interviews' | 'passing'>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const handlePrevMonth = () => {
    audioEngine.playLoFiChord();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    audioEngine.playLoFiChord();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    audioEngine.playLoFiChord();
    const today = new Date();
    setCurrentDate(today);
    setSelectedDayDateStr(getIsoDateStr(today));
  };

  // Map interviews by ISO date string (YYYY-MM-DD)
  const interviewsByDate = useMemo(() => {
    const map: Record<string, MockInterviewRecord[]> = {};

    interviewHistory.forEach(rec => {
      let iso = '';
      if (rec.timestamp) {
        iso = getIsoDateStr(new Date(rec.timestamp));
      } else if (rec.dateStr) {
        const parsed = new Date(rec.dateStr);
        if (!isNaN(parsed.getTime())) {
          iso = getIsoDateStr(parsed);
        }
      }

      if (!iso) {
        iso = getIsoDateStr(new Date());
      }

      if (!map[iso]) map[iso] = [];
      map[iso].push(rec);
    });

    return map;
  }, [interviewHistory]);

  // Streak completion dates
  const completionDatesSet = useMemo(() => {
    return new Set(streakState.completionDates || []);
  }, [streakState.completionDates]);

  // Calendar Grid generation
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const totalDays = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday, 1 is Mon...

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      interviews: MockInterviewRecord[];
      hasStreakCheckin: boolean;
    }> = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dNum = prevMonthLastDay - i;
      const dObj = new Date(year, month - 1, dNum);
      const iso = getIsoDateStr(dObj);
      days.push({
        dateStr: iso,
        dayNumber: dNum,
        isCurrentMonth: false,
        isToday: false,
        interviews: interviewsByDate[iso] || [],
        hasStreakCheckin: completionDatesSet.has(iso)
      });
    }

    // Current month days
    const todayIso = getIsoDateStr(new Date());
    for (let d = 1; d <= totalDays; d++) {
      const dObj = new Date(year, month, d);
      const iso = getIsoDateStr(dObj);
      days.push({
        dateStr: iso,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: iso === todayIso,
        interviews: interviewsByDate[iso] || [],
        hasStreakCheckin: completionDatesSet.has(iso)
      });
    }

    // Next month filler days to complete grid (up to multiple of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const dObj = new Date(year, month + 1, i);
      const iso = getIsoDateStr(dObj);
      days.push({
        dateStr: iso,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: false,
        interviews: interviewsByDate[iso] || [],
        hasStreakCheckin: completionDatesSet.has(iso)
      });
    }

    return days;
  }, [year, month, interviewsByDate, completionDatesSet]);

  // Selected Day's interview sessions
  const selectedDayInterviews = useMemo(() => {
    const list = interviewsByDate[selectedDayDateStr] || [];
    if (filterMode === 'passing') {
      return list.filter(r => (r.overallScore || 0) >= 85);
    }
    return list;
  }, [interviewsByDate, selectedDayDateStr, filterMode]);

  const selectedDayHasCheckin = completionDatesSet.has(selectedDayDateStr);

  // Month Statistics
  const monthStats = useMemo(() => {
    let totalMonthInterviews = 0;
    let totalScoreSum = 0;
    let activeDaysCount = 0;
    let highestScore = 0;

    calendarDays.forEach(day => {
      if (day.isCurrentMonth) {
        if (day.interviews.length > 0 || day.hasStreakCheckin) {
          activeDaysCount++;
        }
        day.interviews.forEach(rec => {
          totalMonthInterviews++;
          const score = rec.overallScore || 0;
          totalScoreSum += score;
          if (score > highestScore) highestScore = score;
        });
      }
    });

    const avgScore = totalMonthInterviews > 0 ? Math.round(totalScoreSum / totalMonthInterviews) : 0;

    return {
      activeDaysCount,
      totalMonthInterviews,
      avgScore,
      highestScore
    };
  }, [calendarDays]);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-3xl border border-brand-slate/20 shadow-xs overflow-hidden space-y-5 p-5 sm:p-6">
      {/* Calendar Top Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-slate/15 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-brand-amber text-white flex items-center justify-center shadow-md shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-amber/20 text-brand-amber-dark border border-brand-amber/30">
                PRACTICE CONSISTENCY CALENDAR
              </span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-black text-brand-charcoal mt-0.5">
              {monthName}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center p-0.5 rounded-xl bg-brand-sand/40 border border-brand-slate/15 text-xs font-bold">
            <button
              onClick={() => {
                setFilterMode('all');
                audioEngine.playLoFiChord();
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-brand-charcoal shadow-2xs font-black' : 'text-brand-slate'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => {
                setFilterMode('interviews');
                audioEngine.playLoFiChord();
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'interviews' ? 'bg-white text-brand-charcoal shadow-2xs font-black' : 'text-brand-slate'
              }`}
            >
              Mocks Only
            </button>
            <button
              onClick={() => {
                setFilterMode('passing');
                audioEngine.playLoFiChord();
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                filterMode === 'passing' ? 'bg-white text-brand-charcoal shadow-2xs font-black' : 'text-brand-slate'
              }`}
            >
              Passing (≥85%)
            </button>
          </div>

          {/* Month Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-brand-sand/30 hover:bg-brand-sand/70 text-brand-charcoal transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl bg-brand-sand/40 hover:bg-brand-sand/80 text-brand-charcoal text-xs font-bold transition-colors cursor-pointer font-mono"
            >
              Today
            </button>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-brand-sand/30 hover:bg-brand-sand/70 text-brand-charcoal transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-brand-sand/15 border border-brand-slate/15">
          <span className="text-[10px] font-mono uppercase text-brand-muted block">Active Days</span>
          <div className="text-lg sm:text-xl font-black font-display text-brand-charcoal mt-0.5">
            {monthStats.activeDaysCount} Days
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-brand-sand/15 border border-brand-slate/15">
          <span className="text-[10px] font-mono uppercase text-brand-muted block">Mocks Completed</span>
          <div className="text-lg sm:text-xl font-black font-display text-brand-charcoal mt-0.5">
            {monthStats.totalMonthInterviews} Rounds
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-brand-sand/15 border border-brand-slate/15">
          <span className="text-[10px] font-mono uppercase text-brand-muted block">Monthly Avg Score</span>
          <div className="text-lg sm:text-xl font-black font-display text-emerald-700 mt-0.5">
            {monthStats.avgScore ? `${monthStats.avgScore}%` : 'N/A'}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-brand-sand/15 border border-brand-slate/15">
          <span className="text-[10px] font-mono uppercase text-brand-muted block">Highest Score</span>
          <div className="text-lg sm:text-xl font-black font-display text-purple-700 mt-0.5">
            {monthStats.highestScore ? `${monthStats.highestScore}%` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-brand-slate/15 rounded-2xl overflow-hidden shadow-2xs">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 bg-brand-sand/30 border-b border-brand-slate/15 text-center py-2.5 text-[11px] font-mono font-bold text-brand-slate uppercase tracking-wider">
          {dayNames.map((name) => (
            <div key={name}>{name}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-brand-slate/10 bg-slate-50/50">
          {calendarDays.map((day, idx) => {
            const hasInterviews = day.interviews.length > 0;
            const isSelected = day.dateStr === selectedDayDateStr;

            // Highest score for the day
            const topScore = hasInterviews 
              ? Math.max(...day.interviews.map(r => r.overallScore || 0)) 
              : null;

            return (
              <div
                key={day.dateStr + idx}
                onClick={() => {
                  setSelectedDayDateStr(day.dateStr);
                  audioEngine.playLoFiChord();
                }}
                className={`min-h-[75px] sm:min-h-[90px] p-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  !day.isCurrentMonth ? 'bg-slate-100/60 opacity-40' : 'bg-white hover:bg-brand-sand/20'
                } ${
                  isSelected ? 'ring-2 ring-brand-charcoal z-10 bg-amber-50/40' : ''
                }`}
              >
                {/* Date Number and Today Marker */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${
                    day.isToday 
                      ? 'w-6 h-6 rounded-full bg-brand-charcoal text-white flex items-center justify-center shadow-xs' 
                      : day.isCurrentMonth ? 'text-brand-charcoal' : 'text-brand-muted'
                  }`}>
                    {day.dayNumber}
                  </span>

                  {day.hasStreakCheckin && (
                    <span title="Daily learning streak check-in recorded" className="text-orange-500">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" />
                    </span>
                  )}
                </div>

                {/* Interview Session Pills & Score Badge */}
                <div className="space-y-1 mt-1">
                  {hasInterviews && (
                    <div className="space-y-0.5">
                      {day.interviews.slice(0, 2).map((rec) => {
                        const score = rec.overallScore || 0;
                        const isHigh = score >= 85;
                        const isMid = score >= 70;

                        return (
                          <div
                            key={rec.id}
                            className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold truncate flex items-center justify-between border ${
                              isHigh 
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                                : isMid 
                                ? 'bg-amber-50 text-amber-900 border-amber-300' 
                                : 'bg-rose-50 text-rose-900 border-rose-300'
                            }`}
                            title={`${rec.roleTrack}: ${score}% (${rec.hiringDecision})`}
                          >
                            <span className="truncate">{rec.roleTrack.split(' ')[0]}</span>
                            <span className="font-black shrink-0 ml-1">{score}%</span>
                          </div>
                        );
                      })}

                      {day.interviews.length > 2 && (
                        <div className="text-[9px] font-mono text-brand-muted text-center font-bold">
                          +{day.interviews.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-brand-sand/15 border border-brand-slate/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-slate/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-brand-muted">
              Selected Date:
            </span>
            <h4 className="font-display font-black text-sm text-brand-charcoal">
              {new Date(selectedDayDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h4>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {selectedDayHasCheckin && (
              <span className="text-orange-700 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                <span>Streak Check-in Completed</span>
              </span>
            )}
            <span className="text-brand-slate">
              <strong>{selectedDayInterviews.length}</strong> mock interview session(s)
            </span>
          </div>
        </div>

        {/* Sessions list on selected day */}
        {selectedDayInterviews.length > 0 ? (
          <div className="space-y-2.5">
            {selectedDayInterviews.map((rec) => (
              <div 
                key={rec.id}
                className="p-3.5 rounded-xl bg-white border border-brand-slate/20 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-amber/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-xs sm:text-sm text-brand-charcoal">
                      {rec.roleTrack}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-brand-sand text-brand-slate border border-brand-slate/15">
                      {rec.difficulty || 'Mid-Level'}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded ${
                      rec.hiringDecision === 'Strong Hire' ? 'bg-emerald-100 text-emerald-800' :
                      rec.hiringDecision === 'Hire' ? 'bg-teal-100 text-teal-800' :
                      rec.hiringDecision === 'Leaning Hire' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rec.hiringDecision}
                    </span>
                  </div>

                  <div className="text-[11px] text-brand-muted font-mono flex items-center gap-3">
                    <span>Interviewer: <strong>{rec.interviewerName}</strong></span>
                    <span>•</span>
                    <span>Duration: <strong>{Math.round(rec.durationSeconds / 60)} mins</strong></span>
                    <span>•</span>
                    <span>Tone: <strong>{rec.speechSentimentReport?.dominantTone || 'Analytical'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="text-right mr-2">
                    <div className="text-[10px] font-mono uppercase text-brand-muted">Score</div>
                    <div className={`text-base font-black font-display ${
                      rec.overallScore >= 85 ? 'text-emerald-700' :
                      rec.overallScore >= 70 ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      {rec.overallScore}%
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onOpenReportModal(rec);
                      audioEngine.playLoFiChord();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-amber" />
                    <span>Scorecard</span>
                  </button>

                  {onOpenAudioReplay && (
                    <button
                      onClick={() => {
                        onOpenAudioReplay(rec);
                        audioEngine.playLoFiChord();
                      }}
                      className="p-1.5 rounded-xl bg-white border border-brand-slate/20 hover:bg-brand-sand/40 text-blue-600 transition-colors cursor-pointer"
                      title="Listen to Spoken Audio Replay"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-white border border-dashed border-brand-slate/25 text-center space-y-2">
            <Video className="w-6 h-6 text-brand-muted mx-auto" />
            <p className="text-xs text-brand-muted">
              No mock interview rounds recorded on this date.
            </p>
            <button
              onClick={() => {
                audioEngine.playLoFiChord();
                onStartInterview();
              }}
              className="px-4 py-2 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-brand-charcoal text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Mock Interview Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
