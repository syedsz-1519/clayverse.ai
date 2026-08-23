import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  Clock, 
  Calendar, 
  Check, 
  Sparkles, 
  Volume2, 
  Download, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Target,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { PracticeReminderSettings } from '../types';
import { INTERVIEW_ROLES } from '../data/interviewData';
import { audioEngine } from '../lib/audioEngine';

interface PracticeReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchInterview?: (roleId?: string) => void;
}

const DEFAULT_REMINDER_SETTINGS: PracticeReminderSettings = {
  enabled: true,
  frequency: 'daily',
  reminderTime: '09:30',
  selectedDayOfWeek: 1, // Monday
  preferredRoleId: 'ai_ml_engineer',
  preferredDifficulty: 'Intermediate',
  browserNotifications: true,
  soundAlerts: true,
  streakDays: 3,
};

export default function PracticeReminderModal({
  isOpen,
  onClose,
  onLaunchInterview
}: PracticeReminderModalProps) {
  const { lang } = useLanguage();
  const [settings, setSettings] = useState<PracticeReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [testNotificationSent, setTestNotificationSent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing saved reminders
  useEffect(() => {
    try {
      const saved = localStorage.getItem('clay_practice_reminders');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    } catch (e) {
      console.warn('Failed to load reminders:', e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Request browser notification permissions
  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications are not supported in this browser environment.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        audioEngine.playLoFiChord();
        sendBrowserNotification('Practice Reminders Activated!', 'You will receive gentle daily AI mock interview practice alerts.');
      }
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  };

  // Trigger test notification
  const handleSendTestNotification = () => {
    audioEngine.playLoFiChord();
    setTestNotificationSent(true);

    sendBrowserNotification(
      '🧠 Clay AI Practice Reminder',
      `Time for your ${settings.preferredDifficulty} ${
        INTERVIEW_ROLES.find(r => r.id === settings.preferredRoleId)?.title || 'AI'
      } mock interview drill! Keep your streak alive.`
    );

    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  const sendBrowserNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://api.dicebear.com/7.x/bottts/svg?seed=ClayMentorAI',
        });
      } catch (e) {
        console.log('Notification API fallback:', e);
      }
    }
  };

  // Save Settings
  const handleSave = () => {
    try {
      localStorage.setItem('clay_practice_reminders', JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('clay_reminders_updated', { detail: settings }));
      audioEngine.playLoFiChord();
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  };

  // Export .ICS calendar schedule file
  const handleExportICS = () => {
    const roleTitle = INTERVIEW_ROLES.find(r => r.id === settings.preferredRoleId)?.title || 'AI Technical';
    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    
    // Create tomorrow at reminder time
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(hours || 9, minutes || 30, 0, 0);

    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const formatDateICS = (d: Date) => 
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const rrule = settings.frequency === 'daily' 
      ? 'RRULE:FREQ=DAILY' 
      : settings.frequency === 'weekdays' 
      ? 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR' 
      : 'RRULE:FREQ=WEEKLY';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Clay AI//Mock Interview Practice Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Clay AI Mock Interview: ${roleTitle}`,
      `DESCRIPTION:15-minute scheduled technical mock interview practice with AI audio interviewer and real camera tracking HUD on Clay AI.`,
      `DTSTART:${formatDateICS(startDate)}`,
      `DTEND:${formatDateICS(new Date(startDate.getTime() + 20 * 60000))}`,
      rrule,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT10M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: AI Mock Interview practice starting in 10 minutes`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Clay_AI_Interview_Practice_Schedule.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const PRESET_TIMES = [
    { label: 'Morning Drill', time: '09:00' },
    { label: 'Lunch Break', time: '13:00' },
    { label: 'Post-Work', time: '18:30' },
    { label: 'Night Owl', time: '21:30' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-brand-slate/20 shadow-2xl relative text-left flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-brand-slate/15 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-brand-amber/15 text-brand-amber-dark">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-brand-charcoal">
                  {lang === 'en' ? "Practice Reminders & Scheduling" : "Practice Schedule & Reminders"}
                </h3>
                <p className="text-xs text-brand-muted">
                  {lang === 'en' ? "Set consistent daily or weekly habits to master AI interviews" : "Rozana ya haftawar practice schedule banayein"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            
            {/* Streak & Active Status Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-amber/5 to-orange-500/10 border border-brand-amber/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-sm text-brand-charcoal">
                      {settings.streakDays}-Day Practice Streak Active
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      On Track
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Candidates who practice at least 3x per week score 28% higher in live rounds.
                  </p>
                </div>
              </div>

              {/* Master Toggle */}
              <div className="shrink-0">
                <button
                  onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.enabled ? 'bg-brand-amber' : 'bg-brand-slate/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.enabled ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5"
                  />
                </button>
              </div>
            </div>

            {settings.enabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-5"
              >
                {/* Frequency Selector */}
                <div>
                  <label className="text-xs font-mono font-bold uppercase text-brand-slate block mb-2">
                    Reminder Frequency
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'daily', label: 'Daily', desc: 'Every day' },
                      { id: 'weekdays', label: 'Weekdays', desc: 'Mon - Fri' },
                      { id: 'weekly', label: 'Weekly', desc: '1x / week' },
                      { id: 'custom', label: 'Every 2 Days', desc: 'Alternate' },
                    ].map(freq => {
                      const isSelected = settings.frequency === freq.id;
                      return (
                        <button
                          key={freq.id}
                          onClick={() => setSettings(s => ({ ...s, frequency: freq.id as any }))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-brand-amber/10 border-brand-amber text-brand-amber-dark font-bold shadow-xs' 
                              : 'bg-white border-brand-slate/15 text-brand-slate hover:bg-brand-sand/30'
                          }`}
                        >
                          <div className="text-xs font-display">{freq.label}</div>
                          <div className="text-[10px] text-brand-muted">{freq.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reminder Time Picker & Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono font-bold uppercase text-brand-slate">
                      Preferred Time of Day
                    </label>
                    <span className="text-[11px] font-mono text-brand-muted">
                      Scheduled for: <strong className="text-brand-charcoal">{settings.reminderTime}</strong>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {PRESET_TIMES.map(preset => (
                      <button
                        key={preset.time}
                        onClick={() => setSettings(s => ({ ...s, reminderTime: preset.time }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          settings.reminderTime === preset.time
                            ? 'bg-brand-charcoal text-white font-bold shadow-2xs'
                            : 'bg-brand-sand/40 text-brand-slate hover:bg-brand-sand'
                        }`}
                      >
                        {preset.label} ({preset.time})
                      </button>
                    ))}
                  </div>

                  {/* Custom Time Input */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Clock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="time"
                        value={settings.reminderTime}
                        onChange={(e) => setSettings(s => ({ ...s, reminderTime: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2 bg-brand-sand/20 border border-brand-slate/20 rounded-xl text-xs font-mono font-bold text-brand-charcoal focus:outline-none focus:border-brand-amber"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Track & Difficulty Defaults */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-brand-slate block mb-1.5">
                      Focus Practice Track
                    </label>
                    <select
                      value={settings.preferredRoleId}
                      onChange={(e) => setSettings(s => ({ ...s, preferredRoleId: e.target.value }))}
                      className="w-full p-2.5 bg-brand-sand/20 border border-brand-slate/20 rounded-xl text-xs font-bold text-brand-charcoal focus:outline-none focus:border-brand-amber cursor-pointer"
                    >
                      {INTERVIEW_ROLES.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold uppercase text-brand-slate block mb-1.5">
                      Default Difficulty Level
                    </label>
                    <div className="flex items-center gap-1.5">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
                        <button
                          key={diff}
                          onClick={() => setSettings(s => ({ ...s, preferredDifficulty: diff }))}
                          className={`flex-1 py-2 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                            settings.preferredDifficulty === diff
                              ? 'bg-brand-amber text-white shadow-xs'
                              : 'bg-brand-sand/30 text-brand-slate hover:bg-brand-sand/60'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notification Delivery Channels */}
                <div className="p-4 rounded-2xl bg-brand-sand/20 border border-brand-slate/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-amber" />
                      <span className="text-xs font-bold text-brand-charcoal">Browser Push Notifications</span>
                    </div>

                    {notificationPermission === 'granted' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                        ✓ Allowed
                      </span>
                    ) : (
                      <button
                        onClick={handleRequestPermission}
                        className="px-2.5 py-1 bg-brand-amber/15 text-brand-amber-dark hover:bg-brand-amber/25 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Enable in Browser
                      </button>
                    )}
                  </div>

                  {/* Test Notification and Calendar Sync Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-brand-slate/10">
                    <button
                      onClick={handleSendTestNotification}
                      className="px-3 py-1.5 bg-white hover:bg-brand-sand/30 border border-brand-slate/20 rounded-xl text-[11px] font-bold text-brand-charcoal transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                      <span>{testNotificationSent ? "Test Alert Sent!" : "Test Alert Notification"}</span>
                    </button>

                    <button
                      onClick={handleExportICS}
                      className="px-3 py-1.5 bg-white hover:bg-brand-sand/30 border border-brand-slate/20 rounded-xl text-[11px] font-bold text-brand-charcoal transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Export to Calendar (.ics)</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-brand-slate/15 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-brand-slate/20 text-xs font-bold text-brand-slate hover:bg-brand-sand/40 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved Schedule!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Reminder Schedule</span>
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
