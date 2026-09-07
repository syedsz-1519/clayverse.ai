import React, { useState } from 'react';
import { Menu, X, Home, BookOpen, BarChart3, Users, Search, Bell, User, Settings, LogOut, MoreVertical, Trophy, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguageMultilingual } from '../hooks/useLanguageMultilingual';
import ClayLogo from './ClayLogo';

interface ProfessionalHeaderProps {
  currentView?: 'guide' | 'interview' | 'dashboard' | 'learning-hub';
  onNavigate?: (view: 'guide' | 'interview' | 'dashboard' | 'learning-hub') => void;
  onOpenLanguages?: () => void;
  onOpenSearch?: () => void;
  onMenuToggle?: (open: boolean) => void;
  isMobileMenuOpen?: boolean;
  totalStreak?: number;
  userAvatarUrl?: string;
}

export const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  currentView = 'guide',
  onNavigate,
  onOpenLanguages,
  onOpenSearch,
  onMenuToggle,
  isMobileMenuOpen = false,
  totalStreak = 0,
  userAvatarUrl
}) => {
  const { lang, t, dir } = useLanguageMultilingual();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { id: 'guide', label: lang === 'en' ? 'Learn' : 'सीखें', icon: BookOpen },
    { id: 'learning-hub', label: lang === 'en' ? 'Lessons' : 'पाठ', icon: BarChart3 },
    { id: 'interview', label: lang === 'en' ? 'Practice' : 'अभ्यास', icon: Users },
    { id: 'dashboard', label: lang === 'en' ? 'Progress' : 'प्रगति', icon: Trophy },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-full mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onMenuToggle?.(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-brand-charcoal" />
              ) : (
                <Menu className="w-5 h-5 text-brand-charcoal" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <ClayLogo size={32} />
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg text-brand-charcoal">Clayverse AI</h1>
                <p className="text-xs text-brand-muted leading-none">AI, Explained Simply</p>
              </div>
            </div>
          </div>

          {/* Center Navigation - Desktop Only */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-brand-amber/15 text-brand-amber border border-brand-amber/30'
                      : 'text-brand-slate hover:bg-slate-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Streak Display */}
            {totalStreak > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-bold text-amber-700">{totalStreak}-day streak</span>
              </div>
            )}

            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-brand-muted transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline text-xs">Search...</span>
              <kbd className="hidden md:inline ml-auto text-xs text-brand-muted bg-white px-2 py-0.5 rounded border border-slate-300">
                ⌘K
              </kbd>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-brand-slate hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Language Selector */}
            <button
              onClick={onOpenLanguages}
              className="px-3 py-2 text-sm font-semibold text-white bg-brand-amber hover:bg-brand-amber-dark rounded-lg transition-colors hidden sm:flex items-center gap-1"
            >
              🌐
              <span className="hidden md:inline text-xs">{lang.toUpperCase()}</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {userAvatarUrl ? (
                  <img
                    src={userAvatarUrl}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-amber to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    {lang === 'en' ? 'U' : 'य'}
                  </div>
                )}
                <MoreVertical className="w-4 h-4 text-brand-slate hidden md:block" />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute ${dir === 'rtl' ? 'left-0' : 'right-0'} top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden`}
                  >
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <div className="text-sm font-bold text-brand-charcoal">
                        {lang === 'en' ? 'Learner' : 'शिक्षार्थी'}
                      </div>
                      <div className="text-xs text-brand-muted mt-0.5">
                        {lang === 'en' ? 'Your Profile' : 'आपकी प्रोफाइल'}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-sm text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <User className="w-4 h-4 text-brand-muted" />
                        <span>{lang === 'en' ? 'My Profile' : 'मेरी प्रोफाइल'}</span>
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>{lang === 'en' ? 'Achievements' : 'उपलब्धियां'}</span>
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Calendar className="w-4 h-4 text-brand-muted" />
                        <span>{lang === 'en' ? 'Learning Stats' : 'सीखने की सांख्यिकी'}</span>
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-brand-charcoal hover:bg-slate-50 flex items-center gap-2 transition-colors">
                        <Settings className="w-4 h-4 text-brand-muted" />
                        <span>{lang === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-100"></div>

                    {/* Sign Out */}
                    <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span>{lang === 'en' ? 'Sign Out' : 'साइन आउट करें'}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Below Header */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-slate-100 bg-slate-50 py-2"
            >
              <nav className="flex flex-col gap-1 px-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate?.(item.id as any);
                        onMenuToggle?.(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-brand-amber/15 text-brand-amber border border-brand-amber/30'
                          : 'text-brand-slate hover:bg-white'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default ProfessionalHeader;
