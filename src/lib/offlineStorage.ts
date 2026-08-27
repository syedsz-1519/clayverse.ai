/**
 * Clayverse AI - Offline Curriculum Storage & Sync Manager
 * Ensures 100% of core curriculum, zero-math analogies, quizzes, and learner progress
 * remain accessible without an active internet connection.
 */

export interface OfflineLessonData {
  id: string;
  lessonNum: number;
  titleEn: string;
  titleHyd: string;
  titleTe?: string;
  titleHi?: string;
  category: string;
  readTime: string;
  analogyEn: string;
  analogyHyd: string;
  analogyTe?: string;
  analogyHi?: string;
  coreConcepts: string[];
  takeaways: string[];
  offlineQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  cachedAt: number;
}

export interface OfflineStats {
  totalLessons: number;
  cachedCount: number;
  storageUsedBytes: number;
  storageUsedFormatted: string;
  isFullyCached: boolean;
  lastUpdated: string;
}

const STORAGE_PREFIX = 'clay_offline_lesson_';
const OFFLINE_STATS_KEY = 'clay_offline_metadata';
const OFFLINE_QUEUE_KEY = 'clay_offline_action_queue';

// Comprehensive Core Curriculum Payload for 100% Offline Accessibility
export const CORE_OFFLINE_CURRICULUM: OfflineLessonData[] = [
  {
    id: 'what-is-ai',
    lessonNum: 1,
    titleEn: 'Foundations of AI & Mental Models',
    titleHyd: 'AI ki Asli Buniyaad aur Misaalein',
    titleTe: 'AI ప్రాథమిక సూత్రాలు & భావనలు',
    titleHi: 'एआई की बुनियादी समझ और एनालॉजी',
    category: 'Foundations',
    readTime: '2 min',
    analogyEn: 'Traditional coding is like a rigid Recipe book (must follow step-by-step). AI is like an experienced Chef tasting food and adjusting salt automatically based on pattern recognition.',
    analogyHyd: 'Normal coding ek Recipe book ki tarah hai. AI ek tajurbakaar Chef ki tarah hai jo chakh kar khud andaza laga leta hai.',
    analogyTe: 'సాధారణ కోడింగ్ అనేది ఒక వంట పుస్తకం లాంటిది. AI అనేది రుచి చూసి ఉప్పు సరిచేసే అనుభవజ్ఞుడైన చెఫ్ లాంటిది.',
    analogyHi: 'पारंपरिक कोडिंग एक रेसिपी बुक की तरह है। एआई एक अनुभवी शेफ की तरह है जो पैटर्न देखकर सीखता है।',
    coreConcepts: [
      'Narrow AI (Siri, Chess) vs Artificial General Intelligence (AGI)',
      'Pattern Recognition vs Rule-Based Programming',
      'The 3 Horizons: Reactive Machines, Limited Memory, Self-Improving Agents'
    ],
    takeaways: [
      'AI does not "think" with human consciousness; it optimizes statistical likelihoods.',
      'Data is the fuel; parameters are the internal dials tuned during training.',
      'Zero-math intuition: AI finds the best curve connecting dots of past experience.'
    ],
    offlineQuiz: [
      {
        question: 'How does Machine Learning differ from traditional software programming?',
        options: [
          'Traditional code writes strict IF-THEN rules; ML learns rules automatically from data.',
          'Machine learning does not use computers.',
          'Traditional programming only works on mobile phones.',
          'Machine learning requires no data.'
        ],
        correctIndex: 0,
        explanation: 'In traditional programming, humans write rules + data to get answers. In ML, computers take data + answers to formulate rules.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'family-tree',
    lessonNum: 2,
    titleEn: 'The AI Family Tree & Neural Nets',
    titleHyd: 'AI ka Shijra-e-Nasab aur Neural Nets',
    titleTe: 'AI కుటుంబ వృక్షం మరియు న్యూరల్ నెట్‌వర్క్‌లు',
    titleHi: 'एआई फैमिली ट्री और न्यूरल नेटवर्क्स',
    category: 'Architecture',
    readTime: '3 min',
    analogyEn: 'Artificial Intelligence is the broad city. Machine Learning is the neighborhood. Deep Learning is the specialized house with stacked biological-inspired layers.',
    analogyHyd: 'AI ek bada shahar hai, Machine Learning uska ek mohalla hai, aur Deep Learning uske andar bani hui multi-storey building hai.',
    analogyTe: 'AI అనేది ఒక పెద్ద నగరం. మెషిన్ లెర్నింగ్ అనేది ఒక కాలనీ. డీప్ లెర్నింగ్ అనేది అందులోని బహుళ అంతస్తుల భవనం.',
    analogyHi: 'एआई एक बड़ा शहर है, मशीन लर्निंग एक मोहल्ला है, और डीप लर्निंग उसमें बहुमंजिला इमारत है।',
    coreConcepts: [
      'Supervised Learning (Labeled Flashcards)',
      'Unsupervised Learning (Sorting mixed marbles without labels)',
      'Reinforcement Learning (Trial, error, and treats for positive behavior)',
      'Deep Neural Networks with Input, Hidden, and Output layers'
    ],
    takeaways: [
      'Weights and Biases act as millions of volume knobs inside the network.',
      'Activation functions (like ReLU) decide whether an artificial neuron fires or stays quiet.',
      'Loss functions measure how far off the prediction was, guiding backpropagation.'
    ],
    offlineQuiz: [
      {
        question: 'Which learning paradigm trains an AI using rewards and penalties (like training a puppy)?',
        options: [
          'Supervised Learning',
          'Reinforcement Learning',
          'Unsupervised Clustering',
          'Static Hardcoding'
        ],
        correctIndex: 1,
        explanation: 'Reinforcement Learning trains agents to maximize cumulative reward through environmental exploration.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'generative-ai',
    lessonNum: 3,
    titleEn: 'Generative AI & Large Language Models',
    titleHyd: 'Generative AI aur LLMs ka Jadoo',
    titleTe: 'జనరేటివ్ AI మరియు లార్జ్ లాంగ్వేజ్ మోడల్స్',
    titleHi: 'जेनेरेटिव एआई और एलएलएम का जादू',
    category: 'Generative Tech',
    readTime: '3 min',
    analogyEn: 'An LLM is the ultimate super-autocomplete. Having read billions of sentences, it continuously predicts the most statistically coherent next word (token).',
    analogyHyd: 'LLM ek super-smart autocomplete ki tarah hai jo laakhon kitabein padh chuka hai aur agla munasib lafz pehle se jaan leta hai.',
    analogyTe: 'LLM అనేది ప్రపంచంలోని పుస్తకాలన్నీ చదివిన ఒక సూపర్ ఆటో-కంప్లీట్ లాంటిది.',
    analogyHi: 'एलएलएम एक अत्यंत बुद्धिमान ऑटो-कंप्लीट की तरह है जो अगला सही शब्द प्रिडिक्ट करता है।',
    coreConcepts: [
      'Tokens: Words broken into 3-4 letter byte fragments',
      'Transformer Self-Attention: Understanding which words connect across long paragraphs',
      'Temperature: Lower = strict factual precision; Higher = creative diversity',
      'Hallucinations: When the model predicts plausible-sounding falsehoods'
    ],
    takeaways: [
      'LLMs do not look up an encyclopedia table; they generate text dynamically from probabilistic neural connections.',
      'Attention matrices allow the model to link pronouns ("it", "she") to distant nouns in previous paragraphs.'
    ],
    offlineQuiz: [
      {
        question: 'What is a "Token" in Large Language Models?',
        options: [
          'A cryptocurrency coin used for paying servers',
          'A chunk of text (approx 4 characters or 0.75 words) processed by the model',
          'A physical hardware chip',
          'A security password'
        ],
        correctIndex: 1,
        explanation: 'Tokens are the atomic text fragments that neural language models read and generate.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'prompting-rag',
    lessonNum: 4,
    titleEn: 'Prompting & RAG Architecture',
    titleHyd: 'Prompt Engineering aur RAG System',
    titleTe: 'ప్రాంప్ట్ ఇంజనీరింగ్ & RAG ఆర్కిటెక్చర్',
    titleHi: 'प्रॉम्प्ट इंजीनियरिंग और RAG आर्किटेक्चर',
    category: 'Practical Skills',
    readTime: '4 min',
    analogyEn: 'Standard prompting is asking a brilliant student from memory. RAG (Retrieval-Augmented Generation) gives that student an open-book exam with your exact private company documents.',
    analogyHyd: 'Aam prompt zubaani imtihaan ki tarah hai. RAG ek open-book exam hai jisme AI aapki di hui private documents dekh kar jawab deta hai.',
    analogyTe: 'సాధారణ ప్రాంప్ట్ జ్ఞాపకశక్తితో రాసే పరీక్ష లాంటిది. RAG అనేది మన ప్రైవేట్ డాక్యుమెంట్లు చేతిలో ఉన్న ఓపెన్ బుక్ ఎగ్జామ్ లాంటిది.',
    analogyHi: 'RAG एक ओपन-बुक परीक्षा की तरह है जहां एआई आपके प्राइवेट डेटा को सर्च करके सटीक जवाब देता है।',
    coreConcepts: [
      'Zero-Shot vs Few-Shot (Providing 2-3 sample pairs)',
      'Chain-of-Thought ("Think step-by-step" to avoid reasoning jumps)',
      'Vector Embeddings: Turning sentences into mathematical coordinates in semantic space',
      'Vector Database Search + LLM Synthesis pipeline'
    ],
    takeaways: [
      'Role, Context, Task, Constraint, Output Format = Perfect Prompt formula.',
      'RAG completely mitigates hallucinations for factual, real-time enterprise knowledge.'
    ],
    offlineQuiz: [
      {
        question: 'Why does "Chain-of-Thought" prompting drastically improve complex math and reasoning?',
        options: [
          'It forces the model to generate intermediate reasoning tokens, giving the attention heads more context to calculate accurately.',
          'It connects the computer directly to a satellite calculator.',
          'It increases the GPU fan speed.',
          'It restarts the model memory.'
        ],
        correctIndex: 0,
        explanation: 'LLMs calculate answers through forward generation; intermediate steps provide the computational scratchpad needed for logical deduction.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'tools',
    lessonNum: 5,
    titleEn: 'Curated AI Tools Directory',
    titleHyd: 'AI Tools aur Softwares ki Directory',
    titleTe: 'ఉత్తమ AI టూల్స్ డైరెక్టరీ',
    titleHi: 'प्रमुख एआई टूल्स और उपयोगी सॉफ्टवेयर',
    category: 'Ecosystem',
    readTime: '2 min',
    analogyEn: 'AI tools are like specialized carpenter instruments: chat assistants for drafting, code generators for building, and diffusion models for painting.',
    analogyHyd: 'AI tools ek karigar ke auzar hain: koi likhne ke liye, koi code banane ke liye aur koi tasveer banane ke liye.',
    analogyTe: 'AI టూల్స్ అనేవి విభిన్న పనులకు ఉపయోగపడే స్మార్ట్ పనిముట్లు.',
    analogyHi: 'एआई टूल्स आधुनिक डिजिटल बढ़ई के अलग-अलग औजारों की तरह हैं।',
    coreConcepts: [
      'Text & Chat: Claude, Gemini, ChatGPT',
      'Code: GitHub Copilot, Cursor, v0',
      'Design & Visuals: Midjourney, Stable Diffusion, Recraft',
      'Productivity: Perplexity, NotebookLM, Otter'
    ],
    takeaways: [
      'Never copy-paste sensitive credentials into unverified public AI models.',
      'Choose the tool tailored to the modality: search engines for live facts, reasoning models for logic.'
    ],
    offlineQuiz: [
      {
        question: 'Which type of AI tool is best suited for citing academic sources and live verified facts?',
        options: [
          'Grounded AI Search Engines (Perplexity, NotebookLM)',
          'Pure Image Generation diffusion models',
          '3D polygon sculpting tools',
          'Local offline sound recorders'
        ],
        correctIndex: 0,
        explanation: 'Search-grounded models retrieve citations directly from source documents before generating answers.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'deep-dive',
    lessonNum: 6,
    titleEn: 'Deep-Dive: Ethics, Safety & Future',
    titleHyd: 'AI Akhlaqiyaat, Hifazat aur Mustaqbil',
    titleTe: 'AI నైతికత, భద్రత మరియు భవిష్యత్తు',
    titleHi: 'एआई नैतिकता, सुरक्षा और भविष्य',
    category: 'Impact & Ethics',
    readTime: '3 min',
    analogyEn: 'AI is like electricity: powerful enough to illuminate hospitals and cities, but requires safety breakers, grounding, and responsible wiring.',
    analogyHyd: 'AI bijli ki tarah hai: shahar roshan kar sakti hai lekin sahi safety aur fuse ke sath istemal karna zaroori hai.',
    analogyTe: 'AI అనేది విద్యుత్ లాంటిది: ఎంతో ఉపయోగకరం కానీ భద్రతా నియమాలు తప్పనిసరి.',
    analogyHi: 'एआई बिजली की तरह है, इसे सही फ्यूज और सुरक्षा नियमों के साथ इस्तेमाल करना चाहिए।',
    coreConcepts: [
      'Algorithmic Bias: Models reflecting human historical prejudices in training data',
      'Alignment Problem: Ensuring AI goals strictly align with human welfare',
      'Deepfakes & Provenance: Watermarking synthetic media and cryptographic signing',
      'Agentic Workflows: Multi-step autonomous systems with tool-calling capabilities'
    ],
    takeaways: [
      'Critical thinking is the ultimate human skill: always audit and verify AI output.',
      'Responsible AI development prioritizes privacy, interpretability, and robust guardrails.'
    ],
    offlineQuiz: [
      {
        question: 'What causes algorithmic bias in an AI model?',
        options: [
          'Historical imbalances and prejudice present in the training datasets',
          'The color of the computer casing',
          'Using Wi-Fi instead of Ethernet',
          'Running out of memory on the screen'
        ],
        correctIndex: 0,
        explanation: 'AI models learn from real-world historical data; if the data contains societal bias, the model reproduces it unless calibrated.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'ai-arena',
    lessonNum: 7,
    titleEn: 'AI Arena: Model Benchmarks & Leaderboards',
    titleHyd: 'AI Arena: Models ka Muqabla aur Ranking',
    titleTe: 'AI అరేనా: మోడల్స్ పోలిక మరియు ర్యాంకింగ్స్',
    titleHi: 'एआई एरिना: मॉडल्स की तुलना और लीडरबोर्ड',
    category: 'Evaluation',
    readTime: '2 min',
    analogyEn: 'AI Arena is like a blind taste test between competing soda brands; users judge responses side-by-side without knowing the brand name.',
    analogyHyd: 'AI Arena ek andha taste test hai jahan bina naam dekhe do models ke jawab ka faisla kiya jata hai.',
    analogyTe: 'AI అరేనా అనేది రెండు మోడల్స్ సమాధానాలను నేరుగా పోల్చి చూసే వేదిక.',
    analogyHi: 'एआई एरिना बिना नाम जाने दो मॉडल्स के उत्तरों की तुलना करने का ब्लाइंड टेस्ट है।',
    coreConcepts: [
      'Elo Ratings in LLM benchmarking',
      'MMLU, HumanEval, and GSM8k standardized academic benchmarks',
      'Latency vs Quality trade-offs'
    ],
    takeaways: [
      'Bigger models are not always better for latency-sensitive edge devices.',
      'Domain-specific evaluation beats generic leaderboard ranks.'
    ],
    offlineQuiz: [
      {
        question: 'What is LMSYS Chatbot Arena primarily based on?',
        options: [
          'Blind crowdsourced human pairwise preference votes using the Elo rating system',
          'A single professor grading tests manually',
          'The retail price of the GPU server',
          'The number of characters in the company name'
        ],
        correctIndex: 0,
        explanation: 'Blind pairwise human comparisons provide gold-standard preference benchmarks free from label bias.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'flashcards',
    lessonNum: 8,
    titleEn: 'Interactive Terminology Flashcards',
    titleHyd: 'Interactive Istilaahat Flashcards',
    titleTe: 'ముఖ్యమైన AI పదాల ఫ్లాష్ కార్డ్స్',
    titleHi: 'इंटरैक्टिव शब्दावली फ्लैशकार्ड्स',
    category: 'Memory & Revision',
    readTime: '2 min',
    analogyEn: 'Spaced repetition flashcards turn short-term memory into permanent cognitive neural pathways.',
    analogyHyd: 'Flashcards bar bar dohrane se mushkil alfaz hamesha ke liye yaad rehte hain.',
    analogyTe: 'ఫ్లాష్ కార్డ్స్ వల్ల కీలకమైన పదాలు సులభంగా గుర్తున్నాయి.',
    analogyHi: 'फ्लैशकार्ड्स दोहराव के जरिए कठिन शब्दों को आसानी से याद रखने में मदद करते हैं।',
    coreConcepts: [
      'Overfitting vs Underfitting',
      'Epochs, Batches, and Learning Rate',
      'Zero-Shot, One-Shot, and Few-Shot'
    ],
    takeaways: [
      'Mastering 20 core AI definitions unlocks 90% of technical papers and boardroom discussions.'
    ],
    offlineQuiz: [
      {
        question: 'What is "Overfitting" in Machine Learning?',
        options: [
          'When a model memorizes the training data too closely and fails to generalize to new, unseen examples',
          'When the computer power supply is too large',
          'When an image file size is too big',
          'When typing too fast on a keyboard'
        ],
        correctIndex: 0,
        explanation: 'Overfitting occurs when high-capacity models learn random noise instead of underlying generalizable patterns.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'classroom-hub',
    lessonNum: 9,
    titleEn: 'Google Classroom Hub & Educator Assignments',
    titleHyd: 'Google Classroom Hub aur Asbaaq',
    titleTe: 'గూగుల్ క్లాస్‌రూమ్ హబ్ మరియు అసైన్‌మెంట్‌లు',
    titleHi: 'गूगल क्लासरूम हब और असाइनमेंट्स',
    category: 'Classroom',
    readTime: '2 min',
    analogyEn: 'A digital teacher-student bridge syncing learning progress directly into school gradebooks.',
    analogyHyd: 'Ustaad aur shagird ke darmian ek aasan digital pul jo progress sync karta hai.',
    analogyTe: 'ఉపాధ్యాయులు మరియు విద్యార్థుల మధ్య అసైన్‌మెంట్లను సమన్వయం చేసే వేదిక.',
    analogyHi: 'शिक्षक और छात्र के बीच डिजिटल ब्रिज जो होमवर्क और प्रोग्रेस को ट्रैक करता है।',
    coreConcepts: [
      'One-click Google Classroom assignment export',
      'Student study streak verification badges',
      'Printable and downloadable PDF summaries'
    ],
    takeaways: [
      'Educational equity means zero barriers: anyone can learn AI with local languages and offline caching.'
    ],
    offlineQuiz: [
      {
        question: 'How can educators distribute Clayverse AI lessons to students?',
        options: [
          'Direct Google Classroom integration, printable cheat sheets, and offline share links',
          'Only by sending physical floppy disks',
          'By requiring $500 software subscriptions',
          'Only in person via blackboard chalk'
        ],
        correctIndex: 0,
        explanation: 'Clayverse AI provides 100% open education distribution tools for teachers globally.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'quiz',
    lessonNum: 10,
    titleEn: 'Comprehensive Knowledge Check & Certificate',
    titleHyd: 'Jaame Imtihaan aur Sanad',
    titleTe: 'సమగ్ర పరీక్ష & సర్టిఫికేట్',
    titleHi: 'ज्ञान की परख और प्रमाणपत्र',
    category: 'Assessment',
    readTime: '3 min',
    analogyEn: 'Testing your knowledge cements neural pathways, proving conceptual mastery without rote equations.',
    analogyHyd: 'Sawal-jawab se zehan ki girahein khul jati hain aur samajh pukhta hoti hai.',
    analogyTe: 'ఈ పరీక్ష మీ నైపుణ్యాన్ని నిరూపించి ధృవీకరణ పత్రాన్ని అందిస్తుంది.',
    analogyHi: 'प्रश्नोत्तरी के जरिए आपने जो सीखा उसकी पुष्टि होती है और सर्टिफिकेट मिलता है।',
    coreConcepts: [
      'Adaptive difficulty questions',
      'Real-world problem-solving scenarios',
      'Shareable completion certificates'
    ],
    takeaways: [
      'Achieving 80%+ unlocks the foundational AI Practitioner Certificate of Achievement.'
    ],
    offlineQuiz: [
      {
        question: 'Which of the following describes the relationship between AI, Machine Learning, and Deep Learning?',
        options: [
          'Deep Learning is a subset of Machine Learning, which is a subset of Artificial Intelligence',
          'They are three completely unrelated technologies from different centuries',
          'Artificial Intelligence is a small subset of Deep Learning',
          'Machine Learning only exists on supercomputers with no code'
        ],
        correctIndex: 0,
        explanation: 'AI is the overarching discipline; ML is the data-driven learning subfield; Deep Learning utilizes multi-layered neural networks.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'quick-takeaway',
    lessonNum: 11,
    titleEn: '1-Minute Visual Takeaways & Cheat Sheets',
    titleHyd: '1-Minute Visual Nuqaat aur Khulasa',
    titleTe: '1-నిమిషం సారాంశం & చీట్‌షీట్',
    titleHi: '1-मिनट विजुअल सारांश और त्वरित नोट्स',
    category: 'Rapid Summary',
    readTime: '1 min',
    analogyEn: 'The executive summary of modern intelligence: concise high-impact mental models ready for instant recall.',
    analogyHyd: 'Aham tareen baaton ka 1 minute mein aasan khulasa.',
    analogyTe: 'అత్యంత ముఖ్యమైన విషయాల క్లుప్త సారాంశం.',
    analogyHi: 'सभी मुख्य बिंदुओं का 1 मिनट में त्वरित और स्पष्ट रिवीजन।',
    coreConcepts: [
      'High-contrast mental models',
      'The 5 golden rules of AI prompting',
      '3 questions to evaluate any new AI tool'
    ],
    takeaways: [
      'Keep prompt instructions explicit and specify output formatting directly.'
    ],
    offlineQuiz: [
      {
        question: 'What is the most effective way to prevent AI hallucination in factual tasks?',
        options: [
          'Provide source reference text and instruct the model to answer strictly using the provided context (RAG pattern)',
          'Ask the model to guess randomly',
          'Increase the temperature to 2.0',
          'Type in all capital letters'
        ],
        correctIndex: 0,
        explanation: 'Grounding the prompt with specific source documents constrains generation strictly to factual context.'
      }
    ],
    cachedAt: Date.now()
  },
  {
    id: 'community-share',
    lessonNum: 12,
    titleEn: 'Community, Open-Source & Regional AI',
    titleHyd: 'Community, Open-Source aur Muqami AI',
    titleTe: 'కమ్యూనిటీ & స్థానిక భాషల AI అభివృద్ధి',
    titleHi: 'कम्युनिटी, ओपन-सोर्स और भारतीय भाषाएं',
    category: 'Ecosystem & Future',
    readTime: '2 min',
    analogyEn: 'Open-source AI democratizes technology so that every culture, village, and school shapes the intelligence of tomorrow.',
    analogyHyd: 'Open-source AI har zubaan aur har tabqay ke logon ko barabari ka haq deta hai.',
    analogyTe: 'ఓపెన్ సోర్స్ AI వల్ల ప్రతి ఒక్కరూ ఆధునిక సాంకేతికతను తమ సొంత భాషలో పొందవచ్చు.',
    analogyHi: 'ओपन-सोर्स एआई तकनीक को हर भाषा और समाज के हर वर्ग तक पहुंचाता है।',
    coreConcepts: [
      'Bhashini & Indic LLM initiatives (Telugu, Hindi, Tamil, Kannada, Bengali)',
      'Open weights models (Llama, Mistral, Gemma) running locally offline on consumer hardware',
      'Digital empowerment through mother tongue education'
    ],
    takeaways: [
      'Language should never be a barrier to technological mastery.'
    ],
    offlineQuiz: [
      {
        question: 'What is the primary benefit of open-source local AI models (e.g. Gemma, Llama)?',
        options: [
          'They can run securely on private hardware with zero subscription cost, complete data privacy, and full offline capability',
          'They only work on internet browsers with advertising',
          'They cannot be modified by developers',
          'They require permanent internet connections'
        ],
        correctIndex: 0,
        explanation: 'Open models give individuals and institutions complete sovereignty and offline operational independence.'
      }
    ],
    cachedAt: Date.now()
  }
];

class OfflineStorageManager {
  private isInitialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    try {
      // Check if cache exists; if not, populate with complete core curriculum
      const existing = localStorage.getItem(`${STORAGE_PREFIX}what-is-ai`);
      if (!existing) {
        this.cacheAllCurriculum();
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('[OfflineStorage] Storage initialization error:', e);
    }
  }

  public cacheAllCurriculum(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      CORE_OFFLINE_CURRICULUM.forEach((lesson) => {
        const key = `${STORAGE_PREFIX}${lesson.id}`;
        localStorage.setItem(key, JSON.stringify(lesson));
      });

      // Save metadata
      const stats: OfflineStats = {
        totalLessons: CORE_OFFLINE_CURRICULUM.length,
        cachedCount: CORE_OFFLINE_CURRICULUM.length,
        storageUsedBytes: this.calculateStorageSize(),
        storageUsedFormatted: this.formatBytes(this.calculateStorageSize()),
        isFullyCached: true,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(OFFLINE_STATS_KEY, JSON.stringify(stats));

      window.dispatchEvent(new CustomEvent('clay_offline_cache_updated', { detail: stats }));
      return true;
    } catch (e) {
      console.error('[OfflineStorage] Failed to cache curriculum:', e);
      return false;
    }
  }

  public getLesson(id: string): OfflineLessonData | null {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (cached) {
        return JSON.parse(cached);
      }
      // Fallback to static in-memory definition
      const fallback = CORE_OFFLINE_CURRICULUM.find(l => l.id === id);
      return fallback || null;
    } catch (e) {
      console.warn('[OfflineStorage] Read error:', e);
      return null;
    }
  }

  public getAllLessons(): OfflineLessonData[] {
    if (typeof window === 'undefined') return CORE_OFFLINE_CURRICULUM;
    const lessons: OfflineLessonData[] = [];
    CORE_OFFLINE_CURRICULUM.forEach(item => {
      const lesson = this.getLesson(item.id);
      if (lesson) lessons.push(lesson);
    });
    return lessons.length > 0 ? lessons : CORE_OFFLINE_CURRICULUM;
  }

  public getStats(): OfflineStats {
    if (typeof window === 'undefined') {
      return {
        totalLessons: CORE_OFFLINE_CURRICULUM.length,
        cachedCount: CORE_OFFLINE_CURRICULUM.length,
        storageUsedBytes: 0,
        storageUsedFormatted: '0 KB',
        isFullyCached: true,
        lastUpdated: new Date().toISOString()
      };
    }

    try {
      const saved = localStorage.getItem(OFFLINE_STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.storageUsedBytes = this.calculateStorageSize();
        parsed.storageUsedFormatted = this.formatBytes(parsed.storageUsedBytes);
        return parsed;
      }
    } catch {}

    const size = this.calculateStorageSize();
    return {
      totalLessons: CORE_OFFLINE_CURRICULUM.length,
      cachedCount: CORE_OFFLINE_CURRICULUM.length,
      storageUsedBytes: size,
      storageUsedFormatted: this.formatBytes(size),
      isFullyCached: true,
      lastUpdated: new Date().toISOString()
    };
  }

  public queueOfflineAction(action: { type: string; payload: any }) {
    if (typeof window === 'undefined') return;
    try {
      const existing = localStorage.getItem(OFFLINE_QUEUE_KEY);
      const queue = existing ? JSON.parse(existing) : [];
      queue.push({
        ...action,
        timestamp: Date.now()
      });
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch {}
  }

  public processOfflineQueue(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const existing = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (!existing) return 0;
      const queue: any[] = JSON.parse(existing);
      if (queue.length === 0) return 0;

      // Process and sync actions (e.g. streaks, completed quizzes)
      queue.forEach(item => {
        if (item.type === 'quiz_completed') {
          // Increment or record quiz score in stats
          const quizKey = `clay_quiz_score_${item.payload.lessonId}`;
          localStorage.setItem(quizKey, JSON.stringify(item.payload));
        }
        if (item.type === 'streak_checkin') {
          localStorage.setItem('clay_streak_days', String(item.payload.streak));
        }
      });

      // Clear queue once synced
      localStorage.removeItem(OFFLINE_QUEUE_KEY);
      window.dispatchEvent(new CustomEvent('clay_offline_queue_synced', { detail: queue.length }));
      return queue.length;
    } catch {
      return 0;
    }
  }

  public clearCache(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      CORE_OFFLINE_CURRICULUM.forEach((lesson) => {
        localStorage.removeItem(`${STORAGE_PREFIX}${lesson.id}`);
      });
      localStorage.removeItem(OFFLINE_STATS_KEY);
      window.dispatchEvent(new CustomEvent('clay_offline_cache_updated'));
      return true;
    } catch {
      return false;
    }
  }

  private calculateStorageSize(): number {
    if (typeof window === 'undefined') return 0;
    let bytes = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('clay_') || key.startsWith(STORAGE_PREFIX))) {
          const value = localStorage.getItem(key) || '';
          bytes += (key.length + value.length) * 2; // UTF-16 characters approx 2 bytes
        }
      }
    } catch {}
    return bytes;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export const offlineStorage = new OfflineStorageManager();
