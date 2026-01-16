from typing import Optional
from sqlalchemy.orm import Session
from apps.import_export_service.app.db.models.import_job import ImportJob, ImportStatus
from apps.import_export_service.app.db.models.import_row_error import ImportRowError


class ImportRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_job(self, job_id: str, user_id: int, format: str, status: str) -> ImportJob:
        job = ImportJob(
            job_id=job_id,
            user_id=user_id,
            format=format,
            status=ImportStatus(status)
        )
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def get_job(self, job_id: str) -> Optional[ImportJob]:
        return self.db.query(ImportJob).filter(ImportJob.job_id == job_id).first()
    
    def update_job(self, job_id: str, **kwargs) -> None:
        job = self.get_job(job_id)
        if job:
            for key, value in kwargs.items():
                if hasattr(job, key):
                    setattr(job, key, value)
            self.db.commit()
    
    def add_error(self, job_id: str, row_number: int, field: str, message: str) -> None:
        error = ImportRowError(
            job_id=job_id,
            row_number=row_number,
            field=field,
            message=message
        )
        self.db.add(error)
        self.db.commit()
