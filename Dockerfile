FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
CMD ["./node_modules/.bin/ng", "serve", "--host", "0.0.0.0"]
