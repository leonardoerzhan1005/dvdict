from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from apps.dictionary_service.app.db.base import Base
import enum


class TermStatus(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    archived = "archived"


class Term(Base):
    __tablename__ = "terms"
    
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    status = Column(SQLEnum(TermStatus), default=TermStatus.draft, nullable=False, index=True)
    author_id = Column(Integer, nullable=False)
    views = Column(Integer, default=0, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    category = relationship("Category", back_populates="terms")
    translations = relationship("TermTranslation", back_populates="term", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary="term_tags", back_populates="terms")
    favorites = relationship("Favorite", back_populates="term", cascade="all, delete-orphan")
    revisions = relationship("TermRevision", back_populates="term", cascade="all, delete-orphan")
