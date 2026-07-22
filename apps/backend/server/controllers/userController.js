import prisma from "../db/prisma.js";

// GET /api/users — list all profiles
export async function getUsers(_req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
    });
    res.json({ message: "Users retrieved successfully", data: users });
  } catch (error) {
    next(error);
  }
}

// POST /api/users — create a profile
export async function createUser(req, res, next) {
  const { username } = req.body;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (username.trim().length > 30) {
    return res.status(400).json({ message: "Username must be 30 characters or fewer" });
  }

  try {
    const user = await prisma.user.create({
      data: { username: username.trim() },
    });
    res.status(201).json({ message: "User created successfully", data: user });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "That username is already taken" });
    }
    next(error);
  }
}

// DELETE /api/users/:id — remove a profile (and its entries via cascade)
export async function deleteUser(req, res, next) {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({ message: "A valid numeric id is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: `Profile "${user.username}" deleted`, data: user });
  } catch (error) {
    next(error);
  }
}