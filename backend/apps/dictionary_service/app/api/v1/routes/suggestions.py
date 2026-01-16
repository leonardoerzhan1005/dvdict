from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.session import get_db
from apps.dictionary_service.app.services.suggestion_service import SuggestionService
from apps.dictionary_service.app.schemas.suggestion import (
    SuggestionCreateRequest,
    SuggestionOut,
    RejectRequest
)
from apps.dictionary_service.app.api.v1.deps import get_current_user_id, get_current_user_role
from libs.shared.shared.security.roles import Role
from apps.dictionary_service.app.core.rbac import require_role

router = APIRouter(prefix="/suggestions", tags=["suggestions"])


@router.post("", status_code=201)
async def create_suggestion(
    data: SuggestionCreateRequest,
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id)
):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    service = SuggestionService(db)
    service.create_suggestion(user_id, data)
    return {"message": "Suggestion created"}


@router.get("", response_model=list[SuggestionOut])
async def get_suggestions(
    db: Session = Depends(get_db),
    user_role: Optional[str] = Depends(get_current_user_role)
):
    if not user_role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    require_role(user_role, [Role.admin, Role.editor, Role.moderator])
    
    service = SuggestionService(db)
    suggestions = service.suggestion_repo.get_all()
    return [SuggestionOut.model_validate(s) for s in suggestions]


@router.post("/{suggestion_id}/approve")
async def approve_suggestion(
    suggestion_id: int,
    db: Session = Depends(get_db),
    user_role: Optional[str] = Depends(get_current_user_role)
):
    if not user_role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    require_role(user_role, [Role.admin, Role.editor, Role.moderator])
    
    service = SuggestionService(db)
    service.approve_suggestion(suggestion_id)
    return {"message": "Suggestion approved"}


@router.post("/{suggestion_id}/reject")
async def reject_suggestion(
    suggestion_id: int,
    data: RejectRequest,
    db: Session = Depends(get_db),
    user_role: Optional[str] = Depends(get_current_user_role)
):
    if not user_role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    require_role(user_role, [Role.admin, Role.editor, Role.moderator])
    
    service = SuggestionService(db)
    service.reject_suggestion(suggestion_id, data.reason)
    return {"message": "Suggestion rejected"}
