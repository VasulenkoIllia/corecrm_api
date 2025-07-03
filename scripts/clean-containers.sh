#!/bin/bash

# Скрипт для очищення Docker-контейнерів та образів

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

# Використання docker-compose із сумісним синтаксисом для Windows
export COMPOSE_CONVERT_WINDOWS_PATHS=1

# Очищення сервісів
echo -e "${YELLOW}Очищаємо сервіси з docker-compose.dev.yaml...${NC}"
if [ -f ../docker-compose.dev.yaml ]; then
    docker-compose -f ../docker-compose.dev.yaml down --remove-orphans
else
    echo -e "${RED}docker-compose.dev.yaml не знайдено в корені проєкту.${NC}"
fi

echo -e "${YELLOW}Очищаємо сервіси з docker-compose.prod.yaml...${NC}"
if [ -f ../docker-compose.prod.yaml ]; then
    docker-compose -f ../docker-compose.prod.yaml down --remove-orphans
else
    echo -e "${RED}docker-compose.prod.yaml не знайдено в корені проєкту.${NC}"
fi

# Очищення невикористаних образів
echo -e "${YELLOW}Очищаємо невикористані образи...${NC}"
docker image prune -f

echo -e "${GREEN}Очищення контейнерів завершено успішно!${NC}"
