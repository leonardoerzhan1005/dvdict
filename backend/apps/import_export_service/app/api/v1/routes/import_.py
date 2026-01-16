from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from apps.import_export_service.app.db.session import get_db
from apps.import_export_service.app.services.import_service import ImportService
from apps.import_export_service.app.schemas.import_export import ImportStartResponse, ImportStatusResponse
from apps.import_export_service.app.repositories.import_repo import ImportRepository
from apps.import_export_service.app.db.models.import_row_error import ImportRowError
from apps.import_export_service.app.api.v1.deps import get_current_user_id

router = APIRouter(prefix="/import", tags=["import"])


@router.post("", response_model=ImportStartResponse, status_code=201)
async def import_data(
    file: UploadFile = File(...),
    format: str = Form(...),
    mode: str = Form(default="tolerant"),
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id)
):
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    if format not in ["csv", "json", "xlsx"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported format")
    
    content = await file.read()
    service = ImportService(db)
    job_id = service.start_import(user_id, content, format, mode)
    
    return ImportStartResponse(job_id=job_id, status="pending")


@router.get("/{job_id}", response_model=ImportStatusResponse)
async def get_import_status(
    job_id: str,
    db: Session = Depends(get_db)
):
    repo = ImportRepository(db)
    job = repo.get_job(job_id)
    
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    
    errors = [
        {"row_number": e.row_number, "field": e.field, "message": e.message}
        for e in db.query(ImportRowError).filter(ImportRowError.job_id == job_id).all()
    ]
    
    return ImportStatusResponse(
        job_id=job.job_id,
        status=job.status.value,
        imported=job.imported,
        failed=job.failed,
        errors=errors
    )
