FROM node:20-alpine AS base
WORKDIR /usr/src/app

FROM base AS builder
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm install
COPY . ./

FROM base AS production
RUN apk add --no-cache curl
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
RUN npm prune --production
EXPOSE 5000
CMD ["node", "server.js"]
