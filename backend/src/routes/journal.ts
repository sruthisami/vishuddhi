import { Router } from "express";
import {
  createJournal,
  getUserJournals,
  getJournalById,
} from "../controllers/journalController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, createJournal);
router.get("/", auth, getUserJournals);
router.get("/:id", auth, getJournalById);

export default router;