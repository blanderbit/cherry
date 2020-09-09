#FROM angular/ngcontainer
FROM node:10.18.1-buster
WORKDIR /server
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run pack 

FROM node:10.18.1-alpine3.9
WORKDIR /server
COPY --from=0 /server/app .
ENTRYPOINT npm start
