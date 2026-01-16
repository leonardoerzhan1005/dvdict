from sqlalchemy import Column, Integer, ForeignKey, PrimaryKeyConstraint
from apps.dictionary_service.app.db.base import Base


class TermTag(Base):
    __tablename__ = "term_tags"
    
    term_id = Column(Integer, ForeignKey("terms.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False)
    
    __table_args__ = (PrimaryKeyConstraint("term_id", "tag_id"),)
