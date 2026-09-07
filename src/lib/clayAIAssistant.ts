/**
 * Clay AI Assistant - "Friday" System
 * Intelligent conversational AI that answers questions about:
 * - AI, Machine Learning, Deep Learning
 * - Generative AI, Large Language Models (LLM)
 * - Computer History, Technology Evolution
 * - General Knowledge & Learning
 * 
 * Like Friday from Iron Man - Always Available, Always Learning
 */

export interface ClayQuestion {
  question: string;
  language: string; // 'en', 'hi', 'te', 'mr', 'ta', 'ur', 'roman_ur', 'hinglish'
  category?: string; // 'ai', 'ml', 'dl', 'genai', 'llm', 'history', 'computer', 'general'
}

export interface ClayAnswer {
  answer: string;
  explanation: string;
  examples: string[];
  relatedTopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  audioReady?: boolean;
}

// Comprehensive AI Knowledge Base
const AI_KNOWLEDGE_BASE = {
  // AI Fundamentals
  'what is artificial intelligence': {
    answer: 'Artificial Intelligence (AI) is the science of creating machines and software that can perform tasks that typically require human intelligence.',
    explanation: 'AI involves developing computer systems that can learn from experience, recognize patterns, understand language, and make decisions.',
    examples: [
      'ChatGPT answering questions',
      'Netflix recommending movies',
      'Google Translate converting languages',
      'Self-driving car navigation'
    ],
    relatedTopics: ['Machine Learning', 'Neural Networks', 'Deep Learning'],
    difficulty: 'beginner'
  },

  'difference between ai and machine learning': {
    answer: 'AI is the broad field of creating intelligent machines. Machine Learning is a subset of AI where systems learn from data without explicit programming.',
    explanation: 'AI is the umbrella term. Machine Learning is a specific technique within AI. Not all AI is ML (some uses rule-based systems), but all ML is AI.',
    examples: [
      'Chess AI using pre-written rules = AI but not ML',
      'Spam detection learning from emails = ML (and AI)',
      'Chatbot = can be AI without ML (rules) or with ML'
    ],
    relatedTopics: ['Neural Networks', 'Deep Learning', 'Supervised Learning'],
    difficulty: 'beginner'
  },

  'what is machine learning': {
    answer: 'Machine Learning (ML) is a method of data analysis that automates analytical model building.',
    explanation: 'ML systems improve through experience. They find patterns in data and use those patterns to make predictions on new data.',
    examples: [
      'Email spam filters learning what is spam',
      'Recommendation algorithms on YouTube',
      'Credit card fraud detection',
      'Face recognition systems'
    ],
    relatedTopics: ['Supervised Learning', 'Unsupervised Learning', 'Deep Learning'],
    difficulty: 'beginner'
  },

  'what is deep learning': {
    answer: 'Deep Learning (DL) is a subset of Machine Learning using artificial neural networks with multiple layers (hence "deep").',
    explanation: 'Deep Learning mimics how the human brain processes information through layers of interconnected neurons. Each layer extracts higher-level features.',
    examples: [
      'Image recognition (convolutional neural networks)',
      'Language translation (transformers)',
      'Voice assistants (recurrent neural networks)',
      'Game playing AI (reinforcement learning)'
    ],
    relatedTopics: ['Neural Networks', 'Convolutional Neural Networks', 'Transformers'],
    difficulty: 'intermediate'
  },

  'what is generative ai': {
    answer: 'Generative AI (GenAI) is AI that can create new content: text, images, music, code, etc. based on learned patterns.',
    explanation: 'GenAI systems learn the patterns and structure of training data, then generate original content that follows those patterns.',
    examples: [
      'ChatGPT writing essays',
      'DALL-E creating images from text',
      'Midjourney making artwork',
      'GitHub Copilot generating code'
    ],
    relatedTopics: ['Large Language Models', 'Transformers', 'Neural Networks'],
    difficulty: 'intermediate'
  },

  'what is llm': {
    answer: 'Large Language Model (LLM) is a deep learning model trained on vast amounts of text to understand and generate human language.',
    explanation: 'LLMs predict the next word based on previous words. They learn patterns of language, facts, reasoning, and more from training data.',
    examples: [
      'ChatGPT, Claude, Gemini',
      'GPT-3.5, GPT-4 (OpenAI)',
      'LLaMA (Meta)',
      'Mistral, Llama2'
    ],
    relatedTopics: ['Transformers', 'Tokens', 'Attention Mechanism'],
    difficulty: 'intermediate'
  },

  // Core Concepts
  'what is a neural network': {
    answer: 'A Neural Network is a computing system inspired by biological neural networks in animal brains.',
    explanation: 'It consists of interconnected nodes (neurons) organized in layers. Each connection has a weight that adjusts during training.',
    examples: [
      'Image recognition networks',
      'Speech recognition systems',
      'Natural language processing',
      'Game playing AI'
    ],
    relatedTopics: ['Deep Learning', 'Backpropagation', 'Activation Functions'],
    difficulty: 'intermediate'
  },

  'what is training data': {
    answer: 'Training data is the dataset used to teach an AI or ML model to recognize patterns and make predictions.',
    explanation: 'The model learns from examples in the training data. More data and better quality usually leads to better model performance.',
    examples: [
      '10,000 labeled images for image recognition',
      'Millions of sentences for language models',
      'Historical stock prices for prediction models',
      'Medical images for disease detection'
    ],
    relatedTopics: ['Supervised Learning', 'Validation Data', 'Test Data'],
    difficulty: 'beginner'
  },

  'what are tokens': {
    answer: 'Tokens are the basic units that language models process. A token is roughly 4 characters or a word.',
    explanation: 'LLMs like ChatGPT break text into tokens, process them one at a time, and predict the next token. This is why they generate text word-by-word.',
    examples: [
      'Hello = 1 token',
      '"world" = 1 token',
      '100,000 tokens might cost 1-2 cents with GPT-4',
      'ChatGPT can process up to 128,000 tokens in context'
    ],
    relatedTopics: ['LLM', 'Attention Mechanism', 'Context Window'],
    difficulty: 'intermediate'
  },

  'what is transformer': {
    answer: 'Transformer is a deep learning architecture that uses self-attention to process sequences of data (like words or images).',
    explanation: 'Introduced in 2017, Transformers can process all words in parallel (unlike older RNNs) and understand relationships between distant words.',
    examples: [
      'BERT, GPT, Claude use Transformers',
      'Vision Transformers for image processing',
      'T5 for text-to-text tasks',
      'Attention Is All You Need (original paper)'
    ],
    relatedTopics: ['Attention Mechanism', 'Self-Attention', 'LLM'],
    difficulty: 'advanced'
  },

  'what is rag': {
    answer: 'RAG (Retrieval-Augmented Generation) combines document retrieval with text generation to provide accurate, sourced answers.',
    explanation: 'When you ask a question, RAG first finds relevant documents, then generates an answer based on those documents, preventing hallucinations.',
    examples: [
      'ChatGPT with web search',
      'Customer support with knowledge base',
      'Medical diagnosis with research papers',
      'Legal document analysis'
    ],
    relatedTopics: ['LLM', 'Embeddings', 'Hallucination'],
    difficulty: 'advanced'
  },

  // Computer History
  'history of computers': {
    answer: 'Computers evolved from mechanical calculators (1600s) through room-sized ENIAC (1946) to modern personal computers and smartphones.',
    explanation: 'Timeline: Abacus → Mechanical → Electromechanical → Electronic → Modern. Each era brought exponential increases in speed and capability.',
    examples: [
      '1623: Wilhelm Schickard\'s mechanical calculator',
      '1946: ENIAC - 30 tons, filled entire room',
      '1971: Intel 4004 - first microprocessor',
      '1981: IBM PC - personal computing starts',
      '2007: iPhone - computing in your pocket'
    ],
    relatedTopics: ['Moore\'s Law', 'Semiconductor History', 'Computing Evolution'],
    difficulty: 'beginner'
  },

  'history of ai': {
    answer: 'AI history spans 70+ years: from early expert systems and symbolic AI (1950s-1980s) through the ML revolution to today\'s deep learning era.',
    explanation: 'AI had multiple "winters" (periods of low interest) but kept advancing. Modern deep learning breakthroughs started around 2012.',
    examples: [
      '1956: Dartmouth Conference - AI field born',
      '1974-1980: First AI Winter',
      '1980-1987: Expert systems boom',
      '1987-1993: Second AI Winter',
      '2012: Deep learning breakthrough (ImageNet)',
      '2017: Transformers introduced',
      '2023: GenAI explosion (ChatGPT, etc.)'
    ],
    relatedTopics: ['Deep Learning Revolution', 'Symbolic AI', 'Expert Systems'],
    difficulty: 'intermediate'
  },

  'who invented ai': {
    answer: 'AI wasn\'t invented by one person. It was created by pioneers like John McCarthy, Marvin Minsky, Alan Turing, and many others.',
    explanation: 'John McCarthy coined the term "Artificial Intelligence" in 1956. Alan Turing proposed the Turing Test for machine intelligence in 1950.',
    examples: [
      'Alan Turing - Computing Machinery & Intelligence (1950)',
      'John McCarthy - Coined "AI" (1956)',
      'Marvin Minsky - Co-founder of MIT AI Lab',
      'Geoffrey Hinton - Deep Learning pioneer',
      'Yann LeCun - Convolutional Neural Networks'
    ],
    relatedTopics: ['History of AI', 'Turing Test', 'Neural Networks'],
    difficulty: 'beginner'
  },

  'alan turing': {
    answer: 'Alan Turing (1912-1954) was a British mathematician who founded computer science and asked "Can machines think?"',
    explanation: 'Turing invented the Turing Machine (abstract computer), broke Enigma codes in WWII, and proposed the Turing Test for artificial intelligence.',
    examples: [
      'Turing Test: Can you tell if you\'re talking to AI or human?',
      'Turing Completeness: What computers can and can\'t compute',
      'Turing Machine: Foundation of modern computers',
      'Bombe machine: Cracked Nazi Enigma codes'
    ],
    relatedTopics: ['Turing Test', 'Computability', 'Computer Science Foundations'],
    difficulty: 'intermediate'
  },

  // General Knowledge
  'what is supervised learning': {
    answer: 'Supervised Learning is ML with labeled training data: inputs paired with correct outputs.',
    explanation: 'The model learns to map inputs to outputs. Like learning with a teacher who provides correct answers.',
    examples: [
      'Email spam detection (emails labeled spam/not spam)',
      'House price prediction (houses with known prices)',
      'Disease diagnosis (medical images with labels)',
      'Handwritten digit recognition (0-9 labeled)'
    ],
    relatedTopics: ['Regression', 'Classification', 'Unsupervised Learning'],
    difficulty: 'beginner'
  },

  'what is unsupervised learning': {
    answer: 'Unsupervised Learning finds patterns in unlabeled data without predefined outputs.',
    explanation: 'The model discovers hidden structures. Like grouping people by similar interests without being told what groups exist.',
    examples: [
      'Clustering customers by buying behavior',
      'Grouping similar documents together',
      'Recommendation systems (users like similar items)',
      'Data compression (finding essential patterns)'
    ],
    relatedTopics: ['Clustering', 'Dimensionality Reduction', 'Supervised Learning'],
    difficulty: 'beginner'
  },

  'what is reinforcement learning': {
    answer: 'Reinforcement Learning trains agents to make sequences of decisions by giving rewards for good actions.',
    explanation: 'Agent learns through trial and error. It gets points for good actions and penalties for bad ones, optimizing total reward.',
    examples: [
      'Game playing (AlphaGo beating world champion)',
      'Robot learning to walk',
      'Autonomous vehicle driving',
      'Self-driving cars (reward for safe driving)'
    ],
    relatedTopics: ['Q-Learning', 'Policy Gradient', 'Markov Decision Process'],
    difficulty: 'intermediate'
  },

  'what is overfitting': {
    answer: 'Overfitting happens when a model learns training data too well, including its noise, and performs poorly on new data.',
    explanation: 'The model memorizes specific training examples rather than learning general patterns. Like memorizing answers instead of understanding concepts.',
    examples: [
      'Model gets 99% training accuracy but 60% test accuracy',
      'Model memorizes training images instead of learning features',
      'Complex model on small dataset',
      'Too many parameters relative to data'
    ],
    relatedTopics: ['Regularization', 'Validation', 'Model Complexity'],
    difficulty: 'intermediate'
  },

  'what is backpropagation': {
    answer: 'Backpropagation is the algorithm that trains neural networks by calculating how to adjust weights to reduce error.',
    explanation: 'It works backwards through the network, calculating the gradient of the error with respect to each weight, then updating weights accordingly.',
    examples: [
      'Every time you use ChatGPT, backprop trained it during pre-training',
      'Image recognition models use backprop',
      'Speech recognition systems use backprop',
      'Most modern deep learning uses backprop'
    ],
    relatedTopics: ['Gradient Descent', 'Neural Networks', 'Deep Learning'],
    difficulty: 'advanced'
  },

  'default': {
    answer: 'That\'s a great question! While I don\'t have specific information about that topic yet, I can help you explore it.',
    explanation: 'The Clayverse knowledge base is continuously learning. This question will help me improve!',
    examples: ['You could also ask me about:', 'AI & Machine Learning', 'Computer History', 'Other AI concepts'],
    relatedTopics: ['Ask Clay anything!', 'Keep learning!'],
    difficulty: 'beginner'
  }
};

// Hindi Translations
const HINDI_RESPONSES: Record<string, any> = {
  'artificial intelligence kya hai': {
    answer: 'Artificial Intelligence (AI) ek tarika hai machine banane ka jo human jaise intelligent tasks kar sakte hain.',
    explanation: 'AI mein computer systems learn karte hain experience se, patterns recognize karte hain, aur decisions lete hain.',
    examples: [
      'ChatGPT sawaal jawab dena',
      'Netflix movies recommend karna',
      'Google Translate languages convert karna',
      'Self-driving cars navigation karna'
    ],
    relatedTopics: ['Machine Learning', 'Neural Networks', 'Deep Learning'],
    difficulty: 'beginner'
  },

  'machine learning kya hai': {
    answer: 'Machine Learning (ML) ek tarika hai data analysis ka jo model automatically banata hai.',
    explanation: 'ML systems data se seekhte hain aur apne aap improve hote hain. Pehle se likhne ki jarurat nahi.',
    examples: [
      'Spam filter seekhta hai kaunse emails spam hain',
      'YouTube recommendations',
      'Credit card fraud detection',
      'Face recognition'
    ],
    relatedTopics: ['Supervised Learning', 'Unsupervised Learning', 'Deep Learning'],
    difficulty: 'beginner'
  },

  'deep learning kya hai': {
    answer: 'Deep Learning (DL) Machine Learning ka ek hissa hai jo artificial neural networks use karta hai.',
    explanation: 'DL bohot layers use karta hai jo gradually patterns sikhte hain, bilkul human brain jaise.',
    examples: [
      'Photo mein objects recognize karna',
      'Languages ek se doosre mein translate karna',
      'Voice assistants',
      'Game playing AI'
    ],
    relatedTopics: ['Neural Networks', 'Convolutional Networks', 'Transformers'],
    difficulty: 'intermediate'
  },

  'generative ai kya hai': {
    answer: 'Generative AI (GenAI) ek AI hai jo nayi content bana sakta hai: text, images, music, code wagairah.',
    explanation: 'GenAI patterns seekhta hai aur phir nai content banata hai jo un patterns ko follow kare.',
    examples: [
      'ChatGPT essays likhna',
      'DALL-E se images banana',
      'Midjourney artwork',
      'GitHub Copilot code suggest karna'
    ],
    relatedTopics: ['Large Language Models', 'Transformers', 'Neural Networks'],
    difficulty: 'intermediate'
  }
};

/**
 * Find best matching answer from knowledge base
 */
function findBestMatch(question: string): string {
  const q = question.toLowerCase().trim();
  
  // Exact match
  if (AI_KNOWLEDGE_BASE[q as keyof typeof AI_KNOWLEDGE_BASE]) {
    return q;
  }
  
  // Fuzzy match - find closest keyword
  const keys = Object.keys(AI_KNOWLEDGE_BASE);
  let bestMatch = 'default';
  let bestScore = 0;
  
  for (const key of keys) {
    const score = calculateSimilarity(q, key);
    if (score > bestScore && score > 0.5) {
      bestScore = score;
      bestMatch = key;
    }
  }
  
  return bestMatch;
}

/**
 * Calculate string similarity (simple Levenshtein-based)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  
  let matches = 0;
  for (const w1 of words1) {
    for (const w2 of words2) {
      if (w1 === w2) matches++;
    }
  }
  
  return (matches * 2) / (words1.length + words2.length);
}

/**
 * Main function: Get answer from Clay
 */
export async function askClay(question: ClayQuestion): Promise<ClayAnswer> {
  const matchKey = findBestMatch(question.question);
  const knowledgeEntry = AI_KNOWLEDGE_BASE[matchKey as keyof typeof AI_KNOWLEDGE_BASE] || AI_KNOWLEDGE_BASE.default;
  
  return {
    answer: knowledgeEntry.answer,
    explanation: knowledgeEntry.explanation,
    examples: knowledgeEntry.examples,
    relatedTopics: knowledgeEntry.relatedTopics,
    difficulty: (knowledgeEntry.difficulty as 'beginner' | 'intermediate' | 'advanced'),
    language: question.language,
    audioReady: true
  };
}

/**
 * Get list of topics Clay can discuss
 */
export function getClayTopics(): string[] {
  return Object.keys(AI_KNOWLEDGE_BASE).filter(k => k !== 'default');
}

/**
 * Get Clay conversation tips
 */
export function getConversationTips(): string[] {
  return [
    'Ask me about AI, Machine Learning, or Deep Learning',
    'Ask about the history of computers and AI',
    'Ask about specific AI concepts like "transformers" or "neural networks"',
    'Ask about real-world AI applications',
    'Ask me to explain concepts in different ways',
    'Ask follow-up questions to go deeper'
  ];
}

export default {
  askClay,
  getClayTopics,
  getConversationTips,
  findBestMatch,
};
