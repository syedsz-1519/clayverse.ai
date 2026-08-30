import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  Cpu,
  Network,
  Zap,
  Sparkles,
  Layers,
  ShieldCheck,
  Bot,
  Database,
  Compass,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Trophy,
  Play,
  RotateCcw,
  Info,
  HelpCircle,
  Clock,
  Award,
  Flame,
  Check,
  X,
  Target,
  Share2,
  Sparkle
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { audioEngine } from '../lib/audioEngine';
import { streakManager } from '../lib/streakManager';

export interface AIConceptNode {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  subtitle: {
    en: string;
    ur: string;
  };
  tier: 1 | 2 | 3 | 4 | 5;
  tierLabel: {
    en: string;
    ur: string;
  };
  category: 'Foundations' | 'Neural' | 'Transformers' | 'Applied' | 'Advanced';
  prerequisites: string[]; // IDs of required nodes
  lessonId: string;
  summary: {
    en: string;
    ur: string;
  };
  keyTakeaways: {
    en: string[];
    ur: string[];
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  xpReward: number;
  estimatedMins: number;
  iconName: 'Compass' | 'Network' | 'Brain' | 'Database' | 'Cpu' | 'Zap' | 'BookOpen' | 'Layers' | 'ShieldCheck' | 'Bot';
  color: string;
  diagnosticQuiz: {
    question: {
      en: string;
      ur: string;
    };
    options: {
      en: string[];
      ur: string[];
    };
    correctIndex: number;
    explanation: {
      en: string;
      ur: string;
    };
  };
}

export const AI_DEPENDENCY_GRAPH_CONCEPTS: AIConceptNode[] = [
  // TIER 1: FOUNDATIONS
  {
    id: 'ai-fundamentals',
    title: {
      en: 'AI Foundations & Cognition',
      ur: 'AI ki Buniyaad aur Soch'
    },
    subtitle: {
      en: 'Intelligence definitions, rules vs statistical models',
      ur: 'AI ki tareef, rules aur statistical models'
    },
    tier: 1,
    tierLabel: {
      en: 'Tier 1: Foundations',
      ur: 'Darja 1: Buniyaadi Asbaaq'
    },
    category: 'Foundations',
    prerequisites: [],
    lessonId: 'what-is-ai',
    difficulty: 'Beginner',
    xpReward: 50,
    estimatedMins: 15,
    iconName: 'Compass',
    color: '#f59e0b', // Amber
    summary: {
      en: 'Understanding the shift from deterministic rule-based algorithms to probabilistic machine learning pattern recognition.',
      ur: 'Bina hardcoded rules ke data ke patterns se seekhne ka buniyadi concept.'
    },
    keyTakeaways: {
      en: [
        'AI is machine simulation of human cognitive faculties through statistical optimization.',
        'Traditional code executes explicit instructions; ML computes weights from past data.',
        'Pattern recognition loops iteratively reduce loss functions.'
      ],
      ur: [
        'AI machine ko statistical optimization ke zariye seekhne ke qabil banata hai.',
        'Purani coding mein rules likhte the, ML mein data se weights bante hain.',
        'Pattern recognition har step pe ghaltiyan kam karta hai.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'What fundamental difference separates Machine Learning from traditional rule-based programming?',
        ur: 'Machine Learning aur riwayati programming mein sab se ahem farq kya hai?'
      },
      options: {
        en: [
          'ML requires manual hard-coding of every possible if-else scenario.',
          'ML algorithms learn patterns and weights directly from data instead of static rules.',
          'Traditional programming cannot run on silicon processors.',
          'ML only functions when connected to cloud GPUs without memory.'
        ],
        ur: [
          'ML mein har if-else haath se likhna parta hai.',
          'ML data se patterns aur weights khud seekhta hai bina rigid rules ke.',
          'Purani programming computer par nahi chal sakti.',
          'ML sirf cloud par chalta hai.'
        ]
      },
      correctIndex: 1,
      explanation: {
        en: 'Unlike traditional software that relies on hard-coded rules, ML discovers mathematical functions and weights directly from training data.',
        ur: 'ML rigid rules ki bajaye data se mathematical weights khud discover karta hai.'
      }
    }
  },
  {
    id: 'ml-paradigms',
    title: {
      en: 'Supervised vs Unsupervised ML',
      ur: 'Supervised aur Unsupervised ML'
    },
    subtitle: {
      en: 'Labeled datasets, clustering, and reward reinforcement',
      ur: 'Labels, clusters aur reward-based reinforcement'
    },
    tier: 1,
    tierLabel: {
      en: 'Tier 1: Foundations',
      ur: 'Darja 1: Buniyaadi Asbaaq'
    },
    category: 'Foundations',
    prerequisites: ['ai-fundamentals'],
    lessonId: 'family-tree',
    difficulty: 'Beginner',
    xpReward: 60,
    estimatedMins: 20,
    iconName: 'Network',
    color: '#10b981', // Emerald
    summary: {
      en: 'Mastering the primary machine learning paradigms: supervised (labeled ground truth), unsupervised (structure discovery), and reinforcement learning (reward signals).',
      ur: 'Supervised, Unsupervised aur Reinforcement learning ke farq aur tareeqe.'
    },
    keyTakeaways: {
      en: [
        'Supervised learning minimizes error against known target labels (e.g. classification/regression).',
        'Unsupervised learning discovers intrinsic groupings without human labeling (e.g. clustering/PCA).',
        'Reinforcement learning optimizes an agent policy via environmental trial and reward feedback.'
      ],
      ur: [
        'Supervised learning pehle se diye gaye labels se match karta hai.',
        'Unsupervised learning bina labels ke data ke groups banata hai.',
        'Reinforcement learning inaam (rewards) ke zariye policy behtar banata hai.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'Which learning paradigm is used when training an algorithm on a large dataset of customer transactions without any pre-existing labels?',
        ur: 'Jab bina kisi label ke customer transactions ka data cluster karna ho to konsa paradigm use hota hai?'
      },
      options: {
        en: [
          'Supervised Classification',
          'Unsupervised Clustering',
          'Reinforcement Policy Gradient',
          'Zero-Shot Human Prompting'
        ],
        ur: [
          'Supervised Classification',
          'Unsupervised Clustering',
          'Reinforcement Policy Gradient',
          'Zero-Shot Prompting'
        ]
      },
      correctIndex: 1,
      explanation: {
        en: 'Unsupervised clustering discovers natural groupings and structures in data without relying on predefined ground-truth labels.',
        ur: 'Unsupervised clustering bina labels ke data mein natural groups talash karta hai.'
      }
    }
  },

  // TIER 2: NEURAL & EMBEDDINGS
  {
    id: 'neural-networks',
    title: {
      en: 'Deep Neural Networks & Backprop',
      ur: 'Neural Networks aur Backpropagation'
    },
    subtitle: {
      en: 'Perceptrons, activation functions, and gradient descent',
      ur: 'Perceptrons, activations aur gradient descent'
    },
    tier: 2,
    tierLabel: {
      en: 'Tier 2: Neural Architectures',
      ur: 'Darja 2: Neural Shijra'
    },
    category: 'Neural',
    prerequisites: ['ml-paradigms'],
    lessonId: 'family-tree',
    difficulty: 'Intermediate',
    xpReward: 80,
    estimatedMins: 25,
    iconName: 'Brain',
    color: '#06b6d4', // Cyan
    summary: {
      en: 'How interconnected artificial neurons compose non-linear activation functions and use backpropagation calculus to tune millions of synaptic weights.',
      ur: 'Artificial neurons kaise ek doosre se jud kar gradient descent ke zariye weights adjust karte hain.'
    },
    keyTakeaways: {
      en: [
        'Perceptrons compute weighted sums followed by non-linear activations (ReLU, Sigmoid, GELU).',
        'Backpropagation uses the calculus chain rule to calculate loss gradients across all layers.',
        'Gradient descent adjusts network parameters in the opposite direction of the gradient slope.'
      ],
      ur: [
        'Neuron inputs ko multiply karke activation function se guzarta hai.',
        'Backpropagation chain rule use karke loss gradient calculate karta hai.',
        'Gradient descent weights ko loss kam karne ki taraf tabdeel karta hai.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'What mathematical principle enables backpropagation to efficiently compute weight updates across deep network layers?',
        ur: 'Backpropagation deep layers mein weights update karne ke liye konsa mathematical principle use karta hai?'
      },
      options: {
        en: [
          'Calculus Chain Rule for partial derivatives',
          'Pythagorean theorem for geometric distance',
          'Monte Carlo random sampling without derivatives',
          'Markov Decision Chain transition probabilities'
        ],
        ur: [
          'Calculus ka Chain Rule partial derivatives ke liye',
          'Pythagorean theorem faasla napne ke liye',
          'Monte Carlo random sampling',
          'Markov Chain transition probabilities'
        ]
      },
      correctIndex: 0,
      explanation: {
        en: 'The chain rule of calculus allows computing the derivative of the loss with respect to each weight by multiplying layer-by-layer partial derivatives backwards.',
        ur: 'Chain rule ke zariye har layer ke partial derivatives ko multiply karke loss gradient nikala jata hai.'
      }
    }
  },
  {
    id: 'embeddings-vectors',
    title: {
      en: 'Vector Embeddings & Semantic Space',
      ur: 'Vector Embeddings aur Semantic Space'
    },
    subtitle: {
      en: 'Mapping words & media into high-dimensional geometric coordinates',
      ur: 'Alfaaz ko high-dimensional numbers mein map karna'
    },
    tier: 2,
    tierLabel: {
      en: 'Tier 2: Neural Architectures',
      ur: 'Darja 2: Neural Shijra'
    },
    category: 'Neural',
    prerequisites: ['ml-paradigms'],
    lessonId: 'family-tree',
    difficulty: 'Intermediate',
    xpReward: 80,
    estimatedMins: 25,
    iconName: 'Database',
    color: '#8b5cf6', // Purple
    summary: {
      en: 'Representing concepts, words, and media as dense vector arrays where geometric cosine proximity mirrors semantic and contextual meaning.',
      ur: 'Words aur concepts ko numbers ke array mein convert karna jahan qareebi vectors ka matlab milta julta ho.'
    },
    keyTakeaways: {
      en: [
        'Embeddings map discrete tokens to continuous vector spaces (e.g. 768 to 3072 dimensions).',
        'Cosine similarity measures angle orientation between vectors, ignoring magnitude differences.',
        'Vector math exhibits conceptual algebra (e.g. Vector("King") - Vector("Man") + Vector("Woman") ≈ Vector("Queen")).'
      ],
      ur: [
        'Embeddings har lafz ko hazaron dimensions wale numbers mein badalti hain.',
        'Cosine similarity do vectors ke darmiyan angle ka faasla napta hai.',
        'Vector algebra ke zariye concepts ko add/subtract kiya ja sakta hai.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'Why is Cosine Similarity commonly preferred over Euclidean Distance for semantic text embeddings?',
        ur: 'Text embeddings mein Euclidean distance ke muqable Cosine Similarity kyun behtar mani jaati hai?'
      },
      options: {
        en: [
          'It evaluates the directional angle between vectors regardless of document length/magnitude.',
          'It completely removes the need for floating-point calculations on GPUs.',
          'It guarantees zero tokenization latency during inference.',
          'It forces all vectors to strictly positive integer values.'
        ],
        ur: [
          'Ye text ki lambai ki parwah kiye bina vectors ki disha (angle) napta hai.',
          'Isse GPU calculations ki zaroorat khatam ho jaati hai.',
          'Ye latency ko zero kar deta hai.',
          'Ye sirf positive numbers allow karta hai.'
        ]
      },
      correctIndex: 0,
      explanation: {
        en: 'Cosine similarity focuses on the directional angle between semantic vectors, ensuring that longer texts with higher norm values remain close to conceptually identical shorter passages.',
        ur: 'Cosine similarity vector ke angle ko check karta hai, jisse lambe aur chote jumlon ka matlab barabar rehta hai.'
      }
    }
  },

  // TIER 3: TRANSFORMERS & LLMs
  {
    id: 'transformer-attention',
    title: {
      en: 'Self-Attention & Transformers',
      ur: 'Self-Attention aur Transformer Architecture'
    },
    subtitle: {
      en: 'Query-Key-Value matrices and parallel sequence modeling',
      ur: 'Q, K, V matrices aur parallel token processing'
    },
    tier: 3,
    tierLabel: {
      en: 'Tier 3: Transformers & LLMs',
      ur: 'Darja 3: Transformers aur LLMs'
    },
    category: 'Transformers',
    prerequisites: ['neural-networks', 'embeddings-vectors'],
    lessonId: 'generative-ai',
    difficulty: 'Advanced',
    xpReward: 100,
    estimatedMins: 30,
    iconName: 'Cpu',
    color: '#3b82f6', // Blue
    summary: {
      en: 'The breakthrough attention mechanism that replaced sequential RNNs with parallel multi-head attention over full context windows.',
      ur: 'Purane sequential models ki jagah ek sath poore context ko multi-head attention se parhne ka tareeqa.'
    },
    keyTakeaways: {
      en: [
        'Query (Q), Key (K), and Value (V) projections compute dynamic attention weights between all token pairs.',
        'Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V is the foundational equation of modern LLMs.',
        'Positional encodings inject token order without needing step-by-step recurrence.'
      ],
      ur: [
        'Query, Key aur Value matrices har token ka doosre token ke sath relation napte hain.',
        'Softmax scaling se transformer poore sentence ke context ko samajhta hai.',
        'Positional encodings se model ko alfaz ki tarteeb maloom hoti hai.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'In the Scaled Dot-Product Attention equation, what is the role of dividing by the square root of d_k (vector dimension)?',
        ur: 'Scaled Dot-Product Attention mein sqrt(d_k) se divide karne ka kya maqsad hai?'
      },
      options: {
        en: [
          'To prevent dot products from growing excessively large and driving softmax into vanishing gradients.',
          'To convert text vectors into human-readable ASCII characters.',
          'To encrypt model weights against adversarial extraction attacks.',
          'To restrict the maximum vocabulary size to 32,000 tokens.'
        ],
        ur: [
          'Dot products ko bohot bara hone se rokna taake softmax gradients zero na ho jayein.',
          'Text ko ASCII mein convert karna.',
          'Weights ko encrypt karna.',
          'Vocabulary ko chota karna.'
        ]
      },
      correctIndex: 0,
      explanation: {
        en: 'Scaling by 1/sqrt(d_k) prevents large dot products from pushing the softmax function into regions with extremely small gradients during backpropagation.',
        ur: 'Scaling se dot products bohot bare nahi hote aur softmax ke gradients theek rehte hain.'
      }
    }
  },
  {
    id: 'tokenization-generation',
    title: {
      en: 'Tokenization & Autoregressive Decoding',
      ur: 'Tokenization aur Next-Token Prediction'
    },
    subtitle: {
      en: 'BPE subwords, sampling temperature, Top-P, and Top-K',
      ur: 'BPE tokens, temperature, Top-P aur sampling control'
    },
    tier: 3,
    tierLabel: {
      en: 'Tier 3: Transformers & LLMs',
      ur: 'Darja 3: Transformers aur LLMs'
    },
    category: 'Transformers',
    prerequisites: ['transformer-attention'],
    lessonId: 'generative-ai',
    difficulty: 'Advanced',
    xpReward: 90,
    estimatedMins: 25,
    iconName: 'Zap',
    color: '#0284c7', // Sky
    summary: {
      en: 'How raw Unicode text is decomposed into byte-pair tokens and how temperature, Top-P (nucleus), and Top-K control the randomness of autoregressive generation.',
      ur: 'Text ko tokens mein todna aur temperature ke zariye jawab ki creativity control karna.'
    },
    keyTakeaways: {
      en: [
        'Byte-Pair Encoding (BPE) compresses common subwords into integer IDs (e.g. ~4 chars per token in English).',
        'Autoregressive generation predicts one token at a time, appending it to the prompt context.',
        'Lower temperature (<0.3) makes output deterministic and focused; higher (>0.8) introduces creative entropy.'
      ],
      ur: [
        'BPE subwords ko integer IDs mein badalta hai.',
        'Model ek ek token predict karke context mein jodta rehta hai.',
        'Low temperature jawab ko factual aur direct banata hai, high temperature creative banata hai.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'How does setting a very low sampling temperature (e.g. 0.1) affect an LLM\'s probability distribution during token selection?',
        ur: 'Temperature ko bohot kam (0.1) karne se LLM ke token selection par kya asar parta hai?'
      },
      options: {
        en: [
          'It sharpens the distribution, heavily favoring the highest probability tokens with minimal randomness.',
          'It flattens the distribution, making all vocabulary tokens equally likely to be sampled.',
          'It disables the GPU attention layers to reduce power consumption.',
          'It reverses the sequence order of the generated sentences.'
        ],
        ur: [
          'Ye distribution ko tez karta hai jisse sirf sab se zyada likely tokens hi chune jaate hain.',
          'Ye sabhi tokens ko barabar chance de deta hai.',
          'Ye GPU ko band kar deta hai.',
          'Ye jumlon ko ulta likhna shuru kar deta hai.'
        ]
      },
      correctIndex: 0,
      explanation: {
        en: 'Lower temperature divides logits by a small number, making highest probability tokens dominate and producing deterministic, focused responses.',
        ur: 'Low temperature se highest probability wale tokens ko priority milti hai aur jawab predictable rehta hai.'
      }
    }
  },

  // TIER 4: APPLIED & PROMPTING
  {
    id: 'prompt-engineering',
    title: {
      en: 'Prompt Design & Chain-of-Thought',
      ur: 'Prompt Engineering aur Chain-of-Thought'
    },
    subtitle: {
      en: 'Zero-shot, Few-shot, ReAct prompting, and role specification',
      ur: 'Few-shot examples, Step-by-step reasoning aur Role framing'
    },
    tier: 4,
    tierLabel: {
      en: 'Tier 4: Applied & Tooling',
      ur: 'Darja 4: Practical Maharat'
    },
    category: 'Applied',
    prerequisites: ['tokenization-generation'],
    lessonId: 'prompting-rag',
    difficulty: 'Intermediate',
    xpReward: 80,
    estimatedMins: 20,
    iconName: 'BookOpen',
    color: '#ec4899', // Pink
    summary: {
      en: 'Structuring context, system instructions, and explicit reasoning steps to elicit accurate and structured reasoning from language models.',
      ur: 'System prompts, few-shot examples aur step-by-step thinking se LLM se behtareen nataij lena.'
    },
    keyTakeaways: {
      en: [
        'Chain-of-Thought (CoT) prompting ("Think step by step") expands inference compute on complex logic.',
        'Few-shot in-context exemplars align output schema and style without weight fine-tuning.',
        'Clear constraints and system personas reduce ambiguity and hallucination rates.'
      ],
      ur: [
        'Chain-of-thought prompt se model step-by-step soch kar sahi jawab nikalta hai.',
        'Few-shot examples se format aur output structure bilkul accurate aata hai.',
        'Wazeh rules aur system instructions se ghalat jawabat kam hote hain.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'Why does Chain-of-Thought (CoT) prompting significantly improve performance on multi-step reasoning math or logic problems?',
        ur: 'Multi-step math aur logic problems mein Chain-of-Thought prompt kyun zyada kaamyab hota hai?'
      },
      options: {
        en: [
          'It forces the model to allocate intermediate token generation steps to compute sub-problems sequentially.',
          'It re-trains the neural network weights during live inference.',
          'It replaces the tokenizer with a Python interpreter on the client.',
          'It bypasses token rate limits on the hosting server.'
        ],
        ur: [
          'Isse model intermediate tokens generate karke har hissa alag hal karta hai.',
          'Isse live model ke weights re-train hote hain.',
          'Isse Python chalne lagta hai.',
          'Isse rate limits khatam hoti hain.'
        ]
      },
      correctIndex: 0,
      explanation: {
        en: 'By generating intermediate reasoning tokens step-by-step, the model uses its autoregressive context to condition final answers on verified intermediate logic.',
        ur: 'Step-by-step tokens likhne se model pichle reasoning steps ko dekh kar aakhri sahi jawab deta hai.'
      }
    }
  },
  {
    id: 'rag-vector-db',
    title: {
      en: 'RAG & Vector Retrieval Pipelines',
      ur: 'RAG aur Vector Database Pipelines'
    },
    subtitle: {
      en: 'Chunking strategies, hybrid search, and semantic grounding',
      ur: 'Document chunking, vector search aur factual grounding'
    },
    tier: 4,
    tierLabel: {
      en: 'Tier 4: Applied & Tooling',
      ur: 'Darja 4: Practical Maharat'
    },
    category: 'Applied',
    prerequisites: ['embeddings-vectors', 'prompt-engineering'],
    lessonId: 'prompting-rag',
    difficulty: 'Advanced',
    xpReward: 120,
    estimatedMins: 35,
    iconName: 'Layers',
    color: '#9333ea', // Purple
    summary: {
      en: 'Grounding generative models with live external proprietary documents through chunking, vector embeddings, semantic retrieval, and contextual reranking.',
      ur: 'Apne documents ko vectors mein badal kar LLM ko live search aur hawala dene ka tareeqa.'
    },
    keyTakeaways: {
      en: [
        'RAG combines static LLM knowledge with dynamic, private external enterprise databases.',
        'Document chunking with overlap maintains semantic coherence across split boundaries.',
        'Hybrid search merges dense vector cosine search with sparse keyword BM25 retrieval.'
      ],
      ur: [
        'RAG se model aapke private documents ko parh kar accurate hawala deta hai.',
        'Chunking documents ko munasib hisson mein baant kar vector database mein save karta hai.',
        'Hybrid search keywords aur semantic vectors dono ko mila kar best context nikalta hai.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'What is the primary advantage of RAG over fine-tuning for incorporating rapidly changing enterprise knowledge?',
        ur: 'Rozana badalne wale company data ke liye fine-tuning ke muqable RAG ka sab se bara faida kya hai?'
      },
      options: {
        en: [
          'RAG updates knowledge instantly by changing the database index without expensive model re-training.',
          'RAG removes the need to use transformer context windows.',
          'RAG guarantees 100% reduction in API token costs.',
          'RAG transforms text models into audio synthesizers.'
        ],
        ur: [
          'RAG data ko bina model re-train kiye foran update karta hai.',
          'RAG context window ki zaroorat khatam kar deta hai.',
          'RAG se token costs zero ho jaati hain.',
          'RAG text ko audio bana deta hai.'
        ]
      },
      correctIndex: 0,
      explanation: {
        en: 'RAG decouples knowledge storage from model weights, allowing real-time database updates and clear citations without expensive training runs.',
        ur: 'RAG knowledge ko database mein rakhta hai, jisse bina re-training ke data foran update ho jata hai.'
      }
    }
  },

  // TIER 5: ADVANCED & AGENTIC
  {
    id: 'model-alignment-safety',
    title: {
      en: 'Model Alignment, RLHF & Safety',
      ur: 'Model Alignment, RLHF aur Safety'
    },
    subtitle: {
      en: 'Reward modeling, DPO, constitutional AI, and guardrails',
      ur: 'Human feedback, DPO, ethical boundaries aur guardrails'
    },
    tier: 5,
    tierLabel: {
      en: 'Tier 5: Advanced & Agentic',
      ur: 'Darja 5: Advanced AI Systems'
    },
    category: 'Advanced',
    prerequisites: ['prompt-engineering'],
    lessonId: 'deeper',
    difficulty: 'Advanced',
    xpReward: 110,
    estimatedMins: 30,
    iconName: 'ShieldCheck',
    color: '#e11d48', // Rose
    summary: {
      en: 'Steering base next-token predictors into helpful, harmless, and honest assistants via Reinforcement Learning from Human Feedback (RLHF) and Direct Preference Optimization (DPO).',
      ur: 'Base models ko safe, helpful aur honest assistant banane ke liye RLHF aur DPO ka istemal.'
    },
    keyTakeaways: {
      en: [
        'Base models are unaligned text predictors; RLHF aligns behavior to human safety intentions.',
        'Direct Preference Optimization (DPO) optimizes policy directly against preference pairs without a separate reward model.',
        'Input/output guardrails detect prompt injection, jailbreaks, and toxic responses in production.'
      ],
      ur: [
        'Base models sirf text complete karte hain, RLHF unhe safe assistant banata hai.',
        'DPO bina complex reward model ke direct safe choices sikhata hai.',
        'Safety guardrails prompt injection aur harmful content ko block karte hain.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'What is the key mechanism of Direct Preference Optimization (DPO) compared to traditional PPO-based RLHF?',
        ur: 'PPO-based RLHF ke muqable Direct Preference Optimization (DPO) ka ahem tareeqa kya hai?'
      },
      options: {
        en: [
          'DPO directly optimizes the policy on preference pairs using a closed-form objective without training a separate reward model.',
          'DPO completely eliminates the need for human preference dataset pairs.',
          'DPO runs solely during user inference time in the client browser.',
          'DPO replaces neural activations with classical decision trees.'
        ],
        ur: [
          'DPO alag reward model ke bina direct preference pairs se model optimize karta hai.',
          'DPO ko human feedback data ki zaroorat nahi hoti.',
          'DPO sirf browser mein chalta hai.',
          'DPO neural networks ko decision trees se replace karta hai.'
        ]
      },
      correctIndex: 0,
      explanation: {
        en: 'DPO uses a mathematical substitution to optimize model weights directly from pairwise human preference rankings, bypassing the instability of training and maintaining a separate reward model.',
        ur: 'DPO pairwise human preferences se direct mathematically model tune karta hai bina alag reward model ke.'
      }
    }
  },
  {
    id: 'ai-agentic-workflows',
    title: {
      en: 'Autonomous AI Agents & Tool Calling',
      ur: 'Autonomous AI Agents aur Tool Calling'
    },
    subtitle: {
      en: 'Function calling, multi-agent orchestration, and memory loops',
      ur: 'Tool calling, multi-agent teams aur memory loops'
    },
    tier: 5,
    tierLabel: {
      en: 'Tier 5: Advanced & Agentic',
      ur: 'Darja 5: Advanced AI Systems'
    },
    category: 'Advanced',
    prerequisites: ['rag-vector-db', 'model-alignment-safety'],
    lessonId: 'tools',
    difficulty: 'Expert',
    xpReward: 150,
    estimatedMins: 40,
    iconName: 'Bot',
    color: '#4f46e5', // Indigo
    summary: {
      en: 'Building autonomous cognitive loops where LLMs reason, plan sub-tasks, execute external APIs/tools, inspect results, and self-correct until complex goals are met.',
      ur: 'Aise autonomous agents banana jo planning karein, APIs aur tools chalayein aur self-correction se complex tasks karein.'
    },
    keyTakeaways: {
      en: [
        'Tool calling enables LLMs to interact with databases, web search, code sandboxes, and external APIs.',
        'ReAct (Reason + Act) loops interleave thought steps with environmental action calls.',
        'Multi-agent architectures assign specialized roles (coder, reviewer, planner) for robust execution.'
      ],
      ur: [
        'Tool calling se AI live APIs, databases aur code chala sakta hai.',
        'ReAct loop se AI sochna aur tools chalana ek sath continue karta hai.',
        'Multi-agent systems mein alag alag expert agents mil kar bara kaam pura karte hain.'
      ]
    },
    diagnosticQuiz: {
      question: {
        en: 'In an autonomous agent architecture, what core cycle enables the model to recover from tool execution errors?',
        ur: 'Autonomous agent mein tools ke errors se recover karne ke liye konsa core cycle istemal hota hai?'
      },
      options: {
        en: [
          'Observation-Reflection-Replanning loop (e.g. ReAct) where error outputs are fed back into context.',
          'Immediate process termination without retrying.',
          'Resetting the GPU hardware memory to factory firmware.',
          'Compressing all prompts into gzip archives.'
        ],
        ur: [
          'Observation aur Replanning loop (ReAct) jahan error ko context mein daal kar dobara koshish hoti hai.',
          'Foran program band kar dena.',
          'GPU ko format karna.',
          'Prompts ko zip karna.'
        ]
      },
      correctIndex: 0,
      explanation: {
        en: 'The agent inspects the tool\'s stdout/stderr observation, reflects on the failure reason, and dynamically reformulates a new action plan.',
        ur: 'Agent tool ke error output ko dekh kar samajhta hai aur naya plan bana kar masla hal karta hai.'
      }
    }
  }
];

const ICONS_MAP = {
  Compass,
  Network,
  Brain,
  Database,
  Cpu,
  Zap,
  BookOpen,
  Layers,
  ShieldCheck,
  Bot
};

interface LearningPathDependencyMapProps {
  completedLessonIds?: string[];
  masteredConceptIds?: string[];
  onNavigateLesson?: (lessonId: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  className?: string;
  onMasterConcept?: (conceptId: string) => void;
}

export default function LearningPathDependencyMap({
  completedLessonIds = [],
  masteredConceptIds: propMasteredIds,
  onNavigateLesson,
  onNavigateSection,
  className = '',
  onMasterConcept
}: LearningPathDependencyMapProps) {
  const { lang } = useLanguage();
  const [selectedConcept, setSelectedConcept] = useState<AIConceptNode | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<number | 'all'>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'unlocked' | 'mastered' | 'locked'>('all');
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [diagnosticSelectedOption, setDiagnosticSelectedOption] = useState<number | null>(null);
  const [diagnosticSubmitted, setDiagnosticSubmitted] = useState<boolean>(false);
  const [diagnosticPassed, setDiagnosticPassed] = useState<boolean>(false);
  const [celebrateConceptId, setCelebrateConceptId] = useState<string | null>(null);

  // Initialize and sync mastered concepts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('clay_mastered_concepts');
      if (stored) {
        setMasteredIds(JSON.parse(stored));
      } else if (propMasteredIds && propMasteredIds.length > 0) {
        setMasteredIds(propMasteredIds);
      } else {
        // Default starting mastered concept
        setMasteredIds(['ai-fundamentals']);
      }
    } catch {
      setMasteredIds(['ai-fundamentals']);
    }
  }, [propMasteredIds]);

  // Concept state calculator (Mastered, Unlocked, Locked)
  const conceptStates = useMemo(() => {
    const states: Record<string, 'mastered' | 'unlocked' | 'locked'> = {};
    const masteredSet = new Set(masteredIds);

    AI_DEPENDENCY_GRAPH_CONCEPTS.forEach(concept => {
      if (masteredSet.has(concept.id)) {
        states[concept.id] = 'mastered';
      } else {
        // Check if all prerequisites are mastered
        const allPrereqsMet = concept.prerequisites.length === 0 || 
          concept.prerequisites.every(prereqId => masteredSet.has(prereqId));
        
        states[concept.id] = allPrereqsMet ? 'unlocked' : 'locked';
      }
    });

    return states;
  }, [masteredIds]);

  // Overall path metrics
  const pathStats = useMemo(() => {
    const total = AI_DEPENDENCY_GRAPH_CONCEPTS.length;
    const mastered = Object.values(conceptStates).filter(s => s === 'mastered').length;
    const unlocked = Object.values(conceptStates).filter(s => s === 'unlocked').length;
    const locked = Object.values(conceptStates).filter(s => s === 'locked').length;
    const percent = Math.round((mastered / total) * 100);
    const totalXpEarned = AI_DEPENDENCY_GRAPH_CONCEPTS
      .filter(c => conceptStates[c.id] === 'mastered')
      .reduce((sum, c) => sum + c.xpReward, 0);

    return {
      total,
      mastered,
      unlocked,
      locked,
      percent,
      totalXpEarned
    };
  }, [conceptStates]);

  const handleOpenConcept = (concept: AIConceptNode) => {
    audioEngine.playLoFiChord();
    setSelectedConcept(concept);
    setDiagnosticSelectedOption(null);
    setDiagnosticSubmitted(false);
    setDiagnosticPassed(false);
  };

  const handleVerifyDiagnostic = () => {
    if (!selectedConcept || diagnosticSelectedOption === null) return;
    setDiagnosticSubmitted(true);
    const isCorrect = diagnosticSelectedOption === selectedConcept.diagnosticQuiz.correctIndex;
    setDiagnosticPassed(isCorrect);

    if (isCorrect) {
      audioEngine.playLoFiChord();
      const updated = Array.from(new Set([...masteredIds, selectedConcept.id]));
      setMasteredIds(updated);
      try {
        localStorage.setItem('clay_mastered_concepts', JSON.stringify(updated));
      } catch {}

      if (onMasterConcept) {
        onMasterConcept(selectedConcept.id);
      }

      setCelebrateConceptId(selectedConcept.id);
      setTimeout(() => setCelebrateConceptId(null), 3000);
    }
  };

  const handleQuickMaster = (conceptId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playLoFiChord();
    const updated = Array.from(new Set([...masteredIds, conceptId]));
    setMasteredIds(updated);
    try {
      localStorage.setItem('clay_mastered_concepts', JSON.stringify(updated));
    } catch {}

    if (onMasterConcept) {
      onMasterConcept(conceptId);
    }

    setCelebrateConceptId(conceptId);
    setTimeout(() => setCelebrateConceptId(null), 3000);
  };

  // Group concepts by Tier
  const tierGroups = useMemo(() => {
    const groups: { tier: 1 | 2 | 3 | 4 | 5; label: { en: string; ur: string }; concepts: AIConceptNode[] }[] = [
      { tier: 1, label: { en: 'Tier 1: Core Foundations', ur: 'Darja 1: Buniyaadi Asbaaq' }, concepts: [] },
      { tier: 2, label: { en: 'Tier 2: Neural Architectures & Embeddings', ur: 'Darja 2: Neural Shijra aur Vectors' }, concepts: [] },
      { tier: 3, label: { en: 'Tier 3: Transformer Attention & LLMs', ur: 'Darja 3: Transformers aur LLMs' }, concepts: [] },
      { tier: 4, label: { en: 'Tier 4: Applied Prompting & RAG Pipelines', ur: 'Darja 4: Practical Prompts aur RAG' }, concepts: [] },
      { tier: 5, label: { en: 'Tier 5: Autonomous Agents & Alignment', ur: 'Darja 5: Advanced Agents aur Safety' }, concepts: [] }
    ];

    AI_DEPENDENCY_GRAPH_CONCEPTS.forEach(concept => {
      const g = groups.find(x => x.tier === concept.tier);
      if (g) g.concepts.push(concept);
    });

    return groups;
  }, []);

  // Filtered concepts
  const filteredTiers = useMemo(() => {
    return tierGroups.map(group => {
      if (activeTierFilter !== 'all' && group.tier !== activeTierFilter) {
        return { ...group, concepts: [] };
      }

      const filteredConcepts = group.concepts.filter(c => {
        if (activeStatusFilter === 'all') return true;
        return conceptStates[c.id] === activeStatusFilter;
      });

      return {
        ...group,
        concepts: filteredConcepts
      };
    }).filter(group => group.concepts.length > 0);
  }, [tierGroups, activeTierFilter, activeStatusFilter, conceptStates]);

  return (
    <div className={`bg-white rounded-3xl p-6 border border-brand-slate/15 shadow-sm space-y-6 text-left ${className}`}>
      
      {/* Header & Status Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-slate/10 pb-5">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Network className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Interactive Knowledge DAG
              </span>
              <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{pathStats.percent}% Mastered</span>
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-brand-charcoal mt-0.5">
              {lang === 'en' ? "AI Learning Path & Dependency Map" : "AI Learning Path aur Concept Shijra"}
            </h2>
            <p className="text-xs text-brand-slate max-w-2xl leading-relaxed mt-0.5">
              {lang === 'en'
                ? "Interactive prerequisite knowledge graph. Master foundational concepts to unlock advanced Transformer, RAG, and Autonomous Agent modules."
                : "Aapas mein jude hue concepts ka naqsha. Buniyaadi sabaq mukammal karein taake agle advanced modules unlock hon."}
            </p>
          </div>
        </div>

        {/* Mastered Counter & XP */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <div className="bg-brand-sand/40 border border-brand-slate/15 rounded-2xl p-3 text-center min-w-[100px]">
            <span className="text-[10px] font-mono font-bold text-brand-muted uppercase block">Concepts</span>
            <span className="font-display font-black text-lg text-brand-charcoal">
              {pathStats.mastered} <span className="text-xs text-brand-muted font-normal">/ {pathStats.total}</span>
            </span>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 text-center min-w-[100px]">
            <span className="text-[10px] font-mono font-bold text-amber-900 uppercase block">Knowledge XP</span>
            <span className="font-display font-black text-lg text-amber-800">
              +{pathStats.totalXpEarned} <span className="text-[10px] font-mono">XP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Interactive Path Filters */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-slate font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              <span>Curriculum Tree Mastery ({pathStats.mastered} of {pathStats.total} Nodes Completed)</span>
            </span>
            <span className="font-bold text-brand-charcoal">{pathStats.percent}% Complete</span>
          </div>
          <div className="w-full h-2.5 bg-brand-sand/70 rounded-full overflow-hidden p-0.5 border border-brand-slate/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pathStats.percent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full"
            />
          </div>
        </div>

        {/* Filter Controls (Status & Tier) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-brand-sand/40 border border-brand-slate/15">
            {[
              { id: 'all', label: 'All Nodes' },
              { id: 'unlocked', label: 'Available 🔓' },
              { id: 'mastered', label: 'Mastered ✓' },
              { id: 'locked', label: 'Locked 🔒' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveStatusFilter(tab.id as any);
                  audioEngine.playLoFiChord();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeStatusFilter === tab.id
                    ? 'bg-brand-charcoal text-white shadow-2xs'
                    : 'text-brand-slate hover:text-brand-charcoal hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tier Quick Select */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5">
            <button
              onClick={() => {
                setActiveTierFilter('all');
                audioEngine.playLoFiChord();
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all border cursor-pointer ${
                activeTierFilter === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-brand-slate border-brand-slate/20 hover:border-brand-charcoal'
              }`}
            >
              All Tiers (1-5)
            </button>

            {[1, 2, 3, 4, 5].map(t => (
              <button
                key={t}
                onClick={() => {
                  setActiveTierFilter(t);
                  audioEngine.playLoFiChord();
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold transition-all border cursor-pointer ${
                  activeTierFilter === t
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-brand-slate border-brand-slate/20 hover:border-brand-charcoal'
                }`}
              >
                T{t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Learning Path Tree Tiers */}
      <div className="space-y-6 pt-2">
        {filteredTiers.map((group, groupIdx) => (
          <div key={group.tier} className="space-y-3">
            {/* Tier Header Line */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-brand-charcoal text-xs font-mono font-bold uppercase tracking-wider shrink-0">
                {lang === 'en' ? group.label.en : group.label.ur}
              </span>
              <div className="h-px bg-gradient-to-r from-brand-slate/20 via-brand-slate/10 to-transparent flex-1" />
            </div>

            {/* Concept Nodes in this Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.concepts.map(concept => {
                const state = conceptStates[concept.id] || 'locked';
                const IconComponent = ICONS_MAP[concept.iconName] || Brain;
                const isMastered = state === 'mastered';
                const isUnlocked = state === 'unlocked';
                const isLocked = state === 'locked';

                // Find missing prerequisites names
                const missingPrereqs = concept.prerequisites
                  .filter(pId => !masteredIds.includes(pId))
                  .map(pId => {
                    const prereqObj = AI_DEPENDENCY_GRAPH_CONCEPTS.find(x => x.id === pId);
                    return prereqObj ? (lang === 'en' ? prereqObj.title.en : prereqObj.title.ur) : pId;
                  });

                return (
                  <motion.div
                    key={concept.id}
                    layout
                    whileHover={{ y: -3, scale: 1.01 }}
                    onClick={() => handleOpenConcept(concept)}
                    className={`relative rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                      isMastered
                        ? 'bg-emerald-50/40 border-emerald-500/30 hover:border-emerald-500 shadow-sm'
                        : isUnlocked
                        ? 'bg-white border-indigo-500/30 hover:border-indigo-600 shadow-sm ring-2 ring-indigo-500/10'
                        : 'bg-slate-50/60 border-slate-200 opacity-75 hover:opacity-90'
                    }`}
                  >
                    {/* Top Meta Bar: Icon, Tier, and Status Tag */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
                          style={{
                            backgroundColor: isLocked ? '#94a3b8' : concept.color
                          }}
                        >
                          <IconComponent className="w-5 h-5 stroke-[2.2]" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-muted">
                              {concept.category} • {concept.difficulty}
                            </span>
                            <span className="text-[10px] font-mono text-amber-800 bg-amber-500/15 px-1.5 py-0.2 rounded font-bold">
                              +{concept.xpReward} XP
                            </span>
                          </div>
                          <h3 className="font-display text-base font-bold text-brand-charcoal mt-0.5">
                            {lang === 'en' ? concept.title.en : concept.title.ur}
                          </h3>
                        </div>
                      </div>

                      {/* State Badge */}
                      <div className="shrink-0">
                        {isMastered ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>MASTERED</span>
                          </span>
                        ) : isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-300 animate-pulse">
                            <Unlock className="w-3.5 h-3.5" />
                            <span>READY TO LEARN</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-xl border border-slate-300">
                            <Lock className="w-3.5 h-3.5" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary description */}
                    <p className="text-xs text-brand-slate line-clamp-2 leading-relaxed">
                      {lang === 'en' ? concept.summary.en : concept.summary.ur}
                    </p>

                    {/* Prerequisites Flow Indicators or Mastered Check */}
                    <div className="pt-2 border-t border-brand-slate/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {isLocked ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                          <Lock className="w-3 h-3 text-rose-600" />
                          <span>Prereq Required: {missingPrereqs.join(', ')}</span>
                        </div>
                      ) : isMastered ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Concept Verified & Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-700">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>All Prerequisites Mastered • Open Node</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {isUnlocked && (
                          <button
                            type="button"
                            onClick={(e) => handleQuickMaster(concept.id, e)}
                            className="px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-800 text-[10.5px] font-mono font-bold transition-all cursor-pointer"
                            title="Verify and mark this concept as mastered"
                          >
                            + Quick Master
                          </button>
                        )}

                        <span className="text-[11px] font-mono text-brand-charcoal font-bold flex items-center gap-0.5 group">
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Node Inspector Modal / Concept Deep Dive */}
      <AnimatePresence>
        {selectedConcept && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedConcept(null)}
              className="fixed inset-0 bg-brand-charcoal/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-brand-slate/20 shadow-2xl space-y-6 text-left z-10 select-none overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header Bar */}
              <div className="flex items-start justify-between gap-3 border-b border-brand-slate/10 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                    style={{ backgroundColor: selectedConcept.color }}
                  >
                    {React.createElement(ICONS_MAP[selectedConcept.iconName] || Brain, {
                      className: 'w-6 h-6 stroke-[2.2]'
                    })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-sand text-brand-charcoal">
                        {lang === 'en' ? selectedConcept.tierLabel.en : selectedConcept.tierLabel.ur}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-500/15 px-2 py-0.5 rounded-md">
                        +{selectedConcept.xpReward} XP Reward
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-black text-brand-charcoal mt-0.5">
                      {lang === 'en' ? selectedConcept.title.en : selectedConcept.title.ur}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedConcept(null)}
                  className="p-2 rounded-full bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between px-4 ${
                conceptStates[selectedConcept.id] === 'mastered'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : conceptStates[selectedConcept.id] === 'unlocked'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-2">
                  {conceptStates[selectedConcept.id] === 'mastered' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : conceptStates[selectedConcept.id] === 'unlocked' ? (
                    <Unlock className="w-5 h-5 text-indigo-600 animate-pulse" />
                  ) : (
                    <Lock className="w-5 h-5 text-rose-600" />
                  )}
                  <div>
                    <span className="text-xs font-mono font-bold uppercase block">
                      {conceptStates[selectedConcept.id] === 'mastered'
                        ? 'Mastery Verified'
                        : conceptStates[selectedConcept.id] === 'unlocked'
                        ? 'Unlocked & Ready to Master'
                        : 'Prerequisite Node Locked'}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {conceptStates[selectedConcept.id] === 'locked'
                        ? 'Complete earlier foundational nodes to unlock full interactive testing.'
                        : 'Answer the diagnostic question below or study the corresponding lesson.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary and Key Concepts */}
              <div className="space-y-3">
                <h4 className="font-display font-bold text-sm text-brand-charcoal">
                  {lang === 'en' ? "Core Conceptual Blueprint" : "Buniyadi Concept ka Khulasa"}
                </h4>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed bg-brand-sand/20 p-4 rounded-2xl border border-brand-slate/10">
                  {lang === 'en' ? selectedConcept.summary.en : selectedConcept.summary.ur}
                </p>

                <div className="space-y-2 pt-1">
                  <span className="text-xs font-mono font-bold text-brand-muted uppercase block">
                    {lang === 'en' ? "Key Takeaways & Mental Models" : "Ahem Nukte aur Mental Models"}
                  </span>
                  <div className="space-y-1.5">
                    {(lang === 'en' ? selectedConcept.keyTakeaways.en : selectedConcept.keyTakeaways.ur).map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-brand-slate">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Diagnostic Verification Check */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-900 uppercase flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Knowledge Diagnostic Challenge</span>
                  </span>
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md font-bold">
                    Pass = Instant Node Mastery
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold text-brand-charcoal">
                  {lang === 'en' ? selectedConcept.diagnosticQuiz.question.en : selectedConcept.diagnosticQuiz.question.ur}
                </p>

                <div className="space-y-2 pt-1">
                  {(lang === 'en' ? selectedConcept.diagnosticQuiz.options.en : selectedConcept.diagnosticQuiz.options.ur).map((opt, optIdx) => {
                    const isSelected = diagnosticSelectedOption === optIdx;
                    const isCorrect = optIdx === selectedConcept.diagnosticQuiz.correctIndex;
                    const showFeedback = diagnosticSubmitted;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => {
                          if (!diagnosticSubmitted) {
                            setDiagnosticSelectedOption(optIdx);
                            audioEngine.playLoFiChord();
                          }
                        }}
                        disabled={diagnosticSubmitted}
                        className={`w-full text-left p-3 rounded-xl text-xs transition-all border flex items-start gap-2.5 cursor-pointer ${
                          showFeedback
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                              : isSelected
                              ? 'bg-rose-100 border-rose-500 text-rose-950'
                              : 'bg-white border-slate-200 opacity-60'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white border-indigo-200/60 hover:border-indigo-400 text-brand-charcoal'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                          isSelected && !showFeedback ? 'bg-white text-indigo-700' : 'bg-brand-sand text-brand-charcoal'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {diagnosticSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      diagnosticPassed ? 'bg-emerald-100/70 text-emerald-900 border border-emerald-300' : 'bg-rose-100/70 text-rose-900 border border-rose-300'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {diagnosticPassed ? '🎉 Correct Answer! Concept Mastered!' : '❌ Incorrect. Review explanation:'}
                    </div>
                    <p className="leading-relaxed opacity-90">
                      {lang === 'en' ? selectedConcept.diagnosticQuiz.explanation.en : selectedConcept.diagnosticQuiz.explanation.ur}
                    </p>
                  </motion.div>
                )}

                {/* Check / Retry Buttons */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  {!diagnosticSubmitted ? (
                    <button
                      type="button"
                      disabled={diagnosticSelectedOption === null}
                      onClick={handleVerifyDiagnostic}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verify Answer & Claim +{selectedConcept.xpReward} XP</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setDiagnosticSubmitted(false);
                        setDiagnosticSelectedOption(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-bold cursor-pointer hover:bg-indigo-50"
                    >
                      Retry Challenge
                    </button>
                  )}
                </div>
              </div>

              {/* Action Jump to Curriculum Lesson */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-slate/10">
                <button
                  type="button"
                  onClick={() => setSelectedConcept(null)}
                  className="px-4 py-2.5 rounded-xl bg-brand-sand/50 hover:bg-brand-sand text-brand-charcoal text-xs font-bold font-mono transition-all"
                >
                  Close
                </button>

                {onNavigateLesson && (
                  <button
                    type="button"
                    onClick={() => {
                      const lId = selectedConcept.lessonId;
                      setSelectedConcept(null);
                      onNavigateLesson(lId);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-brand-amber" />
                    <span>Study Full Lesson ({selectedConcept.lessonId})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
