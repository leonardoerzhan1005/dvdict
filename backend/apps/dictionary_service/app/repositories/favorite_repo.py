from typing import List, Optional
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.models.favorite import Favorite
from apps.dictionary_service.app.db.models.term import Term


class FavoriteRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, term_id: int) -> Favorite:
        favorite = Favorite(user_id=user_id, term_id=term_id)
        self.db.add(favorite)
        self.db.commit()
        self.db.refresh(favorite)
        return favorite
    
    def get_by_user_and_term(self, user_id: int, term_id: int) -> Optional[Favorite]:
        return self.db.query(Favorite).filter(
            Favorite.user_id == user_id,
            Favorite.term_id == term_id
        ).first()
    
    def get_user_favorites(self, user_id: int, limit: int = 20, offset: int = 0) -> List[Favorite]:
        return self.db.query(Favorite).filter(
            Favorite.user_id == user_id
        ).offset(offset).limit(limit).all()
    
    def count_user_favorites(self, user_id: int) -> int:
        return self.db.query(Favorite).filter(Favorite.user_id == user_id).count()
    
    def delete(self, favorite: Favorite) -> None:
        self.db.delete(favorite)
        self.db.commit()
