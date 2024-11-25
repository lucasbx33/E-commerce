/*
  Warnings:

  - You are about to drop the column `tagsId` on the `article` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ArticleTags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "ArticleTags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArticleTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "description" TEXT,
    "price" DECIMAL,
    "stock" INTEGER,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_article" ("createdAt", "description", "id", "name", "price", "stock", "updated_at") SELECT "createdAt", "description", "id", "name", "price", "stock", "updated_at" FROM "article";
DROP TABLE "article";
ALTER TABLE "new_article" RENAME TO "article";
CREATE UNIQUE INDEX "article_id_key" ON "article"("id");
CREATE UNIQUE INDEX "article_name_key" ON "article"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ArticleTags_articleId_tagId_key" ON "ArticleTags"("articleId", "tagId");
