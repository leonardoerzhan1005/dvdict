from typing import List, Optional
from sqlalchemy.orm import Session
from apps.search_service.app.db.models.search_history import SearchHistory
import json


class HistoryRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        user_id: Optional[int],
        query: str,
        lang: str,
        filters: Optional[dict] = None
    ) -> SearchHistory:
        history = SearchHistory(
            user_id=user_id,
            query=query,
            lang=lang,
            filters_json=json.dumps(filters) if filters else None
        )
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history
    
    def get_user_history(self, user_id: int, limit: int = 20) -> List[SearchHistory]:
        return self.db.query(SearchHistory).filter(
            SearchHistory.user_id == user_id
        ).order_by(SearchHistory.created_at.desc()).limit(limit).all()
