UPDATE "Cause"
SET "imageUrl" = CASE "slug"
  WHEN 'education' THEN '/images/education.jpg'
  WHEN 'health' THEN '/images/health.jpg'
  WHEN 'food' THEN '/images/food.jpg'
  WHEN 'guidance-counselling' THEN '/images/guidance.jpg'
  WHEN 'shelter-protection' THEN '/images/shelter.jpg'
  WHEN 'skills-future' THEN '/images/skills.jpg'
  ELSE "imageUrl"
END
WHERE "slug" IN ('education', 'health', 'food', 'guidance-counselling', 'shelter-protection', 'skills-future')
  AND ("imageUrl" IS NULL OR BTRIM("imageUrl") = '' OR "imageUrl" = '/images/about-children.png');
