from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from apps.dictionary_service.app.core.config import settings
from apps.dictionary_service.app.db.base import Base
from apps.dictionary_service.app.db.models import (
    Category,
    CategoryTranslation,
    Term,
    TermTranslation,
    Tag,
    TermTag,
    Favorite,
    TermRevision,
    TermSuggestion
)

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
