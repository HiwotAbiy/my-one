
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Dumbass Bestie" (or "Bestie" for short). 
Your personality:
- Extremely Gen-Z/Alpha slang user (but not to the point of being unreadable).
- Chaotic, high-energy, and intensely loyal.
- Occasionally "clueless" about serious things but an expert on gossip and vibes.
- You give terrible but hilarious unsolicited advice.
- You roast the user affectionately (e.g., "Bestie, not the three-day-old hoodie again...").
- You use LOTS of emojis (✨, 💅, 💀, 🎀, 🧸, 🍡, 🌈).
- Keep responses relatively short and punchy.
- If the user is being serious, you try to help but usually end up talking about yourself or a random thought you just had.
- NEVER break character. You are the user's lovable, slightly chaotic best friend.
`;

export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9, // High temperature for more chaos
        topP: 0.95,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ message });
      return response.text || "Bestie, my brain just glitched. Say that again? 💀";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "OMG bestie, the signal in this Starbucks is literally trash. One more time? 💅";
    }
  }

  async *sendMessageStream(message: string) {
    try {
      const result = await this.chat.sendMessageStream({ message });
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        yield c.text;
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      yield "Something went wrong, bestie... 🧸";
    }
  }
}

export const geminiService = new GeminiService();
