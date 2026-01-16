from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from apps.dictionary_service.app.db.models.term import Term, TermStatus
from apps.dictionary_service.app.db.models.term_translation import TermTranslation


class TermRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        slug: str,
        category_id: int,
        author_id: int,
        status: TermStatus = TermStatus.draft
    ) -> Term:
        term = Term(
            slug=slug,
            category_id=category_id,
            author_id=author_id,
            status=status
        )
        self.db.add(term)
        self.db.commit()
        self.db.refresh(term)
        return term
    
    def get_by_id(self, term_id: int) -> Optional[Term]:
        return self.db.query(Term).filter(
            Term.id == term_id,
            Term.is_deleted == False
        ).first()
    
    def get_by_slug(self, slug: str) -> Optional[Term]:
        return self.db.query(Term).filter(
            Term.slug == slug,
            Term.is_deleted == False
        ).first()
    
    def get_all(
        self,
        category_id: Optional[int] = None,
        status: Optional[TermStatus] = None,
        language: Optional[str] = None,
        letter: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Term]:
        query = self.db.query(Term).filter(Term.is_deleted == False)
        
        if category_id:
            query = query.filter(Term.category_id == category_id)
        
        if status:
            query = query.filter(Term.status == status)
        
        if language and letter:
            query = query.join(TermTranslation).filter(
                TermTranslation.language == language,
                TermTranslation.title.like(f"{letter}%")
            )
        
        return query.offset(offset).limit(limit).all()
    
    def count(self, category_id: Optional[int] = None, status: Optional[TermStatus] = None) -> int:
        query = self.db.query(Term).filter(Term.is_deleted == False)
        
        if category_id:
            query = query.filter(Term.category_id == category_id)
        
        if status:
            query = query.filter(Term.status == status)
        
        return query.count()
    
    def update(self, term: Term, **kwargs) -> Term:
        for key, value in kwargs.items():
            if hasattr(term, key):
                setattr(term, key, value)
        self.db.commit()
        self.db.refresh(term)
        return term
    
    def soft_delete(self, term: Term) -> None:
        term.is_deleted = True
        self.db.commit()
    
    def increment_views(self, term_id: int) -> None:
        term = self.get_by_id(term_id)
        if term:
            term.views += 1
            self.db.commit()
    
    def add_translation(
        self,
        term_id: int,
        language: str,
        title: str,
        definition: str,
        short_definition: Optional[str] = None,
        examples: Optional[str] = None,
        synonyms: Optional[str] = None,
        antonyms: Optional[str] = None
    ) -> TermTranslation:
        translation = TermTranslation(
            term_id=term_id,
            language=language,
            title=title,
            definition=definition,
            short_definition=short_definition,
            examples=examples,
            synonyms=synonyms,
            antonyms=antonyms
        )
        self.db.add(translation)
        self.db.commit()
        self.db.refresh(translation)
        return translation
    
    def get_translation(self, term_id: int, language: str) -> Optional[TermTranslation]:
        return self.db.query(TermTranslation).filter(
            TermTranslation.term_id == term_id,
            TermTranslation.language == language
        ).first()
    
    def update_translation(self, translation: TermTranslation, **kwargs) -> TermTranslation:
        for key, value in kwargs.items():
            if hasattr(translation, key):
                setattr(translation, key, value)
        self.db.commit()
        self.db.refresh(translation)
        return translation
