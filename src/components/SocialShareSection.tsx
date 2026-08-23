import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Trophy, 
  Flame, 
  BookOpen, 
  GraduationCap, 
  Send, 
  ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../hooks/useLanguage';
import ClayLogo from './ClayLogo';

interface SocialShareSectionProps {
  currentChapterTitle?: string;
}

export default function SocialShareSection({ currentChapterTitle }: SocialShareSectionProps) {
  const { lang } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);
  const [streakCount, setStreakCount] = useState<number>(3);
  const [completedLessons, setCompletedLessons] = useState<number>(5);

  useEffect(() => {
    // Read cached learner metrics
    const cachedStreak = localStorage.getItem('clay_quiz_streak_count');
    if (cachedStreak) {
      const parsed = parseInt(cachedStreak, 10);
      if (!isNaN(parsed) && parsed > 0) setStreakCount(parsed);
    }

    const cachedProgress = localStorage.getItem('clay_reading_progress');
    if (cachedProgress) {
      const parsed = parseFloat(cachedProgress);
      if (!isNaN(parsed)) {
        const estimatedLessons = Math.min(9, Math.max(1, Math.round((parsed / 100) * 9)));
        setCompletedLessons(estimatedLessons);
      }
    }
  }, []);

  const shareUrl = window.location.origin;
  const shareTitle = "Clayverse AI — An Interactive, Zero-Jargon Guide to Artificial Intelligence";
  const shareMessage = `🚀 I'm learning Artificial Intelligence on @ClayverseAI! Demystifying neural networks, generative LLMs, and prompt engineering with tactile interactive sandboxes.\n🔥 My Streak: ${streakCount} Days\n📚 Lessons: ${completedLessons}/9 Mastered\n\nTry it free here: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleShareTwitter = () => {
    const tweetText = encodeURIComponent(
      `🚀 Exploring modern Artificial Intelligence with @ClayverseAI!\n\nZero jargon, tactile visual sandboxes, and hands-on LLM drills.\n🔥 Current Streak: ${streakCount} Days | 📚 ${completedLessons}/9 Lessons\n\nTry it here:`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Check out Clayverse AI — a hands-on, zero-jargon interactive guide to mastering AI, Neural Networks & Prompt Engineering:\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Check out Clayverse AI — an interactive, beginner-safe guide to Artificial Intelligence with tactile simulations!`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-charcoal via-[#23272F] to-[#1A1D23] text-white p-6 sm:p-8 md:p-10 border border-brand-amber/25 shadow-xl"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Text & Stats */}
          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-xs font-black uppercase tracking-wider font-mono">
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? "Share Your AI Journey" : lang === 'te' ? "మీ పురోగతిని పంచుకోండి" : "Apna Safar Share Karein"}</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {lang === 'en' 
                ? "Spread the knowledge with friends & peers" 
                : lang === 'te'
                ? "స్నేహితులతో జ్ఞానాన్ని పంచుకోండి"
                : "Doston aur classmates ke sath AI seekhein"}
            </h3>

            <p className="text-xs sm:text-sm text-brand-sand/80 leading-relaxed">
              {lang === 'en'
                ? "Inspire others to learn AI without fear, math jargon, or confusion. Share your study milestones and invite colleagues to test their skills."
                : lang === 'te'
                ? "కృత్రిమ మేధస్సును సులభంగా అర్థం చేసుకునేలా ఇతరులకు సహాయం చేయండి. మీ పురోగతిని పంచుకోండి."
                : "Bina kisi darr ya mushkil formulas ke AI seekhne me doston ki madad karein aur apna learning link share karein."}
            </p>

            {/* Learner Stats Pill Card */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-brand-amber font-mono font-bold">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse" />
                <span>{streakCount} {lang === 'en' ? "Day Streak" : "Din ki Streak"}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-emerald-400 font-mono font-bold">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>{completedLessons}/9 {lang === 'en' ? "Chapters Mastered" : "Lessons Seekhe"}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white/90 font-mono font-bold">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>100% Free & Open</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col w-full md:w-auto shrink-0 gap-3">
            {/* 1-Click Copy Progress Link */}
            <button
              onClick={handleCopyLink}
              className="w-full md:w-56 flex items-center justify-center gap-2 px-5 py-3 bg-brand-amber hover:bg-amber-500 text-brand-charcoal rounded-2xl font-black text-xs sm:text-sm shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer group"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                  <span className="text-emerald-950 font-black">{lang === 'en' ? "Link & Stats Copied!" : "Link Copy Ho Gaya!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{lang === 'en' ? "Copy Share Link" : "Link Copy Karein"}</span>
                </>
              )}
            </button>

            {/* Social Channels Row */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleShareTwitter}
                className="flex items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-brand-amber/50 text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Share on X (Twitter)"
                aria-label="Share on X"
              >
                <span className="font-bold text-xs">𝕏</span>
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="flex items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-brand-amber/50 text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Share on LinkedIn"
                aria-label="Share on LinkedIn"
              >
                <span className="font-bold text-xs">in</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-brand-amber/50 text-emerald-400 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Share on WhatsApp"
                aria-label="Share on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>

              <button
                onClick={handleShareTelegram}
                className="flex items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-brand-amber/50 text-sky-400 transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Share on Telegram"
                aria-label="Share on Telegram"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
