from sqlalchemy import Column, Integer, String, ForeignKey, Text
from apps.import_export_service.app.db.base import Base


class ImportRowError(Base):
    __tablename__ = "import_row_errors"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String(100), ForeignKey("import_jobs.job_id"), nullable=False)
    row_number = Column(Integer, nullable=False)
    field = Column(String(100), nullable=True)
    message = Column(Text, nullable=False)
