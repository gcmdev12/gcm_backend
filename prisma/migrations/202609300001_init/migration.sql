CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'READ', 'ARCHIVED');
CREATE TYPE "GalleryCategory" AS ENUM ('EDUCATION', 'HEALTH', 'FOOD', 'GUIDANCE', 'SHELTER', 'SKILLS', 'EVENTS', 'OTHER');

CREATE TABLE "AdminUser" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "role" "AdminRole" NOT NULL DEFAULT 'SUPER_ADMIN',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE INDEX "AdminUser_isActive_idx" ON "AdminUser"("isActive");

CREATE TABLE "ContactSubmission" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ContactSubmission_status_createdAt_idx" ON "ContactSubmission"("status", "createdAt");

CREATE TABLE "VolunteerSubmission" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "location" TEXT,
  "interests" TEXT,
  "availability" TEXT,
  "experience" TEXT,
  "message" TEXT,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VolunteerSubmission_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "VolunteerSubmission_status_createdAt_idx" ON "VolunteerSubmission"("status", "createdAt");

CREATE TABLE "NewsletterSubscriber" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
CREATE INDEX "NewsletterSubscriber_status_subscribedAt_idx" ON "NewsletterSubscriber"("status", "subscribedAt");

CREATE TABLE "EmailNotificationLog" (
  "id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "resendId" TEXT,
  "status" TEXT NOT NULL,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailNotificationLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "EmailNotificationLog_type_createdAt_idx" ON "EmailNotificationLog"("type", "createdAt");

CREATE TABLE "SiteSettings" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "siteName" TEXT NOT NULL DEFAULT 'Glory Children Ministry',
  "tagline" TEXT NOT NULL DEFAULT 'Hope, Education & Opportunity',
  "email" TEXT NOT NULL DEFAULT 'info@glorychildrenministry.org',
  "phone1" TEXT,
  "phone2" TEXT,
  "location" TEXT,
  "whatsapp" TEXT,
  "instagram" TEXT,
  "facebook" TEXT,
  "threads" TEXT,
  "tiktok" TEXT,
  "youtube" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DonationMethod" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "accountName" TEXT,
  "accountNumber" TEXT,
  "instructions" TEXT,
  "logoUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DonationMethod_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "DonationMethod_isActive_sortOrder_idx" ON "DonationMethod"("isActive", "sortOrder");

CREATE TABLE "ImpactStatistic" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "description" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ImpactStatistic_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ImpactStatistic_key_key" ON "ImpactStatistic"("key");
CREATE INDEX "ImpactStatistic_sortOrder_idx" ON "ImpactStatistic"("sortOrder");

CREATE TABLE "Cause" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT,
  "icon" TEXT,
  "color" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Cause_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Cause_slug_key" ON "Cause"("slug");
CREATE INDEX "Cause_isActive_sortOrder_idx" ON "Cause"("isActive", "sortOrder");

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "page" TEXT NOT NULL,
  "title" TEXT,
  "altText" TEXT,
  "url" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "MediaAsset_key_key" ON "MediaAsset"("key");
CREATE INDEX "MediaAsset_page_idx" ON "MediaAsset"("page");

CREATE TABLE "GalleryItem" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "imageUrl" TEXT NOT NULL,
  "category" "GalleryCategory" NOT NULL DEFAULT 'OTHER',
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "GalleryItem_category_isPublished_sortOrder_idx" ON "GalleryItem"("category", "isPublished", "sortOrder");

CREATE TABLE "NewsArticle" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "imageUrl" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");
CREATE INDEX "NewsArticle_published_publishedAt_idx" ON "NewsArticle"("published", "publishedAt");
