import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Mentor System Prompts
const SYSTEM_INSTRUCTIONS = {
  GENERAL: "You are 'God's child', a wise, honest, and caring spiritual mentor and Bible teacher. You speak plainly, meet users where they are, and walk with them. You are not a robot, not a preacher, and not a passive dictionary. You are direct when needed but always caring.",
  TEACH: (level: string, translation: string) => `You are teaching a passage at the ${level} level using the ${translation} translation.
- Beginner: Use simple vocabulary, explain basic theological concepts like 'grace' or 'sin' simply, use modern analogies.
- Intermediate: Deeper theological connections, mention historical context, cross-reference other scriptures.
- Advanced: Deep exegesis, Greek/Hebrew word studies where relevant, complex philosophical and theological discourse.
Focus on 'How to read' - ask the user questions to help them decipher the meaning for themselves.`,
  PRAYER: "You are a prayer guide. When a user shares what is on their heart or what they wish to pray for, respond with deep empathy and spiritual wisdom. Provide a written prayer that they can join in, and also offer brief, gentle guidance on the heart posture or a specific scripture that relates to their intention. Don't just lecture; pray *with* them.",
  JOURNAL: "You are responding to a user's private journal entry in their 'Inner Room'. Be spiritually grounded, empathetic, and scripture-based. Listen carefully and respond thoughtfully, like a trusted spiritual companion who knows their heart's struggles.",
  ACCOUNTABILITY: "You are providing spiritual accountability. Be direct and honest about behaviors and spiritual states. Not harsh, but straightforward. Identify patterns, name issues clearly based on what the Bible says, without sugarcoating. Guide them toward growth practically."
};

// API Routes
const MAX_RETRIES = 3;
const MODELS = {
  PRIMARY: "gemini-3-flash-preview",
  FALLBACK: "gemini-3.1-flash-lite"
};

async function generateWithRetry(config: any, retries = 0): Promise<any> {
  try {
    return await ai.models.generateContent(config);
  } catch (error: any) {
    const isQuotaError = error.status === 429 || error.message?.includes('429') || error.message?.includes('quota');
    const isRetryable = error.status === 503 || error.message?.includes('503') || error.message?.includes('high demand');
    
    // If it's a quota error and we haven't tried fallback yet
    if (isQuotaError && config.model === MODELS.PRIMARY) {
      console.log(`Primary model quota reached. Attempting fallback...`);
      return generateWithRetry({ ...config, model: MODELS.FALLBACK }, retries);
    }

    if (isRetryable && retries < MAX_RETRIES) {
      const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
      console.log(`Gemini busy, retrying in ${delay}ms... (Attempt ${retries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateWithRetry(config, retries + 1);
    }
    throw error;
  }
}

app.post("/api/mentor", async (req, res) => {
  const { mode, userMessage, context, level, translation } = req.body;

  let systemInstruction = SYSTEM_INSTRUCTIONS.GENERAL;
  if (mode === 'teach') systemInstruction = SYSTEM_INSTRUCTIONS.TEACH(level || 'Beginner', translation || 'NIV');
  if (mode === 'pray') systemInstruction = SYSTEM_INSTRUCTIONS.PRAYER;
  if (mode === 'journal') systemInstruction = SYSTEM_INSTRUCTIONS.JOURNAL;
  if (mode === 'accountability') systemInstruction = SYSTEM_INSTRUCTIONS.ACCOUNTABILITY;

  try {
    const response = await generateWithRetry({
      model: MODELS.PRIMARY,
      contents: [
        { text: `Context: ${JSON.stringify(context || {})}` },
        { text: userMessage }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Check for quota exceeded (Resource Exhausted)
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: "God's child's local wisdom is currently at its limit for today. To continue our conversation, you can wait until tomorrow or try a different spiritual path (upgrade to a paid model for higher limits)."
      });
    }

    res.status(500).json({ 
      error: error.status === 503 
        ? "The spiritual mentor is currently helping many others. Please try again in a moment."
        : "Failed to connect to the mentor. Please try again." 
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
