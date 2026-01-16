from typing import Optional
from pydantic import BaseModel


class AuditLogOut(BaseModel):
    id: int
    actor_id: int
    action: str
    entity_type: str
    entity_id: Optional[int]
    metadata_json: Optional[str]
    created_at: str
    
    class Config:
        from_attributes = True
