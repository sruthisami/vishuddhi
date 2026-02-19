import express from "express";
import {
  startPeriod,
  logFlowDay,
  endPeriod,
  getHistory,
  getCyclePrediction,
} from "../controllers/periodController";
import { auth } from "../middleware/auth";

const router = express.Router();

// protect all routes
router.use(auth);

// Period tracking
router.post("/start", startPeriod);
router.post("/log-day", logFlowDay);
router.post("/end", endPeriod);
router.get("/history", getHistory);

// Prediction
router.get("/prediction", getCyclePrediction);

export default router;
