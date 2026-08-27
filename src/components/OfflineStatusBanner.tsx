import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, HardDriveDownload, CheckCircle2, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { useLanguage } from '../hooks/useLanguage';

interface OfflineStatusBannerProps {
  onOpenOfflineManager: () => void;
}

export default function OfflineStatusBanner({ onOpenOfflineManager }: OfflineStatusBannerProps) {
  const { isOffline, hasRecentSync, stats } = useOfflineStatus();
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      {/* 1. Offline Mode Indicator */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs font-semibold px-4 py-2 shadow-md relative z-40"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-white/20">
                <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span>
                {lang === 'te'
                  ? 'ఆఫ్‌లైన్ మోడ్ సక్రియంగా ఉంది: మొత్తం 12 AI మాడ్యూల్స్ మరియు క్విజ్‌లు ఇంటర్నెట్ లేకుండా పనిచేస్తాయి.'
                  : lang === 'hi'
                  ? 'ऑफलाइन मोड सक्रिय: सभी 12 एआई लेसन्स और क्विज बिना इंटरनेट के सुरक्षित रूप से उपलब्ध हैं।'
                  : 'Offline Mode Active: All 12 AI curriculum modules and quizzes are cached for zero-data studying.'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-full font-mono">
                {stats.cachedCount}/{stats.totalLessons} Lessons Cached
              </span>

              <button
                onClick={onOpenOfflineManager}
                className="underline hover:text-amber-200 transition-colors font-bold text-xs cursor-pointer flex items-center gap-1"
              >
                <span>{lang === 'te' ? 'నిల్వ వివరాలు' : lang === 'hi' ? 'ऑफलाइन सेटिंग्स' : 'Manage Offline Cache'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Reconnection & Auto-Sync Notification */}
      {hasRecentSync && !isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="w-full bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 shadow-md relative z-40"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Wifi className="w-3.5 h-3.5" />
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {lang === 'te'
                ? 'తిరిగి ఆన్‌లైన్ వచ్చింది! ఆఫ్‌లైన్ ప్రోగ్రెస్ మరియు స్ట్రీక్ సమకాలీకరించబడింది.'
                : lang === 'hi'
                ? 'वापस ऑनलाइन! ऑफलाइन अध्ययन और प्रोग्रेस सफलतापूर्वक सिंक हो गई।'
                : 'Back Online! Your offline progress and streak have been synced.'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
