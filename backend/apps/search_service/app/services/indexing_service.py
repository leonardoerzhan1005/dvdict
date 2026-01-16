from typing import Optional
from sqlalchemy.orm import Session
from apps.search_service.app.repositories.search_repo import SearchRepository


class IndexingService:
    def __init__(self, db: Session):
        self.search_repo = SearchRepository(db)
        self.db = db
    
    def index_term(
        self,
        term_id: int,
        language: str,
        title: str,
        definition: str,
        short_definition: Optional[str],
        examples: Optional[str],
        synonyms: Optional[str],
        tags_text: Optional[str],
        status: str,
        category_id: int,
        is_deleted: bool,
        views: int,
        created_at: str
    ) -> None:
        self.search_repo.index_term(
            term_id=term_id,
            language=language,
            title=title,
            definition=definition,
            short_definition=short_definition,
            examples=examples,
            synonyms=synonyms,
            tags_text=tags_text
        )
        
        self.search_repo.update_term_meta(
            term_id=term_id,
            status=status,
            category_id=category_id,
            is_deleted=is_deleted,
            views=views,
            created_at=created_at
        )
    
    def delete_term(self, term_id: int) -> None:
        self.search_repo.delete_term(term_id)
