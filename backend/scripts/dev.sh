#!/bin/bash

cd "$(dirname "$0")/.."

export PYTHONPATH="${PYTHONPATH}:$(pwd)"

echo "Starting Auth Service on port 8001..."
cd apps/auth_service && uvicorn app.main:app --port 8001 --reload &
AUTH_PID=$!

echo "Starting Dictionary Service on port 8002..."
cd "$(dirname "$0")/.." && cd apps/dictionary_service && uvicorn app.main:app --port 8002 --reload &
DICT_PID=$!

echo "Starting Search Service on port 8003..."
cd "$(dirname "$0")/.." && cd apps/search_service && uvicorn app.main:app --port 8003 --reload &
SEARCH_PID=$!

echo "Starting Import/Export Service on port 8004..."
cd "$(dirname "$0")/.." && cd apps/import_export_service && uvicorn app.main:app --port 8004 --reload &
IMPORT_PID=$!

echo "Starting Admin Service on port 8005..."
cd "$(dirname "$0")/.." && cd apps/admin_service && uvicorn app.main:app --port 8005 --reload &
ADMIN_PID=$!

echo "All services started!"
echo "Auth Service: http://localhost:8001"
echo "Dictionary Service: http://localhost:8002"
echo "Search Service: http://localhost:8003"
echo "Import/Export Service: http://localhost:8004"
echo "Admin Service: http://localhost:8005"

trap "kill $AUTH_PID $DICT_PID $SEARCH_PID $IMPORT_PID $ADMIN_PID" EXIT

wait
