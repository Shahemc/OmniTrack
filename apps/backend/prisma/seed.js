import prisma from "../server/db/prisma.js";   

async function main() {
  // Wipe existing rows so seeding is repeatable
  await prisma.entry.deleteMany();
  await prisma.user.deleteMany();

  const demo = await prisma.user.create({
    data: { username: "demo" },
  });

  await prisma.entry.createMany({
    data: [
      {
        userId: demo.id,
        malId: 20,
        mediaType: "anime",
        title: "Naruto",
        imageUrl: "https://cdn.myanimelist.net/images/anime/1141/142503.jpg",
        totalUnits: 220,
        progress: 220,
        status: "completed",
        prestigeCount: 1,
      },
      {
        userId: demo.id,
        malId: 21,
        mediaType: "anime",
        title: "One Piece",
        imageUrl: "https://cdn.myanimelist.net/images/anime/1244/138851.jpg",
        totalUnits: null, // ongoing — unknown episode count
        progress: 1090,
        status: "in_progress",
        prestigeCount: 0,
      },
      {
        userId: demo.id,
        malId: 13,
        mediaType: "manga",
        title: "One Piece",
        imageUrl: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        totalUnits: null,
        progress: 1100,
        status: "in_progress",
        prestigeCount: 0,
      },
    ],
  });

  console.log("Seeded user 'demo' with 3 entries");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());