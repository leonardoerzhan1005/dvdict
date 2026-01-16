from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from apps.dictionary_service.app.db.base import Base


class Favorite(Base):
    __tablename__ = "favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    term_id = Column(Integer, ForeignKey("terms.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    term = relationship("Term", back_populates="favorites")
    
    __table_args__ = (UniqueConstraint("user_id", "term_id", name="uq_user_term"),)
