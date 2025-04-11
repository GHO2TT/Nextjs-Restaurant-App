-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" REAL NOT NULL,
    "products" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "intent_id" TEXT,
    "userEmail" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "intent_id", "price", "products", "status", "updatedAt", "userEmail") SELECT "createdAt", "id", "intent_id", "price", "products", "status", "updatedAt", "userEmail" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_intent_id_key" ON "Order"("intent_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
