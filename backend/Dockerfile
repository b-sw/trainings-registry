FROM node:22-alpine AS development

WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build
RUN yarn install --frozen-lockfile --production && yarn cache clean

FROM node:22-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main.js"]