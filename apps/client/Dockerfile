FROM node:alpine3.20

WORKDIR /app

COPY *.json ./
COPY *.ts ./

RUN yarn install

EXPOSE 5173

CMD ["yarn", "run", "dev"]
