import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'node:http';

interface GeminiRequest extends IncomingMessage {
  body?: Record<string, any>;
}

const languageNames: Record<string, string> = {
  en: 'clear, encouraging English',
  hinglish: 'conversational Hinglish (Hindi in Roman script)',
  thanglish: 'conversational Thanglish (Tamil in Roman script)',
  roman_ur: 'conversational Roman Urdu (Urdu in Roman script)',
  hyd: 'authentic, friendly Hyderabadi Urdu',
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

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload));
}

function getAi() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

export default async function handler(request: GeminiRequest, response: ServerResponse) {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  const route = pathname.replace(/^\/api\/gemini\/?/, '');
  const body = request.body || {};

  if (route === 'chat' && request.method === 'POST') {
    if (!process.env.GEMINI_API_KEY) {
      return sendJson(response, 400, { error: 'GEMINI_API_KEY is not configured in the environment.' });
    }

    try {
      const {
        messages = [],
        model = 'gemini-3.5-flash',
        systemInstruction,
        useSearch = false,
        thinking = false,
        language = 'en',
      } = body;
      const chosenModel = thinking ? 'gemini-3.1-pro-preview' : model;
      const contents = messages.map((message: { role: string; content: string }) => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      }));
      const config: Record<string, any> = {
        systemInstruction: systemInstruction || `You are Clay, the warm, tactile, terracotta stop-motion AI tutor and chatbot for the Clayverse AI learning platform. Explain AI concepts with vivid real-world analogies, keep explanations beginner-safe, and respond in ${languageNames[language] || language || 'clear, encouraging English'}.`,
      };

      if (useSearch) config.tools = [{ googleSearch: {} }];
      if (thinking) config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };

      const result = await getAi().models.generateContent({ model: chosenModel, contents, config });
      const parts = result.candidates?.[0]?.content?.parts || [];
      const thought = parts.filter((part: any) => part.thought).map((part: any) => part.text).join('');
      const reply = parts.filter((part: any) => !part.thought).map((part: any) => part.text).join('') || result.text || '';
      const sources = (result.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .map((chunk: any) => chunk.web)
        .filter(Boolean)
        .map((web: any) => ({ title: web.title || 'Web Reference', uri: web.uri || '' }));

      return sendJson(response, 200, { reply, thought, sources, model: chosenModel, grounded: useSearch && sources.length > 0 });
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      return sendJson(response, 500, { error: error.message || 'Failed to generate response from Gemini' });
    }
  }

  if (route === 'transcribe' && request.method === 'POST') {
    if (!body.audioBase64) return sendJson(response, 400, { error: 'Missing audio data' });
    if (!process.env.GEMINI_API_KEY) return sendJson(response, 400, { error: 'GEMINI_API_KEY is not configured' });

    try {
      const result = await getAi().models.generateContent({
        model: 'gemini-3.5-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: body.mimeType || 'audio/webm', data: body.audioBase64 } },
            { text: body.prompt || 'Transcribe the spoken words accurately. Return only the clean transcript; the speaker may use English, Telugu, or Hyderabadi Urdu.' },
          ],
        },
      });
      return sendJson(response, 200, { transcript: result.text || '' });
    } catch (error: any) {
      console.error('Audio transcription error:', error);
      return sendJson(response, 500, { error: error.message || 'Failed to transcribe audio with Gemini' });
    }
  }

  if (route === 'veo/generate' && request.method === 'POST') {
    if (!body.prompt && !body.imageBase64) return sendJson(response, 400, { error: 'Please provide either a prompt or an image.' });
    if (!process.env.GEMINI_API_KEY) return sendJson(response, 400, { error: 'GEMINI_API_KEY is not configured' });

    try {
      const videoParams: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: body.prompt || 'Smooth, high definition visual animation',
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: body.aspectRatio === '9:16' ? '9:16' : '16:9' },
      };
      if (body.imageBase64) {
        videoParams.image = { imageBytes: body.imageBase64, mimeType: body.mimeType || 'image/png' };
      }
      const operation = await getAi().models.generateVideos(videoParams);
      return sendJson(response, 200, { operationName: operation.name, done: operation.done || false });
    } catch (error: any) {
      console.error('Veo video generation error:', error);
      return sendJson(response, 500, { error: error.message || 'Failed to start video generation' });
    }
  }

  if (route === 'veo/status' && request.method === 'GET') {
    const operationName = new URL(request.url || '/', 'http://localhost').searchParams.get('operationName');
    if (!operationName) return sendJson(response, 400, { error: 'operationName is required' });
    if (!process.env.GEMINI_API_KEY) return sendJson(response, 400, { error: 'GEMINI_API_KEY is not configured' });

    try {
      const operation = await getAi().operations.getVideosOperation({ operation: { name: operationName } as any });
      if (!operation.done) return sendJson(response, 200, { done: false, metadata: operation.metadata });

      const videoResponse: any = operation.response;
      const videoUri = videoResponse?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) return sendJson(response, 200, { done: true, videoBase64: null, metadata: videoResponse });

      const download = await fetch(videoUri, { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY } });
      if (!download.ok) throw new Error(`Video download failed: ${download.status}`);
      const video = Buffer.from(await download.arrayBuffer()).toString('base64');
      return sendJson(response, 200, { done: true, videoBase64: `data:video/mp4;base64,${video}` });
    } catch (error: any) {
      console.error('Veo status check error:', error);
      return sendJson(response, 500, { error: error.message || 'Failed to retrieve video operation status' });
    }
  }

  if (route === 'explain' && request.method === 'POST') {
    if (!body.topic) return sendJson(response, 400, { error: 'topic is required' });
    if (!process.env.GEMINI_API_KEY) return sendJson(response, 400, { error: 'GEMINI_API_KEY is not configured' });

    try {
      const model = body.depth === 'deep' ? 'gemini-3.1-pro-preview' : 'gemini-3.1-flash-lite';
      const result = await getAi().models.generateContent({
        model,
        contents: `Explain the AI concept "${body.topic}" in ${body.language || 'English'} using one vivid real-world metaphor, two bullet points on how it works, and one common pitfall. Context: ${body.context || 'General Artificial Intelligence Education'}`,
      });
      return sendJson(response, 200, { explanation: result.text || '', model });
    } catch (error: any) {
      console.error('Gemini explain error:', error);
      return sendJson(response, 500, { error: error.message || 'Failed to generate explanation' });
    }
  }

  return sendJson(response, route ? 404 : 405, { error: 'Gemini endpoint not found' });
}