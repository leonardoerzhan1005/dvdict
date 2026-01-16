from typing import Dict, Any
from sqlalchemy.orm import Session


class DedupeService:
    def __init__(self, db: Session):
        self.db = db
    
    def is_duplicate(self, row: Dict[str, Any]) -> bool:
        return False
