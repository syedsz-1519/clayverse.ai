import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language =
  | 'en'
  | 'hinglish'
  | 'thanglish'
  | 'roman_ur'
  | 'hyd'
  | 'hi'
  | 'bn'
  | 'te'
  | 'mr'
  | 'ta'
  | 'ur'
  | 'gu'
  | 'kn'
  | 'or'
  | 'ml'
  | 'pa'
  | 'as'
  | 'mai'
  | 'sa'
  | 'ks'
  | 'sd'
  | 'kok'
  | 'doi'
  | 'sat'
  | 'mni'
  | 'brx'
  | 'ne'
  | 'tcy'
  | string;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Rich, authentic translation dictionary for all major Indian languages and scripts
const dictionary: Record<string, Record<string, string>> = {
  en: {
    // Nav & General
    'nav.intro': 'What is AI',
    'nav.family': 'Family Tree',
    'nav.how': 'How It\'s Used',
    'nav.toolbox': 'AI Toolbox',
    'nav.deeper': 'Want to Go Deeper?',
    'nav.close': 'Deeper',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, Explained Simply',
    'brand.desc': 'An interactive, beginner-safe editorial journal dedicated to demystifying modern artificial intelligence, machine learning structures, and generative algorithms through clean visual logic.',
    'brand.constructed': '© 2026 Clayverse AI. By Syed Shahnawaz.',

    // Hero Section
    'hero.badge': '✨ 100% Beginner-Safe • Zero Math & Zero Jargon',
    'hero.title': 'AI is not magic. It’s pattern-matching at massive scale.',
    'hero.subtitle': 'Understand how modern artificial intelligence, ChatGPT, and machine learning actually work — without feeling overwhelmed. A calm, tactile journey designed for curious minds.',
    'hero.tagline': 'From simple daily patterns to generative neural networks — demystified step by step.',
    'hero.canvas.instruction': 'Hover nodes to reveal how AI finds hidden connections',
    'hero.canvas.engine': 'Tactile Pattern Engine v1.2',
    'hero.button': 'Begin the Interactive Journey',

    // What Is AI Section
    'whatis.badge': 'Lesson 01',
    'whatis.title': 'So, What actually is AI?',
    'whatis.text': 'Artificial Intelligence — the capability of computer systems to perform tasks that historically required human thinking or reasoning — is not an independent thinking creature. Instead, it is a tool that detects recurring structures in huge sets of data.',
    'whatis.analogy.title': 'A Simple Analogy',
    'whatis.analogy.text': '"It’s just like teaching a child what a \'dog\' is. You don\'t hand them a legal brief explaining animal biology. You show them thousands of dogs in real life until their brain naturally links the floppy ears, tails, and sizes together."',
    'whatis.timeline.show': 'Explore AI Timeline',
    'whatis.timeline.hide': 'Hide AI Timeline',
    'whatis.pocket.title': 'AI in Your Pocket',
    'whatis.pocket.subtitle': 'You interact with automated pattern matching multiple times every day. Click to inspect standard use cases.',
    'whatis.pattern.title': 'The Pattern Matcher',
    'whatis.pattern.text': 'Data goes in, patterns are discovered, decisions come out.',

    // Clay Explainer Section
    'clay.badge': 'Featured Storyboard',
    'clay.title': 'Meet Clay: Your AI Explainer Host',
    'clay.subtitle': 'Based on our custom stop-motion turnaround reference, interact with Clay to hear and see his visual explanations.',
    'clay.interactive': 'This interactive showcase implements the tactile animation script designed for stop-motion video generation.',
    'clay.voice.active': 'Playing Voice...',
    'clay.voice.speak': 'Hear Clay Speak',
    'clay.sfx.muted': 'Mute Sound Effect',
    'clay.sfx.enabled': 'Sound Effects Enabled',
    'clay.shot.1.title': 'Shot 1: Meet Clay',
    'clay.shot.1.caption': 'AI means machines that learn from patterns — not magic.',
    'clay.shot.1.bubble': 'Hello there! I\'m Clay, your friendly guide. Tap the steps below to see how I explain AI!',
    'clay.shot.2.title': 'Shot 2: What is AI?',
    'clay.shot.2.caption': 'Instead of rigid hand-written rules, AI looks at examples to learn.',
    'clay.shot.2.bubble': 'Think of me as a little kid. If you show me thousands of leaf pictures, my brain figures out the pattern by itself!',
    'clay.shot.3.title': 'Shot 3: Everyday Use',
    'clay.shot.3.caption': 'Recommendations, voice assistants, and digital maps.',
    'clay.shot.3.bubble': 'You already use pattern-matching daily when Netflix recommends a movie, or Google Maps routes your car!',
    'clay.shot.4.title': 'Shot 4: Family Tree',
    'clay.shot.4.caption': 'AI is the broad umbrella. ML and Deep Learning sit nested inside.',
    'clay.shot.4.bubble': 'We are all nested together. Machine Learning lives inside AI, and Generative AI sits at the very heart of the tree!',

    // Family Tree Section
    'family.badge': 'Lesson 02',
    'family.title': 'The AI Family Tree',
    'family.subtitle': 'Artificial Intelligence isn\'t just one single technology. It\'s a nested hierarchy of concepts. Hover over the rings or click the cards below to see how they fit inside each other.',
    'family.depth.label': 'KNOW THE DEPTH',
    'family.interactive.hint': 'Click a card to highlight its position in the nested system.',
    
    // Generative AI Section
    'genai.badge': 'The Heart of the Tree',
    'genai.title': 'What makes Generative AI special?',
    'genai.subtitle': 'Traditional AI excels at analyzing, predicting, or sorting pre-existing data (e.g., identifying spam emails). Generative AI goes a step further: it creates brand-new, original content.',
    'genai.llm.badge': 'Large Language Model',
    'genai.llm.definition': 'A specific type of Generative AI model trained on massive oceans of written books, articles, and websites to predict the most logical next word in a sentence.',
    'genai.llm.explanation': 'It doesn\'t "know" facts like a human. It calculates probabilities. When you write a prompt, it answers by continuously asking itself: "Based on everything humanity has ever written, what is the most likely next word?"',
    'genai.chatbots.title': 'Chatbots vs. Models',
    'genai.chatbots.text': 'The underlying model (like Gemini) is the massive core calculation engine. The Chatbot (like Gemini Advanced) is just the chat window interface around it.',
    'genai.interactive.title': 'Dynamic Token Predicter',
    'genai.interactive.desc': 'Interactive Sandbox: See how an LLM predicts the next word word-by-word based on probability weights.',
    'genai.interactive.prompt': 'Click a prompt to begin:',
    'genai.interactive.weights': 'Calculated next token weights:',
    'genai.interactive.sentence': 'Sentence build:',

    // Prompting & RAG Section
    'prompt.badge': 'Lesson 03',
    'prompt.title': 'How to talk to AI: Prompting & RAG',
    'prompt.subtitle': 'You don\'t need to learn a programming language to use AI. You talk to it using prompts. But how do we ensure the answers are factual and specific?',
    'prompt.methods.title': 'Core Prompting Paradigms',
    'prompt.methods.desc': 'How we guide the AI engine to get precise outcomes.',
    'prompt.rag.title': 'Retrieval-Augmented Generation (RAG)',
    'prompt.rag.subtitle': 'The Factual Guardrail',
    'prompt.rag.desc': 'When you ask an AI a highly specific question, it might guess or hallucinate if it wasn\'t in its original training data. RAG solves this by looking up the correct documents first, then handing them to the AI to write the final summary.',
    'prompt.rag.step1': 'User Question',
    'prompt.rag.step2': 'Context Search',
    'prompt.rag.step3': 'Context Bound Prompt',
    'prompt.rag.step4': 'Accurate Summary',
    'prompt.interactive.title': 'RAG Simulator',
    'prompt.interactive.desc': 'Ask a question to see how RAG fetches live context to generate a factual answer, preventing AI hallucinations.',
    'prompt.interactive.ask': 'Pick a question to simulate:',
    'prompt.interactive.step1.lbl': '1. Raw Prompt',
    'prompt.interactive.step2.lbl': '2. Search DB',
    'prompt.interactive.step3.lbl': '3. RAG Context',
    'prompt.interactive.step4.lbl': '4. Safe Answer',

    // AI Toolbox Section
    'tools.badge': 'Curated Directory',
    'tools.title': 'The Free AI Toolbox',
    'tools.subtitle': 'A hand-picked collection of 40+ highly capable, genuinely free, or free-tier (freemium) AI systems. Cut through the noise and start experimenting immediately without opening your wallet.',
    'tools.search': 'Search tools, use cases, or tags...',
    'tools.bestfor': 'Best For',
    'tools.copy': 'Copy',
    'tools.copied': 'Copied',
    'tools.empty': 'No AI Tools found',
    'tools.empty.desc': 'Try resetting your filters or typing another query.',

    // Want to Go Deeper Section
    'deeper.badge': 'Lesson 04',
    'deeper.title': 'Want to Go Deeper?',
    'deeper.subtitle': 'Now that you have mastered the core concepts, let\'s explore the dynamic glossary, advanced topics, and future horizons of machine intelligence.',
    'deeper.glossary.title': 'Dynamic Glossary',
    'deeper.glossary.desc': 'Tap any highlighted term in the guide or browse the comprehensive index below for direct, friendly explanations.',
    'deeper.faq.title': 'Frequently Asked Questions',
    'deeper.roadmap.title': 'Advanced Horizons Roadmap',
    'deeper.roadmap.desc': 'From basic machine learning structures to autonomous digital agents. Tap a milestone to learn how the frontier works.',
    'deeper.roadmap.interactive': 'Click an horizon card to explore how modern digital agents think.',
    'deeper.close': 'Close Details'
  },

  // 2. HINGLISH (Hindi in Roman Latin script)
  hinglish: {
    'nav.intro': 'AI Kya Hai',
    'nav.family': 'Family Tree',
    'nav.how': 'Kaise Use Karein',
    'nav.toolbox': 'AI Toolbox',
    'nav.deeper': 'Aur Deep Jaana Hai?',
    'nav.close': 'Details Band Karein',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, Ekdam Aasan Bhasha Mein',
    'brand.desc': 'AI, Machine Learning aur Generative AI ko bina kisi complex math ke aasan visual logic ke sath samjhein.',
    'brand.constructed': '© 2026 Clayverse AI. By Syed Shahnawaz.',
    'hero.badge': '✨ 100% Beginners Ke Liye • Zero Math & Zero Jargon',
    'hero.title': 'AI koi jaadu nahi hai. Ye bade scale par pattern matching hai.',
    'hero.subtitle': 'Bina kisi tension ke samjho ChatGPT, AI aur Machine Learning asal mein kaise kaam karte hain.',
    'hero.tagline': 'Daily patterns se leke neural networks tak — sab kuch step by step aasan.',
    'hero.canvas.instruction': 'Nodes pe mouse le jaakar dekhein AI patterns kaise connect karta hai',
    'hero.canvas.engine': 'Tactile Pattern Engine v1.2',
    'hero.button': 'Interactive Safar Shuru Karein',
    'whatis.badge': 'Lesson 01',
    'whatis.title': 'Toh, Asal Mein AI Hai Kya?',
    'whatis.text': 'Artificial Intelligence matlab computers ko aisi samajh dena jisse wo insanon ki tarah patterns pehchan sakein. Ye koi alag se sochne wala jeev nahi hai, balki data mein patterns khojne wala smart tool hai.',
    'whatis.analogy.title': 'Ek Simple Example',
    'whatis.analogy.text': '"Jaise ek chhote bachhe ko doggy pehchanna sikhate hain — hazaron photos dekh kar bachhe ka dimag khud pattern samajh jata hai."',
    'whatis.timeline.show': 'AI Timeline Dekhein',
    'whatis.timeline.hide': 'Timeline Chhupayein',
    'whatis.pocket.title': 'Aapke Pocket Mein AI',
    'whatis.pocket.subtitle': 'Aap daily life mein multiple times pattern matching use karte hain.',
    'whatis.pattern.title': 'Pattern Khojne Wala',
    'whatis.pattern.text': 'Data andar jata hai, pattern banta hai, aur decision bahar aata hai.',
    'clay.badge': 'Featured Story',
    'clay.title': 'Clay se miliye: Aapka AI Explainer Dost',
    'clay.subtitle': 'Clay se interact karein aur visual animations ke sath AI samjhein.',
    'clay.voice.active': 'Audio chal raha hai...',
    'clay.voice.speak': 'Clay Ki Awaaz Sunein',
    'clay.sfx.muted': 'Mute Karein',
    'clay.sfx.enabled': 'Sound On Hai',
    'family.badge': 'Lesson 02',
    'family.title': 'AI Ka Family Tree',
    'family.subtitle': 'AI koi akeli technology nahi hai, iske andar Machine Learning aur Deep Learning nested hain.',
    'family.depth.label': 'DEPTH KO JAANEIN',
    'family.interactive.hint': 'Card click karke structure dekhein.',
    'genai.badge': 'Tree Ka Dil',
    'genai.title': 'Generative AI itna special kyun hai?',
    'genai.subtitle': 'Ye sirf purana data classify nahi karta, balki naya content generate karta hai!',
    'prompt.badge': 'Lesson 03',
    'prompt.title': 'AI se baat karna: Prompting aur RAG',
    'prompt.subtitle': 'AI use karne ke liye coding ki zaroorat nahi hai, sahi prompts likhna aana chahiye.',
    'tools.badge': 'Free Tools Directory',
    'tools.title': 'Free AI Toolbox',
    'tools.subtitle': '40+ se zyada best aur free AI tools ka collection.',
    'tools.search': 'Tools, use cases ya tags search karein...',
    'tools.bestfor': 'Kiske Liye Best Hai',
    'deeper.badge': 'Lesson 04',
    'deeper.title': 'Aur Deep Jaana Hai?',
    'deeper.subtitle': 'Glossary, roadmap aur advanced concepts explore karein.',
    'deeper.glossary.title': 'Dynamic Glossary',
    'deeper.faq.title': 'Frequently Asked Questions (FAQ)'
  },

  // 3. THANGLISH (Tamil in Roman Latin script)
  thanglish: {
    'nav.intro': 'AI Na Enna',
    'nav.family': 'Family Tree',
    'nav.how': 'Epdi Use Panradhu',
    'nav.toolbox': 'AI Toolbox',
    'nav.deeper': 'Innum Deep-ah Theriyanuma?',
    'nav.close': 'Close Panralam',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, Romba Simple-ah',
    'brand.desc': 'AI, Machine Learning, and Generative algorithms-ah zero math and pure visual logic moolama simple-ah purinjikonga.',
    'brand.constructed': '© 2026 Clayverse AI. Syed Shahnawaz vazhiyaga.',
    'hero.badge': '✨ 100% Beginners-ku • Zero Math & Zero Jargon',
    'hero.title': 'AI onnum magic kedaiyathu. Idhu periya alavula pattern matching.',
    'hero.subtitle': 'Kozhapame illama ChatGPT matrum AI epdi work aagudhu nu easy-ah therinjikonga.',
    'hero.tagline': 'Daily patterns-la irundhu Neural Networks varaikum — step by step clear explanation.',
    'hero.canvas.instruction': 'Nodes mela hover panni AI patterns epdi connect aagudhu nu paarunga',
    'hero.canvas.engine': 'Tactile Pattern Engine v1.2',
    'hero.button': 'Interactive Journey Start Pannunga',
    'whatis.badge': 'Lesson 01',
    'whatis.title': 'So, AI Na Unmaiyila Enna?',
    'whatis.text': 'Artificial Intelligence na human brain maadhiri computers-um patterns identify panna train pandradhu. Idhu oru smart data pattern matcher.',
    'whatis.analogy.title': 'Oru Simple Example',
    'whatis.analogy.text': '"Oru chinna kozhandhaikku dog-ah epdi kaatuvomo adhe maadhiri, thousands of photos paathu computer automatic-ah learn pannum."',
    'whatis.timeline.show': 'AI Timeline Paarunga',
    'whatis.timeline.hide': 'Timeline Maraikka',
    'whatis.pocket.title': 'Unga Pocket-la AI',
    'whatis.pocket.subtitle': 'Google Maps, Netflix recommendations ellathulaiyum neenga daily AI use panreenga.',
    'whatis.pattern.title': 'Pattern Matcher',
    'whatis.pattern.text': 'Data ulla pogum, pattern kandupudikkum, decision veliya varum.',
    'clay.badge': 'Featured Story',
    'clay.title': 'Clay-ah Sandhikalam: Unga AI Explainer Friend',
    'clay.subtitle': 'Clay kooda interact panni visual explanations kelunga.',
    'clay.voice.active': 'Audio play aagudhu...',
    'clay.voice.speak': 'Clay Voice Kelunga',
    'family.badge': 'Lesson 02',
    'family.title': 'AI Family Tree',
    'family.subtitle': 'AI oru periya umbrella. ML and Deep Learning adhan ulla irukku.',
    'tools.title': 'Free AI Toolbox',
    'tools.subtitle': '40+ Free AI tools collections.',
    'tools.search': 'Tools thedunga...',
    'deeper.title': 'Innum Deep-ah Theriyanuma?',
    'deeper.glossary.title': 'Dynamic Glossary'
  },

  // 4. ROMAN URDU
  roman_ur: {
    'nav.intro': 'AI Kya Hai',
    'nav.family': 'AI Khandan',
    'nav.how': 'Istemaal Kaise Karein',
    'nav.toolbox': 'AI Toolbox',
    'nav.deeper': 'Mazeed Tafseelat?',
    'nav.close': 'Band Karein',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, Aasan Zubaan Mein',
    'brand.desc': 'Bina kisi mushkil hisaab kitaab ke, modern AI aur machine learning ko saaf visual tareeqe se samjhein.',
    'brand.constructed': '© 2026 Clayverse AI. Ba-dast Syed Shahnawaz.',
    'hero.badge': '✨ 100% Naye Seekhne Walo Ke Liye • Zero Math',
    'hero.title': 'AI koi jadoo nahi hai dosto. Ye bare paimane par pattern matching hai.',
    'hero.subtitle': 'Bina kisi pareshani ke samjhein ChatGPT aur AI asal mein kaise kaam karte hain.',
    'hero.tagline': 'Rozmarrah ke patterns se leke smart neural networks tak — sab asani se samjhein.',
    'hero.canvas.instruction': 'Nodes par cursor le ja kar dekhein AI patterns kaise jodta hai',
    'hero.canvas.engine': 'Tactile Pattern Engine v1.2',
    'hero.button': 'Interactive Safar Shuru Karein',
    'whatis.badge': 'Sabaq 01',
    'whatis.title': 'Aakhir AI Asal Mein Hai Kya?',
    'whatis.text': 'Artificial Intelligence computers ko aisi samajh deta hai ke wo data mein se patterns talaash karein aur faislay karein.',
    'whatis.analogy.title': 'Ek Aasan Misaal',
    'whatis.analogy.text': '"Jaise ek chhotay bachay ko hazaron kutte dikhane par uska dimagh khud pattern samajh jata hai, computer bhi aise hi seekhta hai."',
    'whatis.timeline.show': 'AI Timeline Dekhein',
    'whatis.timeline.hide': 'Timeline Chhupayein',
    'whatis.pocket.title': 'Rozmarrah Zindagi Mein AI',
    'whatis.pocket.subtitle': 'Google Maps aur Netflix mein aap rozana AI istemaal karte hain.',
    'whatis.pattern.title': 'Pattern Matcher',
    'whatis.pattern.text': 'Data dakhil hota hai, patterns bante hain aur faisla tayar hota hai.',
    'clay.badge': 'Khaas Kahani',
    'clay.title': 'Clay Se Miliye: Aapka AI Ustad Dost',
    'clay.subtitle': 'Clay ke visual animations ke sath asani se AI samjhein.',
    'clay.voice.active': 'Awaaz chal rahi hai...',
    'clay.voice.speak': 'Clay Ki Awaaz Sunein',
    'family.badge': 'Sabaq 02',
    'family.title': 'AI Ka Khandan',
    'family.subtitle': 'AI ek bada chhatra hai jisme ML aur Deep Learning shaamil hain.',
    'tools.title': 'Muft AI Toolbox',
    'tools.subtitle': '40+ se zayed muft aur behtareen AI tools ka majmooa.',
    'tools.search': 'Tools ya use cases talaash karein...',
    'deeper.title': 'Mazeed Tafseelat?',
    'deeper.glossary.title': 'Dynamic Glossary (Lughat)'
  },

  // 5. HYDERABADI URDU (Deccani)
  hyd: {
    'nav.intro': 'AI kya hai',
    'nav.family': 'Khandaan',
    'nav.how': 'Istemaal',
    'nav.toolbox': 'AI Toolbox',
    'nav.deeper': 'Deedari / Deeper?',
    'nav.close': 'Deedari',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'Arey, AI Bole to Ekdam Asaan',
    'brand.desc': 'Ekdam naye logon ke waaste ek pyaara guide jo AI, machine learning, aur Generative AI ko asaan zabaan mein bina dimaag ki dahi kare samjhata hai.',
    'brand.constructed': '© 2026 Clayverse AI. Syed Shahnawaz ki taraf se.',
    'hero.badge': '✨ 100% Asaan Sabaq • Na Koi Math, Na Koi Jargon',
    'hero.title': 'AI koi jaadu nahi hai yaaron. Ye bade paimane par pattern matching hai.',
    'hero.subtitle': 'Bina tension aur bina dimaag ki dahi kare samjho ki AI, ChatGPT aur Machine Learning asal mein kaise kaam karte hain. Bilkul asaan aur mazedaar andaaz mein!',
    'hero.tagline': 'Rozmarra ke patterns se leke smart generative models tak — ek ek karke sab clear!',
    'hero.canvas.instruction': 'Nodes pe mouse ghuma ke dekho AI patterns kaise jodta hai',
    'hero.canvas.engine': 'Tactile Pattern Engine v1.2',
    'hero.button': 'Safar Shuru Karo Yaaron',
    'whatis.badge': 'Sabak 01',
    'whatis.title': 'Arey Yaaron, AI Bole to Asal mein kya hai?',
    'whatis.text': 'Artificial Intelligence (AI) bole to computer’aa ko dimaag dena — computer se aisi cheezein karwana jo dimaag wale hi kar sakte hain. Par ye koi asli insaan ke jaisa nahi sochta yaaron, ye bohot saare data mein se patterns dhoond leta hai.',
    'whatis.analogy.title': 'Ekdam Simple Misaal',
    'whatis.analogy.text': '"Arey bhai, ye bilkul bache ko billi ya kutte ki pehchaan seekhane ke jaisa hai. Tum usko kitaab padha ke biological details nahi samjhate. Tum usko hazaaro baar kutte dikhaate. Bache ka dimaag khud-ba-khud floppy ears, moochh aur dum ke patterns jod leta hai. Bas, computer bhi aise hi seekhta hai!"',
    'whatis.timeline.show': 'AI Timeline Dekho Yaaron',
    'whatis.timeline.hide': 'Timeline Chupao',
    'whatis.pocket.title': 'Roz ka AI Istemaal',
    'whatis.pocket.subtitle': 'Hum roz bohot saari jagah pattern matching dekhte hain. Ek baar neeche click karke check karo yaaron.',
    'whatis.pattern.title': 'Pattern Pehchanne Wala',
    'whatis.pattern.text': 'Pehle data andar jaata, phir patterns dhoond ke, seedha faisla bahar aata!',
    'clay.badge': 'Khaas Kahani',
    'clay.title': 'Clay se milo: Tumhara AI samjhane wala dost',
    'clay.subtitle': 'Humare stop-motion animation ke tareeqe par, Clay se baat karke uske asaan ishaare aur baataan suno.',
    'clay.interactive': 'Ye cheez stop-motion video ke liye banaye so animation script par kaam karti hai.',
    'clay.voice.active': 'Awaaz chalri hai...',
    'clay.voice.speak': 'Clay ki Awaaz Suno',
    'clay.sfx.muted': 'Sound band karo',
    'clay.sfx.enabled': 'Sound chalu hai',
    'family.badge': 'Sabak 02',
    'family.title': 'AI ka Khandaan (Family Tree)',
    'family.subtitle': 'AI koi akeli cheez nahi hai, iske andar bohot saare dabba-in-dabba concepts hain. Neeche ke rings pe mouse ghumaao ya cards dabaake check karo.',
    'family.depth.label': 'KHANDAAN KI GAHRAI',
    'family.interactive.hint': 'Card pe click karo aur dekho rings mein iski kya jagah hai.',
    'genai.badge': 'Jhaad ka bilkul dil',
    'genai.title': 'Generative AI mein aisi kya khaas baat hai?',
    'genai.subtitle': 'Pehle ka AI khali cheezon ko pehchanne ya classify karne mein ustad tha. Lekin Generative AI ek qadam aage hai: ye poori nayi cheez paida kar deta hai!',
    'prompt.badge': 'Sabak 03',
    'prompt.title': 'AI se baat karna seekho: Prompting & RAG',
    'prompt.subtitle': 'AI chalane ke waaste coding seekhne ki zaroorat nahi hai yaaron. Khali sahi tareeqe se prompt likhna kaafi hai.',
    'tools.badge': 'Behtareen Directory',
    'tools.title': 'Mufat AI Toolbox',
    'tools.subtitle': '40+ se zyada ekdam asli aur mufat chalne wale AI tools ka khazana yaaron.',
    'tools.search': 'Tools, use cases ya tags talaash karo...',
    'tools.bestfor': 'Kiske liye behtar hai',
    'deeper.badge': 'Sabak 04',
    'deeper.title': 'Aur Gehra Samajhna Hai?',
    'deeper.subtitle': 'Dynamic glossary aur advanced topics explore karo.',
    'deeper.glossary.title': 'Dynamic Glossary (Lughat)',
    'deeper.faq.title': 'Aksar Pooche Gaye Sawaal (FAQ)'
  },

  // 6. HINDI (हिन्दी)
  hi: {
    'nav.intro': 'AI क्या है',
    'nav.family': 'परिवार वृक्ष (Family Tree)',
    'nav.how': 'उपयोग कैसे करें',
    'nav.toolbox': 'AI टूलबॉक्स',
    'nav.deeper': 'गहराई से जानें',
    'nav.close': 'बंद करें',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, आसान और सरल भाषा में',
    'brand.desc': 'कठिन गणित और तकनीकी शब्दों के बिना आधुनिक आर्टिफिशियल इंटेलिजेंस और मशीन लर्निंग को सरलता से समझें।',
    'brand.constructed': '© 2026 Clayverse AI. सैयद शाहनवाज़ द्वारा।',
    'hero.badge': '✨ 100% शुरुआती पाठकों के लिए • बिना किसी गणित के',
    'hero.title': 'AI कोई जादू नहीं है। यह बड़े पैमाने पर पैटर्न मिलान है।',
    'hero.subtitle': 'तनाव मुक्त होकर समझें कि ChatGPT, AI और मशीन लर्निंग वास्तव में कैसे कार्य करते हैं।',
    'hero.tagline': 'दैनिक जीवन के पैटर्न्स से लेकर जनरेटिव न्यूरल नेटवर्क तक — सब कुछ चरण दर चरण स्पष्ट।',
    'hero.canvas.instruction': 'देखें कि AI छिपे हुए पैटर्न्स को कैसे जोड़ता है',
    'hero.canvas.engine': 'Tactile Pattern Engine v1.2',
    'hero.button': 'इंटरएक्टिव यात्रा शुरू करें',
    'whatis.badge': 'पाठ 01',
    'whatis.title': 'तो, वास्तव में AI क्या है?',
    'whatis.text': 'आर्टिफिशियल इंटेलिजेंस (AI) कंप्यूटर सिस्टम की वह क्षमता है जो मानव की तरह डेटा से पैटर्न पहचानती है और निर्णय लेती है।',
    'whatis.analogy.title': 'एक सरल उदाहरण',
    'whatis.analogy.text': '"जैसे एक छोटे बच्चे को हजारों कुत्तों के चित्र दिखाने पर उसका मस्तिष्क अपने आप उनके आकार और कानों का पैटर्न समझ जाता है, कंप्यूटर भी वैसे ही सीखता है।"',
    'whatis.timeline.show': 'AI टाइमलाइन देखें',
    'whatis.timeline.hide': 'टाइमलाइन छुपाएं',
    'whatis.pocket.title': 'आपकी जेब में AI',
    'whatis.pocket.subtitle': 'गूगल मैप्स और नेटफ्लिक्स जैसी सेवाओं में आप रोज़ाना AI का उपयोग करते हैं।',
    'whatis.pattern.title': 'पैटर्न मिलानकर्ता',
    'whatis.pattern.text': 'डेटा अंदर जाता है, पैटर्न खोजे जाते हैं, और सटीक निर्णय बाहर आते हैं।',
    'clay.badge': 'विशेष कहानी',
    'clay.title': 'Clay से मिलें: आपका AI साथी',
    'clay.subtitle': 'एनीमेशन और सरल भाषा के साथ AI की अवधारणाओं को समझें।',
    'clay.voice.active': 'ऑडियो चल रहा है...',
    'clay.voice.speak': 'Clay की आवाज़ सुनें',
    'family.badge': 'पाठ 02',
    'family.title': 'AI का परिवार वृक्ष (Family Tree)',
    'family.subtitle': 'AI एक व्यापक अवधारणा है जिसके अंदर मशीन लर्निंग और डीप लर्निंग शामिल हैं।',
    'tools.title': 'मुफ़्त AI टूलबॉक्स',
    'tools.subtitle': '40+ से अधिक उपयोगी और मुफ़्त AI टूल्स का संग्रह।',
    'tools.search': 'टूल्स या उपयोग खोजें...',
    'deeper.title': 'और गहराई से जानें',
    'deeper.glossary.title': 'शब्दावली (Glossary)'
  },

  // 7. TELUGU (తెలుగు)
  te: {
    'nav.intro': 'AI అంటే ఏమిటి',
    'nav.family': 'కుటుంబ వృక్షం',
    'nav.how': 'ఎలా ఉపయోగించాలి',
    'nav.toolbox': 'AI టూల్‌బాక్స్',
    'nav.deeper': 'ఇంకా లోతుగా తెలుసుకోవాలా?',
    'nav.close': 'వివరాలు మూసివేయండి',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, చాలా సులభంగా',
    'brand.desc': 'కృత్రిమ మేధస్సు (AI), మెషిన్ లెర్నింగ్, మరియు జనరేటివ్ అల్గారిథమ్‌లను గణితం మరియు కష్టమైన పదాలు లేకుండా దృశ్య రూపంలో సులభంగా వివరించే సరళమైన ఇంటరాక్టివ్ గైడ్.',
    'brand.constructed': '© 2026 Clayverse AI. సయ్యద్ షానవాజ్ ద్వారా రూపొందించబడింది.',
    'hero.badge': '✨ 100% ప్రారంభకులకు అనుకూలం • గణితం మరియు కష్టమైన పదాలు లేవు',
    'hero.title': 'AI అనేది మాయాజాలం కాదు. ఇది భారీ స్థాయిలో ప్యాటర్న్ మ్యాచింగ్ (నమూనాల గుర్తింపు).',
    'hero.subtitle': 'ఆధునిక ఆర్టిఫిషియల్ ఇంటెలిజెన్స్, ChatGPT మరియు మెషిన్ లెర్నింగ్ అసలు ఎలా పనిచేస్తాయో ఎటువంటి గందరగోళం లేకుండా స్పష్టంగా అర్థం చేసుకోండి.',
    'hero.tagline': 'రోజువారీ సాధారణ నమూనాల నుండి అధునాతన న్యూరల్ నెట్‌వర్క్‌ల వరకు — ప్రతిదీ వివరంగా.',
    'hero.canvas.instruction': 'AI దాగి ఉన్న అనుసంధానాలను ఎలా కనుగొంటుందో చూడటానికి నోడ్స్‌పై మౌస్ ఉంచండి',
    'hero.canvas.engine': 'Tactile Pattern Engine v1.2',
    'hero.button': 'ఇంటరాక్టివ్ ప్రయాణాన్ని ప్రారంభించండి',
    'whatis.badge': 'పాఠం 01',
    'whatis.title': 'అసలు AI అంటే ఏమిటి?',
    'whatis.text': 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ (కృత్రిమ మేధస్సు) అనేది కంప్యూటర్లు సాధారణంగా మానవ మేధస్సు అవసరమయ్యే పనులను స్వయంచాలకంగా చేయగల సామర్థ్యం. ఇది సొంతంగా ఆలోచించే ప్రాణి కాదు, భారీ డేటాలో పదే పదే వచ్చే నమూనాలను గుర్తించే ఒక అద్భుతమైన సాధనం.',
    'whatis.analogy.title': 'ఒక సాధారణ ఉదాహరణ',
    'whatis.analogy.text': '"ఇది ఒక చిన్న పిల్లాడికి కుక్క అంటే ఏమిటో నేర్పించడం లాంటిది. మీరు పుస్తకాల్లో జీవశాస్త్రం చదివించరు. వేలాది కుక్కల బొమ్మలు లేదా నిజమైన కుక్కలను చూపిస్తారు. పిల్లాడి మెదడు వాటంతట అవే చెవులు, తోక మరియు నమూనాలను పోల్చుకుని నేర్చుకుంటుంది. కంప్యూటర్ కూడా సరిగ్గా అలాగే నేర్చుకుంటుంది."',
    'whatis.timeline.show': 'AI కాలక్రమాన్ని చూడండి',
    'whatis.timeline.hide': 'కాలక్రమాన్ని దాచండి',
    'whatis.pocket.title': 'మీ జేబులోనే AI',
    'whatis.pocket.subtitle': 'మీరు ప్రతిరోజూ గూగుల్ మ్యాప్స్, నెట్‌ఫ్లిక్స్ వంటి సేవల్లో ప్యాటర్న్ మ్యాచింగ్‌ను ఉపయోగిస్తున్నారు.',
    'whatis.pattern.title': 'ప్యాటర్న్ మ్యాచర్ (నమూనా గుర్తింపు సాధనం)',
    'whatis.pattern.text': 'డేటా లోపలికి వెళ్తుంది, నమూనాలు గుర్తించబడతాయి, సరైన నిర్ణయాలు బయటకు వస్తాయి.',
    'clay.badge': 'ప్రత్యేక కథనం',
    'clay.title': 'క్లే (Clay)ని కలవండి: మీ AI గైడ్',
    'clay.subtitle': 'యానిమేషన్ల సహాయంతో క్లే మీకు AIని సులభంగా ఎలా వివరిస్తాడో చూడండి మరియు వినండి.',
    'clay.voice.active': 'ఆడియో ప్లే అవుతోంది...',
    'clay.voice.speak': 'క్లే స్వరాన్ని వినండి',
    'family.badge': 'పాఠం 02',
    'family.title': 'AI కుటుంబ వృక్షం (The AI Family Tree)',
    'family.subtitle': 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ అనేది ఒకే సాంకేతికత కాదు. దీనిలో మెషిన్ లెర్నింగ్, డీప్ లెర్నింగ్ మరియు జనరేటివ్ AI ఒకదానిలో ఒకటి అమర్చబడి ఉంటాయి.',
    'tools.title': 'ఉచిత AI టూల్‌బాక్స్',
    'tools.subtitle': '40+ కి పైగా ఉచిత AI సాధనాల సమగ్ర సమాహారం.',
    'tools.search': 'టూల్స్, ఉపయోగాలు లేదా ట్యాగ్‌లను వెతకండి...',
    'deeper.title': 'ఇంకా లోతుగా తెలుసుకోవాలా?',
    'deeper.glossary.title': 'డైనమిక్ గ్లోసరీ (పదకోశం)'
  },

  // 8. BENGALI (বাংলা)
  bn: {
    'nav.intro': 'AI কী',
    'nav.family': 'ফ্যামিলি ট্রি',
    'nav.how': 'ব্যবহার বিধি',
    'nav.toolbox': 'AI টুলবক্স',
    'nav.deeper': 'আরও জানতে চান?',
    'nav.close': 'বন্ধ করুন',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'সহজ ভাষায় কৃত্রিম বুদ্ধিমত্তা',
    'brand.desc': 'কোনো কঠিন গণিত ছাড়াই সহজে AI, Machine Learning এবং Generative AI বুঝুন।',
    'brand.constructed': '© 2026 Clayverse AI. সৈয়দ শাহনওয়াজ কর্তৃক।',
    'hero.badge': '✨ ১০০% নতুনদের উপযোগী • কোনো জটিল গণিত ছাড়া',
    'hero.title': 'AI কোনো জাদু নয়। এটি বিশাল স্কেলে প্যাটার্ন ম্যাচিং।',
    'hero.subtitle': 'সহজভাবে বুঝুন ChatGPT এবং AI কীভাবে কাজ করে।',
    'hero.button': 'ইন্টারেক্টিভ জার্নি শুরু করুন',
    'whatis.badge': 'পাঠ ০১',
    'whatis.title': 'আসলে AI কী?',
    'whatis.text': 'আর্টিফিশিয়াল ইন্টেলিজেন্স হলো কম্পিউটার সিস্টেমের সেই ক্ষমতা যার মাধ্যমে বিশাল ডেটা থেকে প্যাটার্ন চিনে সিদ্ধান্ত নেওয়া যায়।',
    'whatis.analogy.title': 'একটি সহজ উদাহরণ',
    'whatis.analogy.text': '"একটি শিশুকে যেভাবে কুকুর চেনানো হয়—হাজারো ছবি দেখে শিশুটি যেমন নিজে থেকেই চিনে ফেলে, কম্পিউটারও ঠিক সেভাবেই শেখে।"',
    'tools.title': 'ফ্রি AI টুলবক্স',
    'tools.subtitle': '৪০+ এরও বেশি প্রয়োজনীয় ফ্রি AI টুলের সংকলন।',
    'tools.search': 'টুল খুঁজুন...',
    'deeper.title': 'আরও গভীরে জানুন',
    'deeper.glossary.title': 'শব্দকোষ (Glossary)'
  },

  // 9. MARATHI (मराठी)
  mr: {
    'nav.intro': 'AI म्हणजे काय',
    'nav.family': 'कुटुंब वृक्ष',
    'nav.how': 'कसे वापरावे',
    'nav.toolbox': 'AI टूलबॉक्स',
    'nav.deeper': 'अधिक जाणून घ्या',
    'nav.close': 'बंद करा',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, सोप्या भाषेत',
    'brand.desc': 'कोणत्याही कठीण गणिताशिवाय आधुनिक AI आणि Machine Learning सोप्या व्हिज्युअल पद्धतीने शिका.',
    'brand.constructed': '© 2026 Clayverse AI. सय्यद शाहनवाज द्वारे.',
    'hero.badge': '✨ 100% नवशिक्यांसाठी • शून्य गणित',
    'hero.title': 'AI ही कोणतीही जादू नाही. ही मोठ्या प्रमाणावर पॅटर्न जुळवणी आहे.',
    'hero.subtitle': 'ChatGPT आणि AI कसे कार्य करतात हे अगदी सोप्या पद्धतीने समजून घ्या.',
    'hero.button': 'प्रवास सुरू करा',
    'whatis.badge': 'धडा 01',
    'whatis.title': 'नेमके AI म्हणजे काय?',
    'whatis.text': 'आर्टिफिशिअल इंटेलिजन्स ही संगणकाची अशी क्षमता आहे जी मोठ्या डेटांमधून नमुने (पॅटर्न) शोधून निर्णय घेते.',
    'tools.title': 'मोफत AI टूलबॉक्स',
    'tools.subtitle': '40+ पेक्षा जास्त उपयुक्त मोफत AI टूल्सचा संग्रह.',
    'tools.search': 'टूल्स शोधा...',
    'deeper.title': 'अधिक सखोल माहिती',
    'deeper.glossary.title': 'शब्दकोश (Glossary)'
  },

  // 10. TAMIL (தமிழ்)
  ta: {
    'nav.intro': 'AI என்றால் என்ன',
    'nav.family': 'குடும்ப மரம்',
    'nav.how': 'பயன்படுத்துவது எப்படி',
    'nav.toolbox': 'AI கருவிப்பெட்டி',
    'nav.deeper': 'மேலும் அறிய வேண்டுமா?',
    'nav.close': 'மூடு',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'செயற்கை நுண்ணறிவு, எளிய தமிழில்',
    'brand.desc': 'கடினமான கணிதம் இல்லாமல் செயற்கை நுண்ணறிவை (AI) எளிய முறையில் புரிந்துகொள்ளுங்கள்.',
    'brand.constructed': '© 2026 Clayverse AI. சையத் ஷாநவாஸ் உருவாக்கியது.',
    'hero.badge': '✨ 100% ஆரம்பநிலையாளர்களுக்கானது • கணிதம் இல்லை',
    'hero.title': 'AI என்பது மாயாஜாலம் அல்ல. இது பெரிய அளவிலான பேட்டர்ன் பொருத்தம்.',
    'hero.subtitle': 'ChatGPT மற்றும் AI எவ்வாறு இயங்குகின்றன என்பதை குழப்பமின்றி கற்றுக்கொள்ளுங்கள்.',
    'hero.button': 'பயணத்தை தொடங்குங்கள்',
    'whatis.badge': 'பாடம் 01',
    'whatis.title': 'AI என்றால் உண்மையில் என்ன?',
    'whatis.text': 'செயற்கை நுண்ணறிவு என்பது கணினிகள் மனிதர்களைப் போல தரவுகளில் உள்ள வடிவங்களை (Patterns) கண்டறிந்து செயல்படும் திறன்.',
    'tools.title': 'இலவச AI கருவிப்பெட்டி',
    'tools.subtitle': '40+ இலவச AI கருவிகளின் தொகுப்பு.',
    'tools.search': 'கருவிகளைத் தேடுங்கள்...',
    'deeper.title': 'ஆழமாக அறிந்துகொள்ளுங்கள்',
    'deeper.glossary.title': 'அருஞ்சொற்பொருள் (Glossary)'
  },

  // 11. URDU (اردو - Nastaliq/Classical)
  ur: {
    'nav.intro': 'AI کیا ہے',
    'nav.family': 'خاندانی شجرہ',
    'nav.how': 'طریقہ استعمال',
    'nav.toolbox': 'AI ٹول باکس',
    'nav.deeper': 'مزید گہرائی سے جانیں',
    'nav.close': 'بند کریں',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'مصنوعی ذہانت، آسان اردو میں',
    'brand.desc': 'بغیر کسی مشکل ریاضی کے جدید مصنوعی ذہانت اور مشین لرننگ کو بصری انداز میں سمجھیں۔',
    'brand.constructed': '© 2026 Clayverse AI. سید شاہنواز کی جانب سے۔',
    'hero.badge': '✨ 100% مبتدی طلبہ کے لیے • آسان اور عام فہم',
    'hero.title': 'مصنوعی ذہانت کوئی جادو نہیں ہے۔ یہ وسیع پیمانے پر پیٹرن میچنگ ہے۔',
    'hero.subtitle': 'بغیر کسی الجھن کے سمجھیں کہ ChatGPT اور AI دراصل کیسے کام کرتے ہیں۔',
    'hero.button': 'سفر کا آغاز کریں',
    'whatis.badge': 'سبق 01',
    'whatis.title': 'آخر AI دراصل ہے کیا؟',
    'whatis.text': 'مصنوعی ذہانت کمپیوٹرز کی وہ صلاحیت ہے جو ڈیٹا میں موجود پیٹرنز کو پہچان کر فیصلے کرتی ہے۔',
    'tools.title': 'مفت AI ٹول باکس',
    'tools.subtitle': '40+ سے زائد بہترین اور مفت AI ٹولز کا مجموعہ۔',
    'tools.search': 'ٹولز تلاش کریں...',
    'deeper.title': 'مزید تفصیلی مطالعہ',
    'deeper.glossary.title': 'فرہنگ اصطلاحات (Glossary)'
  },

  // 12. GUJARATI (ગુજરાતી)
  gu: {
    'nav.intro': 'AI શું છે',
    'nav.family': 'ફેમિલી ટ્રી',
    'nav.how': 'કેવી રીતે ઉપયોગ કરવો',
    'nav.toolbox': 'AI ટૂલબોક્સ',
    'nav.deeper': 'વધુ ઊંડાણપૂર્વક જાણો',
    'nav.close': 'બંધ કરો',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, સરળ ગુજરાતીમાં',
    'brand.desc': 'કોઈપણ અઘરા ગણિત વગર આર્ટિફિશિયલ ઇન્ટેલિજન્સ અને મશીન લર્નિંગ સરળતાથી સમજો.',
    'brand.constructed': '© 2026 Clayverse AI. સૈયદ શાહનવાઝ દ્વારા.',
    'hero.badge': '✨ 100% નવા શીખનારાઓ માટે • સરળ ભાષા',
    'hero.title': 'AI કોઈ જાદુ નથી. તે મોટા પાયે પેટર્ન મેચિંગ છે.',
    'hero.subtitle': 'ChatGPT અને AI કેવી રીતે કામ કરે છે તે કોઈ પણ મૂંઝવણ વિના શીખો.',
    'hero.button': 'શરૂઆત કરો',
    'whatis.badge': 'પાઠ 01',
    'whatis.title': 'ખરેખર AI શું છે?',
    'whatis.text': 'આર્ટિફિશિયલ ઇન્ટેલિજન્સ એ કમ્પ્યુટર સિસ્ટમ્સની એવી ક્ષમતા છે જે ડેટામાંથી પેટર્ન ઓળખીને સ્માર્ટ નિર્ણયો લે છે.',
    'tools.title': 'મફત AI ટૂલબોક્સ',
    'tools.subtitle': '40+ ઉપયોગી મફત AI ટૂલ્સ.',
    'tools.search': 'ટૂલ્સ શોધો...',
    'deeper.title': 'વધુ ઊંડાણપૂર્વક જાણો',
    'deeper.glossary.title': 'શબ્દાવલી (Glossary)'
  },

  // 13. KANNADA (ಕನ್ನಡ)
  kn: {
    'nav.intro': 'AI ಎಂದರೇನು',
    'nav.family': 'ಕುಟುಂಬ ವೃಕ್ಷ',
    'nav.how': 'ಬಳಸುವುದು ಹೇಗೆ',
    'nav.toolbox': 'AI ಟೂಲ್‌ಬಾಕ್ಸ್',
    'nav.deeper': 'ಹೆಚ್ಚು ತಿಳಿಯಬೇಕೆ?',
    'nav.close': 'ಮುಚ್ಚಿರಿ',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ, ಸರಳ ಕನ್ನಡದಲ್ಲಿ',
    'brand.desc': 'ಯಾವುದೇ ಸಂಕೀರ್ಣ ಗಣಿತವಿಲ್ಲದೆ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಮತ್ತು ಮೆಷಿನ್ ಲರ್ನಿಂಗ್ ಅನ್ನು ಸುಲಭವಾಗಿ ಕಲಿಯಿರಿ.',
    'brand.constructed': '© 2026 Clayverse AI. ಸೈಯದ್ ಶಾಹ್ನವಾಜ್ ಅವರಿಂದ.',
    'hero.badge': '✨ 100% ಆರಂಭಿಕರಿಗೆ ಸೂಕ್ತ • ಸರಳ ಕಲಿಕೆ',
    'hero.title': 'AI ಯಾವುದೇ ಮಾಂತ್ರಿಕತೆಯಲ್ಲ. ಇದು ದೊಡ್ಡ ಪ್ರಮಾಣದಲ್ಲಿ ಪ್ಯಾಟರ್ನ್ ಹೊಂದಾಣಿಕೆಯಾಗಿದೆ.',
    'hero.subtitle': 'ChatGPT ಮತ್ತು AI ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ ಎಂಬುದನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
    'hero.button': 'ಪ್ರಯಾಣ ಆರಂಭಿಸಿ',
    'whatis.badge': 'ಪಾಠ 01',
    'whatis.title': 'ನಿಜವಾಗಿಯೂ AI ಎಂದರೇನು?',
    'whatis.text': 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಎಂದರೆ ಕಂಪ್ಯೂಟರ್‌ಗಳು ಡೇಟಾದಲ್ಲಿನ ಪ್ಯಾಟರ್ನ್‌ಗಳನ್ನು ಗುರುತಿಸಿ ಸ್ವತಂತ್ರವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುವ ಸಾಮರ್ಥ್ಯ.',
    'tools.title': 'ಉಚಿತ AI ಟೂಲ್‌ಬಾಕ್ಸ್',
    'tools.subtitle': '40+ ಉಚಿತ AI ಪರಿಕರಗಳ ಸಂಗ್ರಹ.',
    'tools.search': 'ಪರಿಕರಗಳನ್ನು ಹುಡುಕಿ...',
    'deeper.title': 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ',
    'deeper.glossary.title': 'ಪದಕೋಶ (Glossary)'
  },

  // 14. ODIA (ଓଡ଼ିଆ)
  or: {
    'nav.intro': 'AI କ\'ଣ',
    'nav.family': 'ପରିବାର ବୃକ୍ଷ',
    'nav.how': 'ବ୍ୟବହାର ପ୍ରଣାଳୀ',
    'nav.toolbox': 'AI ଟୁଲବକ୍ସ',
    'nav.deeper': 'ଅଧିକ ଜାଣନ୍ତୁ',
    'nav.close': 'ବନ୍ଦ କରନ୍ତୁ',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, ସହଜ ଓଡ଼ିଆରେ',
    'brand.desc': 'କୌଣସି ଜଟିଳ ଗଣିତ ବିନା ଆର୍ଟିଫିସିଆଲ ଇଣ୍ଟେଲିଜେନ୍ସ ସହଜରେ ଶିଖନ୍ତୁ।',
    'brand.constructed': '© 2026 Clayverse AI. ସୟଦ ଶାହନୱାଜଙ୍କ ଦ୍ୱାରା।',
    'hero.badge': '✨ 100% ନୂତନ ଶିକ୍ଷାର୍ଥୀଙ୍କ ପାଇଁ • ସରଳ ଭାଷା',
    'hero.title': 'AI କୌଣସି ଯାଦୁ ନୁହେଁ। ଏହା ବ୍ୟାପକ ସ୍କେଲରେ ପ୍ୟାଟର୍ନ ମେଚିଂ।',
    'hero.subtitle': 'ChatGPT ଏବଂ AI କିପରି କାମ କରେ ତାହା ସହଜରେ ବୁଝନ୍ତୁ।',
    'hero.button': 'ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ',
    'whatis.badge': 'ପାଠ 01',
    'whatis.title': 'ପ୍ରକୃତରେ AI କ\'ଣ?',
    'whatis.text': 'କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା ହେଉଛି କମ୍ପ୍ୟୁଟରର ଏପରି ଏକ ଦକ୍ଷତା ଯାହା ତଥ୍ୟରୁ ନମୁନା ଚିହ୍ନି ନିଷ୍ପତ୍ତି ନେଇପାରେ।',
    'tools.title': 'ମାଗଣା AI ଟୁଲବକ୍ସ',
    'tools.subtitle': '୪୦+ ମାଗଣା AI ଉପକରଣ।',
    'tools.search': 'ଟୁଲ୍ ଖୋଜନ୍ତୁ...',
    'deeper.title': 'ଅଧିକ ଗଭୀରରେ ଜାଣନ୍ତୁ',
    'deeper.glossary.title': 'ଶବ୍ଦକୋଷ (Glossary)'
  },

  // 15. MALAYALAM (മലയാളം)
  ml: {
    'nav.intro': 'എഐ എന്താണ്',
    'nav.family': 'ഫാമിലി ട്രീ',
    'nav.how': 'എങ്ങനെ ഉപയോഗിക്കാം',
    'nav.toolbox': 'എഐ ടൂൾബോക്സ്',
    'nav.deeper': 'കൂടുതൽ അറിയണോ?',
    'nav.close': 'അടയ്ക്കുക',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'എഐ, ലളിതമായ മലയാളത്തിൽ',
    'brand.desc': 'സങ്കീർണ്ണമായ കണക്കുകളില്ലാതെ കൃത്രിമബുദ്ധി (AI) ലളിതമായി മനസ്സിലാക്കൂ.',
    'brand.constructed': '© 2026 Clayverse AI. സയ്യിദ് ഷാനവാസ് രൂപകൽപ്പന ചെയ്തത്.',
    'hero.badge': '✨ തുടക്കക്കാർക്കായി 100% അനുയോജ്യം',
    'hero.title': 'എഐ മാന്ത്രികതയല്ല. ഇത് വലിയ തോതിലുള്ള പാറ്റേൺ മാച്ചിംഗ് ആണ്.',
    'hero.subtitle': 'ചാറ്റ്ജിപിടിയും മെഷീൻ ലേണിംഗും എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് എളുപ്പത്തിൽ പഠിക്കൂ.',
    'hero.button': 'യാത്ര ആരംഭിക്കൂ',
    'whatis.badge': 'പാഠം 01',
    'whatis.title': 'യഥാർത്ഥത്തിൽ എഐ എന്താണ്?',
    'whatis.text': 'മനുഷ്യ മസ്തിഷ്കം പോലെ വിവരങ്ങളിൽ നിന്ന് പാറ്റേണുകൾ കണ്ടെത്തി തീരുമാനങ്ങളെടുക്കാൻ കമ്പ്യൂട്ടറുകളെ സഹായിക്കുന്ന വിദ്യയാണ് കൃത്രിമബുദ്ധി.',
    'tools.title': 'സൗജന്യ എഐ ടൂൾബോക്സ്',
    'tools.subtitle': '40+ സൗജന്യ എഐ ടൂളുകൾ.',
    'tools.search': 'ടൂളുകൾ തിരയുക...',
    'deeper.title': 'കൂടുതൽ അറിയുക',
    'deeper.glossary.title': 'പദാവലി (Glossary)'
  },

  // 16. PUNJABI (ਪੰਜਾਬੀ)
  pa: {
    'nav.intro': 'AI ਕੀ ਹੈ',
    'nav.family': 'ਪਰਿਵਾਰਕ ਰੁੱਖ',
    'nav.how': 'ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ',
    'nav.toolbox': 'AI ਟੂਲਬਾਕਸ',
    'nav.deeper': 'ਹੋਰ ਜਾਣਕਾਰੀ',
    'nav.close': 'ਬੰਦ ਕਰੋ',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, ਬਿਲਕੁਲ ਆਸਾਨ ਪੰਜਾਬੀ ਵਿੱਚ',
    'brand.desc': 'ਬਿਨਾਂ ਕਿਸੇ ਗੁੰਝਲਦਾਰ ਹਿਸਾਬ-ਕਿਤਾਬ ਦੇ ਆਰਟੀਫੀਸ਼ੀਅਲ ਇੰਟੈਲੀਜੈਂਸ ਨੂੰ ਆਸਾਨੀ ਨਾਲ ਸਮਝੋ।',
    'brand.constructed': '© 2026 Clayverse AI. ਸਈਅਦ ਸ਼ਾਹਨਵਾਜ਼ ਦੁਆਰਾ।',
    'hero.badge': '✨ 100% ਨਵੇਂ ਸਿੱਖਣ ਵਾਲਿਆਂ ਲਈ',
    'hero.title': 'AI ਕੋਈ ਜਾਦੂ ਨਹੀਂ ਹੈ। ਇਹ ਵੱਡੇ ਪੱਧਰ \'ਤੇ ਪੈਟਰਨ ਮੈਚਿੰਗ ਹੈ।',
    'hero.subtitle': 'ChatGPT ਅਤੇ AI ਕਿਵੇਂ ਕੰਮ ਕਰਦੇ ਹਨ, ਆਸਾਨੀ ਨਾਲ ਸਿੱਖੋ।',
    'hero.button': 'ਸਫ਼ਰ ਸ਼ੁਰੂ ਕਰੋ',
    'whatis.badge': 'ਸਬਕ 01',
    'whatis.title': 'ਅਸਲ ਵਿੱਚ AI ਕੀ ਹੈ?',
    'whatis.text': 'ਆਰਟੀਫੀਸ਼ੀਅਲ ਇੰਟੈਲੀਜੈਂਸ ਕੰਪਿਊਟਰ ਦੀ ਉਹ ਸਮਰੱਥਾ ਹੈ ਜੋ ਡੇਟਾ ਵਿੱਚੋਂ ਪੈਟਰਨ ਲੱਭ ਕੇ ਫ਼ੈਸਲੇ ਲੈਂਦੀ ਹੈ।',
    'tools.title': 'ਮੁਫ਼ਤ AI ਟੂਲਬਾਕਸ',
    'tools.subtitle': '40+ ਮੁਫ਼ਤ ਅਤੇ ਸ਼ਾਨਦਾਰ AI ਟੂਲਜ਼।',
    'tools.search': 'ਟੂਲਜ਼ ਲੱਭੋ...',
    'deeper.title': 'ਹੋਰ ਡੂੰਘਾਈ ਨਾਲ ਜਾਣੋ',
    'deeper.glossary.title': 'ਸ਼ਬਦਕੋਸ਼ (Glossary)'
  },

  // 17. ASSAMESE (অসমীয়া)
  as: {
    'nav.intro': 'AI কি',
    'nav.family': 'পৰিয়াল বৃক্ষ',
    'nav.how': 'কেনেকৈ ব্যৱহাৰ কৰিব',
    'nav.toolbox': 'AI টুলবক্স',
    'nav.deeper': 'অধিক জানিবলৈ',
    'nav.close': 'বন্ধ কৰক',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, সহজ অসমীয়াত',
    'brand.desc': 'কোনো কঠিন অংক নোহোৱাকৈ কৃত্ৰিম বুদ্ধিমত্তা আৰু মেচিন লাৰ্ণিং সহজকৈ শিকক।',
    'brand.constructed': '© 2026 Clayverse AI. চৈয়দ শ্বাহনৱাজৰ দ্বাৰা।',
    'hero.badge': '✨ ১০০% নতুন শিক্ষাৰ্থীৰ বাবে',
    'hero.title': 'AI কোনো যাদু নহয়। এইটো বৃহৎ স্কেলত পেটাৰ্ণ মেচিং।',
    'hero.subtitle': 'ChatGPT আৰু AI কেনেকৈ কাম কৰে সহজে বুজি লওক।',
    'hero.button': 'যাত্ৰা আৰম্ভ কৰক',
    'whatis.badge': 'পাঠ ০১',
    'whatis.title': 'প্ৰকৃততে AI কি?',
    'whatis.text': 'কৃত্ৰিম বুদ্ধিমত্তা হ\'ল কম্পিউটাৰৰ সেই ক্ষমতা যিয়ে তথ্যৰ পৰা পেটাৰ্ণ চিনাক্ত কৰি সিদ্ধান্ত ল\'ব পাৰে।',
    'tools.title': 'বিনামূলীয়া AI টুলবক্স',
    'tools.subtitle': '৪০+ বিনামূলীয়া AI সঁজুলি।',
    'tools.search': 'সঁজুলি বিচাৰক...',
    'deeper.title': 'অধিক গভীৰলৈ যাওক',
    'deeper.glossary.title': 'শব্দকোষ (Glossary)'
  },

  // 18. MAITHILI (मैथिली)
  mai: {
    'nav.intro': 'AI की अछि',
    'nav.family': 'परिवार वृक्ष',
    'nav.how': 'उपयोग कोना करू',
    'nav.toolbox': 'AI टूलबॉक्स',
    'nav.deeper': 'आर जानू',
    'nav.close': 'बंद करू',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'AI, अपन मैथिली में',
    'brand.desc': 'बिना कोनो भारी गणित के आर्टिफिशियल इंटेलिजेंस आ मशीन लर्निंग आसानी सँ सीखू।',
    'brand.constructed': '© 2026 Clayverse AI. सैयद शाहनवाज द्वारा।',
    'hero.badge': '✨ १००% शुरुआती लोकनिक लेल',
    'hero.title': 'AI कोनो जादू नहि अछि। ई पैघ पैमाना पर पैटर्न मैचिंग अछि।',
    'hero.subtitle': 'ChatGPT आ AI कोना काज करैत अछि से आसानी सँ समझू।',
    'hero.button': 'सफर शुरू करू',
    'whatis.badge': 'पाठ ०१',
    'whatis.title': 'असल में AI की अछि?',
    'whatis.text': 'आर्टिफिशियल इंटेलिजेंस कम्प्यूटरक ओ क्षमता थिक जे डेटा सँ पैटर्न पहचानि क\' निर्णय लैत अछि।',
    'tools.title': 'मुफ्त AI टूलबॉक्स',
    'tools.subtitle': '४०+ सँ बेसी मुफ्त AI टूल्स।',
    'tools.search': 'टूल्स खोजू...',
    'deeper.title': 'आर गहराई सँ जानू',
    'deeper.glossary.title': 'शब्दकोश (Glossary)'
  },

  // 19. SANSKRIT (संस्कृतम्)
  sa: {
    'nav.intro': 'कृत्रिमबुद्धिः किम्',
    'nav.family': 'वंशवृक्षः',
    'nav.how': 'उपयोगविधिः',
    'nav.toolbox': 'उपकरणमञ्जूषा',
    'nav.deeper': 'अधिकं ज्ञातुम्',
    'nav.close': 'पिदधातु',
    'brand.title': 'Clayverse AI',
    'brand.slogan': 'सरलसंस्कृते कृत्रिमबुद्धिः',
    'brand.desc': 'क्लिष्टगणितं विना आधुनिक-कृत्रिमबुद्धेः सिद्धान्तान् सरलरूपेण अवगच्छन्तु।',
    'brand.constructed': '© 2026 Clayverse AI. सैय्यद् शाहनवाजेन रचितम्।',
    'hero.badge': '✨ प्राथमिकाभ्यासार्थिभ्यः १००%',
    'hero.title': 'कृत्रिमबुद्धिः न काचित् माया। इयं बृहत्प्रमाणेन पद्धतिमेलनम्।',
    'hero.subtitle': 'ChatGPT तथा यन्त्रशिक्षणं कथं कार्यं करोति इति सरलताया अवगच्छन्तु।',
    'hero.button': 'यात्रां प्रारभताम्',
    'whatis.badge': 'पाठः ०१',
    'whatis.title': 'वस्तुतः कृत्रिमबुद्धिः किम्?',
    'whatis.text': 'कृत्रिमबुद्धिः सङ्गणकस्य सा क्षमता यया विशालदत्तांशेभ्यः पद्धतीः ज्ञात्वा निर्णयाः क्रियन्ते।',
    'tools.title': 'निःशुल्क-उपकरणमञ्जूषा',
    'tools.subtitle': '४०+ निःशुल्क-कृत्रिमबुद्धि-उपकरणानि।',
    'tools.search': 'अन्वेषणं कुरुत...',
    'deeper.title': 'विस्तृतं ज्ञानम्',
    'deeper.glossary.title': 'शब्दकोशः (Glossary)'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return saved ? (saved as Language) : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('app_language', newLang);
      window.dispatchEvent(new CustomEvent('clay_language_changed', { detail: { lang: newLang } }));
    } catch (e) {
      console.warn('Could not persist language preference to localStorage', e);
    }
  };

  // Sync across tabs and custom events
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'app_language' && e.newValue) {
        setLangState(e.newValue as Language);
      }
    };

    const handleCustomChange = (e: any) => {
      if (e.detail?.lang && e.detail.lang !== lang) {
        setLangState(e.detail.lang as Language);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('clay_language_changed' as any, handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('clay_language_changed' as any, handleCustomChange);
    };
  }, [lang]);

  const t = (key: string): string => {
    // 1. Direct translation
    if (dictionary[lang]?.[key]) {
      return dictionary[lang][key];
    }

    // 2. Intelligent dialectal fallback
    if (lang === 'hinglish' && dictionary['hi']?.[key]) return dictionary['hi'][key];
    if (lang === 'thanglish' && dictionary['ta']?.[key]) return dictionary['ta'][key];
    if (lang === 'roman_ur' && dictionary['hyd']?.[key]) return dictionary['hyd'][key];
    if (lang === 'ks' && dictionary['ur']?.[key]) return dictionary['ur'][key];
    if (lang === 'kok' && dictionary['mr']?.[key]) return dictionary['mr'][key];
    if (lang === 'doi' && dictionary['hi']?.[key]) return dictionary['hi'][key];
    if (lang === 'tcy' && dictionary['kn']?.[key]) return dictionary['kn'][key];
    if (lang === 'sd' && dictionary['hi']?.[key]) return dictionary['hi'][key];

    // 3. Fallback to English, then the key itself
    return dictionary['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
