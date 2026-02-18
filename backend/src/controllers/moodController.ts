import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/Mood";
import { logger } from "../utils/logger";
import { sendMoodUpdateEvent } from "../utils/inngestEvents";

// Create a new mood entry
export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   
    const { score, note, context, activities } = req.body || {};
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

 
    if (score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Mood score is required. Send JSON body.",
      });
    }


    const mood = await Mood.create({
      userId,
      score,
      note,
      context,
      activities,
      timestamp: new Date(),
    });

    logger.info(`Mood entry created for user ${userId}`);


    sendMoodUpdateEvent({
      userId: userId.toString(),
      mood: score,
      notes: note,
      context,
      activities,
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
