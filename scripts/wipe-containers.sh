#!/bin/bash

# Скрипт для повного стирання Docker-контейнерів, образів і томів
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
    echo -e "${RED}docker-compose не встановлено. Переконайтеся, що Docker Desktop відповідає вимогам.${NC}"
    exit 1
fi

# Використання docker-compose із сумісним синтаксисом для Windows
export COMPOSE_CONVERT_WINDOWS_PATHS=1

# Попередження
echo -e "${RED}УВАГА: Цей скрипт видалить усі контейнери, образи та томи, пов’язані з проєктом. Продовжити? [y/N]${NC}"
read -r confirm
if [[ ! "$confirm" =~ ^[yY]$ ]]; then
    echo -e "${YELLOW}Операцію скасовано.${NC}"
    exit 0
fi

# Очищення сервісів
echo -e "${YELLOW}Видаляємо сервіси з docker-compose.dev.yaml...${NC}"
if [ -f ../docker-compose.dev.yaml ]; then
    docker-compose -f ../docker-compose.dev.yaml down --volumes --remove-orphans
else
    echo -e "${RED}docker-compose.dev.yaml не знайдено в корені проєкту.${NC}"
fi

echo -e "${YELLOW}Видаляємо сервіси з docker-compose.prod.yaml...${NC}"
if [ -f ../docker-compose.prod.yaml ]; then
    docker-compose -f ../docker-compose.prod.yaml down --volumes --remove-orphans
else
    echo -e "${RED}docker-compose.prod.yaml не знайдено в корені проєкту.${NC}"
fi

# Очищення всіх образів
echo -e "${YELLOW}Видаляємо всі образи, пов’язані з проєктом...${NC}"
docker images -q | sort -u | xargs -r docker rmi -f

# Очищення всіх томів
echo -e "${YELLOW}Видаляємо всі томи...${NC}"
docker volume prune -f

echo -e "${GREEN}Стирання завершено успішно!${NC}"
