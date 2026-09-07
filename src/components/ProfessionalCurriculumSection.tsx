import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  BrainCircuit, 
  Sparkles, 
  MessageSquare, 
  Layers,
  GraduationCap,
  Trophy,
  Users,
  Target,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';

interface CurriculumCardProps {
  num: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
  onClick?: () => void;
}

function CurriculumCard({ num, title, description, icon, gradient, delay, onClick }: CurriculumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
    >
      <Card variant="elevated" hover onClick={onClick} className="h-full group cursor-pointer">
        <CardContent className="p-6 space-y-4">
          {/* Number Badge and Icon */}
          <div className="flex items-start justify-between">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
              {icon}
            </div>
            <span className="text-3xl font-black text-slate-200 group-hover:text-slate-300 transition-colors">
              {num.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed">
            {description}
          </p>

          {/* Action */}
          <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all">
            <span>Start Lesson</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProfessionalCurriculumSection() {
  const { lang } = useLanguage();

  const lessons = [
    {
      num: 1,
      title: lang === 'en' ? 'What is AI?' : lang === 'hi' ? 'AI क्या है?' : 'AI అంటే ఏమిటి?',
      description: lang === 'en' 
        ? 'Understand the foundations of artificial intelligence and how machines learn from patterns.'
        : 'कृत्रिम बुद्धिमत्ता की नींव और मशीनें पैटर्न से कैसे सीखती हैं।',
      icon: <BrainCircuit className="w-7 h-7 text-white" />,
      gradient: 'from-blue-500 to-cyan-500',
      id: 'what-is-ai'
    },
    {
      num: 2,
      title: lang === 'en' ? 'AI Family Tree' : lang === 'hi' ? 'AI परिवार वृक्ष' : 'AI కుటుంబ వృక్షం',
      description: lang === 'en'
        ? 'Explore the nested hierarchy of AI, Machine Learning, Deep Learning, and Generative AI.'
        : 'AI, मशीन लर्निंग, डीप लर्निंग की पदानुक्रम संरचना।',
      icon: <Layers className="w-7 h-7 text-white" />,
      gradient: 'from-purple-500 to-pink-500',
      id: 'family-tree'
    },
    {
      num: 3,
      title: lang === 'en' ? 'Generative AI' : lang === 'hi' ? 'जनरेटिव AI' : 'జనరేటివ్ AI',
      description: lang === 'en'
        ? 'How Large Language Models create content and predict the next word using probability.'
        : 'LLM कैसे सामग्री बनाते हैं और संभाव्यता से अगला शब्द भविष्यवाणी करते हैं।',
      icon: <Sparkles className="w-7 h-7 text-white" />,
      gradient: 'from-orange-500 to-red-500',
      id: 'generative-ai'
    },
    {
      num: 4,
      title: lang === 'en' ? 'Prompting & RAG' : lang === 'hi' ? 'प्रॉम्प्टिंग और RAG' : 'ప్రాంప్టింగ్ & RAG',
      description: lang === 'en'
        ? 'Learn effective prompting techniques and how RAG prevents AI hallucinations.'
        : 'प्रभावी प्रॉम्प्टिंग तकनीक और RAG कैसे मतिभ्रम रोकता है।',
      icon: <MessageSquare className="w-7 h-7 text-white" />,
      gradient: 'from-green-500 to-teal-500',
      id: 'prompting-rag'
    },
    {
      num: 5,
      title: lang === 'en' ? 'AI Tools Directory' : lang === 'hi' ? 'AI टूल्स' : 'AI టూల్స్',
      description: lang === 'en'
        ? '40+ free AI tools for text, images, audio, and more to start experimenting today.'
        : '40+ मुफ्त AI टूल टेक्स्ट, इमेज, ऑडियो के लिए।',
      icon: <BookOpen className="w-7 h-7 text-white" />,
      gradient: 'from-yellow-500 to-orange-500',
      id: 'tools'
    },
    {
      num: 6,
      title: lang === 'en' ? '12 Core Concepts' : lang === 'hi' ? '12 मूल अवधारणाएँ' : '12 ప్రధాన భావనలు',
      description: lang === 'en'
        ? 'Deep dive into 12 essential AI concepts with interactive glossary and quizzes.'
        : '12 आवश्यक AI अवधारणाओं में गहराई से उतरें।',
      icon: <GraduationCap className="w-7 h-7 text-white" />,
      gradient: 'from-indigo-500 to-purple-500',
      id: 'deeper'
    }
  ];

  const handleLessonClick = (lessonId: string) => {
    const element = document.getElementById(lessonId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="curriculum" className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200">
            <Target className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-700">
              {lang === 'en' ? 'Interactive Curriculum' : lang === 'hi' ? 'इंटरएक्टिव पाठ्यक्रम' : 'ఇంటరాక్టివ్ పాఠ్యాంశాలు'}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 font-display">
            {lang === 'en' ? 'Master AI in 6 Lessons' : lang === 'hi' ? '6 पाठों में AI सीखें' : '6 పాఠాలలో AI నేర్చుకోండి'}
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            {lang === 'en' 
              ? 'A structured journey from complete beginner to confident AI practitioner — no math required.'
              : lang === 'hi'
              ? 'पूर्ण शुरुआती से आत्मविश्वासी AI अभ्यासी तक की संरचित यात्रा - गणित की आवश्यकता नहीं।'
              : 'పూర్తి ప్రారంభకుడి నుండి నమ్మకంగా AI అభ్యాసకుడి వరకు నిర్మాణాత్మక ప్రయాణం.'
            }
          </p>
        </motion.div>

        {/* Curriculum Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {lessons.map((lesson, idx) => (
            <CurriculumCard
              key={lesson.id}
              num={lesson.num}
              title={lesson.title}
              description={lesson.description}
              icon={lesson.icon}
              gradient={lesson.gradient}
              delay={0.1 + idx * 0.1}
              onClick={() => handleLessonClick(lesson.id)}
            />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Users, value: '10K+', label: lang === 'en' ? 'Learners' : 'सीखने वाले' },
            { icon: BookOpen, value: '6', label: lang === 'en' ? 'Lessons' : 'पाठ' },
            { icon: Trophy, value: '50+', label: lang === 'en' ? 'Concepts' : 'अवधारणाएँ' },
            { icon: Sparkles, value: '100%', label: lang === 'en' ? 'Free' : 'मुफ्त' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 + idx * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-600">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
