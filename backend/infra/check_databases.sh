#!/bin/bash

# Скрипт для проверки состояния баз данных SQLite

echo "=== Проверка баз данных SQLite ==="
echo ""

cd "$(dirname "$0")" || exit 1

# Проверка существования директорий
echo "1. Проверка директорий для баз данных:"
for dir in data/auth data/dictionary data/search data/import_export data/admin; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir существует"
    else
        echo "  ✗ $dir не найдена"
    fi
done

echo ""
echo "2. Проверка файлов баз данных:"

# Проверка каждой базы данных
check_db() {
    local db_path=$1
    local service_name=$2
    
    if [ -f "$db_path" ]; then
        size=$(ls -lh "$db_path" | awk '{print $5}')
        echo "  ✓ $service_name: $db_path ($size)"
        
        # Проверка таблиц в базе данных (если sqlite3 установлен)
        if command -v sqlite3 &> /dev/null; then
            table_count=$(sqlite3 "$db_path" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null || echo "0")
            if [ "$table_count" != "0" ]; then
                echo "    - Таблиц в базе: $table_count"
            else
                echo "    - ⚠ База данных пуста (нет таблиц)"
            fi
        fi
    else
        echo "  ✗ $service_name: $db_path не найдена"
        echo "    - База будет создана при первом запуске сервиса"
    fi
}

check_db "data/auth/auth_service.db" "auth-service"
check_db "data/dictionary/dictionary_service.db" "dictionary-service"
check_db "data/search/search_service.db" "search-service"
check_db "data/import_export/import_export_service.db" "import-export-service"
check_db "data/admin/admin_service.db" "admin-service"

echo ""
echo "3. Проверка контейнеров Docker:"
if command -v docker &> /dev/null; then
    if [ -f "compose.prod.yml" ]; then
        # Определение команды docker compose
        if command -v docker-compose &> /dev/null; then
            DOCKER_COMPOSE="docker-compose"
        elif docker compose version &> /dev/null; then
            DOCKER_COMPOSE="docker compose"
        else
            DOCKER_COMPOSE=""
        fi
        
        if [ ! -z "$DOCKER_COMPOSE" ]; then
            echo "  Статус сервисов:"
            $DOCKER_COMPOSE -f compose.prod.yml ps 2>/dev/null || echo "    Не удалось получить статус"
        fi
    fi
fi

echo ""
echo "=== Инструкции ==="
echo ""
echo "Для добавления тестовых данных (admin@example.com / admin123):"
echo "  cd /opt/dictionary-backend/backend/infra"
echo "  docker compose -f compose.prod.yml exec -w /app dictionary-service python scripts/seed.py"
echo ""
echo "Для проверки содержимого базы данных:"
echo "  sqlite3 data/auth/auth_service.db '.tables'"
echo "  sqlite3 data/auth/auth_service.db 'SELECT * FROM users;'"
echo ""
echo "Для просмотра логов сервиса:"
echo "  docker compose -f compose.prod.yml logs <service-name>"
