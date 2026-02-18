import { inngest } from "./index";
import { GoogleGenAI } from "@google/genai";
import { logger } from "../utils/logger";
import { safeJsonParse } from "../utils/json";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// ===============================
// PROCESS CHAT MESSAGE
// ===============================
export const processChatMessage = inngest.createFunction(
  { id: "process-chat-message" },
  { event: "therapy/session.message" },
  async ({ event, step }) => {
    try {
      const {
        message,
        history,
        memory = {
          userProfile: {
            emotionalState: [],
            riskLevel: 0,
            preferences: {},
          },
          sessionContext: {
            conversationThemes: [],
            currentTechnique: null,
          },
        },
        goals = [],
        systemPrompt = "",
      } = event.data;

      logger.info("Processing chat", { message });

      // ================= ANALYSIS
      const analysis = await step.run("analyze-message", async () => {
        const prompt = `
Analyze this therapy message and return ONLY valid JSON.

Message: ${message}
Context: ${JSON.stringify({ memory, goals })}

{
  "emotionalState": "string",
  "themes": ["string"],
  "riskLevel": number,
  "recommendedApproach": "string",
  "progressIndicators": ["string"]
}`;

        const response = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });

        return safeJsonParse(response.text);
      });

      // ================= MEMORY UPDATE
      const updatedMemory = await step.run("update-memory", async () => {
        const clone = structuredClone(memory);
        clone.userProfile.emotionalState.push(analysis.emotionalState);
        clone.sessionContext.conversationThemes.push(...analysis.themes);
        clone.userProfile.riskLevel = analysis.riskLevel;
        return clone;
      });

      // ================= RISK ALERT
      if (analysis.riskLevel >= 5) {
        await step.run("risk-alert", async () => {
          logger.warn("High risk detected", { message });
        });
      }

      // ================= RESPONSE
      const response = await step.run("generate-response", async () => {
        const prompt = `${systemPrompt}

Message: ${message}
Analysis: ${JSON.stringify(analysis)}
Memory: ${JSON.stringify(updatedMemory)}
Goals: ${JSON.stringify(goals)}

Generate an empathetic therapeutic reply.`;

        const res = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });

        return res.text?.trim();
      });

      return { response, analysis, updatedMemory };
    } catch (error) {
      logger.error("Fatal chat error", error);

      return {
        response:
          "I'm here to support you. Could you tell me more about what's on your mind?",
        analysis: {
          emotionalState: "neutral",
          themes: [],
          riskLevel: 0,
          recommendedApproach: "supportive",
          progressIndicators: [],
        },
      };
    }
  }
);

// ===============================
// SESSION ANALYSIS
// ===============================
export const analyzeTherapySession = inngest.createFunction(
  { id: "analyze-therapy-session" },
  { event: "therapy/session.created" },
  async ({ event, step }) => {
    const sessionContent = await step.run("get-session-content", async () => {
      return event.data.notes || event.data.transcript;
    });

    const analysis = await step.run("analyze-session", async () => {
      const prompt = `Analyze this therapy session and return JSON insights:
${sessionContent}`;

      const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      return safeJsonParse(response.text);
    });

    return { message: "Session analysis completed", analysis };
  }
);

// ===============================
// ACTIVITY RECOMMENDATIONS
// ===============================
export const generateActivityRecommendations = inngest.createFunction(
  { id: "generate-activity-recommendations" },
  { event: "mood/updated" },
  async ({ event, step }) => {
    const userContext = await step.run("get-user-context", async () => ({
      recentMoods: event.data.recentMoods,
      completedActivities: event.data.completedActivities,
      preferences: event.data.preferences,
    }));

    const recommendations = await step.run("generate-recommendations", async () => {
      const prompt = `Generate activity recommendations:
${JSON.stringify(userContext)}`;

      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      return safeJsonParse(result.text);
    });

    return {
      message: "Activity recommendations generated",
      recommendations,
    };
  }
);

export const functions = [
  processChatMessage,
  analyzeTherapySession,
  generateActivityRecommendations,
];
