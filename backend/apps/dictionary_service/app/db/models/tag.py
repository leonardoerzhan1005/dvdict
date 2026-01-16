from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from apps.dictionary_service.app.db.base import Base


class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    
    terms = relationship("Term", secondary="term_tags", back_populates="tags")
