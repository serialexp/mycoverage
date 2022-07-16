FROM node:16

WORKDIR /app
COPY . /app

RUN npm ci && node_modules/.bin/blitz prisma generate && npm run build && npm run build:worker

CMD node_modules/.bin/blitz prisma migrate deploy && npm run start
