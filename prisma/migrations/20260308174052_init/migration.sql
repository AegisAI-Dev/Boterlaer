-- CreateTable
CREATE TABLE "videos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "size" INTEGER,
    "page" TEXT NOT NULL DEFAULT 'general',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "videos_filename_key" ON "videos"("filename");

-- CreateIndex
CREATE INDEX "videos_page_idx" ON "videos"("page");

-- CreateIndex
CREATE INDEX "videos_isActive_idx" ON "videos"("isActive");

-- CreateIndex
CREATE INDEX "videos_uploadedAt_idx" ON "videos"("uploadedAt");
