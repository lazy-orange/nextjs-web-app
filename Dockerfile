FROM node:11 as build

ENV WORKDIR             /usr/src/app
WORKDIR                 $WORKDIR

COPY package.json package-lock.json $WORKDIR/
RUN npm ci --development

COPY . .
RUN npm run build

FROM node:11

ENV WORKDIR             /usr/src/app
WORKDIR                 $WORKDIR

COPY package.json package-lock.json $WORKDIR/
RUN npm ci --production

COPY --from=build $WORKDIR/dist $WORKDIR/dist
COPY --from=build $WORKDIR/.next $WORKDIR/.next

EXPOSE 3000

CMD ["npm", "start"]
