-- CreateTable
CREATE TABLE "photos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "alt" TEXT,
    "title" TEXT,
    "description" TEXT,
    "category" TEXT,
    "tags" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "takenAt" DATETIME,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER,
    "plantId" INTEGER,
    "blogPostId" INTEGER,
    CONSTRAINT "photos_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "plants" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "photos_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "plants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "commonName" TEXT NOT NULL,
    "latinName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "floweringPeriod" TEXT,
    "heightCm" INTEGER,
    "light" TEXT,
    "locationCode" TEXT,
    "beeFriendly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "author" TEXT NOT NULL,
    "teaser" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "photos_category_idx" ON "photos"("category");

-- CreateIndex
CREATE INDEX "photos_isPublic_idx" ON "photos"("isPublic");

-- CreateIndex
CREATE INDEX "photos_uploadedAt_idx" ON "photos"("uploadedAt");

-- CreateIndex
CREATE INDEX "photos_plantId_idx" ON "photos"("plantId");

-- CreateIndex
CREATE INDEX "photos_blogPostId_idx" ON "photos"("blogPostId");

-- CreateIndex
CREATE INDEX "plants_category_idx" ON "plants"("category");

-- CreateIndex
CREATE INDEX "plants_locationCode_idx" ON "plants"("locationCode");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_date_idx" ON "blog_posts"("date");
