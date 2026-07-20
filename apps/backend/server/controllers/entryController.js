import { json } from "express";
import prisma from "../db/prisma.js";

// GET /api/entries?userId=1 — all entries for a user
export async function getEntries(req, res, next) {
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.status(400).json({ message: "userId query parameter is required" });
  }

  try {
    const entries = await prisma.entry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json({ message: "Entries retrieved successfully", data: entries });
  } catch (error) {
    next(error);
  }
}

// GET /api/entries/:id — one entry
export async function getEntryById(req, res, next) {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "A valid numeric id is required" });
  }

  try {
    const entry = await prisma.entry.findUnique({ 
        where: { id } });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry retrieved successfully", data: entry });
  } catch (error) {
    next(error);
  }
}

// POST /api/entries — add a series to the tracker
export async function createEntry(req, res, next) {
  const { userId, malId, mediaType, title, imageUrl, totalUnits } = req.body;

  if (!userId || !malId || !title) {
    return res.status(400).json({ message: "userId, malId, and title are required" });
  }
  if (mediaType !== "anime" && mediaType !== "manga") {
    return res.status(400).json({ message: "mediaType must be 'anime' or 'manga'" });
  }

  try {
    const entry = await prisma.entry.create({
      data: {
        userId: Number(userId),
        malId: Number(malId),
        mediaType,
        title,
        imageUrl: imageUrl ?? null,
        totalUnits: totalUnits ? Number(totalUnits) : null,
      },
    });
    res.status(201).json({ message: "Entry created successfully", data: entry });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "This series is already in your tracker" });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ message: "That user does not exist" });
    }
    next(error);
    }
}
    // PUT /api/entries/:id — update progress, status, or prestige
export async function updateEntry(req, res, next) {
  const id = Number(req.params.id);
  const { progress, status, prestige } = req.body;

  if (!id) {
    return res.status(400).json({ message: "A valid numeric id is required" });
  }

  try {
    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // --- Prestige request ---
    if (prestige === true) {
      if (entry.totalUnits === null) {
        return res.status(400).json({ message: "Ongoing series cannot be prestiged yet" });
      }
      if (entry.progress < entry.totalUnits) {
        return res.status(400).json({ message: "Finish the series before prestiging" });
      }
      const updated = await prisma.entry.update({
        where: { id },
        data: { progress: 0, status: "in_progress", prestigeCount: entry.prestigeCount + 1 },
      });
      return res.json({ message: "Prestiged! Starting round " + (updated.prestigeCount + 1), data: updated });
    }

    // --- Normal update ---
    const data = {};

    if (progress !== undefined) {
      const p = Number(progress);
      if (Number.isNaN(p) || p < 0) {
        return res.status(400).json({ message: "Progress must be a positive number" });
      }
      if (entry.totalUnits !== null && p > entry.totalUnits) {
        return res.status(400).json({ message: `Progress cannot exceed ${entry.totalUnits}` });
      }
      data.progress = p;
      // Auto-complete when they hit the final episode/chapter
      if (entry.totalUnits !== null && p === entry.totalUnits) {
        data.status = "completed";
      }
    }

    if (status !== undefined) {
      const allowed = ["plan_to_watch", "in_progress", "completed"];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Status must be plan_to_watch, in_progress, or completed" });
      }
      data.status = status;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Provide progress, status, or prestige to update" });
    }

    const updated = await prisma.entry.update({ where: { id }, data });
    res.json({ message: "Entry updated successfully", data: updated });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/entries/:id — remove from tracker
export async function deleteEntry(req, res, next) {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "A valid numeric id is required" });
  }

  try {
    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await prisma.entry.delete({ where: { id } });
    res.json({ message: `"${entry.title}" removed from your tracker`, data: entry });
  } catch (error) {
    next(error);
  }
}


