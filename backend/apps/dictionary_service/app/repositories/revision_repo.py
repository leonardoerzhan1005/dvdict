from typing import List
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.models.term_revision import TermRevision
import json


class RevisionRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, term_id: int, user_id: int, old_data: dict) -> TermRevision:
        revision = TermRevision(
            term_id=term_id,
            user_id=user_id,
            old_data_json=json.dumps(old_data)
        )
        self.db.add(revision)
        self.db.commit()
        self.db.refresh(revision)
        return revision
    
    def get_by_term(self, term_id: int) -> List[TermRevision]:
        return self.db.query(TermRevision).filter(
            TermRevision.term_id == term_id
        ).order_by(TermRevision.created_at.desc()).all()
