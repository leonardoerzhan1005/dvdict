from typing import Dict, Any
from sqlalchemy.orm import Session
from libs.shared.shared.utils.slug import validate_slug


class ValidationService:
    def __init__(self, db: Session):
        self.db = db
    
    def validate_row(self, row: Dict[str, Any]) -> Dict[str, Any]:
        required_fields = ["slug", "title", "definition", "language"]
        
        for field in required_fields:
            if field not in row or not row[field]:
                raise ValueError(f"Missing required field: {field}")
        
        if not validate_slug(row["slug"]):
            raise ValueError(f"Invalid slug: {row['slug']}")
        
        if row["language"] not in ["kz", "ru", "en"]:
            raise ValueError(f"Invalid language: {row['language']}")
        
        return row
