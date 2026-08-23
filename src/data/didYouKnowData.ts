export interface AITriviaItem {
  id: string;
  sectionId: string;
  topic: string;
  badge: string;
  statHighlight?: string;
  fact: {
    en: string;
    hyd: string;
    te: string;
  };
  readMoreTip?: {
    en: string;
    hyd: string;
    te: string;
  };
}

export const AI_TRIVIA_DATABASE: AITriviaItem[] = [
  // 1. HERO / GENERAL AI
  {
    id: 'trivia-hero-1',
    sectionId: 'hero',
    topic: 'Origins of AI',
    badge: 'Historical Fact',
    statHighlight: '1956',
    fact: {
      en: "The term 'Artificial Intelligence' was officially coined in 1956 by computer scientist John McCarthy during the historic Dartmouth Workshop.",
      hyd: "AI ka lafz pehli baar 1956 mein Dartmouth conference mein John McCarthy ne ijaad kiya tha.",
      te: "'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్' అనే పదాన్ని 1956లో డార్ట్‌మౌత్ వర్క్‌షాప్‌లో జాన్ మెక్‌కార్తీ ప్రతిపాదించారు."
    },
    readMoreTip: {
      en: "Before 'AI', researchers called it 'Cybernetics' or 'Complex Information Processing'.",
      hyd: "Isse pehle isko Cybernetics bola jaata tha.",
      te: "దీనికి ముందు దీనిని సైబర్నెటిక్స్ అని పిలిచేవారు."
    }
  },
  {
    id: 'trivia-hero-2',
    sectionId: 'hero',
    topic: 'Pattern Recognition',
    badge: 'Core Principle',
    statHighlight: '100B+',
    fact: {
      en: "AI doesn't experience feelings or genuine consciousness—it is an ultra-fast statistical pattern matcher processing billions of mathematical matrix weights.",
      hyd: "AI ke paas koi dil ya jazbaat nahi hote, ye sirf statistical pattern matching aur number calculation karta hai.",
      te: "AIకి నిజమైన భావోద్వేగాలు ఉండవు—ఇది బిలియన్ల కొద్దీ గణిత మ్యాట్రిక్స్ బరువులను లెక్కించే వేగవంతమైన ప్యాటర్న్ మ్యాచర్ మాత్రమే."
    }
  },

  // 2. WHAT IS AI / BASICS
  {
    id: 'trivia-basics-1',
    sectionId: 'what-is-ai',
    topic: 'Traditional Code vs AI',
    badge: 'Fundamental Shift',
    statHighlight: 'Rules vs Data',
    fact: {
      en: "In traditional coding, programmers write the exact rules (If-Else). In Machine Learning, computers discover the rules automatically from examples!",
      hyd: "Purane software mein hum rules likhte the. Machine learning mein computer data dekh kar rules khud seekh leta hai.",
      te: "సాంప్రదాయ కోడింగ్‌లో మనం రూల్స్ రాస్తాము. మెషిన్ లెర్నింగ్‌లో కంప్యూటర్ ఉదాహరణల నుండి రూల్స్‌ను స్వయంగా కనుగొంటుంది!"
    },
    readMoreTip: {
      en: "Arthur Samuel described machine learning in 1959 as 'the ability to learn without being explicitly programmed'.",
      hyd: "Arthur Samuel ne 1959 mein isko define kiya tha.",
      te: "1959లో ఆర్థర్ శామ్యూల్ దీనిని మొదట వివరించారు."
    }
  },
  {
    id: 'trivia-basics-2',
    sectionId: 'what-is-ai',
    topic: 'The Turing Test',
    badge: 'Milestone 1950',
    statHighlight: '1950',
    fact: {
      en: "In 1950, Alan Turing created the 'Imitation Game' (Turing Test) to test if a computer's conversational output is indistinguishable from a human.",
      hyd: "Alan Turing ne 1950 mein Turing Test banaya tha ye dekhne ke liye ke machine insaan jaisi baat kar sakti hai ya nahi.",
      te: "1950లో అలన్ ట్యూరింగ్ 'ట్యూరింగ్ టెస్ట్' ద్వారా కంప్యూటర్ సంభాషణ మానవుల మాదిరిగా ఉందో లేదో పరీక్షించే విధానాన్ని సృష్టించారు."
    }
  },

  // 3. AI FAMILY TREE / DEEP LEARNING
  {
    id: 'trivia-tree-1',
    sectionId: 'family-tree',
    topic: 'GPU Revolution',
    badge: 'Hardware Catalyst',
    statHighlight: 'AlexNet 2012',
    fact: {
      en: "Deep Learning exploded in 2012 when AlexNet used video game graphics cards (NVIDIA GPUs) to train neural networks 100x faster than CPUs!",
      hyd: "2012 mein AlexNet ne video game ke graphics cards (GPUs) use karke neural networks ki training 100 guna tez kardi.",
      te: "2012లో అలెక్స్‌నెట్ వీడియో గేమింగ్ గ్రాఫిక్స్ కార్డులను (GPUలు) ఉపయోగించి న్యూరల్ నెట్‌వర్క్‌లను 100 రెట్లు వేగంగా శిక్షణ ఇచ్చింది!"
    }
  },
  {
    id: 'trivia-tree-2',
    sectionId: 'family-tree',
    topic: 'Biological Inspiration',
    badge: 'Neural Anatomy',
    statHighlight: '1943 Model',
    fact: {
      en: "Artificial neurons were inspired by biological brain synapses in 1943 by Warren McCulloch & Walter Pitts, using activation thresholds to mimic brain signals.",
      hyd: "Artificial neurons insani dimagh ke cells (synapses) ko dekh kar 1943 mein banaye gaye the.",
      te: "కృత్రిమ న్యూరాన్లు మానవ మెదడు కణాల ప్రేరణతో 1943లో వారెన్ మెక్‌కల్లక్ & వాల్టర్ పిట్స్ చేత రూపొందించబడ్డాయి."
    }
  },

  // 4. GENERATIVE AI & LLMs
  {
    id: 'trivia-genai-1',
    sectionId: 'generative-ai',
    topic: 'The Transformer Paper',
    badge: 'Breakthrough 2017',
    statHighlight: 'Attention Is All You Need',
    fact: {
      en: "The Transformer architecture powering ChatGPT, Gemini, and Claude was invented by Google researchers in 2017 in the famous paper 'Attention Is All You Need'.",
      hyd: "ChatGPT aur Gemini ke piche jo 'Transformer' architecture hai, wo Google ke researchers ne 2017 mein introduce kiya tha.",
      te: "ChatGPT మరియు Geminiల వెనుక ఉన్న 'ట్రాన్స్‌ఫార్మర్' ఆర్కిటెక్చర్‌ను 2017లో గూగుల్ పరిశోధకులు కనిపెట్టారు."
    },
    readMoreTip: {
      en: "Transformers replaced RNNs because they can process all words in parallel rather than sequentially.",
      hyd: "Transformers saare lafzon ko ek sath parallel process karte hain.",
      te: "ట్రాన్స్‌ఫార్మర్లు పదాలను ఒకదాని తర్వాత ఒకటి కాకుండా సమాంతరంగా ప్రాసెస్ చేస్తాయి."
    }
  },
  {
    id: 'trivia-genai-2',
    sectionId: 'generative-ai',
    topic: 'Tokenization & Vectors',
    badge: 'Embedding Math',
    statHighlight: '4,096 Dimensions',
    fact: {
      en: "Large Language Models don't read letters directly; they break words into 'Tokens' and map each token to a vector in 4,000+ dimensional geometric space!",
      hyd: "LLMs har lafz ko 'Tokens' aur 4,000 se zyada dimensions wale numbers (vectors) mein convert karke samajhte hain.",
      te: "LLMలు అక్షరాలను నేరుగా చదవవు; అవి పదాలను 'టోకెన్లు'గా విడగొట్టి 4,000 కంటే ఎక్కువ డైమెన్షన్ల వెక్టార్ స్పేస్‌లో గుర్తిస్తాయి!"
    }
  },

  // 5. PROMPTING & RAG
  {
    id: 'trivia-rag-1',
    sectionId: 'prompting-rag',
    topic: 'RAG vs Fine-Tuning',
    badge: 'Enterprise Architecture',
    statHighlight: '70% Less Hallucinations',
    fact: {
      en: "Retrieval-Augmented Generation (RAG) fetches fresh facts from databases and gives them to the LLM as reference notes, reducing hallucinations by over 70%.",
      hyd: "RAG ke zariye AI pehle aapke documents search karta hai aur fir sach baat batata hai, jisse ghalatiyan 70% kam hoti hain.",
      te: "RAG విధానం ద్వారా AI మొదట మీ డేటాబేస్ నుండి ఖచ్చితమైన సమాచారాన్ని సేకరించి సమాధానమిస్తుంది, దీనివల్ల తప్పుడు సమాధానాలు 70% తగ్గుతాయి."
    }
  },
  {
    id: 'trivia-rag-2',
    sectionId: 'prompting-rag',
    topic: 'Chain-of-Thought',
    badge: 'Prompt Engineering',
    statHighlight: '+30% Accuracy',
    fact: {
      en: "Simply telling an AI model 'Let's think step-by-step' forces it to output intermediate tokens, boosting reasoning benchmark scores by up to 30%!",
      hyd: "Prompt mein 'Step-by-step socho' likhne se AI ki logic aur maths accuracy 30% badh jaati hai.",
      te: "ప్రాంప్ట్‌లో 'దశలవారీగా ఆలోచించండి' అని చెప్పడం వల్ల AI తార్కిక ఖచ్చితత్వం 30% వరకు పెరుగుతుంది!"
    }
  },

  // 6. AI TOOLS & WORKFLOWS
  {
    id: 'trivia-tools-1',
    sectionId: 'tools',
    topic: 'Code Generation',
    badge: 'Developer Velocity',
    statHighlight: '55% Faster',
    fact: {
      en: "Independent studies show software engineers complete programming tasks up to 55% faster when using AI developer assistants.",
      hyd: "Research ke mutabiq AI coding tools use karne wale developers 55% zyada tezi se apna kaam mukammal karte hain.",
      te: "పరిశోధనల ప్రకారం AI కోడింగ్ టూల్స్ ఉపయోగించే డెవలపర్లు తమ పనులను 55% వేగంగా పూర్తి చేస్తున్నారు."
    }
  },

  // 7. ETHICS, SAFETY & THE FUTURE
  {
    id: 'trivia-deeper-1',
    sectionId: 'deeper',
    topic: 'The Alignment Problem',
    badge: 'AI Safety',
    statHighlight: 'RLHF',
    fact: {
      en: "RLHF (Reinforcement Learning from Human Feedback) uses human ratings to train AI to be helpful, honest, and harmless rather than just predicting text.",
      hyd: "RLHF ke zariye insaan AI ko training dete hain taake wo tameezdaar aur sach bolne wala bane.",
      te: "RLHF విధానం ద్వారా మానవ ఫీడ్‌బ్యాక్ ఉపయోగించి AIని సురక్షితంగా మరియు సహాయకరంగా ఉండేలా శిక్షణ ఇస్తారు."
    }
  },
  {
    id: 'trivia-deeper-2',
    sectionId: 'deeper',
    topic: 'Energy Efficiency',
    badge: 'Green Computing',
    statHighlight: 'Quantization',
    fact: {
      en: "Techniques like 4-bit Quantization allow running powerful 8-billion parameter AI models on your local smartphone without needing giant cloud datacenters!",
      hyd: "Quantization ki madad se bade AI models ko chote mobile phones par bhi bina internet ke chalaya ja sakta hai.",
      te: "క్వాంటైజేషన్ టెక్నిక్ ద్వారా భారీ AI మోడళ్లను క్లౌడ్ అవసరం లేకుండా మీ స్మార్ట్‌ఫోన్‌లో కూడా అమలు చేయవచ్చు!"
    }
  },

  // 8. FLASHCARDS & LEARNING
  {
    id: 'trivia-flashcards-1',
    sectionId: 'flashcards',
    topic: 'Active Recall',
    badge: 'Cognitive Science',
    statHighlight: '2x Retention',
    fact: {
      en: "Active recall with flashcards strengthens synaptic connections in your brain, doubling memory retention compared to passive reading.",
      hyd: "Flashcards se sawaal-jawab practice karne se dimagh ki yaad-dasht dugni mazboot hoti hai.",
      te: "ఫ్లాష్‌కార్డుల ద్వారా ప్రాక్టీస్ చేయడం వల్ల సాధారణ పఠనం కంటే జ్ఞాపకశక్తి రెట్టింపు అవుతుంది."
    }
  },

  // 9. GOOGLE CLASSROOM HUB
  {
    id: 'trivia-classroom-1',
    sectionId: 'classroom',
    topic: 'EdTech Transformation',
    badge: 'Modern Classroom',
    statHighlight: 'Adaptive Labs',
    fact: {
      en: "AI tutoring systems provide personalized hints matching each student's learning pace, closing the achievement gap across diverse classrooms.",
      hyd: "AI tutoring har student ke pace ke mutabiq unko aasan tareeqe se samjhata hai.",
      te: "AI ట్యూటరింగ్ వ్యవస్థలు ప్రతి విద్యార్థి వేగానికి అనుగుణంగా వ్యక్తిగతీకరించిన వివరణలను అందిస్తాయి."
    }
  },

  // 10. AI ARENA
  {
    id: 'trivia-arena-1',
    sectionId: 'arena',
    topic: 'Deep Blue vs Kasparov',
    badge: 'Legendary Match',
    statHighlight: '200M Moves/Sec',
    fact: {
      en: "In 1997, IBM's Deep Blue became the first computer system to defeat reigning World Chess Champion Garry Kasparov in a classical match.",
      hyd: "1997 mein IBM Deep Blue ne pehli baar World Chess Champion Garry Kasparov ko haraya tha.",
      te: "1997లో IBM డీప్ బ్లూ ప్రపంచ చెస్ ఛాంపియన్ గ్యారీ కాస్పరోవ్‌ను ఓడించిన మొదటి కంప్యూటర్‌గా నిలిచింది."
    }
  },

  // 11. AI MOCK INTERVIEW
  {
    id: 'trivia-interview-1',
    sectionId: 'interview',
    topic: 'Tech Interview Rubrics',
    badge: 'Hiring Insights',
    statHighlight: 'Communication 40%',
    fact: {
      en: "Top tech hiring panels weight structured communication (STAR method & trade-off rationale) as heavily as raw coding precision!",
      hyd: "Badi tech companies coding ke sath-sath candidate ki baat karne aur samjhane ke tareeqe par 40% marks deti hain.",
      te: "ప్రముఖ టెక్ కంపెనీలు కోడింగ్‌తో పాటు అభ్యర్థి కమ్యూనికేషన్ మరియు సమస్యను పరిష్కరించే విధానానికి 40% వెయిటేజ్ ఇస్తాయి!"
    }
  }
];

export function getTriviaForSection(sectionId: string): AITriviaItem[] {
  const matches = AI_TRIVIA_DATABASE.filter(item => item.sectionId === sectionId);
  return matches.length > 0 ? matches : AI_TRIVIA_DATABASE;
}
