from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from apps.search_service.app.core.config import settings
from apps.search_service.app.db.base import Base

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    Base.metadata.create_all(bind=engine)
    
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE VIRTUAL TABLE IF NOT EXISTS fts_terms USING fts5(
                term_id UNINDEXED,
                language UNINDEXED,
                title,
                definition,
                short_definition,
                examples,
                synonyms,
                tags_text,
                prefix='2 3 4',
                tokenize='unicode61'
            )
        """))
        
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS term_meta (
                term_id INTEGER PRIMARY KEY,
                status TEXT NOT NULL,
                category_id INTEGER,
                is_deleted INTEGER DEFAULT 0,
                views INTEGER DEFAULT 0,
                created_at TEXT
            )
        """))
        
        conn.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
