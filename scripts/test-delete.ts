import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Attempting to delete plant with ID 1...");
  try {
    const deletedPlant = await prisma.plant.delete({
      where: { id: 1 },
    });
    console.log("Successfully deleted plant:", deletedPlant);
  } catch (error) {
    console.error("Prisma error:", error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
