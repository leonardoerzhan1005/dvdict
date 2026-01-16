from sqlalchemy.orm import Session
from apps.search_service.app.repositories.search_repo import SearchRepository
from apps.search_service.app.schemas.search import AutocompleteHit
from libs.shared.shared.dto.language import Lang


class AutocompleteService:
    def __init__(self, db: Session):
        self.search_repo = SearchRepository(db)
        self.db = db
    
    def autocomplete(self, query: str, lang: Lang, limit: int = 10) -> list[AutocompleteHit]:
        results = self.search_repo.autocomplete(
            query=query,
            language=lang.value,
            limit=limit
        )
        
        return [
            AutocompleteHit(
                term_id=r["term_id"],
                slug=str(r["term_id"]),
                title=r["title"]
            )
            for r in results
        ]
