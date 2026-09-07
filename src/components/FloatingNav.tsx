import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Menu, 
  X, 
  Languages, 
  User,
  Search,
  GraduationCap,
  Layers,
  Home
} from 'lucide-react';
import ClayLogo from './ClayLogo';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import { motion, AnimatePresence } from 'motion/react';
import Button from './ui/Button';

export default function FloatingNav() {
  const { lang, setLang } = useLanguageMultilingual();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      id: 'home', 
      label: lang === 'en' ? 'Home' : 'होम', 
      icon: Home,
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    },
    { 
      id: 'curriculum', 
      label: lang === 'en' ? 'Curriculum' : 'पाठ्यक्रम', 
      icon: BookOpen,
      action: () => {
        document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    },
    { 
      id: 'lessons', 
      label: lang === 'en' ? 'Lessons' : 'पाठ', 
      icon: GraduationCap,
      action: () => {
        document.getElementById('what-is-ai')?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    },
    { 
      id: 'concepts', 
      label: lang === 'en' ? '12 Concepts' : '12 अवधारणाएँ', 
      icon: Layers,
      action: () => {
        document.getElementById('deeper')?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    },
  ];

  return (
    <>
      {/* Professional Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200' 
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <ClayLogo size={36} />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-slate-900 leading-none">
                  Clayverse
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'en' ? 'AI Learning Platform' : 'AI सीखने का मंच'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              
              {/* Language Selector - All 7 Languages */}
              <div className="hidden sm:block">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                >
                  <option value="en">🇬🇧 English</option>
                  <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                  <option value="te">🇮🇳 తెలుగు (Telugu)</option>
                  <option value="mr">🇮🇳 मराठी (Marathi)</option>
                  <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
                  <option value="ur">🇵🇰 اردو (Urdu)</option>
                  <option value="roman_ur">🇵🇰 Roman Urdu</option>
                  <option value="hinglish">🇮🇳 Hinglish</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Profile/Login */}
              <button
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Get Started Button - Desktop */}
              <div className="hidden lg:block">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const el = document.getElementById('what-is-ai') || document.getElementById('curriculum');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {lang === 'en' ? 'Get Started' : 'शुरू करें'}
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                
                {/* Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <span className="font-display text-lg font-bold text-slate-900">
                    {lang === 'en' ? 'Menu' : 'मेनू'}
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-slate-700" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Language Selector */}
                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {lang === 'en' ? 'Language' : lang === 'hi' ? 'भाषा' : lang === 'te' ? 'భాష' : lang === 'mr' ? 'भाषा' : lang === 'ta' ? 'மொழி' : 'Language'}
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="en">🇬🇧 English</option>
                    <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                    <option value="te">🇮🇳 తెలుగు (Telugu)</option>
                    <option value="mr">🇮🇳 मराठी (Marathi)</option>
                    <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
                    <option value="ur">🇵🇰 اردو (Urdu)</option>
                    <option value="roman_ur">🇵🇰 Roman Urdu</option>
                    <option value="hinglish">🇮🇳 Hinglish</option>
                  </select>
                </div>

                {/* CTA Button */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    const el = document.getElementById('what-is-ai') || document.getElementById('curriculum');
                    el?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  {lang === 'en' ? 'Start Learning' : 'सीखना शुरू करें'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
