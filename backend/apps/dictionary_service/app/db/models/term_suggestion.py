from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Enum as SQLEnum
from datetime import datetime, timezone
from apps.dictionary_service.app.db.base import Base
import enum


class SuggestionStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class TermSuggestion(Base):
    __tablename__ = "term_suggestions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    language = Column(String(2), nullable=False)
    term_text = Column(String(255), nullable=False)
    definition = Column(Text, nullable=True)
    status = Column(SQLEnum(SuggestionStatus), default=SuggestionStatus.pending, nullable=False, index=True)
    moderator_comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
