import { motion } from 'motion/react';
import { ShieldCheck, Languages, BookOpen, Sparkles, Volume2, Users } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface StatItem {
  id: string;
  icon: any;
  value: string;
  labelEn: string;
  labelTe: string;
  labelHi: string;
  subEn: string;
  subTe: string;
  subHi: string;
}

export default function TrustSignals() {
  const { lang } = useLanguage();

  const stats: StatItem[] = [
    {
      id: 'free',
      icon: ShieldCheck,
      value: '100% Free',
      labelEn: 'No Paywalls or Hidden Ads',
      labelTe: 'పూర్తిగా ఉచితం',
      labelHi: '100% नि:शुल्क एवं खुला',
      subEn: 'Democratizing AI knowledge for everyone',
      subTe: 'ప్రతి ఒక్కరికీ అందుబాటులో ఉండే జ్ఞానం',
      subHi: 'बिना किसी सब्सक्रिप्शन या रुकावट के'
    },
    {
      id: 'languages',
      icon: Languages,
      value: '25+ Languages',
      labelEn: 'Native Indian Mother Tongues',
      labelTe: 'ప్రాంతీయ భాషలలో వివరణ',
      labelHi: 'मातृभाषा में स्पष्ट समझ',
      subEn: 'Telugu, Hindi, Tamil, Bengali & more',
      subTe: 'తెలుగు, హిందీ, తమిళం మరియు ఇతర భాషలు',
      subHi: 'तेलुगु, हिंदी, तमिल, बांग्ला व अन्य'
    },
    {
      id: 'zero-math',
      icon: Sparkles,
      value: 'Zero Math',
      labelEn: 'Pure Intuitive Visual Logic',
      labelTe: 'గణితం లేని సరళమైన వివరణ',
      labelHi: 'शून्य गणित, सिर्फ विज़ुअल लॉजिक',
      subEn: 'No calculus or heavy formulas required',
      subTe: 'ఎటువంటి కష్టమైన సమీకరణాలు అవసరం లేదు',
      subHi: 'कठिन फॉर्मूलों के बिना आसान समझ'
    },
    {
      id: 'glossary',
      icon: BookOpen,
      value: '85+ Concepts',
      labelEn: 'Demystified AI Glossary',
      labelTe: '85+ స్పష్టమైన భావనలు',
      labelHi: '85+ सरल AI शब्दावली',
      subEn: 'From neural tokens to RAG and agents',
      subTe: 'టోకెన్ల నుండి RAG మరియు ఏజెంట్ల వరకు',
      subHi: 'टोकन से लेकर RAG और न्यूरल नेटवर्क तक'
    },
    {
      id: 'audio',
      icon: Volume2,
      value: 'Voice & Clay Bot',
      labelEn: 'Phoneme Synced Audio Guide',
      labelTe: 'ఆడియో మరియు క్లే బొమ్మ సహాయం',
      labelHi: 'बोलकर समझाने वाला क्ले साथी',
      subEn: 'Listen in your natural accent',
      subTe: 'మీ సహజ స్వరంలో వినండి',
      subHi: 'अपनी पसंदीदा भाषा में सुनें'
    },
    {
      id: 'community',
      icon: Users,
      value: '10K+ Learners',
      labelEn: 'Students, Teachers & Curious Minds',
      labelTe: 'వేలాది మంది విద్యార్థులు',
      labelHi: 'विद्यार्थी और जिज्ञासु पाठक',
      subEn: 'From Tier-1 to Tier-3 towns',
      subTe: 'అన్ని ప్రాంతాల నుండి అభ్యాసకులు',
      subHi: 'भारत के कोने-कोने से शिक्षार्थी'
    }
  ];

  return (
    <section 
      id="trust-signals" 
      aria-label="Clayverse AI Core Pillars"
      className="py-10 px-4 sm:px-6 max-w-7xl mx-auto border-y border-black/[0.06] dark:border-white/[0.08] my-4"
    >
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-amber bg-brand-amber/10 px-3 py-1 rounded-full border border-brand-amber/20">
          {lang === 'te' ? 'మా వాగ్దానం • విశ్వసనీయత' : lang === 'hi' ? 'हमारा संकल्प • भारत के लिए AI' : 'The Clayverse Promise'}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-brand-charcoal mt-2.5">
          {lang === 'te' 
            ? 'ప్రతి ఒక్కరికీ AI నేర్చుకునే స్వేచ్ఛ'
            : lang === 'hi'
            ? 'बिना किसी भाषा या गणितीय बाधा के AI सीखें'
            : 'AI Literacy Designed for Every Indian Mind'}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.5 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 border border-black/[0.06] dark:border-white/[0.08] shadow-xs flex flex-col justify-between hover:border-brand-amber/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-brand-amber/10 text-brand-amber flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-amber group-hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-brand-muted opacity-60">#{idx + 1}</span>
              </div>

              <div>
                <div className="font-display font-black text-lg sm:text-xl text-brand-charcoal tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-brand-charcoal/90 mt-0.5 leading-snug">
                  {lang === 'te' ? stat.labelTe : lang === 'hi' ? stat.labelHi : stat.labelEn}
                </div>
                <div className="text-[11px] text-brand-muted mt-1 leading-tight line-clamp-2">
                  {lang === 'te' ? stat.subTe : lang === 'hi' ? stat.subHi : stat.subEn}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
