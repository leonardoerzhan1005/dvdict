import csv
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from io import StringIO


class ExportService:
    def __init__(self, db: Session):
        self.db = db
    
    def export_terms(
        self,
        format: str,
        lang: Optional[str] = None,
        category_id: Optional[int] = None,
        status: Optional[str] = None
    ) -> str:
        terms = self._fetch_terms(lang, category_id, status)
        
        if format == "csv":
            return self._export_csv(terms)
        elif format == "json":
            return self._export_json(terms)
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def _fetch_terms(
        self,
        lang: Optional[str],
        category_id: Optional[int],
        status: Optional[str]
    ) -> List[Dict[str, Any]]:
        return []
    
    def _export_csv(self, terms: List[Dict[str, Any]]) -> str:
        if not terms:
            return ""
        
        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=terms[0].keys())
        writer.writeheader()
        writer.writerows(terms)
        return output.getvalue()
    
    def _export_json(self, terms: List[Dict[str, Any]]) -> str:
        return json.dumps(terms, ensure_ascii=False, indent=2)
