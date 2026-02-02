
import { GoogleGenAI, Type } from "@google/genai";
import { Challenge } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChallenge = async (userSkill: string): Promise<Challenge> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a creative physics-based juggling challenge for a game called ZenBlock Juggler. 
    The difficulty level is: ${userSkill}. 
    Return a JSON object representing a unique gameplay variant.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          gravity: { type: Type.NUMBER, description: "Range 0.1 to 2.0" },
          restitution: { type: Type.NUMBER, description: "Bounciness, Range 0.1 to 1.2" },
          spawnRate: { type: Type.NUMBER, description: "Seconds between blocks, Range 1 to 10" },
          theme: { type: Type.STRING, description: "One of: NEON, PASTEL, CYBERPUNK" },
          targetScore: { type: Type.NUMBER }
        },
        required: ["title", "description", "gravity", "restitution", "spawnRate", "theme", "targetScore"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    // Return a default fallback challenge
    return {
      title: "Zen Baseline",
      description: "Keep it steady. Standard gravity and flow.",
      gravity: 1.0,
      restitution: 0.6,
      spawnRate: 4,
      theme: "NEON",
      targetScore: 500
    };
  }
};

export const getAIFeedback = async (stats: any): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `The player just finished a round of ZenBlock Juggler. 
    Stats: Score ${stats.score}, Max Combo ${stats.maxCombo}, Blocks Juggled ${stats.blocksJuggled}.
    Give a very short, witty, and encouraging 1-sentence comment as an AI Physics Coach.`,
  });
  return response.text || "Keep on juggling!";
};
