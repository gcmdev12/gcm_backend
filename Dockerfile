FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY nest-cli.json tsconfig.json ./
COPY src ./src

RUN npm run build

RUN echo "=== BUILD OUTPUT ===" \
    && find /app/dist -maxdepth 3 -type f -print \
    && test -f /app/dist/src/main.js

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]