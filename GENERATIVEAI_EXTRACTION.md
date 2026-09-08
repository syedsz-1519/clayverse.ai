# GenerativeAI.tsx - Text Extraction & Translation Key Mapping

## Hardcoded Text Inventory

### Section 1: genExamples Array (Dynamic Content)

#### Item 1: Text/ChatGPT
- **id**: 'text' (no translation)
- **title**: 
  - EN: `ChatGPT (Text)`
  - HI: `ChatGPT (Aasaan Text)`
  - **Key**: `generativeAI.examples.text.title`
  
- **role**: 
  - EN: `Writes prose, poems, and clean code.`
  - HI: `Mazmoon, shayari, aur saaf code likhta hai.`
  - **Key**: `generativeAI.examples.text.role`
  
- **preview**: 
  - EN: `Write a warm, simple haiku about a coffee shop on a rainy afternoon...`
  - HI: `Baarish ki dopahar mein ek garam chai ki dukaan pe shayari likho...`
  - **Key**: `generativeAI.examples.text.preview`
  
- **output**: 
  - EN: `Soft rain taps the glass,\nWarm steam rises from the cup,\nSilence shares the space.`
  - HI: `Garam chai ki pyaali ho,\nBaarish ka thanda mausam ho,\nBas thodi si khamoshi ho.`
  - **Key**: `generativeAI.examples.text.output`

#### Item 2: Image/Midjourney
- **title**: 
  - EN: `Midjourney (Images)`
  - HI: `Midjourney (Photos)`
  - **Key**: `generativeAI.examples.image.title`
  
- **role**: 
  - EN: `Drafts gorgeous digital illustrations.`
  - HI: `Bohot pyaari photos aur paintings banata hai.`
  - **Key**: `generativeAI.examples.image.role`
  
- **preview**: 
  - EN: `A tiny mouse sitting on a dandelion reading a miniature leather book, oil painting style...`
  - HI: `Ek chota sa chuha patti par baith ke kitabi panna palat raha hai, oil painting style...`
  - **Key**: `generativeAI.examples.image.preview`
  
- **output**: 
  - EN: `🎨 [Generates a soft, warm oil painting focusing on a spectacled field mouse turning pages under a glowing golden dandelion root]`
  - HI: `🎨 [Ek pyaari oil painting banti hai jisme chashma lagaya so chuha sunhare patti ke neeche baith ke kitabi panne palat raha hai]`
  - **Key**: `generativeAI.examples.image.output`

#### Item 3: Music/Suno
- **title**: 
  - EN: `Suno (Music)`
  - HI: `Suno (Gaane aur Music)`
  - **Key**: `generativeAI.examples.music.title`
  
- **role**: 
  - EN: `Creates songs with vocals and melodies.`
  - HI: `Awaaz aur dhun ke sath naye gaane banata hai.`
  - **Key**: `generativeAI.examples.music.role`
  
- **preview**: 
  - EN: `A retro-wave track with acoustic guitars and synthesizers about driving into a golden sunset...`
  - HI: `Ek mast retro-wave track guitar aur synth ke sath jo shaam ke safar ke baare mein ho...`
  - **Key**: `generativeAI.examples.music.preview`
  
- **output**: 
  - EN: `🎵 [Synthesizes a warm, rhythmic 120bpm stereo track blending tactile fingerstyle guitar strumming with analog low-pass synthesizers]`
  - HI: `🎵 [Ek mast 120bpm stereo track banti hai jisme guitar ki dhun ke sath analog synthesizer ka heavy sound ghumta hai]`
  - **Key**: `generativeAI.examples.music.output`

---

### Section 2: Top Section (Bento Card 1)

#### Lesson Label & Title
- **lesson**: 
  - EN: `Lesson 06`
  - HI: `Sabak 06`
  - **Key**: `generativeAI.section1.lesson`

- **heading**: 
  - EN: `What is Generative AI?`
  - HI: `Generative AI Kya Hai?`
  - **Key**: `generativeAI.section1.heading`

#### Main Paragraph (with TechTooltip)
- **intro_en**: `Until recently, AI was mostly used to analyze, sort, or predict values (like spam or stock prices). But Generative AI — [TOOLTIP: Generative AI] — a modern branch of Artificial Intelligence designed to synthesize and output entirely new files, such as custom text, realistic images, and original musical tracks, rather than just analyzing existing ones — has opened up creative frontiers.`
  - **Key**: `generativeAI.section1.intro`

- **intro_hi**: `Pehle ke zamane mein AI sirf data analyze, sort, ya predict karne ke liye tha (jaise spam messages ya share market). Lekin Generative AI — Artificial Intelligence ki nayi branch hai jo bina purani files ko copy kiye, bilkul naye mazmoon, photos, aur gaane khud se likh aur bana sakti hai — isne dunya badal di hai.`
  - **Key**: `generativeAI.section1.intro_hi`

#### "In Practice" Glass Panel
- **inPractice_label**: 
  - EN: `In Practice`
  - HI: `Asli Zindagi Mein`
  - **Key**: `generativeAI.section1.inPractice.label`

- **inPractice_text**: 
  - EN: `Instead of just recognizing a picture of a cat, Generative AI has learned the "math map" of cats, allowing it to paint a brand-new illustration of a "cat floating in a zero-gravity space helmet" from scratch when asked.`
  - HI: `Billi ki photo pehchanna toh bacho ka khel hai yaaron. Generative AI billiyon ka poora "math map" dimaag mein bitha leta hai. Jab tum bolo "space helmet pehne so billi hawa mein udri", toh wo waisi billi ki bilkul nayi photo banake de deta hai.`
  - **Key**: `generativeAI.section1.inPractice.text`

---

### Section 3: Interactive Creation Simulator (Bento Card 2)

#### Labels & UI Text
- **creationSimulator_label**: 
  - EN: `Creation Simulator`
  - HI: `Creation Simulator` (no translation in original)
  - **Key**: `generativeAI.section2.creationSimulator`

- **promptInput_label**: 
  - EN: `Prompt Input`
  - HI: `Aapka Prompt`
  - **Key**: `generativeAI.section2.promptInput`

- **copyPromptLabel**: 
  - EN: `Copy Prompt`
  - HI: `Prompt Copy`
  - **Key**: `generativeAI.section2.copyPrompt`

- **copyOutputLabel**: 
  - EN: `Copy Output`
  - HI: `Output Copy`
  - **Key**: `generativeAI.section2.copyOutput`

- **successMessage**: 
  - EN: `✨ Successfully synthesized output`
  - HI: `✨ Model ne dhang se generate kar diya!`
  - **Key**: `generativeAI.section2.successMessage`

---

### Section 4: LLM Explanation (Bento Card 3)

#### Lesson Label & Title
- **lesson**: 
  - EN: `Lesson 07`
  - HI: `Sabak 07`
  - **Key**: `generativeAI.section3.lesson`

- **heading**: 
  - EN: `What is an LLM (Large Language Model)?`
  - HI: `LLM (Large Language Model) Kya Hai?`
  - **Key**: `generativeAI.section3.heading`

#### Main Paragraph (with TechTooltip)
- **intro**: 
  - EN: `A Large Language Model — a specific type of Generative AI model trained on massive oceans of written books, articles, and websites to predict the most logical next word in a sentence — powers modern conversational tools.`
  - HI: `Ek Large Language Model (LLM) — Generative AI ka wo model hai jisko dunya ki hazaaron kitabein aur websites ruttayi gayi hain, taake wo dhang ka agla word dimaag se bol sake — ye aajkal ke chatbots ko power karta hai.`
  - **Key**: `generativeAI.section3.intro`

#### Secondary Paragraph
- **explanation**: 
  - EN: `When you ask Claude, Gemini, or ChatGPT a question, they aren't looking up answers in a neat file drawer. They are running billions of tiny calculations to ask: "Given all human text I have digested, what is the most likely, helpful sequence of words to write next?"`
  - HI: `Jab tum Claude, Gemini ya ChatGPT se sawaal puchte ho, toh wo kisi diary mein se khol ke answer nahi dhoond rahe hain miya. Wo log billion calculations chalake puchte hain: "Puri dunya ka jo text main ne padha hai, uske mutabiq abhi likhne ke liye sabse sahi aur fayedemand words konse hain?"`
  - **Key**: `generativeAI.section3.explanation`

#### Right Side Icon Label
- **wordPredictor**: 
  - EN: `Word Predictor`
  - HI: `Word Predictor` (no translation in original)
  - **Key**: `generativeAI.section3.wordPredictor`

---

### Section 5: Developer Code Snippets

#### Section Header
- **codeSection_label**: 
  - EN: `Developer Code Snippets`
  - HI: `Developer Code Snippets` (no translation in original)
  - **Key**: `generativeAI.section4.label`

- **codeSection_title**: 
  - EN: `Calling LLMs & Multimodal Models`
  - HI: `LLM Models ko Code se Call Karna`
  - **Key**: `generativeAI.section4.title`

- **codeSection_subtitle**: 
  - EN: `TypeScript & Python SDKs`
  - HI: `TypeScript & Python SDKs` (no translation)
  - **Key**: `generativeAI.section4.subtitle`

#### TypeScript Snippet
- **typescript_label**: 
  - EN: `TypeScript / JavaScript (@google/genai)`
  - HI: `TypeScript / JavaScript (@google/genai)` (code reference, no translation)
  - **Key**: `generativeAI.section4.typescript.label`

- **typescript_description**: 
  - EN: `Standard streaming / non-streaming text synthesis in web backends.`
  - HI: `Web backends mein Gemini model se content generate karne ka clean snippet.`
  - **Key**: `generativeAI.section4.typescript.description`

- **typescript_copyLabel**: 
  - EN: `Copy TypeScript`
  - HI: `TypeScript Copy`
  - **Key**: `generativeAI.section4.typescript.copy`

#### cURL Snippet
- **curl_label**: 
  - EN: `cURL / REST API Endpoint`
  - HI: `cURL / REST API Endpoint` (no translation)
  - **Key**: `generativeAI.section4.curl.label`

- **curl_description**: 
  - EN: `Direct HTTP JSON request payload for terminal testing or Postman.`
  - HI: `Direct terminal ya command line se test karne ke liye cURL command.`
  - **Key**: `generativeAI.section4.curl.description`

- **curl_copyLabel**: 
  - EN: `Copy cURL Command`
  - HI: `cURL Copy`
  - **Key**: `generativeAI.section4.curl.copy`

---

## Total Translation Keys: 38 Keys

### Key Structure
```
generativeAI: {
  examples: {
    text: { title, role, preview, output },
    image: { title, role, preview, output },
    music: { title, role, preview, output }
  },
  section1: {
    lesson, heading, intro, intro_hi,
    inPractice: { label, text }
  },
  section2: {
    creationSimulator, promptInput, copyPrompt, copyOutput, successMessage
  },
  section3: {
    lesson, heading, intro, explanation, wordPredictor
  },
  section4: {
    label, title, subtitle,
    typescript: { label, description, copy },
    curl: { label, description, copy }
  }
}
```

---

## Code Snippets (NOT TRANSLATED - Programming language is universal)

### Snippet 1: TypeScript SDK
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function generateExplanation(topic: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Explain ${topic} in simple words with a real-world analogy.`,
    config: {
      temperature: 0.7,
      maxOutputTokens: 500,
    }
  });

  console.log(response.text);
}
```

### Snippet 2: cURL Command
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [{
      "parts": [{"text": "Explain the difference between Supervised and Unsupervised Learning"}]
    }]
  }'
```

---

## Next Steps
1. Create generativeAI.* keys in src/locales/en/common.json
2. Update GenerativeAI.tsx to use t() calls
3. Add translations to 7 language files
4. Test in all 8 languages
