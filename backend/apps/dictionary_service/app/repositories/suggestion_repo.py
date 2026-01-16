from typing import Optional, List
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.models.term_suggestion import TermSuggestion, SuggestionStatus


class SuggestionRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        user_id: int,
        language: str,
        term_text: str,
        category_id: Optional[int] = None,
        definition: Optional[str] = None
    ) -> TermSuggestion:
        suggestion = TermSuggestion(
            user_id=user_id,
            category_id=category_id,
            language=language,
            term_text=term_text,
            definition=definition
        )
        self.db.add(suggestion)
        self.db.commit()
        self.db.refresh(suggestion)
        return suggestion
    
    def get_by_id(self, suggestion_id: int) -> Optional[TermSuggestion]:
        return self.db.query(TermSuggestion).filter(TermSuggestion.id == suggestion_id).first()
    
    def get_all(
        self,
        status: Optional[SuggestionStatus] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[TermSuggestion]:
        query = self.db.query(TermSuggestion)
        
        if status:
            query = query.filter(TermSuggestion.status == status)
        
        return query.offset(offset).limit(limit).all()
    
    def update(self, suggestion: TermSuggestion, **kwargs) -> TermSuggestion:
        for key, value in kwargs.items():
            if hasattr(suggestion, key):
                setattr(suggestion, key, value)
        self.db.commit()
        self.db.refresh(suggestion)
        return suggestion
