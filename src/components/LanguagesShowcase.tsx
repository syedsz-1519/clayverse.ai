import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Volume2, Globe, Check, Sparkles, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useImprovedTTS } from '../hooks/useImprovedTTS';

interface LanguageDetail {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  family: 'Indo-Aryan' | 'Dravidian' | 'Tibeto-Burman' | 'Austroasiatic' | 'Colloquial';
  speakers: string;
  sampleAiTerm: string;
  sampleTranslation: string;
  sampleExplanation: string;
  culturalMetaphor: string;
}

const ALL_LANGUAGES: LanguageDetail[] = [
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Andhra Pradesh & Telangana',
    family: 'Dravidian',
    speakers: '95M+ Speakers',
    sampleAiTerm: 'Pattern Matching',
    sampleTranslation: 'ప్యాటర్న్ మ్యాచింగ్ (నమూనాల గుర్తింపు)',
    sampleExplanation: 'AI అనేది మాయాజాలం కాదు. ఇది భారీ స్థాయిలో ప్యాటర్న్ మ్యాచింగ్ మాత్రమే.',
    culturalMetaphor: 'ముగ్గుల (ర రంగోలి) డిజైన్లను చూసి అలవాటు పడటం లాంటిది'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'North & Central India',
    family: 'Indo-Aryan',
    speakers: '600M+ Speakers',
    sampleAiTerm: 'Neural Network',
    sampleTranslation: 'न्यूरल नेटवर्क (कृत्रिम तंत्रिका तंत्र)',
    sampleExplanation: 'AI कोई जादू नहीं है। यह बड़े पैमाने पर पैटर्न मिलान है।',
    culturalMetaphor: 'चाय बनाते समय सही मात्रा में मसालों का संतुलन सीखना'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu & Puducherry',
    family: 'Dravidian',
    speakers: '85M+ Speakers',
    sampleAiTerm: 'Machine Learning',
    sampleTranslation: 'இயந்திர கற்றல் (மெஷின் லேர்னிங்)',
    sampleExplanation: 'AI என்பது மாயாஜாலம் அல்ல. இது பெரிய அளவிலான பேட்டர்ன் பொருத்தம்.',
    culturalMetaphor: 'கோலம் போடும் போது புள்ளிகளை இணைக்கும் கலை போன்றது'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal & Tripura',
    family: 'Indo-Aryan',
    speakers: '100M+ Speakers in India',
    sampleAiTerm: 'Generative AI',
    sampleTranslation: 'জেনারেটিভ এআই (সৃজনশীল কৃত্রিম বুদ্ধিমত্তা)',
    sampleExplanation: 'AI কোনো জাদু নয়। এটি বিশাল স্কেলে প্যাটার্ন ম্যাচিং।',
    culturalMetaphor: 'শিল্পী যেমন আগের ছবি দেখে নতুন ছবি আঁকেন'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra & Goa',
    family: 'Indo-Aryan',
    speakers: '83M+ Speakers',
    sampleAiTerm: 'Large Language Model',
    sampleTranslation: 'लार्ज लँग्वेज मॉडेल (मोठे भाषा मॉडेल)',
    sampleExplanation: 'AI ही कोणतीही जादू नाही. ही मोठ्या प्रमाणावर पॅटर्न जुळवणी आहे.',
    culturalMetaphor: 'गावातील वाचनालयातील सर्व पुस्तके वाचून उत्तर देणारा हुशार मित्र'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'Pan-India & Telangana, UP, Bihar, J&K',
    family: 'Indo-Aryan',
    speakers: '50M+ Speakers',
    sampleAiTerm: 'Artificial Intelligence',
    sampleTranslation: 'مصنوعی ذہانت (آرٹیفیشل انٹیلیجنس)',
    sampleExplanation: 'مصنوعی ذہانت کوئی جادو نہیں ہے۔ یہ وسیع پیمانے پر پیٹرن میچنگ ہے۔',
    culturalMetaphor: 'استاد کے اندازِ گفتگو کو سمجھ کر شعر مکمل کرنا'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'Gujarat',
    family: 'Indo-Aryan',
    speakers: '55M+ Speakers',
    sampleAiTerm: 'Predictive Model',
    sampleTranslation: 'પૂર્વાનુમાનિત મોડેલ',
    sampleExplanation: 'AI કોઈ જાદુ નથી. તે મોટા પાયે પેટર્ન મેચિંગ છે.',
    culturalMetaphor: 'વેપારીના જૂના હિસાબ પરથી ભવિષ્યનો અંદાજ લગાવવો'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka',
    family: 'Dravidian',
    speakers: '45M+ Speakers',
    sampleAiTerm: 'Deep Learning',
    sampleTranslation: 'ಡೀಪ್ ಲರ್ನಿಂಗ್ (ಆಳವಾದ ಕಲಿಕೆ)',
    sampleExplanation: 'AI ಯಾವುದೇ ಮಾಂತ್ರಿಕತೆಯಲ್ಲ. ಇದು ದೊಡ್ಡ ಪ್ರಮಾಣದಲ್ಲಿ ಪ್ಯಾಟರ್ನ್ ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ.',
    culturalMetaphor: 'ಸංගೀತದ ರಾಗಗಳನ್ನು ಕೇಳಿ ಹೊಸ ರಾಗ ರಚಿಸುವುದು'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala & Lakshadweep',
    family: 'Dravidian',
    speakers: '38M+ Speakers',
    sampleAiTerm: 'Data Training',
    sampleTranslation: 'ഡാറ്റാ പരിശീലനം',
    sampleExplanation: 'എഐ മാന്ത്രികതയല്ല. ഇത് വലിയ തോതിലുള്ള പാറ്റേൺ മാച്ചിംഗ് ആണ്.',
    culturalMetaphor: 'കഥകളിയിലെ മുദ്രകൾ കണ്ട് ഭാവം തിരിച്ചറിയുന്നത് പോലെ'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'Punjab & Haryana',
    family: 'Indo-Aryan',
    speakers: '35M+ Speakers',
    sampleAiTerm: 'Algorithm',
    sampleTranslation: 'ਐਲਗੋਰਿਦਮ (ਸਟੈਪ-ਬਾਈ-ਸਟੈਪ ਵਿਧੀ)',
    sampleExplanation: 'AI ਕੋਈ ਜਾਦੂ ਨਹੀਂ ਹੈ। ਇਹ ਵੱਡੇ ਪੱਧਰ \'ਤੇ ਪੈਟਰਨ ਮੈਚਿੰਗ ਹੈ।',
    culturalMetaphor: 'ਖੇਤਾਂ ਵਿੱਚ ਫਸਲ ਬੀਜਣ ਦਾ ਸਹੀ ਅਤੇ ਅਨੁਭਵੀ ਕ੍ਰਮ'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    region: 'Odisha',
    family: 'Indo-Aryan',
    speakers: '38M+ Speakers',
    sampleAiTerm: 'Pattern Recognition',
    sampleTranslation: 'ପ୍ୟାଟର୍ନ ଚିହ୍ନଟ',
    sampleExplanation: 'AI କୌଣସି ଯାଦୁ ନୁହେଁ। ଏହା ବ୍ୟାପକ ସ୍କେଲରେ ପ୍ୟାଟର୍ନ ମେଚିଂ।',
    culturalMetaphor: 'ପଟ୍ଟଚିତ୍ରରେ ପାରମ୍ପରିକ ରଙ୍ଗର ନିୟମ ଶିଖିବା'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'Assam & Northeast',
    family: 'Indo-Aryan',
    speakers: '15M+ Speakers',
    sampleAiTerm: 'Machine Intelligence',
    sampleTranslation: 'মেচিন বুদ্ধিমত্তা',
    sampleExplanation: 'AI কোনো যাদু নহয়। এইটো বৃহৎ স্কেলত পেটাৰ্ণ মেচিং।',
    culturalMetaphor: 'বিহুৰ ঢোলৰ তাল শুনি নাচৰ ভংগীমা শিকিব পৰা'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    region: 'Bihar & Mithila region',
    family: 'Indo-Aryan',
    speakers: '14M+ Speakers',
    sampleAiTerm: 'Pattern Matching',
    sampleTranslation: 'पैटर्न मिलान',
    sampleExplanation: 'AI कोनो जादू नहि अछि। ई पैघ पैमाना पर पैटर्न मैचिंग अछि।',
    culturalMetaphor: 'मधुबनी चित्रकलाक पारंपरिक रेखाहरू बुझब'
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    region: 'Classical / Pan-India',
    family: 'Indo-Aryan',
    speakers: 'Scholarly & Classical',
    sampleAiTerm: 'कृत्रिमप्रज्ञा',
    sampleTranslation: 'कृत्रिमबुद्धिः (Artificial Intelligence)',
    sampleExplanation: 'कृत्रिमबुद्धिः न काचित् माया। इयं बृहत्प्रमाणेन पद्धतिमेलनम्।',
    culturalMetaphor: 'पाणिनीय व्याकरणस्य सूत्राणि इव तार्किक-संरचना'
  },
  {
    code: 'hinglish',
    name: 'Hinglish',
    nativeName: 'Hinglish (Hindi + English)',
    region: 'Urban Youth & Tech Community',
    family: 'Colloquial',
    speakers: '150M+ Daily Users',
    sampleAiTerm: 'Tokenization',
    sampleTranslation: 'Sentence ko chhote tukdon (Tokens) me todna',
    sampleExplanation: 'Bina kisi tension ke samjho ChatGPT aur AI asal mein kaise kaam karte hain.',
    culturalMetaphor: 'Bina math ke mast chill scene me seekhna'
  },
  {
    code: 'thanglish',
    name: 'Thanglish',
    nativeName: 'Thanglish (Tamil + English)',
    region: 'Tamil Nadu Youth & Tech Circles',
    family: 'Colloquial',
    speakers: '25M+ Daily Users',
    sampleAiTerm: 'Prompt Engineering',
    sampleTranslation: 'AI kitta theliva pesi nalla output vaangradhu',
    sampleExplanation: 'Kozhapame illama ChatGPT matrum AI epdi work aagudhu nu easy-ah therinjikonga.',
    culturalMetaphor: 'Super filter coffee pottu relax-ah concept purinjikradhu'
  },
  {
    code: 'hyd',
    name: 'Hyderabadi',
    nativeName: 'Dakhni Hyderabadi',
    region: 'Hyderabad, Deccan & Marathwada',
    family: 'Colloquial',
    speakers: '20M+ Native Speakers',
    sampleAiTerm: 'Artificial Intelligence',
    sampleTranslation: 'Bole to smart machine ka dimaag',
    sampleExplanation: 'Arey AI koi jaadu nahi hai yaaron. Ye bade paimane par pattern matching hai.',
    culturalMetaphor: 'Irani chai aur Osmania biscuit ke saath asaan baatein'
  }
];

interface LanguagesShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguagesShowcase({ isOpen, onClose }: LanguagesShowcaseProps) {
  const { lang, setLang } = useLanguage();
  const { speak, isPlaying } = useImprovedTTS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [activePreview, setActivePreview] = useState<LanguageDetail>(ALL_LANGUAGES[0]);

  if (!isOpen) return null;

  const filteredLanguages = ALL_LANGUAGES.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFamily = selectedFamily === 'all' || item.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  const handleSelectLanguage = (l: LanguageDetail) => {
    setLang(l.code);
    setActivePreview(l);
  };

  const handlePlayVoice = (l: LanguageDetail) => {
    speak(l.sampleExplanation, { langCode: l.code });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-brand-cream/40 dark:bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-amber/15 text-brand-amber flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-brand-charcoal flex items-center gap-2">
                  <span>Languages of India Showcase</span>
                  <span className="text-xs font-mono font-bold bg-brand-amber text-white px-2.5 py-0.5 rounded-full">
                    25+ Indian Tongues
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted">
                  Authentic, culturally-native explanations authored for learners across every state.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-brand-slate hover:text-brand-charcoal hover:bg-black/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 sm:px-6 bg-brand-sand/30 dark:bg-zinc-900 border-b border-black/[0.04] dark:border-white/[0.06] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                placeholder="Search language, script, or state (e.g. Telugu, Bengali, Tamil)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-brand-charcoal focus:outline-none focus:border-brand-amber"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {['all', 'Indo-Aryan', 'Dravidian', 'Colloquial'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFamily(f)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedFamily === f
                      ? 'bg-brand-amber text-white font-bold'
                      : 'bg-black/5 dark:bg-white/5 text-brand-muted hover:bg-black/10'
                  }`}
                >
                  {f === 'all' ? 'All Families' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Content: Left Grid of Languages, Right Detail & Audio Player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.06] dark:divide-white/[0.08]">
            {/* Left: Language Selection Cards */}
            <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-2.5 max-h-[60vh] lg:max-h-full">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-muted mb-2">
                Showing {filteredLanguages.length} Indian Languages
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredLanguages.map((item) => {
                  const isCurrentActive = lang === item.code;
                  const isSelected = activePreview.code === item.code;

                  return (
                    <div
                      key={item.code}
                      onClick={() => setActivePreview(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-amber bg-amber-500/[0.08] dark:bg-amber-500/[0.12] ring-1 ring-brand-amber/50 shadow-xs'
                          : 'border-black/[0.06] dark:border-white/[0.08] bg-white/60 dark:bg-zinc-800/60 hover:border-black/20 hover:bg-white dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-base text-brand-charcoal">
                            {item.name}
                          </div>
                          <div className="text-xs text-brand-amber font-medium">
                            {item.nativeName}
                          </div>
                        </div>
                        {isCurrentActive && (
                          <span className="text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-brand-muted">
                        <span className="truncate max-w-[140px]">{item.region}</span>
                        <span className="font-mono text-[10px] bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                          {item.family}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Live Interactive Preview & Voice Sample */}
            <div className="lg:col-span-5 p-5 sm:p-6 bg-brand-cream/30 dark:bg-zinc-900/40 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-brand-amber">
                      Language Preview
                    </span>
                    <h3 className="text-2xl font-bold font-display text-brand-charcoal">
                      {activePreview.name} ({activePreview.nativeName})
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-medium text-brand-muted bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/10">
                    {activePreview.speakers}
                  </span>
                </div>

                {/* Cultural Analogy Card */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-brand-amber/25 mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-amber mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Native Cultural Analogy</span>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-charcoal font-medium">
                    "{activePreview.culturalMetaphor}"
                  </p>
                </div>

                {/* AI Concept Demo in Script */}
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-2.5 mb-4">
                  <div className="text-[11px] font-mono uppercase text-brand-muted flex items-center justify-between">
                    <span>Sample Lesson Output</span>
                    <span className="text-brand-amber font-bold">{activePreview.sampleAiTerm}</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-brand-charcoal font-serif">
                    {activePreview.sampleTranslation}
                  </div>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {activePreview.sampleExplanation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                <button
                  onClick={() => handlePlayVoice(activePreview)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-xs sm:text-sm font-bold text-brand-charcoal hover:border-brand-amber flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Volume2 className={`w-4 h-4 text-brand-amber ${isPlaying ? 'animate-bounce' : ''}`} />
                  <span>{isPlaying ? 'Playing Sample Voice...' : 'Listen in this Language'}</span>
                </button>

                <button
                  onClick={() => {
                    handleSelectLanguage(activePreview);
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-brand-amber hover:bg-brand-amber-dark text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Learn in {activePreview.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
