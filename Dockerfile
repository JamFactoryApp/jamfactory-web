FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
CMD ["app/node_modules/.bin/ng", "serve", "--host", "0.0.0.0"]
