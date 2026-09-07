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
  const { lang, t } = useLanguage();
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

  const socialChannels = [
    {
      id: 'twitter',
      title: t('socialShare.twitter'),
      ariaLabel: 'Share on X / Twitter',
      onClick: handleShareTwitter,
      hoverBorder: 'hover:border-white/60 hover:bg-white/20',
      textColor: 'text-white',
      accentColor: 'rgba(255, 255, 255, 0.35)',
      renderIcon: () => (
        <span className="font-bold text-xs group-hover:scale-120 transition-transform duration-200 inline-block select-none">
          𝕏
        </span>
      ),
    },
    {
      id: 'linkedin',
      title: t('socialShare.linkedin'),
      ariaLabel: 'Share on LinkedIn',
      onClick: handleShareLinkedIn,
      hoverBorder: 'hover:border-blue-400/60 hover:bg-blue-500/20',
      textColor: 'text-blue-300 group-hover:text-blue-200',
      accentColor: 'rgba(96, 165, 250, 0.4)',
      renderIcon: () => (
        <span className="font-bold text-xs group-hover:scale-120 transition-transform duration-200 inline-block select-none">
          in
        </span>
      ),
    },
    {
      id: 'whatsapp',
      title: t('socialShare.whatsapp'),
      ariaLabel: 'Share on WhatsApp',
      onClick: handleShareWhatsApp,
      hoverBorder: 'hover:border-emerald-400/60 hover:bg-emerald-500/20',
      textColor: 'text-emerald-400 group-hover:text-emerald-300',
      accentColor: 'rgba(52, 211, 153, 0.4)',
      renderIcon: () => (
        <Send className="w-4 h-4 group-hover:scale-120 transition-transform duration-200" />
      ),
    },
    {
      id: 'telegram',
      title: t('socialShare.telegram'),
      ariaLabel: 'Share on Telegram',
      onClick: handleShareTelegram,
      hoverBorder: 'hover:border-sky-400/60 hover:bg-sky-500/20',
      textColor: 'text-sky-400 group-hover:text-sky-300',
      accentColor: 'rgba(56, 189, 248, 0.4)',
      renderIcon: () => (
        <ExternalLink className="w-4 h-4 group-hover:scale-120 transition-transform duration-200" />
      ),
    },
  ];

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
        <div className="absolute top-0 end-0 w-80 h-80 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none -me-20 -mt-20" />
        <div className="absolute bottom-0 start-0 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ms-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left Text & Stats */}
          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/20 border border-brand-amber/40 text-brand-amber text-xs font-black uppercase tracking-wider font-mono">
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('socialShare.shareYourAIJourney')}</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              {t('socialShare.spreadKnowledge')}
            </h3>

            <p className="text-xs sm:text-sm text-brand-sand/80 leading-relaxed">
              {t('socialShare.inspireOthers')}
            </p>

            {/* Learner Stats Pill Card */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-brand-amber font-mono font-bold">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse" />
                <span>{streakCount} {t('socialShare.dayStreak')}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-emerald-400 font-mono font-bold">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>{completedLessons}/9 {t('socialShare.chaptersMastered')}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white/90 font-mono font-bold">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t('socialShare.freeAndOpen')}</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col w-full md:w-auto shrink-0 gap-3">
            {/* 1-Click Copy Progress Link */}
            <motion.button
              onClick={handleCopyLink}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-56 flex items-center justify-center gap-2 px-5 py-3 bg-brand-amber hover:bg-amber-500 text-brand-charcoal rounded-2xl font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer group"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                  <span className="text-emerald-950 font-black">{t('socialShare.linkStatsCopied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{t('socialShare.copyShareLink')}</span>
                </>
              )}
            </motion.button>

            {/* Social Channels Row with Entry Soft Pulse & Hover Scaling */}
            <div className="grid grid-cols-4 gap-2">
              {socialChannels.map((channel, idx) => (
                <motion.button
                  key={channel.id}
                  onClick={channel.onClick}
                  initial={{ opacity: 0, y: 12, scale: 0.88 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: [0.88, 1.18, 0.95, 1.08, 1],
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.25 + idx * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    y: -3,
                    transition: { type: 'spring', stiffness: 450, damping: 17 }
                  }}
                  whileTap={{ scale: 0.92 }}
                  className={`group relative flex items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 ${channel.hoverBorder} ${channel.textColor} transition-colors cursor-pointer shadow-sm hover:shadow-lg`}
                  title={channel.title}
                  aria-label={channel.ariaLabel}
                >
                  {/* Soft pulse aura radiating when scrolled into view */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{
                      opacity: [0, 0.55, 0],
                      scale: [0.85, 1.35, 1.65],
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 1.3,
                      delay: 0.3 + idx * 0.1,
                      ease: 'easeOut',
                    }}
                    style={{ backgroundColor: channel.accentColor }}
                    className="absolute inset-0 rounded-xl pointer-events-none"
                  />

                  <span className="relative z-10 flex items-center justify-center">
                    {channel.renderIcon()}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
