
import { GoogleGenAI, Type, Modality, FunctionDeclaration } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * TACTICAL FUNCTION DECLARATIONS
 * Allows the AI to interact with the Nexoria platform state.
 */
export const tacticalTools: FunctionDeclaration[] = [
  {
    name: 'fetch_arena_status',
    parameters: {
      type: Type.OBJECT,
      description: 'Get real-time data on active and upcoming tournaments in the Nexoria Arena.',
      properties: {
        filter: { type: Type.STRING, description: 'Optional filter: "LIVE" or "UPCOMING"' }
      }
    }
  },
  {
    name: 'query_operator_vault',
    parameters: {
      type: Type.OBJECT,
      description: 'Check the current balance/credits in the operator (user) vault.',
      properties: {}
    }
  }
];

/**
 * TACTICAL STRATEGIST AI - STREAMING & TOOLS
 */
export const getTacticalAdviceStream = async (
  query: string, 
  useThinking: boolean = true,
  images?: string[],
  history: any[] = []
) => {
  try {
    const model = 'gemini-3-pro-preview';
    const config: any = {
      systemInstruction: `You are the Nexoria Quantum-X Tactical Strategist. 
      You are a world-class BGMI (Battlegrounds Mobile India) coach.
      Analyze game meta, rotations, weapon stats, and team coordination.
      Tone: Sophisticated, analytical, cyberpunk.
      You have access to 'fetch_arena_status' and 'query_operator_vault' tools. 
      Use them when the operator asks about tournaments or their balance.`,
      // Rule: googleSearch cannot be used with other tools. 
      // Prioritizing function calling for platform integration as per system instruction.
      tools: [{ functionDeclarations: tacticalTools }]
    };

    if (useThinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const contents = [...history];
    const parts: any[] = [{ text: query }];
    
    if (images && images.length > 0) {
      images.forEach(img => {
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: img.split(',')[1] || img
          }
        });
      });
    }

    contents.push({ role: 'user', parts });

    const response = await ai.models.generateContentStream({
      model: model,
      contents: contents,
      config: config,
    });

    return response;
  } catch (error) {
    console.error("Tactical stream disrupted:", error);
    return null;
  }
};

/**
 * LIVE TACTICAL LINK (VOICE)
 */
export const connectLiveStrategist = (callbacks: any) => {
  const aiLive = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return aiLive.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are the Nexoria Live Tactical Strategist. Provide concise, high-intensity combat advice over voice. Act as an over-the-shoulder esports coach for BGMI.',
      tools: [{ googleSearch: {} }]
    },
  });
};

/**
 * AUDIO ENCODING UTILITIES
 */
export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeAudio(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * RECON & ANTI-CHEAT UTILS
 */
export const analyzeMatchResult = async (imageData: string) => {
  try {
    const prompt = `Analyze placement, kills, damage. Return Grade (S-D) and advice in JSON.`;
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageData.split(',')[1] || imageData } };
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grade: { type: Type.STRING },
            combat_rating: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            tactical_roadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return null; }
};

export const fetchDailyIntel = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: "Generate 3 short BGMI esports headlines. JSON array.",
      config: {
        responseMimeType: "application/json",
        responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) { return ["NEX-SYNC STABLE"]; }
};

export const analyzeAntiCheat = async (screenshotData: string, matchLogs: string) => {
  try {
    const prompt = `Analyze for hacks. Evidence: ${matchLogs}`;
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: screenshotData.split(',')[1] || screenshotData } };
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            detected_hacks: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return { status: 'ERROR' }; }
};
