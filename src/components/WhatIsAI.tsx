import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BrainCircuit, 
  Sparkles, 
  Lightbulb,
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

export default function WhatIsAI() {
  const { lang } = useLanguage();

  const content = {
    en: {
      badge: 'Lesson 01',
      title: 'What Actually is AI?',
      description: 'Artificial Intelligence is not magic or a thinking creature. It\'s a powerful tool that detects patterns in massive amounts of data.',
      analogy: {
        title: 'A Simple Analogy',
        text: 'Teaching AI is like teaching a child what a "dog" is. You don\'t hand them a biology textbook. You show them thousands of dog pictures until their brain naturally recognizes the patterns: floppy ears, tail, four legs, and barking!'
      },
      keyPoints: [
        'AI learns from examples, not pre-written rules',
        'It finds patterns humans might miss',
        'Used daily in recommendations, voice assistants, and maps'
      ]
    },
    hi: {
      badge: 'पाठ 01',
      title: 'AI वास्तव में क्या है?',
      description: 'आर्टिफिशियल इंटेलिजेंस कोई जादू या सोचने वाला प्राणी नहीं है। यह एक शक्तिशाली उपकरण है जो बड़ी मात्रा में डेटा में पैटर्न खोजता है।',
      analogy: {
        title: 'एक सरल उदाहरण',
        text: 'AI को सिखाना एक बच्चे को "कुत्ता" क्या है सिखाने जैसा है। आप उन्हें बायोलॉजी की किताब नहीं देते। आप उन्हें हजारों कुत्तों की तस्वीरें दिखाते हैं जब तक उनका दिमाग स्वाभाविक रूप से पैटर्न को पहचान नहीं लेता!'
      },
      keyPoints: [
        'AI उदाहरणों से सीखता है, पहले से लिखे नियमों से नहीं',
        'यह ऐसे पैटर्न खोजता है जो मनुष्य चूक सकते हैं',
        'दैनिक रूप से सिफारिशों, वॉयस असिस्टेंट और मैप्स में उपयोग किया जाता है'
      ]
    },
    te: {
      badge: 'పాఠం 01',
      title: 'AI నిజంగా ఏమిటి?',
      description: 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ మాయా జాలం లేదా ఆలోచించే జీవి కాదు. ఇది భారీ మొత్తంలో డేటాలో నమూనాలను కనుగొనే శక్తివంతమైన సాధనం.',
      analogy: {
        title: 'ఒక సరళమైన ఉపమానం',
        text: 'AIకి నేర్పించడం ఒక చిన్నారికి "కుక్క" అంటే ఏమిటో నేర్పించడం లాంటిది. మీరు వారికి జీవశాస్త్ర పుస్తకం ఇవ్వరు. వారి మెదడు సహజంగా నమూనాలను గుర్తించే వరకు మీరు వేలాది కుక్కల చిత్రాలను చూపిస్తారు!'
      },
      keyPoints: [
        'AI ఉదాహరణల నుండి నేర్చుకుంటుంది, ముందుగా వ్రాసిన నియమాల నుండి కాదు',
        'ఇది మానవులు కోల్పోయే నమూనాలను కనుగొంటుంది',
        'సిఫార్సులు, వాయిస్ అసిస్టెంట్‌లు మరియు మ్యాప్‌లలో ప్రతిరోజూ ఉపయోగించబడుతుంది'
      ]
    }
  };

  const t = content[lang as keyof typeof content] || content.en;

  return (
    <section id="what-is-ai" className="py-16 px-6 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">{t.badge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-display">
            {t.title}
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Definition Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card variant="elevated" hover className="h-full">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                    <BrainCircuit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>
                      {lang === 'en' ? 'The Definition' : lang === 'hi' ? 'परिभाषा' : 'నిర్వచనం'}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base leading-relaxed">
                      {t.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Analogy Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card variant="elevated" hover className="h-full bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-amber-900">
                      {t.analogy.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base leading-relaxed text-amber-800/90">
                      {t.analogy.text}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </div>

        {/* Key Points Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card variant="glass" className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {lang === 'en' ? 'Key Takeaways' : lang === 'hi' ? 'मुख्य बातें' : 'ముఖ్య విషయాలు'}
                </h3>
              </div>
              <div className="grid gap-4">
                {t.keyPoints.map((point, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 hover:border-slate-300 transition-all group"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed flex-1">
                      {point}
                    </p>
                    <ArrowRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center pt-4"
        >
          <p className="text-slate-600 font-medium">
            {lang === 'en' 
              ? 'Ready to dive deeper into AI concepts?' 
              : lang === 'hi'
              ? 'AI अवधारणाओं में गहराई से जाने के लिए तैयार हैं?'
              : 'AI భావనలలో లోతుగా వెళ్లడానికి సిద్ధంగా ఉన్నారా?'
            }
          </p>
        </motion.div>

      </div>
    </section>
  );
}
