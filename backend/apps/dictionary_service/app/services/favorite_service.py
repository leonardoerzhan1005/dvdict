from typing import List
from sqlalchemy.orm import Session
from apps.dictionary_service.app.repositories.favorite_repo import FavoriteRepository
from apps.dictionary_service.app.repositories.term_repo import TermRepository
from apps.dictionary_service.app.db.models.favorite import Favorite
from libs.shared.shared.errors.exceptions import NotFoundError, ConflictError


class FavoriteService:
    def __init__(self, db: Session):
        self.favorite_repo = FavoriteRepository(db)
        self.term_repo = TermRepository(db)
        self.db = db
    
    def add_favorite(self, user_id: int, term_id: int) -> None:
        term = self.term_repo.get_by_id(term_id)
        if not term:
            raise NotFoundError("Term", str(term_id))
        
        existing = self.favorite_repo.get_by_user_and_term(user_id, term_id)
        if existing:
            raise ConflictError("Term already in favorites")
        
        self.favorite_repo.create(user_id, term_id)
    
    def remove_favorite(self, user_id: int, term_id: int) -> None:
        favorite = self.favorite_repo.get_by_user_and_term(user_id, term_id)
        if not favorite:
            raise NotFoundError("Favorite", f"{user_id}:{term_id}")
        
        self.favorite_repo.delete(favorite)
    
    def get_user_favorites(self, user_id: int, limit: int = 100, offset: int = 0) -> List[Favorite]:
        return self.favorite_repo.get_user_favorites(user_id, limit, offset)
    
    def count_user_favorites(self, user_id: int) -> int:
        return self.favorite_repo.count_user_favorites(user_id)
