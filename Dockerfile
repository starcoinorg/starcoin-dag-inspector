#FROM node:16-alpine as build
#
#WORKDIR /app
#
#COPY package*.json yarn*.lock ./
#
## Set enviroments
##ENV REACT_APP_STARCOIN_API_URL=https://doapi.stcscan.io
##ENV REACT_APP_STARCOIN_NETWORKS=main,banard,proxima,halley,vega
#
#ENV REACT_APP_API_ADDRESS=http://167.99.28.243/v2/dag-inspector
#REACT_APP_EXPLORER_ADDRESS=https://stcscan.io
#REACT_APP_STARCOIN_LIVE_ADDRESS=167.99.28.243
## REACT_APP_STARCOIN_NETWORK=vega
#
#COPY . .
#
## Build project
#RUN yarn install && yarn build
#
#FROM nginx:alpine
#
#COPY --from=build /app/build /usr/share/nginx/html
#
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#
#EXPOSE 80
#
#CMD ["nginx", "-g", "daemon off;"]
FROM node:16-alpine AS build
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ARG REACT_APP_API_ADDRESS
ARG REACT_APP_KATNIP_ADDRESS
ARG REACT_APP_STARCOIN_LIVE_ADDRESS
ARG REACT_APP_SUPPORT_STARCOIN_NETWORK
RUN REACT_APP_API_ADDRESS=${REACT_APP_API_ADDRESS} \
    REACT_APP_KATNIP_ADDRESS=${REACT_APP_KATNIP_ADDRESS} \
    REACT_APP_STARCOIN_LIVE_ADDRESS=${REACT_APP_STARCOIN_LIVE_ADDRESS} \
    npm run build

FROM node:16-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build /app/
