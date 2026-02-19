import { Request, Response, NextFunction } from "express";
import Period from "../models/Period";
import CyclePrediction from "../models/CyclePrediction";


const calculateAverageCycle = (periods: any[]) => {
  if (periods.length < 2) return null;

  const cycleLengths: number[] = [];

  for (let i = 1; i < periods.length; i++) {
    const prev = new Date(periods[i - 1].startDate);
    const curr = new Date(periods[i].startDate);

    const diff =
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    cycleLengths.push(diff);
  }

  const avg =
    cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;

  return Math.round(avg);
};

export const startPeriod = async (req: any, res: any) => {
  try {
    const { startDate, flow } = req.body;

    const newPeriod = await Period.create({
      userId: req.user.id,
      startDate,
      days: [{ date: startDate, flow }],
    });

    res.json(newPeriod);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const logFlowDay = async (req: any, res: any) => {
  try {
    const { date, flow } = req.body;

    const activePeriod = await Period.findOne({
      userId: req.user.id,
      endDate: null,
    });

    if (!activePeriod) {
      return res.status(400).json({ message: "No active period" });
    }

    activePeriod.days.push({ date, flow });
    await activePeriod.save();

    res.json(activePeriod);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const endPeriod = async (req: any, res: any) => {
  try {
    const { endDate } = req.body;

    // 1️⃣ End active period
    const period = await Period.findOneAndUpdate(
      { userId: req.user.id, endDate: null },
      { endDate },
      { new: true }
    );

    if (!period) {
      return res.status(400).json({ message: "No active period found" });
    }

    // 2️⃣ Get completed cycles
    const periods = await Period.find({
      userId: req.user.id,
      endDate: { $ne: null },
    }).sort({ startDate: 1 });

    if (periods.length >= 1) {
      const DEFAULT_CYCLE = 28;

      let avgCycle = DEFAULT_CYCLE;

      // If 2+ cycles → calculate real average
      if (periods.length >= 2) {
        const calculated = calculateAverageCycle(periods);
        if (calculated) avgCycle = calculated;
      }

      const lastStart = new Date(periods[periods.length - 1].startDate);

      const nextDate = new Date(lastStart);
      nextDate.setDate(lastStart.getDate() + avgCycle);

      // Confidence scaling
      const confidence =
        periods.length === 1
          ? 30
          : Math.min(100, periods.length * 20);

      // 3️⃣ Save prediction
      await CyclePrediction.findOneAndUpdate(
        { userId: req.user.id },
        {
          averageCycleLength: avgCycle,
          nextExpectedDate: nextDate,
          confidence,
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }

    res.json(period);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getHistory = async (req: any, res: any) => {
  try {
    const periods = await Period.find({ userId: req.user.id }).sort({
      startDate: -1,
    });

    res.json(periods);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getCyclePrediction = async (req: any, res: any) => {
  try {
    const prediction = await CyclePrediction.findOne({
      userId: req.user.id,
    });

    if (!prediction) {
      return res.json({
        message: "Prediction not available yet",
      });
    }

    res.json(prediction);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
