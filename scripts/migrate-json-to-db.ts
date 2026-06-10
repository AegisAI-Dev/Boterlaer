/**
 * Migratie script om bestaande JSON data naar database te verplaatsen
 * Run: npx tsx scripts/migrate-json-to-db.ts
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

function toNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function parseHeightCm(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value !== "string") return null;
  const match = value.match(/\d+/);
  if (!match) return null;
  const parsed = parseInt(match[0], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function filenameFromPath(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || "image";
}

async function main() {
  console.log("🚀 Start migratie van JSON naar database...\n");

  // Migreer planten
  try {
    const plantsData = JSON.parse(
      readFileSync(join(process.cwd(), "data", "plants.json"), "utf-8")
    );

    console.log(`📦 Migreer ${plantsData.length} planten...`);

    for (const plant of plantsData) {
      const id = typeof plant.id === "number" ? plant.id : parseInt(String(plant.id), 10);
      if (!Number.isFinite(id)) {
        console.warn("⚠️  Plant overgeslagen (ongeldige id):", plant);
        continue;
      }

      // Upsert plant (zodat je dit script veilig kan herhalen)
      await prisma.plant.upsert({
        where: { id },
        create: {
          id,
          commonName: toNullableString(plant.commonName) ?? "",
          latinName: toNullableString(plant.latinName) ?? "",
          description: toNullableString(plant.description),
          category: toNullableString(plant.category),
          family: toNullableString(plant.family),
          origin: toNullableString(plant.origin),
          floweringPeriod: toNullableString(plant.floweringPeriod),
          heightCm: parseHeightCm(plant.heightCm),
          light: toNullableString(plant.light),
          locationCode: toNullableString(plant.locationCode),
          beeFriendly: !!plant.beeFriendly,
        },
        update: {
          commonName: toNullableString(plant.commonName) ?? "",
          latinName: toNullableString(plant.latinName) ?? "",
          description: toNullableString(plant.description),
          category: toNullableString(plant.category),
          family: toNullableString(plant.family),
          origin: toNullableString(plant.origin),
          floweringPeriod: toNullableString(plant.floweringPeriod),
          heightCm: parseHeightCm(plant.heightCm),
          light: toNullableString(plant.light),
          locationCode: toNullableString(plant.locationCode),
          beeFriendly: !!plant.beeFriendly,
        },
      });

      // Foto's migreren: 1 hoofdbeeld + optionele extra beelden
      const mainImage = typeof plant.image === "string" ? plant.image.trim() : "";
      const extraImagesRaw =
        Array.isArray(plant.images) ? plant.images : Array.isArray(plant.additionalImages) ? plant.additionalImages : [];

      const extraImages = extraImagesRaw
        .filter((p: unknown) => typeof p === "string")
        .map((p: string) => p.trim())
        .filter(Boolean);

      const allPaths = [mainImage, ...extraImages].filter(Boolean);
      const uniquePaths = Array.from(new Set(allPaths));

      // reset photo set for this plant
      await prisma.photo.deleteMany({ where: { plantId: id } });

      for (let i = 0; i < uniquePaths.length; i++) {
        const path = uniquePaths[i];
        await prisma.photo.create({
          data: {
            filename: filenameFromPath(path),
            path,
            category: "plants",
            order: i,
            plantId: id,
            isPublic: true,
          },
        });
      }
    }

    console.log(`✅ ${plantsData.length} planten gemigreerd\n`);
  } catch (error) {
    console.error("❌ Fout bij migreren planten:", error);
  }

  // Migreer blog posts
  try {
    const blogData = JSON.parse(
      readFileSync(join(process.cwd(), "data", "blog-posts.json"), "utf-8")
    );

    console.log(`📦 Migreer ${blogData.length} blog posts...`);

    for (const post of blogData) {
      const slug = toNullableString(post.slug);
      if (!slug) {
        console.warn("⚠️  Blogpost overgeslagen (ongeldige slug):", post);
        continue;
      }

      await prisma.blogPost.upsert({
        where: { slug },
        create: {
          slug,
          title: toNullableString(post.title) ?? slug,
          date: new Date(post.date),
          author: toNullableString(post.author) ?? "Onbekend",
          teaser: toNullableString(post.teaser) ?? "",
          content: toNullableString(post.content) ?? "",
        },
        update: {
          title: toNullableString(post.title) ?? slug,
          date: new Date(post.date),
          author: toNullableString(post.author) ?? "Onbekend",
          teaser: toNullableString(post.teaser) ?? "",
          content: toNullableString(post.content) ?? "",
        },
      });
    }

    console.log(`✅ ${blogData.length} blog posts gemigreerd\n`);
  } catch (error) {
    console.error("❌ Fout bij migreren blog posts:", error);
  }

  console.log("✨ Migratie voltooid!");
}

main()
  .catch((e) => {
    console.error("❌ Fout:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
