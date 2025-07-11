FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 50054

RUN npx prisma generate

CMD ["npm", "start"]
