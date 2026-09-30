FROM node:22-bookworm-slim

WORKDIR /app

# Prisma requires OpenSSL/libssl in the Linux runtime.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

# Copy the Prisma schema/config before the build so Prisma can generate the client.
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY nest-cli.json tsconfig.json ./
COPY src ./src

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
