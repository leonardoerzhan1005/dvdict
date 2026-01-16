#!/usr/bin/env python3
"""
Скрипт для проверки пользователей в базе данных
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apps.auth_service.app.db.session import SessionLocal as AuthSession, init_db as init_auth_db
from apps.auth_service.app.repositories.user_repo import UserRepository
from apps.auth_service.app.core.security import verify_password

def check_user(email: str, password: str = None):
    """Проверяет существование пользователя и правильность пароля"""
    init_auth_db()
    db = AuthSession()
    
    try:
        user_repo = UserRepository(db)
        user = user_repo.get_by_email(email)
        
        if not user:
            print(f"❌ Пользователь с email {email} не найден")
            print("\nДоступные пользователи:")
            # Получаем всех пользователей
            from apps.auth_service.app.db.models.user import User
            all_users = db.query(User).all()
            for u in all_users:
                print(f"  - {u.email} (role: {u.role})")
            return False
        
        print(f"✓ Пользователь найден:")
        print(f"  Email: {user.email}")
        print(f"  Имя: {user.name}")
        print(f"  Роль: {user.role}")
        print(f"  Email verified: {user.is_email_verified}")
        
        if password:
            if verify_password(password, user.password_hash):
                print(f"✓ Пароль правильный")
                return True
            else:
                print(f"❌ Пароль неправильный")
                return False
        
        return True
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Использование: python scripts/check_user.py <email> [password]")
        print("Пример: python scripts/check_user.py admin@example.com admin123")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2] if len(sys.argv) > 2 else None
    
    check_user(email, password)
