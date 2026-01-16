from typing import Optional
from sqlalchemy.orm import Session
from apps.search_service.app.repositories.search_repo import SearchRepository
from apps.search_service.app.repositories.history_repo import HistoryRepository
from apps.search_service.app.schemas.search import SearchHit, SearchRequestParams
from libs.shared.shared.dto.pagination import PageResponse, PageMeta


class SearchService:
    def __init__(self, db: Session):
        self.search_repo = SearchRepository(db)
        self.history_repo = HistoryRepository(db)
        self.db = db
    
    def search(
        self,
        params: SearchRequestParams,
        user_id: Optional[int] = None
    ) -> PageResponse:
        offset = (params.page - 1) * params.size
        
        results = self.search_repo.search(
            query=params.q,
            language=params.lang.value,
            category_id=params.filters.category_id,
            letter=params.filters.letter,
            status=params.filters.status,
            limit=params.size,
            offset=offset
        )
        
        hits = [
            SearchHit(
                term_id=r["term_id"],
                slug=str(r["term_id"]),
                title=r["title"],
                short_definition=r.get("short_definition"),
                category_id=r.get("category_id", 0),
                rank=float(r.get("rank", 0.0))
            )
            for r in results
        ]
        
        total = len(results)
        pages = (total + params.size - 1) // params.size if total > 0 else 0
        
        self.history_repo.create(
            user_id=user_id,
            query=params.q,
            lang=params.lang.value,
            filters=params.filters.model_dump()
        )
        
        return PageResponse(
            meta=PageMeta(
                page=params.page,
                size=params.size,
                total=total,
                pages=pages
            ),
            items=hits
        )
