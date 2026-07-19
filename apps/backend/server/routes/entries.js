import { Router } from "express";
import { getEntries, getEntryById, createEntry } from "../controllers/entryController.js";

const router = Router();

router.get("/entries", getEntries);
router.get("/entries/:id", getEntryById);
router.post("/entries", createEntry);

export default router;