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

# Fail the image build if Nest did not produce the expected entry point.
RUN test -f /app/dist/main.js

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]