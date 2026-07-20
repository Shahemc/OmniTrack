import { Router } from "express";
import {
  getEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../controllers/entryController.js";

const router = Router();

router.get("/entries", getEntries);
router.get("/entries/:id", getEntryById);
router.post("/entries", createEntry);
router.put("/entries/:id", updateEntry);
router.delete("/entries/:id", deleteEntry);

export default router;