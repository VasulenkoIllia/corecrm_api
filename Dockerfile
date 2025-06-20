# Базовий образ
FROM node:18-alpine AS builder
LABEL authors="MonsterPC"

WORKDIR /app
COPY package.json yarn.lock ./
# Використовуємо --legacy-peer-deps для вирішення конфлікту залежностей
RUN yarn install --frozen-lockfile --legacy-peer-deps --silent
COPY . .
RUN yarn build

# Продакшен образ
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
# Використовуємо --legacy-peer-deps для продакшен-залежностей
RUN yarn install --production --frozen-lockfile --legacy-peer-deps --silent
EXPOSE 3000
CMD ["node", "dist/main.js"]

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1


