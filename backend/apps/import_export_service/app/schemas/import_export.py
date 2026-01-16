from pydantic import BaseModel, Field


class ImportStartResponse(BaseModel):
    job_id: str
    status: str


class ImportErrorRow(BaseModel):
    row_number: int
    field: str
    message: str
    
    class Config:
        from_attributes = True


class ImportStatusResponse(BaseModel):
    job_id: str
    status: str
    imported: int
    failed: int
    errors: list[ImportErrorRow] = Field(default_factory=list)
    
    class Config:
        from_attributes = True


class ExportResponse(BaseModel):
    format: str
    url: str
