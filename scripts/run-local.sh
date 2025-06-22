#!/bin/bash

# Скрипт для запуску сервісів у локальному середовищі (без бекенду)
# Розташований у папці scripts

# Кольори для виведення
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Перевірка наявності Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker не встановлено. Встановіть Docker Desktop для Windows: https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi

# Перевірка наявності docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}docker-compose не встановлено. Переконайтеся, що Docker Desktop включає docker-compose.${NC}"
    exit 1
fi

# Перевірка наявності .env у корені проєкту
if [ ! -f ../.env ]; then
    echo -e "${YELLOW}.env файл не знайдено в корені проєкту. Копіюємо .env.example до .env...${NC}"
    cp ../.env.example ../.env
    echo -e "${YELLOW}Будь ласка, відредагуйте .env файл у корені проєкту з вашими налаштуваннями перед продовженням.${NC}"
    exit 1
fi

# Перевірка наявності schema.prisma
if [ ! -f ../prisma/schema.prisma ]; then
    echo -e "${RED}schema.prisma не знайдено в папці prisma. Створіть schema.prisma для Prisma.${NC}"
    exit 1
fi

# Завантаження .env
set -o allexport
source ../.env
set +o allexport

# Використання docker-compose із сумісним синтаксисом для Windows
export COMPOSE_CONVERT_WINDOWS_PATHS=1

# Генерація Prisma клієнта
echo -e "${YELLOW}Генеруємо Prisma клієнт...${NC}"
cd .. && yarn prisma:generate && cd scripts

# Запуск сервісів
echo -e "${GREEN}Запускаємо сервіси для локальної розробки...${NC}"
docker-compose -f ../docker-compose.dev.yaml up -d

# Застосування міграцій Prisma
echo -e "${YELLOW}Застосовуємо міграції Prisma...${NC}"
cd .. && yarn prisma:migrate:dev && cd scripts

# Перевірка статусу сервісів
echo -e "${YELLOW}Перевіряємо статус сервісів...${NC}"
docker-compose -f ../docker-compose.dev.yaml ps


# Перевірка доступності сервісів із повторними спробами
echo -e "${YELLOW}Перевірка доступності сервісів (затримка 5 секунд)...${NC}"
sleep 5

# Функція для перевірки сервісу з повторними спробами
check_service() {
    local cmd=$1
    local success_msg=$2
    local error_msg=$3
    local max_attempts=2
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo -e "${YELLOW}Спроба $attempt/$max_attempts...${NC}"
        if eval "$cmd" &> /dev/null; then
            echo -e "${GREEN}$success_msg${NC}"
            return 0
        fi
        sleep 2
        attempt=$((attempt + 1))
    done
    echo -e "${RED}$error_msg${NC}"
    return 1
}

# Перевірка PostgreSQL
check_service \
    "docker exec $(docker ps -q -f name=postgres) pg_isready -U ${DB_USERNAME}" \
    "PostgreSQL доступний на http://localhost:${DB_PORT:-5432}" \
    "PostgreSQL недоступний. Перевірте логи: docker-compose -f ../docker-compose.dev.yaml logs postgres"

# Перевірка Elasticsearch
check_service \
    "curl -f http://localhost:${ELASTICSEARCH_PORT:-9200}/_cluster/health" \
    "Elasticsearch доступний на http://localhost:${ELASTICSEARCH_PORT:-9200}" \
    "Elasticsearch недоступний. Перевірте логи: docker-compose -f ../docker-compose.dev.yaml logs elasticsearch"

# Перевірка Redis
#check_service \
#    "redis-cli -h localhost -p ${REDIS_PORT:-6379} ping" \
#    "Redis доступний на http://localhost:${REDIS_PORT:-6379}" \
#    "Redis недоступний. Перевірте логи: docker-compose -f ../docker-compose.dev.yaml logs redis"

# Перевірка Mailhog
check_service \
    "curl -f http://localhost:8025" \
    "Mailhog доступний на http://localhost:8025" \
    "Mailhog недоступний. Перевірте логи: docker-compose -f ../docker-compose.dev.yaml logs mailhog"

# Перевірка RabbitMQ через rabbitmqctl
check_service \
    "docker exec $(docker ps -q -f name=rabbitmq) rabbitmqctl status" \
    "RabbitMQ доступний" \
    "RabbitMQ недоступний. Перевірте логи: docker-compose -f ../docker-compose.dev.yaml logs rabbitmq"

# Інструкція для запуску бекенду
echo -e "${GREEN}Сервіси запущено. Для запуску бекенду виконайте:${NC}"
echo -e "${YELLOW}cd ..${NC}"
echo -e "${YELLOW}yarn install --frozen-lockfile --legacy-peer-deps${NC}"
echo -e "${YELLOW}yarn start:dev${NC}"
