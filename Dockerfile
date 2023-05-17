FROM node:18

WORKDIR /app
COPY . /app

ENV DATABASE_URL=mysql://localhost

RUN npm install -g pnpm
RUN pnpm install && node_modules/.bin/prisma generate && pnpm run build && pnpm run build:worker

CMD node_modules/.bin/prisma migrate deploy && pnpm run start
