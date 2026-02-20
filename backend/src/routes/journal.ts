import { Router } from "express";
import {
  createJournal,
  getUserJournals,
  getJournalById,
  continueJournalConversation,
} from "../controllers/journalController";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/", auth, createJournal);
router.get("/", auth, getUserJournals);
router.get("/:id", auth, getJournalById);
router.post("/:journalId/continue", auth, continueJournalConversation);

export default router;