from sqlalchemy.orm import Session
from apps.dictionary_service.app.repositories.suggestion_repo import SuggestionRepository
from apps.dictionary_service.app.repositories.term_repo import TermRepository
from apps.dictionary_service.app.repositories.category_repo import CategoryRepository
from apps.dictionary_service.app.db.models.term_suggestion import SuggestionStatus
from apps.dictionary_service.app.schemas.suggestion import SuggestionCreateRequest
from libs.shared.shared.errors.exceptions import NotFoundError


class SuggestionService:
    def __init__(self, db: Session):
        self.suggestion_repo = SuggestionRepository(db)
        self.term_repo = TermRepository(db)
        self.category_repo = CategoryRepository(db)
        self.db = db
    
    def create_suggestion(self, user_id: int, data: SuggestionCreateRequest) -> None:
        if data.category_id:
            category = self.category_repo.get_by_id(data.category_id)
            if not category:
                raise NotFoundError("Category", str(data.category_id))
        
        self.suggestion_repo.create(
            user_id=user_id,
            language=data.language.value,
            term_text=data.term_text,
            category_id=data.category_id,
            definition=data.definition
        )
    
    def approve_suggestion(self, suggestion_id: int) -> None:
        suggestion = self.suggestion_repo.get_by_id(suggestion_id)
        if not suggestion:
            raise NotFoundError("Suggestion", str(suggestion_id))
        
        self.suggestion_repo.update(suggestion, status=SuggestionStatus.approved)
    
    def reject_suggestion(self, suggestion_id: int, reason: str) -> None:
        suggestion = self.suggestion_repo.get_by_id(suggestion_id)
        if not suggestion:
            raise NotFoundError("Suggestion", str(suggestion_id))
        
        self.suggestion_repo.update(
            suggestion,
            status=SuggestionStatus.rejected,
            moderator_comment=reason
        )
