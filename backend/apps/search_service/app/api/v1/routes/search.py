from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from apps.search_service.app.db.session import get_db
from apps.search_service.app.services.search_service import SearchService
from apps.search_service.app.services.autocomplete_service import AutocompleteService
from apps.search_service.app.schemas.search import (
    SearchRequestParams,
    SearchFilters,
    AutocompleteHit
)
from libs.shared.shared.dto.language import Lang
from libs.shared.shared.dto.filters import TermSort
from libs.shared.shared.dto.pagination import PageResponse

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=PageResponse)
async def search(
    q: str = Query(..., min_length=1, max_length=200),
    lang: Lang = Query(default=Lang.ru),
    category_id: Optional[int] = Query(default=None),
    letter: Optional[str] = Query(default=None, min_length=1, max_length=1),
    status: Optional[str] = Query(default=None),
    sort: TermSort = Query(default=TermSort.popularity),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    user_id: Optional[int] = None
):
    params = SearchRequestParams(
        q=q,
        lang=lang,
        filters=SearchFilters(
            category_id=category_id,
            letter=letter,
            status=status
        ),
        sort=sort,
        page=page,
        size=size
    )
    
    service = SearchService(db)
    return service.search(params, user_id)


@router.get("/autocomplete", response_model=list[AutocompleteHit])
async def autocomplete(
    q: str = Query(..., min_length=1),
    lang: Lang = Query(default=Lang.ru),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    service = AutocompleteService(db)
    return service.autocomplete(q, lang, limit)
