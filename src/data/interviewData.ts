import { InterviewerPersona, InterviewQuestion } from '../types';

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: 'dr_sarah',
    name: 'Dr. Sarah Chen',
    role: 'Senior AI Research Lead',
    company: 'DeepMind / Google AI',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    voiceGender: 'female',
    tone: 'Thoughtful, encouraging, rigorous on mathematical and architectural fundamentals.',
    styleDescription: 'Focuses on deep conceptual understanding, architectural tradeoffs, and intuitive explanations.',
  },
  {
    id: 'marcus_vance',
    name: 'Marcus Vance',
    role: 'Principal ML Systems Architect',
    company: 'Anthropic Systems',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    voiceGender: 'male',
    tone: 'Fast-paced, pragmatic, focused on production scaling, latency, and GPU efficiency.',
    styleDescription: 'Drills into real-world production engineering, vector search latency, and memory bottlenecks.',
  },
  {
    id: 'priya_sharma',
    name: 'Priya Sharma',
    role: 'Director of Applied Generative AI',
    company: 'Open Innovations Lab',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    voiceGender: 'female',
    tone: 'Engaging, scenario-driven, evaluates end-to-end RAG workflows, prompt reliability, and ROI.',
    styleDescription: 'Challenges candidates with realistic customer use-cases, hallucination guards, and evaluation metrics.',
  },
  {
    id: 'clay_tutor',
    name: 'Clay AI Mentor',
    role: 'Tactile Learning & Foundations Coach',
    company: 'Clayverse Academy',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ClayMentorAI',
    voiceGender: 'male',
    tone: 'Patient, warm, supportive, perfect for students and interview beginners.',
    styleDescription: 'Offers constructive in-between hints and helps you structure confident, structured answers.',
  },
];

export const INTERVIEW_ROLES = [
  {
    id: 'ai_ml_engineer',
    title: 'AI & Machine Learning Engineer',
    titleHyd: 'AI & Machine Learning Engineer',
    badge: 'Core ML & Deep Learning',
    description: 'Neural networks, loss functions, Transformers, overfitting vs underfitting, and gradient optimization.',
    totalQuestions: 5,
    recommendedPersona: 'dr_sarah',
    icon: 'Brain',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'llm_genai_dev',
    title: 'Generative AI & LLM Systems Developer',
    titleHyd: 'Generative AI & LLM Developer',
    badge: 'Frontier GenAI & RAG',
    description: 'Vector databases, prompt engineering, streaming APIs, embedding models, and token temperature.',
    totalQuestions: 5,
    recommendedPersona: 'priya_sharma',
    icon: 'Sparkles',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'data_scientist',
    title: 'Applied Data Scientist & Researcher',
    titleHyd: 'Data Scientist & Researcher',
    badge: 'Statistics & Model Evaluation',
    description: 'Imbalanced classes, ROC-AUC vs PR-AUC, feature scaling, Adam vs SGD, and regularization.',
    totalQuestions: 5,
    recommendedPersona: 'marcus_vance',
    icon: 'BarChart2',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'ai_foundations',
    title: 'AI Foundations & Beginner Friendly',
    titleHyd: 'AI Buniyadi Concepts & Interview',
    badge: 'Beginner & Career Switcher',
    description: 'What is AI vs ML vs DL, real-world examples, ethics, hallucinations, and training vs inference.',
    totalQuestions: 5,
    recommendedPersona: 'clay_tutor',
    icon: 'GraduationCap',
    color: 'from-amber-400 to-yellow-600',
  },
];

export const INTERVIEW_QUESTIONS_DATABASE: Record<string, InterviewQuestion[]> = {
  ai_ml_engineer: [
    {
      id: 'ml_beg_1',
      role: 'ai_ml_engineer',
      topic: 'Overfitting vs Underfitting',
      difficulty: 'Beginner',
      question: 'What is the fundamental difference between overfitting and underfitting in machine learning, and how can you detect them using training and validation loss curves?',
      questionUrdu: 'Overfitting aur Underfitting me kya farq hai, aur loss curves dekh kar inhe kaise pehchante hain?',
      keyConcepts: ['High bias (underfitting) vs high variance (overfitting)', 'Training loss vs validation loss gap', 'Model complexity and capacity', 'Techniques to reduce overfitting (regularization, dropout, more data)'],
      sampleAnswer: 'Underfitting occurs when a model is too simple to capture patterns in data (high bias), leading to poor performance on both training and validation sets. Overfitting occurs when a model memorizes noise in the training set (high variance), achieving near-zero training loss while validation loss starts climbing. On loss curves, overfitting appears as a widening divergence where validation loss increases while training loss continues decreasing.',
      interviewerFollowUpHint: 'Explain how you would use early stopping to halt training at the optimal epoch.',
      interviewerInBetweenComments: [
        'Clear distinction between bias and variance.',
        'Good visual explanation of the loss curve divergence.',
      ],
    },
    {
      id: 'ml_beg_2',
      role: 'ai_ml_engineer',
      topic: 'Activation Functions',
      difficulty: 'Beginner',
      question: 'Why do neural networks require non-linear activation functions like ReLU instead of simply stacking linear matrix multiplications?',
      questionUrdu: 'Neural networks me non-linear activation functions jaise ReLU kyun zaroori hain?',
      keyConcepts: ['Linear combinations collapse into a single linear transformation: W2*(W1*x) = (W2*W1)*x', 'Universal approximation theorem', 'ReLU (max(0, x)) introduces non-linearity efficiently', 'Enables learning complex decision boundaries'],
      sampleAnswer: 'Without non-linear activation functions, stacking multiple neural network layers is mathematically equivalent to a single linear layer, because any composition of linear operations W2*(W1*x + b1) + b2 collapses into a single matrix multiplication (W_eff * x + b_eff). Non-linear activations like ReLU (f(x) = max(0, x)) allow neural networks to bend decision boundaries and approximate any complex non-linear mathematical function.',
      interviewerFollowUpHint: 'Can you mention why ReLU is computationally faster than Sigmoid?',
      interviewerInBetweenComments: [
        'Right! The linear collapse insight is the key mathematical point.',
        'Great intuition on universal approximation.',
      ],
    },
    {
      id: 'ml_1',
      role: 'ai_ml_engineer',
      topic: 'Regularization & Sparsity',
      difficulty: 'Intermediate',
      question: 'How do L1 (Lasso) and L2 (Ridge) regularization differ in how they penalize model weights, and why does L1 lead to sparsity?',
      questionUrdu: 'L1 aur L2 regularization weights ko kaise penalize karte hain, aur L1 sparsity kyun paida karta hai?',
      keyConcepts: ['L1 adds absolute value penalty |w|', 'L2 adds squared penalty w²', 'Geometric diamond vs circle contours', 'Feature selection / sparsity', 'Preventing weight explosion'],
      sampleAnswer: 'L1 adds the sum of absolute weights (|w|) to the loss function, while L2 adds the sum of squared weights (w²). Geometrically, L1 has sharp diamond-shaped contour corners that frequently intersect axes at exact zeros, driving non-essential coefficients to zero and performing automatic feature selection. L2 shrinks weights close to zero but rarely makes them exactly zero.',
      interviewerFollowUpHint: 'Mention the derivative of absolute value vs squared weight near zero.',
      interviewerInBetweenComments: [
        'Good start! How does that diamond shape actually force weights to zero at the axis?',
        'Exactly right on the penalty formula. Keep going with the geometric intuition.',
      ],
    },
    {
      id: 'ml_4',
      role: 'ai_ml_engineer',
      topic: 'Vanishing Gradients & Skip Connections',
      difficulty: 'Intermediate',
      question: 'What causes the vanishing gradient problem in deep neural networks during backpropagation, and how did Residual skip connections resolve it?',
      questionUrdu: 'Deep networks me vanishing gradient problem kya hai aur ResNet skip connections ne isse kaise hal kiya?',
      keyConcepts: ['Chain rule multiplication of tiny derivatives', 'Sigmoid / Tanh derivative saturation (<0.25)', 'Residual skip connection: y = F(x) + x', 'Gradient highway: dLoss/dx = dLoss/dy * (dF/dx + 1)'],
      sampleAnswer: 'During backpropagation, gradients are multiplied backwards through layers via the chain rule. With saturating activation functions like Sigmoid, deep networks see gradients decay exponentially toward zero, preventing early layers from updating. ResNet residual connections (y = F(x) + x) provide an additive gradient highway: dLoss/dx = dLoss/dy * (dF/dx + 1). The "+1" term ensures that gradients flow backwards directly even if the learned subnetwork F(x) has vanishing gradients.',
      interviewerFollowUpHint: 'Explain what happens to early layer weights when gradients vanish.',
      interviewerInBetweenComments: [
        'Spot on with the chain rule compounding problem.',
        'Great callout on the (+1) gradient highway in ResNet.',
      ],
    },
    {
      id: 'ml_2',
      role: 'ai_ml_engineer',
      topic: 'Transformers & Scaled Dot-Product Attention',
      difficulty: 'Advanced',
      question: 'Walk me through the Multi-Head Self-Attention mechanism in the Transformer architecture. Why do we scale by sqrt(d_k), and why are positional encodings required?',
      questionUrdu: 'Transformer me Multi-Head Self-Attention kaise kaam karta hai? sqrt(d_k) se divide kyun karte hain?',
      keyConcepts: ['Query, Key, Value matrices', 'Scaled dot-product attention: Softmax((Q*K^T)/sqrt(d_k))*V', 'Softmax gradient saturation avoidance', 'Permutation invariance of dot products', 'Sinusoidal and learned positional embeddings'],
      sampleAnswer: 'Self-attention projects input tokens into Query (Q), Key (K), and Value (V) representations. Attention scores are calculated as Softmax((Q * K^T) / sqrt(d_k)) * V. We divide by sqrt(d_k) because for large vector dimensions, dot products grow large in magnitude, pushing the Softmax into regions with extremely tiny gradients (vanishing gradients). Because attention is permutation-invariant (order-agnostic), positional encodings must be injected so the model understands token sequential order.',
      interviewerFollowUpHint: 'Explain what happens to the Softmax gradients if we omit the square root scaling.',
      interviewerInBetweenComments: [
        'Spot on with Q, K, and V.',
        'Great insight on why the softmax gradients saturate without the scaling factor!',
      ],
    },
    {
      id: 'ml_3',
      role: 'ai_ml_engineer',
      topic: 'PEFT, LoRA & Catastrophic Forgetting',
      difficulty: 'Advanced',
      question: 'When fine-tuning a pretrained foundation model on domain-specific medical data, how would you prevent catastrophic forgetting while keeping compute overhead low?',
      questionUrdu: 'Pretrained model ko fine-tune karte waqt purani knowledge bhulne (catastrophic forgetting) se kaise bachayenge?',
      keyConcepts: ['Parameter-Efficient Fine-Tuning (PEFT)', 'LoRA (Low-Rank Adaptation: W0 + B*A)', 'QLoRA 4-bit NormalFloat quantization', 'Replay buffers with general pretraining data', 'Freezing backbone layers'],
      sampleAnswer: 'Instead of full parameter fine-tuning which overwrites pretrained weights and causes catastrophic forgetting, I would apply LoRA (Low-Rank Adaptation) or QLoRA. LoRA freezes the original pretrained weights W0 and trains low-rank decomposition matrices A and B (delta W = B * A, where rank r is 8 or 16). This trains less than 1% of parameters, prevents catastrophic forgetting of general reasoning, and enables mixing a small fraction of general pretraining replay data with the medical dataset.',
      interviewerFollowUpHint: 'Highlight the rank parameter r in LoRA and how rank matrix multiplication works.',
      interviewerInBetweenComments: [
        'LoRA is definitely the industry standard approach here.',
        'How would you choose the rank r and alpha hyperparameter for domain adaptation?',
      ],
    },
  ],

  llm_genai_dev: [
    {
      id: 'genai_beg_1',
      role: 'llm_genai_dev',
      topic: 'Tokens & Embeddings Basics',
      difficulty: 'Beginner',
      question: 'What is a "Token" and what is a "Vector Embedding" in generative AI? How does a model convert words into numbers it can understand?',
      questionUrdu: 'Token aur Vector Embedding kya hote hain? Model alfaz ko numbers me kaise convert karta hai?',
      keyConcepts: ['Tokens are sub-word units (~0.75 words / 4 characters)', 'Tokenization using BPE or WordPiece', 'Embeddings map tokens to high-dimensional geometric vectors', 'Semantic proximity in vector space (e.g. cosine distance)'],
      sampleAnswer: 'A token is the fundamental atomic unit of text processed by an LLM, typically corresponding to roughly 3-4 characters or 0.75 words. Text is first broken into token IDs via a tokenizer (e.g., Byte-Pair Encoding). Then, each token ID is converted into a vector embedding — a list of hundreds or thousands of floating-point numbers placing the concept into a high-dimensional semantic space where words with related meanings (like "doctor" and "hospital") sit geometrically close together.',
      interviewerFollowUpHint: 'Give a quick example of why sub-word tokenization handles rare or misspelled words.',
      interviewerInBetweenComments: [
        'Clear and crisp definition of sub-word tokens.',
        'Great explanation of geometric distance in embedding space.',
      ],
    },
    {
      id: 'genai_2',
      role: 'llm_genai_dev',
      topic: 'Prompt Engineering & Sampling Parameters',
      difficulty: 'Intermediate',
      question: 'Explain how Temperature, Top-K, and Top-P (nucleus sampling) parameters control LLM creativity, predictability, and probability distribution sampling.',
      questionUrdu: 'Temperature, Top-K aur Top-P parameters LLM ki creativity aur output ko kaise badalte hain?',
      keyConcepts: ['Softmax probability distribution modification', 'Temperature scaling logits: z_i / T', 'Top-K restricts to top K fixed candidates', 'Top-P dynamic cumulative probability threshold', 'Zero temperature for deterministic greedy search'],
      sampleAnswer: 'Before token selection, logits are converted into probabilities via Softmax(z / T). Temperature T scales logits: T < 1 sharpens the distribution making high-probability tokens dominate (deterministic, ideal for code/math), while T > 1 flattens the distribution making rare tokens more likely (creative writing). Top-K limits sampling strictly to the K most probable tokens. Top-P (nucleus sampling) dynamically selects the smallest set of tokens whose cumulative probability exceeds threshold P (e.g. 0.9), expanding candidates when uncertain and narrowing when confident.',
      interviewerFollowUpHint: 'Why is Top-P generally preferred over fixed Top-K when vocabulary probability distributions change dynamically?',
      interviewerInBetweenComments: [
        'Clear distinction between logit division and candidate filtering.',
        'Good explanation of dynamic cumulative probability in Top-P.',
      ],
    },
    {
      id: 'genai_4',
      role: 'llm_genai_dev',
      topic: 'Context Windows & Long-Context LLMs',
      difficulty: 'Intermediate',
      question: 'Modern LLMs support 1M+ token context windows. Does massive context eliminate the need for RAG? Why or why not?',
      questionUrdu: 'Agar model 1 Million tokens padh sakta hai, toh kya RAG ki zaroorat khatam ho gayi?',
      keyConcepts: ['Cost per query ($/token scaling)', 'Latency and Time To First Token (TTFT)', 'Needle in a haystack retrieval accuracy', 'Dynamic data freshness / live databases', 'Hybrid approach: RAG for filtering + long context for synthesis'],
      sampleAnswer: 'No, long context does not eliminate RAG for three main reasons: 1. Cost & Latency: Processing 1M tokens on every single query is prohibitively slow and expensive compared to querying a 500-token vector snippet. 2. Data Freshness: RAG connects directly to live enterprise databases without needing model updates. 3. Attention Degradation: Even with 1M tokens, models can suffer from "lost in the middle" attention degradation on complex multi-hop queries. The modern best practice is a hybrid: use RAG to retrieve top 20-50 rich documents (50k tokens), then feed that focused window into a long-context LLM for deep synthesis.',
      interviewerFollowUpHint: 'Highlight the compute cost of attention scaling with context length.',
      interviewerInBetweenComments: [
        'Cost and latency are exactly why RAG remains essential.',
        'Great synthesis on the hybrid approach.',
      ],
    },
    {
      id: 'genai_1',
      role: 'llm_genai_dev',
      topic: 'Enterprise RAG Architecture & Reranking',
      difficulty: 'Advanced',
      question: 'Design an enterprise RAG pipeline that minimizes hallucinations and handles 100,000 PDF technical manuals. How do you chunk, index, retrieve, and rerank?',
      questionUrdu: 'Enterprise RAG pipeline design karein jo hallucinations kam kare aur 100k PDFs ko search kare.',
      keyConcepts: ['Hierarchical / semantic chunking with overlap', 'Vector database with HNSW index', 'Hybrid search (BM25 lexical + dense vector embeddings)', 'Cross-Encoder reranking', 'Citation grounding and system prompts'],
      sampleAnswer: '1. Ingestion: Extract text and tables using OCR/layout parsers; apply semantic chunking (e.g. 512 tokens with 50-token overlap). 2. Embedding: Generate dense vector embeddings with metadata tags and store in a vector database with HNSW indexing. 3. Retrieval: Use Hybrid Search combining dense semantic embeddings (cosine similarity) and sparse lexical search (BM25) via Reciprocal Rank Fusion. 4. Reranking: Pass top 25 candidates through a Cross-Encoder reranker to pick top 5 most relevant passages. 5. Generation: Ground the LLM with strict system prompt instructing it to cite source document IDs and decline answering if facts are absent.',
      interviewerFollowUpHint: 'Explain why hybrid search beats pure vector search for part numbers, IDs, and exact acronyms.',
      interviewerInBetweenComments: [
        'I like the inclusion of Hybrid Search — crucial for exact product codes.',
        'Good point on the Cross-Encoder reranker step.',
      ],
    },
    {
      id: 'genai_3',
      role: 'llm_genai_dev',
      topic: 'LLM Security & Dual-Agent Defense',
      difficulty: 'Advanced',
      question: 'What is Direct vs Indirect Prompt Injection in AI applications, and how would you build a multi-layered defense to safeguard an autonomous AI agent?',
      questionUrdu: 'Prompt Injection attacks kya hote hain aur AI agents ko inse kaise mehfuz rakhein?',
      keyConcepts: ['Direct injection (user prompt jailbreak)', 'Indirect injection (malicious data in web/PDF)', 'Input sanitization / guardrail models', 'Privilege separation & dual LLM architecture', 'Human-in-the-loop for irreversible tools'],
      sampleAnswer: 'Direct prompt injection occurs when an end-user inputs text crafted to override system instructions. Indirect injection happens when the AI ingests third-party untrusted data (a webpage, resume, or email) containing hidden instructions. Defense strategy: 1. Dual-LLM architecture where a privileged planner never directly executes untrusted raw text. 2. Input/output guardrail classifiers. 3. Structural delimiters (e.g. XML tags <user_context>). 4. Least privilege API tokens and mandatory human-in-the-loop confirmation for high-stakes actions like sending emails or updating databases.',
      interviewerFollowUpHint: 'Explain how XML tags prevent the model from confusing instructions with retrieved content.',
      interviewerInBetweenComments: [
        'Crucial point on indirect prompt injection via retrieved web data.',
        'Love the emphasis on least-privilege tool execution.',
      ],
    },
  ],

  data_scientist: [
    {
      id: 'ds_beg_1',
      role: 'data_scientist',
      topic: 'Precision vs Recall',
      difficulty: 'Beginner',
      question: 'Explain the tradeoff between Precision and Recall using a real-world medical diagnosis or spam filtering scenario.',
      questionUrdu: 'Precision aur Recall me kya farq hai? Medical diagnosis ya spam filter ki misal se samjhayein.',
      keyConcepts: ['Precision = True Positives / (True Positives + False Positives)', 'Recall = True Positives / (True Positives + False Negatives)', 'Medical cancer test prioritizes Recall (catch all cases)', 'Spam filter prioritizes Precision (do not mark important email as spam)'],
      sampleAnswer: 'Precision measures "out of all items predicted positive, how many were actually positive?", while Recall measures "out of all actual positive cases in reality, how many did the model find?". In a fatal disease screening test, high Recall is essential because a False Negative (missing a sick patient) is life-threatening. In contrast, for an email spam filter, high Precision is preferred because a False Positive (moving a critical job offer to spam) is far worse than occasionally seeing a spam email.',
      interviewerFollowUpHint: 'How does the F1 score combine both into a harmonic mean?',
      interviewerInBetweenComments: [
        'Clear and memorable real-world examples.',
        'Spot on definitions of False Positives vs False Negatives.',
      ],
    },
    {
      id: 'ds_3',
      role: 'data_scientist',
      topic: 'Cross-Validation & Data Leakage',
      difficulty: 'Intermediate',
      question: 'What is Data Leakage in machine learning, give two subtle ways it happens in preprocessing, and how do you prevent it using pipelines?',
      questionUrdu: 'Data Leakage kya hoti hai aur isse bachne ke liye pipeline kaise banayein?',
      keyConcepts: ['Test set contamination', 'Fitting Scalers / Imputers on the entire dataset before splitting', 'Time-series random k-fold vs TimeSeriesSplit', 'Using Scikit-Learn Pipelines'],
      sampleAnswer: 'Data leakage occurs when information from outside the training dataset (such as test labels or future data) contaminates model training, creating overly optimistic validation scores that fail in production. Subtle causes: 1. Fitting standard scalers, mean imputers, or PCA on the entire dataset before doing train/test split. 2. Using standard random K-Fold on time-series data instead of chronological TimeSeriesSplit (looking into the future). Prevention: Enclose all transformations and models in strict pipelines (like sklearn.pipeline.Pipeline) that fit exclusively on training folds.',
      interviewerFollowUpHint: 'Explain how target encoding can cause subtle leakage if not computed strictly out-of-fold.',
      interviewerInBetweenComments: [
        'Scaling before splitting is a classic mistake — great to highlight that.',
        'Good emphasis on time-series chronological splitting.',
      ],
    },
    {
      id: 'ds_1',
      role: 'data_scientist',
      topic: 'Class Imbalance & Sampling Techniques',
      difficulty: 'Intermediate',
      question: 'You are training a fraud detection model where 99.8% of transactions are legitimate and 0.2% are fraudulent. Why is accuracy useless, and what metrics and sampling techniques would you employ?',
      questionUrdu: 'Fraud detection me 99.8% normal transactions hain. Accuracy kyun bekaar hai aur kaunse metrics use karein?',
      keyConcepts: ['Accuracy paradox', 'Precision vs Recall / F1-Score', 'Precision-Recall AUC (PR-AUC)', 'Cost-sensitive learning / class weights', 'SMOTE oversampling & Tomek links'],
      sampleAnswer: 'A naive model that predicts "legitimate" 100% of the time achieves 99.8% accuracy while catching 0% of fraud, making accuracy misleading. Instead, we should optimize for PR-AUC (Precision-Recall Area Under Curve) and Recall at a fixed Precision threshold. We can apply cost-sensitive learning by setting class weights inversely proportional to frequency in the loss function, and use SMOTE (Synthetic Minority Over-sampling) combined with focal loss to penalize easy negative samples and focus on hard fraud cases.',
      interviewerFollowUpHint: 'Differentiate between ROC-AUC vs PR-AUC in extreme imbalance situations.',
      interviewerInBetweenComments: [
        'Right on the accuracy paradox.',
        'Great mention of PR-AUC over ROC-AUC for heavy skew.',
      ],
    },
    {
      id: 'ds_2',
      role: 'data_scientist',
      topic: 'Optimizers: Momentum, RMSprop, Adam & AdamW',
      difficulty: 'Advanced',
      question: 'Compare SGD with Momentum, RMSprop, and Adam optimizer. How do moving averages of first and second gradients stabilize learning trajectories?',
      questionUrdu: 'SGD Momentum, RMSprop aur Adam optimizer me kya farq hai?',
      keyConcepts: ['First moment (momentum, velocity)', 'Second moment (uncentered variance, learning rate scaling)', 'Oscillation damping in ravines', 'Bias correction in early steps', 'Weight decay decoupling (AdamW)'],
      sampleAnswer: 'Standard SGD oscillates wildly in steep ravines. Momentum adds an exponential moving average of past gradients (first moment m_t), acting like a heavy ball rolling downhill that dampens perpendicular oscillations and accelerates in consistent directions. RMSprop maintains an exponential moving average of squared gradients (second moment v_t) to scale down step sizes for frequent large gradients. Adam combines both: it computes adaptive momentum (first moment) and adaptive learning rate scaling (second moment) with bias corrections for initial zero-starts, ensuring smooth convergence across sparse and dense features.',
      interviewerFollowUpHint: 'Explain why AdamW decouples weight decay from gradient updates.',
      interviewerInBetweenComments: [
        'The heavy ball physics analogy is spot on.',
        'Clear separation of the first and second moment roles.',
      ],
    },
  ],

  ai_foundations: [
    {
      id: 'found_1',
      role: 'ai_foundations',
      topic: 'AI vs Machine Learning vs Deep Learning',
      difficulty: 'Beginner',
      question: 'How would you explain the difference between Artificial Intelligence, Machine Learning, and Deep Learning to a non-technical stakeholder using a simple nesting doll metaphor?',
      questionUrdu: 'AI, Machine Learning aur Deep Learning ka aapas me kya talluq hai? Aasan misal se samjhayein.',
      keyConcepts: ['AI is the broad umbrella of intelligent machines', 'ML is learning rules from data instead of hardcoded if/else', 'Deep Learning uses multi-layered artificial neural networks', 'Nesting doll analogy'],
      sampleAnswer: 'Think of Russian Nesting Dolls: 1. The outermost largest doll is Artificial Intelligence (AI) — any machine programmed to mimic human intelligence, from chess heuristics to modern bots. 2. Inside AI is Machine Learning (ML) — systems that learn patterns directly from example data rather than following rigid hand-written rules. 3. Inside ML is Deep Learning (DL) — a specialized technique inspired by human brain neural networks with multiple stacked layers that can automatically extract complex features from raw images, audio, and text without manual feature engineering.',
      interviewerFollowUpHint: 'Give a concrete example like spam filter vs self-driving vision.',
      interviewerInBetweenComments: [
        'Clear, accessible analogy!',
        'Perfect hierarchy explanation.',
      ],
    },
    {
      id: 'found_2',
      role: 'ai_foundations',
      topic: 'Training vs Inference',
      difficulty: 'Beginner',
      question: 'What is the fundamental difference between the "Training" phase and the "Inference" phase in artificial intelligence?',
      questionUrdu: 'AI me "Training" aur "Inference" ke darmiyan kya buniyadi farq hai?',
      keyConcepts: ['Training is learning from massive data (expensive, high compute, updates weights)', 'Inference is applying trained weights to new questions (fast, forward pass only, fixed weights)', 'Analogy: studying for exam vs taking the exam'],
      sampleAnswer: 'Training is the intensive learning phase where a model analyzes millions of examples, computes errors, and updates its billions of mathematical weights using backpropagation on thousands of GPUs over weeks. Inference is the testing phase when a user sends a prompt to the already trained model — it performs a single forward pass calculation using fixed weights to generate an answer in milliseconds. Analogy: Training is spending years studying in medical school; Inference is a doctor diagnosing a patient in an appointment.',
      interviewerFollowUpHint: 'Think about why inference can run on consumer devices while training requires massive clusters.',
      interviewerInBetweenComments: [
        'The medical school analogy makes it immediately clear.',
        'Great distinction on weight updates vs forward pass.',
      ],
    },
    {
      id: 'found_3',
      role: 'ai_foundations',
      topic: 'Hallucinations & Grounding',
      difficulty: 'Intermediate',
      question: 'Why do Large Language Models hallucinate (generate confident false statements), and how does RAG (Retrieval-Augmented Generation) prevent this?',
      questionUrdu: 'LLMs ghalat baat itne yaqeen se kyun bolte hain (hallucinate), aur RAG isse kaise theek karta hai?',
      keyConcepts: ['LLMs are probabilistic next-token predictors, not encyclopedias', 'Lack of fact verification during raw generation', 'RAG provides open-book verified source context', 'Open book exam vs memory exam'],
      sampleAnswer: 'LLMs do not store factual knowledge like a traditional relational database; they are probabilistic next-token predictors trained to produce coherent, natural-sounding sentences. If a query requires specific niche facts the model is uncertain about, it predicts words that sound stylistically believable but are factually fabricated (hallucination). RAG fixes this by turning a "closed-book memory test" into an "open-book exam": it first retrieves verified passages from trusted documents and instructs the LLM to summarize only the provided text.',
      interviewerFollowUpHint: 'Mention why asking the model to cite specific document line numbers keeps it honest.',
      interviewerInBetweenComments: [
        'The open-book exam metaphor is brilliant and accurate.',
        'Exactly — next-token probability vs factual lookup.',
      ],
    },
    {
      id: 'found_adv_1',
      role: 'ai_foundations',
      topic: 'AI Alignment, RLHF & Constitutional AI',
      difficulty: 'Advanced',
      question: 'What is the AI Alignment Problem, and how do Reinforcement Learning from Human Feedback (RLHF) and Constitutional AI train models to remain helpful, honest, and harmless?',
      questionUrdu: 'AI Alignment kya hai aur RLHF ya Constitutional AI models ko safe kaise banate hain?',
      keyConcepts: ['Alignment tax / reward hacking', 'RLHF: Reward model trained on human preference rankings + PPO policy updates', 'Constitutional AI / RLAIF: Self-critique against a constitutional set of ethical principles', 'Balancing helpfulness vs harmlessness'],
      sampleAnswer: 'The AI Alignment problem addresses the challenge of ensuring autonomous AI systems reliably pursue human intended goals without unintended dangerous shortcuts (reward hacking). RLHF aligns models in 3 steps: 1. Supervised fine-tuning on high-quality demonstrations. 2. Training a Reward Model on pairs of model outputs ranked by human judges. 3. Fine-tuning the LLM policy using Proximal Policy Optimization (PPO) to maximize reward while penalizing KL-divergence from the base model. Constitutional AI (RLAIF) takes this further by having the model critique and revise its own responses against a set of written constitutional principles, reducing reliance on manual human annotators.',
      interviewerFollowUpHint: 'Explain how KL-divergence penalty prevents policy collapse during RLHF.',
      interviewerInBetweenComments: [
        'Excellent articulation of the 3 RLHF stages.',
        'Very perceptive mention of Constitutional AI and self-critique.',
      ],
    },
  ],
};

// Helper function to get questions filtered by role and difficulty
export function getFilteredInterviewQuestions(
  roleId: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string = 'Intermediate'
): InterviewQuestion[] {
  const rolePool = INTERVIEW_QUESTIONS_DATABASE[roleId] || INTERVIEW_QUESTIONS_DATABASE['ai_ml_engineer'];
  
  // Normalize difficulty string
  let targetDiff = difficulty;
  if (difficulty === 'Junior') targetDiff = 'Beginner';
  if (difficulty === 'Mid-Level') targetDiff = 'Intermediate';
  if (difficulty === 'Senior' || difficulty === 'Staff') targetDiff = 'Advanced';

  // Filter questions matching difficulty
  const exactMatches = rolePool.filter(q => {
    let qDiff = q.difficulty;
    if (qDiff === 'Junior') qDiff = 'Beginner';
    if (qDiff === 'Mid-Level') qDiff = 'Intermediate';
    if (qDiff === 'Senior' || qDiff === 'Staff') qDiff = 'Advanced';
    return qDiff === targetDiff;
  });

  if (exactMatches.length >= 2) {
    // Also include adjacent level questions if we want a full set of 3-5
    const others = rolePool.filter(q => !exactMatches.includes(q));
    return [...exactMatches, ...others].slice(0, 5);
  }

  return rolePool;
}
