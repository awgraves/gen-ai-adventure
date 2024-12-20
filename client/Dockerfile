FROM node:alpine3.20

WORKDIR /app

COPY *.json ./
COPY *.ts ./

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
