# Railway deployment fix

This version fixes the Railway build failure caused by `postinstall: prisma generate` running in Railway's dependency-install stage before the source tree is available.

## What changed

- Removed the Prisma `postinstall` hook.
- `npm run build` now explicitly runs `prisma generate --schema=./prisma/schema.prisma` before `nest build`.
- Pinned `@apollo/server` to `4.13.0`, matching the Apollo Playground peer dependency pulled by `@nestjs/apollo@13.4.5`.
- Railway is explicitly configured to use the Dockerfile.
- Docker installs OpenSSL before Prisma generation/runtime.
- Railway runs `npm run prisma:deploy` as a pre-deploy migration step.
- The application start command is only `node dist/main.js`.
- The Prisma schema and migrations are copied into the Docker image.

## Railway variables

Set these in the Railway service:

- `DATABASE_URL` — reference the Railway PostgreSQL service's `DATABASE_URL`.
- `JWT_SECRET` — long random secret.
- `RESEND_API_KEY` — Resend API key.
- `RESEND_FROM_EMAIL` — verified sender, for example `Glory Children Ministry <noreply@your-verified-domain>`.
- `NOTIFICATION_EMAIL` — `info@glorychildrenministry.org`.
- `CORS_ORIGINS` — your Next.js production URL, optionally comma-separated with local development URLs.
- `ADMIN_EMAIL` — admin email used by the seed.
- `ADMIN_PASSWORD` — strong production admin password used by the seed.

## Deployment

Push the contents of this folder to `gcmdev12/gcm_backend` and trigger a new Railway deployment.

Railway should show that it is using the Dockerfile. The build sequence is:

1. install dependencies
2. copy Prisma/source files
3. generate Prisma client
4. compile NestJS
5. deploy migrations
6. start NestJS

The health endpoint is `/api/health`.
