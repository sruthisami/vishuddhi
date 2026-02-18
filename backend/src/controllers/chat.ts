import { Request, Response } from "express";
import { ChatSession, IChatSession } from "../models/ChatSession";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";
import { inngest } from "../inngest/index";
import { User } from "../models/User";
import { InngestEvent } from "../types/inngest";
import { Types } from "mongoose";

// ===============================
// Gemini Init
// ===============================
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Safe JSON parse
function safeJsonParse(text: string) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    logger.warn("JSON parse failed:", text);
    return {};
  }
}

// ===============================
// CREATE SESSION
// POST /sessions
// ===============================
export const createChatSession = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = new Types.ObjectId(req.user.id);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sessionId = uuidv4();

    const session = new ChatSession({
      sessionId,
      userId,
      startTime: new Date(),
      status: "active",
      messages: [],
    });

    await session.save();

    res.status(201).json({
      message: "Chat session created successfully",
      sessionId,
    });
  } catch (error) {
    logger.error("Error creating session:", error);
    res.status(500).json({ message: "Error creating session" });
  }
};

// ===============================
// GET SESSION METADATA
// GET /sessions/:sessionId
// ===============================
export const getChatSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findOne({ sessionId })
      .select("sessionId startTime status")
      .lean();

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    logger.error("Error fetching session:", error);
    res.status(500).json({ message: "Error fetching session" });
  }
};

// ===============================
// SEND MESSAGE
// POST /sessions/:sessionId/messages
// ===============================
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = new Types.ObjectId(req.user.id);

    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ===============================
    // Inngest Event
    // ===============================
    const event: InngestEvent = {
      name: "therapy/session.message",
      data: {
        message,
        history: session.messages,
        memory: {
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
        goals: [],
        systemPrompt: `You are an empathetic AI therapist. Provide supportive, safe, and compassionate responses.`,
      },
    };

    await inngest.send(event);

    // ===============================
    // STEP 1: ANALYSIS
    // ===============================
    const analysisPrompt = `Analyze this therapy message and return ONLY valid JSON.

Message: ${message}

{
  "emotionalState": "string",
  "themes": ["string"],
  "riskLevel": number,
  "recommendedApproach": "string",
  "progressIndicators": ["string"]
}`;

    const analysisResult = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: analysisPrompt,
    });

    const analysis = safeJsonParse(analysisResult.text || "{}");

    // ===============================
    // STEP 2: RESPONSE
    // ===============================
    const responsePrompt = `You are an empathetic therapist.

User message: ${message}
Analysis: ${JSON.stringify(analysis)}

Respond with warmth, validation, and gentle guidance.`;

    const responseResult = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: responsePrompt,
    });

    const assistantReply = responseResult.text || "";

    // ===============================
    // STORE CHAT
    // ===============================
    session.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    session.messages.push({
      role: "assistant",
      content: assistantReply,
      timestamp: new Date(),
      metadata: {
        analysis,
        progress: {
          emotionalState: analysis.emotionalState,
          riskLevel: analysis.riskLevel,
        },
      },
    });

    await session.save();

    res.json({
      response: assistantReply,
      analysis,
    });
  } catch (error) {
    logger.error("sendMessage error:", error);
    res.status(500).json({ message: "Error processing message" });
  }
};

// ===============================
// GET CHAT HISTORY
// GET /sessions/:sessionId/history
// ===============================
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = new Types.ObjectId(req.user.id);

    const session = (await ChatSession.findOne({
      sessionId,
    }).exec()) as IChatSession | null;

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({
      messages: session.messages,
    });
  } catch (error) {
    logger.error("Error fetching history:", error);
    res.status(500).json({ message: "Error fetching history" });
  }
};
