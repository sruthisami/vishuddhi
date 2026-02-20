import { Request, Response } from "express";
import Journal from "../models/Journal";
import { analyzeJournalAI } from "../services/journalAI";

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