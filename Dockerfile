FROM node:14

WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install

COPY ./ /app/
CMD ["npm", "run", "start" ,"--" ,"--host", "0.0.0.0", "--poll", "1000"]

