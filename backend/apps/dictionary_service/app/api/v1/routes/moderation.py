from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.session import get_db
from apps.dictionary_service.app.services.moderation_service import ModerationService
from apps.dictionary_service.app.schemas.moderation import RejectRequest
from apps.dictionary_service.app.api.v1.deps import get_current_user_role
from libs.shared.shared.security.roles import Role
from apps.dictionary_service.app.core.rbac import require_role

router = APIRouter(prefix="/terms", tags=["moderation"])


@router.post("/{term_id}/approve")
async def approve_term(
    term_id: int,
    db: Session = Depends(get_db),
    user_role: Optional[str] = Depends(get_current_user_role)
):
    if not user_role:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    require_role(user_role, [Role.admin, Role.moderator])
    
    service = ModerationService(db)
    service.approve_term(term_id)
    return {"message": "Term approved"}


@router.post("/{term_id}/reject")
async def reject_term(
    term_id: int,
    data: RejectRequest,
    db: Session = Depends(get_db),
    user_role: Optional[str] = Depends(get_current_user_role)
):
    if not user_role:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    require_role(user_role, [Role.admin, Role.moderator])
    
    service = ModerationService(db)
    service.reject_term(term_id, data.reason)
    return {"message": "Term rejected"}
