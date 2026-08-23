import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, type Language } from '../hooks/useLanguage';
import { 
  Languages, 
  X, 
  Check, 
  Search, 
  Sparkles, 
  Globe, 
  Heart, 
  School, 
  Layers, 
  Compass,
  Info,
  CheckCircle2
} from 'lucide-react';

export interface IndianLanguageItem {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  category: 'live' | 'southern' | 'northern' | 'classical_tribal';
  status: 'LIVE' | 'BETA';
  tag: string;
  welcomePhrase: string;
  description: string;
}

export const ALL_INDIAN_LANGUAGES: IndianLanguageItem[] = [
  // 1. POPULAR & COLLOQUIAL ROMANIZED HYBRIDS
  {
    code: 'hinglish',
    name: 'Hinglish',
    nativeName: 'हिंग्लिश / Hinglish',
    script: 'Latin / Roman Script',
    region: 'Pan-India Urban Youth & Tech Ecosystem',
    category: 'live',
    status: 'LIVE',
    tag: 'H-ENG',
    welcomePhrase: 'Namaste dosto! AI seekhna ab super easy aur fun hai.',
    description: 'Conversational Hindi in Roman script — perfect for modern digital learners.'
  },
  {
    code: 'thanglish',
    name: 'Thanglish',
    nativeName: 'தங்லீஷ் / Thanglish',
    script: 'Latin / Roman Script',
    region: 'Tamil Nadu & Tech Community',
    category: 'southern',
    status: 'LIVE',
    tag: 'T-ENG',
    welcomePhrase: 'Vanakkam friends! AI-ah romba simple-ah purinjikalam.',
    description: 'Colloquial Tamil in Roman script — beginner-friendly visual explanations.'
  },
  {
    code: 'roman_ur',
    name: 'Roman Urdu',
    nativeName: 'Roman Urdu / رومن اردو',
    script: 'Latin / Roman Script',
    region: 'Pan-India & South Asian Outreach',
    category: 'live',
    status: 'LIVE',
    tag: 'R-URD',
    welcomePhrase: 'Khushamdeed dosto! AI samajhna ab bilkul aasan hai.',
    description: 'Clear conversational Urdu written in easy Roman English alphabets.'
  },
  {
    code: 'hyd',
    name: 'Hyderabadi Urdu',
    nativeName: 'دکنی اردو / హైదరాబాదీ',
    script: 'Perso-Arabic / Latin',
    region: 'Telangana, Deccan & Madrasa Outreach',
    category: 'live',
    status: 'LIVE',
    tag: 'HYD',
    welcomePhrase: 'Arey salaam yaaron! AI seekhna ab bilkul asaan hai.',
    description: 'Grassroots Deccani idiom & Madrasa outreach edition — zero math jargon.'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (Standard)',
    script: 'Latin',
    region: 'Global / Standard',
    category: 'live',
    status: 'LIVE',
    tag: 'ENG',
    welcomePhrase: 'Welcome to Clayverse AI! AI explained simply.',
    description: 'Complete 9-chapter interactive curriculum with audio & simulations.'
  },

  // 2. MAJOR CONSTITUTIONAL & REGIONAL LANGUAGES
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'देवनागरी (Devanagari)',
    region: 'Pan-Northern & Central India',
    category: 'northern',
    status: 'LIVE',
    tag: 'HIN',
    welcomePhrase: 'नमस्ते! बिना किसी कठिन गणित के AI को आसानी से समझें।',
    description: 'Standard Devanagari edition with active vernacular glossary.'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'বাংলা লিপি (Bengali)',
    region: 'West Bengal, Tripura & Assam',
    category: 'northern',
    status: 'LIVE',
    tag: 'BEN',
    welcomePhrase: 'স্বাগতম! কৃত্রিম বুদ্ধিমত্তা সহজভাবে শিখুন।',
    description: 'Eastern Indo-Aryan core curriculum in translation.'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'తెలుగు లిపి (Telugu)',
    region: 'Andhra Pradesh & Telangana',
    category: 'southern',
    status: 'LIVE',
    tag: 'TEL',
    welcomePhrase: 'స్వాగతం! AI ని మీ మాతృభాషలో సులభంగా నేర్చుకోండి.',
    description: 'Full South-Central Dravidian localization across all core lessons.'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'देवनागरी (Devanagari)',
    region: 'Maharashtra & Goa',
    category: 'northern',
    status: 'LIVE',
    tag: 'MAR',
    welcomePhrase: 'नमस्कार! कृत्रिम बुद्धिमत्ता सोप्या भाषेत शिका.',
    description: 'Maharashtra grassroots schools and colleges vernacular edition.'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'தமிழ் வரிவடிவம் (Tamil)',
    region: 'Tamil Nadu & Puducherry',
    category: 'southern',
    status: 'LIVE',
    tag: 'TAM',
    welcomePhrase: 'வணக்கம்! செயற்கை நுண்ணறிவை எளிய முறையில் கற்றுக்கொள்ளுங்கள்.',
    description: 'Dravidian classical lineage — regional AI glossary and terms.'
  },
  {
    code: 'ur',
    name: 'Urdu (Fusha / Classical)',
    nativeName: 'اردو (فصیح)',
    script: 'نستعلیق (Nastaliq)',
    region: 'Pan-India & Madrasa Academic Curricula',
    category: 'northern',
    status: 'LIVE',
    tag: 'URD',
    welcomePhrase: 'خوش آمدید! مصنوعی ذہانت کو آسان اور عام فہم انداز میں سیکھیں۔',
    description: 'Madrasa and academic Urdu edition for scholars and students.'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'ગુજરાતી લિપિ (Gujarati)',
    region: 'Gujarat & Western India',
    category: 'northern',
    status: 'LIVE',
    tag: 'GUJ',
    welcomePhrase: 'નમસ્તે! આર્ટિફિશિયલ ઇન્ટેલિજન્સ સરળ રીતે શીખો.',
    description: 'Western entrepreneurial and regional learning modules.'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'ಕನ್ನಡ ಲಿಪಿ (Kannada)',
    region: 'Karnataka',
    category: 'southern',
    status: 'LIVE',
    tag: 'KAN',
    welcomePhrase: 'ನಮಸ್ಕಾರ! ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯನ್ನು ಸುಲಭವಾಗಿ ಕಲಿಯಿರಿ.',
    description: 'Karnataka tech hub vernacular outreach edition in active learning.'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'ଓଡ଼ିଆ ଲିପି (Odia)',
    region: 'Odisha',
    category: 'northern',
    status: 'LIVE',
    tag: 'ODI',
    welcomePhrase: 'ନମସ୍କାର! କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା ସହଜରେ ଶିଖନ୍ତୁ।',
    description: 'Eastern coastal classical language support.'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'മലയാള ലിപി (Malayalam)',
    region: 'Kerala & Lakshadweep',
    category: 'southern',
    status: 'LIVE',
    tag: 'MAL',
    welcomePhrase: 'നമസ്കാരം! എഐ ലളിതമായി പഠിക്കാം.',
    description: 'High-literacy digital vernacular curriculum.'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'ਗੁਰਮੁਖੀ (Gurmukhi)',
    region: 'Punjab & Northern India',
    category: 'northern',
    status: 'LIVE',
    tag: 'PAN',
    welcomePhrase: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! AI ਨੂੰ ਬਿਲਕੁਲ ਆਸਾਨੀ ਨਾਲ ਸਿੱਖੋ।',
    description: 'North-Western vernacular outreach edition.'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'অসমীয়া লিপি (Assamese)',
    region: 'Assam & Brahmaputra Valley',
    category: 'northern',
    status: 'LIVE',
    tag: 'ASM',
    welcomePhrase: 'নমস্কাৰ! সহজ ভাষাত কৃত্ৰিম বুদ্ধিমত্তা শিকক।',
    description: 'North-East regional valley student outreach.'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'तिरहुता / देवनागरी',
    region: 'Bihar & Mithila Region',
    category: 'northern',
    status: 'LIVE',
    tag: 'MAI',
    welcomePhrase: 'प्रणाम! आसानी सँ AI सीखू।',
    description: 'Mithila cultural region grassroots support.'
  },

  // 3. CLASSICAL, TRIBAL & HIMALAYAN
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'देवनागरी (Devanagari)',
    region: 'Pan-Indian Classical & Computational Linguistics',
    category: 'classical_tribal',
    status: 'LIVE',
    tag: 'SAN',
    welcomePhrase: 'नमस्ते! कृत्रिमबुद्धेः तत्वानि सरलतया अवगच्छन्तु।',
    description: 'Ancient computational linguistics & algorithmic roots.'
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر / कॉशुर',
    script: 'Perso-Arabic / Devanagari',
    region: 'Jammu & Kashmir',
    category: 'northern',
    status: 'LIVE',
    tag: 'KAS',
    welcomePhrase: 'آداب! AI ہیکیو آسانی سان ہیچھتھ۔',
    description: 'Valley youth digital skills enablement.'
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी (ಕೊಂಕಣಿ)',
    script: 'Devanagari / Romi',
    region: 'Goa & Konkan Coastal Belt',
    category: 'southern',
    status: 'LIVE',
    tag: 'KOK',
    welcomePhrase: 'नमस्कार! सोप्या भाशेंत AI शिका.',
    description: 'Konkan belt student localization.'
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي / सिन्धी',
    script: 'Khudabadi / Perso-Arabic',
    region: 'Sindhi Community & Western India',
    category: 'northern',
    status: 'LIVE',
    tag: 'SND',
    welcomePhrase: 'نمسڪار! آساني سان AI سکو.',
    description: 'Heritage language educational translation.'
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari / Takri',
    region: 'Jammu & Himachal Pradesh',
    category: 'northern',
    status: 'LIVE',
    tag: 'DOG',
    welcomePhrase: 'नमस्ते! डोगरी च AI सीक्खो।',
    description: 'Duggar region student outreach.'
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
    script: 'Ol Chiki (ᱚᱞ ᱪᱤᱠᱤ)',
    region: 'Jharkhand, Odisha & Tribal Belt',
    category: 'classical_tribal',
    status: 'LIVE',
    tag: 'SAT',
    welcomePhrase: 'ᱡᱚᱦᱟᱨ! ᱟᱞᱜᱟᱛᱮ AI ᱪᱮᱫᱚᱜ ᱢᱮ।',
    description: 'Empowering tribal youth with first-class AI education.'
  },
  {
    code: 'mni',
    name: 'Manipuri / Meitei',
    nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ (Manipuri)',
    script: 'Meitei Mayek (ꯃꯤꯇꯩ ꯃꯌꯦꯛ)',
    region: 'Manipur & North-East',
    category: 'classical_tribal',
    status: 'LIVE',
    tag: 'MNI',
    welcomePhrase: 'ꯈꯨꯔꯨꯃꯖꯔꯤ! AI ꯂꯥꯏꯅ ꯇꯝꯃꯨ।',
    description: 'North-Eastern indigenous script digital inclusion.'
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर\' (Bodo)',
    script: 'Devanagari',
    region: 'Bodoland & Assam',
    category: 'classical_tribal',
    status: 'LIVE',
    tag: 'BOD',
    welcomePhrase: 'खुलुमबाय! गोरलैयैनो AI सोलों।',
    description: 'Bodoland grassroots community inclusion.'
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'देवनागरी',
    region: 'Sikkim, Darjeeling & Himalayan Belt',
    category: 'classical_tribal',
    status: 'LIVE',
    tag: 'NEP',
    welcomePhrase: 'नमस्ते! सजिलैसँग AI सिक्नुहोस्।',
    description: 'Himalayan and North-Eastern student outreach.'
  },
  {
    code: 'tcy',
    name: 'Tulu',
    nativeName: 'ತುಳು (Tulu)',
    script: 'ಕನ್ನಡ / ತುಳು లిపి',
    region: 'Coastal Karnataka & Northern Kerala',
    category: 'southern',
    status: 'LIVE',
    tag: 'TUL',
    welcomePhrase: 'ಸೊಲ್ಮೆಲು! AI ಕಲ್ಪನೆನ್ ಸುಲಭವಾದ್ ತೆರಿಯೊನ್ಲೆ.',
    description: 'Coastal Dravidian heritage dialect assistance.'
  }
];

export default function FloatingLanguageBubble() {
  const { lang, setLang } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'live' | 'southern' | 'northern' | 'classical_tribal'>('all');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Filter languages based on search and selected category
  const filteredLanguages = useMemo(() => {
    return ALL_INDIAN_LANGUAGES.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.nativeName.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.script.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q);

      const matchesCategory = 
        activeCategory === 'all' || 
        (activeCategory === 'live' && (item.category === 'live' || ['hi', 'te', 'bn', 'ta', 'mr', 'ur', 'hinglish', 'thanglish', 'roman_ur', 'hyd', 'en'].includes(item.code))) ||
        item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const activeLanguageItem = useMemo(() => {
    return ALL_INDIAN_LANGUAGES.find(item => item.code === lang) || ALL_INDIAN_LANGUAGES[0];
  }, [lang]);

  const handleLanguageSelect = (item: IndianLanguageItem) => {
    // Set the language directly across the entire global context and localStorage
    setLang(item.code as Language);

    // Show celebratory regional welcome toast
    setNotificationToast(`${item.nativeName} (${item.name}): ${item.welcomePhrase}`);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);

    setShowMenu(false);
  };

  // Quick cycle through top popular languages on double click
  const cycleNextLanguage = () => {
    const popularCodes = ['en', 'hinglish', 'hi', 'te', 'hyd', 'thanglish', 'roman_ur', 'bn', 'ta', 'mr', 'ur', 'gu', 'kn', 'ml', 'pa', 'as', 'mai'];
    const currentIndex = popularCodes.indexOf(lang);
    const nextIndex = (currentIndex + 1) % popularCodes.length;
    const nextCode = popularCodes[nextIndex];
    const targetItem = ALL_INDIAN_LANGUAGES.find(l => l.code === nextCode);
    if (targetItem) {
      handleLanguageSelect(targetItem);
    } else {
      setLang(nextCode as Language);
    }
  };

  const getButtonTag = () => {
    return activeLanguageItem ? activeLanguageItem.tag : 'ENG';
  };

  return (
    <>
      {/* Regional Toast Notification */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 border border-brand-amber/40 max-w-lg w-[92vw] text-left text-xs pointer-events-auto"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-amber text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-mono uppercase text-brand-amber font-bold">
                Language Changed & Saved Globally
              </span>
              <span className="block font-medium leading-snug text-slate-100">{notificationToast}</span>
            </div>
            <button 
              onClick={() => setNotificationToast(null)}
              className="p-1.5 text-brand-sand/70 hover:text-white rounded-full cursor-pointer hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-[88px] right-[26px] z-40 flex items-center gap-3 pointer-events-none select-none">
        <div className="pointer-events-auto flex items-center gap-3 relative">
          
          {/* Categorized Indian Languages Modal / Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 15, x: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 15, x: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute right-0 sm:right-14 bottom-0 bg-[#FDFBF7] border-2 border-brand-amber/40 rounded-3xl p-4 shadow-2xl w-[330px] sm:w-[440px] max-h-[82vh] flex flex-col pointer-events-auto backdrop-blur-xl text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-brand-charcoal/10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-amber text-white flex items-center justify-center shadow-xs">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-black text-brand-charcoal leading-tight">
                        Indian Languages Directory
                      </h3>
                      <span className="text-[9.5px] font-mono text-brand-amber font-bold flex items-center gap-1">
                        <span>{ALL_INDIAN_LANGUAGES.length} Indian Languages & Dialects</span>
                        <span>•</span>
                        <span className="text-emerald-700">Persists Globally</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-1.5 rounded-full text-brand-muted hover:text-brand-charcoal hover:bg-brand-sand/70 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Madrasa & Grassroots Mission Notice Banner */}
                <div className="my-2.5 p-2.5 rounded-2xl bg-amber-500/10 border border-brand-amber/25 flex items-start gap-2 shrink-0">
                  <School className="w-4 h-4 text-brand-amber-dark shrink-0 mt-0.5" />
                  <div className="text-[11px] text-brand-charcoal leading-relaxed">
                    <span className="font-bold block text-[11px] text-brand-amber-dark">
                      Grassroots & Madrasa Outreach Mission
                    </span>
                    Dedicated to non-native learners, Madrasa scholars, and vernacular students across all Indian states with zero jargon.
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2 shrink-0">
                  <Search className="w-3.5 h-3.5 text-brand-slate absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search (Hinglish, Thanglish, हिन्दी, தமிழ், Urdu)..."
                    className="w-full pl-8 pr-7 py-2 bg-white border border-brand-slate/20 rounded-xl text-xs text-brand-charcoal placeholder-brand-muted focus:outline-none focus:border-brand-amber"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-muted hover:text-brand-charcoal cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none shrink-0">
                  {[
                    { id: 'all', label: `All (${ALL_INDIAN_LANGUAGES.length})` },
                    { id: 'live', label: '✨ Live & Popular' },
                    { id: 'southern', label: '🌴 Southern (Dravidian)' },
                    { id: 'northern', label: '🏔️ Northern & Central' },
                    { id: 'classical_tribal', label: '🌿 Classical & Tribal' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? 'bg-brand-charcoal text-white shadow-xs'
                          : 'bg-brand-sand/50 text-brand-slate hover:bg-brand-sand hover:text-brand-charcoal'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Categorized Language List */}
                <div className="overflow-y-auto max-h-[320px] space-y-1.5 pr-1 scrollbar-thin flex-1">
                  {filteredLanguages.length === 0 ? (
                    <div className="p-6 text-center text-xs text-brand-muted">
                      No language found matching "{searchQuery}".
                    </div>
                  ) : (
                    filteredLanguages.map((item) => {
                      const isCurrent = lang === item.code;
                      return (
                        <button
                          key={item.code}
                          onClick={() => handleLanguageSelect(item)}
                          className={`w-full p-2.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col gap-1 ${
                            isCurrent
                              ? 'bg-brand-amber/15 border-brand-amber/60 shadow-xs ring-1 ring-brand-amber/40'
                              : 'bg-white hover:bg-brand-sand/50 border-brand-slate/10 hover:border-brand-amber/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black shrink-0 ${
                                isCurrent 
                                  ? 'bg-brand-amber text-white' 
                                  : 'bg-brand-sand text-brand-slate'
                              }`}>
                                {item.tag}
                              </span>
                              <span className="text-xs font-bold text-brand-charcoal truncate">
                                {item.nativeName}
                              </span>
                              <span className="text-[10px] text-brand-muted shrink-0">
                                ({item.name})
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                                {item.status}
                              </span>
                              {isCurrent ? (
                                <CheckCircle2 className="w-4 h-4 text-brand-amber shrink-0" />
                              ) : null}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-brand-slate pl-0.5">
                            <span className="truncate pr-2">{item.region}</span>
                            <span className="font-mono text-[9px] text-brand-muted shrink-0">{item.script}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer Note */}
                <div className="pt-2.5 mt-2 border-t border-brand-charcoal/10 flex items-center justify-between text-[10px] text-brand-muted shrink-0">
                  <div className="flex items-center gap-1 text-brand-amber font-bold">
                    <Heart className="w-3 h-3 fill-brand-amber" />
                    <span>Selected language persists everywhere</span>
                  </div>
                  <span className="font-mono text-[9px]">Madrasa & Grassroots AI Initiative</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Bubble Action Button */}
          <motion.button
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            onDoubleClick={cycleNextLanguage}
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              y: [0, -4, 0],
            }}
            transition={{ 
              y: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }
            }}
            className="w-12 h-12 bg-white hover:bg-brand-sand/30 border-2 border-[#E07A5F] text-[#E07A5F] rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer relative group"
            title={`Active: ${activeLanguageItem.name} (${activeLanguageItem.nativeName}) — Click to open 25+ Indian Languages directory. Double-click to cycle.`}
          >
            <Languages className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Quick Active Language Indicator Tag */}
            <span className="absolute -top-1.5 -right-1.5 bg-[#E07A5F] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border border-white shadow-sm font-mono uppercase tracking-tighter">
              {getButtonTag()}
            </span>
          </motion.button>
        </div>
      </div>
    </>
  );
}
