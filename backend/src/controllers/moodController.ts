import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/Mood";
import { logger } from "../utils/logger";
import { sendMoodUpdateEvent } from "../utils/inngestEvents";

export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { score, note } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }



    const mood = new Mood({
      userId,
      score,
      note,
      timestamp: new Date(),
    });
    await mood.save();
    logger.info(`Mood entry created for user ${userId}`);

    await sendMoodUpdateEvent({
      userId,
      score,
      note,
      timestamp: mood.timestamp,
    });

    sendMoodUpdateEvent({
      userId: userId.toString(),
      mood: score,
      notes: note,
    }).catch((err) =>
      logger.error("Inngest mood event failed", err)
    );

    res.status(201).json({
      success: true,
      data: mood,
    });
  } catch (error) {
    next(error);
  }
};
