ALTER TABLE "DonationMethod"
  ADD COLUMN "country" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "contactNumber" TEXT;

INSERT INTO "DonationMethod" (
  "id", "name", "accountName", "accountNumber", "instructions",
  "country", "city", "contactNumber", "isActive", "sortOrder", "updatedAt"
)
SELECT
  'f4c7a7a0-0e55-4d0c-8e4e-6d7a7e0f4c01',
  'Western Union',
  'Ssuna Khalim',
  '+256755575982',
  'Send your donation through Western Union using the recipient details below.',
  'Uganda',
  'Kampala',
  '+256755575982',
  true,
  3,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "DonationMethod"
  WHERE LOWER("name") = LOWER('Western Union')
);