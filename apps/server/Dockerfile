FROM node:alpine3.20

WORKDIR /app

COPY *.json ./

RUN yarn install

EXPOSE 9999

CMD ["yarn", "run", "dev"]
