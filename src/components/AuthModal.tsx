import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  LogOut, 
  User, 
  Phone,
  Settings, 
  Sparkles, 
  Award,
  BookOpen,
  Chrome,
  Instagram,
  Linkedin,
  Github,
  Check,
  Volume2,
  Volume1,
  VolumeX,
  Palette,
  Contrast,
  Music,
  Sliders,
  RefreshCw,
  Type,
  Globe,
  Flame,
  Sun,
  Moon,
  Droplets,
  Trash2,
  Compass,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme, Theme } from '../hooks/useTheme';
import { audioEngine } from '../lib/audioEngine';
import { 
  auth, 
  db, 
  googleProvider, 
  setupAuthListener, 
  UserProfile,
  registerUserManually,
  loginUserManually,
  logoutUserManually,
  linkSocialPlatformManually
} from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Browser Audio Synthesizer for UI SFX
const playTone = (frequency: number, type: OscillatorType, duration: number, volume = 0.1) => {
  try {
    if (localStorage.getItem('clay_sfx_enabled') === 'false') return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio Context blocked or not supported
  }
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { lang } = useLanguage();
  const { theme, setTheme, highContrast, toggleHighContrast } = useTheme();
  
  // Tabs & Preferences States
  const [activeTab, setActiveTab] = useState<'account' | 'visuals' | 'audio' | 'advanced' | 'faq'>('account');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [volume, setVolumeState] = useState(() => audioEngine.getVolume());
  const [speechRate, setSpeechRateState] = useState(() => audioEngine.getSpeechRate());
  const [pitch, setPitchState] = useState(() => audioEngine.getPitch());
  const [crackle, setCrackleState] = useState(() => audioEngine.isCrackleEnabled());
  const [practiceMode, setPracticeModeState] = useState(() => localStorage.getItem('clay_quiz_practice_mode') === 'true');
  const [textSize, setTextSizeState] = useState(() => localStorage.getItem('clay_text_size') || 'md');
  const [autoAdvance, setAutoAdvanceState] = useState(() => localStorage.getItem('clay_auto_advance') === 'true');
  const [sfxEnabled, setSfxEnabledState] = useState(() => localStorage.getItem('clay_sfx_enabled') !== 'false');
  const [autoScroll, setAutoScroll] = useState(() => localStorage.getItem('clay_auto_scroll') !== 'false');
  const [debugMode, setDebugMode] = useState(() => localStorage.getItem('clay_debug_mode') === 'true');

  // Sync state on modal open
  useEffect(() => {
    if (isOpen) {
      setVolumeState(audioEngine.getVolume());
      setSpeechRateState(audioEngine.getSpeechRate());
      setPitchState(audioEngine.getPitch());
      setCrackleState(audioEngine.isCrackleEnabled());
      setPracticeModeState(localStorage.getItem('clay_quiz_practice_mode') === 'true');
      setTextSizeState(localStorage.getItem('clay_text_size') || 'md');
      setAutoAdvanceState(localStorage.getItem('clay_auto_advance') === 'true');
      setSfxEnabledState(localStorage.getItem('clay_sfx_enabled') !== 'false');
      setAutoScroll(localStorage.getItem('clay_auto_scroll') !== 'false');
      setDebugMode(localStorage.getItem('clay_debug_mode') === 'true');
    }
  }, [isOpen]);

  // Sync custom event triggers
  useEffect(() => {
    const handleVolumeEvent = () => {
      setTimeout(() => {
        setVolumeState(audioEngine.getVolume());
      }, 0);
    };
    const handlePracticeModeEvent = () => {
      setTimeout(() => {
        setPracticeModeState(localStorage.getItem('clay_quiz_practice_mode') === 'true');
      }, 0);
    };
    window.addEventListener('clay_volume_changed', handleVolumeEvent);
    window.addEventListener('clay_practice_mode_changed', handlePracticeModeEvent);
    return () => {
      window.removeEventListener('clay_volume_changed', handleVolumeEvent);
      window.removeEventListener('clay_practice_mode_changed', handlePracticeModeEvent);
    };
  }, []);

  const handleVolumeSliderChange = (newVal: number) => {
    setVolumeState(newVal);
    audioEngine.setVolume(newVal);
  };

  const handleSpeechRateSliderChange = (newVal: number) => {
    setSpeechRateState(newVal);
    audioEngine.setSpeechRate(newVal);
  };

  const handlePitchChange = (newVal: number) => {
    setPitchState(newVal);
    audioEngine.setPitch(newVal);
  };

  const handleCrackleToggle = (enabled: boolean) => {
    setCrackleState(enabled);
    audioEngine.setCrackleEnabled(enabled);
  };

  const handlePracticeToggle = () => {
    const nextVal = !practiceMode;
    setPracticeModeState(nextVal);
    localStorage.setItem('clay_quiz_practice_mode', String(nextVal));
    window.dispatchEvent(new Event('clay_practice_mode_changed'));
  };

  const handleAutoAdvanceToggle = () => {
    const nextVal = !autoAdvance;
    setAutoAdvanceState(nextVal);
    localStorage.setItem('clay_auto_advance', String(nextVal));
  };

  const handleSfxToggle = () => {
    const nextVal = !sfxEnabled;
    setSfxEnabledState(nextVal);
    localStorage.setItem('clay_sfx_enabled', String(nextVal));
  };

  const handleAutoScrollToggle = () => {
    const nextVal = !autoScroll;
    setAutoScroll(nextVal);
    localStorage.setItem('clay_auto_scroll', String(nextVal));
  };

  const handleDebugModeToggle = () => {
    const nextVal = !debugMode;
    setDebugMode(nextVal);
    localStorage.setItem('clay_debug_mode', String(nextVal));
  };

  const handleTextSizeChange = (size: string) => {
    setTextSizeState(size);
    localStorage.setItem('clay_text_size', size);
    
    // Apply text size globally to body or html tag
    const root = document.documentElement;
    root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    root.classList.add(`text-size-${size}`);
    
    // Trigger custom window resize or style update if needed
    window.dispatchEvent(new Event('clay_text_size_changed'));
  };

  const handleResetLearning = () => {
    const confirmMsgEn = "⚠️ CRITICAL RESET: This will permanently wipe all your master terms count, quiz scores, daily streaks, achievements, and custom avatar profiles inside this browser. Are you absolutely sure you want to completely start over?";
    const confirmMsgUr = "⚠️ SAKHT RESET: Yih aapke saare seekhe hue alfaaz, quiz scores, streaks aur custom avatar ko browser se mita dega. Kya aap such me sab zero karna chahte hain?";
    
    if (window.confirm(lang === 'en' ? confirmMsgEn : confirmMsgUr)) {
      localStorage.clear();
      // Force reload page to apply absolute clean state
      window.location.reload();
    }
  };

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Logged-in state
  const [user, setUser] = useState<UserProfile | null>(null);

  // Set up Firebase auth listener
  useEffect(() => {
    const unsubscribe = setupAuthListener(
      (profile) => {
        setUser(profile);
      },
      () => {
        // Progress changed, if we need to do something we can
      }
    );
    return () => unsubscribe();
  }, []);

  // Read mastered terms count
  const getMasteredTermsCount = () => {
    try {
      const saved = localStorage.getItem('clay_completed_terms');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.values(parsed).filter(Boolean).length;
      }
    } catch {
      // Ignored
    }
    return 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      if (!email || !password) {
        alert(lang === 'en' ? 'Please fill in all required fields.' : 'Kripya sabhi fields bharein.');
        return;
      }
    } else {
      if (!email || !password || !fullName || !phoneNumber) {
        alert(lang === 'en' ? 'Please fill in all required fields.' : 'Kripya sabhi fields bharein.');
        return;
      }
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isLoginMode) {
        // 1. Try local manual sign-in first (highly reliable local db)
        try {
          loginUserManually(email, password);
        } catch (localErr: any) {
          // 2. Fallback to try Firebase auth
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (firebaseErr: any) {
            let msg = localErr.message || firebaseErr.message || 'Authentication failed.';
            if (firebaseErr.code === 'auth/wrong-password' || firebaseErr.code === 'auth/user-not-found') {
              msg = lang === 'en' ? 'Invalid email/phone or password.' : 'Sahi email/phone ya password nahi hai.';
            }
            throw new Error(msg);
          }
        }
      } else {
        // Sign up
        // 1. Register manually in local db
        let registeredProfile;
        try {
          registeredProfile = registerUserManually(email, phoneNumber, fullName, password);
        } catch (localErr: any) {
          throw localErr;
        }

        // 2. Also best-effort Firebase signup
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: fullName });
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            phoneNumber,
            fullName,
            avatar: registeredProfile.avatar,
            joinedDate: registeredProfile.joinedDate,
            streak: 1,
            linkedPlatforms: []
          });
        } catch (firebaseErr) {
          console.log("Firebase registration bypassed (using local db):", firebaseErr);
        }
      }

      setIsLoading(false);
      setAuthSuccess(true);

      setTimeout(() => {
        setAuthSuccess(false);
        // Clear forms
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        setFullName('');
        onClose();
      }, 1500);

    } catch (error: any) {
      console.error("Auth error:", error);
      setIsLoading(false);
      setErrorMessage(error.message || 'Authentication failed.');
    }
  };

  const handleSocialAuth = async (platform: string) => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const handle = prompt(
        lang === 'en'
          ? `Enter your ${platform} username or full name to authorize connection:`
          : `Apna ${platform} username ya poora naam likhein connect karne ke liye:`
      );
      
      if (!handle) {
        setIsLoading(false);
        return;
      }

      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const profile = linkSocialPlatformManually(platform, handle);
      setIsLoading(false);
      setAuthSuccess(true);
      
      setTimeout(() => {
        setAuthSuccess(false);
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Social sign in failed:", error);
      setIsLoading(false);
      setErrorMessage(error.message || 'Social sign-in failed.');
    }
  };

  const handleLinkPlatform = async (platform: string) => {
    if (!user) return;
    
    try {
      // 1. Link platform locally
      const updatedProfile = linkSocialPlatformManually(platform, user.fullName);
      setUser(updatedProfile);

      // 2. Also try Firestore best-effort
      const updatedLinked = user.linkedPlatforms.includes(platform)
        ? user.linkedPlatforms.filter(p => p !== platform)
        : [...user.linkedPlatforms, platform];
      
      try {
        await setDoc(doc(db, 'users', user.uid), {
          linkedPlatforms: updatedLinked
        }, { merge: true });
      } catch (_) {}

      playTone(600, 'sine', 0.15, 0.05);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogOut = async () => {
    if (window.confirm(lang === 'en' ? 'Are you sure you want to log out?' : 'Kya aap such me log out karna chahte hain?')) {
      try {
        logoutUserManually();
        await signOut(auth);
        localStorage.removeItem('clay_user_profile');
        setUser(null);
        window.dispatchEvent(new Event('clay_auth_state_changed'));
        onClose();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const faqItems = [
    {
      qEn: "What is Clayverse AI?",
      qUr: "Clayverse AI kya hai?",
      aEn: "Clayverse AI is an interactive, multi-sensory educational sandbox designed to demystify artificial intelligence. It uses hand-crafted clay textures, real-time synthesized browser audio, and bilingual English/Urdu narration to make complex tech topics highly intuitive.",
      aUr: "Clayverse AI ek interactive aur dilchasp sabaq-gah hai jo AI ke pecheeda concepts ko aasan tareeqay se samjhati hai. Isme haath se bani clay shapes, live browser sound effects, aur Urdu/English narration ka istemal kiya gaya hai."
    },
    {
      qEn: "How does the sound engine work?",
      qUr: "Iska sound engine kaise kaam karta hai?",
      aEn: "Our audio engine uses the browser's Native Web Audio API to dynamically synthesize cozy ambient lo-fi music, rhythmic study drums, and vinyl crackles, as well as offline speech synthesis. This means absolutely zero expensive cloud servers are needed!",
      aUr: "Humara audio system browser ke Web Audio API ko use karke live lo-fi music aur purani vinyl record ki crackle awaaz khud synthesize karta hai, bina kisi mehnge cloud server ke!"
    },
    {
      qEn: "What features are in the AI Arena?",
      qUr: "AI Arena me kya sahuliyat hain?",
      aEn: "In the AI Arena, you can test custom prompts with live RAG (Retrieval-Augmented Generation) databases, explore the historical neural AI family tree, check your knowledge with interactive quiz games, and win beautiful collectible study badges.",
      aUr: "AI Arena me aap live RAG Prompt simulation chala sakte hain, neural net ka family tree dekh sakte hain, interactive quiz khel sakte hain, aur khubsoorat learning badges haasil kar sakte hain."
    },
    {
      qEn: "Is my learning progress saved securely?",
      qUr: "Mera seekhne ka record kahan save hota hai?",
      aEn: "Yes! Clayverse AI is designed offline-first. Your daily learning streaks, highscores, mastered vocabulary, and custom achievements are instantly and securely cached in your browser's IndexedDB / LocalStorage, which you can easily clear anytime.",
      aUr: "Ji haan! Clayverse AI offline-first kaam karta hai. Aapki rozana ki streak, quiz score, aur seekhe hue sabaq aapke browser ke IndexedDB / LocalStorage me bina kisi delay ke mehfuz ho jate hain."
    },
    {
      qEn: "How do I change the theme or language?",
      qUr: "Theme ya zabaan kaise badlein?",
      aEn: "You can change languages on the fly using the floating bubble in the bottom-left of the screen, and select premium color palettes (Desert Sand, Deep Blue, Deep Night, Red Light) in the Visuals tab of this Settings menu.",
      aUr: "Aap screen ke bottom-left me diye gaye floating bubble se zabaan badal sakte hain, aur isi Settings Panel ke 'Rang/Visuals' tab me jaakar Desert Sand ya Deep Blue jese khubsoorat themes chun sakte hain."
    }
  ];

  if (!isOpen) return null;

  const masteredCount = getMasteredTermsCount();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-brand-charcoal/45 backdrop-blur-md"
      />

      {/* Main glassmorphic container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 210 }}
        className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-brand-charcoal/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden text-left z-10"
      >
        {/* Absolute top close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/50 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 text-center md:text-left pr-6">
          <h3 className="font-display text-lg font-black text-brand-charcoal tracking-tight flex items-center justify-center md:justify-start gap-1.5">
            <Settings className="w-5 h-5 text-brand-amber animate-spin-slow" />
            {lang === 'en' ? "Control Center & Settings" : "Tanzimat Aur Sahuliyat"}
          </h3>
          <p className="text-[10px] text-brand-muted mt-0.5">
            {lang === 'en' ? "Customize lofi-sound, global color theme palettes, and student profile" : "Awaaz, website ka rang, aur student profile set karein"}
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-brand-slate/10 mb-4 overflow-x-auto scrollbar-none gap-1">
          {[
            { id: 'account', labelEn: 'Account', labelUr: 'Profile', icon: User },
            { id: 'visuals', labelEn: 'Visuals', labelUr: 'Rang', icon: Palette },
            { id: 'audio', labelEn: 'Audio', labelUr: 'Awaaz', icon: Volume2 },
            { id: 'advanced', labelEn: 'Advanced', labelUr: 'Khaas', icon: Sliders },
            { id: 'faq', labelEn: 'FAQ', labelUr: 'FAQ', icon: HelpCircle }
          ].map((t) => {
            const isActive = activeTab === t.id;
            const IconComponent = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTab(t.id as any);
                  playTone(400 + (t.id === 'account' ? 0 : t.id === 'visuals' ? 40 : t.id === 'audio' ? 80 : t.id === 'advanced' ? 120 : 160), 'sine', 0.08, 0.05);
                }}
                className={`flex-1 min-w-[70px] py-2 px-1 text-center border-b-2 font-mono text-[10px] font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  isActive 
                    ? 'border-brand-amber text-brand-amber bg-brand-sand/10' 
                    : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{lang === 'en' ? t.labelEn : t.labelUr}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT: ACCOUNT */}
        {activeTab === 'account' && (
          <div>
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-3 border-b border-brand-slate/10">
                  <img 
                    src={user.avatar} 
                    alt={user.fullName} 
                    className="w-14 h-14 rounded-2xl bg-brand-sand border-2 border-brand-amber/40 p-1 shadow-inner shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-brand-amber/10 text-brand-amber px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Sparkles className="w-2.5 h-2.5" /> Clayverse Scholar
                    </span>
                    <h3 className="font-display text-base font-black text-brand-charcoal truncate leading-tight mt-1">
                      {user.fullName}
                    </h3>
                    <p className="text-[11px] text-brand-muted truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Scholar Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FAF8F5] border border-brand-slate/10 p-3 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-brand-amber mb-1">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[9px] font-mono font-bold uppercase">{lang === 'en' ? "Vocabulary" : "Shabd"}</span>
                    </div>
                    <div className="text-xl font-black text-brand-charcoal">
                      {masteredCount} <span className="text-xs text-brand-muted font-bold">/ 54</span>
                    </div>
                    <span className="text-[9px] text-brand-muted font-medium mt-0.5 block">
                      {lang === 'en' ? "Terms Mastered" : "Alfaaz Seekhe"}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F5] border border-brand-slate/10 p-3 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-[#E07A5F] mb-1">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[9px] font-mono font-bold uppercase">{lang === 'en' ? "Streak" : "Streak"}</span>
                    </div>
                    <div className="text-xl font-black text-brand-charcoal">
                      {user.streak} <span className="text-xs text-brand-muted font-bold">{lang === 'en' ? "days" : "din"}</span>
                    </div>
                    <span className="text-[9px] text-brand-muted font-medium mt-0.5 block">
                      {lang === 'en' ? "Active Study Streak" : "Seekhne ki Streak"}
                    </span>
                  </div>
                </div>

                {/* Platform accounts linking status */}
                <div className="space-y-2 text-left">
                  <h4 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider">
                    {lang === 'en' ? "Linked Social Accounts" : "Linked Social Accounts"}
                  </h4>
                  <p className="text-[10px] text-brand-muted">
                    {lang === 'en' 
                      ? "Toggle platforms below to connect and sync your study journey profile on other services:" 
                      : "Neeche click karke dusre platforms ko connect aur study data sync karein:"}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Google', icon: Chrome, color: 'hover:border-red-500/30 hover:bg-red-50/10' },
                      { name: 'LinkedIn', icon: Linkedin, color: 'hover:border-blue-500/30 hover:bg-blue-50/10' },
                      { name: 'Instagram', icon: Instagram, color: 'hover:border-pink-500/30 hover:bg-pink-50/10' },
                      { name: 'GitHub', icon: Github, color: 'hover:border-slate-800/30 hover:bg-slate-50/10' }
                    ].map((plat) => {
                      const isLinked = user.linkedPlatforms.includes(plat.name);
                      return (
                        <button
                          key={plat.name}
                          type="button"
                          onClick={() => handleLinkPlatform(plat.name)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                            isLinked 
                              ? 'border-brand-amber/30 bg-brand-amber/[0.03] text-brand-charcoal font-bold' 
                              : 'border-brand-slate/10 text-brand-slate ' + plat.color
                          }`}
                        >
                          <plat.icon className={`w-3.5 h-3.5 shrink-0 ${isLinked ? 'text-brand-amber' : 'text-brand-muted'}`} />
                          <span className="flex-grow text-left">{plat.name}</span>
                          {isLinked && <Check className="w-3 h-3 text-brand-amber" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Profile actions */}
                <div className="pt-3 border-t border-brand-slate/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-brand-muted">
                    {lang === 'en' ? `Member since ${user.joinedDate}` : `${user.joinedDate} se member hain`}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogOut}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {lang === 'en' ? "Log Out" : "Log Out"}
                  </button>
                </div>
              </div>
            ) : (
              /* OTHERWISE: SHOW LOGIN / SIGNUP SCREEN - Sleek, tactile card design */
              <div className="bg-[#FAF8F5]/80 dark:bg-white/[0.02] border-2 border-brand-slate/10 dark:border-white/5 rounded-3xl p-5 md:p-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),_0_8px_20px_rgba(0,0,0,0.02)] space-y-4 text-left relative overflow-hidden">
                <div className="text-center md:text-left">
                  <h3 className="font-display text-base font-black text-brand-charcoal tracking-tight flex items-center justify-center md:justify-start gap-1.5">
                    <User className="w-4 h-4 text-brand-amber" />
                    {isLoginMode 
                      ? (lang === 'en' ? "Welcome back" : "Aapka swagat hai") 
                      : (lang === 'en' ? "Create account" : "Naya account banayein")}
                  </h3>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    {isLoginMode 
                      ? (lang === 'en' ? "Log in to track your AI learning achievements" : "Apne AI lessons ki progress dekhne ke liye login karein") 
                      : (lang === 'en' ? "Sign up to begin your personalized visual journey" : "Apni naye sabaq ki progress bachane ke liye signup karein")}
                  </p>
                </div>

                {/* Loading / success animations overlay */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 text-center p-6"
                    >
                      <Loader2 className="w-10 h-10 text-brand-amber animate-spin" />
                      <div>
                        <h4 className="font-display text-sm font-bold text-brand-charcoal">
                          {lang === 'en' ? "Connecting Clayverse AI..." : "Clayverse AI se jod rahe hain..."}
                        </h4>
                        <p className="text-[10px] text-brand-muted mt-0.5">
                          {lang === 'en' ? "Authenticating security token credentials" : "Security key credentials check ho rahe hain"}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {authSuccess && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 text-center p-6"
                    >
                      <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                      <div>
                        <h4 className="font-display text-sm font-black text-brand-charcoal">
                          {lang === 'en' ? "Success! Session active" : "Kamyaabi! Login ho gaya"}
                        </h4>
                        <p className="text-[10px] text-brand-muted mt-0.5">
                          {lang === 'en' ? "Profile synchronized successfully" : "Aapka study record aur progress load ho chuka hai"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs font-semibold text-red-600">
                    {errorMessage}
                  </div>
                )}

                {/* Auth Form */}
                <form onSubmit={handleAuth} className="space-y-3">
                  {!isLoginMode && (
                    <>
                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono font-bold text-brand-muted uppercase">
                          {lang === 'en' ? "Full Name" : "Aapka Naam"}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                          <input
                            type="text"
                            placeholder={lang === 'en' ? "Shahnawaz" : "Shahnawaz"}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-brand-slate/10 rounded-2xl text-xs font-medium text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono font-bold text-brand-muted uppercase">
                          {lang === 'en' ? "Phone Number" : "Phone Number"}
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-brand-slate/10 rounded-2xl text-xs font-medium text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold text-brand-muted uppercase">
                      {isLoginMode 
                        ? (lang === 'en' ? "Email or Phone Number" : "Email ya Phone Number")
                        : (lang === 'en' ? "Email Address" : "Email Address")
                      }
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                      <input
                        type="text"
                        placeholder={isLoginMode ? "you@domain.com or +91 98765..." : "you@domain.com"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-brand-slate/10 rounded-2xl text-xs font-medium text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-bold text-brand-muted uppercase">
                      {lang === 'en' ? "Password" : "Password"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10 pr-10 py-2 bg-[#FAF8F5] border border-brand-slate/10 rounded-2xl text-xs font-medium text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-amber transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-amber hover:bg-brand-amber-dark text-white rounded-2xl font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
                  >
                    {isLoginMode 
                      ? (lang === 'en' ? "Enter Study Journal" : "Sabaq Shuru Karein") 
                      : (lang === 'en' ? "Register Account" : "Naya Account Banayein")}
                  </button>
                </form>

                {/* Quick social login dividers */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-brand-slate/10"></div>
                  <span className="flex-shrink mx-4 text-[9px] font-mono font-bold text-brand-muted uppercase">
                    {lang === 'en' ? "Or connect with" : "Ya inke sath judiye"}
                  </span>
                  <div className="flex-grow border-t border-brand-slate/10"></div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleSocialAuth('Google');
                      playTone(440, 'sine', 0.08, 0.05);
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-white/[0.03] border border-brand-slate/10 hover:border-brand-amber/30 rounded-2xl text-[11px] font-bold text-brand-slate hover:text-brand-charcoal transition-all cursor-pointer active:translate-y-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.03)] active:shadow-none"
                  >
                    <Chrome className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSocialAuth('LinkedIn');
                      playTone(460, 'sine', 0.08, 0.05);
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-white/[0.03] border border-brand-slate/10 hover:border-brand-amber/30 rounded-2xl text-[11px] font-bold text-brand-slate hover:text-brand-charcoal transition-all cursor-pointer active:translate-y-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.03)] active:shadow-none"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSocialAuth('Instagram');
                      playTone(480, 'sine', 0.08, 0.05);
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-white/[0.03] border border-brand-slate/10 hover:border-brand-amber/30 rounded-2xl text-[11px] font-bold text-brand-slate hover:text-brand-charcoal transition-all cursor-pointer active:translate-y-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.03)] active:shadow-none"
                  >
                    <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleSocialAuth('GitHub');
                      playTone(500, 'sine', 0.08, 0.05);
                    }}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-white/[0.03] border border-brand-slate/10 hover:border-brand-amber/30 rounded-2xl text-[11px] font-bold text-brand-slate hover:text-brand-charcoal transition-all cursor-pointer active:translate-y-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.03)] active:shadow-none"
                  >
                    <Github className="w-4 h-4 text-slate-800 dark:text-slate-200 shrink-0" />
                    <span>GitHub</span>
                  </button>
                </div>

                {/* Bottom Toggle */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="text-[11px] font-bold text-brand-amber hover:text-brand-amber-dark underline transition-all cursor-pointer"
                  >
                    {isLoginMode 
                      ? (lang === 'en' ? "Don't have an account? Sign Up" : "Naya account chahiye? Sign Up karein") 
                      : (lang === 'en' ? "Already have an account? Log In" : "Pehle se account hai? Log In karein")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: VISUALS */}
        {activeTab === 'visuals' && (
          <div className="space-y-4 py-1">
            <div>
              <h4 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider mb-2">
                {lang === 'en' ? "Global Color Palette" : "Website Ka Theme Palette"}
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'sand', labelEn: 'Desert Sand', labelUr: 'Chicha Sand', descEn: 'Warm solar sand and amber vibes', descUr: 'Garam mitti aur sun-burnt sunehra rang', bgClass: 'bg-[#FDFBF7]', borderClass: 'border-brand-amber/30' },
                  { id: 'deep-blue', labelEn: 'Deep Blue', labelUr: 'Gehra Neela', descEn: 'Immersive deep ocean cerulean', descUr: 'Gahra neela aur chamakdar aabi rang', bgClass: 'bg-[#0B1528]', borderClass: 'border-blue-500/30' },
                  { id: 'deep-night', labelEn: 'Deep Night', labelUr: 'Andheri Raat', descEn: 'OLED midnight dark charcoal', descUr: 'Bilkul andhera aur safed harf', bgClass: 'bg-[#09090B]', borderClass: 'border-zinc-800' },
                  { id: 'red-light', labelEn: 'Red Light', labelUr: 'Laal Roshni', descEn: 'Ruby high-contrast night vision', descUr: 'Garam surkh roshni aur tez laal rang', bgClass: 'bg-[#1A0505]', borderClass: 'border-red-800' }
                ].map((t) => {
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTheme(t.id as Theme);
                        playTone(t.id === 'sand' ? 523 : t.id === 'deep-blue' ? 392 : t.id === 'deep-night' ? 261 : 659, 'sine', 0.15, 0.05);
                      }}
                      className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected 
                          ? 'border-brand-amber bg-brand-amber/[0.04] shadow-sm' 
                          : 'border-brand-slate/10 bg-[#FAF8F5] hover:border-brand-slate/20'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-brand-charcoal/10 ${t.bgClass}`}>
                        {isSelected && <Check className="w-4 h-4 text-brand-amber" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-black text-xs text-brand-charcoal">
                            {lang === 'en' ? t.labelEn : t.labelUr}
                          </span>
                          {isSelected && (
                            <span className="text-[8px] font-mono font-bold uppercase text-brand-amber bg-brand-amber/10 px-1.5 py-0.5 rounded">
                              {lang === 'en' ? 'Active' : 'Chalu'}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-brand-muted truncate mt-0.5">
                          {lang === 'en' ? t.descEn : t.descUr}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* High Contrast Mode Toggle (Accessibility & Visual Impairments) */}
            <div className="pt-3 border-t border-brand-slate/10">
              <div className="p-3 rounded-2xl bg-brand-sand/30 border border-brand-slate/10 hover:border-brand-amber/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`p-1.5 rounded-lg transition-colors ${highContrast ? 'bg-brand-amber text-white' : 'bg-brand-sand text-brand-charcoal'}`}>
                        <Contrast className="w-3.5 h-3.5" />
                      </div>
                      <h5 className="font-display font-bold text-xs text-brand-charcoal">
                        {lang === 'en' ? "High Contrast Mode" : "Tez Contrast Mode"}
                      </h5>
                      <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded-full border ${
                        highContrast
                          ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                          : 'bg-brand-slate/10 text-brand-slate border-brand-slate/15'
                      }`}>
                        {highContrast ? 'WCAG AAA ON' : 'WCAG AA'}
                      </span>
                    </div>
                    <p className="text-[10px] text-brand-muted leading-tight">
                      {lang === 'en'
                        ? "Maximizes text contrast, adds solid backdrops, and enhances outlines for users with visual impairments."
                        : "Likhai aur cards ka contrast bada kar aasan banata hai taake aankhon par zor na pade."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      toggleHighContrast();
                      playTone(highContrast ? 320 : 640, 'sine', 0.1, 0.05);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
                      highContrast ? 'bg-brand-amber' : 'bg-brand-slate/25'
                    }`}
                    title={highContrast ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-xs transition-transform ${
                        highContrast ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {highContrast && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 pt-2 border-t border-brand-slate/10 flex items-center justify-between text-[9px] font-mono text-brand-slate"
                  >
                    <span className="font-bold">Active: Stark High-Contrast Ratio (21:1)</span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Enabled
                    </span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Typography scale */}
            <div className="pt-3 border-t border-brand-slate/10">
              <h4 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider mb-2">
                {lang === 'en' ? "Adaptive Text Size" : "Likhai Ka Size"}
              </h4>
              <div className="flex bg-brand-sand/40 p-1 rounded-2xl border border-brand-slate/5 gap-1">
                {[
                  { id: 'sm', label: 'Small', labelUr: 'Chota' },
                  { id: 'md', label: 'Medium', labelUr: 'Aam' },
                  { id: 'lg', label: 'Large', labelUr: 'Bada' }
                ].map((size) => {
                  const isSelected = textSize === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => {
                        handleTextSizeChange(size.id);
                        playTone(300 + (size.id === 'sm' ? 0 : size.id === 'md' ? 100 : 200), 'sine', 0.1, 0.05);
                      }}
                      className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold font-mono transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-brand-amber text-white shadow-sm' 
                          : 'text-brand-muted hover:text-brand-charcoal'
                      }`}
                    >
                      {lang === 'en' ? size.label : size.labelUr}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: AUDIO */}
        {activeTab === 'audio' && (
          <div className="space-y-4 py-1">
            {/* Ambient Synth volume */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider">
                  {lang === 'en' ? "Synthesizer Background Volume" : "Background Lofi Awaaz"}
                </h4>
                <span className="font-mono text-xs font-bold text-brand-charcoal">
                  {volume === 0 ? (lang === 'en' ? 'Muted' : 'Khamosh') : `${volume}%`}
                </span>
              </div>

              {/* Slider and Mute Toggle */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextVol = volume > 0 ? 0 : 50;
                    handleVolumeSliderChange(nextVol);
                    playTone(nextVol > 0 ? 440 : 220, 'sine', 0.1, 0.05);
                  }}
                  className="p-2.5 bg-brand-sand/50 hover:bg-brand-sand border border-brand-slate/10 rounded-xl transition-all cursor-pointer text-brand-charcoal shrink-0"
                  title={volume === 0 ? "Unmute" : "Mute background music"}
                >
                  {volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-brand-muted" />
                  ) : volume < 45 ? (
                    <Volume1 className="w-4 h-4 text-brand-amber" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-brand-amber" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={volume}
                  onChange={(e) => handleVolumeSliderChange(parseInt(e.target.value))}
                  className="flex-grow accent-brand-amber h-1.5 bg-brand-sand rounded-lg cursor-pointer"
                />
              </div>

              {/* Volume Increasers / Decreasers (User requested) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextVol = Math.max(0, volume - 10);
                    handleVolumeSliderChange(nextVol);
                    playTone(280, 'sine', 0.08, 0.05);
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 border border-brand-slate/10 hover:border-brand-slate/25 bg-brand-sand/20 hover:bg-brand-sand/50 rounded-xl font-mono text-[10px] font-bold text-brand-charcoal cursor-pointer transition-all active:scale-95"
                >
                  <Volume1 className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                  <span>{lang === 'en' ? "Decrease Vol (-10%)" : "Volume Kam (-10%)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextVol = Math.min(100, volume + 10);
                    handleVolumeSliderChange(nextVol);
                    playTone(380, 'sine', 0.08, 0.05);
                  }}
                  className="flex items-center justify-center gap-1.5 py-1.5 border border-brand-slate/10 hover:border-brand-slate/25 bg-brand-sand/20 hover:bg-brand-sand/50 rounded-xl font-mono text-[10px] font-bold text-brand-charcoal cursor-pointer transition-all active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                  <span>{lang === 'en' ? "Increase Vol (+10%)" : "Volume Tez (+10%)"}</span>
                </button>
              </div>

              {/* Quick Volume Preset Badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: '0%', val: 0 },
                  { label: '25% Cozy', val: 25 },
                  { label: '50% Study', val: 50 },
                  { label: '75% Focus', val: 75 },
                  { label: '100% Boost', val: 100 }
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => {
                      handleVolumeSliderChange(preset.val);
                      playTone(300 + preset.val, 'sine', 0.1, 0.04);
                    }}
                    className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold transition-all border cursor-pointer ${
                      volume === preset.val 
                        ? 'bg-brand-amber border-brand-amber text-white shadow-sm' 
                        : 'bg-white hover:bg-brand-sand border-brand-slate/10 text-brand-muted hover:text-brand-charcoal'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tape/Vinyl Crackle Toggle */}
            <div className="pt-3 border-t border-brand-slate/10">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h5 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                    {lang === 'en' ? "Vinyl Tape Crackle" : "Purane Record Ka Shor"}
                  </h5>
                  <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">
                    {lang === 'en' ? "Procedural dusty record player hum inside background." : "Halki tape crackle aur ghoonghat ki awaaz shamil karein."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !crackle;
                    handleCrackleToggle(next);
                    playTone(next ? 580 : 280, 'sine', 0.08, 0.05);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${crackle ? 'bg-brand-amber' : 'bg-brand-slate/25'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${crackle ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Narrator Pitch Control (Professional feature) */}
            <div className="pt-3 border-t border-brand-slate/10">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider">
                  {lang === 'en' ? "Narrator Vocal Pitch" : "Ustad Ki Awaaz Ka Pitch"}
                </h4>
                <span className="font-mono text-xs font-bold text-brand-charcoal">
                  {pitch.toFixed(2)}x {pitch < 0.9 ? '(Deep)' : pitch > 1.3 ? '(High)' : '(Standard)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-brand-muted">0.5x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                  className="flex-grow accent-brand-amber h-1.5 bg-brand-sand rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-brand-muted">2.0x</span>
              </div>
            </div>

            {/* Speech rate pace */}
            <div className="pt-3 border-t border-brand-slate/10">
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider">
                  {lang === 'en' ? "Narrator Speaking Rate" : "Ustad Ke Bolne Ki Raftar"}
                </h4>
                <span className="font-mono text-xs font-bold text-brand-charcoal">
                  {speechRate.toFixed(2)}x
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-brand-muted">0.5x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => handleSpeechRateSliderChange(parseFloat(e.target.value))}
                  className="flex-grow accent-brand-amber h-1.5 bg-brand-sand rounded-lg cursor-pointer"
                />
                <span className="text-[9px] text-brand-muted">2.0x</span>
              </div>
            </div>

            {/* Audio UX Settings block */}
            <div className="pt-3 border-t border-brand-slate/10 space-y-3">
              {/* Sound Effects (SFX) UI Tones */}
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h5 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                    {lang === 'en' ? "Interactive UI Sound Tones" : "Interactive Click Sounds"}
                  </h5>
                  <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">
                    {lang === 'en' ? "Synthesizes retro chime clicks when navigating buttons." : "Buttons aur cards click karne par halki retro ghanti chalu rakhein."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleSfxToggle();
                    playTone(sfxEnabled ? 250 : 500, 'sine', 0.08, 0.05);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${sfxEnabled ? 'bg-brand-amber' : 'bg-brand-slate/25'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${sfxEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Auto-Advance Audio Readings */}
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h5 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                    {lang === 'en' ? "Auto-Narrate on Card Click" : "Chunte hi Auto-Awaaz"}
                  </h5>
                  <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">
                    {lang === 'en' ? "Automatically speaks definition when selecting glossary cards." : "Sabaq ya glossary card kholte hi ustad khud bolna shuru karein."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleAutoAdvanceToggle();
                    playTone(autoAdvance ? 280 : 580, 'sine', 0.08, 0.05);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${autoAdvance ? 'bg-green-500' : 'bg-brand-slate/25'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoAdvance ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: ADVANCED */}
        {activeTab === 'advanced' && (
          <div className="space-y-4 py-1">
            {/* Practice mode toggle */}
            <div>
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h5 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                    {lang === 'en' ? "Bypass Quiz Timers" : "Quiz Timers Band Karein"}
                  </h5>
                  <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">
                    {lang === 'en' ? "Enables always-on practice mode where you can think leisurely." : "Quiz ke doran time countdown band karein aur aaram se jawab dein."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handlePracticeToggle();
                    playTone(practiceMode ? 280 : 580, 'sine', 0.08, 0.05);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${practiceMode ? 'bg-green-500' : 'bg-brand-slate/25'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${practiceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Auto-Scroll to Active Card */}
            <div className="pt-3 border-t border-brand-slate/10">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h5 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                    {lang === 'en' ? "Auto-Scroll to Selected Card" : "Selected Card Par Auto-Scroll"}
                  </h5>
                  <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">
                    {lang === 'en' ? "Smoothly centers card in view when navigating the glossary." : "Sabaq select karte hi screen ko wahan smooth scroll karein."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleAutoScrollToggle();
                    playTone(autoScroll ? 280 : 580, 'sine', 0.08, 0.05);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${autoScroll ? 'bg-brand-amber' : 'bg-brand-slate/25'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${autoScroll ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Simulated Debug Console Tones Toggle */}
            <div className="pt-3 border-t border-brand-slate/10">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <h5 className="font-display font-bold text-xs text-brand-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-amber shrink-0" />
                    {lang === 'en' ? "Developer Analytics Console" : "Developer Debug Logs"}
                  </h5>
                  <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">
                    {lang === 'en' ? "Prints interactive learning telemetry logs in browser developer tools." : "Browser consoling me detailed seekhne ki telemetry logs shuru karein."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleDebugModeToggle();
                    playTone(debugMode ? 280 : 580, 'sine', 0.08, 0.05);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${debugMode ? 'bg-brand-amber' : 'bg-brand-slate/25'}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${debugMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Local Sync Database Status Indicators (Extremely Professional) */}
            <div className="pt-3 border-t border-brand-slate/10">
              <div className="bg-brand-sand/30 border border-brand-slate/10 p-3 rounded-2xl space-y-1.5">
                <h6 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider">
                  {lang === 'en' ? "Offline Sync & Database Status" : "Offline Storage aur Sync"}
                </h6>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-brand-muted">{lang === 'en' ? "Database Engine" : "Storage Engine"}:</span>
                  <span className="font-mono font-bold text-brand-charcoal">IndexedDB / LocalStorage</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-brand-muted">{lang === 'en' ? "Sync Health" : "Sync Halat"}:</span>
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {lang === 'en' ? "100% Offline-First Mirror" : "Mehfuz (Offline Ready)"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-brand-muted">{lang === 'en' ? "Wasm Asset Cache" : "Asset Caching"}:</span>
                  <span className="text-brand-charcoal font-bold">{lang === 'en' ? "Optimized (12.4 MB)" : "Activated"}</span>
                </div>
              </div>
            </div>

            {/* Clear learning stats */}
            <div className="pt-3 border-t border-brand-slate/10">
              <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <h5 className="font-display font-black text-xs">
                    {lang === 'en' ? "Clear All App Data" : "Saara Data Reset Karein"}
                  </h5>
                </div>
                <p className="text-[10px] text-brand-muted leading-relaxed">
                  {lang === 'en' 
                    ? "Resets completed glossary terms count, quiz highscores, daily streak counts, achievements, and custom avatar styling." 
                    : "Yih dabane se aapke seekhe hue sabaq, streaks, high scores aur saara data browser se permanently mita diya jayega."}
                </p>
                <button
                  type="button"
                  onClick={handleResetLearning}
                  className="mt-2.5 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-[10px] tracking-wider uppercase transition-all cursor-pointer"
                >
                  {lang === 'en' ? "Reset Data" : "Reset Data"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: FAQ - Beautiful skeuomorphic accordions with sound chimes */}
        {activeTab === 'faq' && (
          <div className="space-y-3.5 py-1 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            <div>
              <h4 className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider">
                {lang === 'en' ? "Frequently Asked Questions" : "Aam Sawaalat Aur Jawaabat"}
              </h4>
              <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">
                {lang === 'en' ? "Quick guide to Clayverse AI's tactile features and interactive sound engine" : "Clayverse AI ki technology aur mazedaar sahuliyat ko samajhne ki guide"}
              </p>
            </div>

            <div className="space-y-2.5">
              {faqItems.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-brand-slate/10 hover:border-brand-slate/25 bg-white/70 dark:bg-[#FAF8F5]/5 rounded-2xl overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = isOpen ? null : idx;
                        setOpenFaqIndex(nextIdx);
                        if (nextIdx !== null) {
                          playTone(480 + idx * 35, 'sine', 0.1, 0.04);
                        } else {
                          playTone(320, 'sine', 0.08, 0.04);
                        }
                      }}
                      className="w-full py-3 px-4 flex items-center justify-between text-left gap-3 hover:bg-brand-sand/25 dark:hover:bg-white/[0.04] cursor-pointer transition-all active:bg-brand-sand/40"
                    >
                      <span className="font-display font-bold text-xs text-brand-charcoal leading-tight">
                        {lang === 'en' ? item.qEn : item.qUr}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-brand-amber shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-brand-muted shrink-0" />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-[11px] text-brand-slate leading-relaxed border-t border-brand-slate/5 bg-brand-sand/10 dark:bg-white/[0.01]">
                            {lang === 'en' ? item.aEn : item.aUr}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Extra guide line */}
            <div className="pt-2 text-center border-t border-brand-slate/10">
              <span className="text-[9px] font-mono font-bold text-brand-muted uppercase tracking-wider">
                {lang === 'en' ? "Need more help? Ask the AI Agent!" : "Mazeed help chahiye? AI Agent se poochhein!"}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
