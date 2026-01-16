from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from apps.admin_service.app.db.session import get_db
from apps.admin_service.app.repositories.audit_repo import AuditRepository
from apps.admin_service.app.schemas.admin import AuditLogOut
from apps.admin_service.app.api.v1.deps import get_current_user_role
from libs.shared.shared.security.roles import Role
from apps.admin_service.app.core.rbac import require_role

router = APIRouter(prefix="/audits", tags=["audits"])


@router.get("", response_model=list[AuditLogOut])
async def get_audits(
    actor_id: Optional[int] = Query(default=None),
    entity_type: Optional[str] = Query(default=None),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
    user_role: Optional[str] = Depends(get_current_user_role)
):
    if not user_role:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    require_role(user_role, [Role.admin])
    
    repo = AuditRepository(db)
    audits = repo.get_all(actor_id=actor_id, entity_type=entity_type, limit=limit, offset=offset)
    return [AuditLogOut.model_validate(a) for a in audits]
