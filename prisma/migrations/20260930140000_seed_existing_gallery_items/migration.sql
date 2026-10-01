-- Rebuild the gallery records from the images currently used by the public website.
DELETE FROM "GalleryItem";

INSERT INTO "GalleryItem" ("id", "title", "description", "imageUrl", "category", "isPublished", "sortOrder", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Smiles that tell a story', 'Children smiling together.', '/images/hero-children.png', 'DAILY_LIFE_GROWTH', true, 0, NOW(), NOW()),
  (gen_random_uuid(), 'Learning with purpose', 'Children learning together.', '/images/about-children.png', 'LEARNING_CREATIVITY', true, 1, NOW(), NOW()),
  (gen_random_uuid(), 'Growing together', 'Children and community moment.', '/images/4.png', 'COMMUNITY_FELLOWSHIP', true, 2, NOW(), NOW()),
  (gen_random_uuid(), 'A place to belong', 'Children sharing a joyful moment.', '/images/hero-children.png', 'COMMUNITY_FELLOWSHIP', true, 3, NOW(), NOW()),
  (gen_random_uuid(), 'Every child matters', 'Children benefiting from education.', '/images/about-children.png', 'DAILY_LIFE_GROWTH', true, 4, NOW(), NOW()),
  (gen_random_uuid(), 'Hope in every moment', 'Children enjoying time together.', '/images/4.png', 'DAILY_LIFE_GROWTH', true, 5, NOW(), NOW()),
  (gen_random_uuid(), 'Building brighter futures', 'Children in a learning environment.', '/images/about-children.png', 'LEARNING_CREATIVITY', true, 6, NOW(), NOW()),
  (gen_random_uuid(), 'Together we can', 'Children together in community.', '/images/hero-children.png', 'COMMUNITY_FELLOWSHIP', true, 7, NOW(), NOW()),
  (gen_random_uuid(), 'Celebrating possibility', 'Children celebrating together.', '/images/4.png', 'EVENTS_MILESTONES', true, 8, NOW(), NOW());
