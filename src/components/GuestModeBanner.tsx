import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, UserCheck, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface GuestModeBannerProps {
  onOpenAuth: () => void;
}

export default function GuestModeBanner({ onOpenAuth }: GuestModeBannerProps) {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const user = localStorage.getItem('clay_user_profile');
      const dismissed = sessionStorage.getItem('clay_guest_banner_dismissed');
      if (!user && !dismissed) {
        setIsVisible(true);
      }
    } catch {}
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('clay_guest_banner_dismissed', 'true');
    } catch {}
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Guest Mode Status"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full bg-gradient-to-r from-amber-500/10 via-brand-amber/15 to-orange-500/10 border-b border-brand-amber/25 px-4 py-2 text-xs text-brand-charcoal"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse shrink-0" />
            <span className="font-semibold text-brand-charcoal">
              {lang === 'te'
                ? 'గెస్ట్ మోడ్ సక్రియంగా ఉంది: మీ స్ట్రీక్ మరియు ప్రోగ్రెస్ లోకల్‌గా సేవ్ చేయబడుతోంది.'
                : lang === 'hi'
                ? 'गेस्ट मोड एक्टिव: आपका प्रोग्रेस और स्ट्रीक डिवाइस में सुरक्षित है।'
                : 'Guest Mode Active: Your study streak and progress are saved locally.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="text-xs font-bold text-brand-amber hover:underline flex items-center gap-1 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                {lang === 'te' ? 'ఉచిత ప్రొఫైల్ సృష్టించండి' : lang === 'hi' ? 'फ्री अकाउंट बनाएं' : 'Sync to Cloud (Free)'}
              </span>
            </button>

            <button
              onClick={handleDismiss}
              className="p-1 text-brand-muted hover:text-brand-charcoal cursor-pointer rounded-full hover:bg-black/5"
              aria-label="Dismiss guest mode banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
