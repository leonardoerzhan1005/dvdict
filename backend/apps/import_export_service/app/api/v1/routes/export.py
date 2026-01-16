from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session
from apps.import_export_service.app.db.session import get_db
from apps.import_export_service.app.services.export_service import ExportService
from apps.import_export_service.app.schemas.import_export import ExportResponse
from apps.import_export_service.app.api.v1.deps import get_current_user_id, get_current_user_role
from libs.shared.shared.security.roles import Role
from apps.import_export_service.app.core.rbac import require_role

router = APIRouter(prefix="/export", tags=["export"])


@router.get("")
async def export_data(
    format: str = Query(..., pattern="^(csv|json)$"),
    lang: Optional[str] = Query(default=None),
    category_id: Optional[int] = Query(default=None),
    status: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    user_role: Optional[str] = Depends(get_current_user_role)
):
    if not user_role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    require_role(user_role, [Role.admin, Role.editor])
    
    service = ExportService(db)
    content = service.export_terms(format, lang, category_id, status)
    
    media_type = "text/csv" if format == "csv" else "application/json"
    filename = f"export.{format}"
    
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
