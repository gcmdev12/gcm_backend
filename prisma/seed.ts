import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required for seeding');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@glorychildrenministry.org').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe!12345';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { firstName: 'GCM', lastName: 'Administrator', passwordHash, isActive: true },
    create: { email: adminEmail, firstName: 'GCM', lastName: 'Administrator', passwordHash },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: 'Glory Children Ministry',
      tagline: 'Hope, Education & Opportunity',
      email: 'info@glorychildrenministry.org',
      location: 'Uganda',
    },
  });

  const causes = [
    ['education', 'Education', 'Helping vulnerable children access quality education and the tools they need to learn, grow and build a brighter future.', 'GraduationCap', '#e83e8c'],
    ['health', 'Health', 'Supporting children with access to medical care, health education, prevention and essential wellbeing services.', 'Stethoscope', '#2196f3'],
    ['food', 'Food', 'Providing nutritious meals and food support so children can grow with dignity, strength and hope.', 'Utensils', '#f59e0b'],
    ['guidance-counselling', 'Guidance & Counselling', 'Offering guidance, counselling, mentorship and emotional support that helps children navigate difficult circumstances.', 'Users', '#7c3aed'],
    ['shelter-protection', 'Shelter & Protection', 'Working toward safe, protective environments where vulnerable children can be cared for, protected and supported.', 'Home', '#ef4444'],
    ['skills-future', 'Skills & Future', 'Building practical skills, confidence and opportunities that prepare young people for sustainable futures.', 'Wrench', '#14b8a6'],
  ];
  for (let i = 0; i < causes.length; i++) {
    const [slug, name, description, icon, color] = causes[i];
    await prisma.cause.upsert({ where: { slug }, update: { name, description, icon, color, sortOrder: i }, create: { slug, name, description, icon, color, sortOrder: i } });
  }

  const stats = [
    ['children-supported', 'Children Supported', '1000+', 'Children reached through our programmes.', 0],
    ['children-in-school', 'Enrolled in School', '200+', 'Children supported with education access.', 1],
    ['medical-care', 'Received Medical Care', '100+', 'Children reached with medical support.', 2],
    ['districts-reached', 'Districts Reached', '12+', 'Districts reached through ministry activities.', 3],
  ] as const;
  for (const [key, label, value, description, sortOrder] of stats) {
    await prisma.impactStatistic.upsert({ where: { key }, update: { label, value, description, sortOrder }, create: { key, label, value, description, sortOrder } });
  }

  const media = [
    ['home.hero.1', 'home', 'Hero Carousel 1', 'Hero carousel image 1', '/images/4.png'],
    ['home.hero.2', 'home', 'Hero Carousel 2', 'Hero carousel image 2', '/images/hero-children.png'],
    ['home.hero.3', 'home', 'Hero Carousel 3', 'Hero carousel image 3', '/images/about-children.png'],
    ['home.about', 'home', 'About image', 'Home about image', '/images/2.jpg'],
    ['home.impact', 'home', 'Impact image', 'Home impact image', '/images/about-children.png'],
    ['about.hero', 'about', 'About hero', 'About page hero image', '/images/hero-children.png'],
    ['about.who-we-are', 'about', 'Who we are', 'About who-we-are image', '/images/about-children.png'],
    ['about.impact', 'about', 'Impact', 'About impact image', '/images/2.jpg'],
    ['causes.education', 'causes', 'Education', 'Education cause image', '/images/about-children.png'],
    ['causes.health', 'causes', 'Health', 'Health cause image', '/images/about-children.png'],
    ['causes.food', 'causes', 'Food', 'Food cause image', '/images/about-children.png'],
    ['causes.guidance-counselling', 'causes', 'Guidance & Counselling', 'Guidance cause image', '/images/about-children.png'],
    ['causes.shelter-protection', 'causes', 'Shelter & Protection', 'Shelter cause image', '/images/about-children.png'],
    ['causes.skills-future', 'causes', 'Skills & Future', 'Skills cause image', '/images/about-children.png'],
    ['gallery.hero', 'gallery', 'Gallery hero', 'Gallery hero image', '/images/hero-children.png'],
    ['news.hero', 'news', 'News hero', 'News page hero image', '/images/hero-children.png'],
  ] as const;
  for (const [key, page, title, altText, url] of media) {
    await prisma.mediaAsset.upsert({ where: { key }, update: { page, title, altText, url }, create: { key, page, title, altText, url } });
  }

  const donations = [
    ['MTN Mobile Money', 'Glory Children Ministry', '', 'Update this account number in the admin dashboard before publishing.', '', 0],
    ['Airtel Money', 'Glory Children Ministry', '', 'Update this account number in the admin dashboard before publishing.', '', 1],
    ['DTB Bank', 'Glory Children Ministry', '', 'Update the bank account details in the admin dashboard before publishing.', '', 2],
  ] as const;
  for (const [name, accountName, accountNumber, instructions, logoUrl, sortOrder] of donations) {
    const existing = await prisma.donationMethod.findFirst({ where: { name } });
    if (!existing) await prisma.donationMethod.create({ data: { name, accountName, accountNumber, instructions, logoUrl, sortOrder } });
  }

  console.log(`Seed complete. Admin: ${adminEmail}`);
  console.log('For security, set ADMIN_PASSWORD explicitly when seeding production.');
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
