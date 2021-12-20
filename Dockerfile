FROM node:14

WORKDIR /app
COPY . /app

RUN npm ci && npm run build && npm run build:worker && npm ci --production

CMD npm run start
