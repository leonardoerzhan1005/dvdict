#!/bin/bash

# Скрипт для деплоя на сервер
# Использование: ./deploy.sh

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Параметры подключения к серверу
SERVER_IP="194.32.142.196"
SERVER_USER="ubuntu"
SERVER_PASSWORD="N+ClxHm79aStK/7IbKIy0to="
REMOTE_DIR="/opt/dictionary-backend"

echo -e "${GREEN}Начинаем деплой на сервер...${NC}"

# Проверка наличия sshpass (для автоматического ввода пароля)
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}Установка sshpass...${NC}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update && sudo apt-get install -y sshpass
    fi
fi

# Переход в директорию backend
cd "$(dirname "$0")/../.."

echo -e "${GREEN}Создание архива проекта...${NC}"
tar --exclude='venv' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='*.db' \
    --exclude='.git' \
    --exclude='.env' \
    -czf /tmp/dictionary-backend.tar.gz .

echo -e "${GREEN}Копирование файлов на сервер...${NC}"
sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=no /tmp/dictionary-backend.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

echo -e "${GREEN}Подключение к серверу и развертывание...${NC}"
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    set -e
    
    # Создание директории для проекта
    sudo mkdir -p /opt/dictionary-backend
    sudo chown -R ubuntu:ubuntu /opt/dictionary-backend
    
    # Распаковка архива
    cd /opt/dictionary-backend
    tar -xzf /tmp/dictionary-backend.tar.gz
    rm /tmp/dictionary-backend.tar.gz
    
    # Переход в директорию infra
    cd infra
    
    # Остановка старых контейнеров
    docker-compose -f compose.prod.yml down || true
    
    # Создание директорий для данных
    mkdir -p data/auth data/dictionary data/search data/import_export data/admin
    
    # Создание .env файла если его нет
    if [ ! -f .env ]; then
        echo "SECRET_KEY=$(openssl rand -hex 32)" > .env
    fi
    
    # Сборка и запуск контейнеров
    docker-compose -f compose.prod.yml build --no-cache
    docker-compose -f compose.prod.yml up -d
    
    # Ожидание запуска сервисов
    echo "Ожидание запуска сервисов..."
    sleep 10
    
    # Проверка статуса
    docker-compose -f compose.prod.yml ps
    
    echo "Деплой завершен успешно!"
ENDSSH

echo -e "${GREEN}Очистка временных файлов...${NC}"
rm -f /tmp/dictionary-backend.tar.gz

echo -e "${GREEN}Деплой завершен!${NC}"
echo -e "${YELLOW}Проверьте статус сервисов:${NC}"
echo "ssh ${SERVER_USER}@${SERVER_IP} 'cd /opt/dictionary-backend/infra && docker-compose -f compose.prod.yml ps'"
