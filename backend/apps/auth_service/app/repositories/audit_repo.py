from typing import Optional
from sqlalchemy.orm import Session
from apps.auth_service.app.db.models.audit_log import AuditLog
import json


class AuditRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        actor_id: int,
        action: str,
        entity_type: str,
        entity_id: Optional[int] = None,
        metadata: Optional[dict] = None
    ) -> AuditLog:
        audit_log = AuditLog(
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata_json=json.dumps(metadata) if metadata else None
        )
        self.db.add(audit_log)
        self.db.commit()
        self.db.refresh(audit_log)
        return audit_log
