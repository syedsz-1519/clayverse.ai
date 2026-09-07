import React from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight, BookOpen, Volume2, Sparkles, Play, Zap, Award } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import Button from './ui/Button';

interface HeroProps {
  onStartFirstLesson?: () => void;
  onExploreCurriculum?: () => void;
}

export default function Hero({ onStartFirstLesson, onExploreCurriculum }: HeroProps) {
  const { t, lang } = useLanguage();

  return (
    <section 
      id="hero" 
      className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 py-20 overflow-hidden bg-white"
    >
      {/* Subtle Grid Pattern - Professional Touch */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0F172A 1px, transparent 1px),
            linear-gradient(to bottom, #0F172A 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating Gradient Orbs - Subtle & Professional */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20 animate-pulse" 
           style={{ animationDuration: '8s' }} 
      />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full blur-3xl opacity-20 animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '2s' }} 
      />

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto text-center z-10 space-y-8">
        
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 border border-emerald-200/60 shadow-sm"
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-slate-700">
            {lang === 'en' ? '100% Beginner-Friendly • Zero Math • Human-Designed' : '100% शुरुआती के लिए • बिना गणित'}
          </span>
        </motion.div>

        {/* Main Headline - Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
            {lang === 'en' ? (
              <>
                AI is not magic.
                <br />
                It's{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
                    pattern-matching
                  </span>
                  <svg className="absolute -bottom-3 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10C50 5 100 2 150 5C200 8 250 10 298 7" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.4"/>
                        <stop offset="50%" stopColor="#EF4444" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.4"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                {' '}at scale.
              </>
            ) : lang === 'te' ? (
              <>
                AI అంటే మాయ కాదు.
                <br />
                ఇది{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-500">
                  ప్యాటర్న్ మ్యాచింగ్
                </span>
              </>
            ) : (
              <>
                AI koi jaadu nahi.
                <br />
                Ye{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-500">
                  pattern matching
                </span>{' '}
                hai.
              </>
            )}
          </h1>
        </motion.div>

        {/* Subtitle - Value Proposition */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          {lang === 'en' 
            ? 'Master modern AI, ChatGPT, and machine learning through interactive lessons — without overwhelming complexity or mathematical jargon.'
            : lang === 'te'
            ? 'ఆధునిక AI, ChatGPT మరియు మెషిన్ లెర్నింగ్‌ను ఇంటరాక్టివ్ పాఠాల ద్వారా నేర్చుకోండి.'
            : 'ChatGPT, AI aur Machine Learning ko interactive lessons ke zariye samjhein.'
          }
        </motion.p>

        {/* CTA Buttons - Professional & Functional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play className="w-5 h-5" fill="currentColor" />}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={() => {
              console.log('Start Learning button clicked');
              if (onStartFirstLesson) {
                onStartFirstLesson();
              } else {
                const targets = ['what-is-ai', 'curriculum', 'main-content'];
                for (const targetId of targets) {
                  const el = document.getElementById(targetId);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    break;
                  }
                }
              }
            }}
            className="min-w-[260px] shadow-lg shadow-orange-500/20"
          >
            {lang === 'en' ? 'Start Learning Free' : lang === 'te' ? 'ఉచితంగా నేర్చుకోండి' : 'Free Seekhein'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            leftIcon={<BookOpen className="w-5 h-5" />}
            onClick={() => {
              console.log('Explore Curriculum button clicked');
              if (onExploreCurriculum) {
                onExploreCurriculum();
              } else {
                const el = document.getElementById('curriculum');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  console.warn('Curriculum section not found');
                }
              }
            }}
            className="min-w-[260px]"
          >
            {lang === 'en' ? 'Browse Curriculum' : lang === 'te' ? 'పాఠ్యాంశాలు చూడండి' : 'Syllabus Dekhen'}
          </Button>
        </motion.div>

        {/* Feature Pills - Professional Design */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-6"
        >
          {[
            { 
              icon: Zap, 
              label: lang === 'en' ? 'Zero Math' : 'बिना गणित', 
              gradient: 'from-emerald-500 to-teal-500',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200',
              text: 'text-emerald-700'
            },
            { 
              icon: Volume2, 
              label: lang === 'en' ? 'Audio Narration' : 'ऑडियो', 
              gradient: 'from-blue-500 to-cyan-500',
              bg: 'bg-blue-50',
              border: 'border-blue-200',
              text: 'text-blue-700'
            },
            { 
              icon: Sparkles, 
              label: lang === 'en' ? 'Interactive' : 'इंटरैक्टिव', 
              gradient: 'from-purple-500 to-pink-500',
              bg: 'bg-purple-50',
              border: 'border-purple-200',
              text: 'text-purple-700'
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className={`flex items-center gap-2.5 ${feature.bg} border ${feature.border} px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-default`}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm font-semibold ${feature.text}`}>
                  {feature.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Social Proof - Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="pt-8 flex items-center justify-center gap-8 text-sm text-slate-500"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white" />
              ))}
            </div>
            <span className="font-medium">
              {lang === 'en' ? '10,000+ learners' : '10,000+ सीखने वाले'}
            </span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-slate-300" />
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <span className="font-medium">
              {lang === 'en' ? '4.9/5 Rating' : '4.9/5 रेटिंग'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
