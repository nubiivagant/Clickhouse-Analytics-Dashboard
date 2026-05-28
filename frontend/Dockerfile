FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:20-alpine AS production
RUN apk add --no-cache curl
WORKDIR /usr/src/app
RUN npm install -g serve
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
