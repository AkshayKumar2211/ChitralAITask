import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env";

export const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: env.GEMINI_MODEL,
  generationConfig: {
    temperature: 0.2,
    responseMimeType: "application/json",
  },
});
