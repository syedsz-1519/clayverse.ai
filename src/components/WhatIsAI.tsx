import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, 
  MapPin, 
  MessageSquareCode, 
  Mic, 
  Mail, 
  Smile, 
  BrainCircuit, 
  Sparkles, 
  Zap, 
  Info,
  Smartphone,
  Compass,
  Target,
  History,
  Languages
} from 'lucide-react';
import { PocketExample, AIType } from '../types';
import TechTooltip from './TechTooltip';
import AITimeline from './AITimeline';
import { useLanguage } from '../hooks/useLanguage';
import ReadSectionButton from './ReadSectionButton';

export default function WhatIsAI() {
  const { lang, t } = useLanguage();
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const pocketExamples: PocketExample[] = [
    {
      id: 'netflix',
      title: lang === 'en' ? 'Netflix Predictions' : 'Netflix ki Soch',
      iconName: 'Tv',
      description: lang === 'en' ? 'Finds your next movie obsession.' : 'Tumhein agli film bolta.',
      explanation: lang === 'en' 
        ? 'Instead of choosing blindly, it compares your exact viewing history with millions of other users to spot similar taste patterns.'
        : 'Blindly select karne ke bajaye, ye tumhari watched films ko baaqi hazaaro logon se compare karke dhang ke patterns nikalta hai.'
    },
    {
      id: 'maps',
      title: lang === 'en' ? 'Google Maps ETA' : 'Google Maps ETA',
      iconName: 'MapPin',
      description: lang === 'en' ? 'Predicts traffic patterns.' : 'Traffic patterns dhoondta.',
      explanation: lang === 'en'
        ? 'Looks at historical road congestion alongside real-time speeds of active drivers to forecast your arrival down to the minute.'
        : 'Purani traffic congestion aur abhi chalre so gaadiyon ki speed dekh ke bilkul minute to minute sahi rasta aur ETA batata hai.'
    },
    {
      id: 'chatgpt',
      title: lang === 'en' ? 'ChatGPT responses' : 'ChatGPT ke Jawaab',
      iconName: 'MessageSquareCode',
      description: lang === 'en' ? 'Drafts emails and answers.' : 'Mails likhta aur jawaab deta.',
      explanation: lang === 'en'
        ? 'A program that has digested massive libraries of human text, letting it predict the most helpful next word in a sentence.'
        : 'Aisa program jisko duniya jahan ki kitabein padhaye, taaki wo sentence mein agla sabse logical word khud predict kar sake.'
    },
    {
      id: 'assistants',
      title: lang === 'en' ? 'Voice Assistants' : 'Awaaz wale Assistants',
      iconName: 'Mic',
      description: lang === 'en' ? 'Siri & Alexa listening.' : 'Siri aur Alexa ka sunna.',
      explanation: lang === 'en'
        ? 'Translates sound waves of spoken words into text commands, mapping them to software actions like setting an alarm.'
        : 'Hamari boli so awaaz ko text commands mein badal ke mobile ya speaker ko alarm lagane ya gaana bajane bolta hai.'
    },
    {
      id: 'spam',
      title: lang === 'en' ? 'Spam Filtering' : 'Spam Filter (Safe Inbox)',
      iconName: 'Mail',
      description: lang === 'en' ? 'Keeps your inbox safe.' : 'Kachra mails door rakhta.',
      explanation: lang === 'en'
        ? 'Scans text files for warning words or sender patterns to filter out unwanted messages before they hit your view.'
        : 'Har aane wale mail ko scan karta hai warning words aur fake senders ke liye, taaki kachra mail seedha spam folder mein chale jaye.'
    },
    {
      id: 'photo',
      title: lang === 'en' ? 'Photo Face-grouping' : 'Chehra Pehchanna',
      iconName: 'Smile',
      description: lang === 'en' ? 'Sorts photos by friend.' : 'Doston ke photos alag karta.',
      explanation: lang === 'en'
        ? 'Finds unique geometry in facial structures, grouping photos of the same individual together automatically.'
        : 'Chehre ki ankhon, naak, aur naksh ko pehchan ke ek hi dost ki saari photos ko ek album mein jama kar deta hai.'
    }
  ];

  const aiTypes: AIType[] = [
    {
      title: lang === 'en' ? 'Narrow AI' : 'Narrow AI (Chota AI)',
      short: 'ANI',
      badge: lang === 'en' ? 'What exists today' : 'Jo aaj chalra hai',
      description: lang === 'en' 
        ? 'Systems designed to master just one specific task, like playing chess or recommending music. Every single AI system in operation today is Narrow AI.'
        : 'Aise systems jo khali ek hi kaam mein ustad hote hain, jaise chess khelna ya gaane batana. Aaj chalra so har AI khali ANI hai yaaron.'
    },
    {
      title: lang === 'en' ? 'General AI' : 'General AI (Insaan ke Jaisa)',
      short: 'AGI',
      badge: lang === 'en' ? 'Theoretical target' : 'Aane wala kal',
      description: lang === 'en'
        ? 'A theoretical system with human-level intelligence that can learn and apply knowledge to any problem. It does not exist yet.'
        : 'Insaan ke barabar dimaag rakhne wala AI jo koi bhi naya kaam khud seekh sake. Ye abhi tak nahi bana hai yaaron.'
    },
    {
      title: lang === 'en' ? 'Super AI' : 'Super AI (Insaan se aage)',
      short: 'ASI',
      badge: lang === 'en' ? 'Sci-Fi boundary' : 'Hypothetical hadd',
      description: lang === 'en'
        ? 'A hypothetical machine that surpasses human brain capacity in every dimension, from logical analysis to social empathy.'
        : 'Aisi machine jo har cheez mein insaani dimaag se hazar guna aage nikal jaye. Khali filmon mein dikhate abhi tak.'
    }
  ];

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Tv': return <Tv className="w-5 h-5 text-brand-amber" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-brand-amber" />;
      case 'MessageSquareCode': return <MessageSquareCode className="w-5 h-5 text-brand-amber" />;
      case 'Mic': return <Mic className="w-5 h-5 text-brand-amber" />;
      case 'Mail': return <Mail className="w-5 h-5 text-brand-amber" />;
      case 'Smile': return <Smile className="w-5 h-5 text-brand-amber" />;
      default: return <BrainCircuit className="w-5 h-5 text-brand-amber" />;
    }
  };

  return (
    <div id="what-is-ai" className="scroll-mt-16 py-12">
      {/* 1. What is AI? Explanation Section */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Bento Card 1: Main Text Explanation (Col Span 8) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 flex flex-col justify-between p-8 bg-white border border-brand-slate/10 rounded-3xl skeuo-raised relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* Top Row with Icon, Lesson Badge, and Dynamic Translation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                {/* 3D-style Tactile Icon Tile */}
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 text-brand-amber">
                  <BrainCircuit className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
                </div>
                <ReadSectionButton sectionId="what-is-ai" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber mb-2 block font-mono">
                {lang === 'en' ? "Lesson 01" : "Sabak 01"}
              </span>

              {lang === 'en' ? (
                <>
                  <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mb-4">
                    So, What actually is AI?
                  </h2>
                  <p className="font-sans text-brand-charcoal leading-relaxed mb-6 text-[15px]">
                    <TechTooltip term="Artificial Intelligence">Artificial Intelligence</TechTooltip> — <span className="text-brand-slate italic">the capability of computer systems to perform tasks that historically required human thinking or reasoning</span> — is not an independent thinking creature. Instead, it is a tool that detects recurring structures in huge sets of data.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mb-4">
                    Arey Yaaron, AI Bole to Asal mein kya hai?
                  </h2>
                  <p className="font-sans text-brand-charcoal leading-relaxed mb-6 text-[15px]">
                    <strong className="text-brand-amber">AI yaane Artificial Intelligence</strong> bole to <span className="text-brand-slate italic">computer'aa ko dimaag dena</span>. Iska matlab ye nahi hai ki computer khud ba khud sochra. Khali usko bohot saara data (jaise photo’aa, likhe so baataan) dikha ke seekha dete. Uske baad, computer naye cheezon ko pehchanta aur jawaab deta, bilkul ek dimaag wale ke jaisa! Asal mein ye khali ek tool hai jo bade data mein se patterns dhoond leta hai.
                  </p>
                </>
              )}

              {/* AI Timeline Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm border ${showTimeline ? 'bg-brand-charcoal text-white border-brand-charcoal' : 'bg-[#E07A5F] text-white border-[#C55937] hover:bg-[#C55937]'}`}
                >
                  <History className="w-4 h-4" />
                  <span>{showTimeline ? (lang === 'en' ? "Hide AI Timeline" : "Timeline Chupao") : (lang === 'en' ? "Explore AI Timeline" : "AI Timeline Dekho Yaaron")}</span>
                </button>
              </div>
            </div>

            {/* Analogy callout - glassmorphic overlay */}
            <div className="glass-panel p-5 rounded-2xl border-l-4 border-brand-amber relative overflow-hidden bg-brand-sand/20">
              <span className="font-mono text-xs font-bold text-brand-amber uppercase block mb-1">
                {lang === 'en' ? "A Simple Analogy" : "Ekdam Simple Misaal"}
              </span>
              <p className="text-brand-charcoal text-xs leading-relaxed italic">
                {lang === 'en' ? (
                  `"It’s just like teaching a child what a 'dog' is. You don't hand them a legal brief explaining animal biology. You show them thousands of dogs in real life until their brain naturally links the floppy ears, tails, and sizes together."`
                ) : (
                  `"Arey bhai, ye bilkul bache ko billi ya kutte ki pehchaan seekhane ke jaisa hai. Tum usko kitaab padha ke biological details nahi samjhate. Tum usko hazaaro baar kutte dikhaate. Bache ka dimaag khud-ba-khud floppy ears, moochh aur dum ke patterns jod leta hai. Bas, computer bhi aise hi seekhta hai!"`
                )}
              </p>
            </div>
          </motion.div>

          {/* Bento Card 2: Tactical Illustration (Col Span 4) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4 skeuo-raised bg-[#F9F7F3] border border-brand-slate/10 p-8 rounded-3xl flex flex-col justify-between items-center overflow-hidden min-h-[340px]"
          >
            {/* Decorative rotating gears or circles */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.03),transparent)] pointer-events-none" />
            <div className="flex-grow flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                className="w-40 h-40 rounded-full border border-dashed border-brand-amber/25 flex items-center justify-center relative"
              >
                <div className="w-28 h-28 rounded-full border border-dashed border-brand-slate/20 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-brand-amber/10 flex items-center justify-center shadow-inner">
                    <BrainCircuit className="w-6 h-6 text-brand-amber" />
                  </div>
                </div>
                {/* Moving node dots on the boundary */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-amber shadow-sm" />
                <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-brand-slate shadow-sm" />
              </motion.div>
            </div>

             <div className="text-center mt-4">
              <span className="font-display text-sm font-bold text-brand-charcoal">
                {lang === 'en' ? "The Pattern Matcher" : "Pattern Pehchanne Wala"}
              </span>
              <p className="text-[11px] text-brand-muted mt-1 max-w-[200px] mx-auto leading-relaxed">
                {lang === 'en' 
                  ? "Data goes in, patterns are discovered, decisions come out." 
                  : "Pehle data andar jaata, phir patterns dhoond ke, seedha faisla bahar aata!"
                }
              </p>
            </div>
          </motion.div>

        </div>

        {/* Dynamic Timeline Section Container */}
        <AnimatePresence>
          {showTimeline && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <AITimeline />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. Pocket Examples Grid Section */}
      <section className="py-12 bg-brand-sand/15 border-y border-brand-slate/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Bento Card 1: Title Card (Col Span 4) */}
            <div className="lg:col-span-4 p-8 bg-white border border-brand-slate/10 rounded-3xl flex flex-col justify-center relative overflow-hidden skeuo-raised">
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* 3D-style Tactile Icon Tile */}
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-4 border-r border-brand-amber/20 shadow-[0_6px_12px_-3px_rgba(211,98,64,0.12),0_10px_20px_-5px_rgba(211,98,64,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 mb-5 text-brand-amber">
                <Smartphone className="w-5 h-5 drop-shadow-[0_1.5px_2px_rgba(211,98,64,0.15)]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono">
                {lang === 'en' ? "Lesson 02" : "Sabak 02"}
              </span>
              <h2 className="font-display text-2xl font-extrabold text-brand-charcoal mt-1 mb-4">
                {lang === 'en' ? "AI in Your Pocket" : "Roz ka AI Istemaal"}
              </h2>
              <p className="font-sans text-xs leading-relaxed text-brand-muted">
                {lang === 'en' 
                  ? "You probably use AI multiple times a day without even noticing. Here are six everyday examples of how AI processes patterns behind the scenes."
                  : "Hum roz bohot saari jagah pattern matching dekhte hain aur humein pata bhi nahi chalta yaaron. Dekho ye 6 asaan misalein."
                }
                <span className="block mt-4 text-[#E07A5F] font-bold font-mono">
                  {lang === 'en' ? "Tap any card to reveal how it works under the hood." : "Koyi bhi card dabaake check karo iske piche kya logic hai."}
                </span>
              </p>
            </div>

            {/* Bento Card 2: 6 Pocket Examples (Col Span 8) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pocketExamples.map((example) => (
                <motion.div
                  key={example.id}
                  onClick={() => setSelectedExample(selectedExample === example.id ? null : example.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="skeuo-raised bg-white p-5 cursor-pointer relative overflow-hidden group select-none flex flex-col justify-between border border-brand-slate/10 rounded-2xl min-h-[150px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-sand/60 flex items-center justify-center border border-brand-slate/5 shadow-inner">
                        {renderIcon(example.iconName)}
                      </div>
                      <span className="text-[10px] font-mono text-brand-muted group-hover:text-brand-amber transition-colors">
                        {selectedExample === example.id 
                          ? (lang === 'en' ? 'Close' : 'Band Karo') 
                          : (lang === 'en' ? 'Reveal' : 'Kholo')
                        }
                      </span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-brand-charcoal mb-0.5">
                      {example.title}
                    </h3>
                    <p className="text-[11px] text-brand-muted leading-snug">
                      {example.description}
                    </p>
                  </div>

                  {/* Animated disclosure layer */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: selectedExample === example.id ? 'auto' : 0, 
                      opacity: selectedExample === example.id ? 1 : 0 
                    }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-3 pt-3 border-t border-brand-slate/5"
                  >
                    <p className="text-[10px] leading-relaxed text-brand-charcoal bg-brand-sand/30 p-2 rounded-lg border border-brand-amber/10 flex items-start gap-1.5">
                      <Info className="w-3 h-3 text-brand-amber shrink-0 mt-0.5" />
                      <span>{example.explanation}</span>
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Types of AI capability Section */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-amber font-mono">
            {lang === 'en' ? "Lesson 03" : "Sabak 03"}
          </span>
          <h2 className="font-display text-3xl font-extrabold text-brand-charcoal mt-1 mb-3">
            {lang === 'en' ? "The Three Horizons of AI" : "AI ke Teen Horizons"}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed">
            {lang === 'en'
              ? "Scientists divide AI into three major stages based on what the machines can actually achieve."
              : "Duniya ke bade scientists AI ko teen bade darjon mein divide karte hain machines ki taaqat ke mutabiq."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {aiTypes.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="skeuo-raised p-6 bg-white border border-brand-slate/10 rounded-3xl flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {/* 3D-style Tactile Icon Tile */}
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-white to-[#F4EFE6] border border-t-white border-l-white border-b-[3px] border-r border-brand-amber/15 shadow-[0_4px_8px_-2px_rgba(211,98,64,0.1),inset_0_1.5px_2px_rgba(255,255,255,0.95)] flex items-center justify-center shrink-0 text-brand-amber">
                    {i === 0 ? <Target className="w-4.5 h-4.5" /> : i === 1 ? <Compass className="w-4.5 h-4.5" /> : <Sparkles className="w-4.5 h-4.5" />}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 bg-brand-sand text-brand-slate rounded-full text-[10px] font-bold font-mono tracking-wider border border-brand-slate/5">
                      {type.short}
                    </span>
                    <span className="text-[9px] font-bold text-brand-amber bg-brand-amber/10 px-2 py-0.5 rounded-full border border-brand-amber/10">
                      {type.badge}
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-base font-bold text-brand-charcoal mb-2">
                  {type.title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {type.description}
                </p>
              </div>

              {/* Visual structural accent */}
              <div className="h-1 bg-brand-sand mt-6 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-amber"
                  style={{ width: i === 0 ? '100%' : i === 1 ? '33%' : '5%' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
