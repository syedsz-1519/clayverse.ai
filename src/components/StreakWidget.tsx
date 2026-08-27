import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame, CheckCircle2, Award, Calendar, Sparkles, Shield } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import Confetti from './Confetti';

export default function StreakWidget() {
  const { lang } = useLanguage();
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('clay_streak_days') || localStorage.getItem('clay_daily_streak');
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(() => {
    try {
      const lastCheckin = localStorage.getItem('clay_last_checkin_date');
      const today = new Date().toISOString().split('T')[0];
      return lastCheckin === today;
    } catch {
      return false;
    }
  });

  const [showConfetti, setShowConfetti] = useState(false);

  const handleCheckin = () => {
    const today = new Date().toISOString().split('T')[0];
    const newCount = hasCheckedInToday ? streakCount : streakCount + 1;
    
    setStreakCount(newCount);
    setHasCheckedInToday(true);
    setShowConfetti(true);

    try {
      localStorage.setItem('clay_streak_days', String(newCount));
      localStorage.setItem('clay_daily_streak', String(newCount));
      localStorage.setItem('clay_last_checkin_date', today);
      window.dispatchEvent(new CustomEvent('clay_streak_updated', { detail: newCount }));
    } catch {}

    setTimeout(() => setShowConfetti(false), 3000);
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // Monday is 0

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-white/[0.1] shadow-sm relative overflow-hidden">
      {showConfetti && <Confetti />}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-amber">
              Daily Study Streak
            </div>
            <div className="text-xl sm:text-2xl font-bold font-display text-brand-charcoal">
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'} Streak
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckin}
          disabled={hasCheckedInToday}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            hasCheckedInToday
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:scale-105'
          }`}
        >
          {hasCheckedInToday ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Checked in Today</span>
            </>
          ) : (
            <>
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Check In (+1 Day)</span>
            </>
          )}
        </button>
      </div>

      {/* 7-Day Visual Ring Tracker */}
      <div className="grid grid-cols-7 gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
        {daysOfWeek.map((day, idx) => {
          const isPastOrToday = idx <= currentDayIndex;
          const isToday = idx === currentDayIndex;

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  isToday && hasCheckedInToday
                    ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-400/40'
                    : isToday
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-400/40 animate-pulse'
                    : isPastOrToday
                    ? 'bg-amber-500/20 text-brand-amber'
                    : 'bg-black/5 dark:bg-white/5 text-brand-muted opacity-50'
                }`}
              >
                {day}
              </div>
              <span className="text-[10px] font-mono text-brand-muted">
                {isToday ? 'Today' : ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* Streak Perks Status */}
      <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs text-brand-muted">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Streak Freeze: Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-amber font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Next Goal: 7 Days Badge</span>
        </div>
      </div>
    </div>
  );
}
