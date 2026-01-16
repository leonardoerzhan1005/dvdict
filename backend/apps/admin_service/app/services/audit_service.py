from typing import Optional
from sqlalchemy.orm import Session
from apps.admin_service.app.repositories.audit_repo import AuditRepository


class AuditService:
    def __init__(self, db: Session):
        self.audit_repo = AuditRepository(db)
        self.db = db
    
    def log_action(
        self,
        actor_id: int,
        action: str,
        entity_type: str,
        entity_id: Optional[int] = None,
        metadata: Optional[dict] = None
    ) -> None:
        self.audit_repo.create(
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata=metadata
        )
