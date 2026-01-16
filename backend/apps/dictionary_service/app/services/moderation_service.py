from sqlalchemy.orm import Session
from apps.dictionary_service.app.repositories.term_repo import TermRepository
from apps.dictionary_service.app.db.models.term import TermStatus
from libs.shared.shared.errors.exceptions import NotFoundError, ConflictError


class ModerationService:
    def __init__(self, db: Session):
        self.term_repo = TermRepository(db)
        self.db = db
    
    def approve_term(self, term_id: int) -> None:
        term = self.term_repo.get_by_id(term_id)
        if not term:
            raise NotFoundError("Term", str(term_id))
        
        if term.status != TermStatus.pending:
            raise ConflictError("Only pending terms can be approved")
        
        self.term_repo.update(term, status=TermStatus.approved)
    
    def reject_term(self, term_id: int, reason: str) -> None:
        term = self.term_repo.get_by_id(term_id)
        if not term:
            raise NotFoundError("Term", str(term_id))
        
        if term.status != TermStatus.pending:
            raise ConflictError("Only pending terms can be rejected")
        
        self.term_repo.update(term, status=TermStatus.rejected)
