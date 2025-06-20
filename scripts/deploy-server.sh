#!/bin/bash

# Скрипт для розгортання додатку та сервісів на сервері
# Розташований у папці scripts

# Кольори для виведення
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Перевірка наявності Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker не встановлено. Встановіть Docker перед запуском скрипта.${NC}"
    exit 1
fi

# Перевірка наявності docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}docker-compose не встановлено. Встановіть docker-compose перед запуском скрипта.${NC}"
    exit 1
fi

# Перевірка наявності .env у корені проєкту
if [ ! -f ../.env ]; then
    echo -e "${RED}.env файл не знайдено в корені проєкту. Створіть .env на основі .env.example і заповніть необхідні змінні.${NC}"
    exit 1
fi

# Завантаження .env
set -o allexport
source ../.env
set +o allexport

# Використання docker-compose із сумісним синтаксисом для Windows
export COMPOSE_CONVERT_WINDOWS_PATHS=1

# Очищення попередніх образів
echo -e "${YELLOW}Очищаємо старі образи та контейнери...${NC}"
docker-compose -f ../docker-compose.prod.yaml down --remove-orphans
docker image prune -f

# Виконання білду
echo -e "${GREEN}Виконуємо білд додатку...${NC}"
docker-compose -f ../docker-compose.prod.yaml build --no-cache

# Виконання міграцій Prisma
echo -e "${YELLOW}Виконуємо міграції Prisma...${NC}"
docker-compose -f ../docker-compose.prod.yaml run --rm app yarn prisma:migrate:deploy

# Запуск усіх сервісів
echo -e "${GREEN}Запускаємо сервіси та додаток...${NC}"
docker-compose -f ../docker-compose.prod.yaml up -d

# Перевірка статусу сервісів
echo -e "${YELLOW}Перевіряємо статус сервісів...${NC}"
docker-compose -f ../docker-compose.prod.yaml ps

# Перевірка доступності із повторними спробами
echo -e "${YELLOW}Перевірка доступності сервісів (затримка 20 секунд)...${NC}"
sleep 20

# Функція для перевірки сервісу з повторними спробами
check_service() {
    local cmd=$1
    local success_msg=$2
    local error_msg=$3
    local max_attempts=3
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo -e "${YELLOW}Спроба $attempt/$max_attempts...${NC}"
        if eval "$cmd" &> /dev/null; then
            echo -e "${GREEN}$success_msg${NC}"
            return 0
        fi
        sleep 5
        attempt=$((attempt + 1))
    done
    echo -e "${RED}$error_msg${NC}"
    return 1
}

# Перевірка додатку
check_service \
    "curl -f http://localhost:${PORT:-3000}/health" \
    "Додаток доступний на http://localhost:${PORT:-3000}" \
    "Додаток недоступний. Перевірте логи: docker-compose -f ../docker-compose.prod.yaml logs app"

# Перевірка Elasticsearch
check_service \
    "curl -f http://localhost:${ELASTICSEARCH_PORT:-9200}/_cluster/health" \
    "Elasticsearch доступний на http://localhost:${ELASTICSEARCH_PORT:-9200}" \
    "Elasticsearch недоступний. Перевірте логи: docker-compose -f ../docker-compose.prod.yaml logs elasticsearch"

# Перевірка Redis
check_service \
    "redis-cli -h localhost -p ${REDIS_PORT:-6379} ping" \
    "Redis доступний на localhost:${REDIS_PORT:-6379}" \
    "Redis недоступний. Перевірте логи: docker-compose -f ../docker-compose.prod.yaml logs redis"

# Перевірка Mailhog
check_service \
    "curl -f http://localhost:8025" \
    "Mailhog доступний на http://localhost:8025" \
    "Mailhog недоступний. Перевірте логи: docker-compose -f ../docker-compose.prod.yaml logs mailhog"

# Перевірка RabbitMQ через rabbitmqctl
check_service \
    "docker exec $(docker ps -q -f name=rabbitmq) rabbitmqctl status" \
    "RabbitMQ доступний" \
    "RabbitMQ недоступний. Перевірте логи: docker-compose -f ../docker-compose.prod.yaml logs rabbitmq"

echo -e "${GREEN}Розгортання завершено успішно!${NC}"
