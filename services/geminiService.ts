
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import type { DetectionResult } from '../types';

/* Removed outdated api key import from config */

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const analyzeAudio = async (audioFile: File): Promise<DetectionResult> => {
  try {
    /* Initialize GoogleGenAI directly with process.env.API_KEY inside the function */
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const audioPart = await fileToGenerativePart(audioFile);
    
    const prompt = `
      You are an expert audio analyst specializing in detecting AI-generated speech. 
      Analyze the provided audio file and determine if it is human or AI-generated.
      
      Look for:
      1. Spectral artifacts or metallic reverberations common in early TTS models.
      2. Perfect prosody or unnatural pauses (too consistent or absent).
      3. Consistent background noise floors that don't fluctuate naturally.
      4. Subtle glitches at phoneme boundaries.
      
      Classify as 'AI', 'Human', or 'Uncertain'.
      Identify the primary language being spoken.
      Provide 3-5 specific reasoning bullet points about pitch, prosody, pauses, or artifacts.
      
      Response must be in the specified JSON format.
    `;

    /* Updated to gemini-3-flash-preview for a faster, more cost-effective model suitable for the free tier. */
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }, audioPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: {
              type: Type.STRING,
              enum: ['AI', 'Human', 'Uncertain'],
              description: 'The classification label.',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score (0.0 to 1.0).',
            },
            explanation: {
              type: Type.STRING,
              description: 'Summary of the finding.',
            },
            reasoningPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific acoustic clues discovered.',
            },
            detectedLanguage: {
              type: Type.STRING,
              description: 'Primary language detected.',
            },
          },
          required: ['label', 'confidence', 'explanation', 'reasoningPoints'],
        },
      },
    });

    /* Properly access text property and handle potential undefined value */
    const text = response.text;
    if (!text) {
      throw new Error('No analysis text returned from the model.');
    }
    
    const result = JSON.parse(text.trim()) as DetectionResult;
    return result;
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('Analysis failed. Please ensure the file is a clear audio recording under 30s.');
  }
};