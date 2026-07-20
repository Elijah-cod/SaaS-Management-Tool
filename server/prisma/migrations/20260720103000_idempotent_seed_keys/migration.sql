ALTER TABLE "Project" ADD COLUMN "seedKey" TEXT;
ALTER TABLE "Task" ADD COLUMN "seedKey" TEXT;
ALTER TABLE "Team" ADD COLUMN "seedKey" TEXT;
ALTER TABLE "Attachment" ADD COLUMN "seedKey" TEXT;
ALTER TABLE "Comment" ADD COLUMN "seedKey" TEXT;

CREATE UNIQUE INDEX "Project_seedKey_key" ON "Project"("seedKey");
CREATE UNIQUE INDEX "Task_seedKey_key" ON "Task"("seedKey");
CREATE UNIQUE INDEX "Team_seedKey_key" ON "Team"("seedKey");
CREATE UNIQUE INDEX "Attachment_seedKey_key" ON "Attachment"("seedKey");
CREATE UNIQUE INDEX "Comment_seedKey_key" ON "Comment"("seedKey");
