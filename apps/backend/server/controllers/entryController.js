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