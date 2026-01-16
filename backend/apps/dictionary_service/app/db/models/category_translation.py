from sqlalchemy import Column, Integer, String, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from apps.dictionary_service.app.db.base import Base


class CategoryTranslation(Base):
    __tablename__ = "category_translations"
    
    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    language = Column(String(2), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    category = relationship("Category", back_populates="translations")
    
    __table_args__ = (UniqueConstraint("category_id", "language", name="uq_category_language"),)
