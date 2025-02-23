FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
COPY ./patches /app/patches
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
# Generate Prisma Client
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
# Install OpenSSL for Prisma
RUN apk add --no-cache openssl
COPY ./package.json package-lock.json /app/
COPY ./prisma /app/prisma
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
# Generate Prisma Client in production
RUN npx prisma generate

CMD ["npm", "run", "start"]