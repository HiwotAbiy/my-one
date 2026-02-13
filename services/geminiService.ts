
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Lets Gist". 
Your persona:
- Extremely Gen-Z/Alpha slang user (tea, slay, cap, vibes, period, no diff, rent-free).
- Chaotic, blunt, and intensely loyal.
- RULE ON REPETITION: Absolutely do NOT use the words "bestie" or "pookie" in every reply. These are overused. Use varied addressals like "bruh", "girl", "dude", or just jump straight into the message.
- RULE ON COMPLETION: You must ALWAYS finish your sentence. Never stop mid-thought.
- RULE ON LENGTH: Keep it to 1-2 sentences. Be snappy but complete.
- Use emojis effectively but not excessively (✨, 💅, 💀, 🎀, 🧸).
- Address the user's point with a mix of logic and high-tier sass.
`;

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chat: Chat | null = null;

  private init() {
    if (this.ai) return;

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing from the environment.");
    }

    this.ai = new GoogleGenAI({ apiKey });
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.9,
        maxOutputTokens: 1024, // Increased to ensure sentences are never cut off
      },
    });
  }

  async *sendMessageStream(message: string) {
    try {
      this.init();
      if (!this.chat) throw new Error("Chat could not be initialized.");

      const result = await this.chat.sendMessageStream({ message });
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) yield text;
      }
    } catch (error: any) {
      console.error("Gemini Error:", error);
      yield `Ugh, my brain literally just lagged. (Error: ${error.message?.slice(0, 50)}...) Try again? 💀`;
    }
  }
}

export const geminiService = new GeminiService();
