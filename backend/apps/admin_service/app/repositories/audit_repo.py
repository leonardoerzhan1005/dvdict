from typing import List, Optional
from sqlalchemy.orm import Session
from apps.admin_service.app.db.models.admin_audit import AdminAudit
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
    ) -> AdminAudit:
        audit = AdminAudit(
            actor_id=actor_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata_json=json.dumps(metadata) if metadata else None
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(audit)
        return audit
    
    def get_all(
        self,
        actor_id: Optional[int] = None,
        entity_type: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[AdminAudit]:
        query = self.db.query(AdminAudit)
        
        if actor_id:
            query = query.filter(AdminAudit.actor_id == actor_id)
        
        if entity_type:
            query = query.filter(AdminAudit.entity_type == entity_type)
        
        return query.order_by(AdminAudit.created_at.desc()).offset(offset).limit(limit).all()
