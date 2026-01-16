from sqlalchemy import Column, Integer, String, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from apps.dictionary_service.app.db.base import Base


class TermTranslation(Base):
    __tablename__ = "term_translations"
    
    id = Column(Integer, primary_key=True, index=True)
    term_id = Column(Integer, ForeignKey("terms.id"), nullable=False)
    language = Column(String(2), nullable=False)
    title = Column(String(255), nullable=False)
    definition = Column(Text, nullable=False)
    short_definition = Column(Text, nullable=True)
    examples = Column(Text, nullable=True)
    synonyms = Column(Text, nullable=True)
    antonyms = Column(Text, nullable=True)
    
    term = relationship("Term", back_populates="translations")
    
    __table_args__ = (UniqueConstraint("term_id", "language", name="uq_term_language"),)
