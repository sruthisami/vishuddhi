import { Request, Response } from "express";
import Journal from "../models/Journal";
import { analyzeJournalAI } from "../services/journalAI";
import { ChatSession } from "../models/ChatSession";
import mongoose from "mongoose";

export const createJournal = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { text } = req.body;

    const journal = await Journal.create({
      userId,
      text,
    });

    // Background AI (no waiting)
    setTimeout(() => {
      analyzeJournalAI(journal._id.toString(), text);
    }, 0);

    res.status(201).json({
      success: true,
      journalId: journal._id,
      message: "Journal saved. Insight generating...",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create journal" });
  }
};

export const getUserJournals = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const journals = await Journal.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(journals);
};

export const getJournalById = async (req: Request, res: Response) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(journal);
};

export const continueJournalConversation = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const journalId = req.params.journalId as string;

    const journal = await Journal.findById(journalId);
    if (!journal) {
      return res.status(404).json({ message: "Journal not found" });
    }

    // 🔒 HARD RULE: insight must exist
    if (!journal.aiInsights?.insight) {
      return res.status(400).json({
        message: "Conversation allowed only when an insight exists",
      });
    }

    // Check existing session
    let session = await ChatSession.findOne({
      userId,
      journalId: new mongoose.Types.ObjectId(journalId),
      mode: "journal_focus",
      status: "active",
    });

    if (!session) {
      session = await ChatSession.create({
        sessionId: crypto.randomUUID(), // if you use UUIDs
        userId,
        journalId,
        mode: "journal_focus",
        status: "active",
        messages: [],
      });
    }

    res.json({
      success: true,
      sessionId: session.sessionId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to start conversation" });
  }
};