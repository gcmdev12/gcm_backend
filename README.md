# Glory Children Ministry Backend

NestJS + GraphQL + Prisma 7 + PostgreSQL backend for the Glory Children Ministry public website and `/manage` admin dashboard.

## Stack

- NestJS 12
- GraphQL Code First with Apollo Server
- Prisma ORM 7.10 + PostgreSQL driver adapter
- PostgreSQL (Railway recommended for production)
- JWT admin authentication
- bcrypt password hashing
- Resend Node.js SDK for notification email
- class-validator / ValidationPipe

## What is included

### Public website API

GraphQL endpoint: `/graphql`

Public queries:

- `siteSettings`
- `donationMethods`
- `causes`
- `impactStatistics`
- `mediaAssets`
- `galleryItems`
- `newsArticles`

Public mutations:

- `submitContactForm`
- `submitVolunteerForm`
- `subscribeNewsletter`

Each public form is inserted into PostgreSQL first. After the insert succeeds, a Resend notification is fired to `NOTIFICATION_EMAIL` (default `info@glorychildrenministry.org`). Resend failures do not delete the submitted record; they are written to `EmailNotificationLog`.

### Admin API

Admin authentication:

- `login`
- `me`
- `updateMyProfile`
- `changeMyPassword`

Protected dashboard/content operations cover:

- Dashboard counts / notifications
- Contact submissions
- Volunteer submissions
- Newsletter subscribers
- Site contact/social settings
- Donation methods
- Impact statistics
- Causes
- Media assets
- Gallery items
- News articles

Send the JWT returned by `login` as:

`Authorization: Bearer <accessToken>`

## Local setup

Use Node.js 22 LTS (Node 20.19+ is supported by this project). Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `JWT_SECRET`, and the Resend variables.

Then generate Prisma Client:

```bash
npm run prisma:generate
```

Create/apply a development migration:

```bash
npm run prisma:migrate -- --name init
```

If using the migration included in this repository instead:

```bash
npm run prisma:deploy
```

Seed:

```bash
npm run prisma:seed
```

Start:

```bash
npm run start:dev
```

Health check:

`GET http://localhost:3000/api/health`

GraphQL in development:

`http://localhost:3000/graphql`

## Seed data

Set these before seeding:

```env
ADMIN_EMAIL=admin@glorychildrenministry.org
ADMIN_PASSWORD=use-a-strong-password-here
```

Then:

```bash
npm run prisma:seed
```

The seed creates:

- One super-admin account
- Site settings
- The six agreed causes
- The four impact statistics
- Placeholder MTN, Airtel and DTB donation methods

The donation account numbers are intentionally blank in the seed. Add the real details through the admin dashboard before making them public.

## Railway PostgreSQL deployment

1. Create a Railway project.
2. Add a PostgreSQL service.
3. Add this backend as a service from GitHub, or deploy it with the Railway CLI.
4. Make sure the backend service has the PostgreSQL `DATABASE_URL` reference.
5. Add these variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM=Glory Children Ministry <notifications@glorychildrenministry.org>
NOTIFICATION_EMAIL=info@glorychildrenministry.org
CORS_ORIGINS=https://glorychildrenministry.org,https://www.glorychildrenministry.org
PUBLIC_SITE_URL=https://glorychildrenministry.org
NODE_ENV=production
```

The production start command runs:

```bash
prisma migrate deploy && node dist/main.js
```

This applies committed Prisma migrations before the NestJS server starts.

## Resend setup

1. Create a Resend account.
2. Add and verify `glorychildrenministry.org` as a sending domain.
3. Create a sending API key.
4. Put the key into `RESEND_API_KEY` on Railway.
5. Use a verified address under your domain for `RESEND_FROM`.
6. Keep `info@glorychildrenministry.org` as `NOTIFICATION_EMAIL` unless you want notifications delivered elsewhere.

The backend uses `replyTo` so an administrator can reply directly to the person who submitted the contact or volunteer form.

## GraphQL frontend integration

The Next.js website should call the public mutations. The admin dashboard should first call `login`, store the access token securely, and send it as the Authorization header on subsequent GraphQL requests.

For the public contact form the operation is conceptually:

```graphql
mutation SubmitContact($input: ContactSubmissionInput!) {
  submitContactForm(input: $input)
}
```

Volunteer:

```graphql
mutation SubmitVolunteer($input: VolunteerSubmissionInput!) {
  submitVolunteerForm(input: $input)
}
```

Newsletter:

```graphql
mutation Subscribe($input: NewsletterInput!) {
  subscribeNewsletter(input: $input)
}
```

## Important production notes

- Never commit `.env`.
- Use a long random `JWT_SECRET` in Railway.
- Do not use the seed's development password in production.
- Verify the Resend sending domain before using a custom `RESEND_FROM` address.
- Restrict `CORS_ORIGINS` to the actual website/admin origins.
- Keep the generated `prisma/migrations` directory in Git.
- Back up the Railway PostgreSQL database before destructive schema changes.
- The current backend intentionally stores image URLs rather than binary image files. This lets the dashboard work with an external object/image host or the existing Next.js public image assets. A future upload service can be added without changing the core content models.

## Recommended deployment order

For a fresh Railway database:

```bash
npm install
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run build
npm run start:prod
```

For normal Railway deployments, the service starts with `npm run start:prod`, which applies any committed migrations and then launches NestJS.

## Useful Prisma commands

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create and apply a development migration
npm run prisma:migrate -- --name add_something

# Apply committed migrations to Railway/production
npm run prisma:deploy

# Run the seed script explicitly
npm run prisma:seed

# Open Prisma Studio
npm run prisma:studio

# Reset a development database (DESTRUCTIVE)
npm run db:reset
```


## Dependency note
This release uses the NestJS 12 dependency family. `@nestjs/config` is pinned to the Nest 12-compatible 12.x major. Do not use `--force` or `--legacy-peer-deps`.

If you previously extracted an older release, delete `node_modules` and `package-lock.json` before installing this release:

```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

On macOS/Linux:

```bash
rm -rf node_modules package-lock.json
npm install
```
