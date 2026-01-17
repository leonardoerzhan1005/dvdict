#!/usr/bin/env python3
"""
Скрипт для создания администратора вручную
Использование:
  python create_admin.py <email> <password> <name>
  или просто запустите без параметров для создания дефолтного админа
"""

import sys
import os

# Добавляем путь к проекту
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apps.auth_service.app.db.session import SessionLocal, init_db
from apps.auth_service.app.repositories.user_repo import UserRepository
from apps.auth_service.app.core.security import get_password_hash
from libs.shared.shared.security.roles import Role


def create_admin(email: str = "admin@example.com", password: str = "admin123", name: str = "Admin"):
    """Создает администратора в базе данных"""
    
    # Инициализация базы данных
    init_db()
    
    # Создание сессии
    db = SessionLocal()
    
    try:
        user_repo = UserRepository(db)
        
        # Проверка, существует ли уже пользователь с таким email
        existing_user = user_repo.get_by_email(email)
        if existing_user:
            print(f"❌ Пользователь с email {email} уже существует!")
            print(f"   ID: {existing_user.id}, Name: {existing_user.name}, Role: {existing_user.role}")
            return False
        
        # Создание пароля
        password_hash = get_password_hash(password)
        
        # Создание администратора
        admin = user_repo.create(
            name=name,
            email=email,
            password_hash=password_hash,
            role=Role.admin.value
        )
        
        print("=" * 60)
        print("✓ Администратор успешно создан!")
        print("=" * 60)
        print(f"ID:       {admin.id}")
        print(f"Email:    {admin.email}")
        print(f"Name:     {admin.name}")
        print(f"Role:     {admin.role}")
        print(f"Password: {password} (сохраните пароль в безопасном месте)")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print(f"❌ Ошибка при создании администратора: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) >= 4:
        email = sys.argv[1]
        password = sys.argv[2]
        name = sys.argv[3]
    elif len(sys.argv) >= 3:
        email = sys.argv[1]
        password = sys.argv[2]
        name = "Admin"
    elif len(sys.argv) >= 2:
        email = sys.argv[1]
        password = "admin123"
        name = "Admin"
    else:
        email = "admin@example.com"
        password = "admin123"
        name = "Admin"
        print("Создание администратора с параметрами по умолчанию:")
        print(f"  Email: {email}")
        print(f"  Password: {password}")
        print(f"  Name: {name}")
        print()
    
    success = create_admin(email, password, name)
    sys.exit(0 if success else 1)
