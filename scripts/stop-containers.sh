#!/bin/bash

# Скрипт для зупинки Docker-контейнерів
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

# Використання docker-compose із сумісним синтаксисом для Windows
export COMPOSE_CONVERT_WINDOWS_PATHS=1

# Зупинка сервісів (спробуємо обидва docker-compose файли)
echo -e "${YELLOW}Зупиняємо сервіси з docker-compose.dev.yaml...${NC}"
if [ -f ../docker-compose.dev.yaml ]; then
    docker-compose -f ../docker-compose.dev.yaml stop
else
    echo -e "${RED}docker-compose.dev.yaml не знайдено в корені проєкту.${NC}"
fi

echo -e "${YELLOW}Зупиняємо сервіси з docker-compose.prod.yaml...${NC}"
if [ -f ../docker-compose.prod.yaml ]; then
    docker-compose -f ../docker-compose.prod.yaml stop
else
    echo -e "${RED}docker-compose.prod.yaml не знайдено в корені проєкту.${NC}"
fi

# Перевірка статусу сервісів
echo -e "${YELLOW}Перевіряємо статус сервісів...${NC}"
if [ -f ../docker-compose.dev.yaml ]; then
    docker-compose -f ../docker-compose.dev.yaml ps
fi
if [ -f ../docker-compose.prod.yaml ]; then
    docker-compose -f ../docker-compose.prod.yaml ps
fi

echo -e "${GREEN}Контейнери зупинено успішно!${NC}"
