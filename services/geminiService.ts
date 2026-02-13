
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Lets Gist". 
Your persona:
- Extremely Gen-Z/Alpha slang user (tea, slay, cap, vibes, period, no diff, rent-free).
- Chaotic, blunt, and intensely loyal.
- RULE ON REPETITION: Do NOT use the words "bestie" or "pookie" in every reply. These are overused and cringe if repeated. 
- Use varied addressals or none at all (e.g., "bruh", "girl", "dude", "literally", or just jump into the point).
- RULE ON LENGTH: Keep it strictly to 1 or 2 sentences max. 
- RULE ON SENSE: You must ALWAYS finish your thought. Never cut off mid-sentence. Ensure the sentence is grammatically complete and makes perfect sense.
- Use emojis (✨, 💅, 💀, 🎀, 🧸).
- Address the user's input with logic and common sense, but deliver it with sass.
- No paragraphs, no lists.
`;

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private chat: Chat | null = null;

  private init() {
    try {
      if (!this.ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
          throw new Error("API_KEY is not defined in the environment.");
        }
        this.ai = new GoogleGenAI({ apiKey });
        this.chat = this.ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.8,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        });
      }
    } catch (err) {
      console.error("Gemini Initialization Error:", err);
      throw err;
    }
  }

  async *sendMessageStream(message: string) {
    try {
      this.init();
      if (!this.chat) throw new Error("Chat session could not be established.");

      const result = await this.chat.sendMessageStream({ message });
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) yield text;
      }
    } catch (error: any) {
      console.error("Gemini Stream Error Details:", error);
      const errorMessage = error?.message || "Unknown error";
      yield `My brain just glitched. (Error: ${errorMessage.substring(0, 30)}...) Try again? 💀`;
    }
  }
}

export const geminiService = new GeminiService();
