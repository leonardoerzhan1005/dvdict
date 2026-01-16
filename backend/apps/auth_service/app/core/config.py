from pydantic_settings import BaseSettings
import os
from pathlib import Path


class Settings(BaseSettings):
    app_name: str = "Auth Service"
    # Путь к базе данных: когда сервис запускается из apps/auth_service,
    # база должна быть в той же директории (apps/auth_service/auth_service.db)
    _current_file = Path(__file__)
    # config.py находится в apps/auth_service/app/core/config.py
    # Нужно подняться на 3 уровня: core -> app -> auth_service
    _service_dir = _current_file.parent.parent.parent  # apps/auth_service
    _db_path = _service_dir / "auth_service.db"
    # Создаем директорию если не существует
    _db_path.parent.mkdir(parents=True, exist_ok=True)
    database_url: str = f"sqlite:///{_db_path}"
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    email_verification_token_expire_hours: int = 24
    password_reset_token_expire_hours: int = 1
    
    class Config:
        env_file = ".env"


settings = Settings()
