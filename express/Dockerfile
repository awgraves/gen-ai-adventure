FROM node:alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 9999

CMD ["npm", "run", "dev"]
