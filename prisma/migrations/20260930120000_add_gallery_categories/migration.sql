-- Add the new public gallery categories while retaining legacy values for existing rows.
ALTER TYPE "GalleryCategory" ADD VALUE IF NOT EXISTS 'DAILY_LIFE_GROWTH';
ALTER TYPE "GalleryCategory" ADD VALUE IF NOT EXISTS 'COMMUNITY_FELLOWSHIP';
ALTER TYPE "GalleryCategory" ADD VALUE IF NOT EXISTS 'LEARNING_CREATIVITY';
ALTER TYPE "GalleryCategory" ADD VALUE IF NOT EXISTS 'EVENTS_MILESTONES';
ALTER TYPE "GalleryCategory" ADD VALUE IF NOT EXISTS 'OTHERS';
