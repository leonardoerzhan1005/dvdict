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

# Переход в директорию проекта (корень)
cd "$(dirname "$0")/../.."

# Сборка фронтенда для продакшена
echo -e "${GREEN}Сборка фронтенда...${NC}"
if [ -d "frontend" ]; then
    cd frontend
    
    # Удаляем node_modules и package-lock.json для переустановки на правильной платформе
    echo -e "${YELLOW}Очистка старых зависимостей...${NC}"
    rm -rf node_modules
    rm -f package-lock.json
    
    # Устанавливаем зависимости заново (это решит проблему с esbuild для разных платформ)
    echo -e "${YELLOW}Установка зависимостей фронтенда...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Ошибка при установке зависимостей фронтенда!${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Сборка фронтенда для продакшена...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}Ошибка при сборке фронтенда!${NC}"
        exit 1
    fi
    cd ..
else
    echo -e "${YELLOW}Директория frontend не найдена, пропускаем сборку фронтенда${NC}"
fi

echo -e "${GREEN}Создание архива проекта...${NC}"
tar --exclude='venv' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='*.db' \
    --exclude='.git' \
    --exclude='.env' \
    --exclude='node_modules' \
    --exclude='frontend/node_modules' \
    --exclude='frontend/.vite' \
    --exclude='package-lock.json' \
    --exclude='frontend/package-lock.json' \
    -czf /tmp/dictionary-backend.tar.gz .

echo -e "${GREEN}Копирование файлов на сервер...${NC}"
sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=no /tmp/dictionary-backend.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

echo -e "${GREEN}Подключение к серверу и развертывание...${NC}"
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
    set -e
    
    # Определение команды docker compose (поддержка v1 и v2)
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    elif docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
    else
        echo "Ошибка: docker-compose не найден. Установите Docker Compose."
        exit 1
    fi
    
    # Создание директории для проекта
    sudo mkdir -p /opt/dictionary-backend
    sudo chown -R ubuntu:ubuntu /opt/dictionary-backend
    
    # Распаковка архива с сохранением существующих данных
    cd /opt/dictionary-backend
    
    # Сохраняем существующие базы данных и .env файл перед распаковкой
    echo "Сохранение существующих данных..."
    if [ -f backend/infra/.env ]; then
        cp backend/infra/.env /tmp/.env.backup
        echo "  - .env файл сохранен"
    fi
    
    if [ -d backend/infra/data ]; then
        tar -czf /tmp/data_backup.tar.gz -C backend/infra data/ 2>/dev/null || true
        echo "  - Директория data/ сохранена"
    fi
    
    # Распаковка нового архива
    tar -xzf /tmp/dictionary-backend.tar.gz
    rm /tmp/dictionary-backend.tar.gz
    
    # Восстанавливаем сохраненные данные
    if [ -f /tmp/.env.backup ]; then
        cp /tmp/.env.backup backend/infra/.env
        echo "  - .env файл восстановлен"
        rm /tmp/.env.backup
    fi
    
    if [ -f /tmp/data_backup.tar.gz ]; then
        # Восстанавливаем данные, но не перезаписываем если уже есть новые файлы
        tar -xzf /tmp/data_backup.tar.gz -C backend/infra/ --skip-old-files 2>/dev/null || true
        echo "  - Директория data/ восстановлена (существующие файлы сохранены)"
        rm /tmp/data_backup.tar.gz
    fi
    
    # Переход в директорию infra (после распаковки структура: backend/infra/)
    cd backend/infra || { echo "Ошибка: директория backend/infra не найдена"; exit 1; }
    
    # Проверка наличия собранного фронтенда
    FRONTEND_DIST="../../frontend/dist"
    if [ ! -d "$FRONTEND_DIST" ] || [ -z "$(ls -A $FRONTEND_DIST 2>/dev/null)" ]; then
        echo "Внимание: директория frontend/dist не найдена или пуста!"
        echo "Фронтенд должен быть собран перед деплоем (npm run build в директории frontend/)"
        echo "Создаем пустую директорию для предотвращения ошибок..."
        mkdir -p "$FRONTEND_DIST" || true
    else
        echo "Фронтенд найден в $FRONTEND_DIST"
        ls -la "$FRONTEND_DIST" | head -10
    fi
    
    # Остановка старых контейнеров
    $DOCKER_COMPOSE -f compose.prod.yml down || true
    
    # Освобождение портов 80 и 443
    echo "Проверка и освобождение портов 80 и 443..."
    
    # Остановка системного nginx, если запущен
    if systemctl is-active --quiet nginx 2>/dev/null; then
        echo "Остановка системного nginx..."
        sudo systemctl stop nginx || true
        sudo systemctl disable nginx || true
    fi
    
    # Остановка Apache, если запущен
    if systemctl is-active --quiet apache2 2>/dev/null; then
        echo "Остановка Apache..."
        sudo systemctl stop apache2 || true
        sudo systemctl disable apache2 || true
    fi
    
    # Поиск и остановка Docker-контейнеров, занимающих порты 80 и 443
    for port in 80 443; do
        CONTAINER_ID=$(sudo docker ps --format "{{.ID}}\t{{.Ports}}" | grep ":$port->" | awk '{print $1}' | head -1)
        if [ ! -z "$CONTAINER_ID" ]; then
            echo "Остановка контейнера $CONTAINER_ID, занимающего порт $port..."
            sudo docker stop "$CONTAINER_ID" || true
            sudo docker rm "$CONTAINER_ID" || true
        fi
    done
    
    # Проверка процессов, слушающих порты 80 и 443
    for port in 80 443; do
        PID=$(sudo lsof -ti:$port 2>/dev/null | head -1)
        if [ ! -z "$PID" ]; then
            echo "Завершение процесса $PID, занимающего порт $port..."
            sudo kill -9 "$PID" 2>/dev/null || true
        fi
    done
    
    echo "Порты 80 и 443 освобождены."
    
    # Создание директорий для данных SQLite (сохраняются между перезапусками)
    mkdir -p data/auth data/dictionary data/search data/import_export data/admin
    echo "Директории для баз данных созданы:"
    ls -la data/
    
    # Установка правильных прав доступа для директорий данных
    chmod -R 755 data/ || true
    
    # Создание директории для SSL сертификатов (если еще не создана)
    mkdir -p nginx/ssl
    
    # Создание директории для Let's Encrypt ACME challenge (если используется)
    sudo mkdir -p /var/www/certbot 2>/dev/null || true
    sudo chmod 755 /var/www/certbot 2>/dev/null || true
    
    # Создание .env файла только для SECRET_KEY (для auth-service JWT токенов)
    # Для SQLite базы данных .env не нужен - DATABASE_URL задается через environment в docker-compose
    if [ ! -f .env ]; then
        echo "SECRET_KEY=$(openssl rand -hex 32)" > .env
        echo "Файл .env создан с SECRET_KEY для JWT токенов"
    else
        echo "Файл .env уже существует"
    fi
    
    # Проверка существующих баз данных SQLite
    echo ""
    echo "=== Проверка существующих баз данных ==="
    for dir in data/*/; do
        if [ -d "$dir" ]; then
            db_files=$(find "$dir" -name "*.db" 2>/dev/null | wc -l)
            if [ "$db_files" -gt 0 ]; then
                echo "  Найдено баз данных в $dir: $db_files"
                find "$dir" -name "*.db" -exec ls -lh {} \;
            else
                echo "  В $dir базы данных еще нет (будет создана при первом запуске сервиса)"
            fi
        fi
    done
    
    # Сборка и запуск контейнеров
    $DOCKER_COMPOSE -f compose.prod.yml build --no-cache
    $DOCKER_COMPOSE -f compose.prod.yml up -d
    
    # Ожидание запуска сервисов
    echo "Ожидание запуска сервисов..."
    sleep 15
    
    # Проверка статуса
    echo ""
    echo "=== Статус контейнеров ==="
    $DOCKER_COMPOSE -f compose.prod.yml ps
    
    # Проверка создания баз данных после запуска
    echo ""
    echo "=== Проверка баз данных после запуска ==="
    for dir in data/*/; do
        if [ -d "$dir" ]; then
            db_files=$(find "$dir" -name "*.db" 2>/dev/null)
            if [ ! -z "$db_files" ]; then
                echo "  Базы данных в $dir:"
                for db in $db_files; do
                    size=$(ls -lh "$db" | awk '{print $5}')
                    echo "    - $(basename $db): $size"
                done
            else
                echo "  В $dir база данных еще не создана (проверьте логи сервиса)"
            fi
        fi
    done
    
    # Проверка перезапускающихся сервисов и вывод их логов
    echo ""
    echo "=== Проверка проблемных сервисов ==="
    RESTARTING_SERVICES=$($DOCKER_COMPOSE -f compose.prod.yml ps --format json | grep -i "restarting" | grep -o '"Name":"[^"]*"' | cut -d'"' -f4 || true)
    
    if [ ! -z "$RESTARTING_SERVICES" ]; then
        echo "Обнаружены перезапускающиеся сервисы. Логи последних ошибок:"
        echo ""
        for service in admin-service dictionary-service import-export-service search-service auth-service; do
            STATUS=$($DOCKER_COMPOSE -f compose.prod.yml ps --format json | grep "\"Name\":\"$service\"" | grep -o '"Status":"[^"]*"' | cut -d'"' -f4 || echo "")
            if echo "$STATUS" | grep -qi "restarting\|exited"; then
                echo "--- Логи сервиса $service ---"
                $DOCKER_COMPOSE -f compose.prod.yml logs --tail=50 $service || true
                echo ""
            fi
        done
        echo "Для просмотра полных логов используйте:"
        echo "  docker compose -f compose.prod.yml logs <service-name>"
    else
        echo "Все сервисы работают нормально!"
    fi
    
    echo ""
    echo "=== Информация о базах данных ==="
    echo "Базы данных SQLite сохраняются в:"
    echo "  - auth: data/auth/auth_service.db"
    echo "  - dictionary: data/dictionary/dictionary_service.db"
    echo "  - search: data/search/search_service.db"
    echo "  - import_export: data/import_export/import_export_service.db"
    echo "  - admin: data/admin/admin_service.db"
    echo ""
    echo "Для проверки состояния баз данных запустите:"
    echo "  cd /opt/dictionary-backend/backend/infra"
    echo "  ./check_databases.sh"
    echo ""
    echo "Для добавления тестовых данных (admin@example.com / admin123):"
    echo "  cd /opt/dictionary-backend/backend/infra"
    echo "  docker compose -f compose.prod.yml exec -w /app dictionary-service python scripts/seed.py"
    echo ""
    echo "Проверка логов сервисов для диагностики:"
    echo "  docker compose -f compose.prod.yml logs auth-service | tail -20"
    echo "  docker compose -f compose.prod.yml logs dictionary-service | tail -20"
    echo ""
    echo "ВАЖНО:"
    echo "  - Базы данных создаются автоматически при первом запуске сервисов"
    echo "  - Если базы пустые - это нормально. Добавьте данные через API или seed скрипт"
    echo "  - Базы данных сохраняются в data/*/ директориях и не удаляются при перезапуске"
    echo ""
    echo "ВНИМАНИЕ: Если получаете 401 при логине - создайте администратора:"
    echo ""
    echo "  Вариант 1 (через create_admin.py):"
    echo "    cd /opt/dictionary-backend/backend/infra"
    echo "    docker compose -f compose.prod.yml exec -w /app auth-service python scripts/create_admin.py"
    echo "    или с параметрами:"
    echo "    docker compose -f compose.prod.yml exec -w /app auth-service python scripts/create_admin.py <email> <password> <name>"
    echo ""
    echo "  Вариант 2 (через seed.py - создаст тестовые данные):"
    echo "    cd /opt/dictionary-backend/backend/infra"
    echo "    docker compose -f compose.prod.yml exec -w /app dictionary-service python scripts/seed.py"
    echo "    Затем войдите с: admin@example.com / admin123"
    echo ""
    echo "Деплой завершен!"
ENDSSH

echo -e "${GREEN}Очистка временных файлов...${NC}"
rm -f /tmp/dictionary-backend.tar.gz

echo -e "${GREEN}Деплой завершен!${NC}"
echo ""
echo -e "${YELLOW}Проверьте статус сервисов:${NC}"
echo "ssh ${SERVER_USER}@${SERVER_IP} 'cd /opt/dictionary-backend/backend/infra && (docker compose -f compose.prod.yml ps || docker-compose -f compose.prod.yml ps)'"
echo ""
echo -e "${YELLOW}Для просмотра логов проблемных сервисов:${NC}"
echo "ssh ${SERVER_USER}@${SERVER_IP} 'cd /opt/dictionary-backend/backend/infra && docker compose -f compose.prod.yml logs <service-name>'"
echo ""
echo -e "${GREEN}Настройка HTTPS (SSL):${NC}"
echo -e "${YELLOW}Для работы HTTPS (https://dvdictionary.kz/) нужно установить SSL сертификаты.${NC}"
echo ""
echo -e "${YELLOW}Вариант 1: Let's Encrypt (бесплатно, рекомендуется)${NC}"
echo "ssh ${SERVER_USER}@${SERVER_IP}"
echo "sudo apt-get update && sudo apt-get install -y certbot python3-certbot-nginx"
echo "sudo certbot --nginx -d dvdictionary.kz -d www.dvdictionary.kz"
echo ""
echo -e "${YELLOW}После установки сертификатов обновите nginx.conf:${NC}"
echo "- Раскомментируйте строки с Let's Encrypt путями"
echo "- Закомментируйте строки с /etc/nginx/ssl/"
echo ""
echo -e "${YELLOW}Вариант 2: Ручная установка сертификатов${NC}"
echo "- Скопируйте сертификаты в /opt/dictionary-backend/backend/infra/nginx/ssl/"
echo "- Назовите файлы: cert.pem и key.pem"
echo "- Перезапустите nginx: docker compose -f compose.prod.yml restart nginx"
echo ""
echo -e "${YELLOW}Важно:${NC}"
echo "- DNS должен указывать на ${SERVER_IP}"
echo "- Порты 80 и 443 должны быть открыты в файрволе"
