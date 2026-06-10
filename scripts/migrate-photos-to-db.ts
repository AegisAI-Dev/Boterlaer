import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting migration of plant photos from JSON to database...\n");

  // Read plants.json data
  let plantsData;
  try {
    plantsData = JSON.parse(
      readFileSync(join(process.cwd(), "data", "plants.json"), "utf-8")
    );
  } catch (error) {
    console.error("❌ Failed to read data/plants.json:", error);
    process.exit(1);
  }

  console.log(`📦 Found ${plantsData.length} plants in JSON. Syncing photos...`);

  let mainPhotosCreated = 0;
  let additionalPhotosCreated = 0;

  for (const plantJson of plantsData) {
    const dbPlant = await prisma.plant.findUnique({
      where: { id: plantJson.id }
    });

    if (!dbPlant) {
      console.log(`⚠️ Plant with ID ${plantJson.id} (${plantJson.latinName}) not found in DB, skipping...`);
      continue;
    }

    // Delete existing photos for safety (prevent duplicates)
    await prisma.photo.deleteMany({
      where: { plantId: dbPlant.id }
    });

    // Create main photo (order: 0)
    if (plantJson.image) {
      const filename = plantJson.image.split("/").pop() || "image.jpg";
      await prisma.photo.create({
        data: {
          filename,
          path: plantJson.image,
          category: "plants",
          order: 0,
          plantId: dbPlant.id
        }
      });
      mainPhotosCreated++;
    }

    // Create additional photos (order: i + 1)
    if (plantJson.images && Array.isArray(plantJson.images)) {
      for (let i = 0; i < plantJson.images.length; i++) {
        const imgPath = plantJson.images[i];
        if (imgPath) {
          const filename = imgPath.split("/").pop() || `image_${i}.jpg`;
          await prisma.photo.create({
            data: {
              filename,
              path: imgPath,
              category: "plants",
              order: i + 1,
              plantId: dbPlant.id
            }
          });
          additionalPhotosCreated++;
        }
      }
    }
  }

  console.log(`\n✅ Photos migration completed!`);
  console.log(`✨ Main photos inserted/updated: ${mainPhotosCreated}`);
  console.log(`✨ Additional photos inserted: ${additionalPhotosCreated}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during photo migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
