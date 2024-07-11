FROM node:16-alpine as build

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

# Build project

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]