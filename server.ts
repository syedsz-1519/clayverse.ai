import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy or safe initialization for GoogleGenAI
function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON body parsing with support for audio/image payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // =================================================================
  // 1. GEMINI MULTI-TURN CHAT & SEARCH GROUNDING & THINKING
  // =================================================================
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const {
        messages = [],
        model = 'gemini-3.5-flash',
        systemInstruction,
        useSearch = false,
        thinking = false,
        language = 'en',
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is not configured in the environment.',
        });
      }

      const ai = getGenAI();

      // Selected model verification
      let chosenModel = model;
      if (thinking) {
        chosenModel = 'gemini-3.1-pro-preview';
      }

      // Format contents for multi-turn history
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      // Base configuration
      const config: any = {};

      const languageNames: Record<string, string> = {
        en: 'clear, encouraging English',
        hinglish: 'conversational Hinglish (Hindi in Roman script, e.g. "AI koi jadoo nahi hai, patterns seekhta hai")',
        thanglish: 'conversational Thanglish (Tamil in Roman script, e.g. "AI romba simple-ah purinjikonga")',
        roman_ur: 'conversational Roman Urdu (Urdu in Roman script)',
        hyd: 'authentic, friendly Hyderabadi Urdu (e.g. "Arey miya, yaaron, bina tension ke samjho")',
        hi: 'Hindi (हिन्दी)',
        te: 'Telugu (తెలుగు)',
        ta: 'Tamil (தமிழ்)',
        ur: 'Urdu (اردو)',
        bn: 'Bengali (বাংলা)',
        mr: 'Marathi (मराठी)',
        gu: 'Gujarati (ગુજરાતી)',
        kn: 'Kannada (ಕನ್ನಡ)',
        or: 'Odia (ଓଡ଼ିଆ)',
        ml: 'Malayalam (മലയാളം)',
        pa: 'Punjabi (ਪੰਜਾਬੀ)',
        as: 'Assamese (অসমীয়া)',
        mai: 'Maithili (मैथिली)',
      };

      const targetLang = languageNames[language] || language || 'clear, encouraging English';

      const defaultSystem = `You are Clay, the warm, tactile, terracotta stop-motion AI tutor and chatbot for the Clayverse AI learning platform.
Your name is Clay. You love making artificial intelligence, machine learning, neural networks, transformers, prompting, RAG, and technology concepts delightfully intuitive and 100% beginner-safe.
When explaining, always use vivid real-world analogies (e.g., teaching a child to recognize dogs, kitchen recipes, library assistants, sorting beads).
Respond in ${targetLang}.
Keep your tone warm, enthusiastic, supportive, and completely free of confusing mathematical jargon unless immediately grounded with an intuitive physical metaphor.
If the user asks code or math questions, provide clean, copyable examples with brief explanations.`;

      config.systemInstruction = systemInstruction || defaultSystem;

      // Add Search Grounding if enabled
      if (useSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      // Add High Thinking mode if requested
      if (thinking && chosenModel === 'gemini-3.1-pro-preview') {
        config.thinkingConfig = {
          thinkingLevel: ThinkingLevel.HIGH,
        };
      }

      const response = await ai.models.generateContent({
        model: chosenModel,
        contents,
        config,
      });

      // Extract parts to separate thinking/reasoning from final content
      const parts = response.candidates?.[0]?.content?.parts || [];
      const thoughtParts = parts.filter((p: any) => p.thought);
      const textParts = parts.filter((p: any) => !p.thought);
      
      const thought = thoughtParts.map((p: any) => p.text).join('') || '';
      const reply = textParts.map((p: any) => p.text).join('') || response.text || '';

      // Extract search grounding metadata if available
      const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources = searchChunks
        .map((chunk: any) => chunk.web)
        .filter(Boolean)
        .map((web: any) => ({
          title: web.title || 'Web Reference',
          uri: web.uri || '',
        }));

      res.json({
        reply,
        thought,
        sources: webSources,
        model: chosenModel,
        grounded: useSearch && webSources.length > 0,
      });
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate response from Gemini',
      });
    }
  });

  // =================================================================
  // 2. AUDIO TRANSCRIPTION (gemini-3.5-flash)
  // =================================================================
  app.post('/api/gemini/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm', language = 'en', prompt } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: 'Missing audio data' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const ai = getGenAI();

      const instruction = prompt || `Please listen carefully to this audio recording and transcribe the spoken words accurately.
Provide only the clean, transcribed text without adding meta-commentary or disclaimers. The speaker may be speaking English, Telugu, or Hyderabadi Urdu.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: audioBase64,
              },
            },
            {
              text: instruction,
            },
          ],
        },
      });

      res.json({
        transcript: response.text || '',
      });
    } catch (err: any) {
      console.error('Audio transcription error:', err);
      res.status(500).json({
        error: err.message || 'Failed to transcribe audio with Gemini',
      });
    }
  });

  // =================================================================
  // 3. VEO VIDEO GENERATION (veo-3.1-fast-generate-preview)
  // =================================================================
  app.post('/api/gemini/veo/generate', async (req, res) => {
    try {
      const {
        prompt,
        imageBase64,
        mimeType = 'image/png',
        aspectRatio = '16:9',
      } = req.body;

      if (!prompt && !imageBase64) {
        return res.status(400).json({ error: 'Please provide either a prompt or an image.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(400).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const ai = getGenAI();

      const videoParams: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Smooth, high definition visual animation',
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
        },
      };

      if (imageBase64) {
        videoParams.image = {
          imageBytes: imageBase64,
          mimeType: mimeType || 'image/png',
        };
      }

      const operation = await ai.models.generateVideos(videoParams);

      res.json({
        operationName: operation.name,
        done: operation.done || false,
      });
    } catch (err: any) {
      console.error('Veo video generation error:', err);
      res.status(500).json({
        error: err.message || 'Failed to start video generation',
      });
    }
  });

  // Polling Veo Video Generation Status
  app.get('/api/gemini/veo/status', async (req, res) => {
    try {
      const operationName = req.query.operationName as string;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const ai = getGenAI();
      const operation = await ai.operations.getVideosOperation({
        operation: { name: operationName } as any,
      });

      if (operation.done) {
        const videoResponse: any = operation.response;
        const generatedVideo = videoResponse?.generatedVideos?.[0];
        const videoUri = generatedVideo?.video?.uri;

        if (videoUri) {
          // Fetch the video content via SDK download to avoid CORS or auth issues on client
          const downloadRes = await fetch(videoUri, {
            headers: {
              'x-goog-api-key': process.env.GEMINI_API_KEY || '',
            },
          });
          const arrayBuffer = await downloadRes.arrayBuffer();
          const base64Video = Buffer.from(arrayBuffer).toString('base64');
          return res.json({
            done: true,
            videoBase64: `data:video/mp4;base64,${base64Video}`,
          });
        }

        return res.json({
          done: true,
          videoBase64: null,
          metadata: videoResponse,
        });
      }

      res.json({
        done: false,
        metadata: operation.metadata,
      });
    } catch (err: any) {
      console.error('Veo status check error:', err);
      res.status(500).json({
        error: err.message || 'Failed to retrieve video operation status',
      });
    }
  });

  // =================================================================
  // 4. RAPID CONCEPT EXPLAINER & METAPHOR GENERATOR
  // =================================================================
  app.post('/api/gemini/explain', async (req, res) => {
    try {
      const { topic, context, language = 'en', depth = 'simple' } = req.body;
      if (!topic) {
        return res.status(400).json({ error: 'topic is required' });
      }

      const ai = getGenAI();
      const model = depth === 'deep' ? 'gemini-3.1-pro-preview' : 'gemini-3.1-flash-lite';

      const prompt = `Provide an ultra-clear, memorable explanation for the AI concept: "${topic}".
Context: ${context || 'General Artificial Intelligence Education'}
Language: ${language === 'te' ? 'Telugu (తెలుగు)' : language === 'hyd' ? 'Hyderabadi Urdu (friendly Hyderabadi dialect)' : 'English'}
Style:
- 1 vivid real-world metaphor (e.g. kitchen recipe, library assistant, traffic controller)
- 2 bullet points on how it works
- 1 common pitfall or misconception to avoid`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      res.json({
        explanation: response.text || '',
        model,
      });
    } catch (err: any) {
      console.error('Gemini explain error:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate explanation',
      });
    }
  });

  // =================================================================
  // VITE MIDDLEWARE SETUP
  // =================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
