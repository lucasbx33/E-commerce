/*
  Warnings:

  - You are about to alter the column `articleId` on the `ArticleTags` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `tagId` on the `ArticleTags` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `articleId` on the `Image` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `article` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `article` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tags` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Made the column `articleId` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArticleTags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    CONSTRAINT "ArticleTags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArticleTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ArticleTags" ("articleId", "id", "tagId") SELECT "articleId", "id", "tagId" FROM "ArticleTags";
DROP TABLE "ArticleTags";
ALTER TABLE "new_ArticleTags" RENAME TO "ArticleTags";
CREATE UNIQUE INDEX "ArticleTags_articleId_tagId_key" ON "ArticleTags"("articleId", "tagId");
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "main_image" BOOLEAN,
    "link" TEXT,
    "articleId" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Image_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("articleId", "createdAt", "id", "link", "main_image", "updated_at") SELECT "articleId", "createdAt", "id", "link", "main_image", "updated_at" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");
CREATE TABLE "new_article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
CREATE UNIQUE INDEX "article_name_key" ON "article"("name");
CREATE TABLE "new_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
INSERT INTO "new_tags" ("id", "name") SELECT "id", "name" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
