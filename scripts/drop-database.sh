#!/bin/bash

# Скрипт для видалення бази даних PostgreSQL
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

# Перевірка наявності .env у корені проєкту
if [ ! -f ../.env ]; then
    echo -e "${RED}.env файл не знайдено в корені проєкту. Створіть .env на основі .env.example.${NC}"
    exit 1
fi

# Завантаження .env
set -o allexport
source ../.env
set +o allexport

# Перевірка, чи запущений контейнер PostgreSQL
echo -e "${YELLOW}Перевірка запуску PostgreSQL...${NC}"
sleep 5 # Затримка для ініціалізації
if ! docker ps -q -f name=postgres | grep -q .; then
    echo -e "${RED}Контейнер PostgreSQL не запущений. Запустіть сервіси за допомогою ./run-local.sh${NC}"
    exit 1
fi

# Попередження
echo -e "${RED}УВАГА: Цей скрипт видалить базу даних ${DB_NAME:-corecrm_api}. Продовжити? [y/N]${NC}"
read -r confirm
if [[ ! "$confirm" =~ ^[yY]$ ]]; then
    echo -e "${YELLOW}Операцію скасовано.${NC}"
    exit 0
fi

# Виконання DROP DATABASE
echo -e "${YELLOW}Видаляємо базу даних ${DB_NAME:-corecrm_api}...${NC}"
docker exec -i $(docker ps -q -f name=postgres) psql -U ${DB_USERNAME} -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME:-corecrm_api};"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}База даних ${DB_NAME:-corecrm_api} видалена успішно!${NC}"
else
    echo -e "${RED}Не вдалося видалити базу даних. Перевірте, чи запущений контейнер PostgreSQL і чи правильні параметри в .env.${NC}"
    exit 1
fi

# Створення нової бази для консистентності
echo -e "${YELLOW}Створюємо нову базу даних ${DB_NAME:-corecrm_api}...${NC}"
docker exec -i $(docker ps -q -f name=postgres) psql -U ${DB_USERNAME} -d postgres -c "CREATE DATABASE ${DB_NAME:-corecrm_api};"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}База даних ${DB_NAME:-corecrm_api} створена успішно!${NC}"
else
    echo -e "${RED}Не вдалося створити нову базу даних.${NC}"
    exit 1
fi
