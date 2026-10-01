CREATE TABLE "SponsorSubmission" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "location" TEXT,
  "preferredContact" TEXT,
  "message" TEXT,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SponsorSubmission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SponsorSubmission_status_createdAt_idx" ON "SponsorSubmission"("status", "createdAt");