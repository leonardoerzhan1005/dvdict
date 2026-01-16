from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime, timezone
from apps.search_service.app.db.base import Base


class SearchHistory(Base):
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True, index=True)
    query = Column(Text, nullable=False)
    lang = Column(String(2), nullable=False)
    filters_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
