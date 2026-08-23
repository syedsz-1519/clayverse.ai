export interface SectionNarrationItem {
  id: string;
  targetElementId: string;
  badgeEn: string;
  badgeHyd: string;
  titleEn: string;
  titleHyd: string;
  durationSeconds: number;
  sentencesEn: string[];
  sentencesHyd: string[];
  takeawayEn: string;
  takeawayHyd: string;
}

export const SECTION_NARRATION_ITEMS: SectionNarrationItem[] = [
  {
    id: 'hero',
    targetElementId: 'hero',
    badgeEn: 'Introduction • Guide Overview',
    badgeHyd: 'Aghaz • Guide ka Taaruf',
    titleEn: 'Welcome to Clayverse AI',
    titleHyd: 'Clayverse AI me Khush Amdeed',
    durationSeconds: 35,
    sentencesEn: [
      "Welcome to Clayverse AI, an interactive and sensory-friendly guide designed to demystify artificial intelligence from the ground up.",
      "Instead of confusing mathematical jargon, we explain every concept through tangible real-world analogies, tactile sandboxes, and bite-sized lessons.",
      "Explore the guide at your own pace, try the interactive playgrounds, test your knowledge in the quizzes, and listen to any section aloud with this audio narrator."
    ],
    sentencesHyd: [
      "Arey salaam yaaron! Clayverse AI me aapka khush amdeed hai.",
      "Hum yahan AI ko mushkil formulas ke bajaye asan misalon, mazedar sandboxes aur interactive dhang se samjhate hain.",
      "Aap aaram se har hisse ko padhein, interactive widgets chalayein, aur kisi bhi sabaq ko aawaz me sunne ke liye speaker dabayein."
    ],
    takeawayEn: 'AI is simply pattern recognition at scale—approachable, interactive, and built for everyone.',
    takeawayHyd: 'AI data me patterns dhoondne ka computerized nizaam hai jo har kisi ke samajhne ke qabil hai.'
  },
  {
    id: 'what-is-ai',
    targetElementId: 'what-is-ai',
    badgeEn: 'Lesson 01 • Foundations',
    badgeHyd: 'Sabaq 01 • Buniyaad',
    titleEn: 'What is Artificial Intelligence?',
    titleHyd: 'Artificial Intelligence Kya Hai?',
    durationSeconds: 48,
    sentencesEn: [
      "Artificial Intelligence refers to computer systems engineered to perform tasks that traditionally require human intelligence.",
      "In traditional computer programming, software engineers must write explicit, step-by-step rules for every single situation.",
      "With Machine Learning, rather than hand-coding every rule, we feed the system thousands of examples so it calculates its own patterns.",
      "Today, AI powers daily essentials such as email spam filtering, facial recognition unlock on smartphones, real-time map traffic routing, and auto-complete suggestions.",
      "Remember: today's systems are Narrow AI, masterfully specialized in one domain, rather than self-aware general human minds."
    ],
    sentencesHyd: [
      "Artificial Intelligence ka seedha matlab aisi computer machines banana hai jo insano ki tarah sochein aur faislay karein.",
      "Puraani programming me software developer ko har choti baat ka rule khud ek ek line me likhna padta tha.",
      "Lekin Machine Learning me hum computer ko hazaaron misalein dete hain, aur wo unme se patterns khud seekh leta hai.",
      "Aaj rozmarra ki zindagi me AI spam emails rokne, mobile face unlock, Google Maps ke raste aur typing suggestions me istemal ho rahi hai.",
      "Ye sab Narrow AI hain jo sirf apna makhsoos kaam karti hain, koi azaad dimaag nahi."
    ],
    takeawayEn: 'Traditional coding writes manual rules; Machine Learning automatically extracts rules from examples.',
    takeawayHyd: 'Puraani coding me rules likhe jaate the; AI data dekh kar rules khud seekhti hai.'
  },
  {
    id: 'family-tree',
    targetElementId: 'family-tree',
    badgeEn: 'Lesson 02 • Hierarchy & Scope',
    badgeHyd: 'Sabaq 02 • AI ka Shijra-e-Nasab',
    titleEn: 'The AI Family Tree & Learning Models',
    titleHyd: 'AI ka Khandaan aur Seekhne ke Qismein',
    durationSeconds: 52,
    sentencesEn: [
      "To understand the hierarchy of AI, picture a set of nested Russian dolls.",
      "The outermost, broadest doll is Artificial Intelligence, the entire academic discipline of smart machines.",
      "Nesting inside AI is Machine Learning, which uses statistical algorithms to discover patterns directly from datasets.",
      "Nesting further inside Machine Learning is Deep Learning, which stacks multi-layered artificial neural networks inspired by the human cortex.",
      "Finally, at the very heart of the family lies Generative AI, creating brand new text, code, audio, and visual media.",
      "Machine Learning learns primarily through Supervised Learning with labeled answer keys, Unsupervised Learning for cluster discovery, and Reinforcement Learning through trial, rewards, and penalties."
    ],
    sentencesHyd: [
      "AI ke pure khandan ko samajhne ke liye dabba-in-dabba Russian dolls ka tasawwur karein.",
      "Sabse bada bahar ka dabba Artificial Intelligence hai.",
      "Uske andar Machine Learning baithti hai jo statistical tareeqon se data seekhti hai.",
      "Machine Learning ke andar Deep Learning hai, jo insani dimaag ke cells ki tarah multi-layered neural networks chalata hai.",
      "Aur bilkul markaz me Generative AI hai, jo naya content, likhayi aur tasveerein banata hai.",
      "Machine Learning teen tareeqon se seekhti hai: Supervised answer key ke sath, Unsupervised patterns khojne ke liye, aur Reinforcement Learning inam aur saza ke sath."
    ],
    takeawayEn: 'AI is the discipline; ML is the pattern engine; Deep Learning uses deep layers; GenAI synthesizes new content.',
    takeawayHyd: 'AI sabse bada daera hai, ML pattern engine hai, DL neural layers hai, aur GenAI naya content banati hai.'
  },
  {
    id: 'generative-ai',
    targetElementId: 'generative-ai',
    badgeEn: 'Lesson 03 • LLMs & Synthesis',
    badgeHyd: 'Sabaq 03 • Generative AI & LLMs',
    titleEn: 'Generative AI & Large Language Models',
    titleHyd: 'Generative AI aur Large Language Models',
    durationSeconds: 50,
    sentencesEn: [
      "While discriminative AI analyzes and classifies existing data, Generative AI creates entirely novel content.",
      "Large Language Models, or LLMs, are trained on billions of sentences to master human language syntax and semantic knowledge.",
      "At their mathematical foundation, LLMs operate via next-token prediction, calculating the highest-probability next word fragment based on the preceding context.",
      "The breakthrough Transformer architecture uses a mechanism called Self-Attention, enabling the model to weigh relationships between all words across a prompt simultaneously.",
      "Modern frontier models are multimodal, capable of seamlessly reading text, analyzing photos, generating code, and processing spoken audio in a single unified system."
    ],
    sentencesHyd: [
      "Puraani AI sirf data ko check ya classify karti thi, jabke Generative AI naya content banati hai.",
      "Large Language Models arabon sentences padh kar insani zaban aur logic seekhte hain.",
      "Inka asal formula Next-Token Prediction hai, yaani agla sabse behtareen aur munasib lafz mathematically guess karna.",
      "Transformer architecture me Self-Attention mechanism hota hai, jo pure sentence ko ek sath dekh kar context samajhta hai.",
      "Aaj ke modern models multimodal hain, jo ek sath text, photos, code aur aawaz par kaam kar sakte hain."
    ],
    takeawayEn: 'Generative models predict the most coherent continuation of human patterns using self-attention transformers.',
    takeawayHyd: 'Generative AI transformers ke zariye agla behtareen lafz predict karke naya content banati hai.'
  },
  {
    id: 'prompting-rag',
    targetElementId: 'prompting-rag',
    badgeEn: 'Lesson 04 • Prompting & Knowledge Grounding',
    badgeHyd: 'Sabaq 04 • Prompting aur RAG Nizaam',
    titleEn: 'Prompt Engineering, RAG & Autonomous Agents',
    titleHyd: 'Prompting, RAG aur Autonomous AI Agents',
    durationSeconds: 54,
    sentencesEn: [
      "Prompt engineering is the craft of structuring natural language instructions to guide an AI toward precise, high-quality answers.",
      "Best practices include assigning a specific expert role, clearly defining output formatting constraints, and providing few-shot example demonstrations.",
      "To prevent models from hallucinating or sharing outdated facts, we use RAG, which stands for Retrieval-Augmented Generation.",
      "RAG converts private documents into vector embeddings, performs semantic similarity searches, and passes verified facts into the prompt as trusted context.",
      "Beyond answering questions, AI Agents combine reasoning loops with external tools and APIs to break down complex goals, browse the live web, write files, and autonomously verify their own work."
    ],
    sentencesHyd: [
      "Prompt Engineering ka matlab AI ko wazeh aur behtareen hidayat dena hai taaki wo zabardast jawab de.",
      "Acha prompt likhne ke liye model ko role dein, rules batayein, aur 1-2 achi misalein provide karein.",
      "Model ko ghalat batein ya hallucinations bolne se rokne ke liye hum RAG yaani Retrieval-Augmented Generation use karte hain.",
      "RAG aapki files aur database se taaza sachhi maloomat dhoond kar model ko deta hai.",
      "Is se aage barh kar AI Agents aate hain, jo khud planning karke tools, APIs aur web search chala kar mushkil kaam mukammal karte hain."
    ],
    takeawayEn: 'Clear prompts direct the model; RAG grounds it with verified facts; Agents give it hands to execute actions.',
    takeawayHyd: 'Prompt rasta dikhata hai, RAG sachhi maloomat jodta hai, aur Agents hath ban kar kaam karte hain.'
  },
  {
    id: 'ai-tools-directory',
    targetElementId: 'ai-tools-directory',
    badgeEn: 'Lesson 05 • Ecosystem Directory',
    badgeHyd: 'Sabaq 05 • AI Tools Fehrist',
    titleEn: 'Curated AI Tools Directory & Practical Workflow',
    titleHyd: 'AI Tools Directory aur Rozmarra Istemal',
    durationSeconds: 40,
    sentencesEn: [
      "The modern AI ecosystem offers specialized tools across text, visual art, cinematic video, audio synthesis, and software engineering.",
      "For text reasoning and deep analysis, platforms like ChatGPT, Claude, and Google Gemini lead the frontier.",
      "For visual creation, Midjourney and Flux generate photorealistic imagery, while Runway and Kling lead in video generation.",
      "For developers, intelligent coding assistants like Cursor and GitHub Copilot accelerate refactoring, debugging, and testing.",
      "Always select tools based on specific modalities and respect data privacy boundaries."
    ],
    sentencesHyd: [
      "Aaj har kaam ke liye makhsoos AI tools maujood hain, chahe likhayi ho, tasveerein hon ya coding.",
      "Text aur deep research ke liye ChatGPT, Claude aur Google Gemini sabse aage hain.",
      "Tasveeron aur artwork ke liye Midjourney aur Flux, aur video ke liye Runway behtareen hain.",
      "Coders ke liye Cursor aur GitHub Copilot coding ki speed 3 guna badha dete hain.",
      "Apne kaam ke hisab se munasib tool chunein aur privacy ka khayal rakhein."
    ],
    takeawayEn: 'Match specialized models to each modality and maintain rigorous data privacy awareness.',
    takeawayHyd: 'Har kaam ke liye makhsoos tool use karein aur secret data share karne se pehle sochein.'
  },
  {
    id: 'deeper',
    targetElementId: 'deeper',
    badgeEn: 'Lesson 06 • Technical Deep Dive',
    badgeHyd: 'Sabaq 06 • 12 Buniyaadi Sabaq',
    titleEn: '12 Core Technical Principles Roadmap',
    titleHyd: '12 Buniyaadi Technical Sabaq',
    durationSeconds: 50,
    sentencesEn: [
      "This section details the 12 progressive pillars that form the complete engineering foundation of modern AI.",
      "From tokenization and vector embeddings that plot semantic meanings in geometric space, to neural weights and activation functions.",
      "You will explore the distinction between full model fine-tuning and retrieval grounding, along with the significance of context windows and temperature parameters.",
      "Finally, we study Reinforcement Learning from Human Feedback and AI Safety guardrails, ensuring AI remains aligned, truthful, and helpful."
    ],
    sentencesHyd: [
      "Ye hissa 12 aise buniyaadi sabaq sikhata hai jo poori AI engineering ki neev hain.",
      "Vector embeddings se lekar neural networks ke weights aur activation functions tak.",
      "Fine-tuning aur RAG ka farq, context window ki gunjaish aur temperature ka asar samjhaya gaya hai.",
      "Aur aakhri me RLHF aur AI Safety rules jo models ko safe aur insano ke liye faidamand banate hain."
    ],
    takeawayEn: 'Mastering these 12 technical pillars demystifies artificial intelligence into predictable computer science.',
    takeawayHyd: 'Ye 12 sabaq samajhne ke baad AI koi jaadu nahi balki ek asan scientific technology lagti hai.'
  },
  {
    id: 'flashcards',
    targetElementId: 'flashcards',
    badgeEn: 'Lesson 07 • Active Recall',
    badgeHyd: 'Sabaq 07 • Flashcards Deck',
    titleEn: 'Interactive Flashcard Terminology Recall',
    titleHyd: 'Interactive Flashcard Deck',
    durationSeconds: 32,
    sentencesEn: [
      "Reinforce your long-term memory with our interactive 3D flashcard study deck.",
      "Flip each card to review concise definitions, mental analogies, and direct guide references.",
      "Use active recall mode to test your understanding, mark cards as mastered, and track your retention progress over time."
    ],
    sentencesHyd: [
      "Apni yaad-dasht ko pakka karne ke liye hamara 3D interactive flashcards deck use karein.",
      "Card ko flip karke aasan tareef, asan misal aur roadmap links dekhein.",
      "Cards ko 'Mastered' mark karein aur apni progress bar ko 100 percent tak le jayein."
    ],
    takeawayEn: 'Active recall and spaced repetition dramatically boost technical terminology retention.',
    takeawayHyd: 'Flashcards se technical alfaz yaad rakhna bohot aasan ho jata hai.'
  },
  {
    id: 'classroom-hub',
    targetElementId: 'classroom-hub',
    badgeEn: 'Lesson 08 • Google Classroom',
    badgeHyd: 'Sabaq 08 • Classroom Hub',
    titleEn: 'Classroom Hub & Learning Milestones',
    titleHyd: 'Classroom Hub aur Sanad',
    durationSeconds: 30,
    sentencesEn: [
      "Sync your Clayverse AI progress with Google Classroom to share assignment completions and study notes directly with your teachers.",
      "Export your customized milestone certificates, track completed glossary units, and collaborate with your study group."
    ],
    sentencesHyd: [
      "Apni Clayverse AI ki progress ko Google Classroom ke sath sync karein taaki teachers aapke milestones dekh sakein.",
      "Apni completion certificate export karein aur doston ke sath mil kar seekhein."
    ],
    takeawayEn: 'Bridge self-directed interactive exploration with structured classroom curricula and verification.',
    takeawayHyd: 'Apne seekhne ki progress ko teachers aur class ke sath asani se share karein.'
  },
  {
    id: 'ai-arena',
    targetElementId: 'ai-arena',
    badgeEn: 'Lesson 09 • Arena Battleground',
    badgeHyd: 'Sabaq 09 • AI Arena & Quiz',
    titleEn: 'AI Arena & Knowledge Quiz Battleground',
    titleHyd: 'AI Arena aur Imtehaan',
    durationSeconds: 35,
    sentencesEn: [
      "Put your knowledge to the ultimate test in the AI Arena!",
      "Compete in timed multi-level trivia quizzes, unlock badges on the global leaderboard, and experiment in the live Side-by-Side Model Comparison Arena to observe real-time thinking tokens."
    ],
    sentencesHyd: [
      "Apne seekhe hue sabaq ka imtehaan AI Arena me lein!",
      "Timed quizzes khelein, badges unlock karein, aur models ka aapas me live comparison karke unki sochne ki speed dekhein."
    ],
    takeawayEn: 'Gamified testing and side-by-side model experiments cement practical understanding.',
    takeawayHyd: 'Quizzes aur live model comparisons se aapka concept hamesha ke liye clear ho jata hai.'
  }
];

export function getNarrationForSection(sectionId: string): SectionNarrationItem {
  const found = SECTION_NARRATION_ITEMS.find(s => s.id === sectionId || s.targetElementId === sectionId);
  return found || SECTION_NARRATION_ITEMS[0];
}
