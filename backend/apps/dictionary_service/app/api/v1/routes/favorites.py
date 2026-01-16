from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.session import get_db
from apps.dictionary_service.app.services.favorite_service import FavoriteService
from apps.dictionary_service.app.api.v1.deps import get_current_user_id
from apps.dictionary_service.app.schemas.favorite import FavoriteOut

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=List[FavoriteOut])
async def get_favorites(
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id),
    limit: int = Query(default=100, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    service = FavoriteService(db)
    favorites = service.get_user_favorites(user_id, limit, offset)
    return [
        FavoriteOut(term_id=fav.term_id, created_at=fav.created_at.isoformat())
        for fav in favorites
    ]


@router.post("/{term_id}", status_code=201)
async def add_favorite(
    term_id: int,
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id)
):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    service = FavoriteService(db)
    service.add_favorite(user_id, term_id)
    return {"message": "Added to favorites"}


@router.delete("/{term_id}", status_code=204)
async def remove_favorite(
    term_id: int,
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id)
):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    service = FavoriteService(db)
    service.remove_favorite(user_id, term_id)
