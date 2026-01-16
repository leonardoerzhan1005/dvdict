from apps.dictionary_service.app.db.models.category import Category
from apps.dictionary_service.app.db.models.category_translation import CategoryTranslation
from apps.dictionary_service.app.db.models.term import Term
from apps.dictionary_service.app.db.models.term_translation import TermTranslation
from apps.dictionary_service.app.db.models.tag import Tag
from apps.dictionary_service.app.db.models.term_tag import TermTag
from apps.dictionary_service.app.db.models.favorite import Favorite
from apps.dictionary_service.app.db.models.term_revision import TermRevision
from apps.dictionary_service.app.db.models.term_suggestion import TermSuggestion

__all__ = [
    "Category",
    "CategoryTranslation",
    "Term",
    "TermTranslation",
    "Tag",
    "TermTag",
    "Favorite",
    "TermRevision",
    "TermSuggestion"
]
