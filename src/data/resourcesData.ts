// Comprehensive Learning Resources Database
// YouTube links, articles, and resources for each AI concept

export interface Resource {
  id: string;
  title: string;
  type: 'youtube' | 'article' | 'course' | 'documentation';
  url: string;
  duration?: string; // for videos
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  thumbnail?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  level: number; // 0 = root, 1 = first level, etc
  parentId?: string;
  resources: Resource[];
  description: string;
  image?: string;
}

// ========== LESSON 1: What is AI? ==========
export const whatIsAIResources: Record<string, Resource[]> = {
  'ai-definition': [
    {
      id: 'yt-what-is-ai-1',
      title: 'What is Artificial Intelligence? - 3Blue1Brown',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=3Don0th_Tig',
      duration: '12:34',
      difficulty: 'beginner',
      description: 'Beautiful explanation of AI basics with animations'
    },
    {
      id: 'yt-what-is-ai-2',
      title: 'AI Explained Simply - TED-Ed',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=kKklxETq7UC',
      duration: '4:52',
      difficulty: 'beginner',
      description: 'Quick visual introduction to AI concepts'
    },
    {
      id: 'article-ai-basics',
      title: 'AI Fundamentals - DeepLearning.AI',
      type: 'article',
      url: 'https://www.deeplearning.ai/resources/basics/',
      difficulty: 'beginner',
      description: 'Comprehensive written guide to AI basics'
    }
  ],
  'pattern-matching': [
    {
      id: 'yt-pattern-matching',
      title: 'How Machines Learn Patterns - StatQuest',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=0dY82jNQWfk',
      duration: '7:45',
      difficulty: 'beginner',
      description: 'Clear explanation of pattern recognition in AI'
    },
    {
      id: 'course-pattern-ml',
      title: 'Pattern Recognition Course - Coursera',
      type: 'course',
      url: 'https://www.coursera.org/learn/machine-learning',
      difficulty: 'intermediate',
      description: 'Full course on ML pattern recognition'
    }
  ],
  'training-data': [
    {
      id: 'yt-training-data',
      title: 'Why Training Data Matters - Yannic Kilcher',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=PqJ0wqtFjR4',
      duration: '8:20',
      difficulty: 'intermediate',
      description: 'Deep dive into importance of training data quality'
    },
    {
      id: 'article-data-quality',
      title: 'Training Data Quality - Analytics Vidhya',
      type: 'article',
      url: 'https://www.analyticsvidhya.com/blog/2020/07/10-data-quality-measures/',
      difficulty: 'intermediate',
      description: 'Detailed guide on data quality in ML'
    }
  ]
};

// ========== LESSON 2: AI Family Tree ==========
export const familyTreeResources: Record<string, Resource[]> = {
  'ai-umbrella': [
    {
      id: 'yt-ai-history',
      title: 'History of AI - Computerphile',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=F5Qx1B7kGos',
      duration: '15:30',
      difficulty: 'beginner',
      description: 'Evolution of AI from early systems to modern day'
    }
  ],
  'machine-learning': [
    {
      id: 'yt-ml-explained',
      title: 'Machine Learning Explained - Simplilearn',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=ukzFI9pi6Oo',
      duration: '10:15',
      difficulty: 'beginner',
      description: 'Complete overview of machine learning concepts'
    },
    {
      id: 'course-ml-andrew-ng',
      title: 'Machine Learning Specialization - Andrew Ng',
      type: 'course',
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      difficulty: 'intermediate',
      description: 'Industry-leading ML course by pioneer Andrew Ng'
    }
  ],
  'deep-learning': [
    {
      id: 'yt-neural-networks',
      title: 'But what is a Neural Network? - 3Blue1Brown',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=aircAruvnKk',
      duration: '19:13',
      difficulty: 'intermediate',
      description: 'Beautiful explanation of neural networks with visualizations'
    },
    {
      id: 'yt-dl-course',
      title: 'Deep Learning Specialization - Coursera',
      type: 'course',
      url: 'https://www.coursera.org/specializations/deep-learning',
      difficulty: 'advanced',
      description: '5-course series on deep learning fundamentals'
    }
  ],
  'generative-ai': [
    {
      id: 'yt-transformers',
      title: 'Attention is All You Need - Luis Serrano',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=XSSTuhyAmnI',
      duration: '22:45',
      difficulty: 'advanced',
      description: 'Breakthrough architecture behind modern generative AI'
    },
    {
      id: 'yt-llm-explained',
      title: 'How Large Language Models Work - Yohei Nakajima',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=Oqs8QYVVJYE',
      duration: '12:30',
      difficulty: 'intermediate',
      description: 'Clear explanation of LLM mechanics'
    }
  ],
  'supervised-learning': [
    {
      id: 'yt-supervised-ml',
      title: 'Supervised Learning Explained - Edureka',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=tPYj3fFJpY8',
      duration: '8:45',
      difficulty: 'beginner',
      description: 'Introduction to supervised learning methods'
    }
  ],
  'unsupervised-learning': [
    {
      id: 'yt-unsupervised-ml',
      title: 'Unsupervised Learning - StatQuest',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=N0Z1nKSxMV4',
      duration: '7:30',
      difficulty: 'beginner',
      description: 'Introduction to clustering and unsupervised techniques'
    }
  ],
  'reinforcement-learning': [
    {
      id: 'yt-rl-basics',
      title: 'Reinforcement Learning Basics - Intel',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=0zwXC8j_zgY',
      duration: '6:20',
      difficulty: 'intermediate',
      description: 'Introduction to RL and reward systems'
    },
    {
      id: 'yt-rl-advanced',
      title: 'Deep Reinforcement Learning - DeepMind',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=I0LFVXtgJ_g',
      duration: '50:00',
      difficulty: 'advanced',
      description: 'Advanced RL techniques from DeepMind researchers'
    }
  ]
};

// ========== LESSON 3: Generative AI ==========
export const generativeAIResources: Record<string, Resource[]> = {
  'llm-basics': [
    {
      id: 'yt-chatgpt-explained',
      title: 'How ChatGPT Works - Sam Altman',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=_w6BS2tnQ-8',
      duration: '8:15',
      difficulty: 'beginner',
      description: 'CEO of OpenAI explains ChatGPT'
    },
    {
      id: 'article-llm-guide',
      title: 'Large Language Models Guide - Hugging Face',
      type: 'article',
      url: 'https://huggingface.co/course/chapter1/1',
      difficulty: 'intermediate',
      description: 'Comprehensive LLM course from Hugging Face'
    }
  ],
  'probability-sampling': [
    {
      id: 'yt-prob-basics',
      title: 'Probability for Machine Learning - StatQuest',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=Kr6qM3H_-QU',
      duration: '9:50',
      difficulty: 'intermediate',
      description: 'Probability concepts in ML explained simply'
    }
  ],
  'token-generation': [
    {
      id: 'yt-tokens-explained',
      title: 'Tokenization Explained - Yannic Kilcher',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=aN9VJJCPC_8',
      duration: '11:30',
      difficulty: 'intermediate',
      description: 'How LLMs break down text into tokens'
    }
  ],
  'image-generation': [
    {
      id: 'yt-dalle-explained',
      title: 'How DALL-E Creates Images - OpenAI',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=ewj0i1DPbSk',
      duration: '7:45',
      difficulty: 'intermediate',
      description: 'Behind the scenes of AI image generation'
    },
    {
      id: 'yt-stable-diffusion',
      title: 'Stable Diffusion Explained - Jeremy Howard',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=J91i_MH4Vdc',
      duration: '13:20',
      difficulty: 'advanced',
      description: 'Technical deep dive into diffusion models'
    }
  ]
};

// ========== LESSON 4: Prompting & RAG ==========
export const promptingRAGResources: Record<string, Resource[]> = {
  'prompt-engineering': [
    {
      id: 'yt-prompt-basics',
      title: 'Prompt Engineering 101 - DeepLearning.AI',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=q-8K5FbNQ4Q',
      duration: '8:30',
      difficulty: 'beginner',
      description: 'Beginner guide to effective prompting'
    },
    {
      id: 'course-prompt-eng',
      title: 'Prompt Engineering for Developers - DeepLearning.AI',
      type: 'course',
      url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/',
      difficulty: 'intermediate',
      description: 'Practical prompt engineering techniques'
    }
  ],
  'rag-system': [
    {
      id: 'yt-rag-explained',
      title: 'RAG Explained - LlamaIndex',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=EcxJOGXZBgw',
      duration: '12:00',
      difficulty: 'intermediate',
      description: 'Retrieval-Augmented Generation explained'
    },
    {
      id: 'yt-rag-advanced',
      title: 'Advanced RAG Techniques - LlamaIndex',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=xKbH_TJfO_0',
      duration: '25:30',
      difficulty: 'advanced',
      description: 'Production RAG system optimization'
    }
  ],
  'hallucination': [
    {
      id: 'yt-ai-hallucination',
      title: 'AI Hallucinations Explained - Code Monkey',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=D0Ny4YlJz5A',
      duration: '6:45',
      difficulty: 'beginner',
      description: 'Why AI makes up false information'
    },
    {
      id: 'article-hallucination',
      title: 'Mitigating Hallucinations - OpenAI',
      type: 'article',
      url: 'https://platform.openai.com/docs/guides/gpt-best-practices',
      difficulty: 'intermediate',
      description: 'Best practices to reduce hallucinations'
    }
  ]
};

// ========== LESSON 5: AI Tools ==========
export const aiToolsResources: Record<string, Resource[]> = {
  'chatgpt': [
    {
      id: 'yt-chatgpt-tutorial',
      title: 'ChatGPT Complete Guide - Craig Shallahamer',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=sZVxFvPM-0g',
      duration: '15:20',
      difficulty: 'beginner',
      description: 'Complete ChatGPT walkthrough for beginners'
    },
    {
      id: 'link-chatgpt',
      title: 'ChatGPT Official',
      type: 'documentation',
      url: 'https://chat.openai.com',
      difficulty: 'beginner',
      description: 'Access ChatGPT directly'
    }
  ],
  'midjourney': [
    {
      id: 'yt-midjourney-tutorial',
      title: 'Midjourney AI Art Complete Tutorial - Tech with Tim',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=0Rp5RCdHArc',
      duration: '18:45',
      difficulty: 'beginner',
      description: 'Learn Midjourney AI image generation'
    }
  ],
  'gemini': [
    {
      id: 'yt-gemini-intro',
      title: 'Google Gemini Tutorial - DataCamp',
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=aPjlbDq7YcQ',
      duration: '10:30',
      difficulty: 'beginner',
      description: 'Introduction to Google Gemini AI'
    }
  ]
};

// Mind Map Structure - Complete Learning Hierarchy
export const learningMindMap: MindMapNode[] = [
  // Root node
  {
    id: 'root',
    label: 'Artificial Intelligence',
    level: 0,
    resources: [],
    description: 'The complete world of AI learning'
  },
  // Level 1: Main categories
  {
    id: 'what-is-ai',
    label: 'What is AI?',
    level: 1,
    parentId: 'root',
    resources: whatIsAIResources['ai-definition'] || [],
    description: 'Foundations of AI - what machines can do'
  },
  {
    id: 'ai-types',
    label: 'Types of AI',
    level: 1,
    parentId: 'root',
    resources: familyTreeResources['ai-umbrella'] || [],
    description: 'Different approaches to artificial intelligence'
  },
  {
    id: 'machine-learning',
    label: 'Machine Learning',
    level: 1,
    parentId: 'root',
    resources: familyTreeResources['machine-learning'] || [],
    description: 'Systems that learn from data'
  },
  {
    id: 'deep-learning',
    label: 'Deep Learning',
    level: 1,
    parentId: 'root',
    resources: familyTreeResources['deep-learning'] || [],
    description: 'Neural networks with multiple layers'
  },
  {
    id: 'generative-ai',
    label: 'Generative AI',
    level: 1,
    parentId: 'root',
    resources: familyTreeResources['generative-ai'] || [],
    description: 'Systems that create new content'
  },

  // Level 2: AI Types breakdown
  {
    id: 'supervised',
    label: 'Supervised Learning',
    level: 2,
    parentId: 'machine-learning',
    resources: familyTreeResources['supervised-learning'] || [],
    description: 'Learning from labeled examples'
  },
  {
    id: 'unsupervised',
    label: 'Unsupervised Learning',
    level: 2,
    parentId: 'machine-learning',
    resources: familyTreeResources['unsupervised-learning'] || [],
    description: 'Finding hidden patterns in unlabeled data'
  },
  {
    id: 'reinforcement',
    label: 'Reinforcement Learning',
    level: 2,
    parentId: 'machine-learning',
    resources: familyTreeResources['reinforcement-learning'] || [],
    description: 'Learning through rewards and penalties'
  },

  // Level 2: Generative AI breakdown
  {
    id: 'llm',
    label: 'Large Language Models',
    level: 2,
    parentId: 'generative-ai',
    resources: generativeAIResources['llm-basics'] || [],
    description: 'Models that understand and generate text'
  },
  {
    id: 'image-gen',
    label: 'Image Generation',
    level: 2,
    parentId: 'generative-ai',
    resources: generativeAIResources['image-generation'] || [],
    description: 'Creating images from text descriptions'
  },

  // Level 3: Practical applications
  {
    id: 'prompt-eng',
    label: 'Prompt Engineering',
    level: 2,
    parentId: 'llm',
    resources: promptingRAGResources['prompt-engineering'] || [],
    description: 'Techniques for effective AI communication'
  },
  {
    id: 'rag',
    label: 'RAG Systems',
    level: 2,
    parentId: 'llm',
    resources: promptingRAGResources['rag-system'] || [],
    description: 'Retrieval-Augmented Generation for accuracy'
  },

  // Level 3: Core concepts
  {
    id: 'pattern-matching',
    label: 'Pattern Matching',
    level: 2,
    parentId: 'what-is-ai',
    resources: whatIsAIResources['pattern-matching'] || [],
    description: 'How AI recognizes patterns'
  },
  {
    id: 'training-data',
    label: 'Training Data',
    level: 2,
    parentId: 'what-is-ai',
    resources: whatIsAIResources['training-data'] || [],
    description: 'The importance of quality data'
  }
];

// Helper function to get all resources for a topic
export const getResourcesByTopic = (topicId: string): Resource[] => {
  const allResources = {
    ...whatIsAIResources,
    ...familyTreeResources,
    ...generativeAIResources,
    ...promptingRAGResources,
    ...aiToolsResources
  };
  return allResources[topicId] || [];
};

// Helper function to get node by ID
export const getMindMapNode = (nodeId: string): MindMapNode | undefined => {
  return learningMindMap.find(node => node.id === nodeId);
};

// Get child nodes for a parent
export const getChildNodes = (parentId: string): MindMapNode[] => {
  return learningMindMap.filter(node => node.parentId === parentId);
};
