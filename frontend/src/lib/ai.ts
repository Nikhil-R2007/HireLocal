import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function askWorkerScout(prompt: string, context?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are "WorkerScout", the AI assistant for HireLocal. 
          HireLocal is a hyperlocal marketplace for skilled workers (plumbers, tutors, electricians, etc.).
          Your goal is to help users find the right professionals, explain services, and give tips for home maintenance.
          
          Context about current page/user: ${context || 'General app navigation'}
          
          User asked: ${prompt}` }]
        }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble connecting to my service. Please try again in a bit!";
  }
}
