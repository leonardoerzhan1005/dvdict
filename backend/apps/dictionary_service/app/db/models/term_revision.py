from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from apps.dictionary_service.app.db.base import Base


class TermRevision(Base):
    __tablename__ = "term_revisions"
    
    id = Column(Integer, primary_key=True, index=True)
    term_id = Column(Integer, ForeignKey("terms.id"), nullable=False)
    user_id = Column(Integer, nullable=False)
    old_data_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    term = relationship("Term", back_populates="revisions")
