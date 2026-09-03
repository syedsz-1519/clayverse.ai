import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Wifi, 
  WifiOff, 
  HardDriveDownload, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  HelpCircle,
  Database,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { useLanguage } from '../hooks/useLanguage';
import { CORE_OFFLINE_CURRICULUM } from '../lib/offlineStorage';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OfflineManagerModal({ isOpen, onClose }: OfflineManagerModalProps) {
  const { isOnline, stats, cacheAll, clearCache } = useOfflineStatus();
  const { lang, t } = useLanguage();
  const [isCaching, setIsCaching] = useState(false);
  const [cacheSuccessToast, setCacheSuccessToast] = useState(false);

  const handleCacheAll = () => {
    setIsCaching(true);
    setTimeout(() => {
      cacheAll();
      setIsCaching(false);
      setCacheSuccessToast(true);
      setTimeout(() => setCacheSuccessToast(false), 2500);
    }, 400);
  };

  const handleClear = () => {
    if (window.confirm('Clear cached offline curriculum from this browser?')) {
      clearCache();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="offline-manager-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-[#FCFAF6] dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between bg-white dark:bg-zinc-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-brand-amber flex items-center justify-center shadow-xs">
                <HardDriveDownload className="w-5 h-5" />
              </div>
              <div>
                <h2 id="offline-manager-title" className="text-xl font-bold font-display text-brand-charcoal">
                  {t('offline.curriculumAndCache')}
                </h2>
                <p className="text-xs text-brand-muted">
                  {t('offline.studyAnywhere')}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-brand-muted hover:text-brand-charcoal hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Close offline manager"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Status Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card 1: Network Connection */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-3 shadow-xs">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isOnline ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-600'
                }`}>
                  {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-brand-muted">{t('offline.connection')}</div>
                  <div className="text-xs font-bold text-brand-charcoal">
                    {isOnline ? t('offline.onlineConnected') : t('offline.offlineNoData')}
                  </div>
                </div>
              </div>

              {/* Card 2: Cached Modules */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-brand-muted">{t('offline.cachedModules')}</div>
                  <div className="text-xs font-bold text-brand-charcoal">
                    {stats.cachedCount} / {stats.totalLessons} {t('offline.available')}
                  </div>
                </div>
              </div>

              {/* Card 3: Storage Footprint */}
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-3 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-bold text-brand-muted">{t('offline.storageFootprint')}</div>
                  <div className="text-xs font-bold text-brand-charcoal">
                    {stats.storageUsedFormatted} ({t('offline.lightweight')})
                  </div>
                </div>
              </div>
            </div>

            {/* Offline Readiness Highlights */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-charcoal">
                <Sparkles className="w-4 h-4 text-brand-amber" />
                <span>{t('offline.whatWorksOffline')}</span>
              </div>
              <ul className="text-xs text-brand-slate space-y-1 pl-6 list-disc">
                <li>All 12 structured curriculum lessons with zero-math analogies in Telugu, Hindi, Urdu, Tamil, & English.</li>
                <li>Interactive terminology flashcards and offline knowledge-check quizzes.</li>
                <li>Study streak tracker and bookmarks (stored in local browser cache, synced automatically when reconnected).</li>
                <li>High-speed instant navigation with zero mobile data consumption.</li>
              </ul>
            </div>

            {/* Curriculum Modules Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-display uppercase tracking-wider text-brand-charcoal">
                  {t('offline.cachedCoreModules')}
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('offline.readyForOfflineStudy')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {CORE_OFFLINE_CURRICULUM.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="w-5 h-5 rounded-md bg-brand-amber/15 text-brand-amber text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {m.lessonNum}
                      </span>
                      <span className="font-semibold text-brand-charcoal truncate">
                        {m.titleEn}
                      </span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ms-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t border-black/[0.08] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('offline.clearCache')}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCacheAll}
                disabled={isCaching}
                className="px-5 py-2.5 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCaching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('offline.cachingContent')}</span>
                  </>
                ) : (
                  <>
                    <HardDriveDownload className="w-3.5 h-3.5" />
                    <span>{cacheSuccessToast ? t('offline.allContentSynced') : t('offline.reCacheAllLessons')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
