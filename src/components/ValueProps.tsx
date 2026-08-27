import { motion } from 'motion/react';
import { XCircle, CheckCircle2, Sparkles, BookOpen, Volume2, Gamepad2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function ValueProps() {
  const { lang } = useLanguage();

  const comparison = [
    {
      aspect: 'Language Barrier',
      aspectTe: 'భాషా అడ్డంకి',
      aspectHi: 'भाषा की रुकावट',
      oldWay: 'Complex technical English with no regional translations',
      oldWayTe: 'కేవలం ఆంగ్లంలో మాత్రమే ఉండే కష్టమైన వివరణ',
      oldWayHi: 'केवल अंग्रेज़ी में जटिल व्याख्या',
      newWay: '12+ Native Indian languages with cultural analogies (Chai brewing, Rangoli, Farming)',
      newWayTe: 'మన స్వంత తెలుగు మరియు ఇతర భారతీయ భాషలలో సులభమైన ఉదాహరణలతో',
      newWayHi: '12+ भारतीय भाषाओं में दैनिक जीवन के देसी उदाहरणों के साथ'
    },
    {
      aspect: 'Mathematical Complexity',
      aspectTe: 'గణిత సమీకరణాలు',
      aspectHi: 'कठिन गणितीय समीकरण',
      oldWay: 'Linear algebra, multivariable calculus, and matrix derivatives',
      oldWayTe: 'భారీ మ్యాట్రిక్స్ మరియు కష్టమైన ఫార్ములాలు',
      oldWayHi: 'कैलकुलस और मैट्रिक्स के भारी-भरकम फॉर्मूले',
      newWay: 'Zero math required. Pure tactile visual logic and pattern-recognition mechanics',
      newWayTe: 'గణితం లేకుండా కేవలం నమూనాలు (ప్యాటర్న్స్) ద్వారా స్పష్టమైన అవగాహన',
      newWayHi: 'शून्य गणित! सिर्फ विज़ुअल लॉजिक और इंटरेक्टिव पैटर्न समझना'
    },
    {
      aspect: 'Learning Experience',
      aspectTe: 'నేర్చుకునే విధానం',
      aspectHi: 'सीखने की शैली',
      oldWay: 'Passive 2-hour long video lectures and dry textbooks',
      oldWayTe: 'గంటల కొద్దీ విసుగెత్తించే రికార్డెడ్ వీడియోలు',
      oldWayHi: 'घंटों लंबे उबाऊ वीडियो लेक्चर और बोरिंग किताबें',
      newWay: 'Interactive sandboxes: RAG simulator, CNN image filter playground, token predictor',
      newWayTe: 'చేతులతో స్వయంగా చేసి చూసే ఇంటరాక్టివ్ శ్యాండ్‌బాక్స్ ప్రయోగాలు',
      newWayHi: 'लाइव सैंडबॉक्स: टोकन प्रेडिक्टर, RAG सिम्युलेटर और AI विज़ुअलाइज़र'
    },
    {
      aspect: 'Friendly Guidance',
      aspectTe: 'మార్గదర్శకత్వం',
      aspectHi: 'मार्गदर्शन और साथी',
      oldWay: 'Impersonal forums where beginners feel afraid to ask "simple" questions',
      oldWayTe: 'సందేహాలు అడగడానికి భయపడే వాతావరణం',
      oldWayHi: 'जहां बुनियादी सवाल पूछने में भी झिझक महसूस हो',
      newWay: 'Animated Clay mascot that speaks your language and explains concepts step-by-step',
      newWayTe: 'మీతో మాట్లాడే స్నేహపూర్వక క్లే బొమ్మ — ఏ ప్రశ్ననైనా ఓపికగా వివరిస్తుంది',
      newWayHi: 'बोलता हुआ प्यारा क्ले रोबोट जो हर सवाल का बिना झिझक जवाब देता है'
    }
  ];

  return (
    <section 
      id="value-props" 
      aria-label="Why Clayverse AI is Different"
      className="py-12 px-4 sm:px-6 max-w-7xl mx-auto my-6"
    >
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-amber bg-brand-amber/10 px-3 py-1 rounded-full border border-brand-amber/20">
          {lang === 'te' ? 'విద్యా విధానంలో మార్పు' : lang === 'hi' ? 'सीखने का नया नज़रिया' : 'The Paradigm Shift'}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-brand-charcoal mt-3 tracking-tight">
          {lang === 'te' 
            ? 'సాంప్రదాయ బోధన vs క్లేవర్స్ పద్ధతి'
            : lang === 'hi'
            ? 'पारंपरिक AI पढ़ाई vs क्लेवर्स का आसान तरीका'
            : 'Why Clayverse AI is Truly Different'}
        </h2>
        <p className="text-sm sm:text-base text-brand-muted mt-2.5 max-w-xl mx-auto">
          {lang === 'te'
            ? 'భారతీయ అభ్యాసకుల కోసం ప్రత్యేకంగా రూపొందించిన సులభమైన ఏఐ విద్యా వేదిక.'
            : lang === 'hi'
            ? 'भारत के हर छात्र और जिज्ञासु पाठक के लिए भाषा और गणित की बाधाओं को खत्म करने का प्रयास।'
            : 'Rebuilding AI education from the ground up for India’s next generation of thinkers.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Traditional Frustrations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-red-500/[0.03] dark:bg-red-500/[0.05] border border-red-500/15 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 mb-6">
              <XCircle className="w-6 h-6 stroke-[2.2]" />
              <h3 className="font-display font-bold text-lg sm:text-xl text-brand-charcoal">
                {lang === 'te' ? 'సాంప్రదాయ విధానంలోని సమస్యలు' : lang === 'hi' ? 'पारंपरिक पाठ्यक्रमों की मुश्किलें' : 'Traditional AI Courses'}
              </h3>
            </div>

            <div className="space-y-5">
              {comparison.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 last:pb-0">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold">✕</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase text-red-600/80 dark:text-red-400/80 block">
                      {lang === 'te' ? item.aspectTe : lang === 'hi' ? item.aspectHi : item.aspect}
                    </span>
                    <p className="text-xs sm:text-sm text-brand-muted mt-0.5 leading-relaxed">
                      {lang === 'te' ? item.oldWayTe : lang === 'hi' ? item.oldWayHi : item.oldWay}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300 font-medium text-center">
            {lang === 'te' 
              ? 'ఫలితం: 90% మంది ప్రారంభకులకు అర్థంకాక నిరుత్సాహపడతారు'
              : lang === 'hi'
              ? 'नतीजा: 90% शुरुआती छात्र पहले ही हफ्ते में हार मान लेते हैं'
              : 'Outcome: 90% of beginners drop out feeling intimidated'}
          </div>
        </motion.div>

        {/* Right: The Clayverse Way */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/[0.08] via-emerald-500/[0.04] to-brand-amber/[0.06] border border-brand-amber/30 flex flex-col justify-between shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2.5 text-brand-amber mb-6">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              <h3 className="font-display font-bold text-lg sm:text-xl text-brand-charcoal flex items-center gap-2">
                <span>{lang === 'te' ? 'క్లేవర్స్ ప్రత్యేకత' : lang === 'hi' ? 'क्लेवर्स का सरल समाधान' : 'The Clayverse AI Way'}</span>
                <span className="text-[10px] font-mono font-bold bg-brand-amber text-white px-2 py-0.5 rounded-full">Zero Math</span>
              </h3>
            </div>

            <div className="space-y-5">
              {comparison.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-brand-amber/10 last:border-0 last:pb-0">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase text-brand-amber block">
                      {lang === 'te' ? item.aspectTe : lang === 'hi' ? item.aspectHi : item.aspect}
                    </span>
                    <p className="text-xs sm:text-sm text-brand-charcoal font-medium mt-0.5 leading-relaxed">
                      {lang === 'te' ? item.newWayTe : lang === 'hi' ? item.newWayHi : item.newWay}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-800 dark:text-emerald-300 font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {lang === 'te'
                ? 'ఫలితం: వయసు, విద్యార్హతతో సంబంధం లేకుండా ఎవరైనా AI నేర్చుకోవచ్చు!'
                : lang === 'hi'
                ? 'नतीजा: बिना किसी डर के हर कोई आत्मविश्वास से AI समझ सकता है!'
                : 'Outcome: Anyone can grasp modern AI with clarity and zero fear!'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
