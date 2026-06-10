import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Reading data/plants.json...");
  const plantsData = JSON.parse(
    readFileSync(join(process.cwd(), "data", "plants.json"), "utf-8")
  );

  console.log("Fetching all plants from database...");
  const dbPlants = await prisma.plant.findMany();

  console.log(`Backfilling family and origin...`);

  for (const plantInfo of plantsData) {
    if (!plantInfo.family && !plantInfo.origin) continue;

    // Find the plant by case-insensitive Latin name
    const dbPlant = dbPlants.find(
      (p) => p.latinName.toLowerCase().trim() === plantInfo.latinName.toLowerCase().trim()
    );

    if (dbPlant) {
      await prisma.plant.update({
        where: { id: dbPlant.id },
        data: {
          family: plantInfo.family || null,
          origin: plantInfo.origin || null,
        },
      });
      console.log(`Updated ${dbPlant.latinName}: family=${plantInfo.family}, origin=${plantInfo.origin}`);
    } else {
      console.log(`⚠️ Plant not found in database: ${plantInfo.latinName}`);
    }
  }

  console.log("Backfill completed successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
