from typing import Optional, List
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.models.tag import Tag


class TagRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, slug: str) -> Tag:
        tag = Tag(slug=slug)
        self.db.add(tag)
        self.db.commit()
        self.db.refresh(tag)
        return tag
    
    def get_by_id(self, tag_id: int) -> Optional[Tag]:
        return self.db.query(Tag).filter(Tag.id == tag_id).first()
    
    def get_by_slug(self, slug: str) -> Optional[Tag]:
        return self.db.query(Tag).filter(Tag.slug == slug).first()
    
    def get_all(self) -> List[Tag]:
        return self.db.query(Tag).all()
    
    def get_or_create(self, slug: str) -> Tag:
        tag = self.get_by_slug(slug)
        if not tag:
            tag = self.create(slug)
        return tag
