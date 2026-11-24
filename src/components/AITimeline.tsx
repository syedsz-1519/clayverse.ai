import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  Zap, 
  History, 
  ArrowLeft, 
  ArrowRight, 
  List, 
  Layers, 
  Brain, 
  Cpu, 
  Activity, 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  Flame, 
  Clock 
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import ClayLogo from './ClayLogo';
import TechTooltip from './TechTooltip';

// Detailed definitions for English & Urdu key terms in the timeline
const tooltipDefinitions: Record<string, { en: string; ur: string }> = {
  'Turing Test': {
    en: "A test designed to see if a computer can think like a human by having a natural text conversation.",
    ur: "ایلن ٹیورنگ کا وضع کردہ امتحان جو یہ جانچتا ہے کہ کیا کوئی مشین انسانی سوچ کی طرح برتاؤ کر سکتی ہے۔"
  },
  'Artificial Intelligence': {
    en: "Technology that allows computers to learn, reason, solve problems, and make decisions like humans.",
    ur: "کمپیوٹر سسٹمز کی وہ صلاحیت جس کے ذریعے وہ انسانوں کی طرح سوچنے، سیکھنے اور فیصلے کرنے کے قابل ہوتے ہیں۔"
  },
  'ELIZA': {
    en: "The very first conversational computer program (1966), simulating a simple empathetic psychotherapist.",
    ur: "سن 1966 میں بنایا گیا دنیا کا پہلا چیٹ پروگرام جو سادہ قواعد کے تحت انسان سے گفتگو کر سکتا تھا۔"
  },
  'AI Winters': {
    en: "Periods of time when excitement for AI cooled down, leading to less funding and slower progress.",
    ur: "اے آئی کی تاریخ کے وہ ادوار جب مبالغہ آمیز دعوؤں کی وجہ سے مالی تعاون اور سائنسی دلچسپی میں شدید کمی آئی۔"
  },
  'Deep Blue': {
    en: "IBM's groundbreaking supercomputer that became the first to defeat a reigning chess champion.",
    ur: "شطرنج کھیلنے والا آئی بی ایم کا وہ مشہور سپر کمپیوٹر جس نے شطرنج کے عالمی چیمپیئن کو شکست دی۔"
  },
  'AlexNet': {
    en: "The breakthrough deep neural network that swept the 2012 ImageNet contest, initiating the modern AI boom.",
    ur: "2012 میں بنایا گیا وہ جدید نیورل نیٹ ورک جس نے کمپیوٹرز کے دیکھنے کی صلاحیت (امیج ریکگنیشن) میں انقلاب برپا کیا۔"
  },
  'Deep Learning': {
    en: "An advanced branch of AI that mimics human brains using layered neural networks to process complex features.",
    ur: "مشین لرننگ کی ایک شاخ جو انسانی دماغ کے خلیوں سے متاثر ہو کر تہوں والے نیورل نیٹ ورک استعمال کرتی ہے۔"
  },
  'Transformer': {
    en: "A smart network pattern introduced in 2017 that reads whole sentences at once, laying the groundwork for all modern AI brains.",
    ur: "2017 کا وہ انقلابی نیورل نیٹ ورک ڈیزائن جو جملے کے تمام حصوں کو ایک ساتھ پڑھ کر سیاق و سباق سمجھتا ہے۔"
  },
  'LLMs': {
    en: "Large Language Models: giant computer minds trained on vast libraries of books and web pages to talk like people.",
    ur: "بڑے لسانی ماڈلز جو کتابوں اور ویب سائٹس کے وسیع ڈیٹا کو پڑھ کر انسانوں کی طرح بول سکتے ہیں۔"
  },
  'Generative AI': {
    en: "AI models that can create entirely new things like text, images, videos, or code based on your prompt.",
    ur: "مصنوعی ذہانت کا وہ جدید شعبہ جو آپ کے کہے جانے پر بالکل نیا مواد (تحریر، تصویر، موسیقی) تخلیق کر سکتا ہے۔"
  },
  'autonomous agents': {
    en: "Smart AI assistants that can plan, remember, and run complex tasks across multiple websites or apps on their own.",
    ur: "اے آئی کے وہ خودکار نظام جو خود سے منصوبہ بندی، تحقیق اور سافٹ ویئر لکھنے جیسے کام بغیر انسانی مدد کے انجام دیتے ہیں۔"
  }
};

const getTooltipDefinition = (key: string, lang: 'en' | 'ur'): string => {
  const normalizedKey = key.trim();
  const entry = tooltipDefinitions[normalizedKey];
  if (!entry) return 'An important technical concept in modern artificial intelligence pathways.';
  return lang === 'en' ? entry.en : entry.ur;
};

export default function AITimeline() {
  const { lang } = useLanguage();
  const [viewMode, setViewMode] = useState<'carousel' | 'list'>('carousel');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const playTone = (frequency: number, type: OscillatorType = 'sine', duration: number = 0.1, volume = 0.05) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Web Audio failed:', e);
    }
  };

  // Parses text with custom markdown-like tooltip syntax: [tooltip:TermName]Displayed Text[/tooltip]
  const parseTextWithTooltips = (text: string, currentLang: 'en' | 'ur') => {
    const regex = /\[tooltip:([^\]]+)\]([^\[]+)\[\/tooltip\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      const termKey = match[1];
      const displayText = match[2];
      const def = getTooltipDefinition(termKey, currentLang);

      parts.push(
        <TechTooltip key={matchIndex} term={termKey} definition={def}>
          {displayText}
        </TechTooltip>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    if (parts.length === 0) {
      // Parse strong tags even if there's no tooltip in the string
      return parseStrongTags(text);
    }

    return parts.map((part, idx) => {
      if (typeof part === 'string') {
        return <span key={idx}>{parseStrongTags(part)}</span>;
      }
      return part;
    });
  };

  const parseStrongTags = (fragment: string) => {
    const strongRegex = /<strong>([^<]+)<\/strong>/g;
    const strongParts = [];
    let sLastIndex = 0;
    let sMatch;
    while ((sMatch = strongRegex.exec(fragment)) !== null) {
      if (sMatch.index > sLastIndex) {
        strongParts.push(fragment.substring(sLastIndex, sMatch.index));
      }
      strongParts.push(<strong key={sMatch.index} className="font-extrabold text-brand-charcoal">{sMatch[1]}</strong>);
      sLastIndex = strongRegex.lastIndex;
    }
    if (sLastIndex < fragment.length) {
      strongParts.push(fragment.substring(sLastIndex));
    }
    return strongParts.length > 0 ? <>{strongParts}</> : fragment;
  };

  const historyEvents = [
    {
      time: "1950",
      titleEn: "Alan Turing's Test",
      titleUr: "ایلن ٹیورنگ کا ٹیسٹ",
      textEn: "Alan Turing asks <strong>\"Can machines think?\"</strong> and designs the [tooltip:Turing Test]Turing Test[/tooltip] — the foundational spark of computer intelligence.",
      textUr: "ایلن ٹیورنگ نے سوال اٹھایا <strong>\"کیا مشینیں سوچ سکتی ہیں؟\"</strong> اور [tooltip:Turing Test]ٹیورنگ ٹیسٹ[/tooltip] تجویز کیا — کمپیوٹر انٹیلیجنس کی پہلی چنگاری۔",
      impact: 85,
      icon: Brain,
      categoryEn: "Foundations",
      categoryUr: "بنیادی تصور",
      funFactEn: "Turing's paper was published under the title 'Computing Machinery and Intelligence'.",
      funFactUr: "ٹیورنگ کا یہ تحقیقی مقالہ 'کمپیوٹنگ مشینری اور ذہانت' کے عنوان سے شائع ہوا تھا۔"
    },
    {
      time: "1956",
      titleEn: "Dartmouth Conference",
      titleUr: "ڈارٹماؤتھ کانفرنس",
      textEn: "The term [tooltip:Artificial Intelligence]\"Artificial Intelligence\"[/tooltip] is officially coined at Dartmouth College. John McCarthy and colleagues propose a summer research project.",
      textUr: "لفظ [tooltip:Artificial Intelligence]\"مصنوعی ذہانت\"[/tooltip] یعنی ارٹیفیشل انٹیلیجنس پہلی بار ڈارٹماؤتھ کانفرنس میں استعمال ہوا۔ جان میکارتھی نے اس کے اصول رکھے۔",
      impact: 90,
      icon: Calendar,
      categoryEn: "Birth of Field",
      categoryUr: "شعبے کا آغاز",
      funFactEn: "They expected to make significant progress in understanding machine intelligence in just one summer!",
      funFactUr: "انہیں امید تھی کہ وہ محض ایک گرمیوں کی چھٹیوں میں کمپیوٹر انٹیلیجنس کے تمام بنیادی مسائل حل کر لیں گے!"
    },
    {
      time: "1966",
      titleEn: "ELIZA Chatterbot",
      titleUr: "ایلیزا چیٹ بوٹ",
      textEn: "Joseph Weizenbaum creates [tooltip:ELIZA]ELIZA[/tooltip], the first natural language processing program mimicking a psychotherapist using simple pattern matching rules.",
      textUr: "جوزف ویزنبام نے [tooltip:ELIZA]ایلیزا (ELIZA)[/tooltip] نامی پہلا چیٹ بوٹ بنایا جو ایک سائیکو تھراپسٹ کی طرح لوگوں کے پیغامات کا جواب دیتا تھا۔",
      impact: 70,
      icon: MessageSquare,
      categoryEn: "First Chatbot",
      categoryUr: "پہلا چیٹ بوٹ",
      funFactEn: "Users started sharing deeply personal secrets with ELIZA, believing the program truly understood them.",
      funFactUr: "لوگوں نے ایلیزا کو اصل انسان سمجھ کر اپنے دل کے گہرے راز بتانا شروع کر دیے تھے۔"
    },
    {
      time: "1980s",
      titleEn: "The AI Winters",
      titleUr: "اے آئی کی سردیاں (Winters)",
      textEn: "Research funding dries up as early promises fail to deliver. Overhyped systems lead to a [tooltip:AI Winters]cooling period[/tooltip] for the entire sector.",
      textUr: "جب اے آئی کے مبالغہ آمیز دعوے پورے نہ ہو سکے، تو ریسرچ فنڈنگ بند ہو گئی، جسے [tooltip:AI Winters]اے آئی ونٹر[/tooltip] کہا جاتا ہے۔",
      impact: 40,
      icon: Clock,
      categoryEn: "Struggle Era",
      categoryUr: "جدوجہد کا دور",
      funFactEn: "These periods taught researchers to focus on statistical proof rather than fragile hard-coded rule systems.",
      funFactUr: "اس دور نے سائنسدانوں کو سکھایا کہ وہ صرف بڑی بڑی باتوں کے بجائے ریاضی اور ٹھوس ثبوتوں پر کام کریں۔"
    },
    {
      time: "1997",
      titleEn: "Deep Blue Beats Kasparov",
      titleUr: "ڈیپ بلیو کی تاریخی فتح",
      textEn: "IBM's supercomputer [tooltip:Deep Blue]Deep Blue[/tooltip] defeats world chess champion Garry Kasparov under tournament conditions, shocking the globe.",
      textUr: "آئی بی ایم کے سپر کمپیوٹر [tooltip:Deep Blue]Deep Blue[/tooltip] نے شطرنج کے عالمی چیمپئن گیری کاسپاروف کو ہرا کر پوری دنیا کو حیران کر دیا۔",
      impact: 80,
      icon: Trophy,
      categoryEn: "Milestone Game",
      categoryUr: "کھیل کا میدان",
      funFactEn: "Deep Blue calculated up to 200 million chess positions per second using specialized hardware acceleration.",
      funFactUr: "ڈیپ بلیو شطرنج کے سیکنڈ میں 20 کروڑ ممکنہ چالوں کا حساب لگا سکتا تھا!"
    },
    {
      time: "2012",
      titleEn: "The AlexNet Breakthrough",
      titleUr: "الیکس نیٹ اور ڈیپ لرننگ",
      textEn: "A deep neural network named [tooltip:AlexNet]AlexNet[/tooltip] wins the ImageNet challenge by a huge margin, launching the modern [tooltip:Deep Learning]Deep Learning[/tooltip] boom using GPUs.",
      textUr: "[tooltip:AlexNet]الیکس نیٹ (AlexNet)[/tooltip] نامی نیورل نیٹ ورک نے امیج ریکگنیشن کے مقابلے میں ریکارڈ کامیابی حاصل کی اور [tooltip:Deep Learning]ڈیپ لرننگ[/tooltip] کا انقلاب شروع کیا۔",
      impact: 95,
      icon: Cpu,
      categoryEn: "Deep Learning",
      categoryUr: "ڈیپ لرننگ",
      funFactEn: "AlexNet utilized high-performance graphic cards (GPUs) originally built for video games to train neural layers.",
      funFactUr: "الیکس نیٹ نے نیورل نیٹ ورک کی ٹریننگ کے لیے ویڈیو گیمز والے گرافکس کارڈز (GPUs) کا استعمال کیا۔"
    },
    {
      time: "2017",
      titleEn: "The Transformer Architecture",
      titleUr: "ٹرانسفارمر کا نیا ڈیزائن",
      textEn: "Google researchers publish the landmark paper <strong>\"Attention Is All You Need\"</strong>, introducing the [tooltip:Transformer]Transformer[/tooltip] architecture that powers all modern [tooltip:LLMs]LLMs[/tooltip].",
      textUr: "گوگل کے ریسرچرز نے مشہور زمانہ مقالہ <strong>\"Attention Is All You Need\"</strong> لکھا، جس نے آج کے تمام [tooltip:LLMs]بڑے ماڈلز (LLMs)[/tooltip] کی بنیاد [tooltip:Transformer]ٹرانسفارمر[/tooltip] ٹیکنالوجی پر رکھی۔",
      impact: 98,
      icon: Layers,
      categoryEn: "Modern AI Era",
      categoryUr: "جدید دور کا آغاز",
      funFactEn: "The architecture allowed training on massive unlabeled text data in parallel, solving the bottleneck of older recurrent models.",
      funFactUr: "اس ٹیکنالوجی نے انٹرنیٹ کی کروڑوں کتابوں اور ویب سائٹس کو ایک ساتھ متوازی طور پر پڑھنا ممکن بنایا۔"
    },
    {
      time: "2022",
      titleEn: "The ChatGPT Wave",
      titleUr: "چیٹ جی پی ٹی کا طوفان",
      textEn: "OpenAI launches <strong>ChatGPT</strong>, bringing [tooltip:Generative AI]Generative AI[/tooltip] into daily life. It hits 100 million active monthly users within just two months.",
      textUr: "اوپن اے آئی نے <strong>ChatGPT</strong> لانچ کیا، جس سے [tooltip:Generative AI]جینریٹو اے آئی[/tooltip] عام لوگوں تک پہنچا اور تاریخ کا سب سے تیز ترین پھیلنے والا نیٹ ورک بنا۔",
      impact: 99,
      icon: Sparkles,
      categoryEn: "Generative AI",
      categoryUr: "جینریٹو اے آئی",
      funFactEn: "It reached 100 million active users faster than TikTok, Instagram, or any other consumer internet application in history.",
      funFactUr: "اس نے محض دو ماہ میں 10 کروڑ صارفین حاصل کیے، جو انٹرنیٹ کی تاریخ میں ایک ریکارڈ ہے۔"
    },
    {
      time: "2026",
      titleEn: "The Agentic Revolution",
      titleUr: "خودمختار ایجنٹس (Agents) کا دور",
      textEn: "AI transitions from passive chatbots to active [tooltip:autonomous agents]autonomous agents[/tooltip] capable of reasoning, writing software, planning events, and coordinating across platforms.",
      textUr: "اے آئی اب صرف جواب نہیں دیتا، بلکہ [tooltip:autonomous agents]خودمختار ایجنٹس[/tooltip] کی طرح کام کرتا ہے جو خود سے کوڈنگ، ریسرچ اور کمپیوٹر کے کام سنبھالتے ہیں۔",
      impact: 100,
      icon: Flame,
      categoryEn: "Agentic AI",
      categoryUr: "ایجنٹک انقلاب",
      funFactEn: "This application you are using is built and synchronized live by an Antigravity coding agent working in a real-world container!",
      funFactUr: "یہ ایپ جس پر آپ کام کر رہے ہیں، اسے بھی ایک خودمختار کوڈنگ ایجنٹ نے خود کوڈ کر کے لائیو چلایا ہے!"
    }
  ];

  const currentEvent = historyEvents[selectedIdx];
  const CurrentIcon = currentEvent.icon;

  const timelineRef = useRef<HTMLDivElement>(null);

  const handleSelectMilestone = (idx: number) => {
    setSelectedIdx(idx);
    playTone(300 + idx * 40, 'sine', 0.1, 0.05);
  };

  const handlePrev = () => {
    if (selectedIdx > 0) {
      handleSelectMilestone(selectedIdx - 1);
    }
  };

  const handleNext = () => {
    if (selectedIdx < historyEvents.length - 1) {
      handleSelectMilestone(selectedIdx + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (viewMode === 'carousel') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (selectedIdx > 0) {
          const nextIdx = selectedIdx - 1;
          handleSelectMilestone(nextIdx);
          setTimeout(() => {
            const buttons = timelineRef.current?.querySelectorAll('.timeline-node-btn');
            (buttons?.[nextIdx] as HTMLElement)?.focus();
          }, 10);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (selectedIdx < historyEvents.length - 1) {
          const nextIdx = selectedIdx + 1;
          handleSelectMilestone(nextIdx);
          setTimeout(() => {
            const buttons = timelineRef.current?.querySelectorAll('.timeline-node-btn');
            (buttons?.[nextIdx] as HTMLElement)?.focus();
          }, 10);
        }
      }
    } else {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedIdx > 0) {
          const nextIdx = selectedIdx - 1;
          setSelectedIdx(nextIdx);
          playTone(300 + nextIdx * 40, 'sine', 0.1, 0.05);
          setTimeout(() => {
            const buttons = timelineRef.current?.querySelectorAll('.timeline-list-btn');
            (buttons?.[nextIdx] as HTMLElement)?.focus();
          }, 10);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedIdx < historyEvents.length - 1) {
          const nextIdx = selectedIdx + 1;
          setSelectedIdx(nextIdx);
          playTone(300 + nextIdx * 40, 'sine', 0.1, 0.05);
          setTimeout(() => {
            const buttons = timelineRef.current?.querySelectorAll('.timeline-list-btn');
            (buttons?.[nextIdx] as HTMLElement)?.focus();
          }, 10);
        }
      }
    }
  };

  return (
    <div className="relative mt-4 mb-8 text-left">
      {/* Container Frame (Bento Card style matching section index layout) */}
      <div 
        ref={timelineRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={lang === 'en' ? "History of AI Timeline, use arrow keys to navigate milestones" : "اے آئی کی تاریخ، میل کے پتھروں کے درمیان نیویگیٹ کرنے کے لیے تیر والے بٹنوں کا استعمال کریں"}
        className="bg-[#FAF8F5]/90 dark:bg-white/[0.02] border-2 border-brand-slate/15 dark:border-white/5 rounded-3xl p-6 sm:p-8 skeuo-raised relative overflow-hidden transition-all focus:ring-2 focus:ring-[#E07A5F]/40 focus:outline-none"
      >
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E07A5F]/20" />

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-brand-slate/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#E07A5F]/10 text-[#E07A5F] px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Special Module' : 'خاص ماڈیول'}
              </span>
              <span className="text-[10px] font-mono font-bold text-brand-muted uppercase tracking-wider">
                {lang === 'en' ? 'Milestones Journey' : 'سنگِ میل کا سفر'}
              </span>
            </div>
            <h3 className="font-display text-2xl font-black text-brand-charcoal mt-2 flex items-center gap-2">
              {lang === 'en' ? 'History of AI Timeline' : 'اے آئی کی تاریخ کا سفرنامہ'}
            </h3>
            <p className="text-xs text-brand-slate mt-1 max-w-xl">
              {lang === 'en' 
                ? 'Trace how we got here, and understand the breathtaking speed of what is happening right now through an interactive study track.'
                : 'ہم آج کہاں کھڑے ہیں اور یہ شاندار سفر کیسے طے ہوا، اس پٹری پر کلک کر کے ایک ایک سنگِ میل کو سمجھیں۔'}
            </p>
          </div>

          {/* Toggle View Switcher */}
          <div className="bg-brand-sand/30 dark:bg-white/[0.03] border border-brand-slate/10 p-1 rounded-xl flex self-start sm:self-center shadow-sm relative overflow-hidden shrink-0">
            <button
              onClick={() => {
                setViewMode('carousel');
                playTone(400, 'sine', 0.08, 0.04);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-display text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'carousel' ? 'bg-white dark:bg-white/10 text-brand-charcoal shadow-sm' : 'text-brand-slate hover:text-brand-charcoal'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Interactive' : 'انٹرایکٹو'}</span>
            </button>
            <button
              onClick={() => {
                setViewMode('list');
                playTone(460, 'sine', 0.08, 0.04);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-display text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-white/10 text-brand-charcoal shadow-sm' : 'text-brand-slate hover:text-brand-charcoal'}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Full Path' : 'پورا سفر'}</span>
            </button>
          </div>
        </div>

        {/* CAROUSEL MODE: Tactile timeline explorer */}
        {viewMode === 'carousel' ? (
          <div className="space-y-6">
            {/* Horizontal Chronological Track (Clickable nodes) */}
            <div className="relative py-4 px-2 bg-brand-sand/15 dark:bg-white/[0.01] border border-brand-slate/5 rounded-2xl overflow-x-auto scrollbar-thin flex items-center justify-between gap-2 md:gap-4">
              
              {/* Dynamic Center Rail */}
              <div className="absolute left-6 right-6 top-[50%] h-[3px] bg-brand-slate/10 dark:bg-white/5 -translate-y-[50%] rounded-full pointer-events-none z-0" />
              
              {historyEvents.map((evt, idx) => {
                const isSelected = selectedIdx === idx;
                const EventIcon = evt.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectMilestone(idx)}
                    className="timeline-node-btn flex flex-col items-center gap-1.5 shrink-0 z-10 relative cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/50 rounded-lg p-0.5"
                    style={{ minWidth: '70px' }}
                  >
                    {/* Clay Raised Node */}
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#E07A5F] border-2 border-[#C55937] text-white shadow-[0_3px_8px_rgba(224,122,95,0.4),_inset_0_1.5px_2px_rgba(255,255,255,0.4)] scale-110' 
                          : 'bg-white dark:bg-white/5 border border-brand-slate/15 hover:border-brand-amber text-brand-slate hover:text-brand-charcoal hover:scale-105 shadow-sm active:scale-95'
                      }`}
                    >
                      <EventIcon className="w-4 h-4" />
                    </div>

                    {/* Timeline Node Tag */}
                    <span className={`font-mono text-[10px] font-bold ${isSelected ? 'text-[#E07A5F]' : 'text-brand-muted group-hover:text-brand-slate'}`}>
                      {evt.time}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Display of Active Milestone (skeuo-raised card detail) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
              >
                {/* Left/Main Column: Event Context (Col 8) */}
                <div className="md:col-span-8 bg-white dark:bg-white/[0.01] border border-brand-slate/10 dark:border-white/5 p-5 md:p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm relative overflow-hidden text-left">
                  {/* Decorative faint background clay insignia */}
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#E07A5F]/5 dark:bg-white/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-3.5 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-extrabold text-[#E07A5F] bg-[#E07A5F]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {lang === 'en' ? currentEvent.categoryEn : currentEvent.categoryUr}
                      </span>
                      <span className="font-mono text-[11px] font-black text-brand-muted flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-amber" />
                        {currentEvent.time}
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <h4 className="font-display text-lg font-black text-brand-charcoal flex items-center gap-2">
                        <CurrentIcon className="w-5 h-5 text-brand-amber shrink-0" />
                        <span>{lang === 'en' ? currentEvent.titleEn : currentEvent.titleUr}</span>
                      </h4>
                      <div className="text-[13px] text-brand-slate leading-relaxed pt-1">
                        {parseTextWithTooltips(lang === 'en' ? currentEvent.textEn : currentEvent.textUr, lang)}
                      </div>
                    </div>
                  </div>

                  {/* Fact box */}
                  <div className="mt-4 p-3 bg-brand-sand/15 dark:bg-white/[0.02] border border-brand-slate/5 rounded-xl text-left relative overflow-hidden">
                    <span className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider block mb-1">
                      💡 {lang === 'en' ? "Clay Fun Fact:" : "خاص بات:"}
                    </span>
                    <p className="text-[11px] text-brand-slate leading-relaxed">
                      {lang === 'en' ? currentEvent.funFactEn : currentEvent.funFactUr}
                    </p>
                  </div>
                </div>

                {/* Right Column: Tactile Clay Dial / Impact Meter (Col 4) */}
                <div className="md:col-span-4 bg-white dark:bg-white/[0.01] border border-brand-slate/10 dark:border-white/5 p-5 rounded-2xl flex flex-col justify-between items-center text-center shadow-sm relative overflow-hidden">
                  <span className="font-mono text-[9px] font-black text-brand-amber uppercase tracking-wider block">
                    {lang === 'en' ? "Impact Coefficient" : "اثر کا تناسب"}
                  </span>

                  <div className="my-4 relative flex items-center justify-center">
                    {/* Semi-circular tactile indicator with clay values */}
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-brand-slate/15 flex items-center justify-center relative">
                      <div className="text-center">
                        <span className="font-mono text-2xl font-black text-brand-charcoal block">
                          {currentEvent.impact}%
                        </span>
                        <span className="font-mono text-[8px] font-extrabold text-[#E07A5F] uppercase tracking-widest">
                          {currentEvent.impact >= 90 ? (lang === 'en' ? 'Epochal' : 'انقلابی') : currentEvent.impact >= 75 ? (lang === 'en' ? 'High' : 'اعلیٰ') : (lang === 'en' ? 'Medium' : 'متوسط')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nav controls */}
                  <div className="flex items-center gap-2 w-full mt-2">
                    <button
                      type="button"
                      disabled={selectedIdx === 0}
                      onClick={handlePrev}
                      className="flex-1 py-1.5 px-3 border border-brand-slate/15 dark:border-white/5 rounded-xl text-[11px] font-bold text-brand-slate hover:text-brand-charcoal hover:bg-brand-sand/30 transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? "Prev" : "پیچھے"}</span>
                    </button>
                    <button
                      type="button"
                      disabled={selectedIdx === historyEvents.length - 1}
                      onClick={handleNext}
                      className="flex-1 py-1.5 px-3 bg-[#E07A5F] hover:bg-[#C55937] rounded-xl text-[11px] font-bold text-white transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                    >
                      <span>{lang === 'en' ? "Next" : "آگے"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          /* LIST PATH MODE: Full chronological vertical stream */
          <div className="relative pl-2 sm:pl-6 space-y-6 pt-2">
            {/* Raised Clay vertical track line */}
            <div className="absolute left-3.5 sm:left-4.5 top-2 bottom-2 w-1.5 bg-[#EBE7E0] rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),_1px_1px_0px_rgba(255,255,255,0.8)] border border-brand-charcoal/5" />

            <div className="flex flex-col gap-6 relative text-left">
              {historyEvents.map((evt, idx) => {
                const ItemIcon = evt.icon;
                return (
                  <div key={idx} className="flex gap-4 sm:gap-6 items-start relative group">
                    {/* Skeuomorphic Timeline Node (clay button style) */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIdx(idx);
                        setViewMode('carousel');
                        playTone(300 + idx * 40, 'sine', 0.1, 0.05);
                      }}
                      className="timeline-list-btn w-8 h-8 rounded-full bg-[#E07A5F] border-2 border-[#C55937] shadow-[2px_2px_4px_rgba(0,0,0,0.1),_inset_1px_1.5px_2px_rgba(255,255,255,0.4)] flex items-center justify-center text-white shrink-0 z-10 transition-transform hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/50"
                    >
                      <ItemIcon className="w-3.5 h-3.5" />
                    </button>

                    <div className="bg-white dark:bg-white/[0.01] border border-brand-slate/10 dark:border-white/5 hover:border-[#E07A5F]/40 rounded-2xl p-4 shadow-sm flex-grow transition-all hover:shadow-md text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1 border-b border-brand-slate/5 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#E07A5F]">
                            {evt.time}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-brand-muted bg-brand-sand/30 dark:bg-white/5 px-2 py-0.5 rounded-md">
                            {lang === 'en' ? evt.categoryEn : evt.categoryUr}
                          </span>
                        </div>
                        <h4 className="font-display text-xs font-bold text-brand-charcoal">
                          {lang === 'en' ? evt.titleEn : evt.titleUr}
                        </h4>
                      </div>
                      <div className="text-xs sm:text-[13px] text-brand-slate leading-relaxed mt-2">
                        {parseTextWithTooltips(lang === 'en' ? evt.textEn : evt.textUr, lang)}
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-mono text-brand-muted">
                        <span>💡 {lang === 'en' ? evt.funFactEn : evt.funFactUr}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Extra guide line */}
        <div className="pt-4 mt-6 border-t border-brand-slate/10 text-center">
          <span className="text-[9px] font-mono font-bold text-brand-muted uppercase tracking-wider flex items-center justify-center gap-1.5">
            <ClayLogo size={12} />
            <span>{lang === 'en' ? "Designed with Skeuomorphism & Study Chimes" : "ہاٹھ سے تراشیدہ ڈیزائن اور خوبصورت آوازوں کے ساتھ"}</span>
          </span>
        </div>

      </div>
    </div>
  );
}

