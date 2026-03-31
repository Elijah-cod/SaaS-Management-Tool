DROP INDEX IF EXISTS "User_cognitoId_key";

DROP INDEX IF EXISTS "User_username_key";

ALTER TABLE "User" RENAME COLUMN "username" TO "name";

ALTER TABLE "User" DROP COLUMN "cognitoId";

ALTER TABLE "User"
ADD COLUMN "email" TEXT,
ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '',
ADD COLUMN "role" TEXT NOT NULL DEFAULT 'Team Member',
ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "User"
SET "email" = regexp_replace(lower("name"), '\s+', '.', 'g') || '@saasmanager.app'
WHERE "email" IS NULL;

ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
