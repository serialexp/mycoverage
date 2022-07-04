FROM node:16

WORKDIR /app
COPY . /app

RUN npm ci && node_modules/.bin/blitz prisma generate && npm run build && npm run build:worker

CMD npm run start
