ALTER TABLE "NewsArticle"
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'PROGRAMME UPDATE';

INSERT INTO "NewsArticle"
  ("id","title","slug","category","excerpt","content","imageUrl","published","publishedAt","createdAt","updatedAt")
VALUES
  (
    '7a5b2e2f-1c3d-4a6f-8b91-2d7e4c5a6101',
    'Creating safe spaces where every child can grow',
    'creating-safe-spaces-where-every-child-can-grow',
    'PROGRAMME UPDATE',
    'Our work continues to focus on creating caring environments where vulnerable children feel protected, supported and encouraged to learn.',
    'At Glory Children Ministry, creating a safe and caring environment is at the heart of everything we do. Our programmes bring together practical care, guidance and opportunities for children who need additional support.

Through community engagement, counselling, education support and day-to-day care, we continue working alongside families and local communities to help children build confidence and discover new possibilities.

Every small step matters — from a child returning to school to a young person finding encouragement, belonging and a reason to dream again.',
    '/images/hero-children.png',
    true,
    '2026-09-24 10:30:00',
    '2026-09-24 10:30:00',
    '2026-09-24 10:30:00'
  ),
  (
    '8b6c3f30-2d4e-5b70-9ca2-3e8f5d6b7212',
    'Education opens doors to opportunity',
    'education-opens-doors-to-opportunity',
    'EDUCATION',
    'Supporting children in school means more than providing a classroom. It means helping them access the tools, encouragement and confidence to keep learning.',
    'Education remains one of the practical ways we can help children build a stronger future. Our support focuses on helping vulnerable children stay connected to learning and experience the encouragement that comes with being supported.

We celebrate teachers, caregivers, families, volunteers and partners who make these opportunities possible. Their commitment helps children approach school with greater confidence and hope.

We believe every child deserves the opportunity to discover their abilities and develop the skills they need for the future.',
    '/images/about-children.png',
    true,
    '2026-09-15 14:15:00',
    '2026-09-15 14:15:00',
    '2026-09-15 14:15:00'
  ),
  (
    '9c7d4a41-3e5f-6c81-adb3-4f906e7c8323',
    'When a community comes together, hope reaches further',
    'when-a-community-comes-together-hope-reaches-further',
    'COMMUNITY',
    'Partnership and community support allow us to respond to practical needs while building longer-term opportunities for children and families.',
    'Lasting change is rarely achieved alone. Our work depends on relationships with families, community members, volunteers and people who choose to support children in practical ways.

From food and healthcare support to education, counselling and skills development, every contribution becomes part of a wider network of care.

We are grateful to everyone who gives time, resources, encouragement or expertise. Together, these acts of support help us reach further.',
    '/images/4.png',
    true,
    '2026-09-06 09:00:00',
    '2026-09-06 09:00:00',
    '2026-09-06 09:00:00'
  );