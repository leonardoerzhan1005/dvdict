from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from apps.auth_service.app.core.config import settings
from apps.auth_service.app.db.base import Base
from apps.auth_service.app.db.models import User, RefreshToken, AuditLog
import os
from pathlib import Path

# Убеждаемся, что директория для базы данных существует
db_path = settings.database_url.replace("sqlite:///", "")
db_dir = os.path.dirname(db_path)
if db_dir:
    Path(db_dir).mkdir(parents=True, exist_ok=True)

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
