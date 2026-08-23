import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Code, 
  Globe, 
  ArrowUpRight, 
  Filter,
  Check,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import ReadSectionButton from './ReadSectionButton';
import CopyCodeButton from './CopyCodeButton';

interface AITool {
  name: string;
  category: 'text' | 'image' | 'video' | 'audio' | 'coding' | 'search';
  description: string;
  freeStatus: 'Truly Free' | 'Free Tier';
  bestFor: string;
  url: string;
}

export default function AIToolsList() {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const aiTools: AITool[] = [
    // 1. Text & Writing
    {
      name: "ChatGPT",
      category: "text",
      description: "The pioneering conversational partner. Unbeatable for general text generation, logic, and brain-storming.",
      freeStatus: "Free Tier",
      bestFor: "Creative drafting & editing",
      url: "https://chatgpt.com"
    },
    {
      name: "Claude",
      category: "text",
      description: "Incredibly eloquent, nuance-aware writing assistant. Excellent for text summaries, editing and professional prose.",
      freeStatus: "Free Tier",
      bestFor: "Deep writing & coding",
      url: "https://claude.ai"
    },
    {
      name: "CoPilot",
      category: "text",
      description: "Microsoft's online workspace helper. Deeply integrated with web queries and office-style answers.",
      freeStatus: "Free Tier",
      bestFor: "Work assistant & lookup",
      url: "https://copilot.microsoft.com"
    },
    {
      name: "DeepL",
      category: "text",
      description: "The world's most accurate machine translator that captures context, idioms, and nuances perfectly.",
      freeStatus: "Free Tier",
      bestFor: "Precise translation",
      url: "https://www.deepl.com"
    },
    {
      name: "Grammarly AI",
      category: "text",
      description: "Spelling, punctuation, tone adjustments, and rewrites directly within your web browser.",
      freeStatus: "Free Tier",
      bestFor: "Polishing sentences",
      url: "https://www.grammarly.com"
    },
    {
      name: "Hemingway Editor",
      category: "text",
      description: "AI-assisted writing grader. Highlights overly complicated sentences, passive voice, and complex structures.",
      freeStatus: "Truly Free",
      bestFor: "Clear, bold writing",
      url: "https://hemingwayapp.com"
    },
    {
      name: "Notion AI",
      category: "text",
      description: "Brainstorm, summarize, write, and organize notes directly inside your standard Notion workspaces.",
      freeStatus: "Free Tier",
      bestFor: "Document organization",
      url: "https://www.notion.so"
    },

    // 2. Image & Design
    {
      name: "Leonardo.ai",
      category: "image",
      description: "An incredible image generator with robust control parameters. Perfect for high-fidelity assets, art, and concept styles.",
      freeStatus: "Free Tier",
      bestFor: "High-quality custom art",
      url: "https://leonardo.ai"
    },
    {
      name: "Microsoft Designer",
      category: "image",
      description: "Harnesses DALL-E 3 power for free. Generate detailed, photo-realistic art or graphic layouts in seconds.",
      freeStatus: "Truly Free",
      bestFor: "DALL-E 3 prompt designs",
      url: "https://designer.microsoft.com"
    },
    {
      name: "Canva Magic Studio",
      category: "image",
      description: "Generates templates, vectors, slide content, and photo edits using simple conversational descriptions.",
      freeStatus: "Free Tier",
      bestFor: "Quick templates & social posts",
      url: "https://www.canva.com"
    },
    {
      name: "Adobe Firefly",
      category: "image",
      description: "Ethically trained commercial-safe generation. Generative fill, vector recoloring, and high-quality image generator.",
      freeStatus: "Free Tier",
      bestFor: "Safe commercial assets",
      url: "https://firefly.adobe.com"
    },
    {
      name: "Lexica.art",
      category: "image",
      description: "A gorgeous lookup directory and stable diffusion generator. Find prompts used for stunning generated art.",
      freeStatus: "Free Tier",
      bestFor: "Prompt search & inspiration",
      url: "https://lexica.art"
    },
    {
      name: "Photoroom",
      category: "image",
      description: "E-commerce-focused AI. Removes distracting backgrounds and constructs custom professional backdrops in 1 tap.",
      freeStatus: "Free Tier",
      bestFor: "Product photo cleanups",
      url: "https://www.photoroom.com"
    },
    {
      name: "Craiyon",
      category: "image",
      description: "Unlimited free generation. Formerly known as DALL-E mini. Fun for testing wild ideas rapidly without credits.",
      freeStatus: "Truly Free",
      bestFor: "Unlimited quick drafts",
      url: "https://www.craiyon.com"
    },
    {
      name: "Vectorizer.ai",
      category: "image",
      description: "Turn pixelated, fuzzy PNG/JPG layouts into crisp, infinitely scalable SVG vectors with clean curves.",
      freeStatus: "Free Tier",
      bestFor: "Vector conversions",
      url: "https://vectorizer.ai"
    },

    // 3. Video & Animation
    {
      name: "Luma Dream Machine",
      category: "video",
      description: "Generate highly realistic, cinematic video clips from simple text or reference images with dynamic motion.",
      freeStatus: "Free Tier",
      bestFor: "Hyper-realistic clips",
      url: "https://lumalabs.ai/dream-machine"
    },
    {
      name: "Kling AI",
      category: "video",
      description: "Creates stunningly long, highly physical cinematic videos with impressive action accuracy from text.",
      freeStatus: "Free Tier",
      bestFor: "Physics-compliant motion",
      url: "https://klingai.com"
    },
    {
      name: "Runway Gen-2",
      category: "video",
      description: "The classic AI video generation system. Transform standard videos or write new ones from single text prompts.",
      freeStatus: "Free Tier",
      bestFor: "Artistic video styles",
      url: "https://runwayml.com"
    },
    {
      name: "Pika",
      category: "video",
      description: "Animate static images, replace specific elements, or inflate motion parameters with amazing ease.",
      freeStatus: "Free Tier",
      bestFor: "Micro-animations & effects",
      url: "https://pika.art"
    },
    {
      name: "HeyGen",
      category: "video",
      description: "Generate human-looking avatars that speak your script with matching lip movements and professional micro-expressions.",
      freeStatus: "Free Tier",
      bestFor: "Avatar spokespersons",
      url: "https://www.heygen.com"
    },
    {
      name: "CapCut AI",
      category: "video",
      description: "Outstanding automated captions, face retouching, video stabilization, and video background removals.",
      freeStatus: "Truly Free",
      bestFor: "Social media edits",
      url: "https://www.capcut.com"
    },
    {
      name: "Veed.io",
      category: "video",
      description: "Browser-based video editing engine. Includes automatic subtitle syncing, translation, and text-to-speech overlays.",
      freeStatus: "Free Tier",
      bestFor: "Quick subtitles & trim",
      url: "https://www.veed.io"
    },

    // 4. Audio & Music
    {
      name: "Suno AI",
      category: "audio",
      description: "Type in any genre and lyrics to receive a full, high-fidelity radio-ready song with stunning vocals.",
      freeStatus: "Free Tier",
      bestFor: "Full song generation",
      url: "https://suno.com"
    },
    {
      name: "Udio",
      category: "audio",
      description: "Generate mind-blowing musical tracks with deep customization of instrument layers, structure, and vocal harmonies.",
      freeStatus: "Free Tier",
      bestFor: "Vocal tracks & instrumentals",
      url: "https://www.udio.com"
    },
    {
      name: "ElevenLabs",
      category: "audio",
      description: "The gold standard in voice cloning and realistic text-to-speech. Features natural breathing, pauses, and pacing.",
      freeStatus: "Free Tier",
      bestFor: "Realistic narration voices",
      url: "https://elevenlabs.io"
    },
    {
      name: "Adobe Podcast Enhance",
      category: "audio",
      description: "Magic speech cleanup. Transforms low-quality, echoey phone recordings into clear, studio-level audio.",
      freeStatus: "Truly Free",
      bestFor: "Cleaning dirty voice tracks",
      url: "https://podcast.adobe.com/enhance"
    },
    {
      name: "Speechify",
      category: "audio",
      description: "Listen to any article, document, or textbook narrated in highly realistic celebrity or natural voices.",
      freeStatus: "Free Tier",
      bestFor: "Text reading aloud",
      url: "https://speechify.com"
    },
    {
      name: "Voice.ai",
      category: "audio",
      description: "Real-time AI voice changer with hundreds of community-crafted character voices to apply to your microphone.",
      freeStatus: "Free Tier",
      bestFor: "Microphone filters",
      url: "https://voice.ai"
    },
    {
      name: "LALAL.AI",
      category: "audio",
      description: "Stem splitter. Separates vocal lines, bass, drums, and piano tracks from any standard MP3 or audio file.",
      freeStatus: "Free Tier",
      bestFor: "Isolating vocals & beats",
      url: "https://www.lalal.ai"
    },
    {
      name: "MusicFX",
      category: "audio",
      description: "Google's experimental sound lab. Generate loopable instrumental tracks and soundscapes from text descriptors.",
      freeStatus: "Truly Free",
      bestFor: "Background loops & pads",
      url: "https://aitestkitchen.withgoogle.com/tools/music-fx"
    },

    // 5. Coding & Productivity
    {
      name: "Cursor",
      category: "coding",
      description: "An AI-first code editor fork of VS Code. Features smart auto-complete, multi-file edits, and inline chat.",
      freeStatus: "Free Tier",
      bestFor: "Software development",
      url: "https://www.cursor.com"
    },
    {
      name: "v0 by Vercel",
      category: "coding",
      description: "Write layout requests in chat and receive polished React, Tailwind, and Radix UI components immediately.",
      freeStatus: "Free Tier",
      bestFor: "UI mockup creation",
      url: "https://v0.dev"
    },
    {
      name: "Replit Agent",
      category: "coding",
      description: "Build, configure, and host complete full-stack web applications straight from conversational prompts.",
      freeStatus: "Free Tier",
      bestFor: "App prototyping",
      url: "https://replit.com"
    },
    {
      name: "Phind",
      category: "coding",
      description: "A search engine designed explicitly for software developers. Synthesizes documentation and provides code examples.",
      freeStatus: "Truly Free",
      bestFor: "Developer lookups",
      url: "https://www.phind.com"
    },
    {
      name: "Gamma App",
      category: "coding",
      description: "Generate stunning slides, presentations, documents, or brief web page designs in under a minute.",
      freeStatus: "Free Tier",
      bestFor: "Quick presentations",
      url: "https://gamma.app"
    },
    {
      name: "Taskade AI",
      category: "coding",
      description: "Productivity dashboard with AI mind-mapping, structural task delegation, and multiple visual agent helpers.",
      freeStatus: "Free Tier",
      bestFor: "Task flow brainstorming",
      url: "https://www.taskade.com"
    },
    {
      name: "Otter.ai",
      category: "coding",
      description: "Listens to Zoom/Meet meetings, transcribes the conversation, and highlights actionable takeaways automatically.",
      freeStatus: "Free Tier",
      bestFor: "Meeting minutes",
      url: "https://otter.ai"
    },

    // 6. Search & Research
    {
      name: "Perplexity",
      category: "search",
      description: "Conversational answer engine. Searches the live web, cross-references sources, and provides structured footnotes.",
      freeStatus: "Free Tier",
      bestFor: "Live web research",
      url: "https://www.perplexity.ai"
    },
    {
      name: "Gemini",
      category: "search",
      description: "Google's direct conversational model. Has native access to real-time Google search indices and YouTube data.",
      freeStatus: "Free Tier",
      bestFor: "Grounded Google searches",
      url: "https://gemini.google.com"
    },
    {
      name: "Felo",
      category: "search",
      description: "Cross-lingual search engine. Searches sources globally across different languages and translates insights for you.",
      freeStatus: "Truly Free",
      bestFor: "Global information lookup",
      url: "https://felo.ai"
    },
    {
      name: "Consensus",
      category: "search",
      description: "AI search engine for academic papers. Answers queries strictly based on peer-reviewed science databases.",
      freeStatus: "Free Tier",
      bestFor: "Scientific citations",
      url: "https://consensus.app"
    },
    {
      name: "SciSpace",
      category: "search",
      description: "Allows you to upload papers and have a conversational AI assistant explain complex equations, charts, and terms.",
      freeStatus: "Free Tier",
      bestFor: "Explaining scientific PDFs",
      url: "https://typeset.io"
    },
    {
      name: "DeepSeek",
      category: "text",
      description: "World-class open source conversational and reasoning models. Renowned for extremely powerful logical answers.",
      freeStatus: "Truly Free",
      bestFor: "Logical reasoning & code",
      url: "https://www.deepseek.com"
    },
    {
      name: "Flux.1",
      category: "image",
      description: "State-of-the-art open source image generation model. Highly accurate prompt following and text rendering inside images.",
      freeStatus: "Free Tier",
      bestFor: "Unmatched photorealism",
      url: "https://huggingface.co/spaces/black-forest-labs/FLUX.1-schnell"
    },
    {
      name: "Viggle AI",
      category: "video",
      description: "Animate any static character or drawing with matching human movements and dance scripts.",
      freeStatus: "Free Tier",
      bestFor: "Character motion mixing",
      url: "https://viggle.ai"
    },
    {
      name: "Stable Audio",
      category: "audio",
      description: "Generate high-quality background audio tracks, sound effects, or custom beats from text descriptors.",
      freeStatus: "Free Tier",
      bestFor: "Ambient music & SFX",
      url: "https://stableaudio.com"
    },
    {
      name: "Project IDX",
      category: "coding",
      description: "Google's browser-based web development environment, fully integrated with Gemini assistance.",
      freeStatus: "Truly Free",
      bestFor: "Full-stack web workspace",
      url: "https://idx.dev"
    },
    {
      name: "Elicit",
      category: "search",
      description: "AI research assistant that automates literature reviews, find papers, and summarizes scientific claims.",
      freeStatus: "Free Tier",
      bestFor: "Literature synthesis",
      url: "https://elicit.com"
    }
  ];

  const categories = [
    { id: 'all', label: lang === 'en' ? 'All Tools' : 'Sabh Milake', icon: Cpu },
    { id: 'text', label: lang === 'en' ? 'Writing' : 'Likhna & Bolna', icon: BookOpen },
    { id: 'image', label: lang === 'en' ? 'Image & Design' : 'Tasveer & Design', icon: ImageIcon },
    { id: 'video', label: lang === 'en' ? 'Video' : 'Video Banana', icon: Video },
    { id: 'audio', label: lang === 'en' ? 'Audio & Music' : 'Awaaz & Gaane', icon: Music },
    { id: 'coding', label: lang === 'en' ? 'Coding & Productivity' : 'Coding & Kaam-Kaaj', icon: Code },
    { id: 'search', label: lang === 'en' ? 'Search & Research' : 'Dhoondna (Research)', icon: Globe }
  ];

  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyLink = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(name);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section id="ai-tools-directory" className="scroll-mt-16 py-16 bg-[#FDFBF7] border-t border-brand-slate/5 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Block with Editorial Vibe */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sand rounded-full text-[10px] font-mono font-bold text-brand-amber uppercase tracking-wider mb-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
            <Sparkles className="w-3 h-3" />
            <span>{lang === 'en' ? "Curated Directory" : "Chune So Tools"}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-charcoal mb-4">
            {lang === 'en' ? "The Free AI Toolbox" : "Muft AI ke Hoshiyar Tools"}
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed text-center">
            {lang === 'en' ? (
              <>
                A hand-picked collection of <strong>40+ highly capable, genuinely free, or free-tier (freemium) AI systems</strong>. Cut through the noise and start experimenting immediately without opening your wallet.
              </>
            ) : (
              <>
                Ekdum mast chun ke nikale so <strong>40+ khatarnak aur bilkul muft (ya free-tier) AI tools</strong> ka khazana. Bina ek paisa kharch kare abhi ke abhi try kar sako miya!
              </>
            )}
          </p>
          <div className="flex justify-center mt-4">
            <ReadSectionButton sectionId="ai-tools-directory" />
          </div>
        </div>

        {/* Search and Filters Bento Grid */}
        <div className="bg-white border border-brand-slate/10 rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-brand-sand/30 rounded-full blur-2xl pointer-events-none" />
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-sm shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              placeholder={lang === 'en' ? "Search tools, use cases, or tags..." : "Tools ya unke kaam dhoondo..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-brand-slate/10 rounded-xl font-sans text-xs focus:outline-none focus:ring-1 focus:ring-brand-amber transition-all placeholder:text-brand-muted"
            />
          </div>

          {/* Category Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0 scrollbar-none scroll-smooth">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-display text-[10px] font-bold cursor-pointer transition-all shrink-0 active:scale-95 border ${
                    isSelected 
                      ? 'bg-brand-charcoal text-white border-brand-charcoal shadow-sm' 
                      : 'bg-brand-sand/30 hover:bg-brand-sand/60 text-brand-charcoal border-brand-slate/5'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Results Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                layout
                key={tool.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-brand-slate/10 rounded-2xl p-5 flex flex-col justify-between group hover:border-[#E07A5F]/30 hover:shadow-md transition-all relative overflow-hidden skeuo-raised"
              >
                {/* Visual accent background flare */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-sand/10 group-hover:bg-[#E07A5F]/5 rounded-full blur-xl pointer-events-none transition-colors" />

                <div>
                  {/* Top line with badges */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="font-display font-extrabold text-sm text-brand-charcoal group-hover:text-brand-amber transition-colors">
                      {tool.name}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold tracking-wider ${
                      tool.freeStatus === 'Truly Free' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-brand-sand/60 text-brand-charcoal/80 border border-brand-slate/5'
                    }`}>
                      {tool.freeStatus === 'Truly Free' 
                        ? (lang === 'en' ? 'Truly Free' : 'Ekdum Muft') 
                        : (lang === 'en' ? 'Free Tier' : 'Muft / Paid')}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] leading-relaxed text-brand-slate mb-4 min-h-[48px] text-left">
                    {tool.description}
                  </p>
                </div>

                {/* Bottom line: Best For & Links */}
                <div className="pt-3 border-t border-brand-slate/5 mt-auto flex items-center justify-between gap-2 text-left">
                  <div className="overflow-hidden">
                    <span className="text-[9px] font-mono text-brand-muted uppercase block tracking-wider">
                      {lang === 'en' ? "Best For" : "Kiske Liye"}
                    </span>
                    <span className="text-[10px] font-bold text-brand-charcoal block truncate">
                      {tool.bestFor}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <CopyCodeButton
                      text={tool.url}
                      label={lang === 'en' ? "Copy" : "Copy"}
                      variant="compact"
                      showIconOnly={true}
                      title={lang === 'en' ? `Copy link for ${tool.name}` : `${tool.name} ka link copy karo`}
                    />
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer noopener"
                      className="p-1.5 bg-brand-charcoal hover:bg-[#E07A5F] rounded-lg text-white transition-colors cursor-pointer flex items-center justify-center shadow-sm"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty Search State */}
        {filteredTools.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white border border-brand-slate/10 rounded-2xl"
          >
            <div className="w-12 h-12 bg-brand-sand rounded-2xl flex items-center justify-center text-brand-muted mx-auto mb-3">
              <Filter className="w-5 h-5" />
            </div>
            <h4 className="font-display font-extrabold text-sm text-brand-charcoal">
              {lang === 'en' ? "No AI Tools found" : "Koi Tool Nai Mila miya!"}
            </h4>
            <p className="text-[11px] text-brand-muted mt-1">
              {lang === 'en' 
                ? "Try resetting your filters or typing another query." 
                : "Kuch dusra naam likh ke dhoond ke dekho."}
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
}
