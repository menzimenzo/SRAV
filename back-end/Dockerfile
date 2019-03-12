FROM node:10.15

COPY . /app
WORKDIR /app

RUN yarn global add node-gyp && yarn

VOLUME /app

EXPOSE 3000

CMD ["yarn", "dev"]
